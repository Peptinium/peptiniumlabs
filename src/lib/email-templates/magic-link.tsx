import * as React from 'react'
import { Body, Button, Head, Html, Link, Preview, Text } from '@react-email/components'
import { BrandLayout, styles } from './_brand'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Votre lien de connexion Peptinium Labs</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Connexion à {siteName}</Text>
        <Text style={styles.text}>
          Cliquez sur le bouton ci-dessous pour ouvrir votre espace Peptinium Labs. Ce lien expire prochainement.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>Me connecter</Button>
        </div>
        <Text style={styles.text}>
          Si le bouton ne s'ouvre pas, utilisez ce lien sécurisé :<br />
          <Link href={confirmationUrl} style={styles.fallbackLink}>{confirmationUrl}</Link>
        </Text>
        <Text style={styles.text}>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.</Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default MagicLinkEmail
