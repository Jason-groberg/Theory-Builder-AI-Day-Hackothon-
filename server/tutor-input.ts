import { HttpError, text } from './http.ts'
import { TUTOR_LIMITS as LIMITS } from '../src/lib/input-limits.ts'

export function parseTutorMessages(value: unknown, work: string) {
  if (!Array.isArray(value) || !value.length) throw new HttpError(400, 'There is no message to answer.')
  if (value.length > LIMITS.messages) throw new HttpError(413, `At most ${LIMITS.messages} messages are allowed.`)
  const messages = value.map((m: unknown) => {
    const { role, content } = (m ?? {}) as { role?: unknown; content?: unknown }
    if (role !== 'user' && role !== 'assistant') throw new HttpError(400, 'Invalid message role.')
    return { role: role as 'user' | 'assistant', content: text(content, role === 'user' ? LIMITS.message : LIMITS.assistantMessage, 'A message') }
  })
  if (messages.reduce((n, m) => n + m.content.length, work.length) > LIMITS.history)
    throw new HttpError(413, `Work and conversation exceed ${LIMITS.history} characters.`)
  while (messages.length && messages[0].role !== 'user') messages.shift()
  if (!messages.length || messages.at(-1)?.role !== 'user') throw new HttpError(400, 'The last message must be from the student.')
  return messages
}

export function parsePriorAttempts(value: unknown, work: string): string[] {
  if (value === undefined) return []
  if (!Array.isArray(value)) throw new HttpError(400, 'Prior attempts must be a list.')
  if (value.length > LIMITS.priorAttempts) throw new HttpError(413, `At most ${LIMITS.priorAttempts} prior attempts are allowed.`)
  const prior = value.map((p: unknown) => text(p, LIMITS.work, 'A prior attempt'))
  if (prior.reduce((n, p) => n + p.length, work.length) > LIMITS.history)
    throw new HttpError(413, `Work and prior attempts exceed ${LIMITS.history} characters.`)
  return prior
}
