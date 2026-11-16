# Theory Builder — v1 Plan

An interactive site for training mathematical problem solving: applying theorems,
choosing proof techniques, and doing only the computation that carries an idea.
Not memorization, not arithmetic drills.

**v1 goal:** a polished, demo-ready preview on Netlify. No logins, no database,
no accounts. Everything serves the core loop below.

## Decisions (from kickoff Q&A)

| Topic | Decision |
|---|---|
| Hosting | Netlify (static site + serverless functions) |
| Scope | Preview of the core application only; no auth or user systems |
| Categories | Probability Theory / Data Science, Linear Algebra, Calculus, Geometry, Statistics, Number Theory |
| Problems | Hybrid: 5 curated seeds per category (30 total), ordered by increasing difficulty, plus AI-generated variants |
| Submission | Free-form work reviewed by the AI tutor |
| Math input | Visual equation editor (no LaTeX knowledge needed) |
| Solution reveal | Unlocks only after 3 *different* attempts |
| Tutor AI | Claude, via `ANTHROPIC_API_KEY` in the environment |
| Visual style | Brutalist: monospace type, heavy borders, hard shadows, no rounding |
| Extras | Interactive visualizations, progressive hint ladder, skill map, theory primers |

## The core loop

1. Pick a category, then a problem (level 1–5) or "generate a variant".
2. Optionally read the linked theory primer and play with the visualization.
3. Write a solution as a list of steps: prose plus visual math fields.
4. Submit. The tutor reviews the argument and responds with what holds, where the
   first gap is, and a guiding question. It never states the answer.
5. Ask the tutor questions or unlock the next hint (nudge → theorem → first step).
6. Solved, or after 3 distinct attempts the vetted solution unlocks.
7. The skill map updates by topic and by technique.

## Architecture

- **Frontend:** Vite + React + TypeScript single-page app.
  - MathLive for the visual equation editor, KaTeX for rendering problem text.
  - Mafs for interactive visualizations.
  - Progress, attempts, and hint usage in `localStorage`.
- **Backend:** Netlify Functions (TypeScript) as the only holder of the API key.
  - `tutor-chat` — streaming Socratic conversation about the current problem.
  - `review-attempt` — structured review of a submission (verdict, first gap,
    techniques demonstrated, whether it differs from prior attempts).
  - `generate-variant` — a new problem modeled on a seed, with solution and hints.
  - `reveal-solution` — returns the vetted solution once 3 distinct attempts exist.
- **Content:** problems as typed data files. Statements, hints, and primers ship to
  the browser; **solutions and rubrics live only in the functions bundle** so the
  answer is not sitting in the page source.

```
src/
  content/        problems (public part), primers, skill taxonomy
  components/     ProblemView, StepEditor, TutorPanel, HintLadder, SkillMap, viz/
  lib/            storage, api client, types
netlify/functions/
  _solutions/     vetted solutions + rubrics (server only)
  tutor-chat.ts  review-attempt.ts  generate-variant.ts  reveal-solution.ts
```

## Problem format

Each seed problem carries: id, category, level (1–5), topics, techniques
(e.g. induction, contradiction, conditioning, invariants, change of basis),
statement, 3-tier hint ladder, primer link, optional visualization id, and
server-side a full solution plus a review rubric (key ideas a correct argument
must contain, common wrong turns).

Problem style per category, to keep things idea-driven:

- **Probability / Data Science:** conditioning, linearity of expectation,
  indicator variables, Bayes reasoning, concentration intuition.
- **Linear Algebra:** rank/nullity arguments, eigen-structure, invariant
  subspaces, proofs about linear maps rather than row reduction.
- **Calculus:** MVT/IVT arguments, epsilon-style reasoning, convergence,
  choosing the right theorem rather than grinding integrals.
- **Geometry:** synthetic proofs, invariants, transformations, angle chasing.
- **Statistics:** estimator bias/variance, sufficiency intuition, test design,
  interpreting what a result does and does not show.
- **Number Theory:** modular arithmetic, divisibility arguments, infinite
  descent, pigeonhole, proofs about primes rather than long factorizations.

## Tutor design

- System prompt receives the problem, the vetted solution, and the rubric, with
  firm rules: guide with questions, name the *kind* of idea needed, point at the
  first flawed step, never state the final answer or a complete proof.
- Review returns structured JSON so the UI can show a verdict and update skills.
- Hint ladder is pre-written for seeds (reliable, free) and counted against mastery.
- "Different attempt" is judged by the reviewer: resubmitting the same text, or
  an empty/low-effort submission, does not count toward the 3.

## Hard parts and how v1 handles them

| Risk | Mitigation |
|---|---|
| AI mis-grades a valid but unusual proof | Rubric lists key ideas, not one path; verdicts are "correct / gap found / unsure", and "unsure" says so instead of guessing |
| Tutor leaks the answer under pressure | Rules in the system prompt, plus a second lightweight check on replies for seed problems that blocks any reply containing the final answer |
| AI-generated variants are wrong or unsolvable | Generate problem + full solution together, run an independent verification pass, discard failures, label variants "AI-generated" |
| Long proofs are awkward in a visual equation editor | Step-list editor: each step is a prose box with an insertable math field, rather than one giant math field |
| Attempt gating without accounts | Tracked in the browser; a determined user can bypass it. Acceptable for a preview |
| API cost on a public URL | Per-IP rate limit in the functions, capped output tokens, mid-tier model for chat |

## Build order

1. **Scaffold** — Vite app, Netlify config, `.env` ignored, deploy a hello page.
2. **Content** — schema, then 30 seed problems with hints, solutions, rubrics; 5 primers per category as needed.
3. **Problem workspace** — category picker, problem view, step editor with MathLive.
4. **Tutor** — chat + attempt review functions, streaming UI, 3-attempt reveal.
5. **Hint ladder + skill map** — localStorage progress, mastery by topic/technique.
6. **Visualizations** — one or two strong widgets per category (linear map on the plane, distribution sampler, secant→tangent, a draggable geometric construction, sampling-distribution simulator).
7. **AI variants** — generate, verify, attach to a seed.
8. **Polish + deploy** — empty/error states, mobile check, Netlify env var, rate limit.

Steps 1–5 are the demo; 6–7 are layered on in that order if time allows.

## Not in v1

Accounts, saved history across devices, leaderboards, teacher dashboards,
handwriting/photo input, formal proof checking.
