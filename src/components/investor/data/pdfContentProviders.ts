// Centralized PDF content providers
// When updating visual components, update these functions to keep PDFs in sync

export const getUKMarketAssumptionsPdfContent = (): string[] => [
  "UK Market Assumptions — Evidence-based framework for market sizing:",
  "",
  "1. Size of the UK Real Estate Business Market:",
  "• Total UK businesses: 5.6 million",
  "• Real estate activities represent 4.2% → 235,200 real estate businesses",
  "• Source: ONS – Real estate activities by employment size",
  "",
  "2. Business Size Breakdown (Real Estate Only):",
  "• Small (1–9 employees): 96% = 225,792 businesses",
  "• Medium (10–49): 2.7% = 6,350 businesses",
  "• Large (50–249): 0.6% = 1,411 businesses",
  "• Enterprise (250+): 0.1% = 235 businesses",
  "• Source: BEIS / ONS",
  "",
  "3. AI Investment Readiness:",
  "• 65% of UK businesses are primed to invest in AI",
  "• Source: Deloitte – State of AI in the Enterprise (5th Edition)",
  "",
  "4. Labour Cost Baseline:",
  "• Average junior real estate salary: £30,000",
  "• Source: Macdonald & Company – UK Salary Report 2023/24",
  "",
  "5. AI Efficiency Gain Assumption — 20%:",
  "Evidence Base:",
  "• AI delivers 10–20% efficiency gains in real estate operations (Forbes Tech Council, 2024)",
  "• Up to 37% of real estate tasks are automatable (Morgan Stanley, 2025)",
  "• AI improves document-heavy tasks: reviews, compliance, asset lifecycle (Drooms)",
  "",
  "6. Financial Impact of Efficiency Gains:",
  "Using an average junior salary of £30,000:",
  "• 20% efficiency gain = £6,000 annual saving per admin/document-handling role",
  "",
  "This reflects:",
  "• Reduced manual retrieval time",
  "• Fewer errors and compliance issues",
  "• Less duplicated effort",
  "• Faster decision-making",
  "• Ability to scale portfolios without expanding headcount",
  "",
  "→ This assumption is used throughout financial modelling for Hobson's ROI.",
  "",
  "Summary:",
  "These assumptions establish a robust foundation for modelling Hobson's UK opportunity:",
  "1. A large and clearly segmented market",
  "2. 65% of UK businesses primed to invest in AI",
  "3. Labour cost baselines",
  "4. A conservative but evidence-backed efficiency gain (20%) equal to £6k per role per year",
];

export const getTargetMarketPdfContent = (): string[] => [
  "Target Market — Total Addressable Market (TAM):",
  "",
  "UK Market TAM — £1.41B:",
  "• 235,200 UK real estate businesses",
  "• £6,000 annual efficiency saving per business",
  "• Based on verified ONS data (5.6M × 4.2% real estate share)",
  "• Calculation: 235,200 × £6,000 = £1.41B",
  "",
  "Global Market TAM — £155.6B:",
  "• 118× UK population multiple",
  "• Worldwide AI efficiency opportunity in real estate",
  "• Real estate document workflows globally",
  "• Calculation: £1.41B × 118 = £155.6B",
  "",
  "Market Methodology:",
  "UK TAM based on ONS-verified business counts (5.6M × 4.2% real estate share)",
  "and £30,000 junior salary benchmarks with 20% efficiency gain assumption.",
];

export const getSAMPdfContent = (): string[] => [
  "Serviceable Available Market (SAM):",
  "",
  "UK Market SAM — £917M:",
  "• 65% of TAM motivated to adopt AI",
  "• 152,880 ready-to-adopt businesses",
  "• £6,000 annual efficiency saving each",
  "• Calculation: 235,200 × 65% = 152,880 × £6,000 = £917M",
  "",
  "Global Market SAM — £101B:",
  "• 65% global adoption readiness",
  "• Consistent with PropTech adoption rates",
  "• Traditional sectors AI readiness patterns",
  "• Calculation: £155.6B × 65% = £101B",
  "",
  "65% Adoption Rate Source:",
  "Department for Business, Energy & Industrial Strategy (BEIS) / ONS",
  "— consistent with PropTech and operational AI adoption rates in traditional sectors (Deloitte, PwC, McKinsey).",
];

