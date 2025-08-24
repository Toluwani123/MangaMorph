from rest_framework import serializers
from .models import *

class TextBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextBlock
        fields = '__all__'
        read_only_fields = ('id', 'page', 'created_at', 'updated_at')

# ...existing code...
class PageSerializer(serializers.ModelSerializer):
    text_blocks = TextBlockSerializer(many=True, read_only=True)
    original_image = serializers.SerializerMethodField()
    processed_image = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = (
            'id', 'chapter', 'page_number', 'width', 'height',
            'created_at',
            'original_image', 'processed_image',
            'text_blocks',
        )
        read_only_fields = ('id', 'chapter', 'created_at', 'updated_at', 'text_blocks')

    def _abs(self, url: str):
        if not url:
            return None
        if url.startswith("http://") or url.startswith("https://"):
            return url
        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url

    def _url_or_none(self, fieldfile):
        try:
            if not fieldfile:
                return None
            # Use storage.url(name) to generate a fresh (pre‑signed) URL on S3
            url = fieldfile.storage.url(fieldfile.name)
            return self._abs(url)
        except Exception:
            return None

    def get_original_image(self, obj):
        return self._url_or_none(getattr(obj, "original_image", None))

    def get_processed_image(self, obj):
        return self._url_or_none(getattr(obj, "processed_image", None))
# ...existing code...

class ChapterSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChapterSettings
        fields = '__all__'
        read_only_fields = ('id', 'chapter')

class ChapterSerializer(serializers.ModelSerializer):
    total_pages = serializers.SerializerMethodField()
    settings = ChapterSettingsSerializer(read_only=True)

    class Meta:
        model = Chapter
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'user', 'total_pages', 'processed_at', 'status', 'settings')

    def get_total_pages(self, obj):
        return obj.total_pages

class ChapterDetailSerializer(serializers.ModelSerializer):
    pages = PageSerializer(many=True, read_only=True)
    settings = ChapterSettingsSerializer(read_only=True)
    total_pages = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'user', 'total_pages', 'settings')

    def get_total_pages(self, obj):
        return obj.total_pages  
        

class ChapterCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ('title', 'description', 'source_language', "target_language", 'original_file')
        read_only_fields = ('user',)

    def validate_original_file(self, value):
        if value:
            if value.size > 250 * 1024 * 1024:  # 250 MB limit
                raise serializers.ValidationError("File size exceeds 250 MB limit.")
            
            allowed_extensions = ['.zip', '.cbz']
            if not any(value.name.lower().endswith(ext) for ext in allowed_extensions):
                raise serializers.ValidationError("Unsupported file format. Only .zip and .cbz files are allowed.")

        return value


