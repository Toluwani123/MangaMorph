from rest_framework import serializers
from .models import *

class TextBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextBlock
        fields = '__all__'
        read_only_fields = ('id', 'page', 'created_at', 'updated_at')

class PageSerializer(serializers.ModelSerializer):
    text_blocks = TextBlockSerializer(many=True, read_only=True)

    class Meta:
        model = Page
        fields = '__all__'
        read_only_fields = ('id', 'chapter', 'created_at', 'text_blocks')

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


