#!/bin/sh
set -e

# Initialise postgres data dir if first run
if [ ! -f /var/lib/postgresql/data/PG_VERSION ]; then
  echo "Initialising PostgreSQL data directory..."
  # --auth-local=trust: allow local socket connections without password (for setup)
  # --auth-host=md5: require password for TCP connections (used by the app)
  su-exec postgres initdb -D /var/lib/postgresql/data \
    --auth-local=trust \
    --auth-host=md5
fi

# Start postgres in background, listening only on loopback TCP
echo "Starting PostgreSQL..."
su-exec postgres pg_ctl -D /var/lib/postgresql/data \
  -l /tmp/postgres.log \
  -o "-h 127.0.0.1" \
  start

# Wait until postgres is ready
until su-exec postgres pg_isready -U postgres -h 127.0.0.1; do
  echo "Waiting for postgres to be ready..."
  sleep 1
done

# Create database if it doesn't exist
su-exec postgres psql -h 127.0.0.1 -tc "SELECT 1 FROM pg_database WHERE datname='team4db'" | grep -q 1 || \
  su-exec postgres psql -h 127.0.0.1 -c "CREATE DATABASE team4db;"

# Set password for postgres user
su-exec postgres psql -h 127.0.0.1 -c "ALTER USER postgres PASSWORD 'team4pass';"

export DATABASE_URL="postgresql://postgres:team4pass@127.0.0.1:5432/team4db"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database..."
# Use || true so that a re-seed (unique constraint errors) does not crash the container
npx tsx prisma/seed.ts || echo "Seed step failed (data may already exist) — continuing..."

echo "Starting application..."
exec npx tsx src/index.ts
