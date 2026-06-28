// @pad/domain — the SINGLE authorization source. Imported by BOTH pad-core (MCP,
// agent surface) and pad-web (Next.js, human surface). Never inline an authz check
// in either app — drift here is a security hole. Every read / comment / manage path
// routes through these functions.

export type Principal =
  | { kind: 'agent' }                                    // MCP bearer token → owner-scoped
  | { kind: 'user'; userId: string; email: string }      // Better Auth session
  | { kind: 'anon' }                                      // unauthenticated web visitor

export interface DocAuthView {
  ownerEmail: string // canonical owner identity = lowercased Google email
  visibility: 'private' | 'shared' | 'public'
  sharedWith: Set<string> // lowercased emails; populated only for 'shared'
}

// Owner identity is the Google email (canonical). The agent is owner-scoped; a
// logged-in user is owner iff their email matches. NEVER compare by Better Auth
// userId — the agent only knows the email, and ACLs (sharedWith) are email-based too.
export const isOwner = (p: Principal, d: DocAuthView): boolean =>
  p.kind === 'agent' ||
  (p.kind === 'user' && p.email.toLowerCase() === d.ownerEmail)

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
  // owner-only AND human-only — agent excluded (anti-injection on publish/share)
  return p.kind === 'user' && p.email.toLowerCase() === d.ownerEmail
}

// Provenance for the agent feed. Recompute LIVE from current ownership/ACL — never
// trust comments.trust blindly. Only 'owner' comments are treated as INSTRUCTIONS
// by the agent; 'shared' and 'public' are DATA to surface for owner triage.
export function commentTrust(
  p: Principal,
  d: DocAuthView,
): 'owner' | 'shared' | 'public' {
  if (isOwner(p, d)) return 'owner' // agent, or a user whose email is the owner's
  if (onACL(p, d)) return 'shared'
  return 'public'
}
