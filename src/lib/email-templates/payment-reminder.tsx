import * as React from 'react'
import { Body, Button, Head, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

interface Props {
  customerName?: string
  orderNumber?: string
  totalEur?: number
  paymentLink?: string
}

const Email = ({ customerName, orderNumber, totalEur, paymentLink }: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Finalisez votre commande {orderNumber ?? ''} — le lien est encore actif</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Votre paiement n'a pas été finalisé</Text>
        <Text style={styles.text}>
          {customerName ? `Bonjour ${customerName},` : 'Bonjour,'}
        </Text>
        <Text style={styles.text}>
          Nous avons bien reçu votre commande{' '}
          <strong style={{ color: brand.ink }}>{orderNumber ?? ''}</strong> mais
          nous n'avons pas encore reçu votre paiement. Le lien sécurisé est
          toujours actif, vous pouvez le finaliser en un clic ci-dessous.
        </Text>

        {paymentLink && (
          <Section style={styles.buttonWrap}>
            <Button href={paymentLink} style={styles.button}>
              Terminer mon paiement
            </Button>
          </Section>
        )}

        <Text style={{ ...styles.text, fontSize: '13px', color: brand.muted }}>
          Montant à régler :{' '}
          <strong style={{ color: brand.ink }}>{(totalEur ?? 0).toFixed(2)} €</strong>
        </Text>

        <Text style={{ ...styles.text, fontSize: '12px', marginTop: '16px' }}>
          Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
        </Text>
        {paymentLink && (
          <Text style={styles.fallbackLink}>{paymentLink}</Text>
        )}

        <Text style={{ ...styles.text, fontSize: '12px', marginTop: '20px', color: brand.muted }}>
          Si vous avez déjà réglé, ignorez cet email — la confirmation peut
          prendre quelques minutes. Une question ? Répondez simplement à ce message.
        </Text>
      </BrandLayout>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Finalisez votre commande ${d.orderNumber ?? ''} — lien de paiement`.trim(),
  displayName: 'Relance paiement (commande en attente)',
  previewData: {
    customerName: 'Jean Dupont',
    orderNumber: 'PEP-20260705-12345',
    totalEur: 86.0,
    paymentLink: 'https://pay.qistdigital.com/session/cs_example',
  },
} satisfies TemplateEntry
