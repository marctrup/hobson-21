import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = { q: string; a: string; mostAsked?: boolean };
type Category = { name: string; items: FAQ[] };

const CATEGORIES: Category[] = [
  {
    name: "Hobson vs. other AI",
    items: [
      {
        mostAsked: true,
        q: "How is Hobson different from ChatGPT?",
        a: `ChatGPT is a brilliant generalist. Ask it about your lease and it reads the words on the page and gives you a plausible-sounding answer. Hobson is a property specialist that gives you the correct one — and proves it.

**It reads your whole story, not one document.** A lease says the rent is £50,000; a deed of variation two years later changes it to £60,000. ChatGPT, handed the lease, tells you £50,000. Hobson reads every related document in order and tells you £60,000 — today's true figure — because it understands that a tenancy evolves and always answers with where things stand today.

**Every answer shows its evidence.** Hobson cites the document, page, clause and exact wording behind every fact, so you verify in seconds instead of digging through a filing cabinet. And when it doesn't know, it says so rather than guessing.

**It tells you when something isn't there.** "The lease contains no break right" is a real, checked answer. Where documents disagree, Hobson shows both positions and their sources rather than quietly picking one.

In short: ChatGPT predicts a likely answer. Hobson extracts the *actual* one from your documents, tracks how they change over time, and shows you the proof.`,
      },
    ],
  },
  {
    name: "Staying in control",
    items: [
      {
        q: "Will Hobson ever act on its own? How much control do I keep?",
        a: `Complete control. Hobson is built so that it *cannot* take an action you haven't approved — not as a rule it's asked to follow, but as a hard limit in how it's made.

Hobson proposes; you decide; the record only changes when you confirm it. When it spots a dangerous defect and says "tell them today," it prepares the message — but the send button is yours. It doesn't *choose* not to serve a notice on its own; it's simply never given the ability to. An instruction can be overridden in a moment that feels urgent — a limit built into how it works can't.

Two things follow. Nothing Hobson proposes is taken on trust: every claim traces back to a document and a rule it can prove. And Hobson always separates "nothing to report" from "I couldn't check" — a green light means it looked and you're clear, never that it quietly gave up.`,
      },
      {
        q: "How is Hobson built — what actually does the work?",
        a: `Everything Hobson does falls into three kinds of work, and knowing which is which tells you exactly what to trust it with.

**Answering** applies fixed rules to your recorded documents. Ask the same thing tomorrow with nothing changed and the answer is identical — every time. It never guesses, and if something it needs is missing, it says so and stops.

**Recording** changes the record — and only ever after a person decides. It never erases: the old position is kept, bounded by date, so you can always ask what was true at an earlier point and get a real answer.

**Noticing and proposing** is where Hobson behaves like a co-worker — researching what the law requires, spotting what's missing, judging which few things out of ninety actually matter, and recommending what to do next.

The first two are reliable and predictable; the third is perceptive and proactive; and Hobson uses each for exactly what it's good at.`,
      },
    ],
  },
  {
    name: "Accuracy you can trust",
    items: [
      {
        q: "How does Hobson stay accurate across a big portfolio without mixing units up?",
        a: `By answering your question in one exact place, rather than reaching across everything at once.

Ask "what's the rent?" across hundreds of units and there's no honest single answer — rent of *which* unit? A system could reach across the whole lot and hand you one figure anyway, but to do that it has to quietly pick a winner from hundreds of candidates. That's a guess — exactly what you don't want behind a number you're about to act on. So Hobson first works out which unit you mean, goes there, and answers from that one lease, where there's only ever one correct figure, provably from one document. And it shows you where it went, because with a big estate the real danger isn't a wrong number — it's a right number attached to the wrong unit.

Working in one place also makes made-up answers far less likely. Mistakes and invented figures both thrive on noise: the amount "£50,000" might appear in twenty different leases, and an AI under pressure to answer can grab the wrong one. With only one unit's documents in play, that whole class of mix-up disappears — there's only one rent in the room.

And that's only the first safeguard. On top of it, Hobson backs every figure with wording that actually contains it, reports silence as silence rather than guessing, and produces every calculated number in one place. Getting you to the right unit makes the answer far more likely to be correct; the other checks catch anything that slips through.`,
      },
      {
        q: "How do you know Hobson's answers are accurate — and not just confident-sounding?",
        a: `Because we measure it rather than assume it. AI that sounds sure of itself is easy to build; AI you can actually trust has to be tested. So Hobson's document-reading is checked against a library of real leases that property experts have gone through by hand, line by line, to establish the correct answer for every detail. Whenever we change how Hobson reads documents, we run it back over that expert-verified set and measure how closely it matches.

That turns accuracy into something we can see and improve, not a claim we simply hope is true. And because the test leases run from a simple residential tenancy all the way to long, complex commercial leases with formula-driven rents, we're proving Hobson on the hard cases, not just the easy ones.`,
      },
      {
        q: `How does Hobson guard against AI "making things up"?`,
        a: `This is the risk we take most seriously, because a confident wrong answer is far more dangerous than an honest "I'm not sure." Left unchecked, AI models can produce a figure, a quote, even a precise page reference for something that simply isn't in the document.

So Hobson is built to distrust its own first draft. Every figure it reports has to be backed by wording from the document that genuinely contains it — if the supporting text doesn't say what the answer claims, the answer doesn't stand. Beyond that, we actively test for invented answers: checking that the evidence behind each fact really exists and really says what's claimed, that nothing from one tenancy has been applied to another, and that Hobson keeps a clear line between what a document actually says and what it doesn't. Catching those patterns on purpose is how we keep them out of your answers.`,
      },
      {
        q: "Hobson keeps improving — how do you stop an update from breaking something that already worked?",
        a: `Because nothing changes in the dark. Behind the scenes, every answer Hobson gives is recorded step by step — which documents it read, which checks it ran, how it reached the result. If something is ever wrong, the team can see exactly where it happened and fix that precise step, rather than guessing.

That same record becomes a growing library of test cases. Whenever we improve how Hobson works, the new version has to prove itself against that whole library first — compared question by question with the current one — and it doesn't go live if it makes anything worse. So Hobson gets sharper over time without the "fixed one thing, broke another" problem that catches out software which isn't tested this way. Real answers your own team flags feed straight back into that test library, so the system keeps learning from live use.`,
      },
    ],
  },

  {
    name: "Your portfolio, organised",
    items: [
      {
        q: "How does Hobson organise my properties — and can I ask at any level?",
        a: `Around one thing: the **Unit** — a single occupiable space, whether that's an office suite, a shop, a warehouse, a flat or a parking space. Everything legal and tenancy-related lives at Unit level, because that's where it actually applies.

A **Property** groups related units — the floors of a building, the shops in a parade, or even units held under one lease across different addresses. A **Portfolio** sits at the top and gives the estate-wide view. A Property is *optional*: a single house sits directly in your portfolio with no building layer, while a multi-let tower groups dozens of units under one Property. Same underlying model — so a landlord with one flat and a fund with a thousand units both work exactly the same way.

And you can ask at whichever level you need. Ask about a **single unit** and you get the detail — who the tenant is, what rent is payable, when the lease expires, whether there's a break clause or deposit. Ask about a **Property** and you get the building's picture — its rent roll, which units are vacant, which leases expire. Ask across the whole **Portfolio** and you get the estate view — total contracted rent, occupancy rate, which reviews are due this year.

Because these are all the same information seen at different heights, the portfolio totals are never separately kept figures that can drift out of date — they're built from the units beneath them, so the headline always reconciles with the detail underneath.`,
      },
    ],
  },
  {
    name: "Understanding your documents",
    items: [
      {
        q: "What documents can Hobson work with, and how does it make sense of them?",
        a: `Hobson sorts every document into one of three kinds, because each plays a different role in the story of a property.

There's the document that **creates a tenancy** — the lease, licence or tenancy agreement. There are the documents that **change that tenancy over time** — deeds of variation, assignments, licences to alter, rent reviews, notices — each linked back to the lease it belongs to. And there are documents **about the building itself** — EPCs, fire risk assessments, valuations, certificates — which stand on their own.

Knowing which kind a document is means Hobson knows what to do with it: build it into the story of a tenancy, or file it against the building. You don't have to tell it — it works this out as each document arrives.`,
      },
      {
        q: "My leases get varied, assigned and re-negotiated over the years. Does Hobson keep up?",
        a: `Yes — this is exactly what it's built for.

Hobson doesn't treat your documents as a flat pile where the newest wins. It reads the original lease, then applies every later document that changed it — in the order they happened — to work out where things stand today. A rent set at £50,000 and later raised to £60,000 by a deed of variation shows as £60,000, with both documents cited.

Two things make this trustworthy over a long tenancy. **Nothing is ever thrown away** — a replaced position becomes history, kept permanently, so you can always ask what was true at an earlier date. And **every related document is always taken into account**, so the answer is never just what one document says.

That's the difference between a Hobson answer and reading the lease yourself: the lease tells you how a tenancy *started*; Hobson tells you where it *is*.`,
      },
    ],
  },
  {
    name: "Leases, money & the fine print",
    items: [
      {
        q: "My lease has passed its end date — does Hobson treat the tenancy as finished?",
        a: `No — and this is deliberate, because assuming it would be dangerous.

A lease's end date marks when the *contractual term* runs out. It does not prove the tenancy has ended, that the tenant has left, or that the rent has stopped. Tenants routinely stay on after a term expires — holding over, continuing under statutory protection, or by agreement. A lease can expire on paper while the tenancy is very much still live.

Hobson treats a tenancy as ended only when a real, confirmed event says so — not because a date passed, and not because a notice is sitting in the file. Notices are intentions, not confirmations: a notice to vacate doesn't mean the tenant left. Where the documents only show an intention, Hobson tells you the ending isn't confirmed rather than quietly assuming it happened.`,
      },
      {
        q: "If a tenant's lease has run out, do I still have compliance obligations on that unit?",
        a: `Very possibly yes — and this is exactly the trap Hobson is built to keep you out of.

"The term has ended" and "the tenant has gone" are two completely different facts, on two different dates, in either order. And compliance follows **occupation**, not the contract: if someone is still using the space, the gas, fire and electrical obligations are all live — no matter what the lease end date says.

Ordinary systems collapse these into one: a lease expires, the unit gets quietly marked empty, and the safety duties fall off — while somebody is still inside. Hobson refuses to make that leap. It marks a unit vacant only when something confirms the tenant has actually gone, and where a move-out was expected but never confirmed, it flags it as an open question rather than a settled fact.

The result: Hobson won't let a safety obligation silently disappear off an occupied unit — precisely the kind of gap that turns into a fine or a serious incident.`,
      },
      {
        q: "A lease has several different kinds of money in it. Does Hobson keep them straight?",
        a: `Yes — and this matters more than it sounds, because treating one kind of money as another is a classic source of wrong numbers.

Hobson separates four things that are easy to confuse: **the price of being there** (rent or a licence fee, recurring); **reimbursing the landlord's costs** (service charge, insurance — kept apart from rent); **one-off deal money** (a premium, a fit-out contribution, a surrender payment); and **money that may never be paid** (overage, clawback, profit share — due only if a future event happens).

Because Hobson knows which is which, it won't report a one-off premium as though it were recurring rent, or present a "might-never-happen" overage as a certain liability. Each kind is handled by its own rules, so the figures you see mean exactly what they say.`,
      },
      {
        q: "Does Hobson just tell me the rent today, or also how it will change?",
        a: `Both — and it deliberately keeps the two separate, because they answer different questions.

The rent *figure* is what's payable right now. How that figure *gets changed over time* is another thing entirely — and a lease usually contains both. Your rent might be £2,000 a month today, but alongside it could be a five-yearly market review, an annual index-linked uplift, or a step like "doubles every fifth year."

Hobson captures the current amount and the rule that will move it — including whether that change is one somebody *decides* (a market review, an expert determination) or one that arrives *automatically* (an inflation index, a fixed formula). So you can see what's coming, how it's set, and when it kicks in.

And where a future rate isn't yet fixed, Hobson tells you it's not yet established rather than assuming it'll stay the same. It won't invent a number the documents don't support.`,
      },
    ],
  },
];

