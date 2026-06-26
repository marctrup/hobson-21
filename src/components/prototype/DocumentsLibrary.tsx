import React, { useEffect, useMemo, useState } from "react";
import characterProfessor from "@/assets/prototype/character-professor.png";

/* ---------------- Types ---------------- */

type Family = "Tenancy" | "Asset";
type DocType =
  | "Lease"
  | "Variation"
  | "Assignment"
  | "Rent Review"
  | "Surrender"
  | "EPC"
  | "FRA"
  | "Valuation"
  | "Gas Safety"
  | "EICR";
type Status = "current" | "superseded";

type DocItem = {
  id: string;
  title: string;
  family: Family;
  type: DocType;
  date: string; // ISO
  status: Status;
  supersededBy?: string; // doc id
  chainId?: string;      // for tenancy chains
  changeType?: "original" | "variation" | "assignment" | "rent_review" | "removal";
  targetsDescription?: string;
  party?: string;
  // location
  propertyId: string;     // logical asset id (property)
  propertyName: string;
  unitId?: string;        // attached at unit if set; else property-level
  unitLabel?: string;
};

type AssetNode = {
  propertyId: string;
  propertyName: string;
  postcode: string;
  standalone?: boolean;
  units: { id: string; label: string }[];
};

/* ---------------- Seed data ---------------- */

const ASSETS: AssetNode[] = [
  {
    propertyId: "stanley",
    propertyName: "Stanley House",
    postcode: "NW11",
    units: [
      { id: "stanley-f6", label: "Flat 6" },
      { id: "stanley-f8", label: "Flat 8" },
      { id: "stanley-shop", label: "Shop" },
    ],
  },
  {
    propertyId: "nugent",
    propertyName: "5 Nugent Terrace",
    postcode: "NW8",
    units: [
      { id: "nugent-f1", label: "Flat 1" },
      { id: "nugent-f3", label: "Flat 3" },
    ],
  },
  {
    propertyId: "hamilton",
    propertyName: "32 Hamilton Gardens",
    postcode: "NW8",
    standalone: true,
    units: [{ id: "hamilton-unit", label: "32 Hamilton Gardens" }],
  },
];

