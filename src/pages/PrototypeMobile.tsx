/**
 * PrototypeMobile — phone-first companion to /prototype.
 *
 * Scope: scope navigation (Portfolio → Property → Unit), intelligent
 * action cards ("On your desk") with Perform + Review gates, chat with
 * Hobson (locked composer, scripted answers), quick overviews, and a
 * "What I've done" log.
 *
 * Intentionally NOT included: map, Admin agents, Documents library,
 * draggable split-panes. The desktop /prototype experience is untouched.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ChevronRight,
  RotateCcw,
  Send,
  Lock,
  X,
  Check,
  Sparkles,
  ClipboardList,
  MessageCircle,
  ListChecks,
  Building2,
  Home,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";
import SummaryCard from "./prototype/SummaryCard";
import {
  SUMMARY_PROPERTIES,
  SummaryScope,
  summaryQuestionFor,
  summaryIntroFor,
} from "./prototype/summaryData";

/* ────────────────────────────────────────────────────────────────
   Types & data
   ──────────────────────────────────────────────────────────────── */

type Tab = "desk" | "chat" | "done";
type ScopeLevel = "portfolio" | "property" | "unit";

type Scope =
  | { level: "portfolio" }
  | { level: "property"; propertyId: string }
  | { level: "unit"; propertyId: string; unitId: string; unitLabel: string };

type Urgency = "now" | "week" | "watch";

type ActionCard = {
  id: string;
  scopeLevel: ScopeLevel;
  propertyId?: string;
  unitId?: string;
  title: string;
  reason: string;
  due: string;
  urgency: Urgency;
  state: "not_started" | "in_progress" | "ready_to_approve";
  performBeats: Beat[];
};

type Beat = {
  speaker: "hobson" | "user";
  text: string;
  approve?: string; // approval button label; when set the beat is a gate
  note?: string;    // small explanatory note
};

type ChatMsg = {
  id: string;
  from: "hobson" | "user" | "system";
  text?: string;
  card?: ActionCard;
  summary?: { kind: "occupational" | "compliance"; scope: SummaryScope };
};

type WorkLog = { id: string; when: string; title: string; detail: string };

/* ── Action cards (mobile-curated subset) ─────────────────────── */

