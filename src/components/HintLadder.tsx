import { RichText } from './RichText.tsx'

const LABELS = ['Nudge', 'Idea', 'First step']

interface Props {
  hints: string[]
  revealed: number
  onReveal: (count: number) => void
}

/** Hints are unlocked one at a time, in order, and only when the user asks. */
export function HintLadder({ hints, revealed, onReveal }: Props) {
  return (
    <section className="hints" aria-label="Hints">
      <h2>
        Hints <span className="count">{revealed}/{hints.length} used</span>
      </h2>
      {hints.slice(0, revealed).map((hint, i) => (
        <div key={i} className="hint">
          <span className="hint-label">
            {i + 1}. {LABELS[i]}
          </span>
          <RichText text={hint} />
        </div>
      ))}
      {revealed < hints.length ? (
        <button type="button" className="btn" onClick={() => onReveal(revealed + 1)}>
          Reveal hint {revealed + 1}: {LABELS[revealed]}
        </button>
      ) : (
        <p className="note">That is every hint. Try writing out the argument from the first step.</p>
      )}
    </section>
  )
}
