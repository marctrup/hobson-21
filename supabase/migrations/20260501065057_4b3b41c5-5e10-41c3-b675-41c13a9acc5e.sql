-- 1. Ensure residential_occupier is in the allowed segment values (idempotent)
ALTER TABLE public.crm_clients DROP CONSTRAINT IF EXISTS crm_clients_segment_check;
ALTER TABLE public.crm_clients ADD CONSTRAINT crm_clients_segment_check
  CHECK (segment = ANY (ARRAY[
    'property_asset_manager','retail_operator','hospitality',
    'corporate_occupier','residential_occupier','other'
  ]));

-- 2. Lookup table
CREATE TABLE public.crm_sub_sectors (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector      text NOT NULL,
  label       text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT crm_sub_sectors_sector_check CHECK (sector = ANY (ARRAY[
    'property_asset_manager','retail_operator','hospitality',
    'corporate_occupier','residential_occupier','other'
  ])),
  CONSTRAINT crm_sub_sectors_sector_label_unique UNIQUE (sector, label)
);
CREATE INDEX crm_sub_sectors_sector_order_label_idx
  ON public.crm_sub_sectors (sector, sort_order, label);

CREATE TRIGGER set_crm_sub_sectors_updated_at
  BEFORE UPDATE ON public.crm_sub_sectors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.crm_sub_sectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM users can view sub_sectors" ON public.crm_sub_sectors
  FOR SELECT USING (public.has_crm_access(auth.uid()));
CREATE POLICY "Admins can insert sub_sectors" ON public.crm_sub_sectors
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update sub_sectors" ON public.crm_sub_sectors
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete sub_sectors" ON public.crm_sub_sectors
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. Junction table
CREATE TABLE public.crm_client_sub_sectors (
  client_id      uuid NOT NULL REFERENCES public.crm_clients(id) ON DELETE CASCADE,
  sub_sector_id  uuid NOT NULL REFERENCES public.crm_sub_sectors(id) ON DELETE RESTRICT,
  created_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (client_id, sub_sector_id)
);
CREATE INDEX crm_client_sub_sectors_sub_sector_idx
  ON public.crm_client_sub_sectors (sub_sector_id);

ALTER TABLE public.crm_client_sub_sectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM users can view client_sub_sectors" ON public.crm_client_sub_sectors
  FOR SELECT USING (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM writers can insert client_sub_sectors" ON public.crm_client_sub_sectors
  FOR INSERT WITH CHECK (public.has_crm_write(auth.uid()));
CREATE POLICY "CRM writers can delete client_sub_sectors" ON public.crm_client_sub_sectors
  FOR DELETE USING (public.has_crm_write(auth.uid()));

-- 4. Seed data
INSERT INTO public.crm_sub_sectors (sector, label, sort_order) VALUES
  ('property_asset_manager', 'Retail',                   1),
  ('property_asset_manager', 'Hospitality and leisure',  2),
  ('property_asset_manager', 'Industrial estates',       3),
  ('property_asset_manager', 'Office blocks',            4),
  ('property_asset_manager', 'Student accommodation',    5),
  ('retail_operator',        'Supermarkets',             1),
  ('retail_operator',        'Gyms',                     2),
  ('retail_operator',        'Clothing',                 3),
  ('hospitality',            'Restaurants',              1),
  ('hospitality',            'Pubs',                     2),
  ('hospitality',            'Coffee shops',             3);