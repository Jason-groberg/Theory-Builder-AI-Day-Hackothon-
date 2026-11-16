// Reviews a submitted attempt. Streams pings while the model works, then one
// "result" event with the verdict, feedback and a signed receipt.
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'
import {
  client,
  errorResponse,
  FALLBACK,
  HttpError,
  issueReceipt,
  LIMITS,
  loadProblem,
  MODEL,
  ndjson,
  rateLimit,
  readJson,
  reviewSystemPrompt,
  text,
} from '../../server/tutor.ts'

const Review = z.object({
  verdict: z.enum(['correct', 'incomplete', 'gap', 'unsure', 'not_an_attempt']),
  feedback: z.string(),
  distinct_from_prior: z.boolean(),
  techniques_demonstrated: z.array(z.string()),
})

export default async (req: Request, context?: { ip?: string }) => {
  try {
    const body = await readJson(req)
    rateLimit(context?.ip)
    const { problem, solution } = loadProblem(body.problemId)
    const work = text(body.work, LIMITS.work, 'Your work').trim()
    if (!work) throw new HttpError(400, 'There is no work to review yet.')
    const prior = (Array.isArray(body.priorAttempts) ? body.priorAttempts : [])
      .slice(-LIMITS.priorAttempts)
      .map((p) => text(p, LIMITS.work, 'A prior attempt'))
    const hintsRevealed = Math.min(3, Math.max(0, Number(body.hintsRevealed) || 0))

    const priorBlock = prior.length
      ? prior.map((p, i) => `<earlier_attempt number="${i + 1}">\n${p}\n</earlier_attempt>`).join('\n\n')
      : 'There are no earlier attempts.'

    return ndjson(async (send) => {
      const response = await client.beta.messages.parse({
        model: MODEL,
        max_tokens: 16000,
        ...FALLBACK,
        output_config: { effort: 'medium', format: betaZodOutputFormat(Review) },
        system: reviewSystemPrompt(problem, solution, hintsRevealed),
        messages: [
          {
            role: 'user',
            content: `${priorBlock}\n\nThe attempt to review:\n\n<student_work>\n${work}\n</student_work>`,
          },
        ],
      })

      const review = response.parsed_output
      if (response.stop_reason === 'refusal' || !review) {
        send({ type: 'error', message: 'The tutor could not review this attempt. Try rephrasing your work.' })
        return
      }

      const genuine = review.verdict !== 'not_an_attempt'
      const counted = genuine && review.distinct_from_prior
      const correct = review.verdict === 'correct'
      send({
        type: 'result',
        verdict: review.verdict,
        feedback: review.feedback,
        counted,
        techniques: review.techniques_demonstrated.filter((t) => (problem.techniques as string[]).includes(t)),
        // Only attempts that count towards the reveal, or solve the problem, get a receipt.
        receipt: counted || correct ? issueReceipt(problem.id, work, correct) : null,
      })
    })
  } catch (err) {
    return errorResponse(err)
  }
}
