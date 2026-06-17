import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  subject?: string
  body?: string
  ticketRef?: string
}

const Email = ({ subject, body, ticketRef }: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Réponse à votre demande SAV</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>AETHERION LABS — Support</Text>
        <Heading style={h1}>{subject ?? 'Réponse à votre demande'}</Heading>
        <Text style={text}>Bonjour,</Text>
        <Text style={text}>
          Notre équipe vient de répondre à votre ticket
          {ticketRef ? ` (réf. ${ticketRef})` : ''} :
        </Text>
        <Hr style={hr} />
        <Text style={message}>{body ?? ''}</Text>
        <Hr style={hr} />
        <Text style={text}>
          Vous pouvez répondre à cet email pour poursuivre la conversation.
        </Text>
        <Text style={footer}>Aetherion Labs — support@aetherion-lab.com</Text>
      </Container>
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

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const brand = { fontSize: '11px', letterSpacing: '0.22em', color: '#888', marginBottom: '24px' }
const h1 = { fontSize: '20px', fontWeight: 500 as const, color: '#111', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '1.6' }
const message = { fontSize: '14px', color: '#222', lineHeight: '1.7', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#eee', margin: '20px 0' }
const footer = { fontSize: '11px', color: '#999', marginTop: '32px' }
