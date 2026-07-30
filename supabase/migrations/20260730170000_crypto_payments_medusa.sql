-- Aligne l'encaissement crypto sur Medusa.
--
-- Les commandes réelles vivent dans Medusa (50 lignes) et non dans
-- public.orders (5 lignes résiduelles). placeOrder crée un draft order Medusa
-- et utilise son identifiant — un ULID préfixé du type `order_01KY...`.
--
-- Or crypto_payments.order_id était `uuid` avec une clé étrangère vers
-- public.orders : chaque commande crypto réelle échouait à l'insertion
-- (« invalid input syntax for type uuid »), l'erreur était avalée par le
-- try/catch, et le client recevait son email sans adresse ni montant à payer.
--
-- Changer le type ne suffit pas : la contrainte exigerait quand même une ligne
-- correspondante dans public.orders, et il n'en existe aucune au format
-- `order_%`. C'est donc la contrainte elle-même qui doit disparaître —
-- public.orders sort du circuit, comme c'est déjà le cas pour Sushipp.

-- 1. La clé étrangère vers public.orders n'a plus de sens : la source de
--    vérité des commandes est Medusa.
ALTER TABLE public.crypto_payments
  DROP CONSTRAINT IF EXISTS crypto_payments_order_id_fkey;

-- 2. Cette policy joignait public.orders sur order_id pour vérifier que le
--    client est propriétaire de la commande. Elle ne peut plus jamais
--    correspondre — les commandes sont dans Medusa — et elle bloque le
--    changement de type. Le client consulte sa facture via les server
--    functions (service_role, qui contourne RLS), jamais en direct.
DROP POLICY IF EXISTS "Users read own crypto payments" ON public.crypto_payments;

-- 3. Accueillir les identifiants Medusa (`order_01KY...`).
ALTER TABLE public.crypto_payments
  ALTER COLUMN order_id TYPE text USING order_id::text;

-- 3. Garde-fou d'idempotence pour la notification admin. Il vivait sur
--    public.orders.notified_paid_at, table qui n'est plus impliquée.
ALTER TABLE public.crypto_payments
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;

-- Les index d'intégrité posés précédemment restent valides : ils ne portent
-- pas sur order_id.
