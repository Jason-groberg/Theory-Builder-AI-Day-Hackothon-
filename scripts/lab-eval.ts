// Runs the lab corpus against the live pipeline and records what happened.
// Makes paid calls. Run with: npm run lab:eval [-- --repeats 2] [-- --judge-only]
//
// Results are evidence about these inputs and this configuration only. They do
// not show that a level is secure, or that it is beatable.
import { mkdirSync, writeFileSync } from 'node:fs'
import { cases, JUDGE_FIXTURES, type Case } from '../server/lab/corpus.ts'
import { liveProviders, runAttempt, type GuardScores, type Providers } from '../server/lab/pipeline.ts'
import {
  GUARD_MODEL,
  GUARD_THRESHOLD,
  JUDGE_MODEL,
  POLICY_VERSION,
  PROBLEMS,
  TUTOR_MODEL,
} from '../server/lab/policy.ts'

process.env.AGENT_LAB_DEBUG = '1'
const args = process.argv.slice(2)
const repeatsIndex = args.indexOf('--repeats')
const repeats = repeatsIndex === -1 ? 1 : Number(args[repeatsIndex + 1])
if (!Number.isSafeInteger(repeats) || repeats < 1 || repeats > 10)
  throw new Error('--repeats must be an integer from 1 to 10.')
const judgeOnly = args.includes('--judge-only')

interface Trial {
  case: string
  kind: string
  split: string
  level: number
  repeat: number
  /** Status of each turn, in order. The trial stops at a block, an advance or an error. */
  statuses: string[]
  final: string
  tutorCalls: number
  guardScores: (GuardScores | null)[]
  replies: (string | null)[]
}

async function runTrial(c: Case, level: number, repeat: number): Promise<Trial> {
  let tutorCalls = 0
  const providers: Providers = {
    ...liveProviders,
    tutor: (...a) => {
      tutorCalls += 1
      return liveProviders.tutor(...a)
    },
  }
  const trial: Trial = { case: c.id, kind: c.kind, split: c.split, level, repeat, statuses: [], final: '', tutorCalls: 0, guardScores: [], replies: [] }
  let sessionToken: string | undefined
  for (const message of c.messages) {
    let status: string
    try {
      const r = await runAttempt({ level, challengeId: c.problem, message, sessionToken }, providers)
      status = r.status
      sessionToken = r.sessionToken
      trial.guardScores.push(r.debug?.guardScores ?? null)
      trial.replies.push(r.tutorReply ?? null)
    } catch (err) {
      status = `error: ${(err as Error).message}`
    }
    trial.statuses.push(status)
    if (status !== 'resisted') break
  }
  trial.final = trial.statuses.at(-1)!
  trial.tutorCalls = tutorCalls
  return trial
}

async function pool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = []
  let next = 0
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++
        out[i] = await fn(items[i])
      }
    }),
  )
  return out
}

const judgeChecks = await pool(JUDGE_FIXTURES, 3, async (f) => {
  let verdict: string
  try {
    verdict = await liveProviders.judge(
      PROBLEMS[f.problem],
      f.student.map((content) => ({ role: 'user' as const, content })),
      f.args,
    )
  } catch (err) {
    verdict = `error: ${(err as Error).message}`
  }
  return { name: f.name, expected: f.expected, verdict, passed: verdict === f.expected }
})
console.log('Advance judge fixtures:')
for (const j of judgeChecks) console.log(`  ${j.passed ? 'pass' : 'FAIL'}  ${j.name}: ${j.verdict} (expected ${j.expected})`)

let trials: Trial[] = []
if (!judgeOnly) {
  const jobs = cases().flatMap((c) => [1, 2, 3].flatMap((level) => Array.from({ length: repeats }, (_, r) => ({ c, level, repeat: r + 1 }))))
  trials = await pool(jobs, 4, ({ c, level, repeat }) => runTrial(c, level, repeat))

  console.log('\nLevel | attack trials | won | blocked | unclear | errors || benign trials | blocked | legit')
  for (const level of [1, 2, 3]) {
    const at = trials.filter((t) => t.level === level && t.kind === 'attack')
    const be = trials.filter((t) => t.level === level && t.kind === 'benign')
    const n = (list: Trial[], f: string) => list.filter((t) => t.final === f).length
    const errors = at.filter((t) => t.final === 'unavailable' || t.final.startsWith('error')).length
    console.log(
      `  ${level}   | ${at.length} | ${n(at, 'won')} | ${n(at, 'blocked')} | ${n(at, 'unclear')} | ${errors} || ${be.length} | ${n(be, 'blocked')} | ${n(be, 'legit')}`,
    )
  }
  console.log('\nPer case (final status at levels 1, 2, 3):')
  for (const c of cases()) {
    const row = [1, 2, 3].map((level) => trials.filter((t) => t.case === c.id && t.level === level).map((t) => t.final).join(','))
    console.log(`  ${c.kind.padEnd(6)} ${c.split.padEnd(7)} ${c.id.padEnd(20)} ${row.join(' | ')}`)
  }
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
mkdirSync('lab-results', { recursive: true })
const file = `lab-results/${judgeOnly ? 'judge' : 'run'}-${stamp}.json`
writeFileSync(
  file,
  JSON.stringify(
    {
      started: stamp,
      config: { policyVersion: POLICY_VERSION, tutorModel: TUTOR_MODEL, judgeModel: JUDGE_MODEL, guardModel: GUARD_MODEL, guardThreshold: GUARD_THRESHOLD, repeats },
      judgeChecks,
      trials,
    },
    null,
    2,
  ),
)
console.log(`\nSaved ${file}`)

// Failed checks must also fail automation, rather than merely print "FAIL".
if (judgeChecks.some((j) => !j.passed) || trials.some((t) => t.final === 'unavailable' || t.final.startsWith('error:')))
  process.exitCode = 1
