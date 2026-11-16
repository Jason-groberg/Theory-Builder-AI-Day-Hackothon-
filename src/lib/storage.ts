// Per-browser progress. localStorage can be unavailable (private mode, blocked
// site data), so every access is guarded and the app works without it.

export interface Step {
  id: string
  text: string
  /** LaTeX from the visual math field, or null when the step has no math field. */
  math: string | null
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Nothing to do: the draft simply will not persist.
  }
}

export const newStep = (): Step => ({ id: crypto.randomUUID(), text: '', math: null })

export const loadDraft = (problemId: string): Step[] => {
  const steps = read<Step[]>(`tb:draft:${problemId}`, [])
  return steps.length ? steps : [newStep()]
}
export const saveDraft = (problemId: string, steps: Step[]) => write(`tb:draft:${problemId}`, steps)

export const loadHintsRevealed = (problemId: string): number => read(`tb:hints:${problemId}`, 0)
export const saveHintsRevealed = (problemId: string, n: number) => write(`tb:hints:${problemId}`, n)

export const isStepEmpty = (s: Step) => !s.text.trim() && !(s.math ?? '').trim()

/** The work as Markdown with LaTeX, the form the tutor will read. */
export function stepsToMarkdown(steps: Step[]): string {
  return steps
    .filter((s) => !isStepEmpty(s))
    .map((s, i) => {
      const math = (s.math ?? '').trim()
      return `**Step ${i + 1}.** ${s.text.trim()}${math ? `\n\n$$${math}$$` : ''}`
    })
    .join('\n\n')
}

// ---------- Tutor progress ----------

export type Verdict = 'correct' | 'incomplete' | 'gap' | 'unsure' | 'not_an_attempt'

export interface ThreadItem {
  id: string
  role: 'student' | 'tutor'
  kind: 'chat' | 'submission' | 'review'
  text: string
  verdict?: Verdict
  /** For reviews: whether the attempt counts towards unlocking the solution. */
  counted?: boolean
}

export interface Attempt {
  work: string
  verdict: Verdict
  counted: boolean
  /** Signed by the server; proves the attempt was reviewed. */
  receipt: string | null
}

export interface RevealedSolution {
  answer: string | null
  solution: string
}

export interface Progress {
  thread: ThreadItem[]
  attempts: Attempt[]
  solved: boolean
  techniques: string[]
  solution: RevealedSolution | null
}

export const ATTEMPTS_TO_REVEAL = 3

const emptyProgress = (): Progress => ({ thread: [], attempts: [], solved: false, techniques: [], solution: null })

export const loadProgress = (problemId: string): Progress => ({
  ...emptyProgress(),
  ...read<Partial<Progress>>(`tb:progress:${problemId}`, {}),
})
export const saveProgress = (problemId: string, progress: Progress) => write(`tb:progress:${problemId}`, progress)

export const countedAttempts = (p: Progress) => p.attempts.filter((a) => a.counted).length
export const canReveal = (p: Progress) => p.solved || countedAttempts(p) >= ATTEMPTS_TO_REVEAL
