import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowLeft, Building2, type LucideIcon } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import owlMascot from "@/assets/owl-mascot.png";

const BRASS = "#B4914F";
const INK = "#2D2D2D";
const MUTED = "#6B6B6B";
const LAVENDER_BG = "#F3F0FF";
const LAVENDER_BORDER = "#E8E4F0";
const PAPER = "#FCFAF7";
const RULE = "#EDE7DA";

type Card = {
  to?: string;
  status: string;
  live: boolean;
  categories: string[];
  headline: string;
  description: string;
  cta: string;
};

const CARDS: Card[] = [
  {
    to: "/learn/case-studies/mixed-use-owner",
    status: "Phase 1 · live",
    live: true,
    categories: ["Property owner", "Mixed-use"],
    headline: "You have to be exactly right — in front of a tenant.",
    description:
      "A hands-on owner of a few mixed-use properties, mid-dispute over a service charge, answering a tenant's challenges point by point — each one needing the right figure and the clause to back it up.",
    cta: "Read this story",
  },
  {
    status: "Coming soon",
    live: false,
    categories: ["Enterprise", "Commercial Leases"],
    headline: "Documents written over 100 years ago — can AI really read them?",
    description:
      "A large Central London enterprise with major commercial and ground-rent portfolios, and a big team across the business — where some leases are more than a century old. The hardest test there is.",
    cta: "Story in preparation",
  },
  {
    status: "Coming soon",
    live: false,
    categories: ["Residential", "Small team"],
    headline: "A very large portfolio. A team of two.",
    description:
      "A large private residential portfolio run by just two people — one on finance, one on management — carrying far more than any pair should have to hold in their heads.",
    cta: "Story in preparation",
  },
  {
    status: "Coming soon",
    live: false,
    categories: ["Property guardians", "High turnover"],
    headline: "The paperwork never sits still.",
    description:
      "A property-guardian business where licensees come and go constantly and document management is relentless — a portfolio that never stops moving.",
    cta: "Story in preparation",
  },

];

const CaseStudies = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>Case studies — Hobson AI</title>
        <meta
          name="description"
          content="Real partnerships underway. Pick the situation that sounds like yours — and see how Hobson is helping property owners today."
        />
        <link rel="canonical" href="https://hobson-21.lovable.app/learn/case-studies" />
        <meta property="og:title" content="Hobson case studies" />
        <meta property="og:url" content="https://hobson-21.lovable.app/learn/case-studies" />
        <meta property="og:type" content="website" />
      </Helmet>
      <GlobalHeader />

      <main className="flex-1">
        <section>
          <div className="mx-auto max-w-3xl px-6 pt-12 pb-4">
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: BRASS }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Learn
            </Link>
          </div>
          <div className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 mb-7 rounded-full"
              style={{ backgroundColor: LAVENDER_BG, border: `1px solid ${LAVENDER_BORDER}` }}
            >
              <img src={owlMascot} alt="" className="w-10 h-10" />
            </div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              Case studies
            </p>
            <h1
              className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              Find the one that sounds like you.
            </h1>
            <p
              className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: MUTED }}
            >
              These aren't finished success stories — they're real partnerships
              underway. <strong style={{ color: INK }}>Phase 1</strong>, where
              Hobson answers questions across your documents, is live today;{" "}
              <strong style={{ color: INK }}>Phase 2</strong>, where it starts
              doing the work, is coming. Pick the situation that feels like
              yours.
            </p>
            <div className="mx-auto mt-10 h-px w-24" style={{ backgroundColor: RULE }} />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-2">
            {CARDS.map((card, i) => {
              const statusPill = card.live ? (
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ backgroundColor: LAVENDER_BG, color: BRASS, border: `1px solid ${LAVENDER_BORDER}` }}
                >
                  {card.status}
                </span>
              ) : (
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ backgroundColor: "#EFEFEF", color: "#8A8A8A", border: "1px dashed #C9C9C9" }}
                >
                  {card.status}
                </span>
              );

              const inner = (
                <div
                  className={[
                    "group h-full rounded-[20px] p-7 sm:p-8 transition-all duration-300 flex flex-col",
                    card.live
                      ? "bg-white shadow-sm hover:shadow-[0_12px_28px_-10px_rgba(180,145,79,0.28)] hover:-translate-y-0.5"
                      : "",
                  ].join(" ")}
                  style={
                    card.live
                      ? { border: `1px solid ${LAVENDER_BORDER}` }
                      : { backgroundColor: "#F5F3EF", border: "1px dashed #D6D2C8" }
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {card.categories.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]"
                          style={
                            card.live
                              ? { backgroundColor: PAPER, color: MUTED, border: `1px solid ${RULE}` }
                              : { backgroundColor: "#ECEAE5", color: "#8A8A8A", border: "1px dashed #D6D2C8" }
                          }
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    {statusPill}
                  </div>

                  <h2
                    className="mt-6 font-serif text-2xl font-normal tracking-tight"
                    style={{ color: card.live ? INK : "#8A8A8A" }}
                  >
                    {card.headline}
                  </h2>
                  <p
                    className="mt-3 text-[15px] leading-relaxed"
                    style={{ color: card.live ? MUTED : "#A5A5A5" }}
                  >
                    {card.description}
                  </p>

                  <div className="flex-1" />

                  <div
                    className="mt-8 pt-5 flex items-center justify-between text-sm font-medium"
                    style={{ borderTop: `1px solid ${card.live ? RULE : "#E4E1DA"}` }}
                  >
                    <span style={{ color: card.live ? BRASS : "#A5A5A5" }}>{card.cta}</span>
                    {card.live && (
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: BRASS }}
                      />
                    )}
                  </div>
                </div>
              );

              return card.live && card.to ? (
                <Link
                  key={i}
                  to={card.to}
                  aria-label={card.headline}
                  className="block rounded-[20px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ ["--tw-ring-color" as any]: BRASS }}
                >
                  {inner}
                </Link>
              ) : (
                <div key={i} aria-disabled="true" className="block rounded-[20px]">
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CaseStudies;
