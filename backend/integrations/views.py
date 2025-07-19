from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework import generics, permissions, filters
from rest_framework_simplejwt.views import *
from django.contrib.auth import get_user_model
from plaid.model.country_code import CountryCode
from plaid.api import plaid_api
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.configuration import Configuration
from plaid.api_client import ApiClient
import plaid
from plaid.model.products import Products
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from rest_framework.decorators import api_view, permission_classes
from .functions import sync_plaid_transactions
from plaid.model.accounts_get_request import AccountsGetRequest
from rest_framework.response import Response
from rest_framework import status
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from decouple import config

User = get_user_model()

# Create your views here.

configuration = Configuration(
    host= plaid.Environment.Sandbox,
    api_key={
        "clientId": config("PLAID_CLIENT_ID"),
        "secret": config("PLAID_SECRET"),
    }
)

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

class PlaidInstanceView(generics.RetrieveUpdateAPIView):
    serializer_class = PlaidInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return PlaidInstance.objects.get(user=self.request.user)
        except PlaidInstance.DoesNotExist:
            return None
        
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])  
def plaid_link(request):
    try:
        data = LinkTokenCreateRequest(
            user=LinkTokenCreateRequestUser(
                client_user_id=str(request.user.id),
            ),
            products=[Products('transactions')],
            client_name='SprintBudget',
            country_codes=[CountryCode('US')],
            language='en',
        )

        link_token_response = client.link_token_create(data)
        link_token_value = link_token_response.to_dict().get('link_token')

        return Response({'link_token': link_token_value}, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=400)



class PlaidLinkExchangeView(APIView):
    serializer_class = PlaidLinkSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PlaidLinkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        public_token = serializer.validated_data['public_token']
        institution_id = serializer.validated_data.get("institution_id")

        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token
        )

        try:
            exchange_response = client.item_public_token_exchange(exchange_request)
            access_token = exchange_response['access_token']
            item_id = exchange_response['item_id']

            plaid_instance, created = PlaidInstance.objects.get_or_create(user=request.user)
            plaid_instance.access_token = access_token
            plaid_instance.item_id = item_id
            plaid_instance.institution_name = institution_id
            plaid_instance.save()

            accounts_request = AccountsGetRequest(
                access_token=access_token
            )

            accounts_response = client.accounts_get(accounts_request)
            accounts_data = accounts_response.to_dict().get('accounts', [])

            for account in accounts_data:
                PlaidAccount.objects.update_or_create(
                    plaid_instance=plaid_instance,
                    account_id=account['account_id'],
                    defaults={
                        'name': account['name'],
                        'type': account['type'],
                        'subtype': account.get('subtype', ''),
                        'current_balance': account.get('balances', {}).get('current', 0.00),
                        'available_balance': account.get('balances', {}).get('available', 0.00),
                    }
                )

            return Response({'message': 'Plaid instance created successfully'}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def sync_plaid_data(request):
    """Manually trigger Plaid data sync"""
    try:
        integration = PlaidInstance.objects.get(user=request.user)
        sync_plaid_transactions(integration.id)
        
        return Response({
            'message': 'Sync started. Transactions will be updated shortly.'
        })

    except PlaidInstance.DoesNotExist:
        return Response({
            'error': 'Plaid integration not found'
        }, status=status.HTTP_404_NOT_FOUND)

