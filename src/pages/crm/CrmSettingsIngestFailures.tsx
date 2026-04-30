import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import NotFound from "@/pages/NotFound";
import {
  useIngestFailures,
  useResolveIngestFailure,
  type IngestFailureFilter,
  type CrmIngestFailure,
} from "@/hooks/crm/useIngestFailures";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

const FILTERS: { key: IngestFailureFilter; label: string }[] = [
  { key: "open", label: "Open" },
  { key: "resolved", label: "Resolved" },
  { key: "all", label: "All" },
];

function FailureRow({ row }: { row: CrmIngestFailure }) {
  const [expanded, setExpanded] = useState(false);
  const resolve = useResolveIngestFailure();

  const handleResolve = async () => {
    try {
      await resolve.mutateAsync(row.id);
      toast.success("Marked as resolved");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to resolve";
      toast.error(message);
    }
  };

  const payloadJson = useMemo(() => {
    try {
      return JSON.stringify(row.payload, null, 2);
    } catch {
      return String(row.payload);
    }
  }, [row.payload]);

  const isResolved = Boolean(row.resolved_at);

  return (
    <>
      <tr className="border-t border-slate-200 hover:bg-slate-50/60">
        <td className="py-2 pl-3 pr-2 align-top">
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
        <td className="py-2 px-2 align-top text-xs font-mono text-slate-700">
          {row.source}
        </td>
        <td className="py-2 px-2 align-top text-sm text-slate-800 max-w-md">
          <div className="line-clamp-2">{row.error_message ?? "—"}</div>
        </td>
        <td className="py-2 px-2 align-top text-sm text-slate-600 text-center">
          {row.retry_count}
        </td>
        <td className="py-2 px-2 align-top text-xs text-slate-500 whitespace-nowrap">
          {formatDate(row.created_at)}
        </td>
        <td className="py-2 px-2 align-top text-xs whitespace-nowrap">
          {isResolved ? (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="size-3.5" />
              {formatDate(row.resolved_at)}
            </span>
          ) : (
            <span className="text-amber-700">Open</span>
          )}
        </td>
        <td className="py-2 pl-2 pr-3 align-top text-right">
          {!isResolved && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => void handleResolve()}
              disabled={resolve.isPending}
            >
              {resolve.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                "Mark resolved"
              )}
            </Button>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50/60">
          <td colSpan={7} className="px-3 py-3">
            <div className="text-xs font-medium text-slate-500 mb-1">
              Payload
            </div>
            <pre className="text-xs bg-white border border-slate-200 rounded-md p-3 overflow-x-auto max-h-72 whitespace-pre-wrap break-all">
              {payloadJson}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CrmSettingsIngestFailures() {
  const { isAdmin, isLoading } = useCrmAccess();
  const [filter, setFilter] = useState<IngestFailureFilter>("open");
  const { data: rows = [], isLoading: rowsLoading, refetch, isFetching } =
    useIngestFailures(filter);

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }
  if (!isAdmin) return <NotFound />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Helmet>
        <title>Failed Ingests | CRM Settings | Hobson</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <Link
        to="/crm/settings"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="size-4" /> Back to settings
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Failed ingests
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Submissions from the public website that could not be saved. Review
            the payload, fix the underlying issue, then mark as resolved.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`size-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="mt-5 inline-flex rounded-md border border-slate-200 bg-white p-0.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-sm rounded-[5px] transition ${
              filter === f.key
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pl-3 pr-2 w-8" />
                <th className="py-2 px-2 text-left">Source</th>
                <th className="py-2 px-2 text-left">Error</th>
                <th className="py-2 px-2 text-center">Retries</th>
                <th className="py-2 px-2 text-left">Received</th>
                <th className="py-2 px-2 text-left">Status</th>
                <th className="py-2 pl-2 pr-3" />
              </tr>
            </thead>
            <tbody>
              {rowsLoading && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-sm text-slate-500">
                    Loading…
                  </td>
                </tr>
              )}
              {!rowsLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
                    No {filter === "all" ? "" : filter} ingest failures.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <FailureRow key={r.id} row={r} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
