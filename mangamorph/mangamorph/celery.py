from __future__ import absolute_import, unicode_literals

import os
from celery import Celery
from datetime import timedelta

import platform

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mangamorph.settings')
celery_app = Celery('mangamorph')
celery_app.config_from_object('django.conf:settings', namespace='CELERY')
celery_app.conf.imports = [
    'processing.tasks',
]
celery_app.autodiscover_tasks()

if platform.system() == 'Windows':
    celery_app.conf.worker_pool = 'solo'
    celery_app.conf.worker_concurrency = 4

@celery_app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

from celery.schedules import crontab
celery_app.conf.beat_schedule = {
    'process_manga_files_daily': {
        'task': 'processing.tasks.process_manga_files',
        'schedule': crontab(hour=0, minute=0),  # Every day at midnight
    },
}

celery_app.conf.timezone = 'UTC'