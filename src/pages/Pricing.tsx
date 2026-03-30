import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { getPricingStructuredData, getOrganizationStructuredData, getBreadcrumbStructuredData } from "@/utils/seo-data";
import { GlobalHeader } from "@/components/GlobalHeader";
import { usePricingData } from "@/hooks/usePricingData";

// Color constants
const C = {
  bg: "#FFFFFF",
  bgAlt: "#F5F4FE",
  stepCircle: "#EEEDFE",
  purple: "#534AB7",
  navy: "#1A1A2E",
  muted: "#6B6B8A",
  border: "#E8E6FD",
  callout: "#EEEDFE",
  greenBg: "#ECFDF5",
  greenText: "#166534",
  amberBg: "#FFFBEB",
  amberText: "#92400E",
  purpleBadgeBg: "#EEEDFE",
};

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const CrossIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const faqs = [
  { q: "When will Tiers 2, 3 and 4 be available?", a: "We are currently working on Tier 1. Tiers 2, 3 and 4 — which unlock the full Knowledge Base platform — are launching later in the year. Join the waitlist to be notified first and to lock in founding member pricing." },
  { q: "What is the Knowledge Base exactly?", a: "It is Hobson's memory about your business. You tell Hobson who your contractors are, how you handle rent arrears, what your communication style is — and it remembers permanently. Every answer and every action it takes reflects what it knows about you." },
  { q: "What is the difference between tiers?", a: "Tier 1 gives you Hobson's AI document reasoning — ask anything across your leases, contracts and compliance documents and get instant, sourced answers. What it does not have is the Knowledge Base. Hobson on Tier 1 does not know your business. It knows your documents.\n\nTiers 2, 3 and 4 are the same product. Every feature, every capability, the full Knowledge Base — identical across all three. The only decision is how many people need access. Same Hobson, more seats, better value per seat as you go up." },
  { q: "Can I start on Tier 1 and upgrade?", a: "Yes. Your Knowledge Base is built as you go — when you upgrade to Tier 2, everything you have taught Hobson stays. There is no reset." },
  { q: "Is there a free trial?", a: "Yes. Tier 1 comes with a 3-day free trial. No credit card required and limited credits to try with." },
  
];

const Badge = ({ children, variant }: { children: React.ReactNode; variant: "live" | "coming" | "onetime" | "tier234" }) => {
  const styles = {
    live: { backgroundColor: C.greenBg, color: C.greenText },
    coming: { backgroundColor: C.amberBg, color: C.amberText },
    onetime: { backgroundColor: '#FFF7ED', color: '#EA580C' },
    tier234: { backgroundColor: C.purpleBadgeBg, color: C.purple },
  };
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full inline-block" style={styles[variant]}>{children}</span>;
};

