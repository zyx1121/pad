"use client"

import { useRef } from "react"
import { addCommentAction } from "@/lib/actions"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"

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
      <Textarea
        name="body"
        required
        minLength={1}
        maxLength={4000}
        rows={4}
        placeholder="留下你的留言…"
      />
      <Button type="submit">送出留言</Button>
    </form>
  )
}
