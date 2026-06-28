"use client"

import { useState } from "react"
import { setVisibilityAction, setSharesAction } from "@/lib/actions"

interface Props {
  docId: string
  visibility: "private" | "shared" | "public"
}

export function ShareControls({ docId, visibility: initialVisibility }: Props) {
  const [visibility, setVisibility] = useState(initialVisibility)
  const [sharesInput, setSharesInput] = useState("")
  const [pending, setPending] = useState(false)

  async function handleVisibility(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value as typeof visibility
    setVisibility(v)
    setPending(true)
    const fd = new FormData()
    fd.set("docId", docId)
    fd.set("visibility", v)
    await setVisibilityAction(fd)
    setPending(false)
  }

  async function handleShares(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    const emails = sharesInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    const fd = new FormData()
    fd.set("docId", docId)
    emails.forEach((em) => fd.append("emails", em))
    await setSharesAction(fd)
    setPending(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="visibility" className="text-sm">
          可見度
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={handleVisibility}
          disabled={pending}
          className="rounded-md border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="private">私人</option>
          <option value="shared">分享</option>
          <option value="public">公開</option>
        </select>
        {pending && (
          <span className="text-xs text-muted-foreground">儲存中…</span>
        )}
      </div>

      {visibility === "shared" && (
        <form onSubmit={handleShares} className="space-y-2">
          <label className="text-sm" htmlFor="shares-input">
            分享給（電子郵件，逗號或換行分隔）
          </label>
          <textarea
            id="shares-input"
            rows={3}
            value={sharesInput}
            onChange={(e) => setSharesInput(e.target.value)}
            placeholder="user@example.com"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            更新分享名單
          </button>
        </form>
      )}
    </div>
  )
}
