import * as React from 'react'
import { Body, Button, Head, Html, Link, Preview, Text } from '@react-email/components'
import { BrandLayout, styles } from './_brand'

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Confirmez le changement d'email pour {siteName}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Confirmer le changement d'email</Text>
        <Text style={styles.text}>
          Vous avez demandé à modifier l'adresse email de votre compte {siteName} :
          de <Link href={`mailto:${oldEmail}`} style={styles.link}>{oldEmail}</Link>{' '}
          vers <Link href={`mailto:${newEmail}`} style={styles.link}>{newEmail}</Link>.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>
            Confirmer le changement
          </Button>
        </div>
        <Text style={styles.text}>
          Si vous n'êtes pas à l'origine de cette demande, sécurisez immédiatement
          votre compte.
        </Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default EmailChangeEmail
