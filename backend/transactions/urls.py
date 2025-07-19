from django.urls import path
from . import views


urlpatterns = [
    path("", views.TransactionListCreateView.as_view(), name="transaction-list-create"),
    path("categories/", views.CategoryListCreateView.as_view(), name="category-list-create"),
    path("<int:pk>/", views.TransactionDetailView.as_view(), name="transaction-detail"),
    path("stats/", views.transaction_stats, name="transaction-stats"),
]
