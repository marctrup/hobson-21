import { useState } from "react";
import { CollapsibleSection } from "@/components/prototype/CollapsibleSection";
import {
  groupPreferences, groupRequirements, unitPreferences, unitRequirements,
  type ComplianceRequirement, type PreferenceView,
} from "./prototypeUnitCompliance";

// Read-only record sections for the Map workspace: what Hobson has recorded about
// a place, shown the same way at Unit Group and Unit level. No editing, no
// compliance dashboard — further questions belong in Chat.

const sectionCls = "rounded-md border border-border bg-background";
const headerCls = "flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md";
const contentCls = "px-3 pb-3 pt-1";

function SectionTitle({ title, summary }: { title: string; summary: string }) {
  return (
    <span className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
      <span className="text-xs font-semibold text-foreground">{title}</span>
      <span className="truncate text-xs text-muted-foreground">{summary}</span>
    </span>
  );
}

function RequirementRow({ requirement, origin }: { requirement: ComplianceRequirement; origin?: string }) {
  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-3 py-1.5 text-sm">
      <span className="min-w-0">
        <span className="font-medium text-foreground">{requirement.name}</span>
        {origin && <span className="ml-2 text-xs text-muted-foreground">{origin}</span>}
        {requirement.note && <span className="ml-2 text-xs text-muted-foreground">· {requirement.note}</span>}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">{requirement.frequency ?? "Frequency not recorded"}</span>
    </li>
  );
}

function ContactRow({ view }: { view: PreferenceView }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="py-1.5 text-sm">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="flex w-full flex-wrap items-baseline justify-between gap-x-3 rounded text-left hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0">
          <span className="text-muted-foreground">{view.preference.service}</span>
          <span className="mx-2 text-muted-foreground" aria-hidden>·</span>
          <span className="font-medium text-foreground">{view.contractor.name}</span>
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">{view.origin}</span>
      </button>
      {open && (
        <div className="mt-1 rounded-md bg-secondary/30 px-2.5 py-1.5 text-xs text-muted-foreground">
          <p>{view.contractor.service} · {view.origin}</p>
          <p className="mt-0.5">{view.contractor.contact ?? "No contact details recorded yet."}</p>
        </div>
      )}
    </li>
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
        <ul className="divide-y divide-border">
          {requirements.map(r => <RequirementRow key={r.id} requirement={r} />)}
        </ul>
        <p className="mt-2 text-[10px] text-muted-foreground">Recorded by you — ask Hobson in Chat for anything further.</p>
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
      {own.length > 0 && <ul className="divide-y divide-border">{own.map(r => <RequirementRow key={r.id} requirement={r} origin="Recorded for this Unit" />)}</ul>}
      {shared.length > 0 && <ul className={`divide-y divide-border ${own.length ? "mt-1 border-t border-border" : ""}`}>{shared.map(r => <RequirementRow key={r.id} requirement={r} origin={`Shared through ${groupName}`} />)}</ul>}
      <p className="mt-2 text-[10px] text-muted-foreground">Recorded by you — ask Hobson in Chat for anything further.</p>
    </CollapsibleSection>
  );
}

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
        <ul className="divide-y divide-border">{shared.map(v => <ContactRow key={v.preference.id} view={v} />)}</ul>
        {unitSpecific.length > 0 && (
          <CollapsibleSection
            className="mt-2 rounded-md border border-dashed border-border"
            headerClassName="flex w-full items-center gap-2 px-2.5 py-1.5 text-left hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            contentClassName="px-2.5 pb-2"
            ariaLabel="Unit-specific preferences"
            summary={<span className="text-xs text-muted-foreground">Unit-specific preferences — {unitSpecific.length}</span>}
          >
            <ul className="divide-y divide-border">
              {unitSpecific.map(v => {
                const scope = v.preference.scope;
                const names = scope.kind === "units" ? scope.units.map(n => unitName?.(n) ?? `Unit ${n}`).join(", ") : "";
                return (
                  <li key={v.preference.id} className="py-1.5 text-xs">
                    <span className="text-muted-foreground">{names}</span>
                    <span className="mx-1.5 text-muted-foreground" aria-hidden>·</span>
                    <span className="font-medium text-foreground">{v.contractor.name}</span>
                    <span className="ml-1.5 text-muted-foreground">{v.preference.service.toLowerCase()}</span>
                  </li>
                );
              })}
            </ul>
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
      <ul className="divide-y divide-border">{preferences.map(v => <ContactRow key={v.preference.id} view={v} />)}</ul>
    </CollapsibleSection>
  );
}
