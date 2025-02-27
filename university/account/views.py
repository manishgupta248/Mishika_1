from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data['access']
        refresh_token = response.data['refresh']
        response.set_cookie('accessToken', access_token, httponly=True, secure=False, samesite='Lax', max_age=60 * 60)
        response.set_cookie('refreshToken', refresh_token, httponly=True, secure=False, samesite='Lax', max_age=24 * 60 * 60)
        response.data = {"message": "Login successful"}
        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refreshToken')
        print(f"Refresh token from cookie: {refresh_token}")
        if not refresh_token:
            return Response({"error": "No refresh token provided"}, status=400)
        
        # Create a new data dict and pass it to the serializer directly
        serializer = self.get_serializer(data={'refresh': refresh_token})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        # Generate new access token manually
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        
        # Set the new access token in the cookie
        response = Response({"message": "Token refreshed"})
        response.set_cookie('accessToken', access_token, httponly=True, secure=False, samesite='Lax', max_age=60 * 60)
        return response

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        response = Response({"message": "Logout successful"})
        response.delete_cookie('accessToken')
        response.delete_cookie('refreshToken')
        return response