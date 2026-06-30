import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/lib/account.functions";

export const Route = createFileRoute("/_authenticated/mon-compte/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateMyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [email, setEmail] = useState<string>("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address_line: "",
    address_line2: "",
    postal_code: "",
    city: "",
    country: "France",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchProfile();
        if (cancelled) return;
        setEmail(res.email ?? "");
        if (res.profile) {
          setForm({
            first_name: res.profile.first_name ?? "",
            last_name: res.profile.last_name ?? "",
            phone: res.profile.phone ?? "",
            address_line: res.profile.address_line ?? "",
            address_line2: res.profile.address_line2 ?? "",
            postal_code: res.profile.postal_code ?? "",
            city: res.profile.city ?? "",
            country: res.profile.country ?? "France",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchProfile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await saveProfile({ data: form });
      setMsg({ kind: "ok", text: "Profil enregistré." });
    } catch (e: any) {
      setMsg({ kind: "err", text: e?.message ?? "Erreur" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-10 text-center text-sm text-muted-foreground">Chargement…</div>;

  const field = (label: string, key: keyof typeof form, opts?: { type?: string; required?: boolean }) => (
    <div>
      <label className="text-xs font-medium text-foreground">{label}</label>
      <input
        type={opts?.type ?? "text"}
        required={opts?.required}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
      />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div>
        <label className="text-xs font-medium text-foreground">Email du compte</label>
        <input
          value={email}
          disabled
          className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("Prénom", "first_name")}
        {field("Nom", "last_name")}
      </div>
      {field("Téléphone", "phone", { type: "tel" })}
      {field("Adresse", "address_line")}
      {field("Complément d'adresse", "address_line2")}
      <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
        {field("Code postal", "postal_code")}
        {field("Ville", "city")}
      </div>
      {field("Pays", "country")}

      {msg && (
        <div
          className={`rounded-lg border p-3 text-xs ${
            msg.kind === "ok"
              ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700"
              : "border-destructive/40 bg-destructive/5 text-destructive"
          }`}
        >
          {msg.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40 sm:w-auto"
      >
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
      <p className="text-[11px] text-muted-foreground">
        Ces informations sont utilisées pour préremplir automatiquement vos prochains paniers.
      </p>
    </form>
  );
}