const ACTION_CARDS: ActionCard[] = [
  {
    id: "PA-001",
    scopeLevel: "property",
    propertyId: "nugent",
    title: "Fire alarm certificate expired",
    reason: "Annual fire-alarm test certificate for 5 Nugent Terrace lapsed 3 weeks ago.",
    due: "Overdue",
    urgency: "now",
    state: "in_progress",
    performBeats: [
      { speaker: "hobson", text: "I've contacted the previous tester (FireSafe Ltd) and asked for a callback to re-test the panel. Awaiting confirmation." },
      { speaker: "hobson", text: "Suggested wording for the tenant notice is ready. Shall I send it?", approve: "Send tenant notice" },
      { speaker: "hobson", text: "Notice sent. I'll log the re-test certificate in your library once received." },
    ],
  },
  {
    id: "PA-004",
    scopeLevel: "unit",
    propertyId: "stanley",
    unitId: "stanley-f8",
    title: "Rent review — find market comparables",
    reason: "Flat 8, Stanley House is up for review (30 Aug 2026). I can pull comparables and propose new rent.",
    due: "Review in 9 weeks",
    urgency: "week",
    state: "not_started",
    performBeats: [
      { speaker: "hobson", text: "Searching Rightmove, Zoopla and OnTheMarket for similar 2-bed flats in NW11…" },
      { speaker: "hobson", text: "Found 6 comparables. Median asking is £46,800 p.a. Current rent £42,600 p.a. (10% below market).", note: "Sources: Rightmove (3), Zoopla (2), OnTheMarket (1)" },
      { speaker: "hobson", text: "I recommend proposing £46,500 p.a. via Section 13. Approve to draft the notice.", approve: "Draft Section 13 notice" },
      { speaker: "hobson", text: "Notice drafted with the new figure and effective date. Approve to prepare the tenant email.", approve: "Prepare email" },
      { speaker: "hobson", text: "Email ready with notice attached. Approve to add to your Outlook drafts.", approve: "Add to Outlook drafts" },
    ],
  },
  {
    id: "PA-002",
    scopeLevel: "unit",
    propertyId: "nugent",
    unitId: "nugent-f2",
    title: "Rent review approaching",
    reason: "Flat 2, 5 Nugent Terrace — review date 30 May 2026. Currently £48,000 p.a.",
    due: "Review in 11 months",
    urgency: "watch",
    state: "not_started",
    performBeats: [
      { speaker: "hobson", text: "Rent review isn't due for another 11 months. I'll surface comparables 90 days out." },
      { speaker: "hobson", text: "Approve to schedule a reminder and a comparables sweep on 1 Mar 2026.", approve: "Schedule reminder" },
      { speaker: "hobson", text: "Scheduled. I'll prepare comparables and a proposal closer to the date." },
    ],
  },
  {
    id: "PA-005",
    scopeLevel: "portfolio",
    title: "3 rent reviews due in next 90 days",
    reason: "Across the portfolio: Flat 5 Stanley House, Flat 8 Stanley House, Flat 2 5 Nugent Terrace.",
    due: "Next 90 days",
    urgency: "week",
    state: "not_started",
    performBeats: [
      { speaker: "hobson", text: "I'll work through these in date order, starting with Flat 5 Stanley House (30 Aug 2026)." },
      { speaker: "hobson", text: "Approve to begin the batch and queue comparables for all three.", approve: "Begin batch" },
      { speaker: "hobson", text: "Batch underway. You'll get a card per review once comparables are in." },
    ],
  },
  {
    id: "PA-006",
    scopeLevel: "portfolio",
    title: "EPC missing for 2 units",
    reason: "Stanley House Flat 11 and 5 Nugent Terrace Flat 3 — no EPC on file.",
    due: "Watch",
    urgency: "watch",
    state: "not_started",
    performBeats: [
      { speaker: "hobson", text: "I'll request EPCs from your panel assessor for both units." },
      { speaker: "hobson", text: "Approve to send the instruction.", approve: "Send instruction" },
      { speaker: "hobson", text: "Instruction sent. I'll add the certificates to your library on receipt." },
    ],
  },
];

/* ── Scripted chat answers (parity with desktop demo) ─────────── */

const SCRIPTED_ANSWERS: { match: (q: string, scope: Scope) => boolean; reply: (scope: Scope) => string }[] = [
  {
    match: (q, s) =>
      s.level === "unit" &&
      s.unitId === "nugent-f2" &&
      /rent/i.test(q),
    reply: () =>
      "Flat 2, 5 Nugent Terrace is currently let to Thomas Yardley at **£48,000 p.a.** on a 24-month AST. The next review is **30 May 2026** (about 11 months away). The lease has no break clause and rent is paid monthly by standing order — last received on time.",
  },
  {
    match: (q, s) =>
      s.level === "unit" &&
      s.unitId === "nugent-f2" &&
      /(lease|tenancy|when.*end)/i.test(q),
    reply: () =>
      "The AST on Flat 2, 5 Nugent Terrace ends **30 May 2027**. There's no break clause. I'll surface a renewal-vs-new-tenant decision card 90 days before expiry.",
  },
  {
    match: (q, s) => s.level === "property" && /status|overview/i.test(q),
    reply: (s) => {
      if (s.level !== "property") return "";
      const name = SUMMARY_PROPERTIES.find((p) => p.id === s.propertyId)?.name;
      return `Here's where ${name} stands: occupancy and lease dates are in good order, with one item on your desk (fire-alarm certificate). I've flagged it as the urgent action.`;
    },
  },
  {
    match: (q) => /on my desk|what.*urgent|today/i.test(q),
    reply: () =>
      "Your urgent items are on the **Desk** tab. The most pressing is the fire-alarm certificate at 5 Nugent Terrace — overdue by 3 weeks. I've already contacted the tester.",
  },
];

