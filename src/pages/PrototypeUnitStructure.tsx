import { useState } from "react";
import { Check, Pencil, Undo2, X } from "lucide-react";
import { summarise, type BuildingUnderstanding, type ProposedUnit } from "./prototypeUnitStructure";

type Props = {
  understanding: BuildingUnderstanding;
  reviewed?: boolean;
  editable?: boolean;
  lastRemoved?: string | null;
  onUndo?: () => void;
  onSave?: (units: ProposedUnit[], note: string) => void;
  onRemove?: (unit: ProposedUnit, index: number) => void;
};

const reclassify = (u: ProposedUnit, c: ProposedUnit["classification"]): ProposedUnit =>
  u.classification === c ? u : { ...u, classification: c, type: c === "Residential" ? "Flat" : u.type === "Flat" ? "Unit" : u.type };

export function PrototypeUnitStructure({ understanding, reviewed = false, editable = false, lastRemoved = null, onUndo, onSave, onRemove }: Props) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftUse, setDraftUse] = useState<ProposedUnit["classification"]>("Residential");
  const units = understanding.kind === "proposal" ? understanding.units : [];
  const summary = understanding.kind === "proposal" ? summarise(units) : null;
  const nameTaken = (id: number) => units.some(u => u.number !== id && u.name.toLowerCase() === draftName.trim().toLowerCase());

  const open = (unit: ProposedUnit) => { setEditing(unit.number); setDraftName(unit.name); setDraftUse(unit.classification); };
  const save = (unit: ProposedUnit) => {
    const name = draftName.trim();
    if (!name || nameTaken(unit.number)) return;
    const updated = reclassify({ ...unit, name }, draftUse);
    onSave?.(units.map(u => u.number === unit.number ? updated : u), `I've updated ${name}.`);
    setEditing(null);
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
              <label className="block text-xs font-medium text-muted-foreground" htmlFor={`unit-name-${unit.number}`}>Name</label>
              <input id={`unit-name-${unit.number}`} value={draftName} autoFocus onChange={e => setDraftName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") save(unit); if (e.key === "Escape") setEditing(null); }} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
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
                <button type="button" onClick={() => setEditing(null)} className="min-h-9 rounded-md px-3 text-sm text-foreground hover:bg-background">Cancel</button>
                {units.length > 1 && <button type="button" onClick={() => { onRemove?.(unit, index); setEditing(null); }} className="ml-auto inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" aria-hidden />Remove this Unit</button>}
              </div>
            </li>
          ) : (
            <li key={unit.number} className="flex min-h-11 items-center gap-3 px-3 py-1.5">
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{unit.name}</p>
              <p className="shrink-0 text-xs text-muted-foreground">{unit.classification}{unit.location ? ` · ${unit.location}` : ""}</p>
              {editable && <button type="button" aria-label={`Edit ${unit.name}`} onClick={() => open(unit)} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Pencil className="h-3.5 w-3.5" aria-hidden /></button>}
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-muted-foreground">Separate spaces still to establish</p>}
      {understanding.kind === "proposal" && editable && <p className="mt-2 text-xs text-muted-foreground">Ask Hobson to add, remove or rename Units, or use the pencil.</p>}
    </section>
  );
}
