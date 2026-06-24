import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import owlTalking from "@/assets/prototype/owl-talking.png";
import owlDefault from "@/assets/prototype/owl-default.png";
import owlReading from "@/assets/prototype/owl-reading.png";
import owlCovering from "@/assets/prototype/owl-covering.png";
import { DocumentsLibrary } from "@/components/prototype/DocumentsLibrary";

/* ---------------- Config ---------------- */

const FIRST_NAME = "Alex"; // easily-editable

const OWLS = {
  talking: owlTalking,
  default: owlDefault,
  reading: owlReading,
  covering: owlCovering,
} as const;
type OwlState = keyof typeof OWLS;

/* ---------------- Data ---------------- */

type ConfirmedEnding = "none" | "end_tenancy" | "replacement_chain" | "reversionary_started";
type ChainSignal = "notice_to_vacate" | "surrender_notice" | "break_notice";

type Unit = {
  id: string;
  label: string;
  status: "Let" | "Vacant"; // Let = occupied; Vacant = confirmed ended (re-lettable)
  termEndDate?: string;     // ISO date of current term end (optional)
  confirmedEnding?: ConfirmedEnding; // proof a tenancy has ended
  nextBreak?: string;       // ISO date
  nextReview?: string;      // ISO date
  chainSignals?: ChainSignal[];
  tenant?: string;
  rent?: string;
  leaseTo?: string;
  break?: string;
  review?: string;
  epc?: string;
  vacantSince?: string;
  lastTenant?: string;
  lastRent?: string;
};

type Confidence = "confirmed" | "inferred";

type PanelItem = {
  key: string;
  label: string;
  value?: string;
  confidence: Confidence;
  note?: string;
};

type UnitDerived = {
  items: PanelItem[];
  hasAlert: boolean;
  isVacantConfirmed: boolean;
  isEndingInferred: boolean;
  hasUpcomingBreakOrReview: boolean;
};

const TODAY = new Date("2026-06-24T00:00:00Z");

function formatUkDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function isFuture(iso?: string): boolean {
  if (!iso) return false;
  return new Date(iso + "T00:00:00Z").getTime() > TODAY.getTime();
}
function isPast(iso?: string): boolean {
  if (!iso) return false;
  return new Date(iso + "T00:00:00Z").getTime() < TODAY.getTime();
}

const CHAIN_SIGNAL_LABEL: Record<ChainSignal, string> = {
  notice_to_vacate: "notice to vacate in chain",
  surrender_notice: "surrender notice in chain",
  break_notice: "break notice in chain",
};

function deriveUnit(u: Unit): UnitDerived {
  const items: PanelItem[] = [];
  const confirmedEnding = u.confirmedEnding && u.confirmedEnding !== "none";
  const isVacantConfirmed = u.status === "Vacant" || !!confirmedEnding;
  const termPassed = isPast(u.termEndDate);
  const chain = u.chainSignals ?? [];

  if (isVacantConfirmed) {
    items.push({
      key: "vacant",
      label: "Vacant",
      confidence: "confirmed",
      note: "tenancy confirmed ended — available to let",
    });
  } else {
    // Inferred endings (term passed OR a chain notice exists, with no confirmed ending)
    if (termPassed) {
      items.push({
        key: "ending-term",
        label: "Tenancy ending",
        value: `term ended ${formatUkDate(u.termEndDate)}`,
        confidence: "inferred",
        note: "not confirmed vacated — rent may still be due. Needs checking.",
      });
    } else if (chain.length > 0) {
      items.push({
        key: "ending-chain",
        label: "Tenancy ending",
        value: CHAIN_SIGNAL_LABEL[chain[0]],
        confidence: "inferred",
        note: "signal only — not a confirmed ending. Rent may still be due. Needs checking.",
      });
    }

    // Breaks and reviews are historical once term has passed
    if (!termPassed) {
      if (isFuture(u.nextBreak)) {
        items.push({
          key: "break",
          label: "Next break",
          value: formatUkDate(u.nextBreak) ?? "",
          confidence: "confirmed",
        });
      }
      if (isFuture(u.nextReview)) {
        items.push({
          key: "review",
          label: "Next review",
          value: formatUkDate(u.nextReview) ?? "",
          confidence: "confirmed",
        });
      }
    }
  }

  const isEndingInferred = items.some((i) => i.key === "ending-term" || i.key === "ending-chain");
  const hasUpcomingBreakOrReview = items.some((i) => i.key === "break" || i.key === "review");

  return {
    items,
    hasAlert: items.length > 0,
    isVacantConfirmed,
    isEndingInferred,
    hasUpcomingBreakOrReview,
  };
}

type Property = {
  id: string;
  name: string;
  area: string;        // short label (e.g. "NW11") used in compact subtitles
  address: string;     // full address line for hover / greeting
  postcode: string;
  lat: number;
  lng: number;
  units: Unit[];
  standalone?: boolean; // true = no Property layer; opens straight to its single unit
};

const PROPERTIES: Property[] = [
  {
    id: "stanley",
    name: "Stanley House",
    area: "1115 Finchley Road, NW11",
    address: "Stanley House — 1115 Finchley Road, London NW11",
    postcode: "NW11",
    lat: 51.583,
    lng: -0.197,
    units: [
      { id: "stanley-f1",  label: "Flat 1",  status: "Let", termEndDate: "2027-03-24" },
      { id: "stanley-f2",  label: "Flat 2",  status: "Let", termEndDate: "2026-09-15" },
      { id: "stanley-f3",  label: "Flat 3",  status: "Let", termEndDate: "2026-03-24", confirmedEnding: "none" },
      { id: "stanley-f4",  label: "Flat 4",  status: "Let", termEndDate: "2028-01-10" },
      { id: "stanley-f5",  label: "Flat 5",  status: "Let", termEndDate: "2026-08-30" },
      { id: "stanley-f6",  label: "Flat 6",  status: "Let", termEndDate: "2027-11-02", nextBreak: "2027-05-02", nextReview: "2027-03-01" },
      { id: "stanley-f7",  label: "Flat 7",  status: "Let", termEndDate: "2025-12-01", confirmedEnding: "none" },
      { id: "stanley-f8",  label: "Flat 8",  status: "Vacant", confirmedEnding: "end_tenancy" },
      { id: "stanley-f9",  label: "Flat 9",  status: "Let", termEndDate: "2027-05-20" },
      { id: "stanley-f10", label: "Flat 10", status: "Let", termEndDate: "2028-04-04", chainSignals: ["notice_to_vacate"] },
      { id: "stanley-f11", label: "Flat 11", status: "Let", termEndDate: "2027-02-18" },
      { id: "stanley-shop", label: "Shop",   status: "Vacant", confirmedEnding: "end_tenancy" },
    ],
  },
  {
    id: "nugent",
    name: "5 Nugent Terrace",
    area: "NW8",
    address: "5 Nugent Terrace, London NW8",
    postcode: "NW8",
    lat: 51.5325,
    lng: -0.1787,
    units: [
      { id: "nugent-f1",   label: "Flat 1", status: "Let", termEndDate: "2027-07-10" },
      { id: "nugent-f2",   label: "Flat 2", status: "Let", termEndDate: "2026-05-30", confirmedEnding: "none" },
      { id: "nugent-f3",   label: "Flat 3", status: "Vacant", confirmedEnding: "end_tenancy" },
      { id: "nugent-shop", label: "Shop",   status: "Let", termEndDate: "2026-08-20" },
    ],
  },
  {
    id: "hamilton",
    name: "32 Hamilton Gardens",
    area: "NW8",
    address: "32 Hamilton Gardens, London NW8",
    postcode: "NW8",
    lat: 51.5298,
    lng: -0.1758,
    standalone: true,
    units: [
      { id: "hamilton-unit", label: "32 Hamilton Gardens", status: "Let" },
    ],
  },
];

/* ---------- Proactive Action cards (portfolio briefing) ---------- */

type Urgency = "now" | "week" | "watch";
type TriggerType = "review" | "break" | "compliance" | "notice" | "expiry";
type ApprovalState = "pending" | "in_progress" | "approved" | "deferred" | "dismissed";
type AnchorLevel = "unit" | "property";

type ActionCard = {
  id: string;
  propertyId: string;
  unitId?: string;               // present for unit-anchored cards
  unitLabel?: string;            // present for unit-anchored cards
  propertyName: string;
  anchorLevel: AnchorLevel;      // where the action lives / who owns it
  relevantUnitIds?: string[];    // for property-anchored: affected units (omitted = all units)
  triggerType: TriggerType;
  title: string;
  whyItMatters: string;          // confirmed/inferred prose, plain language
  confidence: Confidence;
  hobsonPrepared: string;        // what's already drafted
  proposedAction: string;        // primary button label for confirmed items
  urgency: Urgency;
  approvalState: ApprovalState;
  preparedDetail: string;        // what Hobson will do, on approve-expand
};

const INITIAL_ACTION_CARDS: ActionCard[] = [
  {
    id: "act-stanley-fra",
    propertyId: "stanley",
    propertyName: "Stanley House",
    anchorLevel: "property",
    // omitted relevantUnitIds = applies to every unit in the building
    triggerType: "compliance",
    title: "Fire alarm certification expiring — Stanley House",
    whyItMatters: "Annual fire alarm certificate for the building expires 12 July 2026 (confirmed from last year's certificate). Covers the whole property — every occupied unit needs access notice for the engineer's visit.",
    confidence: "confirmed",
    hobsonPrepared: "I've drafted one instruction to your usual fire alarm engineer, plus access notices for every current tenant — one per occupied unit.",
    proposedAction: "Review & approve",
    urgency: "now",
    approvalState: "in_progress",
    preparedDetail:
      "I'll email the engineer with building access notes, send each current tenant their access notice naming their unit, copy you on everything, and add the renewed certificate to the compliance calendar.",
  },
  {
    id: "act-stanley-f8-review",
    propertyId: "stanley",
    unitId: "stanley-f8",
    unitLabel: "Flat 8",
    propertyName: "Stanley House",
    anchorLevel: "unit",
    triggerType: "review",
    title: "Rent review due — Flat 8, Stanley House",
    whyItMatters: "Review date confirmed for March 2027 in the lease.",
    confidence: "confirmed",
    hobsonPrepared: "I've reviewed the lease and drafted the review summary, with comparable evidence pulled from the last 12 months.",
    proposedAction: "Review & approve",
    urgency: "now",
    approvalState: "pending",
    preparedDetail:
      "I'll send the review notice to the tenant's registered address using your standard cover letter, attach the drafted summary and comparables, and log the served-on date in the unit record.",
  },
  {
    id: "act-stanley-f3-holdover",
    propertyId: "stanley",
    unitId: "stanley-f3",
    unitLabel: "Flat 3",
    propertyName: "Stanley House",
    anchorLevel: "unit",
    triggerType: "expiry",
    title: "Term ended — Flat 3, Stanley House",
    whyItMatters:
      "Term ended 24 March 2026 and I can't see a confirmed vacation or renewal — so I'm treating this as still let. Rent may still be due. Worth checking.",
    confidence: "inferred",
    hobsonPrepared: "I haven't acted on this — only flagged it. I won't assume the tenancy has ended without evidence.",
    proposedAction: "Open unit to check",
    urgency: "week",
    approvalState: "pending",
    preparedDetail: "",
  },
  {
    id: "act-nugent-f2-holdover",
    propertyId: "nugent",
    unitId: "nugent-f2",
    unitLabel: "Flat 2",
    propertyName: "5 Nugent Terrace",
    anchorLevel: "unit",
    triggerType: "expiry",
    title: "Term ended — Flat 2, 5 Nugent Terrace",
    whyItMatters:
      "Term ended 30 May 2026, no confirmed ending on file. Rent may still be due — worth a human eye.",
    confidence: "inferred",
    hobsonPrepared: "I haven't acted on this — flagged only.",
    proposedAction: "Open unit to check",
    urgency: "watch",
    approvalState: "pending",
    preparedDetail: "",
  },
  {
    id: "act-stanley-f7-holdover",
    propertyId: "stanley",
    unitId: "stanley-f7",
    unitLabel: "Flat 7",
    propertyName: "Stanley House",
    anchorLevel: "unit",
    triggerType: "expiry",
    title: "Term ended — Flat 7, Stanley House",
    whyItMatters:
      "Term ended 1 December 2025, nothing confirmed since. Treating as still let until checked.",
    confidence: "inferred",
    hobsonPrepared: "Flagged only — no action taken.",
    proposedAction: "Open unit to check",
    urgency: "watch",
    approvalState: "pending",
    preparedDetail: "",
  },
];

/** Selects the action cards relevant at a given vantage point. Same objects — no duplication. */
function selectActionsForScope(
  cards: ActionCard[],
  scope: { level: "portfolio" } | { level: "property"; propertyId: string } | { level: "unit"; propertyId: string; unitId: string }
): ActionCard[] {
  if (scope.level === "portfolio") return cards;
  if (scope.level === "property") return cards.filter((c) => c.propertyId === scope.propertyId);
  // unit: this unit's own actions + property-anchored actions relevant to it
  return cards.filter((c) => {
    if (c.propertyId !== scope.propertyId) return false;
    if (c.anchorLevel === "unit") return c.unitId === scope.unitId;
    // property-anchored: relevant if relevantUnitIds omitted OR includes this unit
    return !c.relevantUnitIds || c.relevantUnitIds.includes(scope.unitId);
  });
}

/** Vantage-appropriate location label (e.g. "Flat 8" at property; "Property-wide" for property-anchored). */
function locationLabelForCard(card: ActionCard, level: "portfolio" | "property" | "unit"): string {
  if (card.anchorLevel === "property") return "Property-wide";
  // unit-anchored
  if (level === "portfolio") return `${card.unitLabel} · ${card.propertyName}`;
  if (level === "property") return card.unitLabel ?? "Unit";
  return card.unitLabel ?? "This unit";
}



/* ---------------- Onboarding script ---------------- */

type Beat = {
  owl: OwlState;
  lines: string[];
  chip: string;
  mapAction:
    | "none"
    | "pulse-one"
    | "pulse-one-doc"
    | "pulse-all"
    | "spread"
    | "check-one";
};

const BEATS: Beat[] = [
  {
    owl: "talking",
    lines: [
      `Hi ${FIRST_NAME}, I'm Hobson.`,
      "Think of me as your property co-worker. I read your documents, connect your information, and make sure nothing gets missed.",
    ],
    chip: "Nice to meet you",
    mapAction: "none",
  },
  {
    owl: "default",
    lines: [
      "I see your whole estate as units — the spaces people occupy. An office, a shop, a warehouse, a flat.",
      "Most of what matters — tenancies, deadlines, risk — starts at unit level.",
    ],
    chip: "How do you learn it all?",
    mapAction: "pulse-one",
  },
  {
    owl: "reading",
    lines: [
      "I learn by reading your documents — leases, rent reviews, compliance certificates.",
      "Every document teaches me a little more about that unit.",
    ],
    chip: "Then what?",
    mapAction: "pulse-one-doc",
  },
  {
    owl: "default",
    lines: [
      "Each unit I understand becomes knowledge.",
      "Enough units, and I understand the whole property. Enough properties, and I understand your entire portfolio.",
    ],
    chip: "What's it all for?",
    mapAction: "pulse-all",
  },
  {
    owl: "covering",
    lines: [
      "Property people don't miss things because they lack knowledge.",
      "They miss them because it's scattered across documents, buildings and deadlines. I'm here to change that.",
    ],
    chip: "I get it",
    mapAction: "spread",
  },
  {
    owl: "talking",
    lines: [
      "Today, I answer your questions.",
      "Soon, I'll handle the work — review the lease, prepare a summary, draft the next step — and bring it to you to approve.",
      "Ready? Let's open your portfolio.",
    ],
    chip: "Let's get started",
    mapAction: "check-one",
  },
];

/* ---------------- Helpers ---------------- */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type ChatMsg = { id: string; role: "hobson" | "user"; text: string; streaming?: boolean; rich?: "rentFlat2" };

const RENT_Q_PATTERNS = [
  /^\s*rent\s*\??\s*$/i,
  /^\s*rent\s+flat\s*2\s*$/i,
  /^\s*rent\s+flat\s*2\s+nugent\s+terrace\s*$/i,
  /^\s*what'?s?\s+the\s+current\s+rent\s*\??\s*$/i,
  /^\s*current\s+rent\s+flat\s*2\s*$/i,
];
const isRentFlat2Question = (q: string) => RENT_Q_PATTERNS.some((re) => re.test(q));
const rentPrefillFor = (view: string, propertyId: string | null, unitId: string | null): string => {
  if (view === "unit" && unitId === "nugent-f2") return "rent?";
  if (view === "property" && propertyId === "nugent") return "rent flat 2";
  if (view === "portfolio") return "rent flat 2 Nugent Terrace";
  return "";
};

/* ---------------- Map ---------------- */

type UnitPin = { id: string; lat: number; lng: number; label: string; status: "Let" | "Vacant" };

type MapHighlight = {
  pulse: "none" | "one" | "all";
  pulseId?: string;
  showDoc?: boolean;
  spread?: boolean;
  check?: boolean;
  focus?: { lat: number; lng: number; zoom: number } | null;
  dimExcept?: string | null;
  activeUnitPropertyId?: string | null;
  matchIds?: string[] | null;
  fadeNonMatches?: boolean;
  hoverId?: string | null;
  unitPins?: UnitPin[] | null;
  activeUnitId?: string | null;
};

