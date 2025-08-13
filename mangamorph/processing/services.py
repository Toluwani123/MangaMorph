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
from google.cloud.vision_v1.types import TextAnnotation as TA

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

    def _verts_to_box(self, vertices):
        x_coords = [v.x for v in vertices]
        y_coords = [v.y for v in vertices]
        left, top = int(min(x_coords)), int(min(y_coords))
        right, bottom = int(max(x_coords)), int(max(y_coords))
        width = int(max(1, right - left))
        height = int(max(1, bottom - top))
        return {
            'x': left,
            'y': top,
            'width': width,
            'height': height
        }
    
    def _paragraph_text_and_conf(self, paragraph):
        space = {TA.DetectedBreak.BreakType.SPACE, TA.DetectedBreak.BreakType.EOL_SURE_SPACE}
        line = TA.DetectedBreak.BreakType.LINE_BREAK

        pieces, confidences = [], []
        for word in paragraph.words:
            for sym in word.symbols:
                pieces.append(sym.text)
                br = getattr(sym.property, "detected_break", None)
                if br and br.type_ in space:
                    pieces.append(" ")
                elif br and br.type_ == line:
                    pieces.append("\n")
                if hasattr(sym, "confidence"):
                    confidences.append(sym.confidence)

        text = ''.join(pieces).strip()
        conf = sum(confidences) / len(confidences) if confidences else 0.9
        return text, conf
    
    def detect_text(self, image_bytes):
        img = vision.Image(content=image_bytes)
        ctx = vision.ImageContext(language_hints=['ja'])
        response = self.client.document_text_detection(image=img, image_context=ctx)
        if response.error.message:
            raise RuntimeError(response.error.message)
        
        blocks =[]
        ann = response.full_text_annotation
        for page in ann.pages:
            for block in page.blocks:
                for para in block.paragraphs:
                    text,conf = self._paragraph_text_and_conf(para)
                    if not text:
                        continue
                    bbox = self._verts_to_box(para.bounding_box.vertices)
                    blocks.append({
                        'bounding_box': bbox,
                        'original_text': text,
                        'confidence_score': conf
                    })
        return blocks

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

    def _merge_nearby(self, blocks, iou=0.20, gap_px=20):
        """Heuristic merge to avoid multiple fragments per balloon."""
        # Convert % back to px using width/height if you prefer; or compute IoU on %.
        def rect(b):
            return (b["x"], b["y"], b["x"]+b["width"], b["y"]+b["height"])

        merged = []
        for b in sorted(blocks, key=lambda x: (x["y"], x["x"])):
            placed = False
            for m in merged:
                # simple overlap / proximity test in percentage space
                ax1, ay1, ax2, ay2 = rect(b); bx1, by1, bx2, by2 = rect(m)
                inter_w = max(0, min(ax2, bx2) - max(ax1, bx1))
                inter_h = max(0, min(ay2, by2) - max(ay1, by1))
                inter = inter_w * inter_h
                area_a = (ax2-ax1)*(ay2-ay1); area_b = (bx2-bx1)*(by2-by1)
                iou_val = inter / (area_a + area_b - inter) if (area_a+area_b-inter) else 0

                close_vertically = abs((ay1+ay2)/2 - (by1+by2)/2) < 5  # 5% height
                if iou_val >= iou or close_vertically:
                    # merge text with newline; expand box
                    m["original_text"] = (m["original_text"] + "\n" + b["original_text"]).strip()
                    m["translated_text"] = (m["translated_text"] + "\n" + b["translated_text"]).strip()
                    m["x"] = min(m["x"], b["x"])
                    m["y"] = min(m["y"], b["y"])
                    m["width"] = max(m["x"]+m["width"], b["x"]+b["width"]) - m["x"]
                    m["height"] = max(m["y"]+m["height"], b["y"]+b["height"]) - m["y"]
                    placed = True
                    break
            if not placed:
                merged.append(dict(b))
        return merged


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

            return self._merge_nearby(processed_text_blocks)
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
