// Service delivery hooks:
// - useIssuesOpenedVsResolved
// - useAvgTimeToResolution (by priority)
// - useTasksCompletedVsCreated

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReportsFilters } from "@/components/crm/reports/ReportsFiltersContext";
import {
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  type IssuePriority,
} from "@/lib/crm/issuesLabels";

export interface IssueFlowPoint {
  label: string;
  opened: number;
  resolved: number;
}

export const useIssuesOpenedVsResolved = () => {
  const { startDate, endDate, ownerId, buckets, bucket } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-issues-opened-resolved",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
      bucket,
    ],
    queryFn: async (): Promise<IssueFlowPoint[]> => {
      let q = supabase
        .from("crm_issues")
        .select("created_at,resolved_at,assignee_id,reported_by")
        .or(
          `created_at.gte.${startDate.toISOString()},resolved_at.gte.${startDate.toISOString()}`,
        )
        .limit(1000);
      if (ownerId !== "all") {
        q = q.or(`assignee_id.eq.${ownerId},reported_by.eq.${ownerId}`);
      }
      const { data, error } = await q;
      if (error) throw error;

      return buckets.map((b) => {
        let opened = 0;
        let resolved = 0;
        for (const r of data ?? []) {
          const c = new Date(r.created_at).getTime();
          if (c >= b.start.getTime() && c < b.end.getTime()) opened += 1;
          if (r.resolved_at) {
            const rt = new Date(r.resolved_at).getTime();
            if (rt >= b.start.getTime() && rt < b.end.getTime()) resolved += 1;
          }
        }
        return { label: b.label, opened, resolved };
      });
    },
  });
};

export interface ResolutionRow {
  priority: IssuePriority;
  label: string;
  avg_days: number;
  count: number;
}

export const useAvgTimeToResolution = () => {
  const { startDate, endDate, ownerId } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-avg-resolution",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
    ],
    queryFn: async (): Promise<ResolutionRow[]> => {
      let q = supabase
        .from("crm_issues")
        .select("priority,created_at,resolved_at,assignee_id")
        .not("resolved_at", "is", null)
        .gte("resolved_at", startDate.toISOString())
        .lt("resolved_at", endDate.toISOString())
        .limit(1000);
      if (ownerId !== "all") q = q.eq("assignee_id", ownerId);
      const { data, error } = await q;
      if (error) throw error;

      const map = new Map<IssuePriority, { sum: number; n: number }>();
      for (const r of data ?? []) {
        const p = r.priority as IssuePriority;
        const days =
          (new Date(r.resolved_at!).getTime() - new Date(r.created_at).getTime()) /
          (24 * 60 * 60 * 1000);
        const cur = map.get(p) ?? { sum: 0, n: 0 };
        cur.sum += days;
        cur.n += 1;
        map.set(p, cur);
      }
      return ISSUE_PRIORITIES.map((p) => {
        const cur = map.get(p);
        return {
          priority: p,
          label: ISSUE_PRIORITY_LABELS[p],
          avg_days: cur ? Math.round((cur.sum / cur.n) * 10) / 10 : 0,
          count: cur?.n ?? 0,
        };
      });
    },
  });
};

export interface TaskFlowPoint {
  label: string;
  created: number;
  completed: number;
}

export const useTasksCompletedVsCreated = () => {
  const { startDate, endDate, ownerId, buckets, bucket } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-tasks-flow",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
      bucket,
    ],
    queryFn: async (): Promise<TaskFlowPoint[]> => {
      let q = supabase
        .from("crm_tasks")
        .select("created_at,completed_at,assignee_id,created_by")
        .or(
          `created_at.gte.${startDate.toISOString()},completed_at.gte.${startDate.toISOString()}`,
        )
        .limit(1000);
      if (ownerId !== "all") {
        q = q.or(`assignee_id.eq.${ownerId},created_by.eq.${ownerId}`);
      }
      const { data, error } = await q;
      if (error) throw error;

      return buckets.map((b) => {
        let created = 0;
        let completed = 0;
        for (const r of data ?? []) {
          const c = new Date(r.created_at).getTime();
          if (c >= b.start.getTime() && c < b.end.getTime()) created += 1;
          if (r.completed_at) {
            const ct = new Date(r.completed_at).getTime();
            if (ct >= b.start.getTime() && ct < b.end.getTime()) completed += 1;
          }
        }
        return { label: b.label, created, completed };
      });
    },
  });
};
