import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GlobalHeader } from "@/components/GlobalHeader";

// Inline SVG icons
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#1A7A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CrossIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 5L5 15M5 5l10 10" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Knowledge Base feature tile icons
const ContactsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="12" r="4" stroke="#E94560" strokeWidth="1.5"/>
    <circle cx="8" cy="20" r="2.5" stroke="#E94560" strokeWidth="1.5"/>
    <circle cx="24" cy="20" r="2.5" stroke="#E94560" strokeWidth="1.5"/>
    <path d="M16 16v4M12 22l-2-1M20 22l2-1" stroke="#E94560" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PolicyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="4" width="16" height="24" rx="2" stroke="#E94560" strokeWidth="1.5"/>
    <path d="M12 12h8M12 16h8M12 20h5" stroke="#E94560" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 10l2 2-2 2" stroke="#E94560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L6 9v7c0 6.627 4.477 12.164 10 14 5.523-1.836 10-7.373 10-14V9L16 4z" stroke="#E94560" strokeWidth="1.5"/>
    <circle cx="16" cy="16" r="3" stroke="#E94560" strokeWidth="1.5"/>
    <path d="M16 13v-2M16 21v-2M19 16h2M11 16h2" stroke="#E94560" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SlidersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10h16M8 16h16M8 22h16" stroke="#E94560" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="13" cy="10" r="2.5" fill="#1A1A2E" stroke="#E94560" strokeWidth="1.5"/>
    <circle cx="20" cy="16" r="2.5" fill="#1A1A2E" stroke="#E94560" strokeWidth="1.5"/>
    <circle cx="11" cy="22" r="2.5" fill="#1A1A2E" stroke="#E94560" strokeWidth="1.5"/>
  </svg>
);