/* ────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────── */

const URGENCY_META: Record<Urgency, { label: string; ring: string; bg: string; dot: string }> = {
  now:   { label: "Now",   ring: "ring-rose-200",    bg: "bg-rose-50",    dot: "bg-rose-500" },
  week:  { label: "Week",  ring: "ring-amber-200",   bg: "bg-amber-50",   dot: "bg-amber-500" },
  watch: { label: "Watch", ring: "ring-slate-200",   bg: "bg-slate-50",   dot: "bg-slate-400" },
};

const STATE_META: Record<ActionCard["state"], { label: string; tone: string }> = {
  not_started:      { label: "Not started",      tone: "text-slate-600 bg-slate-100" },
  in_progress:      { label: "In progress",      tone: "text-amber-800 bg-amber-100" },
  ready_to_approve: { label: "Ready to approve", tone: "text-emerald-800 bg-emerald-100" },
};

function scopeToSummaryScope(s: Scope): SummaryScope {
  if (s.level === "portfolio") return { level: "portfolio" };
  if (s.level === "property") return { level: "property", propertyId: s.propertyId };
  return { level: "unit", propertyId: s.propertyId, unitId: s.unitId };
}

function scopeLabel(s: Scope): string {
  if (s.level === "portfolio") return "Portfolio";
  const prop = SUMMARY_PROPERTIES.find((p) => p.id === s.propertyId)?.name ?? "Property";
  if (s.level === "property") return prop;
  return `${s.unitLabel} · ${prop}`;
}

function cardMatchesScope(c: ActionCard, s: Scope): boolean {
  if (s.level === "portfolio") return true;
  if (s.level === "property") return c.scopeLevel !== "portfolio" && c.propertyId === s.propertyId;
  // unit
  return (
    (c.scopeLevel === "unit" && c.propertyId === s.propertyId && c.unitId === s.unitId) ||
    (c.scopeLevel === "property" && c.propertyId === s.propertyId)
  );
}

function unitsForProperty(propertyId: string) {
  // Pull from summary occupational data by walking SUMMARY_PROPERTIES + occupationalForScope
  // simpler: derive from a static list per property using summaryData
  return UNITS_BY_PROPERTY[propertyId] ?? [];
}

const UNITS_BY_PROPERTY: Record<string, { id: string; label: string; status: "Let" | "Vacant"; tenant?: string }[]> = {
  stanley: [
    { id: "stanley-f1",  label: "Flat 1",  status: "Let",    tenant: "Adesina Okafor" },
    { id: "stanley-f2",  label: "Flat 2",  status: "Let",    tenant: "Priya Raman" },
    { id: "stanley-f3",  label: "Flat 3",  status: "Let",    tenant: "James Whitcombe" },
    { id: "stanley-f4",  label: "Flat 4",  status: "Let",    tenant: "Hannah Goldfarb" },
    { id: "stanley-f5",  label: "Flat 5",  status: "Let",    tenant: "Marcus Lindgren" },
    { id: "stanley-f6",  label: "Flat 6",  status: "Let",    tenant: "Sara Bellamy" },
    { id: "stanley-f7",  label: "Flat 7",  status: "Let",    tenant: "Oliver Penrose" },
    { id: "stanley-f8",  label: "Flat 8",  status: "Vacant" },
    { id: "stanley-f9",  label: "Flat 9",  status: "Let",    tenant: "Emeka Adeyemi" },
    { id: "stanley-f10", label: "Flat 10", status: "Let",    tenant: "Rosa Albright" },
    { id: "stanley-f11", label: "Flat 11", status: "Let",    tenant: "Daniel Brookfield" },
    { id: "stanley-shop",label: "Shop",    status: "Vacant" },
  ],
  nugent: [
    { id: "nugent-f1",   label: "Flat 1", status: "Let",    tenant: "Iris Mendoza" },
    { id: "nugent-f2",   label: "Flat 2", status: "Let",    tenant: "Thomas Yardley" },
    { id: "nugent-f3",   label: "Flat 3", status: "Vacant" },
    { id: "nugent-shop", label: "Shop",   status: "Let",    tenant: "M&S Simply Food" },
  ],
  hamilton: [
    { id: "hamilton-unit", label: "32 Hamilton Gardens", status: "Let", tenant: "Clara Stenhouse" },
  ],
};

