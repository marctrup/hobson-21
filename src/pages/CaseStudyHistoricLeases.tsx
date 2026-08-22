import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";
import owlMascot from "@/assets/owl-mascot.png";

const BRASS = "#B4914F";
const INK = "#2D2D2D";
const MUTED = "#6E6A62";
const LAVENDER_BG = "#F1EBDE";
const LAVENDER_BORDER = "#E8E1D4";
const PAPER = "#FCFAF7";
const RULE = "#F7EDDC";

const META = ["Large enterprise", "Central London", "Commercial & ground rents", "Major portfolio"];

/** Illustrative, not an approved customer quotation. Replace when signed off. */
const TESTIMONIAL = {
  quote:
    "The real test for us wasn't whether AI could read a modern lease. It was whether it could make sense of the documents our own specialists have spent years learning. That's where it becomes genuinely useful.",
  attribution: "— Portfolio team (anonymised)",
};

const EXAMPLE_QUESTIONS = [
  "What's the term?",
  "How is the rent actually calculated?",
  "What can the tenant do on redevelopment?",
  "Are there restrictions on underletting?",
  "Who is responsible for this repair?",
  "What earlier document does this right depend on?",
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-12">
    <h2
      className="font-serif text-2xl sm:text-[1.75rem] font-normal tracking-tight mb-5"
      style={{ color: INK }}
    >
      {title}
    </h2>
    <div className="prose max-w-none text-[17px] leading-relaxed" style={{ color: "#2D2D2D" }}>
      {children}
    </div>
  </section>
);

const md = (text: string) => (
  <ReactMarkdown
    components={{
      p: ({ node, ...props }) => <p className="my-4" {...props} />,
      strong: ({ node, ...props }) => <strong style={{ color: INK, fontWeight: 600 }} {...props} />,
      em: ({ node, ...props }) => <em className="italic" {...props} />,
    }}
  >
    {text}
  </ReactMarkdown>
);

