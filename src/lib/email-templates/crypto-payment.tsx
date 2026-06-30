import * as React from 'react'
import { Body, Head, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

interface Props {
  customerName?: string
  orderNumber?: string
  totalEur?: number
  currencyName?: string
  currencyCode?: string
  network?: string
  address?: string
}

const Email = ({
  customerName,
  orderNumber,
  totalEur,
  currencyName,
  currencyCode,
  network,
  address,
}: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Paiement en {currencyName ?? 'crypto'} — Commande {orderNumber ?? ''}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Paiement en {currencyName ?? 'crypto'}</Text>
        <Text style={styles.text}>
          {customerName ? `Bonjour ${customerName},` : 'Bonjour,'}
        </Text>
        <Text style={styles.text}>
          Voici l'adresse de réception pour régler votre commande{' '}
          <strong style={{ color: brand.ink }}>{orderNumber ?? ''}</strong>.
          Dès confirmation on-chain de votre transaction, nous préparons l'expédition.
        </Text>

        <hr style={styles.hr} />

        <Text style={{ ...styles.text, margin: '4px 0' }}>
          Réseau : <strong style={{ color: brand.ink }}>{network ?? ''}</strong>
        </Text>
        <Text style={{ ...styles.text, margin: '4px 0' }}>
          Devise : <strong style={{ color: brand.ink }}>{currencyCode ?? 'BTC'}</strong>
        </Text>
        <Text style={{ ...styles.text, fontSize: '16px', color: brand.ink, margin: '8px 0' }}>
          Montant : <strong>{(totalEur ?? 0).toFixed(2)} €</strong> (équivalent à convertir au taux du marché)
        </Text>

        <Text style={{ ...styles.text, marginTop: '16px', marginBottom: '6px' }}>
          Adresse de réception :
        </Text>
        <Text
          style={{
            ...styles.fallbackLink,
            color: brand.ink,
            background: brand.surface,
            border: `1px solid ${brand.border}`,
            borderRadius: '10px',
            padding: '14px 16px',
            fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          }}
        >
          {address ?? ''}
        </Text>

        <Text style={{ ...styles.text, fontSize: '12px', marginTop: '16px' }}>
          ⚠ Envoyez uniquement du {currencyCode ?? 'BTC'} sur le réseau {network ?? ''}.
          Tout envoi sur un autre réseau entraînera la perte des fonds.
        </Text>
      </BrandLayout>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Paiement crypto — Commande ${d.orderNumber ?? ''}`.trim(),
  displayName: 'Adresse de paiement crypto',
  previewData: {
    customerName: 'Jean Dupont',
    orderNumber: 'AE-20260630-12345',
    totalEur: 189.0,
    currencyName: 'Bitcoin',
    currencyCode: 'BTC',
    network: 'Bitcoin (BTC)',
    address: 'bc1qexampleexampleexampleexampleexampleex',
  },
} satisfies TemplateEntry
