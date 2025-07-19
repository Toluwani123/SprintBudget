from rest_framework import serializers
from .models import *
from datetime import date


class SprintSerializer(serializers.ModelSerializer):
    days_remaining = serializers.SerializerMethodField()
    sprint_percentage = serializers.SerializerMethodField()
    class Meta:
        model = Sprint
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'user', 'total_spent', 'remaining_budget']

    def get_days_remaining(self, obj):
        if obj.end_date < date.today():
            return 0
        return (obj.end_date - date.today()).days

    def get_sprint_percentage(self, obj):
        total_sprint = obj.budget_amount + obj.rollover_amount
        if total_sprint == 0:
            return 0
        return min(100, (obj.total_spent / total_sprint) * 100)
        


class SprintAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SprintAlert
        fields = '__all__'
        read_only_fields = ['created_at', 'user']