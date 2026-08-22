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
    name: "Why Hobson",
    items: [
      {
        mostAsked: true,
        q: "How is Hobson different from ChatGPT?",
        a: `ChatGPT is a brilliant generalist. Hand it a lease and it reads the words on the page and gives you a plausible answer. Hobson is built specifically around a property record — the documents, the rules, and how both change over time.

**It reads the whole record, not one document.** A lease says the rent is £50,000; a deed of variation two years later changes it to £60,000. ChatGPT, handed the lease, tells you £50,000. Hobson reads every related document in order and tells you £60,000 — where things stand today.

**Every answer shows its evidence.** Hobson cites the document, page, clause and exact wording behind each fact, so you can verify in seconds.

**It tells you when something isn't there.** "The lease contains no break right" is a real, checked answer. Where documents disagree, Hobson shows both positions and their sources rather than quietly picking one.`,
      },
      {
        q: "How is Hobson different from an AI co-worker like Claude?",
        a: `Claude is a model. Hobson is a property system built around one.

Models are good at reading and understanding language, and Hobson uses one for exactly that. Four things sit around it:

**A permanent property record.** Each document is turned into structured facts, held for good and queryable across the whole portfolio — so "total rent across 500 units" comes from records, not recollection.

**Fixed rules for the sums.** Figures, dates and calculations are worked out by set rules rather than improvised by the model.

**Evidence attached to the fact.** The source wording is captured when the document is read and travels with the figure, so a reference can't be composed afterwards to justify a number.

**Accuracy that's actually measured.** Hobson is tested against real property documents where experts have established the right answer, so how accurate it is is known rather than assumed.`,
      },
      {
        q: "Will Hobson give me the same answer twice?",
        a: `The facts and figures, yes. Once your documents are read, the recorded facts stay as they are unless the record itself changes, and any calculation follows fixed rules — so the same question gives the same figure, with the same workings.

The wording of the reply may vary slightly, because AI is used to write the response. What it isn't used for is deciding what's true.

So the answer and the evidence behind it stay stable, even if the sentence around them reads a little differently.`,
      },
    ],
  },

  {
    name: "Who Hobson is for",
    items: [
      {
        q: "Is Hobson built for my industry?",
        a: `Hobson is built around property documents and property obligations, not around one business sector.

A restaurant group's operations director and a law firm's facilities director are reading the same clause. Both leases say "full repairing and insuring", and both create the same obligation and the same cost at exit.

That holds across the documents that matter: leases, deeds of variation, side letters, licences, guarantees, certificates and notices. Retail, offices, industrial, landlord or occupier — what changes is the volume and the context, not what the documents oblige you to do.`,
      },
      {
        q: "Is Hobson only for large portfolios?",
        a: `No. Ten units and five hundred are the same problem at different volumes.

In a smaller business, one person covers the lease, the gas safety certificate, the rent review window and the break notice, and needs Hobson to answer anything without them working out which file to open. In a larger business those jobs are split across teams, and each needs its own corner in precise detail.

The document library is the same in both cases. The smaller the team, the more Hobson has to cover; the larger the team, the deeper it has to go.`,
      },
      {
        q: "Do I need to be a property expert to use Hobson?",
        a: `No. Ask in plain language and you get a plain-language answer. Where a property term is unavoidable, Hobson explains it rather than leaving you to look it up.

You also don't need to know which document holds the answer. A finance analyst can ask which units have index-linked reviews rather than open market; an operations manager can ask which EPCs expire this quarter. Same document library, different questions, each answered with the clause cited.`,
      },
    ],
  },

  {
    name: "Using Hobson",
    items: [
      {
        q: "What's Hobson like to work with?",
        a: `Direct and low-effort. It gets to the point rather than padding answers, and it won't bury a simple answer in advice you didn't ask for.

It tells you plainly where things stand — including when something is uncertain or missing — and takes responsibility for its answers rather than hedging.`,
      },
      {
        q: "Am I dealing with one assistant, or a team?",
        a: `One assistant: Hobson. Different specialist capabilities work behind the scenes, and you may see which kind is helping while work is underway, but every answer comes back as one considered response.

You never have to coordinate separate tools, repeat yourself, or work out who's responsible for what.`,
      },
      {
        q: "Will Hobson tell me things I didn't think to ask?",
        a: `Where it genuinely helps, yes. If a deadline is approaching or a consequence follows from your answer, Hobson mentions it briefly.

It won't lecture, speculate, or invent a worry to look useful. When your answer is simply the answer, that's all you get.`,
      },
    ],
  },

  {
    name: "Accuracy & evidence",
    items: [
      {
        q: "When Hobson gives me an answer, how do I check it's right?",
        a: `Every answer comes with an evidence pack.

The pack shows the document, the page, the clause and the wording itself, quoted rather than paraphrased. Nothing in the extracts is summarised, so what you read is what the lease actually says.

What makes that reliable is when the evidence is captured. Hobson doesn't produce an answer and then go looking for a citation — the figure and the wording it came from are recorded together at the moment the document is read, and stored as one thing. A reference can't be composed after the fact to justify a number.

Where a lease doesn't settle the question, the pack says so.`,
        image: {
          src: evidencePackImage.url,
          alt: "Illustrative example of a Hobson evidence pack, showing an answer supported by three verbatim extracts from a lease, each with page number, clause reference and a highlighted source page",
          label: "Illustrative example",
          caption:
            "The rent isn't stated in one place. The rent clause points to the Second Schedule, the Schedule defines the figure, and a later part sets out how it's paid. Hobson resolved that chain when it read the document, and kept all three clauses attached to the fact — so the evidence was already there when the question was asked.",
        },
      },
      {
        q: "What happens when Hobson doesn't have enough information?",
        a: `It says so. Hobson reports what your documents establish, and is equally clear about what they don't.

Where something is missing, it tells you what it can answer, what it can't, and what it would need. "The lease records no rent deposit" is a real, checked finding, not a failure — an absence is an answer in its own right.

Rent is a good example. A lease may set the figure payable now and a rule that changes it later — a review, an index-linked uplift, a fixed step. Where that rule hasn't yet produced a number, Hobson says the future figure isn't established rather than quietly carrying today's forward.`,
      },
      {
        q: "What happens if documents contradict each other?",
        a: `It shows you both sides. Property documents disagree more often than you'd expect: a lease sets one break date and a later deed sets another; a figure is stated one way in one place and differently in another.

Hobson sets out both positions plainly, each with the document and wording it came from, and tells you they conflict. Where one is the safer position to rely on until the matter is settled, it will say so — but it never quietly picks a winner or splits the difference.`,
      },
      {
        q: "When Hobson works out a figure, can I see how it reached it?",
        a: `Always. Any number Hobson calculates — a reviewed rent, a deadline, a notice date — arrives with its workings: the figures it started from and when they applied, the rule it followed, any cap or floor that changed the result, and the figure that came out.

Calculations are done in one place using fixed rules, so the same inputs produce the same result. If the workings can't be shown for some reason, Hobson tells you rather than handing you a bare figure.`,
      },
      {
        q: "How do you know Hobson is accurate?",
        a: `Because it's measured rather than assumed. AI that sounds sure of itself is easy to build, and it fails quietly — a wrong figure arrives looking exactly like a right one. So Hobson is tested against a library of real property documents that property experts have gone through by hand to establish the correct answer for every detail, from a simple residential tenancy to long commercial leases with formula-driven rents.

The testing covers the whole journey, not just the reading. Each step is checked in its own right: did it go to the right unit and pull the right documents, was each fact extracted correctly, is every statement actually supported by wording that exists, were the figures produced by the fixed rules, and does the final answer say only what the documents support.

When something does go wrong, the record of how the answer was reached shows which step failed, so it can be fixed precisely — and anything your team flags becomes a permanent test case.`,
      },
      {
        q: "How do you stop an update breaking something that already worked?",
        a: `Before any change goes live, Hobson is run over the whole test library again and compared question by question with the current version — accuracy, sourcing, completeness, cost and speed.

Anything that got worse has to be explained and accepted before release, rather than discovered by you three weeks later. That's how Hobson improves without the "fixed one thing, broke another" problem.`,
      },
    ],
  },

  {
    name: "Control & security",
    items: [
      {
        q: "Will Hobson ever act on its own? How much control do I keep?",
        a: `Complete control. Hobson proposes; you decide; the record only changes when you confirm it.

When it spots something urgent and says "tell them today", it prepares the message — but the send button is yours. It isn't asked to hold back from consequential actions; it's simply never given the ability to take them.

Hobson also separates "nothing to report" from "I couldn't check". A green light means it looked and you're clear, never that it quietly gave up.`,
      },
      {
        q: "How does Hobson know when to follow a fixed rule and when to use judgment?",
        a: `Three kinds of work, treated differently.

**Answering** reports what your documents establish, with figures from fixed rules. AI helps understand the question and write the reply — never to decide what's true.

**Recording** changes the record, and only after a person decides. Nothing is erased: the old position is kept and dated, so you can always ask what was true earlier.

**Noticing and proposing** is where Hobson behaves like a co-worker — spotting what's missing, judging what matters, recommending what to do next. It still changes nothing without you.`,
      },
      {
        q: "What happens to what I share with Hobson?",
        a: `It's kept confidential. Hobson answers from your documents and your defined property rules — not from another customer's records, and not from generic assumptions imported from elsewhere.`,
      },
    ],
  },

  {
    name: "Your portfolio",
    items: [
      {
        q: "How does Hobson organise my portfolio?",
        a: `Three levels, and that's all it takes.

**Unit** — the smallest occupiable space: an office suite, a shop, a warehouse, a flat, a parking space.

**Unit group** — a set of units in the same place. Location is the only thing that makes them one group, not a shared lease, landlord or tenant.

**Portfolio** — the whole estate. Not somewhere you can stand, but a reporting view: how many units are vacant, which leases expire this year, what the total contracted rent is.

You can ask at any level. A unit gives you the tenancy detail, a group gives you the place, the portfolio gives you the estate view — built from the records beneath it, so the headline reconciles with the detail.

Hobson avoids the word "property" underneath, because it can mean either a single occupiable space or a whole building. You can still speak naturally; the precision matters in the data, not in how you ask.

Two groups can also sit at the same address and stay entirely separate records — one group's fire risk assessment says nothing about another's.

**Documents attach to the structure; they don't create it.** You define the real-world structure and it changes when the property changes — not because a PDF arrived. One lease covering units at three addresses doesn't fuse them into one place.`,
      },
    ],
  },

  {
    name: "Your documents",
    items: [
      {
        q: "How does Hobson make sense of all the documents?",
        a: `Three things are settled about any document, and none of them is a guess.

**Where it belongs.** A document names an address, and that address resolves to an actual location. The same building gets written a dozen ways across a stack of paperwork, and matching two spellings proves nothing — resolving to a location is what makes two records provably the same place.

**Which level it sits at.** A single unit, or the group it belongs to. That's your decision, recorded and stable, so a later reconfiguration doesn't shuffle documents around after the event.

**What kind of document it is.** Some create a tenancy; some modify one already in existence; some are about the asset itself. That decides how it's used: anything modifying a tenancy is applied in the order things happened, while asset documents are tracked by date so Hobson knows which certificate is current, superseded or about to expire.`,
      },
      {
        q: "After years of variations and assignments, how does Hobson know where a lease actually stands?",
        a: `By reading the whole record. Hobson takes the original lease, then applies every later document that changed it — variations, assignments, licences, review memoranda, notices — in the order they happened.

Nothing is thrown away. A replaced position becomes history, kept permanently, so you can always ask what was true at an earlier date.

That's the difference between reading the lease yourself and asking Hobson: the lease tells you how a tenancy started; Hobson tells you where it is.`,
      },
      {
        q: "When a lease reaches its end date, does Hobson assume the tenancy is over?",
        a: `No. A term end date is a milestone on paper, not proof of what happened. Tenants routinely stay on after a term expires.

A notice doesn't settle it either — a notice records an intention, not an outcome.

So Hobson reports a tenancy as ended, or a unit as empty, only when something confirms it. Where nothing does, it marks the position unconfirmed and says so.`,
      },
      {
        q: "How does Hobson think about the different kinds of money in a lease?",
        a: `It keeps four things apart, because treating one as another is a classic source of wrong numbers:

**The price of being there** — rent or a licence fee, recurring.

**Reimbursing the landlord's costs** — service charge and insurance, kept separate from rent.

**One-off deal money** — a premium, a fit-out contribution, a surrender payment.

**Money that may never be paid** — overage, clawback, profit share, due only if a future event happens.

So a one-off premium is never reported as recurring rent, and a contingent overage is never presented as a certain liability.`,
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
