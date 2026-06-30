import * as React from 'react'
import { Body, Head, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

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
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Commande confirmée</Text>
        <Text style={styles.text}>
          {customerName ? `Bonjour ${customerName},` : 'Bonjour,'}
        </Text>
        <Text style={styles.text}>
          Nous avons bien reçu votre commande{' '}
          <strong style={{ color: brand.ink }}>{orderNumber ?? ''}</strong>.
          Vous recevrez un nouvel email dès l'expédition.
        </Text>
        <hr style={styles.hr} />
        {(items ?? []).map((it, i) => (
          <Text key={i} style={{ ...styles.text, margin: '4px 0' }}>
            {it.quantity} × {it.name} —{' '}
            <strong style={{ color: brand.ink }}>{it.price_eur.toFixed(2)} €</strong>
          </Text>
        ))}
        <hr style={styles.hr} />
        <Text style={{ ...styles.text, fontSize: '16px', color: brand.ink }}>
          Total : <strong>{(totalEur ?? 0).toFixed(2)} €</strong>
        </Text>
      </BrandLayout>
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
