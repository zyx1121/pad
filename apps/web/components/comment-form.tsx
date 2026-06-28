"use client"

import { useRef } from "react"
import { addCommentAction } from "@/lib/actions"

interface Props {
  docId: string
}

export function CommentForm({ docId }: Props) {
  const ref = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    await addCommentAction(formData)
    ref.current?.reset()
  }

  return (
    <form ref={ref} action={handleSubmit} className="mt-4 space-y-3">
      <input type="hidden" name="docId" value={docId} />
      <textarea
        name="body"
        required
        minLength={1}
        maxLength={4000}
        rows={4}
        placeholder="留下你的留言…"
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        送出留言
      </button>
    </form>
  )
}
