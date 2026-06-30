import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { listMyTickets, createMyTicket, replyMyTicket } from "@/lib/account.functions";

export const Route = createFileRoute("/_authenticated/mon-compte/sav")({
  component: SavPage,
});

const STATUS_COLOR: Record<string, string> = {
  open: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  pending: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  closed: "bg-muted text-muted-foreground border-border",
};

function SavPage() {
  const fetchTickets = useServerFn(listMyTickets);
  const createTicket = useServerFn(createMyTicket);
  const reply = useServerFn(replyMyTicket);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ tickets: any[]; messages: any[] }>({ tickets: [], messages: [] });
  const [openId, setOpenId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [draft, setDraft] = useState({ subject: "", order_number: "", body: "" });
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    const res = await fetchTickets();
    setData(res);
  };

  useEffect(() => {
    (async () => {
      try {
        await refresh();
      } catch (e: any) {
        setError(e?.message ?? "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const submitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createTicket({
        data: {
          subject: draft.subject,
          body: draft.body,
          order_number: draft.order_number || null,
        },
      });
      setDraft({ subject: "", order_number: "", body: "" });
      setNewOpen(false);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? "Erreur");
    }
  };

  const submitReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    try {
      await reply({ data: { ticket_id: ticketId, body: replyText } });
      setReplyText("");
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? "Erreur");
    }
  };

  if (loading) return <div className="py-10 text-center text-sm text-muted-foreground">Chargement…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-medium">Mes tickets SAV</h2>
        <button
          onClick={() => setNewOpen((v) => !v)}
          className="rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground hover:opacity-90"
        >
          {newOpen ? "Annuler" : "+ Nouveau ticket"}
        </button>
      </div>

      {newOpen && (
        <form onSubmit={submitNew} className="space-y-3 rounded-xl border border-border bg-card p-4">
          <input
            required
            placeholder="Sujet *"
            value={draft.subject}
            onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            placeholder="N° de commande (facultatif)"
            value={draft.order_number}
            onChange={(e) => setDraft({ ...draft, order_number: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <textarea
            required
            placeholder="Décrivez votre demande…"
            rows={5}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Envoyer
          </button>
        </form>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      {data.tickets.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun ticket pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {data.tickets.map((t) => {
            const msgs = data.messages.filter((m) => m.ticket_id === t.id);
            const open = openId === t.id;
            return (
              <div key={t.id} className="rounded-xl border border-border bg-card">
                <button
                  onClick={() => {
                    setOpenId(open ? null : t.id);
                    setReplyText("");
                  }}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold">{t.ticket_number}</span>
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-medium uppercase ${
                          STATUS_COLOR[t.status] ?? STATUS_COLOR.closed
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-sm font-medium">{t.subject}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {new Date(t.created_at).toLocaleDateString("fr-FR")}
                      {t.order_number ? ` · Cmd ${t.order_number}` : ""}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{open ? "Masquer" : "Ouvrir"}</div>
                </button>
                {open && (
                  <div className="border-t border-border p-4">
                    <div className="space-y-3">
                      {msgs.map((m) => (
                        <div
                          key={m.id}
                          className={`rounded-lg border p-3 text-sm ${
                            m.author_role === "customer"
                              ? "ml-6 border-accent/30 bg-accent/5"
                              : "mr-6 border-border bg-background"
                          }`}
                        >
                          <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {m.author_role === "customer" ? "Vous" : "Support"} ·{" "}
                            {new Date(m.created_at).toLocaleString("fr-FR")}
                          </div>
                          <div className="whitespace-pre-wrap">{m.body}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      <textarea
                        rows={3}
                        placeholder="Votre réponse…"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                      />
                      <button
                        onClick={() => submitReply(t.id)}
                        className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground hover:opacity-90"
                      >
                        Répondre
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
