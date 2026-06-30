import * as React from 'react'
import { Body, Head, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

type Method = 'bank' | 'card' | 'crypto'

interface Props {
  customerName?: string
  orderNumber?: string
  totalEur?: number
  paymentMethod?: Method
  items?: Array<{ name: string; quantity: number; price_eur: number }>
}

const COPY: Record<Method, { title: string; intro: string; box: string }> = {
  bank: {
    title: 'Commande reçue — virement bancaire',
    intro:
      "Merci pour votre commande. Vous recevrez sous 24 h ouvrées un email avec les coordonnées bancaires (IBAN / BIC) pour effectuer votre virement.",
    box: "Notre équipe valide manuellement chaque commande avant l'envoi des coordonnées. Pas d'inquiétude si vous ne recevez pas l'email immédiatement.",
  },
  card: {
    title: 'Commande reçue — paiement par carte',
    intro:
      "Merci pour votre commande. Vous recevrez sous 24 h ouvrées un lien de paiement sécurisé (Revolut / Stripe) pour régler par carte bancaire.",
    box: "Notre équipe prépare votre lien de paiement personnalisé. Aucune action de votre part pour l'instant — surveillez simplement votre boîte mail.",
  },
  crypto: {
    title: 'Commande reçue — paiement crypto',
    intro:
      "Merci pour votre commande. Vous recevrez sous 24 h ouvrées un email avec l'adresse Bitcoin unique de réception pour régler votre commande.",
    box: "Notre équipe vous transmet une adresse BTC dédiée à votre commande. Vous pourrez ensuite payer depuis votre wallet préféré.",
  },
}

const Email = ({ customerName, orderNumber, totalEur, paymentMethod, items }: Props) => {
  const method: Method = paymentMethod ?? 'bank'
  const c = COPY[method]
  return (
    <Html lang="fr">
      <Head />
      <Preview>Commande {orderNumber ?? ''} bien reçue — instructions sous 24 h</Preview>
      <Body style={styles.main}>
        <BrandLayout>
          <Text style={styles.h1}>{c.title}</Text>
          <Text style={styles.text}>
            {customerName ? `Bonjour ${customerName},` : 'Bonjour,'}
          </Text>
          <Text style={styles.text}>{c.intro}</Text>

          <Section
            style={{
              background: brand.surface,
              border: `1px solid ${brand.border}`,
              borderRadius: '10px',
              padding: '16px 18px',
              margin: '12px 0 18px',
            }}
          >
            <Text style={{ ...styles.text, margin: 0 }}>{c.box}</Text>
          </Section>

          <Text style={{ ...styles.text, margin: '0 0 6px' }}>
            Référence :{' '}
            <strong style={{ color: brand.ink }}>{orderNumber ?? ''}</strong>
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
}

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Commande ${d.orderNumber ?? ''} reçue — instructions de paiement sous 24 h`.trim(),
  displayName: 'Commande reçue (en attente de paiement)',
  previewData: {
    customerName: 'Jean Dupont',
    orderNumber: 'CMD-2026-0001',
    totalEur: 189,
    paymentMethod: 'bank',
    items: [{ name: 'BPC-157 5mg', quantity: 2, price_eur: 89.5 }],
  },
} satisfies TemplateEntry
