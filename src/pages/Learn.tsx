import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  mostAsked?: boolean;
};

const CATEGORIES = [
  "Hobson vs. other AI",
  "Trust, accuracy & control",
  "Your portfolio, organised",
  "Understanding your documents",
  "Leases, money & the fine print",
] as const;

const FAQS: Faq[] = [
  {
    id: "vs-chatgpt",
    category: "Hobson vs. other AI",
    question: "How is Hobson different from ChatGPT?",
    mostAsked: true,
    answer: `ChatGPT is a brilliant generalist. Ask it about your lease and it reads the words on the page and gives you a plausible-sounding answer. Hobson is a property specialist that gives you the correct one — and proves it.

**It reads your whole story, not one document.** A lease says the rent is £50,000; a deed of variation two years later changes it to £60,000. ChatGPT, handed the lease, tells you £50,000. Hobson reads every related document in order and tells you £60,000 — today's true figure — because it understands that a tenancy evolves and always answers with the current position.

**Every answer shows its evidence.** Hobson cites the document, page, clause and exact wording behind every fact, so you verify in seconds instead of digging through a filing cabinet. And when it doesn't know, it says so rather than guessing.

**It tells you when something isn't there.** "The lease contains no break right" is a real, checked answer. Where documents disagree, Hobson shows both positions and their sources rather than quietly picking one.

*In short:* ChatGPT predicts a likely answer. Hobson extracts the actual one from your documents, tracks how they change over time, and shows you the proof.`,
  },
  {
    id: "control",
    category: "Trust, accuracy & control",
    question: "Will Hobson ever act on its own? How much control do I keep?",
    answer: `**Complete control.** Hobson is built so that it cannot take an action you haven't approved — not as a rule it's asked to follow, but as a hard limit in how it's made.

Hobson proposes; you decide; the record only changes when you confirm it. When it spots a dangerous defect and says "tell them today," it prepares the message — but the send button is yours. It doesn't choose not to serve a notice on its own; it's simply never given the ability to. An instruction can be overridden in a moment that feels urgent — an architectural limit can't.

Two things follow. Nothing Hobson proposes is taken on trust: every claim traces back to a document and a rule it can prove. And Hobson always separates *"nothing to report"* from *"I couldn't check"* — a green light means it looked and you're clear, never that it quietly gave up.`,
  },
  {
    id: "how-built",
    category: "Trust, accuracy & control",
    question: "How is Hobson built — what actually does the work?",
    answer: `Everything Hobson does falls into three kinds of work, and knowing which is which tells you exactly what to trust it with.

**Answering** applies fixed rules to your recorded documents. Ask the same thing tomorrow with nothing changed and the answer is identical — every time. It never guesses, and if something it needs is missing, it says so and stops.

**Recording** changes the record — and only ever after a person decides. It never erases: the old position is kept, bounded by date, so you can always ask what was true at an earlier point and get a real answer.

**Noticing and proposing** is where Hobson behaves like a co-worker — researching what the law requires, spotting what's missing, judging which few things out of ninety actually matter, and recommending what to do next.

The tools are reliable and predictable; the agents are perceptive and proactive; and Hobson uses each for exactly what it's good at.`,
  },
  {
    id: "unit-accuracy",
    category: "Trust, accuracy & control",
    question: "Does answering at the exact unit make Hobson more accurate — and less likely to make things up?",
    answer: `**Yes, on both counts** — and for the same reason.

Mistakes happen when there's too much lookalike material to sift through. In a property portfolio that's a real risk: the figure "£50,000" might appear in twenty different leases, and the hard part isn't finding a rent — it's being sure it's *this* unit's rent and not the one next door. When Hobson answers at the exact unit, that whole class of mix-up disappears. There's only one rent in the room.

It also makes made-up answers far less likely. AI tends to invent things when it's uncertain and still under pressure to produce a result — and uncertainty comes from noise and too many plausible-but-wrong candidates. Narrowing to the exact unit strips the noise away.

Scope is only the first safeguard. On top of it, Hobson requires every figure to be backed by wording that actually contains it, reports silence as silence, and produces every calculated number in one place. Getting you to the right door makes the answer far more likely to be correct; the other checks catch anything that slips through.`,
  },
  {
    id: "organise",
    category: "Your portfolio, organised",
    question: "How does Hobson organise my properties?",
    answer: `Around one thing: the **Unit** — a single occupiable space, whether that's an office suite, a shop, a warehouse, a flat or a parking space. Everything legal and tenancy-related lives at Unit level, because that's where it actually applies.

A **Property** groups related units — the floors of a building, the shops in a parade, or even units held under one lease across different addresses. A **Portfolio** sits at the top and gives you the estate-wide view.

Crucially, a Property is optional. A single house sits directly in your portfolio with no building layer at all, while a multi-let tower groups dozens of units under one Property. Same underlying model — so a landlord with one flat and a fund with a thousand units both work exactly the same way.`,
  },
  {
    id: "whole-estate",
    category: "Your portfolio, organised",
    question: "Can I ask about my whole estate, or only one property at a time?",
    answer: `**Either** — because Hobson captures everything at Unit level and then rolls it up.

Ask about a single unit and you get the detail: who the tenant is, what rent is payable, when the lease expires, whether there's a break clause or deposit. Ask about a Property and you get the building's picture: its rent roll, which units are vacant, which leases expire. Ask across the whole Portfolio and you get the estate view: total contracted rent, occupancy rate, which reviews are due this year.

Because it's all the same information viewed at different heights, the portfolio numbers are never separately maintained figures that can drift out of date — they're built directly from the units beneath them, so the top always reconciles with the detail underneath.`,
  },
  {
    id: "take-to-unit",
    category: "Your portfolio, organised",
    question: "Why does Hobson take me to a specific unit instead of answering from wherever I am?",
    answer: `Because for most questions, *where you're asking* is half the question.

Ask "what's the rent?" across a portfolio of hundreds of units and there's no honest single answer — rent of which unit? A system could reach across everything and hand you one figure anyway, but to do that it has to quietly pick a winner from hundreds of candidates. That's a guess — exactly what you don't want behind a number you're about to act on.

So Hobson does the opposite. It establishes which unit you mean, goes there, and answers from that one lease — where there's only ever one correct figure, provably from one document. The move is shown, not hidden, because with a large estate the real danger isn't a wrong number — it's a right number attached to the wrong unit.

And when your question genuinely belongs at portfolio level, nothing moves at all — that view is already the right place to answer.`,
  },
  {
    id: "docs-kinds",
    category: "Understanding your documents",
    question: "What documents can Hobson work with, and how does it make sense of them?",
    answer: `Hobson sorts every document into one of three kinds, because each plays a different role in the story of a property.

There's the document that **creates a tenancy** — the lease, licence or tenancy agreement. There are the documents that **change that tenancy over time** — deeds of variation, assignments, licences to alter, rent reviews, notices — each linked back to the lease it belongs to. And there are documents **about the building itself** — EPCs, fire risk assessments, valuations, certificates — which stand on their own.

Knowing which kind a document is means Hobson knows what to do with it: build it into the story of a tenancy, or file it against the building. You don't have to tell it — it works this out as each document arrives.`,
  },
  {
    id: "varied-assigned",
    category: "Understanding your documents",
    question: "My leases get varied, assigned and re-negotiated over the years. Does Hobson keep up?",
    answer: `**Yes** — this is exactly what it's built for.

Hobson doesn't treat your documents as a flat pile where the newest wins. It reads the original lease, then applies every later document that changed it — in the order they happened — to work out where things stand today. A rent set at £50,000 and later raised to £60,000 by a deed of variation shows as £60,000, with both documents cited.

Two things make this trustworthy over a long tenancy. Nothing is ever thrown away — a superseded position becomes history, kept permanently, so you can always ask what was true at an earlier date. And the whole chain is always considered, so the answer is never just what one document says.

That's the difference between a Hobson answer and reading the lease yourself: the lease tells you how a tenancy *started*; Hobson tells you where it *is*.`,
  },
  {
    id: "end-date",
    category: "Leases, money & the fine print",
    question: "My lease has passed its end date — does Hobson treat the tenancy as finished?",
    answer: `**No** — and this is deliberate, because assuming it would be dangerous.

A lease's end date marks when the contractual term runs out. It does not prove the tenancy has ended, that the tenant has left, or that the rent has stopped. Tenants routinely stay on after a term expires — holding over, continuing under statutory protection, or by agreement. A lease can expire on paper while the tenancy is very much still live.

Hobson treats a tenancy as ended only when a real, confirmed event says so — not because a date passed, and not because a notice is sitting in the file. Notices are *intentions*, not confirmations: a notice to vacate doesn't mean the tenant left. Where the documents only show an intention, Hobson tells you the ending isn't confirmed rather than quietly assuming it happened.`,
  },
  {
    id: "compliance",
    category: "Leases, money & the fine print",
    question: "If a tenant's lease has run out, do I still have compliance obligations on that unit?",
    answer: `**Very possibly yes** — and this is exactly the trap Hobson is built to keep you out of.

*"The term has ended"* and *"the tenant has gone"* are two completely different facts, on two different dates, in either order. And compliance follows occupation, not the contract: if someone is still using the space, the gas, fire and electrical obligations are all live — no matter what the lease end date says.

Ordinary systems collapse these into one: a lease expires, the unit gets quietly marked empty, and the safety duties fall off — while somebody is still inside. Hobson refuses to make that leap. It marks a unit vacant only when something confirms the tenant has actually gone, and where a move-out was expected but never confirmed, it flags it as an open question rather than a settled fact.

The result: Hobson won't let a safety obligation silently disappear off an occupied unit — precisely the kind of gap that turns into a fine or a serious incident.`,
  },
  {
    id: "money-kinds",
    category: "Leases, money & the fine print",
    question: "A lease has several different kinds of money in it. Does Hobson keep them straight?",
    answer: `**Yes** — and this matters more than it sounds, because treating one kind of money as another is a classic source of wrong numbers.

Hobson separates four things that are easy to confuse: **the price of being there** (rent or a licence fee, recurring); **reimbursing the landlord's costs** (service charge, insurance — kept apart from rent); **one-off deal money** (a premium, a fit-out contribution, a surrender payment); and **money that may never be paid** (overage, clawback, profit share — due only if a future event happens).

Because Hobson knows which is which, it won't report a one-off premium as though it were recurring rent, or present a "might-never-happen" overage as a certain liability. Each kind is handled by its own rules, so the figures you see mean exactly what they say.`,
  },
  {
    id: "rent-change",
    category: "Leases, money & the fine print",
    question: "Does Hobson just tell me the rent today, or also how it will change?",
    answer: `**Both** — and it deliberately keeps the two separate, because they answer different questions.

The rent figure is what's payable right now. How that figure gets changed over time is another thing entirely — and a lease usually contains both. Your rent might be £2,000 a month today, but alongside it could be a five-yearly market review, an annual index-linked uplift, or a step like *"doubles every fifth year."*

Hobson captures the current amount and the rule that will move it — including whether that change is one somebody decides (a market review, an expert determination) or one that arrives automatically (an inflation index, a fixed formula). So you can see what's coming, how it's set, and when it kicks in.

And where a future rate isn't yet fixed, Hobson tells you it's *not yet established* rather than assuming it'll stay the same. It won't invent a number the documents don't support.`,
  },
];

