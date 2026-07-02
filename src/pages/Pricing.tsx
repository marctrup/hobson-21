import React from "react";
import { Helmet } from "react-helmet-async";

import { Check, Mail, CalendarClock, ShieldCheck, KeyRound, DoorOpen, Banknote, ClipboardList, Wrench, Sparkles } from "lucide-react";
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
    responsibilities: "Ask me anything",
    tagline: "Get to know me.",
    description:
      "Perfect for asking questions about your portfolio and receiving clear, evidence-backed answers.",
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
    responsibilities: "I'll look after 3 areas of your property work",
    tagline: "I'll start looking after your work.",
    description:
      "Everything in Foundation, plus I'll look after 3 areas of your property work.",
    includes: [
      "Everything in Foundation",
      "Choose 3 areas of your property work",
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

        {/* Pricing Cards */}
        <section className="bg-muted/20 border-b border-border/30">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto items-stretch">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className="relative flex flex-col p-6 transition-all duration-300 border border-border/60 bg-primary/[0.03] hover:border-primary/40 hover:shadow-lg"
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

            {/* Enterprise CTA */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-accent-teal/[0.04] p-8 sm:p-10 text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-teal/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                <div className="relative">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Enterprise</h3>
                  <p className="mt-2 text-base text-primary font-medium">Let's build something together</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    Every organisation is different. If there's work unique to your business, we'll teach me how you'd like it done.
                  </p>
                  <div className="mt-6 text-center">
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

        {/* Pricing Cards */}
        <section className="bg-background border-b border-border/30">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto items-stretch">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className="relative flex flex-col p-6 transition-all duration-300 border border-border/60 bg-primary/[0.03] hover:border-primary/40 hover:shadow-lg"
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

            {/* Enterprise CTA */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-accent-teal/[0.04] p-8 sm:p-10 text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-teal/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                <div className="relative">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Enterprise</h3>
                  <p className="mt-2 text-base text-primary font-medium">Let's build something together</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    Every organisation is different. If there's work unique to your business, we'll teach me how you'd like it done.
                  </p>
                  <div className="mt-6 text-center">
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
