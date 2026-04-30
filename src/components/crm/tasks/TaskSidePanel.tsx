import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, X, ExternalLink, CalendarClock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTask } from "@/hooks/crm/useTask";
import {
  useDeleteTask,
  useUpdateTask,
} from "@/hooks/crm/useTaskMutations";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { useCrmTeam } from "@/hooks/crm/useCrmTeam";
import { useAuth } from "@/hooks/useAuth";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/crm/tasksLabels";
import { formatDateUK, formatDateTimeUK } from "@/lib/crm/labels";
import { TaskStatusPill } from "./TaskStatusPill";
import { TaskPriorityDot } from "./TaskPriorityDot";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
}

export const TaskSidePanel = ({ open, onOpenChange, taskId }: Props) => {
  const { data, isLoading } = useTask(taskId);
  const { canWrite, isAdmin } = useCrmAccess();
  const { user } = useAuth();
  const del = useDeleteTask();

  if (!open) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
      >
        {isLoading || !data ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : (
          <PanelBody
            data={data}
            canWrite={canWrite}
            canDelete={
              isAdmin || (canWrite && data.created_by === user?.id)
            }
            onDelete={async () => {
              if (!taskId) return;
              try {
                await del.mutateAsync(taskId);
                toast.success("Task deleted");
                onOpenChange(false);
              } catch (e) {
                toast.error("Could not delete", {
                  description: e instanceof Error ? e.message : String(e),
                });
              }
            }}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

const PanelBody = ({
  data,
  canWrite,
  canDelete,
  onDelete,
  onClose,
}: {
  data: NonNullable<ReturnType<typeof useTask>["data"]>;
  canWrite: boolean;
  canDelete: boolean;
  onDelete: () => Promise<void>;
  onClose: () => void;
}) => {
  const update = useUpdateTask();
  const { data: team = [] } = useCrmTeam();
  const t = data;

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(t.title);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(t.notes ?? "");

  const isClosed = t.status === "done" || t.status === "cancelled";
  const isOverdue =
    !!t.due_date &&
    !isClosed &&
    new Date(t.due_date) < new Date(new Date().toDateString());

  const patch = (p: Parameters<typeof update.mutate>[0]["patch"]) =>
    update.mutate(
      { id: t.id, patch: p },
      {
        onError: (e: Error) =>
          toast.error("Save failed", { description: e.message }),
      },
    );

  const isBackfilled = !!t.source_communication_id;

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <TaskStatusPill status={t.status} />
              <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                <TaskPriorityDot priority={t.priority} />
                {TASK_PRIORITY_LABELS[t.priority]}
              </span>
            </div>
            {editingTitle ? (
              <div className="mt-2 space-y-2">
                <Input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="bg-white"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTitleDraft(t.title);
                      setEditingTitle(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const next = titleDraft.trim();
                      if (!next) {
                        toast.error("Title cannot be empty");
                        return;
                      }
                      patch({ title: next });
                      setEditingTitle(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <SheetTitle
                className={cn(
                  "mt-2 text-base leading-snug",
                  t.status === "done" && "line-through text-slate-500",
                )}
                onClick={() => canWrite && setEditingTitle(true)}
                role={canWrite ? "button" : undefined}
              >
                {t.title}
              </SheetTitle>
            )}
            <div className="text-xs text-slate-500 mt-1">
              {t.client_name && t.client_id && (
                <Link
                  to={`/crm/clients/${t.client_id}`}
                  className="hover:text-slate-900 hover:underline"
                >
                  {t.client_name}
                </Link>
              )}
              {!t.client_id && (
                <span className="italic">Standalone (no client)</span>
              )}
              {t.creator_name && <span> · Created by {t.creator_name}</span>}
              <span> · Created {formatDateTimeUK(t.created_at)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
      </SheetHeader>

      <div className="mt-4 space-y-5">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Status">
            {canWrite ? (
              <Select
                value={t.status}
                onValueChange={(v) => patch({ status: v as TaskStatus })}
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
            ) : (
              <span className="text-sm">{TASK_STATUS_LABELS[t.status]}</span>
            )}
          </Field>

          <Field label="Priority">
            {canWrite ? (
              <Select
                value={t.priority}
                onValueChange={(v) => patch({ priority: v as TaskPriority })}
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
            ) : (
              <span className="text-sm">
                {TASK_PRIORITY_LABELS[t.priority]}
              </span>
            )}
          </Field>

          <Field label="Assignee">
            {canWrite && team.length > 0 ? (
              <Select
                value={t.assignee_id ?? "__none__"}
                onValueChange={(v) =>
                  patch({ assignee_id: v === "__none__" ? null : v })
                }
              >
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
            ) : (
              <span className="text-sm">
                {t.assignee_name ??
                  (t.assignee_id ? "Team member" : "Unassigned")}
              </span>
            )}
          </Field>

          <Field label="Due date">
            {canWrite ? (
              <Input
                type="date"
                value={t.due_date ?? ""}
                onChange={(e) =>
                  patch({ due_date: e.target.value || null })
                }
                className="bg-white"
              />
            ) : (
              <span
                className={cn(
                  "text-sm inline-flex items-center gap-1",
                  isOverdue ? "text-rose-600 font-medium" : "",
                )}
              >
                {isOverdue && <CalendarClock className="size-3.5" />}
                {t.due_date ? formatDateUK(t.due_date) : "—"}
              </span>
            )}
          </Field>

          <Field label="Completed at">
            <span className="text-sm text-slate-700">
              {t.completed_at ? formatDateTimeUK(t.completed_at) : "—"}
            </span>
          </Field>
        </section>

        {/* Notes */}
        <section>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs uppercase tracking-wide text-slate-500">
              Notes
            </h3>
            {canWrite && !editingNotes && (
              <button
                onClick={() => {
                  setNotesDraft(t.notes ?? "");
                  setEditingNotes(true);
                }}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Edit
              </button>
            )}
          </div>
          {editingNotes ? (
            <div className="space-y-2">
              <Textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={5}
                className="bg-white"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingNotes(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    patch({ notes: notesDraft.trim() || null });
                    setEditingNotes(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : t.notes ? (
            <p className="text-sm text-slate-800 whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-md p-3">
              {t.notes}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic">No notes.</p>
          )}
        </section>

        {/* Tags */}
        {t.tags && t.tags.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1">
              {t.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Source communication (backfill / ad-hoc) */}
        {isBackfilled && (
          <section className="text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 flex items-center gap-2">
            <ExternalLink className="size-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-600">
              Created from a communication
              {t.source_communication_subject
                ? `: "${t.source_communication_subject}"`
                : ""}
              .{" "}
              <Link
                to={`/crm/communications?focus=${t.source_communication_id}`}
                className="text-slate-900 hover:underline"
              >
                View original note
              </Link>
            </span>
          </section>
        )}

        {/* Linked issue */}
        {t.linked_issue_id && (
          <section className="text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 flex items-center gap-2">
            <ExternalLink className="size-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-600">
              Linked to issue
              {t.linked_issue_title ? `: "${t.linked_issue_title}"` : ""}.
            </span>
          </section>
        )}

        {canDelete && (
          <div className="pt-4 border-t border-slate-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-rose-600">
                  <Trash2 className="size-4 mr-1" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the task. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="text-xs text-slate-500 mb-1">{label}</div>
    {children}
  </div>
);
