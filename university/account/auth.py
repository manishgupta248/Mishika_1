from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

"""
Since SimpleJWT expects the token in the Authorization header by default, we need a 
custom authentication class to look for the accessToken in the cookie.
"""
"""
This class overrides the default JWT authentication to check the accessToken cookie instead 
of the Authorization header.
If no token is found, it returns None (unauthenticated), and if the token is invalid, it raises an error.
"""
class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get('accessToken')
        if not raw_token:
            return None  # No token, let other auth methods try or fail gracefully
        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except Exception as e:
            raise AuthenticationFailed(f"Invalid token: {str(e)}")