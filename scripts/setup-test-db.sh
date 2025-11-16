#!/bin/bash

# Setup Test Database
# This script creates the test database for running integration tests

set -e

echo "🔧 Setting up test database..."

# Database credentials
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="affiliate_test_db"
DOCKER_CONTAINER="affiliate-postgres"

# Check if PostgreSQL container is running
echo "Checking PostgreSQL container..."
if ! docker ps --format '{{.Names}}' | grep -q "^${DOCKER_CONTAINER}$"; then
  echo "❌ PostgreSQL container '$DOCKER_CONTAINER' is not running"
  echo "   Start PostgreSQL with: docker-compose -f infra/docker-compose.yml up -d postgres"
  exit 1
fi

echo "✅ PostgreSQL container is running"

# Drop existing test database if it exists
echo "🗑️  Dropping existing test database (if exists)..."
docker exec "$DOCKER_CONTAINER" psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || true

# Create test database
echo "🆕 Creating test database..."
docker exec "$DOCKER_CONTAINER" psql -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"

echo "✅ Test database created: $DB_NAME"

# Run migrations
echo "🔄 Running Prisma migrations..."
PROJECT_ROOT="$(dirname "$0")/.."
cd "$PROJECT_ROOT/packages/database"
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" bunx prisma migrate deploy

echo "✅ Test database setup complete!"
echo ""
echo "You can now run tests with:"
echo "  bun --filter api test"
echo "  bun --filter api run test:coverage"
