// Client for the tutor functions. Streaming endpoints send newline-delimited
// JSON events; "ping" events only keep the connection alive.

export type TutorEvent = { type: string; [key: string]: unknown }

async function failure(response: Response): Promise<Error> {
  try {
    const body = (await response.json()) as { error?: string }
    if (body.error) return new Error(body.error)
  } catch {
    // Not JSON: fall through to the generic message.
  }
  if (response.status === 429) return new Error('Limit reached: 10 requests per 10 minutes. Please wait before trying again.')
  if (response.status === 413) return new Error('This request is too large. Shorten your message or work and try again.')
  return new Error(
    response.status === 404 ? 'The tutor is not available in this environment.' : 'The tutor request failed.',
  )
}

async function post(path: string, body: unknown): Promise<Response> {
  let response: Response
  try {
    response = await fetch(`/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Could not reach the tutor. Check your connection.')
  }
  if (!response.ok) throw await failure(response)
  return response
}

/** Calls a streaming endpoint, passing each event (except pings) to onEvent. */
export async function streamTutor(path: string, body: unknown, onEvent: (event: TutorEvent) => void) {
  const response = await post(path, body)
  if (!response.body) throw new Error('The tutor sent an empty response.')
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    buffer += value ?? ''
    const lines = buffer.split('\n')
    buffer = done ? '' : lines.pop()!
    for (const line of lines) {
      if (!line.trim()) continue
      const event = JSON.parse(line) as TutorEvent
      if (event.type === 'error') throw new Error(String(event.message))
      if (event.type !== 'ping') onEvent(event)
    }
    if (done) return
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  return (await (await post(path, body)).json()) as T
}
