import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  path: z.string().min(1).max(400),
  referrer: z.string().max(800).optional().nullable(),
  sessionId: z.string().min(1).max(80),
});

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const json = await request.json();
          const data = schema.parse(json);
          const country =
            request.headers.get("cf-ipcountry") ??
            request.headers.get("x-vercel-ip-country") ??
            null;
          const ua = request.headers.get("user-agent") ?? null;

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("page_views").insert({
            path: data.path,
            referrer: data.referrer ?? null,
            session_id: data.sessionId,
            country,
            user_agent: ua?.slice(0, 300) ?? null,
          });
          return new Response(null, { status: 204 });
        } catch {
          return new Response(null, { status: 204 });
        }
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "POST,OPTIONS",
            "access-control-allow-headers": "content-type",
          },
        }),
    },
  },
});
