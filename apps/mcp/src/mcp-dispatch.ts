// Stateless JSON-RPC 2.0 dispatcher for MCP over Bun.serve fetch API.
// Pattern mirrors vivarium-store/src/mcp-dispatch.ts — hand-rolled, no SDK transport.
// WHY: Bun.serve uses WHATWG fetch API; StreamableHTTPServerTransport expects
//      Node http.ServerResponse. Hand-rolling is cleaner and fully controllable.

import { checkAuth } from "./auth.ts"
import { TOOLS } from "./mcp-tools.ts"

const TOOL_MAP = new Map(TOOLS.map((t) => [t.name, t]))

const SERVER_INFO = { name: "pad-core", version: "0.1.0" }
const CAPABILITIES = { tools: {} }
const PROTOCOL_VERSION = "2024-11-05"

function ok(id: unknown, result: unknown): Response {
  return Response.json({ jsonrpc: "2.0", id, result }, { status: 200 })
}

function err(id: unknown, code: number, message: string): Response {
  return Response.json(
    { jsonrpc: "2.0", id, error: { code, message } },
    { status: 200 } // JSON-RPC errors are HTTP 200
  )
}

export async function handleMcp(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("MCP endpoint requires POST", { status: 405 })
  }

  const authReject = checkAuth(req)
  if (authReject) return authReject

  let body: {
    jsonrpc?: string
    id?: unknown
    method?: string
    params?: Record<string, unknown>
  }
  try {
    body = await req.json()
  } catch {
    return err(null, -32700, "Parse error: invalid JSON")
  }

  const { id, method, params } = body
  if (!method) return err(id ?? null, -32600, "Invalid Request: missing method")

  if (method === "initialize") {
    return ok(id, {
      protocolVersion: PROTOCOL_VERSION,
      serverInfo: SERVER_INFO,
      capabilities: CAPABILITIES,
    })
  }

  if (method === "notifications/initialized") {
    return new Response(null, { status: 204 })
  }

  if (method === "tools/list") {
    return ok(id, {
      tools: TOOLS.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
    })
  }

  if (method === "tools/call") {
    const toolName = (params?.["name"] as string | undefined)?.trim()
    const toolArgs = (params?.["arguments"] ?? {}) as Record<string, unknown>

    if (!toolName) return err(id, -32602, "Invalid params: missing tool name")

    const tool = TOOL_MAP.get(toolName)
    if (!tool) return err(id, -32602, `Unknown tool: ${toolName}`)

    try {
      const result = await tool.handler(toolArgs)
      return ok(id, {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      })
    } catch (e) {
      console.error(`[mcp] tools/call ${toolName} error:`, e)
      return ok(id, {
        content: [
          { type: "text", text: `{"error": "${(e as Error).message}"}` },
        ],
        isError: true,
      })
    }
  }

  return err(id ?? null, -32601, `Method not found: ${method}`)
}
