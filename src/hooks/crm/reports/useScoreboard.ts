// Workspace performance scoreboard (admin-only).

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReportsFilters } from "@/components/crm/reports/ReportsFiltersContext";

export interface ScoreboardRow {
  user_id: string;
  display_name: string;
  email: string;
  clients_owned: number;
  comms_logged: number;
  issues_resolved: number;
  tasks_completed: number;
}

interface MemberLite {
  user_id: string;
  email: string;
  display_name: string | null;
}

export const useWorkspaceScoreboard = (enabled: boolean) => {
  const { startDate, endDate } = useReportsFilters();
  return useQuery({
    enabled,
    queryKey: [
      "report-scoreboard",
      startDate.toISOString(),
      endDate.toISOString(),
    ],
    queryFn: async (): Promise<ScoreboardRow[]> => {
      const [
        { data: members, error: mErr },
        clientsRes,
        commsRes,
        issuesRes,
        tasksRes,
      ] = await Promise.all([
        supabase.rpc("crm_list_team_members"),
        supabase
          .from("crm_clients")
          .select("owner_id")
          .limit(1000),
        supabase
          .from("communications")
          .select("logged_by")
          .gte("occurred_at", startDate.toISOString())
          .lt("occurred_at", endDate.toISOString())
          .limit(1000),
        supabase
          .from("crm_issues")
          .select("assignee_id,resolved_at")
          .not("resolved_at", "is", null)
          .gte("resolved_at", startDate.toISOString())
          .lt("resolved_at", endDate.toISOString())
          .limit(1000),
        supabase
          .from("crm_tasks")
          .select("assignee_id,completed_at")
          .not("completed_at", "is", null)
          .gte("completed_at", startDate.toISOString())
          .lt("completed_at", endDate.toISOString())
          .limit(1000),
      ]);

      if (mErr) throw mErr;
      if (clientsRes.error) throw clientsRes.error;
      if (commsRes.error) throw commsRes.error;
      if (issuesRes.error) throw issuesRes.error;
      if (tasksRes.error) throw tasksRes.error;

      const memberList = (members ?? []) as MemberLite[];
      const tally = new Map<string, ScoreboardRow>();
      for (const m of memberList) {
        tally.set(m.user_id, {
          user_id: m.user_id,
          display_name: m.display_name || m.email,
          email: m.email,
          clients_owned: 0,
          comms_logged: 0,
          issues_resolved: 0,
          tasks_completed: 0,
        });
      }

      const ensure = (uid: string | null): ScoreboardRow | null => {
        if (!uid) return null;
        return tally.get(uid) ?? null;
      };

      for (const c of clientsRes.data ?? []) {
        const r = ensure(c.owner_id as string | null);
        if (r) r.clients_owned += 1;
      }
      for (const c of commsRes.data ?? []) {
        const r = ensure(c.logged_by as string | null);
        if (r) r.comms_logged += 1;
      }
      for (const c of issuesRes.data ?? []) {
        const r = ensure(c.assignee_id as string | null);
        if (r) r.issues_resolved += 1;
      }
      for (const c of tasksRes.data ?? []) {
        const r = ensure(c.assignee_id as string | null);
        if (r) r.tasks_completed += 1;
      }

      return Array.from(tally.values()).sort(
        (a, b) =>
          b.comms_logged + b.issues_resolved + b.tasks_completed -
          (a.comms_logged + a.issues_resolved + a.tasks_completed),
      );
    },
  });
};
