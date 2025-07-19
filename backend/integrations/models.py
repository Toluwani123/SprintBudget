from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

# Create your models here.


class PlaidInstance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=255, blank=True, null=True)
    item_id = models.CharField(max_length=255, blank=True, null=True)
    institution_name = models.CharField(max_length=255, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    last_synced = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.institution_name}'s Plaid Instance"
    

class PlaidAccount(models.Model):

    ACCOUNT_TYPES = [
        ('savings', 'Savings'),
        ('credit', 'Credit Card'),
        ('investment', 'Investment'),
        ('checking', 'Checking'),
    ]
    plaid_instance = models.ForeignKey(PlaidInstance, on_delete=models.CASCADE, related_name='accounts')
    account_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=ACCOUNT_TYPES)
    subtype = models.CharField(max_length=50, blank=True, null=True)

    current_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    available_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.type}) - {self.plaid_instance.user.username}"