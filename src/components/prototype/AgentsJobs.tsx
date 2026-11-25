import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Hand, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AGENT_JOBS, type AgentJob, type AgentsState } from "@/pages/prototypeAgents";
import type { WorkspaceActions } from "./AgentsWorkspace";

type Category = AgentJob["category"];
const CATEGORIES: { value: Category; label: string; icon: typeof Check }[] = [
  { value: "Needs you", label: "Needs you", icon: Hand },
  { value: "What I’m looking after", label: "Ongoing", icon: Clock3 },
  { value: "What I’ve accomplished", label: "Completed", icon: Check },
];
const PAGE_SIZE = 8;

export function AgentsJobs({ state, actions, approvedJobs, agentId, jobs = AGENT_JOBS }: {
  state: AgentsState; actions: WorkspaceActions; approvedJobs: string[]; agentId?: string; jobs?: AgentJob[];
}) {
  const categoryOf = (item: AgentJob): Category => approvedJobs.includes(item.id) ? "What I’m looking after" : item.category;
  const scoped = jobs.filter((item) => state.agents.some((agent) => agent.id === item.agentId) && (!agentId || item.agentId === agentId));
  const [category, setCategory] = useState<Category>(() => scoped.some((item) => categoryOf(item) === "Needs you") ? "Needs you" : "What I’m looking after");
  const [query, setQuery] = useState("");
  const [responsibility, setResponsibility] = useState("all");
  const [page, setPage] = useState(0);
  const [job, setJob] = useState<string | null>(null);
  const [approval, setApproval] = useState(false);
  const nameOf = (id: string) => state.agents.find((agent) => agent.id === id)?.name ?? "Responsibility unavailable";
  const titleOf = (item: AgentJob) => approvedJobs.includes(item.id) ? "Electrical inspection quotation approved — not yet instructed" : item.title;
  const narrowed = scoped.filter((item) => (responsibility === "all" || item.agentId === responsibility) &&
    `${titleOf(item)} ${item.detail} ${nameOf(item.agentId)}`.toLowerCase().includes(query.trim().toLowerCase()));
  const matching = narrowed.filter((item) => categoryOf(item) === category);
  const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages - 1);
  const visible = matching.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const closeDetail = () => { setPage(0); setJob(null); setApproval(false); };

  return <section aria-label="Agent jobs" className="agents-jobs">
    <Button variant="ghost" onClick={actions.openList} className="mb-5 h-auto gap-2 px-0 text-muted-foreground"><ArrowLeft className="h-4 w-4" />Agents</Button>
    <h1 className="text-2xl font-semibold">What I’m Up To</h1>
    <p className="mt-2 text-sm text-muted-foreground">{agentId ? nameOf(agentId) : "Across your responsibilities"}</p>
    <Tabs value={category} onValueChange={(value) => { setCategory(value as Category); closeDetail(); }} className="mt-6">
      <TabsList aria-label="Job views" className="grid h-auto w-full grid-cols-3 gap-0 rounded-none border-b border-border bg-transparent p-0">
        {CATEGORIES.map(({ value, label, icon: Icon }) => <TabsTrigger key={value} value={value} aria-label={`${label} ${narrowed.filter((item) => categoryOf(item) === value).length}`} className="job-view min-w-0 flex-col gap-1 rounded-none border-b-2 border-transparent px-1 py-3 text-xs shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">
          <span className="flex items-center gap-1.5"><Icon className="job-view-icon h-3.5 w-3.5" aria-hidden />{label}</span><span className="text-sm tabular-nums">{narrowed.filter((item) => categoryOf(item) === value).length}</span>
        </TabsTrigger>)}
      </TabsList>
    </Tabs>
    <div className="job-finders mt-5 grid min-w-0 grid-cols-2 gap-2">
      <div className="relative min-w-0"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden /><Input aria-label="Search jobs" placeholder="Search jobs…" value={query} onChange={(event) => { setQuery(event.target.value); closeDetail(); }} className="w-full pl-9 pr-8 text-sm" />{query && <Button variant="ghost" size="icon" aria-label="Clear job search" className="absolute right-1 top-1 h-8 w-7" onClick={() => { setQuery(""); closeDetail(); }}><X className="h-3.5 w-3.5" /></Button>}</div>
      {!agentId && <Select value={responsibility} onValueChange={(value) => { setResponsibility(value); closeDetail(); }}><SelectTrigger aria-label="Filter jobs by agent" className="min-w-0 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All agents</SelectItem>{state.agents.filter((agent) => scoped.some((item) => item.agentId === agent.id)).map((agent) => <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>)}</SelectContent></Select>}
    </div>
    <div className="mt-6 flex items-baseline justify-between gap-2"><h2 className="min-w-0 text-sm font-semibold">{category}</h2><span className="shrink-0 text-xs tabular-nums text-muted-foreground">{matching.length}</span></div>
    {visible.length ? <ul aria-label="Matching jobs" className="mt-3 divide-y divide-border border-y border-border">{visible.map((item) => <li key={item.id} className="py-3">
      <Button variant="ghost" aria-expanded={job === item.id} aria-controls={`agent-job-${item.id}`} className="h-auto w-full items-start justify-between gap-3 whitespace-normal rounded-none px-0 py-1 text-left text-sm font-medium leading-6 hover:bg-secondary/30" onClick={() => { setJob(job === item.id ? null : item.id); setApproval(false); }}>{titleOf(item)}<ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground ${job === item.id ? "rotate-180" : ""}`} /></Button>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{nameOf(item.agentId)}</p>
      {job === item.id && <div id={`agent-job-${item.id}`} className="mt-3 border-l-2 border-border pl-3">
        <p className="text-sm leading-7 text-muted-foreground">{item.detail}</p>
        <Button variant="link" className="mt-3 h-auto max-w-full gap-1 whitespace-normal p-0 text-left text-xs font-normal" onClick={() => actions.openAgent(item.agentId)}>{nameOf(item.agentId)}<ArrowRight className="h-3 w-3 shrink-0" /></Button>
        {item.amount && !approvedJobs.includes(item.id) && (approval ? <div className="mt-4 border-l-2 border-primary/25 pl-3"><p className="text-sm">Approve this £180 inspection quotation only?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">This records your decision; nothing will be sent or instructed.</p><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" className="h-auto whitespace-normal py-2" onClick={() => { actions.approveJob(item.id); setApproval(false); setCategory("What I’m looking after"); setPage(0); }}>Confirm £180 approval</Button><Button size="sm" variant="ghost" onClick={() => setApproval(false)}>Not now</Button></div></div> : <Button variant="secondary" size="sm" className="mt-3" onClick={() => setApproval(true)}>Review decision</Button>)}
        {approvedJobs.includes(item.id) && <p className="mt-2 text-xs leading-5 text-muted-foreground">Approval recorded for this quotation only. No contractor instruction has been issued.</p>}
      </div>}
    </li>)}</ul> : <p role="status" className="border-b border-border py-8 text-sm leading-6 text-muted-foreground">{query || responsibility !== "all" ? "No matching jobs in this view." : category === "Needs you" ? "Nothing needs your decision at present." : category === "What I’ve accomplished" ? "No completed jobs recorded yet." : "No ongoing jobs recorded yet."}</p>}
    {matching.length > PAGE_SIZE && <nav aria-label="Job pages" className="mt-4 flex flex-wrap items-center justify-between gap-2"><span role="status" className="text-xs tabular-nums text-muted-foreground">{currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, matching.length)} of {matching.length}</span><div className="flex items-center gap-1"><Button variant="ghost" size="icon" aria-label="Previous job page" disabled={currentPage === 0} onClick={() => { setPage(currentPage - 1); setJob(null); setApproval(false); }}><ChevronLeft className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Next job page" disabled={currentPage === pages - 1} onClick={() => { setPage(currentPage + 1); setJob(null); setApproval(false); }}><ChevronRight className="h-4 w-4" /></Button></div></nav>}
  </section>;
}