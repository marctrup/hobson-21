ALTER TABLE public.crm_clients DROP COLUMN subscription_status;
ALTER TABLE public.crm_clients DROP COLUMN subscription_plan;

ALTER TABLE public.crm_clients
  ADD COLUMN subscription_tier text
  CHECK (subscription_tier IS NULL OR subscription_tier IN (
    'free_pilot',
    'tier_1',
    'tier_2',
    'tier_3',
    'tier_4',
    'custom_enterprise'
  ));