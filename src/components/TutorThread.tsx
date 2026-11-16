import { useEffect, useRef, useState } from 'react'
import type { ThreadItem, Verdict } from '../lib/storage.ts'
import { RichText } from './RichText.tsx'

const VERDICT_LABEL: Record<Verdict, string> = {
  correct: 'Correct',
  incomplete: 'Incomplete',
  gap: 'Gap found',
  unsure: 'Not sure',
  not_an_attempt: 'Not an attempt',
}

interface Props {
  thread: ThreadItem[]
  /** What the tutor is doing right now, if anything. */
  busy: 'reviewing' | 'replying' | null
  onAsk: (question: string) => void
}

/** Reviews of submitted attempts and the conversation with the tutor, in one thread. */
export function TutorThread({ thread, busy, onAsk }: Props) {
  const [question, setQuestion] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const last = thread.at(-1)

  // Keep the newest message in view as the thread grows or a reply streams in.
  useEffect(() => {
    if (thread.length) endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [thread.length, last?.text])

  const ask = () => {
    const q = question.trim()
    if (!q || busy) return
    setQuestion('')
    onAsk(q)
  }

  return (
    <section className="tutor" aria-label="Tutor">
      <h2>Tutor</h2>

      {thread.length === 0 && !busy && (
        <p className="note">
          Stuck, or unsure a step is valid? Ask. The tutor will help you find the next move, but will not
          hand over the answer.
        </p>
      )}

      <div className="thread" aria-live="polite">
        {thread.map((item) =>
          item.kind === 'submission' ? (
            <p key={item.id} className="thread-marker">
              {item.text}
            </p>
          ) : (
            <div key={item.id} className={`msg msg-${item.role}`}>
              <span className="msg-who">
                {item.role === 'student' ? 'You' : item.kind === 'review' ? 'Review' : 'Tutor'}
                {item.verdict && <span className={`verdict verdict-${item.verdict}`}>{VERDICT_LABEL[item.verdict]}</span>}
              </span>
              {item.text ? <RichText text={item.text} /> : <p className="note">Thinking…</p>}
              {item.kind === 'review' && item.verdict !== 'correct' && (
                <p className="msg-foot">
                  {item.counted
                    ? 'This attempt counts towards unlocking the solution.'
                    : 'This does not count as a new attempt.'}
                </p>
              )}
            </div>
          ),
        )}
        {busy === 'reviewing' && <p className="thread-marker">Reviewing your work…</p>}
        <div ref={endRef} />
      </div>

      <form
        className="ask"
        onSubmit={(e) => {
          e.preventDefault()
          ask()
        }}
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              ask()
            }
          }}
          placeholder="Ask the tutor a question…"
          rows={2}
          maxLength={2000}
          aria-label="Question for the tutor"
        />
        <button type="submit" className="btn" disabled={!question.trim() || busy !== null}>
          Ask
        </button>
      </form>
    </section>
  )
}