export const getUKMarketPdfContent = (): string[] => [
  "UK Market Opportunity — Built Directly From Verified Assumptions:",
  "",
  "Total Addressable Market (TAM) — £1.41B:",
  "• Based on verified ONS business counts and salary benchmarks",
  "• 235,200 UK real estate businesses (5.6M total UK businesses × 4.2% real estate share)",
  "• £6,000 annual saving per business (20% efficiency gain on £30,000 junior salary)",
  "• TAM = 235,200 × £6,000 = £1.41B",
  "",
  "Serviceable Available Market (SAM) — £917M:",
  "• Reflects businesses motivated and able to adopt AI",
  "• 65% adoption readiness (consistent with PropTech and operational AI adoption rates)",
  "• 235,200 × 65% = 152,880 motivated businesses",
  "• 152,880 × £6,000 = £917M",
  "",
  "Serviceable Obtainable Market (SOM) — £110M:",
  "• Built using the evidence-backed 12% early penetration assumption",
  "• 12% sits within verified 8-20% early-stage adoption range (McKinsey, PwC, Deloitte)",
  "• 152,880 × 12% = 18,345 early adopters",
  "• 18,345 × £6,000 = £110M",
  "",
  "SOM is intentionally conservative and supported by industry-verified adoption behaviour.",
];

export const getEuropeanGlobalPdfContent = (): string[] => [
  "European & Global Market Opportunities:",
  "",
  "EUROPE (11× UK Population Multiple):",
  "",
  "Total Addressable Market (TAM) — £15.5B:",
  "• Scaling UK's £1.41B by Europe's 11× population multiple",
  "• Represents annual efficiency value across Europe for AI-driven document workflows",
  "",
  "Serviceable Available Market (SAM) — £10.1B:",
  "• 65% of European operators motivated and ready to adopt AI tools",
  "• £15.5B × 65% = £10.1B",
  "",
  "Serviceable Obtainable Market (SOM) — £1.2B:",
  "• 12% penetration of motivated organisations",
  "• £10.1B × 12% = £1.2B",
  "",
  "GLOBAL (118× UK Population Multiple):",
  "",
  "Total Addressable Market (TAM) — £155.6B:",
  "• Scaling UK's £1.41B by global 118× population multiple",
  "• Worldwide opportunity for AI-driven efficiency gains in real estate",
  "",
  "Serviceable Available Market (SAM) — £101B:",
  "• 65% of global market motivated to adopt AI tools",
  "• £155.6B × 65% = £101B",
  "",
  "Serviceable Obtainable Market (SOM) — £12.1B:",
  "• 12% penetration of motivated buyers",
  "• £101B × 12% = £12.1B",
];

export const getEarlyRoadmapPdfContent = (): string[] => [
  "Roadmap 2024–2025:",
  "",
  "Phase 1: Discover (May – Aug 2024):",
  "• Client discovery calls with real estate professionals",
  "• Establish the core problem being solved",
  "• Identify pain points in existing systems",
  "• Define target market segments",
  "",
  "Phase 2: Validate (Sept – Dec 2024):",
  "• Establish four working partnerships with real estate firms",
  "• No-code concepts validation",
  "• Scope the MVP based on partner feedback",
  "• Refine value proposition and feature set",
  "",
  "Phase 3: Develop (Jan – Dec 2025):",
  "• Build MVP: Phase 1 with core AI capabilities",
  "• Build online presence and branding",
  "• Testing MVP with key clients in real-world scenarios",
  "• Finalise pricing strategy based on usage data",
  "• Build pricing plan, marketing plan, business plan and financial model",
];

export const getGanttChartPdfContent = (): string[] => [
  "Roadmap 2026–2028:",
  "",
  "2026 — Strengthen the Product and Validate the Market:",
  "• Grow to 10 active pilot organisations across different portfolio sizes",
  "• Scale and improve core features based on real pilot feedback",
  "• Convert 3–5 pilots into paying customers to prove commercial demand",
  "• Build payment engine and billing workflows ready for public launch",
  "• Finalise marketing plan with KPIs, channels, content structure, and acquisition strategy",
  "• Prepare full go-to-market plan for 2027 launch",
  "",
  "2027 — Enter the Market and Expand Commercially:",
  "• Launch public Hobson website (Q1 2027) with full pricing and onboarding flows",
  "• Implement marketing plan: SEO, LinkedIn content, website funnels, retention communications",
  "• Scale technology and platform features to support growing demand",
  "• Strengthen onboarding, support processes, and customer success workflows",
  "• Prepare for global expansion by validating demand in two target countries",
  "",
  "2028 — Global Launch and Market Expansion:",
  "• Launch Hobson in two international markets with regionalised marketing",
  "• Release localised document packs and accuracy enhancements for new jurisdictions",
  "• Grow paid customer base across UK + international regions",
  "• Expand brand presence through partnerships, content, and local industry events",
  "• Strengthen platform reliability and insight features for multi-market operations",
];

