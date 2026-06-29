// Next 16: middleware file is proxy.ts (renamed from middleware.ts).
// Defense-in-depth: gate owner-only routes. Public read is intentionally left open
// — authorization is enforced by @workspace/domain ops in each RSC/action.
// [THREAT-E-1] Elevation of privilege: non-owner hitting /owner/** is redirected.
// [THREAT-S-1] Open-redirect prevention: `next` param validated before redirect.

import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@/lib/auth"

export const config = {
  matcher: ["/owner/:path*"],
}

function safeRedirectParam(raw: string | null): string {
  // [MITIGATION for open-redirect] Only allow same-origin relative paths.
  if (!raw) return "/"
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw
  return "/"
}

export async function proxy(request: NextRequest) {
  const session = await getAuth().api.getSession({
    headers: request.headers,
  })

  const ownerEmail = (process.env["OWNER_EMAIL"] ?? "").toLowerCase()
  const userEmail = session?.user?.email?.toLowerCase() ?? ""
  const isOwner = Boolean(userEmail && userEmail === ownerEmail)

  if (!isOwner) {
    const next = safeRedirectParam(
      request.nextUrl.searchParams.get("next") ?? request.nextUrl.pathname
    )
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", next)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
