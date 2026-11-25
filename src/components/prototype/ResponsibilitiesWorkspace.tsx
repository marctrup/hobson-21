import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BarChart3, CalendarClock, Check, ChevronDown, ChevronLeft, KeyRound, Lock, MoreHorizontal, ShieldCheck, TrendingUp, Wrench } from "lucide-react";
import { AVAILABLE, JOBS, canManage, instructionsFor, money, workflowFor, type Kind, type Responsibility, type State } from "@/pages/prototypeResponsibilities";

export type View = { kind: "list"; tab?: "mine" | "shared" } | { kind: "detail"; id: string } | { kind: "available" } | { kind: "work"; id?: string };
export type Actions = {
  open: (id: string) => void; list: (tab?: "mine" | "shared") => void; work: (id?: string) => void; available: () => void;
  ask: (text: string) => void; fill: (text: string) => void; pause: (r: Responsibility) => void; stop: (r: Responsibility) => void;
  confirm: () => void; discard: () => void; amend: () => void; approve: (jobId: string) => void;
};

const ICON: Record<Kind, typeof ShieldCheck> = { compliance: ShieldCheck, break: CalendarClock, rent: TrendingUp, report: BarChart3, renewal: KeyRound, maintenance: Wrench };
const tabClass = (on: boolean) => `border-b-2 px-1 pb-2 text-sm transition-colors ${on ? "border-primary text-ink" : "border-transparent text-ink-muted hover:text-ink"}`;

export function ResponsibilitiesWorkspace({ state, view, actions }: { state: State; view: View; actions: Actions }) {
  const selected = view.kind === "detail" ? state.items.find((r) => r.id === view.id) : undefined;
  return (
    <div aria-label="Responsibilities" className="absolute inset-0 overflow-y-auto bg-background">
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-16">
        <ProposalPanel state={state} actions={actions} />
        {view.kind === "list" && <Landing state={state} tab={view.tab ?? "mine"} actions={actions} />}
        {view.kind === "available" && <Available actions={actions} />}
        {view.kind === "work" && <Work state={state} focus={view.id} actions={actions} />}
        {selected && <Detail r={selected} actions={actions} />}
      </div>
    </div>
  );
}

function Landing({ state, tab, actions }: { state: State; tab: "mine" | "shared"; actions: Actions }) {
  const rows = state.items.filter((r) => (tab === "shared") === r.shared && r.status !== "Stopped");
  if (!state.items.length) return (
    <section className="py-10">
      <h1 className="font-heading text-2xl text-ink">What would you like me to look after?</h1>
      <p className="mt-2 text-ink-muted">You can ask me to monitor important dates, coordinate inspections, prepare reports or look after ongoing property responsibilities.</p>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {["Keep track of my upcoming break dates.", "Look after my compliance responsibilities.", "Send me a monthly portfolio report."].map((t) =>
          <li key={t}><button type="button" onClick={() => actions.fill(t)} className="w-full py-3 text-left text-sm text-primary hover:underline">{t}</button></li>)}
      </ul>
    </section>
  );
  return (
    <section>
      <h1 className="font-heading text-2xl text-ink">Responsibilities</h1>
      <p className="mt-1 text-ink-muted">The work you’ve entrusted to me.</p>
      <div role="tablist" aria-label="Responsibility collections" className="mt-6 flex gap-6 border-b border-border">
        <button role="tab" aria-selected={tab === "mine"} className={tabClass(tab === "mine")} onClick={() => actions.list("mine")}>My responsibilities</button>
        <button role="tab" aria-selected={tab === "shared"} className={tabClass(tab === "shared")} onClick={() => actions.list("shared")}>Shared with me</button>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((r) => { const Icon = ICON[r.kind]; return (
          <li key={r.id}>
            <button type="button" onClick={() => actions.open(r.id)} className="group flex w-full gap-4 py-5 text-left">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted group-hover:text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3"><span className="font-medium text-ink group-hover:text-primary">{r.name}</span><StatusText status={r.status} /></span>
                <span className="mt-1 block text-sm text-ink-muted">“{r.summary}”</span>
                <span className="mt-2 block text-xs text-ink-muted">{r.scope.label} · {r.instructions.frequency}{r.next && r.status === "Active" ? ` · Next review: ${r.next}` : ""}{r.shared ? ` · Entrusted by ${r.creator}` : ""}</span>
              </span>
            </button>
          </li>); })}
      </ul>
      <button type="button" onClick={actions.available} className="mt-8 text-sm text-primary hover:underline">What else can you look after?</button>
    </section>
  );
}

