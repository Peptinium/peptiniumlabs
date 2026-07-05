CREATE POLICY "Users read tickets by matching email"
ON public.support_tickets
FOR SELECT
TO authenticated
USING (
  user_id IS NULL
  AND email IS NOT NULL
  AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);