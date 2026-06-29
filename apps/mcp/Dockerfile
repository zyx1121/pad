# Monorepo build: copy full source and install in-place. bun keeps per-package bins
# inside each workspace's node_modules, so a cross-stage `COPY node_modules` loses
# them; installing here keeps the workspace graph + binaries intact. The server runs
# TypeScript directly via bun and applies migrations/ on startup.
FROM oven/bun:1.3.13-alpine
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile

ENV PORT=8080
ENV MCP_PATH=/mcp
# DATABASE_URL, MCP_WRITE_TOKEN, OWNER_EMAIL, DEFAULT_VISIBILITY → injected at runtime

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/healthz || exit 1

CMD ["bun", "run", "apps/mcp/src/server.ts"]
