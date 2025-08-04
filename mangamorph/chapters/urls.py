from django.urls import path
from . import views

urlpatterns = [
    path('', views.ChapterListCreateView.as_view(), name='chapter_list_create'),
    path('<uuid:pk>/', views.ChapterDetailView.as_view(), name='chapter_detail'),
    path('<uuid:chapter_id>/settings/', views.ChapterSettingsView.as_view(), name='chapter_settings'),

    path('<uuid:chapter_id>/pages/', views.PageListView.as_view(), name='page_list'),
    path('<uuid:chapter_id>/pages/<int:pk>/', views.PageDetailView.as_view(), name='page_detail'),

    path('<uuid:chapter_id>/pages/<int:page_id>/text_blocks/', views.TextBlockListView.as_view(), name='text_block_list'),
    path('<uuid:chapter_id>/pages/<int:page_id>/text_blocks/<int:pk>/', views.TextBlockDetailView.as_view(), name='text_block_detail'),
]