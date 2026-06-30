import * as React from 'react'
import { Body, Head, Html, Preview, Text } from '@react-email/components'
import { BrandLayout, styles } from './_brand'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Votre code de vérification Peptinium Labs</Preview>
    <Body style={styles.main}>
      <BrandLayout>
        <Text style={styles.h1}>Confirmer votre identité</Text>
        <Text style={styles.text}>
          Utilisez le code ci-dessous pour confirmer votre identité :
        </Text>
        <Text style={styles.code}>{token}</Text>
        <Text style={styles.text}>
          Ce code expire prochainement. Si vous n'êtes pas à l'origine de cette
          demande, ignorez ce message.
        </Text>
      </BrandLayout>
    </Body>
  </Html>
)

export default ReauthenticationEmail
