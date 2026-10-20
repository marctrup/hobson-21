import { useEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrototypeGate } from "@/components/prototype/PrototypeGate";
import owlDefault from "@/assets/prototype/owl-default.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { discoverAddress, MOCK_ADDRESSES, type AddressParts, type AddressRecord } from "./prototypeUnitAddress";
import { editUnits, namingProposal, numberUnits, restoreUnit, understandBuilding, type BuildingUnderstanding, type ProposedUnit } from "./prototypeUnitStructure";
import { PrototypeUnitStructure } from "./PrototypeUnitStructure";

const RAIL_WIDTH = 68;
const DEFAULT_CHAT_WIDTH = 380;
const MIN_CHAT_WIDTH = 280;
const MIN_CANVAS_WIDTH = 320;

type UnitMessage = { id: number; text: string; role: "user" | "hobson"; examples?: string };

const OPENING_MESSAGE: UnitMessage = { id: 0, role: "hobson", text: "I can help you organise the places in your portfolio. Shall we get started?" };

const SETUP_CHOICES = [
  { label: "A standalone Unit", response: "Of course. Let's set up your Unit." },
  { label: "A Unit Group with several Units", response: "Of course. Let's set up your Unit Group." },
  { label: "I'm not sure — help me work it out", response: "That's fine. I'll help you work out how best to organise it." },
] as const;

type LocationStage = "idle" | "awaiting-address" | "candidates" | "intention" | "proposed" | "confirmed" | "unverified";

function UnitLocationMap({ stage, address, candidate, compact = false }: { stage: LocationStage; address: string; candidate: AddressRecord | null; compact?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const [labelPoint, setLabelPoint] = useState({ x: 0, y: 0 });
  const matched = Boolean(candidate) && ["candidates", "intention", "proposed", "confirmed"].includes(stage);
  const coordinatesRef = useRef<L.LatLngTuple>([51.509, -0.12]);
  coordinatesRef.current = candidate?.coordinates ?? [51.509, -0.12];

  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, { center: [51.509, -0.12], zoom: 13, scrollWheelZoom: true, zoomControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19,
    }).addTo(instance);
    map.current = instance;
    const placeLabel = () => {
      const point = instance.latLngToContainerPoint(coordinatesRef.current);
      setLabelPoint({ x: point.x, y: point.y });
    };
    instance.on("move resize", placeLabel);
    placeLabel();
    const observer = new ResizeObserver(() => instance.invalidateSize({ animate: false }));
    observer.observe(container.current);
    return () => { observer.disconnect(); instance.remove(); map.current = null; marker.current = null; };
  }, []);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    if (!matched || !candidate) { marker.current?.remove(); marker.current = null; return; }
    const confirmed = stage === "confirmed";
    const searching = stage === "candidates";
    const icon = L.divIcon({ className: "", html: searching ? '<span class="block h-24 w-24 rounded-full border-2 border-dashed border-ring bg-secondary/40"></span>' : `<span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background shadow-sm ring-4 transition-colors duration-300 motion-reduce:transition-none ${confirmed ? "bg-primary text-primary-foreground ring-primary/10" : "bg-background text-foreground ring-ring/20"}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${confirmed ? '<path d="m5 12 4 4 10-10"/>' : '<circle cx="12" cy="12" r="4"/>'}</svg></span>`, iconSize: searching ? [96, 96] : [28, 28], iconAnchor: searching ? [48, 48] : [14, 14] });
    if (marker.current) { marker.current.setIcon(icon); marker.current.setLatLng(candidate.coordinates); }
    else
    marker.current = L.marker(candidate.coordinates, { icon, title: `${candidate.name} — illustrative location` }).addTo(instance);
    instance.flyTo(candidate.coordinates, stage === "candidates" ? 15 : 17, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches, duration: 0.8 });
  }, [matched, stage, candidate]);

  return (
    <div className="relative z-0 min-h-0 flex-1 overflow-hidden rounded-lg border border-border">
      <div ref={container} className="absolute inset-0" aria-label="Location map" />
      {matched ? <div className="pointer-events-none absolute z-[500] w-[220px] -translate-x-1/2 rounded-md border border-border bg-background/95 px-3 py-2 text-foreground shadow-sm" style={{ left: labelPoint.x, top: labelPoint.y + 24 }} role="status" aria-label="Location status">
        <p className="text-sm font-semibold">{stage === "candidates" ? "Possible address matches" : candidate?.name}</p>
        {!compact && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stage === "candidates" ? "Finchley Road · NW11 0QD" : candidate?.line}</p>}
        <p className="mt-1.5 text-xs font-medium">{stage === "candidates" ? "Approximate search area" : stage === "confirmed" ? "Location confirmed" : "Awaiting confirmation"}</p>
        {!compact && <p className="mt-1 text-[10px] text-muted-foreground">Illustrative mock lookup · approximate marker</p>}
      </div> : (stage === "unverified" || (stage === "awaiting-address" && address)) && <div className="pointer-events-none absolute inset-x-3 bottom-8 z-[500] flex justify-center">
        <div className="max-w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm" role="status" aria-label="Location status">
          <p className="text-xs font-medium">Location needs verification</p>
          <p className="mt-1 break-words text-xs text-muted-foreground">{address}</p>
          <p className="mt-1 text-xs text-muted-foreground">No confirmed location</p>
        </div>
      </div>}
    </div>
  );
}

