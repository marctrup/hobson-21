import { PropertyTopicLinks } from "@/components/PropertyTopicLinks";
import { SolutionFAQ } from "@/components/SolutionFAQ";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getSolutionPageStructuredData } from "@/utils/seo-data";
import { ArrowRight, CheckCircle, Building2, Search, Shield, Users } from "lucide-react";
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
    icon: Building2,
    title: "Understands your whole portfolio",
    description:
      "Portfolios, unit groups and units — structured the way property teams actually work, with every document tied to the place it belongs.",
  },
  {
    icon: Search,
    title: "Answers with evidence",
    description:
      "Every answer points to the exact passage in the source document. No black-box confidence scores — just the clause, the page and the context.",
  },
  {
    icon: Shield,
    title: "Tracks obligations, not just dates",
    description:
      "Rent reviews, break options, repairing obligations and restrictions — extracted from the documents that create them, not keyed in by hand.",
  },
  {
    icon: Users,
    title: "Built for property teams",
    description:
      "Ask questions in plain English. Get answers your surveyors, asset managers and lawyers can rely on without re-reading the file.",
  },
];

const DIFFERENCES = [
  "No re-keying lease data into spreadsheets",
  "No chasing answers across shared drives and inboxes",
  "No guessing which version of a clause is current",
  "No starting from a blank page at every review or disposal",
];

const FAQS = [
  {
    question: "What is AI property management software?",
    answer:
      "AI property management software reads the documents behind a portfolio \u2014 leases, deeds, licences, schedules and correspondence \u2014 and answers questions about them in plain English. Hobson AI does this from your own files and cites the exact passage behind every answer.",
  },
  {
    question: "How is Hobson AI different from traditional property management systems?",
    answer:
      "Traditional systems store the summary someone typed in. Hobson reads the source document, structures what it finds, and shows the evidence, so the facts stay tied to the paperwork rather than to manual data entry.",
  },
  {
    question: "Does it replace my property manager?",
    answer:
      "No. Hobson prepares the information \u2014 the decision stays with your team. It removes the file-reading, not the judgement.",
  },
  {
    question: "What documents can Hobson read?",
    answer:
      "Leases, deeds of variation, licences, rent review memoranda, management agreements and related property paperwork, including scanned and historic documents.",
  },
  {
    question: "How much does it cost?",
    answer:
      "You pay once for Hobson to read your documents, then add seats for the people who need answers. Tier details are on the pricing page.",
  },
];

const PropertyManagementSoftware = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>Property Management Software — Hobson AI</title>
        <meta
          name="description"
          content="AI property management software that reads your documents, structures what it finds and answers your team with evidence from the source."
        />
        <link rel="canonical" href="https://hobsonschoice.ai/property-management-software" />
        <meta property="og:title" content="Property Management Software — Hobson AI" />
        <meta
          property="og:description"
          content="AI property management software that reads your documents, structures what it finds and answers your team with evidence from the source."
        />
        <meta property="og:url" content="https://hobsonschoice.ai/property-management-software" />
        <meta property="og:type" content="website" />
              <script type="application/ld+json">
          {JSON.stringify(getSolutionPageStructuredData({ name: "Property Management Software", path: "/property-management-software", description: "AI property management software that reads your documents, structures what it finds and answers your team with evidence from the source.", faqs: FAQS }))}
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
              Property management software that reads what your portfolio is built on.
            </h1>
            <p
              className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: MUTED }}
            >
              Most property management tools track tasks and tenancies. Hobson reads the
              leases, deeds, licences and schedules behind them — then answers questions
              with the exact extract that supports each fact.
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

        {/* What it should do */}
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              What property management software should deliver
            </p>
            <h2
              className="mt-4 font-serif text-3xl sm:text-4xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              One place for the knowledge that runs your buildings.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed" style={{ color: MUTED }}>
              A portfolio is not a list of addresses. It is a web of leases, rights,
              obligations and decisions made over decades. Good property management
              software turns that web into answers your team can act on — at review,
              at disposal, and every day in between.
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
                  Business memory, not another task list.
                </h2>
                <p className="mt-5 text-[17px] leading-relaxed" style={{ color: MUTED }}>
                  Traditional property management software asks you to record what matters.
                  Hobson reads the source, structures what it finds, and shows you the
                  evidence behind every answer — so the knowledge stays in the business,
                  not in someone's head.
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
                  &ldquo;When the answer matters to the pound and the clause, you need to
                  know <em>why</em> the software thinks what it thinks.&rdquo;
                </p>
                <p className="mt-6 text-[15px]" style={{ color: MUTED }}>
                  That is the principle behind every answer Hobson gives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              Common questions Hobson answers
            </p>
            <h2
              className="mt-4 font-serif text-3xl sm:text-4xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              From day-to-day queries to portfolio decisions.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Which units have rent reviews in the next twelve months?",
              "Who is responsible for repairs to this part of the building?",
              "Which leases restrict change of use or underletting?",
              "What did we agree in the deed of variation, and where?",
              "What is the current position across this unit group?",
              "Which documents does this disposal depend on?",
            ].map((question) => (
              <div
                key={question}
                className="rounded-xl p-6"
                style={{ backgroundColor: "#FFFFFF", border: `1px solid ${LAVENDER_BORDER}` }}
              >
                <p className="font-serif text-lg leading-relaxed" style={{ color: INK }}>
                  &ldquo;{question}&rdquo;
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
              See the source behind every answer.
            </h2>
            <p
              className="mt-5 mx-auto max-w-2xl text-[17px] leading-relaxed"
              style={{ color: "rgba(252,250,247,0.85)" }}
            >
              Hobson does not just tell you the answer. It shows the exact extract, the
              document it came from, and how that document relates to the rest of the
              chain. Your team can verify, explain and act on it.
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
              Pay once for Hobson to read your documents. Then add team seats when you are
              ready to put the answers to work across your portfolio.
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

export default PropertyManagementSoftware;
