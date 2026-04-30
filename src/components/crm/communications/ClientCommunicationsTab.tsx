import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
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

interface Props {
  clientId: string;
  canWrite: boolean;
  /** When provided, the side panel auto-opens on this communication. */
  focusCommId?: string | null;
}

export const ClientCommunicationsTab = ({ clientId, canWrite, focusCommId }: Props) => {
  const [filters, setFilters] = useState<CommunicationListFilters>({
    clientId,
    direction: "all",
    channels: [],
  });
  const [logOpen, setLogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(focusCommId ?? null);

  // Re-open if the focus prop changes (e.g. user clicks another deep link).
  useEffect(() => {
    if (focusCommId) setSelectedId(focusCommId);
  }, [focusCommId]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommunications({
    ...filters,
    clientId,
  });
  const rows = useMemo(
    () => (data?.pages ?? []).flat(),
    [data],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <CommunicationFilters value={filters} onChange={setFilters} />
        {canWrite && (
          <Button size="sm" onClick={() => setLogOpen(true)}>
            <Plus className="size-4 mr-1" /> Log communication
          </Button>
        )}
      </div>

      <CommunicationTimeline
        rows={rows}
        isLoading={isLoading}
        onSelect={setSelectedId}
      />

      {hasNextPage && (
        <div className="flex justify-center">
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
      <CommunicationSidePanel
        open={!!selectedId}
        onOpenChange={(o) => !o && setSelectedId(null)}
        communicationId={selectedId}
      />
      <LogCommunicationDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        defaultClientId={clientId}
        onLogged={(id) => setSelectedId(id)}
      />
    </div>
  );
};
