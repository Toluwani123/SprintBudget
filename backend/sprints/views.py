from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta, date
from .models import *
from .serializers import *
from .functions import create_sprint


# Create your views here.


class SprintListView(generics.ListCreateAPIView):
    
    serializer_class = SprintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Sprint.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SprintDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SprintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Sprint.objects.filter(user=user)
    

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_sprint(request):
    user = request.user
    today = date.today()
    try:
        sprint = Sprint.objects.get(user=user, start_date__lte=today, end_date__gte=today)
        sprint.calculate_totals()
        serializer = SprintSerializer(sprint)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Sprint.DoesNotExist:
        print("No current sprint found for user:", user.id)
        create_sprint(request.user.id)
        return Response({
            'message': 'Creating new sprint...',
            'status': 'creating'
        }, status=status.HTTP_202_ACCEPTED)
    

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def complete_sprint(request, pk):
    try:
        sprint = Sprint.objects.get(id=pk, user=request.user)
        if sprint.end_date < date.today():
            return Response({'error': 'Cannot complete a sprint that has already ended.'}, status=status.HTTP_400_BAD_REQUEST)
        # Logic to complete the sprint
        sprint.is_completed = True
        sprint.is_active = False
        sprint.calculate_totals()
        sprint.end_date = date.today()
        sprint.save()

        if request.user.rollover_unspent and sprint.remaining_budget > 0:
            # Add remaining budget to next sprint's rollover amount
            create_sprint.delay(request.user.id, float(sprint.remaining_budget))
        return Response({'message': 'Sprint completed successfully.'}, status=status.HTTP_200_OK)
    except Sprint.DoesNotExist:
        return Response({'error': 'Sprint not found.'}, status=status.HTTP_404_NOT_FOUND)
    

class SprintAlertListView(generics.ListAPIView):
    serializer_class = SprintAlertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SprintAlert.objects.filter(user=self.request.user).order_by('-created_at')
    
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def budget_dashboard(request):
    """Get comprehensive budget dashboard data"""
    user = request.user
    today = date.today()
    
    # Current sprint
    current_sprint_data = None
    try:
        current_sprint = Sprint.objects.get(
            user=user,
            start_date__lte=today,
            end_date__gte=today
        )
        current_sprint.calculate_totals()
        current_sprint_data = SprintSerializer(current_sprint).data
    except Sprint.DoesNotExist:
        pass
    
    # Recent sprints
    recent_sprints = Sprint.objects.filter(user=user)[:5]
    recent_sprints_data = SprintSerializer(recent_sprints, many=True).data
    
   
    
    # Recent alerts
    recent_alerts = SprintAlert.objects.filter(user=user)[:5]
    recent_alerts_data = SprintAlertSerializer(recent_alerts, many=True).data

    return Response({
        'current_sprint': current_sprint_data,
        'recent_sprints': recent_sprints_data,

        'recent_alerts': recent_alerts_data,
    })
