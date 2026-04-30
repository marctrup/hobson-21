import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK = "Hobson CRM";
export const WORKSPACE_NAME_QUERY_KEY = ["crm", "workspace-name"] as const;

/**
 * Reads the CRM workspace name via the crm_get_workspace_name RPC.
 * Available to any user with CRM access; never exposes other workspace_settings columns.
 * Falls back to "Hobson CRM" when the RPC returns null/empty.
 */
export function useWorkspaceName() {
  const query = useQuery({
    queryKey: WORKSPACE_NAME_QUERY_KEY,
    queryFn: async (): Promise<string> => {
      const { data, error } = await supabase.rpc("crm_get_workspace_name");
      if (error) throw error;
      const trimmed = (data ?? "").toString().trim();
      return trimmed.length > 0 ? trimmed : FALLBACK;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    ...query,
    name: query.data ?? FALLBACK,
  };
}

/**
 * Admin-only mutation. Server trims and enforces 1–80 chars.
 */
export function useUpdateWorkspaceName() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string): Promise<string> => {
      const { data, error } = await supabase.rpc("crm_update_workspace_name", {
        p_name: name,
      });
      if (error) throw error;
      return (data ?? "").toString();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_NAME_QUERY_KEY });
    },
  });
}
