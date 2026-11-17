import { useState } from 'react'
import { HintLadder } from '../components/HintLadder.tsx'
import { RichText } from '../components/RichText.tsx'
import { StepEditor } from '../components/StepEditor.tsx'
import { TutorThread } from '../components/TutorThread.tsx'
import { categories } from '../content/categories.ts'
import { problemsIn } from '../content/problems/index.ts'
import { techniques } from '../content/techniques.ts'
import type { Problem } from '../content/types.ts'
import { postJson, streamTutor } from '../lib/api.ts'
import { recentWithinBudget, TUTOR_LIMITS } from '../lib/input-limits.ts'
import {
  ATTEMPTS_TO_REVEAL,
  canReveal,
  countedAttempts,
  isStepEmpty,
  loadDraft,
  loadHintsRevealed,
  loadProgress,
  newStep,
  saveDraft,
  saveHintsRevealed,
  saveProgress,
  stepsToMarkdown,
  type Progress,
  type RevealedSolution,
  type Step,
  type ThreadItem,
  type Verdict,
} from '../lib/storage.ts'
import { problemHref } from '../lib/useHashRoute.ts'

const item = (fields: Omit<ThreadItem, 'id'>): ThreadItem => ({ id: crypto.randomUUID(), ...fields })

/** The thread as the alternating conversation the tutor model expects. */
function toMessages(thread: ThreadItem[]) {
  return thread
    .filter((t) => t.text)
    .map((t) => ({ role: t.role === 'student' ? ('user' as const) : ('assistant' as const), content: t.text }))
}

