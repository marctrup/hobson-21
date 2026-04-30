import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  CommChannel,
  CommDirection,
} from "@/lib/crm/communicationsLabels";

export interface RecentCommRow {
  id: string;
  client_id: string;
  client_name: string;
  channel: CommChannel;
  direction: CommDirection;
  subject: string | null;
  summary: string | null;
  occurred_at: string;
  is_important: boolean;
}

export const useRecentCommunications = (limit = 20) =>
  useQuery({
    queryKey: ["crm-dashboard-recent-comms", limit],
    queryFn: async (): Promise<RecentCommRow[]> => {
      const { data, error } = await supabase
        .from("communications")
        .select(
          "id,client_id,channel,direction,subject,summary,occurred_at,is_important,crm_clients!inner(name)",
        )
        .order("occurred_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((data ?? []) as any[]).map((r) => ({
        id: r.id,
        client_id: r.client_id,
        client_name: r.crm_clients?.name ?? "(unknown client)",
        channel: r.channel,
        direction: r.direction,
        subject: r.subject,
        summary: r.summary,
        occurred_at: r.occurred_at,
        is_important: r.is_important,
      }));
    },
  });
