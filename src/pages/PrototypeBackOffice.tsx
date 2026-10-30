import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrototypeGateAdmitted } from "@/components/prototype/PrototypeGate";
import owlDefault from "@/assets/prototype/owl-default.png";
import professor from "@/assets/prototype/character-professor-transparent.png";
import architect from "@/assets/prototype/character-architect-transparent.png";
import broker from "@/assets/prototype/character-broker-transparent.png";
import keeper from "@/assets/prototype/character-keeper-transparent.png";
import inspector from "@/assets/prototype/character-inspector-transparent.png";
import BackOfficeClassroom from "./BackOfficeClassroom";

// Back Office: one Hobson conversation that brings the right colleague's existing prototype into view.
// The five prototypes are reused unchanged (their own menu hidden) and stay mounted once opened, so work survives switching.
const PrototypeDocuments = lazy(() => import("./PrototypeDocuments"));
const PrototypeUnit = lazy(() => import("./PrototypeUnit"));
const PrototypeContacts = lazy(() => import("./PrototypeContacts"));
const PrototypeSecurity = lazy(() => import("./PrototypeSecurity"));
const PrototypeCompliance = lazy(() => import("./PrototypeCompliance"));

export type ColleagueId = "professor" | "architect" | "broker" | "keeper" | "inspector";
export const COLLEAGUES: { id: ColleagueId; name: string; area: string; choice: string; contribution: string; img: string; handover: string; Comp: React.ComponentType }[] = [
  { id: "professor", name: "The Professor", area: "Portfolio Knowledge", choice: "Add or review papers", contribution: "Hello, I'm The Professor. I maintain everything Hobson knows from your documents — leases, licences, plans, reports and every other record you entrust to us.", img: professor, handover: "Of course. My colleague the Professor will take a look — attach the paper and we'll begin.", Comp: PrototypeDocuments },
  { id: "architect", name: "The Architect", area: "Portfolio Structure", choice: "Add or organise Units", contribution: "Hello, I'm The Architect. I keep the structure of your estate accurate — units, properties, hierarchies and groupings — so Hobson always understands how everything fits together.", img: architect, handover: "Let's establish the address first. My colleague the Architect has the map ready.", Comp: PrototypeUnit },
  { id: "broker", name: "The Broker", area: "Relationships", choice: "Manage people and contacts", contribution: "Hello, I'm The Broker. I maintain Hobson's understanding of the people and organisations connected to your portfolio, so Hobson always knows who's involved in your work.", img: broker, handover: "Here are the people we know. Tell me who to add or change, and I'll check for anyone we already have.", Comp: PrototypeContacts },
  { id: "keeper", name: "The Keeper", area: "Security & Access", choice: "Manage access", contribution: "Hello, I'm The Keeper. I keep watch over who may see and change what, so nothing in your portfolio moves without the right authority.", img: keeper, handover: "Here is who has access. Nothing changes until you approve it.", Comp: PrototypeSecurity },
  { id: "inspector", name: "The Inspector", area: "Compliance Position", choice: "Review compliance", contribution: "Hello, I'm The Inspector. I compare what is known against what is required, helping Hobson understand your compliance position and quietly identifying anything that's missing.", img: inspector, handover: "I'll bring together the compliance responsibilities and what we have recorded.", Comp: PrototypeCompliance },
];

/** Which colleague a request belongs to; null when Hobson should ask. */
export function routeRequest(text: string): ColleagueId | null {
  const t = text.toLowerCase();
  const byName = COLLEAGUES.find((c) => t.includes(c.name.slice(4).toLowerCase()));
  if (byName) return byName.id;
  if (/\b(access|invite|permission|suspend|superuser|who can)\b/.test(t)) return "keeper";
  if (/\b(compliance|gas safety|eicr|legionella|epc|hmo|licence|section 13|notice|inspection|renewal)\b/.test(t)) return "inspector";
  if (/\b(contact|contractor|electrician|plumber|solicitor|landlord|tenant details|managing agent|spreadsheet|people we know|phone|email)\b/.test(t)) return "broker";
  if (/\b(unit|building|address|postcode|flat|floor|place|map)\b/.test(t) && !/\b(lease|paper|deed)\b/.test(t)) return "architect";
  if (/\b(paper|lease|deed|document|upload|attach|batch|tenancy|licence to|variation|reading)\b/.test(t)) return "professor";
  return null;
}

