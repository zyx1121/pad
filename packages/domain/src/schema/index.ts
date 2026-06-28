import {
  bigint,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"

// --- Enums -------------------------------------------------------------------

export const docVisibilityEnum = pgEnum("doc_visibility", [
  "private",
  "shared",
  "public",
])

// --- Tables ------------------------------------------------------------------

export const docs = pgTable(
  "docs",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull().default(""),
    version: integer("version").notNull().default(1),
    visibility: docVisibilityEnum("visibility").notNull().default("private"),
    ownerEmail: text("owner_email").notNull(),
    status: text("status").notNull().default("draft"),
    tags: text("tags").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("docs_visibility_idx").on(t.visibility),
    index("docs_owner_idx").on(t.ownerEmail),
  ]
)

export const docShares = pgTable(
  "doc_shares",
  {
    docId: text("doc_id")
      .notNull()
      .references(() => docs.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.docId, t.email] }),
    index("doc_shares_email_idx").on(t.email),
  ]
)

export const docRevisions = pgTable(
  "doc_revisions",
  {
    id: bigint("id", { mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
    docId: text("doc_id")
      .notNull()
      .references(() => docs.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    content: text("content").notNull(),
    authorKind: text("author_kind").notNull(),
    authorId: text("author_id"),
    summary: text("summary"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique().on(t.docId, t.version)]
)

export const comments = pgTable(
  "comments",
  {
    id: bigint("id", { mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
    docId: text("doc_id")
      .notNull()
      .references(() => docs.id, { onDelete: "cascade" }),
    // Self-reference for thread replies — use a deferred lambda to avoid circular init
    parentId: bigint("parent_id", { mode: "number" }),
    body: text("body").notNull(),
    authorUserId: text("author_user_id").notNull(),
    authorEmail: text("author_email").notNull(),
    // trust is cached for display ONLY — agent feed RECOMPUTES via commentTrust()
    trust: text("trust").notNull(),
    anchorRevision: integer("anchor_revision"),
    anchorLineStart: integer("anchor_line_start"),
    anchorLineEnd: integer("anchor_line_end"),
    anchorQuote: text("anchor_quote"),
    status: text("status").notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("comments_doc_status_idx").on(t.docId, t.status)]
)
