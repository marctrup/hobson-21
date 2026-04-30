import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import type { IssueRow } from "@/hooks/crm/useIssues";
import { IssueStatusPill } from "./IssueStatusPill";
import { IssuePriorityDot } from "./IssuePriorityDot";
import { ISSUE_CATEGORY_LABELS } from "@/lib/crm/issuesLabels";
import { formatDateUK } from "@/lib/crm/labels";
import { cn } from "@/lib/utils";

interface Props {
  rows: IssueRow[];
  isLoading?: boolean;
  showClient?: boolean;
  onSelect: (id: string) => void;
}

const isOverdue = (row: IssueRow): boolean => {
  if (!row.due_date) return false;
  if (row.status === "resolved" || row.status === "closed") return false;
  return new Date(row.due_date) < new Date(new Date().toDateString());
};

export const IssueList = ({ rows, isLoading, showClient, onSelect }: Props) => {
  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }
  if (!rows.length) {
    return (
      <div className="p-10 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-lg">
        No issues match these filters.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left font-medium px-3 py-2 w-10"></th>
            <th className="text-left font-medium px-3 py-2">Title</th>
            {showClient && (
              <th className="text-left font-medium px-3 py-2">Client</th>
            )}
            <th className="text-left font-medium px-3 py-2">Status</th>
            <th className="text-left font-medium px-3 py-2">Category</th>
            <th className="text-left font-medium px-3 py-2">Due</th>
            <th className="text-left font-medium px-3 py-2">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => {
            const overdue = isOverdue(r);
            return (
              <tr
                key={r.id}
                onClick={() => onSelect(r.id)}
                className="hover:bg-slate-50 cursor-pointer"
              >
                <td className="px-3 py-2 align-top">
                  <IssuePriorityDot priority={r.priority} />
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-slate-900 line-clamp-1">
                    {r.title}
                  </div>
                  {r.description && (
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {r.description}
                    </div>
                  )}
                </td>
                {showClient && (
                  <td className="px-3 py-2 text-slate-700">
                    {r.client_name ? (
                      <Link
                        to={`/crm/clients/${r.client_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-slate-900 hover:underline"
                      >
                        {r.client_name}
                      </Link>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                )}
                <td className="px-3 py-2">
                  <IssueStatusPill status={r.status} />
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {ISSUE_CATEGORY_LABELS[r.category]}
                </td>
                <td className="px-3 py-2">
                  {r.due_date ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs",
                        overdue ? "text-rose-600 font-medium" : "text-slate-600",
                      )}
                    >
                      {overdue && <CalendarClock className="size-3.5" />}
                      {formatDateUK(r.due_date)}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  {formatDateUK(r.updated_at)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
