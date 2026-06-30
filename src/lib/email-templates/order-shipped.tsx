import * as React from 'react'
import { Body, Button, Head, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BrandLayout, brand, styles } from './_brand'

interface Props {
  customerName?: string
  orderNumber?: string
  carrier?: string
  trackingNumber?: string
  trackingUrl?: string
}

const Email = ({ customerName, orderNumber, carrier, trackingNumber, trackingUrl }: Props) => (
  <Html lang="fr">
    <Head />
    <Preview>Votre commande {orderNumber ?? ''} a été expédiée</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Votre commande est en route</Text>
        <Text style={styles.text}>
          {customerName ? `Bonjour ${customerName},` : 'Bonjour,'}
        </Text>
        <Text style={styles.text}>
          Bonne nouvelle, votre commande{' '}
          <strong style={{ color: brand.ink }}>{orderNumber ?? ''}</strong> vient d'être expédiée
          via <strong style={{ color: brand.ink }}>{carrier ?? ''}</strong>.
        </Text>

        <hr style={styles.hr} />
        <Text style={{ ...styles.text, margin: '4px 0' }}>
          Transporteur : <strong style={{ color: brand.ink }}>{carrier ?? ''}</strong>
        </Text>
        <Text style={{ ...styles.text, margin: '4px 0' }}>
          Numéro de suivi :{' '}
          <strong style={{ color: brand.ink, fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' }}>
            {trackingNumber ?? ''}
          </strong>
        </Text>

        {trackingUrl && (
          <Section style={styles.buttonWrap}>
            <Button href={trackingUrl} style={styles.button}>
              Suivre mon colis
            </Button>
          </Section>
        )}

        <Text style={{ ...styles.text, fontSize: '12px' }}>
          Votre colis est expédié dans un emballage 100 % neutre et discret.
        </Text>
      </BrandLayout>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Votre commande ${d.orderNumber ?? ''} a été expédiée`.trim(),
  displayName: 'Commande expédiée',
  previewData: {
    customerName: 'Jean Dupont',
    orderNumber: 'AE-20260630-12345',
    carrier: 'Colissimo',
    trackingNumber: '6A12345678901',
    trackingUrl: 'https://www.laposte.fr/outils/suivre-vos-envois?code=6A12345678901',
  },
} satisfies TemplateEntry
