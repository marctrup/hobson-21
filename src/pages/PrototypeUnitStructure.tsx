import { useState } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
import { Check, GripVertical, MoreHorizontal, Pencil, Plus, Undo2 } from "lucide-react";
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import { UnitKnowledgeRow } from "./PrototypeUnitKnowledge";
import { statusFor } from "./prototypeUnitTenancy";
import { summaryLine } from "./prototypeUnitDetails";
import { suggestUnit, summarise, typeFromName, type BuildingUnderstanding, type ProposedUnit } from "./prototypeUnitStructure";

type Props = {
  understanding: BuildingUnderstanding;
  reviewed?: boolean;
  editable?: boolean;
  lastRemoved?: string | null;
  onUndo?: () => void;
  onSave?: (units: ProposedUnit[], note: string) => void;
  onRemove?: (unit: ProposedUnit, index: number) => void;
  onAdd?: (units: ProposedUnit[]) => void;
  onOpenUnit?: (unit: ProposedUnit) => void;
  title?: string;
  recordId?: string;
};

// A sortable row: only the handle starts a drag, so name, pencil and menu stay clickable.
function SortableRow({ id, label, disabled, children }: { id: number; label: string; disabled: boolean; children: (handle: ReactNode) => ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition }} className={`relative flex min-h-11 items-center gap-2 bg-background px-2 py-1.5 ${isDragging ? "z-10 shadow-md ring-1 ring-border" : ""}`}>
      {children(disabled ? <span className="w-6 shrink-0" aria-hidden /> : (
        <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} aria-label={`Reorder ${label}`} className="grid h-8 w-6 shrink-0 cursor-grab touch-none place-items-center rounded text-muted-foreground/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"><GripVertical className="h-4 w-4" aria-hidden /></button>
      ))}
    </li>
  );
}

const reclassify = (u: ProposedUnit, c: ProposedUnit["classification"]): ProposedUnit =>
  u.classification === c ? u : { ...u, classification: c, type: c === "Residential" ? "Flat" : u.type === "Flat" ? "Unit" : u.type };