// Rendered with key={problem.id}, so state resets when the problem changes.
export default function ProblemPage({ problem }: { problem: Problem }) {
  const [steps, setSteps] = useState<Step[]>(() => loadDraft(problem.id))
  const [hintsRevealed, setHintsRevealed] = useState(() => loadHintsRevealed(problem.id))
  const [progress, setProgress] = useState<Progress>(() => loadProgress(problem.id))
  const [busy, setBusy] = useState<'reviewing' | 'replying' | 'revealing' | null>(null)
  const [notice, setNotice] = useState('')

  const category = categories.find((c) => c.id === problem.category)!
  const siblings = problemsIn(problem.category)
  const index = siblings.findIndex((p) => p.id === problem.id)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]
  const hasWork = steps.some((s) => !isStepEmpty(s))
  const counted = countedAttempts(progress)
  const attemptsLeft = Math.max(0, ATTEMPTS_TO_REVEAL - counted)

  const changeSteps = (next: Step[]) => {
    setSteps(next)
    saveDraft(problem.id, next)
    setNotice('')
  }

  /** Applies an update to progress and persists the result. */
  const updateProgress = (change: (p: Progress) => Progress) =>
    setProgress((current) => {
      const next = change(current)
      saveProgress(problem.id, next)
      return next
    })

  const submit = async () => {
    const work = stepsToMarkdown(steps)
    if (work.length > TUTOR_LIMITS.work) {
      setNotice(`Your work is too long (limit ${TUTOR_LIMITS.work} characters).`)
      return
    }
    const attemptNumber = progress.attempts.length + 1
    setBusy('reviewing')
    setNotice('')
    updateProgress((p) => ({
      ...p,
      thread: [...p.thread, item({ role: 'student', kind: 'submission', text: `Attempt ${attemptNumber} submitted for review.` })],
    }))
    try {
      await streamTutor(
        'review-attempt',
        { problemId: problem.id, work, hintsRevealed, priorAttempts: recentWithinBudget(progress.attempts.map((a) => a.work), TUTOR_LIMITS.priorAttempts, TUTOR_LIMITS.history - work.length, (s) => s) },
        (event) => {
          if (event.type !== 'result') return
          const verdict = event.verdict as Verdict
          const isCounted = Boolean(event.counted)
          updateProgress((p) => ({
            ...p,
            solved: p.solved || verdict === 'correct',
            techniques: [...new Set([...p.techniques, ...((event.techniques as string[]) ?? [])])],
            attempts: [...p.attempts, { work, verdict, counted: isCounted, receipt: (event.receipt as string) ?? null }],
            thread: [
              ...p.thread,
              item({ role: 'tutor', kind: 'review', text: String(event.feedback), verdict, counted: isCounted }),
            ],
          }))
        },
      )
    } catch (err) {
      setNotice((err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const ask = async (question: string) => {
    const work = stepsToMarkdown(steps)
    if (work.length > TUTOR_LIMITS.work) {
      setNotice(`Your work is too long (limit ${TUTOR_LIMITS.work} characters).`)
      return
    }
    const asked = item({ role: 'student', kind: 'chat', text: question })
    const reply = item({ role: 'tutor', kind: 'chat', text: '' })
    const history = [...progress.thread, asked]
    setBusy('replying')
    setNotice('')
    updateProgress((p) => ({ ...p, thread: [...p.thread, asked, reply] }))
    try {
      await streamTutor(
        'tutor-chat',
        { problemId: problem.id, work, hintsRevealed, messages: recentWithinBudget(toMessages(history), TUTOR_LIMITS.messages, TUTOR_LIMITS.history - work.length, (m) => m.content) },
        (event) => {
          if (event.type !== 'delta') return
          updateProgress((p) => ({
            ...p,
            thread: p.thread.map((t) => (t.id === reply.id ? { ...t, text: t.text + String(event.text) } : t)),
          }))
        },
      )
    } catch (err) {
      setNotice((err as Error).message)
    } finally {
      // Drop the placeholder if nothing arrived, so a failed reply leaves no empty bubble.
      updateProgress((p) => ({ ...p, thread: p.thread.filter((t) => t.id !== reply.id || t.text) }))
      setBusy(null)
    }
  }

  const reveal = async () => {
    setBusy('revealing')
    setNotice('')
    try {
      const solution = await postJson<RevealedSolution>('reveal-solution', {
        problemId: problem.id,
        receipts: progress.attempts.map((a) => a.receipt).filter(Boolean).slice(-50),
      })
      updateProgress((p) => ({ ...p, solution }))
    } catch (err) {
      setNotice((err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <main className="workspace">
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="#/">All categories</a>
        <span aria-hidden="true">/</span>
        <span>{category.name}</span>
      </nav>

      <div className="split">
        <section className="panel" aria-label="Problem">
          <div className="problem-meta">
            <span className="level">Level {problem.level}/5</span>
            {progress.solved && <span className="level solved">Solved</span>}
            <ul className="tags">
              {problem.techniques.map((t) => (
                <li key={t}>{techniques[t]}</li>
              ))}
            </ul>
          </div>
          <h1>{problem.title}</h1>
          <RichText text={problem.statement} />

          <HintLadder
            hints={problem.hints}
            revealed={hintsRevealed}
            onReveal={(n) => {
              setHintsRevealed(n)
              saveHintsRevealed(problem.id, n)
            }}
          />

          <section className="solution" aria-label="Solution">
            <h2>Solution</h2>
            {progress.solution ? (
              <>
                {progress.solution.answer && (
                  <div className="answer">
                    <span className="hint-label">Answer</span>
                    <RichText text={progress.solution.answer} />
                  </div>
                )}
                <RichText text={progress.solution.solution} />
              </>
            ) : (
              <>
                <p className="note">
                  {progress.solved
                    ? 'You solved it. Compare your argument with the reference solution.'
                    : attemptsLeft === 0
                      ? 'You have made three genuine attempts. The solution is unlocked.'
                      : `Unlocks after ${attemptsLeft} more genuine attempt${attemptsLeft === 1 ? '' : 's'} (${counted}/${ATTEMPTS_TO_REVEAL} so far), or when you solve it.`}
                </p>
                <button type="button" className="btn" disabled={!canReveal(progress) || busy !== null} onClick={reveal}>
                  {busy === 'revealing' ? 'Loading…' : 'Show solution'}
                </button>
              </>
            )}
          </section>
        </section>

        <section className="panel" aria-label="Your work">
          <h2>Your work</h2>
          <p className="note">
            Write your argument one step at a time. Each step can carry an equation, built visually: no
            LaTeX needed. Your draft is saved in this browser.
          </p>

          <StepEditor steps={steps} onChange={changeSteps} />

          <div className="actions">
            <button type="button" className="btn primary" disabled={!hasWork || busy !== null} onClick={submit}>
              {busy === 'reviewing' ? 'Reviewing…' : 'Submit for review'}
            </button>
            <button
              type="button"
              className="link"
              disabled={!hasWork || busy !== null}
              onClick={() => {
                if (window.confirm('Clear your work on this problem?')) changeSteps([newStep()])
              }}
            >
              Clear draft
            </button>
          </div>
          {notice && (
            <p className="notice" role="alert">
              {notice}
            </p>
          )}

          <TutorThread
            thread={progress.thread}
            busy={busy === 'reviewing' || busy === 'replying' ? busy : null}
            onAsk={ask}
          />
        </section>
      </div>

      <nav className="pager" aria-label="Problems in this category">
        {prev ? <a href={problemHref(prev.id)}>← L{prev.level} {prev.title}</a> : <span />}
        {next ? <a href={problemHref(next.id)}>L{next.level} {next.title} →</a> : <span />}
      </nav>
    </main>
  )
}
