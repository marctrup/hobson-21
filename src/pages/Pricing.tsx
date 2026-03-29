import React, { useState, useEffect, useRef } from "react";

import { Helmet } from "react-helmet-async";
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

// Knowledge Base feature tile icons — using primary purple
const ContactsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="12" r="4" stroke="hsl(269 91% 52%)" strokeWidth="1.5"/>
    <circle cx="8" cy="20" r="2.5" stroke="hsl(269 91% 52%)" strokeWidth="1.5"/>
    <circle cx="24" cy="20" r="2.5" stroke="hsl(269 91% 52%)" strokeWidth="1.5"/>
    <path d="M16 16v4M12 22l-2-1M20 22l2-1" stroke="hsl(269 91% 52%)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PolicyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="8" y="4" width="16" height="24" rx="2" stroke="hsl(269 91% 52%)" strokeWidth="1.5"/>
    <path d="M12 12h8M12 16h8M12 20h5" stroke="hsl(269 91% 52%)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 10l2 2-2 2" stroke="hsl(269 91% 52%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L6 9v7c0 6.627 4.477 12.164 10 14 5.523-1.836 10-7.373 10-14V9L16 4z" stroke="hsl(269 91% 52%)" strokeWidth="1.5"/>
    <circle cx="16" cy="16" r="3" stroke="hsl(269 91% 52%)" strokeWidth="1.5"/>
    <path d="M16 13v-2M16 21v-2M19 16h2M11 16h2" stroke="hsl(269 91% 52%)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SlidersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M8 10h16M8 16h16M8 22h16" stroke="hsl(269 91% 52%)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="13" cy="10" r="2.5" fill="hsl(var(--foreground))" stroke="hsl(269 91% 52%)" strokeWidth="1.5"/>
    <circle cx="20" cy="16" r="2.5" fill="hsl(var(--foreground))" stroke="hsl(269 91% 52%)" strokeWidth="1.5"/>
    <circle cx="11" cy="22" r="2.5" fill="hsl(var(--foreground))" stroke="hsl(269 91% 52%)" strokeWidth="1.5"/>
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
    description: "Domain-specific AI reasoning across your property documents. Ask questions in plain English across leases, compliance documents and contracts. Powered by AI trained on real estate — not a generic chatbot.",
    features: [
      { text: "Multi-document AI reasoning", included: true },
      { text: "Plain English queries", included: true },
      { text: "Real estate domain accuracy", included: true },
      { text: "Sourced, auditable answers", included: true },
      { text: "Knowledge Base", included: false },
      { text: "Workflow automation", included: false },
      { text: "Action memory", included: false },
    ],
    cta: "Get started",
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
    description: "Hobson learns your business and never forgets it. Your contractors, contacts, policies, compliance deadlines and how you work — all stored, always active. Ask anything. Get an answer shaped by what Hobson knows about you, not a generic response.",
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
    description: "Everything in Tier 2, built for a bigger operation. Five people, one shared intelligence. The same Hobson — the same memory, the same workflows, the same action learning — just more hands on deck.",
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
    description: "Your most cost-effective seat. Ten people running on a single, continuously improving intelligence. The longer you use it, the sharper it gets. Hobson at this scale starts to feel less like software and more like institutional memory.",
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
    q: "Do I need to replace my existing property management software?",
    a: "No. Hobson works alongside the tools you already use — Arthur, Yardi, MRI, Fixflo, Xero. It reads your documents and acts within your existing workflows. No rip-and-replace required.",
  },
  {
    q: "What is the Knowledge Base exactly?",
    a: "It is Hobson's memory about your business. You tell Hobson who your contractors are, how you handle rent arrears, what your communication style is — and it remembers permanently. Every answer and every action it takes reflects what it knows about you.",
  },
  {
    q: "Is my data secure?",
    a: "Every client's data is fully isolated. Hobson never shares data between companies. Every action is sourced, auditable and reversible. Built for the regulated environment of property management.",
  },
  {
    q: "What counts as a seat?",
    a: "A seat is a named user who can log in and interact with Hobson. Tier 1 is per person. Tiers 2–4 are per account with a seat allowance — a Tier 3 account supports up to 5 named users.",
  },
  {
    q: "What is the difference between tiers?",
    a: "Tier 1 gives you AI document reasoning without the Knowledge Base — ideal for a sole operator testing Hobson. Tiers 2, 3 and 4 are identical in capability. The only difference is how many seats are included and the price per seat. A 5-person team on Tier 3 has exactly the same Hobson as a 2-person team on Tier 2.",
  },
  {
    q: "Can I start on Tier 1 and upgrade?",
    a: "Yes. Your Knowledge Base is built as you go — when you upgrade to Tier 2, everything you have taught Hobson stays. There is no reset.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Tier 2 comes with a 7-day free trial. No credit card required.",
  },
  {
    q: "Are there usage limits?",
    a: "No. All paid plans include unlimited queries, document ingestion and workflow runs. We operate a fair use policy for accounts showing usage patterns inconsistent with normal business operations — but in practice this never affects our clients.",
  },
];

