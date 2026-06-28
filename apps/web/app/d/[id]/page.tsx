import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getPrincipal, isOwnerEmail } from "@/lib/principal"
import { getDoc, listComments } from "@workspace/domain/ops"
import { MarkdownView } from "@/components/markdown-view"
import { CommentList } from "@/components/comment-list"
import { CommentForm } from "@/components/comment-form"
import { ShareControls } from "@/components/share-controls"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import type { Principal } from "@workspace/domain/authz"
import { canComment } from "@workspace/domain/authz"

interface Props {
  params: Promise<{ id: string }>
}

export default async function DocPage({ params }: Props) {
  const { id } = await params
  const principal = await getPrincipal()

  const docResult = await getDoc(principal, id)
  if (docResult.kind === "forbidden") notFound()

  const { doc } = docResult

  const commentsResult = await listComments(principal, id)
  const commentList =
    commentsResult.kind === "ok" ? commentsResult.comments : []

  const session = await auth.api.getSession({ headers: await headers() })
  const userEmail = session?.user?.email ?? null
  const ownerMode = isOwnerEmail(userEmail)

  // canComment needs a DocAuthView; re-use principal + visibility info
  // The check is informational for UI only — the server action enforces it again.
  const canCommentFlag =
    principal.kind !== "anon" && commentsResult.kind === "ok"

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Link>
      </div>

      <article className="mb-12">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">{doc.title}</h1>
        <MarkdownView content={doc.content} />
      </article>

      {/* Owner sharing controls */}
      {ownerMode && (
        <section className="mb-10 rounded-lg border p-4">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            分享設定
          </h2>
          <ShareControls docId={doc.id} visibility={doc.visibility} />
        </section>
      )}

      {/* Comments */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">留言</h2>

        {commentList.length === 0 ? (
          <p className="mb-6 text-sm text-muted-foreground">還沒有留言。</p>
        ) : (
          <CommentList
            comments={commentList}
            ownerMode={ownerMode}
            docId={doc.id}
          />
        )}

        {canCommentFlag ? (
          <CommentForm docId={doc.id} />
        ) : (
          <p className="mt-4 rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            <Link href="/login" className="underline hover:text-foreground">
              用 Google 登入
            </Link>{" "}
            以留言
          </p>
        )}
      </section>
    </main>
  )
}
