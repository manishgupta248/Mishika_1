from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id', 'COURSE_CODE', 'COURSE_NAME', 'CATEGORY', 'COURSE_CATEGORY', 'TYPE',
            'CREDIT_SCHEME', 'CBCS_CATEGORY', 'DISCIPLINE', 'MAXIMUM_CREDIT', 'QUALIFYING_IN_NATURE'
        ]