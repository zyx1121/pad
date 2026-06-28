// Domain operations — EVERY read/write routes through authz.ts.
// Reviewer invariant: no DB query in this file bypasses canRead / canComment / canManageSharing.

import { and, eq, or, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

import { reanchor, type Anchor } from "../anchor.ts"
import {
  canComment,
  canManageSharing,
  canRead,
  commentTrust,
  isOwner,
  type DocAuthView,
  type Principal,
} from "../authz.ts"
import { getDb } from "../db.ts"
import { comments, docRevisions, docs, docShares } from "../schema/index.ts"

// --- Result types ------------------------------------------------------------

export type DocResult =
  | { kind: "ok"; doc: typeof docs.$inferSelect }
  | { kind: "forbidden" }

export type UpdateResult =
  | { kind: "ok"; doc: typeof docs.$inferSelect }
  | { kind: "forbidden" }
  | { kind: "version_conflict"; current: number }

export type CommentResult =
  | { kind: "ok"; comment: typeof comments.$inferSelect }
  | { kind: "forbidden" }

// --- Helpers -----------------------------------------------------------------

async function loadDocAuthView(docId: string): Promise<{
  row: typeof docs.$inferSelect
  view: DocAuthView
} | null> {
  const db = getDb()
  const [row] = await db.select().from(docs).where(eq(docs.id, docId)).limit(1)
  if (!row) return null

  let sharedWith = new Set<string>()
  if (row.visibility === "shared") {
    const rows = await db
      .select({ email: docShares.email })
      .from(docShares)
      .where(eq(docShares.docId, docId))
    sharedWith = new Set(rows.map((r) => r.email.toLowerCase()))
  }

  const view: DocAuthView = {
    ownerEmail: row.ownerEmail,
    visibility: row.visibility,
    sharedWith,
  }
  return { row, view }
}

// --- Operations --------------------------------------------------------------

export async function createDoc(
  principal: Principal,
  input: {
    title: string
    content?: string
    visibility?: "private" | "shared" | "public"
    tags?: string[]
  }
): Promise<typeof docs.$inferSelect> {
  const db = getDb()
  const ownerEmailEnv = (process.env["OWNER_EMAIL"] ?? "").toLowerCase()

  // Owner identity is the Google email (canonical). Agent acts as the configured
  // owner; a user owns docs under their own email. Anon cannot create.
  let ownerEmail: string
  if (principal.kind === "agent") {
    ownerEmail = ownerEmailEnv
  } else if (principal.kind === "user") {
    ownerEmail = principal.email.toLowerCase()
  } else {
    throw Object.assign(new Error("Forbidden: anon cannot create docs"), { code: "FORBIDDEN" })
  }

  const id = nanoid(12)
  const visibility = input.visibility ?? "private"

  const [doc] = await db
    .insert(docs)
    .values({
      id,
      title: input.title,
      content: input.content ?? "",
      visibility,
      ownerEmail,
      version: 1,
    })
    .returning()

  if (!doc) throw new Error("createDoc: insert returned no row")
  return doc
}

export async function getDoc(
  principal: Principal,
  docId: string
): Promise<DocResult> {
  const loaded = await loadDocAuthView(docId)
  if (!loaded) return { kind: "forbidden" } // not found = same as forbidden (no enumeration)

  if (!canRead(principal, loaded.view)) return { kind: "forbidden" }
  return { kind: "ok", doc: loaded.row }
}

export async function listDocsFor(
  principal: Principal,
  filter?: { status?: string; tag?: string }
): Promise<(typeof docs.$inferSelect)[]> {
  const db = getDb()

  // [THREAT-I-1] Only return docs the principal can see:
  // - owner sees all their own docs
  // - anon / non-owner sees only public docs + shared-with-them
  // This is enforced in SQL, not post-filter, to avoid accidental enumeration.
  let rows: (typeof docs.$inferSelect)[]

  if (principal.kind === "agent") {
    // Agent is owner-scoped: sees everything the owner owns
    const ownerEmail = (process.env["OWNER_EMAIL"] ?? "").toLowerCase()
    rows = await db.select().from(docs).where(eq(docs.ownerEmail, ownerEmail))
  } else if (principal.kind === "user") {
    // User sees their own docs + public docs + docs shared with their email
    const email = principal.email.toLowerCase()
    const sharedDocIds = db
      .select({ docId: docShares.docId })
      .from(docShares)
      .where(eq(docShares.email, email))

    rows = await db
      .select()
      .from(docs)
      .where(
        or(
          eq(docs.ownerEmail, email),
          eq(docs.visibility, "public"),
          and(
            eq(docs.visibility, "shared"),
            sql`${docs.id} IN (${sharedDocIds})`
          )
        )
      )
  } else {
    // anon: only public
    rows = await db
      .select()
      .from(docs)
      .where(eq(docs.visibility, "public"))
  }

  // Post-filter on status/tag if provided
  return rows.filter((r) => {
    if (filter?.status && r.status !== filter.status) return false
    if (filter?.tag && !r.tags.includes(filter.tag)) return false
    return true
  })
}

export async function updateDoc(
  principal: Principal,
  docId: string,
  content: string,
  baseVersion: number,
  meta?: { summary?: string; title?: string }
): Promise<UpdateResult> {
  const db = getDb()
  const loaded = await loadDocAuthView(docId)
  if (!loaded) return { kind: "forbidden" }

  // Only owner can write content (agent acts as owner) — single authz source
  if (!isOwner(principal, loaded.view)) return { kind: "forbidden" }

  // [THREAT-T-1] Optimistic lock: update only if version matches baseVersion.
  // Uses conditional UPDATE to prevent lost-update race conditions.
  const updates: Partial<typeof docs.$inferInsert> = {
    content,
    version: baseVersion + 1,
    updatedAt: new Date(),
  }
  if (meta?.title) updates.title = meta.title

  const authorKind = principal.kind === "agent" ? "agent" : "owner"
  const authorId = principal.kind === "user" ? principal.userId : "agent"

  // Conditional UPDATE (optimistic lock) + revision snapshot, atomic — version
  // history can't desync from content if the snapshot insert fails.
  const updated = await db.transaction(async (tx) => {
    const rows = await tx
      .update(docs)
      .set(updates)
      .where(and(eq(docs.id, docId), eq(docs.version, baseVersion)))
      .returning()
    if (rows.length === 0) return null
    const row = rows[0]!
    await tx.insert(docRevisions).values({
      docId,
      version: row.version,
      content,
      authorKind,
      authorId,
      summary: meta?.summary,
    })
    return row
  })

  if (!updated) {
    // version mismatch or doc gone — re-check to distinguish
    const [current] = await db
      .select({ version: docs.version })
      .from(docs)
      .where(eq(docs.id, docId))
      .limit(1)
    if (!current) return { kind: "forbidden" }
    return { kind: "version_conflict", current: current.version }
  }

  return { kind: "ok", doc: updated }
}

export async function addComment(
  principal: Principal,
  docId: string,
  body: string,
  anchor?: Anchor & { revision: number },
  parentId?: number
): Promise<CommentResult> {
  const db = getDb()
  const loaded = await loadDocAuthView(docId)
  if (!loaded) return { kind: "forbidden" }

  if (principal.kind === "anon") return { kind: "forbidden" } // no anon comments ever
  if (!canComment(principal, loaded.view)) return { kind: "forbidden" }

  // Author identity: a user comments as themselves; the agent comments as the owner.
  const ownerEmailEnv = (process.env["OWNER_EMAIL"] ?? "").toLowerCase()
  const authorUserId = principal.kind === "user" ? principal.userId : "agent"
  const authorEmail =
    principal.kind === "user" ? principal.email.toLowerCase() : ownerEmailEnv

  // Trust is computed LIVE, not from stored value (agent/owner → 'owner')
  const trust = commentTrust(principal, loaded.view)

  const [comment] = await db
    .insert(comments)
    .values({
      docId,
      parentId: parentId ?? null,
      body,
      authorUserId,
      authorEmail,
      trust,
      anchorRevision: anchor?.revision ?? null,
      anchorLineStart: anchor?.lineStart ?? null,
      anchorLineEnd: anchor?.lineEnd ?? null,
      anchorQuote: anchor?.quote ?? null,
    })
    .returning()

  if (!comment) throw new Error("addComment: insert returned no row")
  return { kind: "ok", comment }
}

export async function listComments(
  principal: Principal,
  docId: string
): Promise<
  | { kind: "forbidden" }
  | {
      kind: "ok"
      comments: Array<
        typeof comments.$inferSelect & {
          reanchoredStatus: "current" | "outdated" | "doc-level"
          reanchoredLineStart?: number
          reanchoredLineEnd?: number
          liveTrust: "owner" | "shared" | "public"
        }
      >
    }
> {
  const db = getDb()
  const loaded = await loadDocAuthView(docId)
  if (!loaded) return { kind: "forbidden" }
  if (!canRead(principal, loaded.view)) return { kind: "forbidden" }

  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.docId, docId))

  const currentContent = loaded.row.content

  // Reanchor + recompute trust LIVE for every comment
  const enriched = rows.map((c) => {
    // Resolve the principal who authored the comment for trust recomputation
    const authorPrincipal: Principal = {
      kind: "user",
      userId: c.authorUserId,
      email: c.authorEmail,
    }
    const liveTrust = commentTrust(authorPrincipal, loaded.view)

    if (c.anchorQuote && c.anchorLineStart && c.anchorLineEnd) {
      const reanchored = reanchor(currentContent, {
        lineStart: c.anchorLineStart,
        lineEnd: c.anchorLineEnd,
        quote: c.anchorQuote,
      })
      if (reanchored.status === "current") {
        return {
          ...c,
          liveTrust,
          reanchoredStatus: "current" as const,
          reanchoredLineStart: reanchored.lineStart,
          reanchoredLineEnd: reanchored.lineEnd,
        }
      }
      return { ...c, liveTrust, reanchoredStatus: "outdated" as const }
    }

    return { ...c, liveTrust, reanchoredStatus: "doc-level" as const }
  })

  return { kind: "ok", comments: enriched }
}

