// Auth + DB read — must not be SSG
export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { getPrincipal, isOwnerEmail } from "@/lib/principal"
import { getDoc, listComments } from "@workspace/domain/ops"
import { DocReader } from "@/components/doc-reader"
import { headers } from "next/headers"
import { getAuth } from "@/lib/auth"

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

  const session = await getAuth().api.getSession({ headers: await headers() })
  const userEmail = session?.user?.email ?? null
  const ownerMode = isOwnerEmail(userEmail)

  const canCommentFlag =
    principal.kind !== "anon" && commentsResult.kind === "ok"

  return (
    <DocReader
      doc={{
        id: doc.id,
        title: doc.title,
        content: doc.content,
        version: doc.version,
        visibility: doc.visibility,
      }}
      comments={commentList.map((c) => ({
        id: c.id,
        body: c.body,
        authorEmail: c.authorEmail,
        liveTrust: c.liveTrust,
        reanchoredStatus: c.reanchoredStatus,
        reanchoredLineStart: c.reanchoredLineStart,
        reanchoredLineEnd: c.reanchoredLineEnd,
        anchorQuote: c.anchorQuote,
        status: c.status,
        createdAt: c.createdAt,
      }))}
      ownerMode={ownerMode}
      canComment={canCommentFlag}
      docId={doc.id}
    />
  )
}
