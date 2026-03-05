#!/bin/sh
set -e

# Initialise postgres data dir if first run
if [ ! -f /var/lib/postgresql/data/PG_VERSION ]; then
  echo "Initialising PostgreSQL data directory..."
  su-exec postgres initdb -D /var/lib/postgresql/data
fi

# Start postgres in background
echo "Starting PostgreSQL..."
su-exec postgres pg_ctl -D /var/lib/postgresql/data -l /tmp/postgres.log start

# Wait until postgres is ready
until pg_isready -U postgres -h localhost; do
  echo "Waiting for postgres to be ready..."
  sleep 1
done

# Create database if it doesn't exist
su-exec postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='team4db'" | grep -q 1 || \
  su-exec postgres psql -c "CREATE DATABASE team4db;"

# Set password for postgres user
su-exec postgres psql -c "ALTER USER postgres PASSWORD 'team4pass';"

export DATABASE_URL="postgresql://postgres:team4pass@localhost:5432/team4db"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx tsx prisma/seed.ts

echo "Starting application..."
exec npx tsx src/index.ts
