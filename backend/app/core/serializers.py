from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import (
    User, Category, Priority, Ticket, TicketComment, 
    TicketAttachment, TicketVote, TicketActivity, 
    Notification, UserProfile
)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 
                 'password_confirm', 'role', 'phone', 'department']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create user profile
        UserProfile.objects.create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password.')


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information
    """
    class Meta:
        model = UserProfile
        fields = ['avatar', 'bio', 'location', 'timezone', 
                 'email_on_ticket_created', 'email_on_ticket_updated',
                 'email_on_comment_added', 'email_on_assignment']


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user information
    """
    profile = UserProfileSerializer(read_only=True)
    tickets_created_count = serializers.SerializerMethodField()
    tickets_assigned_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'role', 'phone', 'department', 'is_active', 'date_joined',
                 'profile', 'tickets_created_count', 'tickets_assigned_count']
        read_only_fields = ['id', 'date_joined']
    
    def get_tickets_created_count(self, obj):
        return obj.tickets_created.count()
    
    def get_tickets_assigned_count(self, obj):
        if obj.role == 'agent':
            return obj.tickets_assigned.count()
        return 0


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for ticket categories
    """
    tickets_count = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'color', 'is_active', 
                 'tickets_count', 'created_by_username', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_tickets_count(self, obj):
        return obj.tickets.count()


class PrioritySerializer(serializers.ModelSerializer):
    """
    Serializer for ticket priorities
    """
    tickets_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Priority
        fields = ['id', 'name', 'level', 'color', 'tickets_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_tickets_count(self, obj):
        return obj.tickets.count()


class TicketAttachmentSerializer(serializers.ModelSerializer):
    """
    Serializer for ticket attachments
    """
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TicketAttachment
        fields = ['id', 'file', 'file_url', 'original_filename', 'file_size', 
                 'content_type', 'uploaded_by_username', 'created_at']
        read_only_fields = ['id', 'file_size', 'content_type', 'created_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None


class TicketCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for ticket comments
    """
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    created_by_role = serializers.CharField(source='created_by.role', read_only=True)
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = TicketComment
        fields = ['id', 'comment_type', 'content', 'is_internal', 
                 'created_by_username', 'created_by_role', 'attachments',
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TicketVoteSerializer(serializers.ModelSerializer):
    """
    Serializer for ticket votes
    """
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = TicketVote
        fields = ['id', 'vote_type', 'user_username', 'created_at']
        read_only_fields = ['id', 'created_at']


class TicketActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for ticket activities
    """
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = TicketActivity
        fields = ['id', 'action', 'description', 'old_value', 'new_value',
                 'user_username', 'created_at']
        read_only_fields = ['id', 'created_at']


class TicketListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for ticket lists
    """
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    priority_name = serializers.CharField(source='priority.name', read_only=True)
    priority_level = serializers.IntegerField(source='priority.level', read_only=True)
    comments_count = serializers.SerializerMethodField()
    attachments_count = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket
        fields = ['id', 'ticket_number', 'subject', 'status', 'created_by_username',
                 'assigned_to_username', 'category_name', 'category_color',
                 'priority_name', 'priority_level', 'upvotes', 'downvotes',
                 'comments_count', 'attachments_count', 'user_vote',
                 'created_at', 'updated_at', 'resolved_at', 'is_internal']
        read_only_fields = ['id', 'ticket_number', 'created_at', 'updated_at']
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_attachments_count(self, obj):
        return obj.attachments.count()
    
    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            vote = obj.votes.filter(user=request.user).first()
            return vote.vote_type if vote else None
        return None


class TicketDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for individual tickets
    """
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    priority = PrioritySerializer(read_only=True)
    comments = TicketCommentSerializer(many=True, read_only=True)
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    activities = TicketActivitySerializer(many=True, read_only=True)
    user_vote = serializers.SerializerMethodField()
    response_time = serializers.SerializerMethodField()
    resolution_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket
        fields = ['id', 'ticket_number', 'subject', 'description', 'status',
                 'created_by', 'assigned_to', 'category', 'priority',
                 'upvotes', 'downvotes', 'user_vote', 'tags', 'is_internal',
                 'comments', 'attachments', 'activities',
                 'response_time', 'resolution_time',
                 'created_at', 'updated_at', 'resolved_at', 'closed_at']
        read_only_fields = ['id', 'ticket_number', 'upvotes', 'downvotes',
                           'created_at', 'updated_at', 'resolved_at', 'closed_at']
    
    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            vote = obj.votes.filter(user=request.user).first()
            return vote.vote_type if vote else None
        return None
    
    def get_response_time(self, obj):
        response_time = obj.response_time
        if response_time:
            return str(response_time)
        return None
    
    def get_resolution_time(self, obj):
        resolution_time = obj.resolution_time
        if resolution_time:
            return str(resolution_time)
        return None


class TicketCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating tickets
    """
    class Meta:
        model = Ticket
        fields = ['subject', 'description', 'category', 'priority', 'tags', 'is_internal']


class TicketUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating tickets
    """
    class Meta:
        model = Ticket
        fields = ['subject', 'description', 'status', 'assigned_to', 
                 'category', 'priority', 'tags']
    
    def update(self, instance, validated_data):
        # Use the service to update ticket with notifications
        from .services import TicketService
        
        request = self.context.get('request')
        return TicketService.update_ticket(instance, validated_data, request.user)


class CommentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating comments
    """
    class Meta:
        model = TicketComment
        fields = ['content', 'comment_type', 'is_internal']
    
    def create(self, validated_data):
        from .services import TicketService
        
        # Get ticket from context
        ticket_id = self.context['ticket_id']
        ticket = Ticket.objects.get(id=ticket_id)
        
        # Use service to add comment with notifications
        comment = TicketService.add_comment(
            ticket=ticket,
            content=validated_data['content'],
            comment_type=validated_data.get('comment_type', 'comment'),
            user=self.context['request'].user,
            is_internal=validated_data.get('is_internal', False)
        )
        
        return comment


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for user notifications
    """
    ticket_number = serializers.CharField(source='ticket.ticket_number', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 'is_read',
                 'ticket_number', 'created_at']
        read_only_fields = ['id', 'created_at']


class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer for dashboard statistics
    """
    total_tickets = serializers.IntegerField()
    open_tickets = serializers.IntegerField()
    in_progress_tickets = serializers.IntegerField()
    resolved_tickets = serializers.IntegerField()
    closed_tickets = serializers.IntegerField()
    my_tickets = serializers.IntegerField(required=False)
    assigned_tickets = serializers.IntegerField(required=False)
    urgent_tickets = serializers.IntegerField()
    avg_response_time = serializers.CharField(required=False)
    avg_resolution_time = serializers.CharField(required=False)


class TicketSearchSerializer(serializers.Serializer):
    """
    Serializer for ticket search parameters
    """
    q = serializers.CharField(required=False, help_text="Search query")
    status = serializers.MultipleChoiceField(
        choices=Ticket.STATUS_CHOICES, 
        required=False,
        help_text="Filter by status"
    )
    category = serializers.UUIDField(required=False, help_text="Filter by category ID")
    priority = serializers.UUIDField(required=False, help_text="Filter by priority ID")
    assigned_to = serializers.UUIDField(required=False, help_text="Filter by assigned agent ID")
    created_by = serializers.UUIDField(required=False, help_text="Filter by creator ID")
    my_tickets = serializers.BooleanField(default=False, help_text="Show only my tickets")
    date_from = serializers.DateTimeField(required=False, help_text="Filter from date")
    date_to = serializers.DateTimeField(required=False, help_text="Filter to date")
    sort_by = serializers.ChoiceField(
        choices=[
            'created_at', '-created_at',
            'updated_at', '-updated_at',
            'priority__level', '-priority__level',
            'status', '-status',
            'upvotes', '-upvotes'
        ],
        default='-created_at',
        help_text="Sort by field"
    )