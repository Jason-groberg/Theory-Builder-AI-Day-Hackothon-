// Shared request guards. Production quotas are shared across Netlify instances.
import { createHash } from 'node:crypto'
import { getStore } from '@netlify/blobs'

export class HttpError extends Error {
  status: number
  retryAfter?: number
  constructor(status: number, message: string, retryAfter?: number) {
    super(message)
    this.status = status
    this.retryAfter = retryAfter
  }
}

export function httpErrorResponse(err: HttpError): Response {
  return Response.json({ error: err.message }, {
    status: err.status,
    headers: {
      'Cache-Control': 'no-store',
      ...(err.retryAfter ? { 'Retry-After': String(err.retryAfter) } : {}),
    },
  })
}

export const BODY_BYTES = { tutor: 64 * 1024, lab: 128 * 1024 }

/** Bound actual streamed UTF-8 bytes, even with no or dishonest Content-Length. */
export async function readPost(req: Request, maxBytes = BODY_BYTES.tutor): Promise<Record<string, unknown>> {
  if (req.method !== 'POST') throw new HttpError(405, 'Use POST.')
  const declared = req.headers.get('content-length')
  if (declared && /^\d+$/.test(declared) && Number(declared) > maxBytes)
    throw new HttpError(413, `Request body is too large (limit ${maxBytes} bytes).`)
  if (!req.body) throw new HttpError(400, 'Request body must be a JSON object.')
  const reader = req.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) {
        await reader.cancel()
        throw new HttpError(413, `Request body is too large (limit ${maxBytes} bytes).`)
      }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
    const body: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
    if (body && typeof body === 'object' && !Array.isArray(body)) return body as Record<string, unknown>
  } catch (err) {
    if (err instanceof HttpError) throw err
  } finally {
    reader.releaseLock()
  }
  throw new HttpError(400, 'Request body must be a JSON object.')
}

export function text(value: unknown, max: number, name: string): string {
  if (typeof value !== 'string') throw new HttpError(400, `${name} must be text.`)
  if (value.length > max) throw new HttpError(413, `${name} is too long (limit ${max} characters).`)
  return value
}

export const RATE_LIMIT = { requests: 10, windowMs: 10 * 60 * 1000 } as const
export type QuotaBucket = 'tutor' | 'lab'
export interface QuotaStore {
  read: (key: string) => Promise<{ hits: number[]; etag: string } | null>
  write: (key: string, hits: number[], etag: string | null) => Promise<boolean>
}

/** Compare-and-swap prevents concurrent requests from claiming the same slot. */
export function createRateLimiter(store: QuotaStore, now = Date.now) {
  return async (ip: string | undefined, bucket: QuotaBucket = 'tutor') => {
    if (!ip) throw new HttpError(503, 'Cannot verify the request quota. Please try again shortly.', 5)
    const key = `${bucket}/${createHash('sha256').update(ip).digest('hex')}`
    try {
      for (let attempt = 0; attempt < 20; attempt++) {
        const prior = await store.read(key)
        const time = now()
        if (prior && (!prior.etag || !Array.isArray(prior.hits) || prior.hits.length > RATE_LIMIT.requests ||
            prior.hits.some((t) => !Number.isSafeInteger(t) || t < 0))) throw new Error('Invalid quota record')
        const recent = (prior?.hits ?? []).filter((t) => time - t < RATE_LIMIT.windowMs).sort((a, b) => a - b)
        if (recent.length >= RATE_LIMIT.requests) {
          const retryAfter = Math.max(1, Math.ceil((recent[0] + RATE_LIMIT.windowMs - time) / 1000))
          throw new HttpError(429, `Limit reached: 10 requests per 10 minutes. Try again in ${retryAfter} seconds.`, retryAfter)
        }
        if (await store.write(key, [...recent, time], prior?.etag ?? null)) return
      }
    } catch (err) {
      if (err instanceof HttpError) throw err
    }
    // Never fall back to an instance-local counter or invoke an AI on storage failure.
    throw new HttpError(503, 'Cannot verify the request quota. Please try again shortly.', 5)
  }
}

export function blobQuotaStore(store: ReturnType<typeof getStore>): QuotaStore {
  return {
    async read(key) {
      const entry = await store.getWithMetadata(key, { type: 'json', consistency: 'strong' })
      if (!entry) return null
      if (!entry.etag) throw new Error('Missing quota revision')
      return { hits: entry.data, etag: entry.etag }
    },
    async write(key, hits, etag) {
      const result = await store.setJSON(key, hits, etag ? { onlyIfMatch: etag } : { onlyIfNew: true })
      return result.modified
    },
  }
}

/** Used only by the explicitly marked local Vite server and deterministic tests. */
export function memoryQuotaStore(): QuotaStore {
  const records = new Map<string, { hits: number[]; etag: string }>()
  let revision = 0
  return {
    async read(key) { const r = records.get(key); return r ? { hits: [...r.hits], etag: r.etag } : null },
    async write(key, hits, etag) {
      if ((records.get(key)?.etag ?? null) !== etag) return false
      records.set(key, { hits: [...hits], etag: String(++revision) })
      return true
    },
  }
}
const localQuota = createRateLimiter(memoryQuotaStore())

export async function rateLimit(ip: string | undefined, bucket: QuotaBucket = 'tutor') {
  if (process.env.THEORY_BUILDER_LOCAL_DEV === '1' && process.env.NETLIFY !== 'true')
    return localQuota(ip, bucket)
  try {
    const signal = AbortSignal.timeout(8000)
    const store = getStore({
      name: 'theory-builder-request-quotas', consistency: 'strong',
      fetch: (input, init) => fetch(input, { ...init, signal }),
    })
    await createRateLimiter(blobQuotaStore(store))(ip, bucket)
  } catch (err) {
    if (err instanceof HttpError) throw err
    throw new HttpError(503, 'Cannot verify the request quota. Please try again shortly.', 5)
  }
}
