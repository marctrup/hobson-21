import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunicationFilters } from "@/components/crm/communications/CommunicationFilters";
import { CommunicationTimeline } from "@/components/crm/communications/CommunicationTimeline";
import { CommunicationSidePanel } from "@/components/crm/communications/CommunicationSidePanel";
import { LogCommunicationDialog } from "@/components/crm/communications/LogCommunicationDialog";
import {
  useCommunications,
  type CommunicationListFilters,
} from "@/hooks/crm/useCommunications";

interface Props {
  clientId: string;
  canWrite: boolean;
}

export const ClientCommunicationsTab = ({ clientId, canWrite }: Props) => {
  const [filters, setFilters] = useState<CommunicationListFilters>({
    clientId,
    direction: "all",
    channels: [],
  });
  const [logOpen, setLogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useCommunications({
    ...filters,
    clientId,
  });

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