export const getOnboardingCostsPdfContent = (): string[] => [
  "Customer Onboarding Costs & Payback Analysis:",
  "",
  "Cost to Acquire a Customer (CAC):",
  "• Marketing, sales, and onboarding costs per new customer",
  "• Designed to be minimal due to zero-onboarding product approach",
  "",
  "Customer Lifetime Value (LTV):",
  "• Average revenue per customer over their subscription lifetime",
  "• Usage-based model aligns revenue with customer value received",
  "",
  "Payback Period:",
  "• Time to recover customer acquisition costs",
  "• Target: <12 months for sustainable unit economics",
  "",
  "Key Advantages:",
  "• Zero onboarding = lower support costs",
  "• Self-serve model = reduced sales overhead",
  "• Usage-based pricing = natural expansion revenue",
  "• Low entry price = high conversion rates",
];

export const getHEUPricingPdfContent = (): string[] => [
  "Hobson Energy Units (HEUs) & Transparent Pricing:",
  "",
  "What are HEUs?",
  "Hobson Energy Units measure AI effort. Every task (query, document read, report build) consumes HEUs based on complexity and computational resources required.",
  "",
  "Pricing Tiers:",
  "",
  "Free Plan: £0/month",
  "• 18 HEUs per month",
  "• Perfect for testing and light usage",
  "",
  "Essential: £19.50/month + VAT",
  "• 275 HEUs per month",
  "• Ideal for small operators",
  "",
  "Essential Plus: £49.75/month + VAT",
  "• 700 HEUs per month",
  "• Great for growing teams",
  "",
  "Enterprise: £148.50/month + VAT",
  "• 2000 HEUs per month",
  "• Designed for large operations",
  "",
  "Top-Up Pack: £15 (one-time)",
  "• 150 additional HEUs",
  "• Non-rollover (expires at billing period end)",
  "",
  "Real-Time Transparency:",
  "• Live HEU balance display in your dashboard",
  "• Per-message cost breakdown available via ⋯ button",
  "• Know exactly what you're spending as you work",
  "",
  "Key Benefits:",
  "• No per-user fees — add unlimited team members",
  "• No per-asset fees — manage unlimited properties",
  "• Pay only for what you use",
  "• Scales with your actual usage",
];

// Helper function to render PDF content lines
export const renderPdfContentLines = (
  doc: any,
  content: string[],
  startY: number,
  margin: number,
  pageHeight: number,
  removeEmojis: (text: string) => string
): number => {
  let yPosition = startY;
  
  content.forEach((line) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    const cleanLine = removeEmojis(line);

    if (cleanLine === "") {
      yPosition += 5;
    } else if (cleanLine.endsWith(":")) {
      doc.setFont("helvetica", "bold");
      doc.text(cleanLine, margin, yPosition);
      yPosition += 7;
      doc.setFont("helvetica", "normal");
    } else {
      doc.text(cleanLine, margin, yPosition);
      yPosition += 5.5;
    }
  });

  return yPosition;
};

// Map of component types to their content providers
export const pdfContentMap: Record<string, () => string[]> = {
  ukMarketAssumptions: getUKMarketAssumptionsPdfContent,
  targetMarket: getTargetMarketPdfContent,
  sam: getSAMPdfContent,
  ukMarket: getUKMarketPdfContent,
  europeanGlobal: getEuropeanGlobalPdfContent,
  earlyRoadmap: getEarlyRoadmapPdfContent,
  ganttChart: getGanttChartPdfContent,
  onboardingCosts: getOnboardingCostsPdfContent,
  heuPricing: getHEUPricingPdfContent,
};

// Get PDF content for any visual component type
export const getPdfContentForComponent = (componentType: string): string[] | null => {
  const provider = pdfContentMap[componentType];
  return provider ? provider() : null;
};
