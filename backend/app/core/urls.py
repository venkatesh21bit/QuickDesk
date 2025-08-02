from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from rest_framework_nested import routers  # Temporarily disabled
from . import views

# Create the main router
router = DefaultRouter()

# Register main viewsets
router.register(r'categories', views.CategoryViewSet)
router.register(r'priorities', views.PriorityViewSet)
router.register(r'tickets', views.TicketViewSet, basename='ticket')
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'admin/users', views.UserManagementViewSet, basename='user-management')

# Create nested routers for ticket-related resources - TEMPORARILY DISABLED
# tickets_router = routers.NestedDefaultRouter(router, r'tickets', lookup='ticket')
# tickets_router.register(r'comments', views.TicketCommentViewSet, basename='ticket-comments')
# tickets_router.register(r'attachments', views.TicketAttachmentViewSet, basename='ticket-attachments')

urlpatterns = [
    # API Root
    path('', views.api_root, name='api_root'),
    
    # Authentication endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    
    # Dashboard and search endpoints
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('tickets/search/', views.TicketSearchView.as_view(), name='ticket-search'),
    
    # Include router URLs
    path('', include(router.urls)),
    # path('', include(tickets_router.urls)),  # Temporarily disabled
]
