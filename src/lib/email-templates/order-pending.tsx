import * as React from 'react'
import { Body, Head, Html, Preview, Section, Text, Button, Link } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

type Method = 'bank' | 'card' | 'crypto' | 'peptidepay'

interface CryptoDetails {
  currency: string
  label: string
  network: string
  walletAddress: string
  amountCrypto: number
  amountCryptoFormatted: string
  unit: string
  paymentUri: string
  expiresAt: string
}

interface Props {
  customerName?: string
  orderNumber?: string
  totalEur?: number
  paymentMethod?: Method
  paymentLink?: string | null
  crypto?: CryptoDetails | null
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
      "Merci pour votre commande. Votre lien de paiement sécurisé est prêt ci-dessous.",
    box: "Cliquez sur le bouton pour régler votre commande en ligne par carte bancaire. ⏱ Après le paiement, la confirmation définitive peut prendre 5 à 10 minutes (délai bancaire) — vous recevrez un second email dès validation. Inutile de repayer.",
  },
  crypto: {
    title: 'Commande reçue — paiement crypto',
    intro:
      "Merci pour votre commande. Les instructions de paiement crypto sont ci-dessous.",
    box: "Envoyez le montant exact indiqué à l'adresse fournie. Le paiement est validé automatiquement dès réception on-chain (1 à 10 min selon le réseau).",
  },
  peptidepay: {
    title: 'Commande reçue — paiement en ligne',
    intro:
      "Merci pour votre commande. Votre lien de paiement sécurisé est prêt ci-dessous.",
    box: "Cliquez sur le bouton pour régler votre commande par carte, Apple Pay ou Google Pay.",
  },
}

const Email = ({ customerName, orderNumber, totalEur, paymentMethod, paymentLink, crypto, items }: Props) => {
  const method: Method = paymentMethod ?? 'bank'
  const c = COPY[method]
  return (
    <Html lang="fr">
      <Head />
      <Preview>Commande {orderNumber ?? ''} — instructions de paiement</Preview>
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

          {(method === 'peptidepay' || method === 'card') && paymentLink ? (
            <Section style={{ textAlign: 'center', margin: '18px 0 22px' }}>
              <Button
                href={paymentLink}
                style={{
                  background: brand.ink,
                  color: '#ffffff',
                  padding: '14px 26px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Payer maintenant
              </Button>
              <Text style={{ ...styles.text, fontSize: '12px', margin: '10px 0 0', color: brand.muted }}>
                Ou copiez ce lien :{' '}
                <Link href={paymentLink} style={{ color: brand.ink, wordBreak: 'break-all' }}>
                  {paymentLink}
                </Link>
              </Text>
            </Section>
          ) : null}

          {method === 'crypto' && crypto ? (
            <Section
              style={{
                background: brand.surface,
                border: `1px solid ${brand.border}`,
                borderRadius: '10px',
                padding: '16px 18px',
                margin: '12px 0 18px',
              }}
            >
              <Text style={{ ...styles.text, margin: '0 0 8px', fontWeight: 600, color: brand.ink }}>
                Paiement en {crypto.label} · réseau {crypto.network}
              </Text>
              <Text style={{ ...styles.text, margin: '4px 0' }}>
                Montant exact à envoyer :{' '}
                <strong style={{ color: brand.ink }}>
                  {crypto.amountCryptoFormatted} {crypto.unit}
                </strong>{' '}
                (≈ {(totalEur ?? 0).toFixed(2)} €)
              </Text>
              <Text style={{ ...styles.text, margin: '4px 0' }}>Adresse de réception :</Text>
              <Text
                style={{
                  ...styles.text,
                  margin: '4px 0 8px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  wordBreak: 'break-all',
                  color: brand.ink,
                }}
              >
                {crypto.walletAddress}
              </Text>
              <Text style={{ ...styles.text, fontSize: '12px', color: brand.muted, margin: '4px 0 0' }}>
                Important : envoyez uniquement du {crypto.unit} sur le réseau {crypto.network}. Tout autre envoi
                serait perdu. Le montant doit être exact — c'est ainsi que nous identifions votre paiement.
              </Text>
            </Section>
          ) : null}

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
    `Commande ${d.orderNumber ?? ''} — instructions de paiement`.trim(),
  displayName: 'Commande reçue (avec instructions de paiement)',
  previewData: {
    customerName: 'Jean Dupont',
    orderNumber: 'CMD-2026-0001',
    totalEur: 95.9,
    paymentMethod: 'peptidepay',
    paymentLink: 'https://pay.example.com/session/abc123',
    items: [{ name: 'Retatrutide 10 mg', quantity: 1, price_eur: 80 }],
  },
} satisfies TemplateEntry
