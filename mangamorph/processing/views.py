from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from celery.result import AsyncResult
from django.shortcuts import get_object_or_404
from chapters.models import Chapter
from .tasks import process_manga_file

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_status(request, task_id):
    """
    Check the status of a Celery task.
    """
    task_result = AsyncResult(task_id)
    if task_result.state == 'PENDING':
        response = {
            'state': task_result.state,
            'status': 'Pending...'
        }
    elif task_result.state == 'PROGRESS':
        response = {
            'state': task_result.state,
            'status': task_result.info.get('status', 'Processing...'),
            'progress': task_result.info.get('progress', 0)
        }
    elif task_result.state == 'SUCCESS':
        response = {
            'state': task_result.state,
            'status': 'Completed',
            'result': task_result.result
        }
    else:
        response = {
            'state': task_result.state,
            'status': 'Failed',
            'error': task_result.info.get('error', 'Unknown error')
        }

    return Response(response, status=status.HTTP_200_OK)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_status(request, chapter_id):
    """
    Get the status of a chapter processing task.
    """
    chapter = get_object_or_404(Chapter, id=chapter_id, user=request.user)
    total_bubbles = 0
    edited_bubbles = 0
    for page in chapter.pages.all():
        total_bubbles += page.text_blocks.count()
        edited_bubbles += page.text_blocks.filter(is_edited=True).count()
    status_data = {
        'total_bubbles': total_bubbles,
        'edited_bubbles': edited_bubbles,
        'progress': (edited_bubbles / total_bubbles * 100) if total_bubbles > 0 else 0,
        'total_pages': chapter.total_pages,
        'processed_at': chapter.processed_at,
        'status': chapter.status,
        'created_at': chapter.created_at,
    }
    return Response(status_data, status=status.HTTP_200_OK)