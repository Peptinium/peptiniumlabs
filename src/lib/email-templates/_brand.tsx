import * as React from 'react'
import { Container, Section, Text } from '@react-email/components'

export const brand = {
  ink: '#0F1B3D',
  inkSoft: '#475078',
  cyan: '#3FBFC9',
  blue: '#3B6FE8',
  violet: '#7B3FE4',
  magenta: '#E94BA1',
  border: '#E6E9F2',
  surface: '#F7F9FC',
  muted: '#8A93AD',
}

export const gradient =
  `linear-gradient(135deg, ${brand.cyan} 0%, ${brand.blue} 35%, ${brand.violet} 70%, ${brand.magenta} 100%)`

export const styles = {
  main: {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    margin: 0,
    padding: '24px 0',
  },
  container: {
    maxWidth: '560px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    border: `1px solid ${brand.border}`,
    borderRadius: '14px',
    overflow: 'hidden' as const,
  },
  headerBar: {
    height: '6px',
    background: gradient,
  },
  header: {
    padding: '28px 32px 8px',
  },
  brandRow: {
    fontSize: '11px',
    letterSpacing: '0.28em',
    color: brand.cyan,
    fontWeight: 700 as const,
    margin: 0,
  },
  brandSub: {
    fontSize: '10px',
    letterSpacing: '0.32em',
    color: brand.muted,
    margin: '4px 0 0',
  },
  body: {
    padding: '8px 32px 24px',
  },
  h1: {
    fontSize: '24px',
    fontWeight: 600 as const,
    color: brand.ink,
    margin: '16px 0 16px',
    letterSpacing: '-0.02em',
    lineHeight: '1.25',
  },
  text: {
    fontSize: '14px',
    color: brand.inkSoft,
    lineHeight: '1.65',
    margin: '0 0 16px',
  },
  buttonWrap: {
    margin: '8px 0 20px',
  },
  button: {
    background: gradient,
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600 as const,
    borderRadius: '10px',
    padding: '13px 24px',
    textDecoration: 'none',
    display: 'inline-block' as const,
    letterSpacing: '0.01em',
  },
  link: { color: brand.blue, textDecoration: 'none' },
  code: {
    display: 'inline-block' as const,
    fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    fontSize: '26px',
    letterSpacing: '0.32em',
    color: brand.ink,
    background: brand.surface,
    border: `1px solid ${brand.border}`,
    borderRadius: '10px',
    padding: '14px 22px',
    margin: '4px 0 22px',
  },
  hr: {
    borderTop: `1px solid ${brand.border}`,
    margin: '18px 0',
    borderBottom: 'none',
    borderLeft: 'none',
    borderRight: 'none',
  },
  footer: {
    padding: '20px 32px 28px',
    borderTop: `1px solid ${brand.border}`,
    backgroundColor: brand.surface,
  },
  footerText: {
    fontSize: '11px',
    color: brand.muted,
    margin: '0 0 4px',
    lineHeight: '1.5',
  },
}

export const BrandLayout = ({ children }: { children: React.ReactNode }) => (
  <Container style={styles.container}>
    <Section style={styles.headerBar} />
    <Section style={styles.header}>
      <Text style={styles.brandRow}>PEPTINIUM LABS</Text>
      <Text style={styles.brandSub}>PEPTIDE DE RECHERCHE</Text>
    </Section>
    <Section style={styles.body}>{children}</Section>
    <Section style={styles.footer}>
      <Text style={styles.footerText}>
        Peptinium Labs — Réactifs peptidiques pour la recherche.
      </Text>
      <Text style={styles.footerText}>
        Réservé à un usage de laboratoire (RUO). Non destiné à un usage humain ou vétérinaire.
      </Text>
      <Text style={styles.footerText}>support@peptinium.com · peptinium.com</Text>
    </Section>
  </Container>
)
