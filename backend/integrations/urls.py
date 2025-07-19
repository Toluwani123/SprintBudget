from django.urls import path
from . import views

urlpatterns = [
    path('plaid/', views.PlaidInstanceView.as_view(), name='plaid-integration'),
    path('plaid/link-token/', views.plaid_link, name='plaid-link-token'),
    path('plaid/exchange-token/', views.PlaidLinkExchangeView.as_view(), name='plaid-exchange-token'),
    path('plaid/sync/', views.sync_plaid_data, name='plaid-sync'),

]
