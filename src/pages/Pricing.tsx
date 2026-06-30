import React from "react";
import { Helmet } from "react-helmet-async";

import { Check, CalendarClock, ShieldCheck, KeyRound, DoorOpen, Banknote, ClipboardList, Wrench, Sparkles } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import owlMascot from "@/assets/owl-mascot.png";

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
};

const plans: Plan[] = [
  {
    name: "Foundation",
    price: "£17.50",
    priceSuffix: "/month",
    responsibilities: "Questions & Answers",
    tagline: "Get to know me.",
    description:
      "Perfect if you'd like to ask questions about your portfolio and receive clear, evidence-backed answers.",
    includes: [
      "Hobson AI",
      "Complete specialist team",
      "Portfolio understanding",
      "Evidence-backed answers",
      "Fair usage",
    ],
    cta: "Choose Foundation",
    ctaHref: "https://app.hobsonschoice.ai/signup",
  },
  {
    name: "Starter",
    price: "£39",
    priceSuffix: "/month",
    responsibilities: "3 Responsibilities",
    tagline: "I'll begin taking work off your desk.",
    description:
      "Everything in Foundation, plus choose any three responsibilities for me to look after on your behalf.",
    includes: [
      "Everything in Foundation",
      "Choose 3 responsibilities",
      "Continuous monitoring",
      "Proactive updates",
    ],
    cta: "Choose Starter",
    ctaHref: "https://app.hobsonschoice.ai/signup",
  },
  {
    name: "Professional",
    price: "£99",
    priceSuffix: "/month",
    responsibilities: "6 Responsibilities",
    tagline: "I'll become part of your team.",
    description:
      "Everything in Starter, plus choose any six responsibilities. Ideal if you'd like me to take care of more of your day-to-day property work.",
    includes: [
      "Everything in Starter",
      "Choose 6 responsibilities",
      "Day-to-day oversight",
      "Priority handling",
    ],
    cta: "Choose Professional",
    ctaHref: "https://app.hobsonschoice.ai/signup",
  },
  {
    name: "Business",
    price: "£199",
    priceSuffix: "/month",
    responsibilities: "9 Responsibilities",
    tagline: "I'll take care of even more.",
    description:
      "Everything in Professional, plus choose any nine responsibilities. Designed for organisations managing larger portfolios where there's even more work I can quietly take care of.",
    includes: [
      "Everything in Professional",
      "Choose 9 responsibilities",
      "Multi-property oversight",
      "Operational depth",
    ],
    cta: "Choose Business",
    ctaHref: "https://app.hobsonschoice.ai/signup",
  },
];

function ComingSoonBadge() {
  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
      <Badge className="bg-primary text-primary-foreground px-3 py-1 shadow-md">
        Coming soon
      </Badge>
    </div>
  );
}

export default function Pricing() {
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
          <div className="container mx-auto px-4 py-16 sm:py-24 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <img src={owlMascot} alt="Hobson" className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border-2 border-primary/20 bg-primary/5" />
              </div>
              <h1 className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                Simple, transparent <span className="bg-gradient-to-r from-primary via-primary/80 to-accent-teal bg-clip-text text-transparent">pricing</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Every business is different. Choose the level of support that's right for you today, and I'll grow with you as your needs evolve.
              </p>
            </div>
          </div>
        </section>

        {/* What you're really choosing */}
        <section className="bg-muted/20 border-b border-border/30">
          <div className="container mx-auto px-4 pt-8 pb-4 sm:pt-12 sm:pb-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                  What you're really choosing
                </h2>
                <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Every plan includes me, my specialist team and the same intelligence. The only difference is how much of your day-to-day property work you'd like me to look after.
                </p>
              </div>

              {/* Four progression cards */}
              <div className="relative">
                {/* Desktop connector line */}
                <div className="hidden lg:block absolute top-6 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { step: "1", name: "Foundation", title: "Ask me questions", desc: "Perfect if you'd simply like clear, evidence-backed answers about your portfolio." },
                    { step: "2", name: "Starter", title: "Let me take care of a few things", desc: "Choose three areas of work for me to manage on your behalf." },
                    { step: "3", name: "Professional", title: "Let me take care of even more", desc: "Choose six areas of work. I'll quietly become part of your day-to-day routine." },
                    { step: "4", name: "Business", title: "Let me take care of much more", desc: "Choose nine areas of work. The larger your portfolio becomes, the more I'll quietly look after." },
                  ].map((card) => (
                    <div key={card.name} className="flex flex-col items-center">
                      <div className="relative z-10 mb-5">
                        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          {card.step}
                        </div>
                      </div>
                      <Card className="w-full p-6 text-center border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <h3 className="text-lg font-bold text-foreground">{card.name}</h3>
                        <p className="text-sm font-semibold text-primary mt-1.5 mb-3">{card.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise */}
              <div className="mt-6 max-w-sm mx-auto">
                <Card className="p-6 text-center border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300">
                  <h3 className="text-lg font-bold text-foreground">Enterprise</h3>
                  <p className="text-sm font-semibold text-primary mt-1.5 mb-3">Let's work together</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We'll design entirely new responsibilities around the way your business works.
                  </p>
                </Card>
              </div>

              {/* Key message */}
              <div className="mt-14 text-center">
                <p className="text-lg sm:text-xl text-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                  You never pay for documents, questions or AI usage. You simply decide how much work you'd like me to take care of.
                </p>
              </div>

              {/* Responsibility chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                {[
                  "📅 Lease Expiry Monitoring",
                  "🛡️ Compliance Monitoring",
                  "🔑 Starting a Tenancy",
                  "🚪 Ending a Tenancy",
                  "💷 Rent Reviews",
                  "📋 Mid-Term Inventories",
                  "🛠️ Tenant Reported Issues",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm text-foreground/80 border border-border/40"
                  >
                    {chip}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm text-primary font-medium border border-primary/20">
                  + Many more
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="bg-background border-b border-border/30">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto items-stretch">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className="relative flex flex-col p-6 transition-all duration-300 border border-border/60 hover:border-primary/40 hover:shadow-lg"
                >
                  <ComingSoonBadge />

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-primary mt-1 font-medium">{plan.tagline}</p>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      {plan.priceSuffix && (
                        <span className="text-sm text-muted-foreground">{plan.priceSuffix}</span>
                      )}
                    </div>
                    <div className="mt-3 inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground/80">
                      {plan.responsibilities}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {plan.description}
                  </p>

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
                    variant="outline"
                    onClick={() => window.open(plan.ctaHref, "_blank")}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fair Usage */}
        <section className="bg-muted/20">
          <div className="container mx-auto px-4 py-14 sm:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">Fair Usage</h2>
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
