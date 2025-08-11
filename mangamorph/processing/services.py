import os
import zipfile
import tempfile
from io import BytesIO
from PIL import Image
from google.cloud import translate_v2 as translate
from google.cloud import vision
import boto3
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.utils.translation import gettext as _
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

credential_path = getattr(settings, "GOOGLE_APPLICATION_CREDENTIALS", None) or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if credential_path:
    # Works with forward slashes or raw/backslash-safe
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credential_path
else:
    logger.warning("GOOGLE_APPLICATION_CREDENTIALS not set; Google APIs may fail.")

class GoogleVisionService:
    def __init__(self):
        self.client = vision.ImageAnnotatorClient()

    def detect_text(self, image):
        try:
            image = vision.Image(content=image)
            response = self.client.text_detection(image=image)
            if response.error.message:
                raise Exception(f"Google Vision API error: {response.error.message}")
            
            texts = response.text_annotations
            text_blocks = []

            for text in texts:
                verts = text.bounding_poly.vertices
                x_coords = [v.x for v in verts]
                y_coords = [v.y for v in verts]
                left, top = min(x_coords), min(y_coords)
                right, bottom = max(x_coords), max(y_coords)
                width = max(1, right - left)
                height = max(1, bottom - top)
                text_blocks.append({
                    'original_text': text.description,
                    'bounding_box': {
                        'x': left,
                        'y': top,
                        'width': width,
                        'height': height
                    },
                    'confidence_score': getattr(text, 'confidence', 0.9)
                })
            return text_blocks
        except Exception as e:
            logger.error(f"Error in Google Vision API: {e}")
            raise

class GoogleTranslateService:
    def __init__(self):
        self.client = translate.Client()

    def translate_text(self, text, source_language='ja', target_language='en'):
        try:
            if not text.strip():
                return ""
            result = self.client.translate(text, source_language=source_language, target_language=target_language)
            return result['translatedText']
        except Exception as e:
            logger.error(f"Error in Google Translate API: {e}")
            return text  # Fallback to original text if translation fails
        
class MangaProcessingService:
    def __init__(self):
        self.vision_service = GoogleVisionService()
        self.translate_service = GoogleTranslateService()


    def extract_images_from_zip(self, file_path):
        images = []
        try:
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                file_list = sorted([f for f in zip_ref.namelist() if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
                for i,file_name in enumerate(file_list):
                    with zip_ref.open(file_name) as file:
                        image_data = file.read()
                        try:
                            image = Image.open(BytesIO(image_data))
                            if image.mode in ('RGBA', 'P'):
                                image = image.convert('RGB')
                            output = BytesIO()
                            image.save(output, format='JPEG', quality=95)
                            processed_image = output.getvalue()
                            images.append({
                                'page_number': i + 1,
                                'filename': file_name,
                                'content': processed_image,
                                'width': image.width,
                                'height': image.height
                            })
                        except Exception as e:
                            logger.error(f"Error processing image {file_name}: {e}")

        except Exception as e:
            logger.error(f"Error extracting images from zip: {e}")
            raise
        return images
    
    def process_page_text(self, page_image, width, height):
        try:
            text_blocks = self.vision_service.detect_text(page_image)
            processed_text_blocks = []

            for block in text_blocks:
                bbox = block['bounding_box']
                x_percent = (bbox['x'] / width)*100
                y_percent = (bbox['y'] / height)*100
                width_percent = (bbox['width'] / width)*100
                height_percent = (bbox['height'] / height)*100  

                translated_text = self.translate_service.translate_text(block['original_text'])
                processed_text_blocks.append({
                    'original_text': block['original_text'],
                    'translated_text': translated_text,
                    'x': x_percent,
                    'y': y_percent,
                    'width': width_percent,
                    'height': height_percent,
                    'confidence_score': block['confidence_score']
                })

            return processed_text_blocks
        except Exception as e:
            logger.error(f"Error processing page text: {e}")
            return []
        
    def generate_thumbnail(self, image_bytes):
        try:
            img = Image.open(BytesIO(image_bytes))
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            img.thumbnail((200, 300), Image.Resampling.LANCZOS)
            output = BytesIO()
            img.save(output, format='JPEG', quality=85)
            return output.getvalue()
        except Exception as e:
            logger.error(f"Error generating thumbnail: {e}")
            return None
