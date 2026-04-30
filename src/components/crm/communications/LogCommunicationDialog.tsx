import { useEffect, useMemo, useState } from "react";
import { Plus, Star, Trash2, X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogCommunication } from "@/hooks/crm/useLogCommunication";
import type {
  NewParticipant,
  NewCommunicationInput,
} from "@/hooks/crm/useLogCommunication";
import { useCommunicationParticipantSearch } from "@/hooks/crm/useCommunicationParticipantSearch";
import {
  COMM_CHANNELS,
  COMM_CHANNEL_LABELS,
  COMM_DIRECTIONS,
  COMM_DIRECTION_LABELS,
  COMM_SENTIMENTS,
  COMM_SENTIMENT_LABELS,
  PARTICIPANT_ROLES,
  PARTICIPANT_ROLE_LABELS,
  MAX_ATTACHMENT_BYTES,
  formatBytes,
  type CommChannel,
  type CommDirection,
  type CommSentiment,
  type ParticipantRole,
} from "@/lib/crm/communicationsLabels";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fill the client when opened from the client detail page */
  defaultClientId?: string;
  onLogged?: (id: string) => void;
}

const isoNow = () => {
  const d = new Date();
  d.setSeconds(0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

export const LogCommunicationDialog = ({
  open,
  onOpenChange,
  defaultClientId,
  onLogged,
}: Props) => {
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [channel, setChannel] = useState<CommChannel>("email");
  const [direction, setDirection] = useState<CommDirection>("outbound");
  const [occurredAtLocal, setOccurredAtLocal] = useState<string>(isoNow());
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [bodyPlain, setBodyPlain] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [callMinutes, setCallMinutes] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [important, setImportant] = useState(false);
  const [sentiment, setSentiment] = useState<CommSentiment | "">("");
  const [participants, setParticipants] = useState<NewParticipant[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [followUp, setFollowUp] = useState(false);
  const [followUpNote, setFollowUpNote] = useState("");

  // Reset form when re-opened
  useEffect(() => {
    if (open) {
      setClientId(defaultClientId ?? "");
      setChannel("email");
      setDirection("outbound");
      setOccurredAtLocal(isoNow());
      setSubject("");
      setSummary("");
      setBodyPlain("");
      setBodyHtml("");
      setCallMinutes("");
      setMeetingLocation("");
      setImportant(false);
      setSentiment("");
      setParticipants([]);
      setFiles([]);
      setFollowUp(false);
      setFollowUpNote("");
    }
  }, [open, defaultClientId]);

  // Client picker (only when not pre-filled)
  const clientOptionsQ = useQuery({
    enabled: open && !defaultClientId,
    queryKey: ["crm-client-picker"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_clients")
        .select("id,name")
        .order("name", { ascending: true })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  const log = useLogCommunication();

  const handleAddFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const accepted: File[] = [];
    for (const f of Array.from(incoming)) {
      if (f.size > MAX_ATTACHMENT_BYTES) {
        toast.error("File too large, max 50MB", { description: f.name });
        continue;
      }
      accepted.push(f);
    }
    setFiles((prev) => [...prev, ...accepted]);
  };

  const submit = async () => {
    if (!clientId) {
      toast.error("Pick a client");
      return;
    }
    if (!occurredAtLocal) {
      toast.error("Pick a date/time");
      return;
    }
    const occurredISO = new Date(occurredAtLocal).toISOString();

    const comm: NewCommunicationInput = {
      client_id: clientId,
      channel,
      direction,
      occurred_at: occurredISO,
      subject: subject || null,
      summary: summary || null,
      body_plain: bodyPlain || null,
      body_html: channel === "email" ? bodyHtml || null : null,
      is_important: important,
      sentiment: sentiment ? sentiment : null,
      call_duration_seconds:
        channel === "call" && callMinutes
          ? Math.max(0, Math.round(Number(callMinutes) * 60))
          : null,
      meeting_location:
        (channel === "meeting" || channel === "video_call") && meetingLocation
          ? meetingLocation
          : null,
      pending_follow_up_note:
        followUp && followUpNote.trim() ? followUpNote.trim() : null,
    };

    try {
      const id = await log.mutateAsync({
        communication: comm,
        participants,
        files,
      });
      toast.success("Communication logged");
      onLogged?.(id);
      onOpenChange(false);
    } catch (e) {
      toast.error("Could not log communication", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const showEmailFields = channel === "email";
  const showCallFields = channel === "call";
  const showMeetingFields = channel === "meeting" || channel === "video_call";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log a communication</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Client */}
          {!defaultClientId && (
            <div>
              <Label>Client *</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {clientOptionsQ.data?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Channel + direction + date */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Channel *</Label>
              <Select
                value={channel}
                onValueChange={(v) => setChannel(v as CommChannel)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMM_CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {COMM_CHANNEL_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Direction *</Label>
              <Select
                value={direction}
                onValueChange={(v) => setDirection(v as CommDirection)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMM_DIRECTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {COMM_DIRECTION_LABELS[d]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Occurred at *</Label>
              <Input
                type="datetime-local"
                value={occurredAtLocal}
                onChange={(e) => setOccurredAtLocal(e.target.value)}
              />
            </div>
          </div>

          {/* Subject + summary */}
          <div>
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                channel === "call" ? "Optional — short call topic" : "Subject"
              }
            />
          </div>
          <div>
            <Label>Summary</Label>
            <Textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One or two sentences for the timeline"
            />
          </div>

          {/* Channel-specific */}
          {showEmailFields && (
            <>
              <div>
                <Label>Email body — HTML (paste from email client)</Label>
                <Textarea
                  rows={5}
                  value={bodyHtml}
                  onChange={(e) => setBodyHtml(e.target.value)}
                  placeholder="<p>Paste HTML here…</p>"
                  className="font-mono text-xs"
                />
                <div className="text-xs text-slate-500 mt-1">
                  Sanitised before saving.
                </div>
              </div>
              <div>
                <Label>Email body — plain text (for search)</Label>
                <Textarea
                  rows={4}
                  value={bodyPlain}
                  onChange={(e) => setBodyPlain(e.target.value)}
                />
              </div>
            </>
          )}
          {!showEmailFields && (
            <div>
              <Label>Body / notes</Label>
              <Textarea
                rows={4}
                value={bodyPlain}
                onChange={(e) => setBodyPlain(e.target.value)}
              />
            </div>
          )}
          {showCallFields && (
            <div className="w-40">
              <Label>Call duration (mins)</Label>
              <Input
                type="number"
                min={0}
                value={callMinutes}
                onChange={(e) => setCallMinutes(e.target.value)}
              />
            </div>
          )}
          {showMeetingFields && (
            <div>
              <Label>
                {channel === "video_call"
                  ? "Video link / location"
                  : "Meeting location"}
              </Label>
              <Input
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                placeholder={
                  channel === "video_call"
                    ? "e.g. https://meet.google.com/abc-defg-hij"
                    : "e.g. Hobson office, London"
                }
              />
            </div>
          )}

          {/* Participants */}
          <ParticipantsPicker
            clientId={clientId || null}
            participants={participants}
            onChange={setParticipants}
          />

          {/* Attachments */}
          <div>
            <Label>Attachments</Label>
            <label className="block border-2 border-dashed border-slate-300 rounded-md p-4 text-center cursor-pointer hover:border-slate-400 bg-white">
              <Upload className="size-5 mx-auto text-slate-400" />
              <div className="text-sm text-slate-600 mt-1">
                Click or drop files here · max 50MB each
              </div>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleAddFiles(e.target.files)}
              />
            </label>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center justify-between text-sm bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5"
                  >
                    <span className="truncate">
                      {f.name}{" "}
                      <span className="text-slate-500">
                        · {formatBytes(f.size)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Important + sentiment + follow-up */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm bg-white border border-slate-200 rounded-md px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
              />
              <Star className="size-4 text-amber-500" />
              Mark as important
            </label>
            <div>
              <Label className="text-xs">Sentiment (optional)</Label>
              <Select
                value={sentiment || "_none"}
                onValueChange={(v) =>
                  setSentiment(v === "_none" ? "" : (v as CommSentiment))
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Skip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Skip</SelectItem>
                  {COMM_SENTIMENTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {COMM_SENTIMENT_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={followUp}
                onChange={(e) => setFollowUp(e.target.checked)}
              />
              Create follow-up task
            </label>
            {followUp && (
              <Input
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                placeholder="What needs doing? e.g. Send pricing summary by Friday"
                className="bg-white"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={log.isPending}>
            {log.isPending ? "Saving…" : "Log communication"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ----------------------------- Participants ----------------------------- */

const ParticipantsPicker = ({
  clientId,
  participants,
  onChange,
}: {
  clientId: string | null;
  participants: NewParticipant[];
  onChange: (next: NewParticipant[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState<ParticipantRole>("to");
  const [externalOpen, setExternalOpen] = useState(false);
  const [externalName, setExternalName] = useState("");
  const [externalEmail, setExternalEmail] = useState("");

  const { data: options = [], isFetching } =
    useCommunicationParticipantSearch(clientId, search);

  const visible = useMemo(() => {
    const used = new Set(
      participants.map(
        (p) =>
          `${p.kind}:${
            p.contact_id ?? p.platform_user_id ?? p.workspace_member_id ?? ""
          }`,
      ),
    );
    return options.filter((o) => !used.has(`${o.kind}:${o.contact_id ?? o.platform_user_id ?? o.workspace_member_id ?? ""}`));
  }, [options, participants]);

  const addOption = (
    o: NonNullable<ReturnType<typeof useCommunicationParticipantSearch>["data"]>[number],
  ) => {
    onChange([
      ...participants,
      {
        role_in_comm: defaultRole,
        kind: o.kind,
        contact_id: o.contact_id ?? null,
        platform_user_id: o.platform_user_id ?? null,
        workspace_member_id: o.workspace_member_id ?? null,
        external_email: o.email ?? null,
      },
    ]);
    setSearch("");
    setOpen(false);
  };

  const addExternal = () => {
    if (!externalName.trim()) {
      toast.error("Name required for external participant");
      return;
    }
    onChange([
      ...participants,
      {
        role_in_comm: defaultRole,
        kind: "external",
        external_name: externalName.trim(),
        external_email: externalEmail.trim() || null,
      },
    ]);
    setExternalName("");
    setExternalEmail("");
    setExternalOpen(false);
  };

  const updateRole = (idx: number, role: ParticipantRole) => {
    const copy = [...participants];
    copy[idx] = { ...copy[idx], role_in_comm: role };
    onChange(copy);
  };

  const remove = (idx: number) => {
    onChange(participants.filter((_, i) => i !== idx));
  };

  const labelFor = (p: NewParticipant): string => {
    if (p.kind === "external") {
      return `${p.external_name}${p.external_email ? ` · ${p.external_email}` : ""}`;
    }
    if (p.external_email) return p.external_email;
    return p.kind === "contact"
      ? "Commercial contact"
      : p.kind === "platform_user"
        ? "Platform user"
        : "Team member";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label>Participants</Label>
        <div className="flex items-center gap-2">
          <Select
            value={defaultRole}
            onValueChange={(v) => setDefaultRole(v as ParticipantRole)}
          >
            <SelectTrigger className="h-8 w-28 text-xs bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PARTICIPANT_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {PARTICIPANT_ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="sm" disabled={!clientId}>
                <Plus className="size-3.5 mr-1" /> Add
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts, users, team…"
                autoFocus
              />
              <div className="mt-2 max-h-56 overflow-y-auto space-y-1">
                {isFetching && (
                  <div className="text-xs text-slate-500 px-1">Searching…</div>
                )}
                {!isFetching && visible.length === 0 && (
                  <div className="text-xs text-slate-500 px-1">No matches.</div>
                )}
                {visible.map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => addOption(o)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-sm"
                  >
                    <div className="font-medium text-slate-800">{o.label}</div>
                    {o.sublabel && (
                      <div className="text-xs text-slate-500 truncate">
                        {o.sublabel}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setOpen(false);
                    setExternalOpen(true);
                  }}
                >
                  + Add external person
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {externalOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 mb-2 space-y-2">
          <Input
            value={externalName}
            onChange={(e) => setExternalName(e.target.value)}
            placeholder="Name *"
          />
          <Input
            value={externalEmail}
            onChange={(e) => setExternalEmail(e.target.value)}
            placeholder="Email (optional)"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExternalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={addExternal}>
              Add
            </Button>
          </div>
        </div>
      )}

      {participants.length === 0 ? (
        <div className="text-sm text-slate-500 bg-white border border-slate-200 rounded-md px-3 py-2">
          No participants yet.
        </div>
      ) : (
        <ul className="space-y-1">
          {participants.map((p, i) => (
            <li
              key={i}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-2.5 py-1.5"
            >
              <Select
                value={p.role_in_comm}
                onValueChange={(v) => updateRole(i, v as ParticipantRole)}
              >
                <SelectTrigger className="h-7 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PARTICIPANT_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {PARTICIPANT_ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm flex-1 truncate">{labelFor(p)}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
