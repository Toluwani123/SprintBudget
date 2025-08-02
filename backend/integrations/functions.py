from django.conf import settings
from plaid.api import plaid_api
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.configuration import Configuration
from plaid.api_client import ApiClient
from datetime import datetime, timedelta, date
from django.utils import timezone
from .models import *
import plaid
from transactions.models import Transaction, Category
from celery import shared_task
from decouple import config


configuration = Configuration(
    host= plaid.Environment.Sandbox,
    api_key={
        "clientId": config("PLAID_CLIENT_ID"),
        "secret": config("PLAID_SECRET"),
    }
)

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

@shared_task
def sync_plaid_transactions(integration_id):
    integration = PlaidInstance.objects.get(id=integration_id)
    access_token = integration.access_token

    start_date = datetime.now().date() - timedelta(days=30)
    end_date = datetime.now().date()

    request = TransactionsGetRequest(
        access_token=access_token,
        start_date=start_date,
        end_date=end_date
    )

    try:
        response = client.transactions_get(request)
        transactions = response.to_dict().get('transactions', [])
        

        new_transactions = 0
        existing_transactions = 0

        for tx in transactions:
            if tx.get('pending', False):
                continue
            category = None
            if tx.get('category'):
                category_name = tx['category'][0]
            else:
                category_name = 'Other'
                category, created = Category.objects.get_or_create(name=category_name, defaults={'is_default': False})

            raw_date = tx["date"] 
            if isinstance(raw_date, datetime):
                if timezone.is_naive(raw_date):
                    raw_date = timezone.make_aware(raw_date)
            else:
                raw_date = timezone.make_aware(datetime.combine(raw_date, datetime.min.time()), timezone.get_current_timezone())
                
            obj, created = Transaction.objects.update_or_create(
                
                plaid_transaction_id=tx['transaction_id'],
                defaults={
                    'user': integration.user,
                    'amount': abs(tx['amount']),
                    'description': tx['name'],
                    'category': category,
                    'date': raw_date,
                    'transaction_type': 'expense' if tx['amount'] > 0 else 'income',
                    'plaid_account_id': tx['account_id'],
                    'merchant_name': tx.get('merchant_name', '')
                }
            )
            if created:
                new_transactions += 1
            else:
                existing_transactions += 1

        integration.last_synced = datetime.now()
        integration.save()
        print(f"New transactions: {new_transactions}, Existing transactions: {existing_transactions}")

    except Exception as e:
        print(f"Error syncing transactions: {e}")


@shared_task
def sync_all_plaid_integrations():
    """Sync all active Plaid integrations"""
    active_integrations = PlaidInstance.objects.filter(is_active=True)
    
    for integration in active_integrations:
        sync_plaid_transactions.delay(integration.id)