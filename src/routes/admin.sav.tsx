import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { listTickets, replyTicket, updateTicket } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/sav")({
  component: SavPage,
});

function SavPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listTickets);
  const replyFn = useServerFn(replyTicket);
  const updateFn = useServerFn(updateTicket);
  const [openId, setOpenId] = useState<string | null>(null);

  const ticketsQ = useQuery({
    queryKey: ["admin", "tickets"],
    queryFn: () => listFn(),
    refetchInterval: 30000,
  });

  const replyMut = useMutation({
    mutationFn: ({ ticketId, body, status }: { ticketId: string; body: string; status?: "open" | "in_progress" | "resolved" | "closed" }) =>
      replyFn({ data: { ticketId, body, status } }),
    onSuccess: () => {
      toast.success("Réponse envoyée");
      qc.invalidateQueries({ queryKey: ["admin", "tickets"] });
    },
    onError: (e: Error) => toast.error(e.message || "Réponse impossible"),
  });

  const updateMut = useMutation({
    mutationFn: ({ ticketId, status, priority }: { ticketId: string; status?: "open" | "in_progress" | "resolved" | "closed"; priority?: "low" | "normal" | "high" }) =>
      updateFn({ data: { ticketId, status, priority } }),
    onSuccess: () => {
      toast.success("Ticket mis à jour");
      qc.invalidateQueries({ queryKey: ["admin", "tickets"] });
    },
    onError: (e: Error) => toast.error(e.message || "Mise à jour impossible"),
  });

  const tickets = ticketsQ.data?.tickets ?? [];
  const messages = ticketsQ.data?.messages ?? [];

  const messagesByTicket = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const message of messages) {
      if (!map.has(message.ticket_id)) map.set(message.ticket_id, []);
      map.get(message.ticket_id)!.push(message);
    }
    return map;
  }, [messages]);

  const stats = [
    { label: "Ouverts", value: tickets.filter((t: any) => t.status === "open").length, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "En cours", value: tickets.filter((t: any) => t.status === "in_progress").length, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Résolus", value: tickets.filter((t: any) => t.status === "resolved" || t.status === "closed").length, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Messages", value: messages.length, icon: MessageSquare, color: "text-violet-400", bg: "bg-violet-400/10" },
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">SAV</h2>
        <p className="text-sm text-muted-foreground">
          Suivi des tickets, réponses client et mise à jour des priorités.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-3">
              <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon className={`size-4 ${stat.color}`} />
              </div>
              <div className="mt-2 text-xl font-bold">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Tickets</h3>
        {ticketsQ.isLoading ? (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
            Chargement…
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted-foreground">
            Aucun ticket SAV.
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map((ticket: any) => {
              const isOpen = openId === ticket.id;
              const thread = messagesByTicket.get(ticket.id) ?? [];

              return (
                <div key={ticket.id} className="overflow-hidden rounded-xl border border-border bg-card">
                  <button
                    onClick={() => setOpenId(isOpen ? null : ticket.id)}
                    className="flex w-full items-start justify-between gap-3 p-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {ticket.ticket_number} · {new Date(ticket.created_at).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="truncate text-sm font-semibold">{ticket.subject}</div>
                      <div className="truncate text-xs text-muted-foreground">{ticket.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end gap-1">
                        <Badge tone={priorityTone(ticket.priority)}>
                          {priorityLabel(ticket.priority)}
                        </Badge>
                        <Badge tone={statusTone(ticket.status)}>{statusLabel(ticket.status)}</Badge>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="mt-0.5 size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="mt-0.5 size-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="space-y-4 border-t border-border bg-background/30 p-4">
                      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="size-3" />
                          {ticket.email}
                        </span>
                        {ticket.order_number && <span>Commande : {ticket.order_number}</span>}
                      </div>

                      <section>
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Conversation
                        </div>
                        <div className="space-y-2">
                          {thread.map((message: any) => (
                            <div
                              key={message.id}
                              className={`rounded-xl border p-3 text-sm ${
                                message.author_role === "admin"
                                  ? "border-primary/20 bg-primary/5"
                                  : "border-border bg-card"
                              }`}
                            >
                              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                {message.author_role === "admin" ? "Admin" : "Client"} · {new Date(message.created_at).toLocaleString("fr-FR")}
                              </div>
                              <div className="whitespace-pre-wrap">{message.body}</div>
                            </div>
                          ))}
                          {thread.length === 0 && (
                            <div className="text-xs text-muted-foreground">Aucun message trouvé.</div>
                          )}
                        </div>
                      </section>

                      <section>
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Mise à jour du ticket
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            defaultValue={ticket.status}
                            onChange={(e) =>
                              updateMut.mutate({
                                ticketId: ticket.id,
                                status: e.target.value as "open" | "in_progress" | "resolved" | "closed",
                              })
                            }
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                          >
                            <option value="open">Ouvert</option>
                            <option value="in_progress">En cours</option>
                            <option value="resolved">Résolu</option>
                            <option value="closed">Fermé</option>
                          </select>
                          <select
                            defaultValue={ticket.priority}
                            onChange={(e) =>
                              updateMut.mutate({
                                ticketId: ticket.id,
                                priority: e.target.value as "low" | "normal" | "high",
                              })
                            }
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                          >
                            <option value="low">Basse</option>
                            <option value="normal">Normale</option>
                            <option value="high">Haute</option>
                          </select>
                        </div>
                      </section>

                      <ReplyComposer
                        ticketId={ticket.id}
                        pending={replyMut.isPending}
                        onSend={(body, status) => replyMut.mutate({ ticketId: ticket.id, body, status })}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyComposer({
  ticketId,
  pending,
  onSend,
}: {
  ticketId: string;
  pending: boolean;
  onSend: (body: string, status?: "open" | "in_progress" | "resolved" | "closed") => void;
}) {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"open" | "in_progress" | "resolved" | "closed">("in_progress");

  return (
    <section className="space-y-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Répondre au client
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Écrire une réponse SAV…"
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
      />
      <div className="flex gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "open" | "in_progress" | "resolved" | "closed")}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none"
        >
          <option value="open">Laisser ouvert</option>
          <option value="in_progress">Passer en cours</option>
          <option value="resolved">Marquer résolu</option>
          <option value="closed">Fermer</option>
        </select>
        <Button
          type="button"
          disabled={pending || !body.trim()}
          onClick={() => {
            onSend(body.trim(), status);
            setBody("");
          }}
        >
          <Send className="mr-1 size-4" />
          Envoyer
        </Button>
      </div>
    </section>
  );
}

function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${tone}`}>{children}</span>;
}

function statusLabel(value: string) {
  return (
    {
      open: "Ouvert",
      in_progress: "En cours",
      resolved: "Résolu",
      closed: "Fermé",
    } as Record<string, string>
  )[value] ?? value;
}

function priorityLabel(value: string) {
  return (
    {
      low: "Basse",
      normal: "Normale",
      high: "Haute",
      urgent: "Urgente",
    } as Record<string, string>
  )[value] ?? value;
}

function statusTone(value: string) {
  if (value === "open") return "border-rose-400/20 bg-rose-400/10 text-rose-400";
  if (value === "in_progress") return "border-amber-400/20 bg-amber-400/10 text-amber-400";
  return "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";
}

function priorityTone(value: string) {
  if (value === "high" || value === "urgent") return "border-rose-400/20 bg-rose-400/10 text-rose-400";
  if (value === "low") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";
  return "border-sky-400/20 bg-sky-400/10 text-sky-400";
}