const Learn: React.FC = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      if (activeCategory !== "All" && f.category !== activeCategory) return false;
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, Faq[]>();
    for (const cat of CATEGORIES) map.set(cat, []);
    for (const f of filtered) map.get(f.category)?.push(f);
    return Array.from(map.entries()).filter(([, items]) => items.length > 0);
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQ — Questions, answered | Hobson</title>
        <meta
          name="description"
          content="Everything you might want to know about how Hobson understands your property documents — and why its answers can be trusted."
        />
      </Helmet>

      <GlobalHeader />

      {/* Hero */}
      <section className="pt-16 pb-10 md:pt-24 md:pb-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Frequently asked questions
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold text-foreground leading-tight">
            Questions, answered.
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you might want to know about how Hobson understands your property
            documents — and why its answers can be trusted.
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              aria-label="Search questions"
              className="pl-12 h-12 rounded-full border-border bg-card shadow-sm focus-visible:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Sticky category chips */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {(["All", ...CATEGORIES] as string[]).map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={active}
                  className={
                    "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors " +
                    (active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/40 hover:text-primary")
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ list */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 space-y-12">
          {grouped.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No questions match your search. Try a different word.
              </p>
            </div>
          )}

          {grouped.map(([category, items]) => (
            <div key={category}>
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                {category}
              </h2>
              <Accordion type="multiple" className="space-y-3">
                {items.map((f) => (
                  <AccordionItem
                    key={f.id}
                    value={f.id}
                    className="group border border-border bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-md overflow-hidden"
                  >
                    <AccordionTrigger className="px-5 md:px-6 py-5 text-left hover:no-underline [&>svg]:hidden">
                      <div className="flex items-start justify-between gap-4 w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base md:text-lg font-medium text-foreground">
                              {f.question}
                            </span>
                            {f.mostAsked && (
                              <Badge className="bg-primary text-primary-foreground hover:bg-primary rounded-full text-[10px] tracking-wide uppercase">
                                Most asked
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Plus
                          className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-data-[state=open]:rotate-45"
                          aria-hidden
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 md:px-6 pb-6 pt-0">
                      <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground prose-strong:text-foreground prose-em:text-foreground/90 prose-p:leading-relaxed">
                        <ReactMarkdown>{f.answer}</ReactMarkdown>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl bg-foreground text-background p-8 md:p-12 text-center shadow-lg">
            <h3 className="font-serif text-2xl md:text-3xl font-semibold">
              Still have a question?
            </h3>
            <p className="mt-3 text-background/80 max-w-xl mx-auto">
              If there's something we haven't covered, we'd be glad to walk you through it —
              and show you Hobson on your own documents.
            </p>
            <div className="mt-6">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
              >
                <Link to="/contact">Email us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;
