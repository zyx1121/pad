CREATE TYPE "public"."doc_visibility" AS ENUM('private', 'shared', 'public');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"doc_id" text NOT NULL,
	"parent_id" bigint,
	"body" text NOT NULL,
	"author_user_id" text NOT NULL,
	"author_email" text NOT NULL,
	"trust" text NOT NULL,
	"anchor_revision" integer,
	"anchor_line_start" integer,
	"anchor_line_end" integer,
	"anchor_quote" text,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doc_revisions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "doc_revisions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"doc_id" text NOT NULL,
	"version" integer NOT NULL,
	"content" text NOT NULL,
	"author_kind" text NOT NULL,
	"author_id" text,
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "doc_revisions_doc_id_version_unique" UNIQUE("doc_id","version")
);
--> statement-breakpoint
CREATE TABLE "doc_shares" (
	"doc_id" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "doc_shares_doc_id_email_pk" PRIMARY KEY("doc_id","email")
);
--> statement-breakpoint
CREATE TABLE "docs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"visibility" "doc_visibility" DEFAULT 'private' NOT NULL,
	"owner_email" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_doc_id_docs_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doc_revisions" ADD CONSTRAINT "doc_revisions_doc_id_docs_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doc_shares" ADD CONSTRAINT "doc_shares_doc_id_docs_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_doc_status_idx" ON "comments" USING btree ("doc_id","status");--> statement-breakpoint
CREATE INDEX "doc_shares_email_idx" ON "doc_shares" USING btree ("email");--> statement-breakpoint
CREATE INDEX "docs_visibility_idx" ON "docs" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "docs_owner_idx" ON "docs" USING btree ("owner_email");