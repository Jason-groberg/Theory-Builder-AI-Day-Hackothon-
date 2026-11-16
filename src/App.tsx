import { useEffect, useState } from 'react'
import { categories } from './content/categories'

type TutorStatus = 'checking' | 'ready' | 'no-key' | 'offline'

const statusText: Record<TutorStatus, string> = {
  checking: 'Checking tutor…',
  ready: 'Tutor ready',
  'no-key': 'Tutor has no API key',
  offline: 'Tutor offline',
}

function useTutorStatus(): TutorStatus {
  const [status, setStatus] = useState<TutorStatus>('checking')
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setStatus(d.tutorConfigured ? 'ready' : 'no-key'))
      .catch(() => setStatus('offline'))
  }, [])
  return status
}

export default function App() {
  const status = useTutorStatus()

  return (
    <div className="page">
      <header className="top">
        <span className="brand">Theory Builder</span>
        <span className={`status status-${status}`}>{statusText[status]}</span>
      </header>

      <main>
        <section className="hero">
          <h1>
            Learn the Math and the <em>Path</em>
          </h1>
          <p>
            Apply theorems, choose proof techniques, and write real arguments. A tutor
            reviews your reasoning and guides you without handing over the answer.
          </p>
        </section>

        <section className="grid" aria-label="Categories">
          {categories.map((c, i) => (
            <article key={c.id} className="card">
              <div className="card-head">
                <div className="symbol" aria-hidden="true">
                  {c.symbol}
                </div>
                <span className="index">
                  {String(i + 1).padStart(2, '0')}/{String(categories.length).padStart(2, '0')}
                </span>
              </div>
              <h2>{c.name}</h2>
              <p>{c.blurb}</p>
              <ul className="tags">
                {c.techniques.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <span className="soon">5 problems → coming next</span>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
