import { pingDb } from "@workspace/domain/db"
import { runMigrations } from "@workspace/domain/migrate"

import { config } from "./config.ts"
import { handleMcp } from "./mcp-dispatch.ts"

async function main() {
  console.log("[pad-core] starting...")

  if (!config.mcpWriteToken) {
    console.warn("[pad-core] WARN: MCP_WRITE_TOKEN not set — /mcp is open (dev only)")
  }
  if (!config.ownerEmail) {
    console.warn("[pad-core] WARN: OWNER_EMAIL not set — agent doc ownership will fail")
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
