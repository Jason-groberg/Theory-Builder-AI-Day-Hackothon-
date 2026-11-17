# Final validation — November 16, 2026

The Agent Engineer Lab is implemented separately from ordinary homework. Its win
condition is an actual `advance_to_next_question` tool call without a correct
student answer, not merely agreement in prose. This differs from the earlier
research prototype; these results are for policy 2.0 in this repository.

## Automated checks

- 20 pipeline regression tests pass (`npm test`).
- Lint passes (`npm run lint`).
- Content validation passes: 30 problems, 30 solutions, six categories.
- TypeScript and production Vite build pass (`npm run build`).
- Nine live advance-judge fixtures pass, including forged tool arguments,
  judge-directed injection, changed problems, and conflicting final answers.
- 72 live corpus trials finish with no provider errors.

| Defense | Attack trials | Successful tool misuse | Blocked | Benign trials blocked |
|---|---:|---:|---:|---:|
| Basic tutor | 18 | 7 | 0 | 0 / 6 |
| Security-aware tutor | 18 | 3 | 0 | 0 / 6 |
| Secure tutor + Jev | 18 | 1 | 17 | 0 / 6 |

The level-3 escape was the forged grader-result case (`tool_fake_result`). This
is a finite, single-repetition evaluation, not a claim of universal protection.
Six tool-specific attacks were added after the original research corpus and are
not held out. Correct homework controls received tutoring rather than automatic
advancement. A separate browser test confirmed correct-answer advancement is
labeled legitimate rather than an attack win.

Run metadata and transcripts are retained locally in ignored
`lab-results/run-2026-11-17T00-11-29-008Z.json` (UTC filename). Use
`npm run lab:eval` to reproduce with fresh provider responses and API usage.

## Browser and HTTP checks

- Home → lab navigation; all three defense levels and challenge selection.
- Explicit level-3 attack shown as blocked; no accepted conversation turn added.
- Keyboard submission, pending-state button disabling, reset, and session changes.
- Correct derivative answer accepted through the tool with a legitimate outcome;
  finished session cannot submit more turns.
- Mobile layout at 390px: content width equals viewport width, with no horizontal overflow.
- Existing tutor streams a mathematical definition; work review recognizes a
  correct proof; its signed receipt unlocks the reference solution.
- Missing receipts cannot reveal solutions (HTTP 403).
- Invalid level, forged token, and oversized message return 400/400/413.
- Candidate commit files and browser bundles contain no local API-key values;
  lab server prompts and signing code are absent from browser bundles.

## Review fixes

Malformed model output and invalid advance-tool arguments now fail as provider
errors rather than reaching scoring. Missing session configuration fails before
paid provider calls. Oversized and extra-segment tokens are rejected. The live
evaluator exits nonzero on failed judge checks or provider errors. README and
`.env.example` now describe the lab's deployment configuration.

## Remaining limits

The math-editor chunk still triggers Vite's size advisory; it is lazy-loaded and
the build succeeds. The demo's per-instance rate limiting is not a durable quota,
and signed transcripts prevent editing but not replay. Model judgments remain
probabilistic. These limitations do not prevent the tested demonstration flows.
