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
  ISSUE_CATEGORIES,
  ISSUE_CATEGORY_LABELS,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
  type IssueCategory,
  type IssuePriority,
  type IssueStatus,
} from "@/lib/crm/issuesLabels";
import { useCreateIssue } from "@/hooks/crm/useIssueMutations";
import { useCrmTeam } from "@/hooks/crm/useCrmTeam";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fill the client. If null/undefined, user picks from a list. */
  defaultClientId?: string | null;
  /** Pre-fill the back-link to a communication (set when launched from a comm). */
  defaultCommunicationId?: string | null;
  /** Pre-filled title (e.g. from a comm subject). */
  defaultTitle?: string;
  /** Pre-filled description (e.g. from comm summary or body). */
  defaultDescription?: string;
  /** Pre-filled category — defaults to "other" or "support" when launched from a comm. */
  defaultCategory?: IssueCategory;
  onCreated?: (id: string) => void;
}

interface ClientOption {
  id: string;
  name: string;
}

export const LogIssueDialog = ({
  open,
  onOpenChange,
  defaultClientId,
  defaultCommunicationId,
  defaultTitle,
  defaultDescription,
  defaultCategory,
  onCreated,
}: Props) => {
  const create = useCreateIssue();
  const { data: team = [] } = useCrmTeam();

  const [clientId, setClientId] = useState<string>(defaultClientId ?? "");
  const [title, setTitle] = useState(defaultTitle ?? "");
  const [description, setDescription] = useState(defaultDescription ?? "");
  const [status, setStatus] = useState<IssueStatus>("open");
  const [priority, setPriority] = useState<IssuePriority>("medium");
  const [category, setCategory] = useState<IssueCategory>(
    defaultCategory ?? "other",
  );
  const [assigneeId, setAssigneeId] = useState<string>("__none__");
  const [dueDate, setDueDate] = useState<string>("");
  const [tagsText, setTagsText] = useState<string>("");

  const [clients, setClients] = useState<ClientOption[]>([]);
  const needsClientPicker = !defaultClientId;

  // Reset form whenever the dialog opens with new defaults
  useEffect(() => {
    if (!open) return;
    setClientId(defaultClientId ?? "");
    setTitle(defaultTitle ?? "");
    setDescription(defaultDescription ?? "");
    setStatus("open");
    setPriority("medium");
    setCategory(defaultCategory ?? "other");
    setAssigneeId("__none__");
    setDueDate("");
    setTagsText("");
  }, [
    open,
    defaultClientId,
    defaultTitle,
    defaultDescription,
    defaultCategory,
  ]);

  // Lazy-load client list only when the picker is needed.
  useEffect(() => {
    if (!open || !needsClientPicker) return;
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
  }, [open, needsClientPicker]);

  const submit = async () => {
    if (!clientId) {
      toast.error("Pick a client");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const tags = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const id = await create.mutateAsync({
        client_id: clientId,
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        category,
        assignee_id: assigneeId === "__none__" ? null : assigneeId,
        due_date: dueDate || null,
        reported_via_communication_id: defaultCommunicationId ?? null,
        tags,
      });
      toast.success("Issue created");
      onOpenChange(false);
      onCreated?.(id);
    } catch (e) {
      toast.error("Could not create issue", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New issue</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {needsClientPicker && (
            <div>
              <Label htmlFor="issue-client">Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="issue-client" className="bg-white">
                  <SelectValue placeholder="Pick a client" />
                </SelectTrigger>
                <SelectContent>
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
            <Label htmlFor="issue-title">Title</Label>
            <Input
              id="issue-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary of the issue"
              className="bg-white"
            />
          </div>

          <div>
            <Label htmlFor="issue-desc">Description (optional)</Label>
            <Textarea
              id="issue-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="What's happening, when did it start, who's affected, anything we've tried…"
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as IssueStatus)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ISSUE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {ISSUE_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as IssuePriority)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ISSUE_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {ISSUE_PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as IssueCategory)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ISSUE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {ISSUE_CATEGORY_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <Label htmlFor="issue-due">Due date</Label>
              <Input
                id="issue-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="issue-tags">Tags (comma-separated)</Label>
              <Input
                id="issue-tags"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="e.g. urgent-client, q2"
                className="bg-white"
              />
            </div>
          </div>

          {defaultCommunicationId && (
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              Linked to the communication this issue was raised from.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={create.isPending}>
            {create.isPending ? "Creating…" : "Create issue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