const knowledgeTiles = [
  {
    icon: <ContactsIcon />,
    title: "Contractors & Contacts",
    copy: "Who handles gas safety at Stanley House. Your preferred electrician. The block manager's direct line. Hobson knows — and never forgets.",
  },
  {
    icon: <PolicyIcon />,
    title: "Policies & Processes",
    copy: "Your rent arrears escalation procedure. How you communicate with tenants. What needs sign-off before a contractor is instructed. Built in once. Applied always.",
  },
  {
    icon: <ShieldIcon />,
    title: "Compliance Register",
    copy: "Every certificate. Every deadline. Every obligation across every property — live, tracked and acted on before the reminder becomes a problem.",
  },
  {
    icon: <SlidersIcon />,
    title: "Your Way of Working",
    copy: "Formal correspondence or warm and friendly? Escalate after 7 days or 14? London rates or Midlands? Hobson learns how you work and works that way.",
  },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const tier2Ref = useRef<HTMLDivElement>(null);
  const [tier2Visible, setTier2Visible] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

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
        <meta name="description" content="Simple, honest pricing for AI-powered property management. Start with what you need — Hobson grows as your trust grows. 7-day free trial on Tier 2, no credit card required." />
        <link rel="canonical" href="https://hobsonschoice.ai/pricing" />
      </Helmet>

      <GlobalHeader />

      <main id="main-content">
        {/* 1. Hero Section */}
        <section className="py-12 md:py-28 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-foreground">
              Finally. An AI that actually knows <span className="text-primary">your business</span>.
            </h1>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground">
              Ask about any lease, contract or compliance document in plain English and get an answer you can act on. Then let Hobson act on it for you — chasing, drafting, filing and reporting across everything you manage.
            </p>
          </div>
        </section>

        {/* 2. Knowledge Base Section */}
        <section className="py-12 md:py-28 bg-primary/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <img
                src={owlMascot}
                alt="Hobson AI owl mascot"
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 object-contain opacity-90"
              />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                The Knowledge Base
              </h2>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground italic mb-6 sm:mb-8 max-w-3xl">
              Most AI tools answer questions. Hobson remembers your business.
            </p>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-10 sm:mb-14 max-w-4xl text-muted-foreground">
              The Knowledge Base is Hobson's persistent memory about your business. Not just documents — how you operate. It stores your contractors and contacts, your policies and procedures, your compliance register, your communication preferences and your business rules. Every answer Hobson gives, every draft it produces, every action it takes is shaped by what it knows about you. The longer you use Hobson, the better it gets.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {knowledgeTiles.map((tile, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-6 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
                >
                  <div className="mb-4">{tile.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{tile.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tile.copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 sm:mt-12 max-w-xl mx-auto text-center">
              <div className="rounded-lg px-6 py-4 border" style={{ backgroundColor: "hsl(152 64% 29% / 0.1)", borderColor: "hsl(152 64% 29% / 0.25)" }}>
                <p className="text-sm sm:text-base font-semibold" style={{ color: "hsl(152 64% 29%)" }}>
                  Tier 1 operates without the Knowledge Base. Tiers 2–4 unlock it. This is the difference.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Pricing Table */}
        <section className="py-12 md:py-28 bg-background" id="pricing-table">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">
                Simple, honest pricing
              </h2>
              <p className="text-lg text-muted-foreground">
                Start with what you need. Hobson grows as your trust grows.
              </p>
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

            {/* Shared feature list for Tiers 2-4 */}
            <div className="mt-6 sm:mt-8 rounded-xl p-4 sm:p-8 bg-muted border border-border">
              <h3 className="text-lg font-semibold mb-5 text-foreground">
                Included in Tiers 2, 3 and 4
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2.5">
                {sharedFeatures.map((f, fi) => (
                  <div key={fi} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="mt-0.5 flex-shrink-0"><CheckIcon /></span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm italic text-muted-foreground">
                All paid plans include every feature. You are choosing your team size, not your capability.
              </p>
            </div>

            {/* Enterprise row */}
            <div className="mt-6 sm:mt-10 rounded-xl p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-muted text-center md:text-left">
              <div>
                <p className="text-lg font-semibold text-foreground">More than 10 users?</p>
                <p className="text-sm text-muted-foreground">Talk to us. Enterprise pricing is based on portfolio size, not headcount.</p>
              </div>
              <button
                onClick={() => { setWaitlistSubmitted(false); setWaitlistEmail(""); setWaitlistOpen(true); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-primary/10 border-2 border-primary text-primary whitespace-nowrap"
              >
                Register interest
              </button>
            </div>
          </div>
        </section>

        {/* 4. Comparison callout */}
        <section className="py-10 md:py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-base sm:text-xl md:text-2xl italic leading-relaxed text-foreground">
              A 10-user team on individual Tier 2 accounts pays £625/month. Tier 4 costs £449 — and gives them full agentic workflows. The upgrade conversation takes ten seconds.
            </p>
          </div>
        </section>

        {/* 5. FAQ */}
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
