
ALTER TABLE public.promo_codes
  ADD COLUMN IF NOT EXISTS amount_off_eur numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS free_shipping boolean NOT NULL DEFAULT false;

ALTER TABLE public.promo_codes
  ALTER COLUMN rate SET DEFAULT 0;

INSERT INTO public.promo_codes (code, rate, amount_off_eur, free_shipping, active)
VALUES ('NENOU8', 0, 8, true, true)
ON CONFLICT (code) DO UPDATE
  SET rate = EXCLUDED.rate,
      amount_off_eur = EXCLUDED.amount_off_eur,
      free_shipping = EXCLUDED.free_shipping,
      active = EXCLUDED.active;
