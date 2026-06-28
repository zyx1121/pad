FROM oven/bun:1.3.13-alpine AS base
WORKDIR /app

# --- deps stage: install workspace dependencies ------------------------------
FROM base AS deps
# Copy workspace manifests needed to resolve the monorepo graph
COPY package.json bun.lock* ./
COPY packages/domain/package.json ./packages/domain/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY apps/mcp/package.json ./apps/mcp/package.json
RUN bun install --frozen-lockfile --production

# --- runner stage: copy sources and start ------------------------------------
FROM base AS runner
WORKDIR /app

# Workspace config
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./

# Packages
COPY packages/domain ./packages/domain
COPY packages/typescript-config ./packages/typescript-config

# App
COPY apps/mcp ./apps/mcp

# Migrations produced by drizzle-kit generate (committed to repo)
COPY migrations ./migrations

ENV PORT=8080
ENV MCP_PATH=/mcp
# DATABASE_URL, MCP_WRITE_TOKEN, OWNER_EMAIL, DEFAULT_VISIBILITY → injected at runtime

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/healthz || exit 1

CMD ["bun", "run", "apps/mcp/src/server.ts"]
