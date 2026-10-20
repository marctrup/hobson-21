import { useEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrototypeGate } from "@/components/prototype/PrototypeGate";
import owlDefault from "@/assets/prototype/owl-default.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const RAIL_WIDTH = 68;
const DEFAULT_CHAT_WIDTH = 380;
const MIN_CHAT_WIDTH = 280;
const MIN_CANVAS_WIDTH = 320;

type UnitMessage = { id: number; text: string; role: "user" | "hobson" };

const OPENING_MESSAGE: UnitMessage = { id: 0, role: "hobson", text: "I can help you organise the places in your portfolio. Shall we get started?" };

const SETUP_CHOICES = [
  { label: "A standalone Unit", response: "Of course. Let's set up your Unit." },
  { label: "A Unit Group with several Units", response: "Of course. Let's set up your Unit Group." },
  { label: "I'm not sure — help me work it out", response: "That's fine. I'll help you work out how best to organise it." },
] as const;

const STANLEY_ADDRESS = "Stanley House, 14 Bedford Square, London, WC1B 3JA";
type LocationStage = "idle" | "awaiting-address" | "proposed" | "confirmed" | "unverified";
const STANLEY_COORDINATES: L.LatLngTuple = [51.51855, -0.13005];
const isStanleyAddress = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "") === STANLEY_ADDRESS.toLowerCase().replace(/[^a-z0-9]/g, "");

function UnitLocationMap({ stage, address }: { stage: LocationStage; address: string }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const matched = stage === "proposed" || stage === "confirmed";

  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, { center: [51.509, -0.12], zoom: 13, scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19,
    }).addTo(instance);
    map.current = instance;
    const observer = new ResizeObserver(() => instance.invalidateSize({ animate: false }));
    observer.observe(container.current);
    return () => { observer.disconnect(); instance.remove(); map.current = null; marker.current = null; };
  }, []);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    marker.current?.remove();
    marker.current = null;
    if (!matched) return;
    const icon = L.divIcon({ className: "", html: '<span class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-7 7-13a7 7 0 0 0-14 0c0 6 7 13 7 13Z"/><circle cx="12" cy="9" r="2"/></svg></span>', iconSize: [36, 36], iconAnchor: [18, 36] });
    marker.current = L.marker(STANLEY_COORDINATES, { icon, title: "Stanley House — illustrative location" })
      .addTo(instance).bindTooltip("Stanley House", { permanent: true, direction: "top", offset: [0, -36] });
    instance.flyTo(STANLEY_COORDINATES, 17, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches, duration: 0.8 });
  }, [matched]);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border">
      <div ref={container} className="absolute inset-0" aria-label="Location map" />
      <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex justify-center">
        <div className="max-w-full rounded-md border border-border bg-background px-4 py-3 text-foreground shadow-sm" role="status" aria-label="Location status">
          <p className="text-sm font-semibold">{matched ? "Stanley House" : "Location needs verification"}</p>
          <p className="mt-1 break-words text-xs text-muted-foreground">{matched ? STANLEY_ADDRESS : address || "Awaiting the correct address"}</p>
          <p className="mt-2 text-xs font-medium">{stage === "confirmed" ? "Location confirmed" : matched ? "Proposed location — not yet confirmed" : "No confirmed location"}</p>
          <p className="mt-1 text-xs text-muted-foreground">Illustrative location{matched ? " · approximate marker" : ""}</p>
        </div>
      </div>
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
  const [showLocationMap, setShowLocationMap] = useState(false);
  const nextId = useRef(1);
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
      setMessages((previous) => [...previous, { id: nextId.current++, role: "hobson", text: "What is the full address?" }]);
      setLocationStage("awaiting-address");
    }
  };

  const respondToLocation = (confirm: boolean) => {
    if (locationStage !== "proposed") return;
    setMessages((previous) => [...previous,
      { id: nextId.current++, role: "user", text: confirm ? "Yes, that's the place" : "Choose a different location" },
      { id: nextId.current++, role: "hobson", text: confirm ? "Good. I've got the location for Stanley House." : "Of course. What's the correct address?" },
    ]);
    setLocationStage(confirm ? "confirmed" : "awaiting-address");
    setLocationPromptId(null);
    if (!confirm) setLocationAddress("");
    setInput("");
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    if (locationStage === "proposed") {
      if (text.toLowerCase() === "yes, that's the place") { respondToLocation(true); return; }
      if (text.toLowerCase() === "choose a different location") { respondToLocation(false); return; }
    }
    if (locationStage === "awaiting-address" || locationStage === "unverified") {
      const found = isStanleyAddress(text);
      const replyId = nextId.current++;
      setMessages((previous) => [...previous,
        { id: nextId.current++, role: "user", text },
        { id: replyId, role: "hobson", text: found ? "I've found Stanley House at 14 Bedford Square, London, WC1B 3JA. Is this the right place?" : "I haven't verified that location. You can give me another address." },
      ]);
      setLocationAddress(text);
      setLocationStage(found ? "proposed" : "unverified");
      setLocationPromptId(found ? replyId : null);
      setShowLocationMap(true);
      setInput("");
      return;
    }
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
            onClick={() => { setMessages([OPENING_MESSAGE]); setInput(""); setSetupPromptId(null); setShowInvitation(true); setLocationStage("idle"); setLocationPromptId(null); setLocationAddress(""); setShowLocationMap(false); }}
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
                  <p className="break-words text-sm leading-relaxed">{message.text}</p>
                  {message.id === OPENING_MESSAGE.id && showInvitation && (
                    <Button variant="ghost" onClick={() => startSetup()} className="mt-3 h-auto justify-start whitespace-normal px-0 py-1 text-left text-sm font-normal text-ink-muted hover:bg-transparent hover:text-ink">
                      Set up a place →
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
                  {locationPromptId === message.id && locationStage === "proposed" && (
                    <div className="mt-3 flex w-full flex-col items-stretch gap-2">
                      <Button variant="outline" onClick={() => respondToLocation(true)} className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2.5 text-left font-normal">Yes, that's the place</Button>
                      <Button variant="outline" onClick={() => respondToLocation(false)} className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2.5 text-left font-normal">Choose a different location</Button>
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

      {/* Portfolio context remains a placeholder; setup creates no records. */}
      <main className="flex min-w-0 flex-1 flex-col gap-4 p-4" aria-label="Prototype Unit canvas">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-ink">Portfolio</h2>
        </header>
        {showLocationMap ? <UnitLocationMap stage={locationStage} address={locationAddress} /> : <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#56514A]/25 bg-white/60">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#56514A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
            <path d="M9 4v14M15 6v14" />
          </svg>
          <p className="text-sm font-medium tracking-wide text-ink-muted">Map</p>
        </div>}
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
