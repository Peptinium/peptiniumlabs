// Server-only direct enqueue (bypasses /lovable/email/transactional/send
// which requires a user JWT). Use for unauthenticated flows such as the
// public `placeOrder` server function and for admin notifications sent
// without a user session.

import * as React from 'react'
import { render } from '@react-email/components'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Peptinium'
const SENDER_DOMAIN = 'notify.peptinium.com'
const FROM_DOMAIN = 'peptinium.com'

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
  const tpl = TEMPLATES[opts.templateName]
  if (!tpl) throw new Error(`Unknown template: ${opts.templateName}`)

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const normalizedEmail = (tpl.to ?? opts.recipientEmail).toLowerCase()
  const messageId = opts.idempotencyKey

  const { data: suppressed } = await supabaseAdmin
    .from('suppressed_emails')
    .select('email')
    .eq('email', normalizedEmail)
    .maybeSingle()
  if (suppressed) {
    await supabaseAdmin.from('email_send_log').insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: normalizedEmail,
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
    .eq('email', normalizedEmail)
    .maybeSingle()
  let unsubToken = existingTok?.token
  if (!unsubToken) {
    unsubToken = generateToken()
    await supabaseAdmin
      .from('email_unsubscribe_tokens')
      .insert({ email: normalizedEmail, token: unsubToken })
  }

  await supabaseAdmin.from('email_send_log').insert({
    message_id: messageId,
    template_name: opts.templateName,
    recipient_email: normalizedEmail,
    status: 'pending',
  })

  const { error } = await supabaseAdmin.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: normalizedEmail,
      from: `${SITE_NAME} <commandes@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text: plainText,
      purpose: 'transactional',
      label: opts.templateName,
      idempotency_key: messageId,
      unsubscribe_token: unsubToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (error) {
    await supabaseAdmin.from('email_send_log').insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: normalizedEmail,
      status: 'failed',
      error_message: error.message,
    })
    throw new Error(`Enqueue failed: ${error.message}`)
  }
  return { queued: true as const }
}
