import * as React from 'react'
import { Body, Head, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

interface Props {
  customerName?: string
  orderNumber?: string
  totalEur?: number
  shippingAddress?: string
  items?: Array<{ name: string; quantity: number; price_eur: number }>
}

const Email = ({ customerName, orderNumber, totalEur, shippingAddress, items }: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Paiement confirmé — Commande {orderNumber ?? ''}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Paiement bien reçu — merci !</Text>
        <Text style={styles.text}>
          {customerName ? `Bonjour ${customerName},` : 'Bonjour,'}
        </Text>
        <Text style={styles.text}>
          Nous avons bien reçu votre règlement pour la commande{' '}
          <strong style={{ color: brand.ink }}>{orderNumber ?? ''}</strong>.
          Nous préparons votre colis et vous enverrons le numéro de suivi dès l'expédition.
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
          Total payé : <strong>{(totalEur ?? 0).toFixed(2)} €</strong>
        </Text>

        {shippingAddress && (
          <>
            <Text style={{ ...styles.text, marginTop: '16px', marginBottom: '4px' }}>
              <strong style={{ color: brand.ink }}>Livraison à :</strong>
            </Text>
            <Text style={{ ...styles.text, whiteSpace: 'pre-line', margin: '4px 0' }}>
              {shippingAddress}
            </Text>
          </>
        )}
      </BrandLayout>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Paiement confirmé — Commande ${d.orderNumber ?? ''}`.trim(),
  displayName: 'Paiement confirmé',
  previewData: {
    customerName: 'Jean Dupont',
    orderNumber: 'PEP-20260630-12345',
    totalEur: 189.0,
    shippingAddress: '12 rue Lafayette\n75009 Paris\nFrance',
    items: [{ name: 'BPC-157 5mg', quantity: 2, price_eur: 89.5 }],
  },
} satisfies TemplateEntry
