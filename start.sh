#!/bin/sh
set -e

cd backend

uv run --no-sync python manage.py migrate --noinput
uv run --no-sync python manage.py collectstatic --noinput

exec uv run --no-sync gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 2
