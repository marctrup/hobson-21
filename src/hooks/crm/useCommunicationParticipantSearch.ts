import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ParticipantKind } from "@/lib/crm/communicationsLabels";

export interface ParticipantOption {
  key: string; // unique within the combobox
  kind: ParticipantKind;
  label: string;
  sublabel?: string;
  contact_id?: string;
  platform_user_id?: string;
  workspace_member_id?: string;
  email?: string | null;
}

/**
 * Searches across four sources for the participants picker:
 * 1. crm_contacts for the current client (commercial contacts)
 * 2. crm_client_users for the current client (platform users)
 * 3. crm_team_members via crm_list_team_members RPC (workspace members)
 * 4. (External people are added inline by the form, not searched here)
 */
export const useCommunicationParticipantSearch = (
  clientId: string | null,
  search: string,
) =>
  useQuery({
    enabled: !!clientId,
    queryKey: ["crm-comm-participant-search", clientId, search],
    queryFn: async (): Promise<ParticipantOption[]> => {
      if (!clientId) return [];
      const term = search.trim();
      const ilikeTerm = `%${term}%`;

      const contactsP = supabase
        .from("crm_contacts")
        .select("id,full_name,email,job_title")
        .eq("client_id", clientId)
        .order("is_primary", { ascending: false })
        .limit(20);

      const platformUsersP = supabase
        .from("crm_client_users")
        .select("id,full_name,email,job_title")
        .eq("client_id", clientId)
        .limit(20);

      const teamMembersP = supabase.rpc("crm_list_team_members");

      const [contactsRes, platformRes, teamRes] = await Promise.all([
        term
          ? contactsP.or(`full_name.ilike.${ilikeTerm},email.ilike.${ilikeTerm}`)
          : contactsP,
        term
          ? platformUsersP.or(
              `full_name.ilike.${ilikeTerm},email.ilike.${ilikeTerm}`,
            )
          : platformUsersP,
        teamMembersP,
      ]);

      const out: ParticipantOption[] = [];

      for (const c of contactsRes.data ?? []) {
        out.push({
          key: `contact:${c.id}`,
          kind: "contact",
          label: c.full_name,
          sublabel: [c.job_title, c.email].filter(Boolean).join(" · "),
          contact_id: c.id,
          email: c.email,
        });
      }
      for (const u of platformRes.data ?? []) {
        out.push({
          key: `platform_user:${u.id}`,
          kind: "platform_user",
          label: u.full_name,
          sublabel: [u.job_title, u.email].filter(Boolean).join(" · "),
          platform_user_id: u.id,
          email: u.email,
        });
      }
      const teamRows = (teamRes.data ?? []) as Array<{
        user_id: string;
        email: string;
        display_name: string | null;
      }>;
      for (const m of teamRows) {
        const label = m.display_name || m.email;
        if (
          term &&
          !label.toLowerCase().includes(term.toLowerCase()) &&
          !m.email.toLowerCase().includes(term.toLowerCase())
        ) {
          continue;
        }
        out.push({
          key: `workspace_member:${m.user_id}`,
          kind: "workspace_member",
          label,
          sublabel: m.email,
          workspace_member_id: m.user_id,
          email: m.email,
        });
      }

      return out;
    },
  });
