from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = ['created_at']


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at', 'plaid_transaction_id', 'plaid_account_id', 'ai_confidence','is_ai_categorized', 'user']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
    

class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('amount', 'description', 'category', 'transaction_type', 
                 'date', 'is_recurring', 'is_essential')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)