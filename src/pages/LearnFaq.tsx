import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
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
import owlMascot from "@/assets/owl-mascot.png";


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
      {
        q: "How is Hobson different from an AI co-worker like Claude?",
        a: `Claude and other AI co-workers are powerful — they can already read a document, cite it and remember, so this is a fair question. The difference is that Claude is a model, and Hobson is a system built around one.

A model is brilliant but probabilistic: ask it the same question twice and you can get two answers; it can transpose a figure, miss the seventh variation in a stack, or produce a confident citation for wording that isn't quite there. Reading, citing and remembering are things it usually does well — but each is a behaviour you're trusting to be right this time, with no way to know if it wasn't.

Hobson uses a model like that for what models are genuinely good at — reading and extracting — and deliberately doesn't trust it for the rest:

**It computes with fixed rules, not the model.** Every figure, date and calculation is produced by deterministic code and a single calculation engine, so once a document is in the record, the same question gives the same, checkable answer every time.

**It turns documents into records, not recollection.** Hobson extracts each document into structured fields — every value with its source — held permanently and queryable across your whole portfolio. That's a database you can trust for "total rent across 500 units," not a summary the model is recalling.

**Its citations are captured, not generated.** The source travels with the fact from extraction and is checked to actually contain the figure — so a reference can't be a plausible invention.

**It answers only from your documents.** A general model's vast training knowledge can quietly import another lease's wording or a generic assumption. Hobson is bounded to your documents and defined property rules.

**Its accuracy is measured.** Hobson is tested continuously against answers verified by property experts, so how right it is is known — and improving. A general model just gives you an answer.

And the model isn't the hard part — frontier models are becoming a commodity anyone can call. The hard part is everything wrapped around it: capturing how property actually works, building the deterministic tools and the single calculation engine, and above all the validation framework that proves each answer against leases checked by hand by property experts. That takes a rare combination — property expertise, AI engineering and testing discipline in one team — and a long, deliberate build to get right. It's the part that can't be shortcut. Hobson is that layer, already built and being proven on real portfolios, so you get a system you can trust your portfolio to — not a raw tool you'd have to construct and fact-check yourself.`,
      },
      {

        q: "Is Hobson ever afraid to say it doesn't know?",
        a: `Never — and it's one of the biggest differences between Hobson and a general AI.

Most AI tools are built to always produce an answer, so when they don't know something they tend to fill the gap with a confident guess. Hobson does the opposite. Where the documents don't settle a question, or a piece of information it needs is missing, it says so plainly — what it can tell you, what it can't, and why. It treats "I don't have enough to answer that yet" as a proper, finished answer, not a failure to cover up.

That includes telling you when something simply isn't in your documents at all — "the lease records no rent deposit" is a real, checked finding, stated plainly, not an apology. And where a fact is missing, Hobson explains what it would need to get you the answer, rather than pretending it already has it.

Its confidence comes from **honesty, not from always having a number** — and an answer you can trust is worth far more than one that only sounds sure.`,
      },
    ],
  },

  {
    name: "Working with Hobson",
    items: [
      {
        q: "Do I need to be a property expert to use Hobson?",
        a: `No. Hobson adapts to you — it never assumes your job title or knowledge. Ask in plain language and you get a plain-language answer; where a technical term is unavoidable, it explains it rather than leaving you to look it up.

It meets you at your level, whether you live in leases every day or only deal with them occasionally — clear enough for a newcomer, without talking down to someone who knows the field.`,
      },
      {
        q: "What's Hobson like to work with?",
        a: `Direct and low-effort. Hobson gets to the point rather than padding answers, and it won't perform enthusiasm or bury a simple answer in advice you didn't ask for.

It keeps what you share confidential, tells you plainly where things stand — including when something is uncertain or missing — and takes responsibility for its answers rather than hedging. The aim is that a piece of property work feels handled, so you're not left holding all the detail in your head.`,
      },
      {
        q: "Am I dealing with one assistant, or a team?",
        a: `One assistant: Hobson. Behind the scenes it brings together different kinds of property expertise, and you may see which kind is helping while work is underway — but every answer comes back as one considered response, in one voice.

You never have to manage a committee, repeat yourself to different parts of the system, or work out who's responsible for what. You ask Hobson; Hobson answers.`,
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
      {
        q: "When Hobson works out a figure, can I see how it reached it?",
        a: `Always. Any number Hobson calculates for you — a reviewed rent, a deadline, a notice date — never arrives on its own. Its workings come with it: the figures it started from and when they applied, the rules it followed, and any cap or floor that changed the result, set out in order.

So you're never asked to take a calculated number on trust. You can see exactly how it was reached and check it yourself — and if the workings can't be shown for some reason, Hobson tells you that rather than handing you a bare figure.

There's one more quiet safeguard behind this: every calculation across the whole system is done in a single place, one consistent way. **One method to rely on, and one place to check** — so the same question always produces the same, showable answer.`,
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
        q: "How does Hobson know when to follow a fixed rule and when to use judgment?",
        a: `It comes down to three kinds of work — and Hobson treats each differently, which is exactly what tells you when it's following a fixed rule and when it's using judgment.

**Answering** applies fixed rules to your recorded documents. Ask the same thing tomorrow with nothing changed and the answer is identical — every time. It never guesses, and if something it needs is missing, it says so and stops.

**Recording** changes the record — and only ever after a person decides. It never erases: the old position is kept, bounded by date, so you can always ask what was true at an earlier point and get a real answer.

**Noticing and proposing** is where Hobson behaves like a co-worker — researching what the law requires, spotting what's missing, judging which few things out of ninety actually matter, and recommending what to do next.

The first two are reliable and predictable; the third is perceptive and proactive; and Hobson uses each for exactly what it's good at.`,
      },
      {
        q: "Will Hobson tell me things I didn't think to ask?",
        a: `Where it genuinely helps, yes — but never to pad an answer.

A good co-worker doesn't just answer the narrow question; they mention the thing you'd have wanted to know but didn't think to ask — a deadline coming up, a consequence that follows, the sensible next step. Hobson does the same, briefly and proportionately, when something like that sits alongside your answer.

Two limits keep this useful rather than noisy. It only raises something that genuinely matters — it won't lecture, speculate, or invent a worry to look helpful. And it only mentions what your documents actually establish; it never manufactures a risk or a fact that isn't there. So when Hobson flags something, it's worth reading — and when your answer is simply the answer, that's all you get.`,
      },
    ],
  },



  {
    name: "Your portfolio, organised",
    items: [
      {
        q: "Why does Hobson organise everything around the unit?",
        a: `Because the unit is where the truth of a tenancy actually lives. A **Unit** — a single occupiable space, whether an office suite, a shop, a warehouse, a flat or a parking space — is what every lease, tenant and obligation attaches to, so it's what Hobson builds everything around.

Above it, a **Property** groups related units — the floors of a building, the shops in a parade, or even units held under one lease across different addresses — and a **Portfolio** sits at the top with the estate-wide view. A Property is *optional*: a single house sits directly in your portfolio with no building layer, while a multi-let tower groups dozens of units under one Property. Same underlying model — so a landlord with one flat and a fund with a thousand units both work exactly the same way.

And you can ask at whichever level you need. Ask about a **single unit** and you get the detail — who the tenant is, what rent is payable, when the lease expires, whether there's a break clause or deposit. Ask about a **Property** and you get the building's picture — its rent roll, which units are vacant, which leases expire. Ask across the whole **Portfolio** and you get the estate view — total contracted rent, occupancy rate, which reviews are due this year.

Because these are all the same information seen at different heights, the portfolio totals are never separately kept figures that can drift out of date — they're built from the units beneath them, so the headline always reconciles with the detail underneath.`,
      },
    ],
  },
  {
    name: "Understanding your documents",
    items: [
      {
        q: "How does Hobson make sense of all the documents on a property?",
        a: `Hobson sorts every document into one of three kinds, because each plays a different role in the story of a property.

There's the document that **creates a tenancy** — the lease, licence or tenancy agreement. There are the documents that **change that tenancy over time** — deeds of variation, assignments, licences to alter, rent reviews, notices — each linked back to the lease it belongs to. And there are documents **about the building itself** — EPCs, fire risk assessments, valuations, certificates — which stand on their own.

Knowing which kind a document is means Hobson knows what to do with it: build it into the story of a tenancy, or file it against the building. You don't have to tell it — it works this out as each document arrives.`,
      },
      {
        q: "After years of variations and assignments, how does Hobson know where a lease actually stands?",
        a: `By reading the whole story, not just the latest page. Hobson takes the original lease, then applies every later document that changed it — in the order they happened — to work out where things stand today. A rent set at £50,000 and later raised to £60,000 by a deed of variation shows as £60,000, with both documents cited.

Two things make this trustworthy over a long tenancy. **Nothing is ever thrown away** — a replaced position becomes history, kept permanently, so you can always ask what was true at an earlier date. And **every related document is always taken into account**, so the answer is never just what one document says.

That's the difference between a Hobson answer and reading the lease yourself: the lease tells you how a tenancy *started*; Hobson tells you where it *is*.`,
      },
    ],
  },
  {
    name: "Leases, money & the fine print",
    items: [
      {
        q: "When a lease reaches its end date, does Hobson assume the tenancy is over?",
        a: `No — and that reflects a principle that runs through everything Hobson does: documents record what should happen; only real events record what did.

A term end date is a milestone on paper. On its own it isn't proof that the tenancy has ended or that the tenant has left — those are separate things, they happen on their own dates, and often they don't happen when the term runs out at all. Tenants routinely stay on after a term expires.

So Hobson never treats a date passing as an event in its own right. It reports a tenancy as ended, or a unit as empty, only when something actually confirms it — not because the calendar moved, and not because a notice is sitting in the file (a notice records an intention, not an outcome). Where nothing confirms it, Hobson says so plainly and marks it unconfirmed, rather than quietly filling the silence with an assumption.

That's the philosophy in a line: Hobson tells you what the documents establish and what they don't — and never guesses at the difference.`,
      },
      {
        q: "How does Hobson think about the different kinds of money in a lease?",
        a: `It treats them as genuinely different things — because treating one kind of money as another is a classic source of wrong numbers.

Hobson separates four things that are easy to confuse: **the price of being there** (rent or a licence fee, recurring); **reimbursing the landlord's costs** (service charge, insurance — kept apart from rent); **one-off deal money** (a premium, a fit-out contribution, a surrender payment); and **money that may never be paid** (overage, clawback, profit share — due only if a future event happens).

Because Hobson knows which is which, it won't report a one-off premium as though it were recurring rent, or present a "might-never-happen" overage as a certain liability. Each kind is handled by its own rules, so the figures you see mean exactly what they say.`,
      },
      {
        q: "Will Hobson ever guess a rent it can't yet work out?",
        a: `No — and this points to a principle at the heart of how Hobson works: it reports what the documents establish, and stays honest about what they don't.

Your rent really has two parts — the figure payable now, and the rule that will change it later (a market review, an index-linked uplift, a fixed step). Hobson keeps them distinct, because they're different kinds of fact: one is a printed amount, the other is a mechanism for reaching a future one. It records both.

But where that mechanism hasn't yet produced a number — a review that hasn't happened, an index not yet applied — Hobson tells you the future rate isn't established, rather than quietly carrying today's figure forward. It would rather show you a known gap than a confident guess.

That's the same principle you'll find everywhere in Hobson: say what's established, flag what isn't, and never fill the space with an assumption.`,
      },
      {
        q: "What does Hobson do when my documents contradict each other?",
        a: `It shows you both sides — it never quietly picks one.

Property documents disagree more often than you'd expect: a lease sets one break date and a later deed sets another; a figure is stated one way in one place and differently in another. When that happens, Hobson doesn't hide the mess by choosing a winner, and it doesn't split the difference into a vague middle — a blurred answer is more dangerous than either clear position.

Instead it sets out both positions plainly, each with the document and wording it came from, and tells you the documents conflict. Where one position is the safer one to rely on until the matter is settled, it will say so — but it leaves both facts in full view, so you can see exactly what you're deciding between.

That's the difference between an answer you can act on and one that only looks tidy.`,
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FCFAF7" }}>
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
        <section>
          <div className="mx-auto max-w-3xl px-6 pt-20 pb-10 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 mb-7 rounded-full"
              style={{ backgroundColor: "#F3F0FF", border: "1px solid #E8E4F0" }}
            >
              <img src={owlMascot} alt="" className="w-10 h-10" />
            </div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "#B4914F" }}
            >
              Frequently asked questions
            </p>
            <h1
              className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight"
              style={{ color: "#2D2D2D" }}
            >
              Questions, answered.
            </h1>
            <p
              className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: "#6B6B6B" }}
            >
              How Hobson thinks about your property documents — and why you
              can trust the answers it gives.
            </p>
          </div>

          {/* Sticky category chips */}
          <div
            className="sticky top-16 z-30 backdrop-blur-md"
            style={{ backgroundColor: "rgba(252,250,247,0.85)", borderTop: "1px solid #EDE7DA", borderBottom: "1px solid #EDE7DA" }}
          >
            <div className="mx-auto max-w-4xl px-6 py-4">
              <div className="flex flex-wrap justify-center gap-2.5">
                {["All", ...CATEGORIES.map((c) => c.name)].map((label) => {
                  const active = activeCategory === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setActiveCategory(label)}
                      aria-pressed={active}
                      className="px-5 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={
                        active
                          ? { backgroundColor: "#2D2D2D", color: "#FFFFFF", border: "1px solid #2D2D2D" }
                          : { backgroundColor: "#F3F0FF", color: "#2D2D2D", border: "1px solid #E8E4F0" }
                      }
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
        <section className="mx-auto max-w-3xl px-6 py-16">
          {noResults ? (
            <div className="text-center py-16">
              <p style={{ color: "#6B6B6B" }}>
                No questions match your search. Try a different word.
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              {filtered.map((cat, catIdx) => (
                <div key={cat.name}>
                  <div className="flex items-baseline gap-4 mb-6">
                    <span
                      className="font-serif italic text-xl"
                      style={{ color: "#B4914F" }}
                    >
                      {String(catIdx + 1).padStart(2, "0")}.
                    </span>
                    <h2
                      className="font-serif text-2xl sm:text-[1.75rem] font-normal tracking-tight"
                      style={{ color: "#2D2D2D" }}
                    >
                      {cat.name}
                    </h2>
                    <div className="flex-1 h-px" style={{ backgroundColor: "#EDE7DA" }} />
                  </div>
                  <Accordion type="multiple" className="space-y-4">
                    {cat.items.map((item, idx) => {
                      const value = `${cat.name}-${idx}`;
                      return (
                        <AccordionItem
                          key={value}
                          value={value}
                          className="group rounded-xl overflow-hidden bg-white transition-all duration-300 data-[state=open]:shadow-[0_8px_20px_-6px_rgba(180,145,79,0.18)]"
                          style={{
                            border: "1px solid #E8E4F0",
                          }}
                        >
                          <AccordionTrigger className="px-6 py-6 hover:no-underline [&>svg]:hidden text-left group-data-[state=open]:border-b group-data-[state=open]:border-[#F3F0FF]">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className="font-serif text-lg sm:text-xl font-medium"
                                    style={{ color: "#2D2D2D" }}
                                  >
                                    {item.q}
                                  </span>
                                  {item.mostAsked && (
                                    <Badge
                                      className="border-0 font-medium"
                                      style={{ backgroundColor: "#F3F0FF", color: "#B4914F" }}
                                    >
                                      Most asked
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {/* Brass +/× glyph */}
                              <span className="relative flex-shrink-0 ml-4 w-6 h-6" aria-hidden>
                                <span
                                  className="absolute top-1/2 left-0 w-6 h-[2px] -translate-y-1/2 transition-transform duration-300"
                                  style={{ backgroundColor: "#B4914F" }}
                                />
                                <span
                                  className="absolute top-1/2 left-0 w-6 h-[2px] -translate-y-1/2 rotate-90 transition-all duration-300 group-data-[state=open]:rotate-0 group-data-[state=open]:opacity-0"
                                  style={{ backgroundColor: "#B4914F" }}
                                />
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-8 pt-6">
                            <div
                              className="prose max-w-none text-[15px] leading-relaxed prose-p:my-3 prose-strong:font-semibold prose-em:italic"
                              style={{ color: "#555555" }}
                            >
                              <ReactMarkdown
                                components={{
                                  strong: ({ node, ...props }) => (
                                    <strong style={{ color: "#2D2D2D" }} {...props} />
                                  ),
                                }}
                              >
                                {item.a}
                              </ReactMarkdown>
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
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <div
              className="rounded-2xl p-10 sm:p-14 text-center"
              style={{
                backgroundColor: "#2D2D2D",
                color: "#FCFAF7",
                boxShadow: "0 20px 40px -20px rgba(45,45,45,0.35)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-full"
                style={{ backgroundColor: "rgba(180,145,79,0.15)", border: "1px solid rgba(180,145,79,0.35)" }}
              >
                <img src={owlMascot} alt="" className="w-9 h-9" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                Still have a question?
              </h3>
              <p
                className="mt-3 max-w-xl mx-auto leading-relaxed italic"
                style={{ color: "rgba(252,250,247,0.7)" }}
              >
                If there's something we haven't covered, we'd be glad to walk
                you through it — and show you Hobson on your own documents.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 font-semibold"
                  style={{ backgroundColor: "#B4914F", color: "#2D2D2D" }}
                >
                  <a href="mailto:info@hobsonschoice.ai?subject=Hobson%20enquiry">
                    Email us
                  </a>
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
