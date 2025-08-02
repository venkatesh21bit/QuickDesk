from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import (
    User, Category, Priority, Ticket, TicketComment, 
    TicketAttachment, TicketVote, TicketActivity, 
    Notification, UserProfile
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User admin
    """
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['username']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone', 'department', 'email_notifications', 'sms_notifications')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone', 'department', 'email_notifications', 'sms_notifications')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    User Profile admin
    """
    list_display = ['user', 'location', 'timezone', 'created_at']
    search_fields = ['user__username', 'user__email', 'location']
    list_filter = ['timezone', 'created_at']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Category admin
    """
    list_display = ['name', 'color_display', 'is_active', 'tickets_count', 'created_by', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 4px 8px; border-radius: 4px; color: white;">{}</span>',
            obj.color, obj.color
        )
    color_display.short_description = 'Color'
    
    def tickets_count(self, obj):
        return obj.tickets.count()
    tickets_count.short_description = 'Tickets'


@admin.register(Priority)
class PriorityAdmin(admin.ModelAdmin):
    """
    Priority admin
    """
    list_display = ['name', 'level', 'color_display', 'tickets_count', 'created_at']
    list_filter = ['name', 'level']
    ordering = ['level']
    readonly_fields = ['created_at']
    
    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 4px 8px; border-radius: 4px; color: white;">{}</span>',
            obj.color, obj.color
        )
    color_display.short_description = 'Color'
    
    def tickets_count(self, obj):
        return obj.tickets.count()
    tickets_count.short_description = 'Tickets'


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    """
    Ticket admin
    """
    list_display = ['ticket_number', 'subject', 'status_display', 'priority', 'category', 
                   'created_by', 'assigned_to', 'votes_display', 'created_at']
    list_filter = ['status', 'priority', 'category', 'is_internal', 'created_at']
    search_fields = ['ticket_number', 'subject', 'description', 'created_by__username']
    readonly_fields = ['ticket_number', 'created_at', 'updated_at', 'resolved_at', 'closed_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('ticket_number', 'subject', 'description', 'status')
        }),
        ('Assignment & Classification', {
            'fields': ('created_by', 'assigned_to', 'category', 'priority', 'tags')
        }),
        ('Metadata', {
            'fields': ('is_internal', 'upvotes', 'downvotes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'resolved_at', 'closed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_display(self, obj):
        colors = {
            'open': '#EF4444',
            'in_progress': '#F59E0B',
            'resolved': '#10B981',
            'closed': '#6B7280'
        }
        return format_html(
            '<span style="background-color: {}; padding: 2px 6px; border-radius: 12px; color: white; font-size: 12px;">{}</span>',
            colors.get(obj.status, '#6B7280'), obj.get_status_display()
        )
    status_display.short_description = 'Status'
    
    def votes_display(self, obj):
        return format_html(
            '<span style="color: green;">↑ {}</span> / <span style="color: red;">↓ {}</span>',
            obj.upvotes, obj.downvotes
        )
    votes_display.short_description = 'Votes'


@admin.register(TicketComment)
class TicketCommentAdmin(admin.ModelAdmin):
    """
    Ticket Comment admin
    """
    list_display = ['ticket', 'comment_type', 'created_by', 'is_internal', 'created_at']
    list_filter = ['comment_type', 'is_internal', 'created_at']
    search_fields = ['ticket__ticket_number', 'content', 'created_by__username']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(TicketAttachment)
class TicketAttachmentAdmin(admin.ModelAdmin):
    """
    Ticket Attachment admin
    """
    list_display = ['original_filename', 'ticket', 'comment', 'file_size_display', 
                   'content_type', 'uploaded_by', 'created_at']
    list_filter = ['content_type', 'created_at']
    search_fields = ['original_filename', 'ticket__ticket_number', 'uploaded_by__username']
    readonly_fields = ['file_size', 'content_type', 'created_at']
    
    def file_size_display(self, obj):
        """Display file size in human readable format"""
        size = obj.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    file_size_display.short_description = 'File Size'


@admin.register(TicketVote)
class TicketVoteAdmin(admin.ModelAdmin):
    """
    Ticket Vote admin
    """
    list_display = ['ticket', 'user', 'vote_type', 'created_at']
    list_filter = ['vote_type', 'created_at']
    search_fields = ['ticket__ticket_number', 'user__username']
    readonly_fields = ['created_at']


@admin.register(TicketActivity)
class TicketActivityAdmin(admin.ModelAdmin):
    """
    Ticket Activity admin
    """
    list_display = ['ticket', 'action', 'user', 'description', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['ticket__ticket_number', 'user__username', 'description']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """
    Notification admin
    """
    list_display = ['title', 'user', 'notification_type', 'is_read', 'ticket', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'message', 'user__username', 'ticket__ticket_number']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} notifications marked as read.')
    mark_as_read.short_description = 'Mark selected notifications as read'
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} notifications marked as unread.')
    mark_as_unread.short_description = 'Mark selected notifications as unread'


# Customize admin site headers
admin.site.site_header = 'QuickDesk Administration'
admin.site.site_title = 'QuickDesk Admin'
admin.site.index_title = 'QuickDesk Help Desk System'