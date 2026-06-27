/**
 * The Inspector — 4th Admin character.
 *
 * Conversational compliance-rule builder (mirrors the Magician's
 * propose-and-refine pattern). Researches what the law requires for the
 * chosen area (residential Health & Safety in this prototype), proposes
 * requirements with default renewal frequencies, the user curates and
 * confirms. Confirmed requirements become compliance RULES which drive
 * the Compliance Summary — missing required documents read as
 * "missing — legally required" rather than just "not determined".
 *
 * Scripted/simulated for the prototype. Resets with the prototype.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import characterInspector from "@/assets/prototype/character-inspector.png";
import type { ComplianceRow, SummaryScope } from "./summaryData";
import { SUMMARY_PROPERTIES, occupationalForScope } from "./summaryData";

export const INSPECTOR_CHARACTER = {
  id: "inspector" as const,
  name: "The Inspector",
  src: characterInspector,
  tagline: "Compliance & protection",
  greeting:
    "I make sure you're never caught out. Tell me which area of compliance to set up, and I'll find what the law requires.",
  workTitle: "The Inspector's compliance board",
  workIntro: "Where the rules are set that I watch every property against.",
};

/* ---------------- Types ---------------- */

export type ComplianceArea = "health_safety" | "notices" | "lease" | "other";

export type RequirementBasis = "required" | "applicable";
export type DurationUnit = "Years" | "Months";
export type RequirementCategory = "certification" | "notice" | "contract";
export type VersionSource = "hobson" | "uploaded";

export type ComplianceRequirement = {
  id: string;
  docType: string;
  matchTerms: string[];      // matched against ComplianceRow.documentName
  basis: RequirementBasis;
  durationValue: number;
  durationUnit: DurationUnit;
  anchor: string;            // human-readable anchor description
  appliesTo: "unit" | "building";
  category: RequirementCategory;
  /** Short note shown on contract/notice cards in place of renewal cadence. */
  description?: string;
  /** Only meaningful for contracts/notices — certifications don't have versions. */
  versionSource?: VersionSource;
  /** Filename the user uploaded as their own version, if any. */
  uploadedFileName?: string;
};


export type InspectorEvent =
  | { kind: "inspector"; id: string; text: string }
  | { kind: "user"; id: string; text: string }
  | { kind: "researching"; id: string }
  | { kind: "confirmed"; id: string; count: number };

/* ---------------- Default proposed (residential H&S) ---------------- */

let counter = 0;
const rid = (slug: string) => `req-${slug}-${++counter}`;

export const DEFAULT_HS_REQUIREMENTS: ComplianceRequirement[] = [
  {
    id: rid("gas"),
    docType: "Gas Safety certificate (CP12)",
    matchTerms: ["gas safety", "cp12"],
    basis: "required",
    durationValue: 1,
    durationUnit: "Years",
    anchor: "certificate date",
    appliesTo: "unit",
  },
  {
    id: rid("eicr"),
    docType: "EICR (electrical)",
    matchTerms: ["eicr", "electrical"],
    basis: "required",
    durationValue: 5,
    durationUnit: "Years",
    anchor: "inspection date",
    appliesTo: "unit",
  },
  {
    id: rid("epc"),
    docType: "EPC",
    matchTerms: ["epc"],
    basis: "required",
    durationValue: 10,
    durationUnit: "Years",
    anchor: "certificate date",
    appliesTo: "unit",
  },
  {
    id: rid("firedoor"),
    docType: "Fire door inspection",
    matchTerms: ["fire door"],
    basis: "applicable",
    durationValue: 6,
    durationUnit: "Months",
    anchor: "last inspection",
    appliesTo: "building",
  },
  {
    id: rid("firealarm"),
    docType: "Fire alarm test",
    matchTerms: ["fire alarm test", "fire alarm log"],
    basis: "applicable",
    durationValue: 3,
    durationUnit: "Months",
    anchor: "last test",
    appliesTo: "building",
  },
];