function HobsonMap({
  onPropertyClick,
  highlight,
  onPinHover,
  onUnitClick,
}: {
  onPropertyClick: (id: string) => void;
  highlight: MapHighlight;
  onPinHover?: (id: string | null) => void;
  onUnitClick?: (unitId: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const unitMarkersRef = useRef<Record<string, L.Marker>>({});
  const connectorsRef = useRef<Record<string, L.Polyline>>({});

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const reduced = prefersReducedMotion();
    const map = L.map(mapRef.current, {
      center: [51.555, -0.185],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      zoomAnimation: !reduced,
      fadeAnimation: !reduced,
      markerZoomAnimation: !reduced,
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapInstance.current = map;

    PROPERTIES.forEach((p) => {
      const isCluster = !p.standalone && p.units.length > 1;
      const html = isCluster
        ? `<div class="hp-cluster" data-pid="${p.id}"><span>${p.units.length}</span></div>`
        : `<div class="hp-pin" data-pid="${p.id}"><div class="hp-pin-dot"></div></div>`;
      const icon = L.divIcon({
        html,
        className: "hp-marker",
        iconSize: isCluster ? [38, 38] : [28, 38],
        iconAnchor: isCluster ? [19, 19] : [14, 36],
      });
      const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
      m.bindTooltip(p.address, {
        direction: "top",
        offset: [0, isCluster ? -18 : -34],
        className: "hp-tooltip",
      });
      m.on("click", () => onPropertyClick(p.id));
      m.on("mouseover", () => onPinHover?.(p.id));
      m.on("mouseout", () => onPinHover?.(null));
      // Double-click an overlap-spread pin → zoom to fit its collision group
      m.on("dblclick", (e) => {
        L.DomEvent.stopPropagation(e);
        const el = m.getElement();
        if (!el?.classList.contains("is-overlap-spread")) return;
        const groupIds = Object.keys(connectorsRef.current);
        if (!groupIds.length) return;
        const groupBounds = L.latLngBounds(
          PROPERTIES.filter((q) => groupIds.includes(q.id)).map((q) => [q.lat, q.lng] as [number, number])
        );
        map.flyToBounds(groupBounds, { padding: [80, 80], maxZoom: 17, duration: reduced ? 0 : 0.6 });
      });
      markersRef.current[p.id] = m;
    });

    /* ---- Collision / spiderfy: keep true count + identity, just visually fan out ---- */
    const recomputeOverlap = () => {
      // Reset markers to their true locations and clear connectors
      PROPERTIES.forEach((p) => {
        const m = markersRef.current[p.id];
        if (!m) return;
        m.setLatLng([p.lat, p.lng]);
        m.getElement()?.classList.remove("is-overlap-spread");
      });
      Object.values(connectorsRef.current).forEach((pl) => map.removeLayer(pl));
      connectorsRef.current = {};

      const points = PROPERTIES.map((p) => ({
        id: p.id,
        orig: L.latLng(p.lat, p.lng),
        pt: map.latLngToLayerPoint([p.lat, p.lng]),
      }));

      // Single-linkage proximity grouping in pixel space
      const COLLIDE_PX = 56;
      const assigned = new Array(points.length).fill(-1);
      const groups: number[][] = [];
      for (let i = 0; i < points.length; i++) {
        if (assigned[i] !== -1) continue;
        const g = [i];
        assigned[i] = groups.length;
        for (let j = i + 1; j < points.length; j++) {
          if (assigned[j] !== -1) continue;
          if (points[i].pt.distanceTo(points[j].pt) < COLLIDE_PX) {
            g.push(j);
            assigned[j] = groups.length;
          }
        }
        groups.push(g);
      }

      groups.forEach((g) => {
        if (g.length < 2) return;
        const cx = g.reduce((s, k) => s + points[k].pt.x, 0) / g.length;
        const cy = g.reduce((s, k) => s + points[k].pt.y, 0) / g.length;
        const R = 40;
        g.forEach((k, idx) => {
          const angle = (idx / g.length) * Math.PI * 2 - Math.PI / 2;
          const nx = cx + R * Math.cos(angle);
          const ny = cy + R * Math.sin(angle);
          const newLatLng = map.layerPointToLatLng(L.point(nx, ny));
          const id = points[k].id;
          const m = markersRef.current[id];
          if (!m) return;
          m.setLatLng(newLatLng);
          m.getElement()?.classList.add("is-overlap-spread");
          const line = L.polyline([points[k].orig, newLatLng], {
            color: "#94A3B8",
            weight: 1,
            opacity: 0.65,
            interactive: false,
            dashArray: "2,3",
          }).addTo(map);
          connectorsRef.current[id] = line;
        });
      });
    };

    map.on("zoomend moveend", recomputeOverlap);

    // Fit to all property pins, then run overlap pass
    const bounds = L.latLngBounds(PROPERTIES.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, animate: !reduced });
    setTimeout(recomputeOverlap, 0);

    return () => {
      map.off("zoomend moveend", recomputeOverlap);
      Object.values(connectorsRef.current).forEach((pl) => map.removeLayer(pl));
      connectorsRef.current = {};
      map.remove();
      mapInstance.current = null;
      markersRef.current = {};
      unitMarkersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply highlight changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // reset classes
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const el = m.getElement();
      if (!el) return;
      el.classList.remove("is-pulse", "is-dim", "is-check", "has-doc", "is-spread", "is-match", "is-fade", "is-hover");
      if (highlight.pulse === "all") el.classList.add("is-pulse");
      if (highlight.pulse === "one" && highlight.pulseId === id) el.classList.add("is-pulse");
      if (highlight.showDoc && highlight.pulseId === id) el.classList.add("has-doc");
      if (highlight.spread) el.classList.add("is-spread");
      if (highlight.check && highlight.pulseId === id) el.classList.add("is-check");
      if (highlight.dimExcept && highlight.dimExcept !== id) el.classList.add("is-dim");
      if (highlight.activeUnitPropertyId === id) el.classList.add("is-pulse");
      if (highlight.matchIds && highlight.matchIds.length) {
        if (highlight.matchIds.includes(id)) el.classList.add("is-match");
        else if (highlight.fadeNonMatches) el.classList.add("is-fade");
      }
      if (highlight.hoverId === id) el.classList.add("is-hover");
    });

    if (highlight.focus) {
      map.flyTo([highlight.focus.lat, highlight.focus.lng], highlight.focus.zoom, {
        duration: 0.8,
      });
    } else {
      const bounds = L.latLngBounds(PROPERTIES.map((p) => [p.lat, p.lng] as [number, number]));
      map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 13, duration: 0.8 });
    }
  }, [highlight]);

  // Sync unit markers (property view)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const wanted = highlight.unitPins ?? [];
    const wantedIds = new Set(wanted.map((u) => u.id));

    // remove stale
    Object.entries(unitMarkersRef.current).forEach(([id, m]) => {
      if (!wantedIds.has(id)) {
        map.removeLayer(m);
        delete unitMarkersRef.current[id];
      }
    });

    // add new
    wanted.forEach((u) => {
      if (unitMarkersRef.current[u.id]) return;
      const statusClass = u.status === "Let" ? "is-let" : "is-vacant";
      const html = `<div class="hp-unit ${statusClass}" data-uid="${u.id}"><span>${u.label.replace(/[<>&]/g, "")}</span></div>`;
      const icon = L.divIcon({
        html,
        className: "hp-unit-marker",
        iconSize: [80, 22],
        iconAnchor: [40, 11],
      });
      const m = L.marker([u.lat, u.lng], { icon, zIndexOffset: 500 }).addTo(map);
      m.on("click", () => onUnitClick?.(u.id));
      unitMarkersRef.current[u.id] = m;
    });

    // active highlight
    Object.entries(unitMarkersRef.current).forEach(([id, m]) => {
      const el = m.getElement();
      if (!el) return;
      el.classList.toggle("is-active", highlight.activeUnitId === id);
    });
  }, [highlight, onUnitClick]);

  return <div ref={mapRef} className="absolute inset-0" aria-label="London property map" />;
}

/* ---------------- Page ---------------- */

type View = "onboarding" | "portfolio" | "property" | "unit";

