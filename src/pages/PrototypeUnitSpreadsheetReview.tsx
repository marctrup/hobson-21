import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FIELD_LABELS } from "./prototypeUnitDetails";
import { unitIdentity, type PhysicalGroup, type PhysicalReview } from "./prototypeUnitSpreadsheet";

export function PrototypeUnitSpreadsheetReview({ review, groups, onMatch, onSave, onCancel }: { review: PhysicalReview; groups: PhysicalGroup[]; onMatch: (key: string, id: string) => void; onSave: (keys: string[]) => void; onCancel: () => void }) {
  const [approved, setApproved] = useState<string[]>(review.changes.filter(c => !c.changed).map(c => c.key));
  const toggle = (key: string) => setApproved(a => a.includes(key) ? a.filter(k => k !== key) : [...a, key]);
  return <section aria-label="Review physical details" className="min-w-0 space-y-5 py-3">
    <header><p className="text-xs text-muted-foreground">Spreadsheet · Review</p><h3 className="mt-1 text-xl font-semibold text-foreground">Physical details</h3></header>
    {([false, true] as const).map(changed => {
      const rows = review.changes.filter(c => c.changed === changed);
      return rows.length > 0 && <div key={String(changed)}>
        <div className="mb-2 flex items-center justify-between gap-3"><h4 className="text-sm font-semibold text-foreground">{changed ? "Changed information" : "New information"}</h4><Button variant="ghost" size="sm" onClick={() => setApproved(a => rows.every(c => a.includes(c.key)) ? a.filter(k => !rows.some(c => c.key === k)) : [...new Set([...a, ...rows.map(c => c.key)])])}>{rows.every(c => approved.includes(c.key)) ? "Deselect all" : changed ? "Confirm all replacements" : "Select all"}</Button></div>
        <ul className="divide-y divide-border border-y border-border">{rows.map(c => <li key={c.key}><label className="flex items-start gap-3 py-3 text-sm"><input type="checkbox" checked={approved.includes(c.key)} onChange={() => toggle(c.key)} className="mt-1" /><span className="min-w-0 flex-1"><span className="block font-medium text-foreground">{c.name}</span><span className="block text-xs text-muted-foreground">{c.field === "groupDescription" ? "Description" : c.field === "bedrooms" ? "Bedrooms" : FIELD_LABELS[c.field]}</span><span className="mt-1 block break-words text-foreground">{c.changed ? `${c.before} → ` : ""}{c.after}{c.field === "area" ? " m²" : ""}</span></span></label></li>)}</ul>
      </div>;
    })}
    {review.unchanged > 0 && <p className="text-xs text-muted-foreground">Unchanged information · {review.unchanged} values</p>}
    {review.checks.length > 0 && <div><h4 className="mb-2 text-sm font-semibold text-foreground">Needs a check</h4><ul className="divide-y divide-border border-y border-border">{review.checks.map((c, i) => <li key={`${c.key}:${i}`} className="py-3 text-sm"><p className="font-medium text-foreground">{c.name}</p><p className="mt-1 text-xs text-muted-foreground">{c.reason}</p>{c.matchable && <select aria-label={`Match ${c.name}`} value="" onChange={e => onMatch(c.key, e.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-2 text-foreground"><option value="">Choose existing {c.sheet === "Units" ? "Unit" : "Unit Group"}</option>{groups.flatMap(g => c.sheet === "Units" ? g.units.map(u => <option key={unitIdentity(g, u)} value={unitIdentity(g, u)}>{g.name} · {u.name}</option>) : [<option key={g.id} value={g.id}>{g.name}</option>])}</select>}</li>)}</ul></div>}
    <div className="flex flex-wrap gap-2"><Button disabled={!approved.length} onClick={() => onSave(approved)}>Save {approved.length || ""} changes</Button><Button variant="outline" onClick={onCancel}>Cancel</Button></div>
  </section>;
}