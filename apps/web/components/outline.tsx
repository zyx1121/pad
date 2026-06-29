"use client"

// Outline (TOC) extracted from markdown h1–h3 headings.
// Uses IntersectionObserver for scrollspy; headings get ids from rehype-slug.

import { useEffect, useMemo, useRef, useState } from "react"

interface Heading {
  level: 1 | 2 | 3
  text: string
  slug: string
}

// Derive a slug the same way rehype-slug does (lowercase, spaces→hyphens, strip non-word)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  for (const line of markdown.split("\n")) {
    const m = line.match(/^(#{1,3})\s+(.+)$/)
    if (m) {
      const level = m[1]!.length as 1 | 2 | 3
      const text = m[2]!.trim()
      headings.push({ level, text, slug: slugify(text) })
    }
  }
  return headings
}

interface Props {
  content: string
}

export function Outline({ content }: Props) {
  const headings = useMemo(() => extractHeadings(content), [content])
  const [activeSlug, setActiveSlug] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    // Disconnect previous observer
    observerRef.current?.disconnect()

    const slugs = headings.map((h) => h.slug)
    const activeMap = new Map<string, boolean>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (slugs.includes(id)) {
            activeMap.set(id, entry.isIntersecting)
          }
        }
        // Activate the first currently-intersecting heading (document order)
        const first = slugs.find((s) => activeMap.get(s))
        if (first) setActiveSlug(first)
      },
      { rootMargin: "0px 0px -60% 0px" }
    )

    const observer = observerRef.current
    // Observe after a tick so rehype-slug has rendered
    const timeout = setTimeout(() => {
      for (const slug of slugs) {
        const el = document.getElementById(slug)
        if (el) observer.observe(el)
      }
    }, 100)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="文件目錄">
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.slug}>
            <a
              href={`#${h.slug}`}
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById(h.slug)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
                setActiveSlug(h.slug)
              }}
              className={[
                "block rounded-md px-2 py-1 text-sm transition-colors leading-snug",
                h.level === 2 ? "pl-4" : h.level === 3 ? "pl-6" : "",
                activeSlug === h.slug
                  ? "bg-foreground/8 font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
