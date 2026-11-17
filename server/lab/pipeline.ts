// The Agent Engineer Lab attempt pipeline: validate, screen (level 3), call the
// tutor, and score. Provider calls are injected so the control flow can be
// tested without the network.
import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { HttpError } from '../http.ts'
import {
  ADVANCE_JUDGE,
  ADVANCE_JUDGE_SCHEMA,
  ADVANCE_TOOL,
  FEEDBACK,
  GUARD_MODEL,
  GUARD_QUESTIONS,
  GUARD_THRESHOLD,
  JUDGE_MODEL,
  LIMITS,
  OPENAI_URL,
  POLICY_VERSION,
  PROBLEMS,
  TUTOR_MODEL,
  TYPESAFE_URL,
  tutorInstructions,
  type GuardQuestion,
  type LabProblem,
  type LabStatus,
} from './policy.ts'

export type Level = 1 | 2 | 3
export interface Turn {
  role: 'user' | 'assistant'
  content: string
}

// ---------- Sessions ----------
// The server keeps no state. The conversation lives in a token the server
// signs, so the browser can carry it but cannot edit roles, inject tutor
// messages, change level or challenge, or reopen a finished session.

interface Session {
  v: string
  level: Level
  challenge: string
  history: Turn[]
  /** Every submission, including blocked and failed ones. */
  submissions: number
  done: boolean
}

function sessionSecret(): Buffer {
  const seed = process.env.LAB_SESSION_SECRET || process.env.OPENAI_API_KEY
  if (!seed) throw new HttpError(503, 'The lab is not configured. Please try again later.')
  return createHash('sha256').update(`tb-lab-session:${seed}`).digest()
}

const mac = (payload: string) => createHmac('sha256', sessionSecret()).update(payload).digest('base64url')

export function signSession(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  return `${payload}.${mac(payload)}`
}

export function openSession(token: string): Session {
  if (token.length > 128000 || token.split('.').length !== 2)
    throw new HttpError(400, 'This session is not valid. Reset and start again.')
  const [payload, given] = token.split('.')
  const expected = payload ? Buffer.from(mac(payload)) : null
  const actual = Buffer.from(given ?? '')
  if (!expected || expected.length !== actual.length || !timingSafeEqual(expected, actual))
    throw new HttpError(400, 'This session is not valid. Reset and start again.')
  return JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session
}

// ---------- Providers ----------

/** A provider was unreachable or returned something unusable. Never a win, never a verified defense. */
export class ProviderError extends Error {}

async function postJson(url: string, key: string, body: unknown, timeoutMs: number): Promise<Record<string, unknown>> {
  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch {
    throw new ProviderError('Provider request failed or timed out.')
  }
  // Provider bodies and headers are not echoed: they can contain request details.
  if (!response.ok) throw new ProviderError(`Provider HTTP ${response.status}.`)
  try {
    const parsed = (await response.json()) as unknown
    if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>
  } catch {
    // fall through
  }
  throw new ProviderError('Provider returned malformed JSON.')
}

export type GuardScores = Record<GuardQuestion, number>

/** Validates a guard response. Anything short of two finite probabilities in [0, 1] is an error. */
export function parseGuardScores(raw: Record<string, unknown>): GuardScores {
  const answers = raw.answers as Record<string, { type?: unknown; noul?: unknown }> | undefined
  const scores = {} as GuardScores
  for (const name of Object.keys(GUARD_QUESTIONS) as GuardQuestion[]) {
    const answer = answers?.[name]
    const p = answer?.noul
    if (!answer || answer.type !== 'noul' || typeof p !== 'number' || !Number.isFinite(p) || p < 0 || p > 1)
      throw new ProviderError('Invalid guard result.')
    scores[name] = p
  }
  return scores
}

async function callGuard(problem: LabProblem, conversation: Turn[]): Promise<GuardScores> {
  const key = process.env.TYPESAFE_API_KEY || process.env.TYPAFE_API_KEY
  if (!key) throw new ProviderError('The guard has no API key configured.')
  // Player text goes only into `state`. The questions are fixed policy.
  const raw = await postJson(
    TYPESAFE_URL,
    key,
    {
      model: GUARD_MODEL,
      state: { original_problem: problem.statement, untrusted_conversation: conversation },
      questions: GUARD_QUESTIONS,
    },
    15_000,
  )
  return parseGuardScores(raw)
}

interface OutputItem {
  type?: string
  name?: string
  arguments?: string
  content?: { type?: string; text?: string }[]
}

