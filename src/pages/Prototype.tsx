import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import owlTalking from "@/assets/prototype/owl-talking.png";
import owlDefault from "@/assets/prototype/owl-default.png";
import owlReading from "@/assets/prototype/owl-reading.png";
import owlCovering from "@/assets/prototype/owl-covering.png";

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

type Unit = {
  id: string;
  label: string;
  status: "Let" | "Vacant";
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

type Property = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  units: Unit[];
};

const PROPERTIES: Property[] = [
  {
    id: "stanley",
    name: "Stanley House",
    area: "Marylebone, London",
    lat: 51.5205,
    lng: -0.1525,
    units: [
      {
        id: "stanley-gf",
        label: "Ground Floor",
        status: "Let",
        tenant: "ABC Limited",
        rent: "£48,000 p.a.",
        leaseTo: "24 Mar 2029",
        break: "24 Mar 2027",
        review: "Mar 2027",
        epc: "D",
      },
      {
        id: "stanley-1f",
        label: "First Floor",
        status: "Let",
        tenant: "XYZ Limited",
        rent: "£52,000 p.a.",
        leaseTo: "28 Sep 2031",
        epc: "C",
      },
      {
        id: "stanley-2f",
        label: "Second Floor",
        status: "Vacant",
        vacantSince: "Jan 2026",
        lastTenant: "Crompton & Co",
        lastRent: "£45,000 p.a.",
      },
    ],
  },
  {
    id: "kings",
    name: "Kings Court",
    area: "Holborn, London",
    lat: 51.5174,
    lng: -0.118,
    units: [
      {
        id: "kings-a",
        label: "Unit A",
        status: "Let",
        tenant: "Meridian Retail",
        rent: "£61,000 p.a.",
        leaseTo: "14 Jun 2030",
        epc: "C",
      },
      { id: "kings-b", label: "Unit B", status: "Vacant", vacantSince: "Oct 2025" },
    ],
  },
  {
    id: "camden",
    name: "Camden Wharf",
    area: "Camden, London",
    lat: 51.5412,
    lng: -0.1438,
    units: [
      {
        id: "camden-w1",
        label: "Warehouse 1",
        status: "Let",
        tenant: "Dockside Logistics",
        rent: "£88,000 p.a.",
        leaseTo: "01 Dec 2028",
        epc: "B",
      },
      { id: "camden-w2", label: "Warehouse 2", status: "Vacant", vacantSince: "Aug 2025" },
    ],
  },
];

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

