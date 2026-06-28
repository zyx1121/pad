import { timingSafeEqual } from "node:crypto"

import { config } from "./config.ts"

// [THREAT-S-1] Constant-time bearer token comparison.
// Pads both buffers to the same length so timing doesn't leak token length.
function tokenEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8")
  const bb = Buffer.from(b, "utf8")
  const lenOk = ab.length === bb.length
  const maxLen = Math.max(ab.length, bb.length, 1)
  const pa = Buffer.alloc(maxLen)
  const pb = Buffer.alloc(maxLen)
  ab.copy(pa)
  bb.copy(pb)
  return timingSafeEqual(pa, pb) && lenOk
}

export function checkAuth(req: Request): Response | null {
  const required = config.mcpWriteToken
  if (!required) return null // open in dev; startup already warned

  const authHeader = req.headers.get("Authorization") ?? ""
  const prefix = "Bearer "
  const presented = authHeader.startsWith(prefix)
    ? authHeader.slice(prefix.length)
    : ""

  if (!tokenEqual(presented, required)) {
    return new Response("Unauthorized", { status: 401 })
  }
  return null
}
