// Server-only helper: enqueue a transactional email via the internal send route.
// Pass a user bearer token when called from a server function — the send route
// validates it via supabase.auth.getUser(). Never import this from client code.

export async function sendAppEmail(opts: {
  templateName: string
  recipientEmail: string
  idempotencyKey: string
  templateData?: Record<string, unknown>
  request?: Request
  bearerToken?: string
}) {
  const bearer = opts.bearerToken || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!bearer) {
    console.error('sendAppEmail: no bearer token available')
    return { ok: false, error: 'config' }
  }
  const origin =
    (opts.request && new URL(opts.request.url).origin) ||
    process.env.SITE_URL ||
    process.env.VITE_SITE_URL ||
    ''
  try {
    const res = await fetch(`${origin}/lovable/email/transactional/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearer}`,
      },
      body: JSON.stringify({
        templateName: opts.templateName,
        recipientEmail: opts.recipientEmail,
        idempotencyKey: opts.idempotencyKey,
        templateData: opts.templateData ?? {},
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('sendAppEmail failed', { status: res.status, text })
      return { ok: false, error: `http_${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    console.error('sendAppEmail exception', err)
    return { ok: false, error: 'exception' }
  }
}
