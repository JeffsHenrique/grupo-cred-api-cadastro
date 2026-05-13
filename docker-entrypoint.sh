#!/bin/sh
set -e

echo "Applying database migrations..."
pnpm db:push --force

echo "Starting server..."
exec pnpm start
