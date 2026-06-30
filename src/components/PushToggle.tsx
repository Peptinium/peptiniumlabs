import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import {
  savePushSubscription,
  deletePushSubscription,
  sendTestPush,
} from "@/lib/push.functions";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function PushToggle() {
  const save = useServerFn(savePushSubscription);
  const remove = useServerFn(deletePushSubscription);
  const test = useServerFn(sendTestPush);
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [endpoint, setEndpoint] = useState<string | null>(null);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
    setSupported(ok);
    if (!ok) return;
    (async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration("/push-sw.js");
        const sub = await reg?.pushManager.getSubscription();
        if (sub) {
          setEnabled(true);
          setEndpoint(sub.endpoint);
        }
      } catch {}
    })();
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        toast.error("Autorisation refusée par le navigateur");
        return;
      }
      const reg = await navigator.serviceWorker.register("/push-sw.js");
      const res = await fetch("/api/public/push/vapid-key");
      const { publicKey } = await res.json();
      if (!publicKey) throw new Error("Clé VAPID indisponible");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });
      const json = sub.toJSON() as any;
      await save({
        data: {
          endpoint: sub.endpoint,
          p256dh: json.keys.p256dh,
          auth_key: json.keys.auth,
          label: navigator.userAgent.slice(0, 80),
        },
      });
      setEnabled(true);
      setEndpoint(sub.endpoint);
      toast.success("Notifications activées");
    } catch (e: any) {
      toast.error(e?.message ?? "Erreur d'activation");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/push-sw.js");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        const ep = sub.endpoint;
        await sub.unsubscribe();
        await remove({ data: { endpoint: ep } });
      }
      setEnabled(false);
      setEndpoint(null);
      toast.success("Notifications désactivées");
    } catch (e: any) {
      toast.error(e?.message ?? "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function testPush() {
    setBusy(true);
    try {
      const r = await test();
      toast.success(`Push envoyé (${r.sent} appareil${r.sent > 1 ? "s" : ""})`);
    } catch (e: any) {
      toast.error(e?.message ?? "Échec");
    } finally {
      setBusy(false);
    }
  }

  if (!supported) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Notifications push non disponibles sur ce navigateur. Sur iPhone, installe l'app depuis Safari (Partager → Sur l'écran d'accueil) puis ouvre-la pour activer.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
          {enabled ? <Bell className="size-5" /> : <BellOff className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">Notifications push</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Reçois une alerte instantanée pour les nouvelles commandes, paiements confirmés et messages SAV.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {enabled ? (
              <>
                <button
                  onClick={disable}
                  disabled={busy}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                >
                  {busy ? <Loader2 className="size-3 animate-spin" /> : "Désactiver"}
                </button>
                <button
                  onClick={testPush}
                  disabled={busy}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
                >
                  Envoyer un test
                </button>
              </>
            ) : (
              <button
                onClick={enable}
                disabled={busy}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
              >
                {busy ? "…" : "Activer les notifications"}
              </button>
            )}
          </div>
          {endpoint && (
            <div className="mt-2 truncate text-[10px] text-muted-foreground">
              Appareil enregistré · {new URL(endpoint).host}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