const DOCS: DocItem[] = [
  /* ---- Stanley · Flat 8 — Lease chain (ABC Limited) ---- */
  {
    id: "d-f8-lease-orig",
    title: "Lease — ABC Limited (original)",
    family: "Tenancy",
    type: "Lease",
    date: "2019-03-24",
    status: "superseded",
    supersededBy: "d-f8-lease-current",
    chainId: "chain-f8-abc",
    changeType: "original",
    targetsDescription: "10-year lease, £50,000 pa",
    party: "ABC Limited",
    propertyId: "stanley",
    propertyName: "Stanley House",
    unitId: "stanley-f8",
    unitLabel: "Flat 8",
  },
  {
    id: "d-f8-lease-var",
    title: "Deed of Variation",
    family: "Tenancy",
    type: "Variation",
    date: "2021-03-15",
    status: "superseded",
    supersededBy: "d-f8-lease-current",
    chainId: "chain-f8-abc",
    changeType: "variation",
    targetsDescription: "Varied rent £50,000 → £60,000 pa",
    party: "ABC Limited",
    propertyId: "stanley",
    propertyName: "Stanley House",
    unitId: "stanley-f8",
    unitLabel: "Flat 8",
  },
  {
    id: "d-f8-lease-assign",
    title: "Deed of Assignment",
    family: "Tenancy",
    type: "Assignment",
    date: "2022-06-08",
    status: "current",
    chainId: "chain-f8-abc",
    changeType: "assignment",
    targetsDescription: "Assigned from ABC Ltd → ABC (Holdings) Ltd",
    party: "ABC (Holdings) Limited",
    propertyId: "stanley",
    propertyName: "Stanley House",
    unitId: "stanley-f8",
    unitLabel: "Flat 8",
  },

  /* ---- Stanley · Flat 8 — EPC chain (ACD) ---- */
  {
    id: "d-f8-epc-old",
    title: "EPC — rated E",
    family: "Asset",
    type: "EPC",
    date: "2014-09-02",
    status: "superseded",
    supersededBy: "d-f8-epc-current",
    propertyId: "stanley",
    propertyName: "Stanley House",
    unitId: "stanley-f8",
    unitLabel: "Flat 8",
  },
  {
    id: "d-f8-epc-current",
    title: "EPC — rated D · valid to 2027",
    family: "Asset",
    type: "EPC",
    date: "2017-04-11",
    status: "current",
    propertyId: "stanley",
    propertyName: "Stanley House",
    unitId: "stanley-f8",
    unitLabel: "Flat 8",
  },

  /* ---- Stanley · property-level FRA ---- */
  {
    id: "d-stanley-fra-old",
    title: "Fire Risk Assessment (2022)",
    family: "Asset",
    type: "FRA",
    date: "2022-05-20",
    status: "superseded",
    supersededBy: "d-stanley-fra-current",
    propertyId: "stanley",
    propertyName: "Stanley House",
  },
  {
    id: "d-stanley-fra-current",
    title: "Fire Risk Assessment — annual",
    family: "Asset",
    type: "FRA",
    date: "2025-06-04",
    status: "current",
    propertyId: "stanley",
    propertyName: "Stanley House",
  },
  {
    id: "d-stanley-val",
    title: "RICS Valuation",
    family: "Asset",
    type: "Valuation",
    date: "2024-11-10",
    status: "current",
    propertyId: "stanley",
    propertyName: "Stanley House",
  },

  /* ---- Stanley · Shop — lease ---- */
  {
    id: "d-shop-lease",
    title: "Lease — Corner Stores Ltd",
    family: "Tenancy",
    type: "Lease",
    date: "2020-01-10",
    status: "current",
    chainId: "chain-shop",
    changeType: "original",
    targetsDescription: "15-year lease, £28,000 pa",
    party: "Corner Stores Ltd",
    propertyId: "stanley",
    propertyName: "Stanley House",
    unitId: "stanley-shop",
    unitLabel: "Shop",
  },

  /* ---- Nugent · Flat 1 ---- */
  {
    id: "d-nug-f1-lease",
    title: "AST — J. Patel",
    family: "Tenancy",
    type: "Lease",
    date: "2024-07-10",
    status: "current",
    chainId: "chain-nug-f1",
    changeType: "original",
    targetsDescription: "12-month AST, £1,850 pcm",
    party: "J. Patel",
    propertyId: "nugent",
    propertyName: "5 Nugent Terrace",
    unitId: "nugent-f1",
    unitLabel: "Flat 1",
  },
  {
    id: "d-nug-f1-gas",
    title: "Gas Safety Certificate",
    family: "Asset",
    type: "Gas Safety",
    date: "2025-02-14",
    status: "current",
    propertyId: "nugent",
    propertyName: "5 Nugent Terrace",
    unitId: "nugent-f1",
    unitLabel: "Flat 1",
  },

  /* ---- Hamilton (standalone) ---- */
  {
    id: "d-ham-lease",
    title: "Lease — Holborn Holdings",
    family: "Tenancy",
    type: "Lease",
    date: "2023-04-01",
    status: "current",
    chainId: "chain-ham",
    changeType: "original",
    targetsDescription: "5-year lease, £42,000 pa",
    party: "Holborn Holdings",
    propertyId: "hamilton",
    propertyName: "32 Hamilton Gardens",
    unitId: "hamilton-unit",
    unitLabel: "32 Hamilton Gardens",
  },
  {
    id: "d-ham-eicr",
    title: "EICR — satisfactory",
    family: "Asset",
    type: "EICR",
    date: "2024-09-12",
    status: "current",
    propertyId: "hamilton",
    propertyName: "32 Hamilton Gardens",
    unitId: "hamilton-unit",
    unitLabel: "32 Hamilton Gardens",
  },
];

