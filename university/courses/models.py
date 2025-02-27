from django.db import models
from django.core.validators import MaxLengthValidator, MinValueValidator, MaxValueValidator

class Course(models.Model):
    CATEGORY_CHOICES = [('CREDITS', 'Credits'), ('CBCS', 'CBCS')]
    COURSE_CATEGORY_CHOICES = [('COMPULSORY', 'Compulsory'), ('ELECTIVE', 'Elective')]
    TYPE_CHOICES = [
        ('DISSERTATION', 'Dissertation'), ('LABORATORY', 'Laboratory'), ('PRACTICAL', 'Practical'),
        ('PROJECT', 'Project'), ('THEORY', 'Theory'), ('THEORY AND PRACTICAL', 'Theory and Practical'),
        ('TUTORIAL', 'Tutorial')
    ]
    CREDIT_SCHEME_CHOICES = [('CREDIT', 'Credit'), ('CBCS', 'CBCS'), ('NEP', 'NEP')]
    CBCS_CATEGORY_CHOICES = [
        ('MAJOR', 'Major'), ('MINOR', 'Minor'), ('CORE', 'Core'), ('DSE', 'DSE'),
        ('GE', 'GE'), ('OE', 'OE'), ('VAC', 'VAC'), ('AECC', 'AECC'), ('SEC', 'SEC'),
        ('MDC', 'MDC'), ('IDC', 'IDC')
    ]
    QUALIFYING_CHOICES = [('NO', 'No'), ('YES', 'Yes')]

    COURSE_CODE = models.CharField(max_length=10, unique=True, validators=[MaxLengthValidator(10)])
    COURSE_NAME = models.CharField(max_length=200)
    CATEGORY = models.CharField(max_length=7, choices=CATEGORY_CHOICES)
    COURSE_CATEGORY = models.CharField(max_length=10, choices=COURSE_CATEGORY_CHOICES)
    TYPE = models.CharField(max_length=20, choices=TYPE_CHOICES)
    CREDIT_SCHEME = models.CharField(max_length=6, choices=CREDIT_SCHEME_CHOICES)
    CBCS_CATEGORY = models.CharField(max_length=6, choices=CBCS_CATEGORY_CHOICES)
    DISCIPLINE = models.ForeignKey('academic.Department', on_delete=models.CASCADE, related_name='courses')
    MAXIMUM_CREDIT = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(20)], default=0
    )
    QUALIFYING_IN_NATURE = models.CharField(max_length=3, choices=QUALIFYING_CHOICES, default='NO')

    def __str__(self):
        return f"{self.COURSE_CODE} - {self.COURSE_NAME}"