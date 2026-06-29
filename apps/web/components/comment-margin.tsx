"use client"

// CommentMargin: renders anchored comment cards vertically aligned to their
// highlight elements. On mount and resize, reads highlight offsetTop and
// stacks cards that would overlap.

import { useEffect, useRef, useState, MutableRefObject } from "react"
import { CommentCard, type CommentItem } from "@/components/doc-reader"

interface PositionedComment {
  comment: CommentItem
  top: number
}

interface Props {
  comments: CommentItem[]
  highlightRefs: MutableRefObject<Map<number, HTMLElement>>
  focusedCommentId: number | null
  onFocus: (id: number | null) => void
  articleRef: MutableRefObject<HTMLDivElement | null>
}

const CARD_GAP = 8 // px between stacked cards
const CARD_MIN_HEIGHT = 80 // rough estimate for collision resolution

export function CommentMargin({
  comments,
  highlightRefs,
  focusedCommentId,
  onFocus,
  articleRef,
}: Props) {
  const [positioned, setPositioned] = useState<PositionedComment[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  function recompute() {
    const art = articleRef.current
    const container = containerRef.current
    if (!art || !container) return

    const artRect = art.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const scrollTop = window.scrollY

    // Compute desired tops from highlight positions
    const items: PositionedComment[] = []
    for (const comment of comments) {
      const mark = highlightRefs.current.get(comment.id)
      if (!mark) {
        // Outdated or not yet rendered — place at top of article
        items.push({ comment, top: 0 })
        continue
      }
      const markRect = mark.getBoundingClientRect()
      // top relative to container
      const top =
        markRect.top + scrollTop - (containerRect.top + scrollTop) + artRect.top - containerRect.top
      // Simpler: top = markRect.top - artRect.top (both in viewport coords = same)
      items.push({ comment, top: Math.max(0, markRect.top - artRect.top) })
    }

    // Simple collision resolution: sort by desired top, push down overlapping cards
    items.sort((a, b) => a.top - b.top)
    let lastBottom = 0
    for (const item of items) {
      if (item.top < lastBottom + CARD_GAP) {
        item.top = lastBottom + CARD_GAP
      }
      lastBottom = item.top + CARD_MIN_HEIGHT
    }

    setPositioned(items)
  }

  // Recompute after highlights are injected (short delay) and on scroll/resize
  useEffect(() => {
    const t = setTimeout(recompute, 150)
    window.addEventListener("scroll", recompute, { passive: true })
    window.addEventListener("resize", recompute)
    return () => {
      clearTimeout(t)
      window.removeEventListener("scroll", recompute)
      window.removeEventListener("resize", recompute)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments, highlightRefs])

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "100%" }}>
      {positioned.map(({ comment, top }) => (
        <div
          key={comment.id}
          className="absolute left-0 right-0 transition-[top] duration-200"
          style={{ top }}
        >
          <CommentCard
            comment={comment}
            focused={focusedCommentId === comment.id}
            onFocus={onFocus}
          />
        </div>
      ))}
    </div>
  )
}
