from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('account.urls')),
    path('api/academic/', include('academic.urls')),
    path('api/courses/', include('courses.urls')),
]