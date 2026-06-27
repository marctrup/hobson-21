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
    category: "certification",
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
    category: "certification",
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
    category: "certification",
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
    category: "certification",
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
    category: "certification",
  },
  {
    id: rid("s13"),
    docType: "Section 13 rent-increase notice (template)",
    matchTerms: ["section 13", "s13"],
    basis: "applicable",
    durationValue: 1,
    durationUnit: "Years",
    anchor: "template version date",
    appliesTo: "unit",
    category: "notice",
    description: "Held template · used when proposing a rent increase",
    versionSource: "hobson",
  },
  {
    id: rid("pst"),
    docType: "Periodic Tenancy agreement (PST)",
    matchTerms: ["tenancy agreement", "ast", "pst"],
    basis: "required",
    durationValue: 1,
    durationUnit: "Years",
    anchor: "agreement date",
    appliesTo: "unit",
    category: "contract",
    description: "Must reflect current law · Tenancy Reform Act",
    versionSource: "hobson",
  },
  {
    id: rid("howtorent"),
    docType: "How to Rent guide",
    matchTerms: ["how to rent"],
    basis: "required",
    durationValue: 1,
    durationUnit: "Years",
    anchor: "edition date",
    appliesTo: "unit",
    category: "contract",
    description: "Statutory guide · must be the current gov.uk edition",
    versionSource: "hobson",
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
      {req.category !== "certification" && (
        <VersionSourcePicker req={req} onChange={onChange} />
      )}
      {req.description && (
        <div className="mt-2 text-[11px] text-slate-500 italic">{req.description}</div>
      )}
    </div>
  );
}

function VersionSourcePicker({
  req, onChange, compact = false,
}: {
  req: ComplianceRequirement;
  onChange: (patch: Partial<ComplianceRequirement>) => void;
  compact?: boolean;
}) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const source = req.versionSource ?? "hobson";
  return (
    <div className={(compact ? "mt-1.5 " : "mt-2 ") + "flex flex-wrap items-center gap-2 text-[11px] text-slate-600"}>
      <span className="text-slate-500">Version held:</span>
      <span
        className={
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border " +
          (source === "hobson"
            ? "bg-[#F5F3FF] border-[#7C3AED]/30 text-[#5B21B6]"
            : "bg-amber-50 border-amber-200 text-amber-800")
        }
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h10"/>
        </svg>
        {source === "hobson"
          ? "I hold the latest"
          : `Your version${req.uploadedFileName ? ` · ${req.uploadedFileName}` : ""}`}
      </span>
      <div className="flex-1" />
      {source === "hobson" ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-2 py-0.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        >Upload my own</button>
      ) : (
        <button
          type="button"
          onClick={() => onChange({ versionSource: "hobson", uploadedFileName: undefined })}
          className="px-2 py-0.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        >Use mine</button>

      )}
      <input
        ref={fileRef}
        type="file"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange({ versionSource: "uploaded", uploadedFileName: f.name });
          e.currentTarget.value = "";
        }}
      />
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
          category: "certification",

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

/* ------------------------------------------------------------
   Recalibration (per-group "Update" → web re-check, propose changes)
   ------------------------------------------------------------ */

type RecalibrationChange =
  | {
      kind: "document_updated";
      id: string;
      title: string;
      summary: string;
      targetRuleId: string;        // rule whose held version is being updated
      newVersionLabel: string;     // e.g. "PST template · Jan 2025"
      acceptLabel: string;         // e.g. "Apply new version"
      keepLabel: string;           // e.g. "Keep mine"
    }
  | {
      kind: "edition_updated";
      id: string;
      title: string;
      summary: string;
      targetRuleId: string;
      newEditionLabel: string;
      acceptLabel: string;
      keepLabel: string;
    }
  | {
      kind: "frequency_changed";
      id: string;
      title: string;
      summary: string;
      targetRuleId: string;
      newValue: number;
      newUnit: DurationUnit;
      acceptLabel: string;
      keepLabel: string;
    };

type RecalibrationState = {
  group: RequirementCategory;
  phase: "researching" | "results";
  changes: RecalibrationChange[];
  unchangedNote: string;
  resolved: Record<string, "applied" | "dismissed">;
  /** Override the scope label used in the panel intro (e.g. "the whole set"). */
  scopeLabel?: string;
};


