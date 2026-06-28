// @pad/domain — comment re-anchoring across revisions (GitHub-PR "outdated" model).
// A comment stores (anchor_revision, line range, anchor_quote). When the doc moves
// past anchor_revision, relocate by quote; if the quote is gone, mark the comment
// outdated but KEEP the quote so the agent still knows what was referenced.

export interface Anchor {
  lineStart: number
  lineEnd: number
  quote: string // verbatim snippet the comment was attached to
}

export type Reanchored =
  | { status: 'current'; lineStart: number; lineEnd: number }
  | { status: 'outdated' }

export function reanchor(currentContent: string, a: Anchor): Reanchored {
  const lines = currentContent.split('\n')

  // 1. same lines still hold the same text?
  const slice = lines.slice(a.lineStart - 1, a.lineEnd).join('\n')
  if (slice === a.quote) {
    return { status: 'current', lineStart: a.lineStart, lineEnd: a.lineEnd }
  }

  // 2. quote moved — locate it verbatim anywhere in the doc
  const idx = currentContent.indexOf(a.quote)
  if (idx >= 0) {
    const lineStart = currentContent.slice(0, idx).split('\n').length
    const span = a.quote.split('\n').length
    return { status: 'current', lineStart, lineEnd: lineStart + span - 1 }
  }

  // 3. gone — outdated, but the caller keeps anchor_quote for context
  return { status: 'outdated' }
}
