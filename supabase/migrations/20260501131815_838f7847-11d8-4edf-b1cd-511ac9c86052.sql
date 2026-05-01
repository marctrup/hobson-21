ALTER TABLE public.crm_clients DROP COLUMN annual_revenue_band;

ALTER TABLE public.crm_clients
  ADD COLUMN champion_role text
  CHECK (champion_role IS NULL OR champion_role IN (
    'ceo',
    'cfo',
    'coo',
    'managing_director',
    'director',
    'head_of_property',
    'asset_manager',
    'property_manager',
    'estates_manager',
    'portfolio_manager',
    'procurement',
    'finance_director',
    'general_counsel',
    'other'
  ));