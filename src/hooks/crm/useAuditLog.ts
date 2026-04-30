import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AuditLogRow {
  id: string;
  created_at: string;
  user_id: string | null;
  actor_email: string | null;
  actor_display_name: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  old_values: unknown;
  new_values: unknown;
  total_count: number;
}

export interface AuditLogFilters {
  action: string | null;
  from: string | null; // ISO
  to: string | null;   // ISO (exclusive)
  search: string | null;
  page: number;        // 1-indexed
  pageSize: number;
}

export function useAuditLog(filters: AuditLogFilters) {
  return useQuery({
    queryKey: ["crm", "audit-log", filters],
    queryFn: async () => {
      const offset = (filters.page - 1) * filters.pageSize;
      const { data, error } = await supabase.rpc("crm_list_audit_log", {
        p_limit: filters.pageSize,
        p_offset: offset,
        p_action: filters.action,
        p_from: filters.from,
        p_to: filters.to,
        p_search: filters.search,
      });
      if (error) throw error;
      const rows = (data ?? []) as AuditLogRow[];
      const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
      return { rows, total };
    },
    staleTime: 30 * 1000,
  });
}

export function useAuditLogActions() {
  return useQuery({
    queryKey: ["crm", "audit-log", "actions"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.rpc("crm_list_audit_log_actions");
      if (error) throw error;
      return ((data ?? []) as { action: string }[]).map((r) => r.action);
    },
    staleTime: 5 * 60 * 1000,
  });
}
