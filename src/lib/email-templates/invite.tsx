import * as React from 'react'
import { Body, Button, Head, Html, Preview, Text } from '@react-email/components'
import { BrandLayout, styles } from './_brand'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, confirmationUrl }: InviteEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Vous êtes invité à rejoindre {siteName}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Vous êtes invité</Text>
        <Text style={styles.text}>
          Vous avez été invité à rejoindre <strong>{siteName}</strong>. Cliquez sur le
          bouton ci-dessous pour accepter et créer votre compte.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>
            Accepter l'invitation
          </Button>
        </div>
        <Text style={styles.text}>
          Si cette invitation ne vous était pas destinée, vous pouvez ignorer cet email.
        </Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default InviteEmail
