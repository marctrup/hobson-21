-- ============================================================
-- 1. ENUMS
-- ============================================================
CREATE TYPE public.comm_channel AS ENUM (
  'email', 'call', 'meeting', 'video_call', 'sms',
  'whatsapp', 'linkedin_message', 'letter', 'other'
);

CREATE TYPE public.comm_direction AS ENUM ('inbound', 'outbound', 'internal');

CREATE TYPE public.comm_sentiment AS ENUM ('positive', 'neutral', 'negative');

CREATE TYPE public.participant_role AS ENUM (
  'to', 'from', 'cc', 'bcc', 'attendee', 'organiser'
);

CREATE TYPE public.participant_kind AS ENUM (
  'contact', 'platform_user', 'workspace_member', 'external'
);

-- ============================================================
-- 2. SERVER-SIDE HTML SANITISATION (defence-in-depth)
-- ============================================================
CREATE OR REPLACE FUNCTION public.crm_sanitise_email_html(p_html text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v text := p_html;
BEGIN
  IF v IS NULL THEN RETURN NULL; END IF;
  v := regexp_replace(v, '<\s*script\b[^>]*>.*?<\s*/\s*script\s*>', '', 'gis');
  v := regexp_replace(v, '<\s*style\b[^>]*>.*?<\s*/\s*style\s*>', '', 'gis');
  v := regexp_replace(v, '<\s*iframe\b[^>]*>.*?<\s*/\s*iframe\s*>', '', 'gis');
  v := regexp_replace(v, '<\s*object\b[^>]*>.*?<\s*/\s*object\s*>', '', 'gis');
  v := regexp_replace(v, '<\s*embed\b[^>]*/?>', '', 'gi');
  v := regexp_replace(v, '<\s*/?\s*(script|iframe|object|embed|style)\b[^>]*>', '', 'gi');
  v := regexp_replace(v, '\son[a-z]+\s*=\s*"[^"]*"', '', 'gi');
  v := regexp_replace(v, '\son[a-z]+\s*=\s*''[^'']*''', '', 'gi');
  v := regexp_replace(v, '\son[a-z]+\s*=\s*[^\s>]+', '', 'gi');
  v := regexp_replace(v, '(href|src|xlink:href|formaction|action)\s*=\s*"(\s*(javascript|vbscript|data\s*:\s*text/html))[^"]*"',
                      '\1="#"', 'gi');
  v := regexp_replace(v, '(href|src|xlink:href|formaction|action)\s*=\s*''(\s*(javascript|vbscript|data\s*:\s*text/html))[^'']*''',
                      '\1=''#''', 'gi');
  RETURN v;
END;
$$;

-- ============================================================
-- 3. COMMUNICATIONS
-- ============================================================
CREATE TABLE public.communications (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                uuid NOT NULL,
  channel                  public.comm_channel NOT NULL,
  direction                public.comm_direction NOT NULL,
  subject                  text,
  summary                  text,
  body_plain               text,
  body_html                text,
  occurred_at              timestamptz NOT NULL,
  logged_by                uuid,
  is_important             boolean NOT NULL DEFAULT false,
  sentiment                public.comm_sentiment,
  needs_review             boolean NOT NULL DEFAULT false,
  email_from               text,
  email_to                 text[],
  email_cc                 text[],
  email_message_id         text,
  call_duration_seconds    integer,
  meeting_location         text,
  linked_task_id           uuid,
  pending_follow_up_note   text,
  fts                      tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(subject, '')),    'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')),    'B') ||
    setweight(to_tsvector('english', coalesce(body_plain, '')), 'C')
  ) STORED,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX comm_client_occurred_idx
  ON public.communications (client_id, occurred_at DESC);
CREATE INDEX comm_channel_idx     ON public.communications (channel);
CREATE INDEX comm_direction_idx   ON public.communications (direction);
CREATE INDEX comm_needs_review_idx
  ON public.communications (needs_review) WHERE needs_review = true;
CREATE INDEX comm_fts_idx         ON public.communications USING GIN (fts);
CREATE UNIQUE INDEX comm_email_message_id_uniq
  ON public.communications (email_message_id) WHERE email_message_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.crm_communications_sanitise_html()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.body_html := public.crm_sanitise_email_html(NEW.body_html);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_communications_sanitise_html
  BEFORE INSERT OR UPDATE OF body_html ON public.communications
  FOR EACH ROW EXECUTE FUNCTION public.crm_communications_sanitise_html();

