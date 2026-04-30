import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/crm/tasksLabels";
import { useCreateTask } from "@/hooks/crm/useTaskMutations";
import { useCrmTeam } from "@/hooks/crm/useCrmTeam";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the client picker is hidden and the task is bound to this client. */
  defaultClientId?: string | null;
  /** Allow creating a standalone (no client) task — adds an "Unassigned (no client)" option. */
  allowStandalone?: boolean;
  defaultCommunicationId?: string | null;
  defaultLinkedIssueId?: string | null;
  defaultTitle?: string;
  defaultNotes?: string;
  defaultDueDate?: string;
  onCreated?: (id: string) => void;
}

interface ClientOption {
  id: string;
  name: string;
}

const STANDALONE_VALUE = "__standalone__";

export const LogTaskDialog = ({
  open,
  onOpenChange,
  defaultClientId,
  allowStandalone = true,
  defaultCommunicationId,
  defaultLinkedIssueId,
  defaultTitle,
  defaultNotes,
  defaultDueDate,
  onCreated,
}: Props) => {
  const create = useCreateTask();
  const { data: team = [] } = useCrmTeam();

  const lockedClient = !!defaultClientId;

  const [clientId, setClientId] = useState<string>(
    defaultClientId ?? STANDALONE_VALUE,
  );
  const [title, setTitle] = useState(defaultTitle ?? "");
  const [notes, setNotes] = useState(defaultNotes ?? "");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState<string>("__none__");
  const [dueDate, setDueDate] = useState<string>(defaultDueDate ?? "");
  const [tagsText, setTagsText] = useState<string>("");

  const [clients, setClients] = useState<ClientOption[]>([]);

  useEffect(() => {
    if (!open) return;
    setClientId(defaultClientId ?? STANDALONE_VALUE);
    setTitle(defaultTitle ?? "");
    setNotes(defaultNotes ?? "");
    setStatus("todo");
    setPriority("medium");
    setAssigneeId("__none__");
    setDueDate(defaultDueDate ?? "");
    setTagsText("");
  }, [
    open,
    defaultClientId,
    defaultTitle,
    defaultNotes,
    defaultDueDate,
  ]);

  // Lazy-load client list only when the picker is shown.
  useEffect(() => {
    if (!open || lockedClient) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase
        .from("crm_clients")
        .select("id,name")
        .order("name", { ascending: true })
        .limit(500);
      if (!cancelled) setClients((data ?? []) as ClientOption[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, lockedClient]);

  const submit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const tags = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const resolvedClientId =
        clientId === STANDALONE_VALUE ? null : clientId || null;
      const id = await create.mutateAsync({
        client_id: resolvedClientId,
        source_communication_id: defaultCommunicationId ?? null,
        linked_issue_id: defaultLinkedIssueId ?? null,
        title: title.trim(),
        notes: notes.trim() || null,
        status,
        priority,
        assignee_id: assigneeId === "__none__" ? null : assigneeId,
        due_date: dueDate || null,
        tags,
      });
      toast.success("Task created");
      onOpenChange(false);
      onCreated?.(id);
    } catch (e) {
      toast.error("Could not create task", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!lockedClient && (
            <div>
              <Label htmlFor="task-client">Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="task-client" className="bg-white">
                  <SelectValue placeholder="Pick a client" />
                </SelectTrigger>
                <SelectContent>
                  {allowStandalone && (
                    <SelectItem value={STANDALONE_VALUE}>
                      Standalone (no client)
                    </SelectItem>
                  )}
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs doing?"
              className="bg-white"
            />
          </div>

          <div>
            <Label htmlFor="task-notes">Notes (optional)</Label>
            <Textarea
              id="task-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Any context or sub-steps…"
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {TASK_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as TaskPriority)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {TASK_PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="task-due">Due date</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Unassigned</SelectItem>
                  {team.map((m) => (
                    <SelectItem key={m.user_id} value={m.user_id}>
                      {m.display_name || m.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="task-tags">Tags (comma-separated)</Label>
              <Input
                id="task-tags"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="e.g. weekly, follow-up"
                className="bg-white"
              />
            </div>
          </div>

          {defaultCommunicationId && (
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              Linked to the communication this task was created from.
            </div>
          )}
          {defaultLinkedIssueId && (
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              Linked to a related issue.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={create.isPending}>
            {create.isPending ? "Creating…" : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
