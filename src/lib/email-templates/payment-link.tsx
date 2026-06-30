import * as React from 'react'
import { Body, Button, Head, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

interface Props {
  customerName?: string
  orderNumber?: string
  totalEur?: number
  paymentLink?: string
  items?: Array<{ name: string; quantity: number; price_eur: number }>
}

const Email = ({ customerName, orderNumber, totalEur, paymentLink, items }: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Votre lien de paiement — Commande {orderNumber ?? ''}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Votre lien de paiement est prêt</Text>
        <Text style={styles.text}>
          {customerName ? `Bonjour ${customerName},` : 'Bonjour,'}
        </Text>
        <Text style={styles.text}>
          Voici le lien sécurisé pour régler votre commande{' '}
          <strong style={{ color: brand.ink }}>{orderNumber ?? ''}</strong> par
          carte bancaire. Dès réception de votre règlement, nous préparons
          l'expédition de votre colis.
        </Text>

        {paymentLink && (
          <Section style={styles.buttonWrap}>
            <Button href={paymentLink} style={styles.button}>
              Régler ma commande
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
          Total à régler : <strong>{(totalEur ?? 0).toFixed(2)} €</strong>
        </Text>

        <Text style={{ ...styles.text, fontSize: '12px', marginTop: '16px' }}>
          Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
        </Text>
        {paymentLink && (
          <Text style={styles.fallbackLink}>{paymentLink}</Text>
        )}
      </BrandLayout>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Votre lien de paiement — Commande ${d.orderNumber ?? ''}`.trim(),
  displayName: 'Lien de paiement CB',
  previewData: {
    customerName: 'Jean Dupont',
    orderNumber: 'AE-20260630-12345',
    totalEur: 189.0,
    paymentLink: 'https://checkout.revolut.com/pay/example',
    items: [{ name: 'BPC-157 5mg', quantity: 2, price_eur: 89.5 }],
  },
} satisfies TemplateEntry
