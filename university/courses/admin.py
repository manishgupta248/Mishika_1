from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import Course, Syllabus

class CourseResource(resources.ModelResource):
    class Meta:
        model = Course
        fields = ('COURSE_CODE', 'COURSE_NAME', 'CATEGORY', 'COURSE_CATEGORY', 'TYPE', 'CREDIT_SCHEME', 'CBCS_CATEGORY', 'DISCIPLINE__name', 'MAXIMUM_CREDIT', 'QUALIFYING_IN_NATURE') # Include related field
        export_order = ('COURSE_CODE', 'COURSE_NAME', 'CATEGORY', 'COURSE_CATEGORY', 'TYPE', 'CREDIT_SCHEME', 'CBCS_CATEGORY', 'DISCIPLINE__name', 'MAXIMUM_CREDIT', 'QUALIFYING_IN_NATURE') # Maintain the export order

class CourseAdmin(ImportExportModelAdmin):
    resource_class = CourseResource
    list_display = ('COURSE_CODE', 'COURSE_NAME', 'CATEGORY', 'COURSE_CATEGORY', 'TYPE', 'CREDIT_SCHEME', 'CBCS_CATEGORY', 'DISCIPLINE', 'MAXIMUM_CREDIT', 'QUALIFYING_IN_NATURE')
    list_filter = ('CATEGORY', 'COURSE_CATEGORY', 'TYPE', 'CREDIT_SCHEME', 'CBCS_CATEGORY', 'DISCIPLINE', 'QUALIFYING_IN_NATURE')
    search_fields = ('COURSE_CODE', 'COURSE_NAME', 'DISCIPLINE__name') # Search related field
    # If DISCIPLINE is a foreign key to a table with a name field, you can search that name.

    fieldsets = (
        ('Course Information', {
            'fields': ('COURSE_CODE', 'COURSE_NAME', 'DISCIPLINE')
        }),
        ('Course Details', {
            'fields': ('CATEGORY', 'COURSE_CATEGORY', 'TYPE', 'CREDIT_SCHEME', 'CBCS_CATEGORY', 'MAXIMUM_CREDIT', 'QUALIFYING_IN_NATURE')
        }),
    )

admin.site.register(Course, CourseAdmin)
admin.site.register(Syllabus)