function RailItem({ icon, label, active, onClick }: { icon: "pin" | "doc" | "chat" | "gear"; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-12 flex flex-col items-center gap-0.5 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#56514A]/40 ${active ? "bg-[#F1EBDE]" : "hover:bg-paper"}`}
      aria-current={active ? "page" : undefined}
      aria-label={label}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#56514A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {icon === "pin" && (<><path d="M12 22s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="10" r="2.5" /></>)}
        {icon === "doc" && (<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></>)}
        {icon === "chat" && (<><path d="M21 12a8 8 0 11-3-6.2L21 3v6h-6" /></>)}
        {icon === "gear" && (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5" /></>)}
      </svg>
      <span className={`w-full px-0.5 text-center text-[10px] leading-tight [overflow-wrap:anywhere] ${active ? "text-[#56514A] font-medium" : "text-ink-muted"}`}>{label}</span>
    </button>
  );
}

function UnitResizeDivider({ width, setWidth, onReset, isDefault }: { width: number; setWidth: (n: number) => void; onReset: () => void; isDefault: boolean }) {
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWRef = useRef(width);
  const [active, setActive] = useState(false);

  const getMaxLeft = () => window.innerWidth - RAIL_WIDTH - MIN_CANVAS_WIDTH;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const raw = startWRef.current + (e.clientX - startXRef.current);
      setWidth(Math.max(MIN_CHAT_WIDTH, Math.min(getMaxLeft(), raw)));
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setActive(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [setWidth]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 48 : 16;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setWidth(Math.max(MIN_CHAT_WIDTH, width - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setWidth(Math.min(getMaxLeft(), width + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setWidth(MIN_CHAT_WIDTH);
    } else if (e.key === "End") {
      e.preventDefault();
      setWidth(getMaxLeft());
    }
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize chat and main area"
      aria-valuenow={width}
      aria-valuemin={MIN_CHAT_WIDTH}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => {
        draggingRef.current = true;
        startXRef.current = e.clientX;
        startWRef.current = width;
        setActive(true);
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }}
      onDoubleClick={onReset}
      title="Drag to resize · double-click to reset"
      className={`group relative w-1.5 shrink-0 cursor-col-resize select-none focus:outline-none ${active ? "bg-[#56514A]/30" : "bg-bone-wash hover:bg-[#56514A]/20"} focus-visible:bg-[#56514A]/30`}
    >
      <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-px ${active ? "bg-[#56514A]" : "bg-bone group-hover:bg-[#56514A]/60"}`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-0.5 px-0.5 py-2 rounded ${active ? "bg-[#56514A] text-white" : "bg-white border border-bone text-ink-muted group-hover:text-[#56514A]"}`}>
        <span className="block w-0.5 h-0.5 rounded-full bg-current" />
        <span className="block w-0.5 h-0.5 rounded-full bg-current" />
        <span className="block w-0.5 h-0.5 rounded-full bg-current" />
      </div>
      {!isDefault && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onReset(); }}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label="Reset layout to default"
          title="Reset layout (double-click divider)"
          className="absolute left-1/2 -translate-x-1/2 top-[calc(50%+28px)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus:outline-none transition-opacity duration-200 motion-reduce:transition-none w-6 h-6 rounded-full bg-white border border-[#56514A]/40 text-[#56514A] hover:bg-[#F1EBDE] shadow-sm flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#56514A]"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" />
          </svg>
        </button>
      )}
    </div>
  );
}

