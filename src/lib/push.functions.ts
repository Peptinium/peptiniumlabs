import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SubSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(10),
  auth_key: z.string().min(10),
  label: z.string().optional(),
});

export const savePushSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SubSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Upsert by endpoint
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          user_id: userId,
          endpoint: data.endpoint,
          p256dh: data.p256dh,
          auth_key: data.auth_key,
          label: data.label ?? null,
          last_used_at: new Date().toISOString(),
        },
        { onConflict: "endpoint" }
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePushSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ endpoint: z.string().url() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", data.endpoint);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendTestPush = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth_key")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    if (!subs || subs.length === 0) throw new Error("Aucun appareil abonné");

    const { sendWebPush } = await import("./push.server");
    let sent = 0;
    const expired: string[] = [];
    for (const s of subs) {
      const res = await sendWebPush(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth_key } },
        {
          title: "Peptinium Labs",
          body: "Notifications activées ✅ Tu recevras ici les nouvelles commandes et messages SAV.",
          url: "/admin",
          tag: "test",
        }
      );
      if (res.ok) sent++;
      else if (res.gone) expired.push(s.endpoint);
    }
    if (expired.length) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("push_subscriptions").delete().in("endpoint", expired);
    }
    return { sent, expired: expired.length };
  });
