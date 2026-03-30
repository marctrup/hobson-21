import React, { useState, useEffect, useRef } from "react";

import { Helmet } from "react-helmet-async";
import { getPricingStructuredData, getOrganizationStructuredData, getBreadcrumbStructuredData } from "@/utils/seo-data";
import { GlobalHeader } from "@/components/GlobalHeader";
import owlMascot from "@/assets/owl-mascot.png";
// Inline SVG icons using brand green/red
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="hsl(152 64% 29%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CrossIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5l10 10" stroke="hsl(0 84% 60%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const tiers = [
  {
    name: "",
    tier: 1,
    price: "£19.50",
    priceMonthly: 19.50,
    priceAnnualMonthly: 15.60,
    priceAnnualYearly: 187.20,
    period: "/ month",
    seats: "1 seat",
    label: "No Knowledge Base",
    description: "",
    features: [
      { text: "Multi-document AI reasoning", included: true },
      { text: "Plain English queries", included: true },
      { text: "Real estate domain accuracy", included: true },
      { text: "Sourced, auditable answers", included: true },
      { text: "Knowledge Base", included: false },
      { text: "Workflow automation", included: false },
      { text: "Action memory", included: false },
    ],
    cta: "Start 3-day free trial",
    popular: false,
    highlighted: false,
  },
  {
    name: "",
    tier: 2,
    price: "£125.00",
    priceMonthly: 125.00,
    priceAnnualMonthly: 100.00,
    priceAnnualYearly: 1200.00,
    period: "/ month",
    seats: "2 seats",
    seatCount: 2,
    perSeat: "£62.50/seat",
    label: "Full platform",
    description: "",
    features: [
      { text: "Multi-document AI reasoning", included: true },
      { text: "Plain English queries", included: true },
      { text: "Real estate domain accuracy", included: true },
      { text: "Sourced, auditable answers", included: true },
      { text: "Knowledge Base", included: true },
      { text: "Workflow automation", included: true },
      { text: "Action memory", included: true },
    ],
    cta: "Start 7-day free trial",
    popular: true,
    highlighted: true,
  },
  {
    name: "",
    tier: 3,
    price: "£249.00",
    priceMonthly: 249.00,
    priceAnnualMonthly: 199.20,
    priceAnnualYearly: 2390.40,
    period: "/ month",
    seats: "5 seats",
    seatCount: 5,
    perSeat: "£49.80/seat",
    label: "Full platform",
    description: "",
    features: [
      { text: "Multi-document AI reasoning", included: true },
      { text: "Plain English queries", included: true },
      { text: "Real estate domain accuracy", included: true },
      { text: "Sourced, auditable answers", included: true },
      { text: "Knowledge Base", included: true },
      { text: "Workflow automation", included: true },
      { text: "Action memory", included: true },
    ],
    cta: "Get started",
    popular: false,
    highlighted: false,
  },
  {
    name: "",
    tier: 4,
    price: "£449.00",
    priceMonthly: 449.00,
    priceAnnualMonthly: 359.20,
    priceAnnualYearly: 4310.40,
    period: "/ month",
    seats: "10 seats",
    seatCount: 10,
    perSeat: "£44.90/seat",
    label: "Full platform",
    description: "",
    features: [
      { text: "Multi-document AI reasoning", included: true },
      { text: "Plain English queries", included: true },
      { text: "Real estate domain accuracy", included: true },
      { text: "Sourced, auditable answers", included: true },
      { text: "Knowledge Base", included: true },
      { text: "Workflow automation", included: true },
      { text: "Action memory", included: true },
    ],
    cta: "Get started",
    popular: false,
    highlighted: false,
  },
];

const sharedFeatures = [
  "Everything in Tier 1",
  "Knowledge Base",
  "Contractor and contact store",
  "Compliance register",
  "Policy and process memory",
  "Document ingestion and indexing",
  "Workflow automation",
  "Scheduled triggers and alerts",
  "Draft generation",
  "Action memory and pattern learning",
  "Monthly impact summaries",
  "Personal shortcuts",
  "Auditable, sourced, reversible actions",
];

