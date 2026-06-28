// @pad/domain — the SINGLE authorization source. Imported by BOTH pad-core (MCP,
// agent surface) and pad-web (Next.js, human surface). Never inline an authz check
// in either app — drift here is a security hole. Every read / comment / manage path
// routes through these functions.

export type Principal =
  | { kind: 'agent' }                                    // MCP bearer token → owner-scoped
  | { kind: 'user'; userId: string; email: string }      // Better Auth session
  | { kind: 'anon' }                                      // unauthenticated web visitor

export interface DocAuthView {
  ownerId: string
  visibility: 'private' | 'shared' | 'public'
  sharedWith: Set<string> // lowercased emails; populated only for 'shared'
}

const isOwner = (p: Principal, d: DocAuthView): boolean =>
  p.kind === 'agent' ||                                   // the agent is YOUR agent
  (p.kind === 'user' && p.userId === d.ownerId)

const onACL = (p: Principal, d: DocAuthView): boolean =>
  p.kind === 'user' && d.sharedWith.has(p.email.toLowerCase())

export function canRead(p: Principal, d: DocAuthView): boolean {
  if (isOwner(p, d)) return true
  if (d.visibility === 'public') return true             // incl. anon
  if (d.visibility === 'shared') return onACL(p, d)
  return false                                           // private
}

// Comment ALWAYS requires login — no anon comments (anti-spam + provenance).
export function canComment(p: Principal, d: DocAuthView): boolean {
  if (isOwner(p, d)) return true
  if (p.kind !== 'user') return false                    // anon blocked everywhere
  if (d.visibility === 'public') return true             // any Google account
  if (d.visibility === 'shared') return onACL(p, d)
  return false                                           // private
}

// Mutating visibility / ACL / publishing = owner-only AND human-only.
// The agent (MCP) is deliberately excluded → a malicious public comment cannot
// trick the agent into publishing or re-sharing a private doc.
export function canManageSharing(p: Principal, d: DocAuthView): boolean {
  return p.kind === 'user' && p.userId === d.ownerId
}

// Provenance for the agent feed. Recompute LIVE from current ownership/ACL — never
// trust comments.trust blindly. Only 'owner' comments are treated as INSTRUCTIONS
// by the agent; 'shared' and 'public' are DATA to surface for owner triage.
export function commentTrust(
  p: Principal,
  d: DocAuthView,
): 'owner' | 'shared' | 'public' {
  if (p.kind === 'user' && p.userId === d.ownerId) return 'owner'
  if (onACL(p, d)) return 'shared'
  return 'public'
}