const LearnFaq = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return CATEGORIES.filter(
      (cat) => activeCategory === "All" || activeCategory === cat.name
    );
  }, [activeCategory]);

  const noResults = filtered.length === 0;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Hobson AI FAQ — questions, answered</title>
        <meta
          name="description"
          content="Answers to the most common questions about Hobson: how it reads property documents, how accuracy is tested, and how it stays in your control."
        />
        <link rel="canonical" href="https://hobson-21.lovable.app/learn/faq" />
        <meta property="og:title" content="Hobson AI FAQ — questions, answered" />
        <meta property="og:url" content="https://hobson-21.lovable.app/learn/faq" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <GlobalHeader />

      <main className="flex-1">

        {/* Hero */}
        <section className="border-b border-border/60 bg-muted/30">
          <div className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Frequently asked questions
            </p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground">
              Questions, answered.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Everything you might want to know about how Hobson understands
              your property documents — and why its answers can be trusted.
            </p>

          </div>

          {/* Sticky category chips */}
          <div className="sticky top-16 z-30 bg-muted/70 backdrop-blur-md border-t border-border/60">
            <div className="mx-auto max-w-3xl px-6 py-3">
              <div className="flex flex-wrap justify-center gap-2">
                {["All", ...CATEGORIES.map((c) => c.name)].map((label) => {
                  const active = activeCategory === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setActiveCategory(label)}
                      aria-pressed={active}
                      className={[
                        "px-4 py-1.5 text-sm rounded-full border transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/50 hover:text-primary",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ list */}
        <section className="mx-auto max-w-3xl px-6 py-14">
          {noResults ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No questions match your search. Try a different word.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filtered.map((cat) => (
                <div key={cat.name}>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    {cat.name}
                  </h2>
                  <Accordion type="multiple" className="space-y-3">
                    {cat.items.map((item, idx) => {
                      const value = `${cat.name}-${idx}`;
                      return (
                        <AccordionItem
                          key={value}
                          value={value}
                          className="group border border-border rounded-2xl bg-card shadow-sm data-[state=open]:shadow-md transition-shadow overflow-hidden"
                        >
                          <AccordionTrigger className="px-5 sm:px-6 py-5 hover:no-underline [&>svg]:hidden text-left">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-base sm:text-lg font-medium text-foreground">
                                    {item.q}
                                  </span>
                                  {item.mostAsked && (
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0 font-medium">
                                      Most asked
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Plus
                                className="h-5 w-5 text-primary shrink-0 mt-1 transition-transform duration-300 group-data-[state=open]:rotate-45"
                                aria-hidden
                              />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-5 sm:px-6 pb-6 pt-0">
                            <div className="prose prose-neutral max-w-none text-[15px] leading-relaxed text-muted-foreground prose-strong:text-foreground prose-strong:font-semibold prose-em:italic prose-p:my-3">
                              <ReactMarkdown>{item.a}</ReactMarkdown>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl bg-foreground text-background p-8 sm:p-12 text-center shadow-lg">
              <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                Still have a question?
              </h3>
              <p className="mt-3 text-background/70 max-w-xl mx-auto leading-relaxed">
                If there's something we haven't covered, we'd be glad to walk
                you through it — and show you Hobson on your own documents.
              </p>
              <div className="mt-7">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                >
                  <a href="mailto:info@hobsonschoice.ai?subject=Hobson%20enquiry">Email us</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
};

export default LearnFaq;
