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
import evidencePackImage from "@/assets/evidence-pack-example.png.asset.json";


type FAQ = {
  q: string;
  a: string;
  mostAsked?: boolean;
  image?: { src: string; alt: string; label: string; caption: string };
};
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

**Its accuracy is measured.** We test Hobson against a library of real leases where property experts have established the correct answer for every detail, and re-run that test whenever we change how it works — so how accurate it is is known, and improving. That's a benchmark built behind the scenes, not a person checking your answers: day to day, Hobson runs on its own. A general model just gives you an answer, with no measure of whether it's right.

And the model isn't the hard part — frontier models are becoming a commodity anyone can call. The hard part is everything wrapped around it: capturing how property actually works, building the deterministic tools and the single calculation engine, and above all the validation framework that proves each answer against leases checked by hand by property experts. That takes a rare combination — property expertise, AI engineering and testing discipline in one team — and a long, deliberate build to get right. It's the part that can't be shortcut. Hobson is that layer, already built and being proven on real portfolios, so you get a system you can trust your portfolio to — not a raw tool you'd have to construct and fact-check yourself.`,
      },
      {
        q: "Will Hobson give me the same answer twice?",
        a: `Yes. That's not automatic with AI — ask a general model the same question twice and you can get two different answers.

Hobson removes that where it matters most. Once a document is in the record, every figure, date and calculation is produced by fixed rules rather than by the model, so the same question gives the same answer every time, and you can check how it was reached.

