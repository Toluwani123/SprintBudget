from rest_framework import serializers
from .models import *


class PlaidAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaidAccount
        fields = "__all__"
        read_only_fields = ('plaid_instance', 'created_at', 'updated_at')

class PlaidInstanceSerializer(serializers.ModelSerializer):
    accounts = PlaidAccountSerializer(many=True, read_only=True)
    class Meta:
        model = PlaidInstance
        fields = "__all__"

        read_only_fields = ('user', 'access_token', 'item_id', 'last_synced', 'created_at', 'updated_at')

class PlaidLinkSerializer(serializers.Serializer):
    public_token = serializers.CharField(required=True)
    institution_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    accounts = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )

