import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CrmIngestFailure {
  id: string;
  source: string;
  payload: unknown;
  error_message: string | null;
  retry_count: number;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export type IngestFailureFilter = "open" | "resolved" | "all";

export const INGEST_FAILURES_QUERY_KEY = ["crm", "ingest-failures"] as const;

export function useIngestFailures(filter: IngestFailureFilter) {
  return useQuery({
    queryKey: [...INGEST_FAILURES_QUERY_KEY, filter],
    queryFn: async (): Promise<CrmIngestFailure[]> => {
      let q = supabase
        .from("crm_ingest_failures")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (filter === "open") q = q.is("resolved_at", null);
      if (filter === "resolved") q = q.not("resolved_at", "is", null);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as CrmIngestFailure[];
    },
    staleTime: 30 * 1000,
  });
}

export function useResolveIngestFailure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from("crm_ingest_failures")
        .update({ resolved_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INGEST_FAILURES_QUERY_KEY });
    },
  });
}
