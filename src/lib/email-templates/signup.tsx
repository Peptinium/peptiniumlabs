import * as React from 'react'
import { Body, Button, Head, Html, Link, Preview, Text } from '@react-email/components'
import { BrandLayout, brand, styles } from './_brand'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
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
          Bienvenue chez{' '}
          <Link href={siteUrl} style={link}>
            <strong style={{ color: brand.ink }}>{siteName}</strong>
          </Link>
          . Pour activer le compte associé à <strong style={{ color: brand.ink }}>{recipient}</strong>, cliquez sur le bouton ci-dessous.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>
            Confirmer mon email
          </Button>
        </div>
        <Text style={styles.text}>
          Si le bouton ne s'ouvre pas, utilisez ce lien sécurisé :<br />
          <Link href={confirmationUrl} style={styles.fallbackLink}>{confirmationUrl}</Link>
        </Text>
        <Text style={styles.text}>Ce lien est valable une heure. Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement ce message.</Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default SignupEmail
const link = { color: brand.blue, textDecoration: 'none' }
