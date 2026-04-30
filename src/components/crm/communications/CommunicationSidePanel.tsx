import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { AlertCircle, CheckSquare, Download, Star, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { LogIssueDialog } from "@/components/crm/issues/LogIssueDialog";
import { LogTaskDialog } from "@/components/crm/tasks/LogTaskDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
import { ChannelIcon } from "./ChannelIcon";
import { useCommunication } from "@/hooks/crm/useCommunication";
import { useDeleteCommunication } from "@/hooks/crm/useLogCommunication";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  COMM_CHANNEL_LABELS,
  COMM_DIRECTION_BADGE,
  COMM_DIRECTION_LABELS,
  COMM_SENTIMENT_LABELS,
  PARTICIPANT_KIND_LABELS,
  PARTICIPANT_ROLE_LABELS,
  formatBytes,
  type CommChannel,
  type ParticipantKind,
  type ParticipantRole,
} from "@/lib/crm/communicationsLabels";
import { formatDateTimeUK } from "@/lib/crm/labels";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communicationId: string | null;
}

const PARTICIPANT_ROLE_ORDER: ParticipantRole[] = [
  "from",
  "organiser",
  "to",
  "cc",
  "bcc",
  "attendee",
];

export const CommunicationSidePanel = ({
  open,
  onOpenChange,
  communicationId,
}: Props) => {
  const { data, isLoading } = useCommunication(communicationId);
  const { canWrite, isAdmin } = useCrmAccess();
  const { user } = useAuth();
  const del = useDeleteCommunication();

  const cleanHtml = useMemo(() => {
    if (!data?.communication?.body_html) return null;
    return DOMPurify.sanitize(data.communication.body_html, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
      FORBID_ATTR: ["onerror", "onload", "onclick"],
    });
  }, [data?.communication?.body_html]);

  if (!open) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto"
      >
        {isLoading || !data ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : (
          <PanelBody
            data={data}
            cleanHtml={cleanHtml}
            canWrite={canWrite}
            canDelete={
              isAdmin ||
              (canWrite && data.communication.logged_by === user?.id)
            }
            onDelete={async () => {
              if (!communicationId) return;
              await del.mutateAsync(communicationId);
              toast.success("Communication deleted");
              onOpenChange(false);
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
  cleanHtml,
  canWrite,
  canDelete,
  onDelete,
  onClose,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { communication: any; participants: any[]; attachments: any[] };
  cleanHtml: string | null;
  canWrite: boolean;
  canDelete: boolean;
  onDelete: () => Promise<void>;
  onClose: () => void;
}) => {
  const c = data.communication;
  const channel = c.channel as CommChannel;
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const issuePrefill = useMemo(() => {
    const title =
      (c.subject && c.subject.trim()) ||
      (c.summary ? c.summary.split("\n")[0].slice(0, 200) : "") ||
      "Issue from communication";
    const description = c.summary || c.body_plain || "";
    return { title, description };
  }, [c.subject, c.summary, c.body_plain]);

  const taskPrefill = useMemo(() => {
    const baseTitle =
      (c.pending_follow_up_note &&
        c.pending_follow_up_note.split("\n")[0].slice(0, 200)) ||
      (c.subject && c.subject.trim()) ||
      (c.summary ? c.summary.split("\n")[0].slice(0, 200) : "") ||
      "Follow up on communication";
    const notes =
      c.pending_follow_up_note || c.summary || c.body_plain || "";
    // Default due: 3 days from the comm's occurred_at (matches backfill logic).
    const dueBase = c.occurred_at ? new Date(c.occurred_at) : new Date();
    dueBase.setDate(dueBase.getDate() + 3);
    const dueDate = dueBase.toISOString().slice(0, 10);
    return { title: baseTitle, notes, dueDate };
  }, [c.pending_follow_up_note, c.subject, c.summary, c.body_plain, c.occurred_at]);

  const grouped = useMemo(() => {
    const map = new Map<ParticipantRole, typeof data.participants>();
    for (const p of data.participants) {
      const key = p.role_in_comm as ParticipantRole;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return PARTICIPANT_ROLE_ORDER.filter((r) => map.has(r)).map((r) => ({
      role: r,
      list: map.get(r)!,
    }));
  }, [data.participants]);

  return (
    <>
      <SheetHeader>
        <div className="flex items-start gap-3">
          <div className="mt-1 size-9 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <ChannelIcon channel={channel} className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium",
                  COMM_DIRECTION_BADGE[c.direction],
                )}
              >
                {COMM_DIRECTION_LABELS[c.direction]}
              </span>
              <span className="text-xs text-slate-500">
                {COMM_CHANNEL_LABELS[channel]}
              </span>
              {c.is_important && (
                <Star className="size-4 text-amber-500 fill-amber-400" />
              )}
              {c.needs_review && (
                <span className="text-[10px] uppercase tracking-wide text-rose-600">
                  Needs review
                </span>
              )}
            </div>
            <SheetTitle className="mt-1 text-base">
              {c.subject || c.summary || "(no subject)"}
            </SheetTitle>
            <div className="text-xs text-slate-500 mt-1">
              {formatDateTimeUK(c.occurred_at)}
              {c.sentiment && ` · ${COMM_SENTIMENT_LABELS[c.sentiment as keyof typeof COMM_SENTIMENT_LABELS]}`}
            </div>
            {c.client_id && (
              <div className="mt-1">
                <Link
                  to={`/crm/clients/${c.client_id}?tab=communications&focusComm=${c.id}`}
                  className="text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  View on client →
                </Link>
              </div>
            )}
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

      <div className="mt-4 space-y-4">
        {/* Participants */}
        {grouped.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Participants
            </h3>
            <div className="space-y-1.5">
              {grouped.map((g) => (
                <div key={g.role} className="flex items-start gap-2 text-sm">
                  <span className="w-20 text-slate-500 shrink-0">
                    {PARTICIPANT_ROLE_LABELS[g.role]}
                  </span>
                  <div className="flex-1">
                    {g.list.map((p) => (
                      <div key={p.id} className="text-slate-800">
                        <ParticipantLine p={p} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Channel-specific */}
        {channel === "call" && c.call_duration_seconds != null && (
          <section className="text-sm">
            <span className="text-slate-500">Duration: </span>
            <span className="text-slate-800">
              {Math.round(c.call_duration_seconds / 60)} min
            </span>
          </section>
        )}
        {(channel === "meeting" || channel === "video_call") &&
          c.meeting_location && (
            <section className="text-sm">
              <span className="text-slate-500">Location: </span>
              <span className="text-slate-800">{c.meeting_location}</span>
            </section>
          )}

        {/* Summary */}
        {c.summary && (
          <section>
            <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Summary
            </h3>
            <p className="text-sm text-slate-800 whitespace-pre-wrap">
              {c.summary}
            </p>
          </section>
        )}

        {/* Body */}
        {(cleanHtml || c.body_plain) && (
          <section>
            <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              {channel === "email" ? "Email body" : "Body"}
            </h3>
            {cleanHtml ? (
              <div
                className="prose prose-sm max-w-none bg-slate-50 border border-slate-200 rounded-md p-4 text-slate-800"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            ) : (
              <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans bg-slate-50 border border-slate-200 rounded-md p-3">
                {c.body_plain}
              </pre>
            )}
          </section>
        )}

        {/* Attachments */}
        {data.attachments.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Attachments ({data.attachments.length})
            </h3>
            <ul className="space-y-1">
              {data.attachments.map((a) => (
                <AttachmentItem key={a.id} a={a} />
              ))}
            </ul>
          </section>
        )}

        {/* Linked task indicator (replaces the old amber pending-follow-up banner) */}
        {c.linked_task_id && (
          <section className="text-sm bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2 flex items-center gap-2">
            <CheckSquare className="size-4 text-emerald-700 shrink-0" />
            <span className="text-emerald-900">
              A task has been created from this communication.{" "}
              <Link
                to={`/crm/tasks?focus=${c.linked_task_id}`}
                className="underline hover:no-underline"
              >
                Open task
              </Link>
            </span>
          </section>
        )}

        {/* Actions */}
        {(canWrite || canDelete) && (
          <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2">
            {canWrite && !c.linked_task_id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTaskDialogOpen(true)}
              >
                <CheckSquare className="size-4 mr-1" /> Create task from this
              </Button>
            )}
            {canWrite && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIssueDialogOpen(true)}
              >
                <AlertCircle className="size-4 mr-1" /> Create issue from this
              </Button>
            )}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-rose-600">
                    <Trash2 className="size-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this communication?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes the communication and all linked
                      participants and attachments. This cannot be undone.
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
            )}
          </div>
        )}
      </div>

      {canWrite && (
        <LogIssueDialog
          open={issueDialogOpen}
          onOpenChange={setIssueDialogOpen}
          defaultClientId={c.client_id}
          defaultCommunicationId={c.id}
          defaultTitle={issuePrefill.title}
          defaultDescription={issuePrefill.description}
          defaultCategory="support"
        />
      )}
      {canWrite && (
        <LogTaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          defaultClientId={c.client_id}
          defaultCommunicationId={c.id}
          defaultTitle={taskPrefill.title}
          defaultNotes={taskPrefill.notes}
          defaultDueDate={taskPrefill.dueDate}
        />
      )}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ParticipantLine = ({ p }: { p: any }) => {
  const kind = p.kind as ParticipantKind;
  const name: string | null = p.display_name ?? null;
  const email: string | null = p.display_email ?? p.external_email ?? null;
  const kindLabel = PARTICIPANT_KIND_LABELS[kind];

  return (
    <span>
      {name ? (
        <span className="text-slate-800">{name}</span>
      ) : (
        <span className="text-slate-700">{kindLabel}</span>
      )}
      {email && <span className="text-slate-500"> · {email}</span>}
      {kind === "external" && (
        <span className="text-slate-400 text-xs ml-1">(external)</span>
      )}
      {name && kind !== "external" && (
        <span className="text-slate-400 text-xs ml-1">({kindLabel})</span>
      )}
    </span>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AttachmentItem = ({ a }: { a: any }) => {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.storage
        .from("crm-comm-attachments")
        .createSignedUrl(a.storage_path, 60);
      if (error) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error("Could not generate download link", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="flex items-center justify-between text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white">
      <div className="min-w-0">
        <div className="truncate text-slate-800">{a.file_name}</div>
        <div className="text-xs text-slate-500">
          {a.mime_type ?? "—"} · {formatBytes(a.size_bytes)}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        disabled={busy}
        onClick={download}
        className="shrink-0"
      >
        <Download className="size-4" />
      </Button>
    </li>
  );
};
