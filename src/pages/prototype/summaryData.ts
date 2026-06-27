/**
 * Hobson prototype — one coherent seed dataset for Summary tables.
 *
 * Used by SummaryCard to render Occupational + Compliance summaries
 * at Unit, Property and Portfolio level. A row at any level matches
 * what you see when you drill into that unit — the numbers add up.
 *
 * "Not determined" is rendered by SummaryCard whenever a field is null/undefined.
 * Vacant units intentionally leave occupational fields null (no tenant → no rent etc).
 * Missing compliance docs are surfaced as flagged rows by SummaryCard.
 */

export type SummaryLevel = "portfolio" | "property" | "unit";

export type SummaryScope =
  | { level: "portfolio" }
  | { level: "property"; propertyId: string }
  | { level: "unit"; propertyId: string; unitId: string };

export type OccupationalRow = {
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitLabel: string;
  status: "Let" | "Vacant";
  tenantName?: string | null;
  landlordName?: string | null;
  currentRent?: string | null;     // formatted £xx,xxx p.a.
  nextReviewDate?: string | null;  // "12 Mar 2027"
  nextBreakDate?: string | null;
};

export type ComplianceRow = {
  propertyId: string;
  propertyName: string;
  /** unitId === null means a building-level doc (FRA, fire alarm, etc.). */
  unitId: string | null;
  unitLabel: string;          // e.g. "Building" or "Flat 2"
  documentName?: string | null;
  effectiveDate?: string | null;
  expiryDate?: string | null;
  /** When true, signals "missing — no document on file" treatment. */
  missing?: boolean;
};

export type SummaryPropertyMeta = {
  id: string;
  name: string;
  area: string;
  unitsTotal: number;
};

const LANDLORD = "Hobson Estates Ltd";

/* ---------- Properties (kept aligned with PROPERTIES in Prototype.tsx) ---------- */

export const SUMMARY_PROPERTIES: SummaryPropertyMeta[] = [
  { id: "stanley",  name: "Stanley House",       area: "NW11", unitsTotal: 12 },
  { id: "nugent",   name: "5 Nugent Terrace",    area: "NW8",  unitsTotal: 4  },
  { id: "hamilton", name: "32 Hamilton Gardens", area: "NW8",  unitsTotal: 1  },
];

/* ---------- Occupational seed ---------- */

const OCC: OccupationalRow[] = [
  // Stanley House — 10 let, 2 vacant (F8, Shop)
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f1",  unitLabel: "Flat 1",  status: "Let",    tenantName: "Adesina Okafor",        landlordName: LANDLORD, currentRent: "£42,000 p.a.", nextReviewDate: "24 Mar 2027", nextBreakDate: null },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f2",  unitLabel: "Flat 2",  status: "Let",    tenantName: "Priya Raman",           landlordName: LANDLORD, currentRent: "£39,600 p.a.", nextReviewDate: "15 Sep 2026", nextBreakDate: null },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f3",  unitLabel: "Flat 3",  status: "Let",    tenantName: "James Whitcombe",       landlordName: LANDLORD, currentRent: "£41,200 p.a.", nextReviewDate: "24 Mar 2027", nextBreakDate: null },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f4",  unitLabel: "Flat 4",  status: "Let",    tenantName: "Hannah Goldfarb",       landlordName: LANDLORD, currentRent: "£44,000 p.a.", nextReviewDate: "10 Jan 2028", nextBreakDate: "10 Jan 2027" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f5",  unitLabel: "Flat 5",  status: "Let",    tenantName: "Marcus Lindgren",       landlordName: LANDLORD, currentRent: "£40,800 p.a.", nextReviewDate: "30 Aug 2026", nextBreakDate: "24 Dec 2026" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f6",  unitLabel: "Flat 6",  status: "Let",    tenantName: "Sara Bellamy",          landlordName: LANDLORD, currentRent: "£43,500 p.a.", nextReviewDate: "01 Mar 2027", nextBreakDate: "02 May 2027" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f7",  unitLabel: "Flat 7",  status: "Let",    tenantName: "Oliver Penrose",        landlordName: LANDLORD, currentRent: "£42,600 p.a.", nextReviewDate: null,          nextBreakDate: null },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f8",  unitLabel: "Flat 8",  status: "Vacant", tenantName: null, landlordName: LANDLORD, currentRent: null, nextReviewDate: null, nextBreakDate: null },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f9",  unitLabel: "Flat 9",  status: "Let",    tenantName: "Emeka Adeyemi",         landlordName: LANDLORD, currentRent: "£45,000 p.a.", nextReviewDate: "20 May 2027", nextBreakDate: null },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f10", unitLabel: "Flat 10", status: "Let",    tenantName: "Rosa Albright",         landlordName: LANDLORD, currentRent: "£46,200 p.a.", nextReviewDate: "04 Apr 2028", nextBreakDate: null },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f11", unitLabel: "Flat 11", status: "Let",    tenantName: "Daniel Brookfield",     landlordName: LANDLORD, currentRent: "£43,800 p.a.", nextReviewDate: "18 Feb 2027", nextBreakDate: null },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-shop", unitLabel: "Shop",   status: "Vacant", tenantName: null, landlordName: LANDLORD, currentRent: null, nextReviewDate: null, nextBreakDate: null },

  // 5 Nugent Terrace — 3 let, 1 vacant (F3)
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-f1",   unitLabel: "Flat 1", status: "Let",    tenantName: "Iris Mendoza",     landlordName: LANDLORD, currentRent: "£36,000 p.a.", nextReviewDate: "10 Jul 2027", nextBreakDate: null },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-f2",   unitLabel: "Flat 2", status: "Let",    tenantName: "Thomas Yardley",   landlordName: LANDLORD, currentRent: "£48,000 p.a.", nextReviewDate: "30 May 2026", nextBreakDate: null },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-f3",   unitLabel: "Flat 3", status: "Vacant", tenantName: null, landlordName: LANDLORD, currentRent: null, nextReviewDate: null, nextBreakDate: null },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-shop", unitLabel: "Shop",   status: "Let",    tenantName: "M&S Simply Food",  landlordName: LANDLORD, currentRent: "£72,500 p.a.", nextReviewDate: "20 Aug 2026", nextBreakDate: null },

  // 32 Hamilton Gardens — single unit, Let
  { propertyId: "hamilton", propertyName: "32 Hamilton Gardens", unitId: "hamilton-unit", unitLabel: "32 Hamilton Gardens", status: "Let", tenantName: "Clara Stenhouse", landlordName: LANDLORD, currentRent: "£62,000 p.a.", nextReviewDate: "14 Nov 2026", nextBreakDate: null },
];

