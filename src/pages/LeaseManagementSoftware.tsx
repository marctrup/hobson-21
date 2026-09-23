import { PropertyTopicLinks } from "@/components/PropertyTopicLinks";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getSolutionPageStructuredData } from "@/utils/seo-data";
import { ArrowRight, CheckCircle, FileText, Search, Shield, Users } from "lucide-react";
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
    icon: FileText,
    title: "Reads the lease, not just the metadata",
    description:
      "Hobson extracts parties, term, rent, review dates, break options, repairing obligations, restrictions and the documents each right depends on.",
  },
  {
    icon: Search,
    title: "Answers with evidence",
    description:
      "Every answer points to the exact passage in the source document. No black-box confidence scores — just the clause, the page and the context.",
  },
  {
    icon: Shield,
    title: "Tracks changes across the chain",
    description:
      "A lease may depend on an earlier lease, a deed of variation, a licence or a development agreement. Hobson keeps those relationships intact.",
  },
  {
    icon: Users,
    title: "Built for property teams",
    description:
      "Ask questions in plain English. Get answers your surveyors, asset managers and lawyers can rely on without re-reading the file.",
  },
];

const DIFFERENCES = [
  "No manual data entry for every field",
  "No copying between spreadsheets and document stores",
  "No guessing which version of a clause is current",
  "No need to re-read a file every time a question arises",
];

const FAQS = [
  {
    question: "What is lease management software?",
    answer:
      "Lease management software keeps the commercial terms of your leases — rent, term, review dates, break options and obligations — in one place so a team can act on them without re-reading the documents. Hobson AI goes further: it reads the leases themselves, extracts the terms, and shows the exact extract that supports each fact.",
  },
  {
    question: "How does Hobson AI differ from a general AI chatbot?",
    answer:
      "Hobson answers only from your own documents and cites the passage it used, so nothing is invented. A general chatbot has no access to your leases and cannot show where an answer came from.",
  },
  {
    question: "Can it handle leases with deeds of variation and licences?",
    answer:
      "Yes. Hobson keeps the relationships between documents intact, so a right granted in an earlier lease and altered by a later deed is read as one chain rather than two unrelated files.",
  },
  {
    question: "Who is it for?",
    answer:
      "Landlords, asset managers, property managers, surveyors and investors who hold commercial or mixed-use property and need reliable answers from lease documents.",
  },
  {
    question: "How much does lease management software from Hobson AI cost?",
    answer:
      "You pay once for Hobson to read your documents, then add team seats as you need them. Full tier details are on the pricing page.",
  },
];

const LeaseManagementSoftware = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>Lease Management Software — Hobson AI</title>
        <meta
          name="description"
          content="Lease management software that reads your documents, extracts the facts that matter and answers your team with evidence from the source."
        />
        <link rel="canonical" href="https://hobsonschoice.ai/lease-management-software" />
        <meta property="og:title" content="Lease Management Software — Hobson AI" />
        <meta
          property="og:description"
          content="Lease management software that reads your documents, extracts the facts that matter and answers your team with evidence from the source."
        />
        <meta property="og:url" content="https://hobsonschoice.ai/lease-management-software" />
        <meta property="og:type" content="website" />
              <script type="application/ld+json">
          {JSON.stringify(getSolutionPageStructuredData({ name: "Lease Management Software", path: "/lease-management-software", description: "Lease management software that reads your documents, extracts the facts that matter and answers your team with evidence from the source." }))}
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
              Lease management software that knows what your documents actually say.
            </h1>
            <p
              className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: MUTED }}
            >
              Most lease management tools store summaries. Hobson reads the leases, deeds,
              licences and schedules — then answers questions with the exact extract that
              supports each fact.
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
              What lease management software should deliver
            </p>
            <h2
              className="mt-4 font-serif text-3xl sm:text-4xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              A single place for the facts that run your portfolio.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed" style={{ color: MUTED }}>
              Leases are not static records. They contain dates that trigger obligations,
              clauses that interact with later documents, and rights that depend on things
              agreed decades ago. Good lease management software turns that complexity
              into answers your team can act on.
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
                  Document-grounded, not document-stored.
                </h2>
                <p className="mt-5 text-[17px] leading-relaxed" style={{ color: MUTED }}>
                  Traditional lease management software asks you to summarise what matters.
                  Hobson reads the source, structures what it finds, and shows you the
                  evidence behind every answer.
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
              From file-search to portfolio insight.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "What is the rent review date for this unit?",
              "Who holds the break option and when can it be exercised?",
              "Which leases restrict underletting?",
              "What repairing obligation applies to this part of the building?",
              "Does this right depend on an earlier document?",
              "What changed between the original lease and the latest deed?",
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
                <Link to="/contact">Request a conversation</Link>
              </Button>
            </div>
          </div>
        </section>
        <PropertyTopicLinks />
      </main>
    </div>
  );
};

export default LeaseManagementSoftware;
