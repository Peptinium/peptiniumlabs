import * as React from 'react'
import { Body, Head, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

interface Props {
  subject?: string
  body?: string
  ticketRef?: string
}

const Email = ({ subject, body, ticketRef }: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Réponse à votre demande SAV</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>{subject ?? 'Réponse à votre demande'}</Text>
        <Text style={styles.text}>Bonjour,</Text>
        <Text style={styles.text}>
          Notre équipe vient de répondre à votre ticket
          {ticketRef ? (
            <> (réf. <strong style={{ color: brand.ink }}>{ticketRef}</strong>)</>
          ) : null}{' '}
          :
        </Text>
        <hr style={styles.hr} />
        <Text
          style={{
            ...styles.text,
            color: brand.ink,
            whiteSpace: 'pre-wrap' as const,
          }}
        >
          {body ?? ''}
        </Text>
        <hr style={styles.hr} />
        <Text style={styles.text}>
          Vous pouvez répondre à cet email pour poursuivre la conversation.
        </Text>
      </BrandLayout>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    d.subject ? `Re: ${d.subject}` : 'Réponse à votre demande SAV',
  displayName: 'Réponse SAV',
  previewData: {
    subject: 'Problème de livraison',
    body: 'Bonjour, nous avons relancé le transporteur ce matin…',
    ticketRef: 'SAV-0042',
  },
} satisfies TemplateEntry
