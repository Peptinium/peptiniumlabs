-- 1. Add new columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'bank',
  ADD COLUMN IF NOT EXISTS payment_link text,
  ADD COLUMN IF NOT EXISTS payment_link_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz;

-- 2. Allowed payment methods
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('bank', 'card', 'crypto'));

-- 3. Allowed statuses
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending','payment_link_sent','paid','shipped','delivered','cancelled','refunded'));

-- 4. Update INSERT policy so guests can submit payment_method
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT
  WITH CHECK (
    ((user_id IS NULL) OR (user_id = auth.uid()))
    AND email IS NOT NULL
    AND (length(email) BETWEEN 3 AND 320)
    AND (length(first_name) BETWEEN 1 AND 100)
    AND (length(last_name) BETWEEN 1 AND 100)
    AND (length(address_line) BETWEEN 1 AND 300)
    AND (length(city) BETWEEN 1 AND 100)
    AND (length(postal_code) BETWEEN 1 AND 20)
    AND (total_eur >= 0 AND total_eur < 100000)
    AND status = 'pending'
    AND tracking_number IS NULL
    AND payment_validated_at IS NULL
    AND payment_validated_by IS NULL
    AND invoice_number IS NULL
    AND payment_link IS NULL
    AND payment_link_sent_at IS NULL
    AND shipped_at IS NULL
    AND payment_method IN ('bank','card','crypto')
  );