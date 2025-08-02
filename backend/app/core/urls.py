from django.urls import path
from . import views

urlpatterns = [
    # API Root
    path('', views.api_root, name='api_root'),
    
   
]
