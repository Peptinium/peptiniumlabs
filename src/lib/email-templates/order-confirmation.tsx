import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  customerName?: string
  orderNumber?: string
  totalEur?: number
  items?: Array<{ name: string; quantity: number; price_eur: number }>
}

const Email = ({ customerName, orderNumber, totalEur, items }: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Confirmation de votre commande {orderNumber ?? ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>PEPTINIUM LABS</Text>
        <Heading style={h1}>Commande confirmée</Heading>
        <Text style={text}>
          {customerName ? `Bonjour ${customerName},` : 'Bonjour,'}
        </Text>
        <Text style={text}>
          Nous avons bien reçu votre commande <strong>{orderNumber ?? ''}</strong>.
          Vous recevrez un nouvel email dès l'expédition.
        </Text>
        <Hr style={hr} />
        <Section>
          {(items ?? []).map((it, i) => (
            <Text key={i} style={item}>
              {it.quantity} × {it.name} — {it.price_eur.toFixed(2)} €
            </Text>
          ))}
        </Section>
        <Hr style={hr} />
        <Text style={total}>
          Total : <strong>{(totalEur ?? 0).toFixed(2)} €</strong>
        </Text>
        <Text style={footer}>
          Peptinium Labs — Réactifs peptidiques de recherche.
          Réservé à un usage de laboratoire.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Confirmation de commande ${d.orderNumber ?? ''}`.trim(),
  displayName: 'Confirmation de commande',
  previewData: {
    customerName: 'Jean Dupont',
    orderNumber: 'CMD-2026-0001',
    totalEur: 149.9,
    items: [{ name: 'BPC-157 5mg', quantity: 2, price_eur: 74.95 }],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const brand = { fontSize: '11px', letterSpacing: '0.22em', color: '#888', marginBottom: '24px' }
const h1 = { fontSize: '22px', fontWeight: 500 as const, color: '#111', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '1.6' }
const item = { fontSize: '13px', color: '#444', margin: '4px 0' }
const total = { fontSize: '15px', color: '#111', marginTop: '12px' }
const hr = { borderColor: '#eee', margin: '20px 0' }
const footer = { fontSize: '11px', color: '#999', marginTop: '32px', lineHeight: '1.5' }
