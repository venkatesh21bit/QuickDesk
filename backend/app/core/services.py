"""
Service classes for QuickDesk business logic
"""
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
from .models import Notification, User


class EmailService:
    """
    Service for sending email notifications
    """
    
    @staticmethod
    def send_ticket_created_email(ticket):
        """
        Send email notification when a ticket is created
        """
        if not settings.QUICKDESK_SETTINGS.get('ENABLE_EMAIL_NOTIFICATIONS', True):
            return
        
        # Get recipients
        recipients = []
        
        # Add ticket creator
        if ticket.created_by.email_notifications and ticket.created_by.email:
            recipients.append(ticket.created_by.email)
        
        # Add all agents if no specific assignment
        if not ticket.assigned_to:
            agents = User.objects.filter(
                role='agent', 
                is_active=True, 
                email_notifications=True,
                email__isnull=False
            ).exclude(email='')
            recipients.extend([agent.email for agent in agents])
        
        # Add assigned agent
        elif ticket.assigned_to and ticket.assigned_to.email_notifications and ticket.assigned_to.email:
            recipients.append(ticket.assigned_to.email)
        
        if not recipients:
            return
        
        # Prepare email content
        context = {
            'ticket': ticket,
            'site_name': settings.QUICKDESK_SETTINGS.get('SITE_NAME', 'QuickDesk'),
            'site_url': settings.QUICKDESK_SETTINGS.get('SITE_URL', 'http://localhost:3000'),
        }
        
        subject = f"New Ticket Created: {ticket.ticket_number} - {ticket.subject}"
        html_message = render_to_string('emails/ticket_created.html', context)
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=recipients,
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            # Log error (you might want to use proper logging here)
            print(f"Failed to send email: {e}")
    
    @staticmethod
    def send_ticket_updated_email(ticket, updated_by, changes):
        """
        Send email notification when a ticket is updated
        """
        if not settings.QUICKDESK_SETTINGS.get('ENABLE_EMAIL_NOTIFICATIONS', True):
            return
        
        recipients = []
        
        # Add ticket creator (if not the one making the update)
        if (ticket.created_by != updated_by and 
            ticket.created_by.email_notifications and 
            ticket.created_by.email):
            recipients.append(ticket.created_by.email)
        
        # Add assigned agent (if not the one making the update)
        if (ticket.assigned_to and 
            ticket.assigned_to != updated_by and 
            ticket.assigned_to.email_notifications and 
            ticket.assigned_to.email):
            recipients.append(ticket.assigned_to.email)
        
        if not recipients:
            return
        
        context = {
            'ticket': ticket,
            'updated_by': updated_by,
            'changes': changes,
            'site_name': settings.QUICKDESK_SETTINGS.get('SITE_NAME', 'QuickDesk'),
            'site_url': settings.QUICKDESK_SETTINGS.get('SITE_URL', 'http://localhost:3000'),
        }
        
        subject = f"Ticket Updated: {ticket.ticket_number} - {ticket.subject}"
        html_message = render_to_string('emails/ticket_updated.html', context)
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=recipients,
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")
    
    @staticmethod
    def send_comment_added_email(comment):
        """
        Send email notification when a comment is added
        """
        if not settings.QUICKDESK_SETTINGS.get('ENABLE_EMAIL_NOTIFICATIONS', True):
            return
        
        if comment.is_internal:
            # Only send to agents/admins for internal comments
            recipients = []
            agents_admins = User.objects.filter(
                role__in=['agent', 'admin'],
                is_active=True,
                email_notifications=True,
                email__isnull=False
            ).exclude(email='').exclude(id=comment.created_by.id)
            recipients.extend([user.email for user in agents_admins])
        else:
            # Send to all stakeholders for public comments
            recipients = []
            
            # Add ticket creator (if not the commenter)
            if (comment.ticket.created_by != comment.created_by and 
                comment.ticket.created_by.email_notifications and 
                comment.ticket.created_by.email):
                recipients.append(comment.ticket.created_by.email)
            
            # Add assigned agent (if not the commenter)
            if (comment.ticket.assigned_to and 
                comment.ticket.assigned_to != comment.created_by and 
                comment.ticket.assigned_to.email_notifications and 
                comment.ticket.assigned_to.email):
                recipients.append(comment.ticket.assigned_to.email)
        
        if not recipients:
            return
        
        context = {
            'comment': comment,
            'ticket': comment.ticket,
            'site_name': settings.QUICKDESK_SETTINGS.get('SITE_NAME', 'QuickDesk'),
            'site_url': settings.QUICKDESK_SETTINGS.get('SITE_URL', 'http://localhost:3000'),
        }
        
        subject = f"New Comment on Ticket: {comment.ticket.ticket_number}"
        html_message = render_to_string('emails/comment_added.html', context)
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=recipients,
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")


