import * as React from 'react'
import { Body, Button, Head, Html, Preview, Text } from '@react-email/components'
import { BrandLayout, styles } from './_brand'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Réinitialisation de votre mot de passe {siteName}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Réinitialiser votre mot de passe</Text>
        <Text style={styles.text}>
          Nous avons reçu une demande de réinitialisation de mot de passe pour votre
          compte {siteName}. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>
            Choisir un nouveau mot de passe
          </Button>
        </div>
        <Text style={styles.text}>
          Si vous n'avez pas demandé cette réinitialisation, ignorez ce message — votre
          mot de passe restera inchangé.
        </Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default RecoveryEmail
