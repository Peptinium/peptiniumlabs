
-- 1) Remove public INSERT policy on orders — placeOrder writes via service role
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- 2) Explicit deny on public INSERT to order_items (defense in depth; service role bypasses RLS)
DROP POLICY IF EXISTS "No public insert on order items" ON public.order_items;
CREATE POLICY "No public insert on order items"
  ON public.order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

-- 3) Ensure no public UPDATE/DELETE on order_items either
DROP POLICY IF EXISTS "No public update on order items" ON public.order_items;
CREATE POLICY "No public update on order items"
  ON public.order_items
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "No public delete on order items" ON public.order_items;
CREATE POLICY "No public delete on order items"
  ON public.order_items
  FOR DELETE
  TO anon, authenticated
  USING (false);

-- 4) Users can read their own order items (mirrors "Users read own orders")
DROP POLICY IF EXISTS "Users read own order items" ON public.order_items;
CREATE POLICY "Users read own order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.user_id IS NOT NULL
        AND o.user_id = auth.uid()
    )
  );
