"use client"

// Three-column reader shell: outline | prose (68ch) | margin comments.
// Handles: text selection → anchor comment, highlight injection, margin positioning,
// bidirectional focus between highlights and comment cards.
// No global store — all state is local refs + useState.

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { MarkdownView } from "@/components/markdown-view"
import { Outline } from "@/components/outline"
import { CommentMargin } from "@/components/comment-margin"
import { SelectionPopover } from "@/components/selection-popover"
import { InlineCommentComposer } from "@/components/inline-comment-composer"
import { ShareControls } from "@/components/share-controls"
import { addCommentAction } from "@/lib/actions"
import { Badge } from "@workspace/ui/components/ui/badge"

export type CommentItem = {
  id: number
  body: string
  authorEmail: string
  liveTrust: "owner" | "shared" | "public"
  reanchoredStatus: "current" | "outdated" | "doc-level"
  reanchoredLineStart?: number
  reanchoredLineEnd?: number
  anchorQuote: string | null
  status: string
  createdAt: Date
}

interface Props {
  doc: {
    id: string
    title: string
    content: string
    version: number
    visibility: "private" | "shared" | "public"
  }
  comments: CommentItem[]
  ownerMode: boolean
  canComment: boolean
  docId: string
}

interface SelectionAnchor {
  quote: string
  rect: DOMRect
  lineStart?: number
  lineEnd?: number
}

// Compute line numbers from a quote inside raw markdown source
function computeLines(
  content: string,
  quote: string
): { lineStart: number; lineEnd: number } | null {
  const idx = content.indexOf(quote)
  if (idx < 0) return null
  const before = content.slice(0, idx)
  const lineStart = before.split("\n").length
  const span = quote.split("\n").length
  return { lineStart, lineEnd: lineStart + span - 1 }
}