The one place we do use a model's judgement is reading documents, because that's what models are genuinely good at. So that's the one place we measure stability directly — reading the same lease repeatedly and checking that every field comes back identical.`,
      },
      {
        q: "Doesn't all software get tested? What's different about AI?",
        a: `All serious software is tested. What changes with AI is what a test can actually prove.

Ordinary software is predictable — the same input gives the same output, every time. So a test is a straight pass or fail, and once it passes, it stays passed. And when something does break, it usually breaks loudly: an error, a crash, a blank cell. You find out.

AI isn't predictable in that way, so one test proves nothing. You have to run the same document many times over and measure how often it's right. The result isn't pass or fail — it's a score. There's no version that simply "works" and then stays working.

That's why the testing has to be a different shape: a library of real leases where property experts have established the correct answer for every detail, re-run in full whenever anything changes, scored, and compared against the version before it. Same discipline as any well-built software. Different instrument, because we're measuring something that can be right most of the time rather than something that either works or doesn't.`,
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
    name: "Who Hobson is for",
    items: [
      {
        q: "Is Hobson built for my industry?",
        a: `Hobson is built around documents, not industries — and the documents are the same everywhere.

A restaurant group's operations director and a law firm's facilities director are looking at the same clause. Both leases say "full repairing and insuring." Both create the same obligation, the same cost at exit, the same argument with a landlord if it's missed. The two of them sit in different buildings with different job titles and read the identical provision.

That holds across every document type that matters: leases, deeds of variation, side letters, licences to assign or alter, guarantees, compliance certificates and notices. A retail group with three hundred stores and a single-building owner hold the same paperwork. What changes between industries is the volume and the context — not what the documents say or what they oblige you to do.

So the question isn't whether Hobson knows your industry. It's whether it can read your documents, and those it already knows.`,
      },
      {
        q: "Is Hobson only for large portfolios?",
        a: `No — ten properties and five hundred are the same problem at different volumes.

What actually changes with size is who's responsible. In a smaller business, one person covers everything: the lease, the gas safety certificate, the rent review window, the break notice. They need Hobson to be a complete property expert — one that's read every document and can answer anything, without them working out which file to open first.

In a larger business, those same jobs are split. Finance owns the rent roll and the service charge reconciliation. Legal owns the notices and assignments. Operations owns the certificates and repair obligations. Each one needs Hobson to know their corner in precise detail.

The document library is identical in both cases. The smaller the team, the more Hobson has to cover; the larger the team, the deeper it has to go. Both are served by the same learning model — because a Hobson that has already learned the portfolio can answer either kind of question, while one that searches on demand can only find what you already knew to look for.`,
      },
      {
        q: "I work in finance, legal or operations — not property. Is Hobson for me?",
        a: `Yes — and you shouldn't need to know which document holds your answer.

Ask as a finance analyst: which stores have RPI-linked reviews rather than open market, what's still inside a rent-free period, which service charge items this lease actually makes recoverable. Ask as a solicitor: what form must this notice take, who is the correct addressee, which guarantors survived the last assignment. Ask as an operations manager: does this site's lease require landlord consent before the fit-out, what's the repairing standard, which EPCs expire this quarter.

Same document library, three completely different questions — answered from what Hobson has already extracted, with the clause cited for each. You don't need to be the property person. You need the part of the property that's yours.`,
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
        q: "When Hobson gives me an answer, how do I check it's right?",
        a: `You don't have to take it on trust — every answer comes with an evidence pack.

The pack shows the exact wording behind each fact: the document, the page, the clause, and the text itself, quoted verbatim rather than paraphrased. Nothing is summarised in the extracts, so what you're reading is what the lease actually says. Verification takes seconds, not an afternoon in a filing cabinet.

This matters because of when the evidence is captured. Hobson doesn't produce an answer and then go looking for a citation to support it — the figure and the wording it came from are recorded together at the moment the document is read, and stored as one thing. A reference can't be composed after the fact to justify a number, which is precisely how AI citations go wrong elsewhere.

Where a lease doesn't settle the question, the pack says so. Below the answer, Hobson sets out what isn't established and why — a date the lease never fixes, a figure that depends on something not yet recorded. A known gap is a real answer; a confident guess isn't.`,
        image: {
          src: evidencePackImage.url,
          alt: "Illustrative example of a Hobson evidence pack, showing an answer supported by three verbatim extracts from a lease, each with page number, clause reference and a highlighted source page",
          label: "Illustrative example",
          caption:
            "The rent isn't stated in one place. The rent clause points to the Second Schedule, the Schedule defines the figure, and a later part sets out how it's paid. Hobson resolved that chain when it read the document, and kept all three clauses attached to the fact — so the evidence was already there when the question was asked.",
        },
      },
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
        q: "If Hobson got something wrong, would I notice?",
        a: `Not necessarily — and that's exactly why we don't rely on spot-checking.

Ordinary software fails loudly: an error, a crash, a blank cell. AI fails quietly. A wrong rent figure arrives looking exactly like a right one — same confident tone, same clean formatting, often a citation attached. Left unchecked, AI models will produce a figure, a quote, even a precise page reference for something that simply isn't in the document. Nothing flags it for you.

So Hobson is built to distrust its own first draft. Every figure it reports has to be backed by wording from the document that genuinely contains it — if the supporting text doesn't say what the answer claims, the answer doesn't stand. And we actively test for invented content: checking that the evidence behind each fact really exists and really says what's claimed, that nothing from one tenancy has been applied to another, and that Hobson holds a clear line between what a document says and what it's silent on.

You shouldn't have to be the safety net. The checking happens before an answer reaches you — and the evidence comes with it, so you can confirm anything that matters.`,
      },
      {
        q: "What exactly do you test — just the document reading?",
        a: `The whole journey. Reading a lease correctly is one step, and an answer can still come out wrong if a later one goes astray — the wrong unit identified, an out-of-date document pulled, the wrong tool used, a calculation run on the right figures in the wrong order.

So each step is checked in its own right: was the right document retrieved, was the right tool chosen, is every statement actually supported by a source, was the calculation produced by the calculation engine rather than improvised by the model. A step can be perfectly sound and still give you a wrong answer if the one before it failed.`,
      },
      {
        q: "If an answer is wrong, can you find out why?",
        a: `Yes — down to the exact step. Every answer Hobson gives is recorded as it happens: which documents it read, which tools it ran, how it reached the result.

Without that record, all anyone knows is "the answer was wrong," and fixing it is guesswork. With it, we can see whether the wrong document was pulled, the wrong tool was used, a calculation was off, or the final wording added something the documents didn't support — and fix that precise step.

Anything your team flags becomes a permanent test case, so the same mistake can't quietly return later. Real problems from live use are the most valuable tests there are.`,
      },
      {
        q: "Hobson keeps improving — how do you stop an update from breaking something that already worked?",
        a: `Because no change ships without being measured against everything that already works.

Every improvement — a new way of reading documents, a change to a tool — has to run the full test library first, and is compared question by question with the current version, across accuracy, sourcing, completeness, cost and speed. Anything that got worse has to be explained and accepted before it goes live, not discovered by you three weeks later.

So Hobson gets sharper over time without the "fixed one thing, broke another" problem that catches out software which isn't tested this way.`,
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
        q: "How does Hobson make sense of all the documents?",
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
  const filtered = CATEGORIES;

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
        <section
          style={{
            backgroundColor: "#F1EBDE",
            borderBottom: "1px solid rgba(180,145,79,0.2)",
          }}
        >
          <div className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center">
            <div
              className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-full"
              style={{ backgroundColor: "#F1EBDE", border: "1px solid #E8E1D4" }}
            >
              <img src={owlMascot} alt="" className="w-9 h-9" />
            </div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "#B4914F" }}
            >
              Learn <span style={{ color: "#B4914F", opacity: 0.5 }}>/</span> FAQ
            </p>
            <h1
              className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight"
              style={{ color: "#2D2D2D" }}
            >
              Questions, answered.
            </h1>
            <p
              className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: "#6E6A62" }}
            >
              How Hobson thinks about your property documents — and why you
              can trust the answers it gives.
            </p>
            <div className="mx-auto mt-8 h-px w-24" style={{ backgroundColor: "#F7EDDC" }} />
          </div>
        </section>


        {/* FAQ list */}
        <section className="mx-auto max-w-3xl px-6 py-16">
          {noResults ? (
            <div className="text-center py-16">
              <p style={{ color: "#6E6A62" }}>
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
                    <div className="flex-1 h-px" style={{ backgroundColor: "#F7EDDC" }} />
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
                            border: "1px solid #E8E1D4",
                          }}
                        >
                          <AccordionTrigger className="px-6 py-6 hover:no-underline [&>svg]:hidden text-left group-data-[state=open]:border-b group-data-[state=open]:border-[#F1EBDE]">
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
                                      style={{ backgroundColor: "#F1EBDE", color: "#B4914F" }}
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
                              style={{ color: "#56514A" }}
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
                            {item.image && (
                              <figure className="mt-8 mb-2">
                                <div
                                  className="text-right text-[12px] mb-2"
                                  style={{ color: "#8A8378" }}
                                >
                                  {item.image.label}
                                </div>
                                <img
                                  src={item.image.src}
                                  alt={item.image.alt}
                                  className="w-full h-auto rounded-2xl block"
                                  style={{ border: "1px solid #E8E1D4" }}
                                />
                                <figcaption
                                  className="mt-2 text-[12.5px] leading-relaxed"
                                  style={{ color: "#8A8378" }}
                                >
                                  {item.image.caption}
                                </figcaption>
                              </figure>
                            )}
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
