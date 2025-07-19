from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *



urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path("api-auth/", include("rest_framework.urls")),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/update/', UserUpdateView.as_view(), name='user_update'),
]