/* ---------------- Augment compliance rows with rule-driven flagging ---------------- */

/**
 * Returns rows augmented so that:
 *  - existing missing rows whose docName matches a required rule get
 *    `legallyRequired: true` (and a clean docType label).
 *  - required rules that have no matching row at all (per-building for
 *    building rules; per let-unit for unit rules) get a synthesised
 *    missing row tagged legallyRequired.
 *
 * "Where applicable" rules never upgrade a row to legally required — they
 * surface as informational rules in The Inspector's work area only.
 */
export function augmentComplianceRows(
  rows: ComplianceRow[],
  scope: SummaryScope,
  rules: ComplianceRequirement[],
): ComplianceRow[] {
  if (rules.length === 0) return rows;

  const required = rules.filter((r) => r.basis === "required");
  if (required.length === 0) return rows;

  const matches = (docName: string | null | undefined, rule: ComplianceRequirement) => {
    if (!docName) return false;
    const lower = docName.toLowerCase();
    return rule.matchTerms.some((t) => lower.includes(t));
  };

  const upgraded = rows.map((row): ComplianceRow => {
    if (!row.missing || !row.documentName) return row;
    const rule = required.find((r) => matches(row.documentName, r));
    if (!rule) return row;
    return { ...row, legallyRequired: true };
  });

  // Synthesise missing rows for required rules with no presence in scope.
  const synthesised: ComplianceRow[] = [];
  const propertiesInScope = scope.level === "portfolio"
    ? SUMMARY_PROPERTIES.map((p) => p.id)
    : [scope.propertyId];

  for (const propertyId of propertiesInScope) {
    const propertyMeta = SUMMARY_PROPERTIES.find((p) => p.id === propertyId);
    if (!propertyMeta) continue;
    const propertyName = propertyMeta.name;

    for (const rule of required) {
      if (rule.appliesTo === "building") {
        // Only synthesise building rows when viewing the whole property/portfolio,
        // not a single unit view.
        if (scope.level === "unit") continue;
        const has = upgraded.some(
          (r) => r.propertyId === propertyId && r.unitId === null && matches(r.documentName, rule),
        );
        if (!has) {
          synthesised.push({
            propertyId,
            propertyName,
            unitId: null,
            unitLabel: "Building",
            documentName: rule.docType,
            effectiveDate: null,
            expiryDate: null,
            missing: true,
            legallyRequired: true,
          });
        }
        continue;
      }

      // unit-level required rule
      const letUnits = occupationalForScope(
        scope.level === "unit"
          ? scope
          : scope.level === "property"
            ? { level: "property", propertyId }
            : { level: "property", propertyId },
      ).filter((u) => u.status === "Let");

      for (const u of letUnits) {
        const has = upgraded.some(
          (r) => r.propertyId === propertyId && r.unitId === u.unitId && matches(r.documentName, rule),
        );
        if (!has) {
          synthesised.push({
            propertyId,
            propertyName,
            unitId: u.unitId,
            unitLabel: u.unitLabel,
            documentName: rule.docType,
            effectiveDate: null,
            expiryDate: null,
            missing: true,
            legallyRequired: true,
          });
        }
      }
    }
  }

  return [...upgraded, ...synthesised];
}

/* ============================================================
   Left-pane chat — InspectorChat
   ============================================================ */

type InspectorChatProps = {
  events: InspectorEvent[];
  area: ComplianceArea | null;
  proposed: ComplianceRequirement[] | null;   // editable list shown during step 3
  confirmed: ComplianceRequirement[];          // active rules
  isResearching: boolean;
  onPickArea: (a: ComplianceArea, label: string) => void;
  onOtherText: (text: string) => void;
  onUpdateRequirement: (id: string, patch: Partial<ComplianceRequirement>) => void;
  onRemoveRequirement: (id: string) => void;
  onAddRequirement: (req: Omit<ComplianceRequirement, "id">) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const BUBBLE_GAP = 10;
const TURN_GAP = 16;

const useReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function CharacterAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-[#F5F3FF] ring-1 ring-slate-200 grid place-items-center">
      <img src={src} alt={alt} className="w-[120%] h-[120%] object-contain object-center" />
    </div>
  );
}

