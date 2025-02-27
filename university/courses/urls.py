from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, course_choices, SyllabusViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'syllabi', SyllabusViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('choices/', course_choices, name='course_choices'),
]