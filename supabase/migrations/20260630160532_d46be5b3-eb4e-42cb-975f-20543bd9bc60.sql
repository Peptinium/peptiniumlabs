
INSERT INTO public.products (slug, name, price_eur, stock, low_stock_threshold, active) VALUES
  ('retatrutide', 'Retatrutide', 54.00, 0, 3, true),
  ('ghk-cu', 'GHK-Cu', 59.00, 0, 3, true),
  ('cjc-1295-ipamorelin', 'CJC-1295 + Ipamorelin', 64.00, 0, 3, true),
  ('semax', 'Semax', 44.00, 0, 3, true),
  ('ahk-cu', 'AHK-Cu', 34.99, 0, 3, true),
  ('bpc-157', 'BPC-157', 64.00, 0, 3, true),
  ('mt-1', 'Melanotan I', 59.00, 0, 3, true),
  ('mt-2', 'Melanotan II', 54.99, 0, 3, true),
  ('klow', 'KLOW', 159.99, 0, 3, true),
  ('nad-plus', 'NAD+', 109.00, 0, 3, true),
  ('tesamoreline', 'Tesamorelin', 119.00, 0, 3, true),
  ('eau-bacteriostatique', 'Eau bactériostatique', 11.90, 0, 5, true),
  ('dsip', 'DSIP', 39.00, 0, 3, true),
  ('epithalon', 'Epithalon', 44.00, 0, 3, true),
  ('kpv', 'KPV', 44.00, 0, 3, true),
  ('mots-c', 'MOTS-c', 69.00, 0, 3, true),
  ('oxytocin', 'Oxytocine', 49.00, 0, 3, true),
  ('pt-141', 'PT-141', 54.00, 0, 3, true),
  ('selank', 'Selank', 44.00, 0, 3, true),
  ('snap-8', 'SNAP-8', 49.00, 0, 3, true),
  ('tb-500', 'TB-500', 54.00, 0, 3, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price_eur = EXCLUDED.price_eur,
  active = EXCLUDED.active;
