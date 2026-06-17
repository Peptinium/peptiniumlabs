
-- =====================================================
-- 1. Compléments aux tables existantes
-- =====================================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS payment_validated_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_validated_by uuid,
  ADD COLUMN IF NOT EXISTS invoice_number text,
  ADD COLUMN IF NOT EXISTS invoice_issued_at timestamptz;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer NOT NULL DEFAULT 5;

-- =====================================================
-- 2. invoices : compteur séquentiel annuel
-- =====================================================
CREATE TABLE IF NOT EXISTS public.invoice_counters (
  year integer PRIMARY KEY,
  next_seq integer NOT NULL DEFAULT 1
);
GRANT SELECT ON public.invoice_counters TO authenticated;
GRANT ALL ON public.invoice_counters TO service_role;
ALTER TABLE public.invoice_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read invoice counters" ON public.invoice_counters
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- 3. payments
-- =====================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  method text NOT NULL DEFAULT 'bank_transfer',
  amount_eur numeric NOT NULL,
  reference text,
  note text,
  validated_at timestamptz NOT NULL DEFAULT now(),
  validated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payments" ON public.payments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- 4. stock_movements
-- =====================================================
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL,
  delta integer NOT NULL,
  reason text NOT NULL,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS stock_movements_slug_idx ON public.stock_movements(product_slug);
GRANT SELECT, INSERT ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read stock movements" ON public.stock_movements
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- 5. customer_notes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.customer_notes (
  email text PRIMARY KEY,
  note text NOT NULL DEFAULT '',
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_notes TO authenticated;
GRANT ALL ON public.customer_notes TO service_role;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage customer notes" ON public.customer_notes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- 6. page_views (tracking interne anonyme)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  session_id text,
  country text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS page_views_created_idx ON public.page_views(created_at DESC);
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read page views" ON public.page_views
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- 7. support_tickets + support_messages
-- =====================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text NOT NULL DEFAULT ('SAV-' || to_char(now(),'YYYYMMDD') || '-' || lpad(floor(random()*100000)::text, 5, '0')),
  email text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  order_number text,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'normal',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS support_tickets_email_idx ON public.support_tickets(email);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage tickets" ON public.support_tickets
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  author_role text NOT NULL,
  author_email text,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS support_messages_ticket_idx ON public.support_messages(ticket_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read messages" ON public.support_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at triggers
DROP TRIGGER IF EXISTS trg_touch_tickets ON public.support_tickets;
CREATE TRIGGER trg_touch_tickets BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================================================
-- 8. Fonction RPC pour réserver un numéro de facture
-- =====================================================
CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  y integer := extract(year from now())::int;
  seq integer;
BEGIN
  INSERT INTO public.invoice_counters(year, next_seq) VALUES (y, 1)
    ON CONFLICT (year) DO UPDATE SET next_seq = public.invoice_counters.next_seq + 1
    RETURNING next_seq INTO seq;
  RETURN 'FA-' || y::text || '-' || lpad(seq::text, 4, '0');
END $$;
REVOKE EXECUTE ON FUNCTION public.next_invoice_number() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_invoice_number() TO service_role;
