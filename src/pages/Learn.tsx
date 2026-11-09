import { propertyGuides } from "@/content/propertyGuides";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  MessageCircleQuestion,
  TrendingUp,
  BookOpen,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { AnswerFirst } from "@/components/AnswerFirst";


type HubCard = {
  to?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  status: string;
  available: boolean;
};

const CARDS: HubCard[] = [
  {
    to: "/learn/faq",
    icon: MessageCircleQuestion,
    title: "Frequently asked questions",
    description:
      "Straight answers on how Hobson works, how his accuracy is tested, and how he stays in your control.",
    cta: "Read the FAQ",
    status: "Available now",
    available: true,
  },
  {
    to: "/learn/case-studies",
    icon: TrendingUp,
    title: "Case studies",
    description:
      "Examples of how Hobson is being used in real work.",
    cta: "Read the stories",
    status: "Available now",
    available: true,
  },
  {
    to: "/learn/glossary",
    icon: BookOpen,
    title: "Glossary",
    description:
      "Plain-English definitions of the property, document and Hobson terms you will meet as we work together.",
    cta: "Read the glossary",
    status: "Available now",
    available: true,
  },
  {
    to: "/learn/tutorials",
    icon: PlayCircle,
    title: "A few useful tips",
    description:
      "Small things worth knowing when you work with Hobson.",
    cta: "Explore the tips",
    status: "",
    available: true,
  },
  ...propertyGuides.map(guide => ({ to: `/learn/${guide.slug}`, icon: BookOpen, title: guide.title, description: guide.description, cta: "Read the guide", status: "", available: true })),
];

const BRASS = "var(--brass)";
const INK = "var(--ink)";
const MUTED = "var(--ink-muted)";
const LAVENDER_BG = "var(--bone-wash)";
const LAVENDER_BORDER = "var(--bone)";
const PAPER = "var(--paper)";
const RULE = "var(--bone-wash)";

const Learn = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>Learn about Hobson AI — FAQ, case studies and short demonstrations</title>
        <meta
          name="description"
          content="Get to know Hobson — straight answers, real customer stories and short walkthroughs showing how I read your property documents and help you act on them."
        />
        <link rel="canonical" href="https://hobsonschoice.ai/learn" />
        <meta property="og:title" content="Learn about Hobson AI" />
        <meta property="og:url" content="https://hobsonschoice.ai/learn" />
        <meta property="og:type" content="website" />
      </Helmet>
      <GlobalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section
          style={{
            backgroundColor: "var(--bone-wash)",
            borderBottom: `1px solid hsl(var(--highlight-colour) / 0.2)`,
          }}
        >
          <div className="mx-auto max-w-3xl px-6 pt-20 pb-12 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              Learn
            </p>
            <h1
              className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              Let me <span style={{ color: BRASS }}>introduce myself</span>.
            </h1>
            <p
              className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: MUTED }}
            >
              Straight answers, real customer stories, and short walkthroughs —
              everything you need to see how I read your property documents
              and help you act on them.
            </p>
            <AnswerFirst>
              Learn is where I keep my notes: straight answers to common
              questions, plain-English definitions of property and document
              terms, real customer case studies and step-by-step guides — all
              showing how I read property documents and help owners and
              managers act on them.
            </AnswerFirst>
            <div
              className="mx-auto mt-10 h-px w-24"
              style={{ backgroundColor: RULE }}
            />
          </div>
        </section>

        {/* Cards */}
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-20">

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((card) => {
              const Icon = card.icon;

              const statusPill = card.available ? null : (
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ backgroundColor: "var(--bone-wash)", color: "var(--ink-muted)", border: "1px dashed var(--bone-strong)" }}
                >
                  {card.status}
                </span>
              );


              const inner = (
                <div
                  className={[
                    "group h-full rounded-[20px] p-7 sm:p-8 transition-all duration-300 flex flex-col",
                    card.available
                      ? "bg-white shadow-sm hover:shadow-[0_12px_28px_-10px_hsl(var(--highlight-colour)_/_0.28)] hover:-translate-y-0.5"
                      : "",
                  ].join(" ")}
                  style={
                    card.available
                      ? { border: `1px solid ${LAVENDER_BORDER}` }
                      : { backgroundColor: "var(--bone-wash)", border: "1px dashed var(--bone)" }
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
                      style={
                        card.available
                          ? { backgroundColor: LAVENDER_BG, border: `1px solid ${LAVENDER_BORDER}` }
                          : { backgroundColor: "var(--bone-wash)", border: "1px dashed var(--bone)" }
                      }
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: card.available ? BRASS : "var(--ink-faint)" }}
                      />
                    </div>
                    {statusPill}
                  </div>

                  <h2
                    className="mt-6 font-serif text-2xl font-normal tracking-tight"
                    style={{ color: card.available ? INK : "var(--ink-muted)" }}
                  >
                    {card.title}
                  </h2>
                  <p
                    className="mt-3 text-[15px] leading-relaxed"
                    style={{ color: card.available ? MUTED : "var(--ink-faint)" }}
                  >
                    {card.description}
                  </p>

                  <div className="flex-1" />

                  <div
                    className="mt-8 pt-5 flex items-center justify-between text-sm font-medium"
                    style={{ borderTop: `1px solid ${card.available ? RULE : "var(--bone)"}` }}
                  >
                    <span style={{ color: card.available ? BRASS : "var(--ink-faint)" }}>
                      {card.cta}
                    </span>
                    {card.available && (
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: BRASS }}
                      />
                    )}
                  </div>
                </div>
              );

              return card.available && card.to ? (
                <Link
                  key={card.title}
                  to={card.to}
                  aria-label={card.title}
                  className="block rounded-[20px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ ["--tw-ring-color" as any]: BRASS }}
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={card.title}
                  aria-disabled="true"
                  className="block rounded-[20px]"
                >
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

export default Learn;
