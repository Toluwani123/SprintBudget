from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

celery_app = Celery('backend')
celery_app.config_from_object('django.conf:settings', namespace='CELERY')
celery_app.autodiscover_tasks()

@celery_app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


from celery.schedules import crontab

celery_app.conf.beat_schedule = {
    'sync_all_plaid_integrations': {
        'task': 'integrations.functions.sync_all_plaid_integrations',
        'schedule': crontab(minute='*/15'),  # every 15 minutes
    },
}
celery_app.conf.timezone = 'UTC'

# Optional: If you want to use periodic tasks, you can include the following line
# celery_app.conf.beat_schedule = {
#     'task-name': {
#         'task': 'app.tasks.task_name',
#         'schedule': crontab(minute='*/1'),  # every minute
#     },
# }