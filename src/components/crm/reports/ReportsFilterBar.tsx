import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useReportsFilters, PRESET_LABELS, DateRangePreset } from "./ReportsFiltersContext";

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

interface OwnerOption {
  user_id: string;
  email: string;
  display_name: string | null;
}

const useOwners = () =>
  useQuery({
    queryKey: ["crm-team-owners-for-reports"],
    queryFn: async (): Promise<OwnerOption[]> => {
      const { data, error } = await supabase.rpc("crm_list_team_members");
      if (error) return [];
      return ((data ?? []) as OwnerOption[]).map((r) => ({
        user_id: r.user_id,
        email: r.email,
        display_name: r.display_name,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

export const ReportsFilterBar = () => {
  const f = useReportsFilters();
  const ownersQ = useOwners();

  const endInclusive = new Date(f.endDate);
  endInclusive.setDate(endInclusive.getDate() - 1);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Range
        </label>
        <Select
          value={f.preset}
          onValueChange={(v) => f.setPreset(v as DateRangePreset)}
        >
          <SelectTrigger className="h-8 w-[170px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PRESET_LABELS) as DateRangePreset[]).map((k) => (
              <SelectItem key={k} value={k}>
                {PRESET_LABELS[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {f.preset === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="h-8 w-[140px] text-sm"
            value={isoDate(f.startDate)}
            onChange={(e) =>
              f.setCustomRange(new Date(e.target.value), endInclusive)
            }
          />
          <span className="text-xs text-slate-400">→</span>
          <Input
            type="date"
            className="h-8 w-[140px] text-sm"
            value={isoDate(endInclusive)}
            onChange={(e) =>
              f.setCustomRange(f.startDate, new Date(e.target.value))
            }
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Owner
        </label>
        <Select value={f.ownerId} onValueChange={(v) => f.setOwnerId(v)}>
          <SelectTrigger className="h-8 w-[200px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {(ownersQ.data ?? []).map((o) => (
              <SelectItem key={o.user_id} value={o.user_id}>
                {o.display_name || o.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto text-xs text-slate-500">
        Bucket: <span className="font-medium text-slate-700">{f.bucket}</span>
      </div>
    </div>
  );
};
