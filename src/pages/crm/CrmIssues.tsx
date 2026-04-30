import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Download, LayoutList, Columns3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IssueFilters } from "@/components/crm/issues/IssueFilters";
import { IssueList } from "@/components/crm/issues/IssueList";
import { IssueBoard } from "@/components/crm/issues/IssueBoard";
import { IssueSidePanel } from "@/components/crm/issues/IssueSidePanel";
import { LogIssueDialog } from "@/components/crm/issues/LogIssueDialog";
import {
  useIssues,
  ISSUE_PAGE_SIZE,
  type IssueListFilters,
} from "@/hooks/crm/useIssues";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { useAuth } from "@/hooks/useAuth";
import {
  ISSUE_CATEGORY_LABELS,
  ISSUE_PRIORITY_LABELS,
  ISSUE_QUICK_VIEW_LABELS,
  ISSUE_QUICK_VIEWS,
  ISSUE_STATUS_LABELS,
  type IssueQuickView,
} from "@/lib/crm/issuesLabels";
import { formatDateUK } from "@/lib/crm/labels";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "board";

export default function CrmIssues() {
  const { canWrite } = useCrmAccess();
  const { user } = useAuth();
  const [view, setView] = useState<ViewMode>("list");
  const [filters, setFilters] = useState<IssueListFilters>({
    hideResolved: true,
  });
  const [activeQuickView, setActiveQuickView] = useState<IssueQuickView | null>(
    "open_all",
  );
  const [logOpen, setLogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const applyQuickView = (qv: IssueQuickView) => {
    setActiveQuickView(qv);
    if (qv === "open_all") {
      setFilters({
        hideResolved: true,
        statuses: [],
        priorities: [],
        categories: [],
        assigneeId: null,
        overdueOnly: false,
        search: "",
        tag: "",
      });
    } else if (qv === "my_open") {
      setFilters({
        hideResolved: true,
        statuses: [],
        priorities: [],
        categories: [],
        assigneeId: user?.id ?? null,
        overdueOnly: false,
        search: "",
        tag: "",
      });
    } else if (qv === "urgent") {
      setFilters({
        hideResolved: true,
        statuses: [],
        priorities: ["urgent"],
        categories: [],
        assigneeId: null,
        overdueOnly: false,
        search: "",
        tag: "",
      });
    } else if (qv === "overdue") {
      setFilters({
        hideResolved: true,
        statuses: [],
        priorities: [],
        categories: [],
        assigneeId: null,
        overdueOnly: true,
        search: "",
        tag: "",
      });
    }
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useIssues(filters);
  const rows = useMemo(() => (data?.pages ?? []).flat(), [data]);
  const total = rows.length;

  const exportCsv = () => {
    const headers = [
      "updated_at",
      "title",
      "client",
      "status",
      "priority",
      "category",
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
          ISSUE_STATUS_LABELS[r.status],
          ISSUE_PRIORITY_LABELS[r.priority],
          ISSUE_CATEGORY_LABELS[r.category],
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
    a.download = `issues-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Issues | CRM</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>
            <p className="text-sm text-slate-500 mt-1">
              Track problems and requests across every client. {total} loaded
              {hasNextPage ? " (more available)" : ""}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setView("list")}
                className={cn(
                  "px-2.5 py-1.5 text-sm flex items-center gap-1",
                  view === "list"
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-50",
                )}
                aria-pressed={view === "list"}
              >
                <LayoutList className="size-4" /> List
              </button>
              <button
                onClick={() => setView("board")}
                className={cn(
                  "px-2.5 py-1.5 text-sm flex items-center gap-1 border-l border-slate-200",
                  view === "board"
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-50",
                )}
                aria-pressed={view === "board"}
              >
                <Columns3 className="size-4" /> Board
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="size-4 mr-1" /> Export CSV
            </Button>
            {canWrite && (
              <Button size="sm" onClick={() => setLogOpen(true)}>
                <Plus className="size-4 mr-1" /> New issue
              </Button>
            )}
          </div>
        </div>

        {/* Quick-view chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {ISSUE_QUICK_VIEWS.map((qv) => (
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
              {ISSUE_QUICK_VIEW_LABELS[qv]}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <IssueFilters
            value={filters}
            onChange={(next) => {
              setFilters(next);
              setActiveQuickView(null);
            }}
            showSearch
            showHideResolved
          />
        </div>

        <div className="mt-4">
          {view === "list" ? (
            <IssueList
              rows={rows}
              isLoading={isLoading}
              showClient
              onSelect={setSelectedId}
            />
          ) : (
            <IssueBoard
              rows={rows}
              isLoading={isLoading}
              showClient
              onSelect={setSelectedId}
            />
          )}
        </div>

        {hasNextPage && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading…" : `Load ${ISSUE_PAGE_SIZE} more`}
            </Button>
          </div>
        )}
      </div>

      <IssueSidePanel
        open={!!selectedId}
        onOpenChange={(o) => !o && setSelectedId(null)}
        issueId={selectedId}
      />
      <LogIssueDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        onCreated={(id) => setSelectedId(id)}
      />
    </>
  );
}
