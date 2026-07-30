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
    return <div className="p-6 text-sm text-ink-muted">Loading…</div>;
  }
  if (!rows.length) {
    return (
      <div className="p-10 text-center text-sm text-ink-muted bg-white border border-bone rounded-lg">
        No tasks match these filters.
      </div>
    );
  }

  return (
    <div className="bg-white border border-bone rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-paper text-charcoal text-xs uppercase tracking-wide">
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
        <tbody className="divide-y divide-faint-rule">
          {rows.map((r) => {
            const overdue = isOverdue(r);
            const isDone = r.status === "done";
            return (
              <tr
                key={r.id}
                onClick={() => onSelect(r.id)}
                className="hover:bg-paper cursor-pointer"
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
                          ? "bg-success border-success text-white"
                          : "border-bone hover:border-bone-strong",
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
                          ? "bg-success border-success text-white"
                          : "border-bone",
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
                      isDone ? "text-ink-muted line-through" : "text-ink",
                    )}
                  >
                    {r.title}
                  </div>
                  {r.notes && (
                    <div className="text-xs text-ink-muted line-clamp-1 mt-0.5">
                      {r.notes}
                    </div>
                  )}
                </td>
                {showClient && (
                  <td className="px-3 py-2 text-charcoal">
                    {r.client_id && r.client_name ? (
                      <Link
                        to={`/crm/clients/${r.client_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-ink hover:underline"
                      >
                        {r.client_name}
                      </Link>
                    ) : (
                      <span className="text-ink-muted italic">Standalone</span>
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
                          ? "text-danger font-medium"
                          : "text-charcoal",
                      )}
                    >
                      {overdue && <CalendarClock className="size-3.5" />}
                      {formatDateUK(r.due_date)}
                    </span>
                  ) : (
                    <span className="text-ink-muted text-xs">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-ink-muted">
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
