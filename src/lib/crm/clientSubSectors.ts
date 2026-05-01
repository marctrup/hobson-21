import { supabase } from "@/integrations/supabase/client";

/**
 * Replace the full set of sub-sectors linked to a client.
 * Performs a diff (delete removed + insert added) to minimise writes.
 */
export async function syncClientSubSectors(
  clientId: string,
  nextIds: string[],
): Promise<void> {
  const { data: existing, error: readErr } = await supabase
    .from("crm_client_sub_sectors")
    .select("sub_sector_id")
    .eq("client_id", clientId);
  if (readErr) throw readErr;

  const have = new Set((existing ?? []).map((r) => r.sub_sector_id as string));
  const want = new Set(nextIds);

  const toRemove = [...have].filter((id) => !want.has(id));
  const toAdd = [...want].filter((id) => !have.has(id));

  if (toRemove.length) {
    const { error } = await supabase
      .from("crm_client_sub_sectors")
      .delete()
      .eq("client_id", clientId)
      .in("sub_sector_id", toRemove);
    if (error) throw error;
  }

  if (toAdd.length) {
    const rows = toAdd.map((sub_sector_id) => ({ client_id: clientId, sub_sector_id }));
    const { error } = await supabase.from("crm_client_sub_sectors").insert(rows);
    if (error) throw error;
  }
}
