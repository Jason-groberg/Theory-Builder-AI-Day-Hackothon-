import katex from 'katex'
import 'katex/dist/katex.min.css'
import type { ReactNode } from 'react'

// A small renderer for the subset of Markdown the content uses: paragraphs,
// "- " lists, **bold**, *italic*, and LaTeX in $...$ or $$...$$.

const INLINE = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$|\*\*[^*]+?\*\*|\*[^*\s][^*]*?\*)/

function Math({ tex, display }: { tex: string; display: boolean }) {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: false })
  const Tag = display ? 'div' : 'span'
  return <Tag className={display ? 'math-display' : undefined} dangerouslySetInnerHTML={{ __html: html }} />
}

function inline(text: string): ReactNode[] {
  const parts = text.split(INLINE)
  return parts.map((part, i) => {
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4)
      return <Math key={i} tex={part.slice(2, -2)} display />
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      // Keep punctuation that follows a formula on the same line as the formula.
      const trailing = /^[.,;:?!)]+/.exec(parts[i + 1] ?? '')?.[0] ?? ''
      if (trailing) parts[i + 1] = parts[i + 1].slice(trailing.length)
      const math = <Math key={i} tex={part.slice(1, -1)} display={false} />
      return trailing ? (
        <span key={i} className="nowrap">
          {math}
          {trailing}
        </span>
      ) : (
        math
      )
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={i}>{inline(part.slice(2, -2))}</strong>
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={i}>{inline(part.slice(1, -1))}</em>
    return part
  })
}

function block(text: string, key: number): ReactNode {
  const lines = text.split('\n')
  if (lines[0].startsWith('- ')) {
    const items: string[] = []
    for (const line of lines) {
      if (line.startsWith('- ')) items.push(line.slice(2))
      else items[items.length - 1] += `\n${line}`
    }
    return (
      <ul key={key}>
        {items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>
    )
  }
  const trimmed = text.trim()
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && !trimmed.slice(2, -2).includes('$$'))
    return <Math key={key} tex={trimmed.slice(2, -2)} display />
  return <p key={key}>{inline(text)}</p>
}

export function RichText({ text }: { text: string }) {
  return <div className="rich">{text.split(/\n{2,}/).map((b, i) => block(b, i))}</div>
}