const Prototype: React.FC = () => {
  const [view, setView] = useState<View>("onboarding");
  const [beatIdx, setBeatIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0); // line within beat
  const [owl, setOwl] = useState<OwlState>("talking");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [chipVisible, setChipVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [portfolioMode, setPortfolioMode] = useState<"first" | "returning">("first");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActiveIdx, setSearchActiveIdx] = useState(0);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showPropertyList, setShowPropertyList] = useState(false);
  const [portfolioChip, setPortfolioChip] = useState<string | null>(null);
  const [actionCards, setActionCards] = useState<ActionCard[]>(INITIAL_ACTION_CARDS);
  const [briefingChoice, setBriefingChoice] = useState<null | "all" | "urgent" | "browse">(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [hoveredCardPropertyId, setHoveredCardPropertyId] = useState<string | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showWhatIveDone, setShowWhatIveDone] = useState(false);
  const [carriedCardId, setCarriedCardId] = useState<string | null>(null);
  const [performingCardId, setPerformingCardId] = useState<string | null>(null);
  const [reviewingCardId, setReviewingCardId] = useState<string | null>(null);

  const performCard = (id: string) => {
    setReviewingCardId(null);
    setPerformingCardId(id);
    setExpandedCardId(null);
    setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: x.approvalState === "approved" ? "approved" : "in_progress" } : x));
  };
  const reviewCard = (id: string) => {
    setPerformingCardId(null);
    setReviewingCardId(id);
    setExpandedCardId(null);
  };
  const cancelPerform = () => {
    if (performingCardId) {
      setActionCards((arr) => arr.map((x) => x.id === performingCardId ? { ...x, approvalState: "pending" } : x));
    }
    setPerformingCardId(null);
  };
  const cancelReview = () => {
    // Review doesn't change state on exit — the work stays parked.
    setReviewingCardId(null);
  };
  const completePerform = (summary: string) => {
    const activeId = performingCardId ?? reviewingCardId;
    if (activeId) {
      const card = actionCards.find((x) => x.id === activeId);
      setActionCards((arr) => arr.map((x) => x.id === activeId ? { ...x, approvalState: "approved" } : x));
      if (card) {
        setActionToast(`Done — ${card.title} · ${summary}`);
        window.setTimeout(() => setActionToast(null), 4500);
      }
    }
    setPerformingCardId(null);
    setReviewingCardId(null);
  };
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const reduced = prefersReducedMotion();

  // Mode detection on mount (query param or stored flag)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returning = params.get("returning");
    if (returning === "1") {
      localStorage.setItem("hobsonPrototype.hasVisited", "1");
      setHasVisited(true);
      setPortfolioMode("returning");
      setView("portfolio");
      setMessages([]);
      setOwl("default");
      return;
    }
    if (returning === "0") {
      localStorage.removeItem("hobsonPrototype.hasVisited");
      setHasVisited(false);
      return;
    }
    const visited = localStorage.getItem("hobsonPrototype.hasVisited") === "1";
    setHasVisited(visited);
    if (visited) {
      setPortfolioMode("returning");
      setView("portfolio");
      setMessages([]);
      setOwl("default");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedProperty = useMemo(
    () => PROPERTIES.find((p) => p.id === selectedPropertyId) || null,
    [selectedPropertyId]
  );
  const selectedUnit = useMemo(() => {
    if (!selectedProperty || !selectedUnitId) return null;
    return selectedProperty.units.find((u) => u.id === selectedUnitId) || null;
  }, [selectedProperty, selectedUnitId]);

  /* ----- scroll chat ----- */
  useEffect(() => {
    const el = chatBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, chipVisible, view, selectedUnitId, selectedPropertyId]);

  /* ----- pre-fill demo rent question per level ----- */
  useEffect(() => {
    const pre = rentPrefillFor(view, selectedPropertyId, selectedUnitId);
    setInput(pre);
  }, [view, selectedPropertyId, selectedUnitId]);

  /* ----- onboarding line streaming ----- */
  useEffect(() => {
    if (view !== "onboarding") return;
    const beat = BEATS[beatIdx];
    if (!beat) return;
    if (lineIdx >= beat.lines.length) {
      setChipVisible(true);
      return;
    }
    setOwl(beat.owl);
    setChipVisible(false);
    setTyping(true);
    const text = beat.lines[lineIdx];
    const preDelay = reduced ? 200 : 550;
    const t = setTimeout(() => {
      setTyping(false);
      if (reduced) {
        setMessages((m) => [
          ...m,
          { id: `${beatIdx}-${lineIdx}-${Date.now()}`, role: "hobson", text },
        ]);
        setLineIdx((i) => i + 1);
      } else {
        streamHobsonMessage(text, () => setLineIdx((i) => i + 1));
      }
    }, preDelay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatIdx, lineIdx, view]);

  const streamHobsonMessage = (text: string, done: () => void) => {
    const id = `m-${Date.now()}-${Math.random()}`;
    setMessages((m) => [...m, { id, role: "hobson", text: "", streaming: true }]);
    const words = text.split(" ");
    let i = 0;
    const step = () => {
      i += 1;
      const partial = words.slice(0, i).join(" ");
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, text: partial } : x)));
      if (i < words.length) {
        setTimeout(step, 45 + Math.random() * 35);
      } else {
        setMessages((m) => m.map((x) => (x.id === id ? { ...x, streaming: false } : x)));
        done();
      }
    };
    setTimeout(step, 60);
  };

  /* ----- chip click during onboarding ----- */
  const advanceBeat = () => {
    const beat = BEATS[beatIdx];
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text: beat.chip },
    ]);
    setChipVisible(false);
    if (beatIdx === BEATS.length - 1) {
      // go to portfolio
      setTimeout(() => goPortfolio(true), 350);
    } else {
      setBeatIdx((i) => i + 1);
      setLineIdx(0);
    }
  };

  const skipIntro = () => goPortfolio(false);

  /* ----- view transitions ----- */
  const goPortfolio = (fromOnboarding: boolean) => {
    setView("portfolio");
    setSelectedPropertyId(null);
    setSelectedUnitId(null);
    setOwl("default");
    setChipVisible(false);
    setTyping(false);
    setSearchQuery("");
    setShowUnitPicker(false);
    setShowPropertyList(false);
    setPortfolioChip(null);
    setBriefingChoice(null);
    setExpandedCardId(null);
    setMessages([]);

    if (fromOnboarding) {
      localStorage.setItem("hobsonPrototype.hasVisited", "1");
      setHasVisited(true);
    }

    const pending = actionCards.filter((c) => c.approvalState === "pending" || c.approvalState === "in_progress");
    const urgent = pending.filter((c) => c.urgency === "now");

    const greetLines: string[] =
      portfolioMode === "first"
        ? [
            `Hi ${FIRST_NAME} — you're at portfolio level. Today I answer questions at the unit level, where your documents live. Click the search icon on the map to find a unit, or tap a pin to go straight there.`,
          ]
        : pending.length === 0
        ? [
            `Morning, ${FIRST_NAME}. The estate's quiet — nothing needs you today. Tap a pin to wander in, or use the map search.`,
          ]
        : [
            `Morning, ${FIRST_NAME}. The estate's mostly quiet — ${pending.length} ${pending.length === 1 ? "thing needs" : "things need"} you${urgent.length ? `, and ${urgent.length === 1 ? "1 is" : `${urgent.length} are`} time-sensitive` : ""}.`,
            `Want to take them now, or just the urgent one?`,
          ];

    setTyping(true);
    const delay = reduced ? 200 : 450;
    const playLine = (i: number) => {
      if (i >= greetLines.length) return;
      setTyping(true);
      const gap = i === 0 ? delay : (reduced ? 80 : 500);
      window.setTimeout(() => {
        setTyping(false);
        if (reduced) {
          setMessages((m) => [...m, { id: `p-greet-${i}`, role: "hobson", text: greetLines[i] }]);
          playLine(i + 1);
        } else {
          streamHobsonMessage(greetLines[i], () => playLine(i + 1));
        }
      }, gap);
    };
    playLine(0);
  };

  const goProperty = (id: string, carryCardId?: string) => {
    const p = PROPERTIES.find((x) => x.id === id);
    if (!p) return;
    // Standalone "properties" (single independent unit) skip the Property layer entirely
    if (p.standalone) {
      goUnit(p.units[0].id, p.id, carryCardId);
      return;
    }
    setView("property");
    setSelectedPropertyId(id);
    setSelectedUnitId(null);
    setCarriedCardId(carryCardId ?? null);
    setOwl("talking");
    setShowUnitPicker(false);
    setShowPropertyList(false);
    setPortfolioChip(null);
    setSearchQuery("");
    setMessages([]);
    const carriedCard = carryCardId ? actionCards.find((x) => x.id === carryCardId) : null;
    const greet = carriedCard
      ? `Here's ${p.name}. ${carriedCard.title} is the one that needs you — and here's everything else on this building.`
      : `Here you are, ${FIRST_NAME} — ${p.name}, London ${p.postcode}. ${p.units.length} units. Pick one to open.`;
    setTyping(true);
    const delay = reduced ? 200 : 500;
    window.setTimeout(() => {
      setTyping(false);
      if (reduced) {
        setMessages([{ id: `prop-${id}`, role: "hobson", text: greet }]);
      } else {
        streamHobsonMessage(greet, () => {});
      }
    }, delay);
  };

  const askPropertyPreview = (q: string) => {
    const p = selectedProperty;
    if (!p) return;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setTyping(true);
    setOwl("default");
    const reply = `I can't answer for the whole building yet — I build that up from each unit first. Let's open one and I'll show you what I can already do.`;
    const delay = reduced ? 200 : 700;
    window.setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      if (reduced) {
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "hobson", text: reply }]);
      } else {
        streamHobsonMessage(reply, () => {});
      }
    }, delay);
  };

  const goUnit = (unitId: string, propertyId?: string, carryCardId?: string) => {
    const pid = propertyId ?? selectedPropertyId;
    const p = PROPERTIES.find((x) => x.id === pid);
    if (!p) return;
    const u = p.units.find((x) => x.id === unitId);
    if (!u) return;
    setSelectedPropertyId(p.id);
    setView("unit");
    setSelectedUnitId(unitId);
    setCarriedCardId(carryCardId ?? null);
    setOwl("talking");
    setShowUnitPicker(false);
    setShowPropertyList(false);
    setPortfolioChip(null);
    setSearchQuery("");
    const where = p.standalone ? p.address : `${p.name}`;
    const derived = deriveUnit(u);
    const lines = buildUnitOpeningLines(u, derived, where);
    if (carryCardId) {
      const card = actionCards.find((x) => x.id === carryCardId);
      if (card) {
        lines.unshift(`About that — ${card.title}. ${card.whyItMatters}`);
      }
    }
    setMessages([]);
    const playLine = (i: number) => {
      if (i >= lines.length) return;
      setTyping(true);
      const gap = reduced ? 80 : i === 0 ? 400 : 600;
      window.setTimeout(() => {
        setTyping(false);
        if (reduced) {
          setMessages((m) => [...m, { id: `unit-${unitId}-${i}`, role: "hobson", text: lines[i] }]);
          playLine(i + 1);
        } else {
          streamHobsonMessage(lines[i], () => playLine(i + 1));
        }
      }, gap);
    };
    playLine(0);
  };

  const replayOnboarding = () => {
    setMessages([]);
    setBeatIdx(0);
    setLineIdx(0);
    setChipVisible(false);
    setTyping(false);
    setOwl("talking");
    setView("onboarding");
    setSelectedPropertyId(null);
    setSelectedUnitId(null);
  };

  /* ----- map highlight derived from view/beat ----- */
  const highlight: MapHighlight = useMemo(() => {
    if (view === "onboarding") {
      const beat = BEATS[beatIdx];
      const firstId = PROPERTIES[0].id;
      switch (beat?.mapAction) {
        case "pulse-one":
          return { pulse: "one", pulseId: firstId };
        case "pulse-one-doc":
          return { pulse: "one", pulseId: firstId, showDoc: true };
        case "pulse-all":
          return { pulse: "all" };
        case "spread":
          return { pulse: "all", spread: true };
        case "check-one":
          return { pulse: "none", check: true, pulseId: firstId };
        default:
          return { pulse: "none" };
      }
    }
    if (view === "portfolio") {
      const q = searchQuery.trim().toLowerCase();
      let matchIds: string[] | null = null;
      let fadeNonMatches = false;
      if (q && portfolioMode === "returning") {
        matchIds = PROPERTIES.filter((p) => {
          if (p.name.toLowerCase().includes(q)) return true;
          if (p.area.toLowerCase().includes(q)) return true;
          return p.units.some(
            (u) =>
              u.label.toLowerCase().includes(q) ||
              (u.tenant && u.tenant.toLowerCase().includes(q))
          );
        }).map((p) => p.id);
        fadeNonMatches = true;
      } else if (portfolioMode === "returning" && briefingChoice !== "browse") {
        // Glow properties that have pending action cards (matching the urgency filter).
        // Do NOT fade the others — non-flagged pins stay full-colour and active.
        const pending = actionCards.filter(
          (c) =>
            (c.approvalState === "pending" || c.approvalState === "in_progress") &&
            (briefingChoice !== "urgent" || c.urgency === "now")
        );
        const ids = Array.from(new Set(pending.map((c) => c.propertyId)));
        if (ids.length) matchIds = ids;
      }
      return { pulse: "none", matchIds, fadeNonMatches, hoverId: hoveredCardPropertyId ?? hoveredPropertyId };
    }
    if (view === "property" && selectedProperty) {
      // Units are NOT shown as map pins — the map only locates the building.
      return {
        pulse: "none",
        dimExcept: selectedProperty.id,
        activeUnitPropertyId: selectedProperty.id,
        focus: { lat: selectedProperty.lat, lng: selectedProperty.lng, zoom: 17 },
        unitPins: [],
      };
    }
    if (view === "unit" && selectedProperty) {
      return {
        pulse: "none",
        dimExcept: selectedProperty.id,
        activeUnitPropertyId: selectedProperty.id,
        focus: { lat: selectedProperty.lat, lng: selectedProperty.lng, zoom: 17 },
        unitPins: [],
      };
    }
    return { pulse: "none" };
  }, [view, beatIdx, selectedProperty, selectedUnitId, searchQuery, portfolioMode, hoveredPropertyId, briefingChoice, actionCards, hoveredCardPropertyId]);

  /* ----- unit Q&A ----- */
  const answerForUnit = (q: string): string => {
    const u = selectedUnit;
    const p = selectedProperty;
    if (!u || !p) return "Open a unit first and I can answer.";
    // Tenant/lease/EPC data isn't loaded for these units yet — return a clear placeholder.
    const placeholder = `I don't have the details for ${u.label} on file yet. Once your lease, compliance and rent documents are uploaded for ${p.standalone ? p.name : `${p.name} — ${u.label}`}, I'll be able to answer this properly. (Placeholder response.)`;
    void q;
    return placeholder;
  };

  const sendRentAnswer = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setOwl("reading");
    const delay = reduced ? 200 : 900;
    window.setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      const id = `rent-${Date.now()}`;
      if (reduced) {
        setMessages((m) => [...m, { id, role: "hobson", text: RENT_BODY_TEXT, rich: "rentFlat2" }]);
        return;
      }
      // Stream the paragraph text inside a rich bubble, then settle.
      setMessages((m) => [...m, { id, role: "hobson", text: "", streaming: true, rich: "rentFlat2" }]);
      const words = RENT_BODY_TEXT.split(" ");
      let i = 0;
      const step = () => {
        i += 1;
        const partial = words.slice(0, i).join(" ");
        setMessages((m) => m.map((x) => (x.id === id ? { ...x, text: partial } : x)));
        if (i < words.length) {
          setTimeout(step, 40 + Math.random() * 30);
        } else {
          setMessages((m) => m.map((x) => (x.id === id ? { ...x, streaming: false } : x)));
        }
      };
      setTimeout(step, 60);
    }, delay);
  };

  const sendUnitQuestion = (q: string) => {
    if (!q.trim()) return;
    if (isRentFlat2Question(q)) { sendRentAnswer(q); return; }
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setOwl("reading");
    const delay = reduced ? 200 : 800;
    setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      const ans = selectedUnit ? answerUnitQuestion(q, selectedUnit, deriveUnit(selectedUnit)) : answerForUnit(q);
      if (reduced) {
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "hobson", text: ans }]);
      } else {
        streamHobsonMessage(ans, () => {});
      }
    }, delay);
  };

  const showRoadmapToast = (label: string) => {
    setToast(`"${label}" is Portfolio Intelligence — coming soon. Open a unit and I can answer it today.`);
    window.setTimeout(() => setToast(null), 3500);
  };

  // First-visit preview question handler — posts as user msg, Hobson replies warmly, then shows chip
  const askPortfolioPreview = (q: string) => {
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setTyping(true);
    setOwl("default");
    const reply = `I can't answer across your whole portfolio yet — I build that understanding unit by unit first. Let's open a unit and I'll show you what I can already do.`;
    const delay = reduced ? 200 : 700;
    window.setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      if (reduced) {
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "hobson", text: reply }]);
      } else {
        streamHobsonMessage(reply, () => {});
      }
      setPortfolioChip("Go straight to a unit");
    }, delay);
  };

  const handlePortfolioChip = (label: string) => {
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: label }]);
    setPortfolioChip(null);
    if (label === "Browse properties") {
      setShowPropertyList(true);
      setShowUnitPicker(false);
    } else if (label === "Go straight to a unit") {
      setShowUnitPicker(true);
      setShowPropertyList(false);
    }
  };

  /* ----- progress ----- */
  const progressPct =
    view !== "onboarding"
      ? 100
      : Math.round(((beatIdx + (chipVisible ? 0.9 : lineIdx / Math.max(1, BEATS[beatIdx]?.lines.length || 1))) / BEATS.length) * 100);

  /* ----- breadcrumbs ----- */
  const crumbs: { label: string; onClick?: () => void }[] = useMemo(() => {
    if (view === "onboarding") return [];
    const arr: { label: string; onClick?: () => void }[] = [
      { label: "Portfolio", onClick: () => goPortfolio(false) },
    ];
    if (selectedProperty && !selectedProperty.standalone)
      arr.push({
        label: selectedProperty.name,
        onClick: () => goProperty(selectedProperty.id),
      });
    if (selectedUnit) {
      const label = selectedProperty?.standalone ? selectedProperty.name : selectedUnit.label;
      arr.push({ label });
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selectedProperty, selectedUnit]);

  /* ============ Render ============ */

  return (
    <div className="hobson-proto fixed inset-0 flex bg-white text-[#1F2330]">
      <StyleTag />

      {/* Left nav rail */}
      <aside className="w-[68px] shrink-0 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] grid place-items-center text-white font-bold mb-2 shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="white" />
          </svg>
        </div>
        <RailItem icon="pin" label="Portfolio" active={!showDocuments && !showWhatIveDone} onClick={() => { setShowDocuments(false); setShowWhatIveDone(false); goPortfolio(false); }} />
        <RailItem icon="doc" label="Documents" active={showDocuments} onClick={() => { setShowWhatIveDone(false); setShowDocuments(true); }} />
        <RailItem icon="clock" label={"What I've done"} active={showWhatIveDone} onClick={() => { setShowDocuments(false); setShowWhatIveDone(true); }} />
        <RailItem icon="chat" label="Chat History" />
        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          <button className="w-11 h-11 rounded-full bg-[#7C3AED] text-white grid place-items-center shadow-md hover:bg-[#6D28D9] transition" aria-label="New chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <span className="text-[10px] text-slate-500">New chat</span>
          <RailItem icon="gear" label="Admin" />
          <div className="w-9 h-9 rounded-full bg-slate-200 grid place-items-center text-xs font-semibold text-slate-700">MT</div>
        </div>
      </aside>

      {/* Chat panel */}
      <section className="w-[480px] shrink-0 bg-white border-r border-slate-200 flex flex-col">
        {/* Header */}
        <header className="h-14 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            {view === "portfolio" && portfolioMode === "returning" && (
              <img src={owlDefault} alt="" aria-hidden className="w-6 h-6 object-contain" />
            )}
            <h1 className="font-semibold text-[15px] text-slate-900">Chat with Hobson</h1>
            {view !== "onboarding" && (
              <button
                onClick={replayOnboarding}
                className="ml-2 text-[11px] text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
              >
                How Hobson works
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1.5 hover:text-slate-700" aria-label="Expand">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h6M4 4v6M20 20h-6M20 20v-6"/></svg>
            </button>
            <button className="p-1.5 hover:text-slate-700" aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
        </header>

        {/* Onboarding progress / breadcrumb */}
        {view === "onboarding" ? (
          <div className="px-5 pt-3 pb-2 border-b border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span>Meet Hobson · Step {Math.min(beatIdx + 1, BEATS.length)} of {BEATS.length}</span>
              <button
                onClick={skipIntro}
                className="text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
              >
                Skip intro
              </button>
            </div>
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#7C3AED] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="px-5 py-2 border-b border-slate-100 flex items-center gap-1 text-[12px] text-slate-500 flex-wrap">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-slate-300">›</span>}
                {c.onClick ? (
                  <button
                    onClick={c.onClick}
                    className="hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded px-0.5"
                  >
                    {c.label}
                  </button>
                ) : (
                  <span className="text-slate-900 font-medium">{c.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Body */}
        <div ref={chatBodyRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Pinned alert briefing at the top of unit chat */}
          {view === "unit" && selectedUnit && selectedPropertyId && (
            <>
              <PinnedAlertCard
                unit={selectedUnit}
                derived={deriveUnit(selectedUnit)}
                propertyContextCards={selectActionsForScope(actionCards, {
                  level: "unit",
                  propertyId: selectedPropertyId,
                  unitId: selectedUnit.id,
                }).filter((c) => c.anchorLevel === "property" && (c.approvalState === "pending" || c.approvalState === "in_progress"))}
                onManageAtProperty={() => goProperty(selectedPropertyId)}
              />
              {(() => {
                const unitOwnCardsRaw = selectActionsForScope(actionCards, {
                  level: "unit",
                  propertyId: selectedPropertyId,
                  unitId: selectedUnit.id,
                }).filter((c) => c.anchorLevel === "unit" && (c.approvalState === "pending" || c.approvalState === "in_progress"));
                if (unitOwnCardsRaw.length === 0) return null;
                // Carried card surfaces first
                const unitOwnCards = carriedCardId
                  ? [...unitOwnCardsRaw].sort((a, b) => (a.id === carriedCardId ? -1 : b.id === carriedCardId ? 1 : 0))
                  : unitOwnCardsRaw;
                return (
                  <section aria-label={`Actions for ${selectedUnit.label}`} className="space-y-2">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                      On this unit's desk · {unitOwnCards.length}
                    </div>
                    {unitOwnCards.map((c) => (
                      <div key={c.id} className={c.id === carriedCardId ? "rounded-xl ring-2 ring-[#7C3AED]/50 ring-offset-2 ring-offset-white" : ""}>
                      <ActionCardItem
                        key={c.id}
                        card={c}
                        level="unit"
                        expanded={expandedCardId === c.id}
                        onToggleExpand={() => setExpandedCardId(expandedCardId === c.id ? null : c.id)}
                        onHover={() => {}}
                        onApprove={() => {
                          const card = actionCards.find((x) => x.id === c.id);
                          setActionCards((arr) => arr.map((x) => x.id === c.id ? { ...x, approvalState: "approved" } : x));
                          setExpandedCardId(null);
                          if (card) {
                            setActionToast(`Done — ${card.title} recorded.`);
                            window.setTimeout(() => setActionToast(null), 3000);
                          }
                        }}
                        onDefer={() => {
                          setActionCards((arr) => arr.map((x) => x.id === c.id ? { ...x, approvalState: "deferred" } : x));
                          setExpandedCardId(null);
                        }}
                        onDismiss={() => {
                          setActionCards((arr) => arr.map((x) => x.id === c.id ? { ...x, approvalState: "dismissed" } : x));
                          setExpandedCardId(null);
                        }}
                        onPerform={() => performCard(c.id)}
                        onReview={() => reviewCard(c.id)}
                      />
                      </div>
                    ))}
                  </section>
                );
              })()}
            </>
          )}

          {/* Hobson messages render first so the greeting sits at the top */}
          {messages.map((m) =>
            m.role === "hobson" ? (
              <HobsonBubble key={m.id} text={m.text} owl={owl} streaming={!!m.streaming} rich={m.rich} onAskFollowUp={(q) => sendRentAnswer(q)} />
            ) : (
              <UserBubble key={m.id} text={m.text} />
            )
          )}
          {typing && <TypingBubble owl={owl} />}

          {/* (Global search/recents panel is intentionally NOT shown at property level — that belongs to Portfolio returning mode only.) */}




          {/* Portfolio view — first visit (guided) */}
          {view === "portfolio" && portfolioMode === "first" && (
            <PortfolioFirstVisit
              showPropertyList={showPropertyList}
              showUnitPicker={showUnitPicker}
              onOpenProperty={goProperty}
              onOpenUnit={(propId, unitId) => goUnit(unitId, propId)}
              onPreviewQuestion={askPortfolioPreview}
            />
          )}

          {/* Portfolio view — returning: co-worker briefing */}
          {view === "portfolio" && portfolioMode === "returning" && !typing && messages.length > 0 && (
            <PortfolioBriefing
              cards={actionCards}
              choice={briefingChoice}
              setChoice={setBriefingChoice}
              expandedCardId={expandedCardId}
              setExpandedCardId={setExpandedCardId}
              onHoverCard={setHoveredCardPropertyId}
              onOpenUnit={(propId, unitId, cardId) => goUnit(unitId, propId, cardId)}
              onOpenProperty={(propId, cardId) => goProperty(propId, cardId)}
              onApprove={(id) => {
                const c = actionCards.find((x) => x.id === id);
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "approved" } : x));
                setExpandedCardId(null);
                if (c) {
                  setActionToast(`Done — ${c.title} recorded.`);
                  window.setTimeout(() => setActionToast(null), 3000);
                }
              }}
              onDefer={(id) => {
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "deferred" } : x));
                setExpandedCardId(null);
              }}
              onDismiss={(id) => {
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "dismissed" } : x));
                setExpandedCardId(null);
              }}
              onPerform={performCard}
              onReview={reviewCard}
            />
          )}



          {/* Property view */}
          {view === "property" && selectedProperty && (
            <PropertyContent
              property={selectedProperty}
              propertyActionCards={selectActionsForScope(actionCards, { level: "property", propertyId: selectedProperty.id })}
              expandedCardId={expandedCardId}
              setExpandedCardId={setExpandedCardId}
              carriedCardId={carriedCardId}
              onOpenUnit={(uid, cardId) => goUnit(uid, selectedProperty.id, cardId)}
              onPreviewQuestion={askPropertyPreview}
              onApprove={(id) => {
                const c = actionCards.find((x) => x.id === id);
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "approved" } : x));
                setExpandedCardId(null);
                if (c) {
                  setActionToast(`Done — ${c.title} recorded.`);
                  window.setTimeout(() => setActionToast(null), 3000);
                }
              }}
              onDefer={(id) => {
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "deferred" } : x));
                setExpandedCardId(null);
              }}
              onDismiss={(id) => {
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "dismissed" } : x));
                setExpandedCardId(null);
              }}
              onPerform={performCard}
              onReview={reviewCard}
            />
          )}

          {/* Unit view starters */}
          {view === "unit" && selectedUnit && (
            <UnitStarters
              unit={selectedUnit}
              onAsk={(q) => sendUnitQuestion(q)}
            />
          )}
        </div>

        {/* Composer */}
        <div className="px-5 pt-2 pb-4 border-t border-slate-100 bg-white">
          {view === "onboarding" && chipVisible && (
            <div className="mb-2 flex flex-col items-end gap-1.5">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                Tap to reply <span aria-hidden>↓</span>
              </span>
              <button
                onClick={advanceBeat}
                autoFocus
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED] ${
                  beatIdx === BEATS.length - 1
                    ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-sm"
                    : "bg-[#EDE9FE] text-[#5B21B6] hover:bg-[#DDD6FE] border border-[#DDD6FE]"
                }`}
              >
                {BEATS[beatIdx]?.chip}
              </button>
            </div>
          )}
          {view === "portfolio" && portfolioMode === "first" && !chipVisible && messages.length > 0 && !portfolioChip && !showPropertyList && !showUnitPicker && (
            <div className="mb-2 flex flex-col items-end gap-1.5">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                Tap to reply <span aria-hidden>↓</span>
              </span>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {["Browse properties", "Go straight to a unit"].map((label) => (
                  <button
                    key={label}
                    onClick={() => handlePortfolioChip(label)}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#EDE9FE] text-[#5B21B6] hover:bg-[#DDD6FE] border border-[#DDD6FE] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {view === "portfolio" && portfolioMode === "first" && portfolioChip && (
            <div className="mb-2 flex flex-col items-end gap-1.5">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                Tap to reply <span aria-hidden>↓</span>
              </span>
              <button
                onClick={() => handlePortfolioChip(portfolioChip)}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED]"
              >
                {portfolioChip}
              </button>
            </div>
          )}
          {view === "portfolio" || view === "property" || view === "unit" ? (
            <>
              {view !== "unit" && (
                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
                  </svg>
                  Free typing locks here — the pre-filled question is the demo
                </div>
              )}
              {view === "unit" && <div className="text-[11px] text-slate-400 mb-1">4 remaining</div>}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = input.trim();
                  if (!q) return;
                  if (view === "unit") {
                    sendUnitQuestion(q);
                  } else if (isRentFlat2Question(q)) {
                    sendRentAnswer(q);
                  } else {
                    setToast("Free typing is locked here — try the pre-filled question.");
                    window.setTimeout(() => setToast(null), 2500);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition ${
                  isRentFlat2Question(input) && !typing
                    ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/30 animate-[pulse_1.6s_ease-in-out_infinite]"
                    : "border-slate-200"
                }`}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Hobson…"
                  className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400"
                  aria-label="Ask Hobson"
                />
                <button
                  type="submit"
                  className={`text-[#7C3AED] hover:text-[#6D28D9] disabled:text-slate-300 ${
                    isRentFlat2Question(input) && !typing ? "animate-[pulse_1.6s_ease-in-out_infinite]" : ""
                  }`}
                  aria-label="Send"
                  disabled={!input.trim()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <LockedComposer view={view} />
          )}
        </div>
      </section>

      {/* Map */}
      <main className="relative flex-1 bg-slate-100">
        <HobsonMap
          onPropertyClick={(id) => {
            const p = PROPERTIES.find((x) => x.id === id);
            if (!p) return;
            // If single-unit property in returning mode, drill straight to unit
            if (portfolioMode === "returning" && p.units.length === 1) {
              goUnit(p.units[0].id, p.id);
            } else {
              goProperty(id);
            }
          }}
          onPinHover={setHoveredPropertyId}
          onUnitClick={(uid) => selectedPropertyId && goUnit(uid, selectedPropertyId)}
          highlight={highlight}
        />

        {/* Global map search — persistent on every level */}
        <MapSearch
          query={searchQuery}
          setQuery={setSearchQuery}
          onOpenUnit={(propId, unitId) => goUnit(unitId, propId)}
          onOpenProperty={(id) => {
            const p = PROPERTIES.find((x) => x.id === id);
            if (!p) return;
            if (portfolioMode === "returning" && p.units.length === 1) {
              goUnit(p.units[0].id, p.id);
            } else {
              goProperty(id);
            }
          }}
          onHoverProperty={setHoveredPropertyId}
        />


        {/* Map/Satellite toggle */}
        <div className="absolute bottom-4 right-4 z-[400] bg-white rounded-md shadow-md text-xs font-medium flex">
          <button className="px-3 py-1.5 bg-slate-900 text-white rounded-l-md">Map</button>
          <button className="px-3 py-1.5 text-slate-600 rounded-r-md">Satellite</button>
        </div>


        {/* Dev toggle */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/90 rounded-md shadow-md text-[11px] font-medium flex overflow-hidden border border-slate-200">
          <span className="px-2 py-1 text-slate-500">Dev:</span>
          <a href="?returning=0" className="px-2 py-1 hover:bg-slate-100 border-l border-slate-200">First visit</a>
          <a href="?returning=1" className="px-2 py-1 hover:bg-slate-100 border-l border-slate-200">Returning</a>
        </div>


        {toast && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-[500] bg-slate-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg max-w-md text-center">
            {toast}
          </div>
        )}

        {actionToast && (
          <div role="status" aria-live="polite" className="absolute left-1/2 -translate-x-1/2 bottom-20 z-[500] bg-emerald-700 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg max-w-md text-center">
            {actionToast}
          </div>
        )}
        {showDocuments && (
          <DocumentsLibrary
            onClose={() => setShowDocuments(false)}
            initialScope={{
              propertyId: view === "property" || view === "unit" ? selectedPropertyId ?? undefined : undefined,
              unitId: view === "unit" ? selectedUnitId ?? undefined : undefined,
            }}
            onNavigatePortfolio={() => { setShowDocuments(false); goPortfolio(false); }}
            onNavigateProperty={(pid) => { setShowDocuments(false); goProperty(pid); }}
          />
        )}
        {showWhatIveDone && (
          <WhatIveDonePanel
            actionCards={actionCards}
            onClose={() => setShowWhatIveDone(false)}
            onResume={(id) => { setShowWhatIveDone(false); performCard(id); }}
            onOpenProperty={(pid) => { setShowWhatIveDone(false); goProperty(pid); }}
            onOpenUnit={(uid, pid) => { setShowWhatIveDone(false); goUnit(uid, pid); }}
            reducedMotion={reduced}
          />
        )}
        {(performingCardId || reviewingCardId) && (() => {
          const activeId = performingCardId ?? reviewingCardId!;
          const card = actionCards.find((c) => c.id === activeId);
          if (!card) return null;
          const mode: "perform" | "review" = performingCardId ? "perform" : "review";
          return (
            <PerformWorkspace
              card={card}
              mode={mode}
              onCancel={mode === "perform" ? cancelPerform : cancelReview}
              onComplete={completePerform}
              reducedMotion={reduced}
            />
          );
        })()}
      </main>
    </div>
  );
};

/* ---------------- Sub-components ---------------- */

