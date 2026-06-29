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
  // Complementary accents (matched to homepage tokens)
  teal: "#179B82",
  tealSoft: "#E6F7F2",
  amber: "#E89A2B",
  amberSoft: "#FDF3E0",
};

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const CrossIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);


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
      const fullName = `${getStartedFirst.trim()} ${getStartedLast.trim()}`;
      await supabase.functions.invoke('send-pilot-application', {
        body: {
          name: fullName,
          email: getStartedEmail.trim(),
          phone: getStartedPhone.trim() || null,
          // If no company provided, fall back to the person's name so the CRM
          // client record is named after them instead of the literal "Not provided".
          company: getStartedCompany.trim() || fullName,
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
      tier: 1, seats: "1 seat", perSeat: null, label: "Ideal for individuals",
      priceMonthly: 19.50, priceAnnualMonthly: 15.60, priceAnnualYearly: 187.20,
      badge: "live" as const, badgeText: "Live very soon",
      features: (p: typeof pricing) => [
        { text: "Multi-document AI reasoning", ok: true },
        { text: "Plain English queries", ok: true },
        { text: "Sourced, auditable answers", ok: true },
        { text: formatLimit(t1.monthly_extractions, "document extractions"), ok: true },
        { text: formatLimit(t1.monthly_questions, "questions"), ok: true },
        { text: "Business Memory", ok: true },
        { text: "Proactive Work", ok: true },
        { text: "Learns How You Work", ok: true },
      ],
      cta: "Join the waitlist", ctaStyle: "outline" as const, waitlist: true,
      muted: null,
    },
    {
      tier: 2, seats: "2 seats", perSeat: "£82.50/seat", label: "Ideal for small teams",
      priceMonthly: 165.00, priceAnnualMonthly: 132.00, priceAnnualYearly: 1584.00,
      badge: "coming" as const, badgeText: "Coming later this year",
      features: () => [
        { text: "Everything in Tier 1", ok: true },
        { text: "Business Memory", ok: true },
        { text: formatLimit(t2.monthly_extractions, "document extractions"), ok: true },
        { text: formatLimit(t2.monthly_questions, "questions"), ok: true },
        { text: "Proactive Work", ok: true },
        { text: "Learns How You Work", ok: true },
        { text: "Monthly Activity Summary", ok: true },
        { text: "Personal Working Preferences", ok: true },
      ],
      cta: "Join the waitlist", ctaStyle: "outline" as const, waitlist: true,
      muted: null,
    },
    {
      tier: 3, seats: "5 seats", perSeat: "£50.00/seat", label: "Ideal for growing businesses",
      priceMonthly: 250.00, priceAnnualMonthly: 200.00, priceAnnualYearly: 2400.00,
      badge: "coming" as const, badgeText: "Coming later this year",
      
      features: () => [
        { text: "Everything in Tier 1", ok: true },
        { text: "Business Memory", ok: true },
        { text: formatLimit(t3.monthly_extractions, "document extractions"), ok: true },
        { text: formatLimit(t3.monthly_questions, "questions"), ok: true },
        { text: "Proactive Work", ok: true },
        { text: "Learns How You Work", ok: true },
        { text: "Monthly Activity Summary", ok: true },
        { text: "Personal Working Preferences", ok: true },
      ],
      cta: "Join the waitlist", ctaStyle: "outline" as const, waitlist: true,
      muted: null,
    },
    {
      tier: 4, seats: "10 seats", perSeat: "£45.00/seat", label: "Ideal for larger organisations",
      priceMonthly: 450.00, priceAnnualMonthly: 360.00, priceAnnualYearly: 4320.00,
      badge: "coming" as const, badgeText: "Coming later this year",
      
      features: () => [
        { text: "Everything in Tier 1", ok: true },
        { text: "Business Memory", ok: true },
        { text: formatLimit(t4.monthly_extractions, "document extractions"), ok: true },
        { text: formatLimit(t4.monthly_questions, "questions"), ok: true },
        { text: "Proactive Work", ok: true },
        { text: "Learns How You Work", ok: true },
        { text: "Monthly Activity Summary", ok: true },
        { text: "Personal Working Preferences", ok: true },
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
        <meta property="og:title" content="Pricing | Hobson AI — Plans for operators, occupiers and owners of real estate" />
        <meta property="og:description" content="Start free with Tier 1 or join the waitlist for the full Hobson platform. Plans from £19.50/month. No card required to try." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hobsonschoice.ai/pricing" />
        <meta property="og:site_name" content="Hobson AI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pricing | Hobson AI — Plans for operators, occupiers and owners of real estate" />
        <meta name="twitter:description" content="Start free with Tier 1 or join the waitlist for the full Hobson platform. Plans from £19.50/month. No card required to try." />
        <meta name="twitter:site" content="@HobsonAI" />
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
              <span style={{ color: C.navy }}>Choose your </span>
              <span style={{ background: `linear-gradient(90deg, ${C.purple}, ${C.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>plan</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 text-center">Every plan includes the complete Hobson experience. Choose the plan that best matches the size of your team and the amount of work you'd like Hobson to take care of.</p>

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
                  { title: "It is not a simple upload.", body: "When you add a document, Hobson reads it using AI — extracting meaning, relationships and obligations so it can answer questions accurately from day one.", accent: C.purple },
                  { title: "The work happens once.", body: "Every document is processed thoroughly on the way in. Once done, it is done. You will never pay for the same document again.", accent: C.teal },
                  { title: "The fee reflects the work.", body: "Leases are complex and take more processing. Simpler documents cost less. You only pay for what you bring in.", accent: C.amber },
                  { title: "You are in control.", body: "The more documents you have, the more you pay. The fewer you have, the less. Add more later at any time at the same rate.", accent: C.teal },
                ].map(r => (
                  <div key={r.title} className="rounded-xl p-5 sm:p-6" style={{ background: C.bg, border: `1px solid ${C.border}`, borderLeft: `4px solid ${r.accent}` }}>
                    <p className="text-sm font-bold mb-1" style={{ color: r.accent }}>{r.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VALUE LADDER CALLOUT */}
        <section className="py-10 sm:py-14 md:py-20 px-4 sm:px-6" style={{ background: `linear-gradient(135deg, ${C.amberSoft}, ${C.tealSoft})` }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: C.navy }}>
                Why do the plans change?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.muted }}>
                Every plan includes the same Hobson. The difference is how much work you'd like him to take care of.
              </p>
            </div>

            {/* Every plan includes */}
            <div className="rounded-2xl p-6 sm:p-8 mb-10" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: C.purple }}>Every plan includes</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "The same Hobson",
                  "The same specialist team",
                  "The same intelligence",
                  "The same ability to answer questions and complete work",
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.greenBg }}>
                      <CheckIcon />
                    </div>
                    <span className="text-sm font-medium" style={{ color: C.navy }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier table */}
            <div className="rounded-2xl overflow-hidden mb-10" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
              <div className="grid grid-cols-3 gap-0">
                <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ background: C.bgAlt, color: C.purple, borderBottom: `1px solid ${C.border}` }}>Tier</div>
                <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider col-span-2" style={{ background: C.bgAlt, color: C.purple, borderBottom: `1px solid ${C.border}` }}>Designed for</div>
                <div className="px-4 py-3 text-sm font-semibold" style={{ color: C.navy, borderBottom: `1px solid ${C.border}` }}>Tier 1</div>
                <div className="px-4 py-3 text-sm col-span-2" style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>Individuals and smaller portfolios</div>
                <div className="px-4 py-3 text-sm font-semibold" style={{ color: C.navy, borderBottom: `1px solid ${C.border}` }}>Tier 2</div>
                <div className="px-4 py-3 text-sm col-span-2" style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>Small teams working together</div>
                <div className="px-4 py-3 text-sm font-semibold" style={{ color: C.navy, borderBottom: `1px solid ${C.border}` }}>Tier 3</div>
                <div className="px-4 py-3 text-sm col-span-2" style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>Growing businesses managing more work</div>
                <div className="px-4 py-3 text-sm font-semibold" style={{ color: C.navy }}>Tier 4</div>
                <div className="px-4 py-3 text-sm col-span-2" style={{ color: C.muted }}>Larger organisations supporting more users and larger portfolios</div>
              </div>
            </div>

            {/* Higher tiers increase */}
            <div className="rounded-2xl p-6 sm:p-8 mb-10" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: C.purple }}>Higher tiers increase</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "The number of people who can work with Hobson",
                  "The number of documents Hobson can process",
                  "The number of questions he can answer",
                  "The amount of work he can take care of each month",
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: C.purpleBadgeBg }}>
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke={C.purple} strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <span className="text-sm" style={{ color: C.navy }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Closing statement */}
            <div className="text-center space-y-4">
              <p className="text-sm sm:text-base font-semibold" style={{ color: C.navy }}>
                The experience remains exactly the same.
              </p>
              <div className="space-y-1 text-sm sm:text-base leading-relaxed" style={{ color: C.muted }}>
                <p>You'll always speak to Hobson.</p>
                <p>He'll always rely on the same trusted team of specialists.</p>
                <p>The only difference is the capacity available to support your organisation.</p>
              </div>
              <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto pt-2" style={{ color: C.muted }}>
                A single hour of a property professional's time often costs more than an entire month's subscription. As your organisation grows, Hobson is simply able to take on more of the workload alongside your team.
              </p>
            </div>
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
                <p className="text-sm mb-6" style={{ color: C.muted }}>Start free — no card required. We'll be in touch as soon as we go live.</p>
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
