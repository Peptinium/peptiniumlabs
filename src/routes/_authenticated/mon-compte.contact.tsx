import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Clock, Mail, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { submitTicket } from "@/lib/support.functions";

export const Route = createFileRoute("/_authenticated/mon-compte/contact")({
  component: ContactPage,
});

function ContactPage() {
  const submitFn = useServerFn(submitTicket);
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sentNumber, setSentNumber] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  const mut = useMutation({
    mutationFn: () =>
      submitFn({
        data: {
          email,
          orderNumber: orderNumber.trim() || null,
          subject: subject.trim(),
          body: body.trim(),
        },
      }),
    onSuccess: (res) => {
      setSentNumber(res?.ticketNumber ?? "—");
      setSubject("");
      setBody("");
      setOrderNumber("");
      toast.success("Message envoyé");
    },
    onError: (e: Error) => toast.error(e.message || "Envoi impossible"),
  });

  const valid = email && subject.trim().length >= 3 && body.trim().length >= 5;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-medium">Nous contacter</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Une question sur votre commande, un retour, une demande technique ?
          Écrivez-nous directement, l'équipe Peptinium Labs vous répond sous 24h ouvrées.
        </p>
      </div>

      {sentNumber ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">
          <CheckCircle2 className="mt-0.5 size-5 text-emerald-500" />
          <div className="flex-1">
            <div className="text-sm font-medium">Message bien reçu</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Votre demande{" "}
              <span className="font-mono text-foreground">{sentNumber}</span> a été
              transmise. Vous recevrez la réponse par e-mail à{" "}
              <span className="text-foreground">{email}</span>.
            </div>
            <button
              onClick={() => setSentNumber(null)}
              className="mt-3 text-xs font-medium text-accent hover:underline"
            >
              Envoyer un autre message →
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (valid && !mut.isPending) mut.mutate();
          }}
          className="space-y-4 rounded-xl border border-border bg-card p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                N° de commande <span className="text-muted-foreground/60">(facultatif)</span>
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="PEP-2026-…"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground">
              Sujet
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={150}
              required
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground">
              Votre message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              maxLength={5000}
              required
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <div className="mt-1 text-right text-[10px] text-muted-foreground">
              {body.length} / 5000
            </div>
          </div>

          <Button
            type="submit"
            disabled={!valid || mut.isPending}
            className="w-full sm:w-auto"
          >
            <Send className="mr-2 size-4" />
            {mut.isPending ? "Envoi…" : "Envoyer le message"}
          </Button>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href="mailto:contact@peptinium.com"
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-accent"
        >
          <Mail className="mt-0.5 size-5 text-accent" />
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Contact
            </div>
            <div className="mt-0.5 text-sm font-medium">contact@peptinium.com</div>
          </div>
        </a>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <Clock className="mt-0.5 size-5 text-accent" />
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Horaires
            </div>
            <div className="mt-0.5 text-sm font-medium">Lundi – Vendredi · 9h00 – 18h00 CET</div>
          </div>
        </div>
      </div>
    </div>
  );
}
