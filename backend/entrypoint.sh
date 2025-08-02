#!/bin/bash
set -e  # Exit on any error
echo "🚀 ENTRYPOINT: Running Django migrations and starting server..."

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Populating default data..."
python manage.py populate_defaults || echo "Default data population skipped (may already exist)"

echo "Creating superuser..."
python manage.py shell < create_superuser.py || echo "Superuser creation skipped (may already exist)"

echo "Starting gunicorn with detailed logging..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --worker-class gthread \
    --worker-connections 1000 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --timeout 30 \
    --keep-alive 2 \
    --log-file - \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    --capture-output
