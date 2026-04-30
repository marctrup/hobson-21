import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// A client is stale if their effective last activity is older than 30 days.
// effective_last = MAX(last_contact_date, updated_at, latest activity_log entry)
// Skip won / lost / archived.

const CLOSED_STATUSES = ["won", "lost", "archived"];

export interface StaleClientRow {
  id: string;
  name: string;
  pipeline_stage: string;
  effective_last: string; // ISO
  days_since: number;
}

export const useStaleClients = (limit = 10) =>
  useQuery({
    queryKey: ["crm-dashboard-stale-clients", limit],
    queryFn: async (): Promise<StaleClientRow[]> => {
      const { data: clients, error } = await supabase
        .from("crm_clients")
        .select("id,name,pipeline_stage,status,last_contact_date,updated_at")
        .not("status", "in", `(${CLOSED_STATUSES.join(",")})`)
        .limit(1000);
      if (error) throw error;

      const ids = (clients ?? []).map((c) => c.id);
      const lastActivityById = new Map<string, string>();
      if (ids.length > 0) {
        const { data: acts, error: aErr } = await supabase
          .from("crm_activity_log")
          .select("client_id,created_at")
          .in("client_id", ids)
          .order("created_at", { ascending: false })
          .limit(1000);
        if (aErr) throw aErr;
        for (const a of acts ?? []) {
          if (!a.client_id) continue;
          if (!lastActivityById.has(a.client_id)) {
            lastActivityById.set(a.client_id, a.created_at);
          }
        }
      }

      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const rows: StaleClientRow[] = [];
      for (const c of clients ?? []) {
        const candidates: number[] = [];
        if (c.last_contact_date)
          candidates.push(new Date(c.last_contact_date).getTime());
        if (c.updated_at) candidates.push(new Date(c.updated_at).getTime());
        const act = lastActivityById.get(c.id);
        if (act) candidates.push(new Date(act).getTime());
        const eff = candidates.length ? Math.max(...candidates) : 0;
        if (eff < cutoff) {
          rows.push({
            id: c.id,
            name: c.name,
            pipeline_stage: c.pipeline_stage,
            effective_last: eff ? new Date(eff).toISOString() : "",
            days_since: eff
              ? Math.floor((Date.now() - eff) / (24 * 60 * 60 * 1000))
              : 9999,
          });
        }
      }

      rows.sort((a, b) => b.days_since - a.days_since);
      return rows.slice(0, limit);
    },
  });
