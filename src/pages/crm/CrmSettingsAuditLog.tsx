import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Search as SearchIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import NotFound from "@/pages/NotFound";
import {
  useAuditLog,
  useAuditLogActions,
  type AuditLogRow,
} from "@/hooks/crm/useAuditLog";

const PAGE_SIZE = 50;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
}

function shortId(id: string | null): string {
  if (!id) return "—";
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <button
      type="button"
      onClick={handle}
      className="text-slate-400 hover:text-slate-700"
      aria-label="Copy"
      title="Copy"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function AuditRow({ row }: { row: AuditLogRow }) {
  const [expanded, setExpanded] = useState(false);

  const oldJson = useMemo(() => {
    if (row.old_values == null) return null;
    try {
      return JSON.stringify(row.old_values, null, 2);
    } catch {
      return String(row.old_values);
    }
  }, [row.old_values]);
  const newJson = useMemo(() => {
    if (row.new_values == null) return null;
    try {
      return JSON.stringify(row.new_values, null, 2);
    } catch {
      return String(row.new_values);
    }
  }, [row.new_values]);

  return (
    <>
      <tr className="border-t border-slate-200 hover:bg-slate-50/60">
        <td className="py-2 pl-3 pr-2 align-top w-8">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-slate-500 hover:text-slate-800"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        </td>
        <td className="py-2 px-2 align-top text-xs text-slate-600 whitespace-nowrap">
          {formatDate(row.created_at)}
        </td>
        <td className="py-2 px-2 align-top text-sm">
          {row.user_id ? (
            <>
              <div className="font-medium text-slate-800 truncate max-w-[200px]">
                {row.actor_display_name ?? row.actor_email ?? shortId(row.user_id)}
              </div>
              {row.actor_email && row.actor_display_name && row.actor_display_name !== row.actor_email && (
                <div className="text-xs text-slate-500 truncate max-w-[200px]">
                  {row.actor_email}
                </div>
              )}
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">system</span>
          )}
        </td>
        <td className="py-2 px-2 align-top text-xs font-mono text-slate-700">
          {row.action}
        </td>
        <td className="py-2 px-2 align-top text-xs font-mono text-slate-600">
          {row.table_name}
        </td>
        <td className="py-2 pl-2 pr-3 align-top text-xs font-mono text-slate-600 whitespace-nowrap">
          {row.record_id ? (
            <span className="inline-flex items-center gap-1.5">
              {shortId(row.record_id)}
              <CopyButton value={row.record_id} />
            </span>
          ) : (
            "—"
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50/60">
          <td colSpan={6} className="px-3 py-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">
                  Old values
                </div>
                {oldJson ? (
                  <pre className="text-xs bg-white border border-slate-200 rounded-md p-3 overflow-x-auto max-h-72 whitespace-pre-wrap break-all">
                    {oldJson}
                  </pre>
                ) : (
                  <div className="text-xs text-slate-400 italic">—</div>
                )}
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">
                  New values
                </div>
                {newJson ? (
                  <pre className="text-xs bg-white border border-slate-200 rounded-md p-3 overflow-x-auto max-h-72 whitespace-pre-wrap break-all">
                    {newJson}
                  </pre>
                ) : (
                  <div className="text-xs text-slate-400 italic">—</div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CrmSettingsAuditLog() {
  const { isAdmin, isLoading } = useCrmAccess();
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string>(""); // yyyy-mm-dd
  const [toDate, setToDate] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState<string | null>(null);

  // Convert date inputs to ISO. `to` is exclusive: end-of-selected-day means start of next day.
  const fromIso = fromDate ? new Date(`${fromDate}T00:00:00`).toISOString() : null;
  const toIso = toDate
    ? new Date(new Date(`${toDate}T00:00:00`).getTime() + 24 * 60 * 60 * 1000).toISOString()
    : null;

  const filters = {
    action: actionFilter,
    from: fromIso,
    to: toIso,
    search,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, isLoading: rowsLoading, isFetching } = useAuditLog(filters);
  const { data: actions = [] } = useAuditLogActions();

  const total = data?.total ?? 0;
  const rows = data?.rows ?? [];
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const resetPage = () => setPage(1);

  const clearFilters = () => {
    setActionFilter(null);
    setFromDate("");
    setToDate("");
    setSearchInput("");
    setSearch(null);
    setPage(1);
  };

  const submitSearch = () => {
    setSearch(searchInput.trim() || null);
    resetPage();
  };

  const hasFilters = Boolean(actionFilter || fromDate || toDate || search);

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }
  if (!isAdmin) return <NotFound />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Helmet>
        <title>Audit Log | CRM Settings | Hobson</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <Link
        to="/crm/settings"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="size-4" /> Back to settings
      </Link>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Audit log</h1>
      <p className="text-sm text-slate-500 mt-1 max-w-2xl">
        Security-relevant actions across the workspace. Read-only.
      </p>

      {/* Filters */}
      <div className="mt-5 bg-white border border-slate-200 rounded-lg p-4 grid gap-3 md:grid-cols-[200px_160px_160px_1fr_auto] items-end">
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">
            Action
          </label>
          <Select
            value={actionFilter ?? "__all__"}
            onValueChange={(v) => {
              setActionFilter(v === "__all__" ? null : v);
              resetPage();
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All actions</SelectItem>
              {actions.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">
            From
          </label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              resetPage();
            }}
            className="h-9"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">
            To
          </label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              resetPage();
            }}
            className="h-9"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">
            Search action
          </label>
          <div className="relative">
            <SearchIcon className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitSearch();
                }
              }}
              placeholder="e.g. ROLE_GRANTED"
              className="h-9 pl-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={submitSearch} disabled={isFetching}>
            Apply
          </Button>
          {hasFilters && (
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              <X className="size-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pl-3 pr-2 w-8" />
                <th className="py-2 px-2 text-left">Timestamp</th>
                <th className="py-2 px-2 text-left">Actor</th>
                <th className="py-2 px-2 text-left">Action</th>
                <th className="py-2 px-2 text-left">Table</th>
                <th className="py-2 pl-2 pr-3 text-left">Record</th>
              </tr>
            </thead>
            <tbody>
              {rowsLoading && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-sm text-slate-500">
                    Loading…
                  </td>
                </tr>
              )}
              {!rowsLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-500">
                    {hasFilters
                      ? "No audit entries match the current filters."
                      : "No audit entries yet."}
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <AuditRow key={r.id} row={r} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString("en-GB")}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
            >
              Previous
            </Button>
            <span className="text-slate-600">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
