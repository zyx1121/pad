FROM oven/bun:1.3.13-alpine AS base
WORKDIR /app

# --- deps stage: install workspace dependencies ------------------------------
FROM base AS deps
COPY package.json bun.lock* ./
COPY packages/domain/package.json ./packages/domain/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY apps/web/package.json ./apps/web/package.json
# frozen-lockfile needs the FULL workspace graph, even members this image won't run
COPY apps/mcp/package.json ./apps/mcp/package.json
RUN bun install --frozen-lockfile

# --- builder stage: Next.js build (standalone output) ------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY packages/domain ./packages/domain
COPY packages/ui ./packages/ui
COPY packages/typescript-config ./packages/typescript-config
COPY packages/eslint-config ./packages/eslint-config
COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1

RUN cd apps/web && bun run build

# --- runner stage: minimal runtime image -------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL,
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OWNER_EMAIL → injected at runtime

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "apps/web/server.js"]
