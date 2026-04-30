import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  CommChannel,
  CommDirection,
} from "@/lib/crm/communicationsLabels";

export const COMM_PAGE_SIZE = 100;

export interface CommunicationListFilters {
  clientId?: string;
  channels?: CommChannel[];
  direction?: CommDirection | "all";
  search?: string;
  needsReviewOnly?: boolean;
  importantOnly?: boolean;
  fromDate?: string; // ISO date
  toDate?: string;   // ISO date
}

export interface CommunicationRow {
  id: string;
  client_id: string;
  channel: CommChannel;
  direction: CommDirection;
  subject: string | null;
  summary: string | null;
  occurred_at: string;
  is_important: boolean;
  needs_review: boolean;
  sentiment: string | null;
  logged_by: string | null;
  email_from: string | null;
  email_to: string[] | null;
  client_name?: string;
}

export const useCommunications = (filters: CommunicationListFilters) =>
  useInfiniteQuery({
    queryKey: ["crm-communications", filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }): Promise<CommunicationRow[]> => {
      const from = pageParam as number;
      const to = from + COMM_PAGE_SIZE - 1;

      let q = supabase
        .from("communications")
        .select(
          "id,client_id,channel,direction,subject,summary,occurred_at,is_important,needs_review,sentiment,logged_by,email_from,email_to",
        )
        .order("occurred_at", { ascending: false })
        .range(from, to);

      if (filters.clientId) q = q.eq("client_id", filters.clientId);
      if (filters.channels && filters.channels.length > 0) {
        q = q.in("channel", filters.channels);
      }
      if (filters.direction && filters.direction !== "all") {
        q = q.eq("direction", filters.direction);
      }
      if (filters.needsReviewOnly) q = q.eq("needs_review", true);
      if (filters.importantOnly) q = q.eq("is_important", true);
      if (filters.fromDate) q = q.gte("occurred_at", filters.fromDate);
      if (filters.toDate) q = q.lte("occurred_at", filters.toDate);
      if (filters.search && filters.search.trim()) {
        const term = `%${filters.search.trim()}%`;
        q = q.or(
          `subject.ilike.${term},summary.ilike.${term},body_plain.ilike.${term}`,
        );
      }

      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []) as CommunicationRow[];

      // Hydrate client names in a single follow-up query (workspace view only)
      if (!filters.clientId && rows.length > 0) {
        const clientIds = Array.from(new Set(rows.map((r) => r.client_id)));
        const { data: clients } = await supabase
          .from("crm_clients")
          .select("id,name")
          .in("id", clientIds);
        const nameById = new Map((clients ?? []).map((c) => [c.id, c.name]));
        for (const r of rows) r.client_name = nameById.get(r.client_id);
      }

      return rows;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last page was a full page, there might be more.
      if (lastPage.length < COMM_PAGE_SIZE) return undefined;
      return allPages.reduce((sum, p) => sum + p.length, 0);
    },
  });
