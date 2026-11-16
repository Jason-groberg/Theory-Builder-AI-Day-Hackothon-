import { useState } from 'react'
import { HintLadder } from '../components/HintLadder.tsx'
import { RichText } from '../components/RichText.tsx'
import { StepEditor } from '../components/StepEditor.tsx'
import { categories } from '../content/categories.ts'
import { problemsIn } from '../content/problems/index.ts'
import { techniques } from '../content/techniques.ts'
import type { Problem } from '../content/types.ts'
import {
  isStepEmpty,
  loadDraft,
  loadHintsRevealed,
  newStep,
  saveDraft,
  saveHintsRevealed,
  type Step,
} from '../lib/storage.ts'
import { problemHref } from '../lib/useHashRoute.ts'

// Rendered with key={problem.id}, so state resets when the problem changes.
export default function ProblemPage({ problem }: { problem: Problem }) {
  const [steps, setSteps] = useState<Step[]>(() => loadDraft(problem.id))
  const [hintsRevealed, setHintsRevealed] = useState(() => loadHintsRevealed(problem.id))
  const [notice, setNotice] = useState('')

  const category = categories.find((c) => c.id === problem.category)!
  const siblings = problemsIn(problem.category)
  const index = siblings.findIndex((p) => p.id === problem.id)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]
  const hasWork = steps.some((s) => !isStepEmpty(s))

  const changeSteps = (next: Step[]) => {
    setSteps(next)
    saveDraft(problem.id, next)
    setNotice('')
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
        </section>

        <section className="panel" aria-label="Your work">
          <h2>Your work</h2>
          <p className="note">
            Write your argument one step at a time. Each step can carry an equation, built visually: no
            LaTeX needed. Your draft is saved in this browser.
          </p>

          <StepEditor steps={steps} onChange={changeSteps} />

          <div className="actions">
            <button
              type="button"
              className="btn primary"
              disabled={!hasWork}
              onClick={() => setNotice('Tutor review is not connected yet. Your draft is saved.')}
            >
              Submit for review
            </button>
            <button
              type="button"
              className="link"
              disabled={!hasWork}
              onClick={() => {
                if (window.confirm('Clear your work on this problem?')) changeSteps([newStep()])
              }}
            >
              Clear draft
            </button>
          </div>
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
        </section>
      </div>

      <nav className="pager" aria-label="Problems in this category">
        {prev ? <a href={problemHref(prev.id)}>← L{prev.level} {prev.title}</a> : <span />}
        {next ? <a href={problemHref(next.id)}>L{next.level} {next.title} →</a> : <span />}
      </nav>
    </main>
  )
}
