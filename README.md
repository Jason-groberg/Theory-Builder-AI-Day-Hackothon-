# Theory Builder

An interactive site for training mathematical problem solving: applying theorems,
choosing proof techniques, and writing real arguments, with an AI tutor that guides
without giving away the answer. See [PLAN.md](PLAN.md).

## Run locally

```bash
npm install
npm run dev            # UI only
npx netlify-cli dev    # UI + serverless functions (tutor)
```

Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`. The key is only read by
the Netlify functions and is never sent to the browser.

## Deploy

Connect the repo in Netlify (build settings come from `netlify.toml`) and add
`ANTHROPIC_API_KEY` under Site configuration → Environment variables.
