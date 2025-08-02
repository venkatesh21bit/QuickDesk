"""
Management command to create sample tickets for testing
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from app.core.models import Priority, Category, Ticket
from app.core.services import TicketService
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Create sample tickets for testing QuickDesk'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=10,
            help='Number of sample tickets to create (default: 10)',
        )
    
    def handle(self, *args, **options):
        count = options['count']
        
        # Check if we have required data
        if not Priority.objects.exists():
            self.stdout.write(
                self.style.ERROR('No priorities found. Run: python manage.py setup_quickdesk')
            )
            return
        
        if not Category.objects.exists():
            self.stdout.write(
                self.style.ERROR('No categories found. Run: python manage.py setup_quickdesk')
            )
            return
        
        # Create sample users if they don't exist
        self.create_sample_users()
        
        # Create sample tickets
        self.create_sample_tickets(count)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {count} sample tickets!')
        )
    
    def create_sample_users(self):
        """Create sample users for testing"""
        users_data = [
            {
                'username': 'john_customer',
                'email': 'john@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'customer'
            },
            {
                'username': 'jane_customer',
                'email': 'jane@example.com',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'customer'
            },
            {
                'username': 'bob_agent',
                'email': 'bob@quickdesk.com',
                'first_name': 'Bob',
                'last_name': 'Wilson',
                'role': 'agent'
            },
            {
                'username': 'alice_agent',
                'email': 'alice@quickdesk.com',
                'first_name': 'Alice',
                'last_name': 'Johnson',
                'role': 'agent'
            },
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    **user_data,
                    'password': 'password123'
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'Created user: {user.username}')
    
    def create_sample_tickets(self, count):
        """Create sample tickets"""
        customers = User.objects.filter(role='customer')
        agents = User.objects.filter(role='agent')
        priorities = list(Priority.objects.all())
        categories = list(Category.objects.all())
        
        if not customers.exists():
            self.stdout.write(self.style.ERROR('No customer users found'))
            return
        
        sample_tickets = [
            {
                'subject': 'Unable to login to my account',
                'description': 'I am getting an error message when trying to login. It says "Invalid credentials" but I am sure my password is correct.',
                'status': 'open'
            },
            {
                'subject': 'Software crashes when opening large files',
                'description': 'The application crashes consistently when I try to open files larger than 100MB. This is affecting my productivity.',
                'status': 'in_progress'
            },
            {
                'subject': 'Request for new reporting feature',
                'description': 'We need a feature to generate monthly reports with custom date ranges and export options.',
                'status': 'open'
            },
            {
                'subject': 'Billing discrepancy in last invoice',
                'description': 'I noticed that my last invoice includes charges that I believe are incorrect. Can someone review this?',
                'status': 'resolved'
            },
            {
                'subject': 'Email notifications not working',
                'description': 'I am not receiving email notifications for updates to my tickets. My email preferences are set correctly.',
                'status': 'open'
            },
            {
                'subject': 'Password reset link expired',
                'description': 'The password reset link I received has expired. Can you send me a new one?',
                'status': 'closed'
            },
            {
                'subject': 'Mobile app performance issues',
                'description': 'The mobile app is very slow and sometimes crashes on my device. Using iPhone 12 with latest iOS.',
                'status': 'in_progress'
            },
            {
                'subject': 'Feature request: Dark mode',
                'description': 'It would be great to have a dark mode option in the application for better user experience.',
                'status': 'open'
            },
            {
                'subject': 'API rate limiting too restrictive',
                'description': 'The current API rate limits are too low for our integration needs. Can we discuss increasing them?',
                'status': 'open'
            },
            {
                'subject': 'Data export functionality missing',
                'description': 'I need to export my data but cannot find this option anywhere in the interface.',
                'status': 'resolved'
            },
        ]
        
        created_count = 0
        
        for i in range(count):
            # Use sample ticket data or generate generic ones
            if i < len(sample_tickets):
                ticket_data = sample_tickets[i]
            else:
                ticket_data = {
                    'subject': f'Sample Ticket #{i + 1}',
                    'description': f'This is a sample ticket created for testing purposes. Ticket number {i + 1}.',
                    'status': random.choice(['open', 'in_progress', 'resolved', 'closed'])
                }
            
            # Select random customer, priority, and category
            customer = random.choice(customers)
            priority = random.choice(priorities)
            category = random.choice(categories)
            
            # Randomly assign to agent (50% chance)
            assigned_to = random.choice(agents) if agents.exists() and random.random() > 0.5 else None
            
            # Create ticket using the service
            validated_data = {
                'subject': ticket_data['subject'],
                'description': ticket_data['description'],
                'priority': priority,
                'category': category,
                'status': ticket_data.get('status', 'open'),
            }
            
            if assigned_to:
                validated_data['assigned_to'] = assigned_to
            
            try:
                ticket = TicketService.create_ticket(validated_data, customer)
                created_count += 1
                self.stdout.write(f'Created ticket: {ticket.ticket_number} - {ticket.subject}')
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to create ticket: {e}')
                )
        
        self.stdout.write(f'Created {created_count} tickets successfully')
