import { createHash, timingSafeEqual } from "node:crypto"

import { config } from "./config.ts"

// [THREAT-S-1] Constant-time bearer comparison via fixed-length digests — both
// operands hash to 32 bytes regardless of input length, so there is no length
// side-channel (and no need to hand-pad buffers).
function tokenEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest()
  const hb = createHash("sha256").update(b).digest()
  return timingSafeEqual(ha, hb)
}

// Fail CLOSED: a missing/short configured token denies EVERY request (never open).
// Startup (server.ts) also exits when unset — this is defense-in-depth.
export function checkAuth(req: Request): Response | null {
  const required = config.mcpWriteToken
  if (!required || required.length < 16) {
    return new Response("Unauthorized", { status: 401 })
  }

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
