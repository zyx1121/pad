"use client"

import { resolveCommentAction } from "@/lib/actions"
import { CheckCheck } from "lucide-react"

type Comment = {
  id: number
  body: string
  authorEmail: string
  liveTrust: "owner" | "shared" | "public"
  reanchoredStatus: "current" | "outdated" | "doc-level"
  status: string
  createdAt: Date
}

const trustLabel: Record<string, string> = {
  owner: "擁有者",
  shared: "分享",
  public: "公開",
}

const trustColor: Record<string, string> = {
  owner: "bg-primary/10 text-primary",
  shared: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  public: "bg-muted text-muted-foreground",
}

interface Props {
  comments: Comment[]
  ownerMode: boolean
  docId: string
}

export function CommentList({ comments, ownerMode, docId }: Props) {
  const open = comments.filter((c) => c.status === "open")
  const resolved = comments.filter((c) => c.status === "resolved")

  return (
    <ul className="mb-6 space-y-3">
      {open.map((c) => (
        <li key={c.id} className="rounded-lg border p-4">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{c.authorEmail}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${trustColor[c.liveTrust] ?? ""}`}
            >
              {trustLabel[c.liveTrust]}
            </span>
            {c.reanchoredStatus === "outdated" && (
              <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-700 dark:text-yellow-400">
                已過時
              </span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {new Date(c.createdAt).toLocaleString("zh-TW")}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm">{c.body}</p>
          {ownerMode && (
            <form action={resolveCommentAction} className="mt-2">
              <input type="hidden" name="commentId" value={c.id} />
              <input type="hidden" name="docId" value={docId} />
              <button
                type="submit"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <CheckCheck className="h-3 w-3" />
                標記已解決
              </button>
            </form>
          )}
        </li>
      ))}
      {resolved.length > 0 && (
        <li className="text-xs text-muted-foreground pt-2">
          另有 {resolved.length} 則已解決的留言。
        </li>
      )}
    </ul>
  )
}