function RailItem({ icon, label, active, onClick }: { icon: "pin" | "doc" | "chat" | "gear" | "clock"; label: string; active?: boolean; onClick?: () => void }) {
  const stroke = active ? "#7C3AED" : "#64748B";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-12 flex flex-col items-center gap-0.5 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 ${
        active ? "bg-[#F5F3FF]" : "hover:bg-slate-50"
      }`}
      aria-current={active ? "page" : undefined}
      aria-label={label}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icon === "pin" && (<><path d="M12 22s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/></>)}
        {icon === "doc" && (<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></>)}
        {icon === "chat" && (<><path d="M21 12a8 8 0 11-3-6.2L21 3v6h-6"/></>)}
        {icon === "clock" && (<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>)}
        {icon === "gear" && (<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5"/></>)}
      </svg>
      <span className={`text-[10px] text-center leading-tight ${active ? "text-[#7C3AED] font-medium" : "text-slate-500"}`}>{label}</span>
    </button>
  );
}


function HobsonBubble({ text, owl, streaming, rich, onAskFollowUp }: { text: string; owl: OwlState; streaming?: boolean; rich?: "rentFlat2"; onAskFollowUp?: (q: string) => void }) {
  if (rich === "rentFlat2") {
    return (
      <div className="flex items-start gap-2">
        <OwlAvatar state={owl} />
        <div className="max-w-[560px] w-full bg-white border border-slate-200 text-[#1F2330] text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-bl-md shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[12px]">
              <span className="font-semibold text-slate-900">Hobson</span>
              <span className="ml-2 italic text-slate-500">Thought for 4 seconds</span>
            </div>
            <button
              type="button"
              onClick={() => downloadRentCsv()}
              className="text-[12px] text-[#7C3AED] hover:underline inline-flex items-center gap-1"
            >
              ↓ Download as CSV
            </button>
          </div>
          {!streaming && <RentFlat2Answer onAskFollowUp={onAskFollowUp} bodyText={text} />}
          {streaming && (
            <div className="text-sm text-slate-700">
              {text}
              <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <OwlAvatar state={owl} />
      <div className="max-w-[340px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
        {text}
        {streaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
      </div>
    </div>
  );
}

const RENT_BODY_TEXT =
  "The current rent is set out in the tenancy paperwork and the later rent increase notice. The agreement also refers to annual reviews linked to RPI, with the notice saying the increase follows the agreed minimum adjustment.";

function downloadRentCsv() {
  const rows = [
    ["Current Rent", "Effective From", "Reliable"],
    ["£2,415 per month", "1 October 2025", "Yes"],
  ];
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rent-flat-2-nugent-terrace.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function RentFlat2Answer({ onAskFollowUp, bodyText }: { onAskFollowUp?: (q: string) => void; bodyText: string }) {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (s: string) => {
    setToast(s);
    window.setTimeout(() => setToast(null), 2200);
  };
  const related = [
    "Would you like the original rent amount as well?",
    "Do you want the source documents for this rent?",
    "Shall I check how the increase was calculated?",
  ];
  const sources = [
    "AST nt 2.pdf — referenced by the answer",
    "rent increase 2025-2026 NT2.pdf — referenced by the answer",
  ];
  const docs = [
    { name: "rent increase 2025-2026 NT2.pdf" },
    { name: "AST nt 2.pdf" },
  ];
  const copyAll = async () => {
    const text = `Current Rent: £2,415 per month\nEffective From: 1 October 2025\nReliable: Yes\n\n${bodyText}`;
    try { await navigator.clipboard.writeText(text); showToast("Copied"); } catch { showToast("Copy failed"); }
  };
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-[13px]">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-3 py-2">Current Rent</th>
              <th className="text-left font-medium px-3 py-2">Effective From</th>
              <th className="text-left font-medium px-3 py-2">Reliable</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-3 py-2 font-semibold text-slate-900">£2,415 per month</td>
              <td className="px-3 py-2 text-slate-700">1 October 2025</td>
              <td className="px-3 py-2 text-emerald-700">✓ Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-slate-700">{bodyText}</p>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1">Sources</div>
        <ul className="list-disc pl-5 space-y-0.5 text-[13px] text-slate-700">
          {sources.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1">Related questions</div>
        <ul className="space-y-1">
          {related.map((q) => (
            <li key={q}>
              <button
                onClick={() => onAskFollowUp?.(q)}
                className="text-left text-[13px] text-[#5B21B6] hover:underline"
              >
                • {q}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">Related documents</div>
          <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 tracking-wide">Beta</span>
        </div>
        <ul className="space-y-1">
          {docs.map((d) => (
            <li key={d.name}>
              <button
                onClick={() => showToast(`Opening ${d.name} (placeholder)`)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] text-left transition"
              >
                <span aria-hidden className="w-5 h-5 rounded bg-rose-100 text-rose-700 text-[9px] font-bold grid place-items-center">PDF</span>
                <span className="text-[13px] text-slate-800 truncate">{d.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-1 pt-1 border-t border-slate-100 text-[12px] text-slate-500">
        <button onClick={copyAll} className="px-2 py-1 rounded hover:bg-slate-100">Copy</button>
        <button onClick={() => showToast("Regenerating… (placeholder)")} className="px-2 py-1 rounded hover:bg-slate-100">Regenerate</button>
        
        <button onClick={() => showToast("Thanks for the rating")} className="px-2 py-1 rounded hover:bg-slate-100">Rate this</button>
      </div>
      {toast && (
        <div role="status" aria-live="polite" className="text-[11px] text-slate-500 italic">{toast}</div>
      )}
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[340px] bg-[#7C3AED] text-white text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-br-md">
        {text}
      </div>
    </div>
  );
}

function TypingBubble({ owl }: { owl: OwlState }) {
  return (
    <div className="flex items-end gap-2">
      <OwlAvatar state={owl} />
      <div className="bg-[#EDE9FE] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
        <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]/70 animate-typing-bounce"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

function OwlAvatar({ state }: { state: OwlState }) {
  return (
    <div className="w-10 h-10 shrink-0 relative">
      {(Object.keys(OWLS) as OwlState[]).map((s) => (
        <img
          key={s}
          src={OWLS[s]}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
            state === s ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

function IntelligenceLadder({ view }: { view: View }) {
  const rows = [
    { label: "Unit Intelligence", status: "Available today", tone: "good" as const, upNext: view === "property" || view === "portfolio" ? false : false },
    { label: "Property Intelligence", status: "Coming soon", tone: "soon" as const, upNext: view === "property" },
    { label: "Portfolio Intelligence", status: "Coming soon", tone: "soon" as const, upNext: view === "portfolio" },
  ];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">Intelligence ladder</div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {r.tone === "good" ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white grid place-items-center text-[10px]">✓</span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-slate-200" />
            )}
            <span className="text-slate-900">{r.label}</span>
            {r.upNext && (
              <span className="text-[10px] uppercase tracking-wide text-[#7C3AED] bg-[#EDE9FE] px-1.5 py-0.5 rounded">Up next</span>
            )}
          </div>
          <span className={`text-[11px] ${r.tone === "good" ? "text-emerald-600" : "text-slate-400"}`}>{r.status}</span>
        </div>
      ))}
    </div>
  );
}

function PortfolioContent({
  onOpenProperty,
  onPreviewQuestion,
}: {
  onOpenProperty: (id: string) => void;
  onPreviewQuestion: (q: string) => void;
}) {
  const questions = [
    "Which leases expire this year?",
    "What reviews are due?",
    "What is occupancy?",
    "Which assets carry risk?",
  ];
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-semibold text-slate-900">Portfolio Intelligence</h2>
          <span className="text-[10px] uppercase tracking-wide bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Coming soon</span>
        </div>
        <p className="text-sm text-slate-600">
          Today I can answer questions about individual units. Soon I'll help you understand your entire portfolio.
        </p>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5">Preview questions</div>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q) => (
            <button
              key={q}
              onClick={() => onPreviewQuestion(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5 mt-2">Properties</div>
        <div className="space-y-1.5">
          {PROPERTIES.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpenProperty(p.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            >
              <div>
                <div className="text-sm font-medium text-slate-900">{p.name}</div>
                <div className="text-[11px] text-slate-500">{p.area} · {p.units.length} units</div>
              </div>
              <span className="text-[#7C3AED] text-sm">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type UnitFilter = "all" | "alerts" | "vacant" | "ending_inferred" | "break_review" | "shops";

function unitSortKey(label: string): number {
  const lo = label.toLowerCase();
  if (lo.includes("shop")) return -1;
  const m = lo.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}

/** Confidence marker — solid filled tick for confirmed, dashed/hollow ring with "?" for inferred. */
function ConfidenceMark({ confidence }: { confidence: Confidence }) {
  if (confidence === "confirmed") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700"
        aria-label="Confirmed"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden className="text-emerald-600">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M7 12.5l3 3 7-7" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Confirmed
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800"
      aria-label="Inferred — needs checking"
    >
      <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden className="text-amber-700">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
        <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">?</text>
      </svg>
      Inferred · needs checking
    </span>
  );
}

function UnitDetailPanel({ unit, derived }: { unit: Unit; derived: UnitDerived }) {
  return (
    <div role="dialog" aria-label={`${unit.label} status`} className="text-left">
      <div className="text-[12px] font-semibold text-slate-900 mb-1.5">{unit.label}</div>
      {derived.items.length === 0 ? (
        <div className="text-[11px] text-slate-500">Let · nothing pending</div>
      ) : (
        <ul className="space-y-1.5">
          {derived.items.map((it) => (
            <li key={it.key} className="text-[11px] leading-snug">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-medium text-slate-800">{it.label}</span>
                {it.value && <span className="text-slate-600">— {it.value}</span>}
              </div>
              <div className="mt-0.5"><ConfidenceMark confidence={it.confidence} /></div>
              {it.note && <div className="mt-0.5 text-[10.5px] text-slate-500">{it.note}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Spoken lines Hobson uses when opening a unit — preserves confirmed/inferred wording. */
function buildUnitOpeningLines(unit: Unit, derived: UnitDerived, propertyName: string): string[] {
  const where = `${unit.label}, ${propertyName}`;
  if (!derived.hasAlert) {
    return [`Here's ${where} — nothing pending right now. What would you like to know?`];
  }
  const lines: string[] = [`Here's ${where}. A couple of things stood out.`];
  const confirmed = derived.items.filter((i) => i.confidence === "confirmed");
  const inferred = derived.items.filter((i) => i.confidence === "inferred");
  confirmed.forEach((it) => {
    if (it.key === "vacant") {
      lines.push(`This unit is vacant — the tenancy is confirmed ended, so it's available to let.`);
    } else if (it.key === "break") {
      lines.push(`There's a break coming on ${it.value}.`);
    } else if (it.key === "review") {
      lines.push(`A rent review is due ${it.value}.`);
    }
  });
  inferred.forEach((it) => {
    if (it.key === "ending-term") {
      lines.push(`The contractual ${it.value}, but I can't see a confirmed ending — so I'm treating this as still let, and rent may still be due. Worth checking whether they've actually vacated.`);
    } else if (it.key === "ending-chain") {
      lines.push(`I've spotted a ${it.value}, but that's a signal — not a confirmed ending. I'm still treating this as let; rent may still be due. Worth checking.`);
    }
  });
  lines.push(`Want me to dig into any of these?`);
  return lines;
}

/** Starter chips driven by the alert items; falls back to generic prompts when nothing's pending. */
function buildUnitStarters(unit: Unit, derived: UnitDerived): string[] {
  if (!derived.hasAlert) {
    return unit.status === "Let"
      ? ["When does the lease expire?", "Any compliance issues?", "Summarise this unit"]
      : ["When did it become vacant?", "Who was the last tenant?", "Any compliance issues?"];
  }
  const chips: string[] = [];
  if (derived.items.some((i) => i.key === "ending-term" || i.key === "ending-chain")) {
    chips.push("Why do you think the tenancy is ending?");
    chips.push("Is rent still due?");
  }
  if (derived.items.some((i) => i.key === "break")) chips.push("When's the break?");
  if (derived.items.some((i) => i.key === "review")) chips.push("When's the review?");
  if (derived.items.some((i) => i.key === "vacant")) {
    chips.push("When did it become vacant?");
    chips.push("Who was the last tenant?");
  }
  chips.push("Summarise this unit");
  return chips;
}

/** Placeholder answer that preserves the confirmed/inferred distinction. */
function answerUnitQuestion(q: string, unit: Unit, derived: UnitDerived): string {
  const lo = q.toLowerCase();
  const inferredEnding = derived.items.find((i) => i.key === "ending-term" || i.key === "ending-chain");
  const breakItem = derived.items.find((i) => i.key === "break");
  const reviewItem = derived.items.find((i) => i.key === "review");
  if (lo.includes("why") && lo.includes("ending") && inferredEnding) {
    return `I haven't confirmed it — it's a signal, not a fact. ${inferredEnding.value ? inferredEnding.value.charAt(0).toUpperCase() + inferredEnding.value.slice(1) + ", " : ""}and I can't see an End-Tenancy, replacement chain or reversionary lease in place. Until one of those exists I'm treating this as still let. Worth a human eye.`;
  }
  if (lo.includes("rent") && inferredEnding) {
    return `I can't say rent has stopped. Because the ending isn't confirmed, the contractual rent may still be due — the term-end date alone doesn't switch it off. Please check before adjusting any ledger.`;
  }
  if (lo.includes("break") && breakItem) {
    return `The next break is ${breakItem.value}. That one's confirmed from the lease.`;
  }
  if (lo.includes("review") && reviewItem) {
    return `The next rent review is ${reviewItem.value}. That's confirmed from the lease.`;
  }
  if (lo.includes("vacant")) {
    return derived.isVacantConfirmed
      ? `Confirmed vacant — the tenancy has a confirmed ending, so it's available to let.`
      : `I don't have a confirmed vacancy for this unit. ${inferredEnding ? "There is an inferred ending signal — needs checking — but until it's confirmed I treat the unit as still let." : "I'd treat it as still let unless there's evidence otherwise."}`;
  }
  if (lo.includes("summar")) {
    const bits = derived.items.map((i) => `${i.label}${i.value ? " (" + i.value + ")" : ""} — ${i.confidence}`);
    return bits.length
      ? `${unit.label}: ${bits.join("; ")}. I'll keep confirmed and inferred items separate so you can act on the confirmed ones and check the inferred ones.`
      : `${unit.label}: nothing pending right now.`;
  }
  return `I'll learn the real answer once your documents are uploaded. For now, the confirmed and inferred items above are what I'd act on.`;
}

