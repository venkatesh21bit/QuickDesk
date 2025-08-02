from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth import login, logout
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    User, Category, Priority, Ticket, TicketComment, 
    TicketAttachment, TicketVote, TicketActivity, 
    Notification, UserProfile
)
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    UserProfileSerializer, CategorySerializer, PrioritySerializer,
    TicketListSerializer, TicketDetailSerializer, TicketCreateSerializer,
    TicketUpdateSerializer, TicketCommentSerializer, CommentCreateSerializer,
    TicketAttachmentSerializer, TicketVoteSerializer, TicketActivitySerializer,
    NotificationSerializer, DashboardStatsSerializer, TicketSearchSerializer
)
from .services import EmailService, NotificationService, TicketService
from .services import TicketService, EmailService, NotificationService


# ============================================================================
# Authentication Views
# ============================================================================

class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    """
    User login endpoint
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            user_serializer = UserSerializer(user, context={'request': request})
            return Response({
                'message': 'Login successful',
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    User logout endpoint
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    User profile view
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


# ============================================================================
# Category Views
# ============================================================================

class CategoryViewSet(ModelViewSet):
    """
    ViewSet for managing categories
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def get_permissions(self):
        """
        Only admins can create, update, delete categories
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsAgentOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow agent or admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['agent', 'admin']


# ============================================================================
# Priority Views
# ============================================================================

class PriorityViewSet(ModelViewSet):
    """
    ViewSet for managing priorities
    """
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Only admins can create, update, delete priorities
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]


# ============================================================================
# Ticket Views
# ============================================================================

class TicketViewSet(ModelViewSet):
    """
    ViewSet for managing tickets
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['subject', 'description', 'ticket_number']
    ordering_fields = ['created_at', 'updated_at', 'priority__level', 'status']
    ordering = ['-created_at']
    filterset_fields = ['status', 'category', 'priority', 'assigned_to', 'created_by']
    
    def get_queryset(self):
        """
        Filter tickets based on user role and permissions
        """
        user = self.request.user
        queryset = Ticket.objects.select_related('created_by', 'assigned_to', 'category', 'priority')
        
        if user.role == 'customer':
            # Customers can only see their own tickets and non-internal tickets
            queryset = queryset.filter(created_by=user, is_internal=False)
        elif user.role == 'agent':
            # Agents can see all tickets except internal ones they didn't create
            queryset = queryset.filter(
                Q(is_internal=False) | Q(created_by=user) | Q(assigned_to=user)
            )
        # Admins can see all tickets
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TicketListSerializer
        elif self.action == 'create':
            return TicketCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TicketUpdateSerializer
        return TicketDetailSerializer
    
    def perform_create(self, serializer):
        # Use the service to create ticket with notifications
        validated_data = serializer.validated_data
        ticket = TicketService.create_ticket(validated_data, self.request.user)
        
        # Update the serializer instance
        serializer.instance = ticket
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """
        Assign ticket to an agent
        """
        ticket = self.get_object()
        agent_id = request.data.get('agent_id')
        
        if not request.user.role in ['agent', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            agent = User.objects.get(id=agent_id, role='agent')
            TicketService.assign_ticket(ticket, agent, request.user)
            
            return Response({'message': f'Ticket assigned to {agent.username}'})
        except User.DoesNotExist:
            return Response({'error': 'Agent not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        """
        Vote on a ticket (upvote/downvote)
        """
        ticket = self.get_object()
        vote_type = request.data.get('vote_type')
        
        if vote_type not in ['up', 'down']:
            return Response({'error': 'Invalid vote type'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already voted
        existing_vote = TicketVote.objects.filter(ticket=ticket, user=request.user).first()
        
        if existing_vote:
            if existing_vote.vote_type == vote_type:
                # Remove vote if same type
                existing_vote.delete()
                return Response({'message': 'Vote removed'})
            else:
                # Change vote type
                existing_vote.vote_type = vote_type
                existing_vote.save()
                return Response({'message': f'{vote_type.title()}vote recorded'})
        else:
            # Create new vote
            TicketVote.objects.create(ticket=ticket, user=request.user, vote_type=vote_type)
            return Response({'message': f'{vote_type.title()}vote recorded'})


# ============================================================================
# Comment Views
# ============================================================================

class TicketCommentViewSet(ModelViewSet):
    """
    ViewSet for managing ticket comments
    """
    serializer_class = TicketCommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        ticket_id = self.kwargs.get('ticket_pk')
        user = self.request.user
        
        queryset = TicketComment.objects.filter(ticket_id=ticket_id)
        
        # Filter internal comments based on user role
        if user.role == 'customer':
            queryset = queryset.filter(is_internal=False)
        
        return queryset.select_related('created_by')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        return TicketCommentSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['ticket_id'] = self.kwargs.get('ticket_pk')
        return context


# ============================================================================
# Attachment Views
# ============================================================================

class TicketAttachmentViewSet(ModelViewSet):
    """
    ViewSet for managing ticket attachments
    """
    serializer_class = TicketAttachmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        ticket_id = self.kwargs.get('ticket_pk')
        return TicketAttachment.objects.filter(ticket_id=ticket_id)
    
    def perform_create(self, serializer):
        ticket_id = self.kwargs.get('ticket_pk')
        file = self.request.FILES.get('file')
        
        serializer.save(
            ticket_id=ticket_id,
            uploaded_by=self.request.user,
            original_filename=file.name,
            file_size=file.size,
            content_type=file.content_type
        )


# ============================================================================
# Dashboard and Statistics Views
# ============================================================================

class DashboardStatsView(APIView):
    """
    Dashboard statistics endpoint
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Base ticket queryset based on user role
        if user.role == 'customer':
            base_queryset = Ticket.objects.filter(created_by=user)
        elif user.role == 'agent':
            base_queryset = Ticket.objects.filter(
                Q(assigned_to=user) | Q(created_by=user) | Q(is_internal=False)
            )
        else:  # admin
            base_queryset = Ticket.objects.all()
        
        # Calculate statistics
        total_tickets = base_queryset.count()
        open_tickets = base_queryset.filter(status='open').count()
        in_progress_tickets = base_queryset.filter(status='in_progress').count()
        resolved_tickets = base_queryset.filter(status='resolved').count()
        closed_tickets = base_queryset.filter(status='closed').count()
        urgent_tickets = base_queryset.filter(priority__name='urgent').count()
        
        stats = {
            'total_tickets': total_tickets,
            'open_tickets': open_tickets,
            'in_progress_tickets': in_progress_tickets,
            'resolved_tickets': resolved_tickets,
            'closed_tickets': closed_tickets,
            'urgent_tickets': urgent_tickets,
        }
        
        # Role-specific statistics
        if user.role == 'customer':
            stats['my_tickets'] = total_tickets
        elif user.role == 'agent':
            stats['assigned_tickets'] = Ticket.objects.filter(assigned_to=user).count()
            stats['my_tickets'] = Ticket.objects.filter(created_by=user).count()
        
        # Performance metrics for agents and admins
        if user.role in ['agent', 'admin']:
            # Calculate average response and resolution times
            resolved_tickets_qs = base_queryset.filter(resolved_at__isnull=False)
            
            if resolved_tickets_qs.exists():
                avg_resolution_time = resolved_tickets_qs.aggregate(
                    avg_time=Avg('resolved_at') - Avg('created_at')
                )['avg_time']
                if avg_resolution_time:
                    stats['avg_resolution_time'] = str(avg_resolution_time)
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)


class TicketSearchView(generics.ListAPIView):
    """
    Advanced ticket search endpoint
    """
    serializer_class = TicketListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Ticket.objects.select_related('created_by', 'assigned_to', 'category', 'priority')
        
        # Apply role-based filtering
        if user.role == 'customer':
            queryset = queryset.filter(created_by=user, is_internal=False)
        elif user.role == 'agent':
            queryset = queryset.filter(
                Q(is_internal=False) | Q(created_by=user) | Q(assigned_to=user)
            )
        
        # Apply search filters
        search_serializer = TicketSearchSerializer(data=self.request.query_params)
        if search_serializer.is_valid():
            filters = search_serializer.validated_data
            
            # Text search
            if filters.get('q'):
                q = filters['q']
                queryset = queryset.filter(
                    Q(subject__icontains=q) |
                    Q(description__icontains=q) |
                    Q(ticket_number__icontains=q)
                )
            
            # Status filter
            if filters.get('status'):
                queryset = queryset.filter(status__in=filters['status'])
            
            # Category filter
            if filters.get('category'):
                queryset = queryset.filter(category_id=filters['category'])
            
            # Priority filter
            if filters.get('priority'):
                queryset = queryset.filter(priority_id=filters['priority'])
            
            # Assigned to filter
            if filters.get('assigned_to'):
                queryset = queryset.filter(assigned_to_id=filters['assigned_to'])
            
            # Created by filter
            if filters.get('created_by'):
                queryset = queryset.filter(created_by_id=filters['created_by'])
            
            # My tickets filter
            if filters.get('my_tickets'):
                queryset = queryset.filter(created_by=user)
            
            # Date range filters
            if filters.get('date_from'):
                queryset = queryset.filter(created_at__gte=filters['date_from'])
            
            if filters.get('date_to'):
                queryset = queryset.filter(created_at__lte=filters['date_to'])
            
            # Sorting
            sort_by = filters.get('sort_by', '-created_at')
            queryset = queryset.order_by(sort_by)
        
        return queryset


# ============================================================================
# User Management Views (Admin only)
# ============================================================================

class UserManagementViewSet(ModelViewSet):
    """
    ViewSet for user management (Admin only)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'email', 'date_joined', 'role']
    ordering = ['username']
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """
        Toggle user active status
        """
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        
        status_text = 'activated' if user.is_active else 'deactivated'
        return Response({'message': f'User {status_text} successfully'})
    
    @action(detail=True, methods=['post'])
    def change_role(self, request, pk=None):
        """
        Change user role
        """
        user = self.get_object()
        new_role = request.data.get('role')
        
        if new_role not in ['customer', 'agent', 'admin']:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.role = new_role
        user.save()
        
        return Response({'message': f'User role changed to {new_role}'})


# ============================================================================
# Notification Views
# ============================================================================

class NotificationViewSet(ModelViewSet):
    """
    ViewSet for managing user notifications
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """
        Mark notification as read
        """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """
        Mark all notifications as read
        """
        count = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': f'{count} notifications marked as read'})


# ============================================================================
# API Root View
# ============================================================================

@api_view(['GET'])
def api_root(request):
    """
    API Root endpoint that provides information about available endpoints.
    """
    return Response({
        'message': 'Welcome to QuickDesk API',
        'version': '1.0',
        'endpoints': {
            'authentication': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
                'profile': '/api/auth/profile/',
            },
            'tickets': {
                'list': '/api/tickets/',
                'create': '/api/tickets/',
                'detail': '/api/tickets/{id}/',
                'search': '/api/tickets/search/',
            },
            'categories': '/api/categories/',
            'priorities': '/api/priorities/',
            'dashboard': '/api/dashboard/stats/',
            'notifications': '/api/notifications/',
            'admin': {
                'users': '/api/admin/users/',
            }
        }
    })