from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.  

class User(AbstractUser):
    email = models.EmailField(unique=True)
    weekly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    currency = models.CharField(max_length=10, default='USD')
    rollover_budget = models.BooleanField(default=False)
    email_notifications = models.BooleanField(default=True)
    ai_features_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


    def __str__(self):
        return self.email
    

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    plaid_access_token = models.CharField(max_length=255, blank=True, null=True)
    timezone = models.CharField(max_length=50, default='UTC')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.user.username}'s Profile"