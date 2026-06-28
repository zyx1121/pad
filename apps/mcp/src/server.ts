import { pingDb } from "@workspace/domain/db"
import { runMigrations } from "@workspace/domain/migrate"

import { config } from "./config.ts"
import { handleMcp } from "./mcp-dispatch.ts"

async function main() {
  console.log("[pad-core] starting...")

  // Fail CLOSED: refuse to start without a strong bearer token — /mcp is never open.
  if (!config.mcpWriteToken || config.mcpWriteToken.length < 16) {
    console.error("[pad-core] FATAL: MCP_WRITE_TOKEN must be set (>=16 chars)")
    process.exit(1)
  }
  if (!config.ownerEmail) {
    console.error("[pad-core] FATAL: OWNER_EMAIL must be set (agent doc ownership)")
    process.exit(1)
  }

  try {
    await runMigrations()
  } catch (err) {
    console.error("[pad-core] migration failed:", err)
    process.exit(1)
  }

  const server = Bun.serve({
    port: config.port,
    async fetch(req) {
      const url = new URL(req.url)
      const path = url.pathname

      if (path === "/healthz" && req.method === "GET") {
        const ok = await pingDb()
        return Response.json(
          { status: ok ? "ok" : "degraded", pg: ok },
          { status: ok ? 200 : 503 }
        )
      }

      if (path === config.mcpPath) return handleMcp(req)

      return new Response("not found", { status: 404 })
    },
  })

  console.log(`[pad-core] listening on port ${server.port}`)
  console.log(`[pad-core] MCP: POST ${config.mcpPath}`)
  console.log(`[pad-core] health: GET /healthz`)
}

main()