/* ---------- Compliance seed ----------
   Building-level docs (unitId: null) sit against the whole building.
   Unit-level docs (gas, EPC) sit against each let unit. Vacant units
   intentionally show "Not determined · no document on file" rows so the
   gap reads as a gap. */

const COMP: ComplianceRow[] = [
  // Stanley House — building
  { propertyId: "stanley", propertyName: "Stanley House", unitId: null, unitLabel: "Building", documentName: "Fire Alarm Certificate",  effectiveDate: "12 Jul 2025", expiryDate: "12 Jul 2026" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: null, unitLabel: "Building", documentName: "Fire Risk Assessment",    effectiveDate: "03 Feb 2025", expiryDate: "03 Feb 2027" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: null, unitLabel: "Building", documentName: "EICR (Communal)",         effectiveDate: "21 Sep 2024", expiryDate: "21 Sep 2029" },

  // Stanley House — per unit (Gas Safety + EPC)
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f1",  unitLabel: "Flat 1",  documentName: "Gas Safety (CP12)", effectiveDate: "18 Apr 2026", expiryDate: "18 Apr 2027" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f1",  unitLabel: "Flat 1",  documentName: "EPC",               effectiveDate: "02 Jun 2022", expiryDate: "02 Jun 2032" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f2",  unitLabel: "Flat 2",  documentName: "Gas Safety (CP12)", effectiveDate: "11 Oct 2025", expiryDate: "11 Oct 2026" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f2",  unitLabel: "Flat 2",  documentName: "EPC",               effectiveDate: "14 Mar 2023", expiryDate: "14 Mar 2033" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f3",  unitLabel: "Flat 3",  documentName: "Gas Safety (CP12)", effectiveDate: "06 Jan 2026", expiryDate: "06 Jan 2027" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f3",  unitLabel: "Flat 3",  documentName: "EPC",               effectiveDate: null,          expiryDate: null, missing: true },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f4",  unitLabel: "Flat 4",  documentName: "Gas Safety (CP12)", effectiveDate: "23 Nov 2025", expiryDate: "23 Nov 2026" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f4",  unitLabel: "Flat 4",  documentName: "EPC",               effectiveDate: "08 Jul 2021", expiryDate: "08 Jul 2031" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f5",  unitLabel: "Flat 5",  documentName: "Gas Safety (CP12)", effectiveDate: "30 Jul 2025", expiryDate: "30 Jul 2026" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f5",  unitLabel: "Flat 5",  documentName: "EPC",               effectiveDate: "12 Dec 2022", expiryDate: "12 Dec 2032" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f6",  unitLabel: "Flat 6",  documentName: "Gas Safety (CP12)", effectiveDate: "15 May 2026", expiryDate: "15 May 2027" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f6",  unitLabel: "Flat 6",  documentName: "EPC",               effectiveDate: "01 Sep 2024", expiryDate: "01 Sep 2034" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f7",  unitLabel: "Flat 7",  documentName: "Gas Safety (CP12)", effectiveDate: "08 Aug 2025", expiryDate: "08 Aug 2026" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f7",  unitLabel: "Flat 7",  documentName: "EPC",               effectiveDate: "19 May 2020", expiryDate: "19 May 2030" },
  // F8 vacant — missing both
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f8",  unitLabel: "Flat 8",  documentName: null, effectiveDate: null, expiryDate: null, missing: true },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f9",  unitLabel: "Flat 9",  documentName: "Gas Safety (CP12)", effectiveDate: "27 Feb 2026", expiryDate: "27 Feb 2027" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f9",  unitLabel: "Flat 9",  documentName: "EPC",               effectiveDate: "04 Apr 2024", expiryDate: "04 Apr 2034" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f10", unitLabel: "Flat 10", documentName: "Gas Safety (CP12)", effectiveDate: "19 Jun 2025", expiryDate: "19 Jun 2026" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f10", unitLabel: "Flat 10", documentName: "EPC",               effectiveDate: "22 Oct 2023", expiryDate: "22 Oct 2033" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f11", unitLabel: "Flat 11", documentName: "Gas Safety (CP12)", effectiveDate: "09 Mar 2026", expiryDate: "09 Mar 2027" },
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-f11", unitLabel: "Flat 11", documentName: "EPC",               effectiveDate: "16 Jan 2025", expiryDate: "16 Jan 2035" },
  // Shop vacant — missing
  { propertyId: "stanley", propertyName: "Stanley House", unitId: "stanley-shop", unitLabel: "Shop",   documentName: null, effectiveDate: null, expiryDate: null, missing: true },

  // 5 Nugent Terrace — building
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: null, unitLabel: "Building", documentName: "Fire Alarm Certificate", effectiveDate: "05 Apr 2026", expiryDate: "05 Apr 2027" },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: null, unitLabel: "Building", documentName: "Fire Risk Assessment",   effectiveDate: "12 Nov 2024", expiryDate: "12 Nov 2026" },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: null, unitLabel: "Building", documentName: "EICR (Communal)",        effectiveDate: "30 Jul 2023", expiryDate: "30 Jul 2028" },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-f1",   unitLabel: "Flat 1", documentName: "Gas Safety (CP12)", effectiveDate: "22 Jan 2026", expiryDate: "22 Jan 2027" },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-f1",   unitLabel: "Flat 1", documentName: "EPC",               effectiveDate: "07 Mar 2022", expiryDate: "07 Mar 2032" },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-f2",   unitLabel: "Flat 2", documentName: "Gas Safety (CP12)", effectiveDate: "18 Dec 2025", expiryDate: "18 Dec 2026" },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-f2",   unitLabel: "Flat 2", documentName: "EPC",               effectiveDate: "11 Nov 2021", expiryDate: "11 Nov 2031" },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-f3",   unitLabel: "Flat 3", documentName: null, effectiveDate: null, expiryDate: null, missing: true },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-shop", unitLabel: "Shop",   documentName: "Gas Safety (Commercial)", effectiveDate: "16 Aug 2025", expiryDate: "16 Aug 2026" },
  { propertyId: "nugent", propertyName: "5 Nugent Terrace", unitId: "nugent-shop", unitLabel: "Shop",   documentName: "EPC (Commercial)",        effectiveDate: null, expiryDate: null, missing: true },

  // 32 Hamilton Gardens — single dwelling, building-and-unit
  { propertyId: "hamilton", propertyName: "32 Hamilton Gardens", unitId: "hamilton-unit", unitLabel: "32 Hamilton Gardens", documentName: "Gas Safety (CP12)", effectiveDate: "02 Feb 2026", expiryDate: "02 Feb 2027" },
  { propertyId: "hamilton", propertyName: "32 Hamilton Gardens", unitId: "hamilton-unit", unitLabel: "32 Hamilton Gardens", documentName: "EPC",               effectiveDate: "29 Jun 2023", expiryDate: "29 Jun 2033" },
  { propertyId: "hamilton", propertyName: "32 Hamilton Gardens", unitId: null,             unitLabel: "Building",            documentName: "EICR",              effectiveDate: "14 Apr 2024", expiryDate: "14 Apr 2029" },
];

