import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IssueFilters } from "@/components/crm/issues/IssueFilters";
import { IssueList } from "@/components/crm/issues/IssueList";
import { IssueSidePanel } from "@/components/crm/issues/IssueSidePanel";
import { LogIssueDialog } from "@/components/crm/issues/LogIssueDialog";
import {
  useIssues,
  ISSUE_PAGE_SIZE,
  type IssueListFilters,
} from "@/hooks/crm/useIssues";

interface Props {
  clientId: string;
  canWrite: boolean;
}

export const ClientIssuesTab = ({ clientId, canWrite }: Props) => {
  const [filters, setFilters] = useState<IssueListFilters>({
    clientId,
    hideResolved: true,
  });
  const [logOpen, setLogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useIssues({ ...filters, clientId });
  const rows = useMemo(() => (data?.pages ?? []).flat(), [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <IssueFilters
          value={filters}
          onChange={setFilters}
          showHideResolved
        />
        {canWrite && (
          <Button size="sm" onClick={() => setLogOpen(true)}>
            <Plus className="size-4 mr-1" /> New issue
          </Button>
        )}
      </div>

      <IssueList rows={rows} isLoading={isLoading} onSelect={setSelectedId} />

      {hasNextPage && (
        <div className="flex justify-center">
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

      <IssueSidePanel
        open={!!selectedId}
        onOpenChange={(o) => !o && setSelectedId(null)}
        issueId={selectedId}
      />
      <LogIssueDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        defaultClientId={clientId}
        onCreated={(id) => setSelectedId(id)}
      />
    </div>
  );
};
