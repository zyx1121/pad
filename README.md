# pad

For-agent markdown store — **MCP-first**. Agents create / read / update markdown
docs (and threaded, anchored comments) over MCP; storage is Postgres. No human web
UI — agents are the only consumers.

## Layout (turborepo + bun)

- `packages/domain` — `@workspace/domain`: drizzle schema, authz (single source),
  ops, migrations
- `apps/mcp` — **pad-core**: Bun MCP server (`/mcp`, bearer-gated, owner-scoped)

## Dev

```bash
bun install
bun run typecheck
# needs DATABASE_URL, MCP_WRITE_TOKEN (>=16 chars), OWNER_EMAIL
bun run apps/mcp/src/server.ts
```

## MCP tools

`doc_create` · `doc_read` · `doc_update` (optimistic lock via `base_version`) ·
`doc_list` · `comments_list` · `comment_reply` · `comment_resolve`

## Deploy

CI builds `ghcr.io/zyx1121/pad-core` (SHA-pinned) → deployed to k3s via the
**vivarium** GitOps repo (namespace `pad`): `pad-db` (Postgres) + `pad-core`.
MCP endpoint: `pad-mcp.app.zyx.tw` (external, token) · `pad-mcp.internal` (in-cluster).

> A human read/comment web app (`apps/web` + `packages/ui`) was removed — it lives
> in git history if ever needed, but agents talk to pad over MCP, not a browser.
