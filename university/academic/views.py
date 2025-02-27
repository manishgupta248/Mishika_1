from rest_framework import viewsets,  permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Department
from .serializers import DepartmentSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    pagination_class = None  # Disable pagination
    
    def get_permissions(self):
        """Set permissions based on the request method."""
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]  # GET requests (list & retrieve) are open
        return [permissions.IsAuthenticated()]  # POST, PUT, DELETE require auth

@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # Ensure GET is open for choices
def faculty_choices(request):
    choices = [{'value': key, 'label': value} for key, value in Department.FACULTY_CHOICES]
    return Response(choices)