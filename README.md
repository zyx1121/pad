# pad

For-agent HackMD — MCP-first collaborative markdown. Agents write docs over **MCP**;
humans read and comment over a **web UI**; comments feed back as agent input.

## Layout (turborepo + bun)

- `packages/domain` — `@workspace/domain`: drizzle schema, authz (single source of
  truth), ops, migrations
- `packages/ui` — `@workspace/ui`: radix-luma design system (ui.zyx.tw `@zyx1121`
  registry)
- `apps/mcp` — **pad-core**: Bun MCP server (`/mcp`, bearer-gated, owner-scoped)
- `apps/web` — **pad-web**: Next.js 16 + Better Auth (Google) read/comment UI

## Access model

| visibility       | read          | comment (needs Google login) |
| ---------------- | ------------- | ---------------------------- |
| `private`        | owner + agent | owner + agent                |
| `shared[emails]` | owner + ACL   | owner + ACL                  |
| `public`         | anyone (anon) | any Google account           |

Owner identity = Google email (`OWNER_EMAIL`). Publishing / ACL edits are owner-only
— the agent cannot publish or re-share. Only `owner`-trust comments are treated as
instructions by the agent; `shared` / `public` comments are data for triage.

## Dev

```bash
bun install
bun run typecheck
bun run build
# pad-core — needs DATABASE_URL, MCP_WRITE_TOKEN (>=16), OWNER_EMAIL
bun run apps/mcp/src/server.ts
# pad-web  — needs DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, GOOGLE_CLIENT_ID/SECRET, OWNER_EMAIL
cd apps/web && bun dev
```

## Deploy

CI builds two SHA-pinned images to GHCR: `ghcr.io/zyx1121/pad-core` and
`ghcr.io/zyx1121/pad-web`. Deployed to k3s via the **vivarium** GitOps repo
(namespace `pad`): `pad-db` (Postgres) + `pad-core` + `pad-web`, fronted by Traefik
(`pad.app.zyx.tw` public web, `pad-mcp.app.zyx.tw` / `pad-mcp.internal` for agents).
