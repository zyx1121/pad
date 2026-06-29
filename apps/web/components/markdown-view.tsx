// [THREAT-I-2] XSS mitigation: react-markdown with remark-gfm + rehype-slug only.
// rehype-raw and dangerouslySetInnerHTML are NEVER used here — public docs
// are world-readable and could contain attacker-controlled content.
"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"

interface Props {
  content: string
  /** Extra className merged onto the prose wrapper */
  className?: string
}

export function MarkdownView({ content, className }: Props) {
  return (
    <div
      className={[
        "prose prose-lg prose-neutral dark:prose-invert max-w-[68ch]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
