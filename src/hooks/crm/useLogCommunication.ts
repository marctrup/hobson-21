import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  CommChannel,
  CommDirection,
  CommSentiment,
  ParticipantKind,
  ParticipantRole,
} from "@/lib/crm/communicationsLabels";
import { MAX_ATTACHMENT_BYTES } from "@/lib/crm/communicationsLabels";

export interface NewParticipant {
  role_in_comm: ParticipantRole;
  kind: ParticipantKind;
  contact_id?: string | null;
  platform_user_id?: string | null;
  workspace_member_id?: string | null;
  external_name?: string | null;
  external_email?: string | null;
}

export interface NewCommunicationInput {
  client_id: string;
  channel: CommChannel;
  direction: CommDirection;
  occurred_at: string; // ISO
  subject?: string | null;
  summary?: string | null;
  body_plain?: string | null;
  body_html?: string | null;
  is_important?: boolean;
  sentiment?: CommSentiment | null;
  email_from?: string | null;
  email_to?: string[] | null;
  email_cc?: string[] | null;
  call_duration_seconds?: number | null;
  meeting_location?: string | null;
  pending_follow_up_note?: string | null;
}

export interface LogCommunicationPayload {
  communication: NewCommunicationInput;
  participants: NewParticipant[];
  files: File[]; // raw files; uploaded after RPC succeeds
}

export const useLogCommunication = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LogCommunicationPayload): Promise<string> => {
      // Validate attachments before any DB call
      for (const f of payload.files) {
        if (f.size > MAX_ATTACHMENT_BYTES) {
          throw new Error(`File too large, max 50MB: ${f.name}`);
        }
      }

      // 1. Atomic insert of communication + participants (no attachments yet —
      //    we need the comm id to know the storage path).
      const rpcPayload = {
        communication: payload.communication,
        participants: payload.participants,
        attachments: [] as unknown[],
      };
      const { data: commId, error: rpcErr } = await supabase.rpc(
        "crm_log_communication",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { p_payload: rpcPayload as any },
      );
      if (rpcErr) throw rpcErr;
      if (!commId) throw new Error("Server did not return a communication id");

      // 2. Upload files to storage (one by one — keeps the error message clear).
      const attachmentRows: Array<{
        file_name: string;
        mime_type: string | null;
        size_bytes: number;
        storage_path: string;
      }> = [];

      for (const f of payload.files) {
        const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${payload.communication.client_id}/${commId}/${Date.now()}_${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("crm-comm-attachments")
          .upload(path, f, {
            contentType: f.type || "application/octet-stream",
            upsert: false,
          });
        if (upErr) throw upErr;
        attachmentRows.push({
          file_name: f.name,
          mime_type: f.type || null,
          size_bytes: f.size,
          storage_path: path,
        });
      }

      // 3. Insert attachment rows now that uploads succeeded.
      if (attachmentRows.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const { error: insErr } = await supabase
          .from("communication_attachments")
          .insert(
            attachmentRows.map((a) => ({
              communication_id: commId as string,
              uploaded_by: user?.id ?? null,
              ...a,
            })),
          );
        if (insErr) throw insErr;
      }

      return commId as string;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["crm-communications"] });
      qc.invalidateQueries({
        queryKey: ["crm-client", vars.communication.client_id],
      });
      qc.invalidateQueries({ queryKey: ["crm-clients"] });
    },
  });
};

export const useDeleteCommunication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Best-effort cleanup of storage files first
      const { data: atts } = await supabase
        .from("communication_attachments")
        .select("storage_path")
        .eq("communication_id", id);
      if (atts && atts.length > 0) {
        await supabase.storage
          .from("crm-comm-attachments")
          .remove(atts.map((a) => a.storage_path));
      }
      const { error } = await supabase
        .from("communications")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-communications"] });
      qc.invalidateQueries({ queryKey: ["crm-communication"] });
    },
  });
};
