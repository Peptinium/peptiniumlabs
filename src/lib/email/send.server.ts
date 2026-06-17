// Server-only helper: enqueue a transactional email via the internal send route.
// Uses the service-role key so it can be called from privileged server functions
// (no user JWT needed). Never import this from client code.

export async function sendAppEmail(opts: {
  templateName: string
  recipientEmail: string
  idempotencyKey: string
  templateData?: Record<string, unknown>
  request?: Request
}) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('sendAppEmail: SUPABASE_SERVICE_ROLE_KEY missing')
    return { ok: false, error: 'config' }
  }
  // Resolve same-origin URL from the incoming request when available, otherwise
  // fall back to the env-provided site URL.
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
        Authorization: `Bearer ${serviceKey}`,
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
