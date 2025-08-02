from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from app.core.models import Category, Priority

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate default data for QuickDesk'

    def handle(self, *args, **options):
        # Create default priorities
        priorities_data = [
            {'name': 'low', 'level': 1, 'color': '#10B981'},
            {'name': 'medium', 'level': 2, 'color': '#F59E0B'},
            {'name': 'high', 'level': 3, 'color': '#EF4444'},
            {'name': 'urgent', 'level': 4, 'color': '#DC2626'},
        ]

        for priority_data in priorities_data:
            priority, created = Priority.objects.get_or_create(
                name=priority_data['name'],
                defaults=priority_data
            )
            if created:
                self.stdout.write(f"Created priority: {priority.name}")

        # Create a default admin user if it doesn't exist
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_superuser': True,
                'is_staff': True,
                'is_active': True,
            }
        )
        if created:
            admin_user.set_password('adminpassword')
            admin_user.save()
            self.stdout.write(f"Created admin user: {admin_user.username}")

        # Create default categories only if admin user exists
        if admin_user:
            categories_data = [
                {'name': 'General Support', 'description': 'General help and support requests', 'color': '#3B82F6'},
                {'name': 'Technical Issue', 'description': 'Technical problems and bugs', 'color': '#EF4444'},
                {'name': 'Feature Request', 'description': 'New feature requests and suggestions', 'color': '#10B981'},
                {'name': 'Account Issue', 'description': 'Account-related problems', 'color': '#F59E0B'},
            ]

            for category_data in categories_data:
                category, created = Category.objects.get_or_create(
                    name=category_data['name'],
                    defaults={
                        **category_data,
                        'created_by': admin_user,
                    }
                )
                if created:
                    self.stdout.write(f"Created category: {category.name}")

        self.stdout.write(self.style.SUCCESS('Successfully populated default data'))
