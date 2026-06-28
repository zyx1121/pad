import { NextResponse } from "next/server"

// k8s readiness + liveness probe endpoint.
export function GET() {
  return NextResponse.json({ ok: true }, { status: 200 })
}
