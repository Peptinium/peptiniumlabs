DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
REVOKE SELECT ON public.products FROM anon, PUBLIC;
CREATE POLICY "Authenticated can read products" ON public.products FOR SELECT TO authenticated USING (true);