const Pricing = () => {
  const { pricing, getTierLimit, loading } = usePricingData();
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [leases, setLeases] = useState(0);
  const [documents, setDocuments] = useState(0);
  const [overageModalOpen, setOverageModalOpen] = useState(false);

  const t1 = getTierLimit(1);

  // Calculator
  const leaseSubtotal = leases * pricing.cost_per_lease;
  const docSubtotal = documents * pricing.cost_per_document;
  const rawTotal = leaseSubtotal + docSubtotal;
  const minimumApplies = rawTotal > 0 && rawTotal < pricing.minimum_fee;
  const total = rawTotal === 0 ? 0 : Math.max(rawTotal, pricing.minimum_fee);

  const openWaitlist = () => { setWaitlistSubmitted(false); setWaitlistEmail(""); setWaitlistOpen(true); };

  const tiers = [
    {
      tier: 1, seats: "1 seat", perSeat: null, label: "No Knowledge Base",
      priceMonthly: 19.50, priceAnnualMonthly: 15.60, priceAnnualYearly: 187.20,
      badge: "live" as const, badgeText: "Live today",
      features: (p: typeof pricing) => [
        { text: "Multi-document AI reasoning", ok: true },
        { text: "Plain English queries", ok: true },
        { text: "Sourced, auditable answers", ok: true },
        { text: `${t1.monthly_extractions} document extractions per month`, ok: true },
        { text: `${t1.monthly_questions} questions per month`, ok: true },
        
        { text: "Knowledge Base", ok: false },
        { text: "Workflow automation", ok: false },
        { text: "Action memory", ok: false },
      ],
      cta: "Get started", ctaStyle: "solid" as const, waitlist: false,
      muted: `Allowances reset on the 1st of each month.`,
    },
    {
      tier: 2, seats: "2 seats", perSeat: "£82.50/seat", label: "Full platform",
      priceMonthly: 165.00, priceAnnualMonthly: 132.00, priceAnnualYearly: 1584.00,
      badge: "coming" as const, badgeText: "Coming later this year",
      features: () => [
        { text: "Everything in Tier 1", ok: true },
        { text: "Knowledge Base", ok: true },
        { text: "Unlimited document extractions", ok: true },
        { text: "Unlimited questions", ok: true },
        { text: "Workflow automation", ok: true },
        { text: "Action memory", ok: true },
        { text: "Monthly impact summaries", ok: true },
        { text: "Personal shortcuts", ok: true },
      ],
      cta: "Join the waitlist", ctaStyle: "outline" as const, waitlist: true,
      muted: "Coming later this year",
    },
    {
      tier: 3, seats: "5 seats", perSeat: "£50.00/seat", label: "Full platform",
      priceMonthly: 250.00, priceAnnualMonthly: 200.00, priceAnnualYearly: 2400.00,
      badge: "coming" as const, badgeText: "Coming later this year",
      description: "The full Hobson platform for up to five people. Everything Tier 2 includes — identical features, more seats, better value per seat.",
      features: () => [],
      cta: "Join the waitlist", ctaStyle: "outline" as const, waitlist: true,
      muted: "Coming later this year",
    },
    {
      tier: 4, seats: "10 seats", perSeat: "£45.00/seat", label: "Full platform",
      priceMonthly: 450.00, priceAnnualMonthly: 360.00, priceAnnualYearly: 4320.00,
      badge: "coming" as const, badgeText: "Coming later this year",
      description: "The full Hobson platform for up to ten people. Everything Tier 2 includes — identical features, your best per-seat price.",
      features: () => [],
      cta: "Join the waitlist", ctaStyle: "outline" as const, waitlist: true,
      muted: "Coming later this year",
    },
  ];

  if (loading) {
    return (
      <>
        <GlobalHeader />
        <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
          <div className="animate-pulse h-8 w-48 rounded" style={{ background: C.callout }} />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pricing | Hobson AI — Specialised AI for Property Management</title>
        <meta name="description" content="Compare Hobson AI pricing tiers. Start free or choose a plan that fits your property management needs." />
        <link rel="canonical" href="https://hobsonschoice.ai/pricing" />
        <script type="application/ld+json">{JSON.stringify(getPricingStructuredData())}</script>
        <script type="application/ld+json">{JSON.stringify(getOrganizationStructuredData())}</script>
        <script type="application/ld+json">{JSON.stringify(getBreadcrumbStructuredData([
          { name: "Home", url: "https://hobsonschoice.ai" },
          { name: "Pricing", url: "https://hobsonschoice.ai/pricing" }
        ]))}</script>
      </Helmet>

      <GlobalHeader />

      <main id="main-content" style={{ color: C.navy }}>

        {/* PAGE HEADER */}
        <section className="pt-16 sm:pt-24 md:pt-28 pb-10 sm:pb-16 md:pb-24 px-4 sm:px-6" style={{ background: C.bg }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.purple }}>Pricing</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ color: C.navy }}>Simple, honest pricing.</h1>
            <p className="text-base sm:text-lg mb-6" style={{ color: C.muted }}>One-time extraction fee to get started. Then a monthly plan that fits your team.</p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-2">
              {["Extract", "Query", "Learn"].map((step, i) => (
                <React.Fragment key={step}>
                  <span className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: C.stepCircle, color: C.purple }}>{step}</span>
                  {i < 2 && <span className="text-base font-bold" style={{ color: C.navy }}>→</span>}
                </React.Fragment>
              ))}
            </div>
            
          </div>
        </section>

        {/* ONBOARDING */}
        <section className="py-8 sm:py-12 md:py-20 px-4 sm:px-6" style={{ background: '#F7F7F8' }} id="onboarding">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: C.navy }}>Extract your documents</h2>
              <Badge variant="onetime">One-time fee</Badge>
            </div>
            <p className="text-sm sm:text-base mb-10" style={{ color: C.muted }}>
              Before Hobson can reason across your documents it needs to read and understand them. This is not a file upload — it is AI extraction. It happens once and is never repeated for the same document.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calculator */}
              <div className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: C.navy }}>Estimate your onboarding cost</h3>

                <div className="space-y-5 mb-6">
                  {/* Leases */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-semibold" style={{ color: C.navy }}>How many leases?</label>
                      <span className="text-xs" style={{ color: C.muted }}>£{pricing.cost_per_lease.toFixed(2)} each</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: C.muted }}>Complex documents - Leases and occupational licences</p>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setLeases(Math.max(0, leases - 1))} className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ border: `1px solid ${C.border}`, color: C.navy }}>−</button>
                      <input type="number" min={0} value={leases} onChange={e => setLeases(Math.max(0, parseInt(e.target.value) || 0))} className="w-20 text-center rounded-lg px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2" style={{ border: `1px solid ${C.border}`, color: C.navy }} />
                      <button type="button" onClick={() => setLeases(leases + 1)} className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ border: `1px solid ${C.border}`, color: C.navy }}>+</button>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-semibold" style={{ color: C.navy }}>How many other documents?</label>
                      <span className="text-xs" style={{ color: C.muted }}>£{pricing.cost_per_document.toFixed(2)} each</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: C.muted }}>Compliance certificates, insurance policies, contracts, process guides, anything else</p>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setDocuments(Math.max(0, documents - 1))} className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ border: `1px solid ${C.border}`, color: C.navy }}>−</button>
                      <input type="number" min={0} value={documents} onChange={e => setDocuments(Math.max(0, parseInt(e.target.value) || 0))} className="w-20 text-center rounded-lg px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2" style={{ border: `1px solid ${C.border}`, color: C.navy }} />
                      <button type="button" onClick={() => setDocuments(documents + 1)} className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ border: `1px solid ${C.border}`, color: C.navy }}>+</button>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="rounded-xl p-4 mb-4" style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between" style={{ color: C.muted }}>
                      <span>Leases: {leases} × £{pricing.cost_per_lease.toFixed(2)}</span>
                      <span>£{leaseSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: C.muted }}>
                      <span>Documents: {documents} × £{pricing.cost_per_document.toFixed(2)}</span>
                      <span>£{docSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="my-2" style={{ borderTop: `1px solid ${C.border}` }} />
                    <div className="flex justify-between text-base font-bold" style={{ color: C.navy }}>
                      <span>Your onboarding fee</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                    {minimumApplies && <p className="text-xs mt-1" style={{ color: C.muted }}>Minimum fee of £{pricing.minimum_fee.toFixed(2)} applies</p>}
                  </div>
                </div>

                <div className="space-y-1.5 mb-5">
                  {["The same document is never charged twice", "Ready in minutes — Hobson can answer questions immediately after", "Add documents any time — each new upload charged at the same rate"].map(t => (
                    <p key={t} className="text-xs flex items-start gap-1.5" style={{ color: C.muted }}>
                      <span style={{ color: C.purple }}>✓</span> {t}
                    </p>
                  ))}
                </div>

                <button
                  disabled={total === 0}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: C.purple }}
                >
                  Pay onboarding fee and get started
                </button>
                <p className="text-center text-xs mt-2.5" style={{ color: C.muted }}>
                  Secure payment. You will not be charged again for these documents.
                </p>
              </div>

              {/* Reason blocks */}
              <div className="space-y-4">
                {[
                  { title: "It is not a simple upload.", body: "When you add a document, Hobson reads it using AI — extracting meaning, relationships and obligations so it can answer questions accurately from day one." },
                  { title: "The work happens once.", body: "Every document is processed thoroughly on the way in. Once done, it is done. You will never pay for the same document again." },
                  { title: "The fee reflects the work.", body: "Leases are complex and take more processing. Simpler documents cost less. You only pay for what you bring in." },
                  { title: "You are in control.", body: "The more documents you have, the more you pay. The fewer you have, the less. Add more later at any time at the same rate." },
                ].map(r => (
                  <div key={r.title} className="rounded-xl p-5 sm:p-6" style={{ background: C.bg, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.purple}` }}>
                    <p className="text-sm font-bold mb-1" style={{ color: C.purple }}>{r.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2 — SUBSCRIPTION */}
        <section className="py-8 sm:py-12 md:py-20 px-4 sm:px-6" style={{ background: C.bg }} id="plans">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: C.navy }}>Choose your plan</h2>
            <p className="text-sm sm:text-base mb-8" style={{ color: C.muted }}>
              Once your documents are extracted, your subscription determines what Hobson can do with them — and how many people can use it.
            </p>

            {/* Billing toggle */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <div className="inline-flex items-center rounded-full p-1" style={{ border: `1px solid ${C.border}`, background: C.bgAlt }}>
                <button onClick={() => setIsAnnual(false)} className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200" style={{ background: !isAnnual ? C.purple : "transparent", color: !isAnnual ? "#fff" : C.muted }}>Monthly</button>
                <button onClick={() => setIsAnnual(true)} className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200" style={{ background: isAnnual ? C.purple : "transparent", color: isAnnual ? "#fff" : C.muted }}>Annual</button>
              </div>
              {isAnnual && <Badge variant="coming">Save 20%</Badge>}
            </div>

            {/* Tier cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tiers.map(tier => {
                const hasAnnual = isAnnual;
                const displayPrice = hasAnnual ? `£${tier.priceAnnualMonthly.toFixed(2)}` : `£${tier.priceMonthly.toFixed(2)}`;
                const perSeatAnnual = tier.perSeat && tier.seats.includes("2") ? `£${(tier.priceAnnualMonthly / 2).toFixed(2)}/seat`
                  : tier.perSeat && tier.seats.includes("5") ? `£${(tier.priceAnnualMonthly / 5).toFixed(2)}/seat`
                  : tier.perSeat && tier.seats.includes("10") ? `£${(tier.priceAnnualMonthly / 10).toFixed(2)}/seat`
                  : null;
                const displayPerSeat = hasAnnual ? perSeatAnnual : tier.perSeat;
                const featureList = tier.features(pricing);
                const isLive = tier.badge === "live";

                return (
                  <div key={tier.tier} className="rounded-xl p-6 flex flex-col" style={{ background: C.bg, border: isLive ? `2px solid ${C.purple}` : `1px solid ${C.border}` }}>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: C.purple }}>Tier {tier.tier}</p>
                        <Badge variant={tier.badge}>{tier.badgeText}</Badge>
                      </div>
                      <p className="text-xs" style={{ color: C.muted }}>{tier.label}</p>
                    </div>

                    <div className="mb-4">
                      {hasAnnual && <div className="text-sm line-through mb-0.5" style={{ color: C.muted }}>£{tier.priceMonthly.toFixed(2)}/mo</div>}
                      <span className="text-3xl font-bold" style={{ color: C.navy }}>{displayPrice}</span>
                      <span className="text-sm ml-1" style={{ color: C.muted }}>/ month</span>
                      {hasAnnual && tier.priceAnnualYearly && (
                        <div className="text-xs mt-1" style={{ color: C.muted }}>billed as £{tier.priceAnnualYearly.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} annually</div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs" style={{ color: C.muted }}>{tier.seats}</span>
                        {displayPerSeat && <span className="text-xs" style={{ color: C.muted }}>({displayPerSeat})</span>}
                      </div>
                    </div>

                    {(tier as any).description && <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>{(tier as any).description}</p>}

                    {featureList.length > 0 && (
                      <ul className="space-y-2 mb-5">
                        {featureList.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm" style={{ color: f.ok ? C.navy : C.muted }}>
                            <span className="mt-0.5 flex-shrink-0">{f.ok ? <CheckIcon /> : <CrossIcon />}</span>
                            <span className={f.ok ? "" : "opacity-50"}>{f.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {tier.muted && <p className="text-xs mb-2 mt-auto" style={{ color: C.muted }}>{tier.muted}</p>}

                    <div className="mt-auto">
                      {tier.waitlist ? (
                        <button onClick={openWaitlist} className="block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all" style={{ border: `2px solid ${C.purple}`, color: C.purple, background: "transparent" }}>
                          {tier.cta}
                        </button>
                      ) : (
                        <a href="https://app.hobsonschoice.ai/signup" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: C.purple }}>
                          {tier.cta}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enterprise */}
            <div className="mt-8 rounded-xl p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left" style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
              <div>
                <p className="text-lg font-semibold" style={{ color: C.navy }}>More than 10 users?</p>
                <p className="text-sm" style={{ color: C.muted }}>Talk to us. Enterprise pricing is based on portfolio size, not headcount.</p>
              </div>
              <button onClick={openWaitlist} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap" style={{ border: `2px solid ${C.purple}`, color: C.purple, background: "transparent" }}>
                Register interest
              </button>
            </div>
          </div>
        </section>

        {/* KNOWLEDGE BASE CALLOUT */}
        <section className="py-8 sm:py-12 md:py-20 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, hsl(210 40% 96%), hsl(210 30% 90%))" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ color: C.navy }}>
              Why does the Knowledge Base change everything?
            </h2>
            <p className="text-lg sm:text-xl italic mb-6" style={{ color: C.muted }}>
              Tier 1 answers your questions. Tier 2 knows your business.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: C.muted }}>
              The Knowledge Base is the difference between an AI that retrieves information from your documents and one that understands how you work — your contractors, your contacts, your policies, your obligations, your preferences. Every answer shaped by your business. Every action reflecting how you operate. That transformation is what Tier 2, 3 and 4 deliver. And it is worth considerably more than the difference in price.
            </p>
            <p className="text-sm sm:text-base font-semibold" style={{ color: C.navy }}>
              A single hour of a manager's time costs more than a month of Tier 2. The Knowledge Base saves multiples of that every week.
            </p>
          </div>
        </section>


        {/* FAQ */}
        <section className="py-8 sm:py-12 md:py-20 px-4 sm:px-6" style={{ background: C.bg }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-12 text-center" style={{ color: C.navy }}>Common questions</h2>
            <div style={{ borderTop: `1px solid ${C.border}` }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: `1px solid ${C.border}` }} className="py-5">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between text-left gap-4">
                    <span className="text-base font-semibold" style={{ color: C.navy }}>{faq.q}</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>
                      <path d="M10 4v12M4 10h12" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  {openFaq === i && <p className="mt-3 text-sm leading-relaxed whitespace-pre-line" style={{ color: C.muted }}>{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Waitlist Modal */}
      {waitlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ background: "rgba(26,26,46,0.4)" }} onClick={() => setWaitlistOpen(false)}>
          <div className="rounded-xl p-5 sm:p-8 max-w-md w-full mx-4 shadow-2xl" style={{ background: C.bg, border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            {waitlistSubmitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: C.greenBg }}><CheckIcon /></div>
                <p className="text-lg font-semibold mb-2" style={{ color: C.navy }}>You're on the list.</p>
                <p className="text-sm" style={{ color: C.muted }}>We'll be in touch.</p>
                <button onClick={() => setWaitlistOpen(false)} className="mt-6 text-sm font-medium transition-opacity hover:opacity-80" style={{ color: C.purple }}>Close</button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2" style={{ color: C.navy }}>Join the waitlist</h3>
                <p className="text-sm mb-6" style={{ color: C.muted }}>Be first to know when we launch. No spam, ever.</p>
                <form onSubmit={e => { e.preventDefault(); if (waitlistEmail.trim()) setWaitlistSubmitted(true); }}>
                  <input type="email" required placeholder="you@example.com" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)} className="w-full rounded-lg px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2" style={{ border: `1px solid ${C.border}`, color: C.navy }} autoFocus />
                  <button type="submit" className="w-full py-3 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: C.purple }}>Join waitlist</button>
                </form>
                <button onClick={() => setWaitlistOpen(false)} className="w-full mt-3 text-sm text-center transition-colors hover:opacity-80" style={{ color: C.muted }}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tier 1 Overage Modal */}
      {overageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ background: "rgba(26,26,46,0.4)" }} onClick={() => setOverageModalOpen(false)}>
          <div className="rounded-xl p-5 sm:p-8 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" style={{ background: C.bg, border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: C.navy }}>You have used your {t1.monthly_extractions} included extractions this month.</h3>
            <p className="text-sm mb-6" style={{ color: C.muted }}>You have two options:</p>

            <div className="space-y-4">
              {t1.overage_behaviour === "charge" && (
                <div className="rounded-xl p-5" style={{ background: C.bgAlt, border: `2px solid ${C.purple}` }}>
                  <h4 className="font-bold mb-1" style={{ color: C.navy }}>Upload now</h4>
                  <p className="text-sm mb-3" style={{ color: C.muted }}>Pay for additional extractions at £{pricing.cost_per_lease.toFixed(2)} per lease or £{pricing.cost_per_document.toFixed(2)} per document.</p>
                  <button onClick={() => { setOverageModalOpen(false); document.getElementById("onboarding")?.scrollIntoView({ behavior: "smooth" }); }} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: C.purple }}>Upload more documents</button>
                </div>
              )}
              <div className="rounded-xl p-5" style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
                <h4 className="font-bold mb-1" style={{ color: C.navy }}>Wait until next month</h4>
                <p className="text-sm mb-3" style={{ color: C.muted }}>Your {t1.monthly_extractions} extraction allowance resets on the 1st of next month at no extra cost.</p>
                <button onClick={() => setOverageModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all" style={{ border: `2px solid ${C.purple}`, color: C.purple, background: "transparent" }}>I'll wait</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Pricing;
