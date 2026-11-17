// Public size limits shared by the UI and server; no secrets or policy prompts.
export const TUTOR_LIMITS = {
  work: 8000, message: 2000, assistantMessage: 8000,
  messages: 40, priorAttempts: 5, history: 16000,
} as const

/** Send whole recent items only; never truncate the student's latest submission. */
export function recentWithinBudget<T>(items: T[], count: number, budget: number, content: (item: T) => string): T[] {
  const out: T[] = []
  for (const item of items.slice(-count).reverse()) {
    const size = content(item).length
    if (size > budget) break
    out.unshift(item)
    budget -= size
  }
  return out
}
