import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from "@/lib/crm/issuesLabels";

export interface NewIssueInput {
  client_id: string;
  title: string;
  description?: string | null;
  status?: IssueStatus;
  priority?: IssuePriority;
  category?: IssueCategory;
  assignee_id?: string | null;
  reported_via_communication_id?: string | null;
  due_date?: string | null;
  tags?: string[];
}

export interface UpdateIssuePatch {
  title?: string;
  description?: string | null;
  status?: IssueStatus;
  priority?: IssuePriority;
  category?: IssueCategory;
  assignee_id?: string | null;
  due_date?: string | null;
  resolution_note?: string | null;
  tags?: string[];
}

export const useCreateIssue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewIssueInput): Promise<string> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("crm_issues")
        .insert({
          client_id: input.client_id,
          title: input.title,
          description: input.description ?? null,
          status: input.status ?? "open",
          priority: input.priority ?? "medium",
          category: input.category ?? "other",
          assignee_id: input.assignee_id ?? null,
          reported_by: user.id,
          reported_via_communication_id:
            input.reported_via_communication_id ?? null,
          due_date: input.due_date ?? null,
          tags: input.tags ?? [],
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["crm-issues"] });
      qc.invalidateQueries({ queryKey: ["crm-client", vars.client_id] });
      qc.invalidateQueries({ queryKey: ["crm-clients"] });
    },
  });
};

export const useUpdateIssue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: UpdateIssuePatch;
    }) => {
      const { error } = await supabase
        .from("crm_issues")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["crm-issues"] });
      qc.invalidateQueries({ queryKey: ["crm-issue", vars.id] });
      qc.invalidateQueries({ queryKey: ["crm-clients"] });
    },
  });
};

export const useDeleteIssue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // RLS gates this — own issues for writers, any for admin.
      const { error } = await supabase.from("crm_issues").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-issues"] });
      qc.invalidateQueries({ queryKey: ["crm-clients"] });
    },
  });
};

export const useAddIssueComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      issueId,
      body,
    }: {
      issueId: string;
      body: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");
      const { error } = await supabase.from("crm_issue_comments").insert({
        issue_id: issueId,
        author_id: user.id,
        body,
        is_status_change: false,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["crm-issue", vars.issueId] });
    },
  });
};

export const useDeleteIssueComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("crm_issue_comments")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-issue"] });
    },
  });
};
