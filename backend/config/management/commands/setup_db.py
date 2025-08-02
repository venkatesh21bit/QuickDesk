from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Initialize the database with migrations and create a superuser'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset the database before setup',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write(
                self.style.WARNING('Resetting database...')
            )
            # Note: This would require additional implementation for PostgreSQL

        self.stdout.write(
            self.style.SUCCESS('Starting database setup...')
        )

        # Run migrations
        self.stdout.write('Running migrations...')
        call_command('makemigrations')
        call_command('migrate')

        # Create superuser if it doesn't exist
        if not User.objects.filter(is_superuser=True).exists():
            self.stdout.write('Creating superuser...')
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123'
            )
            self.stdout.write(
                self.style.SUCCESS(
                    'Superuser created successfully!\n'
                    'Username: admin\n'
                    'Password: admin123\n'
                    'Please change the password after first login.'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING('Superuser already exists.')
            )

        # Collect static files
        self.stdout.write('Collecting static files...')
        call_command('collectstatic', '--noinput')

        self.stdout.write(
            self.style.SUCCESS(
                'Database setup completed successfully!\n'
                'You can now run: python manage.py runserver'
            )
        )
