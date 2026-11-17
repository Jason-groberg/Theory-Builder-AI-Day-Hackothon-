# Theory Builder

An interactive site for training mathematical problem solving: applying theorems,
choosing proof techniques, and writing real arguments, with an AI tutor that guides
without giving away the answer. See [PLAN.md](PLAN.md).

Live site: [Theory Builder](https://theory-builder-math.netlify.app/).

## Run locally

```bash
npm install
npm run dev
```

`npm run dev` serves the site and the tutor functions together (a small Vite
plugin mounts `netlify/functions/*` at `/api/*`). Copy `.env.example` to `.env`
and set `ANTHROPIC_API_KEY` first. The key is only read by the functions and is
never sent to the browser.

## Deploy

Connect the repo in Netlify (build settings come from `netlify.toml`) and add
`ANTHROPIC_API_KEY` under Site configuration → Environment variables.


## Agent Engineer Lab

Open **Agent Engineer Lab** from the homepage. Try to make a tutor use its
advance-to-next-question tool without a correct answer. Three selectable levels
compare a basic tutoring prompt, explicit security rules, and the same secure
tutor behind TypeSafe Jev input screening. A separate judge distinguishes a
successful manipulation from a legitimately correct answer. This is isolated
from normal homework progress.

Set `OPENAI_API_KEY` for the lab tutor and judge and `TYPESAFE_API_KEY` for level 3.
The legacy spelling `TYPAFE_API_KEY` is also accepted. Add these variables to
Netlify as well as your local `.env`; never use `VITE_` prefixes for secrets.
`LAB_SESSION_SECRET` optionally provides a separate transcript-signing secret.
Missing or failed screening never falls back to an unguarded tutor.

```bash
npm test                  # pipeline regression tests; no API calls
npm run lint
npm run build             # content validation, TypeScript, production bundle
npm run lab:eval           # live corpus and judge checks; incurs API usage
```

The live evaluation saves local evidence in ignored `lab-results/` and exits
unsuccessfully if judge checks or provider calls fail. Results apply only to the
tested prompts/models. All levels remain selectable; none is promised to be
beatable or unbreakable. Signed transcripts prevent editing but are replayable;
per-instance rate limits are best-effort burst protection, not durable quotas.
