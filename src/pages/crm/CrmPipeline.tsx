// CRM Pipeline kanban.
// Columns are loaded from crm_pipeline_stages, but `on_hold` is excluded
// from the kanban — it's a status (crm_clients.status), not a draggable
// column. Use the "Show on-hold clients" toggle to surface them in their
// current pipeline_stage column with an "ON HOLD" badge.
//
// Clients with a pipeline_stage value not in the active stage list fall
// into a virtual "Uncategorised" column so legacy data stays visible.

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

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, PauseCircle } from "lucide-react";

interface PipelineClient {
  id: string;
  name: string;
  pipeline_stage: string;
  status: string;
  primary_contact_name: string | null;
  segment: string;
}

const UNCATEGORISED_KEY = "__uncategorised__";
// Pipeline stages that should NEVER appear as kanban columns even if active
// in crm_pipeline_stages. on_hold is modelled as a *status*, not a column.
const NON_KANBAN_STAGE_KEYS = new Set(["on_hold"]);

export default function CrmPipeline() {
  const queryClient = useQueryClient();
  const { canWrite } = useCrmAccess();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showOnHold, setShowOnHold] = useState(false);

  const { data: stages, isLoading: stagesLoading } = usePipelineStages();
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["crm-pipeline-clients"],
    queryFn: async (): Promise<PipelineClient[]> => {
      const { data, error } = await supabase
        .from("crm_clients")
        .select(
          "id,name,pipeline_stage,status,primary_contact_name,segment",
        )
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as PipelineClient[];
    },
  });

  // Columns visible on the kanban (on_hold excluded).
  const kanbanStages = useMemo(
    () => stages?.filter((s) => !NON_KANBAN_STAGE_KEYS.has(s.key)) ?? [],
    [stages],
  );

  const onHoldCount = useMemo(
    () => clients?.filter((c) => c.status === "on_hold").length ?? 0,
    [clients],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, PipelineClient[]>();
    for (const s of kanbanStages) map.set(s.key, []);
    map.set(UNCATEGORISED_KEY, []);
    if (clients) {
      const knownKanbanKeys = new Set(kanbanStages.map((s) => s.key));
      for (const c of clients) {
        // Hide on-hold clients unless toggle is on
        if (c.status === "on_hold" && !showOnHold) continue;
        const bucket = knownKanbanKeys.has(c.pipeline_stage)
          ? c.pipeline_stage
          : UNCATEGORISED_KEY;
        map.get(bucket)!.push(c);
      }
    }
    return map;
  }, [clients, kanbanStages, showOnHold]);

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
    // Belt-and-braces: virtual / non-kanban targets are not droppable, but
    // double-check here in case a future change adds them as droppables.
    if (toStage === UNCATEGORISED_KEY || NON_KANBAN_STAGE_KEYS.has(toStage)) {
      return;
    }
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
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
            <p className="text-sm text-slate-500 mt-1">
              {canWrite
                ? "Drag clients between stages to update their pipeline position. Set status to On hold from a client's detail page to remove them from the pipeline."
                : "Read-only view of the current pipeline."}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2 shrink-0">
            <Switch
              id="show-on-hold"
              checked={showOnHold}
              onCheckedChange={setShowOnHold}
            />
            <Label
              htmlFor="show-on-hold"
              className="text-sm text-slate-700 cursor-pointer flex items-center gap-1.5"
            >
              <PauseCircle className="size-3.5 text-slate-500" />
              Show on-hold clients
              {onHoldCount > 0 && (
                <span className="text-xs text-slate-500">({onHoldCount})</span>
              )}
            </Label>
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
              {kanbanStages.map((stage) => (
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
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-[120px]">
        {clients.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            {draggable ? "Drop a client here" : "No clients"}
          </p>
        ) : (
          clients.map((c) =>
            draggable && c.status !== "on_hold" ? (
              <DraggableClientCard key={c.id} client={c} />
            ) : (
              // On-hold clients are visible-only on the kanban: not draggable.
              // Status changes happen on the client detail page.
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
  const onHold = client.status === "on_hold";
  return (
    <div
      className={cn(
        "bg-white border rounded-md p-2.5 text-xs transition-shadow",
        dragging
          ? "shadow-lg ring-2 ring-slate-900/10 border-slate-200"
          : "hover:shadow-sm",
        onHold ? "border-amber-300 bg-amber-50/40" : "border-slate-200",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium text-slate-900 truncate flex-1">
          {client.name}
        </div>
        {onHold && (
          <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
            <PauseCircle className="size-2.5" />
            On hold
          </span>
        )}
      </div>
      {client.primary_contact_name && (
        <div className="text-slate-500 mt-0.5 truncate">
          {client.primary_contact_name}
        </div>
      )}
    </div>
  );
}
