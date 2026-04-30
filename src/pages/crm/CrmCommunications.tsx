import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CommunicationFilters } from "@/components/crm/communications/CommunicationFilters";
import { CommunicationTimeline } from "@/components/crm/communications/CommunicationTimeline";
import { CommunicationSidePanel } from "@/components/crm/communications/CommunicationSidePanel";
import { LogCommunicationDialog } from "@/components/crm/communications/LogCommunicationDialog";
import {
  useCommunications,
  COMM_PAGE_SIZE,
  type CommunicationListFilters,
} from "@/hooks/crm/useCommunications";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import {
  COMM_CHANNEL_LABELS,
  COMM_DIRECTION_LABELS,
} from "@/lib/crm/communicationsLabels";
import { formatDateTimeUK } from "@/lib/crm/labels";

export default function CrmCommunications() {
  const { canWrite } = useCrmAccess();
  const [filters, setFilters] = useState<CommunicationListFilters>({
    direction: "all",
    channels: [],
  });
  const [logOpen, setLogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunications(filters);
  const rows = useMemo(() => (data?.pages ?? []).flat(), [data]);

  const exportCsv = () => {
    const headers = [
      "occurred_at",
      "channel",
      "direction",
      "client",
      "subject",
      "summary",
      "important",
      "sentiment",
    ];
    const escape = (v: unknown): string => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push(
        [
          formatDateTimeUK(r.occurred_at),
          COMM_CHANNEL_LABELS[r.channel],
          COMM_DIRECTION_LABELS[r.direction],
          r.client_name ?? "",
          r.subject ?? "",
          r.summary ?? "",
          r.is_important ? "yes" : "",
          r.sentiment ?? "",
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
    a.download = `communications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const total = useMemo(() => rows.length, [rows]);

  return (
    <>
      <Helmet>
        <title>Communications | CRM</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Communications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Master timeline across every client. {total} record
              {total === 1 ? "" : "s"} loaded
              {hasNextPage ? " (more available)" : ""}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="size-4 mr-1" /> Export CSV
            </Button>
            {canWrite && (
              <Button size="sm" onClick={() => setLogOpen(true)}>
                <Plus className="size-4 mr-1" /> Log communication
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <CommunicationFilters
            value={filters}
            onChange={setFilters}
            showSearch
            showNeedsReview
          />
        </div>

        <div className="mt-4">
          <CommunicationTimeline
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
              {isFetchingNextPage ? "Loading…" : `Load ${COMM_PAGE_SIZE} more`}
            </Button>
          </div>
        )}
      </div>

      <CommunicationSidePanel
        open={!!selectedId}
        onOpenChange={(o) => !o && setSelectedId(null)}
        communicationId={selectedId}
      />
      <LogCommunicationDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        onLogged={(id) => setSelectedId(id)}
      />
    </>
  );
}
