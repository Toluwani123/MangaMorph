from django.contrib import admin
from .models import Chapter, Page, TextBlock, ChapterSettings

admin.site.register(Chapter)

admin.site.register(Page)


admin.site.register(TextBlock)

admin.site.register(ChapterSettings)