function InspectorBubble({
  text,
  showAvatar,
  streamKey,
}: { text: string; showAvatar: boolean; streamKey: string }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? text : "");
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced) { setShown(text); setDone(true); return; }
    setShown(""); setDone(false);
    const words = text.split(" ");
    let i = 0; let cancelled = false;
    const step = () => {
      if (cancelled) return;
      i += 1;
      setShown(words.slice(0, i).join(" "));
      if (i < words.length) setTimeout(step, 35 + Math.random() * 30);
      else setDone(true);
    };
    const t = setTimeout(step, 80);
    return () => { cancelled = true; clearTimeout(t); };
  }, [streamKey, text, reduced]);

  return (
    <div className="flex items-end gap-2">
      {showAvatar
        ? <CharacterAvatar src={INSPECTOR_CHARACTER.src} alt="The Inspector" />
        : <div aria-hidden className="w-10 h-10 shrink-0" />}
      <div className="max-w-[460px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md whitespace-pre-line">
        {shown}
        {!done && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[460px] bg-[#7C3AED] text-white text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-br-md">
        {text}
      </div>
    </div>
  );
}

function ResearchingBubble() {
  return (
    <div className="flex items-end gap-2" aria-live="polite">
      <CharacterAvatar src={INSPECTOR_CHARACTER.src} alt="" />
      <div className="max-w-[460px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "300ms" }} />
          </span>
          <span className="italic">Looking up gov.uk and HSE guidance for residential lettings…</span>
        </span>
      </div>
    </div>
  );
}

const AREA_OPTIONS: { id: ComplianceArea; label: string; hint: string; supported: boolean }[] = [
  { id: "health_safety", label: "Health & Safety", hint: "residential — built path", supported: true },
  { id: "notices",       label: "Notices",         hint: "coming soon",            supported: false },
  { id: "lease",         label: "Lease contracts", hint: "coming soon",            supported: false },
  { id: "other",         label: "Other",           hint: "describe in your own words", supported: false },
];

function AreaPickCard({ onPick, onOther }: { onPick: (a: ComplianceArea, label: string) => void; onOther: (text: string) => void }) {
  const [otherDraft, setOtherDraft] = useState("");
  const [showOther, setShowOther] = useState(false);
  return (
    <div className="ml-12 max-w-[480px] rounded-xl border border-[#7C3AED]/25 bg-white p-3 space-y-2">
      <div className="text-[11px] uppercase tracking-wide text-[#5B21B6] font-semibold">Choose an area</div>
      <div className="grid grid-cols-1 gap-1.5">
        {AREA_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              if (o.id === "other") { setShowOther((v) => !v); return; }
              onPick(o.id, o.label);
            }}
            className="flex items-center justify-between gap-3 text-left px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-[#F5F3FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          >
            <span className="text-[13px] font-medium text-slate-800">{o.label}</span>
            <span className={`text-[11px] ${o.supported ? "text-emerald-700" : "text-slate-500"}`}>{o.hint}</span>
          </button>
        ))}
      </div>
      {showOther && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const t = otherDraft.trim();
            if (!t) return;
            onOther(t);
            setOtherDraft("");
            setShowOther(false);
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            value={otherDraft}
            onChange={(e) => setOtherDraft(e.target.value)}
            placeholder="Describe the compliance area…"
            className="flex-1 px-3 py-1.5 rounded-md border border-slate-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            aria-label="Other compliance area"
          />
          <button
            type="submit"
            disabled={!otherDraft.trim()}
            className="px-3 py-1.5 rounded-md bg-[#7C3AED] text-white text-[12px] font-semibold disabled:bg-slate-200 disabled:text-slate-400"
          >Send</button>
        </form>
      )}
    </div>
  );
}

