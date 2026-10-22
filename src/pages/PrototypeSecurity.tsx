import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, Eye, Lightbulb, MessageCircle, RotateCcw, Search, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlDefault from "@/assets/prototype/owl-default.png";
import {
  AREAS, FAMILIES, GROUPS, PAGE, PRESETS, type Access, type AreaId, type Level, type Person, type SecState,
  accessGroups, diff, firstName, glance, groupName, initialState, interpret, isRestricted, levelLabel, matchesQuery, paperLine,
  peopleForArea, peopleForPlace, placeLines, reviewInvite, saveDraft, setAllPapers, setArea, setFamily, setGroup, setPortfolio, setType, setUnit,
  typesFor, isTop, rankLabel, COLLEAGUES, setColleague, unitsFor, visiblePeople, visiblePapers,
} from "./prototypeSecurityAccess";

// Prototype Security: the Superuser tells Hobson who should reach what; Hobson explains and asks before saving.
// Shares only the shell styling of the other prototypes; local simulation, nothing sent or stored.

type Message = { id: number; role: "user" | "hobson"; text: string; choices?: string[] };
const OPENING = "Here you can decide who has access to your portfolio, which Units they can work with, and what information they can see.\n\nWould you like to review someone's access or invite a new person?";
const STARTERS = ["Invite someone", "Review existing users", "Who has access to Burlington Gardens?", "Show me users with access to compliance"];
const TRY: { label: string; text: string }[] = [
  { label: "Give additional access", text: "Give James access to Flat 8 at Stanley House." },
  { label: "Restrict paper types", text: "Remove Emily's access to Deeds of Variation." },
  { label: "Remove accounting papers", text: "Remove Priya's access to all accounting papers." },
  { label: "Invite a contractor", text: "Invite a contractor" },
  { label: "Remove a whole building", text: "Remove James's access to Burlington Gardens." },
  { label: "Review access by place", text: "Who can access Burlington Gardens?" },
  { label: "Review access by area", text: "Who can make changes to My Compliance Responsibilities?" },
  { label: "Suspend access", text: "Suspend Tom's access." },
  { label: "Cancel an invitation", text: "Cancel Mark's invitation." },
  { label: "See someone's view", text: "View access as James." },
];

const ring = "rounded-xl bg-background ring-1 ring-bone";