const GROUP_META: Record<RequirementCategory, { label: string; helper: string }> = {
  certification: { label: "Certifications", helper: "Inspections and certificates — held as individual instances." },
  notice:        { label: "Notice templates", helper: "Held templates used when serving notice." },
  contract:      { label: "Contracts & Documents", helper: "Tenancy paperwork and statutory documents." },
};

function buildRecalibration(group: RequirementCategory, rules: ComplianceRequirement[]): RecalibrationState {
  if (group === "contract") {
    const pst = rules.find((r) => r.matchTerms.some((m) => m.includes("ast") || m.includes("pst") || m.includes("tenancy agreement")));
    const htr = rules.find((r) => r.matchTerms.some((m) => m.includes("how to rent")));
    const changes: RecalibrationChange[] = [];
    if (pst && pst.versionSource === "hobson") {
      changes.push({
        kind: "document_updated",
        id: "ch-pst",
        title: "Periodic Tenancy template — newer version available",
        summary:
          "The template you hold is based on the prior AST format. A PST-compliant version reflecting the Tenancy Reform Act is now available.",
        targetRuleId: pst.id,
        newVersionLabel: "PST template · v1.0 (Tenancy Reform Act)",
        acceptLabel: "Apply new version",
        keepLabel: "Keep mine",
      });
    }
    if (htr && htr.versionSource === "hobson") {
      changes.push({
        kind: "edition_updated",
        id: "ch-htr",
        title: "How to Rent — new gov.uk edition",
        summary: "gov.uk has published a newer edition of the How to Rent guide. Landlords must serve the current edition at the start of a tenancy.",
        targetRuleId: htr.id,
        newEditionLabel: "How to Rent · current edition",
        acceptLabel: "Use current edition",
        keepLabel: "Dismiss",
      });
    }
    return {
      group,
      phase: "researching",
      changes,
      unchangedNote: "Gas, EICR and EPC requirements and frequencies are unchanged.",
      resolved: {},
    };
  }
  if (group === "notice") {
    return {
      group,
      phase: "researching",
      changes: [],
      unchangedNote: "Your held notice templates are current — nothing has changed since you set this up.",
      resolved: {},
    };
  }
  // certifications
  return {
    group,
    phase: "researching",
    changes: [],
    unchangedNote: "Gas Safety, EICR, EPC, fire door and fire alarm requirements and frequencies are unchanged.",
    resolved: {},
  };
}