function uid() { return Math.random().toString(36).slice(2, 9); }

function suggestionChips(scope: Scope): string[] {
  if (scope.level === "portfolio") {
    return ["What's on my desk?", "What rent reviews are coming up?", "Any compliance gaps?"];
  }
  if (scope.level === "property") {
    return ["Status of this building?", "Any compliance gaps here?", "Which units need attention?"];
  }
  // unit
  if (scope.unitId === "nugent-f2") {
    return ["What rent am I charging here?", "When does the lease end?", "What's the review history?"];
  }
  return ["What's the current rent here?", "When's the next review?", "Any compliance gaps?"];
}

/* ────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────── */

export default function PrototypeMobile() {
  const [tab, setTab] = useState<Tab>("desk");
  const [scope, setScope] = useState<Scope>({ level: "portfolio" });
  const [cards, setCards] = useState<ActionCard[]>(ACTION_CARDS);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      from: "hobson",
      text:
        "Good morning. I'm Hobson — your portfolio companion. Pick a scope at the top, tap a card on the **Desk** tab to perform an action, or ask me anything below.",
    },
  ]);
  const [performing, setPerforming] = useState<ActionCard | null>(null);
  const [workLog, setWorkLog] = useState<WorkLog[]>([
    {
      id: "wl-seed-1",
      when: "Yesterday, 17:42",
      title: "Logged smoke-alarm test for Stanley House",
      detail: "Filed the contractor's certificate against the building and updated the compliance schedule. Next test due Jun 2027.",
    },
    {
      id: "wl-seed-2",
      when: "Yesterday, 11:08",
      title: "Chased FireSafe Ltd for re-test",
      detail: "Sent a polite follow-up; their scheduler replied to expect a callback within 48 hours. Watching for a date.",
    },
  ]);

  // Cross-component: unit tiles dispatch a scope-jump event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Scope;
      setScope(detail);
      setTab("desk");
    };
    window.addEventListener("hobson-mobile-scope", handler);
    return () => window.removeEventListener("hobson-mobile-scope", handler);
  }, []);

  const reset = () => {
    setTab("desk");
    setScope({ level: "portfolio" });
    setCards(ACTION_CARDS);
    setMessages([
      {
        id: "welcome",
        from: "hobson",
        text: "Reset complete. I've cleared the slate so you can run through the demo again. Where would you like to start?",
      },
    ]);
    setPerforming(null);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-slate-900">
      <Helmet>
        <title>Hobson — Mobile companion</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <Header onReset={reset} />
      <ScopeBar scope={scope} setScope={setScope} />

      <main className="flex-1 overflow-y-auto pb-24">
        {tab === "desk" && (
          <DeskTab
            scope={scope}
            cards={cards}
            setMessages={setMessages}
            setTab={setTab}
            onPerform={(c) => setPerforming(c)}
            onReview={(c) => setPerforming(c)}
          />
        )}
        {tab === "chat" && (
          <ChatTab
            scope={scope}
            messages={messages}
            setMessages={setMessages}
          />
        )}
        {tab === "done" && <DoneTab log={workLog} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} />

      {performing && (
        <PerformSheet
          card={performing}
          onClose={() => setPerforming(null)}
          onComplete={(c) => {
            setCards((prev) => prev.filter((x) => x.id !== c.id));
            setWorkLog((prev) => [
              {
                id: uid(),
                when: "Just now",
                title: c.title,
                detail: "Walked through the steps with you, secured your approvals at each gate, and closed the item off. You can find the full trail in the activity log.",
              },
              ...prev,
            ]);
            setPerforming(null);
            setTab("done");
          }}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Header & scope bar
   ──────────────────────────────────────────────────────────────── */

function Header({ onReset }: { onReset: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">H</div>
        <div>
          <div className="text-sm font-semibold leading-tight">Hobson</div>
          <div className="text-[10px] uppercase tracking-wide text-slate-500 leading-tight">Mobile companion</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100"
        aria-label="Reset demo"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Reset
      </button>
    </header>
  );
}

function ScopeBar({ scope, setScope }: { scope: Scope; setScope: (s: Scope) => void }) {
  return (
    <div className="sticky top-[57px] z-20 bg-white border-b border-slate-200 px-4 py-2.5 space-y-2">
      <div className="flex items-center gap-1.5 text-xs">
        <ScopeChip
          active={scope.level === "portfolio"}
          icon={<Building2 className="w-3.5 h-3.5" />}
          label="Portfolio"
          onClick={() => setScope({ level: "portfolio" })}
        />
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <select
          value={scope.level !== "portfolio" ? scope.propertyId : ""}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) setScope({ level: "portfolio" });
            else setScope({ level: "property", propertyId: v });
          }}
          className="flex-1 min-w-0 text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white"
          aria-label="Select property"
        >
          <option value="">— Property —</option>
          {SUMMARY_PROPERTIES.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {scope.level !== "portfolio" && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <select
              value={scope.level === "unit" ? scope.unitId : ""}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) setScope({ level: "property", propertyId: scope.propertyId });
                else {
                  const u = unitsForProperty(scope.propertyId).find((x) => x.id === v);
                  setScope({ level: "unit", propertyId: scope.propertyId, unitId: v, unitLabel: u?.label ?? v });
                }
              }}
              className="flex-1 min-w-0 text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white"
              aria-label="Select unit"
            >
              <option value="">— Unit —</option>
              {unitsForProperty(scope.propertyId).map((u) => (
                <option key={u.id} value={u.id}>{u.label}{u.status === "Vacant" ? " (vacant)" : ""}</option>
              ))}
            </select>
          </>
        )}
      </div>
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <span className="font-medium text-slate-700">Scoped to:</span> {scopeLabel(scope)}
      </div>
    </div>
  );
}

