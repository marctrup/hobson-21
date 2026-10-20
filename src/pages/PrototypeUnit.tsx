import { useEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrototypeGate } from "@/components/prototype/PrototypeGate";
import owlDefault from "@/assets/prototype/owl-default.png";

const RAIL_WIDTH = 68;
const DEFAULT_CHAT_WIDTH = 380;
const MIN_CHAT_WIDTH = 280;
const MIN_CANVAS_WIDTH = 320;

type UnitMessage = { id: number; text: string };

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
  const [messages, setMessages] = useState<UnitMessage[]>([]);
  const nextId = useRef(1);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    // Local echo only — no simulated reply, no AI integration yet.
    setMessages((prev) => [...prev, { id: nextId.current++, text }]);
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
        <RailItem icon="chat" label="Conversations" />
        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-[#56514A] text-white shadow-md transition hover:bg-[#56514A]"
            aria-label="A new conversation"
            onClick={() => { setMessages([]); setInput(""); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <span className="w-full px-1 text-center text-[10px] leading-tight text-ink-muted [overflow-wrap:anywhere]">A new conversation</span>
          <RailItem icon="gear" label="Back Office" />
          <div className="grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
        </div>
      </aside>

      {/* Chat panel */}
      <section className="relative flex shrink-0 flex-col border-r border-bone bg-white" style={{ width: chatWidth }} aria-label="Chat with Hobson">
        <header className="flex h-14 items-center justify-between border-b border-faint-rule px-5">
          <h1 className="text-[15px] font-semibold text-ink">Chat with Hobson</h1>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((message) => (
            <div key={message.id} className="self-end rounded-xl bg-[#56514A] px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm">
              {message.text}
            </div>
          ))}
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

      {/* Blank main canvas — the next feature is designed here */}
      <main className="min-w-0 flex-1" aria-label="Prototype Unit canvas" />
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
