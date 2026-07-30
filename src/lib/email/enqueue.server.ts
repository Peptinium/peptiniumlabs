// Server-only direct enqueue (bypasses /lovable/email/transactional/send
// which requires a user JWT). Use for unauthenticated flows such as the
// public `placeOrder` server function and for admin notifications sent
// without a user session.

import * as React from 'react'
import { render } from '@react-email/components'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Peptinium'
const FROM_DOMAIN = 'peptinium.com'

// Un seul email transactionnel actif : « paiement reçu » (order-paid).
// Tous les autres templates sont volontairement désactivés.
const ALLOWED_TEMPLATES = new Set(['order-paid', 'admin-new-order'])

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function enqueueAppEmail(opts: {
  templateName: string
  recipientEmail: string
  idempotencyKey: string
  templateData?: Record<string, unknown>
}) {
  // Emails désactivés sauf « paiement reçu » : on sort avant tout rendu/envoi.
  if (!ALLOWED_TEMPLATES.has(opts.templateName)) {
    return { skipped: true as const }
  }
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const messageId = opts.idempotencyKey
  const normalizedEmail = opts.recipientEmail.toLowerCase()

  // Write an initial "pending" log row immediately so any later failure
  // is visible in email_send_log (and we don't fail silently).
  await supabaseAdmin.from('email_send_log').insert({
    message_id: messageId,
    template_name: opts.templateName,
    recipient_email: normalizedEmail,
    status: 'pending',
  })

  const logFail = async (msg: string) => {
    await supabaseAdmin.from('email_send_log').insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: normalizedEmail,
      status: 'failed',
      error_message: msg.slice(0, 1000),
    })
  }

  try {
    const tpl = TEMPLATES[opts.templateName]
    if (!tpl) {
      await logFail(`Unknown template: ${opts.templateName}`)
      throw new Error(`Unknown template: ${opts.templateName}`)
    }
    const finalRecipient = (tpl.to ?? normalizedEmail).toLowerCase()

    const { data: suppressed } = await supabaseAdmin
      .from('suppressed_emails')
      .select('email')
      .eq('email', finalRecipient)
      .maybeSingle()
    if (suppressed) {
      await supabaseAdmin.from('email_send_log').insert({
        message_id: messageId,
        template_name: opts.templateName,
        recipient_email: finalRecipient,
        status: 'suppressed',
        error_message: 'Recipient on suppression list',
      })
      return { skipped: true as const }
    }

    const element = React.createElement(tpl.component, opts.templateData ?? {})
    const html = await render(element)
    const plainText = await render(element, { plainText: true })
    const subject =
      typeof tpl.subject === 'function' ? tpl.subject(opts.templateData ?? {}) : tpl.subject

    const { data: existingTok } = await supabaseAdmin
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', finalRecipient)
      .maybeSingle()
    let unsubToken = existingTok?.token
    if (!unsubToken) {
      unsubToken = generateToken()
      await supabaseAdmin
        .from('email_unsubscribe_tokens')
        .insert({ email: finalRecipient, token: unsubToken })
    }

    // Envoi direct via Resend (remplace l'ancienne file Lovable).
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (!RESEND_API_KEY) {
      await logFail('RESEND_API_KEY manquant')
      throw new Error('RESEND_API_KEY manquant')
    }
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${SITE_NAME} <commandes@${FROM_DOMAIN}>`,
        to: [finalRecipient],
        subject,
        html,
        text: plainText,
        headers: {
          'List-Unsubscribe': `<https://${FROM_DOMAIN}/unsubscribe?token=${unsubToken}>`,
        },
      }),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      await logFail(`Resend ${res.status}: ${t.slice(0, 300)}`)
      throw new Error(`Resend failed: ${res.status}`)
    }
    const sent = await res.json().catch(() => ({}) as any)
    await supabaseAdmin.from('email_send_log').insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: finalRecipient,
      status: 'sent',
      error_message: sent?.id ? `resend:${sent.id}` : null,
    })
    return { sent: true as const }
  } catch (err: any) {
    await logFail(err?.message ?? String(err))
    throw err
  }
}

