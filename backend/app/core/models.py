from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils import timezone
import uuid


class User(AbstractUser):
    """
    Custom User model for QuickDesk with role-based access
    """
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('agent', 'Support Agent'),
        ('admin', 'Administrator'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=15, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Email notifications preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_customer(self):
        return self.role == 'customer'
    
    @property
    def is_agent(self):
        return self.role == 'agent'
    
    @property
    def is_admin(self):
        return self.role == 'admin'


class Category(models.Model):
    """
    Ticket categories for organization and routing
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#3B82F6")  # Hex color code
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Priority(models.Model):
    """
    Priority levels for tickets
    """
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=20, choices=PRIORITY_CHOICES, unique=True)
    level = models.IntegerField(unique=True)  # 1=Low, 2=Medium, 3=High, 4=Urgent
    color = models.CharField(max_length=7, default="#6B7280")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['level']
        verbose_name_plural = "Priorities"
    
    def __str__(self):
        return self.get_name_display()


class Ticket(models.Model):
    """
    Main ticket model for help desk system
    """
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_number = models.CharField(max_length=20, unique=True, editable=False)
    subject = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    
    # Relationships
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets_created')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                   related_name='tickets_assigned', limit_choices_to={'role': 'agent'})
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='tickets')
    priority = models.ForeignKey(Priority, on_delete=models.CASCADE, related_name='tickets')
    
    # Voting system
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    is_internal = models.BooleanField(default=False)  # Internal tickets created by agents/admins
    tags = models.JSONField(default=list, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['assigned_to', 'status']),
            models.Index(fields=['created_by', 'status']),
            models.Index(fields=['category', 'status']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.ticket_number:
            # Generate ticket number like TICK-001, TICK-002, etc.
            last_ticket = Ticket.objects.filter(ticket_number__startswith='TICK-').order_by('ticket_number').last()
            if last_ticket:
                last_number = int(last_ticket.ticket_number.split('-')[1])
                new_number = last_number + 1
            else:
                new_number = 1
            self.ticket_number = f"TICK-{new_number:03d}"
        
        # Auto-set resolved_at and closed_at timestamps
        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()
        elif self.status == 'closed' and not self.closed_at:
            self.closed_at = timezone.now()
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.ticket_number} - {self.subject}"
    
    @property
    def is_open(self):
        return self.status in ['open', 'in_progress']
    
    @property
    def response_time(self):
        """Calculate response time from creation to first agent comment"""
        first_comment = self.comments.filter(created_by__role='agent').first()
        if first_comment:
            return first_comment.created_at - self.created_at
        return None
    
    @property
    def resolution_time(self):
        """Calculate resolution time from creation to resolved status"""
        if self.resolved_at:
            return self.resolved_at - self.created_at
        return None


class TicketComment(models.Model):
    """
    Comments/updates on tickets
    """
    COMMENT_TYPES = [
        ('comment', 'Comment'),
        ('internal_note', 'Internal Note'),
        ('status_update', 'Status Update'),
        ('assignment', 'Assignment'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    comment_type = models.CharField(max_length=20, choices=COMMENT_TYPES, default='comment')
    content = models.TextField()
    is_internal = models.BooleanField(default=False)  # Only visible to agents/admins
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment on {self.ticket.ticket_number} by {self.created_by.username}"


class TicketAttachment(models.Model):
    """
    File attachments for tickets and comments
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='attachments', null=True, blank=True)
    comment = models.ForeignKey(TicketComment, on_delete=models.CASCADE, related_name='attachments', null=True, blank=True)
    file = models.FileField(upload_to='tickets/attachments/%Y/%m/%d/')
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    content_type = models.CharField(max_length=100)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def clean(self):
        # Validate that attachment is linked to either ticket or comment
        if not self.ticket and not self.comment:
            raise ValidationError("Attachment must be linked to either a ticket or comment")
        if self.ticket and self.comment:
            raise ValidationError("Attachment cannot be linked to both ticket and comment")
    
    def __str__(self):
        return f"{self.original_filename} - {self.ticket or self.comment}"


class TicketVote(models.Model):
    """
    User votes on tickets (upvote/downvote)
    """
    VOTE_CHOICES = [
        ('up', 'Upvote'),
        ('down', 'Downvote'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ticket_votes')
    vote_type = models.CharField(max_length=4, choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['ticket', 'user']  # One vote per user per ticket
    
    def save(self, *args, **kwargs):
        # Update ticket vote counts
        super().save(*args, **kwargs)
        self.update_ticket_vote_counts()
    
    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.update_ticket_vote_counts()
    
    def update_ticket_vote_counts(self):
        """Update the vote counts on the related ticket"""
        upvotes = TicketVote.objects.filter(ticket=self.ticket, vote_type='up').count()
        downvotes = TicketVote.objects.filter(ticket=self.ticket, vote_type='down').count()
        
        Ticket.objects.filter(id=self.ticket.id).update(
            upvotes=upvotes,
            downvotes=downvotes
        )


class TicketActivity(models.Model):
    """
    Activity log for tickets (status changes, assignments, etc.)
    """
    ACTION_CHOICES = [
        ('created', 'Ticket Created'),
        ('status_changed', 'Status Changed'),
        ('assigned', 'Assigned'),
        ('unassigned', 'Unassigned'),
        ('comment_added', 'Comment Added'),
        ('priority_changed', 'Priority Changed'),
        ('category_changed', 'Category Changed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ticket_activities')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    description = models.TextField()
    old_value = models.TextField(blank=True, null=True)
    new_value = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Ticket Activities"
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.ticket.ticket_number}"


class Notification(models.Model):
    """
    User notifications for ticket updates
    """
    NOTIFICATION_TYPES = [
        ('ticket_created', 'Ticket Created'),
        ('ticket_assigned', 'Ticket Assigned'),
        ('ticket_updated', 'Ticket Updated'),
        ('comment_added', 'Comment Added'),
        ('status_changed', 'Status Changed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class UserProfile(models.Model):
    """
    Extended user profile information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Notification preferences
    email_on_ticket_created = models.BooleanField(default=True)
    email_on_ticket_updated = models.BooleanField(default=True)
    email_on_comment_added = models.BooleanField(default=True)
    email_on_assignment = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"