/* ---------- Selectors ---------- */

export function occupationalForScope(scope: SummaryScope): OccupationalRow[] {
  if (scope.level === "portfolio") return OCC;
  if (scope.level === "property") return OCC.filter((r) => r.propertyId === scope.propertyId);
  return OCC.filter((r) => r.propertyId === scope.propertyId && r.unitId === scope.unitId);
}

export function complianceForScope(scope: SummaryScope): ComplianceRow[] {
  if (scope.level === "portfolio") return COMP;
  if (scope.level === "property") return COMP.filter((r) => r.propertyId === scope.propertyId);
  return COMP.filter(
    (r) =>
      r.propertyId === scope.propertyId &&
      (r.unitId === scope.unitId || r.unitId === null) // unit view includes building-level docs as context
  );
}

export function occupationalCounts(rows: OccupationalRow[]) {
  const total = rows.length;
  const let_ = rows.filter((r) => r.status === "Let").length;
  const vacant = rows.filter((r) => r.status === "Vacant").length;
  return { total, let: let_, vacant };
}

export function propertyMeta(propertyId: string): SummaryPropertyMeta | undefined {
  return SUMMARY_PROPERTIES.find((p) => p.id === propertyId);
}

export function scopeTitle(scope: SummaryScope, kind: "occupational" | "compliance"): string {
  const noun = kind === "occupational" ? "occupation" : "compliance";
  if (scope.level === "portfolio") {
    const total = SUMMARY_PROPERTIES.reduce((n, p) => n + p.unitsTotal, 0);
    return `Current ${noun} across your portfolio — ${SUMMARY_PROPERTIES.length} properties · ${total} units`;
  }
  const p = propertyMeta(scope.level === "property" ? scope.propertyId : scope.propertyId);
  if (scope.level === "property" && p) {
    return `Current ${noun} across ${p.name} — ${p.unitsTotal} units`;
  }
  const row = OCC.find((r) => r.unitId === (scope as { unitId: string }).unitId);
  return `Current ${noun} — ${row?.unitLabel ?? "unit"}${p ? `, ${p.name}` : ""}`;
}