const StatusText = ({ status }: { status: string }) => <span className={`shrink-0 text-xs ${status === "Active" ? "text-primary" : "text-ink-muted"}`}>{status}</span>;

function Available({ actions }: { actions: Actions }) {
  return (
    <section>
      <Back onClick={() => actions.list()} />
      <h1 className="font-heading text-2xl text-ink">What else I can look after</h1>
      <p className="mt-1 text-sm text-ink-muted">Examples of work I can take on. Choose one and we’ll talk through what you need. Costs are illustrative.</p>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {AVAILABLE.map((a) => <li key={a.name}><button type="button" onClick={() => actions.ask(`I’d like you to look after ${a.name.toLowerCase()}.`)} className="flex w-full justify-between py-3 text-left text-sm hover:text-primary"><span>{a.name}</span><span className="text-ink-muted">{a.from.startsWith("From") ? a.from : `${a.from} a month`}</span></button></li>)}
      </ul>
    </section>
  );
}

const Back = ({ onClick, label = "Responsibilities" }: { onClick: () => void; label?: string }) =>
  <button type="button" onClick={onClick} className="mb-4 flex items-center gap-1 text-sm text-ink-muted hover:text-primary"><ChevronLeft className="h-4 w-4" aria-hidden />{label}</button>;

function Detail({ r, actions }: { r: Responsibility; actions: Actions }) {
  const [section, setSection] = useState<"overview" | "how" | "activity">("overview");
  const manage = canManage(r);
  return (
    <section>
      <Back onClick={() => actions.list(r.shared ? "shared" : "mine")} />
      <header className="flex items-start justify-between gap-3">
        <div><h1 className="font-heading text-2xl text-ink">{r.name}</h1><StatusText status={r.status} /></div>
        <div className="flex items-center gap-1">
          {manage && r.status !== "Stopped" && <Button variant="ghost" size="sm" onClick={() => actions.pause(r)}>{r.status === "Active" ? "Pause" : "Resume"}</Button>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="More options"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => actions.work(r.id)}>See related work</DropdownMenuItem>
              {manage && r.status !== "Stopped" && <DropdownMenuItem onSelect={() => actions.stop(r)}>Stop this responsibility</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div role="tablist" aria-label="Responsibility sections" className="mt-6 flex gap-6 border-b border-border">
        {([["overview", "Overview"], ["how", "How I look after this"], ["activity", "Activity"]] as const).map(([k, l]) =>
          <button key={k} role="tab" aria-selected={section === k} className={tabClass(section === k)} onClick={() => setSection(k)}>{l}</button>)}
      </div>
      {section === "overview" && <Overview r={r} />}
      {section === "how" && <Workflow r={r} />}
      {section === "activity" && <ActivityList r={r} />}
    </section>
  );
}

function Overview({ r }: { r: Responsibility }) {
  const [scopeOpen, setScopeOpen] = useState(false);
  const facts: [string, string][] = [
    ["Entrusted by", r.creator], ["Established on", r.establishedOn], ["Responsibility owner", r.owner], ["Looking after", r.scope.label],
    ["Review frequency", r.instructions.frequency], ...(r.next && r.status === "Active" ? [["Next review", r.next] as [string, string]] : []),
    ["Visibility", r.shared ? `Shared · you can ${r.access === "Full management" ? "manage" : "view and instruct"}` : "Personal"], ["Monthly subscription", money(r.monthly)],
  ];
  return (
    <div className="space-y-8 pt-6">
      <div><h2 className="font-medium text-ink">What I’m looking after</h2><p className="mt-2 text-sm text-ink-muted">“{r.description}”</p></div>
      <dl className="divide-y divide-border border-y border-border text-sm">
        {facts.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-ink-muted">{k}</dt><dd className="text-right text-ink">
          {k === "Looking after" && r.scope.groups.length ? <button type="button" aria-expanded={scopeOpen} onClick={() => setScopeOpen((o) => !o)} className="inline-flex items-center gap-1 hover:text-primary">{v}<ChevronDown className={`h-3.5 w-3.5 transition-transform ${scopeOpen ? "rotate-180" : ""}`} aria-hidden /></button> : v}
          {k === "Looking after" && scopeOpen && <ul className="mt-1 text-xs text-ink-muted">{r.scope.groups.map((g) => <li key={g.name}>{g.name} · {g.units} Units</li>)}</ul>}
        </dd></div>)}
      </dl>
      {r.procedure && <p className="text-sm text-ink-muted">Your contractor procurement procedure · <span className="text-ink">Awaiting review</span></p>}
      <div><h2 className="font-medium text-ink">Your instructions</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">{instructionsFor(r).map((i) => <li key={i}>{i}</li>)}</ul>
        <p className="mt-2 text-xs text-ink-muted">You can change how I look after this at any time by telling me in Chat.</p></div>
      <div><h2 className="font-medium text-ink">My authority</h2>
        <ul className="mt-2 space-y-1.5 text-sm">
          {r.allowed.map((a) => <li key={a} className="flex gap-2 text-ink"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{a}</li>)}
          {r.needsApproval.map((a) => <li key={a} className="flex gap-2 text-ink-muted"><Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{a} — needs your approval</li>)}
        </ul></div>
    </div>
  );
}

