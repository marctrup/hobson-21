import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrototypeUnitPhotographs } from "./PrototypeUnitPhotographs";
import { copyDescription, groupedNames, listNames, unitSpecificPhrases, applyChanges, FIELD_LABELS, fieldsFor, formatValue, proposeChanges, setDetails, suggestDescription, type DetailField, type DetailedUnit, type UnitDetails } from "./prototypeUnitDetails";

type Props = { unit: DetailedUnit; units: DetailedUnit[]; groupName: string; onChange: (units: DetailedUnit[]) => void; onBack: () => void; onRename?: boolean };

const toText = (n?: number) => n === undefined ? "" : String(n);
const parseCount = (v: string) => v.trim() === "" ? undefined : /^\d{1,2}$/.test(v.trim()) ? Number(v) : NaN;
const parseArea = (v: string) => v.trim() === "" ? undefined : /^\d{1,6}(\.\d{1,2})?$/.test(v.trim()) ? Number(v) : NaN;

const inputCls = "h-9 w-20 rounded-md border border-input bg-background px-2 text-right text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const pill = (on: boolean) => `min-h-8 rounded-full border px-3 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${on ? "border-foreground/40 bg-background font-medium text-foreground" : "border-border text-muted-foreground hover:bg-secondary"}`;

// One Unit's optional details, edited in place beside its Unit Group. Nothing is required.
export function PrototypeUnitDetails({ unit, units, groupName, onChange, onBack, onRename }: Props) {
  const d = unit.details ?? {};
  const [area, setArea] = useState(toText(d.area));
  const [areaUnit, setAreaUnit] = useState(d.areaUnit ?? "ft²");
  const [dbl, setDbl] = useState(toText(d.doubleBedrooms));
  const [sgl, setSgl] = useState(toText(d.singleBedrooms));
  const [bath, setBath] = useState(toText(d.bathrooms));
  const [outside, setOutside] = useState<"Yes" | "No" | undefined>(d.outsideSpace);
  const [shared, setShared] = useState<"Yes" | "No" | undefined>(d.sharedFacilities);
  const [gas, setGas] = useState<"Yes" | "No" | undefined>(d.gasSupply);
  const [description, setDescription] = useState(d.description ?? "");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [name, setName] = useState(unit.name);
  useEffect(() => { setName(unit.name); }, [unit.number, unit.name]);
  const nameChanged = Boolean(onRename) && name.trim() !== "" && name.trim() !== unit.name;
  const named = (list: DetailedUnit[]) => nameChanged ? list.map(u => u.number === unit.number ? { ...u, name: name.trim() } : u) : list;

  // Reload whenever a different Unit opens or its record changes elsewhere (e.g. from the conversation).
  useEffect(() => {
    const x = unit.details ?? {};
    setArea(toText(x.area)); setAreaUnit(x.areaUnit ?? "ft²"); setDbl(toText(x.doubleBedrooms)); setSgl(toText(x.singleBedrooms)); setBath(toText(x.bathrooms)); setOutside(x.outsideSpace); setShared(x.sharedFacilities); setGas(x.gasSupply); setDescription(x.description ?? ""); setSuggestion(null);
  }, [unit.number, unit.details]);
  useEffect(() => { if (!saved) return; const t = window.setTimeout(() => setSaved(false), 2000); return () => window.clearTimeout(t); }, [saved]);
  useEffect(() => { setApplying(false); }, [unit.number]);

  const residential = unit.classification === "Residential";
  const draft: UnitDetails = { area: parseArea(area), areaUnit: area.trim() ? areaUnit : undefined, doubleBedrooms: residential ? parseCount(dbl) : undefined, singleBedrooms: residential ? parseCount(sgl) : undefined, bathrooms: residential ? parseCount(bath) : undefined, outsideSpace: residential ? outside : undefined, sharedFacilities: residential ? shared : undefined, gasSupply: residential ? gas : undefined, description: description.trim() || undefined };
  const invalid = Object.values(draft).some(v => typeof v === "number" && Number.isNaN(v));
  const dirty = JSON.stringify(setDetails([unit], unit.number, draft)[0].details) !== JSON.stringify(setDetails([unit], unit.number, unit.details ?? {})[0].details);

  const save = () => { if (invalid) return; onChange(named(setDetails(units, unit.number, draft))); setSaved(true); };
  const currentUnit = { ...unit, details: draft };
  const currentUnits = setDetails(units, unit.number, draft);
  const hasDetails = fieldsFor(unit).some(f => draft[f] !== undefined && draft[f] !== "");
  const keepDraft = () => { if (!invalid && dirty) onChange(currentUnits); };

  const count = (label: string, value: string, set: (v: string) => void) => (
    <label className="flex items-center justify-between gap-3 py-1.5 text-sm text-foreground">
      <span>{label}</span>
      <input inputMode="numeric" value={value} onChange={e => set(e.target.value)} placeholder="—" aria-label={label} className={inputCls} />
    </label>
  );

  const yesNo = (label: string, value: "Yes" | "No" | undefined, set: (v: "Yes" | "No" | undefined) => void) => (
    <div className="flex flex-wrap items-center justify-between gap-2 py-1.5 text-sm text-foreground">
      <span>{label}</span>
      <div role="group" aria-label={label} className="flex gap-1">
        {(["Yes", "No", undefined] as const).map(v => <button key={v ?? "none"} type="button" aria-pressed={value === v} onClick={() => set(v)} className={pill(value === v)}>{v ?? "Not recorded"}</button>)}
      </div>
    </div>
  );

  return (
    <section aria-label={`${unit.name} details`} className="min-w-0 py-3 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
      <button type="button" onClick={() => { keepDraft(); onBack(); }} className="mb-3 inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-secondary px-3 text-sm font-medium text-foreground shadow-sm hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ChevronLeft className="h-4 w-4" aria-hidden />Back to all Units</button>
      {onRename ? <label className="mt-1 block text-xs text-muted-foreground">Unit name
        <input value={name} onChange={e => setName(e.target.value)} className="mt-0.5 h-9 w-full max-w-sm rounded-md border border-input bg-background px-2 text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </label> : <h3 className="mt-1 text-xl font-semibold text-foreground">{unit.name}</h3>}
      <p className="mt-0.5 text-sm text-muted-foreground">{groupName} · {unit.classification}</p>
      <PrototypeUnitPhotographs unit={unit} onChange={photos => onChange(units.map(u => u.number === unit.number ? { ...u, ...photos } : u))} />

      <div className="mt-3 divide-y divide-border border-y border-border">
        <div className="flex flex-wrap items-center justify-between gap-2 py-1.5 text-sm text-foreground">
          <label htmlFor="unit-area">Floor area</label>
          <div className="flex items-center gap-2">
            <input id="unit-area" inputMode="decimal" value={area} onChange={e => setArea(e.target.value)} placeholder="—" className={`${inputCls} w-24`} />
            <div role="group" aria-label="Area measurement" className="flex gap-1">
              {(["ft²", "m²"] as const).map(m => <button key={m} type="button" aria-pressed={areaUnit === m} onClick={() => setAreaUnit(m)} className={pill(areaUnit === m)}>{m}</button>)}
            </div>
          </div>
        </div>
        {residential && <>
          {count("Double bedrooms", dbl, setDbl)}
          {count("Single bedrooms", sgl, setSgl)}
          {count("Bathrooms", bath, setBath)}
          {yesNo("Shared facilities", shared, setShared)}
          {yesNo("Outside space", outside, setOutside)}
          {yesNo("Gas supply", gas, setGas)}
        </>}
        <div className="py-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="unit-description" className="text-sm text-foreground">Description</label>
            <button type="button" onClick={() => setSuggestion(invalid ? null : suggestDescription(unit, draft) ?? "")} className="min-h-8 rounded-md px-2 text-xs text-muted-foreground hover:text-foreground">Suggest from these details</button>
          </div>
          <textarea id="unit-description" value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Not entered" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          {draft.description && !invalid && <DescriptionReuse unit={currentUnit} units={currentUnits} onApply={next => { onChange(next); setSaved(true); }} />}
          {suggestion !== null && (
            <div role="status" className="mt-2 flex gap-2">
              <div className="min-w-0 flex-1 rounded-md bg-secondary/40 px-3 py-2 text-sm text-foreground">
                {suggestion ? <>
                  <p className="text-xs text-muted-foreground">Hobson suggests, from what's recorded:</p>
                  <p className="mt-1">{suggestion}</p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => { setDescription(suggestion); setSuggestion(null); }} className="min-h-8 rounded-md px-2 text-xs font-medium text-foreground hover:bg-background">Use this</button>
                    <button type="button" onClick={() => setSuggestion(null)} className="min-h-8 rounded-md px-2 text-xs text-muted-foreground hover:bg-background">Dismiss</button>
                  </div>
                </> : <p>I'd need a detail or two first — I won't describe what I haven't been told.</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={save} disabled={(!dirty && !nameChanged) || invalid} className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-40">Save</button>
        <span aria-live="polite" className="text-xs text-muted-foreground">{invalid ? "Use whole numbers — leave blank if not known." : saved ? <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" aria-hidden />Changes saved.</span> : dirty || nameChanged ? "Unsaved changes" : ""}</span>
        <Button variant="ghost" size="sm" onClick={() => setApplying(v => !v)} disabled={invalid || !hasDetails} aria-expanded={applying} className="ml-auto text-muted-foreground">Apply details to other Units</Button>
      </div>
      {applying && <ApplyToOthers unit={currentUnit} units={currentUnits} onApply={next => { onChange(next); setApplying(false); setSaved(true); }} onCancel={() => setApplying(false)} />}
    </section>
  );
}

// Copy chosen facts from one Unit to others, review the exact changes, and apply only on confirmation.
function ApplyToOthers({ unit, units, onApply, onCancel }: { unit: DetailedUnit; units: DetailedUnit[]; onApply: (u: DetailedUnit[]) => void; onCancel: () => void }) {
  const d = unit.details ?? {};
  const available = fieldsFor(unit).filter(f => d[f] !== undefined && d[f] !== "");
  const candidates = units.filter(u => u.number !== unit.number);
  const [targets, setTargets] = useState<number[]>([]);
  // Bedrooms and bathrooms are offered by default; area, outside space and description must be chosen deliberately.
  const [fields, setFields] = useState<DetailField[]>(available.filter(f => ["doubleBedrooms", "singleBedrooms", "bathrooms"].includes(f)));
  const [replace, setReplace] = useState<string[]>([]);
  const patch = useMemo(() => Object.fromEntries(fields.flatMap((f): [string, unknown][] => f === "area" ? [["area", d.area], ["areaUnit", d.areaUnit]] : [[f, d[f]]])) as UnitDetails, [fields, d]);
  const changes = proposeChanges(units, targets, patch);
  const accepted = changes.filter(c => !c.replaces || replace.includes(`${c.unit}:${c.field}`));
  const toggle = <T,>(list: T[], v: T) => list.includes(v) ? list.filter(x => x !== v) : [...list, v];

  if (!available.length) return <p className="mt-2 rounded-md bg-secondary/40 px-3 py-2 text-sm text-foreground">There's nothing recorded for {unit.name} yet to copy. <button type="button" onClick={onCancel} className="ml-1 text-muted-foreground underline">Close</button></p>;
  return (
    <div aria-label="Apply to other Units" className="mt-3 rounded-md border border-border bg-secondary/20 px-3 py-3 text-sm text-foreground">
      <p className="text-xs font-medium text-muted-foreground">1 · Which Units?</p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {candidates.map(u => <button key={u.number} type="button" aria-pressed={targets.includes(u.number)} onClick={() => setTargets(t => toggle(t, u.number))} className={pill(targets.includes(u.number))}>{u.name}</button>)}
        {candidates.length > 1 && <button type="button" onClick={() => setTargets(targets.length === candidates.length ? [] : candidates.map(u => u.number))} className="min-h-8 px-2 text-xs text-muted-foreground underline-offset-4 hover:underline">{targets.length === candidates.length ? "Clear" : "All"}</button>}
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground">2 · Which details?</p>
      <div className="mt-1.5 flex flex-col gap-1">
        {available.map(f => <label key={f} className="flex items-center gap-2"><input type="checkbox" checked={fields.includes(f)} onChange={() => setFields(x => toggle(x, f))} /><span>{FIELD_LABELS[f]}</span><span className="truncate text-muted-foreground">· {formatValue(f, d)}</span></label>)}
      </div>
      {targets.length > 0 && fields.length > 0 && <>
        <p className="mt-3 text-xs font-medium text-muted-foreground">3 · Proposed changes</p>
        {changes.length ? <ul className="mt-1.5 divide-y divide-border rounded-md border border-border bg-background">
          {changes.map(c => { const key = `${c.unit}:${c.field}`; return (
            <li key={key} className="flex flex-wrap items-center gap-x-2 px-2 py-1.5 text-xs">
              <span className="font-medium">{c.name}</span><span className="text-muted-foreground">{FIELD_LABELS[c.field]}:</span>
              {c.replaces ? <label className="flex items-center gap-1.5"><input type="checkbox" checked={replace.includes(key)} onChange={() => setReplace(r => toggle(r, key))} />Replace {c.from} with {c.to}</label> : <span>{c.to}</span>}
            </li>); })}
        </ul> : <p className="mt-1 text-xs text-muted-foreground">Those Units already have these details.</p>}
      </>}
      <div className="mt-3 flex gap-2">
        <button type="button" disabled={!accepted.length} onClick={() => onApply(applyChanges(units, patch, accepted))} className="min-h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-40">Apply {accepted.length ? `${accepted.length} change${accepted.length === 1 ? "" : "s"}` : ""}</button>
        <button type="button" onClick={onCancel} className="min-h-9 rounded-md px-3 text-sm hover:bg-background">Cancel</button>
      </div>
    </div>
  );
}

// Reuse one Unit's description on others: exact copies that stay independently editable afterwards.
function DescriptionReuse({ unit, units, onApply }: { unit: DetailedUnit; units: DetailedUnit[]; onApply: (u: DetailedUnit[]) => void }) {
  const description = unit.details?.description ?? "";
  const [open, setOpen] = useState(false);
  const [targets, setTargets] = useState<number[]>([]);
  const [replace, setReplace] = useState<number[]>([]);
  const [done, setDone] = useState<string | null>(null);
  useEffect(() => { setOpen(false); setTargets([]); setReplace([]); setDone(null); }, [unit.number]);
  useEffect(() => { if (!done) return; const t = window.setTimeout(() => setDone(null), 3000); return () => window.clearTimeout(t); }, [done]);
  const others = units.filter(u => u.number !== unit.number);
  const picked = others.filter(u => targets.includes(u.number));
  const differing = picked.filter(u => u.details?.description && u.details.description !== description);
  const willChange = picked.filter(u => u.details?.description !== description && (!differing.includes(u) || replace.includes(u.number)));
  const specific = unitSpecificPhrases(description, unit);
  const toggle = (list: number[], n: number) => list.includes(n) ? list.filter(x => x !== n) : [...list, n];

  if (!open) return <div className="mt-1 flex items-center gap-2"><button type="button" onClick={() => setOpen(true)} className="min-h-8 rounded-md px-0 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Use this description for other Units</button>{done && <span role="status" className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Check className="h-3 w-3" aria-hidden />{done}</span>}</div>;
  return (
    <div aria-label="Use this description for other Units" className="mt-2 rounded-md border border-border bg-secondary/20 px-3 py-2 text-sm text-foreground">
      <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5 sm:grid-cols-3">
        {others.map(u => <li key={u.number}><label className="flex min-h-8 items-center gap-2"><input type="checkbox" checked={targets.includes(u.number)} onChange={() => setTargets(t => toggle(t, u.number))} /><span className="truncate">{u.name}</span>{u.details?.description && <span className="text-[10px] text-muted-foreground">· has one</span>}</label></li>)}
      </ul>
      {picked.length > 0 && specific.length > 0 && <p className="mt-2 rounded bg-background px-2 py-1.5 text-xs text-foreground">This mentions {listNames(specific.map(p => `"${p}"`))}, which may only be true of {unit.name}. You may wish to adjust it on the others afterwards.</p>}
      {differing.length > 0 && <div className="mt-2 text-xs">
        <p className="text-muted-foreground">{groupedNames(differing.map(u => u.name))} already {differing.length === 1 ? "has a description" : "have descriptions"}. Replace them?</p>
        {differing.map(u => <label key={u.number} className="mt-1 flex items-start gap-2"><input type="checkbox" className="mt-0.5" checked={replace.includes(u.number)} onChange={() => setReplace(r => toggle(r, u.number))} /><span><span className="font-medium">Replace {u.name}'s</span> <span className="text-muted-foreground">"{u.details?.description}"</span></span></label>)}
      </div>}
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" disabled={!willChange.length} onClick={() => { onApply(copyDescription(units, description, targets, replace)); setDone(`Copied to ${groupedNames(willChange.map(u => u.name))}`); setOpen(false); setTargets([]); setReplace([]); }} className="min-h-9 rounded-md bg-primary px-3 text-left text-sm font-medium text-primary-foreground disabled:opacity-40">{willChange.length ? `Apply this description to ${groupedNames(willChange.map(u => u.name))}` : "Choose Units"}</button>
        <button type="button" onClick={() => { setOpen(false); setTargets([]); setReplace([]); }} className="min-h-9 rounded-md px-3 text-sm hover:bg-background">Cancel</button>
      </div>
    </div>
  );
}
