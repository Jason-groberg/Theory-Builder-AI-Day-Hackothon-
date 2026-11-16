// Reports whether the tutor backend is reachable and has its API key.
// Never returns the key itself.
export default async () =>
  Response.json({
    ok: true,
    tutorConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
  })
