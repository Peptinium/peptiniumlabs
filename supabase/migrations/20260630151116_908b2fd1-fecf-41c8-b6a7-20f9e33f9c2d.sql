
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders
FOR INSERT
WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid())
  AND (email IS NOT NULL)
  AND (length(email) >= 3 AND length(email) <= 320)
  AND (length(first_name) >= 1 AND length(first_name) <= 100)
  AND (length(last_name) >= 1 AND length(last_name) <= 100)
  AND (length(address_line) >= 1 AND length(address_line) <= 300)
  AND (length(city) >= 1 AND length(city) <= 100)
  AND (length(postal_code) >= 1 AND length(postal_code) <= 20)
  AND (total_eur >= 0 AND total_eur < 100000)
  AND (status = 'pending')
  AND (tracking_number IS NULL)
  AND (payment_validated_at IS NULL)
  AND (payment_validated_by IS NULL)
  AND (invoice_number IS NULL)
);

DROP POLICY IF EXISTS "Anyone can post user support messages" ON public.support_messages;
CREATE POLICY "Users post messages on own tickets" ON public.support_messages
FOR INSERT
WITH CHECK (
  author_role = 'user'
  AND EXISTS (
    SELECT 1 FROM public.support_tickets t
    WHERE t.id = support_messages.ticket_id
      AND (
        t.user_id = auth.uid()
        OR (
          auth.jwt() ->> 'email' IS NOT NULL
          AND lower(t.email) = lower(auth.jwt() ->> 'email')
        )
      )
  )
);
