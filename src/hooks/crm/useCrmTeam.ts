import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type CrmTeamRole = "admin" | "crm_write" | "crm_read";

export interface CrmTeamMember {
  user_id: string;
  email: string;
  display_name: string | null;
  role: CrmTeamRole;
  granted_at: string;
}

export interface CrmInvitation {
  id: string;
  email: string;
  role: CrmTeamRole;
  status: "pending" | "accepted" | "revoked" | "expired";
  expires_at: string;
  created_at: string;
  invited_by: string | null;
  accepted_at: string | null;
}

export const useCrmTeam = () => {
  return useQuery({
    queryKey: ["crm-team-members"],
    queryFn: async (): Promise<CrmTeamMember[]> => {
      const { data, error } = await supabase.rpc("crm_list_team_members");
      if (error) throw error;
      return (data ?? []) as CrmTeamMember[];
    },
  });
};

export const useCrmInvitations = () => {
  return useQuery({
    queryKey: ["crm-invitations"],
    queryFn: async (): Promise<CrmInvitation[]> => {
      const { data, error } = await supabase
        .from("crm_invitations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CrmInvitation[];
    },
  });
};

export const useInviteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { email: string; role: CrmTeamRole }) => {
      const { data, error } = await supabase.functions.invoke("crm-invite-user", {
        body: vars,
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["crm-invitations"] });
      if (data?.email_sent) {
        toast.success("Invitation sent");
      } else {
        toast.warning(
          `Invitation created but email failed to send: ${data?.email_error ?? "unknown error"}`,
        );
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useChangeRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { user_id: string; new_role: CrmTeamRole }) => {
      const { data, error } = await supabase.functions.invoke("crm-change-role", {
        body: vars,
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-team-members"] });
      toast.success("Role updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useRevokeRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { user_id: string }) => {
      const { data, error } = await supabase.functions.invoke("crm-revoke-role", {
        body: vars,
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-team-members"] });
      toast.success("Access revoked");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useRevokeInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("crm_invitations")
        .update({ status: "revoked" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-invitations"] });
      toast.success("Invitation revoked");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};
