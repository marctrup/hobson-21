// CRM Pipeline kanban.
// Columns are loaded from crm_pipeline_stages. Clients with a pipeline_stage
// value not in the active stage list fall into a virtual "Uncategorised"
// column so legacy data stays visible for cleanup.

import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import {
  usePipelineStages,
  stageColourClasses,
  type PipelineStage,
} from "@/hooks/crm/usePipelineStages";
import { formatGBP } from "@/lib/crm/labels";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PipelineClient {
  id: string;
  name: string;
  pipeline_stage: string;
  estimated_deal_value_gbp: number | null;
  primary_contact_name: string | null;
  segment: string;
}

const UNCATEGORISED_KEY = "__uncategorised__";

export default function CrmPipeline() {
  const queryClient = useQueryClient();
  const { canWrite } = useCrmAccess();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: stages, isLoading: stagesLoading } = usePipelineStages();
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["crm-pipeline-clients"],
    queryFn: async (): Promise<PipelineClient[]> => {
      const { data, error } = await supabase
        .from("crm_clients")
        .select(
          "id,name,pipeline_stage,estimated_deal_value_gbp,primary_contact_name,segment",
        )
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as PipelineClient[];
    },
  });

  const grouped = useMemo(() => {
    const map = new Map<string, PipelineClient[]>();
    if (stages) for (const s of stages) map.set(s.key, []);
    map.set(UNCATEGORISED_KEY, []);
    if (clients && stages) {
      const known = new Set(stages.map((s) => s.key));
      for (const c of clients) {
        const bucket = known.has(c.pipeline_stage) ? c.pipeline_stage : UNCATEGORISED_KEY;
        map.get(bucket)!.push(c);
      }
    }
    return map;
  }, [clients, stages]);

  const moveStage = useMutation({
    mutationFn: async ({ clientId, toStage }: { clientId: string; toStage: string }) => {
      const { error } = await supabase
        .from("crm_clients")
        .update({ pipeline_stage: toStage })
        .eq("id", clientId);
      if (error) throw error;
    },
    onMutate: async ({ clientId, toStage }) => {
      await queryClient.cancelQueries({ queryKey: ["crm-pipeline-clients"] });
      const previous = queryClient.getQueryData<PipelineClient[]>([
        "crm-pipeline-clients",
      ]);
      queryClient.setQueryData<PipelineClient[]>(
        ["crm-pipeline-clients"],
        (old) =>
          old?.map((c) =>
            c.id === clientId ? { ...c, pipeline_stage: toStage } : c,
          ) ?? [],
      );
      return { previous };
    },
    onError: (err, vars, ctx) => {
      // Rollback optimistic update
      if (ctx?.previous) {
        queryClient.setQueryData(["crm-pipeline-clients"], ctx.previous);
      }
      const client = ctx?.previous?.find((c) => c.id === vars.clientId);
      const stageLabel =
        stages?.find((s) => s.key === vars.toStage)?.label ?? vars.toStage;
      const reason =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(
        `Couldn't move ${client?.name ?? "client"} to ${stageLabel}: ${reason}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-pipeline-clients"] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over || !canWrite) return;
    const clientId = String(active.id);
    const toStage = String(over.id);
    if (toStage === UNCATEGORISED_KEY) return; // can't drop into virtual column
    const current = clients?.find((c) => c.id === clientId);
    if (!current || current.pipeline_stage === toStage) return;
    moveStage.mutate({ clientId, toStage });
  };

  const isLoading = stagesLoading || clientsLoading;
  const activeClient = activeId
    ? clients?.find((c) => c.id === activeId) ?? null
    : null;

  const uncategorisedCount = grouped.get(UNCATEGORISED_KEY)?.length ?? 0;

  return (
    <>
      <Helmet>
        <title>Pipeline | CRM</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
            <p className="text-sm text-slate-500 mt-1">
              {canWrite
                ? "Drag clients between stages to update their pipeline position."
                : "Read-only view of the current pipeline."}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" /> Loading pipeline…
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-3 overflow-x-auto pb-3">
              {stages?.map((stage) => (
                <KanbanColumn
                  key={stage.key}
                  stage={stage}
                  clients={grouped.get(stage.key) ?? []}
                  draggable={canWrite}
                />
              ))}
              {uncategorisedCount > 0 && (
                <UncategorisedColumn
                  clients={grouped.get(UNCATEGORISED_KEY) ?? []}
                />
              )}
            </div>

            <DragOverlay>
              {activeClient ? <ClientCard client={activeClient} dragging /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </>
  );
}

// ---------- Column ----------
function KanbanColumn({
  stage,
  clients,
  draggable,
}: {
  stage: PipelineStage;
  clients: PipelineClient[];
  draggable: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  const colours = stageColourClasses(stage.color);
  const total = clients.reduce(
    (sum, c) => sum + (c.estimated_deal_value_gbp ?? 0),
    0,
  );

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "shrink-0 w-72 bg-white border rounded-lg flex flex-col transition-colors",
        isOver ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200",
      )}
    >
      <div
        className={cn(
          "px-3 py-2 border-b rounded-t-lg flex items-center justify-between",
          colours.header,
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {stage.label}
          </span>
          <span
            className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded",
              colours.badge,
            )}
          >
            {clients.length}
          </span>
        </div>
        {total > 0 && (
          <span className="text-[11px] text-slate-600 font-medium">
            {formatGBP(total)}
          </span>
        )}
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-[120px]">
        {clients.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            {draggable ? "Drop a client here" : "No clients"}
          </p>
        ) : (
          clients.map((c) =>
            draggable ? (
              <DraggableClientCard key={c.id} client={c} />
            ) : (
              <Link key={c.id} to={`/crm/clients/${c.id}`} className="block">
                <ClientCard client={c} />
              </Link>
            ),
          )
        )}
      </div>
    </div>
  );
}

function UncategorisedColumn({ clients }: { clients: PipelineClient[] }) {
  return (
    <div className="shrink-0 w-72 bg-amber-50/50 border border-dashed border-amber-300 rounded-lg flex flex-col">
      <div className="px-3 py-2 border-b border-amber-200 rounded-t-lg flex items-center justify-between bg-amber-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-amber-900">
            Uncategorised
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
            {clients.length}
          </span>
        </div>
        <span className="text-[10px] text-amber-700 uppercase tracking-wide">
          Legacy
        </span>
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-[120px]">
        {clients.map((c) => (
          <Link
            key={c.id}
            to={`/crm/clients/${c.id}`}
            className="block"
          >
            <div className="bg-white border border-amber-200 rounded-md p-2.5 text-xs hover:shadow-sm transition-shadow">
              <div className="font-medium text-slate-900 truncate">{c.name}</div>
              <div className="text-amber-700 mt-1 font-mono text-[10px]">
                stage: {c.pipeline_stage}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---------- Card ----------
function DraggableClientCard({ client }: { client: PipelineClient }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: client.id,
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
    >
      <ClientCard client={client} />
    </div>
  );
}

function ClientCard({
  client,
  dragging,
}: {
  client: PipelineClient;
  dragging?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-md p-2.5 text-xs transition-shadow",
        dragging
          ? "shadow-lg ring-2 ring-slate-900/10"
          : "hover:shadow-sm",
      )}
    >
      <div className="font-medium text-slate-900 truncate">{client.name}</div>
      {client.primary_contact_name && (
        <div className="text-slate-500 mt-0.5 truncate">
          {client.primary_contact_name}
        </div>
      )}
      {client.estimated_deal_value_gbp != null && (
        <div className="text-slate-700 mt-1 font-medium">
          {formatGBP(client.estimated_deal_value_gbp)}
        </div>
      )}
    </div>
  );
}
