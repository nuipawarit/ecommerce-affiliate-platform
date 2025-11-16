# Stage 1: Build
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy workspace files
COPY package.json bun.lock ./
COPY turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/adapters/package.json ./packages/adapters/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN bun install

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Set placeholder DATABASE_URL for Prisma generation (real URL injected at runtime)
ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"

# Generate Prisma client
RUN cd packages/database && bun run db:generate

# Build API
RUN cd apps/api && bun run build

# Stage 2: Production
FROM oven/bun:1-slim AS runtime

WORKDIR /app

# Copy package.json for dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/adapters/package.json ./packages/adapters/package.json
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json

# Copy source code from packages
COPY --from=builder /app/packages ./packages

# Install dependencies (including devDependencies for prisma CLI)
RUN bun install

# Install OpenSSL for Prisma runtime
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Generate Prisma Client for production runtime
RUN cd packages/database && bun run db:generate

# Copy built artifacts
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/src ./apps/api/src

# Expose port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:3001/api/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Start server
CMD ["bun", "run", "apps/api/dist/server.js"]