function outputItems(raw: Record<string, unknown>): OutputItem[] {
  if (!Array.isArray(raw.output) || raw.output.some((item) => !item || typeof item !== 'object'))
    throw new ProviderError('Malformed provider output.')
  return raw.output as OutputItem[]
}

const outputText = (raw: Record<string, unknown>) =>
  outputItems(raw)
    .filter((item) => item.type === 'message')
    .flatMap((item) => {
      if (!Array.isArray(item.content) || item.content.some((c) => !c || typeof c !== 'object'))
        throw new ProviderError('Malformed provider message.')
      return item.content
    })
    .filter((c) => c.type === 'output_text' && typeof c.text === 'string')
    .map((c) => c.text)
    .join('\n')

function openAiKey(): string {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new ProviderError('The tutor has no API key configured.')
  return key
}

export interface TutorResult {
  reply: string
  /** Set when the tutor called its advance tool: the raw JSON arguments. */
  advanced: string | null
}

/** Reads a tutor response. An incomplete or empty response is an error, not a refusal. */
export function parseTutorResponse(raw: Record<string, unknown>): TutorResult {
  if (raw.status !== 'completed') throw new ProviderError('Incomplete tutor response.')
  const call = outputItems(raw).find(
    (item) => item.type === 'function_call' && item.name === ADVANCE_TOOL.name,
  )
  const reply = outputText(raw)
  if (!call && !reply) throw new ProviderError('Empty tutor response.')
  if (call) {
    try {
      if (typeof call.arguments !== 'string') throw new Error()
      const args = JSON.parse(call.arguments)
      if (!args || typeof args !== 'object' || Array.isArray(args) ||
          typeof args.accepted_answer !== 'string' || Object.keys(args).length !== 1) throw new Error()
    } catch {
      throw new ProviderError('Malformed advance tool arguments.')
    }
  }
  return { reply, advanced: call ? call.arguments! : null }
}

async function callTutor(level: Level, problem: LabProblem, conversation: Turn[]): Promise<TutorResult> {
  const raw = await postJson(
    OPENAI_URL,
    openAiKey(),
    {
      model: TUTOR_MODEL,
      instructions: tutorInstructions(level, problem),
      input: conversation,
      tools: [ADVANCE_TOOL],
      tool_choice: 'auto',
      parallel_tool_calls: false,
      max_output_tokens: 400,
      temperature: 0,
      store: false,
    },
    30_000,
  )
  return parseTutorResponse(raw)
}

export type AdvanceVerdict = 'correct' | 'incorrect' | 'unclear'

async function callAdvanceJudge(problem: LabProblem, conversation: Turn[], toolArguments: string): Promise<AdvanceVerdict> {
  const raw = await postJson(
    OPENAI_URL,
    openAiKey(),
    {
      model: JUDGE_MODEL,
      instructions: ADVANCE_JUDGE,
      input: [
        {
          role: 'user',
          content: JSON.stringify({
            original_problem: problem.statement,
            reference: problem.reference,
            conversation,
            tutor_tool_arguments: toolArguments,
          }),
        },
      ],
      reasoning: { effort: 'low' },
      max_output_tokens: 1800,
      store: false,
      text: { format: { type: 'json_schema', name: 'advance_review', strict: true, schema: ADVANCE_JUDGE_SCHEMA } },
    },
    45_000,
  )
  if (raw.status !== 'completed') throw new ProviderError('Incomplete judge response.')
  let verdict: unknown
  try {
    verdict = (JSON.parse(outputText(raw)) as { student_answer?: unknown }).student_answer
  } catch {
    throw new ProviderError('Malformed judge response.')
  }
  if (verdict !== 'correct' && verdict !== 'incorrect' && verdict !== 'unclear')
    throw new ProviderError('Invalid judge verdict.')
  return verdict
}

export interface Providers {
  guard: typeof callGuard
  tutor: typeof callTutor
  judge: typeof callAdvanceJudge
}

export const liveProviders: Providers = { guard: callGuard, tutor: callTutor, judge: callAdvanceJudge }

// ---------- The attempt ----------

export interface AttemptResult {
  status: LabStatus
  tutorReply?: string
  feedback: string
  sessionToken: string
  attemptId: string
  /** The session is over (the tutor advanced). A reset is needed to play again. */
  done: boolean
  /** Player turns the tutor has seen, and the limit. */
  turns: number
  turnLimit: number
  /** Only for educators, and only when AGENT_LAB_DEBUG=1 on the server. */
  debug?: { guardScores?: GuardScores }
}

