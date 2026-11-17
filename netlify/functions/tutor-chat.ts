// Streams a tutor reply in the conversation about the current problem.
import { parseTutorMessages } from '../../server/tutor-input.ts'
import {
  chatSystemPrompt,
  client,
  errorResponse,
  FALLBACK,
  LIMITS,
  loadProblem,
  MODEL,
  ndjson,
  rateLimit,
  readJson,
  text,
} from '../../server/tutor.ts'

export default async (req: Request, context?: { ip?: string }) => {
  try {
    const body = await readJson(req)
    await rateLimit(context?.ip)
    const { problem, solution } = loadProblem(body.problemId)
    const work = text(body.work ?? '', LIMITS.work, 'Your work').trim()
    const hintsRevealed = Math.min(3, Math.max(0, Number(body.hintsRevealed) || 0))

    const messages = parseTutorMessages(body.messages, work)
    const last = messages.at(-1)!

    // The draft changes between turns, so it rides with the newest message
    // rather than sitting in the system prompt.
    last.content = `<student_work>\n${work || '(nothing written yet)'}\n</student_work>\n\n${last.content as string}`

    return ndjson(async (send) => {
      const stream = client.beta.messages.stream({
        model: MODEL,
        max_tokens: 16000,
        ...FALLBACK,
        output_config: { effort: 'low' },
        system: chatSystemPrompt(problem, solution, hintsRevealed),
        messages,
      })
      stream.on('text', (delta) => send({ type: 'delta', text: delta }))
      const final = await stream.finalMessage()
      if (final.stop_reason === 'refusal') {
        send({ type: 'error', message: 'The tutor could not answer that. Try asking in a different way.' })
        return
      }
      send({ type: 'done' })
    })
  } catch (err) {
    return errorResponse(err)
  }
}
