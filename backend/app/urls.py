"""
URL configuration for apps.

This file contains URL patterns for all the apps in the project.
Add your app URLs here using include().
"""
from django.urls import path, include

urlpatterns = [
    # Core app URLs
    path('', include('apps.core.urls')),
    
    # Add your app URLs here
    # Example: path('users/', include('apps.users.urls')),
]
