import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, Sparkles, ArrowRight, FileText, ShieldCheck, Receipt, Users } from "lucide-react";
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
  featured?: boolean;
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
    featured: true,
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

type ResponsibilityCategory = {
  title: string;
  icon: React.ElementType;
  items: string[];
};

const responsibilityCategories: ResponsibilityCategory[] = [
  {
    title: "Leases",
    icon: FileText,
    items: [
      "Rent Reviews",
      "Break Clauses",
      "Lease Expiry Monitoring",
      "Key Date Monitoring",
    ],
  },
  {
    title: "Compliance",
    icon: ShieldCheck,
    items: [
      "EPC Compliance",
      "Insurance Renewals",
      "Compliance Monitoring",
    ],
  },
  {
    title: "Financial",
    icon: Receipt,
    items: ["Service Charge Monitoring"],
  },
  {
    title: "Occupiers",
    icon: Users,
    items: [
      "Tenant Communications",
      "Vacant Unit Monitoring",
      "Dilapidations",
      "Licence Renewals",
    ],
  },
];

const sameHobson = [
  "Every plan includes me",
  "The same specialist team",
  "The same intelligence",
  "The same evidence-backed answers",
  "Continuous product updates",
];

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
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
          <div className="container mx-auto px-4 py-16 sm:py-24 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <img src={owlMascot} alt="Hobson" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                Choose your plan
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Every plan includes me.
                <br className="hidden sm:block" />
                The only difference is how much responsibility you'd like me to take on.
              </p>
              <div className="mt-10 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground/90 space-y-3 leading-relaxed">
                <p>Traditional software charges for usage. I don't.</p>
                <p>
                  Every plan includes me, the same specialist team and the same
                  intelligence. As you move through the plans, you're simply asking me to take care of more of
                  your business.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto items-stretch">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col p-6 transition-all duration-300 ${
                  plan.featured
                    ? "border-2 border-primary shadow-xl bg-gradient-to-b from-primary/5 to-background lg:scale-[1.03]"
                    : "border border-border/60 hover:border-primary/40 hover:shadow-lg"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 shadow-md">
                      Most Popular
                    </Badge>
                  </div>
                )}

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
                  variant={plan.featured ? "default" : "outline"}
                  onClick={() => window.open(plan.ctaHref, "_blank")}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>

          {/* Enterprise teaser bar */}
          <div className="max-w-7xl mx-auto mt-6">
            <Card className="p-6 sm:p-8 border border-border/60 bg-gradient-to-r from-foreground/[0.03] to-primary/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Enterprise</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    Every organisation works differently. I'll work alongside your team through bespoke responsibilities, tailored automations and integrations designed around the way your business already operates.
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="flex-shrink-0">
                <Link to="/contact">
                  Contact us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </section>

        {/* Responsibilities */}
        <section className="border-y border-border/40 bg-muted/30">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                What I'd like you to leave with me
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                As you move through the plans, simply choose more areas of work for me to look after on your behalf. You never need to think about workflows or automation. Just tell me what you'd like me to take care of, and I'll quietly handle the rest.
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {responsibilityCategories.map((category) => (
                <Card
                  key={category.title}
                  className="group relative border border-border/60 bg-background/80 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative">
                    <div className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {category.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {category.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>

            <div className="max-w-3xl mx-auto text-center mt-12">
              <p className="text-muted-foreground italic leading-relaxed">
                These are just a few examples. As I continue to learn, I'll be able to take care of even more on your behalf.
              </p>
            </div>
          </div>
        </section>

        {/* What is a responsibility */}
        <section className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                What's the difference between a responsibility and a workflow?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                You simply tell me what you'd like me to take care of.
              </p>
            </div>

            <Card className="p-6 sm:p-10 border border-border/60">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                    You ask
                  </p>
                  <p className="text-xl sm:text-2xl font-medium text-foreground leading-snug">
                    "Please take care of my rent reviews."
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Behind the scenes, my specialists quietly coordinate everything that's needed.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Monitor key dates",
                      "Review leases",
                      "Retrieve market evidence",
                      "Perform calculations",
                      "Prepare notices",
                      "Draft emails",
                      "Schedule reminders",
                    ].map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground/60 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/60 text-center">
                <p className="text-sm text-muted-foreground mb-2">You'll simply see one responsibility</p>
                <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-5 py-2 text-base font-semibold text-primary">
                  Rent Reviews
                </div>
                <p className="mt-4 text-sm text-muted-foreground italic">
                  I'll quietly take care of everything else.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Same Hobson */}
        <section className="bg-foreground text-background">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold">Every plan includes me.</h2>
              <p className="mt-4 text-background/70 text-lg">Every plan includes:</p>

              <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
                {sameHobson.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-background/10 bg-background/5 px-4 py-3"
                  >
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-background/80 leading-relaxed">
                The only thing that changes is how much responsibility you'd like me to take on.
                As your business grows, I'll quietly take care of more of the work, leaving you free to
                focus on the decisions that matter.
              </p>
            </div>
          </div>
        </section>

        {/* Enterprise */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto">
            <Card className="relative overflow-hidden p-8 sm:p-14 border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              <div className="relative">
                <Badge variant="outline" className="border-primary/40 text-primary mb-5">
                  Enterprise
                </Badge>
                <h2 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
                  Built around your business.
                </h2>
                <div className="mt-6 max-w-2xl space-y-4 text-muted-foreground leading-relaxed">
                  <p>Large organisations work differently.</p>
                  <p>
                    Rather than asking you to fit around me, I'll work with you to design new
                    responsibilities, connect your existing systems and automate the work that's unique to
                    your organisation.
                  </p>
                </div>

                <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Bespoke responsibilities",
                    "Workflow design",
                    "API integrations",
                    "White-glove onboarding",
                    "Dedicated implementation",
                    "Priority support",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Button asChild size="lg">
                    <Link to="/contact">
                      Talk to us <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Fair Usage */}
        <section className="border-t border-border/40 bg-muted/30">
          <div className="container mx-auto px-4 py-14 sm:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Fair Usage</h2>
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
