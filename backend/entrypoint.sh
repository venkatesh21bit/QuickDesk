#!/bin/bash
set -e  # Exit on any error
echo "🚀 ENTRYPOINT: Running Django migrations and starting server..."

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Creating superuser..."
python manage.py shell < create_superuser.py || echo "Superuser creation skipped (may already exist)"

echo "Starting gunicorn..."
exec gunicorn main.wsgi:application --bind 0.0.0.0:$PORT
