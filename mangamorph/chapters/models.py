from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Chapter(models.Model):
    STATUS_CHOICES = [
        ('uploading', 'Uploading'),
        ('processing', 'Processing'),
        ('ready', 'Ready'),
        ('published', 'Published'),
        ('error', 'Error'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploading')
    source_language = models.CharField(max_length=10, default='ja')
    target_language = models.CharField(max_length=10, default='en')
    original_file = models.FileField(upload_to='uploads')
    thumbnail = models.ImageField(upload_to='thumbnails', null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    title = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
    
    @property
    def total_pages(self):
        return self.pages.count()
    
class Page(models.Model):
    chapter = models.ForeignKey(Chapter, related_name='pages', on_delete=models.CASCADE)
    original_image = models.ImageField(upload_to='pages/original')
    processed_image = models.ImageField(upload_to='pages/processed', null=True, blank=True)
    page_number = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    width = models.PositiveIntegerField(default=0)
    height = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['page_number']
        unique_together = ('chapter', 'page_number')

    def __str__(self):
        return f"Page {self.page_number} of {self.chapter.title}"
    
class TextBlock(models.Model):
    page = models.ForeignKey(Page, related_name='text_blocks', on_delete=models.CASCADE)
    original_text = models.TextField()
    translated_text = models.TextField(null=True, blank=True)
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confidence_score = models.FloatField(default=0.0)

    class Meta:
        ordering = ['y', 'x']
    def __str__(self):
        return f"TextBlock on {self.page} - {self.original_text[:50]} of {self.page.chapter.title}"

class ChapterSettings(models.Model):
    chapter = models.OneToOneField(Chapter, on_delete=models.CASCADE, related_name='settings')
    auto_translate = models.BooleanField(default=True)
    preserve_formatting = models.BooleanField(default=True)
    bubble_detection_sensitivity = models.FloatField(default=0.7)
    translation_model = models.CharField(max_length=50, default='nmt')
    
    def __str__(self):
        return f"Settings for {self.chapter.title}"