/* ---------------- Helpers ---------------- */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const DOC_TYPES: DocType[] = [
  "Lease", "Variation", "Assignment", "Rent Review", "Surrender",
  "EPC", "FRA", "Valuation", "Gas Safety", "EICR",
];

/* ---------------- Status marker ---------------- */

function StatusMarker({ status }: { status: Status }) {
  if (status === "current") {
    return (
      <span
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200"
        aria-label="Current document"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="12" r="10" />
        </svg>
        Current
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-300"
      aria-label="Superseded document"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
        <path d="M4 12h16" />
      </svg>
      Superseded
    </span>
  );
}

function FamilyTag({ family }: { family: Family }) {
  const cls =
    family === "Tenancy"
      ? "bg-violet-50 text-violet-700 border-violet-200"
      : "bg-sky-50 text-sky-700 border-sky-200";
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${cls}`}>
      {family}
    </span>
  );
}

/* ---------------- Row ---------------- */

function DocRow({
  doc,
  onView,
  onDownload,
  dim,
  onJumpToCurrent,
}: {
  doc: DocItem;
  onView: (d: DocItem) => void;
  onDownload: (d: DocItem) => void;
  dim?: boolean;
  onJumpToCurrent?: (id: string) => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 py-2 px-3 rounded-md border ${
        doc.status === "current"
          ? "border-slate-200 bg-white"
          : "border-dashed border-slate-200 bg-slate-50"
      } ${dim ? "opacity-70" : ""}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${doc.status === "current" ? "text-slate-900" : "text-slate-500 line-through decoration-slate-300"}`}>
            {doc.title}
          </span>
          <StatusMarker status={doc.status} />
          <FamilyTag family={doc.family} />
        </div>
        <div className="mt-0.5 text-[11px] text-slate-500 flex flex-wrap gap-x-2">
          <span>{doc.type}</span>
          <span>·</span>
          <span>{fmtDate(doc.date)}</span>
          {doc.targetsDescription && (<><span>·</span><span className="italic">{doc.targetsDescription}</span></>)}
          {doc.status === "superseded" && doc.supersededBy && onJumpToCurrent && (
            <>
              <span>·</span>
              <button
                onClick={() => onJumpToCurrent(doc.supersededBy!)}
                className="text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
              >
                superseded by →
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onView(doc)}
          className="px-2 py-1 text-[11px] font-medium rounded border border-slate-200 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
        >
          View
        </button>
        <button
          onClick={() => onDownload(doc)}
          className="px-2 py-1 text-[11px] font-medium rounded border border-slate-200 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
        >
          Download
        </button>
      </div>
    </div>
  );
}

/* ---------------- Tenancy Chain ---------------- */

