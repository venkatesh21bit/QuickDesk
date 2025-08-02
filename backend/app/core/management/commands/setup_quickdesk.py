"""
Management command to set up initial data for QuickDesk
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from app.core.models import Priority, Category

User = get_user_model()


class Command(BaseCommand):
    help = 'Setup initial data for QuickDesk including priorities, categories, and admin user'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-superuser',
            action='store_true',
            help='Skip creating superuser',
        )
    
    def handle(self, *args, **options):
        self.stdout.write('Setting up QuickDesk initial data...')
        
        # Create priorities
        self.setup_priorities()
        
        # Create default categories
        self.setup_categories()
        
        # Create superuser
        if not options['skip_superuser']:
            self.create_superuser()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully set up QuickDesk initial data!')
        )
    
    def setup_priorities(self):
        """Create default priorities"""
        priorities = [
            {'name': 'low', 'level': 1, 'color': '#6B7280'},
            {'name': 'medium', 'level': 2, 'color': '#10B981'},
            {'name': 'high', 'level': 3, 'color': '#F59E0B'},
            {'name': 'urgent', 'level': 4, 'color': '#DC2626'},
        ]
        
        for priority_data in priorities:
            priority, created = Priority.objects.get_or_create(
                name=priority_data['name'],
                defaults={
                    'level': priority_data['level'],
                    'color': priority_data['color']
                }
            )
            if created:
                self.stdout.write(f'Created priority: {priority.get_name_display()}')
            else:
                self.stdout.write(f'Priority already exists: {priority.get_name_display()}')
    
    def setup_categories(self):
        """Create default categories"""
        # Create admin user first to assign as category creator
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@quickdesk.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
        
        categories = [
            {'name': 'Technical Support', 'description': 'Hardware and software technical issues', 'color': '#3B82F6'},
            {'name': 'Account Issues', 'description': 'User account and login problems', 'color': '#10B981'},
            {'name': 'Billing', 'description': 'Payment and billing inquiries', 'color': '#F59E0B'},
            {'name': 'Feature Request', 'description': 'New feature suggestions and requests', 'color': '#8B5CF6'},
            {'name': 'Bug Report', 'description': 'Software bugs and issues', 'color': '#DC2626'},
            {'name': 'General Inquiry', 'description': 'General questions and information requests', 'color': '#6B7280'},
        ]
        
        for category_data in categories:
            category, created = Category.objects.get_or_create(
                name=category_data['name'],
                defaults={
                    'description': category_data['description'],
                    'color': category_data['color'],
                    'created_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')
            else:
                self.stdout.write(f'Category already exists: {category.name}')
    
    def create_superuser(self):
        """Create superuser if it doesn't exist"""
        if not User.objects.filter(is_superuser=True).exists():
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@quickdesk.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin',
                is_staff=True,
                is_superuser=True,
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'Created superuser: {admin_user.username} (password: admin123)'
                )
            )
        else:
            self.stdout.write('Superuser already exists')
