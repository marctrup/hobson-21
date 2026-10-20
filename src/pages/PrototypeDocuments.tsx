import { useEffect, useRef, useState } from "react";
import { Check, FileText, MessageCircle, Paperclip, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlDefault from "@/assets/prototype/owl-default.png";
import leaseAsset from "@/assets/prototype/russell-square-house-lease.pdf.asset.json";
import PrototypeDocumentsPreview from "./PrototypeDocumentsPreview";
import PrototypeDocumentsDetails from "./PrototypeDocumentsDetails";
import { confirmPaper, DETAIL_STAGES, emptyPaperJourney, EXAMPLE_LEASE_FILENAME, PAPER_TYPES, proposePaper, receivePaper, type PaperStage, type PrototypePaper } from "./prototypeDocumentsPaper";
import { answerEffective, correctDetail, emptyReview, type DetailKey, type DetailsReview } from "./prototypeDocumentsDetails";

// Prototype Documents: an independent, blank Hobson shell. Shares only visual styling
// with Prototype Work and Prototype Unit — never their components, data or state.

const WORKING_PHRASES = ["Reviewing the lease…", "Checking the dates and parties…", "Bringing the details together…"];
const RAIL_WIDTH = 68;
const DEFAULT_CHAT_WIDTH = 380;
const MIN_CHAT_WIDTH = 280;
const MIN_CANVAS_WIDTH = 320;

type Message = { id: number; text: string; role: "user" | "hobson"; attachment?: boolean };

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
  const [journey, setJourney] = useState(emptyPaperJourney);
  const [review, setReview] = useState<DetailsReview>(emptyReview);
  const [goTo, setGoTo] = useState<{ page: number; nonce: number } | undefined>();
  const [wide, setWide] = useState(true);
  const [working, setWorking] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showChat, setShowChat] = useState(true);
  const fileInput = useRef<HTMLInputElement>(null);
  const logEnd = useRef<HTMLDivElement>(null);
  const uploadUrl = useRef<string | null>(null);
  const generation = useRef(0);
  const nextId = useRef(1);
  const addMessage = (role: Message["role"], text: string, attachment = false) => {
    setMessages((prev) => [...prev, { id: nextId.current++, role, text, attachment }]);
  };
  useEffect(() => { logEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, journey.stage]);
  useEffect(() => () => { generation.current++; if (uploadUrl.current) URL.revokeObjectURL(uploadUrl.current); }, []);
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWide(e.contentRect.width >= 820));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (journey.stage !== "reading") return;
    const timer = window.setTimeout(() => {
      setJourney((current) => proposePaper(current));
      addMessage("hobson", "I've had a look at your paper. I think this is a Business Lease.\n\nHave I got that right?");
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [journey.stage]);
  useEffect(() => {
    if (journey.stage !== "checking") return;
    const timer = window.setTimeout(() => {
      addMessage("hobson", "I've checked the main details I need to place this paper.\n\nThere's one date I'd like you to check.");
      addMessage("hobson", "The lease is dated 22 August 2025. Clause 16 says its terms don't take effect until it has been dated.\n\nShall I use 22 August 2025 as its effective date?");
      setJourney((j) => j.stage === "checking" ? { ...j, stage: "effective" } : j);
    }, 1400);
    setWorking(0);
    const steps = [window.setTimeout(() => setWorking(1), 470), window.setTimeout(() => setWorking(2), 940)];
    return () => { window.clearTimeout(timer); steps.forEach(window.clearTimeout); };
  }, [journey.stage]);
  const restart = () => {
    generation.current++;
    if (uploadUrl.current) URL.revokeObjectURL(uploadUrl.current);
    uploadUrl.current = null;
    setJourney(emptyPaperJourney); setReview(emptyReview); setGoTo(undefined); setMessages([]); setInput(""); setSelectionOpen(false); setUploadError(""); setUploading(false); setShowChat(true);
  };
  const receive = (paper: PrototypePaper) => {
    setJourney(receivePaper(paper)); setSelectionOpen(false); setShowChat(true);
    addMessage("user", paper.filename, true);
    addMessage("hobson", paper.example ? "I'll take a first look at this." : "I've received your paper. I haven't read or identified this one in this demonstration. What kind of paper is it?");
  };
  const upload = async (file: File) => {
    setUploadError("");
    if (!file.name.toLowerCase().endsWith(".pdf")) { setUploadError("Please choose a PDF."); return; }
    const attempt = generation.current;
    setUploading(true);
    try {
      const bytes = await file.arrayBuffer();
      if (!new TextDecoder().decode(bytes.slice(0, 1024)).includes("%PDF-")) throw new Error("invalid-pdf");
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))).map((n) => n.toString(16).padStart(2, "0")).join("");
      if (attempt !== generation.current) return;
      if (uploadUrl.current) URL.revokeObjectURL(uploadUrl.current);
      uploadUrl.current = URL.createObjectURL(file);
      receive({ filename: file.name, url: uploadUrl.current, example: hash === "122fd13ef4d5cea0d81575c1de6b49127dd1dcb38b3f8bdb9747e934e9abb1c9" });
    } catch { if (attempt === generation.current) setUploadError("I couldn't open that PDF. Please choose another paper."); }
    finally { if (attempt === generation.current) setUploading(false); }
  };
  const chooseType = (type: string, original = false) => {
    const updated = confirmPaper(journey, type);
    if (updated === journey) return;
    setJourney(updated.paper?.example ? { ...updated, stage: "checking" } : updated); setInput("");
    addMessage("user", original ? "Yes, that's right" : type.trim());
    addMessage("hobson", original ? "Good. I'll check the key details next." : `Thanks. I'll treat it as a ${type.trim()}.\n\nI'll check the key details next.`);
  };
  const setStage = (stage: PaperStage) => setJourney((j) => ({ ...j, stage }));
  const askOthers = () => { addMessage("hobson", "Do the other details look right?"); setStage("otherDetails"); };
  const answer = (kind: "confirmed" | "other" | "unsure", date?: string) => {
    if (kind === "other" && !date) { addMessage("user", "Use another date"); addMessage("hobson", "What date should I use as the effective date?"); setStage("effectiveOther"); return; }
    const next = answerEffective(review, kind, date);
    if (next === review) return;
    setReview(next); setInput("");
    if (kind === "confirmed") { addMessage("user", "Yes, use that date"); addMessage("hobson", "I'll use 22 August 2025 as the effective date."); }
    else if (kind === "unsure") { addMessage("user", "Not sure"); addMessage("hobson", "That's fine. I'll leave the effective date unconfirmed for now."); }
    else { addMessage("user", date!.trim()); addMessage("hobson", "Understood. I'll keep the date on the paper as 22 August 2025 and record the effective date you've given me separately."); }
    askOthers();
  };
  const correct = (key: DetailKey, value: string) => {
    const next = correctDetail(review, key, value);
    if (next === review) return;
    setReview(next);
    if (key === "effectiveDate") addMessage("hobson", "Understood. I'll keep the date on the paper as 22 August 2025 and record the effective date you've given me separately.");
    else addMessage("hobson", "I've updated it.");
    if (journey.stage === "correcting") askOthers();
  };
  const showInPaper = (page: number) => setGoTo((g) => ({ page, nonce: (g?.nonce ?? 0) + 1 }));

  const send = () => {
    const text = input.trim();
    if (!text) return;
    if (journey.stage === "other" || journey.stage === "choosing") { chooseType(text); return; }
    if (journey.stage === "proposed" && /^(yes|yes,? that's right)[.!]?$/i.test(text)) { chooseType("Business Lease", true); return; }
    if (journey.stage === "effectiveOther") { answer("other", text); return; }
    addMessage("user", text);
    setInput("");
  };

  const detailsShown = !!journey.paper?.example && DETAIL_STAGES.includes(journey.stage) && journey.stage !== "checking";
  const confirmed = journey.stage === "complete" || DETAIL_STAGES.includes(journey.stage);

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
          <Button
            type="button"
            aria-label="A new conversation"
            onClick={restart}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
          </Button>
          <span className="w-full px-1 text-center text-[9px] leading-tight text-ink-muted">A new conversation</span>
          <RailItem icon="gear" label="Back Office" />
          <div className="grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
        </div>
      </aside>

      <section className={`relative z-20 shrink-0 flex-col border-r border-bone bg-background max-md:absolute max-md:inset-y-0 max-md:left-[68px] max-md:w-[calc(100%-68px)] ${showChat ? "flex" : "hidden md:flex"} md:w-[var(--chat-width)]`} style={{ "--chat-width": `${chatWidth}px` } as React.CSSProperties} aria-label="Chat with Hobson">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-faint-rule px-5">
          <h1 className="text-[15px] font-semibold text-ink">Chat with Hobson</h1>
          {journey.paper && <Button variant="ghost" size="icon" className="md:hidden" aria-label="View paper" onClick={() => setShowChat(false)}><FileText className="h-4 w-4" /></Button>}
        </header>
        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex min-w-0 gap-2 ${m.role === "user" ? "self-end" : "self-start"}`}>
              {m.role === "hobson" && <img src={owlDefault} alt="Hobson" className="h-10 w-10 shrink-0 object-contain" />}
              <div className={`min-w-0 rounded-lg px-3.5 py-2.5 ${m.role === "user" ? "bg-secondary text-ink" : "text-ink"}`}>
                {m.attachment && <FileText className="mb-2 h-5 w-5 text-ink-muted" aria-hidden />}
                <p className="break-words whitespace-pre-line text-sm leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
          {journey.stage === "reading" && <div role="status" aria-label="Taking a first look" className="ml-12 flex gap-1.5 py-2 text-ink-muted motion-safe:animate-pulse"><span>·</span><span>·</span><span>·</span></div>}
          {journey.stage === "proposed" && <div className="ml-12 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => chooseType("Business Lease", true)}>Yes, that's right</Button>
            <Button variant="ghost" onClick={() => { setJourney((j) => ({ ...j, stage: "choosing" })); addMessage("user", "Change"); addMessage("hobson", "What kind of paper is it?"); }}>Change</Button>
          </div>}
          {journey.stage === "choosing" && <div className="ml-12 flex flex-col items-start gap-1">{PAPER_TYPES.map((type) => <Button key={type} variant="ghost" className="h-auto whitespace-normal text-left" onClick={() => { if (type === "Something else") { setJourney((j) => ({ ...j, stage: "other" })); addMessage("user", type); addMessage("hobson", "What would you call it?"); } else chooseType(type); }}>{type}</Button>)}</div>}
          {journey.stage === "checking" && <p role="status" className="ml-12 py-2 text-sm italic text-ink-muted motion-safe:animate-pulse">{WORKING_PHRASES[working]}</p>}
          {journey.stage === "effective" && <div className="ml-12 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => answer("confirmed")}>Yes, use that date</Button>
            <Button variant="ghost" onClick={() => answer("other")}>Use another date</Button>
            <Button variant="ghost" onClick={() => answer("unsure")}>Not sure</Button>
          </div>}
          {journey.stage === "otherDetails" && <div className="ml-12 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { addMessage("user", "Everything looks right"); addMessage("hobson", "Good. I'll work out where this paper belongs."); setStage("ready"); }}>Everything looks right</Button>
            <Button variant="ghost" onClick={() => { addMessage("user", "I need to change something"); addMessage("hobson", "Of course. Choose Change beside the detail in What I've read, and I'll update it."); setStage("correcting"); if (!wide) setShowChat(false); }}>I need to change something</Button>
          </div>}
          <div ref={logEnd} />
        </div>
        <div className="border-t border-faint-rule px-5 pb-4 pt-2">
          {selectionOpen && <div role="group" aria-label="Choose a paper" className="mb-3 border-b border-bone pb-3">
            <div className="flex items-center justify-between"><span className="text-xs text-ink-muted">A paper for Hobson</span><Button variant="ghost" size="icon" aria-label="Close paper selection" onClick={() => setSelectionOpen(false)}><X className="h-4 w-4" /></Button></div>
            <Button variant="ghost" className="w-full justify-start" disabled={uploading} onClick={() => fileInput.current?.click()}><Paperclip className="mr-2 h-4 w-4" />{uploading ? "Opening paper…" : "Upload a paper"}</Button>
            <Button variant="ghost" className="w-full justify-start" disabled={uploading} onClick={() => receive({ filename: EXAMPLE_LEASE_FILENAME, example: true, url: leaseAsset.url })}><FileText className="mr-2 h-4 w-4" />Try an example lease</Button>
            {uploadError && <p role="alert" className="mt-2 text-xs text-destructive">{uploadError}</p>}
          </div>}
          <input ref={fileInput} type="file" accept="application/pdf,.pdf" aria-label="Select a PDF" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); e.target.value = ""; }} />
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring">
            <Button type="button" variant="ghost" size="icon" aria-label="Attach a paper" title="Attach a paper" disabled={journey.stage !== "empty"} onClick={() => setSelectionOpen((open) => !open)} className="h-9 w-9 shrink-0">
              <Paperclip className="h-5 w-5" aria-hidden />
            </Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder={journey.stage === "other" ? "What kind of paper?" : journey.stage === "effectiveOther" ? "Effective date, e.g. 1 September 2025" : "Ask Hobson…"} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0">
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Button>
          </form>
        </div>
      </section>

      <div className="hidden h-full md:flex"><ResizeDivider width={chatWidth} setWidth={setChatWidth} /></div>

      <main ref={mainRef} className="flex min-w-0 flex-1 flex-col" aria-label="Prototype Documents canvas">
        {journey.paper && <>
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-bone bg-background px-5">
            <span className="text-sm font-medium">Your paper</span>
            <div className="flex shrink-0 items-center gap-1"><Button variant="ghost" size="icon" className="md:hidden" aria-label="Chat with Hobson" title="Chat with Hobson" onClick={() => setShowChat(true)}><MessageCircle className="h-4 w-4" /></Button><Button variant="ghost" size="sm" aria-label="Restart demo" title="Restart demo" onClick={restart}><RotateCcw className="h-3.5 w-3.5 md:mr-2" /><span className="hidden md:inline">Restart demo</span></Button></div>
          </header>
          <div className={`flex min-h-0 flex-1 ${wide ? "flex-row" : "flex-col"}`}>
            {detailsShown && <PrototypeDocumentsDetails review={review} collapsible={!wide} onShow={showInPaper} onCorrect={correct} canChangeEffective={journey.stage !== "effective" && journey.stage !== "effectiveOther"} />}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col"><PrototypeDocumentsPreview paper={journey.paper} goTo={goTo} /></div>
          </div>
          {journey.paperType && <div className="shrink-0 border-t border-bone bg-background px-6 py-4" aria-label="Paper identification">
            {!confirmed && <p className="mb-1 text-xs text-ink-muted">I think this is</p>}
            <p className="flex items-center gap-2 text-sm font-medium">{journey.paperType}{confirmed && <Check className="h-4 w-4 text-primary" aria-label="Confirmed" />}</p>
          </div>}
        </>}
      </main>
    </div>
  );
}
