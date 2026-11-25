import { useState } from "react";
import { CalendarClock, Check, ChevronDown, ChevronRight, ClipboardCheck, FileText, Hand, Search, ShieldCheck, Users, Wrench, Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AGENT_JOBS, type AgentKind, type AgentsState } from "@/pages/prototypeAgents";
import type { WorkspaceActions } from "./AgentsWorkspace";

const GROUPS: { kind: AgentKind; label: string; icon: typeof Check }[] = [
  { kind: "compliance", label: "Compliance", icon: ShieldCheck }, { kind: "break", label: "Break monitoring", icon: CalendarClock },
  { kind: "rent", label: "Rent reviews", icon: FileText }, { kind: "report", label: "Reporting", icon: ClipboardCheck },
  { kind: "renewal", label: "Renewals", icon: Building2 }, { kind: "maintenance", label: "Maintenance", icon: Wrench },
];

export function AgentsCollection({ state, actions, approvedJobs }: { state: AgentsState; actions: WorkspaceActions; approvedJobs: string[] }) {
  const [collection, setCollection] = useState("mine");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [folded, setFolded] = useState<AgentKind[]>(() => state.agents.length > 20 ? GROUPS.map((group) => group.kind) : []);
  const mine = state.agents.filter((agent) => !agent.shared || agent.creator === "You");
  const shared = state.agents.filter((agent) => agent.shared && agent.creator !== "You");
  const rows = (collection === "mine" ? mine : shared).filter((agent) => (status === "all" || agent.status === status) && `${agent.name} ${agent.scope} ${agent.creator}`.toLowerCase().includes(query.trim().toLowerCase()));
  const jobs = AGENT_JOBS.filter((job) => state.agents.some((agent) => agent.id === job.agentId));
  const needs = jobs.filter((job) => job.category === "Needs you" && !approvedJobs.includes(job.id)).length;
  return <>
    <Button variant="ghost" className="mt-5 h-auto w-full justify-between gap-3 rounded-none border-y border-border px-0 py-4 text-left" onClick={() => actions.openWork()}>
      <span className="min-w-0"><span className="block text-sm font-semibold">What I’m Up To</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{needs ? `${needs} decisions waiting for you` : "No decisions waiting for you"}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-primary" />
    </Button>
    <Tabs value={collection} onValueChange={setCollection} className="mt-5"><TabsList aria-label="Agent collections" className="h-auto w-full justify-start gap-3 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="mine" className="gap-2 rounded-none border-b-2 border-transparent px-0 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">My Agents<span className="text-xs tabular-nums">{mine.length}</span></TabsTrigger><TabsTrigger value="shared" className="gap-2 rounded-none border-b-2 border-transparent px-0 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"><Users className="h-3.5 w-3.5 shrink-0" />Shared with me<span className="text-xs tabular-nums">{shared.length}</span></TabsTrigger></TabsList></Tabs>
    <div className="agent-finders mt-4 grid grid-cols-[minmax(0,1fr)_140px] gap-2"><div className="relative min-w-0"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden /><Input aria-label="Search agents" placeholder="Find an agent or place…" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9 pr-8" />{query && <Button variant="ghost" size="icon" aria-label="Clear agent search" className="absolute right-1 top-1 h-8 w-7" onClick={() => setQuery("")}><X className="h-3.5 w-3.5" /></Button>}</div><Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Agent status" className="text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Paused">Paused</SelectItem></SelectContent></Select></div>
    <div className="mt-4 flex items-center justify-between gap-3"><p role="status" className="text-xs text-muted-foreground">{rows.length} agents</p><Button variant="ghost" size="sm" className="h-auto gap-1 px-0 text-xs font-normal text-muted-foreground" onClick={() => setFolded(folded.length === GROUPS.length ? [] : GROUPS.map((group) => group.kind))}><ChevronDown className={`h-3 w-3 ${folded.length === GROUPS.length ? "-rotate-90" : ""}`} />{folded.length === GROUPS.length ? "Expand groups" : "Collapse groups"}</Button></div>
    <div className="mt-4">{GROUPS.map(({ kind, label, icon: Icon }) => {
      const agents = rows.filter((agent) => agent.kind === kind);
      if (!agents.length) return null;
      const closed = !query.trim() && folded.includes(kind);
      return <section key={kind} aria-label={`${label} agents`} className="mb-6">
        <Button variant="ghost" aria-expanded={!closed} className="h-auto w-full justify-between gap-3 rounded-none border-b border-border bg-secondary/40 px-2 py-2.5 text-left text-xs font-semibold" onClick={() => setFolded(closed ? folded.filter((value) => value !== kind) : [...folded, kind])}><span className="flex min-w-0 items-center gap-2"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />{label}</span><span className="flex items-center gap-2 tabular-nums text-muted-foreground">{agents.length}<ChevronDown className={`h-3.5 w-3.5 ${closed ? "-rotate-90" : ""}`} /></span></Button>
        {!closed && <ul className="divide-y divide-border">{agents.map((agent) => {
          const agentJobs = jobs.filter((job) => job.agentId === agent.id);
          const decisions = agentJobs.filter((job) => job.category === "Needs you" && !approvedJobs.includes(job.id)).length;
          return <li key={agent.id} className="agent-directory-row flex items-center gap-2 py-3"><Button variant="ghost" className="h-auto min-w-0 flex-1 items-start justify-between gap-2 whitespace-normal rounded-none px-0 py-0 text-left font-normal" onClick={() => actions.openAgent(agent.id)}><span className="min-w-0"><span className="block text-sm font-medium leading-6">{agent.name}</span><span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{agent.scope}</span><span className="mt-1 block text-[11px] leading-5 text-muted-foreground">{agent.status === "Paused" ? "Paused" : agent.frequency}{agent.shared ? ` · ${agent.creator}` : ""}</span></span><ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" /></Button>{agentJobs.length > 0 && <Button variant="ghost" aria-label={`View ${agentJobs.length} jobs for ${agent.name}${decisions ? `, ${decisions} need you` : ""}`} className="h-auto shrink-0 flex-col gap-1 px-2 py-2 text-xs font-normal text-muted-foreground" onClick={() => actions.openWork(agent.id)}><span className={decisions ? "font-medium text-primary" : ""}>{decisions ? <Hand className="mr-1 inline h-3 w-3" /> : <ClipboardCheck className="mr-1 inline h-3 w-3" />}{decisions || agentJobs.length}</span><span className="text-[10px]">{decisions ? "need you" : "jobs"}</span></Button>}</li>;
        })}</ul>}
      </section>;
    })}</div>
    {!rows.length && <section className="py-8"><h2 className="text-base font-semibold">{query || status !== "all" ? "No matching agents" : collection === "mine" ? "What would you like me to look after?" : "Nothing shared with you yet"}</h2>{!query && status === "all" && collection === "mine" && <Button variant="link" className="mt-3 h-auto whitespace-normal p-0 text-left" onClick={() => actions.fillInput("Keep track of my upcoming break dates.")}>Keep track of my upcoming break dates.</Button>}</section>}
  </>;
}