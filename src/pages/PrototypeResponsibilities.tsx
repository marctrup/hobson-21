import { useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import PrototypeStatus, { type StatusExtensionContext } from "./PrototypeStatus";
import { ResponsibilitiesWorkspace, type Actions, type View } from "@/components/prototype/ResponsibilitiesWorkspace";
import { SKILLS_ANSWER, canManage, draftBreak, initialState, reducer, type Responsibility } from "./prototypeResponsibilities";

const EXAMPLES = [
  { label: "Delegate weekly break monitoring", text: "Every Monday, review my upcoming break notice deadlines within the next six months and email me a summary." },
  { label: "Personalise compliance", text: "Contact contractors 60 days before expiry instead of 30, and follow up after three days instead of seven." },
  { label: "Extend compliance with quotations", text: "When arranging inspections, also obtain three quotations and compare them before asking for my approval." },
  { label: "Use our procurement procedure", text: "We have our own contractor procurement procedure. Can you follow it when arranging maintenance?" },
  { label: "Gas safety at Russell Square House", text: "Look after gas safety compliance at Russell Square House." },
];
const NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, fourteen: 14 };
const n = (s: string) => NUM[s.toLowerCase()] ?? Number(s);

export default function PrototypeResponsibilities() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState());
  const [view, setView] = useState<View>({ kind: "list" });
  const [step, setStep] = useState<null | "break-rights" | "break-sharing" | "procedure">(null);
  const [draft, setDraft] = useState<Responsibility | null>(null);
  const selected = view.kind === "detail" ? state.items.find((r) => r.id === view.id) : undefined;
  const find = (id: string) => state.items.find((r) => r.id === id)!;

  function onMessage(text: string, c: StatusExtensionContext): boolean {
    const t = text.toLowerCase().trim();
    if (/gas safety/.test(t) && /russell square/.test(t)) {
      c.reply("I’m already looking after gas safety compliance at Russell Square House as part of a shared responsibility. Would you like me to request access for you?", ["Request access", "Not now"]); return true;
    }
    if (t === "request access") { c.reply("I’ve asked the responsibility’s owner to grant you access. Nothing changes until they agree, and I won’t share its details meanwhile."); return true; }
    if (/^(not now|cancel|keep existing arrangements?)$/.test(t)) { dispatch({ type: "discard" }); setStep(null); c.reply("Of course. Everything remains as it is."); return true; }
    if (/what skills|which skills/.test(t)) { c.reply(SKILLS_ANSWER); return true; }

    if (step === "break-rights") {
      if (!/^(yes|both|include both)/.test(t) && !/tenant only|landlord only/.test(t)) return false;
      const d = draftBreak(); if (/tenant only/.test(t)) d.instructions.rights = "Tenant"; if (/landlord only/.test(t)) d.instructions.rights = "Landlord";
      setDraft(d); setStep("break-sharing");
      c.reply("Would you like me to look after this just for you, or share the responsibility with your team?", ["Just for me", "Share with my team"]); return true;
    }
    if (step === "break-sharing" && draft) {
      const d = { ...draft, shared: /share|team/.test(t) }; setStep(null); setDraft(null);
      dispatch({ type: "propose", proposal: { kind: "create", draft: d } }); setView({ kind: "list", tab: d.shared ? "shared" : "mine" });
      c.reply("I can look after that for you. Here’s what I propose."); return true;
    }
    if (step === "procedure") {
      setStep(null); dispatch({ type: "procedure", id: "maintenance" }); setView({ kind: "detail", id: "maintenance" });
      c.reply("Thank you — I’ve received your procurement procedure (illustrative). It needs review before I adopt it: two steps ask for capabilities I don’t yet have, such as raising purchase orders. Status: Awaiting review. I’ll keep following the current arrangements until it is approved."); return true;
    }
    if (/break notice|break dates|break deadlines/.test(t)) {
      if (state.items.some((r) => r.id === "weekly-break")) { setView({ kind: "detail", id: "weekly-break" }); c.reply("I’m already looking after that, so I won’t take on a duplicate."); return true; }
      setStep("break-rights"); c.reply("Shall I include both landlord and tenant break rights across your commercial portfolio?", ["Yes", "Tenant only", "Landlord only"]); return true;
    }
    const lead = t.match(/contact contractors (\d+|\w+) days/); const follow = t.match(/follow up after (\d+|\w+) days/);
    if (lead || follow) {
      const r = selected?.kind === "compliance" ? selected : find("compliance");
      const leadDays = lead ? n(lead[1]) : r.instructions.leadDays; const followUpDays = follow ? n(follow[1]) : r.instructions.followUpDays;
      if (!(leadDays > 0 && leadDays <= 365 && followUpDays > 0 && followUpDays <= 60)) { c.reply("Please give a lead time up to 365 days and a follow-up up to 60 days."); return true; }
      setView({ kind: "detail", id: r.id }); dispatch({ type: "propose", proposal: { kind: "change", id: r.id, leadDays, followUpDays } });
      c.reply("I’ve prepared those changes. Everything else will remain as it is."); return true;
    }
    if (/quotation/.test(t)) {
      const r = find("compliance");
      if (r.instructions.quotations) { c.reply("I already obtain and compare quotations as part of Compliance Management."); return true; }
      setView({ kind: "detail", id: r.id }); dispatch({ type: "propose", proposal: { kind: "extend", id: r.id } });
      c.reply("I can extend this responsibility to include obtaining and comparing contractor quotations."); return true;
    }
    if (/procurement procedure|our own procedure/.test(t)) {
      setStep("procedure"); setView({ kind: "detail", id: "maintenance" });
      c.reply("Yes. Share your procedure with me and I’ll review how I can incorporate it into your maintenance responsibilities.", ["Share our procurement procedure"]); return true;
    }
    if (selected && /\b(pause|resume|stop)\b/.test(t)) {
      if (!canManage(selected)) { c.reply(`${selected.owner} manages this responsibility, so they would need to confirm that. I haven’t changed anything.`); return true; }
      const kind = /resume/.test(t) ? "resume" : /stop/.test(t) ? "stop" : "pause";
      dispatch({ type: "propose", proposal: { kind, id: selected.id } }); c.reply("I’ve set out what that would mean. Nothing changes until you confirm."); return true;
    }
    if (/what else|look after .*(insurance|other)/.test(t)) { setView({ kind: "available" }); c.reply("I can also keep track of your rent reviews, monitor insurance renewals, coordinate tenancy departures and prepare regular portfolio reports."); return true; }
    const m = t.match(/look after (.+)\.?$/);
    if (m && /i’d like you|i'd like you/.test(t)) { c.reply(`Gladly. Tell me which places it should cover, how often I should review, and what I may do without asking you — then I’ll propose an arrangement for ${m[1].replace(/\.$/, "")}.`); return true; }
    if (/what.*up to|jobs|outstanding work/.test(t)) { setView({ kind: "work" }); c.reply("Here is how the work is getting on."); return true; }
    if (/responsibilit|agent/.test(t)) { setView({ kind: "list" }); c.reply("Here is the work you’ve entrusted to me. Tell me what else you’d like me to look after, or how you’d like me to change an existing responsibility."); return true; }
    return false;
  }

  function actions(c: StatusExtensionContext): Actions {
    return {
      open: (id) => { setView({ kind: "detail", id }); c.open(); }, list: (tab) => setView({ kind: "list", tab }),
      work: (id) => { setView({ kind: "work", id }); c.open(); }, available: () => { setView({ kind: "available" }); c.reply("I can also keep track of your rent reviews, monitor insurance renewals, coordinate tenancy departures and prepare regular portfolio reports."); },
      ask: (text) => { onMessage(text, c); }, fill: c.fillInput,
      pause: (r) => { dispatch({ type: "propose", proposal: { kind: r.status === "Active" ? "pause" : "resume", id: r.id } }); },
      stop: (r) => { dispatch({ type: "propose", proposal: { kind: "stop", id: r.id } }); },
      confirm: () => {
        const p = state.proposal; dispatch({ type: "confirm" });
        if (p?.kind === "create") { setView({ kind: "detail", id: p.draft.id }); c.reply("I’ll keep track of your upcoming break notice deadlines and email you a summary every Monday."); }
        else if (p?.kind === "change") c.reply("Done. I’ve updated your instructions and how I look after this; my underlying expertise is unchanged.");
        else if (p?.kind === "extend") c.reply("Done. Compliance Management now includes obtaining and comparing three quotations before I ask for your approval.");
        else if (p) c.reply(p.kind === "pause" ? "Paused. Outstanding work remains visible." : p.kind === "resume" ? "Resumed." : "Stopped. I’ve recorded it in Activity.");
      },
      discard: () => { dispatch({ type: "discard" }); c.reply("Of course. Everything remains as it is."); },
      amend: () => c.reply("What would you like to change? For example, share it with your team, look 12 months ahead, or choose tenant break rights only."),
      approve: (id) => { dispatch({ type: "approve", jobId: id }); c.reply("Your £180 approval is recorded for this demonstration. No contractor has been instructed, and it does not extend to remedial works."); },
    };
  }

  return <><Helmet><title>Responsibilities prototype | Hobson</title><meta name="description" content="A private illustrative experience of entrusting property responsibilities to Hobson." /><meta name="robots" content="noindex, nofollow" /></Helmet>
    <PrototypeStatus extension={{
      render: (c) => <ResponsibilitiesWorkspace state={state} view={view} actions={actions(c)} />,
      onMessage, suggestions: EXAMPLES,
      onRestart: () => { dispatch({ type: "reset" }); setView({ kind: "list" }); setStep(null); setDraft(null); },
      onWork: () => setView({ kind: "work" }),
    }} /></>;
}
