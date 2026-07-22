import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";
import owlMascot from "@/assets/owl-mascot.png";

const BRASS = "#B4914F";
const INK = "#2D2D2D";
const MUTED = "#6B6B6B";
const LAVENDER_BG = "#F3F0FF";
const LAVENDER_BORDER = "#E8E4F0";
const PAPER = "#FCFAF7";
const RULE = "#EDE7DA";

const META = ["Property owner", "Mixed-use", "A few properties"];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-12">
    <h2
      className="font-serif text-2xl sm:text-[1.75rem] font-normal tracking-tight mb-5"
      style={{ color: INK }}
    >
      {title}
    </h2>
    <div className="prose max-w-none text-[17px] leading-relaxed" style={{ color: "#3d3d3d" }}>
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

const CaseStudyMixedUseOwner = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>My tenant was disputing the service charge — a Hobson case study</title>
        <meta
          name="description"
          content="A hands-on owner of mixed-use properties, mid-dispute over a service charge, needed the precise figure and the clause to back it up. Here's how Hobson helps today."
        />
        <link
          rel="canonical"
          href="https://hobson-21.lovable.app/learn/case-studies/mixed-use-owner"
        />
        <meta
          property="og:title"
          content="My tenant was disputing the service charge — Hobson case study"
        />
        <meta
          property="og:url"
          content="https://hobson-21.lovable.app/learn/case-studies/mixed-use-owner"
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
              My tenant was disputing the service charge — and I had to be
              exactly right.
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
            A hands-on owner of a handful of mixed-use properties. They know
            their buildings — but the precise percentages and clauses live
            scattered across leases, deeds of variation and letters.
          </p>

          <Section title="The moment">
            {md(
              `A commercial tenant was challenging their service charge. To hold the line, the owner had to be *precise* — the right apportionment percentage and the exact clause it came from. And that percentage wasn't the one in the lease, because a later deed of variation had changed it.

So they were going back and forth between the two documents, cross-checking figure against wording, trying to be *sure enough* to quote it to the tenant and stand behind it. Nearly right is no good when someone is arguing with you.`
            )}
          </Section>

          <Section title="What Hobson does today">
            {md(
              `Hobson has read the whole document set — lease and deed of variation together — and resolves them to the current position. So the owner doesn't have to work the figure out and hope it's right: they ask, and get the service charge percentage *as varied*, the clause it rests on, and both documents cited — ready to put to the tenant and defend.

There's no cross-checking two documents to be sure the deed hasn't moved the figure; the answer already accounts for that. And it isn't only service charge — **current rent, key dates, repair responsibility, what a clause means** all come back the same way, with the evidence attached.`
            )}
          </Section>

          <Section title="Why it matters more now">
            {md(
              `The **Renters' Rights Act 2025** is reshaping the rules on the residential side of the portfolio as we speak, and the cost of misreading a right or missing a date has risen sharply. Being certain of your position — and *defensible* on it — has gone from useful to essential.`
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
              "When a tenant's disputing your service charge, you can't be
              'fairly sure'. Now I get the exact figure, the clause it sits in,
              and the deed that changed it — so I can quote it and stand behind
              it."
            </blockquote>
            <figcaption className="mt-4 text-sm" style={{ color: MUTED }}>
              — The owner (anonymised)
            </figcaption>
          </figure>

          <Section title="Where this is heading">
            {md(
              `Answering is the foundation, not the finish. What this owner most wants next is a co-worker that stays *ahead* of them — and that's the direction of travel. By using Phase 1 today, they're helping shape exactly how it behaves.`
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
              <h3
                className="mt-4 font-serif text-xl font-normal"
                style={{ color: INK }}
              >
                Knowing where you stand
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>
                Ask questions across all your documents and get straight, sourced
                answers — the current position, resolved through every variation.
              </p>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#F5F3EF", border: "1px dashed #D6D2C8" }}
            >
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{ backgroundColor: "#EFEFEF", color: "#8A8A8A", border: "1px dashed #C9C9C9" }}
              >
                Phase 2 · coming
              </span>
              <h3
                className="mt-4 font-serif text-xl font-normal"
                style={{ color: "#8A8A8A" }}
              >
                Staying ahead of it
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "#A5A5A5" }}>
                A co-worker that watches the deadlines and obligations across the
                portfolio and flags a review, renewal or notice before it falls
                due — so nothing slips as the rules keep changing.
              </p>
            </div>
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
                own a few properties, you sometimes have to be exactly right in
                front of a tenant or adviser, and the rules are shifting under
                you — Phase 1 gives you that certainty today, and it's the start
                of a co-worker built to keep you ahead.
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

export default CaseStudyMixedUseOwner;
