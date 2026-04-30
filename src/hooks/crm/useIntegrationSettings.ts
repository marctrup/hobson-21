import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface IntegrationSettings {
  default_owner_id: string | null;
  default_owner_email: string | null;
  default_owner_display_name: string | null;
  website_system_user_id: string | null;
  website_ingest_secret_rotated_at: string | null;
  secret_configured: boolean;
}

export const INTEGRATION_SETTINGS_QUERY_KEY = ["crm", "integration-settings"] as const;

export function useIntegrationSettings() {
  return useQuery({
    queryKey: INTEGRATION_SETTINGS_QUERY_KEY,
    queryFn: async (): Promise<IntegrationSettings> => {
      const { data, error } = await supabase.rpc("crm_get_integration_settings");
      if (error) throw error;
      const row = (data ?? [])[0];
      return {
        default_owner_id: row?.default_owner_id ?? null,
        default_owner_email: row?.default_owner_email ?? null,
        default_owner_display_name: row?.default_owner_display_name ?? null,
        website_system_user_id: row?.website_system_user_id ?? null,
        website_ingest_secret_rotated_at:
          row?.website_ingest_secret_rotated_at ?? null,
        secret_configured: Boolean(row?.secret_configured),
      };
    },
    staleTime: 30 * 1000,
  });
}

export function useSetDefaultOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string | null): Promise<void> => {
      const { error } = await supabase.rpc("crm_set_default_owner", {
        p_user_id: userId as string,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INTEGRATION_SETTINGS_QUERY_KEY });
    },
  });
}

export interface RotateSecretResult {
  secret: string;
  rotated_at: string;
}

export function useRotateIngestSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<RotateSecretResult> => {
      const { data, error } = await supabase.functions.invoke(
        "crm-rotate-ingest-secret",
        { body: {} },
      );
      if (error) throw new Error(error.message);
      if (!data?.secret) throw new Error(data?.error ?? "Rotation failed");
      return { secret: data.secret, rotated_at: data.rotated_at };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INTEGRATION_SETTINGS_QUERY_KEY });
    },
  });
}
