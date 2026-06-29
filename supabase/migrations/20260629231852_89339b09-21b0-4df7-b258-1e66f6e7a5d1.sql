
-- Public storefront read for products
CREATE POLICY "Anyone can read products" ON public.products
  FOR SELECT TO anon, authenticated USING (true);

-- Guest checkout: allow anyone to create orders
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Anonymous analytics tracking
CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Guest support ticket creation
CREATE POLICY "Anyone can create support tickets" ON public.support_tickets
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow user-side replies on support messages (admins also covered via service_role)
CREATE POLICY "Anyone can post user support messages" ON public.support_messages
  FOR INSERT TO anon, authenticated WITH CHECK (author_role = 'user');

-- Lock down SECURITY DEFINER functions that should never be called by client roles.
-- has_role MUST remain executable so RLS policies can call it.
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.next_invoice_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
