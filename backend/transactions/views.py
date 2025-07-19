from django.shortcuts import render

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from datetime import datetime, timedelta
from .models import Transaction, Category
from .serializers import (
    TransactionSerializer, TransactionCreateSerializer, 
    CategorySerializer
)
# Create your views here.

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    ordering = ['name']

    def perform_create(self, serializer):
        serializer.save()


class TransactionListCreateView(generics.ListCreateAPIView):
    
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'transaction_type', 'is_recurring']
    search_fields = ['description', 'merchant_name']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        user = self.request.user
        queryset = Transaction.objects.filter(user=user)

        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')

        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TransactionCreateSerializer
        return TransactionSerializer

    def perform_create(self, serializer):
        transaction = serializer.save()
        if self.request.user.ai_features_enabled:
            # Here you would call your AI categorization logic
            # For example:
            # transaction.ai_confidence, transaction.is_ai_categorized = categorize_transaction(transaction)
            pass


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(user=user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def transaction_stats(request):
    user = request.user
    
    # Get current week transactions
    today = datetime.now().date()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)
    
    week_transactions = Transaction.objects.filter(
        user=user,
        date__date__range=[week_start, week_end],
        transaction_type='expense'
    )
    
    total_spent = sum(t.amount for t in week_transactions)
    transaction_count = week_transactions.count()
    
    # Category breakdown
    category_stats = {}
    for transaction in week_transactions:
        category_name = transaction.category.name if transaction.category else 'Uncategorized'
        if category_name not in category_stats:
            category_stats[category_name] = {
                'amount': 0,
                'count': 0,
                
            }
        category_stats[category_name]['amount'] += float(transaction.amount)
        category_stats[category_name]['count'] += 1
    
    return Response({
        'week_start': week_start,
        'week_end': week_end,
        'total_spent': total_spent,
        'weekly_budget': user.weekly_budget,
        'remaining_budget': user.weekly_budget - total_spent,
        'transaction_count': transaction_count,
        'category_breakdown': category_stats,
        'budget_percentage': (total_spent / user.weekly_budget * 100) if user.weekly_budget > 0 else 0
    })