const tiers = [
  {
    name: "Entry",
    tier: 1,
    price: "£19.50",
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
    dark: false,
  },
  {
    name: "Professional",
    tier: 2,
    price: "£125.00",
    period: "/ month",
    seats: "2 seats",
    perSeat: "£62.50/seat",
    label: "Full platform",
    description: "Hobson learns your business. Contractors, contacts, policies, compliance deadlines and how you work — all stored, all active. Every answer is shaped by what Hobson knows about you.",
    cta: "Start free trial",
    popular: true,
    dark: true,
  },
  {
    name: "Team",
    tier: 3,
    price: "£249.00",
    period: "/ month",
    seats: "5 seats",
    perSeat: "£49.80/seat",
    label: "Full platform",
    description: "The same Hobson, for a bigger team. Five seats with full access to every feature — Knowledge Base, workflows, action memory and more.",
    cta: "Start free trial",
    popular: false,
    dark: false,
  },
  {
    name: "Scale",
    tier: 4,
    price: "£449.00",
    period: "/ month",
    seats: "10 seats",
    perSeat: "£44.90/seat",
    label: "Full platform",
    description: "Your best per-seat value. Ten seats with full access to every feature. Built for teams running serious portfolios.",
    cta: "Start free trial",
    popular: false,
    dark: false,
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
    a: "Yes. Tiers 2, 3 and 4 come with a 14-day free trial. No credit card required.",
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
        <meta name="description" content="Simple, honest pricing for AI-powered property management. Start with what you need — Hobson grows as your trust grows. 14-day free trial, no credit card required." />
        <link rel="canonical" href="https://hobsonschoice.ai/pricing" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <GlobalHeader />

      <main id="main-content" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* 1. Hero Section */}
        <section className="py-20 md:py-28" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'DM Serif Display', serif", color: "#1A1A2E" }}
            >
              Your tools remind you. Hobson does the work.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto" style={{ color: "#6B6B8A" }}>
              Hobson works alongside your existing systems — not instead of them. It reads the lease, books the inspection, drafts the notice and updates the register. The work gets done.
            </p>
          </div>
        </section>

        {/* 2. Knowledge Base Section */}
        <section style={{ backgroundColor: "#1A1A2E" }} className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              The Knowledge Base
            </h2>
            <p className="text-xl md:text-2xl text-white/80 italic mb-8 max-w-3xl">
              Most AI tools answer questions. Hobson remembers your business.
            </p>
            <p className="text-base md:text-lg leading-relaxed mb-14 max-w-4xl" style={{ color: "rgba(255,255,255,0.7)" }}>
              The Knowledge Base is Hobson's persistent memory about your business. Not just documents — how you operate. It stores your contractors and contacts, your policies and procedures, your compliance register, your communication preferences and your business rules. Every answer Hobson gives, every draft it produces, every action it takes is shaped by what it knows about you. The longer you use Hobson, the better it gets.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {knowledgeTiles.map((tile, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg border transition-colors hover:border-[#E94560]/40"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="mb-4">{tile.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tile.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {tile.copy}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-12 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Tier 1 operates without the Knowledge Base. Tiers 2–4 unlock it. This is the difference.
            </p>
          </div>
        </section>

        {/* 3. Pricing Table */}
        <section className="py-20 md:py-28" style={{ backgroundColor: "#FFFFFF" }} id="pricing-table">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ fontFamily: "'DM Serif Display', serif", color: "#1A1A2E" }}
              >
                Simple, honest pricing
              </h2>
              <p className="text-lg" style={{ color: "#6B6B8A" }}>
                Start with what you need. Hobson grows as your trust grows.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {tiers.map((tier, i) => {
                const isDark = tier.dark;
                const isPop = tier.popular;
                return (
                  <div
                    key={i}
                    ref={isPop ? tier2Ref : undefined}
                    className={`relative rounded-xl p-6 flex flex-col transition-all duration-500 ${
                      isPop
                        ? `${tier2Visible ? "scale-[1.02] shadow-2xl" : "scale-100 shadow-lg"}`
                        : "shadow-sm hover:shadow-md"
                    }`}
                    style={{
                      backgroundColor: isDark ? "#1A1A2E" : "#FFFFFF",
                      border: isPop ? "2px solid #E94560" : "1px solid #E5E5EA",
                    }}
                  >
                    {isPop && (
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: "#E94560" }}
                      >
                        MOST POPULAR
                      </span>
                    )}

                    <div className="mb-4">
                      <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#6B6B8A" }}>
                        Tier {tier.tier}
                      </p>
                      <h3
                        className="text-xl font-bold mb-1"
                        style={{ color: isDark ? "#FFFFFF" : "#1A1A2E", fontFamily: "'DM Serif Display', serif" }}
                      >
                        {tier.name}
                      </h3>
                      <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#6B6B8A" }}>
                        {tier.label}
                      </p>
                    </div>

                    <div className="mb-4">
                      <span className="text-3xl font-bold" style={{ color: isDark ? "#FFFFFF" : "#1A1A2E" }}>
                        {tier.price}
                      </span>
                      <span className="text-sm ml-1" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#6B6B8A" }}>
                        {tier.period}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#6B6B8A" }}>
                          {tier.seats}
                        </span>
                        {tier.perSeat && (
                          <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#9B9BB0" }}>
                            ({tier.perSeat})
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed mb-6" style={{ color: isDark ? "rgba(255,255,255,0.65)" : "#6B6B8A" }}>
                      {tier.description}
                    </p>

                    <ul className="space-y-2.5 mb-8 flex-1">
                      {tier.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "#1A1A2E" }}>
                          <span className="mt-0.5 flex-shrink-0">
                            {f.included ? <CheckIcon /> : <CrossIcon />}
                          </span>
                          <span className={f.included ? "" : "opacity-50"}>{f.text}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="https://app.hobsonschoice.ai/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                      style={{
                        backgroundColor: isPop ? "#E94560" : isDark ? "rgba(255,255,255,0.1)" : "#1A1A2E",
                        color: "#FFFFFF",
                      }}
                    >
                      {tier.cta}
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Enterprise row */}
            <div
              className="mt-10 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-4"
              style={{ backgroundColor: "#F5F5F7" }}
            >
              <div>
                <p className="text-lg font-semibold" style={{ color: "#1A1A2E" }}>
                  More than 10 users?
                </p>
                <p className="text-sm" style={{ color: "#6B6B8A" }}>
                  Talk to us. Enterprise pricing is based on portfolio size, not headcount.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
                style={{ color: "#E94560" }}
              >
                Book a call
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Comparison callout */}
        <section className="py-16 md:py-20" style={{ backgroundColor: "#F5F5F7" }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p
              className="text-xl md:text-2xl italic leading-relaxed"
              style={{ color: "#1A1A2E", fontFamily: "'DM Serif Display', serif" }}
            >
              A 10-user team on individual Tier 2 accounts pays £625/month. Tier 4 costs £449 — and gives them full agentic workflows. The upgrade conversation takes ten seconds.
            </p>
          </div>
        </section>

        {/* 5. FAQ */}
        <section className="py-20 md:py-28" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center"
              style={{ fontFamily: "'DM Serif Display', serif", color: "#1A1A2E" }}
            >
              Common questions
            </h2>

            <div className="divide-y" style={{ borderColor: "#E5E5EA" }}>
              {faqs.map((faq, i) => (
                <div key={i} className="py-5">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-left gap-4"
                  >
                    <span className="text-base font-semibold" style={{ color: "#1A1A2E" }}>
                      {faq.q}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className={`flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                    >
                      <path d="M10 4v12M4 10h12" stroke="#6B6B8A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6B6B8A" }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Footer CTA */}
        <section className="py-20 md:py-28" style={{ backgroundColor: "#1A1A2E" }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Your tools remind you. Hobson does the work.
            </h2>
            <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.6)" }}>
              Start with a 14-day free trial on any paid tier. No credit card. No commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.hobsonschoice.ai/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#E94560" }}
              >
                Start free trial
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-sm font-semibold text-white transition-colors hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.25)" }}
              >
                Book a demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Pricing;
