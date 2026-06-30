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
    <Preview>Invitation à rejoindre {siteName}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Vous êtes invité</Text>
        <Text style={styles.text}>
          Vous êtes invité à rejoindre{' '}
          <Link href={siteUrl} style={styles.link}>
            <strong style={{ color: brand.ink }}>{siteName}</strong>
          </Link>
          . Cliquez sur le bouton ci-dessous pour accepter l'invitation et créer votre compte.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>
            Accepter l'invitation
          </Button>
        </div>
        <Text style={styles.text}>
          Si le bouton ne s'ouvre pas, utilisez ce lien sécurisé :<br />
          <Link href={confirmationUrl} style={styles.fallbackLink}>
            {confirmationUrl}
          </Link>
        </Text>
        <Text style={styles.text}>Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.</Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default InviteEmail