class NotificationService:
    """
    Service for creating in-app notifications
    """
    
    @staticmethod
    def create_ticket_notification(ticket, notification_type, recipient):
        """
        Create a notification for ticket events
        """
        title_map = {
            'ticket_created': f"New ticket created: {ticket.ticket_number}",
            'ticket_assigned': f"Ticket assigned to you: {ticket.ticket_number}",
            'ticket_updated': f"Ticket updated: {ticket.ticket_number}",
            'status_changed': f"Ticket status changed: {ticket.ticket_number}",
        }
        
        message_map = {
            'ticket_created': f"A new ticket '{ticket.subject}' has been created by {ticket.created_by.get_full_name() or ticket.created_by.username}",
            'ticket_assigned': f"The ticket '{ticket.subject}' has been assigned to you",
            'ticket_updated': f"The ticket '{ticket.subject}' has been updated",
            'status_changed': f"The status of ticket '{ticket.subject}' has been changed to {ticket.get_status_display()}",
        }
        
        Notification.objects.create(
            user=recipient,
            ticket=ticket,
            notification_type=notification_type,
            title=title_map.get(notification_type, f"Ticket notification: {ticket.ticket_number}"),
            message=message_map.get(notification_type, f"Update on ticket: {ticket.subject}")
        )
    
    @staticmethod
    def create_comment_notification(comment, recipient):
        """
        Create a notification for new comments
        """
        Notification.objects.create(
            user=recipient,
            ticket=comment.ticket,
            notification_type='comment_added',
            title=f"New comment on ticket: {comment.ticket.ticket_number}",
            message=f"{comment.created_by.get_full_name() or comment.created_by.username} added a comment to '{comment.ticket.subject}'"
        )


class TicketService:
    """
    Service for ticket-related business logic
    """
    
    @staticmethod
    def create_ticket(validated_data, user):
        """
        Create a new ticket with notifications
        """
        from .models import Ticket, TicketActivity
        
        ticket = Ticket.objects.create(**validated_data, created_by=user)
        
        # Create activity record
        TicketActivity.objects.create(
            ticket=ticket,
            user=user,
            action='created',
            description=f"Ticket created by {user.username}"
        )
        
        # Send email notifications
        EmailService.send_ticket_created_email(ticket)
        
        # Create in-app notifications for agents
        if user.role == 'customer':
            agents = User.objects.filter(role='agent', is_active=True)
            for agent in agents:
                NotificationService.create_ticket_notification(
                    ticket, 'ticket_created', agent
                )
        
        return ticket
    
    @staticmethod
    def update_ticket(ticket, validated_data, user):
        """
        Update a ticket with change tracking and notifications
        """
        from .models import TicketActivity
        
        # Track changes
        changes = []
        for field, new_value in validated_data.items():
            old_value = getattr(ticket, field)
            if old_value != new_value:
                changes.append({
                    'field': field,
                    'old_value': str(old_value) if old_value else None,
                    'new_value': str(new_value) if new_value else None
                })
        
        # Update the ticket
        for field, value in validated_data.items():
            setattr(ticket, field, value)
        ticket.save()
        
        # Create activity records for changes
        for change in changes:
            TicketActivity.objects.create(
                ticket=ticket,
                user=user,
                action=f"{change['field']}_changed",
                description=f"{change['field'].replace('_', ' ').title()} changed",
                old_value=change['old_value'],
                new_value=change['new_value']
            )
        
        # Send notifications if there were changes
        if changes:
            # Send email notifications
            EmailService.send_ticket_updated_email(ticket, user, changes)
            
            # Create in-app notifications
            recipients = []
            
            # Notify ticket creator (if not the updater)
            if ticket.created_by != user:
                recipients.append(ticket.created_by)
            
            # Notify assigned agent (if not the updater)
            if ticket.assigned_to and ticket.assigned_to != user:
                recipients.append(ticket.assigned_to)
            
            for recipient in recipients:
                if any(change['field'] == 'status' for change in changes):
                    NotificationService.create_ticket_notification(
                        ticket, 'status_changed', recipient
                    )
                else:
                    NotificationService.create_ticket_notification(
                        ticket, 'ticket_updated', recipient
                    )
        
        return ticket
    
    @staticmethod
    def assign_ticket(ticket, agent, assigned_by):
        """
        Assign a ticket to an agent with notifications
        """
        from .models import TicketActivity
        
        old_assignee = ticket.assigned_to
        ticket.assigned_to = agent
        ticket.save()
        
        # Create activity record
        TicketActivity.objects.create(
            ticket=ticket,
            user=assigned_by,
            action='assigned',
            description=f"Ticket assigned to {agent.username}",
            old_value=old_assignee.username if old_assignee else None,
            new_value=agent.username
        )
        
        # Send notifications
        NotificationService.create_ticket_notification(
            ticket, 'ticket_assigned', agent
        )
        
        # Notify ticket creator about assignment
        if ticket.created_by != assigned_by and ticket.created_by != agent:
            NotificationService.create_ticket_notification(
                ticket, 'ticket_updated', ticket.created_by
            )
        
        return ticket
    
    @staticmethod
    def add_comment(ticket, content, comment_type, user, is_internal=False):
        """
        Add a comment to a ticket with notifications
        """
        from .models import TicketComment, TicketActivity
        
        comment = TicketComment.objects.create(
            ticket=ticket,
            created_by=user,
            content=content,
            comment_type=comment_type,
            is_internal=is_internal
        )
        
        # Create activity record
        TicketActivity.objects.create(
            ticket=ticket,
            user=user,
            action='comment_added',
            description=f"Comment added by {user.username}"
        )
        
        # Send notifications
        EmailService.send_comment_added_email(comment)
        
        # Create in-app notifications
        recipients = []
        
        if is_internal:
            # For internal comments, notify agents/admins only
            agents_admins = User.objects.filter(
                role__in=['agent', 'admin'],
                is_active=True
            ).exclude(id=user.id)
            recipients.extend(agents_admins)
        else:
            # For public comments, notify all stakeholders
            if ticket.created_by != user:
                recipients.append(ticket.created_by)
            
            if ticket.assigned_to and ticket.assigned_to != user:
                recipients.append(ticket.assigned_to)
        
        for recipient in recipients:
            NotificationService.create_comment_notification(comment, recipient)
        
        return comment
