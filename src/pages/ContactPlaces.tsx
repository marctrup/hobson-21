import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GROUPS, type Relation } from "./prototypeContactsDirectory";

/** Read-only scope inspection, separate from opening or changing a contact. */
export function ContactPlaces({ relations, name }: { relations: Relation[]; name: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const portfolio = relations.filter((r) => r.scope.kind === "portfolio");
  const groups = GROUPS.flatMap((g) => {
    const records = relations.filter((r) => r.scope.kind !== "portfolio" && r.scope.group === g.id);
    return records.length ? [{ ...g, records }] : [];
  });
  const unitCount = new Set(relations.flatMap((r) => r.scope.kind === "unit" ? [`${r.scope.group}/${r.scope.unit}`] : [])).size;
  const summary = [portfolio.length ? "Portfolio" : "", groups.length ? `${groups.length} Unit Group${groups.length === 1 ? "" : "s"}` : "", unitCount ? `${unitCount} Unit${unitCount === 1 ? "" : "s"}` : ""].filter(Boolean).join(" · ");
  if (!summary) return <span className="text-xs text-ink-muted">—</span>;
  const term = query.trim().toLowerCase();
  const visible = groups.filter((g) => `${g.name} ${g.records.map((r) => r.scope.kind === "unit" ? r.scope.unit : "").join(" ")}`.toLowerCase().includes(term));
  return (
    <div className="min-w-0">
      <Button variant="ghost" size="sm" aria-expanded={open} aria-label={`${open ? "Hide" : "Show"} places for ${name}`} onClick={() => setOpen(!open)} className="h-auto min-h-8 w-full justify-start gap-2 whitespace-normal px-2 py-1.5 text-left text-xs font-normal text-ink-muted">
        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">{summary}</span>
        {open ? <ChevronUp className="h-3.5 w-3.5 shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 shrink-0" />}
      </Button>
      {open && <div className="mt-1 border-l border-bone pl-3">
        {groups.length > 6 && <label className="mb-3 flex items-center gap-2 border-b border-bone py-2 text-ink-muted"><Search className="h-3.5 w-3.5" /><input aria-label={`Find a place for ${name}`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a place" className="min-w-0 w-full bg-transparent text-xs outline-none" /></label>}
        <div className="hobson-scroll max-h-64 overflow-y-auto pr-2">
          {portfolio.length > 0 && <p className="py-2 text-xs font-medium text-ink">Whole portfolio</p>}
          {visible.map((g) => {
            const wholeGroup = g.records.filter((r) => r.scope.kind === "group");
            const units = Array.from(new Set(g.records.flatMap((r) => r.scope.kind === "unit" ? [r.scope.unit] : [])));
            return <div key={g.id} className="border-b border-faint-rule py-2 last:border-0">
              <p className="text-xs font-medium text-ink">{g.name}</p>
              {wholeGroup.length > 0 && <p className="mt-1 text-xs text-ink-muted">Unit Group · {Array.from(new Set(wholeGroup.map((r) => r.service ?? r.role))).join(" · ")}</p>}
              {units.map((unit) => <p key={unit} className="mt-1 text-xs text-ink-muted">{unit} · {Array.from(new Set(g.records.filter((r) => r.scope.kind === "unit" && r.scope.unit === unit).map((r) => r.service ?? r.role))).join(" · ")}</p>)}
            </div>;
          })}
          {!visible.length && term && <p className="py-2 text-xs text-ink-muted">No matching places</p>}
        </div>
      </div>}
    </div>
  );
}