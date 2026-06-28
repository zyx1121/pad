// Web-side principal resolver: reads a Better Auth session and maps it to
// @workspace/domain's Principal type. All server actions and RSCs call this first,
// then pass the principal to domain ops — never inline authz here.

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import type { Principal } from "@workspace/domain/authz"

export async function getPrincipal(): Promise<Principal> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.email) {
    return { kind: "anon" }
  }

  return {
    kind: "user",
    userId: session.user.id,
    email: session.user.email,
  }
}

// Thin helper for UI: owner check is email comparison only.
// Real authorization is enforced by @workspace/domain ops.
export function isOwnerEmail(email: string | null | undefined): boolean {
  const ownerEmail = (process.env["OWNER_EMAIL"] ?? "").toLowerCase()
  return Boolean(email && email.toLowerCase() === ownerEmail)
}
