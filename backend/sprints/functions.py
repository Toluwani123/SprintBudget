from celery import shared_task
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta, date
from .models import *
from transactions.models import Transaction


User = get_user_model()

@shared_task(name="core.debug_hello")
def debug_hello(who="world"):
    return f"Hello, {who}!"


@shared_task
def create_sprint(user_id, rollover_amount=0):
    try:
        user = User.objects.get(id=user_id)
        today = date.today()
        days_since_start = (today.weekday() - 0) % 7
        week_start = today - timedelta(days=days_since_start)
        week_end = week_start + timedelta(days=6)

        if Sprint.objects.filter(user=user, start_date=week_start).exists():
            return 
        
        Sprint.objects.filter(user=user, is_active=True).update(is_active=False)
        sprint = Sprint.objects.create(
            user=user,
            name=f"Weekly Sprint {week_start.strftime('%Y-%m-%d')} - {week_end.strftime('%Y-%m-%d')}",
            start_date=week_start,
            end_date=week_end,
            budget_amount=user.weekly_budget,
            rollover_amount=rollover_amount,
            is_active=True
        )
        

    except Exception as e:
        print(f"Error creating sprint: {e}")
        return
    
def create_budget_alert(sprint, alert_type, message):
    """Create a budget alert"""
    SprintAlert.objects.create(
        user=sprint.user,
        sprint=sprint,
        alert_type=alert_type,
        message=message
    )
    

@shared_task
def check_budget_alerts():
    """Check all active sprints for budget alerts"""
    active_sprints = Sprint.objects.filter(is_active=True)
    
    for sprint in active_sprints:
        sprint.calculate_totals()
        
        total_budget = sprint.budget_amount + sprint.rollover_amount
        if total_budget == 0:
            continue
            
        percentage = (sprint.total_spent / total_budget) * 100
        
        # Check for 75% alert
        if percentage >= 75 and not SprintAlert.objects.filter(
            user=sprint.user, sprint=sprint, alert_type='75_percent'
        ).exists():
            create_budget_alert(sprint, '75_percent', f"You've used 75% of your weekly budget")
            #send_budget_alert.delay(sprint.user.id, float(sprint.total_spent), float(total_budget))
        
        # Check for 90% alert
        if percentage >= 90 and not SprintAlert.objects.filter(
            user=sprint.user, sprint=sprint, alert_type='90_percent'
        ).exists():
            create_budget_alert(sprint, '90_percent', f"You've used 90% of your weekly budget")
            #send_budget_alert.delay(sprint.user.id, float(sprint.total_spent), float(total_budget))
        
        # Check for 100% alert
        if percentage >= 100 and not SprintAlert.objects.filter(
            user=sprint.user, sprint=sprint, alert_type='100_percent'
        ).exists():
            create_budget_alert(sprint, '100_percent', f"You've exceeded your weekly budget")
            #send_budget_alert.delay(sprint.user.id, float(sprint.total_spent), float(total_budget))
    

@shared_task
def complete_expired_sprints():
    """Mark expired sprints as completed"""
    today = date.today()
    expired_sprints = Sprint.objects.filter(
        end_date__lt=today,
        is_completed=False
    )
    
    for sprint in expired_sprints:
        sprint.is_completed = True
        sprint.is_active = False
        sprint.calculate_totals()
        sprint.save()
        
        # Create next sprint if user has rollover enabled
        if sprint.user.rollover_unspent and sprint.remaining_budget > 0:
            create_sprint.delay(sprint.user.id, float(sprint.remaining_budget))
        else:
            create_sprint.delay(sprint.user.id)

from django.utils import timezone
from django.conf import settings
from django.db.models import Sum
from decimal import Decimal
import pytz 
from datetime import timezone as dt_timezone

def get_last_spend_day_total(user, tz=None, include_transactions=False):
    if tz is None:
        tz = getattr(settings, 'TIME_ZONE', 'UTC')
        tz = pytz.timezone(tz)

    latest_txn = Transaction.objects.filter(user=user).order_by('-date').first()

    if not latest_txn:
        return None, Decimal('0.00'), None
    
    latest_local= timezone.localtime(latest_txn.date, tz)
    start_of_day = latest_local.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timezone.timedelta(days=1)

    start_of_day_utc = timezone.make_aware(start_of_day.replace(tzinfo=None), timezone=tz).astimezone(dt_timezone.utc)
    end_of_day_utc = timezone.make_aware(end_of_day.replace(tzinfo=None), timezone=tz).astimezone(dt_timezone.utc)

    day_txns = Transaction.objects.filter(
        user=user,
        transaction_type='expense',
        date__gte=start_of_day_utc,
        date__lt=end_of_day_utc
    )

    agg = day_txns.aggregate(total=Sum('amount'))
    total_spent = agg['total'] or Decimal('0.00')

    return start_of_day.date(), float(total_spent), (day_txns if include_transactions else None)
