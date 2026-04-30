-- Helpers
CREATE OR REPLACE FUNCTION public.has_crm_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin'::public.app_role, 'crm_write'::public.app_role, 'crm_read'::public.app_role)
  )
$$;

CREATE OR REPLACE FUNCTION public.has_crm_write(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin'::public.app_role, 'crm_write'::public.app_role)
  )
$$;

-- crm_clients
CREATE TABLE public.crm_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  client_type text NOT NULL DEFAULT 'business' CHECK (client_type IN ('business','individual')),
  name text NOT NULL,
  segment text NOT NULL DEFAULT 'other' CHECK (segment IN ('property_asset_manager','retail_operator','hospitality','corporate_occupier','other')),
  sub_sector text,
  website text, email text, phone text, linkedin_url text,
  address_line_1 text, address_line_2 text, city text, postcode text, country text DEFAULT 'United Kingdom',
  primary_contact_name text, primary_contact_role text, primary_contact_email text, primary_contact_phone text,
  primary_admin_user_id uuid,
  form_source text, origin_metadata jsonb,
  staff_size_band text CHECK (staff_size_band IN ('1-10','11-50','51-200','201-500','501-1000','1000+')),
  annual_revenue_band text CHECK (annual_revenue_band IN ('<£1M','£1M-£5M','£5M-£25M','£25M-£100M','£100M-£500M','£500M+','unknown')),
  tech_stack text[] DEFAULT '{}',
  property_count integer, total_floor_area_sqft integer,
  tenure_mix text CHECK (tenure_mix IN ('all_leasehold','mostly_leasehold','mixed','mostly_freehold','all_freehold','unknown')),
  geographic_spread text[] DEFAULT '{}',
  estimated_annual_property_spend_gbp numeric,
  upcoming_lease_events_12m integer,
  compliance_focus text[] DEFAULT '{}',
  subscription_status text DEFAULT 'not_subscribed' CHECK (subscription_status IN ('trial','active','paused','cancelled','not_subscribed')),
  subscription_plan text,
  contract_start_date date, contract_end_date date,
  billing_cycle text CHECK (billing_cycle IN ('monthly','quarterly','annual','custom')),
  contracted_monthly_value_gbp numeric, licensed_user_seats integer,
  pipeline_stage text NOT NULL DEFAULT 'new_enquiry' CHECK (pipeline_stage IN ('new_enquiry','contacted','qualified','in_discussion','proposal_sent','won','lost','on_hold')),
  interest_level text NOT NULL DEFAULT 'cold' CHECK (interest_level IN ('cold','warm','hot')),
  lead_source text CHECK (lead_source IN ('website','inbound_call','referral_client','referral_partner','linkedin','event_conference','cold_outreach','webinar_content','pr_press','other')),
  lead_source_detail text,
  estimated_deal_value_gbp numeric,
  probability_to_close integer CHECK (probability_to_close BETWEEN 0 AND 100),
  expected_close_date date,
  first_contact_date date DEFAULT CURRENT_DATE,
  last_contact_date date,
  next_action text, next_action_date date,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'lead' CHECK (status IN ('lead','prospect','active','on_hold','churned','archived')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
CREATE INDEX idx_crm_clients_owner ON public.crm_clients(owner_id);
CREATE INDEX idx_crm_clients_stage ON public.crm_clients(pipeline_stage);
CREATE INDEX idx_crm_clients_status ON public.crm_clients(status);
CREATE INDEX idx_crm_clients_segment ON public.crm_clients(segment);
CREATE INDEX idx_crm_clients_name ON public.crm_clients(lower(name));

ALTER TABLE public.crm_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM users can view clients" ON public.crm_clients FOR SELECT USING (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM writers can insert clients" ON public.crm_clients FOR INSERT WITH CHECK (public.has_crm_write(auth.uid()));
CREATE POLICY "CRM writers can update clients" ON public.crm_clients FOR UPDATE USING (public.has_crm_write(auth.uid())) WITH CHECK (public.has_crm_write(auth.uid()));
CREATE POLICY "Admins can delete clients" ON public.crm_clients FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- crm_contacts
CREATE TABLE public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.crm_clients(id) ON DELETE CASCADE,
  full_name text NOT NULL, job_title text, role_description text,
  email text, phone text, linkedin_url text,
  is_primary boolean NOT NULL DEFAULT false, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_crm_contacts_client ON public.crm_contacts(client_id);
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM users can view contacts" ON public.crm_contacts FOR SELECT USING (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM writers can insert contacts" ON public.crm_contacts FOR INSERT WITH CHECK (public.has_crm_write(auth.uid()));
CREATE POLICY "CRM writers can update contacts" ON public.crm_contacts FOR UPDATE USING (public.has_crm_write(auth.uid())) WITH CHECK (public.has_crm_write(auth.uid()));
CREATE POLICY "CRM writers can delete contacts" ON public.crm_contacts FOR DELETE USING (public.has_crm_write(auth.uid()));

-- crm_client_users
CREATE TABLE public.crm_client_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.crm_clients(id) ON DELETE CASCADE,
  full_name text NOT NULL, email text NOT NULL,
  job_title text,
  seniority_level text CHECK (seniority_level IN ('c_suite','director','head_of','senior_manager','manager','analyst_specialist','associate','other')),
  department text CHECK (department IN ('finance','property_estates','operations','it_technology','legal','procurement','asset_management','leasing','compliance','executive','hr','marketing','other')),
  phone text, linkedin_url text,
  platform_role text NOT NULL DEFAULT 'standard_user' CHECK (platform_role IN ('account_admin','power_user','standard_user','viewer')),
  is_primary_admin boolean NOT NULL DEFAULT false,
  platform_user_id text,
  first_seen_at date, last_active_at date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','invited','disabled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_crm_client_users_client ON public.crm_client_users(client_id);
CREATE UNIQUE INDEX idx_crm_client_users_one_primary ON public.crm_client_users(client_id) WHERE is_primary_admin = true;
ALTER TABLE public.crm_client_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM users can view client_users" ON public.crm_client_users FOR SELECT USING (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM writers can insert client_users" ON public.crm_client_users FOR INSERT WITH CHECK (public.has_crm_write(auth.uid()));
CREATE POLICY "CRM writers can update client_users" ON public.crm_client_users FOR UPDATE USING (public.has_crm_write(auth.uid())) WITH CHECK (public.has_crm_write(auth.uid()));
CREATE POLICY "CRM writers can delete client_users" ON public.crm_client_users FOR DELETE USING (public.has_crm_write(auth.uid()));

ALTER TABLE public.crm_clients
  ADD CONSTRAINT crm_clients_primary_admin_fk
  FOREIGN KEY (primary_admin_user_id) REFERENCES public.crm_client_users(id) ON DELETE SET NULL;

-- crm_notes
CREATE TABLE public.crm_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.crm_clients(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_crm_notes_client ON public.crm_notes(client_id);
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM users can view notes" ON public.crm_notes FOR SELECT USING (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM writers can insert notes" ON public.crm_notes FOR INSERT WITH CHECK (public.has_crm_write(auth.uid()) AND auth.uid() = created_by);
CREATE POLICY "CRM writers can update own notes" ON public.crm_notes FOR UPDATE USING (public.has_crm_write(auth.uid()) AND auth.uid() = created_by);
CREATE POLICY "Delete own notes or admin any" ON public.crm_notes FOR DELETE USING ((public.has_crm_write(auth.uid()) AND auth.uid() = created_by) OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- crm_activity_log
CREATE TABLE public.crm_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.crm_clients(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type text NOT NULL, entity_id uuid,
  action_type text NOT NULL, description text, metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_crm_activity_client ON public.crm_activity_log(client_id, created_at DESC);
ALTER TABLE public.crm_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM users can view activity" ON public.crm_activity_log FOR SELECT USING (public.has_crm_access(auth.uid()));
CREATE POLICY "CRM writers can insert activity" ON public.crm_activity_log FOR INSERT WITH CHECK (public.has_crm_write(auth.uid()));

-- Triggers: updated_at
CREATE TRIGGER trg_crm_clients_updated_at BEFORE UPDATE ON public.crm_clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_crm_contacts_updated_at BEFORE UPDATE ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_crm_client_users_updated_at BEFORE UPDATE ON public.crm_client_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_crm_notes_updated_at BEFORE UPDATE ON public.crm_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Single primary admin enforcement
CREATE OR REPLACE FUNCTION public.crm_enforce_single_primary_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.is_primary_admin THEN
    UPDATE public.crm_client_users SET is_primary_admin = false
      WHERE client_id = NEW.client_id AND id <> NEW.id AND is_primary_admin = true;
    UPDATE public.crm_clients SET primary_admin_user_id = NEW.id WHERE id = NEW.client_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.is_primary_admin AND NOT NEW.is_primary_admin THEN
    UPDATE public.crm_clients SET primary_admin_user_id = NULL
      WHERE id = NEW.client_id AND primary_admin_user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_crm_client_users_primary_admin
  AFTER INSERT OR UPDATE OF is_primary_admin ON public.crm_client_users
  FOR EACH ROW EXECUTE FUNCTION public.crm_enforce_single_primary_admin();

-- Activity log triggers on clients
CREATE OR REPLACE FUNCTION public.crm_log_client_changes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.crm_activity_log (client_id, user_id, entity_type, entity_id, action_type, description)
    VALUES (NEW.id, auth.uid(), 'client', NEW.id, 'created', 'Client created: ' || NEW.name);
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF NEW.pipeline_stage IS DISTINCT FROM OLD.pipeline_stage THEN
      INSERT INTO public.crm_activity_log (client_id, user_id, entity_type, entity_id, action_type, description, metadata)
      VALUES (NEW.id, auth.uid(), 'client', NEW.id, 'stage_changed',
              'Pipeline stage: ' || OLD.pipeline_stage || ' → ' || NEW.pipeline_stage,
              jsonb_build_object('from', OLD.pipeline_stage, 'to', NEW.pipeline_stage));
    END IF;
    IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
      INSERT INTO public.crm_activity_log (client_id, user_id, entity_type, entity_id, action_type, description, metadata)
      VALUES (NEW.id, auth.uid(), 'client', NEW.id, 'owner_changed', 'Owner changed',
              jsonb_build_object('from', OLD.owner_id, 'to', NEW.owner_id));
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.crm_activity_log (client_id, user_id, entity_type, entity_id, action_type, description, metadata)
      VALUES (NEW.id, auth.uid(), 'client', NEW.id, 'status_changed',
              'Status: ' || OLD.status || ' → ' || NEW.status,
              jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_crm_clients_activity
  AFTER INSERT OR UPDATE ON public.crm_clients
  FOR EACH ROW EXECUTE FUNCTION public.crm_log_client_changes();