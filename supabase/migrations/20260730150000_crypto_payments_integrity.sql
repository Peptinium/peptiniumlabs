-- Intégrité de l'encaissement crypto.
--
-- L'attribution d'un paiement à une commande repose sur deux invariants qui
-- n'étaient garantis que par du code applicatif. Ils passent en contraintes de
-- base : une course entre deux clients simultanés ne peut plus les violer.

-- 0. Autoriser l'USDT sur Polygon. La contrainte d'origine ne listait que
--    BTC, USDC_POLYGON et LTC : toute facture USDT était rejetée en base.
ALTER TABLE public.crypto_payments
  DROP CONSTRAINT IF EXISTS crypto_payments_currency_check;
ALTER TABLE public.crypto_payments
  ADD CONSTRAINT crypto_payments_currency_check
  CHECK (currency IN ('BTC', 'USDC_POLYGON', 'USDT_POLYGON', 'LTC'));

-- 1. Une transaction ne peut régler QU'UNE facture.
--    Sans ça, un seul virement entrant pouvait faire passer plusieurs
--    commandes en « payée » — rien ne liait une transaction à une facture.
CREATE UNIQUE INDEX IF NOT EXISTS crypto_payments_tx_hash_uniq
  ON public.crypto_payments (tx_hash)
  WHERE tx_hash IS NOT NULL;

-- 2. Deux factures ouvertes de la même devise ne peuvent pas attendre le même
--    montant, puisque c'est le montant qui identifie la commande.
CREATE UNIQUE INDEX IF NOT EXISTS crypto_payments_open_amount_uniq
  ON public.crypto_payments (currency, amount_crypto)
  WHERE status IN ('pending', 'detected');
