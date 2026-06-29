"use client"

// InlineCommentComposer: compact textarea + submit/cancel for inline commenting.
// Used in both the right margin (desktop) and below selection (mobile).

import { useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"

interface Props {
  /** The selected quote being commented on (shows a preview) */
  quote?: string
  onSubmit: (body: string) => Promise<void>
  onCancel?: () => void
}

export function InlineCommentComposer({ quote, onSubmit, onCancel }: Props) {
  const [body, setBody] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setPending(true)
    await onSubmit(body.trim())
    setPending(false)
    setBody("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {quote && (
        <blockquote className="border-l-2 border-yellow-400 pl-2 text-xs italic text-muted-foreground line-clamp-3">
          {quote}
        </blockquote>
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={quote ? "留下評論…" : "留下整篇留言…"}
        rows={3}
        maxLength={4000}
        disabled={pending}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none disabled:opacity-50"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={pending} disabled={!body.trim()}>
          送出
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={pending}
          >
            取消
          </Button>
        )}
      </div>
    </form>
  )
}
