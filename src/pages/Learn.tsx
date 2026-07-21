import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, HelpCircle } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";

type HubCard = {
  to?: string;
  href?: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  available: boolean;
};

const CARDS: HubCard[] = [
  {
    to: "/learn/faq",
    eyebrow: "Frequently asked questions",
    title: "Questions, answered.",
    description:
      "How Hobson understands your property documents, how accuracy is tested, and how it stays in your control.",
    cta: "Read the FAQ",
    available: true,
  },
  {
    eyebrow: "Coming soon",
    title: "Glossary",
    description:
      "Plain-English definitions of the property, lease and compliance terms Hobson works with every day.",
    cta: "In preparation",
    available: false,
  },
  {
    eyebrow: "Coming soon",
    title: "Guides",
    description:
      "Short walkthroughs — rent reviews, break clauses, service charge — showing how Hobson helps you handle each one.",
    cta: "In preparation",
    available: false,
  },
];

const Learn = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Learn about Hobson AI — FAQ, guides and glossary</title>
        <meta
          name="description"
          content="Learn how Hobson works — start with the FAQ, and find guides and a glossary of property terms as they're published."
        />
        <link rel="canonical" href="https://hobson-21.lovable.app/learn" />
        <meta property="og:title" content="Learn about Hobson AI" />
        <meta property="og:url" content="https://hobson-21.lovable.app/learn" />
        <meta property="og:type" content="website" />
      </Helmet>
      <GlobalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border/60 bg-muted/30">
          <div className="mx-auto max-w-3xl px-6 pt-16 pb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Learn
            </p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground">
              Understand how Hobson thinks.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              A growing library of answers, guides and definitions — so you can
              see exactly how Hobson reads your documents, keeps its answers
              accurate, and stays in your control.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {CARDS.map((card) => {
              const inner = (
                <div
                  className={[
                    "h-full rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all",
                    card.available
                      ? "hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
                      : "opacity-70",
                  ].join(" ")}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    {card.eyebrow}
                  </p>
                  <h2 className="mt-3 font-serif text-2xl font-normal text-foreground">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                  <div
                    className={[
                      "mt-6 inline-flex items-center gap-2 text-sm font-medium",
                      card.available ? "text-primary" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {card.cta}
                    {card.available && <ArrowRight className="h-4 w-4" />}
                  </div>
                </div>
              );

              return card.available && card.to ? (
                <Link
                  key={card.title}
                  to={card.to}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
                >
                  {inner}
                </Link>
              ) : (
                <div key={card.title}>{inner}</div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl bg-foreground text-background p-8 sm:p-12 text-center shadow-lg">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-background/10 mb-4">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                Can't find what you're looking for?
              </h3>
              <p className="mt-3 text-background/70 max-w-xl mx-auto leading-relaxed">
                We'd be glad to walk you through it — and show you Hobson on
                your own documents.
              </p>
              <div className="mt-7">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
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

export default Learn;
