import { Banknote } from "lucide-react";
import { usePipelineValue } from "@/hooks/crm/dashboard/usePipelineValue";
import { formatGBP } from "@/lib/crm/labels";

interface Props {
  userId: string | null;
}

export const PipelineValueCard = ({ userId }: Props) => {
  const { data, isLoading } = usePipelineValue(userId);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
        <Banknote className="size-4" />
        Pipeline value (open opportunities)
      </div>
      {isLoading ? (
        <div className="text-sm text-slate-500 mt-2">Loading…</div>
      ) : !data || data.workspaceCount === 0 ? (
        <div className="mt-3 text-sm text-slate-500">
          No open opportunities yet. Add deal value and probability to clients
          to see pipeline value here.
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs text-slate-500">Mine (weighted)</div>
            <div className="text-2xl font-semibold text-slate-900">
              {formatGBP(data.mine)}
            </div>
            <div className="text-xs text-slate-500">
              Across {data.mineCount} client{data.mineCount === 1 ? "" : "s"}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-500">Workspace (weighted)</div>
            <div className="text-base font-medium text-slate-700">
              {formatGBP(data.workspace)}
            </div>
            <div className="text-xs text-slate-500">
              Across {data.workspaceCount} client
              {data.workspaceCount === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
