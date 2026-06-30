import { createFileRoute } from "@tanstack/react-router";
import { Mail, Clock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/mon-compte/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-medium">Nous contacter</h2>
      <p className="text-sm text-muted-foreground">
        Une question sur votre commande, un retour, une demande technique ?
        L'équipe Peptinium Labs vous répond sous 24h ouvrées.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href="mailto:research@peptinium.com"
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-accent"
        >
          <Mail className="mt-0.5 size-5 text-accent" />
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Service client
            </div>
            <div className="mt-0.5 text-sm font-medium">research@peptinium.com</div>
          </div>
        </a>

        <a
          href="mailto:quote@peptinium.com"
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-accent"
        >
          <ShieldCheck className="mt-0.5 size-5 text-accent" />
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Devis & CoA
            </div>
            <div className="mt-0.5 text-sm font-medium">quote@peptinium.com</div>
          </div>
        </a>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 sm:col-span-2">
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
