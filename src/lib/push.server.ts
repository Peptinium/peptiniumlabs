import webpush from "web-push";

let configured = false;
function configure() {
  if (configured) return;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:contact@peptinium.com";
  if (!pub || !priv) throw new Error("VAPID keys not configured");
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
}

export type PushSub = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

export async function sendWebPush(
  sub: PushSub,
  payload: PushPayload
): Promise<{ ok: boolean; gone?: boolean; error?: string }> {
  try {
    configure();
    await webpush.sendNotification(sub, JSON.stringify(payload));
    return { ok: true };
  } catch (e: any) {
    const status = e?.statusCode;
    if (status === 404 || status === 410) return { ok: false, gone: true };
    return { ok: false, error: e?.body || e?.message || "push failed" };
  }
}

export async function broadcastToUser(
  userId: string,
  payload: PushPayload
): Promise<{ sent: number; expired: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: subs } = await supabaseAdmin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth_key")
    .eq("user_id", userId);
  if (!subs || subs.length === 0) return { sent: 0, expired: 0 };
  let sent = 0;
  const expired: string[] = [];
  for (const s of subs) {
    const res = await sendWebPush(
      { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth_key } },
      payload
    );
    if (res.ok) sent++;
    else if (res.gone) expired.push(s.endpoint);
  }
  if (expired.length) {
    await supabaseAdmin.from("push_subscriptions").delete().in("endpoint", expired);
  }
  return { sent, expired: expired.length };
}
