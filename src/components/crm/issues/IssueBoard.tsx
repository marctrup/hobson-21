import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { IssueRow } from "@/hooks/crm/useIssues";
import {
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
  type IssueStatus,
} from "@/lib/crm/issuesLabels";
import { IssuePriorityDot } from "./IssuePriorityDot";
import { formatDateUK } from "@/lib/crm/labels";
import { cn } from "@/lib/utils";

interface Props {
  rows: IssueRow[];
  isLoading?: boolean;
  showClient?: boolean;
  onSelect: (id: string) => void;
}

// Keep all statuses as columns so the board stays a complete picture.
const COLUMN_ORDER: IssueStatus[] = [...ISSUE_STATUSES];

export const IssueBoard = ({ rows, isLoading, showClient, onSelect }: Props) => {
  const grouped = useMemo(() => {
    const map = new Map<IssueStatus, IssueRow[]>();
    for (const s of COLUMN_ORDER) map.set(s, []);
    for (const r of rows) map.get(r.status)?.push(r);
    return map;
  }, [rows]);

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {COLUMN_ORDER.map((status) => {
        const list = grouped.get(status) ?? [];
        return (
          <div
            key={status}
            className="bg-slate-50 border border-slate-200 rounded-lg flex flex-col min-h-[180px]"
          >
            <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                {ISSUE_STATUS_LABELS[status]}
              </span>
              <span className="text-xs text-slate-500">{list.length}</span>
            </div>
            <div className="p-2 space-y-2 flex-1">
              {list.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-6">—</div>
              ) : (
                list.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelect(r.id)}
                    className={cn(
                      "block w-full text-left bg-white border border-slate-200 rounded-md p-2.5 hover:border-slate-400 transition-colors",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <IssuePriorityDot
                        priority={r.priority}
                        className="mt-1.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 line-clamp-2">
                          {r.title}
                        </div>
                        {showClient && r.client_name && (
                          <Link
                            to={`/crm/clients/${r.client_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-slate-500 hover:text-slate-900 hover:underline mt-0.5 inline-block"
                          >
                            {r.client_name}
                          </Link>
                        )}
                        {r.due_date && (
                          <div className="text-xs text-slate-500 mt-1">
                            Due {formatDateUK(r.due_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
