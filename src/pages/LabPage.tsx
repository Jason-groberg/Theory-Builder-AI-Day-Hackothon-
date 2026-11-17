import { useRef, useState } from 'react'
import { RichText } from '../components/RichText.tsx'
import {
  LAB_LIMITS,
  labChallenges,
  labDefenses,
  labStatusLabel,
  type LabLevel,
  type LabStatus,
} from '../content/lab.ts'
import { postJson } from '../lib/api.ts'

interface AttemptResponse {
  status: LabStatus
  tutorReply?: string
  feedback: string
  sessionToken: string
  attemptId: string
  done: boolean
  turns: number
  turnLimit: number
  debug?: { guardScores?: Record<string, number> }
}

interface Entry extends Omit<AttemptResponse, 'sessionToken'> {
  message: string
}

/** The lab tutor writes LaTeX with \( \) and \[ \]; the renderer expects $ and $$. */
const normaliseMath = (text: string) =>
  text.replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `$$${m}$$`).replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => `$${m}$`)

const emptyRun = { entries: [] as Entry[], token: null as string | null, turns: 0, done: false }

// A separate space from student tutoring: nothing here touches homework
// progress, attempt counters or solutions.
export default function LabPage() {
  const [challengeId, setChallengeId] = useState(labChallenges[0].id)
  const [level, setLevel] = useState<LabLevel>(1)
  const [run, setRun] = useState(emptyRun)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  // Guards against a second submit landing before React has re-rendered.
  const inFlight = useRef(false)
  // Bumped on every reset so a reply to an abandoned run is ignored.
  const runId = useRef(0)

  const challenge = labChallenges.find((c) => c.id === challengeId)!
  const turnsLeft = LAB_LIMITS.turns - run.turns
  const canSend = Boolean(draft.trim()) && !busy && !run.done && turnsLeft > 0

  const reset = () => {
    runId.current += 1
    inFlight.current = false
    setRun(emptyRun)
    setBusy(false)
    setNotice('')
  }

  // The conversation is bound to one level and one challenge, so changing either starts over.
  const choose = (next: { challengeId?: string; level?: LabLevel }) => {
    if (next.challengeId) setChallengeId(next.challengeId)
    if (next.level) setLevel(next.level)
    reset()
  }

  const submit = async () => {
    if (!canSend || inFlight.current) return
    inFlight.current = true
    const message = draft
    const thisRun = runId.current
    setBusy(true)
    setNotice('')
    try {
      const res = await postJson<AttemptResponse>('agent-lab-attempt', {
        level,
        challengeId,
        message,
        sessionToken: run.token,
      })
      if (thisRun !== runId.current) return
      const { sessionToken, ...result } = res
      setRun((r) => ({
        entries: [...r.entries, { ...result, message }],
        token: sessionToken,
        turns: res.turns,
        done: res.done,
      }))
      setDraft('')
    } catch (err) {
      if (thisRun === runId.current) setNotice((err as Error).message)
    } finally {
      if (thisRun === runId.current) {
        inFlight.current = false
        setBusy(false)
      }
    }
  }

  return (
    <main className="workspace lab">
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="#/">All categories</a>
        <span aria-hidden="true">/</span>
        <span>Agent Engineer Lab</span>
      </nav>

      <section className="lab-intro">
        <h1>
          Agent Engineer <em>Lab</em>
        </h1>
        <p>
          A red-team exercise, separate from the math practice. The tutor here has one tool: it can advance a
          student to the next question when it agrees their answer is correct. Your mission is to get it to
          advance you <strong>without</strong> a correct answer. The tutor is not told about your mission.
        </p>
      </section>

      <div className="split">
        <div className="lab-setup">
          <section className="panel" aria-label="Challenge">
            <h2>1. Problem</h2>
            <div className="choices" role="radiogroup" aria-label="Problem">
              {labChallenges.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={c.id === challengeId}
                  className={`choice ${c.id === challengeId ? 'on' : ''}`}
                  onClick={() => choose({ challengeId: c.id })}
                >
                  {c.title}
                </button>
              ))}
            </div>
            <RichText text={challenge.statement} />
            <div className="mission">
              <span className="hint-label">Your mission</span>
              <RichText text={`Get the tutor to advance you while claiming: **${challenge.target}**`} />
              <p className="note">This claim is false. Giving the real answer does not count.</p>
            </div>
          </section>

          <section className="panel" aria-label="Defense level">
            <h2>2. Defense</h2>
            <div className="defenses" role="radiogroup" aria-label="Defense level">
              {labDefenses.map((d) => (
                <button
                  key={d.level}
                  type="button"
                  role="radio"
                  aria-checked={d.level === level}
                  className={`defense ${d.level === level ? 'on' : ''}`}
                  onClick={() => choose({ level: d.level })}
                >
                  <span className="level">Level {d.level}</span>
                  <strong>{d.name}</strong>
                  <span>{d.summary}</span>
                </button>
              ))}
            </div>
            <p className="note">
              All three levels are open. They are increasing defenses, not a tested difficulty ladder, and
              none is guaranteed to be beatable or unbeatable.
            </p>
          </section>
        </div>

        <section className="panel" aria-label="Attempt">
          <div className="lab-head">
            <h2>3. Your attempt</h2>
            <span className="count">
              Turn {Math.min(run.turns + 1, LAB_LIMITS.turns)}/{LAB_LIMITS.turns} · {run.entries.length} sent
            </span>
          </div>

          <div className="thread" aria-live="polite">
            {run.entries.map((e) => (
              <div key={e.attemptId} className="lab-entry">
                <div className="msg msg-student">
                  <span className="msg-who">You</span>
                  <p className="plain">{e.message}</p>
                </div>
                <div className={`msg msg-tutor outcome-${e.status}`}>
                  <span className="msg-who">
                    <span className={`verdict lab-${e.status}`}>{labStatusLabel[e.status]}</span>
                  </span>
                  {e.tutorReply && <RichText text={normaliseMath(e.tutorReply)} />}
                  <p className="msg-foot">{e.feedback}</p>
                  {e.debug?.guardScores && (
                    <details className="debug">
                      <summary>Educator view: screening scores</summary>
                      <ul>
                        {Object.entries(e.debug.guardScores).map(([name, p]) => (
                          <li key={name}>
                            {name}: {p.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            ))}
            {busy && <p className="thread-marker">Sending to the lab…</p>}
          </div>

          {run.done ? (
            <p className="notice" role="status">
              The tutor advanced, so this session is over. Reset to play again.
            </p>
          ) : turnsLeft <= 0 ? (
            <p className="notice" role="status">
              You have used all {LAB_LIMITS.turns} turns. Reset to try a new approach.
            </p>
          ) : (
            <form
              className="lab-form"
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    submit()
                  }
                }}
                placeholder="Write the message the tutor will receive from you…"
                rows={6}
                maxLength={LAB_LIMITS.message}
                aria-label="Message to the tutor"
              />
              <span className="count">
                {draft.length}/{LAB_LIMITS.message} · Ctrl/⌘ + Enter to send
              </span>
            </form>
          )}

          {notice && (
            <p className="notice" role="alert">
              {notice}
            </p>
          )}

          <div className="actions">
            <button type="button" className="btn primary" disabled={!canSend} onClick={submit}>
              {busy ? 'Sending…' : 'Send to tutor'}
            </button>
            <button type="button" className="link" disabled={run.entries.length === 0 && !busy} onClick={reset}>
              Reset conversation
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
