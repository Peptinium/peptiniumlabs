import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { SiteLayout } from '@/components/SiteLayout'

export const Route = createFileRoute('/unsubscribe')({
  head: () => ({
    meta: [
      { title: 'Désabonnement — Aetherion Labs' },
      { name: 'robots', content: 'noindex,nofollow' },
    ],
  }),
  component: UnsubscribePage,
})

function UnsubscribePage() {
  const [state, setState] = useState<
    'loading' | 'ready' | 'done' | 'invalid' | 'already' | 'error'
  >('loading')
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    setToken(t)
    if (!t) {
      setState('invalid')
      return
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) setState('ready')
        else if (d.reason === 'already_unsubscribed') setState('already')
        else setState('invalid')
      })
      .catch(() => setState('error'))
  }, [])

  const confirm = async () => {
    if (!token) return
    try {
      const r = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const d = await r.json()
      if (d.success) setState('done')
      else if (d.reason === 'already_unsubscribed') setState('already')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  return (
    <SiteLayout>
      <section className="container-prose flex min-h-[50vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="font-display text-xl font-medium">Désabonnement email</h1>
          <div className="mt-4 text-sm text-muted-foreground">
            {state === 'loading' && 'Vérification du lien…'}
            {state === 'ready' && (
              <>
                <p>Confirmez-vous votre désabonnement de nos emails ?</p>
                <button
                  onClick={confirm}
                  className="mt-5 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                  Confirmer le désabonnement
                </button>
              </>
            )}
            {state === 'done' && 'Vous êtes désabonné. À bientôt.'}
            {state === 'already' && 'Cette adresse est déjà désabonnée.'}
            {state === 'invalid' && 'Lien invalide ou expiré.'}
            {state === 'error' && 'Une erreur est survenue. Réessayez plus tard.'}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
