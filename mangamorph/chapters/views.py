from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Chapter, Page, TextBlock, ChapterSettings
from .serializers import (
    ChapterSerializer, ChapterDetailSerializer, ChapterCreateSerializer,
    PageSerializer, TextBlockSerializer, ChapterSettingsSerializer
)

class ChapterListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ChapterCreateSerializer
        return ChapterSerializer
    
    def get_queryset(self):
        return Chapter.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        chapter = serializer.save(user=self.request.user)
        ChapterSettings.objects.create(chapter=chapter)
        #process_chapter(chapter)  # Assuming you have a function to process the chapter

    
class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChapterDetailSerializer

    def get_queryset(self):
        return Chapter.objects.filter(user=self.request.user)


class ChapterSettingsView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChapterSettingsSerializer

    def get_object(self):
        chapter = get_object_or_404(Chapter, id=self.kwargs['chapter_id'], user=self.request.user)
        settings, created = ChapterSettings.objects.get_or_create(chapter=chapter)
        return settings
    
class PageListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PageSerializer

    def get_queryset(self):
        chapter = get_object_or_404(Chapter, id=self.kwargs['chapter_id'], user=self.request.user)
        return chapter.pages.all()
    
class PageDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PageSerializer

    def get_queryset(self):
        chapter = get_object_or_404(Chapter, id=self.kwargs['chapter_id'], user=self.request.user)
        return chapter.pages.all()
    

class TextBlockListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TextBlockSerializer

    def get_queryset(self):
        chapter = get_object_or_404(Chapter, id=self.kwargs['chapter_id'], user=self.request.user)
        page = get_object_or_404(Page, id=self.kwargs['page_id'], chapter=chapter)
        return page.text_blocks.all()
    
class TextBlockDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TextBlockSerializer

    def get_queryset(self):
        chapter = get_object_or_404(Chapter, id=self.kwargs['chapter_id'], user=self.request.user)
        page = get_object_or_404(Page, id=self.kwargs['page_id'], chapter=chapter)
        return page.text_blocks.all()
    
    def perform_update(self, serializer):
        text_block = serializer.save()
        # Optionally, you can add logic to process the text block after updating
        # process_text_block(text_block)  # Assuming you have a function to process the text block

