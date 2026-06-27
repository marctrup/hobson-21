/**
 * SummaryCard — single component that renders Hobson's Occupational or
 * Compliance summary at Unit, Property or Portfolio scope.
 *
 * Same component, scoped by `scope.level`. Drill-down rows fire onOpenUnit.
 * Missing data shows "Not determined" (muted italic) — gaps read as gaps.
 */
import React, { useMemo } from "react";
import {
  ComplianceRow,
  OccupationalRow,
  SUMMARY_PROPERTIES,
  SummaryScope,
  complianceForScope,
  downloadCsv,
  occupationalCounts,
  occupationalForScope,
  propertyMeta,
  scopeTitle,
} from "./summaryData";

type Kind = "occupational" | "compliance";

type Props = {
  kind: Kind;
  scope: SummaryScope;
  onOpenUnit?: (propertyId: string, unitId: string) => void;
  /** Optional augmenter — Inspector rules transform rows in place. */
  augmentCompliance?: (rows: ComplianceRow[], scope: SummaryScope) => ComplianceRow[];
};

const ND = (
  <span className="italic text-slate-400">Not determined</span>
);

const VacantChip = () => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200">
    Vacant
  </span>
);

const MissingChip = () => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
    No document on file
  </span>
);

const LegallyRequiredChip = () => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-rose-100 text-rose-800 border border-rose-300">
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden><circle cx="12" cy="12" r="10"/><path d="M12 8v5"/><circle cx="12" cy="17" r="0.8" fill="currentColor"/></svg>
    Legally required
  </span>
);

function valOrND(v?: string | null) {
  if (v === null || v === undefined || v === "") return ND;
  return <span className="text-slate-800">{v}</span>;
}

