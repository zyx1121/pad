// [THREAT-I-2] XSS mitigation: react-markdown with remark-gfm only.
// rehype-raw and dangerouslySetInnerHTML are NEVER used here — public docs
// are world-readable and could contain attacker-controlled content.
"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Props {
  content: string
}

export function MarkdownView({ content }: Props) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
