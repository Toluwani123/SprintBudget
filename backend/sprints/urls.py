from django.urls import path
from . import views

urlpatterns = [
    path('', views.SprintListView.as_view(), name='sprint-list'),
    path('<int:pk>/', views.SprintDetailView.as_view(), name='sprint-detail'),
    path('current/', views.current_sprint, name='current-sprint'),
    path('<int:pk>/complete/', views.complete_sprint, name='complete-sprint'),
    path('alerts/', views.SprintAlertListView.as_view(), name='sprint-alert-list'),
    path('dashboard/', views.budget_dashboard, name='budget-dashboard')
]