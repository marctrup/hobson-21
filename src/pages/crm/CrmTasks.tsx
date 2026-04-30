import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TaskFilters } from "@/components/crm/tasks/TaskFilters";
import { TaskList } from "@/components/crm/tasks/TaskList";
import { TaskSidePanel } from "@/components/crm/tasks/TaskSidePanel";
import { LogTaskDialog } from "@/components/crm/tasks/LogTaskDialog";
import {
  useTasks,
  TASK_PAGE_SIZE,
  type TaskListFilters,
} from "@/hooks/crm/useTasks";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { useAuth } from "@/hooks/useAuth";
import {
  TASK_PRIORITY_LABELS,
  TASK_QUICK_VIEW_LABELS,
  TASK_QUICK_VIEWS,
  TASK_STATUS_LABELS,
  type TaskQuickView,
} from "@/lib/crm/tasksLabels";
import { formatDateUK } from "@/lib/crm/labels";
import { cn } from "@/lib/utils";

export default function CrmTasks() {
  const { canWrite } = useCrmAccess();
  const { user } = useAuth();
  const [filters, setFilters] = useState<TaskListFilters>({
    assigneeId: null,
    hideClosed: true,
  });
  const [activeQuickView, setActiveQuickView] = useState<TaskQuickView | null>(
    "my_open",
  );
  const [logOpen, setLogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Default the page to "my open" if signed in.
  const initialisedQuickView = useMemo(() => {
    if (activeQuickView !== "my_open" || !user?.id) return false;
    if (filters.assigneeId === user.id) return true;
    setFilters((prev) => ({
      ...prev,
      assigneeId: user.id,
      hideClosed: true,
    }));
    return true;
  }, [activeQuickView, filters.assigneeId, user?.id]);
  void initialisedQuickView;

  const applyQuickView = (qv: TaskQuickView) => {
    setActiveQuickView(qv);
    const base: TaskListFilters = {
      statuses: [],
      priorities: [],
      assigneeId: null,
      search: "",
      tag: "",
      overdueOnly: false,
      dueTodayOnly: false,
      standaloneOnly: false,
      hideClosed: true,
      includeCancelled: false,
    };
    if (qv === "my_open") {
      setFilters({ ...base, assigneeId: user?.id ?? null });
    } else if (qv === "all_open") {
      setFilters(base);
    } else if (qv === "due_today") {
      setFilters({ ...base, dueTodayOnly: true });
    } else if (qv === "overdue") {
      setFilters({ ...base, overdueOnly: true });
    } else if (qv === "unassigned") {
      setFilters({ ...base, assigneeId: "unassigned" });
    } else if (qv === "standalone") {
      setFilters({ ...base, standaloneOnly: true });
    } else if (qv === "done") {
      setFilters({ ...base, statuses: ["done"], hideClosed: false });
    }
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTasks(filters);
  const rows = useMemo(() => (data?.pages ?? []).flat(), [data]);
  const total = rows.length;

  const exportCsv = () => {
    const headers = [
      "updated_at",
      "title",
      "client",
      "status",
      "priority",
      "due_date",
      "assignee_id",
      "tags",
    ];
    const escape = (v: unknown): string => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push(
        [
          formatDateUK(r.updated_at),
          r.title,
          r.client_name ?? "",
          TASK_STATUS_LABELS[r.status],
          TASK_PRIORITY_LABELS[r.priority],
          r.due_date ? formatDateUK(r.due_date) : "",
          r.assignee_id ?? "",
          (r.tags ?? []).join(";"),
        ]
          .map(escape)
          .join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Tasks | CRM</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
            <p className="text-sm text-slate-500 mt-1">
              Personal and client-linked to-dos. {total} loaded
              {hasNextPage ? " (more available)" : ""}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="size-4 mr-1" /> Export CSV
            </Button>
            {canWrite && (
              <Button size="sm" onClick={() => setLogOpen(true)}>
                <Plus className="size-4 mr-1" /> New task
              </Button>
            )}
          </div>
        </div>

        {/* Quick-view chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {TASK_QUICK_VIEWS.map((qv) => (
            <button
              key={qv}
              onClick={() => applyQuickView(qv)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border transition-colors",
                activeQuickView === qv
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
              )}
            >
              {TASK_QUICK_VIEW_LABELS[qv]}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <TaskFilters
            value={filters}
            onChange={(next) => {
              setFilters(next);
              setActiveQuickView(null);
            }}
            showSearch
            showIncludeCancelled
          />
        </div>

        <div className="mt-4">
          <TaskList
            rows={rows}
            isLoading={isLoading}
            showClient
            onSelect={setSelectedId}
          />
        </div>

        {hasNextPage && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading…" : `Load ${TASK_PAGE_SIZE} more`}
            </Button>
          </div>
        )}
      </div>

      <TaskSidePanel
        open={!!selectedId}
        onOpenChange={(o) => !o && setSelectedId(null)}
        taskId={selectedId}
      />
      <LogTaskDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        onCreated={(id) => setSelectedId(id)}
      />
    </>
  );
}