function BasisBadge({ basis }: { basis: RequirementBasis }) {
  if (basis === "required") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden><path d="M12 8v5"/><circle cx="12" cy="17" r="0.8" fill="currentColor"/><circle cx="12" cy="12" r="10"/></svg>
        Legally required
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200">
      Where applicable
    </span>
  );
}

function RequirementEditor({
  req, onChange, onRemove,
}: { req: ComplianceRequirement; onChange: (patch: Partial<ComplianceRequirement>) => void; onRemove: () => void }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-900 truncate">{req.docType}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Anchor: {req.anchor} · scope: {req.appliesTo === "building" ? "building" : "per unit"}</div>
        </div>
        <BasisBadge basis={req.basis} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="text-[11px] text-slate-600">Renew every</label>
        <input
          type="number"
          min={1}
          value={req.durationValue}
          onChange={(e) => onChange({ durationValue: Math.max(1, Number(e.target.value) || 1) })}
          className="w-16 px-2 py-1 rounded-md border border-slate-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          aria-label={`Renewal duration for ${req.docType}`}
        />
        <select
          value={req.durationUnit}
          onChange={(e) => onChange({ durationUnit: e.target.value as DurationUnit })}
          className="px-2 py-1 rounded-md border border-slate-300 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          aria-label={`Renewal unit for ${req.docType}`}
        >
          <option value="Years">Years</option>
          <option value="Months">Months</option>
        </select>
        <select
          value={req.basis}
          onChange={(e) => onChange({ basis: e.target.value as RequirementBasis })}
          className="px-2 py-1 rounded-md border border-slate-300 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          aria-label={`Legal basis for ${req.docType}`}
        >
          <option value="required">Legally required</option>
          <option value="applicable">Where applicable</option>
        </select>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onRemove}
          className="text-[11px] text-rose-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 rounded px-1"
        >Remove</button>
      </div>
    </div>
  );
}

function AddRequirementForm({ onAdd }: { onAdd: (req: Omit<ComplianceRequirement, "id">) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState(1);
  const [unit, setUnit] = useState<DurationUnit>("Years");
  const [basis, setBasis] = useState<RequirementBasis>("required");
  const reset = () => { setName(""); setValue(1); setUnit("Years"); setBasis("required"); };
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[12px] text-[#7C3AED] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded px-1"
      >
        <span aria-hidden>＋</span> Add another requirement
      </button>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = name.trim();
        if (!t) return;
        onAdd({
          docType: t,
          matchTerms: [t.toLowerCase()],
          basis,
          durationValue: value,
          durationUnit: unit,
          anchor: "certificate date",
          appliesTo: "unit",
        });
        reset();
        setOpen(false);
      }}
      className="rounded-lg border border-dashed border-[#7C3AED]/40 bg-[#F5F3FF] p-3 space-y-2"
    >
      <div className="text-[11px] uppercase tracking-wide text-[#5B21B6] font-semibold">Add a requirement</div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Document type (e.g. Legionella risk assessment)"
        className="w-full px-2 py-1.5 rounded-md border border-slate-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
      />
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-slate-600">Renew every</span>
        <input type="number" min={1} value={value} onChange={(e) => setValue(Math.max(1, Number(e.target.value) || 1))} className="w-16 px-2 py-1 rounded-md border border-slate-300 text-[13px]" />
        <select value={unit} onChange={(e) => setUnit(e.target.value as DurationUnit)} className="px-2 py-1 rounded-md border border-slate-300 text-[13px] bg-white">
          <option value="Years">Years</option>
          <option value="Months">Months</option>
        </select>
        <select value={basis} onChange={(e) => setBasis(e.target.value as RequirementBasis)} className="px-2 py-1 rounded-md border border-slate-300 text-[13px] bg-white">
          <option value="required">Legally required</option>
          <option value="applicable">Where applicable</option>
        </select>
        <div className="flex-1" />
        <button type="button" onClick={() => { reset(); setOpen(false); }} className="text-[12px] text-slate-600 hover:underline px-1">Cancel</button>
        <button type="submit" disabled={!name.trim()} className="px-3 py-1.5 rounded-md bg-[#7C3AED] text-white text-[12px] font-semibold disabled:bg-slate-200 disabled:text-slate-400">Add</button>
      </div>
    </form>
  );
}