function RecalibrationPanel({
  state, onResolve, onDismissAll,
}: {
  state: RecalibrationState;
  onResolve: (changeId: string, decision: "applied" | "dismissed", change: RecalibrationChange) => void;
  onDismissAll: () => void;
}) {
  return (
    <div className="mt-3 rounded-xl border border-[#7C3AED]/30 bg-[#FAF8FF] p-3 space-y-3">
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full overflow-hidden bg-white ring-1 ring-[#7C3AED]/20 grid place-items-center shrink-0">
          <img src={INSPECTOR_CHARACTER.src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain" />
        </div>
        <div className="min-w-0">
          {state.phase === "researching" ? (
            <div className="text-[12px] text-[#5B21B6] flex items-center gap-2">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "300ms" }} />
              </span>
              Re-checking gov.uk and HSE guidance for {state.scopeLabel ?? GROUP_META[state.group].label.toLowerCase()}…
            </div>
          ) : state.changes.length === 0 ? (
            <div className="text-[12px] text-slate-700">
              I've re-checked the current requirements against gov.uk and HSE guidance. <span className="font-medium">Nothing has changed</span> since you set this up — {state.unchangedNote.replace(/^./, (c) => c.toLowerCase())}
            </div>
          ) : (
            <div className="text-[12px] text-slate-700">
              I've re-checked the current requirements against gov.uk and HSE guidance.
              {" "}<span className="font-medium">{state.changes.length} thing{state.changes.length === 1 ? " has" : "s have"} changed</span> since you set this up. Review and confirm what you'd like to apply.
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onDismissAll}
          className="ml-auto shrink-0 text-[11px] text-slate-500 hover:text-slate-800 rounded px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          aria-label="Close recalibration"
        >Close</button>
      </div>

      {state.phase === "results" && state.changes.length > 0 && (
        <div className="space-y-2">
          {state.changes.map((c) => {
            const decision = state.resolved[c.id];
            return (
              <div key={c.id} className={"rounded-lg border bg-white p-3 " + (decision ? "border-slate-200 opacity-80" : "border-[#7C3AED]/25")}>
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#F5F3FF] border border-[#7C3AED]/30 text-[10px] uppercase tracking-wide text-[#5B21B6] font-semibold shrink-0">
                    {c.kind === "document_updated" ? "Document updated" : c.kind === "edition_updated" ? "New edition" : "Frequency changed"}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900">{c.title}</div>
                    <div className="text-[12px] text-slate-700 mt-0.5">{c.summary}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {c.kind === "document_updated" && <>New version: <span className="font-medium text-slate-700">{c.newVersionLabel}</span></>}
                      {c.kind === "edition_updated" && <>Latest: <span className="font-medium text-slate-700">{c.newEditionLabel}</span></>}
                      {c.kind === "frequency_changed" && <>New cadence: <span className="font-medium text-slate-700">every {c.newValue} {c.newUnit.toLowerCase()}</span></>}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-end gap-2">
                  {decision ? (
                    <span className={"text-[11px] " + (decision === "applied" ? "text-emerald-700" : "text-slate-500")}>
                      {decision === "applied" ? "Applied" : "Dismissed"}
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onResolve(c.id, "dismissed", c)}
                        className="px-2.5 py-1 rounded-md text-[12px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                      >{c.keepLabel}</button>
                      <button
                        type="button"
                        onClick={() => onResolve(c.id, "applied", c)}
                        className="px-2.5 py-1 rounded-md text-[12px] font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                      >{c.acceptLabel}</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {state.phase === "results" && state.group === "contract" && (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600 flex items-start gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="mt-0.5 shrink-0 text-emerald-600"><path d="M20 6L9 17l-5-5"/></svg>
          <span>{state.unchangedNote}</span>
        </div>
      )}
    </div>
  );
}

function GroupSection({
  group, rules, onUpdateRule, onRecalibrate, recal, onResolve, onClose,
}: {
  group: RequirementCategory;
  rules: ComplianceRequirement[];
  onUpdateRule: (id: string, patch: Partial<ComplianceRequirement>) => void;
  onRecalibrate: () => void;
  recal: RecalibrationState | null;
  onResolve: (changeId: string, decision: "applied" | "dismissed", change: RecalibrationChange) => void;
  onClose: () => void;
}) {
  const meta = GROUP_META[group];
  const busy = !!recal && recal.phase === "researching";
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-900">{meta.label}</div>
          <div className="text-[11px] text-slate-500">{meta.helper}</div>
        </div>
        <button
          type="button"
          onClick={onRecalibrate}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-300 bg-white text-[12px] text-slate-700 hover:bg-slate-50 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          aria-label={`Update ${meta.label} from the web`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={busy ? "animate-spin" : ""}>
            <path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>
          </svg>
          {busy ? "Re-checking…" : "Update"}
        </button>
      </header>
      <div className="p-3 space-y-2">
        {rules.length === 0 ? (
          <div className="text-[12px] text-slate-500 italic px-1 py-3">No items in this group yet.</div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {rules.map((r) => (
              <div key={r.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-[13px] font-semibold text-slate-900 truncate">{r.docType}</div>
                  <BasisBadge basis={r.basis} />
                </div>
                {r.category === "certification" ? (
                  <>
                    <div className="text-[12px] text-slate-700">
                      Renews every <span className="font-medium">{r.durationValue} {r.durationUnit.toLowerCase()}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Anchor: {r.anchor} · scope: {r.appliesTo === "building" ? "building" : "per let unit"}
                    </div>
                  </>
                ) : (
                  <>
                    {r.description && <div className="text-[12px] text-slate-700">{r.description}</div>}
                    <VersionSourcePicker req={r} onChange={(patch) => onUpdateRule(r.id, patch)} compact />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {recal && (
          <RecalibrationPanel state={recal} onResolve={onResolve} onDismissAll={onClose} />
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Standing check schedule
   ------------------------------------------------------------ */

type CheckFrequency = "monthly" | "quarterly" | "halfyearly" | "yearly";

const FREQUENCY_OPTIONS: { value: CheckFrequency; label: string; months: number }[] = [
  { value: "monthly",    label: "Every month",    months: 1 },
  { value: "quarterly",  label: "Every 3 months", months: 3 },
  { value: "halfyearly", label: "Every 6 months", months: 6 },
  { value: "yearly",     label: "Every year",     months: 12 },
];

function addMonths(d: Date, months: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function ScheduleHeader({
  frequency, onFrequency, lastChecked, onCheckNow, busy,
}: {
  frequency: CheckFrequency;
  onFrequency: (f: CheckFrequency) => void;
  lastChecked: Date;
  onCheckNow: () => void;
  busy: boolean;
}) {
  const months = FREQUENCY_OPTIONS.find((f) => f.value === frequency)?.months ?? 3;
  const nextDue = addMonths(lastChecked, months);
  return (
    <section
      aria-label="Inspector recalibration schedule"
      className="rounded-xl border border-[#7C3AED]/25 bg-white p-4"
    >
      <div className="flex items-start gap-3 flex-wrap">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F5F3FF] ring-1 ring-[#7C3AED]/20 grid place-items-center shrink-0">
          <img src={INSPECTOR_CHARACTER.src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-slate-900">The Inspector re-checks the law &amp; documents</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            A standing check across every requirement. I'll propose any changes — I never apply them on my own.
          </div>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <label className="text-[11px] text-slate-600 flex items-center gap-2">
              <span>Cadence</span>
              <select
                value={frequency}
                onChange={(e) => onFrequency(e.target.value as CheckFrequency)}
                className="px-2 py-1 rounded-md border border-slate-300 text-[12px] bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                aria-label="Recalibration cadence"
              >
                {FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <div className="text-[11px] text-slate-500">
              Last checked <span className="text-slate-700 font-medium">{fmtDate(lastChecked)}</span>
              {" · "}next due <span className="text-slate-700 font-medium">{fmtDate(nextDue)}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onCheckNow}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#7C3AED] text-white text-[12px] font-semibold hover:bg-[#6D28D9] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={busy ? "animate-spin" : ""}>
            <path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>
          </svg>
          {busy ? "Checking…" : "Check now"}
        </button>
      </div>
    </section>
  );
}

function buildFullRecalibration(rules: ComplianceRequirement[]): RecalibrationState {
  // Reuse the contract-group script (AST→PST + How to Rent + certifications unchanged note),
  // re-scoped as a whole-set check for the standing schedule / "Check now".
  const base = buildRecalibration("contract", rules);
  return { ...base, scopeLabel: "the whole set" };
}


export function InspectorWorkArea({

  rules,
  onUpdateRules,
}: {
  rules: ComplianceRequirement[];
  onUpdateRules?: React.Dispatch<React.SetStateAction<ComplianceRequirement[]>>;
}) {
  const required = rules.filter((r) => r.basis === "required");
  const applicable = rules.filter((r) => r.basis === "applicable");

  const certs     = rules.filter((r) => r.category === "certification");
  const notices   = rules.filter((r) => r.category === "notice");
  const contracts = rules.filter((r) => r.category === "contract");

  const [recal, setRecal] = useState<Record<RequirementCategory, RecalibrationState | null>>({
    certification: null, notice: null, contract: null,
  });

  // Standing schedule (resets with the prototype). Seed: quarterly cadence, last checked 14 days ago.
  const [frequency, setFrequency] = useState<CheckFrequency>("quarterly");
  const [lastChecked, setLastChecked] = useState<Date>(() => {
    const d = new Date(); d.setDate(d.getDate() - 14); return d;
  });
  const [globalRecal, setGlobalRecal] = useState<RecalibrationState | null>(null);

  function runFullCheck() {
    const next = buildFullRecalibration(rules);
    setGlobalRecal(next);
    window.setTimeout(() => {
      setGlobalRecal((cur) => (cur ? { ...cur, phase: "results" } : cur));
      setLastChecked(new Date());
    }, 1500);
  }

  function closeGlobal() { setGlobalRecal(null); }

  function resolveGlobal(changeId: string, decision: "applied" | "dismissed", change: RecalibrationChange) {
    setGlobalRecal((cur) => cur ? { ...cur, resolved: { ...cur.resolved, [changeId]: decision } } : cur);
    if (decision === "applied" && onUpdateRules) {
      onUpdateRules((rs) => rs.map((r) => {
        if (r.id !== change.targetRuleId) return r;
        if (change.kind === "document_updated")  return { ...r, versionSource: "hobson", uploadedFileName: undefined, description: change.newVersionLabel };
        if (change.kind === "edition_updated")   return { ...r, versionSource: "hobson", uploadedFileName: undefined, description: change.newEditionLabel };
        if (change.kind === "frequency_changed") return { ...r, durationValue: change.newValue, durationUnit: change.newUnit };
        return r;
      }));
    }
  }


  function startRecalibrate(group: RequirementCategory) {
    const next = buildRecalibration(group, rules);
    setRecal((m) => ({ ...m, [group]: next }));
    window.setTimeout(() => {
      setRecal((m) => {
        const cur = m[group];
        if (!cur) return m;
        return { ...m, [group]: { ...cur, phase: "results" } };
      });
    }, 1400);
  }

  function closeRecal(group: RequirementCategory) {
    setRecal((m) => ({ ...m, [group]: null }));
  }

  function resolveChange(group: RequirementCategory, changeId: string, decision: "applied" | "dismissed", change: RecalibrationChange) {
    setRecal((m) => {
      const cur = m[group];
      if (!cur) return m;
      return { ...m, [group]: { ...cur, resolved: { ...cur.resolved, [changeId]: decision } } };
    });
    if (decision === "applied" && onUpdateRules) {
      onUpdateRules((rs) => rs.map((r) => {
        if (r.id !== change.targetRuleId) return r;
        if (change.kind === "document_updated")  return { ...r, versionSource: "hobson", uploadedFileName: undefined, description: change.newVersionLabel };
        if (change.kind === "edition_updated")   return { ...r, versionSource: "hobson", uploadedFileName: undefined, description: change.newEditionLabel };
        if (change.kind === "frequency_changed") return { ...r, durationValue: change.newValue, durationUnit: change.newUnit };
        return r;
      }));
    }
  }

  function updateRule(id: string, patch: Partial<ComplianceRequirement>) {
    if (!onUpdateRules) return;
    onUpdateRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

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
          {rules.length > 0 && (
            <>
              <ScheduleHeader
                frequency={frequency}
                onFrequency={setFrequency}
                lastChecked={lastChecked}
                onCheckNow={runFullCheck}
                busy={!!globalRecal && globalRecal.phase === "researching"}
              />
              {globalRecal && (
                <RecalibrationPanel
                  state={globalRecal}
                  onResolve={resolveGlobal}
                  onDismissAll={closeGlobal}
                />
              )}
            </>
          )}

          <section className="rounded-xl border border-[#7C3AED]/20 bg-[#FAF8FF] p-4">
            <div className="text-[12px] font-semibold text-[#5B21B6] mb-1">How this connects</div>
            <p className="text-[12px] text-slate-700 leading-relaxed">
              The Professor extracts dates from your documents. I check them against the rules below.
              Anything missing or out of date appears in the Compliance summary — a missing
              <span className="font-semibold"> legally required</span> document is flagged accordingly.
              The standing check above runs me across the whole set on your chosen cadence;
              use <span className="font-semibold">Update</span> on any group for a one-off re-check.
            </p>
          </section>


          {rules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <div className="text-[13px] font-semibold text-slate-700 mb-1">No compliance rules yet</div>
              <div className="text-[12px] text-slate-500">Pick an area on the left and I'll propose what the law requires.</div>
            </div>
          ) : (
            <div className="space-y-4">
              <GroupSection
                group="certification"
                rules={certs}
                onUpdateRule={updateRule}
                onRecalibrate={() => startRecalibrate("certification")}
                recal={recal.certification}
                onResolve={(id, d, c) => resolveChange("certification", id, d, c)}
                onClose={() => closeRecal("certification")}
              />
              <GroupSection
                group="notice"
                rules={notices}
                onUpdateRule={updateRule}
                onRecalibrate={() => startRecalibrate("notice")}
                recal={recal.notice}
                onResolve={(id, d, c) => resolveChange("notice", id, d, c)}
                onClose={() => closeRecal("notice")}
              />
              <GroupSection
                group="contract"
                rules={contracts}
                onUpdateRule={updateRule}
                onRecalibrate={() => startRecalibrate("contract")}
                recal={recal.contract}
                onResolve={(id, d, c) => resolveChange("contract", id, d, c)}
                onClose={() => closeRecal("contract")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

