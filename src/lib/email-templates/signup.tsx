import * as React from 'react'
import { Body, Button, Head, Html, Preview, Text } from '@react-email/components'
import { BrandLayout, styles } from './_brand'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Confirmez votre adresse email Peptinium Labs</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Confirmez votre adresse email</Text>
        <Text style={styles.text}>
          Bienvenue chez {siteName}. Pour activer votre compte associé à{' '}
          <strong style={{ color: styles.h1.color }}>{recipient}</strong>, cliquez sur
          le bouton ci-dessous.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>
            Confirmer mon email
          </Button>
        </div>
        <Text style={styles.text}>
          Ce lien est valable une heure. Si vous n'êtes pas à l'origine de cette
          inscription, ignorez simplement ce message.
        </Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default SignupEmail
