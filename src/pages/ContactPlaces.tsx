import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GROUPS, type Relation } from "./prototypeContactsDirectory";

export type PlaceRow = { key: string; name: string; sub: string | null; relations: Relation[] };

/** Group a contact's relations by the place they belong to: buildings first, then their Units. */
export function placeRows(relations: Relation[]): PlaceRow[] {
  const rows: PlaceRow[] = [];
  const portfolio = relations.filter((r) => r.scope.kind === "portfolio");
  if (portfolio.length) rows.push({ key: "portfolio", name: "Whole portfolio", sub: null, relations: portfolio });
  for (const g of GROUPS) {
    const inGroup = relations.filter((r) => r.scope.kind !== "portfolio" && r.scope.group === g.id);
    if (!inGroup.length) continue;
    const whole = inGroup.filter((r) => r.scope.kind === "group");
    if (whole.length) rows.push({ key: g.id, name: g.name, sub: null, relations: whole });
    const units = new Map<string, Relation[]>();
    for (const r of inGroup) if (r.scope.kind === "unit") units.set(r.scope.unit, [...(units.get(r.scope.unit) ?? []), r]);
    for (const [unit, rs] of units) rows.push({ key: `${g.id}/${unit}`, name: unit, sub: g.name, relations: rs });
  }
  return rows;
}

const doing = (rs: Relation[]) => Array.from(new Set(rs.flatMap((r) => [r.role, r.service].filter(Boolean) as string[]))).join(" · ");

/** Locations, each with what they do and where — nothing else. */
export function LocationsList({ rows, lit }: { rows: PlaceRow[]; lit?: Set<string> }) {
  return (
    <ul className="grid">
      {rows.map((row) => (
        <li key={row.key} className={`border-b border-faint-rule py-2 last:border-0 last:pb-0 ${lit && row.relations.some((r) => lit.has(r.id)) ? "bg-primary/[0.06]" : ""}`}>
          <p className="text-xs font-medium text-ink">
            {row.name}
            {row.sub && <span className="font-normal text-ink-muted"> · {row.sub}</span>}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">{doing(row.relations)}</p>
        </li>
      ))}
    </ul>
  );
}

/** Quiet "n locations" control; the list itself is rendered by the caller so it can span the row. */
export function LocationsToggle({ relations, name, open, onToggle }: { relations: Relation[]; name: string; open: boolean; onToggle: () => void }) {
  const rows = placeRows(relations);
  if (!rows.length) return <span className="text-xs text-ink-muted">—</span>;
  const label = rows.length === 1 && rows[0].key === "portfolio" ? "Whole portfolio" : `${rows.length} ${rows.length === 1 ? "location" : "locations"}`;
  return (
    <Button variant="ghost" size="sm" aria-expanded={open} aria-label={`${open ? "Hide" : "Show"} locations for ${name}`} onClick={onToggle} className="h-auto min-h-8 w-full justify-start gap-2 whitespace-normal px-2 py-1.5 text-left text-xs font-normal text-ink-muted">
      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">{label}</span>
      {open ? <ChevronUp className="h-3.5 w-3.5 shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 shrink-0" />}
    </Button>
  );
}

/** The opened list: one line per place, with a finder once the list grows long. */
export function LocationsPanel({ relations, name }: { relations: Relation[]; name: string }) {
  const [query, setQuery] = useState("");
  const rows = placeRows(relations);
  const term = query.trim().toLowerCase();
  const visible = term ? rows.filter((r) => `${r.name} ${r.sub ?? ""}`.toLowerCase().includes(term)) : rows;
  return (
    <div className="min-w-0">
      {rows.length > 6 && (
        <label className="mb-2 flex items-center gap-2 border-b border-bone py-2 text-ink-muted">
          <Search className="h-3.5 w-3.5" />
          <input aria-label={`Find a place for ${name}`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a place" className="min-w-0 w-full bg-transparent text-xs outline-none" />
        </label>
      )}
      <div className="hobson-scroll max-h-64 overflow-y-auto pr-2">
        {visible.length ? <LocationsList rows={visible} /> : <p className="py-2 text-xs text-ink-muted">No matching places</p>}
      </div>
    </div>
  );
}
