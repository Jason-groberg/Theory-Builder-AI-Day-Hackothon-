import { lazy, Suspense, useEffect, useState } from 'react'
import { getProblem } from './content/problems/index.ts'
import { useHashRoute } from './lib/useHashRoute.ts'
import Home from './pages/Home.tsx'

// The workspace pulls in the math editor, so it loads only when a problem opens.
const ProblemPage = lazy(() => import('./pages/ProblemPage.tsx'))

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
  const route = useHashRoute()
  const problem = route.startsWith('p/') ? getProblem(route.slice(2)) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  return (
    <div className="page">
      <header className="top">
        <a className="brand" href="#/">
          Theory Builder
        </a>
        <span className={`status status-${status}`}>{statusText[status]}</span>
      </header>

      {problem ? (
        <Suspense fallback={<p className="note loading">Loading workspace…</p>}>
          <ProblemPage key={problem.id} problem={problem} />
        </Suspense>
      ) : (
        <Home />
      )}
    </div>
  )
}
