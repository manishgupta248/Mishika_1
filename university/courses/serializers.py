from rest_framework import serializers
from .models import Course, Syllabus

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id', 'COURSE_CODE', 'COURSE_NAME', 'CATEGORY', 'COURSE_CATEGORY', 'TYPE',
            'CREDIT_SCHEME', 'CBCS_CATEGORY', 'DISCIPLINE', 'MAXIMUM_CREDIT', 'QUALIFYING_IN_NATURE'
        ]

class SyllabusSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField()  # Display username
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())

    class Meta:
        model = Syllabus
        fields = ['id', 'course', 'syllabus_file', 'uploaded_by', 'uploaded_at', 'version', 'is_active', 'description']