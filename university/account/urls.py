from django.urls import path, include
from .views import CustomTokenObtainPairView, LogoutView, CustomTokenRefreshView

urlpatterns = [
    path('auth/', include('djoser.urls')),
    #This replaces the default SimpleJWT login endpoint with our custom view.
    path('auth/jwt/create/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/jwt/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'), 
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/', include('djoser.urls.jwt')),  # For JWT endpoints
]