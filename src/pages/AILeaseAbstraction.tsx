import { PropertyTopicLinks } from "@/components/PropertyTopicLinks";
import { SolutionFAQ } from "@/components/SolutionFAQ";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getSolutionPageStructuredData } from "@/utils/seo-data";
import { ArrowRight, CheckCircle, FileSearch, Layers, Quote, ShieldCheck } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";

const BRASS = "#B4914F";
const INK = "#2D2D2D";
const MUTED = "#6E6A62";
const LAVENDER_BG = "#F1EBDE";
const LAVENDER_BORDER = "#E8E1D4";
const PAPER = "#FCFAF7";
const RULE = "#F7EDDC";

const CAPABILITIES = [
  {
    icon: FileSearch,
    title: "Reads the whole document",
    description:
      "Parties, term, rent, review dates, break options, repairing obligations and restrictions — extracted from the lease itself, not a summary someone typed in.",
  },
  {
    icon: Quote,
    title: "Every fact has an exact extract",
    description:
      "Each extracted value points to the precise passage, page and clause it came from, so your team can verify it in seconds.",
  },
  {
    icon: Layers,
    title: "Structured property knowledge",
    description:
      "Extractions follow a defined schema, so the same questions get the same shape of answer across every lease in the portfolio.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence you can act on",
    description:
      "Answers arrive as evidence packs your surveyors, asset managers and lawyers can rely on without re-reading the file.",
  },
];

const DIFFERENCES = [
  "No paralegal re-keying of every lease",
  "No spreadsheets of unverifiable summaries",
  "No ambiguity about where a value came from",
  "No repeat abstraction when a new question arises",
];

const FAQS = [
  {
    question: "What is AI lease abstraction?",
    answer:
      "AI lease abstraction is the automated extraction of key commercial terms from a lease \u2014 parties, term, rent, review dates, break options, repairing obligations and restrictions \u2014 into structured data. Hobson AI does this and shows the exact extract behind every term.",
  },
  {
    question: "How accurate is AI lease abstraction?",
    answer:
      "Accuracy matters less than verifiability. Hobson shows the passage, the document and the page behind each extracted fact, so your team can confirm anything that carries risk in seconds rather than trusting a score.",
  },
  {
    question: "How long does it take to abstract a lease?",
    answer:
      "Minutes rather than the hours a manual abstract takes, and Hobson handles a batch of documents at once.",
  },
  {
    question: "Can it read scanned or historic leases?",
    answer:
      "Yes. Scanned documents and older leases are read, and where a right depends on an earlier document Hobson keeps that chain intact.",
  },
  {
    question: "What does lease abstraction cost with Hobson AI?",
    answer:
      "You pay once for the documents Hobson reads, then add seats for your team. Tier details are on the pricing page.",
  },
];

