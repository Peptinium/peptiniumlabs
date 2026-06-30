import * as React from 'react'
import { Body, Button, Head, Html, Link, Preview, Text } from '@react-email/components'
import { BrandLayout, styles } from './_brand'

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail). For the
  // NEW-recipient half of a secure email_change fanout, `email` equals the
  // recipient (NEW), so the "from" line must render oldEmail to read
  // "from OLD to NEW" instead of "from NEW to NEW".
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
    <Preview>Confirmez le changement d'email {siteName}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Confirmer le changement d'email</Text>
        <Text style={styles.text}>
          Vous avez demandé à modifier l'adresse email de votre compte {siteName} de{' '}
          <Link href={`mailto:${oldEmail}`} style={styles.link}>
            {oldEmail}
          </Link>{' '}
          vers{' '}
          <Link href={`mailto:${newEmail}`} style={styles.link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={styles.text}>
          Cliquez sur le bouton ci-dessous pour confirmer ce changement.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>
            Confirmer le changement
          </Button>
        </div>
        <Text style={styles.text}>
          Si le bouton ne s'ouvre pas, utilisez ce lien sécurisé :<br />
          <Link href={confirmationUrl} style={styles.fallbackLink}>
            {confirmationUrl}
          </Link>
        </Text>
        <Text style={styles.text}>Si vous n'avez pas demandé ce changement, sécurisez votre compte immédiatement.</Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default EmailChangeEmail