export function PrototypeUnitStructure({ understanding, reviewed = false, editable = false, lastRemoved = null, onUndo, onSave, onRemove, onAdd, onOpenUnit, title, recordId }: Props) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftUse, setDraftUse] = useState<ProposedUnit["classification"]>("Residential");
  const [adding, setAdding] = useState<ProposedUnit | null>(null);
  const base = understanding.kind === "proposal" ? understanding.units : [];
  const units = adding ? [...base, adding] : base;
  const summary = understanding.kind === "proposal" ? summarise(units) : null;
  const nameTaken = (id: number) => units.some(u => u.number !== id && u.name.toLowerCase() === draftName.trim().toLowerCase());

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  // Reordering changes position only — never names, uses, identity or count.
  const move = (from: number, to: number) => { if (to < 0 || to >= base.length || from === to) return; onSave?.(arrayMove(base, from, to), ""); };
  const onDragEnd = ({ active, over }: DragEndEvent) => { if (!over) return; move(base.findIndex(u => u.number === active.id), base.findIndex(u => u.number === over.id)); };
  const open = (unit: ProposedUnit) => { setAdding(null); setEditing(unit.number); setDraftName(unit.name); setDraftUse(unit.classification); };
  const startAdd = () => { const unit = suggestUnit(base); setAdding(unit); setEditing(unit.number); setDraftName(unit.name); setDraftUse(unit.classification); };
  const cancel = () => { setEditing(null); setAdding(null); };
  const save = (unit: ProposedUnit) => {
    const name = draftName.trim();
    if (!name || nameTaken(unit.number)) return;
    if (adding && unit.number === adding.number) {
      onAdd?.([...base, { ...unit, name, classification: draftUse, type: typeFromName(name, draftUse) }]);
    } else {
      onSave?.(base.map(u => u.number === unit.number ? reclassify({ ...unit, name }, draftUse) : u), `I've updated ${name}.`);
    }
    cancel();
  };

  return (
    <section aria-label="Proposed building structure" className="min-w-0 py-3 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{reviewed ? "Proposed structure · reviewed" : "Proposed structure"}</p>
          {title && <h3 className="mt-1 text-xl font-semibold text-foreground">{title}</h3>}
          {summary && <p className="mt-1 text-sm text-foreground">{summary.total} Units · {summary.residential} Residential · {summary.commercial} Commercial</p>}
        </div>
        <p className="text-xs text-muted-foreground">Nothing created yet</p>
      </div>
      {lastRemoved && (
        <div role="status" aria-label="Removed Unit" className="mb-2 flex items-center justify-between gap-3 rounded-md bg-secondary/50 px-3 py-2 text-sm text-foreground">
          <span>Removed {lastRemoved}</span>
          <button type="button" onClick={onUndo} className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Undo2 className="h-3.5 w-3.5" aria-hidden />Undo</button>
        </div>
      )}
      {understanding.kind === "proposal" ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[({ transform }) => ({ ...transform, x: 0 })]} onDragEnd={onDragEnd} accessibility={{ screenReaderInstructions: { draggable: "To reorder, press space, use the arrow keys, then press space again." } }}>
        <SortableContext items={base.map(u => u.number)} strategy={verticalListSortingStrategy}>
        <ul aria-label="Proposed Units" className="divide-y divide-border rounded-md border border-border bg-background">
          {units.map((unit, index) => editing === unit.number ? (
            <li key={unit.number} className="bg-secondary/30 px-3 py-3">
              <label className="block text-xs font-medium text-muted-foreground" htmlFor={`unit-name-${unit.number}`}>{adding?.number === unit.number ? "New Unit name" : "Name"}</label>
              <input id={`unit-name-${unit.number}`} value={draftName} autoFocus onChange={e => setDraftName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") save(unit); if (e.key === "Escape") cancel(); }} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              {nameTaken(unit.number) && <p className="mt-1 text-xs text-muted-foreground">Another Unit already has that name.</p>}
              <fieldset className="mt-3">
                <legend className="text-xs font-medium text-muted-foreground">Use</legend>
                <div className="mt-1 flex gap-2">
                  {(["Residential", "Commercial"] as const).map(use => (
                    <button key={use} type="button" aria-pressed={draftUse === use} onClick={() => setDraftUse(use)} className={`min-h-9 rounded-full border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${draftUse === use ? "border-foreground/40 bg-background font-medium text-foreground" : "border-border text-muted-foreground hover:bg-background"}`}>{use}</button>
                  ))}
                </div>
              </fieldset>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => save(unit)} disabled={!draftName.trim() || nameTaken(unit.number)} className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"><Check className="h-3.5 w-3.5" aria-hidden />Save</button>
                <button type="button" onClick={cancel} className="min-h-9 rounded-md px-3 text-sm text-foreground hover:bg-background">Cancel</button>
              </div>
            </li>
          ) : (
            <SortableRow key={unit.number} id={unit.number} label={unit.name} disabled={!editable || editing !== null}>{handle => (<>
              {editable && handle}
              {onOpenUnit ? <UnitKnowledgeRow unit={unit} onAddDescription={() => onOpenUnit(unit)}><button type="button" onClick={() => onOpenUnit(unit)} aria-label={`Open ${unit.name}`} className="flex min-w-0 flex-1 flex-col rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="truncate text-sm font-medium text-foreground hover:underline">{unit.name}</span><span className="truncate text-xs text-muted-foreground">{summaryLine(unit, statusFor(recordId, unit.number))}{unit.location ? ` · ${unit.location}` : ""}</span></button></UnitKnowledgeRow> : <>
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{unit.name}</p>
              <p className="min-w-0 truncate text-xs text-muted-foreground">{summaryLine(unit, statusFor(recordId, unit.number))}{unit.location ? ` · ${unit.location}` : ""}</p></>}
              {editable && <button type="button" aria-label={`Edit ${unit.name}`} onClick={() => open(unit)} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Pencil className="h-3.5 w-3.5" aria-hidden /></button>}
              {editable && (
                <Menu.Root modal={false}>
                  <Menu.Trigger aria-label={`More for ${unit.name}`} className="-ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><MoreHorizontal className="h-4 w-4" aria-hidden /></Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Content align="end" sideOffset={4} className="z-[1000] min-w-32 rounded-md border border-border bg-background p-1 text-sm text-foreground shadow-md">
                      <Menu.Item onSelect={() => open(unit)} className="cursor-pointer rounded px-3 py-2 outline-none data-[highlighted]:bg-secondary">Edit</Menu.Item>
                      <Menu.Item disabled={index === 0} onSelect={() => move(index, index - 1)} className="cursor-pointer rounded px-3 py-2 outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-secondary">Move up</Menu.Item>
                      <Menu.Item disabled={index === base.length - 1} onSelect={() => move(index, index + 1)} className="cursor-pointer rounded px-3 py-2 outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-secondary">Move down</Menu.Item>
                      <Menu.Item disabled={base.length < 2} onSelect={() => onRemove?.(unit, index)} className="cursor-pointer rounded px-3 py-2 outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-secondary">Remove</Menu.Item>
                    </Menu.Content>
                  </Menu.Portal>
                </Menu.Root>
              )}
            </>)}</SortableRow>
          ))}
        </ul>
        </SortableContext>
        </DndContext>
      ) : <p className="text-sm text-muted-foreground">Separate spaces still to establish</p>}
      {understanding.kind === "proposal" && editable && !adding && (
        <button type="button" onClick={startAdd} className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Plus className="h-3.5 w-3.5" aria-hidden />Add another Unit</button>
      )}
    </section>
  );
}
