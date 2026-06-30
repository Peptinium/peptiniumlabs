import * as React from 'react'
import { Body, Button, Head, Html, Link, Preview, Text } from '@react-email/components'
import { BrandLayout, styles } from './_brand'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Réinitialisation de votre mot de passe {siteName}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Réinitialiser votre mot de passe</Text>
        <Text style={styles.text}>
          Nous avons reçu une demande de réinitialisation pour votre compte {siteName}. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>
            Choisir un nouveau mot de passe
          </Button>
        </div>
        <Text style={styles.text}>
          Si le bouton ne s'ouvre pas, utilisez ce lien sécurisé :<br />
          <Link href={confirmationUrl} style={styles.fallbackLink}>
            {confirmationUrl}
          </Link>
        </Text>
        <Text style={styles.text}>Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.</Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default RecoveryEmail