/** Persistent "What I've spotted" briefing card pinned at the top of the unit chat. */
function PinnedAlertCard({
  unit,
  derived,
  propertyContextCards = [],
  onManageAtProperty,
}: {
  unit: Unit;
  derived: UnitDerived;
  propertyContextCards?: ActionCard[];
  onManageAtProperty?: () => void;
}) {
  if (!derived.hasAlert && propertyContextCards.length === 0) return null;
  return (
    <div
      role="region"
      aria-label={`Alerts for ${unit.label}`}
      className="sticky top-0 z-10 -mx-5 px-5 py-2.5 bg-white/95 backdrop-blur border-b border-slate-200 space-y-2"
    >
      {derived.hasAlert && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-amber-700">
              <path d="M12 2L1 21h22L12 2zm-1 6h2v8h-2V8zm0 9h2v2h-2v-2z" />
            </svg>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-amber-800">What I've spotted</div>
          </div>
          <ul className="space-y-1.5">
            {derived.items.map((it) => (
              <li key={it.key} className="text-[12px] leading-snug">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-medium text-slate-900">{it.label}</span>
                  {it.value && <span className="text-slate-700">— {it.value}</span>}
                  <ConfidenceMark confidence={it.confidence} />
                </div>
                {it.note && <div className="text-[11px] text-slate-600">{it.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {propertyContextCards.length > 0 && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-indigo-700">
              <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z" />
            </svg>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-indigo-800">Property-wide (affects this unit)</div>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-500 font-medium ml-auto">
              Read-only here
            </span>
          </div>
          <ul className="space-y-1.5">
            {propertyContextCards.map((c) => (
              <li key={c.id} className="text-[12px] leading-snug">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-medium text-slate-900">{c.title.replace(/ —.*$/, "")}</span>
                  <ConfidenceMark confidence={c.confidence} />
                </div>
                <div className="text-[11px] text-slate-600">{c.whyItMatters}</div>
              </li>
            ))}
          </ul>
          {onManageAtProperty && (
            <button
              onClick={onManageAtProperty}
              className="mt-1.5 text-[11px] text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
            >
              Manage at property level →
            </button>
          )}
        </div>
      )}
    </div>
  );
}



function UnitTile({
  unit,
  derived,
  tabIx,
  onOpen,
  scrollRef,
}: {
  unit: Unit;
  derived: UnitDerived;
  tabIx: 0 | -1;
  onOpen: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"below" | "above">("below");
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  // Decide whether to flip to above when opening
  useEffect(() => {
    if (!open) return;
    const btn = btnRef.current;
    const scroller = scrollRef.current;
    if (!btn || !scroller) return;
    const br = btn.getBoundingClientRect();
    const sr = scroller.getBoundingClientRect();
    const spaceBelow = sr.bottom - br.bottom;
    const spaceAbove = br.top - sr.top;
    setPlacement(spaceBelow < 160 && spaceAbove > spaceBelow ? "above" : "below");
  }, [open, scrollRef]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const occupancyLabel = derived.isVacantConfirmed ? "Vacant (confirmed)" : "Let";
  const alertSummary = derived.hasAlert
    ? derived.items.map((i) => `${i.label}${i.value ? " " + i.value : ""} (${i.confidence})`).join("; ")
    : "nothing pending";

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        // close if focus leaves the wrapper entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={btnRef}
        data-uchip
        tabIndex={tabIx}
        onClick={(e) => {
          // Single click on a flagged tile reveals the panel (mobile/keyboard);
          // double-click or Enter still opens the unit. To keep behaviour simple,
          // treat click as "open unit" — panel is shown on hover/focus.
          void e;
          onOpen();
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${unit.label}, ${occupancyLabel}. ${alertSummary}. Open unit.`}
        className="relative w-full flex items-center justify-center px-2 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
      >
        {derived.hasAlert && (
          <span
            aria-hidden
            className="absolute top-1 right-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-100 border border-amber-400 text-amber-700"
            title="Has pending items — hover to view"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L1 21h22L12 2zm0 6l7.5 13h-15L12 8zm-1 4v4h2v-4h-2zm0 5v2h2v-2h-2z" />
            </svg>
          </span>
        )}
        <span className="truncate max-w-full">{unit.label}</span>
      </button>

      {open && (
        <div
          ref={popRef}
          role="tooltip"
          className={`absolute left-1/2 -translate-x-1/2 z-20 w-56 p-2.5 rounded-md border border-slate-200 bg-white shadow-lg ${
            placement === "above" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          <UnitDetailPanel unit={unit} derived={derived} />
        </div>
      )}
    </div>
  );
}

function PropertyContent({
  property,
  propertyActionCards = [],
  expandedCardId,
  setExpandedCardId,
  carriedCardId,
  onOpenUnit,
  onPreviewQuestion,
  onApprove,
  onDefer,
  onDismiss,
  onPerform,
  onReview,
}: {
  property: Property;
  propertyActionCards?: ActionCard[];
  expandedCardId?: string | null;
  setExpandedCardId?: (id: string | null) => void;
  carriedCardId?: string | null;
  onOpenUnit: (id: string, carryCardId?: string) => void;
  onPreviewQuestion: (q: string) => void;
  onApprove?: (id: string) => void;
  onDefer?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onPerform?: (id: string) => void;
  onReview?: (id: string) => void;
}) {
  void onPreviewQuestion;
  const [filter, setFilter] = useState("");
  const [quick, setQuick] = useState<UnitFilter>("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const gridWrapRef = useRef<HTMLDivElement | null>(null);

  const derivedByUnit = useMemo(() => {
    const map = new Map<string, UnitDerived>();
    property.units.forEach((u) => map.set(u.id, deriveUnit(u)));
    return map;
  }, [property.units]);

  const counts = useMemo(() => {
    let alerts = 0, vacant = 0, endingInferred = 0, breakReview = 0;
    property.units.forEach((u) => {
      const d = derivedByUnit.get(u.id)!;
      if (d.hasAlert) alerts += 1;
      if (d.isVacantConfirmed) vacant += 1;
      if (d.isEndingInferred) endingInferred += 1;
      if (d.hasUpcomingBreakOrReview) breakReview += 1;
    });
    const let_ = property.units.length - vacant;
    return { alerts, vacant, endingInferred, breakReview, let: let_ };
  }, [property.units, derivedByUnit]);

  const hasShops = property.units.some((u) => u.label.toLowerCase().includes("shop"));

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return property.units
      .filter((u) => {
        const d = derivedByUnit.get(u.id)!;
        if (quick === "alerts" && !d.hasAlert) return false;
        if (quick === "vacant" && !d.isVacantConfirmed) return false;
        if (quick === "ending_inferred" && !d.isEndingInferred) return false;
        if (quick === "break_review" && !d.hasUpcomingBreakOrReview) return false;
        if (quick === "shops" && !u.label.toLowerCase().includes("shop")) return false;
        if (!q) return true;
        if (q === "vac") return d.isVacantConfirmed;
        if (q === "let") return !d.isVacantConfirmed;
        return (
          u.label.toLowerCase().includes(q) ||
          (u.tenant ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => unitSortKey(a.label) - unitSortKey(b.label));
  }, [property.units, derivedByUnit, filter, quick]);

  const grouped = useMemo(() => {
    const shops: Unit[] = [];
    const flats: Unit[] = [];
    const other: Unit[] = [];
    filtered.forEach((u) => {
      const lo = u.label.toLowerCase();
      if (lo.includes("shop")) shops.push(u);
      else if (lo.includes("flat")) flats.push(u);
      else other.push(u);
    });
    const groups: { key: string; units: Unit[] }[] = [];
    if (shops.length) groups.push({ key: "Shop", units: shops });
    if (flats.length) groups.push({ key: "Flats", units: flats });
    if (other.length) groups.push({ key: "Other", units: other });
    return groups;
  }, [filtered]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const wrap = gridWrapRef.current;
    if (!wrap) return;
    const tiles = Array.from(wrap.querySelectorAll<HTMLButtonElement>("button[data-uchip]"));
    if (!tiles.length) return;
    const idx = tiles.findIndex((t) => t === document.activeElement);
    if (idx < 0) return;
    e.preventDefault();
    // Compute columns from first row's tiles sharing the same offsetTop
    const firstTop = tiles[0].offsetTop;
    let cols = tiles.findIndex((t) => t.offsetTop > firstTop);
    if (cols < 0) cols = tiles.length;
    let next = idx;
    if (e.key === "ArrowRight") next = Math.min(idx + 1, tiles.length - 1);
    else if (e.key === "ArrowLeft") next = Math.max(idx - 1, 0);
    else if (e.key === "ArrowDown") next = Math.min(idx + cols, tiles.length - 1);
    else if (e.key === "ArrowUp") next = Math.max(idx - cols, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tiles.length - 1;
    tiles[next]?.focus();
  };

  const quickBtn = (key: UnitFilter, label: string) => (
    <button
      key={key}
      onClick={() => setQuick(key)}
      className={`text-[11px] px-2.5 py-1 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 ${
        quick === key
          ? "bg-[#7C3AED] text-white border-[#7C3AED]"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
      aria-pressed={quick === key}
    >
      {label}
    </button>
  );

  let tileIndex = 0;

  return (
    <div className="space-y-3">
      <div className="text-[12px] text-slate-600">
        {property.units.length} units · {counts.let} Let · {counts.vacant} Vacant
        {counts.alerts > 0 && <> · <span className="text-amber-700 font-medium">{counts.alerts} with alerts</span></>}
      </div>

      {propertyActionCards.filter((c) => c.approvalState === "pending" || c.approvalState === "in_progress").length > 0 && (
        <PropertyActions
          cards={propertyActionCards.filter((c) => c.approvalState === "pending" || c.approvalState === "in_progress")}
          propertyName={property.name}
          expandedCardId={expandedCardId ?? null}
          setExpandedCardId={(id) => setExpandedCardId && setExpandedCardId(id)}
          carriedCardId={carriedCardId ?? null}
          onOpenUnit={(uid, cardId) => onOpenUnit(uid, cardId)}
          onApprove={(id) => onApprove && onApprove(id)}
          onDefer={(id) => onDefer && onDefer(id)}
          onDismiss={(id) => onDismiss && onDismiss(id)}
          onPerform={onPerform ? (id) => onPerform(id) : undefined}
          onReview={onReview ? (id) => onReview(id) : undefined}
        />
      )}

      <div className="text-[10.5px] text-slate-500 flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden className="text-emerald-600">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path d="M7 12.5l3 3 7-7" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          </svg>
          Confirmed = known fact
        </span>
        <span className="inline-flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden className="text-amber-700">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
            <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">?</text>
          </svg>
          Inferred = signal Hobson spotted, needs checking
        </span>
      </div>

      {property.units.length > 20 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
          </svg>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Find a unit…"
            className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400"
            aria-label="Find a unit by name or tenant"
          />
          {filter && (
            <button
              onClick={() => setFilter("")}
              className="text-slate-400 hover:text-slate-700 text-base leading-none"
              aria-label="Clear filter"
            >
              ×
            </button>
          )}
        </div>
      )}


      <div className="flex flex-wrap gap-1.5">
        {quickBtn("all", `All (${property.units.length})`)}
        {counts.alerts > 0 && quickBtn("alerts", `Has alerts (${counts.alerts})`)}
        {quickBtn("vacant", `Vacant (${counts.vacant})`)}
        {counts.endingInferred > 0 && quickBtn("ending_inferred", `Ending (inferred) (${counts.endingInferred})`)}
        {counts.breakReview > 0 && quickBtn("break_review", `Break/review upcoming (${counts.breakReview})`)}
        {hasShops && quickBtn("shops", "Shops")}
      </div>

      <div
        ref={gridWrapRef}
        onKeyDown={onKeyDown}
        className="max-h-[480px] overflow-y-auto -mx-1 px-1"
      >
        {filtered.length === 0 ? (
          <div className="text-[12px] text-slate-500 py-6 text-center">No matching units</div>
        ) : (
          grouped.map((group) => {
            const isCollapsed = !!collapsed[group.key];
            return (
              <div key={group.key} className="mb-3">
                <button
                  type="button"
                  onClick={() =>
                    setCollapsed((c) => ({ ...c, [group.key]: !c[group.key] }))
                  }
                  className="sticky top-0 z-[1] w-full flex items-center justify-between bg-white/95 backdrop-blur px-1 py-1.5 text-[10px] uppercase tracking-wide text-slate-500 font-medium border-b border-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 rounded"
                  aria-expanded={!isCollapsed}
                >
                  <span>
                    {group.key} · {group.units.length} {group.units.length === 1 ? "unit" : "units"}
                  </span>
                  <span aria-hidden className="text-slate-400">{isCollapsed ? "▸" : "▾"}</span>
                </button>
                {!isCollapsed && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 pt-2">
                    {group.units.map((u) => {
                      const tabIx: 0 | -1 = tileIndex === 0 ? 0 : -1;
                      tileIndex += 1;
                      const d = derivedByUnit.get(u.id)!;
                      return (
                        <UnitTile
                          key={u.id}
                          unit={u}
                          derived={d}
                          tabIx={tabIx}
                          scrollRef={gridWrapRef}
                          onOpen={() => onOpenUnit(u.id)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


function UnitStarters({ unit, onAsk }: { unit: Unit; onAsk: (q: string) => void }) {
  const derived = useMemo(() => deriveUnit(unit), [unit]);
  const qs = useMemo(() => buildUnitStarters(unit, derived), [unit, derived]);
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5">Try asking</div>
      <div className="flex flex-wrap gap-1.5">
        {qs.map((q) => (
          <button
            key={q}
            onClick={() => onAsk(q)}
            className="text-xs px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] hover:bg-[#DDD6FE] transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function LockedComposer({ view }: { view: View }) {
  const placeholder = "Ask Hobson…";
  const helper =
    view === "onboarding"
      ? "Chat unlocks at unit level"
      : "Open a unit to chat with Hobson";
  return (
    <>
      <div className="text-[11px] text-slate-400 mb-1">Locked</div>
      <div
        aria-disabled="true"
        tabIndex={-1}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400 select-none cursor-not-allowed"
        title={helper}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
        </svg>
        <span className="flex-1 truncate text-slate-400">{placeholder}</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400 hidden sm:inline">{helper}</span>
      </div>
    </>
  );
}

/* ---------- Portfolio: first-visit guided ---------- */

function PortfolioFirstVisit({
  showPropertyList,
  showUnitPicker,
  onOpenProperty,
  onOpenUnit,
  onPreviewQuestion,
}: {
  showPropertyList: boolean;
  showUnitPicker: boolean;
  onOpenProperty: (id: string) => void;
  onOpenUnit: (propertyId: string, unitId: string) => void;
  onPreviewQuestion: (q: string) => void;
}) {
  const questions = [
    "Which leases expire this year?",
    "What reviews are due?",
    "What is occupancy?",
    "Which assets carry risk?",
  ];
  return (
    <div className="space-y-3">


      {showPropertyList && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5 mt-2">Properties</div>
          <div className="space-y-1.5">
            {PROPERTIES.map((p) => (
              <button
                key={p.id}
                onClick={() => onOpenProperty(p.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {p.area} · {p.standalone ? "single unit" : `${p.units.length} units`}
                  </div>
                </div>
                <span className="text-[#7C3AED] text-sm">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showUnitPicker && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5 mt-2">All units</div>
          <div className="space-y-3">
            {PROPERTIES.map((p) => (
              <div key={p.id}>
                <div className="text-[11px] font-medium text-slate-500 mb-1">{p.name}</div>
                <div className="space-y-1">
                  {p.units.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => onOpenUnit(p.id, u.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900">{u.label}</div>
                        <div className="text-[11px] text-slate-500">
                          {u.status === "Let" ? (u.tenant ?? "Let") : "Vacant"}
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${u.status === "Let" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {u.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Portfolio: returning launcher ---------- */

type SearchResult =
  | { type: "property"; property: Property }
  | { type: "unit"; property: Property; unit: Unit };

function buildSearchResults(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];
  PROPERTIES.forEach((p) => {
    const propText = `${p.name} ${p.area} ${p.address} ${p.postcode}`.toLowerCase();
    const propMatch = !p.standalone && propText.includes(q);
    if (propMatch) results.push({ type: "property", property: p });
    p.units.forEach((u) => {
      const unitText = `${u.label} ${u.tenant ?? ""} ${p.name} ${p.address} ${p.postcode}`.toLowerCase();
      if (unitText.includes(q)) results.push({ type: "unit", property: p, unit: u });
    });
  });
  return results;
}

function ReturningSearchPanel({
  query,
  setQuery,
  activeIdx,
  setActiveIdx,
  onOpenUnit,
  onOpenProperty,
  onHoverProperty,
  searchRef,
}: {
  query: string;
  setQuery: (s: string) => void;
  activeIdx: number;
  setActiveIdx: (n: number) => void;
  onOpenUnit: (propertyId: string, unitId: string) => void;
  onOpenProperty: (id: string) => void;
  onHoverProperty: (id: string | null) => void;
  searchRef: React.RefObject<HTMLInputElement>;
}) {
  const results = useMemo(() => buildSearchResults(query), [query]);

  useEffect(() => {
    searchRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setActiveIdx(0);
  }, [query, setActiveIdx]);

  const openResult = (r: SearchResult) => {
    if (r.type === "unit") onOpenUnit(r.property.id, r.unit.id);
    else onOpenProperty(r.property.id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(Math.min(activeIdx + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIdx];
      if (r) openResult(r);
    }
  };

  // group results by building
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    results.forEach((r) => {
      const key = r.property.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return Array.from(map.entries());
  }, [results]);

  const recents: { propertyId: string; unitId: string; label: string; sub: string }[] = [
    { propertyId: "stanley", unitId: "stanley-f3", label: "Stanley House — Flat 3", sub: "1115 Finchley Road, NW11" },
    { propertyId: "hamilton", unitId: "hamilton-unit", label: "32 Hamilton Gardens", sub: "NW8" },
  ];

  // flat index lookup for highlighting active row
  let runningIdx = -1;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-full border border-slate-200 bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
          </svg>
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search a unit, property or tenant…"
            className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400"
            aria-label="Search a unit, property or tenant"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {query && (
          <div className="mt-1.5 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            {results.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-500">No matches. Try a tenant, unit or building name.</div>
            ) : (
              grouped.map(([building, items]) => (
                <div key={building}>
                  <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wide text-slate-400 bg-slate-50">{building}</div>
                  {items.map((r) => {
                    runningIdx += 1;
                    const idx = runningIdx;
                    const isActive = idx === activeIdx;
                    return (
                      <button
                        key={`${r.type}-${r.type === "unit" ? r.unit.id : r.property.id}-${idx}`}
                        onMouseEnter={() => {
                          setActiveIdx(idx);
                          onHoverProperty(r.property.id);
                        }}
                        onMouseLeave={() => onHoverProperty(null)}
                        onClick={() => openResult(r)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left transition focus:outline-none ${
                          isActive ? "bg-[#F5F3FF]" : "hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {r.type === "unit" ? r.unit.label : r.property.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {r.type === "unit"
                              ? `${r.property.standalone ? r.property.address : `${r.property.name} · ${r.property.postcode}`}`
                              : `${r.property.area} · ${r.property.units.length} units`}
                          </div>
                        </div>
                        {r.type === "unit" && (
                          <span className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${r.unit.status === "Let" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                            {r.unit.status}
                          </span>
                        )}
                        {r.type === "property" && (
                          <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#5B21B6]">Building</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {!query && (
        <>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5">Jump back in</div>
            <div className="space-y-1.5">
              {recents.map((r) => {
                const p = PROPERTIES.find((x) => x.id === r.propertyId);
                return (
                  <button
                    key={r.unitId}
                    onClick={() => onOpenUnit(r.propertyId, r.unitId)}
                    onMouseEnter={() => onHoverProperty(r.propertyId)}
                    onMouseLeave={() => onHoverProperty(null)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900">{r.label}</div>
                      <div className="text-[11px] text-slate-500">{r.sub}</div>
                    </div>
                    <span className="text-[#7C3AED] text-sm">→</span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-[12px] text-slate-500">Search above, or pick a unit on the map.</p>
        </>
      )}
    </div>
  );
}



/* ---------------- Map search overlay ---------------- */

function MapSearch({
  query,
  setQuery,
  onOpenUnit,
  onOpenProperty,
  onHoverProperty,
}: {
  query: string;
  setQuery: (q: string) => void;
  onOpenUnit: (propertyId: string, unitId: string) => void;
  onOpenProperty: (id: string) => void;
  onHoverProperty: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const reduced = prefersReducedMotion();
  const results = useMemo(() => buildSearchResults(query), [query]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 180);
      return () => window.clearTimeout(t);
    }
  }, [open, reduced]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Click outside / Escape to collapse
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const openResult = (r: SearchResult) => {
    if (r.type === "unit") onOpenUnit(r.property.id, r.unit.id);
    else onOpenProperty(r.property.id);
    setOpen(false);
    setQuery("");
  };

  const collapse = () => {
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      collapse();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(Math.min(activeIdx + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIdx];
      if (r) openResult(r);
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    results.forEach((r) => {
      const key = r.property.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return Array.from(map.entries());
  }, [results]);

  let runningIdx = -1;

  // The pill: stays anchored top-right; width animates from 40px → 360px.
  // The leading magnifier icon is the persistent affordance.
  const pillWidth = open ? 360 : 40;
  const transition = reduced ? "none" : "width 220ms cubic-bezier(0.22,1,0.36,1)";

  return (
    <div
      ref={wrapRef}
      className="absolute top-4 right-4 z-[450]"
      style={{ width: pillWidth, transition }}
    >
      <div
        className={`flex items-center h-10 rounded-full bg-white shadow-md border border-slate-200 overflow-hidden ${
          open ? "pl-2.5 pr-1.5" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => {
            if (open) collapse();
            else setOpen(true);
          }}
          className="shrink-0 w-10 h-10 flex items-center justify-center text-slate-700 hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded-full transition"
          aria-label={open ? "Close search" : "Search properties, units, addresses"}
          aria-expanded={open}
          style={open ? { width: 28, height: 28 } : undefined}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
          </svg>
        </button>

        {open && (
          <>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search a unit, property, address or postcode…"
              className="flex-1 min-w-0 outline-none text-sm bg-transparent placeholder:text-slate-400 px-1"
              aria-label="Search a unit, property, address or postcode"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={collapse}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              aria-label="Close search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </>
        )}
      </div>

      {open && (query || results.length > 0) && (
        <div
          className={`mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden ${
            reduced ? "" : "animate-fade-in"
          }`}
        >
          <div className="max-h-[360px] overflow-y-auto">
            {query && results.length === 0 && (
              <div className="px-3 py-4 text-xs text-slate-500">
                No matches. Try a tenant, unit, postcode or building name.
              </div>
            )}
            {query && grouped.map(([building, items]) => (
              <div key={building}>
                <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wide text-slate-400 bg-slate-50">{building}</div>
                {items.map((r) => {
                  runningIdx += 1;
                  const idx = runningIdx;
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={`${r.type}-${r.type === "unit" ? r.unit.id : r.property.id}-${idx}`}
                      onMouseEnter={() => { setActiveIdx(idx); onHoverProperty(r.property.id); }}
                      onMouseLeave={() => onHoverProperty(null)}
                      onClick={() => openResult(r)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition focus:outline-none ${
                        isActive ? "bg-[#F5F3FF]" : "hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {r.type === "unit" ? r.unit.label : r.property.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {r.type === "unit"
                            ? `${r.property.standalone ? r.property.address : `${r.property.name} · ${r.property.postcode}`}`
                            : `${r.property.area} · ${r.property.units.length} units`}
                        </div>
                      </div>
                      {r.type === "unit" && (
                        <span className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${r.unit.status === "Let" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {r.unit.status}
                        </span>
                      )}
                      {r.type === "property" && (
                        <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#5B21B6]">Building</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



/* ---------- Portfolio briefing (returning) ---------- */

const URGENCY_LABEL: Record<Urgency, string> = {
  now: "Needs you now",
  week: "This week",
  watch: "Keeping an eye on",
};

const TRIGGER_ICON: Record<TriggerType, string> = {
  review: "💬",
  break: "⏸",
  compliance: "✓",
  notice: "✉",
  expiry: "⌛",
};

function PortfolioBriefing({
  cards,
  choice,
  setChoice,
  expandedCardId,
  setExpandedCardId,
  onHoverCard,
  onOpenUnit,
  onOpenProperty,
  onApprove,
  onDefer,
  onDismiss,
  onPerform,
  onReview,
}: {
  cards: ActionCard[];
  choice: null | "all" | "urgent" | "browse";
  setChoice: (c: null | "all" | "urgent" | "browse") => void;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
  onHoverCard: (propertyId: string | null) => void;
  onOpenUnit: (propertyId: string, unitId: string, carryCardId?: string) => void;
  onOpenProperty: (propertyId: string, carryCardId?: string) => void;
  onApprove: (id: string) => void;
  onDefer: (id: string) => void;
  onDismiss: (id: string) => void;
  onPerform?: (id: string) => void;
  onReview?: (id: string) => void;
}) {
  const pending = cards.filter((c) => c.approvalState === "pending" || c.approvalState === "in_progress");
  const urgent = pending.filter((c) => c.urgency === "now");


  // No pending — nothing to show in briefing
  if (pending.length === 0) {
    return (
      <div className="text-[12px] text-slate-500 italic">Nothing on your desk today.</div>
    );
  }

  // Initial chip choice
  if (choice === null) {
    const chips: { label: string; value: "all" | "urgent" | "browse" }[] = [
      { label: `Show me what needs me (${pending.length})`, value: "all" },
      ...(urgent.length ? [{ label: `Just the urgent ${urgent.length === 1 ? "one" : `${urgent.length}`}`, value: "urgent" as const }] : []),
      { label: "I'll browse", value: "browse" as const },
    ];
    return (
      <div className="flex flex-col items-end gap-1.5">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          Tap to reply <span aria-hidden>↓</span>
        </span>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {chips.map((c, i) => (
            <button
              key={c.value}
              onClick={() => setChoice(c.value)}
              autoFocus={i === 0}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED] ${
                i === 0
                  ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-sm"
                  : "bg-[#EDE9FE] text-[#5B21B6] hover:bg-[#DDD6FE] border border-[#DDD6FE]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (choice === "browse") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">Properties</div>
          <button
            onClick={() => setChoice(null)}
            className="text-[11px] text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
          >
            ← Back to briefing
          </button>
        </div>
        <div className="space-y-1.5">
          {PROPERTIES.map((p) => {
            const hasAlert = pending.some((c) => c.propertyId === p.id);
            return (
              <button
                key={p.id}
                onClick={() => {
                  if (p.standalone) onOpenUnit(p.id, p.units[0].id);
                  else onOpenUnit(p.id, p.units[0].id); // open via unit; for non-standalone we still drill in via property
                }}
                onMouseEnter={() => onHoverCard(p.id)}
                onMouseLeave={() => onHoverCard(null)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                    {p.name}
                    {hasAlert && (
                      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-100 border border-amber-400 text-amber-700" aria-label="Has alerts">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2z"/></svg>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">{p.area} · {p.standalone ? "single unit" : `${p.units.length} units`}</div>
                </div>
                <span className="text-[#7C3AED] text-sm">→</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const visible = choice === "urgent" ? urgent : pending;
  const groups: { key: Urgency; cards: ActionCard[] }[] = (["now", "week", "watch"] as Urgency[])
    .map((u) => ({ key: u, cards: visible.filter((c) => c.urgency === u) }))
    .filter((g) => g.cards.length > 0);

  const restCount = pending.length - visible.length;
  const archived = cards.filter((c) => c.approvalState === "approved" || c.approvalState === "deferred" || c.approvalState === "dismissed").length;


  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">On your desk</div>
        <div className="flex items-center gap-2">
          {choice === "urgent" && pending.length > urgent.length && (
            <button
              onClick={() => setChoice("all")}
              className="text-[11px] text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
            >
              Show all ({pending.length})
            </button>
          )}
          <button
            onClick={() => setChoice(null)}
            className="text-[11px] text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.key} className="space-y-2">
          <div className="sticky top-0 z-[1] bg-white/95 backdrop-blur py-1 text-[10px] uppercase tracking-wide font-semibold text-slate-500 border-b border-slate-100">
            {URGENCY_LABEL[g.key]} · {g.cards.length}
          </div>
          {g.cards.map((c) => (
            <ActionCardItem
              key={c.id}
              card={c}
              level="portfolio"
              expanded={expandedCardId === c.id}
              onToggleExpand={() => setExpandedCardId(expandedCardId === c.id ? null : c.id)}
              onHover={(on) => onHoverCard(on ? c.propertyId : null)}
              onOpenUnit={c.anchorLevel === "unit" && c.unitId ? () => onOpenUnit(c.propertyId, c.unitId!, c.id) : undefined}
              onOpenProperty={c.anchorLevel === "property" ? () => onOpenProperty(c.propertyId, c.id) : undefined}
              onApprove={() => onApprove(c.id)}
              onDefer={() => onDefer(c.id)}
              onDismiss={() => onDismiss(c.id)}
              onPerform={onPerform ? () => onPerform(c.id) : undefined}
              onReview={onReview ? () => onReview(c.id) : undefined}
            />
          ))}
        </div>
      ))}

      {restCount > 0 && choice === "urgent" && (
        <button
          onClick={() => setChoice("all")}
          className="w-full text-left text-[12px] text-slate-500 px-3 py-2 rounded-lg border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
        >
          {restCount} more this week →
        </button>
      )}

      {archived > 0 && (
        <div className="text-[11px] text-slate-400 italic px-1">
          {archived} {archived === 1 ? "item" : "items"} handled today.
        </div>
      )}
    </div>
  );
}

/* ---------- Property-level actions (same objects as portfolio briefing) ---------- */

function PropertyActions({
  cards,
  propertyName,
  expandedCardId,
  setExpandedCardId,
  carriedCardId,
  onOpenUnit,
  onApprove,
  onDefer,
  onDismiss,
  onPerform,
  onReview,
}: {
  cards: ActionCard[];
  propertyName: string;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
  carriedCardId?: string | null;
  onOpenUnit: (unitId: string, carryCardId?: string) => void;
  onApprove: (id: string) => void;
  onDefer: (id: string) => void;
  onDismiss: (id: string) => void;
  onPerform?: (id: string) => void;
  onReview?: (id: string) => void;
}) {
  const sortCarried = (arr: ActionCard[]) =>
    carriedCardId
      ? [...arr].sort((a, b) => (a.id === carriedCardId ? -1 : b.id === carriedCardId ? 1 : 0))
      : arr;
  const groups: { key: Urgency; cards: ActionCard[] }[] = (["now", "week", "watch"] as Urgency[])
    .map((u) => ({ key: u, cards: sortCarried(cards.filter((c) => c.urgency === u)) }))
    .filter((g) => g.cards.length > 0);
  return (
    <section aria-label={`Actions for ${propertyName}`} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">On this building's desk · {cards.length}</div>
      </div>
      {groups.map((g) => (
        <div key={g.key} className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
            {URGENCY_LABEL[g.key]} · {g.cards.length}
          </div>
          {g.cards.map((c) => (
            <div key={c.id} className={c.id === carriedCardId ? "rounded-xl ring-2 ring-[#7C3AED]/50 ring-offset-2 ring-offset-white" : ""}>
              <ActionCardItem
                card={c}
                level="property"
                expanded={expandedCardId === c.id}
                onToggleExpand={() => setExpandedCardId(expandedCardId === c.id ? null : c.id)}
                onHover={() => { /* no map hover at property level */ }}
                onOpenUnit={c.anchorLevel === "unit" && c.unitId ? () => onOpenUnit(c.unitId!, c.id) : undefined}
                onApprove={() => onApprove(c.id)}
                onDefer={() => onDefer(c.id)}
                onDismiss={() => onDismiss(c.id)}
                onPerform={onPerform ? () => onPerform(c.id) : undefined}
                onReview={onReview ? () => onReview(c.id) : undefined}
              />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

const PERFORMABLE_CARD_IDS = new Set<string>(["act-stanley-f8-review", "act-stanley-fra"]);

/* ---------------- Perform workspace (PA-004) ---------------- */

type PerformBeat = {
  id: string;
  stepKey: string;            // which progress-rail step this beat belongs to
  text: string;               // narration line
  detail?: React.ReactNode;   // optional rendered block (summary, draft preview)
  flag?: string;              // amber honesty flag
  gate?: {
    label: string;
    options: { label: string; kind: "approve" | "skip" | "defer" | "cancel" | "modify" | "continue"; nextBeatIdx?: number | "complete" | "exit" }[];
  };
};

const PA004_STEPS: { key: string; label: string }[] = [
  { key: "identify", label: "Identify" },
  { key: "gather", label: "Gather" },
  { key: "summary", label: "Review summary" },
  { key: "actions", label: "Recommended actions" },
  { key: "record", label: "Record" },
];

function PA004Summary() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2.5 text-[12.5px] text-slate-700">
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Current Position</div>
        <p>Flat 8, Stanley House · current rent £48,000 p.a. · tenancy ongoing.</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Review Mechanism</div>
        <p>Open Market Rent review, dated March 2027 (confirmed from lease).</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Notice Requirements</div>
        <p className="text-amber-800"><span aria-hidden>⚠ </span>Trigger notice period unclear in the lease — <em>flagged for human eye</em>. Default working assumption: not less than 3 months before review date.</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Previous Review History</div>
        <p>No prior review on file for this tenancy (initial term).</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Supporting Information Required</div>
        <p>Open market comparable evidence — to be sourced. Surveyor instruction to be prepared.</p>
      </div>
    </div>
  );
}

function PreparedPreview({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-[12px] text-slate-700">
      <div className="text-[10px] uppercase tracking-wide text-emerald-800 font-semibold mb-1">Prepared — {title}</div>
      <p className="whitespace-pre-wrap leading-relaxed">{body}</p>
      <div className="mt-1 text-[10.5px] text-slate-500 italic">Draft preview · placeholder content for prototype.</div>
    </div>
  );
}

function buildPA004Beats(): PerformBeat[] {
  // Indexed linearly; gates jump by index to keep authoring simple.
  return [
    {
      id: "b1",
      stepKey: "identify",
      text: "A rent review is coming up on Flat 8 — about 180 days out (March 2027). Want me to prepare it?",
      gate: {
        label: "How would you like to proceed?",
        options: [
          { label: "Prepare review summary", kind: "approve", nextBeatIdx: 1 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
          { label: "Cancel", kind: "cancel", nextBeatIdx: "exit" },
        ],
      },
    },
    { id: "b2", stepKey: "gather", text: "Pulling review details — review basis is Open Market Rent, dated March 2027." },
    { id: "b3", stepKey: "gather", text: "Current rent confirmed: £48,000 per annum (Flat 8)." },
    { id: "b4", stepKey: "gather", text: "Tenancy history: no prior review on file — this is the first scheduled review." },
    {
      id: "b5",
      stepKey: "gather",
      text: "Notice requirements: I can't confirm the precise trigger window from the lease wording.",
      flag: "Flagging notice period as unclear — needs your eye.",
    },
    { id: "b6", stepKey: "gather", text: "Parties confirmed: landlord and current tenant on file." },
    { id: "b7", stepKey: "gather", text: "Open market basis — comparable evidence will need to be sourced before any figure is proposed." },
    {
      id: "b8",
      stepKey: "summary",
      text: "Here's the assembled summary. Take a look.",
      detail: <PA004Summary />,
      gate: {
        label: "Review the summary",
        options: [
          { label: "Looks right, continue", kind: "continue", nextBeatIdx: 8 },
          { label: "Modify", kind: "modify", nextBeatIdx: 8 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "b9",
      stepKey: "actions",
      text: "Recommended next: prepare surveyor instructions to obtain open-market evidence.",
      gate: {
        label: "Prepare surveyor instructions?",
        options: [
          { label: "Approve", kind: "approve", nextBeatIdx: 9 },
          { label: "Skip", kind: "skip", nextBeatIdx: 10 },
        ],
      },
    },
    {
      id: "b9b",
      stepKey: "actions",
      text: "Drafted.",
      detail: <PreparedPreview title="Surveyor instructions" body={"To: [Usual surveyor]\nSubject: Open market rent advice — Flat 8, Stanley House\n\nWe have a rent review falling due in March 2027. Please advise on open market evidence and a suggested range, with comparables for the last 12 months."} />,
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 10 }],
      },
    },
    {
      id: "b10",
      stepKey: "actions",
      text: "Next: gather comparable evidence (last 12 months, like-for-like).",
      gate: {
        label: "Gather comparable evidence?",
        options: [
          { label: "Approve", kind: "approve", nextBeatIdx: 11 },
          { label: "Skip", kind: "skip", nextBeatIdx: 12 },
        ],
      },
    },
    {
      id: "b10b",
      stepKey: "actions",
      text: "Comparable search prepared — request queued for the surveyor and our market data source.",
      detail: <PreparedPreview title="Comparable evidence request" body={"Scope: Marylebone NW8, residential lets, 1-bed flats, last 12 months.\nDeliverable: shortlist of 5–8 comparables with rent, term, condition notes."} />,
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 12 }],
      },
    },
    {
      id: "b11",
      stepKey: "actions",
      text: "Next: prepare the review notice ready to serve once the window opens.",
      gate: {
        label: "Prepare review notice?",
        options: [
          { label: "Approve", kind: "approve", nextBeatIdx: 13 },
          { label: "Skip", kind: "skip", nextBeatIdx: 14 },
        ],
      },
    },
    {
      id: "b11b",
      stepKey: "actions",
      text: "Draft notice prepared — held for service date.",
      detail: <PreparedPreview title="Review notice (draft)" body={"NOTICE OF RENT REVIEW\nProperty: Flat 8, Stanley House\nReview date: March 2027\nBasis: Open Market Rent (per lease)\n\nStatus: held — not yet served. Awaiting confirmed notice window."} />,
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 14 }],
      },
    },
    {
      id: "b12",
      stepKey: "actions",
      text: "Last one: create a review task with the review date and your next checkpoint.",
      gate: {
        label: "Create a review task?",
        options: [
          { label: "Approve", kind: "approve", nextBeatIdx: 15 },
          { label: "Skip", kind: "skip", nextBeatIdx: 16 },
        ],
      },
    },
    {
      id: "b12b",
      stepKey: "actions",
      text: "Task created.",
      detail: <PreparedPreview title="Review task" body={"Title: Flat 8 rent review — checkpoint\nDue: 6 weeks before March 2027 review date\nOwner: you\nLinked: this action, surveyor instruction, draft notice."} />,
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 16 }],
      },
    },
    {
      id: "b13",
      stepKey: "record",
      text: "All set. I'll record what we did and update the card.",
      gate: {
        label: "Record and finish",
        options: [{ label: "Record & close", kind: "continue", nextBeatIdx: "complete" }],
      },
    },
  ];
}

/* ---------------- Perform workspace (PA-001 fire alarm) ---------------- */

const PA001_STEPS: { key: string; label: string }[] = [
  { key: "identify", label: "Identify" },
  { key: "gather", label: "Gather parties" },
  { key: "draft", label: "Draft notices" },
  { key: "send", label: "Send" },
  { key: "record", label: "Record" },
];

type FireAlarmTenant = {
  unitId: string;
  unitLabel: string;
  tenantName: string | null; // null = no contact on file
  email: string | null;
};

// Stanley House occupied units (Let). F8 and Shop are Vacant — excluded entirely.
// F7 deliberately has no contact on file — flagged, not invented.
const STANLEY_FIRE_ALARM_TENANTS: FireAlarmTenant[] = [
  { unitId: "stanley-f1",  unitLabel: "Flat 1",  tenantName: "A. Whitcombe",   email: "a.whitcombe@example.com" },
  { unitId: "stanley-f2",  unitLabel: "Flat 2",  tenantName: "R. Patel",       email: "r.patel@example.com" },
  { unitId: "stanley-f3",  unitLabel: "Flat 3",  tenantName: "M. Lindqvist",   email: "m.lindqvist@example.com" },
  { unitId: "stanley-f4",  unitLabel: "Flat 4",  tenantName: "J. & S. Okafor", email: "okafor.household@example.com" },
  { unitId: "stanley-f5",  unitLabel: "Flat 5",  tenantName: "D. Aronsson",    email: "d.aronsson@example.com" },
  { unitId: "stanley-f6",  unitLabel: "Flat 6",  tenantName: "K. Mendes",      email: "k.mendes@example.com" },
  { unitId: "stanley-f7",  unitLabel: "Flat 7",  tenantName: null,             email: null },
  { unitId: "stanley-f9",  unitLabel: "Flat 9",  tenantName: "P. Chaudhuri",   email: "p.chaudhuri@example.com" },
  { unitId: "stanley-f10", unitLabel: "Flat 10", tenantName: "L. Hartmann",    email: "l.hartmann@example.com" },
  { unitId: "stanley-f11", unitLabel: "Flat 11", tenantName: "T. Nguyen",      email: "t.nguyen@example.com" },
];
const STANLEY_VACANT_UNITS = ["Flat 8", "Shop"];

const FIRE_ALARM_CONTRACTOR = {
  name: "SafeGuard Fire & Alarm Ltd",
  contact: "Stuart Reilly",
  email: "stuart@safeguard-fa.co.uk",
  phone: "020 7946 0118",
};

const FIRE_ALARM_VISIT_WINDOW = "Tue 7 – Thu 9 July 2026, between 9am and 1pm";

function FireAlarmFinding() {
  const occupied = STANLEY_FIRE_ALARM_TENANTS.length;
  const withContact = STANLEY_FIRE_ALARM_TENANTS.filter((t) => t.email).length;
  const missing = STANLEY_FIRE_ALARM_TENANTS.filter((t) => !t.email);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2.5 text-[12.5px] text-slate-700">
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Scope</div>
        <p>Building-wide. The fire alarm system serves Stanley House as a whole — one inspection covers every unit.</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Due</div>
        <p>Certificate expires 12 July 2026 — about 18 days away (confirmed from last year's certificate).</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Contractor</div>
        <p>{FIRE_ALARM_CONTRACTOR.name} · {FIRE_ALARM_CONTRACTOR.contact} · {FIRE_ALARM_CONTRACTOR.email} · {FIRE_ALARM_CONTRACTOR.phone}</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Tenants to notify</div>
        <p>
          {occupied} occupied units across the building — I'll prepare an access notice for each current tenant.
          {" "}{STANLEY_VACANT_UNITS.length > 0 && <>Vacant units excluded: {STANLEY_VACANT_UNITS.join(", ")}.</>}
        </p>
        {missing.length > 0 && (
          <p className="mt-1 text-amber-800">
            <span aria-hidden>⚠ </span>
            {withContact} of {occupied} have a contact on file. Missing: {missing.map((m) => m.unitLabel).join(", ")} — I won't invent contacts; flagged for you.
          </p>
        )}
      </div>
    </div>
  );
}

function ContractorDraft() {
  return (
    <PreparedPreview
      title="Contractor email (1)"
      body={`To: ${FIRE_ALARM_CONTRACTOR.contact} <${FIRE_ALARM_CONTRACTOR.email}>\nSubject: Annual fire alarm inspection — Stanley House, 1115 Finchley Road, NW11\n\nHi ${FIRE_ALARM_CONTRACTOR.contact.split(" ")[0]},\n\nOur certificate for Stanley House expires on 12 July 2026. Please book the annual inspection within the window: ${FIRE_ALARM_VISIT_WINDOW}.\n\nBuilding access: main entrance on Finchley Road, concierge on the door 9am–5pm. 10 occupied units across Flats 1–11 plus the ground-floor Shop (currently vacant). We'll notify each tenant of the access window.\n\nThanks,\n[You]`}
    />
  );
}

function TenantNoticesGroup({ tenants }: { tenants: FireAlarmTenant[] }) {
  const withContact = tenants.filter((t) => t.email);
  const [openId, setOpenId] = useState<string | null>(null);
  const [sharedWindow, setSharedWindow] = useState<string>(FIRE_ALARM_VISIT_WINDOW);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-[12px] text-slate-700">
      <div className="text-[10px] uppercase tracking-wide text-emerald-800 font-semibold mb-1.5">
        Prepared — Tenant access notices ({withContact.length}) · one per occupied unit
      </div>

      <div className="mb-2 bg-white border border-slate-200 rounded-md p-2">
        <label className="block text-[10.5px] uppercase tracking-wide text-slate-500 font-semibold mb-1">
          Shared edit — visit window (applies to all notices)
        </label>
        <input
          type="text"
          value={sharedWindow}
          onChange={(e) => setSharedWindow(e.target.value)}
          className="w-full text-[12px] px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
          aria-label="Shared visit window"
        />
      </div>

      <ul className="divide-y divide-emerald-200/70 bg-white border border-slate-200 rounded-md">
        {withContact.map((t) => {
          const isOpen = openId === t.unitId;
          const body = overrides[t.unitId] ?? defaultTenantNoticeBody(t, sharedWindow);
          return (
            <li key={t.unitId}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : t.unitId)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold" aria-hidden>✓</span>
                  <span className="font-medium text-slate-800 truncate">{t.unitLabel}</span>
                  <span className="text-slate-500 truncate">· {t.tenantName} · {t.email}</span>
                </span>
                <span className="text-[11px] text-[#7C3AED]">{isOpen ? "Hide" : "View / edit"}</span>
              </button>
              {isOpen && (
                <div className="px-2.5 pb-2">
                  <textarea
                    value={body}
                    onChange={(e) => setOverrides((o) => ({ ...o, [t.unitId]: e.target.value }))}
                    rows={7}
                    className="w-full text-[12px] font-mono px-2 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 whitespace-pre-wrap"
                    aria-label={`Notice body for ${t.unitLabel}`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-1.5 text-[10.5px] text-slate-500 italic">Drafts grouped for review · individual edits allowed · shared edits apply to all.</div>
    </div>
  );
}

function defaultTenantNoticeBody(t: FireAlarmTenant, window: string): string {
  return `To: ${t.tenantName} <${t.email}>\nSubject: Access notice — annual fire alarm inspection, ${t.unitLabel}, Stanley House\n\nHi ${(t.tenantName ?? "").split(" ")[0] || "there"},\n\nWe're carrying out the annual fire alarm inspection at Stanley House. The engineer will need brief access to ${t.unitLabel} during the window: ${window}.\n\nThe visit takes around 15 minutes per unit. You don't need to be present if you're happy for the concierge to escort the engineer — just reply to let us know.\n\nThanks,\n[Your landlord]`;
}

function buildPA001Beats(): PerformBeat[] {
  const withContact = STANLEY_FIRE_ALARM_TENANTS.filter((t) => t.email);
  const missing = STANLEY_FIRE_ALARM_TENANTS.filter((t) => !t.email);
  return [
    {
      id: "fa1",
      stepKey: "identify",
      text: `The fire alarm certificate for Stanley House expires on 12 July 2026 — about 18 days away. It covers the whole building. Want me to prepare the inspection?`,
      gate: {
        label: "How would you like to proceed?",
        options: [
          { label: "Prepare", kind: "approve", nextBeatIdx: 1 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
          { label: "Cancel", kind: "cancel", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "fa2",
      stepKey: "gather",
      text: `Gathering the parties. Contractor on file: ${FIRE_ALARM_CONTRACTOR.name} (${FIRE_ALARM_CONTRACTOR.contact}).`,
    },
    {
      id: "fa3",
      stepKey: "gather",
      text: `Stanley House has ${STANLEY_FIRE_ALARM_TENANTS.length} occupied units — I'll notify all current tenants about access. Vacant units (${STANLEY_VACANT_UNITS.join(", ")}) have no tenant to notify, so I'm skipping those.`,
      flag: missing.length > 0
        ? `I couldn't find access contacts for ${missing.map((m) => m.unitLabel).join(" and ")} — I'll draft for the ${withContact.length} I do have and flag the rest for you to handle separately.`
        : undefined,
    },
    {
      id: "fa4",
      stepKey: "gather",
      text: "Here's the building-wide finding.",
      detail: <FireAlarmFinding />,
      gate: {
        label: "Shall I draft the contractor request and the tenant access notices?",
        options: [
          { label: "Draft them", kind: "approve", nextBeatIdx: 4 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "fa5",
      stepKey: "draft",
      text: "Drafted — one contractor email, plus an access notice per occupied unit. Each notice names the unit and the same visit window.",
      detail: (
        <div className="space-y-2">
          <ContractorDraft />
          <TenantNoticesGroup tenants={STANLEY_FIRE_ALARM_TENANTS} />
        </div>
      ),
      gate: {
        label: `Send 1 contractor email and ${withContact.length} tenant notice${withContact.length === 1 ? "" : "s"}?`,
        options: [
          { label: `Send all (1 + ${withContact.length})`, kind: "approve", nextBeatIdx: 5 },
          { label: "Modify drafts", kind: "modify", nextBeatIdx: 4 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "fa6",
      stepKey: "send",
      text: `Sent. Contractor request to ${FIRE_ALARM_CONTRACTOR.contact} at ${FIRE_ALARM_CONTRACTOR.name}; access notices to all ${withContact.length} current tenants (${withContact.map((t) => t.unitLabel).join(", ")}).`,
      flag: missing.length > 0
        ? `${missing.map((m) => m.unitLabel).join(", ")} still need access notice — no contact on file. Handle separately?`
        : undefined,
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 6 }],
      },
    },
    {
      id: "fa7",
      stepKey: "record",
      text: `Recording against Stanley House: contractor instructed, ${withContact.length} tenants notified (with units), date sent today, approved by you. I'll set the next certificate alert so this doesn't re-trigger.`,
      gate: {
        label: "Record and finish",
        options: [{ label: "Record & close", kind: "continue", nextBeatIdx: "complete" }],
      },
    },
  ];
}

function buildPerformConfig(card: ActionCard): {
  beats: PerformBeat[];
  steps: { key: string; label: string }[];
  headerKicker: string;
  headerTitle: string;
  headerSub: string;
} {
  if (card.id === "act-stanley-fra") {
    return {
      beats: buildPA001Beats(),
      steps: PA001_STEPS,
      headerKicker: "Performing action",
      headerTitle: `Fire alarm certification · ${card.propertyName}`,
      headerSub: "Building-wide · expires 12 July 2026 (≈18 days)",
    };
  }
  return {
    beats: buildPA004Beats(),
    steps: PA004_STEPS,
    headerKicker: "Performing action",
    headerTitle: `Rent review · ${card.unitLabel ?? "Flat 8"}, ${card.propertyName}`,
    headerSub: "Due: March 2027 (≈180 days)",
  };
}


function finalGateBeatIdx(card: ActionCard, beats: PerformBeat[]): number {
  // Per-card final unapproved gate.
  if (card.id === "act-stanley-fra") {
    // PA-001 Gate B — "Send?" — beat id "fa5" (index 4)
    const idx = beats.findIndex((b) => b.id === "fa5");
    return idx >= 0 ? idx : 0;
  }
  // Default: the last beat with a gate.
  for (let i = beats.length - 1; i >= 0; i--) {
    if (beats[i].gate) return i;
  }
  return 0;
}

function reviewRecapText(card: ActionCard): string {
  if (card.id === "act-stanley-fra") {
    const n = STANLEY_FIRE_ALARM_TENANTS.filter((t) => t.email).length;
    return `I've done the groundwork on the Stanley House fire alarm — confirmed it's due, found your contractor, and drafted access notices for all ${n} current tenants. It's ready to send — just needs your approval.`;
  }
  return "Here's what I've put together so far. Take a look at the final approval below — that's all that's left.";
}


function PerformWorkspace({
  card,
  mode = "perform",
  onCancel,
  onComplete,
  reducedMotion,
}: {
  card: ActionCard;
  mode?: "perform" | "review";
  onCancel: () => void;
  onComplete: (summary: string) => void;
  reducedMotion: boolean;
}) {
  const { beats, steps, headerTitle, headerSub } = useMemo(() => buildPerformConfig(card), [card]);
  const isComplete = card.approvalState === "approved";
  const initialRevealed = useMemo(() => {
    if (mode === "review" && !isComplete) return finalGateBeatIdx(card, beats);
    if (isComplete) return beats.length - 1;
    return 0;
  }, [mode, isComplete, card, beats]);
  const initialCompleted = useMemo(() => {
    if (mode === "review" || isComplete) {
      const upto = initialRevealed;
      return Array.from(new Set(beats.slice(0, upto).map((b) => b.stepKey)));
    }
    return [];
  }, [mode, isComplete, beats, initialRevealed]);
  const headerKicker =
    isComplete ? "Recorded action" : mode === "review" ? "Reviewing prepared work" : "Performing action";

  const [revealed, setRevealed] = useState<number>(initialRevealed);
  const [streamingText, setStreamingText] = useState<string>("");
  const [streamingActive, setStreamingActive] = useState(false);
  const [approvedActions, setApprovedActions] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>(initialCompleted);
  const [recapOpen, setRecapOpen] = useState<boolean>(mode === "perform");
  const recapNarration = useMemo(() => reviewRecapText(card), [card]);
  const [recapStream, setRecapStream] = useState<string>("");
  const [recapStreaming, setRecapStreaming] = useState<boolean>(mode === "review" && !isComplete);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Stream the colleague-tone recap when entering review mode.
  useEffect(() => {
    if (!(mode === "review" && !isComplete)) return;
    if (reducedMotion) {
      setRecapStream(recapNarration);
      setRecapStreaming(false);
      return;
    }
    setRecapStreaming(true);
    setRecapStream("");
    const words = recapNarration.split(" ");
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i += 1;
      setRecapStream(words.slice(0, i).join(" "));
      if (i < words.length) setTimeout(tick, 32 + Math.random() * 28);
      else setRecapStreaming(false);
    };
    const t = setTimeout(tick, 100);
    return () => { cancelled = true; clearTimeout(t); };
  }, [mode, isComplete, recapNarration, reducedMotion]);

  // Stream a beat's text into view (skip when entering at the parked gate or completed)
  useEffect(() => {
    if (revealed >= beats.length) return;
    const beat = beats[revealed];
    const skipStream = (mode === "review" || isComplete) && revealed === initialRevealed;
    if (reducedMotion || skipStream) {
      setStreamingText(beat.text);
      setStreamingActive(false);
      return;
    }
    setStreamingActive(true);
    setStreamingText("");
    const words = beat.text.split(" ");
    let i = 0;
    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      i += 1;
      setStreamingText(words.slice(0, i).join(" "));
      if (i < words.length) setTimeout(step, 32 + Math.random() * 28);
      else setStreamingActive(false);
    };
    const t = setTimeout(step, 120);
    return () => { cancelled = true; clearTimeout(t); };
  }, [revealed, beats, reducedMotion, mode, isComplete, initialRevealed]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [revealed, streamingText]);

  const currentBeat = beats[revealed];
  const previousBeats = beats.slice(0, revealed);

  const advance = (jumpTo: number | "complete" | "exit" | undefined, gateLabel: string, kind: string) => {
    // Track approved sub-actions for audit
    if (kind === "approve") setApprovedActions((a) => [...a, gateLabel]);
    // Mark current step as completed when we leave it
    const cur = beats[revealed];
    if (cur) setCompleted((c) => Array.from(new Set([...c, cur.stepKey])));

    if (jumpTo === "complete") {
      const summary = approvedActions.length + (kind === "approve" ? 1 : 0) > 0
        ? `summary prepared · ${[...approvedActions, ...(kind === "approve" ? [gateLabel] : [])].length} actions approved · recorded ${new Date().toLocaleDateString("en-GB")}`
        : `summary prepared · recorded ${new Date().toLocaleDateString("en-GB")}`;
      onComplete(summary);
      return;
    }
    if (jumpTo === "exit") { onCancel(); return; }
    if (typeof jumpTo === "number") setRevealed(jumpTo);
    else setRevealed((r) => Math.min(r + 1, beats.length));
  };

  const currentStepIdx = steps.findIndex((s) => s.key === currentBeat?.stepKey);

  return (
    <div className={`absolute inset-0 z-[600] bg-white flex flex-col ${reducedMotion ? "" : "animate-fade-in"}`}>
      {/* Header */}
      <header className="border-b border-slate-200 px-5 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{headerKicker}</div>
          <h2 className="text-[15px] font-semibold text-slate-900 leading-tight truncate">{headerTitle}</h2>
          <div className="text-[12px] text-slate-500 mt-0.5">{headerSub}</div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300 inline-flex items-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to map
        </button>
      </header>

      {/* Progress rail */}
      <nav aria-label="Progress" className="px-5 py-2.5 border-b border-slate-100 bg-slate-50">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
          {steps.map((s, i) => {
            const isDone = completed.includes(s.key);
            const isCurrent = currentBeat?.stepKey === s.key;
            return (
              <li key={s.key} className="flex items-center gap-2">
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${
                    isDone
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : isCurrent
                      ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                      : "bg-white border-slate-200 text-slate-500"
                  }`}
                >
                  <span aria-hidden className="w-4 h-4 rounded-full grid place-items-center text-[10px] font-bold">
                    {isDone ? "✓" : i + 1}
                  </span>
                  {s.label}
                </span>
                {i < steps.length - 1 && <span aria-hidden className="text-slate-300">→</span>}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Beats scroller */}
      <div ref={scrollerRef} className="flex-1 overflow-auto px-5 py-4 space-y-3 bg-white">
        {mode === "review" && !isComplete && (
          <div className="flex items-start gap-2">
            <OwlAvatar state={recapStreaming ? "talking" : "default"} />
            <div className="inline-block max-w-[640px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
              {recapStream || (reducedMotion ? recapNarration : "")}
              {recapStreaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
            </div>
          </div>
        )}
        {(mode === "review" || isComplete) && previousBeats.length > 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setRecapOpen((o) => !o)}
              aria-expanded={recapOpen}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded-lg"
            >
              <span className="text-[12px] font-medium text-slate-700 inline-flex items-center gap-2">
                <span aria-hidden className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓</span>
                {isComplete
                  ? `Recorded — ${previousBeats.length + 1} steps complete`
                  : `Recap — ${previousBeats.length} steps already done, parked at the final approval`}
              </span>
              <span className="text-[11px] text-[#7C3AED]">{recapOpen ? "Hide details" : "Show details"}</span>
            </button>
            {recapOpen && (
              <div className="px-3 pb-3 pt-1 space-y-3 border-t border-slate-200">
                {previousBeats.map((b) => (
                  <BeatBubble key={b.id} beat={b} done />
                ))}
              </div>
            )}
          </div>
        ) : (
          previousBeats.map((b) => <BeatBubble key={b.id} beat={b} done />)
        )}
        {currentBeat && (
          <BeatBubble
            beat={currentBeat}
            streamingText={streamingActive ? streamingText : currentBeat.text}
            streaming={streamingActive}
            done={false}
          />
        )}
        {isComplete && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-900">
            This action is complete and recorded. Read-only summary above.
          </div>
        )}
      </div>

      {/* Gate */}
      {currentBeat && !streamingActive && !isComplete && (
        <footer className="border-t border-slate-200 px-5 py-3 bg-white">
          {currentBeat.gate ? (
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">{currentBeat.gate.label}</div>
              <div className="flex flex-wrap gap-1.5">
                {currentBeat.gate.options.map((opt, idx) => {
                  const primary = opt.kind === "approve" || opt.kind === "continue";
                  const cls = primary
                    ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:ring-[#7C3AED]"
                    : opt.kind === "cancel"
                    ? "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent focus:ring-slate-300"
                    : "text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300";
                  return (
                    <button
                      key={opt.label + idx}
                      autoFocus={idx === 0}
                      onClick={() => advance(opt.nextBeatIdx, opt.label, opt.kind)}
                      className={`text-xs px-3 py-1.5 rounded-full transition focus:outline-none focus:ring-2 ${cls}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                autoFocus
                onClick={() => advance(undefined, "continue", "continue")}
                className="text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              >
                Continue
              </button>
            </div>
          )}
        </footer>
      )}
      {isComplete && (
        <footer className="border-t border-slate-200 px-5 py-3 bg-white flex justify-end">
          <button
            onClick={onCancel}
            className="text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            Close
          </button>
        </footer>
      )}
    </div>
  );
}

function BeatBubble({ beat, streamingText, streaming, done }: { beat: PerformBeat; streamingText?: string; streaming?: boolean; done: boolean }) {
  const text = streamingText ?? beat.text;
  return (
    <div className={`flex items-start gap-2 ${done ? "opacity-80" : ""}`}>
      <OwlAvatar state={streaming ? "talking" : "default"} />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="inline-block max-w-[640px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
          {text}
          {streaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
        </div>
        {!streaming && beat.flag && (
          <div className="inline-flex items-start gap-1.5 max-w-[640px] text-[12px] text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
            <span aria-hidden>⚠</span>
            <span>{beat.flag}</span>
          </div>
        )}
        {!streaming && beat.detail && <div className="max-w-[640px]">{beat.detail}</div>}
      </div>
    </div>
  );
}



function ActionCardItem({
  card,
  level,
  expanded,
  onToggleExpand,
  onHover,
  onOpenUnit,
  onOpenProperty,
  onApprove,
  onDefer,
  onDismiss,
  onManageAtProperty,
  onPerform,
  onReview,
}: {
  card: ActionCard;
  level: "portfolio" | "property" | "unit";
  expanded: boolean;
  onToggleExpand: () => void;
  onHover: (on: boolean) => void;
  onOpenUnit?: () => void;
  onOpenProperty?: () => void;
  onApprove: () => void;
  onDefer: () => void;
  onDismiss: () => void;
  onManageAtProperty?: () => void;
  onPerform?: () => void;
  onReview?: () => void;
}) {
  const isInferred = card.confidence === "inferred";
  // Property-anchored shown inside a unit = read-only context
  const readOnly = level === "unit" && card.anchorLevel === "property";
  const locationLabel = locationLabelForCard(card, level);
  const anchorChip =
    card.anchorLevel === "property"
      ? { label: "Property-anchored", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" }
      : { label: "Unit-anchored", cls: "bg-slate-50 text-slate-600 border-slate-200" };
  return (
    <article
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`rounded-xl border bg-white p-3 transition ${
        readOnly
          ? "border-indigo-200 bg-indigo-50/30"
          : isInferred ? "border-amber-200" : "border-slate-200 hover:border-[#7C3AED]/40"
      }`}
    >
      <div className="flex flex-wrap items-center gap-1 mb-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${anchorChip.cls}`}>
          {locationLabel}
        </span>
        <span className="text-[10px] text-slate-400">·</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">{anchorChip.label}</span>
        {readOnly && (
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-500 font-medium ml-auto">
            Read-only here
          </span>
        )}
      </div>
      <header className="flex items-start gap-2 mb-1.5">
        <span aria-hidden className="text-base leading-none mt-0.5">{TRIGGER_ICON[card.triggerType]}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-slate-900 leading-snug">{card.title}</div>
          <div className="mt-0.5"><ConfidenceMark confidence={card.confidence} /></div>
        </div>
      </header>

      <p className="text-[12.5px] text-slate-700 leading-relaxed mb-1.5">{card.whyItMatters}</p>
      <p className="text-[12px] text-slate-500 leading-relaxed mb-2 italic">{card.hobsonPrepared}</p>

      {readOnly ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onManageAtProperty}
            className="text-xs px-3 py-1.5 rounded-full bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Manage at {card.propertyName} level →
          </button>
        </div>
      ) : !expanded && (
        <div className="flex flex-wrap items-center gap-1.5">
          {!isInferred ? (() => {
            const performable = PERFORMABLE_CARD_IDS.has(card.id);
            const state = card.approvalState;
            if (performable && onReview) {
              const disabled = state === "pending";
              const label = state === "approved" ? "View recorded outcome" : card.proposedAction;
              const tip = disabled
                ? "Nothing to review yet — Perform this first"
                : state === "approved"
                ? "Open the recorded outcome"
                : "Jump to the final approval";
              return (
                <button
                  onClick={disabled ? undefined : onReview}
                  disabled={disabled}
                  aria-disabled={disabled}
                  title={tip}
                  className={`text-xs px-3 py-1.5 rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED] inline-flex items-center gap-1 ${
                    disabled
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60"
                      : "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
                  }`}
                >
                  {!disabled && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 13l4 4L19 7"/></svg>
                  )}
                  {label}
                </button>
              );
            }
            return (
              <button
                onClick={onToggleExpand}
                className="text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              >
                {card.proposedAction}
              </button>
            );
          })() : onOpenUnit ? (
            <>
              <button
                onClick={onOpenUnit}
                className="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Open unit to check
              </button>
              <button
                onClick={onDefer}
                className="text-xs px-3 py-1.5 rounded-full text-slate-600 border border-slate-200 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Flag for review
              </button>
            </>
          ) : (
            <button
              onClick={onDefer}
              className="text-xs px-3 py-1.5 rounded-full text-slate-600 border border-slate-200 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Flag for review
            </button>
          )}
          {!isInferred && onPerform && PERFORMABLE_CARD_IDS.has(card.id) && card.approvalState !== "approved" && (
            <button
              onClick={onPerform}
              className="text-xs px-3 py-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 inline-flex items-center gap-1"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="6 4 20 12 6 20 6 4" /></svg>
              {card.approvalState === "in_progress" ? "Resume" : "Perform"}
            </button>
          )}
          {!isInferred && onOpenUnit && (
            <button
              onClick={onOpenUnit}
              className="text-xs px-3 py-1.5 rounded-full text-slate-600 border border-slate-200 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Open unit
            </button>
          )}
          {!isInferred && onOpenProperty && (
            <button
              onClick={onOpenProperty}
              className="text-xs px-3 py-1.5 rounded-full text-slate-600 border border-slate-200 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Open property
            </button>
          )}
          <button
            onClick={onDefer}
            className="text-xs px-2.5 py-1.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Defer
          </button>
          <button
            onClick={onDismiss}
            className="text-xs px-2.5 py-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {!readOnly && expanded && !isInferred && (
        <div className="mt-2 rounded-lg border border-[#DDD6FE] bg-[#F5F3FF] p-2.5 space-y-2">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#5B21B6] font-semibold mb-1">What I'll do</div>
            <p className="text-[12px] text-slate-700 leading-relaxed">{card.preparedDetail}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={onApprove}
              autoFocus
              className="text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              Approve
            </button>
            <button
              onClick={onToggleExpand}
              className="text-xs px-3 py-1.5 rounded-full text-slate-600 border border-slate-200 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Modify
            </button>
            <button
              onClick={onToggleExpand}
              className="text-xs px-3 py-1.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/* ---------------- styles ---------------- */


function StyleTag() {
  return (
    <style>{`
      .hobson-proto { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }

      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
        30% { transform: translateY(-3px); opacity: 1; }
      }
      .animate-typing-bounce { animation: typingBounce 1.1s infinite ease-in-out; }

      .hp-marker { background: transparent !important; border: none !important; }
      .leaflet-tooltip.hp-tooltip {
        background: #1F2330; color: #fff; border: none; border-radius: 6px;
        padding: 4px 8px; font-size: 11px; font-weight: 500; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        white-space: nowrap;
      }
      .leaflet-tooltip.hp-tooltip::before { border-top-color: #1F2330; }

      /* Overlap spiderfy: pin keeps its true identity & count; thin connector shows true location */
      .hp-marker.is-overlap-spread .hp-cluster,
      .hp-marker.is-overlap-spread .hp-pin {
        box-shadow: 0 0 0 2px rgba(148,163,184,0.45), 0 2px 6px rgba(0,0,0,0.18);
      }
      .hp-pin {
        width: 28px; height: 38px; position: relative;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));
        transition: transform .2s;
      }
      .hp-pin::before {
        content: ""; position: absolute; inset: 0;
        background: #111827;
        clip-path: path("M14 0C6.27 0 0 6.27 0 14c0 9.5 14 24 14 24s14-14.5 14-24C28 6.27 21.73 0 14 0z");
      }
      .hp-pin-dot {
        position: absolute; left: 50%; top: 11px; transform: translateX(-50%);
        width: 8px; height: 8px; border-radius: 999px; background: #fff;
      }
      .hp-cluster {
        width: 38px; height: 38px; border-radius: 999px;
        background: #7C3AED; color: #fff; display: grid; place-items: center;
        font-weight: 700; font-size: 14px; box-shadow: 0 2px 6px rgba(124,58,237,0.4);
        border: 3px solid #fff;
        transition: transform .2s;
      }
      .hp-marker.is-pulse .hp-pin,
      .hp-marker.is-pulse .hp-cluster {
        animation: pinPulse 1.4s ease-in-out infinite;
      }
      @keyframes pinPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.18); }
      }
      .hp-marker.is-dim { opacity: 0.35; }
      .hp-marker.is-spread .hp-pin,
      .hp-marker.is-spread .hp-cluster {
        animation: spreadPulse 1.8s ease-in-out infinite;
        box-shadow: 0 0 0 0 rgba(124,58,237,0.5);
      }
      @keyframes spreadPulse {
        0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.55); }
        100% { box-shadow: 0 0 0 18px rgba(124,58,237,0); }
      }
      .hp-marker.has-doc::after {
        content: "📄"; position: absolute; top: -6px; right: -10px;
        background: #fff; border-radius: 999px; width: 22px; height: 22px;
        display: grid; place-items: center; font-size: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        animation: docIn .4s ease-out;
      }
      .hp-marker.is-check::after {
        content: "✓"; position: absolute; top: -6px; right: -10px;
        background: #10b981; color:#fff; border-radius: 999px; width: 22px; height: 22px;
        display: grid; place-items: center; font-size: 13px; font-weight: 700;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        animation: docIn .4s ease-out;
      }
      @keyframes docIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
      .hp-marker.is-fade { opacity: 0.25; transition: opacity .25s; }
      .hp-unit-marker { background: transparent !important; border: none !important; }
      .hp-unit {
        padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 600;
        color: #1F2330; background: #fff; border: 1.5px solid #7C3AED;
        box-shadow: 0 2px 4px rgba(0,0,0,0.12);
        white-space: nowrap; text-align: center;
        transition: transform .15s, box-shadow .15s, background .15s;
        cursor: pointer;
      }
      .hp-unit.is-vacant { border-color: #94a3b8; color: #475569; }
      .hp-unit:hover { transform: scale(1.08); box-shadow: 0 3px 8px rgba(124,58,237,0.35); }
      .hp-unit-marker.is-active .hp-unit {
        background: #7C3AED; color: #fff; border-color: #7C3AED;
        box-shadow: 0 0 0 4px rgba(124,58,237,0.25);
      }
      .hp-marker.is-match .hp-pin,
      .hp-marker.is-match .hp-cluster {
        filter: drop-shadow(0 0 6px rgba(124,58,237,0.55));
        transform: scale(1.12);
        transition: transform .2s, filter .2s;
      }
      .hp-marker.is-hover .hp-pin,
      .hp-marker.is-hover .hp-cluster {
        transform: scale(1.2);
        transition: transform .15s;
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-typing-bounce, .hp-marker.is-pulse .hp-pin,
        .hp-marker.is-pulse .hp-cluster, .hp-marker.is-spread .hp-pin,
        .hp-marker.is-spread .hp-cluster { animation: none !important; }
        .hp-marker.is-match .hp-pin, .hp-marker.is-match .hp-cluster,
        .hp-marker.is-hover .hp-pin, .hp-marker.is-hover .hp-cluster { transform: none !important; }
      }
    `}</style>
  );
}


/* ---------------- What I've done panel ---------------- */

type WorkLogEntry = {
  id: string;
  cardId?: string;
  title: string;
  propertyId?: string;
  propertyName?: string;
  unitId?: string;
  unitLabel?: string;
  when: string;            // human framing, e.g. "Yesterday, 4:12pm"
  bucket: "Today" | "Yesterday" | "Last week" | "Earlier";
  statusLabel: string;     // "Waiting on you", "Finished", "Paused — you deferred this", "2 of 4 steps complete"
  statusKind: "waiting" | "in_progress" | "finished" | "paused";
  narration: string;       // first-person recap paragraph
  approvals: string[];     // "Approved by you — surveyor instructions"
  flags: string[];         // unknowns honestly flagged
  progressDone: number;
  progressTotal: number;
  dialogue: { role: "user" | "hobson"; text: string }[];
  hasSummary?: boolean;
};

function buildWorkLog(actionCards: ActionCard[]): WorkLogEntry[] {
  const f8 = actionCards.find((c) => c.id === "act-stanley-f8-review");
  const f8State = f8?.approvalState ?? "pending";

  // Dynamic Flat 8 rent review entry — reflects card state
  let f8Entry: WorkLogEntry;
  if (f8State === "approved") {
    f8Entry = {
      id: "log-stanley-f8-review",
      cardId: "act-stanley-f8-review",
      title: "Rent review — Flat 8, Stanley House",
      propertyId: "stanley",
      propertyName: "Stanley House",
      unitId: "stanley-f8",
      unitLabel: "Flat 8",
      when: "Today, just now",
      bucket: "Today",
      statusLabel: "Finished",
      statusKind: "finished",
      narration:
        "I prepared the rent review for Flat 8, Stanley House. I read the lease, confirmed the Open Market basis and the March 2027 date, and pulled comparable evidence from the last 12 months. You approved the surveyor instructions and the review notice — both are out and the file is updated.",
      approvals: ["Approved by you — surveyor instructions", "Approved by you — review notice to tenant"],
      flags: ["Notice period in the lease is ambiguous — I noted it on file so you have it next time."],
      progressDone: 4,
      progressTotal: 4,
      hasSummary: true,
      dialogue: [
        { role: "user", text: "Perform" },
        { role: "hobson", text: "I'll work through the Flat 8 rent review with you. First — the lease basis." },
        { role: "hobson", text: "Open Market review, confirmed in clause 5.2. Review date 25 March 2027." },
        { role: "user", text: "Approve — prepare review summary" },
        { role: "hobson", text: "Done. I've pulled three comparables from the last 12 months and drafted surveyor instructions." },
        { role: "user", text: "Approve surveyor instructions" },
        { role: "hobson", text: "Sent. Drafting the review notice now — couldn't pin down the exact notice period, flagging that." },
        { role: "user", text: "Approve review notice" },
        { role: "hobson", text: "Notice prepared and recorded. I've saved everything to the Flat 8 file." },
      ],
    };
  } else if (f8State === "in_progress") {
    f8Entry = {
      id: "log-stanley-f8-review",
      cardId: "act-stanley-f8-review",
      title: "Rent review — Flat 8, Stanley House",
      propertyId: "stanley",
      propertyName: "Stanley House",
      unitId: "stanley-f8",
      unitLabel: "Flat 8",
      when: "Today, in progress",
      bucket: "Today",
      statusLabel: "Waiting on you — 2 of 4 steps complete",
      statusKind: "waiting",
      narration:
        "I started the rent review for Flat 8, Stanley House. I read the lease, confirmed the Open Market basis and the March 2027 date, and pulled comparable evidence from the last 12 months. I've paused at the surveyor instructions for your approval. I couldn't confirm the notice period, so I've flagged that for you.",
      approvals: [],
      flags: ["Notice period in the lease is ambiguous — needs your eye before I send the notice."],
      progressDone: 2,
      progressTotal: 4,
      dialogue: [
        { role: "user", text: "Perform" },
        { role: "hobson", text: "I'll work through the Flat 8 rent review with you. First — the lease basis." },
        { role: "hobson", text: "Open Market review, confirmed in clause 5.2. Review date 25 March 2027." },
        { role: "user", text: "Approve — prepare review summary" },
        { role: "hobson", text: "Done. I've pulled three comparables and drafted surveyor instructions for you to approve." },
      ],
    };
  } else {
    f8Entry = {
      id: "log-stanley-f8-review",
      cardId: "act-stanley-f8-review",
      title: "Rent review — Flat 8, Stanley House",
      propertyId: "stanley",
      propertyName: "Stanley House",
      unitId: "stanley-f8",
      unitLabel: "Flat 8",
      when: "Today, ready when you are",
      bucket: "Today",
      statusLabel: "Waiting on you — not started",
      statusKind: "waiting",
      narration:
        "I've prepared the rent review for Flat 8, Stanley House — lease read, basis and date confirmed, comparables pulled. It's ready for you to walk through with me whenever you have a minute.",
      approvals: [],
      flags: ["Notice period in the lease looks ambiguous — I'll flag it again when we get there."],
      progressDone: 0,
      progressTotal: 4,
      dialogue: [
        { role: "hobson", text: "Flat 8 rent review is ready to perform when you are." },
      ],
    };
  }

  const epcEntry: WorkLogEntry = {
    id: "log-nugent-shop-epc",
    cardId: "act-nugent-shop-epc",
    title: "EPC instruction — Shop, 5 Nugent Terrace",
    propertyId: "nugent",
    propertyName: "5 Nugent Terrace",
    unitId: "nugent-shop",
    unitLabel: "Shop",
    when: "Yesterday, 4:12pm",
    bucket: "Yesterday",
    statusLabel: "Finished",
    statusKind: "finished",
    narration:
      "I drafted the EPC re-inspection instruction for the Shop at 5 Nugent Terrace, using your usual assessor and the previous rating for context. You approved it, I sent it, and I've put the re-inspection on the compliance calendar so the new certificate lands before the August expiry.",
    approvals: ["Approved by you — assessor instruction"],
    flags: [],
    progressDone: 3,
    progressTotal: 3,
    hasSummary: true,
    dialogue: [
      { role: "user", text: "Perform" },
      { role: "hobson", text: "EPC for the Shop expires 18 August. I've drafted the instruction to your usual assessor — want me to send?" },
      { role: "user", text: "Approve" },
      { role: "hobson", text: "Sent. I've copied you and added the re-inspection to the compliance calendar." },
    ],
  };

  const breakEntry: WorkLogEntry = {
    id: "log-stanley-f6-break",
    cardId: "act-stanley-f6-break",
    title: "Break review — Flat 6, Stanley House",
    propertyId: "stanley",
    propertyName: "Stanley House",
    unitId: "stanley-f6",
    unitLabel: "Flat 6",
    when: "Last week, Tue 16 June",
    bucket: "Last week",
    statusLabel: "Paused — you deferred this",
    statusKind: "paused",
    narration:
      "I prepared the break-review for Flat 6 — drafted the courtesy reminder for the tenant and a file note for you summarising the break terms. You deferred it; I'll bring it back closer to November when the notice window opens.",
    approvals: [],
    flags: [],
    progressDone: 1,
    progressTotal: 3,
    dialogue: [
      { role: "hobson", text: "Tenant break on 2 May 2027. I've drafted a courtesy reminder and a file note." },
      { role: "user", text: "Defer" },
      { role: "hobson", text: "No problem — I'll bring this back when the notice window opens in November." },
    ],
  };

  // Waiting/in-progress first, then completed, then paused
  const order = (e: WorkLogEntry) => ({ waiting: 0, in_progress: 1, finished: 2, paused: 3 }[e.statusKind]);
  return [f8Entry, epcEntry, breakEntry].sort((a, b) => order(a) - order(b));
}

function WhatIveDonePanel({
  actionCards,
  onClose,
  onResume,
  onOpenProperty,
  onOpenUnit,
  reducedMotion,
}: {
  actionCards: ActionCard[];
  onClose: () => void;
  onResume: (cardId: string) => void;
  onOpenProperty: (propertyId: string) => void;
  onOpenUnit: (unitId: string, propertyId: string) => void;
  reducedMotion: boolean;
}) {
  const entries = useMemo(() => buildWorkLog(actionCards), [actionCards]);
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id ?? null);

  const grouped: Record<string, WorkLogEntry[]> = {};
  for (const e of entries) {
    (grouped[e.bucket] ||= []).push(e);
  }
  const order: WorkLogEntry["bucket"][] = ["Today", "Yesterday", "Last week", "Earlier"];

  return (
    <div
      className={`absolute inset-0 z-[600] bg-white flex flex-col ${reducedMotion ? "" : "animate-fade-in"}`}
      role="region"
      aria-label="What I've done"
    >
      <header className="border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img src={owlDefault} alt="" aria-hidden className="w-10 h-10 object-contain mt-0.5" />
          <div>
            <h2 className="text-[17px] font-semibold text-slate-900 leading-tight">What I've done</h2>
            <p className="text-[13px] text-slate-600 mt-0.5 max-w-xl">
              Here's what I've been getting through for you — and what's still waiting on you. Open any one to see the conversation we had.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded-md p-1"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5 bg-slate-50/40">
        <div className="max-w-3xl mx-auto space-y-7">
          {order.map((bucket) => {
            const list = grouped[bucket];
            if (!list || list.length === 0) return null;
            return (
              <section key={bucket} aria-labelledby={`bucket-${bucket}`}>
                <h3 id={`bucket-${bucket}`} className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-2">
                  {bucket}
                </h3>
                <ul className="space-y-3">
                  {list.map((e) => (
                    <li key={e.id}>
                      <WorkLogCard
                        entry={e}
                        expanded={expandedId === e.id}
                        onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)}
                        onResume={onResume}
                        onOpenProperty={onOpenProperty}
                        onOpenUnit={onOpenUnit}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ kind, label }: { kind: WorkLogEntry["statusKind"]; label: string }) {
  // Status by label + shape, not colour alone
  const shape: Record<WorkLogEntry["statusKind"], { icon: React.ReactNode; cls: string }> = {
    waiting: {
      icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
      cls: "bg-amber-50 border-amber-300 text-amber-900",
    },
    in_progress: {
      icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3"/></svg>,
      cls: "bg-sky-50 border-sky-300 text-sky-900",
    },
    finished: {
      icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>,
      cls: "bg-emerald-50 border-emerald-300 text-emerald-900",
    },
    paused: {
      icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 5v14M16 5v14"/></svg>,
      cls: "bg-slate-100 border-slate-300 text-slate-700",
    },
  };
  const s = shape[kind];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.cls}`}>
      {s.icon}
      {label}
    </span>
  );
}

function WorkLogCard({
  entry,
  expanded,
  onToggle,
  onResume,
  onOpenProperty,
  onOpenUnit,
}: {
  entry: WorkLogEntry;
  expanded: boolean;
  onToggle: () => void;
  onResume: (cardId: string) => void;
  onOpenProperty: (pid: string) => void;
  onOpenUnit: (uid: string, pid: string) => void;
}) {
  const canResume = entry.statusKind === "waiting" || entry.statusKind === "in_progress" || entry.statusKind === "paused";
  return (
    <article className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusPill kind={entry.statusKind} label={entry.statusLabel} />
              <span className="text-[11px] text-slate-500">{entry.when}</span>
            </div>
            <h4 className="mt-1.5 text-[14px] font-semibold text-slate-900 leading-snug">{entry.title}</h4>
            <p className="mt-1.5 text-[13px] text-slate-700 leading-relaxed">{entry.narration}</p>

            {(entry.approvals.length > 0 || entry.flags.length > 0) && (
              <ul className="mt-2 space-y-1 text-[12px]">
                {entry.approvals.map((a, i) => (
                  <li key={`a-${i}`} className="flex items-start gap-1.5 text-emerald-800">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M5 13l4 4L19 7"/></svg>
                    <span>{a}</span>
                  </li>
                ))}
                {entry.flags.map((f, i) => (
                  <li key={`f-${i}`} className="flex items-start gap-1.5 text-amber-900">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M12 9v4M12 17h.01M10.3 3.86l-8.18 14.2A2 2 0 003.84 21h16.32a2 2 0 001.72-2.94L13.7 3.86a2 2 0 00-3.4 0z"/></svg>
                    <span>Flagged — {f}</span>
                  </li>
                ))}
              </ul>
            )}

            {entry.progressTotal > 0 && (
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1.5 bg-slate-100 rounded-full flex-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${entry.statusKind === "finished" ? "bg-emerald-500" : entry.statusKind === "paused" ? "bg-slate-400" : "bg-[#7C3AED]"}`}
                    style={{ width: `${Math.round((entry.progressDone / entry.progressTotal) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                  {entry.progressDone} of {entry.progressTotal} steps
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {canResume && entry.cardId && (
            <button
              onClick={() => onResume(entry.cardId!)}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            >
              Resume
            </button>
          )}
          {entry.hasSummary && (
            <button
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
              onClick={() => { /* prepared output preview — placeholder for prototype */ }}
            >
              View summary
            </button>
          )}
          {entry.unitId && entry.propertyId && (
            <button
              onClick={() => onOpenUnit(entry.unitId!, entry.propertyId!)}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            >
              Open {entry.unitLabel ?? "unit"}
            </button>
          )}
          {entry.propertyId && !entry.unitId && (
            <button
              onClick={() => onOpenProperty(entry.propertyId!)}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            >
              Open property
            </button>
          )}
          <button
            onClick={onToggle}
            aria-expanded={expanded}
            className="ml-auto text-[12px] font-medium text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1"
          >
            {expanded ? "Hide our conversation" : "Show our conversation"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 space-y-2">
          {entry.dialogue.map((d, i) =>
            d.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] bg-[#7C3AED] text-white text-[13px] leading-relaxed px-3 py-2 rounded-2xl rounded-br-md">
                  {d.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-2">
                <img src={owlDefault} alt="" aria-hidden className="w-6 h-6 object-contain mt-0.5" />
                <div className="max-w-[80%] bg-white border border-slate-200 text-slate-800 text-[13px] leading-relaxed px-3 py-2 rounded-2xl rounded-bl-md">
                  {d.text}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </article>
  );
}

export default Prototype;
