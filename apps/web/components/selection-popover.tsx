"use client"

// SelectionPopover: small floating button that appears above a text selection.
// Fixed-positioned (using selection's getBoundingClientRect).

import { useEffect, useRef } from "react"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/ui/button"

interface CommentProps {
  id?: string
  rect: DOMRect
  onComment: () => void
  loginHref?: never
}

interface LoginProps {
  id?: string
  rect: DOMRect
  onComment?: never
  loginHref: string
}

type Props = CommentProps | LoginProps

export function SelectionPopover({ id, rect, onComment, loginHref }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // Position: horizontally centered above selection, fixed
  const left = rect.left + rect.width / 2
  const top = rect.top + window.scrollY - 48 // 48px above selection

  return (
    <div
      id={id}
      ref={ref}
      className="fixed z-50 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-100"
      style={{
        left: `${left}px`,
        top: `${top - window.scrollY}px`, // back to viewport coords for fixed
      }}
    >
      <div className="flex items-center gap-1 rounded-full border bg-background px-2 py-1 shadow-md">
        {onComment ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 rounded-full px-2 text-xs"
            onClick={onComment}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            留言
          </Button>
        ) : (
          <Link
            href={loginHref!}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            登入以留言
          </Link>
        )}
      </div>
    </div>
  )
}