/** Validates the request fields. Runs before any paid call. */
export function parseRequest(body: Record<string, unknown>) {
  const { level, challengeId, message, sessionToken } = body
  if (level !== 1 && level !== 2 && level !== 3) throw new HttpError(400, 'Level must be 1, 2 or 3.')
  if (typeof challengeId !== 'string' || !Object.hasOwn(PROBLEMS, challengeId))
    throw new HttpError(400, 'Unknown challenge.')
  if (typeof message !== 'string') throw new HttpError(400, 'Message must be text.')
  if (!message.trim()) throw new HttpError(400, 'Write a message first.')
  // Oversized input is rejected, never truncated: cutting text could cut away the attack.
  if (message.length > LIMITS.message)
    throw new HttpError(413, `Message is too long (limit ${LIMITS.message} characters).`)
  if (sessionToken !== undefined && sessionToken !== null && typeof sessionToken !== 'string')
    throw new HttpError(400, 'Session token must be text.')
  return { level: level as Level, challengeId, message, sessionToken: sessionToken || null }
}

export async function runAttempt(body: Record<string, unknown>, providers: Providers = liveProviders): Promise<AttemptResult> {
  const { level, challengeId, message, sessionToken } = parseRequest(body)
  const problem = PROBLEMS[challengeId]
  // A response must be signable before any paid provider is invoked.
  sessionSecret()

  let session: Session
  if (sessionToken) {
    session = openSession(sessionToken)
    // A session is bound to its level, challenge and policy version.
    if (session.v !== POLICY_VERSION || session.level !== level || session.challenge !== challengeId)
      throw new HttpError(409, 'This session belongs to a different level or challenge. Reset and start again.')
    if (session.done) throw new HttpError(409, 'This session is finished. Reset to play again.')
  } else {
    session = { v: POLICY_VERSION, level, challenge: challengeId, history: [], submissions: 0, done: false }
  }

  const turnsSoFar = session.history.filter((t) => t.role === 'user').length
  if (turnsSoFar >= LIMITS.turns) throw new HttpError(409, `This session has used all ${LIMITS.turns} turns. Reset to try again.`)
  if (session.submissions >= LIMITS.submissions) throw new HttpError(409, 'This session has too many submissions. Reset to try again.')
  const size = session.history.reduce((n, t) => n + t.content.length, 0) + message.length
  if (size > LIMITS.history)
    throw new HttpError(413, `The conversation is too long (limit ${LIMITS.history} characters). Reset to try again.`)

  session.submissions += 1
  const prospective: Turn[] = [...session.history, { role: 'user', content: message }]
  const debugOn = process.env.AGENT_LAB_DEBUG === '1'
  let guardScores: GuardScores | undefined

  const finish = (status: LabStatus, tutorReply?: string): AttemptResult => ({
    status,
    tutorReply,
    feedback: FEEDBACK[status],
    sessionToken: signSession(session),
    attemptId: randomUUID(),
    done: session.done,
    turns: session.history.filter((t) => t.role === 'user').length,
    turnLimit: LIMITS.turns,
    ...(debugOn && guardScores ? { debug: { guardScores } } : {}),
  })

  // Level 3: screen the whole prospective conversation before the tutor can see any of it.
  if (level === 3) {
    try {
      guardScores = await providers.guard(problem, prospective)
    } catch (err) {
      if (!(err instanceof ProviderError)) throw err
      // Fail closed. There is no unguarded fallback.
      return finish('unavailable')
    }
    if (Math.max(...Object.values(guardScores)) >= GUARD_THRESHOLD) return finish('blocked')
  }

  let tutor: TutorResult
  try {
    tutor = await providers.tutor(level, problem, prospective)
  } catch (err) {
    if (!(err instanceof ProviderError)) throw err
    return finish('unavailable')
  }

  if (tutor.advanced === null) {
    // Only an accepted turn with a tutor reply joins the conversation.
    session.history = [...prospective, { role: 'assistant', content: tutor.reply }]
    return finish('resisted', tutor.reply)
  }

  // The tutor used its tool. The session ends here whatever the score.
  session.done = true
  session.history = [...prospective, { role: 'assistant', content: tutor.reply || '(advanced to the next question)' }]
  const reply = tutor.reply || 'The tutor advanced you to the next question without further comment.'
  let verdict: AdvanceVerdict
  try {
    verdict = await providers.judge(problem, prospective, tutor.advanced)
  } catch (err) {
    if (!(err instanceof ProviderError)) throw err
    // A scoring failure can never award a win.
    return finish('unclear', reply)
  }
  return finish(verdict === 'incorrect' ? 'won' : verdict === 'correct' ? 'legit' : 'unclear', reply)
}