export function DocReader({
  doc,
  comments,
  ownerMode,
  canComment,
  docId,
}: Props) {
  const articleRef = useRef<HTMLDivElement>(null)
  const [selection, setSelection] = useState<SelectionAnchor | null>(null)
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerAnchor, setComposerAnchor] = useState<SelectionAnchor | null>(
    null
  )
  // focusedCommentId: drives bidirectional highlight ↔ card focus
  const [focusedCommentId, setFocusedCommentId] = useState<number | null>(null)
  // map commentId → highlight DOM element
  const highlightRefs = useRef<Map<number, HTMLElement>>(new Map())

  // --- Text selection detection ---
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setSelection(null)
      return
    }
    // Only trigger inside the article
    const art = articleRef.current
    if (!art) return
    const range = sel.getRangeAt(0)
    if (!art.contains(range.commonAncestorContainer)) {
      setSelection(null)
      return
    }
    const quote = sel.toString()
    const rect = range.getBoundingClientRect()
    const lines = computeLines(doc.content, quote)
    setSelection({
      quote,
      rect,
      lineStart: lines?.lineStart,
      lineEnd: lines?.lineEnd,
    })
  }, [doc.content])

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [handleMouseUp])

  // Close selection popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      const popover = document.getElementById("selection-popover")
      const composer = document.getElementById("inline-composer")
      if (
        popover &&
        !popover.contains(target) &&
        composer &&
        !composer.contains(target)
      ) {
        if (!composerOpen) setSelection(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [composerOpen])

  // --- Highlight injection ---
  // After mount + on comment changes, inject <mark> spans for anchored comments.
  useEffect(() => {
    const art = articleRef.current
    if (!art) return

    // Remove all previous marks
    art.querySelectorAll("mark[data-comment-id]").forEach((m) => {
      const parent = m.parentNode
      if (!parent) return
      while (m.firstChild) parent.insertBefore(m.firstChild, m)
      parent.removeChild(m)
    })
    highlightRefs.current.clear()

    // Re-inject for anchored, non-outdated, open comments
    const anchored = comments.filter(
      (c) =>
        c.anchorQuote &&
        c.reanchoredStatus !== "doc-level" &&
        c.status === "open"
    )

    for (const comment of anchored) {
      const quote = comment.anchorQuote!
      // Find text nodes containing the quote
      const walker = document.createTreeWalker(art, NodeFilter.SHOW_TEXT)
      let node: Text | null = null
      let fullText = ""
      const nodes: Text[] = []
      while ((node = walker.nextNode() as Text | null)) {
        nodes.push(node)
        fullText += node.textContent ?? ""
      }

      // Find quote position in concatenated text
      const idx = fullText.indexOf(quote)
      if (idx < 0) continue

      // Map text position to node + offset
      let pos = 0
      let startNode: Text | null = null
      let startOffset = 0
      let endNode: Text | null = null
      let endOffset = 0

      for (const n of nodes) {
        const len = (n.textContent ?? "").length
        if (!startNode && pos + len > idx) {
          startNode = n
          startOffset = idx - pos
        }
        if (!endNode && pos + len >= idx + quote.length) {
          endNode = n
          endOffset = idx + quote.length - pos
          break
        }
        pos += len
      }

      if (!startNode || !endNode) continue

      try {
        const range = document.createRange()
        range.setStart(startNode, startOffset)
        range.setEnd(endNode, endOffset)

        const mark = document.createElement("mark")
        mark.dataset.commentId = String(comment.id)
        mark.className =
          "bg-yellow-200/60 dark:bg-yellow-500/25 rounded-sm cursor-pointer transition-colors"
        mark.addEventListener("mouseenter", () =>
          setFocusedCommentId(comment.id)
        )
        mark.addEventListener("mouseleave", () => setFocusedCommentId(null))
        mark.addEventListener("click", () => {
          setFocusedCommentId(comment.id)
          // Scroll comment card into view
          const card = document.getElementById(`comment-card-${comment.id}`)
          card?.scrollIntoView({ behavior: "smooth", block: "nearest" })
        })
        range.surroundContents(mark)
        highlightRefs.current.set(comment.id, mark)
      } catch {
        // range.surroundContents throws if range crosses element boundaries — skip
      }
    }
  }, [comments])

  // --- Comment submit ---
  async function handleCommentSubmit(body: string) {
    if (!composerAnchor) return
    const fd = new FormData()
    fd.set("docId", docId)
    fd.set("body", body)
    fd.set("anchorQuote", composerAnchor.quote)
    fd.set("anchorRevision", String(doc.version))
    if (composerAnchor.lineStart != null)
      fd.set("anchorLineStart", String(composerAnchor.lineStart))
    if (composerAnchor.lineEnd != null)
      fd.set("anchorLineEnd", String(composerAnchor.lineEnd))
    await addCommentAction(fd)
    setComposerOpen(false)
    setComposerAnchor(null)
    setSelection(null)
  }

  const openComposer = useCallback(() => {
    if (!selection) return
    setComposerAnchor(selection)
    setComposerOpen(true)
    setSelection(null)
    window.getSelection()?.removeAllRanges()
  }, [selection])

  const docLevelComments = comments.filter(
    (c) => c.reanchoredStatus === "doc-level" && c.status === "open"
  )
  const marginComments = comments.filter(
    (c) => c.reanchoredStatus !== "doc-level" && c.status === "open"
  )

  return (
    <div className="min-h-screen">
      {/* Top nav bar */}
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Link>
          <h1 className="flex-1 truncate text-sm font-medium">{doc.title}</h1>
          {ownerMode && (
            <div className="hidden lg:block">
              <ShareControls docId={doc.id} visibility={doc.visibility} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="lg:hidden">
        {/* Mobile outline: collapsible */}
        <details className="border-b">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
            目錄
          </summary>
          <div className="px-4 pb-4">
            <Outline content={doc.content} />
          </div>
        </details>

        {/* Mobile article */}
        <div className="px-4 py-8">
          <h1 className="mb-8 text-2xl font-bold tracking-tight">
            {doc.title}
          </h1>
          <div ref={articleRef}>
            <MarkdownView content={doc.content} />
          </div>
        </div>

        {/* Mobile comments */}
        <div className="border-t px-4 py-6">
          <h2 className="mb-4 text-base font-semibold">留言</h2>
          <MobileCommentSection
            comments={comments}
            ownerMode={ownerMode}
            canComment={canComment}
            docId={docId}
            doc={doc}
          />
        </div>

        {ownerMode && (
          <div className="border-t px-4 py-6">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              分享設定
            </h2>
            <ShareControls docId={doc.id} visibility={doc.visibility} />
          </div>
        )}
      </div>

      {/* Desktop: three-column layout */}
      <div className="hidden lg:grid lg:grid-cols-[220px_1fr_320px] lg:gap-0 max-w-[1400px] mx-auto">
        {/* Left: outline */}
        <aside className="sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto border-r px-4 py-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            目錄
          </p>
          <Outline content={doc.content} />
        </aside>

        {/* Center: prose */}
        <main className="px-8 py-12 min-w-0">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">
            {doc.title}
          </h1>
          <div ref={articleRef} className="relative">
            <MarkdownView content={doc.content} />
          </div>

          {/* Inline composer (desktop: appears below selection) */}
          {composerOpen && composerAnchor && (
            <div id="inline-composer" className="mt-6">
              <InlineCommentComposer
                quote={composerAnchor.quote}
                onSubmit={handleCommentSubmit}
                onCancel={() => {
                  setComposerOpen(false)
                  setComposerAnchor(null)
                }}
              />
            </div>
          )}
        </main>

        {/* Right: margin comments */}
        <aside className="relative border-l py-12 px-4 min-w-0">
          {/* Selection popover trigger */}
          {selection && canComment && (
            <SelectionPopover
              id="selection-popover"
              rect={selection.rect}
              onComment={openComposer}
            />
          )}
          {selection && !canComment && (
            <SelectionPopover
              id="selection-popover"
              rect={selection.rect}
              loginHref="/login"
            />
          )}

          {/* Doc-level comments at top */}
          {docLevelComments.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                整篇留言
              </p>
              <div className="space-y-3">
                {docLevelComments.map((c) => (
                  <CommentCard
                    key={c.id}
                    comment={c}
                    focused={focusedCommentId === c.id}
                    onFocus={setFocusedCommentId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Anchored margin comments — vertically positioned */}
          {marginComments.length > 0 && (
            <CommentMargin
              comments={marginComments}
              highlightRefs={highlightRefs}
              focusedCommentId={focusedCommentId}
              onFocus={setFocusedCommentId}
              articleRef={articleRef}
            />
          )}

          {/* No-anchor doc-level form */}
          {canComment && !composerOpen && (
            <div className="mt-8 border-t pt-6">
              <p className="mb-2 text-xs text-muted-foreground">
                選取文字可留行內評論，或在此留整篇留言：
              </p>
              <InlineCommentComposer
                onSubmit={async (body) => {
                  const fd = new FormData()
                  fd.set("docId", docId)
                  fd.set("body", body)
                  await addCommentAction(fd)
                }}
              />
            </div>
          )}
          {!canComment && (
            <div className="mt-8 rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              <Link href="/login" className="underline hover:text-foreground">
                登入
              </Link>{" "}
              以留言
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

// ------- Shared comment card -------

const trustLabel: Record<string, string> = {
  owner: "擁有者",
  shared: "分享",
  public: "公開",
}
const trustVariant: Record<string, "default" | "secondary" | "outline"> = {
  owner: "default",
  shared: "outline",
  public: "secondary",
}

function CommentCard({
  comment,
  focused,
  onFocus,
  style,
}: {
  comment: CommentItem
  focused: boolean
  onFocus: (id: number | null) => void
  style?: React.CSSProperties
}) {
  return (
    <div
      id={`comment-card-${comment.id}`}
      style={style}
      onMouseEnter={() => onFocus(comment.id)}
      onMouseLeave={() => onFocus(null)}
      onClick={() => {
        // scroll highlight into view
        const mark = document.querySelector(
          `mark[data-comment-id="${comment.id}"]`
        ) as HTMLElement | null
        if (mark) {
          mark.scrollIntoView({ behavior: "smooth", block: "center" })
          // flash
          mark.classList.add("bg-yellow-400/80", "dark:bg-yellow-400/50")
          setTimeout(() => {
            mark.classList.remove("bg-yellow-400/80", "dark:bg-yellow-400/50")
          }, 800)
        }
      }}
      className={`rounded-lg border p-3 text-sm cursor-pointer transition-all ${
        focused
          ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30"
          : "border-border bg-background hover:border-yellow-300"
      }`}
    >
      {comment.anchorQuote && (
        <blockquote className="mb-2 border-l-2 border-yellow-400 pl-2 text-xs italic text-muted-foreground line-clamp-2">
          {comment.anchorQuote}
        </blockquote>
      )}
      <div className="mb-1 flex flex-wrap items-center gap-1.5">
        <span className="font-medium text-xs">{comment.authorEmail}</span>
        <Badge
          variant={trustVariant[comment.liveTrust] ?? "secondary"}
          className="text-[10px] px-1.5 h-4"
        >
          {trustLabel[comment.liveTrust]}
        </Badge>
        {comment.reanchoredStatus === "outdated" && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 h-4 text-yellow-700 dark:text-yellow-400 border-yellow-500/40"
          >
            已過時
          </Badge>
        )}
        <span className="ml-auto text-[10px] text-muted-foreground">
          {new Date(comment.createdAt).toLocaleString("zh-TW")}
        </span>
      </div>
      <p className="whitespace-pre-wrap leading-relaxed">{comment.body}</p>
    </div>
  )
}

// ------- Mobile comment section -------

function MobileCommentSection({
  comments,
  ownerMode,
  canComment,
  docId,
  doc,
}: {
  comments: CommentItem[]
  ownerMode: boolean
  canComment: boolean
  docId: string
  doc: { id: string; version: number }
}) {
  const [body, setBody] = useState("")
  const open = comments.filter((c) => c.status === "open")
  const resolved = comments.filter((c) => c.status === "resolved")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    const fd = new FormData()
    fd.set("docId", docId)
    fd.set("body", body.trim())
    await addCommentAction(fd)
    setBody("")
  }

  return (
    <div>
      <div className="space-y-3 mb-4">
        {open.map((c) => (
          <div key={c.id} className="rounded-lg border p-3 text-sm">
            {c.anchorQuote && (
              <blockquote className="mb-2 border-l-2 border-yellow-400 pl-2 text-xs italic text-muted-foreground line-clamp-2">
                {c.anchorQuote}
              </blockquote>
            )}
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className="font-medium text-xs">{c.authorEmail}</span>
              <Badge
                variant={trustVariant[c.liveTrust] ?? "secondary"}
                className="text-[10px] px-1.5 h-4"
              >
                {trustLabel[c.liveTrust]}
              </Badge>
              {c.reanchoredStatus === "outdated" && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 h-4 text-yellow-700 dark:text-yellow-400 border-yellow-500/40"
                >
                  已過時
                </Badge>
              )}
            </div>
            <p className="whitespace-pre-wrap">{c.body}</p>
          </div>
        ))}
        {open.length === 0 && (
          <p className="text-sm text-muted-foreground">還沒有留言。</p>
        )}
        {resolved.length > 0 && (
          <p className="text-xs text-muted-foreground">
            另有 {resolved.length} 則已解決的留言。
          </p>
        )}
      </div>
      {canComment ? (
        <form onSubmit={submit} className="space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="留下留言…"
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
          <button
            type="submit"
            disabled={!body.trim()}
            className="rounded-full bg-foreground px-4 py-1.5 text-xs text-background disabled:opacity-40"
          >
            送出
          </button>
        </form>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="underline hover:text-foreground">
            登入
          </Link>{" "}
          以留言
        </p>
      )}
    </div>
  )
}

export { CommentCard }
