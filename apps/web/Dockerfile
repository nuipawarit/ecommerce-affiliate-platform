# Stage 1: Dependencies
FROM oven/bun:1 AS deps

WORKDIR /app

# Copy workspace files
COPY package.json bun.lock ./
COPY turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN bun install

# Stage 2: Builder
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY apps/web ./apps/web
COPY packages ./packages
COPY package.json bun.lock turbo.json ./

# Build Next.js with Bun
WORKDIR /app/apps/web
RUN bun run build

# Stage 3: Production
FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

# Health check (using Bun)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000/').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Start Next.js with Bun runtime
CMD ["bun", "run", "apps/web/server.js"]
