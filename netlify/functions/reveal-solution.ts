// Releases the vetted solution once the reveal rule is met: three distinct
// reviewed attempts, or one attempt judged correct. Proof is by signed receipts.
import {
  ATTEMPTS_TO_REVEAL,
  errorResponse,
  HttpError,
  loadProblem,
  rateLimit,
  readJson,
  verifyReceipt,
} from '../../server/tutor.ts'

export default async (req: Request, context?: { ip?: string }) => {
  try {
    const body = await readJson(req)
    rateLimit(context?.ip)
    const { problem, solution } = loadProblem(body.problemId)

    const receipts = (Array.isArray(body.receipts) ? body.receipts.slice(0, 50) : [])
      .map(verifyReceipt)
      .filter((r) => r !== null && r.p === problem.id)
    const distinct = new Set(receipts.map((r) => r!.h)).size
    const solved = receipts.some((r) => r!.ok)

    if (!solved && distinct < ATTEMPTS_TO_REVEAL) {
      const left = ATTEMPTS_TO_REVEAL - distinct
      throw new HttpError(403, `The solution unlocks after ${left} more genuine attempt${left === 1 ? '' : 's'}.`)
    }

    return Response.json({ answer: solution.answer ?? null, solution: solution.solution })
  } catch (err) {
    return errorResponse(err)
  }
}
