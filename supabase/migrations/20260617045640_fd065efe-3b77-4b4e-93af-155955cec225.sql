
-- 1. Remove permissive public INSERT policies on orders/order_items.
-- placeOrder server function uses the service role, which bypasses RLS, so these
-- public policies are unnecessary and let anyone insert arbitrary rows.
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

REVOKE INSERT ON public.orders FROM anon, authenticated;
REVOKE INSERT ON public.order_items FROM anon, authenticated;

-- 2. Lock down has_role(): only signed-in users and the service role can execute.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
