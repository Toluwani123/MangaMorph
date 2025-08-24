from django.urls import path
from . import views


urlpatterns = [
    
    path('task-status/<str:task_id>/', views.task_status, name='task_status'),
    path('project-status/<int:chapter_id>/', views.project_status, name='project_status'),
]