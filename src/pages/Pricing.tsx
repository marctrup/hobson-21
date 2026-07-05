import React from "react";
import { Helmet } from "react-helmet-async";

import { Check, CalendarClock, ShieldCheck, KeyRound, DoorOpen, Banknote, ClipboardList, Wrench, Sparkles } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import owlMascot from "@/assets/owl-mascot.png";

import professorAsset from "@/assets/prototype/character-professor.png.asset.json";
import architectAsset from "@/assets/prototype/character-architect.png.asset.json";
import inspectorAsset from "@/assets/prototype/character-inspector.png.asset.json";
import brokerAsset from "@/assets/prototype/character-broker.png.asset.json";
import researcherAsset from "@/assets/prototype/character-researcher.png.asset.json";
import bookkeeperAsset from "@/assets/prototype/character-bookkeeper.png.asset.json";
import communicatorAsset from "@/assets/prototype/character-communicator.png.asset.json";
import keeperAsset from "@/assets/prototype/character-keeper.png.asset.json";

const professorImg = professorAsset.url;
const architectImg = architectAsset.url;
const inspectorImg = inspectorAsset.url;
const brokerImg = brokerAsset.url;
const researcherImg = researcherAsset.url;
const bookkeeperImg = bookkeeperAsset.url;
const communicatorImg = communicatorAsset.url;
const keeperImg = keeperAsset.url;

type CharacterPortrait = {
  img: string;
  alt: string;
};

type Plan = {
  name: string;
  price: string;
  priceSuffix?: string;
  responsibilities: string;
  tagline: string;
  description: string;
  includes: string[];
  cta: string;
  ctaHref: string;
  characters: CharacterPortrait[];
};

const FOUNDATION_CHARACTERS: CharacterPortrait[] = [
  { img: professorImg, alt: "The Professor" },
];

const FULL_TEAM_CHARACTERS: CharacterPortrait[] = [
  { img: professorImg, alt: "The Professor" },
  { img: architectImg, alt: "The Architect" },
  { img: inspectorImg, alt: "The Inspector" },
  { img: brokerImg, alt: "The Broker" },
  { img: researcherImg, alt: "The Researcher" },
  { img: bookkeeperImg, alt: "The Bookkeeper" },
  { img: communicatorImg, alt: "The Communicator" },
  { img: keeperImg, alt: "The Keeper" },
];

const plans: Plan[] = [
  {
    name: "Foundation",
    price: "£17.50",
    priceSuffix: "/month",
    responsibilities: "Ask me anything",
    tagline: "Get to know me.",
    description:
      "Perfect for asking questions about your portfolio and receiving clear, evidence-backed answers.",
    includes: [
      "Hobson AI",
      "The Professor only",
      "Portfolio understanding",
      "Evidence-backed answers",
      "Fair usage",
    ],
    cta: "Choose Foundation",
    ctaHref: "https://app.hobsonschoice.ai/signup",
    characters: FOUNDATION_CHARACTERS,
  },
  {
    name: "Starter",
    price: "£39",
    priceSuffix: "/month",
    responsibilities: "I'll look after 3 areas of your property work",
    tagline: "I'll start looking after your work.",
    description:
      "Everything in Foundation, plus I'll look after 3 areas of your property work.",
    includes: [
      "Everything in Foundation",
      "All Specialist agents",
      "Choose 3 areas of your property work",
      "Continuous monitoring",
      "Proactive updates",
    ],
    cta: "Choose Starter",
    ctaHref: "https://app.hobsonschoice.ai/signup",
    characters: FULL_TEAM_CHARACTERS,
  },
  {
    name: "Professional",
    price: "£99",
    priceSuffix: "/month",
    responsibilities: "I'll look after 6 areas of your property work",
    tagline: "I'll become part of your team.",
    description:
      "Everything in Starter, plus I'll look after even more of your property work.",
    includes: [
      "Everything in Starter",
      "Choose 6 areas of your property work",
      "Day-to-day oversight",
      "Priority handling",
    ],
    cta: "Choose Professional",
    ctaHref: "https://app.hobsonschoice.ai/signup",
    characters: FULL_TEAM_CHARACTERS,
  },
  {
    name: "Business",
    price: "£199",
    priceSuffix: "/month",
    responsibilities: "I'll look after 9 areas of your property work",
    tagline: "I'll look after even more.",
    description:
      "Everything in Professional, giving me even more of your property work to quietly look after.",
    includes: [
      "Everything in Professional",
      "Choose 9 areas of your property work",
      "Multi-property oversight",
      "Operational depth",
    ],
    cta: "Choose Business",
    ctaHref: "https://app.hobsonschoice.ai/signup",
    characters: FULL_TEAM_CHARACTERS,
  },
];

function CharacterRow({ characters }: { characters: CharacterPortrait[] }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {characters.map((c) => (
        <div
          key={c.alt}
          className="w-10 h-10 rounded-full border-2 border-background bg-primary/5 overflow-hidden flex items-center justify-center ring-1 ring-border/40"
          title={c.alt}
        >
          <img src={c.img} alt={c.alt} className="w-9 h-9 object-contain" />
        </div>
      ))}
    </div>
  );
}

