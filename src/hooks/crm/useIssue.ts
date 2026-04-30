import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from "@/lib/crm/issuesLabels";

export interface IssueComment {
  id: string;
  issue_id: string;
  author_id: string | null;
  body: string;
  is_status_change: boolean;
  metadata: { from?: string; to?: string } | null;
  created_at: string;
  author_name?: string | null;
}

export interface IssueDetail {
  id: string;
  client_id: string;
  client_name: string | null;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  category: IssueCategory;
  assignee_id: string | null;
  assignee_name: string | null;
  reported_by: string | null;
  reporter_name: string | null;
  reported_via_communication_id: string | null;
  due_date: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useIssue = (id: string | null | undefined) =>
  useQuery({
    enabled: !!id,
    queryKey: ["crm-issue", id],
    queryFn: async (): Promise<{
      issue: IssueDetail;
      comments: IssueComment[];
    }> => {
      if (!id) throw new Error("Missing id");

      const [issueRes, commentsRes] = await Promise.all([
        supabase.from("crm_issues").select("*").eq("id", id).single(),
        supabase
          .from("crm_issue_comments")
          .select("*")
          .eq("issue_id", id)
          .order("created_at", { ascending: true }),
      ]);

      if (issueRes.error) throw issueRes.error;
      if (commentsRes.error) throw commentsRes.error;

      const i = issueRes.data;

      // Pull client name + person names in parallel; tolerate failures (RLS).
      const userIds = Array.from(
        new Set(
          [
            i.assignee_id,
            i.reported_by,
            ...(commentsRes.data ?? []).map((c) => c.author_id),
          ].filter((x): x is string => !!x),
        ),
      );

      const [clientRes, teamRes] = await Promise.all([
        supabase
          .from("crm_clients")
          .select("name")
          .eq("id", i.client_id)
          .maybeSingle(),
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
        teamRows.map((t) => [t.user_id, t.display_name || t.email]),
      );

      const issue: IssueDetail = {
        ...i,
        client_name: clientRes.data?.name ?? null,
        assignee_name: i.assignee_id ? nameById.get(i.assignee_id) ?? null : null,
        reporter_name: i.reported_by ? nameById.get(i.reported_by) ?? null : null,
      };

      const comments: IssueComment[] = (commentsRes.data ?? []).map((c) => ({
        ...c,
        metadata: (c.metadata as IssueComment["metadata"]) ?? null,
        author_name: c.author_id ? nameById.get(c.author_id) ?? null : null,
      }));

      return { issue, comments };
    },
  });
