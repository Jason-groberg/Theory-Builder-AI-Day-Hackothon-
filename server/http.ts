// Request guards shared by every function. No provider SDKs are imported here.

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** Parses a JSON object from a POST body. */
export async function readPost(req: Request): Promise<Record<string, unknown>> {
  if (req.method !== 'POST') throw new HttpError(405, 'Use POST.')
  try {
    const body = await req.json()
    if (body && typeof body === 'object' && !Array.isArray(body)) return body as Record<string, unknown>
  } catch {
    // fall through
  }
  throw new HttpError(400, 'Request body must be a JSON object.')
}

export function text(value: unknown, max: number, name: string): string {
  if (typeof value !== 'string') throw new HttpError(400, `${name} must be text.`)
  if (value.length > max) throw new HttpError(413, `${name} is too long (limit ${max} characters).`)
  return value
}

// Best-effort limit per server instance. Serverless instances come and go, so
// this blunts bursts but is not a durable quota.
const WINDOW_MS = 10 * 60 * 1000
const hits = new Map<string, number[]>()

export function rateLimit(ip: string | undefined, bucket = 'tutor', max = 40) {
  const key = `${bucket}:${ip ?? 'unknown'}`
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= max) throw new HttpError(429, 'Too many requests. Try again in a few minutes.')
  recent.push(now)
  hits.set(key, recent)
}
