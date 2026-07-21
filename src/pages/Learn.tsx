import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  MessageCircleQuestion,
  TrendingUp,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import Footer from "@/components/Footer";
import owlMascot from "@/assets/owl-mascot.png";

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
      "Straight answers on how Hobson works, how its accuracy is tested, and how it stays in your control.",
    cta: "Read the FAQ",
    status: "Available now",
    available: true,
  },
  {
    icon: TrendingUp,
    title: "Case studies",
    description:
      "Real property teams on what changed when Hobson took on their documents — the time saved and the risks caught.",
    cta: "In preparation",
    status: "Coming soon",
    available: false,
  },
  {
    icon: PlayCircle,
    title: "Tutorials",
    description:
      "Short video walkthroughs showing Hobson in action — from uploading a lease to getting a cited answer.",
    cta: "In preparation",
    status: "Coming soon",
    available: false,
  },
];

const BRASS = "#B4914F";
const INK = "#2D2D2D";
const MUTED = "#6B6B6B";
const LAVENDER_BG = "#F3F0FF";
const LAVENDER_BORDER = "#E8E4F0";
const PAPER = "#FCFAF7";
const RULE = "#EDE7DA";

const Learn = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>Learn about Hobson AI — FAQ, case studies and tutorials</title>
        <meta
          name="description"
          content="Get to know Hobson — straight answers, real customer stories and short walkthroughs showing how it reads your property documents and helps you act on them."
        />
        <link rel="canonical" href="https://hobson-21.lovable.app/learn" />
        <meta property="og:title" content="Learn about Hobson AI" />
        <meta property="og:url" content="https://hobson-21.lovable.app/learn" />
        <meta property="og:type" content="website" />
      </Helmet>
      <GlobalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section>
          <div className="mx-auto max-w-3xl px-6 pt-20 pb-12 text-center">
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
              Learn
            </p>
            <h1
              className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              Get to know Hobson.
            </h1>
            <p
              className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: MUTED }}
            >
              Straight answers, real customer stories, and short walkthroughs —
              everything you need to see how Hobson reads your property
              documents and helps you act on them.
            </p>
            <div
              className="mx-auto mt-10 h-px w-24"
              style={{ backgroundColor: RULE }}
            />
          </div>
        </section>

        {/* Cards */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            {CARDS.map((card) => {
              const Icon = card.icon;

              const statusPill = card.available ? (
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
                    card.available
                      ? "bg-white shadow-sm hover:shadow-[0_12px_28px_-10px_rgba(180,145,79,0.28)] hover:-translate-y-0.5"
                      : "",
                  ].join(" ")}
                  style={
                    card.available
                      ? { border: `1px solid ${LAVENDER_BORDER}` }
                      : { backgroundColor: "#F5F3EF", border: "1px dashed #D6D2C8" }
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
                      style={
                        card.available
                          ? { backgroundColor: LAVENDER_BG, border: `1px solid ${LAVENDER_BORDER}` }
                          : { backgroundColor: "#ECEAE5", border: "1px dashed #D6D2C8" }
                      }
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: card.available ? BRASS : "#A5A5A5" }}
                      />
                    </div>
                    {statusPill}
                  </div>

                  <h2
                    className="mt-6 font-serif text-2xl font-normal tracking-tight"
                    style={{ color: card.available ? INK : "#8A8A8A" }}
                  >
                    {card.title}
                  </h2>
                  <p
                    className="mt-3 text-[15px] leading-relaxed"
                    style={{ color: card.available ? MUTED : "#A5A5A5" }}
                  >
                    {card.description}
                  </p>

                  <div className="flex-1" />

                  <div
                    className="mt-8 pt-5 flex items-center justify-between text-sm font-medium"
                    style={{ borderTop: `1px solid ${card.available ? RULE : "#E4E1DA"}` }}
                  >
                    <span style={{ color: card.available ? BRASS : "#A5A5A5" }}>
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

      <Footer />
    </div>
  );
};

export default Learn;
