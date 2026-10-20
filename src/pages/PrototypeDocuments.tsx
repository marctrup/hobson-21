import { useEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlDefault from "@/assets/prototype/owl-default.png";

// Prototype Documents: an independent, blank Hobson shell. Shares only visual styling
// with Prototype Work and Prototype Unit — never their components, data or state.

const RAIL_WIDTH = 68;
const DEFAULT_CHAT_WIDTH = 380;
const MIN_CHAT_WIDTH = 280;
const MIN_CANVAS_WIDTH = 320;

type Message = { id: number; text: string };

function RailItem({ icon, label, active }: { icon: "pin" | "doc" | "chat" | "gear"; label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`w-12 flex flex-col items-center gap-0.5 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-ring ${active ? "bg-secondary" : "hover:bg-paper"}`}
      aria-current={active ? "page" : undefined}
      aria-label={label}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted" aria-hidden>
        {icon === "pin" && (<><path d="M12 22s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="10" r="2.5" /></>)}
        {icon === "doc" && (<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></>)}
        {icon === "chat" && (<path d="M21 12a8 8 0 11-3-6.2L21 3v6h-6" />)}
        {icon === "gear" && (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5" /></>)}
      </svg>
      <span className={`w-full px-0.5 text-center text-[10px] leading-tight [overflow-wrap:anywhere] ${active ? "text-ink font-medium" : "text-ink-muted"}`}>{label}</span>
    </button>
  );
}

function ResizeDivider({ width, setWidth }: { width: number; setWidth: (n: number) => void }) {
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(width);
  const maxLeft = () => window.innerWidth - RAIL_WIDTH - MIN_CANVAS_WIDTH;
  const clamp = (n: number) => Math.max(MIN_CHAT_WIDTH, Math.min(maxLeft(), n));

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) setWidth(clamp(startW.current + e.clientX - startX.current)); };
    const onUp = () => { dragging.current = false; document.body.style.cursor = ""; document.body.style.userSelect = ""; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [setWidth]);

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize chat and main area"
      aria-valuenow={width}
      tabIndex={0}
      title="Drag to resize · double-click to reset"
      onKeyDown={(e) => {
        const step = e.shiftKey ? 48 : 16;
        if (e.key === "ArrowLeft") { e.preventDefault(); setWidth(clamp(width - step)); }
        if (e.key === "ArrowRight") { e.preventDefault(); setWidth(clamp(width + step)); }
      }}
      onMouseDown={(e) => { dragging.current = true; startX.current = e.clientX; startW.current = width; document.body.style.cursor = "col-resize"; document.body.style.userSelect = "none"; }}
      onDoubleClick={() => setWidth(DEFAULT_CHAT_WIDTH)}
      className="group relative w-1.5 shrink-0 cursor-col-resize select-none bg-bone-wash hover:bg-muted focus:outline-none focus-visible:bg-muted"
    >
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-bone" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-0.5 rounded border border-bone bg-background px-0.5 py-2 text-ink-muted">
        <span className="block h-0.5 w-0.5 rounded-full bg-current" />
        <span className="block h-0.5 w-0.5 rounded-full bg-current" />
        <span className="block h-0.5 w-0.5 rounded-full bg-current" />
      </div>
    </div>
  );
}

export default function PrototypeDocuments() {
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(1);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: nextId.current++, text }]);
    setInput("");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bone-wash text-ink">
      <aside className="flex w-[68px] shrink-0 flex-col items-center gap-2 border-r border-bone bg-background py-4">
        <div className="mb-2 grid h-10 w-10 place-items-center overflow-hidden rounded-xl" aria-hidden>
          <img src={owlDefault} alt="" className="h-10 w-10 object-contain" />
        </div>
        <RailItem icon="pin" label="Portfolio" />
        <RailItem icon="doc" label="Papers" active />
        <RailItem icon="chat" label="Conversations" />
        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          <button
            type="button"
            aria-label="A new conversation"
            onClick={() => { setMessages([]); setInput(""); }}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <span className="w-full px-1 text-center text-[9px] leading-tight text-ink-muted">A new conversation</span>
          <RailItem icon="gear" label="Back Office" />
          <div className="grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
        </div>
      </aside>

      <section className="relative flex shrink-0 flex-col border-r border-bone bg-background" style={{ width: chatWidth }} aria-label="Chat with Hobson">
        <header className="flex h-14 items-center border-b border-faint-rule px-5">
          <h1 className="text-[15px] font-semibold text-ink">Chat with Hobson</h1>
        </header>
        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m) => (
            <div key={m.id} className="min-w-0 max-w-full self-end rounded-xl bg-primary-light px-3.5 py-2.5 text-primary-foreground shadow-sm">
              <p className="break-words text-sm leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-faint-rule px-5 pb-4 pt-2">
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring">
            <Button type="button" variant="ghost" size="icon" aria-label="Attach a paper" title="Attach a paper" className="h-9 w-9 shrink-0">
              <Paperclip className="h-5 w-5" aria-hidden />
            </Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder="Ask Hobson…" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0">
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Button>
          </form>
        </div>
      </section>

      <ResizeDivider width={chatWidth} setWidth={setChatWidth} />

      <main className="min-w-0 flex-1" aria-label="Prototype Documents canvas" />
    </div>
  );
}
