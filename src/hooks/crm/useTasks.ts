import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TaskPriority, TaskStatus } from "@/lib/crm/tasksLabels";

export const TASK_PAGE_SIZE = 100;

export interface TaskListFilters {
  /** When set, only tasks for this client. */
  clientId?: string;
  /** When true, restrict to tasks with NO client_id (standalone). */
  standaloneOnly?: boolean;
  statuses?: TaskStatus[];
  priorities?: TaskPriority[];
  /** "unassigned" → IS NULL; uuid → equals; null/undefined → no filter. */
  assigneeId?: string | "unassigned" | null;
  search?: string;
  tag?: string;
  /** Hide done/cancelled when true (default UI behaviour). */
  hideClosed?: boolean;
  /** Include cancelled rows in the result (false by default per A4). */
  includeCancelled?: boolean;
  /** Only tasks with due_date < today and still open. */
  overdueOnly?: boolean;
  /** Only tasks with due_date = today and still open. */
  dueTodayOnly?: boolean;
}

export interface TaskRow {
  id: string;
  client_id: string | null;
  source_communication_id: string | null;
  linked_issue_id: string | null;
  title: string;
  notes: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  created_by: string;
  due_date: string | null;
  completed_at: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  client_name?: string | null;
}

export const useTasks = (filters: TaskListFilters) =>
  useInfiniteQuery({
    queryKey: ["crm-tasks", filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }): Promise<TaskRow[]> => {
      const from = pageParam as number;
      const to = from + TASK_PAGE_SIZE - 1;

      let q = supabase
        .from("crm_tasks")
        .select("*")
        // Open tasks float by due date (earliest first), then priority, then update.
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("updated_at", { ascending: false })
        .range(from, to);

      if (filters.clientId) q = q.eq("client_id", filters.clientId);
      if (filters.standaloneOnly) q = q.is("client_id", null);

      // Status filter: explicit list wins; otherwise hideClosed trims active set.
      if (filters.statuses && filters.statuses.length > 0) {
        q = q.in("status", filters.statuses);
      } else if (filters.hideClosed) {
        q = q.in("status", ["todo", "in_progress"]);
      } else if (!filters.includeCancelled) {
        // Default: hide cancelled but keep done visible (A4).
        q = q.in("status", ["todo", "in_progress", "done"]);
      }

      if (filters.priorities && filters.priorities.length > 0) {
        q = q.in("priority", filters.priorities);
      }
      if (filters.assigneeId === "unassigned") {
        q = q.is("assignee_id", null);
      } else if (filters.assigneeId) {
        q = q.eq("assignee_id", filters.assigneeId);
      }
      if (filters.tag && filters.tag.trim()) {
        q = q.contains("tags", [filters.tag.trim()]);
      }

      if (filters.overdueOnly) {
        const today = new Date().toISOString().slice(0, 10);
        q = q.lt("due_date", today).in("status", ["todo", "in_progress"]);
      }
      if (filters.dueTodayOnly) {
        const today = new Date().toISOString().slice(0, 10);
        q = q.eq("due_date", today).in("status", ["todo", "in_progress"]);
      }
      if (filters.search && filters.search.trim()) {
        const term = `%${filters.search.trim()}%`;
        q = q.or(`title.ilike.${term},notes.ilike.${term}`);
      }

      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []) as TaskRow[];

      // Hydrate client names for the workspace view.
      if (!filters.clientId && rows.length > 0) {
        const clientIds = Array.from(
          new Set(
            rows
              .map((r) => r.client_id)
              .filter((x): x is string => !!x),
          ),
        );
        if (clientIds.length > 0) {
          const { data: clients } = await supabase
            .from("crm_clients")
            .select("id,name")
            .in("id", clientIds);
          const nameById = new Map(
            (clients ?? []).map((c) => [c.id, c.name]),
          );
          for (const r of rows) {
            if (r.client_id) r.client_name = nameById.get(r.client_id) ?? null;
          }
        }
      }

      return rows;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < TASK_PAGE_SIZE) return undefined;
      return allPages.reduce((sum, p) => sum + p.length, 0);
    },
  });