function PrototypeUnitShell() {
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UnitMessage[]>([OPENING_MESSAGE]);
  const [showInvitation, setShowInvitation] = useState(true);
  const [setupPromptId, setSetupPromptId] = useState<number | null>(null);
  const [locationStage, setLocationStage] = useState<LocationStage>("idle");
  const [locationPromptId, setLocationPromptId] = useState<number | null>(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [addressParts, setAddressParts] = useState<AddressParts>({});
  const [addressCandidates, setAddressCandidates] = useState<AddressRecord[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressRecord | null>(null);
  const [showMoreAddresses, setShowMoreAddresses] = useState(false);
  const [buildingUnderstanding, setBuildingUnderstanding] = useState<BuildingUnderstanding | null>(null);
  const [buildingStage, setBuildingStage] = useState<"idle" | "awaiting-description" | "naming" | "describing" | "named" | "ready" | "created">("idle");
  const [portfolio, setPortfolio] = useState<PortfolioGroup[]>([]);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showSummaryUnits, setShowSummaryUnits] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<{ unit: ProposedUnit; index: number } | null>(null);
  const [buildingPromptId, setBuildingPromptId] = useState<number | null>(null);
  const nextId = useRef(1);
  // Undo is temporary: it fades after a short while.
  useEffect(() => {
    if (!lastRemoved) return;
    const timer = window.setTimeout(() => setLastRemoved(null), 10000);
    return () => window.clearTimeout(timer);
  }, [lastRemoved]);
  const conversationEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEnd.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const startSetup = (reply = "Set up a place") => {
    if (!showInvitation) return;
    const id = nextId.current++;
    setMessages((previous) => [...previous,
      { id: nextId.current++, role: "user", text: reply },
      { id, role: "hobson", text: "What would you like me to set up?" },
    ]);
    setShowInvitation(false);
    setSetupPromptId(id);
    setInput("");
  };

  const chooseSetup = (choice: typeof SETUP_CHOICES[number]) => {
    if (setupPromptId === null) return;
    setMessages((previous) => [...previous,
      { id: nextId.current++, role: "user", text: choice.label },
      { id: nextId.current++, role: "hobson", text: choice.response },
    ]);
    setSetupPromptId(null);
    if (choice.label === "A Unit Group with several Units") {
      setMessages((previous) => [...previous, { id: nextId.current++, role: "hobson", text: "What's the full address, including the postcode?" }]);
      setLocationStage("awaiting-address");
    }
  };

  const appendExchange = (userText: string, hobsonText: string) => {
    const id = nextId.current++;
    setMessages(previous => [...previous,
      { id: nextId.current++, role: "user", text: userText },
      { id, role: "hobson", text: hobsonText },
    ]);
    setInput("");
    return id;
  };

  const checkAgain = (reply: string) => {
    appendExchange(reply, "Of course. What's the correct address, including the postcode?");
    setLocationStage("awaiting-address");
    setLocationPromptId(null);
    setAddressParts({});
    setAddressCandidates([]);
    setSelectedAddress(null);
    setLocationAddress("");
  };

  const selectCandidate = (record: AddressRecord) => {
    if (locationStage !== "candidates") return;
    setSelectedAddress(record);
    setLocationAddress(`${record.name}, ${record.line}`);
    setLocationPromptId(appendExchange(`${record.name}, ${record.line}`, record.unit ? `Are we setting up the whole of Stanley House, or just ${record.unit}?` : "Is this the right place?"));
    setLocationStage(record.unit ? "intention" : "proposed");
  };

  const resolveIntention = (wholeBuilding: boolean) => {
    if (locationStage !== "intention" || !selectedAddress?.unit) return;
    const record = wholeBuilding ? MOCK_ADDRESSES.find(r => r.id === "stanley-finchley") : selectedAddress;
    if (!record) return;
    setSelectedAddress(record);
    setLocationAddress(`${record.name}, ${record.line}`);
    setLocationPromptId(appendExchange(wholeBuilding ? "The whole of Stanley House" : `Just ${selectedAddress.unit}`, "Is this the right place?"));
    setLocationStage("proposed");
  };

  const respondToLocation = (confirm: boolean) => {
    if (locationStage !== "proposed" || !selectedAddress) return;
    if (!confirm) { checkAgain("No, let's check again"); return; }
    appendExchange("Yes, that's the place", `Good. I've got the location for ${selectedAddress.name}.`);
    setLocationStage("confirmed");
    setLocationPromptId(null);
    if (selectedAddress.id === "stanley-finchley") {
      setMessages(previous => [...previous, { id: nextId.current++, role: "hobson", text: "How many separate spaces are there in Stanley House, and what are they used for?", examples: "For example, you could say '11 flats and a shop' or '4 offices'. I'll organise them for you." }]);
      setBuildingStage("awaiting-description");
    }
  };

  const lookupLocation = (text: string) => {
    const result = discoverAddress(text, addressParts);
    setAddressParts(result.parts);
    setAddressCandidates(result.records);
    setShowMoreAddresses(false);
    setSelectedAddress(result.outcome === "single" ? result.records[0] ?? null : null);
    setLocationAddress(text);
    const record = result.records[0];
    const reply = result.outcome === "multiple" ? `I've found several addresses for ${result.parts.postcode}. Which one are we looking for?`
      : result.outcome === "single" && record ? `I think I've found it: ${record.name}, ${record.line}. Is this the right place?`
      : result.outcome === "missing-postcode" ? "I can look for Stanley House on Finchley Road. Do you have the full postcode? That will help me find the right place."
      : "I haven't found a reliable match for that address. Could you check the postcode or give me a little more detail?";
    const id = appendExchange(text, reply);
    if (result.outcome === "single" && record?.unit) {
      setMessages(previous => previous.map(message => message.id === id ? { ...message, text: `Are we setting up the whole of Stanley House, or just ${record.unit}?` } : message));
    }
    setLocationStage(result.outcome === "multiple" ? "candidates" : result.outcome === "single" ? record?.unit ? "intention" : "proposed" : "unverified");
    setLocationPromptId(result.records.length ? id : null);
  };

  const AFTER_CREATION = ["View on map", "Add Papers", "Set up another place", "Done for now"];
  const NAMING_CHOICES = ["Yes, those names are fine", "Just number them", "Let me describe them"];
  const DESCRIBE_HINT = "Of course. Tell me how you'd like them named — for example, 'Call them Apartments 1 to 11', 'The flats are numbered 101 to 111' or 'Call the shop Ground Floor Shop'.";

  const REVIEW_LINE = "Here's how I've laid out Stanley House. You can change anything that doesn't look right.";
  const units = buildingUnderstanding?.kind === "proposal" ? buildingUnderstanding.units : null;

  // Structure, names and edits stay proposals: nothing here creates Units.
  const toReview = (text: string, reply: string, next?: ProposedUnit[]) => {
    if (next) setBuildingUnderstanding({ kind: "proposal", units: next });
    setBuildingPromptId(appendExchange(text, `${reply}\n\n${REVIEW_LINE}`));
    setBuildingStage("named");
  };

  const applyDirectEdit = (next: ProposedUnit[], note: string, removed?: { unit: ProposedUnit; index: number }) => {
    setBuildingUnderstanding({ kind: "proposal", units: next });
    setLastRemoved(removed ?? null);
    // Manual changes are quiet: no new messages. After review, the existing reply offers the check again.
    if (buildingStage === "ready") {
      const lastHobson = [...messages].reverse().find(m => m.role === "hobson");
      setBuildingPromptId(lastHobson?.id ?? null); setBuildingStage("named");
    }
  };

  const undoRemoval = (text?: string) => {
    if (!units || !lastRemoved) return;
    const next = restoreUnit(units, lastRemoved);
    if (text) toReview(text, `Done. I've put ${lastRemoved.unit.name} back.`, next);
    else applyDirectEdit(next, `I've put ${lastRemoved.unit.name} back.`);
    setLastRemoved(null);
  };

  // The simulated portfolio survives new setups and conversations within this session.
  const createGroup = (text: string) => {
    if (buildingStage !== "ready" || !units || !selectedAddress) return;
    const group: PortfolioGroup = { id: `${selectedAddress.id}-${Date.now()}`, name: selectedAddress.name, line: selectedAddress.line, record: selectedAddress, units: units.map(u => ({ ...u })) };
    setPortfolio(previous => previous.some(g => g.record.id === group.record.id) ? previous : [...previous, group]);
    setBuildingStage("created");
    setBuildingPromptId(appendExchange(text, `Done. ${group.name} is now in your portfolio with ${group.units.length} Unit${group.units.length === 1 ? "" : "s"}.`));
  };

  const resetSetup = () => {
    setSetupPromptId(null); setLocationStage("idle"); setLocationPromptId(null); setLocationAddress(""); setAddressParts({}); setAddressCandidates([]); setSelectedAddress(null);
    setBuildingUnderstanding(null); setBuildingStage("idle"); setBuildingPromptId(null); setLastRemoved(null); setShowSummaryUnits(false);
  };

  const afterCreation = (choice: string) => {
    const name = portfolio[portfolio.length - 1]?.name ?? "It";
    if (choice === "View on map") { setMapExpanded(true); appendExchange(choice, `Here's ${name} at its confirmed location.`); return; }
    if (choice === "Add Papers") { appendExchange(choice, `Papers aren't part of this demonstration yet. When they are, I'll keep them with ${name}.`); return; }
    if (choice === "Set up another place") {
      resetSetup(); setMapExpanded(false); setShowInvitation(false);
      const id = nextId.current++;
      setMessages(previous => [...previous, { id: nextId.current++, role: "user", text: choice }, { id, role: "hobson", text: "What would you like me to set up?" }]);
      setSetupPromptId(id); setInput(""); return;
    }
    if (choice === "Done for now") { setMapExpanded(false); appendExchange(choice, `Very good. ${name} is in your portfolio whenever you need it.`); resetSetup(); setBuildingStage("idle"); }
  };

  const answerBuilding = (text: string) => {
    const normalised = text.toLowerCase().replace(/[.!?]+$/, "").trim();
    if (units && buildingStage !== "awaiting-description") {
      if (buildingStage === "created") {
        const choice = AFTER_CREATION.find(c => c.toLowerCase() === normalised);
        if (choice) { afterCreation(choice); return; }
        appendExchange(text, `${portfolio[portfolio.length - 1]?.name ?? "It"} is already in your portfolio. You can view it on the map, set up another place, or leave it there for now.`); return;
      }
      if (normalised === "this structure is right" && buildingStage === "named") {
        setBuildingPromptId(appendExchange(text, `${selectedAddress?.name ?? "Stanley House"} is ready. I've got the location and all ${units.length} Unit${units.length === 1 ? "" : "s"}. Shall I add it to your portfolio?`));
        setBuildingStage("ready"); return;
      }
      if (buildingStage === "ready") {
        if (["create this structure", "yes", "yes please", "go ahead"].includes(normalised)) { createGroup(text); return; }
        if (normalised === "make another change") {
          setBuildingPromptId(appendExchange(text, "Of course. Everything is as you left it — change whatever you like, and tell me when it's right."));
          setBuildingStage("named"); return;
        }
      }
      if (normalised === "yes, those names are fine" || (buildingStage === "naming" && ["yes", "that's fine", "fine"].includes(normalised))) { toReview(text, "Very good. I'll keep those names."); return; }
      if (normalised === "just number them") {
        const hasCommercial = units.some(u => u.classification === "Commercial");
        toReview(text, `Done. The ${units.some(u => u.type === "Flat") ? "flats" : "Units"} are now simply numbered${hasCommercial ? ", and the commercial space keeps its name" : ""}.`, numberUnits(units)); return;
      }
      if (normalised === "let me describe them") { appendExchange(text, DESCRIBE_HINT); setBuildingStage("describing"); setBuildingPromptId(null); return; }
      if (["undo", "undo that", "put it back"].includes(normalised) && lastRemoved) { undoRemoval(text); return; }
      const edit = editUnits(text, units);
      if (edit?.kind === "question") { appendExchange(text, edit.reply); return; }
      if (edit) { setLastRemoved(edit.removed ?? null); toReview(text, edit.reply, edit.units); return; }
      if (buildingStage === "describing") { appendExchange(text, `I didn't quite follow that. ${DESCRIBE_HINT.replace("Of course. ", "")}`); return; }
    }
    const understanding = understandBuilding(text, buildingUnderstanding);
    if (units && understanding.kind === "clarify" && !understanding.total && !understanding.floors && !understanding.groups) {
      appendExchange(text, "I didn't quite follow that. You could say 'Rename Flat 1 to Garden Flat', 'Add another shop' or 'Remove Flat 11'.");
      return;
    }
    setLastRemoved(null);
    setBuildingUnderstanding(understanding);
    const id = appendExchange(text, understanding.kind === "proposal" ? namingProposal(understanding.units) : understanding.question);
    setBuildingStage(understanding.kind === "proposal" ? "naming" : "awaiting-description");
    setBuildingPromptId(id);
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const normalised = text.toLowerCase().replace(/[.!?]+$/, "");
    if (locationStage === "confirmed" && buildingStage !== "idle") { answerBuilding(text); return; }
    if (locationStage === "proposed") {
      if (normalised === "yes, that's the place") { respondToLocation(true); return; }
      if (["no, let's check again", "choose a different location"].includes(normalised)) { respondToLocation(false); return; }
      lookupLocation(text); return;
    }
    if (locationStage === "intention") {
      if (["the whole of stanley house", "whole building", "the whole building"].includes(normalised)) { resolveIntention(true); return; }
      if (normalised === `just ${selectedAddress?.unit?.toLowerCase()}`) { resolveIntention(false); return; }
      if (["none of these", "no, let's check again"].includes(normalised)) { checkAgain(text); return; }
      appendExchange(text, `Are we setting up the whole of Stanley House, or just ${selectedAddress?.unit}?`);
      return;
    }
    if (locationStage === "candidates") {
      if (["none of these", "none of these is right"].includes(normalised)) { checkAgain(text); return; }
      const record = addressCandidates.find(r => r.name.toLowerCase() === normalised || `${r.name}, ${r.line}`.toLowerCase() === normalised);
      if (record) { selectCandidate(record); return; }
      lookupLocation(text); return;
    }
    if (locationStage === "awaiting-address" || locationStage === "unverified") { lookupLocation(text); return; }
    if (showInvitation && text.toLowerCase().replace(/[.!?]+$/, "") === "set up a place") {
      startSetup(text);
      return;
    }
    const choice = SETUP_CHOICES.find((option) => option.label.toLowerCase() === text.toLowerCase());
    if (setupPromptId !== null && choice) {
      chooseSetup(choice);
      setInput("");
      return;
    }
    // Ordinary messages remain local echoes; only the setup choices have scripted replies.
    setMessages((prev) => [...prev, { id: nextId.current++, text, role: "user" }]);
    setInput("");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bone-wash text-ink">
      {/* Left nav rail */}
      <aside className="flex w-[68px] shrink-0 flex-col items-center gap-2 border-r border-bone bg-white py-4">
        <div className="mb-2 grid h-10 w-10 place-items-center overflow-hidden rounded-xl" aria-hidden>
          <img src={owlDefault} alt="" className="h-10 w-10 object-contain" />
        </div>
        <RailItem icon="pin" label="Portfolio" active />
        <RailItem icon="doc" label="Papers" />
        <RailItem icon="chat" label="Chat History" />
        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-[#56514A] text-white shadow-md transition hover:bg-[#56514A]"
            aria-label="A new conversation"
            onClick={() => { setMessages([OPENING_MESSAGE]); setInput(""); setSetupPromptId(null); setShowInvitation(true); setLocationStage("idle"); setLocationPromptId(null); setLocationAddress(""); setAddressParts({}); setAddressCandidates([]); setSelectedAddress(null); setBuildingUnderstanding(null); setBuildingStage("idle"); setBuildingPromptId(null); setLastRemoved(null); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <span className="w-full px-1 text-center text-[9px] leading-tight text-ink-muted">A new conversation</span>
          <RailItem icon="gear" label="Back Office" />
          <div className="grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
        </div>
      </aside>

      {/* Chat panel */}
      <section className="relative flex shrink-0 flex-col border-r border-bone bg-white" style={{ width: chatWidth }} aria-label="Chat with Hobson">
        <header className="flex h-14 items-center justify-between border-b border-faint-rule px-5">
          <h1 className="text-[15px] font-semibold text-ink">Chat with Hobson</h1>
        </header>
        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((message, index) => {
            // The owl marks each of Hobson's turns — the first message of every Hobson run.
            // It never appears on the user's own messages.
            const showOwl = message.role === "hobson" && messages[index - 1]?.role !== "hobson";
            return message.role === "user" ? (
              <div key={message.id} className="min-w-0 max-w-full self-end rounded-xl bg-primary-light px-3.5 py-2.5 text-primary-foreground shadow-sm">
                <p className="break-words text-sm leading-relaxed">{message.text}</p>
              </div>
            ) : (
              <div key={message.id} className="flex max-w-full items-start gap-2 self-start">
                {showOwl ? (
                  <img src={owlDefault} alt="" aria-hidden className="mt-0.5 h-8 w-8 shrink-0 object-contain" />
                ) : (
                  <span aria-hidden className="w-8 shrink-0" />
                )}
                <div className="min-w-0 flex-1 py-2 text-ink">
                  <p className="mb-1 text-xs font-semibold text-ink-muted">Hobson</p>
                  <p className={`whitespace-pre-line break-words leading-relaxed ${message.examples ? "text-base font-semibold" : "text-sm"}`}>{message.text}</p>
                  {message.examples && <p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground">{message.examples}</p>}
                  {buildingPromptId === message.id && (buildingStage === "naming" ? NAMING_CHOICES : buildingStage === "named" ? ["This structure is right"] : buildingStage === "ready" ? ["Create this structure", "Make another change"] : buildingStage === "created" ? AFTER_CREATION : buildingStage === "awaiting-description" && buildingUnderstanding?.kind === "clarify" ? buildingUnderstanding.choices ?? [] : []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(buildingStage === "naming" ? NAMING_CHOICES : buildingStage === "named" ? ["This structure is right"] : buildingStage === "ready" ? ["Create this structure", "Make another change"] : buildingStage === "created" ? AFTER_CREATION : (buildingUnderstanding?.kind === "clarify" && buildingUnderstanding.choices) || []).map(choice => (
                        <button key={choice} type="button" onClick={() => answerBuilding(choice)} className={`min-h-11 rounded-full border px-3.5 py-2 ${choice === "Create this structure" ? "border-primary bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90" : "border-border bg-secondary/40"}`}  >{choice}</button>
                      ))}
                    </div>
                  )}
                  {message.id === OPENING_MESSAGE.id && showInvitation && (
                    <Button onClick={() => startSetup()} className="mt-3 min-h-11 max-w-full justify-between gap-4 whitespace-normal px-4 py-2.5 text-left text-sm font-semibold shadow-sm">
                      <span>Set up a place</span>{" "}
                      <span className="shrink-0">→</span>
                    </Button>
                  )}
                  {setupPromptId === message.id && (
                    <div className="mt-3 flex w-full flex-col items-stretch gap-2">
                      {SETUP_CHOICES.map((choice) => (
                        <Button key={choice.label} variant="outline" onClick={() => chooseSetup(choice)} className="h-auto min-h-11 w-full justify-start whitespace-normal border-border bg-background px-3 py-2.5 text-left text-sm font-normal leading-relaxed text-ink hover:border-ring hover:bg-secondary hover:text-secondary-foreground">
                          {choice.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  {locationPromptId === message.id && locationStage === "candidates" && (
                    <div className="mt-3 flex w-full flex-col gap-2">
                      <p className="text-xs text-muted-foreground">Fictional, simulated postal matches — not verified addresses or existing Units</p>
                      {addressCandidates.slice(0, showMoreAddresses ? addressCandidates.length : 4).map(record => <Button key={record.id} variant="outline" aria-label={`${record.name} ${record.line}`} onClick={() => selectCandidate(record)} className="h-auto min-h-11 flex-col items-start whitespace-normal border-border bg-secondary/40 px-3 py-2.5 text-left font-normal hover:bg-secondary">
                        <span className="text-sm font-medium">{record.name}</span><span className="mt-1 text-xs leading-relaxed text-muted-foreground">{record.line}</span>
                      </Button>)}
                      {!showMoreAddresses && addressCandidates.length > 4 && <Button variant="ghost" onClick={() => setShowMoreAddresses(true)} className="h-auto min-h-11 justify-start whitespace-normal text-sm font-normal">Show more addresses</Button>}
                      <Button variant="outline" onClick={() => checkAgain("None of these")} className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2.5 text-left font-normal">None of these</Button>
                    </div>
                  )}
                  {locationPromptId === message.id && locationStage === "intention" && (
                    <div className="mt-3 flex w-full flex-col gap-2">
                      <Button variant="outline" onClick={() => resolveIntention(true)} className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2.5 text-left font-normal">The whole of Stanley House</Button>
                      <Button variant="outline" onClick={() => resolveIntention(false)} className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2.5 text-left font-normal">Just {selectedAddress?.unit}</Button>
                    </div>
                  )}
                  {locationPromptId === message.id && locationStage === "proposed" && (
                    <div className="mt-3 flex w-full flex-col items-stretch gap-2">
                      <Button variant="outline" onClick={() => respondToLocation(true)} className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2.5 text-left font-normal">Yes, that's the place</Button>
                      <Button variant="outline" onClick={() => respondToLocation(false)} className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2.5 text-left font-normal">No, let's check again</Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={conversationEnd} />
        </div>
        <div className="border-t border-faint-rule bg-white px-5 pb-4 pt-2">
          <form
            onSubmit={(event) => { event.preventDefault(); send(); }}
            className="flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring"
          >
            <Button type="button" variant="ghost" size="icon" aria-label="Attach a paper" title="Attach a paper" className="h-9 w-9 shrink-0 text-foreground">
              <Paperclip className="h-5 w-5" aria-hidden="true" />
            </Button>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-label="Ask Hobson"
              placeholder="Ask Hobson…"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Button>
          </form>
        </div>
      </section>

      {/* Resizable divider */}
      <UnitResizeDivider width={chatWidth} setWidth={setChatWidth} onReset={() => setChatWidth(DEFAULT_CHAT_WIDTH)} isDefault={chatWidth === DEFAULT_CHAT_WIDTH} />

      {/* The map stays mounted throughout the conversation; setup creates no records. */}
      <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4" aria-label="Prototype Unit canvas">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-ink">Portfolio</h2>
        </header>
        <div className={`flex min-h-0 flex-col gap-2 transition-[flex-basis] duration-300 motion-reduce:transition-none ${buildingUnderstanding ? "h-[300px] shrink-0" : "flex-1"}`}>
          {buildingUnderstanding && <div className="text-xs leading-relaxed text-muted-foreground"><p>{selectedAddress?.line}</p><p className="mt-1 text-[10px]">Illustrative mock lookup · approximate location</p></div>}
          <UnitLocationMap compact={Boolean(buildingUnderstanding)} stage={locationStage} address={locationAddress} candidate={selectedAddress ?? addressCandidates[0] ?? null} />
        </div>
        {buildingUnderstanding && <PrototypeUnitStructure understanding={buildingUnderstanding} reviewed={buildingStage === "reviewed"} editable={buildingStage !== "awaiting-description"} lastRemoved={lastRemoved?.unit.name ?? null} onUndo={() => undoRemoval()} onSave={(next, note) => applyDirectEdit(next, note)} onAdd={next => applyDirectEdit(next, "")} onRemove={(unit, index) => applyDirectEdit(units!.filter(u => u.number !== unit.number), `I've removed ${unit.name}.`, { unit, index })} />}
      </main>
    </div>
  );
}

export default function PrototypeUnit() {
  return (
    <PrototypeGate>
      <PrototypeUnitShell />
    </PrototypeGate>
  );
}
