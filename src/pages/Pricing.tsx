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
    tagline: "I'll start looking after things.",
    description:
      "Everything in Foundation, plus I'll look after 3 areas of your property work.",
    includes: [
      "Everything in Foundation",
      "I'll look after 3 areas of your property work",
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
      "I'll look after 6 areas of your property work",
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
      "Choose 9 things for me to look after",
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
                      <Card className="w-full h-full p-6 text-center border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
                    We'll design entirely new areas of work around the way your business works.
                  </p>
                </Card>
              </div>

              {/* Key message */}
              <div className="mt-14 text-center">
                <p className="text-lg sm:text-xl text-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                  You never pay for documents, questions or AI usage. You simply choose how much of your property work you'd like me to look after.
                </p>
              </div>

              {/* Responsibility showcase */}
              <div className="mt-16">
                <div className="text-center mb-8">
                  <span className="inline-block text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">
                    Some of the work I can look after
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    Choose the areas of your property work you'd like me to look after. Everything else happens quietly behind the scenes.
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { icon: CalendarClock, label: "Lease Expiry Monitoring", bg: "bg-sky-100", hoverBg: "group-hover:bg-sky-200", text: "text-sky-600" },
                    { icon: ShieldCheck, label: "Compliance Monitoring", bg: "bg-emerald-100", hoverBg: "group-hover:bg-emerald-200", text: "text-emerald-600" },
                    { icon: KeyRound, label: "Starting a Tenancy", bg: "bg-amber-100", hoverBg: "group-hover:bg-amber-200", text: "text-amber-600" },
                    { icon: DoorOpen, label: "Ending a Tenancy", bg: "bg-rose-100", hoverBg: "group-hover:bg-rose-200", text: "text-rose-600" },
                    { icon: Banknote, label: "Rent Reviews", bg: "bg-violet-100", hoverBg: "group-hover:bg-violet-200", text: "text-violet-600" },
                    { icon: ClipboardList, label: "Mid-Term Inventories", bg: "bg-cyan-100", hoverBg: "group-hover:bg-cyan-200", text: "text-cyan-600" },
                    { icon: Wrench, label: "Tenant Reported Issues", bg: "bg-orange-100", hoverBg: "group-hover:bg-orange-200", text: "text-orange-600" },
                  ].map(({ icon: Icon, label, bg, hoverBg, text }) => (
                    <div
                      key={label}
                      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3.5 hover:border-primary/40 hover:bg-primary/[0.03] transition-all duration-200"
                    >
                      <div className={`shrink-0 w-9 h-9 rounded-lg ${bg} flex items-center justify-center ${hoverBg} transition-colors`}>
                        <Icon className={`w-4.5 h-4.5 ${text}`} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium text-foreground leading-tight">{label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] px-4 py-3.5">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-4.5 h-4.5 text-primary" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold text-primary leading-tight">And many more</span>
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