function ScopeChip({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-2 py-1.5 rounded-md flex items-center gap-1 border " +
        (active ? "bg-violet-50 border-violet-200 text-violet-800" : "border-slate-200 text-slate-600")
      }
    >
      {icon} {label}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────
   Desk tab
   ──────────────────────────────────────────────────────────────── */

function DeskTab({
  scope, cards, setMessages, setTab, onPerform, onReview,
}: {
  scope: Scope;
  cards: ActionCard[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  setTab: (t: Tab) => void;
  onPerform: (c: ActionCard) => void;
  onReview: (c: ActionCard) => void;
}) {
  const scoped = cards.filter((c) => cardMatchesScope(c, scope));
  const units = scope.level === "property" ? unitsForProperty(scope.propertyId) : [];

  const handleSummary = (kind: "occupational" | "compliance") => {
    const sscope = scopeToSummaryScope(scope);
    const q = summaryQuestionFor(kind, sscope);
    const intro = summaryIntroFor(kind, sscope);
    setMessages((m) => [
      ...m,
      { id: uid(), from: "user", text: q },
      { id: uid(), from: "hobson", text: intro },
      { id: uid(), from: "hobson", summary: { kind, scope: sscope } },
    ]);
    setTab("chat");
  };

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Property → unit tiles (collapsible pinned section parity) */}
      {scope.level === "property" && units.length > 0 && (
        <section>
          <h2 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">
            Units in this building
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {units.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  // jump to unit scope via window event – simpler: call parent through setMessages hack? use custom event
                  const ev = new CustomEvent("hobson-mobile-scope", {
                    detail: { level: "unit", propertyId: (scope as any).propertyId, unitId: u.id, unitLabel: u.label },
                  });
                  window.dispatchEvent(ev);
                }}
                className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-violet-300"
              >
                <div className="text-xs font-semibold text-slate-900">{u.label}</div>
                <div className="text-[10px] text-slate-500 truncate">
                  {u.status === "Vacant" ? "Vacant" : u.tenant}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* On your desk */}
      <section>
        <h2 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2 flex items-center gap-1.5">
          <ClipboardList className="w-3.5 h-3.5" /> On your desk · {scoped.length}
        </h2>
        {scoped.length === 0 ? (
          <div className="text-xs text-slate-500 italic px-3 py-6 bg-white rounded-lg border border-dashed border-slate-200 text-center">
            Nothing on your desk for this scope. You're up to date.
          </div>
        ) : (
          <div className="space-y-2.5">
            {scoped.map((c) => (
              <ActionCardView
                key={c.id}
                card={c}
                onPerform={() => onPerform(c)}
                onReview={() => onReview(c)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick overviews */}
      <section>
        <h2 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">
          Quick overviews
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSummary("occupational")}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-violet-300 flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-violet-600" /> Occupational summary
          </button>
          <button
            type="button"
            onClick={() => handleSummary("compliance")}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-violet-300 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Compliance summary
          </button>
        </div>
      </section>
    </div>
  );
}




function ActionCardView({ card, onPerform, onReview }: { card: ActionCard; onPerform: () => void; onReview: () => void }) {
  const u = URGENCY_META[card.urgency];
  const s = STATE_META[card.state];
  return (
    <article className={`bg-white rounded-xl border border-slate-200 p-3 ring-1 ${u.ring}`}>
      <div className="flex items-start gap-2">
        <span className={`mt-1 w-2 h-2 rounded-full ${u.dot}`} aria-hidden />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${u.bg} text-slate-700 font-semibold`}>
              {u.label}
            </span>
            <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${s.tone} font-semibold`}>
              {s.label}
            </span>
            <span className="text-[10px] text-slate-500">{card.due}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 leading-snug">{card.title}</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{card.reason}</p>
          <div className="flex gap-2 mt-2.5">
            <button
              type="button"
              onClick={onPerform}
              className="flex-1 text-xs font-medium px-2.5 py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Perform
            </button>
            <button
              type="button"
              onClick={onReview}
              className="flex-1 text-xs font-medium px-2.5 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Review & approve
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────
   Chat tab
   ──────────────────────────────────────────────────────────────── */

function ChatTab({
  scope, messages, setMessages,
}: {
  scope: Scope;
  messages: ChatMsg[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setInput("");
    const userMsg: ChatMsg = { id: uid(), from: "user", text: q };
    setMessages((m) => [...m, userMsg]);

    // Find scripted reply
    setTimeout(() => {
      const found = SCRIPTED_ANSWERS.find((s) => s.match(q, scope));
      const reply = found
        ? found.reply(scope)
        : `Noted. I'll take that away and come back when I have something useful to add. (In the live product I'd reason against your portfolio data; this prototype runs scripted answers for ${scopeLabel(scope)}.)`;
      setMessages((m) => [...m, { id: uid(), from: "hobson", text: reply }]);
    }, 600);
  };

  const chips = suggestionChips(scope);

  return (
    <>
      <div ref={scrollRef} className="px-4 py-4 space-y-3">
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-slate-200 px-3 pt-2 pb-2 space-y-2">
        <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-none">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => send(c)}
              className="shrink-0 text-[11px] px-2.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-800 hover:bg-violet-100"
            >
              {c}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5"
        >
          <Lock className="w-3.5 h-3.5 text-slate-400" aria-hidden />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Use a suggestion above (chat locked for demo)"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 min-w-0"
            disabled
          />
          <button
            type="submit"
            disabled
            className="w-8 h-8 rounded-full bg-slate-300 text-white flex items-center justify-center disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </>
  );
}

function MessageBubble({ msg }: { msg: ChatMsg }) {
  if (msg.from === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-violet-600 text-white text-sm rounded-2xl rounded-br-md px-3.5 py-2.5">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0 mt-0.5">H</div>
      <div className="flex-1 min-w-0 space-y-1.5">
        {msg.text && (
          <div className="text-sm text-slate-800 leading-relaxed">
            <Markdownish text={msg.text} />
          </div>
        )}
        {msg.summary && (
          <div className="rounded-xl bg-white border border-slate-200 p-2 overflow-x-auto">
            <SummaryCard kind={msg.summary.kind} scope={msg.summary.scope} />
          </div>
        )}
      </div>
    </div>
  );
}

function Markdownish({ text }: { text: string }) {
  // Tiny renderer: **bold** only. Keeps deps small.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-slate-900">{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

/* ────────────────────────────────────────────────────────────────
   Done tab (What I've done)
   ──────────────────────────────────────────────────────────────── */

function DoneTab({ log }: { log: WorkLog[] }) {
  return (
    <div className="px-4 py-4 space-y-3">
      <h2 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold flex items-center gap-1.5">
        <ListChecks className="w-3.5 h-3.5" /> What I've done
      </h2>
      {log.length === 0 ? (
        <div className="text-xs text-slate-500 italic px-3 py-6 bg-white rounded-lg border border-dashed border-slate-200 text-center">
          Nothing logged yet. Perform an action on the Desk tab and I'll record it here.
        </div>
      ) : (
        log.map((entry) => (
          <article key={entry.id} className="bg-white rounded-xl border border-slate-200 p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">{entry.when}</div>
            <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{entry.title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{entry.detail}</p>
          </article>
        ))
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Perform sheet (full-screen, beat-by-beat)
   ──────────────────────────────────────────────────────────────── */

function PerformSheet({ card, onClose, onComplete }: { card: ActionCard; onClose: () => void; onComplete: (c: ActionCard) => void }) {
  const [step, setStep] = useState(0);
  const beats = card.performBeats;
  const visible = beats.slice(0, step + 1);
  const current = beats[step];
  const atEnd = step >= beats.length - 1;

  const advance = () => {
    if (atEnd) onComplete(card);
    else setStep((s) => s + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex flex-col">
      <div className="mt-auto bg-white rounded-t-2xl flex flex-col max-h-[92dvh]">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wide text-violet-700 font-semibold">Performing · step {step + 1} of {beats.length}</div>
            <div className="text-sm font-semibold text-slate-900 truncate">{card.title}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100" aria-label="Close">
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {visible.map((b, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">H</div>
              <div className="flex-1">
                <div className="text-sm text-slate-800 leading-relaxed">{b.text}</div>
                {b.note && <div className="text-[11px] text-slate-500 italic mt-1">{b.note}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 px-4 py-3 bg-white">
          {current?.approve ? (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 text-center">Decision is yours — preparation is mine.</p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 text-sm py-2.5 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Not yet
                </button>
                <button
                  onClick={advance}
                  className="flex-1 text-sm py-2.5 rounded-md bg-violet-600 text-white font-medium hover:bg-violet-700 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> {current.approve}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={advance}
              className="w-full text-sm py-2.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              {atEnd ? "Mark as done" : "Continue"} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Bottom navigation
   ──────────────────────────────────────────────────────────────── */

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {


  const items: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "desk", label: "Desk", icon: <ClipboardList className="w-4 h-4" /> },
    { id: "chat", label: "Chat", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "done", label: "Done", icon: <ListChecks className="w-4 h-4" /> },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-3">
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => setTab(it.id)}
              className={
                "flex flex-col items-center gap-0.5 py-2.5 text-[11px] " +
                (active ? "text-violet-700 font-semibold" : "text-slate-500")
              }
            >
              <span className={active ? "text-violet-700" : "text-slate-500"}>{it.icon}</span>
              {it.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