type ChatMsg = { id: string; role: "hobson" | "user"; text: string; streaming?: boolean };

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

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      center: [51.5174, -0.1278],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapInstance.current = map;

    PROPERTIES.forEach((p) => {
      const isCluster = p.units.length > 1;
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
      m.on("click", () => onPropertyClick(p.id));
      m.on("mouseover", () => onPinHover?.(p.id));
      m.on("mouseout", () => onPinHover?.(null));
      markersRef.current[p.id] = m;
    });

    return () => {
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
        else el.classList.add("is-fade");
      }
      if (highlight.hoverId === id) el.classList.add("is-hover");
    });

    if (highlight.focus) {
      map.flyTo([highlight.focus.lat, highlight.focus.lng], highlight.focus.zoom, {
        duration: 0.8,
      });
    } else {
      map.flyTo([51.5174, -0.1278], 12, { duration: 0.8 });
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
    setMessages([]);

    if (fromOnboarding) {
      localStorage.setItem("hobsonPrototype.hasVisited", "1");
      setHasVisited(true);
    }

    const greet =
      portfolioMode === "first"
        ? `Welcome. Right now I learn at unit level — that's where your documents live, and it's how I build understanding. Want to open a property, or go straight to a unit?`
        : `You're in your portfolio. Search above, pick a property on the map, or jump straight into a unit — that's where I can answer questions today.`;
    setTyping(true);
    const delay = reduced ? 200 : 450;
    window.setTimeout(() => {
      setTyping(false);
      if (reduced) {
        setMessages([{ id: "p-greet", role: "hobson", text: greet }]);
      } else {
        streamHobsonMessage(greet, () => {});
      }
    }, delay);

  };

  const goProperty = (id: string) => {
    const p = PROPERTIES.find((x) => x.id === id);
    if (!p) return;
    setView("property");
    setSelectedPropertyId(id);
    setSelectedUnitId(null);
    setOwl("talking");
    setShowUnitPicker(false);
    setShowPropertyList(false);
    setPortfolioChip(null);
    setSearchQuery("");
    setMessages([]);
    const greet = `This is ${p.name}, ${p.area} — ${p.units.length} units. I can take you into any one of them. Which would you like to open?`;
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

  const goUnit = (unitId: string, propertyId?: string) => {
    const pid = propertyId ?? selectedPropertyId;
    const p = PROPERTIES.find((x) => x.id === pid);
    if (!p) return;
    const u = p.units.find((x) => x.id === unitId);
    if (!u) return;
    setSelectedPropertyId(p.id);
    setView("unit");
    setSelectedUnitId(unitId);
    setOwl("talking");
    setShowUnitPicker(false);
    setShowPropertyList(false);
    setPortfolioChip(null);
    setSearchQuery("");
    const intro =
      u.status === "Let"
        ? `${p.name} — ${u.label}, let to ${u.tenant}. What would you like to know?`
        : `${p.name} — ${u.label}, currently vacant. What would you like to check?`;
    setMessages([{ id: `unit-${unitId}`, role: "hobson", text: intro }]);
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
      }
      return { pulse: "none", matchIds, hoverId: hoveredPropertyId };
    }
    if (view === "property" && selectedProperty) {
      const n = selectedProperty.units.length;
      const radius = 0.0011;
      const unitPins: UnitPin[] = selectedProperty.units.map((u, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        return {
          id: u.id,
          lat: selectedProperty.lat + radius * Math.cos(angle),
          lng: selectedProperty.lng + radius * Math.sin(angle) * 1.4,
          label: u.label,
          status: u.status,
        };
      });
      return {
        pulse: "none",
        dimExcept: selectedProperty.id,
        focus: { lat: selectedProperty.lat, lng: selectedProperty.lng, zoom: 16 },
        unitPins,
      };
    }
    if (view === "unit" && selectedProperty) {
      const n = selectedProperty.units.length;
      const radius = 0.0011;
      const unitPins: UnitPin[] = selectedProperty.units.map((u, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        return {
          id: u.id,
          lat: selectedProperty.lat + radius * Math.cos(angle),
          lng: selectedProperty.lng + radius * Math.sin(angle) * 1.4,
          label: u.label,
          status: u.status,
        };
      });
      return {
        pulse: "none",
        dimExcept: selectedProperty.id,
        activeUnitPropertyId: selectedProperty.id,
        focus: { lat: selectedProperty.lat, lng: selectedProperty.lng, zoom: 16 },
        unitPins,
        activeUnitId: selectedUnitId,
      };
    }
    return { pulse: "none" };
  }, [view, beatIdx, selectedProperty, selectedUnitId, searchQuery, portfolioMode, hoveredPropertyId]);

  /* ----- unit Q&A ----- */
  const answerForUnit = (q: string): string => {
    const u = selectedUnit;
    const p = selectedProperty;
    if (!u || !p) return "Open a unit first and I can answer.";
    const lo = q.toLowerCase();
    if (u.status === "Vacant") {
      if (lo.includes("vacant") || lo.includes("empty") || lo.includes("since"))
        return `${u.label} has been vacant since ${u.vacantSince}. Last tenant: ${u.lastTenant ?? "—"}${u.lastRent ? `, paying ${u.lastRent}` : ""}.`;
      if (lo.includes("rent") || lo.includes("lease") || lo.includes("expire"))
        return `${u.label} is vacant — no live lease. Last passing rent was ${u.lastRent ?? "not on file"}.`;
      if (lo.includes("complian") || lo.includes("epc") || lo.includes("safety"))
        return "No outstanding compliance items I can see for this vacant unit. EPC on file is due to be refreshed before re-letting.";
      return `${u.label} is vacant since ${u.vacantSince}. Ask me about marketing history or the last tenancy.`;
    }
    if (lo.includes("expire") || lo.includes("when") || lo.includes("lease"))
      return `The lease to ${u.tenant} runs to ${u.leaseTo}${u.break ? `, with a tenant break on ${u.break}` : ""}. Passing rent is ${u.rent}.`;
    if (lo.includes("review") || lo.includes("rent review"))
      return u.review
        ? `Next rent review is ${u.review}. Current passing rent ${u.rent}.`
        : `No rent review scheduled in the current lease — fixed at ${u.rent} to ${u.leaseTo}.`;
    if (lo.includes("complian") || lo.includes("epc") || lo.includes("safety"))
      return `EPC on file is rating ${u.epc ?? "—"}. No outstanding compliance certificates flagged for ${u.label}.`;
    if (lo.includes("summar") || lo.includes("tenancy") || lo.includes("about"))
      return `${u.label}, let to ${u.tenant} at ${u.rent}. Lease to ${u.leaseTo}${u.break ? `, break ${u.break}` : ""}${u.review ? `, review ${u.review}` : ""}. EPC ${u.epc ?? "—"}.`;
    if (lo.includes("break"))
      return u.break
        ? `Tenant break option on ${u.break}. After that, the lease runs to ${u.leaseTo}.`
        : `No break option in this lease — it runs to ${u.leaseTo}.`;
    return `For ${u.label}: leased to ${u.tenant}, ${u.rent}, expiring ${u.leaseTo}. Ask me about the review, break or compliance.`;
  };

  const sendUnitQuestion = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setOwl("reading");
    const delay = reduced ? 200 : 800;
    setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      const ans = answerForUnit(q);
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
    if (selectedProperty)
      arr.push({
        label: selectedProperty.name,
        onClick: () => goProperty(selectedProperty.id),
      });
    if (selectedUnit) arr.push({ label: selectedUnit.label });
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
        <RailItem icon="pin" label="Portfolio" active />
        <RailItem icon="doc" label="Documents" />
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

          {/* Returning-mode search lives at the top of the panel body */}
          {((view === "portfolio" && portfolioMode === "returning") || view === "property") && (
            <ReturningSearchPanel
              query={searchQuery}
              setQuery={setSearchQuery}
              activeIdx={searchActiveIdx}
              setActiveIdx={setSearchActiveIdx}
              onOpenUnit={(propId, unitId) => goUnit(unitId, propId)}
              onOpenProperty={goProperty}
              onHoverProperty={setHoveredPropertyId}
              searchRef={searchRef}
            />
          )}

          {messages.map((m) =>
            m.role === "hobson" ? (
              <HobsonBubble key={m.id} text={m.text} owl={owl} streaming={!!m.streaming} />
            ) : (
              <UserBubble key={m.id} text={m.text} />
            )
          )}
          {typing && <TypingBubble owl={owl} />}

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

          {/* Property view */}
          {view === "property" && selectedProperty && (
            <PropertyContent
              property={selectedProperty}
              onOpenUnit={(uid) => goUnit(uid, selectedProperty.id)}
              onPreviewQuestion={askPropertyPreview}
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
          {view !== "unit" ? (
            <LockedComposer view={view} />
          ) : (
            <>
              <div className="text-[11px] text-slate-400 mb-1">4 remaining</div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendUnitQuestion(input);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Hobson…"
                  className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400"
                  aria-label="Ask Hobson"
                />
                <button type="button" className="text-slate-400 hover:text-slate-600" aria-label="Attach">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 12.5L12 21a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8"/>
                  </svg>
                </button>
              </form>
            </>
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

        {/* Map/Satellite toggle */}
        <div className="absolute bottom-4 right-4 z-[400] bg-white rounded-md shadow-md text-xs font-medium flex">
          <button className="px-3 py-1.5 bg-slate-900 text-white rounded-l-md">Map</button>
          <button className="px-3 py-1.5 text-slate-600 rounded-r-md">Satellite</button>
        </div>

        {toast && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-[500] bg-slate-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg max-w-md text-center">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
};

/* ---------------- Sub-components ---------------- */

function RailItem({ icon, label, active }: { icon: "pin" | "doc" | "chat" | "gear"; label: string; active?: boolean }) {
  const stroke = active ? "#7C3AED" : "#64748B";
  return (
    <button
      className={`w-12 flex flex-col items-center gap-0.5 py-2 rounded-lg transition ${
        active ? "bg-[#F5F3FF]" : "hover:bg-slate-50"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icon === "pin" && (<><path d="M12 22s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/></>)}
        {icon === "doc" && (<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></>)}
        {icon === "chat" && (<><path d="M21 12a8 8 0 11-3-6.2L21 3v6h-6"/></>)}
        {icon === "gear" && (<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5"/></>)}
      </svg>
      <span className={`text-[10px] ${active ? "text-[#7C3AED] font-medium" : "text-slate-500"}`}>{label}</span>
    </button>
  );
}

function HobsonBubble({ text, owl, streaming }: { text: string; owl: OwlState; streaming?: boolean }) {
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

function PropertyContent({
  property,
  onOpenUnit,
  onPreviewQuestion,
}: {
  property: Property;
  onOpenUnit: (id: string) => void;
  onPreviewQuestion: (q: string) => void;
}) {
  void onPreviewQuestion;
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5">Units</div>
        <div className="space-y-1.5">
          {property.units.map((u) => (
            <button
              key={u.id}
              onClick={() => onOpenUnit(u.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            >
              <div>
                <div className="text-sm font-medium text-slate-900">{u.label}</div>
                <div className="text-[11px] text-slate-500">
                  {u.status === "Let" ? `${u.tenant} · ${u.rent}` : `Vacant since ${u.vacantSince}`}
                </div>
              </div>
              <span
                className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${
                  u.status === "Let" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {u.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UnitStarters({ unit, onAsk }: { unit: Unit; onAsk: (q: string) => void }) {
  const qs =
    unit.status === "Let"
      ? ["When does the lease expire?", "Any compliance issues?", "Summarise the tenancy"]
      : ["When did it become vacant?", "Who was the last tenant?", "Any compliance issues?"];
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
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-semibold text-slate-900">Portfolio Intelligence</h2>
          <span className="text-[10px] uppercase tracking-wide bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Coming soon</span>
        </div>
        <p className="text-sm text-slate-600">
          Today I learn at unit level — that's where your documents live. Portfolio insight comes later, once I understand enough units.
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
                  <div className="text-[11px] text-slate-500">{p.area} · {p.units.length} units</div>
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
                          {u.status === "Let" ? u.tenant : "Vacant"}
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
    const propMatch = p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q);
    if (propMatch) results.push({ type: "property", property: p });
    p.units.forEach((u) => {
      const unitMatch =
        u.label.toLowerCase().includes(q) ||
        (u.tenant && u.tenant.toLowerCase().includes(q)) ||
        p.name.toLowerCase().includes(q);
      if (unitMatch) results.push({ type: "unit", property: p, unit: u });
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

  const recents: { propertyId: string; unitId: string; label: string; tenant: string }[] = [
    { propertyId: "stanley", unitId: "stanley-gf", label: "Ground Floor", tenant: "ABC Limited" },
    { propertyId: "camden", unitId: "camden-w1", label: "Warehouse 1", tenant: "Dockside Logistics" },
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
                              ? r.unit.status === "Let"
                                ? r.unit.tenant
                                : "Vacant"
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
                      <div className="text-sm font-medium text-slate-900">{r.label} — {r.tenant}</div>
                      <div className="text-[11px] text-slate-500">{p?.name}</div>
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

export default Prototype;
