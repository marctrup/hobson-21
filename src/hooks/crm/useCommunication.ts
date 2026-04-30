import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

      return {
        communication: commRes.data,
        participants: partRes.data ?? [],
        attachments: attRes.data ?? [],
      };
    },
  });
