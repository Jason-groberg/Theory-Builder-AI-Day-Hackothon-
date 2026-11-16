// Checks the seed content is complete and consistent. Run with: npm run validate
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import katex from 'katex'
import { categories } from '../src/content/categories.ts'
import { problems } from '../src/content/problems/index.ts'
import { techniques } from '../src/content/techniques.ts'
import { solutions } from '../server/solutions/index.ts'

const errors: string[] = []
const fail = (msg: string) => errors.push(msg)

/** True when every $ and $$ math delimiter in the text is closed. */
function mathBalanced(text: string): boolean {
  const withoutDisplay = text.split('$$')
  if (withoutDisplay.length % 2 === 0) return false
  return withoutDisplay.every((part) => (part.match(/\$/g) ?? []).length % 2 === 0)
}

/** Every formula must be valid LaTeX that KaTeX can render. */
function checkMath(id: string, text: string) {
  for (const m of text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)) {
    try {
      katex.renderToString(m[1] ?? m[2], { throwOnError: true, strict: 'error' })
    } catch (e) {
      fail(`${id}: bad LaTeX "${(m[1] ?? m[2]).slice(0, 40)}": ${(e as Error).message}`)
    }
  }
}

const ids = new Set<string>()
for (const p of problems) {
  if (ids.has(p.id)) fail(`${p.id}: duplicate problem id`)
  ids.add(p.id)
  if (!categories.some((c) => c.id === p.category)) fail(`${p.id}: unknown category`)
  if (p.hints.length !== 3) fail(`${p.id}: needs exactly 3 hints`)
  if (p.techniques.length === 0) fail(`${p.id}: no techniques`)
  for (const t of p.techniques) if (!(t in techniques)) fail(`${p.id}: unknown technique ${t}`)
  for (const text of [p.statement, ...p.hints]) {
    if (!text.trim()) fail(`${p.id}: empty text field`)
    if (!mathBalanced(text)) fail(`${p.id}: unbalanced $ in "${text.slice(0, 40)}…"`)
    checkMath(p.id, text)
  }
}

for (const c of categories) {
  const levels = problems
    .filter((p) => p.category === c.id)
    .map((p) => p.level)
    .sort()
  if (levels.join() !== '1,2,3,4,5') fail(`${c.id}: levels are [${levels}], expected 1–5 once each`)
}

const solved = new Set<string>()
for (const s of solutions) {
  if (solved.has(s.id)) fail(`${s.id}: duplicate solution`)
  solved.add(s.id)
  if (!ids.has(s.id)) fail(`${s.id}: solution has no matching problem`)
  if (s.rubric.keyIdeas.length < 3) fail(`${s.id}: rubric needs at least 3 key ideas`)
  if (s.rubric.commonErrors.length < 2) fail(`${s.id}: rubric needs at least 2 common errors`)
  for (const text of [s.solution, s.answer ?? '']) {
    if (!mathBalanced(text)) fail(`${s.id}: unbalanced $ in solution or answer`)
    checkMath(s.id, text)
  }
}
for (const id of ids) if (!solved.has(id)) fail(`${id}: no solution`)

// Solutions must never be reachable from the browser bundle.
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? sourceFiles(join(dir, e.name)) : [join(dir, e.name)],
  )
}
for (const file of sourceFiles('src')) {
  if (/from\s+['"][^'"]*server\//.test(readFileSync(file, 'utf8'))) {
    fail(`${file}: imports from server/, which would leak solutions to the browser`)
  }
}

if (errors.length) {
  console.error(`Content validation failed:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Content OK: ${problems.length} problems, ${solutions.length} solutions, ${categories.length} categories.`)
