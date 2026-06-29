# Monorepo build: copy full source, install in-place (bun puts per-package bins in
# each workspace's node_modules — a cross-stage `COPY node_modules` drops them), then
# build the standalone output. .dockerignore keeps node_modules/.next/.git out.
FROM oven/bun:1.3.13-alpine AS builder
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run --filter=pad-web build

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
