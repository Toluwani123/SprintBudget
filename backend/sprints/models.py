from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta, date


User = get_user_model()




class Sprint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sprints')

    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    budget_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    rollover_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    remaining_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']
        unique_together = ('user', 'start_date')

    

    def __str__(self):
        return f"{self.name} ({self.user.email} - {self.start_date} to {self.end_date})"
    
    def calculate_totals(self):

        from transactions.models import Transaction

        transactions = Transaction.objects.filter(
            user=self.user,
            date__date__range=[self.start_date, self.end_date],
            transaction_type='expense'
        )

        self.total_spent = sum(t.amount for t in transactions)
        self.remaining_budget = self.budget_amount + self.rollover_amount - self.total_spent
        self.save()

class SprintAlert(models.Model):
    ALERT_TYPES = (
        ('75_percent', '75% Budget Used'),
        ('90_percent', '90% Budget Used'),
        ('100_percent', 'Budget Exceeded'),
        ('large_transaction', 'Large Transaction'),
        ('sprint_completed', 'Sprint Completed'),
        ('sprint_started', 'Sprint Started'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sprint_alerts')
    sprint = models.ForeignKey(Sprint, on_delete=models.CASCADE, related_name='alerts')

    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES)  # e.g., 'budget_exceeded', 'sprint_completed'
    message = models.TextField()
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'sprint', 'alert_type')

    def __str__(self):
        return f"{self.alert_type} - {self.sprint.name} ({self.user.email})"