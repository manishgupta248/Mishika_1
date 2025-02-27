from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
"""
Since we’re using email as the username, we’ll extend AbstractBaseUser for full control 
(rather than AbstractUser, which assumes a username field).
"""

"""
Handles user creation with email as the identifier. create_user is for regular users, 
and create_superuser is for admin users.
"""
class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None):
        user = self.create_user(email, first_name, last_name, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

"""
 Defines the model with email as the unique identifier (replacing username), 
 plus first_name and last_name. PermissionsMixin adds support for Django’s permission system.
"""
class CustomUser(AbstractBaseUser, PermissionsMixin): 
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'    # Tells Django to use email for authentication.
    REQUIRED_FIELDS = ['first_name', 'last_name']   # Ensures these fields are prompted when creating a superuser.

    def __str__(self):
        return self.email