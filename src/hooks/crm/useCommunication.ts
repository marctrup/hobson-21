import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HydratedParticipant {
  id: string;
  communication_id: string;
  role_in_comm: string;
  kind: string;
  contact_id: string | null;
  platform_user_id: string | null;
  workspace_member_id: string | null;
  external_name: string | null;
  external_email: string | null;
  display_name: string | null;
  display_email: string | null;
}

export const useCommunication = (id: string | null | undefined) =>
  useQuery({
    enabled: !!id,
    queryKey: ["crm-communication", id],
    queryFn: async () => {
      if (!id) throw new Error("Missing id");

      const [commRes, partRes, attRes] = await Promise.all([
        supabase.from("communications").select("*").eq("id", id).single(),
        supabase
          .from("communication_participants")
          .select("*")
          .eq("communication_id", id)
          .order("created_at", { ascending: true }),
        supabase
          .from("communication_attachments")
          .select("*")
          .eq("communication_id", id)
          .order("created_at", { ascending: true }),
      ]);

      if (commRes.error) throw commRes.error;
      if (partRes.error) throw partRes.error;
      if (attRes.error) throw attRes.error;

      const participants = (partRes.data ?? []) as Array<
        Omit<HydratedParticipant, "display_name" | "display_email">
      >;

      // ---- Hydrate names from source tables ----
      const contactIds = Array.from(
        new Set(participants.map((p) => p.contact_id).filter(Boolean) as string[]),
      );
      const platformUserIds = Array.from(
        new Set(
          participants.map((p) => p.platform_user_id).filter(Boolean) as string[],
        ),
      );
      const workspaceMemberIds = Array.from(
        new Set(
          participants
            .map((p) => p.workspace_member_id)
            .filter(Boolean) as string[],
        ),
      );

      const [contactsRes, platformRes, teamRes] = await Promise.all([
        contactIds.length
          ? supabase
              .from("crm_contacts")
              .select("id,full_name,email")
              .in("id", contactIds)
          : Promise.resolve({ data: [], error: null }),
        platformUserIds.length
          ? supabase
              .from("crm_client_users")
              .select("id,full_name,email")
              .in("id", platformUserIds)
          : Promise.resolve({ data: [], error: null }),
        workspaceMemberIds.length
          ? supabase.rpc("crm_list_team_members")
          : Promise.resolve({ data: [], error: null }),
      ]);

      const contactMap = new Map(
        (contactsRes.data ?? []).map((c: { id: string; full_name: string; email: string | null }) => [
          c.id,
          { name: c.full_name, email: c.email },
        ]),
      );
      const platformMap = new Map(
        (platformRes.data ?? []).map((u: { id: string; full_name: string; email: string | null }) => [
          u.id,
          { name: u.full_name, email: u.email },
        ]),
      );
      // Team RPC may fail for non-admins — tolerate that silently.
      const teamRows = Array.isArray(teamRes.data)
        ? (teamRes.data as Array<{
            user_id: string;
            email: string;
            display_name: string | null;
          }>)
        : [];
      const teamMap = new Map(
        teamRows.map((m) => [
          m.user_id,
          { name: m.display_name || m.email, email: m.email },
        ]),
      );

      const hydrated: HydratedParticipant[] = participants.map((p) => {
        let display_name: string | null = null;
        let display_email: string | null = null;

        if (p.kind === "external") {
          display_name = p.external_name ?? null;
          display_email = p.external_email ?? null;
        } else if (p.contact_id && contactMap.has(p.contact_id)) {
          const c = contactMap.get(p.contact_id)!;
          display_name = c.name;
          display_email = c.email ?? p.external_email ?? null;
        } else if (p.platform_user_id && platformMap.has(p.platform_user_id)) {
          const u = platformMap.get(p.platform_user_id)!;
          display_name = u.name;
          display_email = u.email ?? p.external_email ?? null;
        } else if (
          p.workspace_member_id &&
          teamMap.has(p.workspace_member_id)
        ) {
          const m = teamMap.get(p.workspace_member_id)!;
          display_name = m.name;
          display_email = m.email ?? p.external_email ?? null;
        } else {
          // Fallback: only email available (e.g. team RPC denied for read-only user)
          display_email = p.external_email ?? null;
        }

        return { ...p, display_name, display_email };
      });

      return {
        communication: commRes.data,
        participants: hydrated,
        attachments: attRes.data ?? [],
      };
    },
  });
