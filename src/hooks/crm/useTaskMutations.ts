import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TaskPriority, TaskStatus } from "@/lib/crm/tasksLabels";

export interface NewTaskInput {
  /** Optional — null/undefined creates a standalone task. */
  client_id?: string | null;
  source_communication_id?: string | null;
  linked_issue_id?: string | null;
  title: string;
  notes?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: string | null;
  due_date?: string | null;
  tags?: string[];
}

export interface UpdateTaskPatch {
  client_id?: string | null;
  title?: string;
  notes?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: string | null;
  due_date?: string | null;
  tags?: string[];
  linked_issue_id?: string | null;
}

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewTaskInput): Promise<string> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const insertRow: {
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
        tags: string[];
      } = {
        client_id: input.client_id ?? null,
        source_communication_id: input.source_communication_id ?? null,
        linked_issue_id: input.linked_issue_id ?? null,
        title: input.title,
        notes: input.notes ?? null,
        status: input.status ?? "todo",
        priority: input.priority ?? "medium",
        assignee_id: input.assignee_id ?? null,
        created_by: user.id,
        due_date: input.due_date ?? null,
        tags: input.tags ?? [],
      };

      const { data, error } = await supabase
        .from("crm_tasks")
        .insert(insertRow)
        .select("id")
        .single();
      if (error) throw error;

      // If created from a communication, backlink the comm.
      if (input.source_communication_id) {
        await supabase
          .from("communications")
          .update({ linked_task_id: data.id, pending_follow_up_note: null })
          .eq("id", input.source_communication_id);
      }
      return data.id;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["crm-tasks"] });
      if (vars.client_id) {
        qc.invalidateQueries({ queryKey: ["crm-client", vars.client_id] });
      }
      qc.invalidateQueries({ queryKey: ["crm-clients"] });
      if (vars.source_communication_id) {
        qc.invalidateQueries({
          queryKey: ["crm-communication", vars.source_communication_id],
        });
        qc.invalidateQueries({ queryKey: ["crm-communications"] });
      }
    },
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: UpdateTaskPatch;
    }) => {
      const { error } = await supabase
        .from("crm_tasks")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["crm-tasks"] });
      qc.invalidateQueries({ queryKey: ["crm-task", vars.id] });
      qc.invalidateQueries({ queryKey: ["crm-clients"] });
    },
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Look up source comm so we can clear linked_task_id afterwards.
      const { data: existing } = await supabase
        .from("crm_tasks")
        .select("source_communication_id")
        .eq("id", id)
        .maybeSingle();

      const { error } = await supabase.from("crm_tasks").delete().eq("id", id);
      if (error) throw error;

      if (existing?.source_communication_id) {
        await supabase
          .from("communications")
          .update({ linked_task_id: null })
          .eq("id", existing.source_communication_id);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-tasks"] });
      qc.invalidateQueries({ queryKey: ["crm-clients"] });
      qc.invalidateQueries({ queryKey: ["crm-communications"] });
    },
  });
};

/** Convenience: flip a task to done / re-open it. */
export const useToggleTaskDone = () => {
  const update = useUpdateTask();
  return (id: string, currentStatus: TaskStatus) =>
    update.mutateAsync({
      id,
      patch: { status: currentStatus === "done" ? "todo" : "done" },
    });
};
