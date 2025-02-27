"""
Django settings for university project.

Generated by 'django-admin startproject' using Django 5.1.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-tc+qt$m#p(00u)@&+!-njz=0=fexq4eqv-1d8zf%f1ex9z+hlp'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # My Installed Apps
    'rest_framework',
    'rest_framework_simplejwt',
    'djoser',
    'corsheaders',
    'import_export',
    'django_filters',
    # My Apps
    'account.apps.AccountConfig',  # Use the app config for clarity
    'academic.apps.AcademicConfig',
    'courses.apps.CoursesConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',        # Add This 
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'university.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'university.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# My Additional Settings

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

AUTH_USER_MODEL = 'account.CustomUser'  # Tell Django to use this custom user model

# REST Framework settings
REST_FRAMEWORK = {
    # Sets JWT as the default authentication method and requires authentication 
    # for API access (can be overridden per view).
    #'DEFAULT_AUTHENTICATION_CLASSES': (  
    #    'rest_framework_simplejwt.authentication.JWTAuthentication',
    #),
    'DEFAULT_AUTHENTICATION_CLASSES': ( # Custom Athentication 
        'account.auth.CookieJWTAuthentication',
    ),

    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    # Configure pagination globally in DRF but allow endpoints to opt-in or opt-out as needed.
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}


# SimpleJWT settings (optional customization)
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),  # Ignored with our custom auth
}

# Djoser settings
# Customizes Djoser to use email for login, requires password retype, and points to serializers
DJOSER = {
    'USER_ID_FIELD': 'id',
    'LOGIN_FIELD': 'email',  # Use email for login
    'USER_CREATE_PASSWORD_RETYPE': True,  # Require password confirmation
    'SEND_ACTIVATION_EMAIL': False,  # Disable for now (can enable later)
    'SERIALIZERS': {
        'user_create': 'account.serializers.CustomUserCreateSerializer',  # We'll create this
        'user': 'account.serializers.CustomUserSerializer',  # We'll create this
    },
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # For Next.js dev
]
# Optional: Allow credentials (for cookies)
# Enables sending cookies (like JWT tokens in httpOnly cookies) with requests. 
# This aligns with your plan to use httpOnly cookies for token storage.
CORS_ALLOW_CREDENTIALS = True


# Ensure email is used for authentication
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]