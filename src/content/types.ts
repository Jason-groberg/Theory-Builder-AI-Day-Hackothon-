import type { CategoryId } from './categories.ts'
import type { TechniqueId } from './techniques.ts'

export type Level = 1 | 2 | 3 | 4 | 5

/**
 * The public part of a problem. Everything here ships to the browser.
 * Text fields are Markdown with LaTeX between $...$ (inline) or $$...$$ (display).
 */
export interface Problem {
  id: string
  category: CategoryId
  /** 1 = warm-up, 5 = hardest in the category. */
  level: Level
  title: string
  statement: string
  topics: string[]
  techniques: TechniqueId[]
  /** Hint ladder: a nudge, then the relevant idea or theorem, then the first step. */
  hints: [nudge: string, idea: string, firstStep: string]
}

/**
 * The private part of a problem. Lives in server/ and is only ever read by
 * Netlify functions, so the answer is never in the page source.
 */
export interface Solution {
  id: string
  /** Short final answer, when the problem has one (most proofs do not). */
  answer?: string
  /** Full vetted solution, shown only after the reveal rule is met. */
  solution: string
  rubric: {
    /** Ideas a correct argument must contain, by any route. */
    keyIdeas: string[]
    /** Wrong turns worth recognising and steering away from. */
    commonErrors: string[]
  }
}
