from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, faculty_choices

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('faculty-choices/', faculty_choices, name='faculty_choices'),
]