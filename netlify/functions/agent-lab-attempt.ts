// One attempt in the Agent Engineer Lab. Separate from the student tutor: it
// touches no homework progress, receipts or solutions.
import { BODY_BYTES, HttpError, httpErrorResponse, rateLimit, readPost } from '../../server/http.ts'
import { runAttempt } from '../../server/lab/pipeline.ts'

export default async (req: Request, context?: { ip?: string }) => {
  try {
    const body = await readPost(req, BODY_BYTES.lab)
    await rateLimit(context?.ip, 'lab')
    return Response.json(await runAttempt(body), { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    if (err instanceof HttpError) return httpErrorResponse(err)
    console.error(err)
    return Response.json({ error: 'The lab hit an unexpected error.' }, { status: 500 })
  }
}
