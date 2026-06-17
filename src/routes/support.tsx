import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { submitTicket } from "@/lib/support.functions";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Service après-vente — Aetherion Labs" },
      {
        name: "description",
        content:
          "Une question sur une commande ? Contactez notre support — réponse sous 24 h ouvrées.",
      },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const submit = useServerFn(submitTicket);
  const [form, setForm] = useState({ email: "", orderNumber: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <SiteLayout>
      <section className="container-prose py-12 sm:py-16">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          — Support client
        </div>
        <h1 className="mt-2 font-display text-3xl font-medium sm:text-4xl">
          Service après-vente
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Une question sur votre commande, un colis non reçu, un produit
          endommagé ? Ouvrez un ticket — nous répondons sous 24 h ouvrées.
        </p>

        {done ? (
          <div className="mt-8 max-w-xl rounded-2xl border border-success/40 bg-success/5 p-6">
            <h2 className="font-display text-lg font-medium">Ticket enregistré</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Référence : <span className="font-mono">{done}</span>
              <br />
              Nous reviendrons vers vous par email.
            </p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSending(true);
              setError(null);
              try {
                const r = await submit({
                  data: {
                    email: form.email,
                    orderNumber: form.orderNumber || null,
                    subject: form.subject,
                    body: form.body,
                  },
                });
                setDone(r.ticketNumber);
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setSending(false);
              }
            }}
            className="mt-8 grid max-w-xl gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="N° de commande (facultatif)">
              <input
                value={form.orderNumber}
                onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                placeholder="AE-20260617-12345"
                className="input"
              />
            </Field>
            <Field label="Sujet">
              <input
                required
                maxLength={150}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Message">
              <textarea
                required
                minLength={5}
                maxLength={5000}
                rows={6}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="input resize-y"
              />
            </Field>
            {error && <div className="text-xs text-destructive">{error}</div>}
            <button
              disabled={sending}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
            >
              {sending ? "Envoi…" : "Envoyer le ticket"}
            </button>
            <style>{`.input{width:100%;border-radius:.5rem;border:1px solid var(--color-border);background:var(--color-background);padding:.6rem .75rem;font-size:.875rem}`}</style>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