/** Inside a colleague's work, the speaker is that colleague: swap Hobson's owl and chat title for theirs. */
const voiced = new WeakSet<HTMLElement>();
export function voiceAs(el: HTMLElement | null, img: string, name: string, contribution?: string) {
  if (!el || voiced.has(el)) return;
  voiced.add(el);
  const title = `Chat with ${name.replace(/^The /, "the ")}`;
  const introduction = contribution ? document.createElement("div") : null;
  if (introduction) {
    introduction.className = "flex min-w-0 shrink-0 items-start gap-2";
    introduction.dataset.colleagueIntroduction = "true";
    const portrait = document.createElement("img");
    portrait.src = img;
    portrait.alt = name;
    portrait.className = "h-10 w-10 shrink-0 object-contain";
    const body = document.createElement("div");
    body.className = "min-w-0 px-3.5 py-2.5";
    const text = document.createElement("p");
    text.className = "whitespace-pre-line break-words text-sm leading-relaxed";
    text.textContent = contribution ?? "";
    body.append(text);
    introduction.append(portrait, body);
  }
  const apply = () => {
    const conversation = el.querySelector<HTMLElement>('[role="log"][aria-label="Conversation"]');
    if (introduction && conversation && conversation.firstElementChild !== introduction) {
      conversation.prepend(introduction);
    }
    el.querySelectorAll<HTMLImageElement>("img").forEach((i) => {
      if (i.getAttribute("src") === owlDefault) { i.src = img; if (i.alt) i.alt = name; }
    });
    el.querySelectorAll<HTMLElement>("h1").forEach((h) => {
      if (h.textContent?.trim() === "Chat with Hobson") h.textContent = title;
    });
    el.querySelectorAll<HTMLElement>("[aria-label], [title]").forEach((n) => {
      (["aria-label", "title"] as const).forEach((a) => {
        if (n.getAttribute(a) === "Chat with Hobson") n.setAttribute(a, title);
      });
    });
  };
  apply();
  new MutationObserver(apply).observe(el, { subtree: true, childList: true, attributes: true, attributeFilter: ["src"], characterData: true });
}

type Message = { id: number; role: "user" | "hobson"; text: string; choices?: boolean };
const WELCOME = "Good day, and welcome to the Back Office.\n\nMy colleagues and I keep watch over the records that hold your portfolio together — papers, Units, people, access and compliance.\n\nMight I ask what you would like us to look at first?";

