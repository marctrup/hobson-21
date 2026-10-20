import { useState } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
import { Check, MoreHorizontal, Pencil, Plus, Undo2 } from "lucide-react";
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
};

const reclassify = (u: ProposedUnit, c: ProposedUnit["classification"]): ProposedUnit =>
  u.classification === c ? u : { ...u, classification: c, type: c === "Residential" ? "Flat" : u.type === "Flat" ? "Unit" : u.type };

export function PrototypeUnitStructure({ understanding, reviewed = false, editable = false, lastRemoved = null, onUndo, onSave, onRemove, onAdd }: Props) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftUse, setDraftUse] = useState<ProposedUnit["classification"]>("Residential");
  const [adding, setAdding] = useState<ProposedUnit | null>(null);
  const base = understanding.kind === "proposal" ? understanding.units : [];
  const units = adding ? [...base, adding] : base;
  const summary = understanding.kind === "proposal" ? summarise(units) : null;
  const nameTaken = (id: number) => units.some(u => u.number !== id && u.name.toLowerCase() === draftName.trim().toLowerCase());

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
          <h3 className="mt-1 text-xl font-semibold text-foreground">Stanley House</h3>
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
            <li key={unit.number} className="flex min-h-11 items-center gap-3 px-3 py-1.5">
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{unit.name}</p>
              <p className="shrink-0 text-xs text-muted-foreground">{unit.classification}{unit.location ? ` · ${unit.location}` : ""}</p>
              {editable && <button type="button" aria-label={`Edit ${unit.name}`} onClick={() => open(unit)} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Pencil className="h-3.5 w-3.5" aria-hidden /></button>}
              {editable && (
                <Menu.Root modal={false}>
                  <Menu.Trigger aria-label={`More for ${unit.name}`} className="-ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><MoreHorizontal className="h-4 w-4" aria-hidden /></Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Content align="end" sideOffset={4} className="z-[1000] min-w-32 rounded-md border border-border bg-background p-1 text-sm text-foreground shadow-md">
                      <Menu.Item onSelect={() => open(unit)} className="cursor-pointer rounded px-3 py-2 outline-none data-[highlighted]:bg-secondary">Edit</Menu.Item>
                      <Menu.Item disabled={base.length < 2} onSelect={() => onRemove?.(unit, index)} className="cursor-pointer rounded px-3 py-2 outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-secondary">Remove</Menu.Item>
                    </Menu.Content>
                  </Menu.Portal>
                </Menu.Root>
              )}
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-muted-foreground">Separate spaces still to establish</p>}
      {understanding.kind === "proposal" && editable && !adding && (
        <button type="button" onClick={startAdd} className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Plus className="h-3.5 w-3.5" aria-hidden />Add another Unit</button>
      )}
    </section>
  );
}
