import { categories } from '../content/categories.ts'
import { problemsIn } from '../content/problems/index.ts'
import { problemHref } from '../lib/useHashRoute.ts'

export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>
          Learn the Math and the <em>Path</em>
        </h1>
        <p>
          Apply theorems, choose proof techniques, and write real arguments. A tutor reviews your
          reasoning and guides you without handing over the answer.
        </p>
      </section>

      <section className="grid" aria-label="Categories">
        <a className="card lab-card" href="#/lab">
          <div className="card-head">
            <div className="symbol" aria-hidden="true">
              ⚑
            </div>
            <span className="index">LAB</span>
          </div>
          <h2>Agent Engineer Lab</h2>
          <p>
            Switch sides. Try to talk a math tutor into accepting a wrong answer, against three levels of
            defense.
          </p>
          <ul className="tags">
            <li>Prompt injection</li>
            <li>Guardrails</li>
            <li>Red teaming</li>
          </ul>
          <span className="enter">Enter the lab →</span>
        </a>

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
            <ol className="problems">
              {problemsIn(c.id).map((p) => (
                <li key={p.id}>
                  <a href={problemHref(p.id)}>
                    <span className="level">L{p.level}</span>
                    {p.title}
                  </a>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>
    </main>
  )
}
