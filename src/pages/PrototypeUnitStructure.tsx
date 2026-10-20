import { summarise, type BuildingUnderstanding } from "./prototypeUnitStructure";

export function PrototypeUnitStructure({ understanding, named = false }: { understanding: BuildingUnderstanding; named?: boolean }) {
  const summary = understanding.kind === "proposal" ? summarise(understanding.units) : null;
  return (
    <section aria-label="Proposed building structure" className="min-w-0 py-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{named ? "Proposed structure · names chosen" : "Proposed structure"}</p>
          <h3 className="mt-1 text-xl font-semibold text-foreground">Stanley House</h3>
          {summary && <p className="mt-1 text-sm text-foreground">{summary.total} Units · {summary.residential} Residential · {summary.commercial} Commercial</p>}
        </div>
        <p className="text-xs text-muted-foreground">Nothing created yet</p>
      </div>
      {understanding.kind === "proposal" ? (
        <div className="mx-auto w-full max-w-lg border-b-4 border-border px-3 pb-1">
          <div className="mx-3 h-3 border-x border-t border-border bg-secondary/40" aria-hidden="true" />
          <ol aria-label="Proposed Units" className="flex flex-col gap-1 border-x border-border px-2">
            {understanding.units.map(unit => (
              <li key={unit.number} className="flex min-h-12 min-w-0 items-center gap-3 rounded-sm border border-border bg-background px-4 py-2">
                <span aria-hidden="true" className="grid h-6 w-8 shrink-0 grid-cols-2 gap-1 border border-border p-1"><span className="bg-secondary" /><span className="bg-secondary" /></span>
                <div className="min-w-0 flex-1"><p className="break-words text-sm font-medium text-foreground">{unit.name}</p><p className="mt-0.5 break-words text-xs text-muted-foreground">{unit.type} · {unit.classification}{unit.location ? ` · ${unit.location}` : ""}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-center text-xs text-muted-foreground">Suggested names and classifications · awaiting your review</p>
        </div>
      ) : <p className="text-sm text-muted-foreground">Separate spaces still to establish</p>}
    </section>
  );
}
