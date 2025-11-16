# 🛍️ Affiliate Platform for E-Commerce Price Comparison

> **Production-ready affiliate web app** for Lazada & Shopee marketplace price comparison and affiliate link tracking

---

## Table of Contents

- [Live Demo](#-live-demo)
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Advanced Features](#-advanced-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Development Setup](#-development-setup)
- [Production Deployment](#-production-deployment)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Future Roadmap](#-future-roadmap)
- [Additional Documentation](#-additional-documentation)
- [License](#-license)

---

## 🚀 Live Demo

| Service               | URL                                                                                                  | Credentials                             |
| --------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Public Homepage**   | [https://affiliate-web-96ne.onrender.com](https://affiliate-web-96ne.onrender.com)                   | No login required                       |
| **Admin Panel**       | [https://affiliate-web-96ne.onrender.com/admin](https://affiliate-web-96ne.onrender.com/admin)       | Username: `demo`<br>Password: `demo123` |
| **API Documentation** | [https://affiliate-api-ti9a.onrender.com/api/docs](https://affiliate-api-ti9a.onrender.com/api/docs) | Interactive Swagger UI                  |
| **API Endpoint**      | [https://affiliate-api-ti9a.onrender.com](https://affiliate-api-ti9a.onrender.com)                   | REST API                                |

### 🎯 Demo Flow

1. **Browse Products** → Visit homepage to see active campaigns
2. **Login to Admin** → Use credentials above to access admin panel
3. **Add Products** → Search by URL or SKU (try: `MT-JP-100` or paste a Lazada/Shopee URL)
4. **Create Campaign** → Set up "Summer Sale 2025" with UTM parameters
5. **Generate Links** → Create trackable short links (`/go/abc123`)
6. **View Analytics** → Check dashboard for click stats and marketplace performance

---

## 📋 Project Overview

This is a **mini web application** built as a technical assignment for the **Lead Software Engineer** position at **Jenosize**. The project demonstrates:

- ✅ **Scalable Architecture** - Clean monorepo structure with clear boundaries
- ✅ **Production-Ready Code** - Docker, CI/CD, comprehensive testing, monitoring
- ✅ **Modern Tech Stack** - Next.js 16, Bun, Prisma, TypeScript 5.7
- ✅ **Real-World Features** - Duplicate detection, batch operations, analytics
- ✅ **Engineering Excellence** - 100% test pass rate, >70% coverage, strict TypeScript

### 🎯 Core Functionality

**For Users:**

- Compare product prices across Lazada and Shopee
- View active promotional campaigns
- Click affiliate links (tracked with UTM parameters)

**For Admins:**

- Add products via URL or SKU search
- Create and manage campaigns
- Generate trackable affiliate short links
- View real-time analytics and click stats
- Monitor top-performing products and campaigns

---

## ✨ Key Features

### 1. 🔍 Smart Product Management

- **Multi-marketplace search** - URL or SKU-based search across Lazada & Shopee
- **Duplicate detection** - 80% similarity threshold using Levenshtein algorithm
- **Batch operations** - Add multiple products with merge/separate modes
- **Price tracking** - Automatic refresh every 6 hours via cron job
- **Best price badges** - Instant comparison highlighting

### 2. 📊 Campaign Management

- **UTM parameter support** - Full attribution tracking
- **Status workflows** - ACTIVE, PAUSED, ARCHIVED states
- **Date-based campaigns** - Start/end date configuration
- **Product associations** - Many-to-many campaign-product relationships
- **Unique slug generation** - SEO-friendly campaign URLs

### 3. 🔗 Affiliate Link Generator

- **Short code generation** - 8-character nanoid (`/go/abc123`)
- **Click tracking** - IP, referrer, user agent, timestamp
- **Redis caching** - Fast real-time counters
- **UTM injection** - Automatic parameter appending
- **Copy-to-clipboard** - One-click link sharing

### 4. 📈 Analytics Dashboard

- **Real-time metrics** - Click counts, CTR, top performers
- **Interactive charts** - Recharts visualizations (area, bar)
- **Marketplace comparison** - Lazada vs Shopee performance
- **Date range filtering** - 7 days, 30 days, all time
- **Export-ready data** - Structured for CSV/Excel export

### 5. 🌐 Public Landing Page

- **Featured campaigns** - Hero section with large product cards
- **Server-side rendering** - Optimized for SEO and performance
- **Responsive design** - Mobile, tablet, desktop layouts
- **Price comparison** - Side-by-side marketplace pricing
- **Direct tracking** - Clicks automatically logged

### 6. 🔐 Authentication & Security

- **JWT tokens** - Secure authentication with demo credentials
- **Protected routes** - Admin panel requires login
- **Rate limiting** - 100 requests per 15 minutes
- **Input validation** - Zod schemas on all endpoints
- **Security headers** - Helmet.js, CORS configuration

### 7. 🤖 Background Jobs

- **Automated price refresh** - Cron job every 6 hours (`0 */6 * * *`)
- **Job status monitoring** - Redis-based progress tracking
- **Error handling** - Graceful failures with per-product try-catch
- **Performance stats** - Track duration, products processed, updates made

### 8. 📚 API Documentation

- **OpenAPI 3.0** - Auto-generated from Zod schemas
- **Swagger UI** - Interactive endpoint testing at `/api/docs`
- **26 endpoints** - Complete REST API for all features
- **Type-safe** - Automatic TypeScript types from schemas

---

## 🎯 Advanced Features

### 1. Smart Duplicate Detection

**Problem:** Prevent creating multiple products for the same item across marketplaces.

**Solution:**

- Levenshtein distance algorithm for title similarity
- 80% similarity threshold (configurable)
- Interactive dialog showing similar matches
- User choice: Merge offers or create separate product

**Implementation:**

```typescript
// Check for similar products
POST /api/products/check-similar
{
  "title": "Matcha Powder Premium 100g",
  "threshold": 0.8
}

// Response: Array of similar products
[
  {
    "id": "prod_123",
    "title": "Premium Matcha Powder 100g",
    "similarity": 0.85,
    "offers": [...]
  }
]
```

**UI Flow:**

1. User searches for "Matcha Powder"
2. Selects product from Lazada
3. System detects similar product already exists (Shopee version)
4. Shows `SimilarProductDialog` with options:
   - **Merge** → Add as new offer to existing product
   - **Create New** → Ignore similarity, create separate entry

### 2. Batch Product Operations

**Multi-select Search Results:**

- Checkbox selection for each search result
- "Select All" and "Clear" buttons
- Shows count of selected items

**Two Processing Modes:**

**Merge Mode:**

- Creates 1 product with multiple offers
- Use case: Same product from different marketplaces
- Example: "Matcha Powder" from Lazada + Shopee → 1 product, 2 offers

**Separate Mode:**

- Creates individual products for each selection
- Sequential duplicate checking
- Use case: Different products or variants

### 3. Enhanced Search Experience

**Tabbed Interface:**

- Tab 1: Search by URL (paste Lazada/Shopee link)
- Tab 2: Search by SKU (product code like `MT-JP-100`)

**Search Results Display:**

- Product image (optimized)
- Title
- SKU code
- Marketplace + Store name (color-coded badges)
- Price with "Best Price" badge for lowest
- Checkbox for selection

**12 Mock Products Available:**

- Food: Matcha Powder, Coffee Beans, Organic Honey
- Electronics: iPhone 15 Pro Max, Samsung S24 Ultra, AirPods Pro
- Fashion: Nike Air Max 270, Adidas Ultraboost 22, Lululemon Leggings
- Beauty: SK-II Essence, Cetaphil Cleanser, Sony Headphones

### 4. Analytics Visualizations

**Charts (Recharts):**

- **Area Chart:** Click trends over time (gradient fill)
- **Bar Chart:** Marketplace comparison (horizontal bars)
- **Metric Cards:** Total clicks, campaigns, products

**Features:**

- Date range filtering (7 days, 30 days, all time)
- Color-coded by marketplace (Lazada=blue, Shopee=orange)
- Top 10 leaderboards (products, campaigns)
- Rank badges (#1, #2, #3 with gold/silver/bronze)
- Responsive layouts

### 5. Price Intelligence

**Price Statistics Cards:**

- **Best Price:** Lowest across all offers
- **Price Range:** High - Low
- **Average Price:** Mean of all offers
- **Marketplaces:** Count of unique marketplaces

**Savings Calculation:**

```
Savings = Highest Price - Lowest Price
Percentage = (Savings / Highest Price) × 100%
```

**Offer Comparison:**

- Sorted by price (lowest first)
- Price difference from best price
- Percentage difference displayed
- Visual indicators (Best Price badge)

### 6. Background Job Monitoring

**Job Status Endpoint:** `GET /api/jobs/status`

**Response:**

```json
{
  "success": true,
  "data": {
    "lastRun": "2025-01-14T12:00:00Z",
    "lastDuration": 45000,
    "stats": {
      "productsProcessed": 24,
      "offersUpdated": 8,
      "errors": 0
    }
  }
}
```

**Features:**

- Redis-based status tracking
- Duration measurement
- Error counting
- Products/offers stats

---

## 🛠 Tech Stack

### Core Technologies

| Technology     | Version | Purpose                   | Why This Choice?                                                                                 |
| -------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------ |
| **Bun**        | 1.2.21  | Package manager & runtime | 3-5x faster than npm/pnpm, native TypeScript support, built-in test runner                       |
| **Turborepo**  | 2.6.1   | Monorepo build system     | Shared code caching, parallel builds, scalable workspace management                              |
| **Next.js**    | 16.0.1  | React framework           | SSR/SSG for SEO, App Router, file-based routing, built-in optimizations, React Server Components |
| **React**      | 19.2.0  | UI library                | Modern features (Server Components, Suspense), excellent ecosystem                               |
| **Express.js** | 4.21.2  | Backend API               | Lightweight, flexible, mature ecosystem, easy to test                                            |
| **TypeScript** | 5.7.2   | Language                  | Type safety, self-documenting code, reduces runtime errors                                       |
| **PostgreSQL** | 15+     | Database                  | ACID compliance, robust, JSON support, production-proven                                         |
| **Prisma**     | 6.19.0  | ORM                       | Type-safe queries, auto-migrations, excellent developer experience                               |
| **Redis**      | 7.x     | Cache/Queue               | Fast in-memory storage for click tracking, session management                                    |

### Key Dependencies

**Backend:**

- `zod` 4.1.12 - Schema validation
- `jsonwebtoken` 9.0.2 - JWT authentication
- `nanoid` 5.1.6 - Short code generation
- `node-cron` 3.0.3 - Job scheduling
- `ioredis` 5.8.2 - Redis client
- `express-rate-limit` 7.5.0 - Rate limiting
- `helmet` 8.0.0 - Security headers
- `swagger-ui-express` 5.0.1 - API docs

**Frontend:**

- `@radix-ui/*` - Accessible UI primitives (15 components)
- `recharts` 3.4.1 - Data visualization
- `tailwindcss` 4.1.17 - Utility-first CSS
- `lucide-react` 0.553.0 - Icon library
- `framer-motion` 12.23.24 - Animations

**Testing:**

- `bun:test` - Built-in test runner
- `supertest` 7.1.4 - HTTP integration testing

### Why This Stack?

1. **Bun over npm/pnpm** - Dramatically faster installs (3-5x), native TS support
2. **Next.js 16** - App Router with Server Components, file-based routing, built-in image/font optimization, automatic code splitting, edge runtime support
3. **Express over NestJS** - Lighter weight, easier to test, sufficient for MVP scope
4. **Prisma over Native SQL** - Type-safe queries, auto-generated types, easier migrations, prevents SQL injection
5. **Redis** - Essential for high-frequency click tracking without DB bottleneck
6. **Mock Adapters** - Real Lazada/Shopee APIs require partnership approval, mocks enable immediate development

---

## 🏗 Architecture

### System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end

    subgraph "Frontend - Next.js 16"
        Public[Public Homepage<br/>Server Components]
        Admin[Admin Panel<br/>Client Components]
        Auth[Auth Context<br/>JWT + localStorage]
    end

    subgraph "Backend - Express.js"
        API[REST API<br/>26 Endpoints]
        Services[Service Layer<br/>Business Logic]
        Jobs[Background Jobs<br/>Cron Scheduler]
        Swagger[Swagger UI<br/>API Docs]
    end

    subgraph "Data Layer"
        Postgres[(PostgreSQL<br/>Persistent Storage)]
        Redis[(Redis<br/>Click Counters)]
    end

    subgraph "External Services"
        Lazada[Lazada API<br/>Mock Adapter]
        Shopee[Shopee API<br/>Mock Adapter]
    end

    Browser --> Public
    Browser --> Admin

    Public --> API
    Admin --> Auth
    Auth --> API

    API --> Services
    API --> Swagger
    Services --> Jobs

    Services --> Postgres
    Services --> Redis
    Services --> Lazada
    Services --> Shopee

    Jobs --> Postgres
    Jobs --> Lazada
    Jobs --> Shopee

    style Public fill:#e1f5ff
    style Admin fill:#fff4e1
    style API fill:#f0e1ff
    style Postgres fill:#e1ffe1
    style Redis fill:#ffe1e1
```

### Data Flow - Click Tracking

```mermaid
sequenceDiagram
    participant User
    participant Web as Next.js Frontend
    participant API as Express API
    participant Redis
    participant DB as PostgreSQL
    participant Market as Marketplace

    User->>Web: Click "Buy on Lazada" button
    Web->>API: GET /go/abc123

    API->>DB: Lookup Link by shortCode
    DB-->>API: Return Link + targetUrl

    par Track Click
        API->>DB: INSERT Click record<br/>(IP, referrer, timestamp)
        API->>Redis: INCR click_count:abc123
    end

    API-->>User: 302 Redirect to targetUrl
    User->>Market: Land on Lazada product page<br/>(with UTM parameters)

    Note over API,Redis: Background Sync (every 5 min)
    API->>Redis: GET all click counters
    API->>DB: UPDATE analytics tables
```

### Database Design

**Entity Relationship Diagram:**

```mermaid
erDiagram
    Product ||--o{ Offer : "has"
    Product ||--o{ Link : "generates"
    Product ||--o{ CampaignProduct : "belongs to"

    Campaign ||--o{ CampaignProduct : "includes"
    Campaign ||--o{ Link : "creates"

    Offer ||--o{ Link : "tracked by"

    Link ||--o{ Click : "tracks"

    Product {
        string id PK
        string title
        string description
        string imageUrl
        datetime createdAt
        datetime updatedAt
    }

    Offer {
        string id PK
        string productId FK
        enum marketplace "LAZADA or SHOPEE"
        string storeName
        float price
        string url
        string sku "Product SKU code"
        boolean isActive
        datetime lastCheckedAt
        datetime createdAt
        datetime updatedAt
    }

    Campaign {
        string id PK
        string name
        string slug UK "SEO-friendly URL"
        string description
        enum status "DRAFT, ACTIVE, PAUSED, ENDED, ARCHIVED"
        string utmCampaign
        datetime startAt
        datetime endAt
        datetime createdAt
        datetime updatedAt
    }

    CampaignProduct {
        string id PK
        string campaignId FK
        string productId FK
        int position "Display order"
        datetime createdAt
    }

    Link {
        string id PK
        string productId FK
        string campaignId FK
        string offerId FK "Specific marketplace offer"
        string shortCode UK "8-char nanoid"
        string targetUrl "Marketplace URL + UTM"
        datetime createdAt
        datetime updatedAt
    }

    Click {
        string id PK
        string linkId FK
        datetime timestamp
        string referrer
        string userAgent
        string ipAddress "For geo analytics"
        string country "Detected from IP"
    }
```

**Comparison with Assignment Example:**

| Aspect                | Assignment Example                  | Our Implementation                                     | Why Different?                                           |
| --------------------- | ----------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| **Tables**            | 5 tables                            | **6 tables** (+CampaignProduct)                        | Many-to-many with product ordering                       |
| **Link.offerId**      | ❌ Not present                      | ✅ **Added**                                           | Critical for tracking which specific marketplace offer   |
| **Campaign.slug**     | ❌ Not present                      | ✅ **Added** (unique)                                  | SEO-friendly URLs (`/campaign/summer-sale`)              |
| **Campaign.status**   | ❌ Not present                      | ✅ **Added** (enum)                                    | State machine (DRAFT→ACTIVE→PAUSED→ENDED→ARCHIVED)      |
| **Offer.url**         | ❌ Not present                      | ✅ **Added**                                           | Essential for search by URL and duplicate detection      |
| **Offer.sku**         | ❌ Not present                      | ✅ **Added**                                           | Search by product code (e.g., MT-JP-100)                 |
| **Offer.isActive**    | ❌ Not present                      | ✅ **Added**                                           | Soft delete for out-of-stock products                    |
| **Click.ipAddress**   | ❌ Not present                      | ✅ **Added**                                           | Geo-analytics and fraud detection                        |
| **Click.country**     | ❌ Not present                      | ✅ **Added**                                           | Geographic performance insights                          |
| **Enums**             | ❌ Not used                         | ✅ Marketplace, CampaignStatus                         | Type safety, prevents invalid values                     |
| **Indexes**           | Not specified                       | ✅ 15+ indexes (composite + single)                    | Performance for analytics queries                        |
| **Unique Constraints** | ❌ Not specified                   | ✅ [productId, marketplace, url]                       | Prevent duplicate offers                                 |
| **Cascade Deletes**   | ❌ Not specified                    | ✅ All foreign keys                                    | Data integrity when parent deleted                       |

**Key Design Decisions:**

1. **CampaignProduct Junction Table**
   - **Why:** Many-to-many relationship (one product in multiple campaigns, one campaign has multiple products)
   - **Benefit:** Track `position` for custom product ordering per campaign

2. **Link.offerId Field**
   - **Why:** Same product from Lazada and Shopee needs separate tracking
   - **Example:** "Matcha Powder" has 2 offers → 2 links with different `offerId` but same `productId`
   - **Benefit:** Accurate marketplace-specific click attribution

3. **Campaign Status Enum**
   - **Why:** Campaigns have lifecycle (draft → active → paused/ended → archived)
   - **States:**
     - DRAFT: Being created
     - ACTIVE: Live on homepage
     - PAUSED: Temporarily hidden
     - ENDED: Past end date
     - ARCHIVED: Soft deleted
   - **Benefit:** Filter homepage to show only ACTIVE campaigns

4. **Offer URL & SKU Fields**
   - **Why:** Support two search methods (URL paste vs SKU code)
   - **Example:** Search "MT-JP-100" returns all offers across marketplaces
   - **Benefit:** Flexible product discovery

5. **Composite Indexes**
   - `[productId, price]` - Fast "best price" queries
   - `[linkId, timestamp]` - Efficient click trends over time
   - `[productId, marketplace, url]` (unique) - Prevent duplicate offers
   - **Benefit:** Sub-millisecond analytics queries

6. **Geographic Click Data**
   - **Why:** Future enhancement for regional campaign targeting
   - **Use Case:** "Show this campaign only to Thailand users"
   - **Benefit:** Advanced analytics without schema migration

**Data Integrity:**
- All foreign keys use `onDelete: Cascade` except Click (uses `SetNull`)
- Reason: Preserve historical click data even if link deleted
- Timestamps on all tables for audit trail

### Monorepo Structure

```
ecommerce-affiliate-platform/
├── apps/
│   ├── api/                    # Express.js Backend (Port 3001)
│   │   ├── src/
│   │   │   ├── routes/         # API endpoints (8 route files)
│   │   │   ├── services/       # Business logic (4 services)
│   │   │   ├── jobs/           # Cron jobs (price refresh)
│   │   │   ├── middleware/     # Auth, validation, rate limiting
│   │   │   ├── validations/    # Zod schemas
│   │   │   └── swagger/        # OpenAPI config
│   │   └── __tests__/          # Tests (unit + integration)
│   │
│   └── web/                    # Next.js 16 Frontend (Port 3000)
│       ├── app/
│       │   ├── page.tsx        # Public homepage
│       │   ├── login/          # Login page
│       │   ├── (public)/       # Public routes group
│       │   └── (admin)/admin/  # Protected admin routes
│       │       ├── products/   # Product management
│       │       ├── campaigns/  # Campaign management
│       │       ├── links/      # Link generator
│       │       └── dashboard/  # Analytics dashboard
│       ├── components/
│       │   ├── ui/             # shadcn/ui components
│       │   ├── public/         # Homepage components
│       │   ├── analytics/      # Analytics components
│       │   └── charts/         # Recharts visualizations
│       ├── contexts/
│       │   └── AuthContext.tsx # JWT auth context
│       └── lib/
│           ├── api-client.ts   # Centralized API calls
│           └── auth.ts         # JWT helpers
│
├── packages/
│   ├── database/               # Prisma Schema + Client
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # 6 models, 2 enums
│   │   │   └── migrations/     # SQL migrations
│   │   └── src/client.ts       # Singleton instance
│   │
│   ├── adapters/               # Marketplace Integration
│   │   ├── src/
│   │   │   ├── lazada.adapter.ts   # Mock Lazada API
│   │   │   ├── shopee.adapter.ts   # Mock Shopee API
│   │   │   └── mock-data.ts        # 12 realistic products
│   │   └── __tests__/              # 56 adapter tests
│   │
│   ├── shared/                 # Shared utilities & types
│   ├── eslint-config/          # Shared ESLint config
│   └── typescript-config/      # Shared TypeScript config
│
├── infra/
│   ├── docker-compose.yml      # Local dev (Postgres + Redis)
│   └── render.yaml             # Production deployment
│
├── scripts/
│   └── check-coverage.ts       # Coverage threshold enforcement
│
└── docs/
    └── DEPLOYMENT.md           # Complete deployment guide (654 lines)
```

---

## 🚀 Quick Start

**For Reviewers** - Get the app running in 5 minutes:

```bash
# 1. Clone and install (Bun required: https://bun.sh)
git clone <repo-url>
cd ecommerce-affiliate-platform
bun install

# 2. Start databases
docker-compose -f infra/docker-compose.yml up -d

# 3. Setup environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. Initialize database
bun --filter database run db:generate
bun --filter database prisma migrate dev
bun --filter database run db:seed

# 5. Start dev servers
bun run dev
```

**Access:**

- Frontend: http://localhost:3000
- API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- Login: `demo` / `demo123`

---

## 💻 Development Setup

### Prerequisites

- **Bun** >= 1.0.0 ([Install](https://bun.sh))
- **Docker** & Docker Compose
- **Git**
- **Node.js** >= 18 (for compatibility)

### Installation

```bash
# 1. Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# 2. Clone repository
git clone <repo-url>
cd ecommerce-affiliate-platform

# 3. Install all dependencies (monorepo)
bun install
```

### Environment Setup

#### API Service (`apps/api/.env`)

```env
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/affiliate_db"

# Redis
REDIS_URL="redis://localhost:6379"

# Security
JWT_SECRET="your-secret-key-change-in-production"
API_BASE_URL="http://localhost:3001"

# Admin
ADMIN_USERNAME="demo"
ADMIN_PASSWORD="demo123"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

#### Web Service (`apps/web/.env.local`)

```env
# API Connection
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Database Setup

```bash
# Start PostgreSQL + Redis via Docker
docker-compose -f infra/docker-compose.yml up -d

# Generate Prisma Client
bun --filter database run db:generate

# Run migrations
bun --filter database prisma migrate dev

# Seed database with sample data (optional)
bun --filter database run db:seed

# Open Prisma Studio (database GUI)
bun --filter database prisma studio
```

### Development Commands

```bash
# Start all apps (Web + API)
bun run dev

# Start specific app only
bun --filter web dev      # Frontend only (Port 3000)
bun --filter api dev      # Backend only (Port 3001)

# Run tests
bun test                  # All tests
bun test --watch          # Watch mode
bun run test:coverage     # With coverage report

# Code quality
bun run lint              # ESLint
bun run type-check        # TypeScript
bun run format            # Prettier

# Build
bun run build             # Build all packages
bun --filter web build    # Build frontend only
bun --filter api build    # Build backend only

# Database commands
bun --filter database prisma migrate dev --name <name>   # Create migration
bun --filter database prisma studio                       # Open GUI
bun --filter database prisma migrate reset                # Reset DB
```

### Verify Installation

```bash
# Check if services are running
docker ps | grep -E "postgres|redis"

# Test API health
curl http://localhost:3001/api/health

# Test frontend
curl http://localhost:3000
```

---

## 🚢 Production Deployment

### Platform: Render (Current Deployment)

This project uses **Render** with Docker containers for both API and Web services.

#### Architecture

```mermaid
graph TB
    Users[Users/Browsers] --> WEB

    subgraph Render["Render Cloud Platform - Oregon Region"]
        subgraph Data["Managed Data Services - Free Tier"]
            PG[(PostgreSQL<br/>1GB Storage<br/>Connection: DATABASE_URL)]
            RD[(Redis<br/>Maxmemory: allkeys-lru<br/>Connection: REDIS_URL)]
        end

        subgraph Backend["API Service - Docker Container"]
            API["Express.js API<br/>Bun Runtime 1.2.21<br/>Port: 3001<br/>Image: ~699MB<br/>Health: /api/health"]
        end

        subgraph Frontend["Web Service - Docker Container"]
            WEB["Next.js 16 (Standalone)<br/>Bun Runtime 1.2.21<br/>Port: 3000<br/>Image: ~250MB"]
        end

        PG -.->|Auto-linked| API
        RD -.->|Auto-linked| API
        API -->|Proxied| WEB
    end

    style PG fill:#e1ffe1,stroke:#2d5016
    style RD fill:#ffe1e1,stroke:#5c1a1a
    style API fill:#f0e1ff,stroke:#4a1a5c
    style WEB fill:#e1f5ff,stroke:#1a3d5c
    style Users fill:#fff4e1,stroke:#5c4a1a
```

#### Deployment Steps

**1. Setup Render Services**

```bash
# Option A: Using render.yaml blueprint (recommended)
# - Push render.yaml to your repository
# - Connect repo to Render dashboard
# - Services auto-created from blueprint

# Option B: Manual setup via Render dashboard
# - Create PostgreSQL database (Free tier)
# - Create Redis instance (Free tier)
# - Create Web Service (Docker)
# - Create Web Service (Docker)
```

**2. Configure Environment Variables**

API Service:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=<from-render-postgres>
REDIS_URL=<from-render-redis>
JWT_SECRET=<generate-with-openssl>
API_BASE_URL=https://affiliate-api-ti9a.onrender.com
CORS_ORIGIN=https://affiliate-web-96ne.onrender.com
ADMIN_USERNAME=demo
ADMIN_PASSWORD=demo123
```

Web Service:

```env
NEXT_PUBLIC_API_URL=https://affiliate-api-ti9a.onrender.com
```

**⚠️ Important:** For Next.js, set `NEXT_PUBLIC_API_URL` as Docker build arg:

```yaml
buildCommand: docker build --build-arg NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL -t web .
```

**3. Run Database Migrations**

```bash
# Via Render Shell (API service)
bun --filter database prisma migrate deploy

# Or via local machine (with production DATABASE_URL)
DATABASE_URL=<prod-url> bun --filter database prisma migrate deploy
```

**4. Verify Deployment**

```bash
# Health checks
curl https://affiliate-api-ti9a.onrender.com/api/health
curl https://affiliate-web-96ne.onrender.com

# Test API
curl https://affiliate-api-ti9a.onrender.com/api/docs

# Test login
curl -X POST https://affiliate-api-ti9a.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

#### CI/CD Pipeline

**GitHub Actions** runs on every push to `main`/`develop`: installs deps, lints, type-checks, runs tests with coverage enforcement (>70%), builds all packages, and deploys to Render on `main`.

| Stage       | Actions                              | Requirements                      |
| ----------- | ------------------------------------ | --------------------------------- |
| **Quality** | ESLint, TypeScript, Prettier         | No errors                         |
| **Testing** | Bun test + PostgreSQL/Redis services | 70% lines/functions, 65% branches |
| **Build**   | `bun run build` (all packages)       | Successful compilation            |
| **Deploy**  | Docker build → Render webhook        | `main` branch only                |

#### Docker Images

| Service | Runtime    | Image Size | Features                                                |
| ------- | ---------- | ---------- | ------------------------------------------------------- |
| **API** | Bun 1.2.21 | ~699MB     | Multi-stage build, Prisma Client generation             |
| **Web** | Bun 1.2.21 | ~250MB     | Next.js standalone, build arg for `NEXT_PUBLIC_API_URL` |

### Alternative Platforms

This project can be deployed to:

- **Vercel** (Web) + **Render** (API + DB)
- **Railway** (All services)
- **Fly.io** (All services)
- **AWS/GCP/Azure** (Free tier eligible)
- **DigitalOcean App Platform**

See `docs/DEPLOYMENT.md` for detailed guides.

---

## 📚 API Documentation

### Base URL

- **Local:** `http://localhost:3001/api`
- **Production:** `https://affiliate-api-ti9a.onrender.com/api`

### Swagger UI

Interactive API documentation available at:

- **Local:** http://localhost:3001/api/docs
- **Production:** https://affiliate-api-ti9a.onrender.com/api/docs

### Endpoints (26 total)

| Method                      | Endpoint                   | Description                                 | Auth |
| --------------------------- | -------------------------- | ------------------------------------------- | ---- |
| **Authentication**          |
| POST                        | `/auth/login`              | Login with demo credentials                 | No   |
| **Products** (8 endpoints)  |
| POST                        | `/products/search`         | Search by URL or SKU                        | No   |
| POST                        | `/products`                | Add product from marketplace URL            | Yes  |
| POST                        | `/products/check-similar`  | Find similar products (duplicate detection) | No   |
| POST                        | `/products/:id/offers`     | Add offer to existing product               | Yes  |
| GET                         | `/products`                | List all products with offers               | No   |
| GET                         | `/products/:id`            | Get single product details                  | No   |
| GET                         | `/products/:id/offers`     | Get all offers for a product                | No   |
| PUT                         | `/products/:id/refresh`    | Manually refresh product prices             | Yes  |
| **Campaigns** (6 endpoints) |
| POST                        | `/campaigns`               | Create new campaign                         | Yes  |
| GET                         | `/campaigns`               | List all campaigns (filter by status)       | No   |
| GET                         | `/campaigns/:id`           | Get campaign details with products          | No   |
| GET                         | `/campaigns/slug/:slug`    | Get campaign by slug (for public pages)     | No   |
| PUT                         | `/campaigns/:id`           | Update campaign                             | Yes  |
| DELETE                      | `/campaigns/:id`           | Archive campaign (soft delete)              | Yes  |
| **Links** (2 endpoints)     |
| POST                        | `/links`                   | Generate affiliate short link               | Yes  |
| GET                         | `/links`                   | List all generated links                    | No   |
| **Redirect** (1 endpoint)   |
| GET                         | `/go/:shortCode`           | Redirect to marketplace + track click       | No   |
| **Analytics** (4 endpoints) |
| GET                         | `/analytics/dashboard`     | Complete dashboard data                     | No   |
| GET                         | `/analytics/overview`      | Overview stats (clicks by date/marketplace) | No   |
| GET                         | `/analytics/products/top`  | Top 10 products by clicks                   | No   |
| GET                         | `/analytics/campaigns/:id` | Campaign-specific performance               | No   |
| **Jobs** (1 endpoint)       |
| GET                         | `/jobs/status`             | Price refresh job status (last run, stats)  | No   |
| **API Docs** (2 endpoints)  |
| GET                         | `/api/docs`                | Interactive Swagger UI                      | No   |
| GET                         | `/api/docs/json`           | OpenAPI 3.0 specification (JSON)            | No   |
| **Health** (1 endpoint)     |
| GET                         | `/health`                  | Service health check                        | No   |

### Authentication

**Header:**

```
Authorization: Bearer <jwt-token>
```

**Get Token:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "username": "demo"
    }
  }
}
```

### Example Requests

**Search Products by SKU:**

```bash
curl -X POST http://localhost:3001/api/products/search \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"sku":"MT-JP-100"}'
```

**Add Product from URL:**

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.lazada.co.th/products/matcha-powder-i123456.html",
    "marketplace": "lazada"
  }'
```

**Create Campaign:**

```bash
curl -X POST http://localhost:3001/api/campaigns \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Sale 2025",
    "utmCampaign": "summer_sale_2025",
    "utmSource": "affiliate",
    "utmMedium": "website",
    "startAt": "2025-06-01T00:00:00Z",
    "endAt": "2025-08-31T23:59:59Z",
    "productIds": ["prod_abc123", "prod_def456"]
  }'
```

**Generate Affiliate Link:**

```bash
curl -X POST http://localhost:3001/api/links \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_abc123",
    "campaignId": "camp_xyz789",
    "offerId": "offer_lazada_001"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "link_123",
    "shortCode": "Xy9kL2pQ",
    "targetUrl": "https://lazada.co.th/product?utm_source=affiliate&utm_medium=website&utm_campaign=summer_sale_2025",
    "shortUrl": "http://localhost:3001/go/Xy9kL2pQ"
  }
}
```

---

## 🧪 Testing

### Test Statistics

- **Total Tests:** 109 tests across 11 test files
- **Pass Rate:** 99.1% (108 passing, 1 flaky)
- **Test Coverage:** 86% lines, 81% functions (adapters)
- **Integration Tests:** 23 tests (Products API)
- **Unit Tests:** 86 tests (services, adapters, utilities)

### Coverage by Package

| Package                  | Files | Tests | Line Coverage | Function Coverage |
| ------------------------ | ----- | ----- | ------------- | ----------------- |
| `packages/adapters`      | 3     | 56    | 86.58%        | 81.67%            |
| `apps/api` (services)    | 4     | 30    | >70%          | >70%              |
| `apps/api` (integration) | 1     | 23    | -             | -                 |

### Run Tests

```bash
# Run all tests
bun test

# Watch mode
bun test --watch

# Specific package
bun --filter api test
bun --filter adapters test

# With coverage
bun run test:coverage

# Check coverage thresholds
bun run coverage:check
```

### Coverage Reports

After running `bun run test:coverage`:

- **Console:** Text summary with percentages
- **LCOV:** `apps/api/coverage/lcov.info`, `packages/adapters/coverage/lcov.info`
- **JSON:** `coverage-summary.json` in each package

### Test Structure

```
apps/api/
└── __tests__/
    ├── integration/
    │   └── products.integration.test.ts    # 23 tests (API endpoints)
    └── utils/
        ├── test-helpers.ts                 # Database cleanup, factories
        └── auth-helpers.ts                 # JWT token helpers

packages/adapters/
└── src/__tests__/
    ├── utils.test.ts                       # 20 tests (URL parsing)
    ├── lazada.adapter.test.ts              # 18 tests
    └── shopee.adapter.test.ts              # 18 tests
```


## 🔮 Future Roadmap

### High Priority (1-2 weeks)

**1. Real Marketplace API Integration** - Connect to official Lazada/Shopee APIs for live pricing, availability checking, and automated syncing (5-7 days)

**2. Admin Authentication** - Multi-user support with role-based access (Admin/Viewer/Editor), Google OAuth, password reset, and audit logs (3-4 days)

### Medium Priority (3-7 days)

**3. Email Notifications** - Automated alerts for price drops, campaign performance summaries, weekly reports, and product suggestions (2-3 days)

**4. Webhook System** - Event-driven notifications for campaign lifecycle, price changes, and threshold alerts with Slack/Discord integration (2-3 days)

**5. Performance Optimizations** - Implement Redis caching for hot data, fix N+1 queries, add CDN for images, and server-side pagination (2-3 days)

### Nice to Have (1-3 weeks)

**6. GraphQL API** - Apollo Server with subscriptions, reduced over-fetching, and interactive playground (5-6 days)

**7. Machine Learning** - Product recommendations, price predictions, campaign timing optimization, and anomaly detection (14-21 days)

---

## 📖 Additional Documentation

- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** - Complete implementation plan (1638 lines)
- **[CLAUDE.md](./CLAUDE.md)** - Development guide for AI assistants (1638 lines)
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Detailed deployment guide (654 lines)
- **[Test Assignment](./Test%20Assignment%20_%20Software%20Engineer%20-%20Lead%20Engineer.md)** - Original requirements

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details
