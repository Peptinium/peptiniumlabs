
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

-- orders
DROP POLICY IF EXISTS "Admins read orders" ON public.orders;
DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Admins read orders" ON public.orders FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL AND length(email) BETWEEN 3 AND 320
    AND length(first_name) BETWEEN 1 AND 100
    AND length(last_name) BETWEEN 1 AND 100
    AND length(address_line) BETWEEN 1 AND 300
    AND length(city) BETWEEN 1 AND 100
    AND length(postal_code) BETWEEN 1 AND 20
    AND total_eur >= 0 AND total_eur < 100000
    AND status = 'pending'
    AND tracking_number IS NULL
    AND payment_validated_at IS NULL
    AND payment_validated_by IS NULL
    AND invoice_number IS NULL
  );

-- page_views
DROP POLICY IF EXISTS "Admins read page views" ON public.page_views;
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Admins read page views" ON public.page_views FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(path) BETWEEN 1 AND 2048
    AND (referrer IS NULL OR length(referrer) <= 2048)
    AND (session_id IS NULL OR length(session_id) <= 128)
    AND (country IS NULL OR length(country) <= 8)
    AND (user_agent IS NULL OR length(user_agent) <= 1024)
  );

-- products
DROP POLICY IF EXISTS "Admins delete products" ON public.products;
DROP POLICY IF EXISTS "Admins insert products" ON public.products;
DROP POLICY IF EXISTS "Admins update products" ON public.products;
CREATE POLICY "Admins delete products" ON public.products FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins insert products" ON public.products FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update products" ON public.products FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- support_messages
DROP POLICY IF EXISTS "Admins read messages" ON public.support_messages;
CREATE POLICY "Admins read messages" ON public.support_messages FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- support_tickets
DROP POLICY IF EXISTS "Admins manage tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Anyone can create support tickets" ON public.support_tickets;
CREATE POLICY "Admins manage tickets" ON public.support_tickets FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can create support tickets" ON public.support_tickets FOR INSERT TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 3 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(subject) BETWEEN 1 AND 500
    AND status = 'open'
    AND priority IN ('low','normal','high')
  );

-- customer_notes
DROP POLICY IF EXISTS "Admins manage customer notes" ON public.customer_notes;
CREATE POLICY "Admins manage customer notes" ON public.customer_notes FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- payments
DROP POLICY IF EXISTS "Admins manage payments" ON public.payments;
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- invoice_counters
DROP POLICY IF EXISTS "Admins read invoice counters" ON public.invoice_counters;
CREATE POLICY "Admins read invoice counters" ON public.invoice_counters FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- order_items
DROP POLICY IF EXISTS "Admins read order items" ON public.order_items;
CREATE POLICY "Admins read order items" ON public.order_items FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- stock_movements
DROP POLICY IF EXISTS "Admins read stock movements" ON public.stock_movements;
CREATE POLICY "Admins read stock movements" ON public.stock_movements FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- user_roles
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role)));
CREATE POLICY "Block client role inserts" ON public.user_roles FOR INSERT TO anon, authenticated
  WITH CHECK (false);
CREATE POLICY "Block client role updates" ON public.user_roles FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);
CREATE POLICY "Block client role deletes" ON public.user_roles FOR DELETE TO anon, authenticated
  USING (false);

-- Drop the public helper now that nothing depends on it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
