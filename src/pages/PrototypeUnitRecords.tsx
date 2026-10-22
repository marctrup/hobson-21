import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CollapsibleSection } from "@/components/prototype/CollapsibleSection";
import {
  groupPreferences, groupRequirements, unitPreferences, unitRequirements,
  type ComplianceRequirement, type PreferenceView,
} from "./prototypeUnitCompliance";

// Read-only record sections for the Map workspace: what Hobson has recorded about
// a place, shown the same way at Unit Group and Unit level. No editing, no
// compliance dashboard — further questions belong in Chat.

const sectionCls = "rounded-xl border border-border/70 bg-background";
const headerCls = "flex w-full items-center gap-2 px-3.5 py-2.5 text-left hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl";
const contentCls = "px-3 pb-3 pt-0.5";

function SectionTitle({ title, summary }: { title: string; summary: string }) {
  return (
    <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{title}</span>
      <span className="shrink-0 rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11px] leading-tight text-muted-foreground">
        {summary}
      </span>
    </span>
  );
}

function RequirementRow({ requirement, origin }: { requirement: ComplianceRequirement; origin?: string }) {
  return (
    <li className="rounded-lg border border-border/60 bg-secondary/25 px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-snug text-foreground">{requirement.name}</span>
        <span className="shrink-0 whitespace-nowrap rounded-full border border-border/50 bg-background/70 px-2 py-0.5 text-[11px] leading-tight text-muted-foreground">
          {requirement.frequency ?? "Frequency not recorded"}
        </span>
      </div>
      {(origin || requirement.note) && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {origin}
          {origin && requirement.note ? " · " : ""}
          {requirement.note}
        </p>
      )}
    </li>
  );
}

function RequirementStack({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-1.5">{children}</ul>;
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ContactRow({ view }: { view: PreferenceView }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="overflow-hidden rounded-lg border border-border/60 bg-secondary/25">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary" aria-hidden>
          {initialsOf(view.contractor.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">{view.contractor.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {view.preference.service} · {view.origin}
          </span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-border/50 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
          <p>{view.contractor.service}</p>
          <p className="mt-0.5">{view.contractor.contact ?? "No contact details recorded yet."}</p>
        </div>
      )}
    </li>
  );
}

function RecordedFootnote() {
  return (
    <p className="mt-2.5 text-[10px] leading-relaxed text-muted-foreground">
      Recorded by you — ask Hobson in Chat for anything further.
    </p>
  );
}

export function LegalResponsibilitiesSection({ recordId, unit, groupName }: { recordId: string; unit?: number; groupName: string }) {
  if (unit === undefined) {
    const requirements = groupRequirements(recordId);
    if (!requirements.length) return null;
    return (
      <CollapsibleSection
        className={sectionCls} headerClassName={headerCls} contentClassName={contentCls}
        ariaLabel="Legal responsibilities"
        summary={<SectionTitle title="Legal responsibilities" summary={`${requirements.length} recorded requirement${requirements.length === 1 ? "" : "s"}`} />}
      >
        <RequirementStack>
          {requirements.map(r => <RequirementRow key={r.id} requirement={r} />)}
        </RequirementStack>
        <RecordedFootnote />
      </CollapsibleSection>
    );
  }
  const { own, shared } = unitRequirements(recordId, unit);
  if (!own.length && !shared.length) return null;
  return (
    <CollapsibleSection
      className={sectionCls} headerClassName={headerCls} contentClassName={contentCls}
      ariaLabel="Legal responsibilities"
      summary={<SectionTitle title="Legal responsibilities" summary={`${own.length + shared.length} recorded requirement${own.length + shared.length === 1 ? "" : "s"}`} />}
    >
      {own.length > 0 && (
        <RequirementStack>
          {own.map(r => <RequirementRow key={r.id} requirement={r} />)}
        </RequirementStack>
      )}
      {shared.length > 0 && (
        <>
          {own.length > 0 && (
            <p className="mb-1.5 mt-2.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Shared through {groupName}
            </p>
          )}
          <RequirementStack>
            {shared.map(r => (
              <RequirementRow key={r.id} requirement={r} origin={`Shared through ${groupName}`} />
            ))}
          </RequirementStack>
        </>
      )}
      <RecordedFootnote />
    </CollapsibleSection>
  );
}

const nestedSectionCls = "rounded-lg border border-dashed border-border/70";
const nestedHeaderCls = "flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg";
const nestedContentCls = "px-3 pb-2.5";

export function PreferredContactsSection({ recordId, unit, groupName, unitName }: { recordId: string; unit?: number; groupName: string; unitName?: (n: number) => string }) {
  if (unit === undefined) {
    const { shared, unitSpecific } = groupPreferences(recordId, groupName);
    if (!shared.length && !unitSpecific.length) return null;
    return (
      <CollapsibleSection
        className={sectionCls} headerClassName={headerCls} contentClassName={contentCls}
        ariaLabel="Preferred contacts"
        summary={<SectionTitle title="Preferred contacts" summary={`${shared.length} shared preference${shared.length === 1 ? "" : "s"}`} />}
      >
        <RequirementStack>
          {shared.map(v => <ContactRow key={v.preference.id} view={v} />)}
        </RequirementStack>
        {unitSpecific.length > 0 && (
          <CollapsibleSection
            className={`mt-2 ${nestedSectionCls}`}
            headerClassName={nestedHeaderCls}
            contentClassName={nestedContentCls}
            ariaLabel="Unit-specific preferences"
            summary={
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Unit-specific preferences · {unitSpecific.length}
              </span>
            }
          >
            <RequirementStack>
              {unitSpecific.map(v => {
                const scope = v.preference.scope;
                const names = scope.kind === "units" ? scope.units.map(n => unitName?.(n) ?? `Unit ${n}`).join(", ") : "";
                return (
                  <li key={v.preference.id} className="rounded-lg bg-secondary/25 px-3 py-1.5 text-xs leading-relaxed">
                    <span className="font-medium text-foreground">{v.contractor.name}</span>
                    <span className="text-muted-foreground"> — {v.preference.service.toLowerCase()} for {names}</span>
                  </li>
                );
              })}
            </RequirementStack>
          </CollapsibleSection>
        )}
      </CollapsibleSection>
    );
  }
  const preferences = unitPreferences(recordId, unit, groupName);
  if (!preferences.length) return null;
  return (
    <CollapsibleSection
      className={sectionCls} headerClassName={headerCls} contentClassName={contentCls}
      ariaLabel="Preferred contacts"
      summary={<SectionTitle title="Preferred contacts" summary={`${preferences.length} preference${preferences.length === 1 ? "" : "s"}`} />}
    >
      <RequirementStack>
        {preferences.map(v => <ContactRow key={v.preference.id} view={v} />)}
      </RequirementStack>
    </CollapsibleSection>
  );
}