function ProposalCard({
  proposed, onUpdate, onRemove, onAdd, onConfirm, onCancel,
}: {
  proposed: ComplianceRequirement[];
  onUpdate: (id: string, patch: Partial<ComplianceRequirement>) => void;
  onRemove: (id: string) => void;
  onAdd: (req: Omit<ComplianceRequirement, "id">) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="ml-12 max-w-[560px] rounded-xl border border-[#7C3AED]/25 bg-white p-3 space-y-3">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#5B21B6] font-semibold">Proposed requirements · residential H&amp;S</div>
          <div className="text-[12px] text-slate-600 mt-0.5">Edit any frequency, remove what doesn't apply, or add another.</div>
        </div>
      </header>
      <div className="rounded-md bg-[#F5F3FF] border border-[#7C3AED]/20 px-3 py-2 text-[11px] text-[#5B21B6] flex items-start gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        <span><span className="font-semibold">Sourced from gov.uk &amp; HSE guidance</span> · these are researched suggestions — you can edit before confirming.</span>
      </div>
      <div className="space-y-2">
        {proposed.map((r) => (
          <RequirementEditor
            key={r.id}
            req={r}
            onChange={(patch) => onUpdate(r.id, patch)}
            onRemove={() => onRemove(r.id)}
          />
        ))}
      </div>
      <AddRequirementForm onAdd={onAdd} />
      <footer className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-md text-[12px] font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >Cancel</button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={proposed.length === 0}
          className="px-3 py-1.5 rounded-md text-[12px] font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:bg-slate-200 disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        >Confirm these requirements</button>
      </footer>
    </div>
  );
}

function ConfirmedRecap({ count }: { count: number }) {
  return (
    <div className="ml-12 max-w-[460px] rounded-xl border border-emerald-200 bg-emerald-50 p-3">
      <div className="text-[11px] uppercase tracking-wide text-emerald-800 font-semibold mb-1">Rules recorded</div>
      <div className="text-[12px] text-slate-700">
        {count} compliance requirement{count === 1 ? "" : "s"} are now active. They drive the Compliance summary across every let unit.
      </div>
    </div>
  );
}

