#!/bin/sh

# Write DATABASE_URL to .env if it's set as an environment variable
if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL=$DATABASE_URL" > .env
fi

# Run the provided command
exec "$@"
