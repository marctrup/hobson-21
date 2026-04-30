import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import {
  ISSUE_STATUS_LABELS,
  type IssueStatus,
} from "@/lib/crm/issuesLabels";
import { formatDateTimeUK } from "@/lib/crm/labels";
import {
  useAddIssueComment,
  useDeleteIssueComment,
} from "@/hooks/crm/useIssueMutations";
import type { IssueComment } from "@/hooks/crm/useIssue";
import { useAuth } from "@/hooks/useAuth";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  issueId: string;
  comments: IssueComment[];
  canWrite: boolean;
}

export const IssueCommentsThread = ({ issueId, comments, canWrite }: Props) => {
  const add = useAddIssueComment();
  const del = useDeleteIssueComment();
  const { user } = useAuth();
  const { isAdmin } = useCrmAccess();
  const [body, setBody] = useState("");

  const submit = async () => {
    if (!body.trim()) return;
    try {
      await add.mutateAsync({ issueId, body: body.trim() });
      setBody("");
    } catch (e) {
      toast.error("Could not add comment", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  return (
    <section>
      <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
        Activity
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No activity yet.</p>
      ) : (
        <ol className="space-y-3">
          {comments.map((c) => {
            const canDelete =
              isAdmin || (canWrite && c.author_id === user?.id);
            if (c.is_status_change) {
              const from = (c.metadata?.from as IssueStatus | undefined) ?? null;
              const to = (c.metadata?.to as IssueStatus | undefined) ?? null;
              return (
                <li
                  key={c.id}
                  className="flex items-center gap-2 text-xs text-slate-500"
                >
                  <span className="inline-block size-1.5 rounded-full bg-slate-300" />
                  <span>
                    <span className="text-slate-700">
                      {c.author_name ?? "Someone"}
                    </span>{" "}
                    changed status:{" "}
                    {from ? (
                      <span className="font-medium text-slate-700">
                        {ISSUE_STATUS_LABELS[from]}
                      </span>
                    ) : (
                      "—"
                    )}{" "}
                    →{" "}
                    {to ? (
                      <span className="font-medium text-slate-700">
                        {ISSUE_STATUS_LABELS[to]}
                      </span>
                    ) : (
                      "—"
                    )}
                  </span>
                  <span className="text-slate-400">
                    · {formatDateTimeUK(c.created_at)}
                  </span>
                </li>
              );
            }
            return (
              <li
                key={c.id}
                className={cn(
                  "bg-white border border-slate-200 rounded-md p-3",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-sm font-medium text-slate-800">
                    {c.author_name ?? "Unknown"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      {formatDateTimeUK(c.created_at)}
                    </span>
                    {canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="text-slate-400 hover:text-rose-600"
                            aria-label="Delete comment"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => del.mutate(c.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                  {c.body}
                </p>
              </li>
            );
          })}
        </ol>
      )}

      {canWrite && (
        <div className="mt-3 space-y-2">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            className="bg-white"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={submit}
              disabled={!body.trim() || add.isPending}
            >
              {add.isPending ? "Posting…" : "Post comment"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
