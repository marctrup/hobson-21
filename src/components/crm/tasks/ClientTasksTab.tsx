import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskFilters } from "./TaskFilters";
import { TaskList } from "./TaskList";
import { TaskSidePanel } from "./TaskSidePanel";
import { LogTaskDialog } from "./LogTaskDialog";
import {
  useTasks,
  TASK_PAGE_SIZE,
  type TaskListFilters,
} from "@/hooks/crm/useTasks";

interface Props {
  clientId: string;
  canWrite: boolean;
}

export const ClientTasksTab = ({ clientId, canWrite }: Props) => {
  const [filters, setFilters] = useState<TaskListFilters>({
    clientId,
  });
  const [logOpen, setLogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTasks({ ...filters, clientId });
  const rows = useMemo(() => (data?.pages ?? []).flat(), [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <TaskFilters value={filters} onChange={setFilters} showIncludeCancelled />
        {canWrite && (
          <Button size="sm" onClick={() => setLogOpen(true)}>
            <Plus className="size-4 mr-1" /> New task
          </Button>
        )}
      </div>

      <TaskList rows={rows} isLoading={isLoading} onSelect={setSelectedId} />

      {hasNextPage && (
        <div className="flex justify-center">
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

      <TaskSidePanel
        open={!!selectedId}
        onOpenChange={(o) => !o && setSelectedId(null)}
        taskId={selectedId}
      />
      <LogTaskDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        defaultClientId={clientId}
        onCreated={(id) => setSelectedId(id)}
      />
    </div>
  );
};