export default function PrototypeBackOffice() {
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "hobson", text: WELCOME, choices: true }]);
  const [input, setInput] = useState("");
  const [active, setActive] = useState<ColleagueId | null>(null);
  const [opened, setOpened] = useState<ColleagueId[]>([]);
  const nextId = useRef(1);
  const logEnd = useRef<HTMLDivElement>(null);
  useEffect(() => { logEnd.current?.scrollIntoView?.({ block: "end" }); }, [messages, active]);

  const say = (role: Message["role"], text: string, choices = false) => setMessages((m) => [...m.map((x) => ({ ...x, choices: false })), { id: nextId.current++, role, text, choices }]);
  const bring = (id: ColleagueId) => { setOpened((o) => (o.includes(id) ? o : [...o, id])); setActive(id); };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput("");
    say("user", text);
    const id = routeRequest(text);
    setTimeout(() => {
      if (!id) { say("hobson", "I'm afraid I don't quite follow — might you tell me whether it concerns papers, Units, people, access or compliance?", true); return; }
      const c = COLLEAGUES.find((x) => x.id === id)!;
      say("hobson", c.handover);
      bring(id);
    }, 300);
  };
  const choose = (id: ColleagueId) => { const c = COLLEAGUES.find((x) => x.id === id)!; say("user", `${c.name} — ${c.choice}`); setTimeout(() => { say("hobson", c.handover); bring(id); }, 250); };
  const home = () => { setActive(null); say("hobson", "We are back in the Back Office, and everything you confirmed is kept. How may I help you next?", true); };

  const current = COLLEAGUES.find((c) => c.id === active);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bone-wash text-ink">
      <aside className="relative flex w-[132px] shrink-0 flex-col border-r border-bone bg-background py-4">
        <div className="grid h-10 w-10 place-items-center self-center" aria-hidden><img src={owlDefault} alt="" className="h-10 w-10 object-contain" /></div>
        <nav aria-label="Back Office" className="mt-auto flex w-full flex-col gap-1 border-t border-faint-rule px-2 pt-3">
          <button type="button" aria-current={!active ? "page" : undefined} onClick={() => active && home()} className={`rounded-lg px-3 py-2 text-left text-[11px] font-medium leading-tight text-ink transition ${!active ? "bg-secondary" : "hover:bg-paper"}`}>Back Office</button>
          <div className="mt-2 grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal" title="Admin">MT</div>
        </nav>
      </aside>

      {/* Back Office conversation: visible until a colleague's work is brought into view */}
      <section aria-label="Chat with Hobson" className={`w-full shrink-0 flex-col border-r border-bone bg-background md:w-[380px] ${active ? "hidden" : "flex"}`}>
        <header className="flex h-14 shrink-0 items-center border-b border-faint-rule px-5"><h1 className="text-[15px] font-semibold">Back Office</h1></header>
        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => {
            const cont = i > 0 && messages[i - 1].role === "hobson" && m.role === "hobson";
            return (
              <div key={m.id} className={`flex min-w-0 flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex min-w-0 gap-2">
                  {m.role === "hobson" && (cont ? <span className="w-10 shrink-0" /> : <img src={owlDefault} alt="Hobson" className="h-10 w-10 shrink-0 object-contain" />)}
                  <div className={`min-w-0 rounded-lg px-3.5 py-2.5 ${m.role === "user" ? "bg-secondary" : ""}`}><p className="whitespace-pre-line break-words text-sm leading-relaxed">{m.text}</p></div>
                </div>
              </div>
            );
          })}
          <div ref={logEnd} />
        </div>
        <div className="border-t border-faint-rule px-5 pb-4 pt-3">
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-1 rounded-full border border-input bg-background px-4 py-2 focus-within:ring-2 focus-within:ring-ring">
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder="How may I help?" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0"><ArrowRight className="h-5 w-5" /></Button>
          </form>
        </div>
      </section>

      {/* Floating team occupies the workspace beside the original sidebar and conversation. */}
      <main aria-label="Back Office workspace" className={`min-w-0 flex-1 flex-col ${active ? "flex" : "hidden md:flex"}`}>
        {current && (
          <div className="flex h-11 shrink-0 items-center gap-3 border-b border-bone bg-background px-4">
            <img src={current.img} alt="" aria-hidden className="h-7 w-7 object-contain" />
            <p className="min-w-0 truncate text-sm"><span className="font-medium">{current.name}</span> <span className="text-ink-muted">· {current.area}</span></p>
            <span className="ml-auto" />
            <Button size="sm" variant="ghost" onClick={home} aria-label="Back to the Back Office conversation"><X className="mr-1 h-3.5 w-3.5" />Back Office</Button>
          </div>
        )}
        <div className="back-office-team-workspace relative min-h-0 flex-1 overflow-auto">
          {!active && <BackOfficeClassroom introductions={COLLEAGUES} onOpen={(id) => choose(id as ColleagueId)} />}
          {opened.map((id) => {
            const c = COLLEAGUES.find((x) => x.id === id);
            if (!c) return null;
            return (
              <div key={id} ref={(el) => voiceAs(el, c.img, c.name, c.contribution)} data-colleague={id} hidden={id !== active} className="absolute inset-0 [&>div]:!h-full [&>div>aside:first-child]:hidden">
                <PrototypeGateAdmitted.Provider value={true}><Suspense fallback={null}><c.Comp /></Suspense></PrototypeGateAdmitted.Provider>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
