# Scripts

Utility scripts for development and testing.

## Database Setup

### Setup Test Database

Creates and configures the test database for running integration tests.

```bash
# Run from project root
./scripts/setup-test-db.sh
```

**What it does:**
1. Checks if PostgreSQL is running
2. Drops existing `affiliate_test_db` (if exists)
3. Creates new `affiliate_test_db`
4. Runs Prisma migrations

**Prerequisites:**
- PostgreSQL running on `localhost:5432`
- User `postgres` with password `postgres`

**Start PostgreSQL:**
```bash
docker-compose -f infra/docker-compose.yml up -d postgres
```

### Manual Setup

If the script doesn't work, you can create the test database manually:

```sql
-- Connect to PostgreSQL
psql -U postgres -h localhost

-- Create database
CREATE DATABASE affiliate_test_db;

-- Exit
\q
```

Then run migrations:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/affiliate_test_db" \
  bun --filter database prisma migrate deploy
```

## Testing

After setting up the test database, run tests with:

```bash
# Run all tests
bun --filter api test

# Run with coverage
bun --filter api run test:coverage

# Run in CI mode (no cache)
bun --filter api run test:ci
```

## Environment Variables

Tests use `.env.test` which specifies:
- `DATABASE_URL`: Points to `affiliate_test_db`
- `REDIS_URL`: Uses Redis database 1 (separate from dev)
- `NODE_ENV`: Set to `test`

This ensures tests don't interfere with your development data.
