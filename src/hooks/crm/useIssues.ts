import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from "@/lib/crm/issuesLabels";

export const ISSUE_PAGE_SIZE = 100;

export interface IssueListFilters {
  clientId?: string;
  statuses?: IssueStatus[];
  priorities?: IssuePriority[];
  categories?: IssueCategory[];
  assigneeId?: string | "unassigned" | null;
  reportedBy?: string | null;
  search?: string;
  tag?: string;
  /** Hide resolved/closed when true (default UI behaviour). */
  hideResolved?: boolean;
  /** Only issues whose due_date is past today and not resolved/closed. */
  overdueOnly?: boolean;
}

export interface IssueRow {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  category: IssueCategory;
  assignee_id: string | null;
  reported_by: string | null;
  reported_via_communication_id: string | null;
  due_date: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  client_name?: string;
}

export const useIssues = (filters: IssueListFilters) =>
  useInfiniteQuery({
    queryKey: ["crm-issues", filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }): Promise<IssueRow[]> => {
      const from = pageParam as number;
      const to = from + ISSUE_PAGE_SIZE - 1;

      let q = supabase
        .from("crm_issues")
        .select("*")
        .order("updated_at", { ascending: false })
        .range(from, to);

      if (filters.clientId) q = q.eq("client_id", filters.clientId);

      // Status filter — explicit list wins; otherwise hideResolved trims active set.
      if (filters.statuses && filters.statuses.length > 0) {
        q = q.in("status", filters.statuses);
      } else if (filters.hideResolved) {
        q = q.in("status", ["open", "in_progress", "waiting_on_client"]);
      }

      if (filters.priorities && filters.priorities.length > 0) {
        q = q.in("priority", filters.priorities);
      }
      if (filters.categories && filters.categories.length > 0) {
        q = q.in("category", filters.categories);
      }
      if (filters.assigneeId === "unassigned") {
        q = q.is("assignee_id", null);
      } else if (filters.assigneeId) {
        q = q.eq("assignee_id", filters.assigneeId);
      }
      if (filters.reportedBy) q = q.eq("reported_by", filters.reportedBy);
      if (filters.tag && filters.tag.trim()) {
        q = q.contains("tags", [filters.tag.trim()]);
      }
      if (filters.overdueOnly) {
        const today = new Date().toISOString().slice(0, 10);
        q = q
          .lt("due_date", today)
          .in("status", ["open", "in_progress", "waiting_on_client"]);
      }
      if (filters.search && filters.search.trim()) {
        const term = `%${filters.search.trim()}%`;
        q = q.or(`title.ilike.${term},description.ilike.${term}`);
      }

      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []) as IssueRow[];

      // Hydrate client names in the workspace view (one follow-up query)
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
      if (lastPage.length < ISSUE_PAGE_SIZE) return undefined;
      return allPages.reduce((sum, p) => sum + p.length, 0);
    },
  });
