from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal
from django.utils import timezone

# Create your models here.


User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name
    
class Transaction(models.Model):

    TRANSACTION_TYPES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPES, default='expense')
    date = models.DateTimeField(default=timezone.now)

    plaid_transaction_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    plaid_account_id = models.CharField(max_length=255, blank=True, null=True)
    merchant_name = models.CharField(max_length=255, blank=True, null=True)


    ai_confidence = models.FloatField(null=True, blank=True)
    is_ai_categorized = models.BooleanField(default=False)

    is_recurring = models.BooleanField(default=False)
    is_essential = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.category.name} - {self.amount}"