const CaseStudyHistoricLeases = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>Historic Lease Case Study | Hobson</title>
        <meta
          name="description"
          content="Can AI understand a century of property documents? See how Hobson handles complex historic leases, deeds, schedules and changing property records."
        />
        <link
          rel="canonical"
          href="https://hobson-21.lovable.app/learn/case-studies/historic-leases"
        />
        <meta
          property="og:title"
          content="Documents written over 100 years ago — can Hobson really read them?"
        />
        <meta
          property="og:description"
          content="Can AI understand a century of property documents? See how Hobson handles complex historic leases, deeds, schedules and changing property records."
        />
        <meta
          property="og:url"
          content="https://hobson-21.lovable.app/learn/case-studies/historic-leases"
        />
        <meta property="og:type" content="article" />
      </Helmet>
      <GlobalHeader />

      <main className="flex-1">
        <article className="mx-auto max-w-[760px] px-6 pt-12 pb-24">
          <Link
            to="/learn/case-studies"
            className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: BRASS }}
          >
            <ArrowLeft className="h-4 w-4" />
            All case studies
          </Link>

          <header className="mt-10">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              Case study
            </p>
            <h1
              className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.15]"
              style={{ color: INK }}
            >
              Documents written over 100 years ago — can Hobson really read
              them?
            </h1>
            <div className="mt-6 flex flex-wrap gap-2">
              {META.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]"
                  style={{ backgroundColor: PAPER, color: MUTED, border: `1px solid ${RULE}` }}
                >
                  {m}
                </span>
              ))}
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{ backgroundColor: LAVENDER_BG, color: BRASS, border: `1px solid ${LAVENDER_BORDER}` }}
              >
                Phase 1 · live
              </span>
            </div>
            <div className="mx-auto mt-10 h-px w-24" style={{ backgroundColor: RULE }} />
          </header>

          <p
            className="mt-10 font-serif text-xl sm:text-2xl leading-relaxed"
            style={{ color: INK }}
          >
            A major property enterprise looks after a substantial Central London
            estate on behalf of one of the City's historic institutions. Some of
            the property relationships behind that estate stretch back
            generations — and some of the documents in the wider archive are
            more than a century old.
          </p>

          <div className="prose max-w-none text-[17px] leading-relaxed" style={{ color: INK }}>
            {md(
              `These are unusual owners. Their roots lie in the old City guilds: institutions formed around medieval trades and crafts which survived, evolved and became part of the fabric of the modern City. **The buildings changed. The tenants changed. The law changed. The paperwork accumulated.**

The property team looking after an estate like this is not inexperienced. Quite the opposite: it includes people who spend their working lives dealing with complicated commercial leases, ground rents and the history behind them.

So this was about as hard a test of Hobson as we could ask for.`
            )}
          </div>

          <Section title="The moment">
            {md(`The question was simple:`)}

            {/* Restrained "archive" inset — typographic, no invented documents */}
            <div
              className="my-6 rounded-xl px-6 py-5"
              style={{
                backgroundColor: LAVENDER_BG,
                border: `1px solid ${LAVENDER_BORDER}`,
                borderLeft: `3px solid ${BRASS}`,
              }}
            >
              <p className="font-serif italic text-xl leading-relaxed m-0" style={{ color: INK }}>
                Can Hobson really understand documents like these?
              </p>
            </div>

            {md(
              `Not a clean ten-page lease signed last year. The difficult end of the archive.

Old scans. Different typefaces. Dense drafting. Language lawyers stopped using decades ago. Handwritten amendments. Plans and schedules. Parties whose names and legal forms have changed. A right granted in one document but qualified somewhere else. A lease that refers back to an earlier lease, a historic deed and a separate development agreement before you have even reached the operative provisions.

And age is only part of the problem.

One of the leases in the portfolio runs for more than 150 years. Its rent is not simply a number printed on the first page. The document contains a premium, formula-driven rent provisions, overage and clawback arrangements, redevelopment rights and detailed provisions governing things as specific as tower cranes and ground anchors.

Another generation of leases uses traditional drafting such as *"NOW THIS DEED WITNESSETH"*, with repairing obligations that work on five- and seven-year cycles and detailed provisions about exactly how premises are to be handed back.

Then there are the documents behind the document: earlier leases, underleases, historic deeds, later agreements and plans — each capable of changing the answer.

**That is the real challenge.**

It isn't whether AI can recognise old words on a page. It is whether it can understand what kind of fact each word creates, what it relates to, whether something later changed it, and where the evidence for the answer actually sits.

For an experienced property team, *"nearly right"* would be immediately obvious — and no use at all.`
            )}
          </Section>

          <Section title="What Hobson does today">
            {md(
              `Hobson reads these documents as **property documents**, not simply as pages of text.

It can take a long historic lease and separate the things that matter: the parties, the term, the rent, the premium, review machinery, repairing obligations, rights, restrictions, redevelopment provisions, notices, assignments, underletting and the documents the lease itself depends upon.

**Crucially, it keeps those things distinct.**

A £22 million premium is not rent. Overage is not an amount automatically due. A 153½-year contractual term is not evidence that occupation actually lasted 153½ years. A reference to an earlier deed is not background decoration if that deed governs a right the current lease still relies upon.

And where an answer runs through several places, Hobson follows the chain.

So instead of somebody knowing that *"there's something about that in one of the schedules"*, they can ask:`
            )}

            <ul className="my-5 list-none pl-0 space-y-2">
              {EXAMPLE_QUESTIONS.map((q) => (
                <li
                  key={q}
                  className="font-serif italic text-[17px] leading-relaxed pl-4"
                  style={{ color: INK, borderLeft: `2px solid ${LAVENDER_BORDER}` }}
                >
                  {q}
                </li>
              ))}
            </ul>

            {md(
              `Hobson returns the answer with the wording and source behind it.

That matters enormously in an institutional portfolio. The people managing it already have expertise. Hobson is not there to replace that expertise; it is there to make a century of accumulated property knowledge immediately usable by the whole team, without every question having to find the one person who remembers where the answer lives.

And perhaps most importantly, age does not give a document permission to become vague.

If Hobson can establish the answer, it shows it.

If the document does not establish it, Hobson says that too.

**Old law. Old paper. Same standard of proof.**`
            )}
          </Section>

          {/* Pull quote */}
          <figure
            className="mt-14 pl-6 sm:pl-8 py-2"
            style={{ borderLeft: `3px solid ${BRASS}` }}
          >
            <blockquote
              className="font-serif italic text-xl sm:text-2xl leading-relaxed"
              style={{ color: INK }}
            >
              “{TESTIMONIAL.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm" style={{ color: MUTED }}>
              {TESTIMONIAL.attribution}
            </figcaption>
          </figure>

          <Section title="Where this is heading">
            {md(
              `Reading the archive is the foundation.

The bigger opportunity is what happens when generations of property history stop being an archive and become a working record.

For a portfolio like this, that means the knowledge held across leases, deeds, schedules and historic papers can ultimately help the team stay ahead of what comes next — rather than only being opened when somebody already knows there is a question to ask.`
            )}
          </Section>

          {/* Phase strip */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid ${LAVENDER_BORDER}`,
                boxShadow: "0 8px 20px -12px rgba(180,145,79,0.25)",
              }}
            >
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{ backgroundColor: LAVENDER_BG, color: BRASS, border: `1px solid ${LAVENDER_BORDER}` }}
              >
                Phase 1 · live now
              </span>
              <h3 className="mt-4 font-serif text-xl font-normal" style={{ color: INK }}>
                Making the archive usable
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>
                Ask questions across complex historic and modern property
                documents and get straight, sourced answers — without needing to
                know which lease, schedule or earlier deed contains them.
              </p>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#F7EDDC", border: "1px dashed #E6D2AE" }}
            >
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{ backgroundColor: "#F1EBDE", color: "#6E6A62", border: "1px dashed #D8CDB6" }}
              >
                Phase 2 · coming
              </span>
              <h3 className="mt-4 font-serif text-xl font-normal" style={{ color: "#6E6A62" }}>
                Staying ahead of the estate
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "#8A8478" }}>
                A co-worker that watches the dates, rights and obligations
                across the portfolio and brings the important ones forward — a
                review, consent, expiry, notice or other event — before the team
                has to go looking for it.
              </p>
            </div>
          </div>

          {/* Closing statement */}
          <div className="mt-20 text-center">
            <p className="text-[17px] leading-relaxed" style={{ color: MUTED }}>
              The ambition isn't to make a hundred years of property history
              disappear.
            </p>
            <p
              className="mt-4 font-serif text-2xl sm:text-3xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              <strong className="font-normal">It's to make it usable.</strong>
            </p>
            <div className="mx-auto mt-10 h-px w-24" style={{ backgroundColor: RULE }} />
          </div>

          {/* Closing dark panel */}
          <div className="mt-16">
            <div
              className="rounded-2xl p-10 sm:p-14 text-center"
              style={{
                backgroundColor: INK,
                color: PAPER,
                boxShadow: "0 20px 40px -20px rgba(45,45,45,0.35)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-full"
                style={{
                  backgroundColor: "rgba(180,145,79,0.15)",
                  border: "1px solid rgba(180,145,79,0.35)",
                }}
              >
                <img src={owlMascot} alt="" className="w-9 h-9" />
              </div>
              <p
                className="max-w-xl mx-auto leading-relaxed text-[17px]"
                style={{ color: "rgba(252,250,247,0.85)" }}
              >
                <strong style={{ color: PAPER }}>If this is you</strong> — you
                look after an estate whose history is spread across generations
                of leases, deeds and schedules, and the answers matter to the
                pound and the clause — Phase 1 makes that record usable by the
                whole team today.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 font-semibold"
                  style={{ backgroundColor: BRASS, color: INK }}
                >
                  <a href="mailto:info@hobsonschoice.ai?subject=Hobson%20enquiry">
                    Email us →
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default CaseStudyHistoricLeases;