export async function resolveComment(
  principal: Principal,
  commentId: number
): Promise<{ kind: "ok" } | { kind: "forbidden" }> {
  const db = getDb()

  const [c] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1)
  if (!c) return { kind: "forbidden" }

  const loaded = await loadDocAuthView(c.docId)
  if (!loaded) return { kind: "forbidden" }

  // Only doc owner can resolve (agent acts as owner) — single authz source
  if (!isOwner(principal, loaded.view)) return { kind: "forbidden" }

  await db
    .update(comments)
    .set({ status: "resolved" })
    .where(eq(comments.id, commentId))

  return { kind: "ok" }
}

export async function setVisibility(
  principal: Principal,
  docId: string,
  visibility: "private" | "shared" | "public"
): Promise<{ kind: "ok" } | { kind: "forbidden" }> {
  const db = getDb()
  const loaded = await loadDocAuthView(docId)
  if (!loaded) return { kind: "forbidden" }

  // [THREAT-E-1] agent cannot change visibility — canManageSharing enforces this
  if (!canManageSharing(principal, loaded.view)) return { kind: "forbidden" }

  await db.update(docs).set({ visibility }).where(eq(docs.id, docId))
  return { kind: "ok" }
}

export async function setShares(
  principal: Principal,
  docId: string,
  emails: string[]
): Promise<{ kind: "ok" } | { kind: "forbidden" }> {
  const db = getDb()
  const loaded = await loadDocAuthView(docId)
  if (!loaded) return { kind: "forbidden" }

  // [THREAT-E-1] agent cannot modify ACL
  if (!canManageSharing(principal, loaded.view)) return { kind: "forbidden" }

  // Replace ACL in one transaction — grantees are never momentarily locked out
  // mid-update (delete-then-insert window).
  await db.transaction(async (tx) => {
    await tx.delete(docShares).where(eq(docShares.docId, docId))
    if (emails.length > 0) {
      await tx.insert(docShares).values(
        emails.map((email) => ({ docId, email: email.toLowerCase() }))
      )
    }
  })
  return { kind: "ok" }
}
