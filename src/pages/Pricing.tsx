import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { structuredData, getBreadcrumbStructuredData } from "@/utils/seo-data";
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

const faqGroups = [
  {
    heading: "Getting Started & Trials",
    items: [
      { q: "Is there a free trial?", a: "Yes. Tier 1 comes with a free 3-day trial — no credit card required. You can upload your first document and start asking questions about it within minutes of signing up. Tier 2, 3 and 4 are available to join the waitlist ahead of their launch later this year, with founding member pricing locked in for early signups." },
      { q: "When will Tiers 2, 3 and 4 be available?", a: "Tiers 2, 3 and 4 — which unlock the full Knowledge Base platform, workflow automation and action memory — are launching later this year. Join the waitlist now to be notified first and to lock in founding member pricing before public launch." },
      { q: "Can I start on Tier 1 and upgrade later?", a: "Yes. When you upgrade to Tier 2 or above, everything you have already taught Hobson stays. Your documents remain in your account. Your Knowledge Base carries over. There is no reset, no re-upload and no loss of work. Upgrading simply unlocks the next layer of capability on top of what you have already built." },
      { q: "Can I use Hobson on my phone?", a: "Yes. Hobson has a mobile version available on Tier 1, giving you access to your portfolio documents and AI query capability from anywhere. No desktop required to get started." },
    ],
  },
  {
    heading: "Understanding The Tiers",
    items: [
      { q: "What is the difference between Tier 1 and Tiers 2, 3 and 4?", a: "Tier 1 gives you Hobson's AI document reasoning — ask anything across your leases, contracts and compliance documents and get instant, sourced, auditable answers. What it does not have is the Knowledge Base. Hobson on Tier 1 knows your documents. It does not yet know your business. Tiers 2, 3 and 4 unlock the full platform — the Knowledge Base, workflow automation, action memory, monthly impact summaries and personal shortcuts. Every feature and capability is identical across Tiers 2, 3 and 4. The only difference is how many seats you need. Same Hobson, more people, better value per seat as you scale." },
      { q: "What is the Knowledge Base?", a: "The Knowledge Base is Hobson's persistent memory about your business. You tell Hobson who your contractors are, how you handle rent arrears, what your approval thresholds are, how you like your reports formatted — and it remembers permanently. Every answer and every action it takes reflects what it knows about how your business operates. It is what transforms Hobson from a smart document tool into an AI that behaves like an informed member of your team. The Knowledge Base is included in Tiers 2, 3 and 4 and becomes more valuable the longer you use it." },
      { q: "What happens to my Knowledge Base if I leave?", a: "Your data belongs to you and can be exported at any time. However it is worth understanding what leaving means in practice — the institutional memory Hobson has built about your business, your contractors, your preferences and your compliance history does not transfer to another tool. That knowledge lives in Hobson because Hobson built it. The longer you use Hobson at Tier 2 or above, the more valuable that memory becomes." },
      { q: "What if I need more than 10 seats?", a: "Enterprise pricing is available for organisations with more than 10 users. Enterprise packages are based on usage and portfolio size rather than headcount, and include bespoke onboarding and dedicated support. Contact the team at rochelle.t@hobsonschoice.ai to discuss your requirements." },
    ],
  },
  {
    heading: "Pricing & Billing",
    items: [
      { q: "What does annual billing mean and how does the 20% saving work?", a: "Annual billing means you pay for twelve months upfront in a single payment. The saving versus monthly billing is 20% across all tiers. Tier 1 billed annually costs £187 upfront — equivalent to £15.60 per month. Tier 2 costs £1,584 upfront — equivalent to £132 per month. Tier 3 costs £2,400 upfront — equivalent to £200 per month. Tier 4 costs £4,320 upfront — equivalent to £360 per month. Monthly billing is available at the standard rate if you prefer flexibility." },
      { q: "What if I need more documents or questions than my tier includes?", a: "No problem. Additional document ingestion is available at £0.30 per document, charged once only — the same document is never charged twice. Once Hobson has read and understood a document it stays in your account permanently at no further cost. For additional questions during busy periods, top-up packs are available at £7.50 per 100 questions. You are always in control of what you spend." },
      { q: "Do I need technical skills to set up or use Hobson?", a: "No. Hobson is designed to be used in plain English. You ask questions the way you would ask a colleague — \"When is the next rent review on Unit 4?\" or \"Which of my properties have EPC certificates expiring in the next six months?\" — and Hobson answers directly from your documents and Knowledge Base. No technical training, no complex interfaces, no specialist knowledge required." },
    ],
  },
  {
    heading: "Who It Is For & Trust",
    items: [
      { q: "We are not a property management company — we are a retailer or hospitality business with leases. Is Hobson for us?", a: "Yes — and this is one of the most important things to understand about Hobson. It is built for any business where property is a material operating cost, not just businesses whose primary activity is property management. A retailer with 30 store leases, a restaurant group with 15 sites, or a corporate with a regional office estate all face exactly the same obligations — rent reviews, break clauses, EPC deadlines, compliance certificates — and Hobson manages all of them. You do not need to be in the property industry to benefit. You just need property to be part of how your business operates." },
      { q: "We already use property management software. Do we need to replace it?", a: "No. Hobson is designed to work alongside your existing systems, not replace them. Your current software stores and organises information. Hobson reasons across it, acts on it and delivers the work your team currently does manually. There is no rip-and-replace requirement. Hobson connects to your existing document sources and operates inside your current workflows — adding an intelligence layer on top of what you already have." },
      { q: "Does Hobson help with Building Safety Act and EPC compliance?", a: "Yes. Hobson reads your compliance certificates, builds a live register, flags upcoming deadlines at 90, 60 and 30 days, instructs contractors, verifies completed certificates and files the outcome automatically. This applies to EPC obligations, Building Safety Act requirements, fire safety, EICR, gas safety, HMO licensing, Legionella, asbestos and other compliance categories. Compliance deadlines exist whether or not you manage them efficiently — Hobson makes sure they are never missed." },
      { q: "How does Hobson handle documents it cannot find an answer in?", a: "Hobson never guesses. If the information you are asking about does not exist in your documents or Knowledge Base, Hobson tells you clearly rather than generating a plausible but potentially incorrect answer. Every answer Hobson provides is sourced and auditable — you can see exactly which document and clause each answer came from. For regulated property decisions, that auditability is not optional. It is essential." },
      { q: "Where is my data stored and is it secure?", a: "All data is encrypted and UK-hosted. Hobson is aligned to ISO 27001 standards. Your data is never used to train AI models — not Hobson's and not any third-party model. Your documents, your Knowledge Base and your business information remain entirely within your account and are never shared with or visible to other clients." },
    ],
  },
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
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [documents, setDocuments] = useState(0);
  const [topUpPacks, setTopUpPacks] = useState(0);
  const [overageModalOpen, setOverageModalOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [getStartedFirst, setGetStartedFirst] = useState("");
  const [getStartedLast, setGetStartedLast] = useState("");
  const [getStartedEmail, setGetStartedEmail] = useState("");
  const [getStartedPhone, setGetStartedPhone] = useState("");
  const [getStartedCompany, setGetStartedCompany] = useState("");
  const [getStartedSubmitting, setGetStartedSubmitting] = useState(false);
  const [getStartedDone, setGetStartedDone] = useState(false);
  const navigate = useNavigate();

  const openSignupModal = () => {
    setGetStartedFirst(""); setGetStartedLast(""); setGetStartedEmail("");
    setGetStartedPhone(""); setGetStartedCompany(""); setGetStartedDone(false);
    setGetStartedOpen(true);
  };

  const handleGetStartedSubmit = async () => {
    if (!getStartedFirst.trim() || !getStartedLast.trim() || !getStartedEmail.trim()) return;
    setGetStartedSubmitting(true);
    try {
      await supabase.functions.invoke('send-pilot-application', {
        body: {
          name: `${getStartedFirst.trim()} ${getStartedLast.trim()}`,
          email: getStartedEmail.trim(),
          phone: getStartedPhone.trim() || null,
          company: getStartedCompany.trim() || "Not provided",
          role: "Not provided",
          source: "pricing-get-started",
        }
      });
      setGetStartedDone(true);
    } catch { /* ignore */ }
    setGetStartedSubmitting(false);
  };

  const t1 = getTierLimit(1);
  const t2 = getTierLimit(2);
  const t3 = getTierLimit(3);
  const t4 = getTierLimit(4);

  const formatLimit = (value: string, unit: string) => {
    const lower = value.toLowerCase();
    if (lower === "unlimited") return `Unlimited ${unit}`;
    return `${value} ${unit}/month`;
  };

  const TOPUP_COST = pricing.cost_per_question_pack;
  const TOPUP_QUESTIONS = pricing.questions_per_pack;
  const TOPUP_QUESTIONS_LABEL = `${TOPUP_QUESTIONS} question${TOPUP_QUESTIONS === 1 ? "" : "s"}`;

  // Calculator
  const docSubtotal = documents * pricing.cost_per_document;
  const topUpSubtotal = topUpPacks * TOPUP_COST;
  const rawTotal = docSubtotal + topUpSubtotal;
  const minimumApplies = rawTotal > 0 && rawTotal < pricing.minimum_fee;
  const total = rawTotal === 0 ? 0 : Math.max(rawTotal, pricing.minimum_fee);

  const goToContact = () => navigate("/contact");

  const tiers = [
    {
      tier: 1, seats: "1 seat", perSeat: null, label: "No Knowledge Base",
      priceMonthly: 19.50, priceAnnualMonthly: 15.60, priceAnnualYearly: 187.20,
      badge: "live" as const, badgeText: "Live very soon",
      features: (p: typeof pricing) => [
        { text: "Multi-document AI reasoning", ok: true },
        { text: "Plain English queries", ok: true },
        { text: "Sourced, auditable answers", ok: true },
        { text: formatLimit(t1.monthly_extractions, "document extractions"), ok: true },
        { text: formatLimit(t1.monthly_questions, "questions"), ok: true },
        
        { text: "Knowledge Base", ok: false },
        { text: "Workflow automation", ok: false },
        { text: "Action memory", ok: false },
      ],
      cta: "Get started", ctaStyle: "solid" as const, waitlist: false,
      muted: `Allowances reset on the billing cycle.`,
    },
    {
      tier: 2, seats: "2 seats", perSeat: "£82.50/seat", label: "Full platform",
      priceMonthly: 165.00, priceAnnualMonthly: 132.00, priceAnnualYearly: 1584.00,
      badge: "coming" as const, badgeText: "Coming later this year",
      features: () => [
        { text: "Everything in Tier 1", ok: true },
        { text: "Knowledge Base", ok: true },
        { text: formatLimit(t2.monthly_extractions, "document extractions"), ok: true },
        { text: formatLimit(t2.monthly_questions, "questions"), ok: true },
        { text: "Workflow automation", ok: true },
        { text: "Action memory", ok: true },
        { text: "Monthly impact summaries", ok: true },
        { text: "Personal shortcuts", ok: true },
      ],
      cta: "Join the waitlist", ctaStyle: "outline" as const, waitlist: true,
      muted: null,
    },
    {
      tier: 3, seats: "5 seats", perSeat: "£50.00/seat", label: "Full platform",
      priceMonthly: 250.00, priceAnnualMonthly: 200.00, priceAnnualYearly: 2400.00,
      badge: "coming" as const, badgeText: "Coming later this year",
      
      features: () => [
        { text: "Everything in Tier 1", ok: true },
        { text: "Knowledge Base", ok: true },
        { text: formatLimit(t3.monthly_extractions, "document extractions"), ok: true },
        { text: formatLimit(t3.monthly_questions, "questions"), ok: true },
        { text: "Workflow automation", ok: true },
        { text: "Action memory", ok: true },
        { text: "Monthly impact summaries", ok: true },
        { text: "Personal shortcuts", ok: true },
      ],
      cta: "Join the waitlist", ctaStyle: "outline" as const, waitlist: true,
      muted: null,
    },
    {
      tier: 4, seats: "10 seats", perSeat: "£45.00/seat", label: "Full platform",
      priceMonthly: 450.00, priceAnnualMonthly: 360.00, priceAnnualYearly: 4320.00,
      badge: "coming" as const, badgeText: "Coming later this year",
      
      features: () => [
        { text: "Everything in Tier 1", ok: true },
        { text: "Knowledge Base", ok: true },
        { text: formatLimit(t4.monthly_extractions, "document extractions"), ok: true },
        { text: formatLimit(t4.monthly_questions, "questions"), ok: true },
        { text: "Workflow automation", ok: true },
        { text: "Action memory", ok: true },
        { text: "Monthly impact summaries", ok: true },
        { text: "Personal shortcuts", ok: true },
      ],
      cta: "Join the waitlist", ctaStyle: "outline" as const, waitlist: true,
      muted: null,
    },
  ];

  if (loading) {
    return (
      <>
        <GlobalHeader />
        <main style={{ background: C.bg, color: C.navy }}>
          <section className="pt-10 sm:pt-14 md:pt-16 pb-8 sm:pb-12 md:pb-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-3 mb-10">
                <div className="animate-pulse h-4 w-64 mx-auto rounded" style={{ background: C.callout }} />
                <div className="animate-pulse h-10 w-80 mx-auto rounded" style={{ background: C.callout }} />
                <div className="animate-pulse h-5 w-96 mx-auto rounded" style={{ background: C.callout }} />
              </div>
              <div className="flex justify-center mb-8">
                <div className="animate-pulse h-10 w-52 rounded-full" style={{ background: C.callout }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1,2,3,4].map(i => (
                  <div key={i} className="rounded-2xl p-6 space-y-4" style={{ border: `1px solid ${C.border}` }}>
                    <div className="animate-pulse h-5 w-20 rounded" style={{ background: C.callout }} />
                    <div className="animate-pulse h-8 w-32 rounded" style={{ background: C.callout }} />
                    <div className="space-y-2">
                      {[1,2,3,4,5].map(j => (
                        <div key={j} className="animate-pulse h-4 w-full rounded" style={{ background: C.callout }} />
                      ))}
                    </div>
                    <div className="animate-pulse h-10 w-full rounded-lg" style={{ background: C.callout }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pricing | Hobson AI — AI assistance to operators, occupiers and owners of real estate</title>
        <meta name="description" content="Compare Hobson AI pricing tiers. Start free or choose a plan that fits your property management needs." />
        <link rel="canonical" href="https://hobsonschoice.ai/pricing" />
<script type="application/ld+json">{JSON.stringify(structuredData.softwareApplication)}</script>
        <script type="application/ld+json">{JSON.stringify(structuredData.organization)}</script>
        <script type="application/ld+json">{JSON.stringify(getBreadcrumbStructuredData([
          { name: "Home", url: "https://hobsonschoice.ai" },
          { name: "Pricing", url: "https://hobsonschoice.ai/pricing" }
        ]))}</script>
        <script type="application/ld+json">{JSON.stringify(structuredData.faqPagePricing)}</script>
      </Helmet>

      <GlobalHeader />

      <main id="main-content" style={{ color: C.navy }}>

        {/* SUBSCRIPTION */}
        <section className="pt-10 sm:pt-14 md:pt-16 pb-8 sm:pb-12 md:pb-20 px-4 sm:px-6" style={{ background: C.bg }} id="plans">
          <div className="max-w-7xl mx-auto">
            <p className="text-primary font-semibold tracking-wide uppercase text-sm mb-3 text-center">Simple & Transparent Pricing</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center" style={{ color: C.navy }}>Choose your plan</h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 text-center">Tier 1 knows your documents. Tier 2 – 4 knows your business.</p>

            {/* Billing toggle */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
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
                        <button onClick={goToContact} className="block w-full text-center py-3 rounded-lg text-sm font-semibold transition-all" style={{ border: `2px solid ${C.purple}`, color: C.purple, background: "transparent" }}>
                          {tier.cta}
                        </button>
                      ) : (
                        <button onClick={openSignupModal} className="block w-full text-center py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: C.purple }}>
                          {tier.cta}
                        </button>
                      )}
                      {tier.tier === 1 && (
                        <p className="text-xs text-center mt-2 font-medium" style={{ color: C.purple }}>Free 3-day trial — no card required</p>
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
                <p className="text-sm" style={{ color: C.muted }}>Talk to us. Enterprise pricing is based on usage, not headcount or portfolio size.</p>
              </div>
              <button onClick={goToContact} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap" style={{ border: `2px solid ${C.purple}`, color: C.purple, background: "transparent" }}>
                Contact us
              </button>
            </div>
          </div>
        </section>

        {/* ONBOARDING */}
        <section className="py-8 sm:py-12 md:py-20 px-4 sm:px-6" style={{ background: '#F7F7F8' }} id="onboarding">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: C.navy }}>Have a lot on this month? Buy more credits</h2>
            <p className="text-sm sm:text-base mb-10" style={{ color: C.muted }}>
              Pay for what you need as a top up.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calculator */}
              <div className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: C.navy }}>Estimate what you need</h3>

                <div className="space-y-5 mb-6">
                  {/* Documents */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-semibold" style={{ color: C.navy }}>How many documents?</label>
                      <span className="text-xs" style={{ color: C.muted }}>£{pricing.cost_per_document.toFixed(2)} each</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: C.muted }}>Leases, compliance certificates, deeds, licences, etc</p>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setDocuments(Math.max(0, documents - 1))} className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ border: `1px solid ${C.border}`, color: C.navy }}>−</button>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={documents === 0 ? '' : String(documents)} onChange={e => { const v = e.target.value.replace(/\D/g, ''); setDocuments(v === '' ? 0 : parseInt(v, 10)); }} placeholder="0" className="w-20 text-center rounded-lg px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2" style={{ border: `1px solid ${C.border}`, color: C.navy }} />
                      <button type="button" onClick={() => setDocuments(documents + 1)} className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ border: `1px solid ${C.border}`, color: C.navy }}>+</button>
                    </div>
                  </div>

                  {/* Top-up questions */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-semibold" style={{ color: C.navy }}>Top-up question packs</label>
                      <span className="text-xs" style={{ color: C.muted }}>£{TOPUP_COST.toFixed(2)} per {TOPUP_QUESTIONS_LABEL}</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: C.muted }}>Each pack adds {TOPUP_QUESTIONS_LABEL} to your monthly allowance</p>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setTopUpPacks(Math.max(0, topUpPacks - 1))} className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ border: `1px solid ${C.border}`, color: C.navy }}>−</button>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={topUpPacks === 0 ? '' : String(topUpPacks)} onChange={e => { const v = e.target.value.replace(/\D/g, ''); setTopUpPacks(v === '' ? 0 : parseInt(v, 10)); }} placeholder="0" className="w-20 text-center rounded-lg px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2" style={{ border: `1px solid ${C.border}`, color: C.navy }} />
                      <button type="button" onClick={() => setTopUpPacks(topUpPacks + 1)} className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ border: `1px solid ${C.border}`, color: C.navy }}>+</button>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="rounded-xl p-4 mb-4" style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between" style={{ color: C.muted }}>
                      <span>Documents: {documents} × £{pricing.cost_per_document.toFixed(2)}</span>
                      <span>£{docSubtotal.toFixed(2)}</span>
                    </div>
                    {topUpPacks > 0 && (
                      <div className="flex justify-between" style={{ color: C.muted }}>
                        <span>Top-up questions: {topUpPacks} × £{TOPUP_COST.toFixed(2)} ({topUpPacks * TOPUP_QUESTIONS} questions)</span>
                        <span>£{topUpSubtotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="my-2" style={{ borderTop: `1px solid ${C.border}` }} />
                    <div className="flex justify-between text-base font-bold" style={{ color: C.navy }}>
                      <span>Total</span>
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
                  Checkout
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

        {/* KNOWLEDGE BASE CALLOUT */}
        <section className="py-8 sm:py-12 md:py-20 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, hsl(210 40% 96%), hsl(210 30% 90%))" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ color: C.navy }}>
              Why does the Knowledge Base change everything?
            </h2>
            <p className="text-lg sm:text-xl italic mb-6" style={{ color: C.muted }}>
              Tier 1 answers your questions. Tier 2 – 4 answers them, knowing you.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: C.muted }}>
              The Knowledge Base is the difference between an AI that retrieves information from your documents and one that understands how you work — your contractors, your contacts, your policies, your obligations, your preferences. Every answer shaped by your business. Every action reflecting how you operate. That transformation is what Tier 2, 3 and 4 deliver. And it is worth considerably more than the difference in price.
            </p>
            <p className="text-sm sm:text-base font-semibold" style={{ color: C.navy }}>
              A single hour of a manager's time costs more than a month of Tier 2 - 4. The Knowledge Base saves multiples of that every week.
            </p>
          </div>
        </section>


        {/* FAQ */}
        <section className="py-8 sm:py-12 md:py-20 px-4 sm:px-6" style={{ background: C.bg }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-12 text-center" style={{ color: C.navy }}>Common questions</h2>
            {faqGroups.map((group, gi) => (
              <div key={gi} className={gi > 0 ? "mt-8" : ""}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.purple }}>{group.heading}</p>
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  {group.items.map((faq, fi) => {
                    const key = `${gi}-${fi}`;
                    const isOpen = openFaq === key;
                    return (
                      <div key={key} style={{ borderBottom: `1px solid ${C.border}` }} className="py-5">
                        <button onClick={() => setOpenFaq(isOpen ? null : key)} className="w-full flex items-center justify-between text-left gap-4">
                          <span className="text-base font-semibold" style={{ color: C.navy }}>{faq.q}</span>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                            <path d="M10 4v12M4 10h12" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                        {isOpen && <p className="mt-3 text-sm leading-relaxed whitespace-pre-line" style={{ color: C.muted }}>{faq.a}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>


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

      {/* Get Started Modal */}
      {getStartedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setGetStartedOpen(false)}>
          <div className="rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl" style={{ background: C.bg }} onClick={e => e.stopPropagation()}>
            {getStartedDone ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: C.greenBg }}>
                  <svg width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke={C.greenText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: C.navy }}>You're on the list!</h3>
                <p className="text-sm mb-6" style={{ color: C.muted }}>We'll be in touch very soon with your access details.</p>
                <button onClick={() => setGetStartedOpen(false)} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: C.purple }}>Close</button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-1" style={{ color: C.navy }}>We're not quite open yet</h3>
                <p className="text-sm mb-6" style={{ color: C.muted }}>Register your interest and we'll be in touch as soon as we go live.</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="First name *" value={getStartedFirst} onChange={e => setGetStartedFirst(e.target.value)} className="rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
                    <input type="text" placeholder="Last name *" value={getStartedLast} onChange={e => setGetStartedLast(e.target.value)} className="rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
                  </div>
                  <input type="email" placeholder="Email *" value={getStartedEmail} onChange={e => setGetStartedEmail(e.target.value)} className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
                  <input type="tel" placeholder="Phone (optional)" value={getStartedPhone} onChange={e => setGetStartedPhone(e.target.value)} className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
                  <input type="text" placeholder="Company (optional)" value={getStartedCompany} onChange={e => setGetStartedCompany(e.target.value)} className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2" style={{ border: '1.5px solid #B0ADCF', color: C.navy, background: '#F9F9FC', colorScheme: 'light' }} />
                </div>
                <button onClick={handleGetStartedSubmit} disabled={getStartedSubmitting || !getStartedFirst.trim() || !getStartedLast.trim() || !getStartedEmail.trim()} className="w-full mt-5 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50" style={{ background: C.purple }}>
                  {getStartedSubmitting ? "Submitting…" : "Get early access"}
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
