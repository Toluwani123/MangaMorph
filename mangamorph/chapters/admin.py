from django.contrib import admin
from .models import Chapter, Page, TextBlock, ChapterSettings

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'source_language', 'target_language', 'created_at', 'processed_at')
    list_filter = ('status', 'source_language', 'target_language', 'created_at')
    search_fields = ('title', 'user__username')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('chapter', 'page_number', 'width', 'height', 'created_at')
    list_filter = ('chapter', 'created_at')
    ordering = ('chapter', 'page_number')

@admin.register(TextBlock)
class TextBlockAdmin(admin.ModelAdmin):
    list_display = ('short_text', 'page', 'chapter_title', 'x', 'y', 'width', 'height', 'confidence_score', 'created_at')
    list_filter = ('page__chapter', 'created_at')
    search_fields = ('original_text', 'page__chapter__title')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

    def short_text(self, obj):
        return (obj.original_text[:40] + '...') if len(obj.original_text) > 40 else obj.original_text
    short_text.short_description = 'Text'

    def chapter_title(self, obj):
        return obj.page.chapter.title
    chapter_title.short_description = 'Chapter'

@admin.register(ChapterSettings)
class ChapterSettingsAdmin(admin.ModelAdmin):
    list_display = ('chapter', 'auto_translate', 'preserve_formatting', 'bubble_detection_sensitivity', 'translation_model')
    search_fields = ('chapter__title',)