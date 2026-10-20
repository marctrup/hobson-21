import type { BuildingUnderstanding } from "./prototypeUnitStructure";

export function PrototypeUnitStructure({ understanding }: { understanding: BuildingUnderstanding }) {
  return (
    <section aria-label="Proposed building structure" className="min-w-0 py-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Proposed structure</p>
          <h3 className="mt-1 text-xl font-semibold text-foreground">Stanley House</h3>
        </div>
        <p className="text-xs text-muted-foreground">Nothing added yet</p>
      </div>
      {understanding.kind === "proposal" ? (
        <div className="mx-auto w-full max-w-lg border-b-4 border-border px-3 pb-1">
          <div className="mx-3 h-3 border-x border-t border-border bg-secondary/40" aria-hidden="true" />
          <ol aria-label="Proposed Units, highest floor first" className="flex flex-col gap-1 border-x border-border px-2">
            {[...understanding.units].reverse().map(unit => (
              <li key={unit} className="flex min-h-16 min-w-0 items-center gap-3 rounded-sm border border-border bg-background px-4 py-3">
                <span aria-hidden="true" className="grid h-7 w-9 shrink-0 grid-cols-2 gap-1 border border-border p-1"><span className="bg-secondary" /><span className="bg-secondary" /></span>
                <span className="break-words text-sm font-medium text-foreground">{unit}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-center text-xs text-muted-foreground">{understanding.units.length} proposed Units · awaiting review</p>
        </div>
      ) : understanding.kind === "mixed" ? (
        <div className="mx-auto max-w-lg border-x border-b-4 border-border px-3 pb-3">
          <div className="border border-dashed border-border px-4 py-5">
            <p className="text-sm font-medium text-foreground">{understanding.flats} flats above</p>
            <p className="mt-1 text-xs text-muted-foreground">Names and division still to establish</p>
          </div>
          <div className="mt-2 border border-border bg-background px-4 py-5">
            <p className="text-sm font-medium text-foreground">{understanding.shops} shops · Ground Floor</p>
            <p className="mt-1 text-xs text-muted-foreground">Individual names not yet supplied</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Division still to establish</p>
      )}
    </section>
  );
}