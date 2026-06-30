
-- Auto-sync products.stock = sum(product_variants.stock)
CREATE OR REPLACE FUNCTION public.sync_product_stock_from_variants()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pid uuid;
  total integer;
BEGIN
  pid := COALESCE(NEW.product_id, OLD.product_id);
  SELECT COALESCE(SUM(stock), 0) INTO total FROM public.product_variants WHERE product_id = pid;
  UPDATE public.products SET stock = total, updated_at = now() WHERE id = pid;
  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS trg_sync_product_stock ON public.product_variants;
CREATE TRIGGER trg_sync_product_stock
AFTER INSERT OR UPDATE OR DELETE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.sync_product_stock_from_variants();

-- Public read policy for variants (catalogue browsing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_variants' AND policyname='Variants readable by anon'
  ) THEN
    CREATE POLICY "Variants readable by anon" ON public.product_variants FOR SELECT TO anon USING (true);
  END IF;
END $$;
GRANT SELECT ON public.product_variants TO anon;

-- Seed variants from catalog
WITH src(slug, dosage, price, stock, sold_out, position) AS (VALUES
  ('retatrutide','5 mg',54.0,0,true,0),
  ('retatrutide','10 mg',89.0,170,false,1),
  ('retatrutide','20 mg',149.0,10,false,2),
  ('ghk-cu','50 mg',59.0,10,false,0),
  ('ghk-cu','100 mg',99.0,9,false,1),
  ('cjc-1295-ipamorelin','5 mg + 5 mg',64.0,7,false,0),
  ('semax','5 mg',44.0,8,false,0),
  ('ahk-cu','50 mg',34.99,0,true,0),
  ('ahk-cu','100 mg',49.99,0,false,1),
  ('bpc-157','15 mg',64.0,8,false,0),
  ('mt-1','10 mg',59.0,7,false,0),
  ('mt-2','10 mg',54.99,10,false,0),
  ('klow','80 mg',159.99,1,true,0),
  ('nad-plus','1000 mg',109.0,9,false,0),
  ('tesamoreline','10 mg',119.0,10,true,0),
  ('eau-bacteriostatique','10 mL',11.9,60,false,0),
  ('dsip','10 mg',39.0,8,false,0),
  ('epithalon','10 mg',44.0,3,false,0),
  ('kpv','10 mg',44.0,9,false,0),
  ('mots-c','10 mg',69.0,9,false,0),
  ('oxytocin','10 mg',49.0,9,false,0),
  ('pt-141','10 mg',54.0,9,false,0),
  ('selank','5 mg',44.0,8,false,0),
  ('snap-8','10 mg',49.0,9,false,0),
  ('tb-500','5 mg',54.0,9,false,0)
)
INSERT INTO public.product_variants (product_id, dosage, price_eur, stock, low_stock_threshold, sold_out, position)
SELECT p.id, s.dosage, s.price, s.stock, 5, s.sold_out, s.position
FROM src s
JOIN public.products p ON p.slug = s.slug
ON CONFLICT DO NOTHING;
