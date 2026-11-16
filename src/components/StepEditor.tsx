import { useState } from 'react'
import { newStep, type Step } from '../lib/storage.ts'
import { MathField } from './MathField.tsx'

interface Props {
  steps: Step[]
  onChange: (steps: Step[]) => void
}

/** The user's argument as an ordered list of steps: prose plus an optional math field. */
export function StepEditor({ steps, onChange }: Props) {
  // The step whose math field was just added, so it can take focus.
  const [justAddedMath, setJustAddedMath] = useState<string | null>(null)

  const update = (id: string, patch: Partial<Step>) =>
    onChange(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  const move = (index: number, by: -1 | 1) => {
    const next = [...steps]
    const [step] = next.splice(index, 1)
    next.splice(index + by, 0, step)
    onChange(next)
  }

  return (
    <div className="steps">
      {steps.map((step, i) => (
        <div key={step.id} className="step">
          <div className="step-head">
            <span className="step-num">Step {i + 1}</span>
            <div className="step-tools">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move step ${i + 1} up`}>
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === steps.length - 1}
                aria-label={`Move step ${i + 1} down`}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(steps.filter((s) => s.id !== step.id))}
                disabled={steps.length === 1}
                aria-label={`Delete step ${i + 1}`}
              >
                ✕
              </button>
            </div>
          </div>

          <textarea
            value={step.text}
            onChange={(e) => update(step.id, { text: e.target.value })}
            placeholder={i === 0 ? 'Say what you are doing and why…' : 'Next step…'}
            rows={2}
            aria-label={`Step ${i + 1} explanation`}
          />

          {step.math === null ? (
            <button
              type="button"
              className="link"
              onClick={() => {
                update(step.id, { math: '' })
                setJustAddedMath(step.id)
              }}
            >
              + Add math
            </button>
          ) : (
            <div className="step-math">
              <MathField
                value={step.math}
                onChange={(math) => update(step.id, { math })}
                label={`Step ${i + 1} math`}
                autoFocus={justAddedMath === step.id}
              />
              <button type="button" className="link" onClick={() => update(step.id, { math: null })}>
                Remove math
              </button>
            </div>
          )}
        </div>
      ))}

      <button type="button" className="btn" onClick={() => onChange([...steps, newStep()])}>
        + Add step
      </button>
    </div>
  )
}
