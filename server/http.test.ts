import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BODY_BYTES, createRateLimiter, HttpError, httpErrorResponse, memoryQuotaStore, RATE_LIMIT, readPost, type QuotaStore } from './http.ts'
import { parsePriorAttempts, parseTutorMessages } from './tutor-input.ts'
import { recentWithinBudget, TUTOR_LIMITS } from '../src/lib/input-limits.ts'

const fails = (status: number) => (err: unknown) => err instanceof HttpError && err.status === status
const request = (body: string, headers?: Record<string, string>) => new Request('https://example.test/api', { method: 'POST', body, headers })

test('ten requests pass; the eleventh returns 429 with a retry time', async () => {
  const limit = createRateLimiter(memoryQuotaStore(), () => 1000)
  for (let i = 0; i < 10; i++) await limit('192.0.2.1')
  await assert.rejects(limit('192.0.2.1'), (e: unknown) => {
    assert.ok(e instanceof HttpError)
    assert.equal(e.status, 429)
    assert.equal(e.retryAfter, 600)
    const res = httpErrorResponse(e)
    assert.equal(res.headers.get('Retry-After'), '600')
    assert.equal(res.headers.get('Cache-Control'), 'no-store')
    return true
  })
})

test('the quota is a rolling window and expired slots become available at exactly ten minutes', async () => {
  let clock = 1000
  const limit = createRateLimiter(memoryQuotaStore(), () => clock)
  await limit('192.0.2.1')
  clock += 1000
  for (let i = 0; i < 9; i++) await limit('192.0.2.1')
  clock = 1000 + RATE_LIMIT.windowMs - 1
  await assert.rejects(limit('192.0.2.1'), fails(429))
  clock++
  await limit('192.0.2.1') // Only the oldest slot expired, not the whole window.
  await assert.rejects(limit('192.0.2.1'), fails(429))
})

test('separate instances share one quota; lab and tutor buckets and IPs remain independent', async () => {
  const store = memoryQuotaStore()
  const first = createRateLimiter(store)
  const second = createRateLimiter(store)
  for (let i = 0; i < 5; i++) await first('192.0.2.1', 'tutor')
  for (let i = 0; i < 5; i++) await second('192.0.2.1', 'tutor')
  await assert.rejects(createRateLimiter(store)('192.0.2.1', 'tutor'), fails(429))
  await second('192.0.2.1', 'lab')
  await second('192.0.2.2', 'tutor')
})

test('parallel attempts across independent instances cannot oversubscribe ten slots', async () => {
  const store = memoryQuotaStore()
  const results = await Promise.allSettled(Array.from({ length: 30 }, () => createRateLimiter(store)('192.0.2.3')))
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 10)
  for (const r of results) if (r.status === 'rejected') assert.ok(fails(429)(r.reason))
})

test('missing trusted IP, storage faults, corrupt state, and unresolved contention fail closed', async () => {
  const good = memoryQuotaStore()
  const faults: QuotaStore[] = [
    { ...good, read: async () => { throw new Error('offline') } },
    { ...good, write: async () => { throw new Error('offline') } },
    { ...good, write: async () => false },
    { ...good, read: async () => ({ etag: 'v1', hits: [Number.NaN] }) },
    { ...good, read: async () => ({ etag: '', hits: [] }) },
  ]
  for (const store of faults) await assert.rejects(createRateLimiter(store)('192.0.2.1'), fails(503))
  await assert.rejects(createRateLimiter(good)(undefined), fails(503))
})

test('quota keys store a hash, never the raw IP address', async () => {
  const store = memoryQuotaStore()
  const read = store.read
  let key = ''
  store.read = async (k) => { key = k; return read(k) }
  await createRateLimiter(store)('192.0.2.123', 'lab')
  assert.match(key, /^lab\/[a-f0-9]{64}$/)
  assert.ok(!key.includes('192.0.2.123'))
})

test('JSON object parser rejects arrays, null, invalid JSON and non-POST requests', async () => {
  assert.deepEqual(await readPost(request('{"message":"hello"}')), { message: 'hello' })
  for (const body of ['[]', 'null', 'false', '{', '']) await assert.rejects(readPost(request(body)), fails(400))
  await assert.rejects(readPost(new Request('https://example.test')), fails(405))
})

test('body size checks use actual UTF-8 bytes and honor the exact boundary', async () => {
  const body = JSON.stringify({ message: 'é' })
  const bytes = new TextEncoder().encode(body).byteLength
  await readPost(request(body), bytes)
  await assert.rejects(readPost(request(body), bytes - 1), fails(413))
  await assert.rejects(readPost(request(body, { 'Content-Length': '1' }), bytes - 1), fails(413))
  await assert.rejects(readPost(request('{}', { 'Content-Length': String(BODY_BYTES.tutor + 1) })), fails(413))
})

test('oversized chunked body is canceled without reading the rest', async () => {
  let canceled = false
  let chunks = 0
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) { chunks++; controller.enqueue(new Uint8Array(40)) },
    cancel() { canceled = true },
  })
  const req = new Request('https://example.test', { method: 'POST', body: stream, duplex: 'half' } as RequestInit)
  await assert.rejects(readPost(req, 100), fails(413))
  assert.ok(canceled)
  assert.ok(chunks <= 4)
})

test('user message, message-count and total-context limits are enforced server-side', () => {
  const message = (content: string) => ({ role: 'user', content })
  assert.equal(parseTutorMessages([message('x'.repeat(2000))], '').length, 1)
  assert.throws(() => parseTutorMessages([message('x'.repeat(2001))], ''), fails(413))
  assert.throws(() => parseTutorMessages(Array.from({ length: 41 }, () => message('x')), ''), fails(413))
  assert.throws(() => parseTutorMessages(Array.from({ length: 9 }, () => message('x'.repeat(2000))), ''), fails(413))
  assert.throws(() => parseTutorMessages([{ role: 'system', content: 'x' }], ''), fails(400))
  assert.throws(() => parseTutorMessages([{ role: 'assistant', content: 'x'.repeat(8001) }, message('x')], ''), fails(413))
  assert.throws(() => parseTutorMessages([message('x'.repeat(2000))], 'x'.repeat(15000)), fails(413))
})

test('prior attempts have count, per-attempt, and combined work limits', () => {
  assert.deepEqual(parsePriorAttempts(undefined, ''), [])
  assert.throws(() => parsePriorAttempts('x', ''), fails(400))
  assert.throws(() => parsePriorAttempts(Array(6).fill('x'), ''), fails(413))
  assert.throws(() => parsePriorAttempts(['x'.repeat(8001)], ''), fails(413))
  assert.throws(() => parsePriorAttempts(['x'.repeat(8000), 'x'.repeat(8000)], 'x'), fails(413))
})

test('browser context selection preserves whole recent messages and newest work', () => {
  assert.deepEqual(recentWithinBudget(['old', 'recent', 'new'], 40, 9, (s) => s), ['recent', 'new'])
  assert.deepEqual(recentWithinBudget(['old', 'recent', 'new'], 1, 100, (s) => s), ['new'])
  const work = 'w'.repeat(TUTOR_LIMITS.work)
  const context = recentWithinBudget(Array(20).fill('m'.repeat(2000)), TUTOR_LIMITS.messages, TUTOR_LIMITS.history - work.length, (s) => s)
  assert.equal(context.join('').length + work.length, TUTOR_LIMITS.history)
})
