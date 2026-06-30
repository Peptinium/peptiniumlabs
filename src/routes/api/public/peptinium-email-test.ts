import { createFileRoute } from '@tanstack/react-router'
import { sendAppEmail } from '@/lib/email/send.server'

const SECRET = 'pep-mail-test-7af3c91e2d'
const RECIPIENT = 'peptinium@gmail.com'

export const Route = createFileRoute('/api/public/peptinium-email-test')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        if (url.searchParams.get('key') !== SECRET) {
          return new Response('forbidden', { status: 403 })
        }
        const stamp = Date.now()
        const sends = [
          {
            templateName: 'order-confirmation',
            idempotencyKey: `test-oc-${stamp}`,
            templateData: {
              customerName: 'Peptinium',
              orderNumber: 'TEST-OC-001',
              totalEur: 149.9,
              items: [{ name: 'BPC-157 5mg', quantity: 2, price_eur: 74.95 }],
            },
          },
          {
            templateName: 'payment-link',
            idempotencyKey: `test-pl-${stamp}`,
            templateData: {
              customerName: 'Peptinium',
              orderNumber: 'TEST-PL-001',
              totalEur: 189,
              paymentLink: 'https://checkout.revolut.com/pay/example',
              items: [{ name: 'Retatrutide 10mg', quantity: 1, price_eur: 189 }],
            },
          },
          {
            templateName: 'crypto-payment',
            idempotencyKey: `test-cp-${stamp}`,
            templateData: {
              customerName: 'Peptinium',
              orderNumber: 'TEST-CP-001',
              totalEur: 189,
              currencyName: 'Bitcoin',
              currencyCode: 'BTC',
              network: 'Bitcoin (BTC)',
              address: 'bc1qexampleexampleexampleexampleexampleex',
            },
          },
          {
            templateName: 'order-shipped',
            idempotencyKey: `test-os-${stamp}`,
            templateData: {
              customerName: 'Peptinium',
              orderNumber: 'TEST-OS-001',
              carrier: 'Colissimo',
              trackingNumber: '6A12345678901',
              trackingUrl:
                'https://www.laposte.fr/outils/suivre-vos-envois?code=6A12345678901',
            },
          },
          {
            templateName: 'support-reply',
            idempotencyKey: `test-sr-${stamp}`,
            templateData: {
              subject: 'Test mise en page Peptinium',
              body: 'Bonjour, ceci est un test de la nouvelle mise en page Peptinium pour les emails SAV.',
              ticketRef: 'SAV-TEST-001',
            },
          },
        ]
        const results: Array<{ t: string; ok: boolean; error?: string }> = []
        for (const s of sends) {
          const r = await sendAppEmail({
            templateName: s.templateName,
            recipientEmail: RECIPIENT,
            idempotencyKey: s.idempotencyKey,
            templateData: s.templateData,
            request,
          })
          results.push({ t: s.templateName, ok: r.ok, error: r.error })
        }
        return Response.json({ recipient: RECIPIENT, results })
      },
    },
  },
})
