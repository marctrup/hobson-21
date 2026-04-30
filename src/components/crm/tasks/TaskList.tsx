import { Link } from "react-router-dom";
import { CalendarClock, Check } from "lucide-react";
import type { TaskRow } from "@/hooks/crm/useTasks";
import { TaskStatusPill } from "./TaskStatusPill";
import { TaskPriorityDot } from "./TaskPriorityDot";
import { useToggleTaskDone } from "@/hooks/crm/useTaskMutations";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { formatDateUK } from "@/lib/crm/labels";
import { cn } from "@/lib/utils";

interface Props {
  rows: TaskRow[];
  isLoading?: boolean;
  showClient?: boolean;
  onSelect: (id: string) => void;
}

const isOverdue = (row: TaskRow): boolean => {
  if (!row.due_date) return false;
  if (row.status === "done" || row.status === "cancelled") return false;
  return new Date(row.due_date) < new Date(new Date().toDateString());
};

export const TaskList = ({ rows, isLoading, showClient, onSelect }: Props) => {
  const toggleDone = useToggleTaskDone();
  const { canWrite } = useCrmAccess();

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }
  if (!rows.length) {
    return (
      <div className="p-10 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-lg">
        No tasks match these filters.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left font-medium px-3 py-2 w-10"></th>
            <th className="text-left font-medium px-3 py-2 w-10"></th>
            <th className="text-left font-medium px-3 py-2">Title</th>
            {showClient && (
              <th className="text-left font-medium px-3 py-2">Client</th>
            )}
            <th className="text-left font-medium px-3 py-2">Status</th>
            <th className="text-left font-medium px-3 py-2">Due</th>
            <th className="text-left font-medium px-3 py-2">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => {
            const overdue = isOverdue(r);
            const isDone = r.status === "done";
            return (
              <tr
                key={r.id}
                onClick={() => onSelect(r.id)}
                className="hover:bg-slate-50 cursor-pointer"
              >
                <td className="px-3 py-2 align-top">
                  {canWrite ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void toggleDone(r.id, r.status);
                      }}
                      aria-label={isDone ? "Mark as not done" : "Mark as done"}
                      className={cn(
                        "size-4 rounded border flex items-center justify-center transition-colors",
                        isDone
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 hover:border-slate-500",
                      )}
                    >
                      {isDone && <Check className="size-3" strokeWidth={3} />}
                    </button>
                  ) : (
                    <span
                      aria-hidden
                      className={cn(
                        "size-4 rounded border inline-flex items-center justify-center",
                        isDone
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300",
                      )}
                    >
                      {isDone && <Check className="size-3" strokeWidth={3} />}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 align-top">
                  <TaskPriorityDot priority={r.priority} />
                </td>
                <td className="px-3 py-2">
                  <div
                    className={cn(
                      "font-medium line-clamp-1",
                      isDone ? "text-slate-500 line-through" : "text-slate-900",
                    )}
                  >
                    {r.title}
                  </div>
                  {r.notes && (
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {r.notes}
                    </div>
                  )}
                </td>
                {showClient && (
                  <td className="px-3 py-2 text-slate-700">
                    {r.client_id && r.client_name ? (
                      <Link
                        to={`/crm/clients/${r.client_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-slate-900 hover:underline"
                      >
                        {r.client_name}
                      </Link>
                    ) : (
                      <span className="text-slate-400 italic">Standalone</span>
                    )}
                  </td>
                )}
                <td className="px-3 py-2">
                  <TaskStatusPill status={r.status} />
                </td>
                <td className="px-3 py-2">
                  {r.due_date ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs",
                        overdue
                          ? "text-rose-600 font-medium"
                          : "text-slate-600",
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
