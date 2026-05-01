import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SubSector {
  id: string;
  sector: string;
  label: string;
  sort_order: number;
  is_active: boolean;
}

/** All active sub-sectors, ordered by (sector, sort_order, label). */
export function useSubSectors() {
  return useQuery({
    queryKey: ["crm-sub-sectors"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<SubSector[]> => {
      const { data, error } = await supabase
        .from("crm_sub_sectors")
        .select("id,sector,label,sort_order,is_active")
        .eq("is_active", true)
        .order("sector", { ascending: true })
        .order("sort_order", { ascending: true })
        .order("label", { ascending: true });
      if (error) throw error;
      return (data ?? []) as SubSector[];
    },
  });
}

/** The set of sub-sector ids selected for a given client. */
export function useClientSubSectors(clientId: string | undefined) {
  return useQuery({
    queryKey: ["crm-client-sub-sectors", clientId],
    enabled: !!clientId,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("crm_client_sub_sectors")
        .select("sub_sector_id")
        .eq("client_id", clientId!);
      if (error) throw error;
      return (data ?? []).map((r) => r.sub_sector_id as string);
    },
  });
}
