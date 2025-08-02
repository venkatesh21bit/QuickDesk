from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Custom Session Authentication that exempts CSRF checks for API endpoints.
    This allows the frontend to make API calls without CSRF tokens while
    still maintaining session-based authentication.
    """
    
    def enforce_csrf(self, request):
        return  # Skip CSRF check for API endpoints
