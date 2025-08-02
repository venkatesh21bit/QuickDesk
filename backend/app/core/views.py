from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    """
    API Root endpoint that provides information about available endpoints.
    """
    return Response({
        'message': 'Welcome to QuickDesk API',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
        }
    })