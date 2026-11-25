import { useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import PrototypeStatus, { type StatusExtensionContext } from "./PrototypeStatus";
import { AgentsWorkspace, type AgentsView, type WorkspaceActions } from "@/components/prototype/AgentsWorkspace";
import { agentOverview, agentsReducer, canManage, draftResponsibility, initialAgentsState, type AgentKind } from "./prototypeAgents";

const EXAMPLES = [
  { label: "Commission a weekly break report", text: "Every Monday, review all my break notice deadlines within the next six months and email me a summary." },
  { label: "Change the compliance lead time", text: "Contact contractors 60 days before expiry instead of 30." },
  { label: "Look after gas safety at Russell Square House", text: "Look after gas safety compliance across Russell Square House." },
];

export default function PrototypeAgents() {
  const [state, dispatch] = useReducer(agentsReducer, undefined, () => initialAgentsState());
  const [view, setView] = useState<AgentsView>({ kind: "list" });
  const [clarifying, setClarifying] = useState<AgentKind | null>(null);
  const [approvedJobs, setApprovedJobs] = useState<string[]>([]);
  const selected = view.kind === "detail" ? state.agents.find((a) => a.id === view.id) : null;

  function onMessage(text: string, context: StatusExtensionContext): boolean {
    const lower = text.toLowerCase();
    if (/gas safety/.test(lower) && /russell square/.test(lower)) {
      setClarifying(null);
      dispatch({ type: "propose", proposal: { kind: "access", requested: false } });
      context.reply("There is already a shared agent looking after gas safety compliance at Russell Square House. Would you like access to that responsibility?");
      return true;
    }
    if (/^(cancel|not now|keep existing arrangement|discard)$/i.test(text)) {
      dispatch({ type: "discard" }); setClarifying(null);
      context.reply("Of course. The existing responsibilities remain unchanged.");
      return true;
    }
    if (clarifying && /^(yes|confirm|both|include both|yes, include both|entire portfolio|just for me|personal)/i.test(text)) {
      const draft = draftResponsibility(clarifying);
      dispatch({ type: "propose", proposal: { kind: "create", draft } }); setClarifying(null);
      context.reply("I’ve prepared the following ongoing responsibility for you. Please review it before confirming.");
      return true;
    }
    if (clarifying && /^(tenant only|landlord only|share with my team)/i.test(text)) {
      const draft = draftResponsibility(clarifying);
      if (/tenant only/i.test(text)) draft.rights = "Tenant";
      if (/landlord only/i.test(text)) draft.rights = "Landlord";
      if (/share with my team/i.test(text)) draft.shared = true;
      dispatch({ type: "propose", proposal: { kind: "create", draft } }); setClarifying(null);
      context.reply("I’ve prepared the responsibility with that instruction. Nothing begins until you confirm it.");
      return true;
    }
    if (state.proposal?.kind === "create") {
      const draft = { ...state.proposal.draft };
      let changed = false;
      if (/share.*team|team.*share/i.test(text)) { draft.shared = true; changed = true; }
      if (/personal|just for me|private/i.test(text)) { draft.shared = false; changed = true; }
      if (/tenant only|only tenant/i.test(text)) { draft.rights = "Tenant"; changed = true; }
      if (/landlord only|only landlord/i.test(text)) { draft.rights = "Landlord"; changed = true; }
      if (/include both|landlord and tenant/i.test(text)) { draft.rights = "Landlord and tenant"; changed = true; }
      const months = text.match(/(?:next\s+)?(\d+)\s+months?/i);
      if (months && Number(months[1]) > 0 && Number(months[1]) <= 24) { draft.periodMonths = Number(months[1]); changed = true; }
      const time = text.match(/(?:at|to)\s+(\d{1,2}):(\d{2})/i);
      if (time && Number(time[1]) < 24 && Number(time[2]) < 60) {
        const clock = `${time[1].padStart(2, "0")}:${time[2]}`;
        draft.frequency = draft.frequency.replace(/\d{2}:\d{2}/, clock); draft.next = draft.next.replace(/\d{2}:\d{2}/, clock); changed = true;
      }
      if (changed) {
        dispatch({ type: "propose", proposal: { kind: "create", draft } });
        context.reply("I’ve revised the proposed responsibility. Please check the arrangement and confirm when you are ready."); return true;
      }
      if (/^(yes|confirm|go ahead)$/i.test(text)) {
        context.reply("Please use Confirm responsibility on the prepared arrangement, so the scope and monthly subscription are clear."); return true;
      }
    }
    const lead = text.match(/contact\s+(?:preferred\s+)?contractors?\s+(\d+)\s+days?/i);
    if (lead) {
      const agent = selected ?? state.agents.find((a) => a.id === "compliance");
      if (!agent) { context.reply("Please select the responsibility you would like to change."); return true; }
      if (!canManage(agent)) { context.reply(`You can give guidance on ${agent.name}, but its owner must confirm material changes. I haven’t changed the arrangement.`); return true; }
      if (agent.kind !== "compliance") { context.reply("That instruction relates to compliance management. Please select Compliance Management before changing its contractor arrangements."); return true; }
      const leadDays = Number(lead[1]);
      if (leadDays < 1 || leadDays > 365) { context.reply("Please give a lead time between 1 and 365 days for this example."); return true; }
      setView({ kind: "detail", id: agent.id }); setClarifying(null);
      dispatch({ type: "propose", proposal: { kind: "change", agentId: agent.id, leadDays } });
      context.reply("I’ve prepared that change. Everything else will remain as it is."); return true;
    }
    if (selected && /pause|resume|stop|change.*scope|add.*units?|remove.*units?/i.test(text)) {
      if (!canManage(selected)) { context.reply(`This is shared with you on a view-and-instruct basis. ${selected.owner} must authorise changes to its scope or scheduled work. I haven’t changed it.`); return true; }
      if (/pause|resume/i.test(text)) {
        const kind = /resume/i.test(text) ? "resume" : "pause";
        dispatch({ type: "propose", proposal: { kind, agentId: selected.id } });
        context.reply(kind === "pause" ? "Pausing this responsibility will stop new scheduled reviews. Existing outstanding work will remain visible." : `I can restore the scheduled reviews. The next review is ${selected.next}. Please confirm the arrangement.`);
      } else context.reply("A change to scope needs a precise new instruction and your approval. In this demonstration, I can prepare the compliance lead-time change; the existing scope stays unchanged.");
      return true;
    }
    const discussed = state.agents.find((a) => lower.includes(a.name.toLowerCase()));
    if (discussed && /tell me|explain|about|show/i.test(text)) {
      setView({ kind: "detail", id: discussed.id }); context.reply(agentOverview(discussed)); return true;
    }
    if (/what.*up to|show.*jobs|outstanding work/i.test(text)) { setView({ kind: "work", ...(selected ? { agentId: selected.id } : {}) }); context.reply("Here is the individual work arising from the responsibilities you have entrusted to me."); return true; }
    if (/break.*(dates|deadlines|notice|rights)|weekly break report/i.test(text)) {
      const existing = state.agents.find((a) => a.name === "Weekly Break Report");
      if (existing) { setView({ kind: "detail", id: existing.id }); context.reply("Your Weekly Break Report is already in place. I shall keep one responsibility rather than create a duplicate."); return true; }
      dispatch({ type: "discard" }); setClarifying("break");
      context.reply("Shall I include both landlord and tenant break rights across your entire portfolio?", ["Yes, include both", "Tenant only", "Landlord only"]); return true;
    }
    if (/monthly.*(portfolio|report)|portfolio.*report/i.test(text)) {
      dispatch({ type: "discard" }); setClarifying("report"); context.reply("Shall I prepare the report for your entire portfolio, just for you?", ["Just for me", "Share with my team"]); return true;
    }
    if (/look after.*compliance|compliance responsibilities|monitor.*compliance/i.test(text)) {
      dispatch({ type: "discard" }); setClarifying("compliance"); context.reply("Shall I review compliance across all your authorised residential Units each month, just for you?", ["Just for me", "Share with my team"]); return true;
    }
    if (/agents|responsibilit|contractors|instructions|share.*team/i.test(text) || view.kind === "detail" || clarifying || state.proposal) {
      context.reply("I can prepare a weekly break report, a monthly portfolio report or a compliance review. For Compliance Management, you can also ask me to contact contractors 60 days before expiry instead of 30."); return true;
    }
    return false;
  }

  function actions(context: StatusExtensionContext): WorkspaceActions {
    return {
      openAgent: (id) => { setView({ kind: "detail", id }); context.open(); },
      openList: () => setView({ kind: "list" }),
      openWork: (agentId) => { setView({ kind: "work", ...(agentId ? { agentId } : {}) }); context.open(); },
      fillInput: context.fillInput,
      empty: () => { dispatch({ type: "reset", empty: true }); setView({ kind: "list" }); setClarifying(null); setApprovedJobs([]); },
      pause: (a) => {
        const kind = a.status === "Active" ? "pause" : "resume";
        dispatch({ type: "propose", proposal: { kind, agentId: a.id } });
        context.reply(kind === "pause" ? "Pausing this responsibility will stop new scheduled reviews. Existing outstanding work will remain visible." : `I shall restore scheduled reviews once you confirm. Next review: ${a.next}.`);
      },
      confirm: () => {
        const p = state.proposal;
        if (!p) return;
        const next = agentsReducer(state, { type: "confirm" });
        dispatch({ type: "confirm" });
        if (p.kind === "create") {
          const created = next.agents.find((a) => a.name === p.draft.name);
          if (created) setView({ kind: "detail", id: created.id });
          context.reply(p.draft.kind === "break" ? "I’ll review your upcoming break notice deadlines every Monday and email you a summary. You can find this responsibility under Agents." : "The responsibility is now recorded under Agents. I shall look after it within the arrangement you have confirmed.");
        } else if (p.kind === "change") context.reply(`Confirmed. I shall contact contractors ${p.leadDays} days before expiry. The other instructions and monthly subscription remain unchanged.`);
        else if (p.kind === "access") context.reply("I’ve recorded your request for access in this demonstration. The responsibility remains private until its owner grants access; nothing has been sent.");
        else context.reply(p.kind === "pause" ? "The scheduled reviews are paused. Existing work remains visible and the monthly subscription continues." : "The scheduled reviews are restored. Outstanding work and the subscription are unchanged.");
      },
      discard: () => { dispatch({ type: "discard" }); setClarifying(null); context.reply("Of course. I have kept the existing arrangement."); },
      amend: () => { context.reply("What would you like to change? You can keep this personal or share it with your team, choose landlord or tenant break rights, change the number of months, or set a different time.", ["Share with my team", "Tenant only", "Next 12 months", "Every Monday at 10:00"]); },
      approveJob: (id) => { setApprovedJobs((previous) => previous.includes(id) ? previous : [...previous, id]); context.reply("Your £180 electrical inspection quotation approval is recorded for this demonstration. No contractor instruction has been issued, and this approval does not extend to remedial works."); },
    };
  }

  return <><Helmet><title>Agents prototype | Hobson</title><meta name="description" content="A private illustrative experience of delegating property responsibilities to Hobson." /><meta name="robots" content="noindex, nofollow" /></Helmet><PrototypeStatus extension={{
    render: (context) => <AgentsWorkspace state={state} view={view} actions={actions(context)} approvedJobs={approvedJobs} />,
    onMessage, suggestions: EXAMPLES,
    onRestart: () => { dispatch({ type: "reset" }); setView({ kind: "list" }); setClarifying(null); setApprovedJobs([]); },
    onWork: () => setView({ kind: "work" }),
  }} /></>;
}