const AILeaseAbstraction = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>AI Lease Abstraction — Hobson AI</title>
        <meta
          name="description"
          content="AI lease abstraction that reads your leases, extracts the terms that matter and shows the exact extract behind every fact."
        />
        <link rel="canonical" href="https://hobsonschoice.ai/ai-lease-abstraction" />
        <meta property="og:title" content="AI Lease Abstraction — Hobson AI" />
        <meta
          property="og:description"
          content="AI lease abstraction that reads your leases, extracts the terms that matter and shows the exact extract behind every fact."
        />
        <meta property="og:url" content="https://hobsonschoice.ai/ai-lease-abstraction" />
        <meta property="og:type" content="website" />
              <script type="application/ld+json">
          {JSON.stringify(getSolutionPageStructuredData({ name: "AI Lease Abstraction", path: "/ai-lease-abstraction", description: "AI lease abstraction that reads your leases, extracts the terms that matter and shows the exact extract behind every fact.", faqs: FAQS }))}
        </script>
        </Helmet>

      <GlobalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section
          style={{
            backgroundColor: LAVENDER_BG,
            borderBottom: `1px solid rgba(180,145,79,0.2)`,
          }}
        >
          <div className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              AI Software for property teams
            </p>
            <h1
              className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.1]"
              style={{ color: INK }}
            >
              AI lease abstraction with the evidence left in.
            </h1>
            <p
              className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: MUTED }}
            >
              Hobson reads your leases, deeds, licences and schedules — then extracts the
              terms that matter with the exact passage that supports each one. Abstraction
              you can verify, not just trust.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-semibold"
                style={{ backgroundColor: INK, color: PAPER }}
              >
                <Link to="/pricing">
                  See pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-semibold"
                style={{ borderColor: BRASS, color: INK }}
              >
                <a href="mailto:info@hobsonschoice.ai">Talk to us</a>
              </Button>
            </div>
            <div
              className="mx-auto mt-12 h-px w-24"
              style={{ backgroundColor: RULE }}
            />
          </div>
        </section>

        {/* What AI lease abstraction should deliver */}
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              What AI lease abstraction should deliver
            </p>
            <h2
              className="mt-4 font-serif text-3xl sm:text-4xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              Structured facts, with the source attached.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed" style={{ color: MUTED }}>
              A lease abstraction is only as useful as its evidence. Dates, rents and
              obligations that cannot be traced back to the clause are guesses dressed
              as data. Hobson extracts against a defined schema and keeps the source
              passage attached to every value.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="rounded-[20px] p-7 bg-white shadow-sm transition-all duration-300 hover:shadow-[0_12px_28px_-10px_rgba(180,145,79,0.28)] hover:-translate-y-0.5"
                  style={{ border: `1px solid ${LAVENDER_BORDER}` }}
                >
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: LAVENDER_BG, border: `1px solid ${LAVENDER_BORDER}` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: BRASS }} />
                  </div>
                  <h3
                    className="mt-6 font-serif text-xl font-normal tracking-tight"
                    style={{ color: INK }}
                  >
                    {cap.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: MUTED }}>
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hobson difference */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div
            className="rounded-2xl p-8 sm:p-12 lg:p-16"
            style={{ backgroundColor: "#FFFFFF", border: `1px solid ${LAVENDER_BORDER}` }}
          >
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.24em]"
                  style={{ color: BRASS }}
                >
                  The Hobson difference
                </p>
                <h2
                  className="mt-4 font-serif text-3xl sm:text-4xl font-normal tracking-tight"
                  style={{ color: INK }}
                >
                  Abstract once. Answer forever.
                </h2>
                <p className="mt-5 text-[17px] leading-relaxed" style={{ color: MUTED }}>
                  Traditional abstraction ends in a spreadsheet. Hobson turns the
                  extraction into structured property knowledge your team can keep
                  asking questions of — with the evidence still attached.
                </p>
                <ul className="mt-8 space-y-4">
                  {DIFFERENCES.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRASS }} />
                      <span className="text-[15px] leading-relaxed" style={{ color: INK }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-xl p-8"
                style={{ backgroundColor: LAVENDER_BG, border: `1px solid ${LAVENDER_BORDER}` }}
              >
                <p
                  className="font-serif text-xl sm:text-2xl leading-relaxed"
                  style={{ color: INK }}
                >
                  &ldquo;An abstracted date you cannot trace back to the clause is a
                  liability, not an asset.&rdquo;
                </p>
                <p className="mt-6 text-[15px]" style={{ color: MUTED }}>
                  That is why every Hobson extraction carries its exact extract.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What gets extracted */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              What Hobson extracts
            </p>
            <h2
              className="mt-4 font-serif text-3xl sm:text-4xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              The terms your decisions depend on.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Parties, term dates and demise",
              "Rent, review dates and review basis",
              "Break options, notice periods and conditions",
              "Repairing obligations and service charge",
              "Alienation, underletting and use restrictions",
              "Rights that depend on earlier deeds and licences",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl p-6"
                style={{ backgroundColor: "#FFFFFF", border: `1px solid ${LAVENDER_BORDER}` }}
              >
                <p className="font-serif text-lg leading-relaxed" style={{ color: INK }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence pack */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div
            className="rounded-2xl p-8 sm:p-12 text-center"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              Evidence pack
            </p>
            <h2
              className="mt-4 font-serif text-3xl sm:text-4xl font-normal tracking-tight"
              style={{ color: PAPER }}
            >
              See the clause behind every value.
            </h2>
            <p
              className="mt-5 mx-auto max-w-2xl text-[17px] leading-relaxed"
              style={{ color: "rgba(252,250,247,0.85)" }}
            >
              Every extraction arrives with the exact passage, the document it came
              from, and how that document relates to the rest of the chain. Your team
              can verify, explain and act on it.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-semibold"
                style={{ backgroundColor: BRASS, color: INK }}
              >
                <Link to="/learn/case-studies">
                  Read the case studies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <div
            className="rounded-2xl p-8 sm:p-12"
            style={{ backgroundColor: "#FFFFFF", border: `1px solid ${LAVENDER_BORDER}` }}
          >
            <h2
              className="font-serif text-3xl sm:text-4xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              Start with a document read. Scale by seats.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed" style={{ color: MUTED }}>
              Pay once for Hobson to read your documents. Then add team seats when you
              are ready to put the answers to work across your portfolio.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-semibold"
                style={{ backgroundColor: INK, color: PAPER }}
              >
                <Link to="/pricing">
                  Explore pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-semibold"
                style={{ borderColor: BRASS, color: INK }}
              >
                <a href="mailto:info@hobsonschoice.ai">Request a conversation</a>
              </Button>
            </div>
          </div>
        </section>
        <SolutionFAQ items={FAQS} />
        <PropertyTopicLinks />
      </main>
    </div>
  );
};

export default AILeaseAbstraction;
