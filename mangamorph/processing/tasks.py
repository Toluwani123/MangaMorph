from celery import shared_task
from django.utils import timezone
from chapters.models import Chapter, Page, TextBlock
from .services import MangaProcessingService
import logging
import tempfile
import os
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)

@shared_task
def process_manga_file(self, chapter_id):
    try:
        chapter = Chapter.objects.get(id=chapter_id)
        chapter.status = 'processing'
        chapter.save()

        self.update_state(state='PROGRESS', meta={'status': 'Processing manga file...'})

        processor = MangaProcessingService()
        with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as temp_zip:
            chapter.original_file.seek(0)
            temp_zip.write(chapter.original_file.read())
            temp_zip_path = temp_zip.name

            try:
                self.update_state(state='PROGRESS', meta={'status': 'Extracting manga file...'})
                images = processor.extract_images_from_zip(temp_zip_path)
                if not images:
                    raise Exception("No images found in the manga file.")
                total_pages = len(images)

                if images:
                    thumbnail_content = processor.generate_thumbnail(images[0]['content'])
                    if thumbnail_content:
                        chapter.thumbnail.save(f"{chapter.title}_thumbnail.jpg", ContentFile(thumbnail_content), save=True)
                        
                for index, image in enumerate(images):
                    progress = 20+(index/total_pages)*70
                    self.update_state(state='PROGRESS', meta={'status': f'Processing page {index + 1}/{total_pages}', 'progress': progress})
                    page = Page.objects.create(
                        chapter=chapter,
                        page_number=image['page_number'],
                        width=image['width'],
                        height=image['height']
                    )
                    page.original_image.save(f"page_{chapter.id}_{image['page_number']}.jpg", ContentFile(image['content']), save=True)

                    try:
                        text_blocks = processor.process_page_text(image['content'], image['width'], image['height'])
                        for block in text_blocks:
                            TextBlock.objects.create(
                                page=page,
                                **block
                            )
                    except Exception as e:
                        logger.error(f"Error processing text for page {image['page_number']}: {e}")
                        continue

                self.update_state(state='PROGRESS', meta={'status': 'Finalizing chapter processing...'})
                chapter.status = 'ready'
                chapter.processed_at = timezone.now()
                chapter.save()
                self.update_state(state='SUCCESS', meta={'status': 'Manga processing completed successfully.'})

                return {
                    'status': 'success',
                    'chapter_id': chapter.id,
                    'total_pages': total_pages,
                    'message': 'Manga processing completed successfully.'
                }
            finally:
                if os.path.exists(temp_zip_path):
                    os.unlink(temp_zip_path)

    except Chapter.DoesNotExist:
        logger.error(f"Chapter with id {chapter_id} does not exist.")
        return {'status': 'error', 'message': 'Chapter not found.'}
    except Exception as e:
        logger.error(f"Error processing manga file for chapter {chapter_id}: {e}")
        try:
            chapter = Chapter.objects.get(id=chapter_id)
            chapter.status = 'error'
            chapter.save()
        except:
            pass

        self.update_state(state='FAILURE', meta={'status': 'Manga processing failed.'})
        return {'status': 'error', 'message': str(e)}