function TenancyChain({
  docs,
  onView,
  onDownload,
  includeSuperseded,
}: {
  docs: DocItem[];
  onView: (d: DocItem) => void;
  onDownload: (d: DocItem) => void;
  includeSuperseded: boolean;
}) {
  const [open, setOpen] = useState(false);
  const sorted = [...docs].sort((a, b) => a.date.localeCompare(b.date));
  const current = sorted.find((d) => d.status === "current") || sorted[sorted.length - 1];
  const olderCount = sorted.length - 1;

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               className={`text-slate-400 transition-transform ${open ? "rotate-90" : ""}`} aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
          <span className="text-sm font-semibold text-slate-900 truncate">
            {current.type} — {current.party}
          </span>
          <StatusMarker status="current" />
          <FamilyTag family="Tenancy" />
        </div>
        <span className="text-[11px] text-slate-500 shrink-0">
          {olderCount > 0 ? `${olderCount} earlier ${olderCount === 1 ? "entry" : "entries"}` : "single entry"}
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1">
          <ol className="relative border-l border-slate-200 ml-2 space-y-2 pl-4">
            {sorted.map((d) => {
              if (!includeSuperseded && d.status === "superseded") return null;
              return (
                <li key={d.id} className="relative">
                  <span className={`absolute -left-[21px] top-3 w-2.5 h-2.5 rounded-full border-2 ${
                    d.status === "current" ? "bg-emerald-500 border-emerald-600" : "bg-white border-slate-400"
                  }`} aria-hidden />
                  <DocRow
                    doc={d}
                    onView={onView}
                    onDownload={onDownload}
                    dim={d.status === "superseded"}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

/* ---------------- ACD Group (by type) ---------------- */

function AcdGroup({
  type,
  docs,
  onView,
  onDownload,
  includeSuperseded,
}: {
  type: DocType;
  docs: DocItem[];
  onView: (d: DocItem) => void;
  onDownload: (d: DocItem) => void;
  includeSuperseded: boolean;
}) {
  const [openPrev, setOpenPrev] = useState(false);
  const sorted = [...docs].sort((a, b) => b.date.localeCompare(a.date));
  const current = sorted.find((d) => d.status === "current") || sorted[0];
  const previous = sorted.filter((d) => d.id !== current.id);

  return (
    <div className="space-y-2">
      <DocRow doc={current} onView={onView} onDownload={onDownload} />
      {previous.length > 0 && includeSuperseded && (
        <div className="pl-3">
          <button
            onClick={() => setOpenPrev((o) => !o)}
            className="text-[11px] text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
            aria-expanded={openPrev}
          >
            {openPrev ? "▾" : "▸"} previous versions ({previous.length})
          </button>
          {openPrev && (
            <div className="mt-1 space-y-1">
              {previous.map((d) => (
                <DocRow key={d.id} doc={d} onView={onView} onDownload={onDownload} dim />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Asset section ---------------- */

function AssetSection({
  title,
  level,
  docs,
  onView,
  onDownload,
  includeSuperseded,
  defaultOpen,
}: {
  title: string;
  level: "property" | "unit";
  docs: DocItem[];
  onView: (d: DocItem) => void;
  onDownload: (d: DocItem) => void;
  includeSuperseded: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const tenancy = docs.filter((d) => d.family === "Tenancy");
  const asset = docs.filter((d) => d.family === "Asset");

  const chains = useMemo(() => {
    const map = new Map<string, DocItem[]>();
    tenancy.forEach((d) => {
      const k = d.chainId || d.id;
      const arr = map.get(k) || [];
      arr.push(d);
      map.set(k, arr);
    });
    return Array.from(map.values());
  }, [tenancy]);

  const acdByType = useMemo(() => {
    const map = new Map<DocType, DocItem[]>();
    asset.forEach((d) => {
      const arr = map.get(d.type) || [];
      arr.push(d);
      map.set(d.type, arr);
    });
    return Array.from(map.entries());
  }, [asset]);

  if (docs.length === 0 && level === "unit") return null;

  const Tag = level === "property" ? "h3" : "h4";

  return (
    <div className={level === "property" ? "" : "ml-4"}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 py-1.5 ${
          level === "property" ? "text-[13px] font-semibold text-slate-900" : "text-[12px] font-medium text-slate-700"
        } hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded`}
        aria-expanded={open}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             className={`transition-transform ${open ? "rotate-90" : ""}`} aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
        <Tag className="m-0">{title}</Tag>
        <span className="text-[11px] font-normal text-slate-500">· {docs.length} {docs.length === 1 ? "document" : "documents"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-4 pl-5 border-l border-slate-100">

          {chains.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Tenancy documents</div>
              {chains.map((c) => (
                <TenancyChain
                  key={c[0].chainId || c[0].id}
                  docs={c}
                  onView={onView}
                  onDownload={onDownload}
                  includeSuperseded={includeSuperseded}
                />
              ))}
            </div>
          )}
          {acdByType.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Asset & compliance</div>
              {acdByType.map(([type, ds]) => (
                <AcdGroup
                  key={type}
                  type={type}
                  docs={ds}
                  onView={onView}
                  onDownload={onDownload}
                  includeSuperseded={includeSuperseded}
                />
              ))}
            </div>
          )}
          {chains.length === 0 && acdByType.length === 0 && (
            <div className="text-[11px] text-slate-400 italic">No documents at this level.</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Viewer dialog (placeholder) ---------------- */

function DocViewer({ doc, onClose }: { doc: DocItem; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${doc.title}`}
      className="fixed inset-0 z-[600] bg-slate-900/50 grid place-items-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 truncate">{doc.title}</span>
              <StatusMarker status={doc.status} />
              <FamilyTag family={doc.family} />
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {doc.propertyName}{doc.unitLabel ? ` · ${doc.unitLabel}` : ""} · {fmtDate(doc.date)}
            </div>
          </div>
          <button
            onClick={onClose}
            autoFocus
            className="p-1.5 text-slate-400 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
            aria-label="Close preview"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 grid place-items-center bg-slate-50 p-10 overflow-auto">
          <div className="text-center max-w-md">
            <div className="w-16 h-20 mx-auto rounded-md bg-white border border-slate-200 shadow-sm grid place-items-center mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.6" aria-hidden>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
            <p className="text-sm text-slate-600">
              Document preview — prototype placeholder. In the live product this opens the actual file inline.
            </p>
            {doc.targetsDescription && (
              <p className="text-[12px] text-slate-500 mt-2 italic">{doc.targetsDescription}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main library ---------------- */

export type DocumentsScope = {
  propertyId?: string;
  unitId?: string;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function DocumentsLibrary({
  onClose,
  initialScope,
  onNavigatePortfolio,
  onNavigateProperty,
}: {
  onClose: () => void;
  initialScope?: DocumentsScope;
  onNavigatePortfolio?: () => void;
  onNavigateProperty?: (propertyId: string) => void;
}) {
  const [mode, setMode] = useState<"tree" | "all">("tree");
  const [q, setQ] = useState("");
  const [family, setFamily] = useState<"all" | Family>("all");
  const [type, setType] = useState<"all" | DocType>("all");
  const [includeSuperseded, setIncludeSuperseded] = useState(false);
  const [scopeProperty, setScopeProperty] = useState<string | null>(initialScope?.propertyId ?? null);
  const [scopeUnit, setScopeUnit] = useState<string | null>(initialScope?.unitId ?? null);
  const [viewing, setViewing] = useState<DocItem | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  // resolved scope labels
  const scopePropertyAsset = useMemo(
    () => (scopeProperty ? ASSETS.find((a) => a.propertyId === scopeProperty) : null),
    [scopeProperty]
  );
  const scopeUnitNode = useMemo(() => {
    if (!scopePropertyAsset || !scopeUnit) return null;
    return scopePropertyAsset.units.find((u) => u.id === scopeUnit) || null;
  }, [scopePropertyAsset, scopeUnit]);

  // streamed owl greeting (scope-aware)
  const greeting = useMemo(() => {
    if (scopePropertyAsset && scopeUnitNode) {
      const unitLbl =
        scopePropertyAsset.standalone
          ? scopePropertyAsset.propertyName
          : `${scopeUnitNode.label}, ${scopePropertyAsset.propertyName}`;
      return `Here are the documents for ${unitLbl}. Browse, view or download whatever you need.`;
    }
    if (scopePropertyAsset) {
      return `Here are the documents for ${scopePropertyAsset.propertyName}. Feel free to browse, view or download.`;
    }
    return "Here are your documents — browse, view or download anything across the estate.";
  }, [scopePropertyAsset, scopeUnitNode]);

  const reduced = prefersReducedMotion();
  const [typed, setTyped] = useState(reduced ? greeting : "");
  const [greetingDone, setGreetingDone] = useState(reduced);
  useEffect(() => {
    if (reduced) {
      setTyped(greeting);
      setGreetingDone(true);
      return;
    }
    setTyped("");
    setGreetingDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setTyped(greeting.slice(0, i));
      if (i >= greeting.length) {
        window.clearInterval(id);
        setGreetingDone(true);
      }
    }, 18);
    return () => window.clearInterval(id);
  }, [greeting, reduced]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return DOCS.filter((d) => {
      if (family !== "all" && d.family !== family) return false;
      if (type !== "all" && d.type !== type) return false;
      if (scopeProperty && d.propertyId !== scopeProperty) return false;
      if (scopeUnit && d.unitId !== scopeUnit) return false;
      if (!includeSuperseded && mode === "all" && d.status === "superseded") return false;
      if (needle) {
        const hay = [
          d.title, d.type, d.party, d.propertyName, d.unitLabel,
          d.targetsDescription, fmtDate(d.date),
        ].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, family, type, scopeProperty, scopeUnit, includeSuperseded, mode]);

  const chainsCount = useMemo(
    () => new Set(DOCS.filter((d) => d.family === "Tenancy").map((d) => d.chainId || d.id)).size,
    []
  );
  const assetCount = useMemo(() => DOCS.filter((d) => d.family === "Asset").length, []);

  const onView = (d: DocItem) => setViewing(d);
  const onDownload = (d: DocItem) => {
    setFlash(`Downloading "${d.title}"… (prototype placeholder)`);
    window.setTimeout(() => setFlash(null), 2500);
  };

  const clearScope = () => { setScopeProperty(null); setScopeUnit(null); };
  const clearUnitScope = () => setScopeUnit(null);

  return (
    <div className="absolute inset-0 z-[450] bg-white flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-4 border-b border-slate-200 flex items-start gap-4">
        <img src={owlReading} alt="" aria-hidden className="w-10 h-10 object-contain shrink-0" />
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-[11px] text-slate-500 mb-1 flex items-center gap-1 flex-wrap">
            <button
              onClick={() => { onNavigatePortfolio?.(); }}
              className="hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
            >
              Portfolio
            </button>
            {scopePropertyAsset && (
              <>
                <span aria-hidden>›</span>
                <button
                  onClick={() => { onNavigateProperty?.(scopePropertyAsset.propertyId); }}
                  className="hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
                >
                  {scopePropertyAsset.propertyName}
                </button>
              </>
            )}
            {scopePropertyAsset && scopeUnitNode && !scopePropertyAsset.standalone && (
              <>
                <span aria-hidden>›</span>
                <span>{scopeUnitNode.label}</span>
              </>
            )}
            <span aria-hidden>›</span>
            <span className="text-slate-700 font-medium">Documents</span>
          </nav>

          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base font-semibold text-slate-900">Documents</h2>
            <span className="text-[12px] text-slate-500">
              {filtered.length} of {DOCS.length} documents · {chainsCount} tenancy chains · {assetCount} asset records
            </span>
          </div>
          <p
            className="text-[12px] text-slate-600 mt-1 min-h-[1.25rem]"
            aria-live="polite"
          >
            {typed}
            {!greetingDone && <span className="inline-block w-1 h-3 ml-0.5 bg-slate-400 align-middle animate-pulse" aria-hidden />}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
          aria-label="Close documents"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      {/* Scope chips */}
      {(scopePropertyAsset || scopeUnitNode) && (
        <div className="px-6 py-2 border-b border-slate-100 flex flex-wrap items-center gap-2 bg-[#FAF8FF]">
          <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">Scope</span>
          {scopePropertyAsset && (
            <button
              onClick={clearScope}
              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-white border border-[#7C3AED]/30 text-[12px] text-[#5B21B6] font-medium hover:bg-[#EDE9FE] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              aria-label={`Remove ${scopePropertyAsset.propertyName} scope`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              {scopePropertyAsset.standalone && scopeUnitNode
                ? scopePropertyAsset.propertyName
                : scopePropertyAsset.propertyName}
              {scopeUnitNode && !scopePropertyAsset.standalone && (
                <span className="text-slate-500">› {scopeUnitNode.label}</span>
              )}
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#7C3AED] hover:text-white" aria-hidden>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </span>
            </button>
          )}
          {scopePropertyAsset && scopeUnitNode && !scopePropertyAsset.standalone && (
            <button
              onClick={clearUnitScope}
              className="text-[11px] text-slate-500 hover:text-[#5B21B6] underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
            >
              widen to whole property
            </button>
          )}
          <span className="text-[11px] text-slate-500 ml-1">
            (remove to see the whole portfolio)
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-[#7C3AED]/30">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, type, tenant, date…"
            className="text-sm bg-transparent outline-none w-64 placeholder:text-slate-400"
            aria-label="Search documents"
          />
        </div>

        <SegBar
          label="Family"
          value={family}
          options={[{ v: "all", l: "All" }, { v: "Tenancy", l: "Tenancy" }, { v: "Asset", l: "Asset" }]}
          onChange={(v) => setFamily(v as any)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="text-[12px] px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          {DOC_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>

        <select
          value={scopeProperty ?? "all"}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "all") { setScopeProperty(null); setScopeUnit(null); }
            else { setScopeProperty(v); setScopeUnit(null); }
          }}
          className="text-[12px] px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          aria-label="Filter by property"
        >
          <option value="all">All properties</option>
          {ASSETS.map((a) => (<option key={a.propertyId} value={a.propertyId}>{a.propertyName}</option>))}
        </select>

        {scopePropertyAsset && !scopePropertyAsset.standalone && (
          <select
            value={scopeUnit ?? "all"}
            onChange={(e) => setScopeUnit(e.target.value === "all" ? null : e.target.value)}
            className="text-[12px] px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            aria-label="Filter by unit"
          >
            <option value="all">All units</option>
            {scopePropertyAsset.units.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        )}

        <label className="text-[12px] text-slate-700 flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-slate-50">
          <input
            type="checkbox"
            checked={includeSuperseded}
            onChange={(e) => setIncludeSuperseded(e.target.checked)}
            className="accent-[#7C3AED]"
          />
          Include superseded
        </label>

        <div className="ml-auto inline-flex rounded-md border border-slate-200 overflow-hidden">
          <button
            onClick={() => setMode("tree")}
            className={`px-3 py-1.5 text-[12px] font-medium ${mode === "tree" ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-50"} focus:outline-none focus:ring-2 focus:ring-[#7C3AED]`}
            aria-pressed={mode === "tree"}
          >
            By asset
          </button>
          <button
            onClick={() => setMode("all")}
            className={`px-3 py-1.5 text-[12px] font-medium border-l border-slate-200 ${mode === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-50"} focus:outline-none focus:ring-2 focus:ring-[#7C3AED]`}
            aria-pressed={mode === "all"}
          >
            All documents
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {mode === "tree" ? (
          <TreeView
            assets={ASSETS}
            docs={filtered}
            includeSuperseded={includeSuperseded}
            onView={onView}
            onDownload={onDownload}
            searchActive={q.trim().length > 0 || family !== "all" || type !== "all" || !!scopeProperty || !!scopeUnit}
          />
        ) : (
          <FlatList
            docs={filtered}
            onView={onView}
            onDownload={onDownload}
            onJumpToCurrent={(id) => {
              const d = DOCS.find((x) => x.id === id);
              if (d) setViewing(d);
            }}
          />
        )}
      </div>

      {viewing && <DocViewer doc={viewing} onClose={() => setViewing(null)} />}

      {flash && (
        <div
          role="status"
          aria-live="polite"
          className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg"
        >
          {flash}
        </div>
      )}
    </div>
  );
}

function SegBar<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T;
  options: { v: T; l: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white p-0.5" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          aria-pressed={value === o.v}
          className={`px-2.5 py-1 text-[12px] rounded ${
            value === o.v ? "bg-[#EDE9FE] text-[#5B21B6] font-medium" : "text-slate-600 hover:bg-slate-50"
          } focus:outline-none focus:ring-2 focus:ring-[#7C3AED]`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

function TreeView({
  assets, docs, includeSuperseded, onView, onDownload, searchActive,
}: {
  assets: AssetNode[];
  docs: DocItem[];
  includeSuperseded: boolean;
  onView: (d: DocItem) => void;
  onDownload: (d: DocItem) => void;
  searchActive: boolean;
}) {
  return (
    <div className="space-y-4 max-w-3xl">
      {assets.map((a) => {
        const propertyDocs = docs.filter((d) => d.propertyId === a.propertyId && !d.unitId);
        const unitsWithDocs = a.units.map((u) => ({
          unit: u,
          docs: docs.filter((d) => d.propertyId === a.propertyId && d.unitId === u.id),
        }));
        const totalForAsset = propertyDocs.length + unitsWithDocs.reduce((n, x) => n + x.docs.length, 0);
        if (totalForAsset === 0) return null;

        if (a.standalone) {
          // Render as a top-level unit
          const u = unitsWithDocs[0];
          return (
            <AssetSection
              key={a.propertyId}
              title={`${a.propertyName} · ${a.postcode}`}
              level="property"
              docs={u.docs}
              onView={onView}
              onDownload={onDownload}
              includeSuperseded={includeSuperseded}
              defaultOpen={searchActive}
            />
          );
        }

        return (
          <div key={a.propertyId} className="rounded-lg border border-slate-200 bg-white p-3">
            <AssetSection
              title={`${a.propertyName} · ${a.postcode}`}
              level="property"
              docs={propertyDocs}
              onView={onView}
              onDownload={onDownload}
              includeSuperseded={includeSuperseded}
              defaultOpen={searchActive}
            />
            <div className="mt-2 space-y-1.5">
              {unitsWithDocs.map(({ unit, docs: udocs }) =>
                udocs.length === 0 ? null : (
                  <AssetSection
                    key={unit.id}
                    title={`${unit.label} · ${udocs.length} ${udocs.length === 1 ? "document" : "documents"}`}
                    level="unit"
                    docs={udocs}
                    onView={onView}
                    onDownload={onDownload}
                    includeSuperseded={includeSuperseded}
                    defaultOpen={searchActive}
                  />
                )
              )}
            </div>
          </div>
        );
      })}
      {docs.length === 0 && (
        <div className="text-sm text-slate-500 italic">No documents match your filters.</div>
      )}
    </div>
  );
}

function FlatList({
  docs, onView, onDownload, onJumpToCurrent,
}: {
  docs: DocItem[];
  onView: (d: DocItem) => void;
  onDownload: (d: DocItem) => void;
  onJumpToCurrent: (id: string) => void;
}) {
  const sorted = [...docs].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="space-y-1.5 max-w-3xl">
      {sorted.map((d) => (
        <div key={d.id} className="flex flex-col">
          <div className="text-[11px] text-slate-500 px-1 mb-0.5">
            {d.propertyName}{d.unitLabel ? ` · ${d.unitLabel}` : ""}
          </div>
          <DocRow
            doc={d}
            onView={onView}
            onDownload={onDownload}
            dim={d.status === "superseded"}
            onJumpToCurrent={onJumpToCurrent}
          />
        </div>
      ))}
      {sorted.length === 0 && (
        <div className="text-sm text-slate-500 italic">No documents match your filters.</div>
      )}
    </div>
  );
}

export default DocumentsLibrary;
