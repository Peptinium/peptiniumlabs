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
    <Preview>Votre lien de connexion {siteName}</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Votre lien de connexion</Text>
        <Text style={styles.text}>
          Cliquez sur le bouton ci-dessous pour vous connecter à {siteName}. Ce lien expire prochainement.
        </Text>
        <div style={styles.buttonWrap}>
          <Button style={styles.button} href={confirmationUrl}>
            Se connecter
          </Button>
        </div>
        <Text style={styles.text}>
          Si le bouton ne s'ouvre pas, utilisez ce lien sécurisé :<br />
          <Link href={confirmationUrl} style={styles.fallbackLink}>
            {confirmationUrl}
          </Link>
        </Text>
        <Text style={styles.text}>Si vous n'avez pas demandé ce lien, vous pouvez ignorer cet email.</Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default MagicLinkEmail
