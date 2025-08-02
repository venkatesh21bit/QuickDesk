#!/bin/bash

# Exit on any error
set -e

echo "Starting QuickDesk Backend Deployment..."

# Check if we're in production
if [ "$RAILWAY_ENVIRONMENT" = "production" ]; then
    echo "Production environment detected"
    export DEBUG=False
else
    echo "Development environment"
    export DEBUG=True
fi

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Create default data (allow it to fail gracefully)
echo "Populating default data..."
python manage.py populate_defaults || echo "Warning: populate_defaults failed, continuing..."

# Collect static files for production
if [ "$RAILWAY_ENVIRONMENT" = "production" ]; then
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
fi

# Start the application server
echo "Starting Gunicorn server..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WEB_CONCURRENCY:-2} \
    --timeout 120 \
    --log-file - \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    --preload
