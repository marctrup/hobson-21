import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TaskPriority, TaskStatus } from "@/lib/crm/tasksLabels";

export interface TaskDetail {
  id: string;
  client_id: string | null;
  client_name: string | null;
  source_communication_id: string | null;
  source_communication_subject: string | null;
  linked_issue_id: string | null;
  linked_issue_title: string | null;
  title: string;
  notes: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  assignee_name: string | null;
  created_by: string;
  creator_name: string | null;
  due_date: string | null;
  completed_at: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useTask = (id: string | null | undefined) =>
  useQuery({
    enabled: !!id,
    queryKey: ["crm-task", id],
    queryFn: async (): Promise<TaskDetail> => {
      if (!id) throw new Error("Missing id");

      const { data: t, error } = await supabase
        .from("crm_tasks")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;

      const userIds = Array.from(
        new Set(
          [t.assignee_id, t.created_by].filter((x): x is string => !!x),
        ),
      );

      const [clientRes, commRes, issueRes, teamRes] = await Promise.all([
        t.client_id
          ? supabase
              .from("crm_clients")
              .select("name")
              .eq("id", t.client_id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        t.source_communication_id
          ? supabase
              .from("communications")
              .select("subject,summary")
              .eq("id", t.source_communication_id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        t.linked_issue_id
          ? supabase
              .from("crm_issues")
              .select("title")
              .eq("id", t.linked_issue_id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        userIds.length
          ? supabase.rpc("crm_list_team_members")
          : Promise.resolve({ data: [], error: null }),
      ]);

      const teamRows = Array.isArray(teamRes.data)
        ? (teamRes.data as Array<{
            user_id: string;
            email: string;
            display_name: string | null;
          }>)
        : [];
      const nameById = new Map(
        teamRows.map((m) => [m.user_id, m.display_name || m.email]),
      );

      const commData = commRes.data as
        | { subject: string | null; summary: string | null }
        | null;
      const sourceSubject =
        commData?.subject ||
        (commData?.summary
          ? commData.summary.split("\n")[0].slice(0, 120)
          : null);

      const issueData = issueRes.data as { title: string } | null;

      return {
        ...t,
        client_name: (clientRes.data as { name: string } | null)?.name ?? null,
        source_communication_subject: sourceSubject ?? null,
        linked_issue_title: issueData?.title ?? null,
        assignee_name: t.assignee_id
          ? nameById.get(t.assignee_id) ?? null
          : null,
        creator_name: nameById.get(t.created_by) ?? null,
      } as TaskDetail;
    },
  });
