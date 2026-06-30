
-- 1) order_items: ensure no permissive INSERT policy exists (legacy "Anyone can create order items")
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Public insert order items" ON public.order_items;
REVOKE INSERT ON public.order_items FROM anon, authenticated;
GRANT ALL ON public.order_items TO service_role;

-- 2) products & product_variants: allow anonymous read for storefront browsing
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_variants TO anon;

DROP POLICY IF EXISTS "Anon read products" ON public.products;
CREATE POLICY "Anon read products" ON public.products
  FOR SELECT TO anon USING (active = true);

DROP POLICY IF EXISTS "Anon read variants" ON public.product_variants;
CREATE POLICY "Anon read variants" ON public.product_variants
  FOR SELECT TO anon USING (true);

-- 3) support_messages: scope INSERT policy to authenticated only
DROP POLICY IF EXISTS "Users post messages on own tickets" ON public.support_messages;
CREATE POLICY "Users post messages on own tickets" ON public.support_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    author_role = 'user'
    AND EXISTS (
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = support_messages.ticket_id
        AND (
          t.user_id = auth.uid()
          OR (
            (auth.jwt() ->> 'email') IS NOT NULL
            AND lower(t.email) = lower(auth.jwt() ->> 'email')
          )
        )
    )
  );
REVOKE INSERT ON public.support_messages FROM anon;