const faqs = [
  {
    q: "When will Tiers 2, 3 and 4 be available?",
    a: "We are currently working on Tier 1. Tiers 2, 3 and 4 — which unlock the full Knowledge Base platform — are launching later in the year. Join the waitlist to be notified first and to lock in founding member pricing.",
  },
  {
    q: "What is the Knowledge Base exactly?",
    a: "It is Hobson's memory about your business. You tell Hobson who your contractors are, how you handle rent arrears, what your communication style is — and it remembers permanently. Every answer and every action it takes reflects what it knows about you.",
  },
  {
    q: "What is the difference between tiers?",
    a: "Tier 1 gives you Hobson's AI document reasoning — ask anything across your leases, contracts and compliance documents and get instant, sourced answers. What it does not have is the Knowledge Base. Hobson on Tier 1 does not know your business. It knows your documents.\n\nTiers 2, 3 and 4 are the same product. Every feature, every capability, the full Knowledge Base — identical across all three. The only decision is how many people need access. Same Hobson, more seats, better value per seat as you go up.",
  },
  {
    q: "Can I start on Tier 1 and upgrade?",
    a: "Yes. Your Knowledge Base is built as you go — when you upgrade to Tier 2, everything you have taught Hobson stays. There is no reset.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Tier 1 comes with a 3-day free trial. No credit card required and limited credits to try with.",
  },
  {
    q: "Are there usage limits?",
    a: "No. All paid plans include unlimited queries, document ingestion and workflow runs. We operate a fair use policy for accounts showing usage patterns inconsistent with normal business operations — but in practice this never affects our clients.",
  },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const tier2Ref = useRef<HTMLDivElement>(null);
  const [tier2Visible, setTier2Visible] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTier2Visible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (tier2Ref.current) observer.observe(tier2Ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Pricing | Hobson AI — Specialised AI for Property Management</title>
        <meta name="description" content="Compare Hobson AI pricing tiers. Start free or choose a plan that fits your property management needs with monthly and annual billing options." />
        <link rel="canonical" href="https://hobsonschoice.ai/pricing" />
        <script type="application/ld+json">{JSON.stringify(getPricingStructuredData())}</script>
        <script type="application/ld+json">{JSON.stringify(getOrganizationStructuredData())}</script>
        <script type="application/ld+json">{JSON.stringify(getBreadcrumbStructuredData([
          { name: "Home", url: "https://hobsonschoice.ai" },
          { name: "Pricing", url: "https://hobsonschoice.ai/pricing" }
        ]))}</script>
      </Helmet>

      <GlobalHeader />

      <main id="main-content">
        {/* Pricing Table */}
        <section className="pt-12 md:pt-28 pb-12 md:pb-28 bg-background" id="pricing-table">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                Hobson Grows As It Learns
              </h1>
            </div>

            {/* Billing toggle */}
            <div className="flex flex-wrap items-center justify-center gap-1 mb-6 sm:mb-10">
              <div className="inline-flex items-center rounded-full border border-border bg-muted p-1">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    !isAnnual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isAnnual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annual
                </button>
              </div>
              {isAnnual && (
                <span className="ml-2 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#E94560", color: "#fff" }}>
                  Save 20%
                </span>
              )}
            </div>

            {/* All tiers in a single row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {tiers.map((tier, i) => {
                const isWaitlist = tier.tier >= 2;
                const isEntry = tier.tier === 1;
                const hasAnnual = isAnnual && tier.priceAnnualMonthly;
                const displayPrice = hasAnnual ? `£${tier.priceAnnualMonthly!.toFixed(2)}` : tier.price;
                const displayPerSeat = hasAnnual && tier.seatCount
                  ? `£${(tier.priceAnnualMonthly! / tier.seatCount).toFixed(2)}/seat`
                  : tier.perSeat;
                return (
                  <div
                    key={i}
                    className={`relative rounded-xl p-6 flex flex-col transition-all duration-500 ${
                      isEntry
                        ? "bg-card border-2 border-primary shadow-lg"
                        : "bg-muted/60 border border-border/60 shadow-sm opacity-75"
                    }`}
                  >
                    <div className="mb-4">
                      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isEntry ? "text-primary" : "text-muted-foreground"}`}>Tier {tier.tier}</p>
                      {tier.name && <h3 className="text-xl font-bold mb-1 text-foreground">{tier.name}</h3>}
                      <p className="text-xs text-muted-foreground">{tier.label}</p>
                    </div>
                    <div className="mb-4">
                      {hasAnnual && (
                        <div className="text-sm text-muted-foreground line-through mb-0.5">{tier.price}/mo</div>
                      )}
                      <span className="text-3xl font-bold text-foreground">{displayPrice}</span>
                      <span className="text-sm ml-1 text-muted-foreground">{tier.period}</span>
                      {hasAnnual && tier.priceAnnualYearly && (
                        <div className="text-xs text-muted-foreground mt-1">
                          billed as £{tier.priceAnnualYearly.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} annually
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{tier.seats}</span>
                        {displayPerSeat && (
                          <span className="text-xs text-muted-foreground/70">({displayPerSeat})</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-6 text-muted-foreground">{tier.description}</p>
                    {/* Tier 1 feature list */}
                    {tier.features && (
                      <ul className="space-y-2.5 mb-6">
                        {tier.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2.5 text-sm text-foreground">
                            <span className="mt-0.5 flex-shrink-0">{f.included ? <CheckIcon /> : <CrossIcon />}</span>
                            <span className={f.included ? "" : "opacity-50"}>{f.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto">
                      {isWaitlist && (
                        <p className="text-center text-xs text-muted-foreground mb-2">Coming later this year</p>
                      )}
                      {isWaitlist ? (
                        <button
                          onClick={() => { setWaitlistSubmitted(false); setWaitlistEmail(""); setWaitlistOpen(true); }}
                          className="block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-primary/10 border-2 border-primary text-primary"
                        >
                          Join the waitlist
                        </button>
                      ) : (
                        <a href="https://app.hobsonschoice.ai/signup" target="_blank" rel="noopener noreferrer"
                          className="block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 bg-primary text-primary-foreground"
                        >{tier.cta}</a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>


            {/* Enterprise row */}
            <div className="mt-6 sm:mt-10 rounded-xl p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-primary/10 border border-primary/20 text-center md:text-left">
              <div>
                <p className="text-lg font-semibold text-foreground">More than 10 users?</p>
                <p className="text-sm text-muted-foreground">Talk to us. Enterprise pricing is based on usage, not headcount.</p>
              </div>
              <button
                onClick={() => { setWaitlistSubmitted(false); setWaitlistEmail(""); setWaitlistOpen(true); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-primary/10 border-2 border-primary text-primary whitespace-nowrap"
              >
                Contact us
              </button>
            </div>
          </div>
        </section>

        {/* Knowledge Base Callout */}
        <section className="py-16 md:py-24 px-4 sm:px-6 bg-muted">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={owlMascot} alt="Hobson AI Owl Mascot" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Why the big jump in pricing? — <span className="text-primary">The Knowledge Base</span>
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground italic mb-8">
              Tier 1 answers your questions. Tier 2 - 4 knows your business.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              The Knowledge Base is the difference between an AI that retrieves information from your documents and one that understands how you work — your contractors, your contacts, your policies, your obligations, your preferences. Every answer shaped by your business. Every action reflecting how you operate. That transformation is what Tier 2, 3 and 4 deliver. And it is worth considerably more than the difference in price.
            </p>
            <div className="mt-8 max-w-xl mx-auto rounded-xl border border-primary/30 bg-primary/5 px-6 py-5">
              <p className="text-sm sm:text-base font-semibold text-foreground">
                A single hour of a persons time costs more than a month of Tier 2. The Knowledge Base saves multiples of that every week.
              </p>
            </div>
          </div>
        </section>

        {/* 4. FAQ */}
        <section className="py-12 md:py-28 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-foreground">
              Common questions
            </h2>

            <div className="divide-y divide-border">
              {faqs.map((faq, i) => (
                <div key={i} className="py-5">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-left gap-4"
                  >
                    <span className="text-base font-semibold text-foreground">
                      {faq.q}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className={`flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                    >
                      <path d="M10 4v12M4 10h12" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Waitlist Modal */}
      {waitlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setWaitlistOpen(false)}>
          <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            {waitlistSubmitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckIcon />
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">You're on the list.</p>
                <p className="text-sm text-muted-foreground">We'll be in touch.</p>
                <button onClick={() => setWaitlistOpen(false)} className="mt-6 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-2">Join the waitlist</h3>
                <p className="text-sm text-muted-foreground mb-6">Be first to know when we launch. No spam, ever.</p>
                <form onSubmit={e => {
                  e.preventDefault();
                  if (waitlistEmail.trim()) setWaitlistSubmitted(true);
                }}>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={waitlistEmail}
                    onChange={e => setWaitlistEmail(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
                    autoFocus
                  />
                  <button type="submit" className="w-full py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                    Join waitlist
                  </button>
                </form>
                <button onClick={() => setWaitlistOpen(false)} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors text-center">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Pricing;
