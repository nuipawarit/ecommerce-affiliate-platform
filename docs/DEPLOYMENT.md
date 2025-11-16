# Deployment Guide - Affiliate Platform

Complete guide for deploying the Affiliate Platform to Render.com or any Docker-compatible hosting platform.

## Table of Contents

1. [Overview](#overview)
2. [Render Deployment](#render-deployment)
3. [Docker Configuration](#docker-configuration)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Troubleshooting](#troubleshooting)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Overview

The platform consists of 4 services:

1. **PostgreSQL Database** (managed service)
2. **Redis Cache** (managed service)
3. **API Service** (Express.js with Bun runtime)
4. **Web Service** (Next.js with Bun runtime)

**Deployment Strategy:** Infrastructure as Code using `render.yaml` Blueprint

---

## Render Deployment

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### Step 2: Push Code to GitHub

```bash
# Ensure all changes are committed
git add .
git commit -m "feat: prepare for deployment"
git push origin main
```

### Step 3: Deploy Using Blueprint

#### Option A: One-Click Deploy (Recommended)

1. In Render dashboard, click **"New" → "Blueprint"**
2. Select your repository: `ecommerce-affiliate-platform`
3. Render will detect `render.yaml`
4. Click **"Apply"**
5. Wait for services to deploy (~5-10 minutes)

#### Option B: Manual Service Creation

If Blueprint deployment fails, create services manually:

**1. Create PostgreSQL Database:**
- Name: `affiliate-db`
- Plan: Free
- Database Name: `affiliate_db`
- User: `affiliate_user`
- Region: Oregon (or closest to you)

**2. Create Redis Instance:**
- Name: `affiliate-redis`
- Plan: Free
- Maxmemory Policy: `allkeys-lru`
- Region: Same as PostgreSQL

**3. Create API Web Service:**
- Name: `affiliate-api`
- Runtime: Docker
- Dockerfile Path: `./apps/api/Dockerfile`
- Docker Context: `.` (root)
- Plan: Free
- Region: Same as database
- Health Check Path: `/api/health`

**4. Create Web Web Service:**
- Name: `affiliate-web`
- Runtime: Docker
- Dockerfile Path: `./apps/web/Dockerfile`
- Docker Context: `.` (root)
- Plan: Free
- Region: Same as database

### Step 4: Configure Environment Variables

After services are created, update environment variables in Render dashboard:

**IMPORTANT: For Web Service Docker Build Args**

Next.js requires `NEXT_PUBLIC_*` environment variables at **BUILD TIME**, not runtime.

To configure:
1. Go to Render Dashboard → `affiliate-web` service → **Settings**
2. Scroll to **Docker** section
3. Find **Docker Build Command** field
4. Add: `--build-arg NEXT_PUBLIC_API_URL=https://affiliate-api-ti9a.onrender.com`
5. Click **Save Changes**
6. Trigger manual deploy to rebuild with build arg

#### API Service Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Already set |
| `PORT` | `3001` | Already set |
| `DATABASE_URL` | (auto-linked) | From affiliate-db |
| `REDIS_URL` | (auto-linked) | From affiliate-redis |
| `JWT_SECRET` | Generate new | See below |
| `API_BASE_URL` | (copy from Render) | `https://affiliate-api-ti9a.onrender.com` |
| `CORS_ORIGIN` | (copy from Render) | `https://affiliate-web-96ne.onrender.com` |
| `ADMIN_USERNAME` | `demo` | Already set |
| `ADMIN_PASSWORD` | `demo123` | Already set |

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

#### Web Service Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | (copy from Render) | `https://affiliate-api-ti9a.onrender.com` |

**Important:** Update `API_BASE_URL` and `CORS_ORIGIN` in API service AFTER web service URL is available.

### Step 5: Run Database Migrations

After API service is deployed, run migrations:

```bash
# Get DATABASE_URL from Render dashboard (API service > Environment tab)
# Format: postgresql://user:password@host:port/database

# Run migrations
DATABASE_URL="postgresql://..." bun --filter database prisma migrate deploy
```

**Alternative:** Run migrations from API service shell:

1. Open API service in Render dashboard
2. Click "Shell" tab
3. Run:
   ```bash
   cd packages/database
   bun run db:generate
   bunx prisma migrate deploy
   ```

### Step 6: Seed Database (Optional)

Add sample data for demo:

```bash
DATABASE_URL="postgresql://..." bun --filter database run db:seed
```

### Step 7: Verify Deployment

Check all services are healthy:

✅ **API Health Check:**
```bash
curl https://affiliate-api-ti9a.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-17T00:00:00.000Z",
  "database": "connected",
  "redis": "connected"
}
```

✅ **API Documentation:**
Visit: `https://affiliate-api-ti9a.onrender.com/api/docs`

✅ **Web App:**
Visit: `https://affiliate-web-96ne.onrender.com`

✅ **Login Test:**
- Go to web app `/login`
- Use credentials: `demo` / `demo123`

---

## Docker Configuration

### Local Docker Testing

Test Docker builds locally before deployment:

```bash
# Test API build
docker build -f apps/api/Dockerfile -t affiliate-api:test .

# Test Web build
docker build -f apps/web/Dockerfile -t affiliate-web:test .

# Test API run
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -e JWT_SECRET=test-secret \
  affiliate-api:test

# Test Web run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  affiliate-web:test
```

### Dockerfile Details

#### API Dockerfile (`apps/api/Dockerfile`)

**Multi-stage build:**
1. **Builder stage:** Install deps, generate Prisma client, build TypeScript
2. **Runtime stage:** Copy artifacts, install production deps only

**Image size:** ~699MB (includes Bun runtime + dependencies)

**Health check:** `GET /api/health` every 30s

#### Web Dockerfile (`apps/web/Dockerfile`)

**Multi-stage build:**
1. **Deps stage:** Install all workspace dependencies
2. **Builder stage:** Build Next.js with standalone output
3. **Runtime stage:** Copy standalone files only

**Image size:** ~250MB (Bun slim + Next.js standalone)

**Health check:** `GET /` every 30s

---

## Environment Variables

### Complete Reference

#### API Service

```env
# Server
NODE_ENV=production
PORT=3001

# Database (auto-linked from Render)
DATABASE_URL=postgresql://user:pass@host:port/database

# Redis (auto-linked from Render)
REDIS_URL=redis://host:port

# Security
JWT_SECRET=<generate-with-openssl>

# URLs (update after deployment)
API_BASE_URL=https://affiliate-api-ti9a.onrender.com
CORS_ORIGIN=https://affiliate-web-96ne.onrender.com

# Demo credentials
ADMIN_USERNAME=demo
ADMIN_PASSWORD=demo123
```

#### Web Service

```env
# API connection
NEXT_PUBLIC_API_URL=https://affiliate-api-ti9a.onrender.com
```

### Security Best Practices

1. **JWT_SECRET:** Always generate a new secret for production
   ```bash
   openssl rand -base64 32
   ```

2. **ADMIN_PASSWORD:** Change from `demo123` in production
   ```bash
   # Update in Render dashboard
   ADMIN_PASSWORD=your-secure-password
   ```

3. **CORS_ORIGIN:** Set to exact web URL (no trailing slash)

4. **Never commit `.env` files** - Use Render's environment variable UI

---

## Database Setup

### Prisma Migrations

**Development (local):**
```bash
bun --filter database prisma migrate dev --name <migration-name>
```

**Production (Render):**
```bash
DATABASE_URL="postgresql://..." bun --filter database prisma migrate deploy
```

### Database Schema

**Models:** Product, Offer, Campaign, CampaignProduct, Link, Click

**Indexes:** Optimized for:
- Product lookups by ID
- Offer lookups by marketplace and SKU
- Campaign lookups by slug
- Link lookups by shortCode
- Click analytics queries

### Backup & Restore

**Render PostgreSQL Backups:**
- Free tier: No automatic backups
- Paid tiers: Daily backups with 7-day retention

**Manual Backup:**
```bash
# Get connection string from Render dashboard
pg_dump "postgresql://..." > backup.sql

# Restore
psql "postgresql://..." < backup.sql
```

---

## Troubleshooting

### Common Issues

#### 1. Build Fails - "lockfile had changes"

**Error:**
```
error: lockfile had changes, but lockfile is frozen
```

**Fix:**
Run locally and commit updated lockfile:
```bash
bun install
git add bun.lock
git commit -m "chore: update lockfile"
git push
```

#### 2. TypeScript Build Errors

**Error:**
```
Type error: Property 'X' does not exist
```

**Fix:**
Ensure all type definitions are up to date:
```bash
bun run type-check
```

Fix any errors before deploying.

#### 3. Database Connection Failed

**Error:**
```
Can't reach database server at `host:port`
```

**Fixes:**
- Verify `DATABASE_URL` is correctly linked in Render
- Check database service is running (green status)
- Ensure database and API are in same region
- Check Render service logs for details

#### 4. Redis Connection Failed

**Error:**
```
Error connecting to Redis
```

**Fixes:**
- Verify `REDIS_URL` is correctly linked
- Check Redis service is running
- Redis free tier has limited connections - restart if needed

#### 5. CORS Errors in Browser

**Error:**
```
Access to fetch blocked by CORS policy
```

**Fixes:**
- Set `CORS_ORIGIN` in API service to exact web URL
- No trailing slash: `https://affiliate-web-96ne.onrender.com` ✅
- Not: `https://affiliate-web-96ne.onrender.com/` ❌
- Restart API service after changing

#### 6. API Health Check Fails

**Error:**
```
GET /api/health returns 503 or timeout
```

**Fixes:**
- Check API service logs in Render dashboard
- Verify build completed successfully
- Check DATABASE_URL and REDIS_URL are set
- Ensure Prisma migrations ran successfully

#### 7. Next.js Build Timeout

**Error:**
```
Build exceeded 15 minute timeout
```

**Fixes:**
- Free tier has build time limits
- Optimize build: Remove unused dependencies
- Use Bun for faster builds (already configured)
- Consider upgrading Render plan

#### 8. NEXT_PUBLIC_API_URL is Undefined

**Error:**
```
process.env.NEXT_PUBLIC_API_URL returns undefined
API calls fail with localhost:3001 or network errors
```

**Root Cause:**
Next.js requires `NEXT_PUBLIC_*` variables at **BUILD TIME**, not runtime. Render injects environment variables at runtime, so they're not baked into the JavaScript bundle.

**Fixes:**
1. Go to Render Dashboard → `affiliate-web` service → **Settings**
2. Under **Docker** section, find **Docker Build Command**
3. Add: `--build-arg NEXT_PUBLIC_API_URL=https://affiliate-api-ti9a.onrender.com`
4. Save and trigger manual deploy
5. Verify in browser DevTools → Network tab that API calls go to correct URL

**Alternative (if build args don't work):**
Use hardcoded production URL with fallback:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')
    ? 'https://affiliate-api-ti9a.onrender.com'
    : 'http://localhost:3001');
```

### Checking Logs

**Render Dashboard:**
1. Navigate to service
2. Click "Logs" tab
3. Filter by time range
4. Search for errors

**Log Levels:**
- `INFO`: Normal operation
- `WARN`: Potential issues
- `ERROR`: Failures requiring attention

---

## Monitoring & Maintenance

### Health Checks

**API Health Endpoint:**
```bash
curl https://affiliate-api-ti9a.onrender.com/api/health
```

**Monitor:**
- Database connection status
- Redis connection status
- Uptime
- Response time

### Auto-Deploy with GitHub Actions

Setup automatic deployment on push to `main`:

**1. Get Render Deploy Hook:**
- Render dashboard → API service
- Settings → Deploy Hook
- Copy webhook URL

**2. Add GitHub Secret:**
- GitHub repo → Settings → Secrets
- Add `RENDER_DEPLOY_HOOK_URL`
- Value: webhook URL from step 1

**3. Enable in CI/CD:**
Uncomment line 100 in `.github/workflows/ci.yml`:
```yaml
- name: Trigger Render Deploy
  run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

### Rollback Procedures

**Render Dashboard:**
1. Navigate to service
2. Click "Manual Deploy" tab
3. Select previous successful deploy commit
4. Click "Deploy"

**Git Rollback:**
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

### Database Migrations Rollback

**Prisma doesn't support automatic rollback.**

Manual rollback:
1. Identify migration to revert
2. Write SQL to undo changes
3. Apply manually via Render shell or local connection

**Prevention:** Always test migrations locally first!

### Performance Monitoring

**Render Metrics (Free tier limited):**
- CPU usage
- Memory usage
- Request count
- Response time

**Application Metrics:**
- API response times (logs)
- Database query performance
- Redis hit rates
- Click tracking analytics

---

## Scaling Considerations

### Free Tier Limitations

**Render Free Plan:**
- Services sleep after 15 min inactivity
- Cold start time: ~1-2 min
- 750 hours/month total across services
- Limited CPU and memory
- No automatic backups

**When to Upgrade:**
- High traffic (services sleeping affects UX)
- Need faster response times
- Require automatic backups
- Need custom domain SSL

### Performance Optimization

**Already Implemented:**
- Bun runtime (faster than Node.js)
- Next.js standalone output (smaller images)
- Multi-stage Docker builds
- Redis caching for click tracking
- Database indexes on common queries
- Health checks for monitoring

**Future Optimizations:**
- CDN for static assets
- Database connection pooling
- Redis caching for product data
- Background jobs for price refresh

---

## Support & Resources

**Documentation:**
- [Render Docs](https://render.com/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

**Project Documentation:**
- [README.md](../README.md) - Quick start guide
- [PROJECT_PLAN.md](../PROJECT_PLAN.md) - Architecture and implementation details
- [CLAUDE.md](../CLAUDE.md) - Development guide

**Need Help?**
- Check Render service logs first
- Review troubleshooting section above
- Check GitHub Issues
- Contact support@render.com (for Render-specific issues)

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing (`bun test`)
- [ ] Type-check passes (`bun run type-check`)
- [ ] Linting passes (`bun run lint`)
- [ ] Docker builds succeed locally
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] API documentation up to date
- [ ] Security review completed
- [ ] Demo credentials ready
- [ ] Monitoring plan in place

After deployment:

- [ ] Health checks returning 200 OK
- [ ] API docs accessible
- [ ] Web app loads correctly
- [ ] Login functionality works
- [ ] Database connection verified
- [ ] Redis connection verified
- [ ] CORS configuration correct
- [ ] SSL certificates active
- [ ] Deploy hooks configured (optional)
- [ ] Monitoring alerts setup (optional)

---

**Last Updated:** 2025-01-17
**Version:** 1.0.0
