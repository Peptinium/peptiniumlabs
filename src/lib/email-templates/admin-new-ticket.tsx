import * as React from 'react'
import { Body, Button, Head, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

interface Props {
  ticketNumber?: string
  subject?: string
  email?: string
  body?: string
  orderNumber?: string | null
  adminUrl?: string
}

const Email = ({ ticketNumber, subject, email, body, orderNumber, adminUrl }: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Nouveau message SAV {ticketNumber ?? ''} — {subject ?? ''}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Nouveau message SAV</Text>
        <Text style={styles.text}>
          Référence :{' '}
          <strong style={{ color: brand.ink }}>{ticketNumber ?? ''}</strong>
        </Text>
        <Text style={{ ...styles.text, margin: '0 0 8px' }}>
          De : <strong style={{ color: brand.ink }}>{email ?? ''}</strong>
        </Text>
        {orderNumber ? (
          <Text style={{ ...styles.text, margin: '0 0 8px' }}>
            Commande liée : <strong style={{ color: brand.ink }}>{orderNumber}</strong>
          </Text>
        ) : null}
        <Text style={{ ...styles.text, margin: '0 0 16px' }}>
          Sujet : <strong style={{ color: brand.ink }}>{subject ?? ''}</strong>
        </Text>

        <hr style={styles.hr} />
        <Text style={{ ...styles.text, whiteSpace: 'pre-wrap' }}>{body ?? ''}</Text>
        <hr style={styles.hr} />

        {adminUrl && (
          <Section style={styles.buttonWrap}>
            <Button href={adminUrl} style={styles.button}>
              Répondre dans l'admin
            </Button>
          </Section>
        )}
      </BrandLayout>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `📨 Nouveau message SAV ${d.ticketNumber ?? ''} — ${d.subject ?? ''}`,
  displayName: 'Notification admin — nouveau ticket SAV',
  previewData: {
    ticketNumber: 'SAV-2026-0001',
    subject: 'Question sur ma commande',
    email: 'client@example.com',
    body: 'Bonjour, je souhaite savoir où en est ma commande.',
    orderNumber: 'PEP-2026-0001',
    adminUrl: 'https://peptinium.com/admin/sav',
  },
} satisfies TemplateEntry
