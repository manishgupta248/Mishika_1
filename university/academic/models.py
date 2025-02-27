from django.db import models

class Department(models.Model):
    FACULTY_CHOICES = [
        ('I&C', 'Information & Computing'),
        ('E&T', 'Engineering & Technology'),
        ('I&R', 'Interdisciplinary and Research'),
        ('LS', 'Life Sciences'),
        ('LAMS', 'Liberal Arts & Media Studies'),
        ('MS', 'Management Studies'),
        ('SC', 'Sciences'),
        ('CCSD', 'CCSD'),
    ]

    name = models.CharField(max_length=100)
    faculty = models.CharField(max_length=4, choices=FACULTY_CHOICES)

    class Meta:
        unique_together = ('name', 'faculty')

    def __str__(self):
        return f"{self.name} ({self.get_faculty_display()})"