export default function Pricing() {
  // All pricing cards white
  const tierStyles = [
    "bg-background border-border/60",
    "bg-background border-border/60",
    "bg-background border-border/60",
    "bg-background border-border/60",
  ];

  return (
    <>
      <Helmet>
        <title>Pricing | Hobson AI</title>
        <meta
          name="description"
          content="Every plan includes me. The only difference is how much responsibility you'd like me to take on."
        />
        <link rel="canonical" href="https://hobsonschoice.ai/pricing" />
      </Helmet>

      <GlobalHeader />

      <main id="main-content" className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40 bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
          <div className="container mx-auto px-4 py-14 sm:py-20 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                Simple, transparent <span className="bg-gradient-to-r from-primary via-primary/80 to-accent-teal bg-clip-text text-transparent">pricing</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Every business is different. Choose the level of support that's right for you today, and I'll grow with you as your needs evolve.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="bg-muted/20 border-b border-border/30">
          <div className="container mx-auto px-4 py-14 sm:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10 max-w-2xl mx-auto">
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-primary/[0.03] to-background p-5 sm:p-6 text-center shadow-sm">
                  <div className="absolute top-0 left-0 w-20 h-20 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-accent-teal/5 rounded-full translate-x-1/2 translate-y-1/2 blur-xl" />
                  <div className="relative">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full border-2 border-primary/20 bg-primary/5 overflow-hidden flex items-center justify-center shadow-sm">
                        <img src={owlMascot} alt="Hobson" className="w-12 h-12 object-contain" />
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                        <p className="text-sm sm:text-base text-foreground/90 font-medium leading-snug">
                          From <span className="font-bold text-primary">Starter</span> onwards, I bring together my full specialist team to help me look after your property work.
                        </p>
                        <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equal 4-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
                {plans.map((plan, idx) => {
                  const isFoundation = idx === 0;
                  return (
                    <Card
                      key={plan.name}
                      className={`relative flex flex-col p-6 transition-all duration-300 border ${tierStyles[idx]} hover:border-primary/50 hover:shadow-xl hover:-translate-y-0.5`}
                    >
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                        <p className="text-sm text-primary mt-1 font-medium">{plan.tagline}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Coming soon
                        </div>
                      </div>

                      {/* Character cluster */}
                      <div className="mb-5 h-[5.5rem]">
                        {isFoundation ? (
                          <div className="h-full flex flex-col items-center justify-center gap-2">
                            <CharacterRow characters={plan.characters} />
                            <span className="text-xs text-muted-foreground font-medium self-start">Access to the Professor</span>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <CharacterRow characters={plan.characters} />
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-foreground tracking-tight">{plan.price}</span>
                          {plan.priceSuffix && (
                            <span className="text-sm text-muted-foreground">{plan.priceSuffix}</span>
                          )}
                        </div>
                      </div>

                      {/* Responsibilities pill */}
                      <div className="mb-4">
                        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {plan.responsibilities}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                        {plan.description}
                      </p>

                      {/* Divider before features for rhythm */}
                      <div className="h-px bg-border/50 mb-4" />

                      {/* Features grow to align CTAs */}
                      <ul className="space-y-2.5 mb-6 flex-grow">
                        {plan.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground/90">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full"
                        variant={isFoundation ? "outline" : "default"}
                        disabled
                      >
                        {plan.cta}
                      </Button>
                    </Card>
                  );
                })}
              </div>

            </div>

            {/* Enterprise CTA */}
            <div className="mt-10 max-w-3xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-accent-teal/[0.04] p-8 sm:p-10 text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-teal/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Coming soon
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Enterprise</h3>
                  <p className="mt-2 text-base text-primary font-medium">Let's build something together</p>

                  <div className="mt-4 flex justify-center">
                    <CharacterRow characters={FULL_TEAM_CHARACTERS} />
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    Every organisation works differently. Together, we'll shape me around the way your business works, so I can take care of the things that are unique to your organisation.
                  </p>
                  <div className="mt-6">
                    <span className="text-sm text-muted-foreground">Email </span>
                    <a href="mailto:info@hobsonschoice.ai" className="text-sm font-medium text-primary hover:underline">
                      info@hobsonschoice.ai
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Fair Usage */}
        <section className="bg-muted/20">
          <div className="container mx-auto px-4 py-14 sm:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Fair Usage</h2>
              <div className="mt-5 space-y-3 text-muted-foreground leading-relaxed">
                <p>Hobson is designed to be used every day.</p>
                <p>
                  Every plan includes fair usage across conversations, documents and portfolio activity.
                  Our Fair Usage Policy exists simply to prevent abuse while ensuring every customer enjoys
                  a consistently fast and reliable service.
                </p>
                <p className="text-sm italic">
                  The overwhelming majority of customers will never encounter these limits.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