function Check({ on, part, label, onChange }: { on: boolean; part?: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={part ? "mixed" : on} aria-label={label} onClick={() => onChange(!on)} className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border transition ${on || part ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"}`}>
      {on ? <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden><path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : part ? <span className="h-0.5 w-2 rounded bg-primary-foreground" /> : null}
    </button>
  );
}

function Fold({ title, hint, children, start = false }: { title: string; hint?: string; children: ReactNode; start?: boolean }) {
  const [open, setOpen] = useState(start);
  return (
    <div className={`${ring} overflow-hidden`}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-paper/60">
        <ChevronRight className={`h-3.5 w-3.5 text-ink-muted transition-transform ${open ? "rotate-90" : ""}`} aria-hidden />
        <span className="font-medium text-ink">{title}</span>
        {hint && <span className="ml-auto truncate pl-3 text-xs text-ink-muted">{hint}</span>}
      </button>
      {open && <div className="border-t border-faint-rule px-4 py-3">{children}</div>}
    </div>
  );
}

/** The one permission editor used for existing people and invitations alike. */
function AccessEditor({ a, set, locked, quiet, top }: { a: Access; set: (a: Access) => void; locked?: boolean; quiet?: boolean; top?: boolean }) {
  const types = typesFor(a);
  if (locked) return null;
  return (
    <div className="grid gap-3">
      <Fold title="Places" hint={placeLines(a).join(" · ") || "None yet"} start={!quiet}>
        <label className="mb-3 flex items-center gap-2.5 text-sm"><Check on={a.portfolio} label="The whole portfolio" onChange={(v) => set(setPortfolio(a, v))} />The whole portfolio <span className="text-xs text-ink-muted">— including places added later</span></label>
        <div className="grid gap-2">
          {GROUPS.map((g) => {
            const u = unitsFor(a, g.id), all = a.portfolio || a.groups[g.id] === "all";
            return (
              <div key={g.id} className="rounded-lg bg-paper/50 px-3 py-2.5">
                <div className="flex items-center gap-2.5 text-sm">
                  <Check on={all} part={!all && u.length > 0} label={`All of ${g.name}`} onChange={(v) => set(setGroup(a, g.id, v))} />
                  <span className="font-medium">{g.name}</span>
                  <span className="ml-auto text-xs text-ink-muted">{all ? `All ${g.units.length} Units` : u.length ? `${u.join(", ")} only` : "No access"}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 pl-6">
                  {g.units.map((x) => {
                    const on = u.includes(x);
                    return <button key={x} type="button" aria-pressed={on} onClick={() => set(setUnit(a, g.id, x, !on))} className={`rounded-full px-2.5 py-0.5 text-xs ring-1 transition ${on ? "bg-primary/10 text-ink ring-primary/40" : "text-ink-muted ring-bone hover:bg-background"}`}>{x}</button>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-ink-muted">Ticking a building includes all its Units. Choosing single Units gives only those — never the rest of the building.</p>
      </Fold>
      <Fold title="Papers" hint={paperLine(a)}>
        <div role="radiogroup" aria-label="Which papers" className="mb-3 flex gap-1.5">
          {[["All papers", true], ["Selected paper types", false]].map(([l, v]) => <Button key={l as string} size="sm" role="radio" aria-checked={(a.papers === "all") === v} variant={(a.papers === "all") === v ? "secondary" : "ghost"} onClick={() => set(setAllPapers(a, v as boolean))}>{l as string}</Button>)}
        </div>
        {a.papers !== "all" && (
          <div className="grid gap-2">
            {FAMILIES.map((f) => {
              const n = f.types.filter((x) => types.includes(x.id)).length;
              return (
                <details key={f.id} className="group rounded-lg bg-paper/50 px-3 py-2" open={n > 0 && n < f.types.length}>
                  <summary className="flex cursor-pointer list-none items-center gap-2.5 text-sm">
                    <Check on={n === f.types.length} part={n > 0 && n < f.types.length} label={`All ${f.label} papers`} onChange={(v) => set(setFamily(a, f.id, v))} />
                    <span className="font-medium">{f.label}</span><span className="text-[10px] tracking-wider text-ink-muted">{f.code}</span>
                    <span className="ml-auto text-xs text-ink-muted">{n} of {f.types.length}</span>
                  </summary>
                  <div className="mt-2 grid gap-1.5 pl-6 [@container_sec_(min-width:40rem)]:grid-cols-2">
                    {f.types.map((x) => <label key={x.id} className="flex items-center gap-2 text-sm"><Check on={types.includes(x.id)} label={x.label} onChange={(v) => set(setType(a, x.id, v))} />{x.label}</label>)}
                  </div>
                </details>
              );
            })}
          </div>
        )}
        <p className="mt-2 text-xs text-ink-muted">Access to a Unit never opens every paper about it — both the place and the paper type must be allowed.</p>
      </Fold>
      {top && <Fold title="Areas of Hobson" hint={AREAS.filter((x) => a.areas[x.id] !== "none").map((x) => x.label).join(" · ") || "None"}>
        <div className="grid gap-2 [@container_sec_(min-width:40rem)]:grid-cols-2">
          {AREAS.map((x) => (
            <div key={x.id} className="rounded-lg bg-paper/50 p-3">
              <p className="text-sm font-medium">{x.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{x.explain}</p>
              <div role="radiogroup" aria-label={x.label} className="mt-2 inline-flex rounded-full bg-background p-0.5 ring-1 ring-bone">
                {x.levels.map((l) => <button key={l} type="button" role="radio" aria-checked={a.areas[x.id] === l} onClick={() => set(setArea(a, x.id, l))} className={`rounded-full px-2.5 py-0.5 text-xs transition ${a.areas[x.id] === l ? "bg-secondary font-medium text-ink" : "text-ink-muted"}`}>{levelLabel(x.id, l)}</button>)}
              </div>
            </div>
          ))}
        </div>
      </Fold>
    </div>
  );
}

function Glance({ p, a }: { p: Person; a: Access }) {
  const g = glance(p, a);
  return (
    <div className="grid overflow-hidden rounded-xl ring-1 ring-bone [@container_sec_(min-width:40rem)]:grid-cols-3">
      {([["Where", g.where, "bg-primary/[0.04]"], ["What", g.what, "bg-paper"], ["What they can do", g.doing, "bg-secondary/40"]] as const).map(([k, v, bg]) => (
        <div key={k} className={`${bg} px-4 py-3`}><p className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">{k}</p><p className="mt-1 text-sm leading-relaxed text-ink">{v}</p></div>
      ))}
    </div>
  );
}

// ---------- People, presented as cards rather than rows ----------
/** People are presented as name-only cards: the rights above them say who has what, so cards stay quiet. */
function PersonCard({ p, onOpen, lit, scope }: { p: Person; onOpen: () => void; lit?: boolean; scope?: string }) {
  return (
    <li>
      <button type="button" onClick={onOpen} aria-label={`Open ${p.name}'s access`} title={p.status === "suspended" ? "Suspended" : undefined} className={`group flex max-w-full items-center gap-2.5 rounded-xl bg-background px-4 py-2.5 text-left ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-22px_rgba(45,45,45,0.55)] hover:ring-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${lit ? "bg-primary/[0.04] ring-primary/60" : "ring-bone"}`}>
        {p.status === "suspended" && <span aria-label="Suspended" title="Suspended" className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-muted" />}
        <span className="truncate whitespace-nowrap font-serif text-[15px] leading-snug text-ink">{p.name}</span>
        {p.you && <span className="shrink-0 text-[10px] text-ink-muted">(you)</span>}
        {scope && <span className="shrink-0 text-[11px] text-ink-muted">{scope}</span>}
      </button>
    </li>
  );
}

/** One group of people, explained in a line, so a long team reads as sections rather than a wall of rows. */
function PersonGroup({ title, explain, people, lit, expand, onOpen }: { title: string; explain: string; people: Person[]; lit: string[]; expand: boolean; onOpen: (id: string) => void }) {
  const [all, setAll] = useState(false);
  const big = people.length > PAGE;
  const shown = visiblePeople(people, all, expand);
  return (
    <section aria-label={title} className="grid gap-3">
      <header>
        <div className="flex items-baseline gap-3">
          <h4 className="font-serif text-lg leading-none text-ink">{title}</h4>
          <span aria-hidden className="h-px min-w-8 flex-1 bg-bone" />
          <span className="shrink-0 text-xs tabular-nums text-ink-muted">{people.length} {people.length === 1 ? "person" : "people"}</span>
        </div>
        <p className="mt-1 text-xs italic text-ink-muted">{explain}</p>
      </header>
      <ul className="flex flex-wrap gap-2">
        {shown.map((p) => <PersonCard key={p.id} p={p} lit={lit.includes(p.id)} onOpen={() => onOpen(p.id)} />)}
      </ul>
      {big && !expand && <Button type="button" variant="ghost" size="sm" className="w-fit px-2 text-xs text-primary" onClick={() => setAll(!all)}>{all ? "Show fewer" : `Show all ${people.length}`}</Button>}
    </section>
  );
}

function SectionRule({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-baseline gap-3">
      <h3 className="font-serif text-xl leading-none text-ink">{title}</h3>
      <span aria-hidden className="h-px min-w-8 flex-1 bg-bone" />
      {count !== undefined && <span className="shrink-0 text-xs tabular-nums text-ink-muted">{count}</span>}
    </div>
  );
}

export default function PrototypeSecurity() {
  const [s, setS] = useState<SecState>(initialState);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "hobson", text: OPENING, choices: STARTERS }]);
  const [input, setInput] = useState("");
  const [tryOpen, setTryOpen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [query, setQuery] = useState("");
  const nextId = useRef(1);
  const logEnd = useRef<HTMLDivElement>(null);
  const noted = useRef<string | null>(null);
  useEffect(() => { logEnd.current?.scrollIntoView?.({ block: "end" }); }, [messages]);

  const say = (role: Message["role"], text: string, choices?: string[]) => setMessages((m) => [...m.map((x) => ({ ...x, choices: undefined })), { id: nextId.current++, role, text, choices }]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput(""); setTryOpen(false);
    say("user", text);
    const out = interpret(s, text === "Review existing users" ? "review users" : text);
    setTimeout(() => { setS(out.state); noted.current = out.state.draft?.id ?? null; say("hobson", out.reply, out.choices); }, 300);
  };

  // Direct edits on the right become a draft; Hobson acknowledges once, and several changes are saved together.
  const editPerson = (p: Person, a: Access) => {
    setS((x) => ({ ...x, draft: { id: p.id, access: a }, pending: { kind: "save", id: p.id } }));
    if (noted.current !== p.id) { noted.current = p.id; say("hobson", `I'll gather your changes to ${firstName(p)}'s access. Make as many as you like, then save them together.`, ["Save changes", "Keep reviewing"]); }
  };
  const saveNow = () => { const p = s.people.find((x) => x.id === s.draft?.id); setS((x) => saveDraft(x)); noted.current = null; if (p) say("hobson", `Done. I've updated ${firstName(p)}'s access.`); };
  const discard = () => { setS((x) => ({ ...x, draft: null, pending: null })); noted.current = null; say("hobson", "I've put everything back as it was."); };
  const open = (id: string) => { setS((x) => ({ ...x, view: { kind: "person", id }, draft: x.draft?.id === id ? x.draft : null, pending: x.draft?.id === id ? x.pending : null })); noted.current = null; };
  const back = () => { setS((x) => ({ ...x, view: { kind: "overview" }, draft: null, pending: null, invite: null })); noted.current = null; };
  const restart = () => { setS(initialState()); nextId.current = 1; noted.current = null; setQuery(""); setMessages([{ id: 0, role: "hobson", text: OPENING, choices: STARTERS }]); };
  const startInvite = () => send("Invite someone");

  const active = s.people.filter((p) => p.status !== "invited");
  const allInvited = s.people.filter((p) => p.status === "invited");
  const invited = allInvited.filter((p) => matchesQuery(p, query));
  const groups = accessGroups(active, query);
  const v = s.view;

  const workspace = (() => {
    if (v.kind === "person" || v.kind === "preview") {
      const p = s.people.find((x) => x.id === v.id);
      if (!p) return null;
      const a = s.draft?.id === p.id ? s.draft.access : p.access;
      const changes = diff(p.access, a);
      const n = firstName(p);
      if (v.kind === "preview") {
        const papers = visiblePapers(a);
        return (
          <div className="grid gap-6">
            <BackLink onClick={() => open(p.id)} label={`Back to ${n}'s access`} />
            <div><h2 className="font-serif text-2xl">Hobson as {n} sees it</h2><p className="mt-1 text-sm text-ink-muted">A read-only preview. You are still signed in as yourself.</p></div>
            <div className="grid gap-4 [@container_sec_(min-width:40rem)]:grid-cols-[12rem_1fr]">
              <div className={`${ring} p-4`}><p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">Menu</p>{["Portfolio", ...AREAS.filter((x) => isTop(p) || a.areas[x.id] !== "none").map((x) => x.label), ...(p.superuser ? ["Security"] : [])].map((m) => <p key={m} className="py-1 text-sm">{m}</p>)}</div>
              <div className="grid gap-4">
                <div className={`${ring} p-4`}><p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">Places</p>{GROUPS.filter((g) => unitsFor(a, g.id).length).map((g) => <p key={g.id} className="py-1 text-sm"><span className="font-medium">{g.name}</span> <span className="text-ink-muted">· {unitsFor(a, g.id).join(", ")}</span></p>)}{!GROUPS.some((g) => unitsFor(a, g.id).length) && <p className="text-sm italic text-ink-muted">No places</p>}</div>
                <div className={`${ring} p-4`}><p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">Papers {n} could open</p>
                  {papers.length ? papers.map((x) => <p key={x.title} className="py-1 text-sm">{x.title}{x.partial && <span className="ml-2 text-xs text-ink-muted">— details about other Units withheld</span>}</p>) : <p className="text-sm italic text-ink-muted">None</p>}
                </div>
                <p className="text-xs text-ink-muted">If {n} asked me about anything outside this, I'd answer only from what's shown here.</p>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className="grid gap-6">
          <BackLink onClick={back} label="Security overview" />
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="font-serif text-3xl text-ink">{p.name}</h2><p className="mt-1 text-sm text-ink-muted">{p.role} · {p.status === "invited" ? "Invitation awaiting acceptance" : p.status === "suspended" ? "Suspended" : "Active"}{` · ${rankLabel(p)}`}{p.you && " · you"}</p></div>
            <div className="flex flex-wrap gap-1.5">
              <Button size="sm" variant="ghost" onClick={() => setS((x) => ({ ...x, view: { kind: "preview", id: p.id } }))}><Eye className="mr-1.5 h-3.5 w-3.5" />View access as {n}</Button>
              {p.status === "invited" ? <>
                <Button size="sm" variant="ghost" onClick={() => send(`Resend ${n}'s invitation`)}>Resend</Button>
                <Button size="sm" variant="ghost" onClick={() => send(`Cancel ${n}'s invitation`)}>Cancel invitation</Button>
              </> : !p.you && <>
                {p.status === "suspended" ? <Button size="sm" variant="outline" onClick={() => send(`Restore ${n}'s access`)}>Restore access</Button> : <Button size="sm" variant="ghost" onClick={() => send(`Suspend ${n}'s access`)}>Suspend</Button>}
                {!p.superuser && <Button size="sm" variant="ghost" onClick={() => send(`Make ${n} a Superuser`)}>Make Superuser</Button>}
              </>}
            </div>
          </div>
          {p.status === "suspended" && <p className="rounded-lg bg-secondary/50 px-4 py-2.5 text-sm">{n} can't use Hobson at the moment. Everything below is kept and will apply again when restored.</p>}
          {!isTop(p) && a.portfolio && a.papers === "all" && <p className="font-serif text-lg text-ink">All locations · All papers</p>}
          {p.admin && (
            <div className={`${ring} p-4`}>
              <p className="text-sm font-medium">Back Office colleagues {n} may work with</p>
              <p className="mb-3 mt-0.5 text-xs text-ink-muted">Only a Superuser can close a colleague to an Admin.</p>
              <div className="grid gap-2 [@container_sec_(min-width:40rem)]:grid-cols-2">
                {COLLEAGUES.map((c) => {
                  const open = !p.blockedColleagues?.includes(c.id);
                  const me = s.people.find((x) => x.you);
                  return (
                    <label key={c.id} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 px-3 py-2 text-sm">
                      <span><span className="font-medium">{c.name}</span> <span className="text-ink-muted">· {c.area}</span></span>
                      <span className="flex items-center gap-2 text-xs text-ink-muted">{open ? "Allowed" : "Restricted"}
                        <input type="checkbox" aria-label={`${c.name} for ${n}`} checked={open} disabled={!me?.superuser} onChange={(e) => setS((x) => ({ ...x, people: x.people.map((q) => (q.id === p.id ? setColleague(q, c.id, e.target.checked) : q)) }))} className="h-4 w-4 accent-primary" />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
          {changes.length > 0 && (
            <div className="rounded-xl bg-primary/[0.06] p-4 ring-1 ring-primary/30" role="status">
              <p className="text-sm font-medium">Here is what will change</p>
              <ul className="mt-1.5 grid gap-1 text-sm">{changes.map((c) => <li key={c}>{c}</li>)}</ul>
              <div className="mt-3 flex gap-2"><Button size="sm" onClick={saveNow}>Save changes</Button><Button size="sm" variant="ghost" onClick={discard}>Discard</Button></div>
            </div>
          )}
          <AccessEditor a={a} locked={isTop(p)} quiet={!isTop(p) && a.portfolio && a.papers === "all"} set={(x) => editPerson(p, x)} />
        </div>
      );
    }
    if (v.kind === "invite" && s.invite) {
      const inv = s.invite;
      const setInv = (patch: Partial<typeof inv>) => setS((x) => ({ ...x, invite: { ...x.invite!, ...patch } }));
      const ghost: Person = { id: "invite", name: inv.name || "This person", role: inv.role, email: inv.email, status: "invited", access: inv.access };
      return (
        <div className="grid gap-6">
          <BackLink onClick={back} label="Security overview" />
          <div><h2 className="font-serif text-3xl">Invite someone to Hobson</h2><p className="mt-1 text-sm text-ink-muted">Nothing is emailed in this demonstration.</p></div>
          <ol className="flex gap-4 text-xs text-ink-muted">{["Who", "Access", "Review"].map((x, i) => <li key={x} className={(inv.step === "review" ? 2 : inv.step === "access" ? 1 : 0) >= i ? "font-medium text-ink" : ""}>{i + 1}. {x}</li>)}</ol>
          <div className={`${ring} grid gap-3 p-4 [@container_sec_(min-width:40rem)]:grid-cols-3`}>
            {([["Name", "name"], ["Email address", "email"], ["Role or description (optional)", "role"]] as const).map(([l, k]) => (
              <label key={k} className="grid gap-1 text-xs"><span className="text-ink-muted">{l}</span><input value={inv[k]} onChange={(e) => setInv({ [k]: e.target.value, ...(k !== "role" && inv.step !== "review" ? {} : {}) })} className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
            ))}
          </div>
          {!inv.editingId && <div><p className="mb-2 text-sm font-medium">Start from</p><div className="flex flex-wrap gap-1.5">{PRESETS.map((x) => <Button key={x.id} size="sm" variant="outline" onClick={() => { setInv({ access: { ...x.access, groups: { ...x.access.groups } }, step: "access" }); if (x.id === "full") say("hobson", "Full access gives every place, paper and area. Please make sure that's intended."); }}>{x.label}</Button>)}</div><p className="mt-1.5 text-xs text-ink-muted">Starting points only — change anything below. Nothing gives places until you choose them, except Full access and Accounts.</p></div>}
          <Glance p={ghost} a={inv.access} />
          <AccessEditor a={inv.access} set={(a) => setInv({ access: a, step: inv.step === "review" ? "access" : inv.step })} />
          <div className="flex gap-2">
            <Button onClick={() => { const out = reviewInvite({ ...s, invite: { ...inv, step: "access" } }); setS(out.state); say("hobson", out.reply, out.choices); }}>{inv.editingId ? "Review changes" : "Review the invitation"}</Button>
            <Button variant="ghost" onClick={back}>Cancel</Button>
          </div>
        </div>
      );
    }
    if (v.kind === "place") {
      const rows = peopleForPlace(s.people, v.gid);
      return (
        <div className="grid gap-6">
          <BackLink onClick={back} label="Security overview" />
          <div><h2 className="font-serif text-3xl">{groupName(v.gid)}</h2><p className="mt-1 text-sm text-ink-muted">{rows.length} people with access</p></div>
          <ul className="flex flex-wrap gap-2">{rows.map(({ person, scope }) => <PersonCard key={person.id} p={person} onOpen={() => open(person.id)} scope={scope} />)}</ul>
        </div>
      );
    }
    if (v.kind === "area") {
      const label = AREAS.find((x) => x.id === v.area)!.label;
      const rows = peopleForArea(s.people, v.area, v.level);
      return (
        <div className="grid gap-6">
          <BackLink onClick={back} label="Security overview" />
          <div><h2 className="font-serif text-3xl">{label}</h2><p className="mt-1 text-sm text-ink-muted">{rows.length} people who can {v.level === "change" ? "make changes" : "see it"}</p></div>
          <ul className="flex flex-wrap gap-2">{rows.map(({ person, scope }) => <PersonCard key={person.id} p={person} onOpen={() => open(person.id)} scope={scope} />)}</ul>
        </div>
      );
    }
    return (
      <div className="grid gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h2 className="font-serif text-3xl text-ink">Security</h2><p className="mt-1 text-sm italic text-ink-muted">Decide who has access to Hobson and what they can work with.</p></div>
          <Button onClick={startInvite}>Invite someone</Button>
        </div>
        <dl className="grid grid-cols-3 gap-3">
          {([[active.length, "People with access"], [allInvited.length, "Invitations awaiting acceptance"], [s.people.filter((p) => p.status !== "invited" && isRestricted(p)).length, "Users with restricted access"]] as const).map(([n, l]) => (
            <div key={l} className="border-l border-bone pl-3"><dt className="order-2 text-xs text-ink-muted">{l}</dt><dd className="font-serif text-3xl tabular-nums text-ink">{n}</dd></div>
          ))}
        </dl>
        <section aria-label="People with access" className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-serif text-xl leading-none text-ink">People with access</h3>
            <label className="flex min-w-0 items-center gap-2 rounded-full bg-secondary/50 px-3 ring-1 ring-bone focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />
              <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find a person, place or role" placeholder="Find a person, place or role" className="w-48 min-w-0 bg-transparent py-1.5 text-xs outline-none placeholder:text-ink-muted [@container_sec_(min-width:44rem)]:w-64" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X className="h-3 w-3 text-ink-muted" /></button>}
            </label>
          </div>
          {groups.length ? <div className="grid gap-6">{groups.map((g) => <PersonGroup key={g.key} title={g.title} explain={g.explain} people={g.people} lit={s.lit} expand={query.trim().length > 0} onOpen={open} />)}</div> : <p className="text-sm italic text-ink-muted">No one matches “{query}”.</p>}
        </section>
        <section aria-label="Pending invitations" className="grid gap-3">
          <SectionRule title="Pending invitations" count={invited.length} />
          {invited.length ? <ul className="flex flex-wrap gap-2">{invited.map((p) => <PersonCard key={p.id} p={p} onOpen={() => open(p.id)} lit={s.lit.includes(p.id)} />)}</ul> : <p className="text-sm italic text-ink-muted">{query.trim() ? `No invitation matches “${query}”.` : "None waiting."}</p>}
        </section>
      </div>
    );
  })();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bone-wash text-ink">
      <aside className="flex w-[68px] shrink-0 flex-col items-center gap-2 border-r border-bone bg-background py-4">
        <div className="mb-2 grid h-10 w-10 place-items-center" aria-hidden><img src={owlDefault} alt="" className="h-10 w-10 object-contain" /></div>
        <button type="button" aria-current="page" title="Security — Superusers only" className="flex w-12 flex-col items-center gap-1 rounded-lg bg-secondary py-2 text-[10px] font-medium leading-tight text-ink"><Shield className="h-3.5 w-3.5" aria-hidden />Security</button>
        <div className="mt-auto grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal" title="Sarah Mitchell · Superuser">SM</div>
      </aside>

      <section aria-label="Chat with Hobson" className={`relative z-20 w-full shrink-0 flex-col border-r border-bone bg-background max-md:absolute max-md:inset-y-0 max-md:left-[68px] max-md:w-[calc(100%-68px)] md:w-[380px] ${showChat ? "flex" : "hidden md:flex"}`}>
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-faint-rule px-5">
          <h1 className="text-[15px] font-semibold">Chat with Hobson</h1>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowChat(false)}>View Security</Button>
        </header>
        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => {
            const cont = i > 0 && messages[i - 1].role === "hobson" && m.role === "hobson";
            return (
              <div key={m.id} className={`flex min-w-0 flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex min-w-0 gap-2">
                  {m.role === "hobson" && (cont ? <span className="w-10 shrink-0" /> : <img src={owlDefault} alt="Hobson" className="h-10 w-10 shrink-0 object-contain" />)}
                  <div className={`min-w-0 rounded-lg px-3.5 py-2.5 ${m.role === "user" ? "bg-secondary" : ""}`}><p className="whitespace-pre-line break-words text-sm leading-relaxed">{m.text}</p></div>
                </div>
                {m.choices && <div className="ml-12 flex flex-wrap gap-2">{m.choices.map((c, k) => <Button key={c} size="sm" variant={k === 0 ? "outline" : "ghost"} onClick={() => (c === "Save changes" && s.draft && !s.pending ? saveNow() : send(c))}>{c}</Button>)}</div>}
              </div>
            );
          })}
          <div ref={logEnd} />
        </div>
        <div className="border-t border-faint-rule px-5 pb-4 pt-2">
          {tryOpen && (
            <div role="group" aria-label="Things you might try" className="mb-3 max-h-64 overflow-y-auto border-b border-bone pb-3">
              <div className="flex items-center justify-between"><span className="text-xs text-ink-muted">Things you might try</span><Button variant="ghost" size="icon" aria-label="Close suggestions" onClick={() => setTryOpen(false)}><X className="h-4 w-4" /></Button></div>
              {TRY.map((x) => <button key={x.label} type="button" onClick={() => send(x.text)} className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-paper"><span className="block text-sm text-ink">{x.label}</span><span className="block truncate text-xs text-ink-muted">“{x.text}”</span></button>)}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-1 rounded-full border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
            <Button type="button" variant="ghost" size="icon" aria-label="Things you might try" aria-expanded={tryOpen} onClick={() => setTryOpen((o) => !o)} className="h-9 w-9 shrink-0"><Lightbulb className="h-5 w-5" /></Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder="Tell Hobson who should have access…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0"><ArrowRight className="h-5 w-5" /></Button>
          </form>
        </div>
      </section>

      <main aria-label="Security" className="[container-type:inline-size] [container-name:sec] flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-bone bg-background px-5">
          <div className="min-w-0"><p className="flex items-center gap-1.5 text-sm font-medium"><Shield className="h-3.5 w-3.5 text-primary" aria-hidden />Security</p><p className="hidden truncate text-[11px] text-ink-muted [@container_sec_(min-width:28rem)]:block">Visible to Superusers only · a demonstration — nothing is sent or saved</p></div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Chat with Hobson" onClick={() => setShowChat(true)}><MessageCircle className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" aria-label="Restart demo" onClick={restart}><RotateCcw className="h-3.5 w-3.5 [@container_sec_(min-width:28rem)]:mr-2" /><span className="hidden [@container_sec_(min-width:28rem)]:inline">Restart demo</span></Button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 [@container_sec_(min-width:42rem)]:px-10">
          <div key={`${v.kind}-${"id" in v ? v.id : ""}`} className="mx-auto max-w-4xl animate-in fade-in duration-300">{workspace}</div>
        </div>
      </main>
    </div>
  );
}

function BackLink({ onClick, label }: { onClick: () => void; label: string }) {
  return <button type="button" onClick={onClick} className="flex w-fit items-center gap-1.5 text-xs text-ink-muted hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" aria-hidden />{label}</button>;
}

export type { AreaId, Level };