export function InspectorChat(props: InspectorChatProps) {
  const {
    events, area, proposed, isResearching,
    onPickArea, onOtherText,
    onUpdateRequirement, onRemoveRequirement, onAddRequirement,
    onConfirm, onCancel,
  } = props;

  // Intro typing — mirrors AdminChat
  const reduced = useReducedMotion();
  const [introPhase, setIntroPhase] = useState<"typing" | "done">(reduced ? "done" : "typing");
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setIntroPhase("done"), 800);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <div className="flex flex-col" style={{ gap: TURN_GAP }}>
      {/* Greeting */}
      {introPhase === "typing" ? (
        <div className="flex items-end gap-2" aria-live="polite">
          <CharacterAvatar src={INSPECTOR_CHARACTER.src} alt="" />
          <div className="bg-[#EDE9FE] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      ) : (
        <InspectorBubble text={INSPECTOR_CHARACTER.greeting} showAvatar streamKey="intro" />
      )}

      {/* Area pick — appears once intro is done and no area chosen yet */}
      {introPhase === "done" && area === null && events.length === 0 && (
        <div className="flex flex-col" style={{ gap: BUBBLE_GAP }}>
          <InspectorBubble
            text="Which area of compliance would you like to set up?"
            showAvatar={false}
            streamKey="area-prompt"
          />
          <AreaPickCard onPick={onPickArea} onOther={onOtherText} />
        </div>
      )}

      {/* Event log */}
      {events.map((ev, i) => {
        if (ev.kind === "user") return <UserBubble key={ev.id} text={ev.text} />;
        if (ev.kind === "researching") return <ResearchingBubble key={ev.id} />;
        if (ev.kind === "confirmed") return <ConfirmedRecap key={ev.id} count={ev.count} />;
        const prev = events[i - 1];
        const showAvatar = !prev || prev.kind === "user";
        return <InspectorBubble key={ev.id} text={ev.text} showAvatar={showAvatar} streamKey={ev.id} />;
      })}

      {/* Still researching */}
      {isResearching && <ResearchingBubble />}

      {/* Proposal — editable list */}
      {proposed && proposed.length >= 0 && !isResearching && (
        <ProposalCard
          proposed={proposed}
          onUpdate={onUpdateRequirement}
          onRemove={onRemoveRequirement}
          onAdd={onAddRequirement}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}

/* ============================================================
   Left-pane composer — InspectorComposer
   ============================================================ */

export function InspectorComposer({ buildActive }: { buildActive: boolean }) {
  if (buildActive) {
    return (
      <div
        aria-live="polite"
        className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-[#7C3AED]/30 bg-[#F5F3FF] text-[12px] text-[#5B21B6]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 2a10 10 0 1 0 10 10"/><path d="M22 4l-10 10-3-3"/>
        </svg>
        <span>Setting up rules above — confirm or cancel to start another area.</span>
      </div>
    );
  }
  return (
    <div
      aria-disabled="true"
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-[12px] text-slate-500"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
      </svg>
      Free-text chat with The Inspector is coming in the live product — for now, pick an area above to set up rules.
    </div>
  );
}

/* ============================================================
   Right-pane work area — InspectorWorkArea
   ============================================================ */

export function InspectorWorkArea({
  rules,
}: {
  rules: ComplianceRequirement[];
}) {
  const required = rules.filter((r) => r.basis === "required");
  const applicable = rules.filter((r) => r.basis === "applicable");
  return (
    <div className="absolute inset-0 bg-white z-[450] flex flex-col">
      <header className="h-14 px-5 flex items-center border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F5F3FF] ring-1 ring-slate-200 grid place-items-center">
            <img src={INSPECTOR_CHARACTER.src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-slate-900">{INSPECTOR_CHARACTER.workTitle}</div>
            <div className="text-[11px] text-slate-500">
              {rules.length === 0
                ? "No rules yet — set them up on the left."
                : `${required.length} legally required · ${applicable.length} where applicable`}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <section className="rounded-xl border border-[#7C3AED]/20 bg-[#FAF8FF] p-4">
            <div className="text-[12px] font-semibold text-[#5B21B6] mb-1">How this connects</div>
            <p className="text-[12px] text-slate-700 leading-relaxed">
              The Professor extracts dates from your documents. I check them against the rules below.
              Anything missing or out of date appears in the Compliance summary — a missing
              <span className="font-semibold"> legally required</span> document is flagged accordingly.
            </p>
          </section>

          {rules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <div className="text-[13px] font-semibold text-slate-700 mb-1">No compliance rules yet</div>
              <div className="text-[12px] text-slate-500">Pick an area on the left and I'll propose what the law requires.</div>
            </div>
          ) : (
            <section className="space-y-2">
              <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Active rules</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {rules.map((r) => (
                  <div key={r.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="text-[13px] font-semibold text-slate-900 truncate">{r.docType}</div>
                      <BasisBadge basis={r.basis} />
                    </div>
                    <div className="text-[12px] text-slate-700">
                      Renews every <span className="font-medium">{r.durationValue} {r.durationUnit.toLowerCase()}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Anchor: {r.anchor} · scope: {r.appliesTo === "building" ? "building" : "per let unit"}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
