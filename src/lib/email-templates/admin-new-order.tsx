import * as React from 'react'
import { Body, Button, Head, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

interface Props {
  orderNumber?: string
  customerName?: string
  email?: string
  totalEur?: number
  paymentMethod?: 'bank' | 'card' | 'crypto' | 'peptidepay'
  adminUrl?: string
  items?: Array<{ name: string; quantity: number; price_eur: number }>
}

const METHOD_LABEL: Record<string, string> = {
  bank: 'Virement bancaire',
  card: 'Carte bancaire (lien à envoyer)',
  crypto: 'Crypto (adresse à envoyer)',
  peptidepay: 'PeptidePay (hébergé — automatique)',
}

const Email = ({
  orderNumber,
  customerName,
  email,
  totalEur,
  paymentMethod,
  adminUrl,
  items,
}: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Commande payée {orderNumber ?? ''} — {(totalEur ?? 0).toFixed(2)} €</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Commande payée à expédier</Text>
        <Text style={styles.text}>
          Référence :{' '}
          <strong style={{ color: brand.ink }}>{orderNumber ?? ''}</strong>
        </Text>
        <Text style={{ ...styles.text, margin: '0 0 8px' }}>
          Client : <strong style={{ color: brand.ink }}>{customerName ?? ''}</strong>
          {email ? ` — ${email}` : ''}
        </Text>
        <Text style={{ ...styles.text, margin: '0 0 16px' }}>
          Mode de paiement :{' '}
          <strong style={{ color: brand.ink }}>
            {METHOD_LABEL[paymentMethod ?? 'bank']}
          </strong>
        </Text>

        {adminUrl && (
          <Section style={styles.buttonWrap}>
            <Button href={adminUrl} style={styles.button}>
              Ouvrir dans l'admin
            </Button>
          </Section>
        )}

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
    `✅ Commande payée ${d.orderNumber ?? ''} — ${Number(d.totalEur ?? 0).toFixed(2)} €`,
  displayName: 'Notification admin — nouvelle commande',
  previewData: {
    orderNumber: 'CMD-2026-0001',
    customerName: 'Jean Dupont',
    email: 'jean@example.com',
    totalEur: 189,
    paymentMethod: 'bank',
    adminUrl: 'https://peptinium.com/admin',
    items: [{ name: 'BPC-157 5mg', quantity: 2, price_eur: 89.5 }],
  },
} satisfies TemplateEntry