export default function SummaryCard({ kind, scope, onOpenUnit, augmentCompliance }: Props) {
  const title = scopeTitle(scope, kind);
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
            {kind === "occupational" ? "Occupational summary" : "Compliance summary"}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 truncate">{title}</h3>
        </div>
        <ExportButton kind={kind} scope={scope} />
      </header>
      <div className="max-h-[460px] overflow-auto">
        <div className="min-w-[640px]">
          {kind === "occupational"
            ? <OccupationalView scope={scope} onOpenUnit={onOpenUnit} />
            : <ComplianceView scope={scope} onOpenUnit={onOpenUnit} augmentCompliance={augmentCompliance} />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Occupational ---------- */

function OccupationalView({ scope, onOpenUnit }: { scope: SummaryScope; onOpenUnit?: Props["onOpenUnit"] }) {
  const rows = useMemo(() => occupationalForScope(scope), [scope]);

  if (scope.level === "unit") {
    const r = rows[0];
    if (!r) return <Empty label="No occupational record for this unit." />;
    const kv: Array<[string, React.ReactNode]> = [
      ["Tenant Name",      r.status === "Vacant" ? <VacantChip /> : valOrND(r.tenantName)],
      ["Landlord Name",    valOrND(r.landlordName)],
      ["Current Rent",     valOrND(r.currentRent)],
      ["Next Review Date", valOrND(r.nextReviewDate)],
      ["Next Break Date",  valOrND(r.nextBreakDate)],
    ];
    return (
      <dl className="divide-y divide-slate-100">
        {kv.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[180px_1fr] gap-3 px-4 py-2.5 text-sm">
            <dt className="text-slate-500">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    );
  }

  // Property / Portfolio — table
  const counts = occupationalCounts(rows);
  const grouped = scope.level === "portfolio";

  const headers = ["Unit", "Tenant", "Landlord", "Rent", "Next Review", "Next Break"];
  const colWidths = ["16%", "24%", "22%", "14%", "12%", "12%"];

  const renderRow = (r: OccupationalRow) => (
    <tr
      key={`${r.propertyId}/${r.unitId}`}
      tabIndex={0}
      role="button"
      aria-label={`Open ${r.unitLabel}`}
      onClick={() => onOpenUnit?.(r.propertyId, r.unitId)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenUnit?.(r.propertyId, r.unitId);
        }
      }}
      className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-[#F5F3FF] focus:bg-[#EDE9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C3AED]/40"
    >
      <td className="px-3 py-2 align-middle truncate">
        <span className="text-slate-900 font-medium">{r.unitLabel}</span>
        {r.status === "Vacant" && <span className="ml-2"><VacantChip /></span>}
      </td>
      <td className="px-3 py-2 align-middle truncate">{r.status === "Vacant" ? ND : valOrND(r.tenantName)}</td>
      <td className="px-3 py-2 align-middle truncate">{valOrND(r.landlordName)}</td>
      <td className="px-3 py-2 align-middle truncate">{valOrND(r.currentRent)}</td>
      <td className="px-3 py-2 align-middle truncate">{valOrND(r.nextReviewDate)}</td>
      <td className="px-3 py-2 align-middle truncate">{valOrND(r.nextBreakDate)}</td>
    </tr>
  );

  return (
    <table className="w-full text-[12.5px] table-fixed">
      <colgroup>
        {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
      </colgroup>
      <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide">
        <tr>
          {headers.map((h) => (
            <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grouped
          ? SUMMARY_PROPERTIES.map((p) => {
              const prows = rows.filter((r) => r.propertyId === p.id);
              const pc = occupationalCounts(prows);
              return (
                <React.Fragment key={p.id}>
                  <tr className="bg-slate-100/80">
                    <td colSpan={headers.length} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                      {p.name} · {p.area} · {p.unitsTotal} units · {pc.let} let · {pc.vacant} vacant
                    </td>
                  </tr>
                  {prows.map(renderRow)}
                </React.Fragment>
              );
            })
          : rows.map(renderRow)}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={headers.length} className="px-3 py-2 text-[11px] text-slate-500 bg-white border-t border-slate-100">
            {scope.level === "portfolio"
              ? `${SUMMARY_PROPERTIES.length} properties · ${counts.total} units · ${counts.let} let · ${counts.vacant} vacant`
              : `${counts.total} units · ${counts.let} let · ${counts.vacant} vacant`}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

/* ---------- Compliance ---------- */

function ComplianceView({ scope, onOpenUnit, augmentCompliance }: { scope: SummaryScope; onOpenUnit?: Props["onOpenUnit"]; augmentCompliance?: Props["augmentCompliance"] }) {
  const rows = useMemo(() => {
    const base = complianceForScope(scope);
    return augmentCompliance ? augmentCompliance(base, scope) : base;
  }, [scope, augmentCompliance]);

  if (scope.level === "unit") {
    if (rows.length === 0) return <Empty label="No compliance records for this unit." />;
    return (
      <table className="w-full text-[12.5px] table-fixed">
        <colgroup>
          <col style={{ width: "44%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "28%" }} />
        </colgroup>
        <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Document</th>
            <th className="px-3 py-2 text-left font-medium">Effective</th>
            <th className="px-3 py-2 text-left font-medium">Expiry</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => <ComplianceTr key={i} r={r} showUnit={false} unitColumn={false} />)}
        </tbody>
      </table>
    );
  }

  const grouped = scope.level === "portfolio";
  const colWidths = ["22%", "38%", "20%", "20%"];
  const headers = ["Unit / Where", "Document", "Effective", "Expiry"];

  const renderBlock = (propertyId: string) => {
    const p = propertyMeta(propertyId);
    const prows = rows.filter((r) => r.propertyId === propertyId);
    if (prows.length === 0) return null;
    // Preserve order; group by unit but render unit label inline (first row only)
    const byUnit = new Map<string, ComplianceRow[]>();
    prows.forEach((r) => {
      const key = r.unitId ?? "__building__";
      const a = byUnit.get(key) ?? [];
      a.push(r);
      byUnit.set(key, a);
    });
    return (
      <React.Fragment key={propertyId}>
        {grouped && (
          <tr className="bg-slate-100/80">
            <td colSpan={headers.length} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
              {p?.name} · {p?.area} · {p?.unitsTotal} units
            </td>
          </tr>
        )}
        {Array.from(byUnit.entries()).flatMap(([key, urows]) =>
          urows.map((r, i) => (
            <ComplianceTr
              key={`${key}-${i}`}
              r={r}
              showUnit
              unitLabelVisible={i === 0}
              onOpenUnit={onOpenUnit}
            />
          ))
        )}
      </React.Fragment>
    );
  };

  const missing = rows.filter((r) => r.missing).length;

  return (
    <table className="w-full text-[12.5px] table-fixed">
      <colgroup>
        {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
      </colgroup>
      <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide">
        <tr>
          {headers.map((h) => (
            <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grouped
          ? SUMMARY_PROPERTIES.map((p) => renderBlock(p.id))
          : renderBlock((scope as { propertyId: string }).propertyId)}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={headers.length} className="px-3 py-2 text-[11px] text-slate-500 bg-white border-t border-slate-100">
            {rows.length} records {missing > 0 && <>· <span className="text-rose-700 font-medium">{missing} flagged as not determined</span></>}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function ComplianceTr({
  r, showUnit = true, unitLabelVisible = true, unitColumn = true, onOpenUnit,
}: {
  r: ComplianceRow;
  showUnit?: boolean;
  unitLabelVisible?: boolean;
  unitColumn?: boolean;
  onOpenUnit?: Props["onOpenUnit"];
}) {
  const clickable = !!onOpenUnit && r.unitId !== null;
  const onClick = () => {
    if (clickable && r.unitId) onOpenUnit?.(r.propertyId, r.unitId);
  };
  return (
    <tr
      tabIndex={clickable ? 0 : -1}
      onClick={clickable ? onClick : undefined}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`border-b border-slate-100 last:border-b-0 ${clickable ? "cursor-pointer hover:bg-[#F5F3FF] focus:bg-[#EDE9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C3AED]/40" : ""} ${r.missing ? (r.legallyRequired ? "bg-rose-100/40" : "bg-rose-50/30") : ""}`}
    >
      {showUnit && unitColumn && (
        <td className="px-3 py-2 align-middle text-slate-700 truncate">
          {unitLabelVisible ? <span className="font-medium text-slate-800">{r.unitLabel}</span> : <span className="text-slate-300">·</span>}
        </td>
      )}
      <td className="px-3 py-2 align-middle truncate">
        {r.missing
          ? r.legallyRequired
            ? <span className="inline-flex items-center gap-2 min-w-0">
                <span className="text-rose-800 font-medium truncate">{r.documentName ?? "Required document"} — missing</span>
                <LegallyRequiredChip />
              </span>
            : <span className="inline-flex items-center gap-2 min-w-0"><span className="italic text-slate-400 truncate">Not determined</span><MissingChip /></span>
          : valOrND(r.documentName)}
      </td>
      <td className="px-3 py-2 align-middle truncate">{r.missing ? ND : valOrND(r.effectiveDate)}</td>
      <td className="px-3 py-2 align-middle truncate">{r.missing ? ND : valOrND(r.expiryDate)}</td>
    </tr>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="px-4 py-6 text-sm text-slate-500 italic">{label}</div>;
}

/* ---------- CSV export ---------- */

function ExportButton({ kind, scope }: { kind: Kind; scope: SummaryScope }) {
  const onClick = () => {
    const today = new Date().toISOString().slice(0, 10);
    const slug =
      kind +
      "_" +
      (scope.level === "portfolio" ? "portfolio" :
       scope.level === "property" ? scope.propertyId :
       `${scope.propertyId}-${scope.unitId}`);
    const filename = `hobson-${slug}_${today}.csv`;
    if (kind === "occupational") {
      const rows = occupationalForScope(scope);
      downloadCsv(
        filename,
        ["Property", "Unit", "Status", "Tenant Name", "Landlord Name", "Current Rent", "Next Review Date", "Next Break Date"],
        rows.map((r) => [r.propertyName, r.unitLabel, r.status, r.tenantName ?? null, r.landlordName ?? null, r.currentRent ?? null, r.nextReviewDate ?? null, r.nextBreakDate ?? null]),
      );
    } else {
      const rows = complianceForScope(scope);
      downloadCsv(
        filename,
        ["Property", "Where", "Document Name", "Effective Date", "Expiry Date"],
        rows.map((r) => [r.propertyName, r.unitLabel, r.missing ? null : (r.documentName ?? null), r.effectiveDate ?? null, r.expiryDate ?? null]),
      );
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[12px] text-[#7C3AED] hover:underline inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 rounded px-1"
    >
      ↓ Export CSV
    </button>
  );
}

/* ---------- Quick-overview chips (invocation row) ---------- */

import { Users, ShieldCheck } from "lucide-react";

function scopeHint(scope: SummaryScope): string {
  if (scope.level === "portfolio") return "whole portfolio";
  if (scope.level === "property") return propertyMeta(scope.propertyId)?.name ?? "this property";
  return "this unit";
}

export function SummaryActions({
  scope,
  onRequest,
  enabledKinds,
}: {
  scope: SummaryScope;
  onRequest: (kind: Kind, scope: SummaryScope) => void;
  /** Which summary buttons are visible. Defaults to both. */
  enabledKinds?: { occupational?: boolean; compliance?: boolean };
}) {
  const showOcc = enabledKinds?.occupational !== false;
  const showCom = enabledKinds?.compliance !== false;
  if (!showOcc && !showCom) return null;
  const hint = scopeHint(scope);

  return (
    <section
      aria-label="Quick overviews from Hobson"
      className="bg-white/70 border border-slate-200 rounded-xl p-3 space-y-2"
    >
      <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
        Quick overviews
      </div>
      <div className="flex flex-wrap gap-2">
        {showOcc && (
          <OverviewChip
            icon={<Users className="w-3.5 h-3.5" aria-hidden />}
            name="Occupational summary"
            hint={hint}
            onClick={() => onRequest("occupational", scope)}
          />
        )}
        {showCom && (
          <OverviewChip
            icon={<ShieldCheck className="w-3.5 h-3.5" aria-hidden />}
            name="Compliance summary"
            hint={hint}
            onClick={() => onRequest("compliance", scope)}
          />
        )}
      </div>
      {(!showOcc || !showCom) && (
        <p className="text-[11px] text-slate-500 italic">
          {!showOcc && "Occupational summary "}
          {!showOcc && !showCom && " and "}
          {!showCom && "Compliance summary "}
          can be enabled by your administrator.
        </p>
      )}
    </section>
  );
}

function OverviewChip({
  icon, name, hint, onClick,
}: { icon: React.ReactNode; name: string; hint: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border border-[#C4B5FD] bg-[#F5F3FF] text-[#5B21B6] hover:bg-[#EDE9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40"
    >
      <span className="text-[#7C3AED]">{icon}</span>
      <span>{name}</span>
      <span className="text-slate-500 font-normal">· {hint}</span>
    </button>
  );
}