CREATE TRIGGER trg_communications_updated_at
  BEFORE UPDATE ON public.communications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.crm_comm_update_last_contact_date()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.direction = 'internal'::public.comm_direction THEN
    RETURN NEW;
  END IF;
  UPDATE public.crm_clients
     SET last_contact_date = NEW.occurred_at::date
   WHERE id = NEW.client_id
     AND (last_contact_date IS NULL OR last_contact_date < NEW.occurred_at::date);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_comm_update_last_contact_date
  AFTER INSERT ON public.communications
  FOR EACH ROW EXECUTE FUNCTION public.crm_comm_update_last_contact_date();

-- ============================================================
-- 4. COMMUNICATION_PARTICIPANTS
-- ============================================================
CREATE TABLE public.communication_participants (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id     uuid NOT NULL REFERENCES public.communications(id) ON DELETE CASCADE,
  role_in_comm         public.participant_role NOT NULL,
  kind                 public.participant_kind NOT NULL,
  contact_id           uuid,
  platform_user_id     uuid,
  workspace_member_id  uuid,
  external_name        text,
  external_email       text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT participant_kind_matches_ref CHECK (
    (kind = 'contact'          AND contact_id          IS NOT NULL AND platform_user_id IS NULL AND workspace_member_id IS NULL AND external_name IS NULL) OR
    (kind = 'platform_user'    AND platform_user_id    IS NOT NULL AND contact_id       IS NULL AND workspace_member_id IS NULL AND external_name IS NULL) OR
    (kind = 'workspace_member' AND workspace_member_id IS NOT NULL AND contact_id       IS NULL AND platform_user_id    IS NULL AND external_name IS NULL) OR
    (kind = 'external'         AND external_name       IS NOT NULL AND contact_id       IS NULL AND platform_user_id    IS NULL AND workspace_member_id IS NULL)
  )
);

CREATE INDEX comm_participants_comm_idx ON public.communication_participants (communication_id);
CREATE INDEX comm_participants_contact_idx          ON public.communication_participants (contact_id)          WHERE contact_id IS NOT NULL;
CREATE INDEX comm_participants_platform_user_idx    ON public.communication_participants (platform_user_id)    WHERE platform_user_id IS NOT NULL;
CREATE INDEX comm_participants_workspace_member_idx ON public.communication_participants (workspace_member_id) WHERE workspace_member_id IS NOT NULL;

-- ============================================================
-- 5. COMMUNICATION_ATTACHMENTS
-- ============================================================
CREATE TABLE public.communication_attachments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id  uuid NOT NULL REFERENCES public.communications(id) ON DELETE CASCADE,
  file_name         text NOT NULL,
  mime_type         text,
  size_bytes        bigint,
  storage_path      text NOT NULL,
  uploaded_by       uuid,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX comm_attachments_comm_idx ON public.communication_attachments (communication_id);

-- ============================================================
-- 6. RLS
-- ============================================================
ALTER TABLE public.communications              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_participants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_attachments   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM users can view communications"
  ON public.communications FOR SELECT
  USING (public.has_crm_access(auth.uid()));

CREATE POLICY "CRM writers can insert communications"
  ON public.communications FOR INSERT
  WITH CHECK (public.has_crm_write(auth.uid()) AND auth.uid() = logged_by);

CREATE POLICY "CRM writers can update communications"
  ON public.communications FOR UPDATE
  USING (public.has_crm_write(auth.uid()))
  WITH CHECK (public.has_crm_write(auth.uid()));

