from rest_framework import viewsets,  permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Course, Syllabus
from .serializers import CourseSerializer, SyllabusSerializer
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class CoursePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'  # e.g., ?limit=20
    max_page_size = 100

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    pagination_class = CoursePagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['COURSE_CODE', 'COURSE_NAME']  # Fields to search

    def get_permissions(self):
        """Set permissions based on the request method."""
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]  # GET requests (list & retrieve) are open
        return [permissions.IsAuthenticated()]  # POST, PUT, DELETE require auth]

@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # Ensure GET is open for choices
def course_choices(request):
    choices = {
            'CATEGORY': [{'value': k, 'label': v} for k, v in Course.CATEGORY_CHOICES],
            'COURSE_CATEGORY': [{'value': k, 'label': v} for k, v in Course.COURSE_CATEGORY_CHOICES],
            'TYPE': [{'value': k, 'label': v} for k, v in Course.TYPE_CHOICES],
            'CREDIT_SCHEME': [{'value': k, 'label': v} for k, v in Course.CREDIT_SCHEME_CHOICES],
            'CBCS_CATEGORY': [{'value': k, 'label': v} for k, v in Course.CBCS_CATEGORY_CHOICES],
            'QUALIFYING_IN_NATURE': [{'value': k, 'label': v} for k, v in Course.QUALIFYING_CHOICES],
        }
    return Response(choices)

#=================================================================================

class SyllabusViewSet(viewsets.ModelViewSet):
    queryset = Syllabus.objects.all()
    serializer_class = SyllabusSerializer
    pagination_class = CoursePagination  # Optional: paginate syllabi too
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['course']  # Filter by course ID
    search_fields = ['course__COURSE_CODE', 'course__COURSE_NAME']  # Search by course code/name

    def get_permissions(self):
        """Set permissions based on the request method."""
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]  # GET requests (list & retrieve) are open
        return [permissions.IsAuthenticated()]  # POST, PUT, DELETE require auth]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