/* ---------- CSV ---------- */

const csvEscape = (v: unknown): string => {
  if (v === null || v === undefined) return "Not determined";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number | null | undefined>>): void {
  const lines = [headers.map(csvEscape).join(",")];
  for (const r of rows) lines.push(r.map(csvEscape).join(","));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------- Prefilled chat questions ---------- */

export function summaryQuestionFor(kind: "occupational" | "compliance", scope: SummaryScope): string {
  if (kind === "occupational") {
    if (scope.level === "portfolio") return "Summarise current occupation across the portfolio";
    if (scope.level === "property") {
      const p = propertyMeta(scope.propertyId);
      return `Summarise current occupation at ${p?.name ?? "this property"}`;
    }
    const row = OCC.find((r) => r.unitId === scope.unitId);
    return `Summarise current occupation for ${row?.unitLabel ?? "this unit"}`;
  }
  if (scope.level === "portfolio") return "Summarise current & overdue compliance across the portfolio";
  if (scope.level === "property") {
    const p = propertyMeta(scope.propertyId);
    return `Summarise current & overdue compliance at ${p?.name ?? "this property"}`;
  }
  const row = OCC.find((r) => r.unitId === scope.unitId);
  return `Summarise current & overdue compliance for ${row?.unitLabel ?? "this unit"}`;
}

export function summaryIntroFor(kind: "occupational" | "compliance", scope: SummaryScope): string {
  if (kind === "occupational") {
    if (scope.level === "portfolio") {
      const all = occupationalCounts(OCC);
      return `Here is the current occupation across your portfolio — ${SUMMARY_PROPERTIES.length} properties, ${all.total} units: ${all.let} let, ${all.vacant} vacant.`;
    }
    if (scope.level === "property") {
      const rows = occupationalForScope(scope);
      const c = occupationalCounts(rows);
      const p = propertyMeta(scope.propertyId);
      return `Here is the current occupation across ${p?.name ?? "this property"} — ${c.total} units: ${c.let} let, ${c.vacant} vacant.`;
    }
    const row = OCC.find((r) => r.unitId === scope.unitId);
    return `Here is the current occupation for ${row?.unitLabel ?? "this unit"}.`;
  }
  // compliance
  if (scope.level === "portfolio") {
    const missing = COMP.filter((r) => r.missing).length;
    return `Here is current & overdue compliance across your portfolio — ${COMP.length} records on file, ${missing} flagged as not determined.`;
  }
  if (scope.level === "property") {
    const rows = complianceForScope(scope);
    const missing = rows.filter((r) => r.missing).length;
    const p = propertyMeta(scope.propertyId);
    return `Here is current & overdue compliance for ${p?.name ?? "this property"} — ${rows.length} records, ${missing} flagged as not determined.`;
  }
  const rows = complianceForScope(scope);
  const missing = rows.filter((r) => r.missing).length;
  return `Here is current & overdue compliance for this unit — ${rows.length} records, ${missing} flagged as not determined.`;
}
