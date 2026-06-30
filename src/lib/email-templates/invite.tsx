import * as React from 'react'
import { Body, Button, Head, Html, Link, Preview, Text } from '@react-email/components'
import { BrandLayout, brand, styles } from './_brand'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Invitation Peptinium Labs</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Invitation à rejoindre {siteName}</Text>
        <Text style={styles.text}>
          Vous avez été invité à rejoindre{' '}
          <Link href={siteUrl} style={link}>
            <strong style={{ color: brand.ink }}>{siteName}</strong>
          </Link>
          . Cliquez sur le bouton ci-dessous pour accepter l'invitation et créer votre accès.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>Accepter l'invitation</Button>
        </div>
        <Text style={styles.text}>
          Si le bouton ne s'ouvre pas, utilisez ce lien sécurisé :<br />
          <Link href={confirmationUrl} style={styles.fallbackLink}>{confirmationUrl}</Link>
        </Text>
        <Text style={styles.text}>Si vous n'attendiez pas cette invitation, ignorez simplement ce message.</Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default InviteEmail
const link = { color: brand.blue, textDecoration: 'none' }
