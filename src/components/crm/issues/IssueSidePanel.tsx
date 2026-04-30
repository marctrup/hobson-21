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
import { useIssue } from "@/hooks/crm/useIssue";
import {
  useDeleteIssue,
  useUpdateIssue,
} from "@/hooks/crm/useIssueMutations";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { useCrmTeam } from "@/hooks/crm/useCrmTeam";
import { useAuth } from "@/hooks/useAuth";
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
import { formatDateUK, formatDateTimeUK } from "@/lib/crm/labels";
import { IssueStatusPill } from "./IssueStatusPill";
import { IssuePriorityPill } from "./IssuePriorityDot";
import { IssueCommentsThread } from "./IssueCommentsThread";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issueId: string | null;
}

export const IssueSidePanel = ({ open, onOpenChange, issueId }: Props) => {
  const { data, isLoading } = useIssue(issueId);
  const { canWrite, isAdmin } = useCrmAccess();
  const { user } = useAuth();
  const del = useDeleteIssue();

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
              isAdmin ||
              (canWrite && data.issue.reported_by === user?.id)
            }
            onDelete={async () => {
              if (!issueId) return;
              try {
                await del.mutateAsync(issueId);
                toast.success("Issue deleted");
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
  data: ReturnType<typeof useIssue>["data"] & object;
  canWrite: boolean;
  canDelete: boolean;
  onDelete: () => Promise<void>;
  onClose: () => void;
}) => {
  const update = useUpdateIssue();
  const { data: team = [] } = useCrmTeam();
  const i = data.issue;

  const [editingDesc, setEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState(i.description ?? "");
  const [editingResolution, setEditingResolution] = useState(false);
  const [resolutionDraft, setResolutionDraft] = useState(
    i.resolution_note ?? "",
  );

  const isResolvedOrClosed = i.status === "resolved" || i.status === "closed";
  const isOverdue =
    !!i.due_date &&
    !isResolvedOrClosed &&
    new Date(i.due_date) < new Date(new Date().toDateString());

  const patch = (p: Parameters<typeof update.mutate>[0]["patch"]) =>
    update.mutate(
      { id: i.id, patch: p },
      {
        onError: (e: Error) =>
          toast.error("Save failed", { description: e.message }),
      },
    );

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <IssueStatusPill status={i.status} />
              <IssuePriorityPill priority={i.priority} />
              <span className="text-xs text-slate-500">
                {ISSUE_CATEGORY_LABELS[i.category]}
              </span>
            </div>
            <SheetTitle className="mt-2 text-base leading-snug">
              {i.title}
            </SheetTitle>
            <div className="text-xs text-slate-500 mt-1">
              {i.client_name && (
                <Link
                  to={`/crm/clients/${i.client_id}`}
                  className="hover:text-slate-900 hover:underline"
                >
                  {i.client_name}
                </Link>
              )}
              {i.reporter_name && (
                <>
                  <span> · Reported by {i.reporter_name}</span>
                </>
              )}
              <span> · Created {formatDateTimeUK(i.created_at)}</span>
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
        {/* Inline editors */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Status">
            {canWrite ? (
              <Select
                value={i.status}
                onValueChange={(v) => patch({ status: v as IssueStatus })}
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
            ) : (
              <span className="text-sm">{ISSUE_STATUS_LABELS[i.status]}</span>
            )}
          </Field>

          <Field label="Priority">
            {canWrite ? (
              <Select
                value={i.priority}
                onValueChange={(v) => patch({ priority: v as IssuePriority })}
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
            ) : (
              <span className="text-sm">{ISSUE_PRIORITY_LABELS[i.priority]}</span>
            )}
          </Field>

          <Field label="Category">
            {canWrite ? (
              <Select
                value={i.category}
                onValueChange={(v) => patch({ category: v as IssueCategory })}
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
            ) : (
              <span className="text-sm">{ISSUE_CATEGORY_LABELS[i.category]}</span>
            )}
          </Field>

          <Field label="Assignee">
            {canWrite && team.length > 0 ? (
              <Select
                value={i.assignee_id ?? "__none__"}
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
                {i.assignee_name ??
                  (i.assignee_id ? "Team member" : "Unassigned")}
              </span>
            )}
          </Field>

          <Field label="Due date">
            {canWrite ? (
              <Input
                type="date"
                value={i.due_date ?? ""}
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
                {i.due_date ? formatDateUK(i.due_date) : "—"}
              </span>
            )}
          </Field>

          <Field label="Resolved at">
            <span className="text-sm text-slate-700">
              {i.resolved_at ? formatDateTimeUK(i.resolved_at) : "—"}
            </span>
          </Field>
        </section>

        {/* Description */}
        <section>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs uppercase tracking-wide text-slate-500">
              Description
            </h3>
            {canWrite && !editingDesc && (
              <button
                onClick={() => {
                  setDescDraft(i.description ?? "");
                  setEditingDesc(true);
                }}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Edit
              </button>
            )}
          </div>
          {editingDesc ? (
            <div className="space-y-2">
              <Textarea
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                rows={5}
                className="bg-white"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDesc(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    patch({ description: descDraft.trim() || null });
                    setEditingDesc(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : i.description ? (
            <p className="text-sm text-slate-800 whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-md p-3">
              {i.description}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic">No description.</p>
          )}
        </section>

        {/* Resolution note (only visible when resolved/closed) */}
        {isResolvedOrClosed && (
          <section>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs uppercase tracking-wide text-slate-500">
                Resolution note
              </h3>
              {canWrite && !editingResolution && (
                <button
                  onClick={() => {
                    setResolutionDraft(i.resolution_note ?? "");
                    setEditingResolution(true);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  Edit
                </button>
              )}
            </div>
            {editingResolution ? (
              <div className="space-y-2">
                <Textarea
                  value={resolutionDraft}
                  onChange={(e) => setResolutionDraft(e.target.value)}
                  rows={3}
                  placeholder="What did we do to resolve this?"
                  className="bg-white"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingResolution(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      patch({ resolution_note: resolutionDraft.trim() || null });
                      setEditingResolution(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : i.resolution_note ? (
              <p className="text-sm text-slate-800 whitespace-pre-wrap bg-emerald-50 border border-emerald-200 rounded-md p-3">
                {i.resolution_note}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">
                No resolution note recorded.
              </p>
            )}
          </section>
        )}

        {/* Tags */}
        {i.tags && i.tags.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1">
              {i.tags.map((t) => (
                <span
                  key={t}
                  className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Linked communication */}
        {i.reported_via_communication_id && (
          <section className="text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 flex items-center gap-2">
            <ExternalLink className="size-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-600">
              Raised from a communication.{" "}
              <Link
                to={`/crm/communications?focus=${i.reported_via_communication_id}`}
                className="text-slate-900 hover:underline"
              >
                Open communications
              </Link>
            </span>
          </section>
        )}

        {/* Comments */}
        <IssueCommentsThread
          issueId={i.id}
          comments={data.comments}
          canWrite={canWrite}
        />

        {/* Delete */}
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
                  <AlertDialogTitle>Delete this issue?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the issue and all its comments. This cannot be undone.
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
    <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
      {label}
    </div>
    {children}
  </div>
);