CREATE POLICY "Delete own communications or admin any"
  ON public.communications FOR DELETE
  USING (
    (public.has_crm_write(auth.uid()) AND auth.uid() = logged_by)
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "CRM users can view comm participants"
  ON public.communication_participants FOR SELECT
  USING (public.has_crm_access(auth.uid()));

CREATE POLICY "CRM writers can insert comm participants"
  ON public.communication_participants FOR INSERT
  WITH CHECK (public.has_crm_write(auth.uid()));

CREATE POLICY "CRM writers can update comm participants"
  ON public.communication_participants FOR UPDATE
  USING (public.has_crm_write(auth.uid()))
  WITH CHECK (public.has_crm_write(auth.uid()));

CREATE POLICY "CRM writers can delete comm participants"
  ON public.communication_participants FOR DELETE
  USING (public.has_crm_write(auth.uid()));

CREATE POLICY "CRM users can view comm attachments"
  ON public.communication_attachments FOR SELECT
  USING (public.has_crm_access(auth.uid()));

CREATE POLICY "CRM writers can insert comm attachments"
  ON public.communication_attachments FOR INSERT
  WITH CHECK (public.has_crm_write(auth.uid()) AND auth.uid() = uploaded_by);

CREATE POLICY "CRM writers can delete comm attachments"
  ON public.communication_attachments FOR DELETE
  USING (public.has_crm_write(auth.uid()));

-- ============================================================
-- 7. RPC: crm_log_communication (atomic)
-- ============================================================
CREATE OR REPLACE FUNCTION public.crm_log_communication(p_payload jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_uid          uuid := auth.uid();
  v_comm         jsonb := p_payload -> 'communication';
  v_participants jsonb := COALESCE(p_payload -> 'participants', '[]'::jsonb);
  v_attachments  jsonb := COALESCE(p_payload -> 'attachments',  '[]'::jsonb);
  v_comm_id      uuid;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF NOT public.has_crm_write(v_uid) THEN
    RAISE EXCEPTION 'CRM write access required';
  END IF;
  IF v_comm IS NULL THEN
    RAISE EXCEPTION 'Missing communication payload';
  END IF;

  INSERT INTO public.communications (
    client_id, channel, direction, subject, summary,
    body_plain, body_html, occurred_at, logged_by,
    is_important, sentiment, needs_review,
    email_from, email_to, email_cc, email_message_id,
    call_duration_seconds, meeting_location,
    pending_follow_up_note
  )
  VALUES (
    (v_comm ->> 'client_id')::uuid,
    (v_comm ->> 'channel')::public.comm_channel,
    (v_comm ->> 'direction')::public.comm_direction,
     v_comm ->> 'subject',
     v_comm ->> 'summary',
     v_comm ->> 'body_plain',
     v_comm ->> 'body_html',
    (v_comm ->> 'occurred_at')::timestamptz,
    v_uid,
    COALESCE((v_comm ->> 'is_important')::boolean, false),
    NULLIF(v_comm ->> 'sentiment', '')::public.comm_sentiment,
    COALESCE((v_comm ->> 'needs_review')::boolean, false),
     v_comm ->> 'email_from',
     CASE WHEN v_comm ? 'email_to' THEN ARRAY(SELECT jsonb_array_elements_text(v_comm -> 'email_to')) END,
     CASE WHEN v_comm ? 'email_cc' THEN ARRAY(SELECT jsonb_array_elements_text(v_comm -> 'email_cc')) END,
     v_comm ->> 'email_message_id',
     NULLIF(v_comm ->> 'call_duration_seconds', '')::integer,
     v_comm ->> 'meeting_location',
     v_comm ->> 'pending_follow_up_note'
  )
  RETURNING id INTO v_comm_id;

  INSERT INTO public.communication_participants (
    communication_id, role_in_comm, kind,
    contact_id, platform_user_id, workspace_member_id,
    external_name, external_email
  )
  SELECT
    v_comm_id,
    (p ->> 'role_in_comm')::public.participant_role,
    (p ->> 'kind')::public.participant_kind,
    NULLIF(p ->> 'contact_id', '')::uuid,
    NULLIF(p ->> 'platform_user_id', '')::uuid,
    NULLIF(p ->> 'workspace_member_id', '')::uuid,
    p ->> 'external_name',
    p ->> 'external_email'
  FROM jsonb_array_elements(v_participants) AS p;

  INSERT INTO public.communication_attachments (
    communication_id, file_name, mime_type, size_bytes, storage_path, uploaded_by
  )
  SELECT
    v_comm_id,
    a ->> 'file_name',
    a ->> 'mime_type',
    NULLIF(a ->> 'size_bytes', '')::bigint,
    a ->> 'storage_path',
    v_uid
  FROM jsonb_array_elements(v_attachments) AS a;

  RETURN v_comm_id;
END;
$$;

REVOKE ALL ON FUNCTION public.crm_log_communication(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.crm_log_communication(jsonb) TO authenticated;

-- ============================================================
-- 8. STORAGE BUCKET (private, 50MB per-file backstop)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('crm-comm-attachments', 'crm-comm-attachments', false, 52428800)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 52428800, public = false;

CREATE POLICY "CRM users can read comm attachment files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'crm-comm-attachments' AND public.has_crm_access(auth.uid()));

CREATE POLICY "CRM writers can upload comm attachment files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'crm-comm-attachments' AND public.has_crm_write(auth.uid()));

CREATE POLICY "CRM writers can delete comm attachment files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'crm-comm-attachments' AND public.has_crm_write(auth.uid()));