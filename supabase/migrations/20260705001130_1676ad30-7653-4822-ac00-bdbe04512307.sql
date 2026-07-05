
CREATE TABLE public.crypto_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  currency TEXT NOT NULL CHECK (currency IN ('BTC','USDC_POLYGON','LTC')),
  wallet_address TEXT NOT NULL,
  amount_eur NUMERIC(12,2) NOT NULL,
  rate_eur_per_unit NUMERIC(24,10) NOT NULL,
  amount_crypto NUMERIC(30,10) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','detected','confirmed','expired','failed')),
  tx_hash TEXT,
  detected_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX crypto_payments_order_id_idx ON public.crypto_payments(order_id);
CREATE INDEX crypto_payments_status_expires_idx ON public.crypto_payments(status, expires_at);
CREATE INDEX crypto_payments_currency_amount_idx ON public.crypto_payments(currency, amount_crypto);

GRANT SELECT ON public.crypto_payments TO authenticated;
GRANT ALL ON public.crypto_payments TO service_role;

ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own crypto payments"
  ON public.crypto_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = crypto_payments.order_id
        AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins read all crypto payments"
  ON public.crypto_payments
  FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_crypto_payments_updated
  BEFORE UPDATE ON public.crypto_payments
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