function Workflow({ r }: { r: Responsibility }) {
  return (
    <ol aria-label="How I look after this" className="relative pt-6">
      {workflowFor(r).map((s, i, all) => (
        <li key={s.label} className="relative pb-5 pl-7">
          {i < all.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-border" aria-hidden />}
          <span className={`absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 bg-background ${i === 0 ? "border-primary" : "border-border"}`} aria-hidden />
          <p className="text-sm text-ink">{s.label}</p>
          {s.branch && <div className="mt-2 rounded-md border border-border px-3 py-2 text-xs text-ink-muted"><p className="text-ink">{s.branch.question}</p><p className="mt-1">Yes — {s.branch.yes}</p><p>No — {s.branch.no}</p></div>}
        </li>
      ))}
    </ol>
  );
}

function ActivityList({ r }: { r: Responsibility }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="divide-y divide-border pt-2">
      {r.activity.map((a) => (
        <li key={a.id} className="py-3 text-sm">
          <button type="button" disabled={!a.detail} aria-expanded={a.detail ? open === a.id : undefined} onClick={() => setOpen(open === a.id ? null : a.id)} className="w-full text-left disabled:cursor-default">
            <span className="block text-xs text-ink-muted">{a.when}</span>
            <span className="flex items-center justify-between gap-2 text-ink">{a.text}{a.detail && <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-ink-muted ${open === a.id ? "rotate-180" : ""}`} aria-hidden />}</span>
          </button>
          {open === a.id && <p className="mt-1 text-xs text-ink-muted">{a.detail}</p>}
        </li>
      ))}
    </ul>
  );
}

function Work({ state, focus, actions }: { state: State; focus?: string; actions: Actions }) {
  const jobs = JOBS.filter((j) => !focus || j.responsibilityId === focus);
  const name = (id: string | null) => id ? state.items.find((r) => r.id === id)?.name : null;
  const sections = [["Needs you", "Needs you"], ["Looking after", "What I’m looking after"], ["Accomplished", "What I’ve accomplished"]] as const;
  return (
    <section>
      {focus && <Back onClick={() => actions.open(focus)} label={name(focus) ?? "Responsibilities"} />}
      <h1 className="font-heading text-2xl text-ink">What I’m Up To</h1>
      <p className="mt-1 text-ink-muted">How the work is getting on.</p>
      {sections.map(([status, label]) => {
        const rows = jobs.filter((j) => (j.status === "Needs you" && state.approved.includes(j.id) ? "Looking after" : j.status) === status);
        if (!rows.length) return null;
        return (
          <div key={status} className="mt-8"><h2 className="text-xs uppercase tracking-wide text-ink-muted">{label} · {rows.length}</h2>
            <ul className="mt-2 divide-y divide-border border-y border-border">
              {rows.map((j) => (
                <li key={j.id} className="py-3 text-sm">
                  <p className="text-ink">{j.description}</p>
                  <p className="text-xs text-ink-muted">{j.place} · {j.responsibilityId ? <button type="button" className="text-primary hover:underline" onClick={() => actions.open(j.responsibilityId!)}>{name(j.responsibilityId)}</button> : "Part of setting up your portfolio"}</p>
                  {j.outcome && <p className="mt-1 text-xs text-ink-muted">{j.outcome}</p>}
                  {j.approval && status === "Needs you" && <Button size="sm" className="mt-2" onClick={() => actions.approve(j.id)}>{j.approval}</Button>}
                  {state.approved.includes(j.id) && <p className="mt-1 text-xs text-ink-muted">Approved by you · no contractor instructed in this demonstration.</p>}
                </li>))}
            </ul></div>);
      })}
    </section>
  );
}

function ProposalPanel({ state, actions }: { state: State; actions: Actions }) {
  const p = state.proposal; if (!p) return null;
  const r = p.kind === "create" ? p.draft : state.items.find((x) => x.id === p.id); if (!r) return null;
  let title = ""; let rows: [string, string, string?][] = []; let note = ""; let yes = "Confirm"; let no = "Keep existing arrangements";
  if (p.kind === "create") {
    title = r.name; yes = "Confirm responsibility"; no = "Make a change";
    rows = [["Looking after", r.scope.label], ["Responsibility", "Monitor landlord and tenant break notice deadlines"], ["Monitoring period", `Next ${r.instructions.periodMonths} months`], ["Frequency", r.instructions.frequency], ["Communication", r.instructions.notify], ["Recipients", r.instructions.recipients ?? "You"], ["Visibility", r.shared ? "Shared with your team" : "Personal"], ["Monthly subscription", money(r.monthly)]];
  } else if (p.kind === "change") {
    title = `Proposed changes · ${r.name}`; yes = "Confirm changes";
    rows = [["Contact contractors", `${r.instructions.leadDays} days before expiry`, `${p.leadDays} days before expiry`], ["Follow up", `After ${r.instructions.followUpDays} days`, `After ${p.followUpDays} days`], ["Monthly subscription", money(r.monthly), money(r.monthly)]];
  } else if (p.kind === "extend") {
    title = `Proposed extension · ${r.name}`; yes = "Confirm extension";
    note = "Additional work: request quotations from approved contractors, monitor responses, compare quotations, present recommendations and request approval before instructing work. The additional charge is illustrative.";
    rows = [["Monthly subscription", money(r.monthly), money(95)]];
  } else {
    const verb = p.kind === "pause" ? "Pause" : p.kind === "resume" ? "Resume" : "Stop";
    title = `${verb} ${r.name}?`; yes = `${verb} responsibility`;
    note = p.kind === "pause" ? "Future scheduled reviews will not run. Outstanding work stays visible in What I’m Up To, existing commitments to contractors remain, and the subscription continues until you stop the responsibility."
      : p.kind === "resume" ? `Scheduled reviews start again${r.next ? `; the next is ${r.next}` : ""}.`
      : "I will stop all future reviews and no longer follow up outstanding work. Commitments already made to contractors remain yours to manage, and the subscription ends at the close of this month.";
  }
  const compare = rows.some((x) => x[2] !== undefined);
  return (
    <aside aria-label="Proposal" className="mb-10 rounded-lg border border-primary/30 bg-secondary/40 p-5">
      <p className="text-xs uppercase tracking-wide text-ink-muted">Here’s what I propose</p>
      <h2 className="mt-1 font-medium text-ink">{title}</h2>
      {rows.length > 0 && <table className="mt-3 w-full text-sm"><>{compare && <thead><tr className="text-left text-xs text-ink-muted"><th className="py-1 font-normal">Instruction</th><th className="font-normal">Currently</th><th className="font-normal">Proposed</th></tr></thead>}</>
        <tbody>{rows.map(([k, a, b]) => <tr key={k} className="border-t border-border"><td className="py-2 pr-3 text-ink-muted">{k}</td><td className="py-2 pr-3 text-ink">{a}</td>{compare && <td className="py-2 text-ink">{b}</td>}</tr>)}</tbody></table>}
      {note && <p className="mt-3 text-sm text-ink-muted">{note}</p>}
      <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={actions.confirm}>{yes}</Button><Button size="sm" variant="ghost" onClick={p.kind === "create" ? actions.amend : actions.discard}>{no}</Button></div>
    </aside>
  );
}
