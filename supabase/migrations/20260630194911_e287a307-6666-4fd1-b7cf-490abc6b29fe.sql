
-- 1. order_items: revoke public INSERT (only supabaseAdmin should insert)
REVOKE INSERT ON public.order_items FROM anon, authenticated;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- 2. orders: allow authenticated users to read their own orders
CREATE POLICY "Users read own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR lower(email) = lower(auth.jwt() ->> 'email'));

-- 3. support_tickets: allow users to read their own tickets
CREATE POLICY "Users read own tickets"
  ON public.support_tickets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR lower(email) = lower(auth.jwt() ->> 'email'));

-- 4. products: hide internal stock from anonymous users via a public view
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can read products" ON public.products;

-- Re-allow authenticated users to read full rows (admin UI uses this)
CREATE POLICY "Authenticated read products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

-- 5. product_variants: same treatment
DROP POLICY IF EXISTS "Anyone can read variants" ON public.product_variants;
DROP POLICY IF EXISTS "Variants readable by anon" ON public.product_variants;

CREATE POLICY "Authenticated read variants"
  ON public.product_variants FOR SELECT
  TO authenticated
  USING (true);

-- Revoke anon SELECT grants — base catalogue is shipped in src/data/products.ts,
-- DB rows are only consumed by server functions (supabaseAdmin, RLS bypass) and the admin UI.
REVOKE SELECT ON public.products FROM anon;
REVOKE SELECT ON public.product_variants FROM anon;

-- 6. Promo codes: server-side table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  rate numeric NOT NULL CHECK (rate >= 0 AND rate <= 1),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.promo_codes TO authenticated;
GRANT ALL ON public.promo_codes TO service_role;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage promo codes" ON public.promo_codes
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.promo_codes (code, rate, active)
  VALUES ('WELCOME10', 0.10, true)
  ON CONFLICT (code) DO NOTHING;
