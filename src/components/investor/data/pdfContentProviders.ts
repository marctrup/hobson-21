// Centralized PDF content providers
// IMPORTANT: Use only ASCII-safe characters for PDF compatibility
// Avoid: arrows (→), em-dashes (—), en-dashes (–), smart quotes, special symbols
// Use instead: ->, --, -, regular quotes

export const getUKMarketAssumptionsPdfContent = (): string[] => [
  "UK Market Assumptions - Evidence-based framework for market sizing:",
  "",
  "1. Size of the UK Real Estate Business Market:",
  "- Total UK businesses: 5.6 million",
  "- Real estate activities represent 4.2% = 235,200 real estate businesses",
  "- Source: ONS - Real estate activities by employment size",
  "",
  "2. Business Size Breakdown (Real Estate Only):",
  "- Small (1-9 employees): 96% = 225,792 businesses",
  "- Medium (10-49): 2.7% = 6,350 businesses",
  "- Large (50-249): 0.6% = 1,411 businesses",
  "- Enterprise (250+): 0.1% = 235 businesses",
  "- Source: BEIS / ONS",
  "",
  "3. AI Investment Readiness:",
  "- 65% of UK businesses are primed to invest in AI",
  "- Source: Deloitte - State of AI in the Enterprise (5th Edition)",
  "",
  "4. Labour Cost Baseline:",
  "- Average junior real estate salary: GBP 30,000",
  "- Source: Macdonald & Company - UK Salary Report 2023/24",
  "",
  "5. AI Efficiency Gain Assumption - 20%:",
  "Evidence Base:",
  "- AI delivers 10-20% efficiency gains in real estate operations (Forbes Tech Council, 2024)",
  "- Up to 37% of real estate tasks are automatable (Morgan Stanley, 2025)",
  "- AI improves document-heavy tasks: reviews, compliance, asset lifecycle (Drooms)",
  "",
  "6. Financial Impact of Efficiency Gains:",
  "Using an average junior salary of GBP 30,000:",
  "- 20% efficiency gain = GBP 6,000 annual saving per admin/document-handling role",
  "",
  "This reflects:",
  "- Reduced manual retrieval time",
  "- Fewer errors and compliance issues",
  "- Less duplicated effort",
  "- Faster decision-making",
  "- Ability to scale portfolios without expanding headcount",
  "",
  ">> This assumption is used throughout financial modelling for Hobson's ROI.",
  "",
  "Summary:",
  "These assumptions establish a robust foundation for modelling Hobson's UK opportunity:",
  "1. A large and clearly segmented market",
  "2. 65% of UK businesses primed to invest in AI",
  "3. Labour cost baselines",
  "4. A conservative but evidence-backed efficiency gain (20%) equal to GBP 6k per role per year",
];

export const getTargetMarketPdfContent = (): string[] => [
  "Target Market - Total Addressable Market (TAM):",
  "",
  "UK Market TAM - GBP 1.41B:",
  "- 235,200 UK real estate businesses",
  "- GBP 6,000 annual efficiency saving per business",
  "- Based on verified ONS data (5.6M x 4.2% real estate share)",
  "- Calculation: 235,200 x GBP 6,000 = GBP 1.41B",
  "",
  "Global Market TAM - GBP 155.6B:",
  "- 118x UK population multiple",
  "- Worldwide AI efficiency opportunity in real estate",
  "- Real estate document workflows globally",
  "- Calculation: GBP 1.41B x 118 = GBP 155.6B",
  "",
  "Market Methodology:",
  "UK TAM based on ONS-verified business counts (5.6M x 4.2% real estate share)",
  "and GBP 30,000 junior salary benchmarks with 20% efficiency gain assumption.",
];

export const getSAMPdfContent = (): string[] => [
  "Serviceable Available Market (SAM):",
  "",
  "UK Market SAM - GBP 917M:",
  "- 65% of TAM motivated to adopt AI",
  "- 152,880 ready-to-adopt businesses",
  "- GBP 6,000 annual efficiency saving each",
  "- Calculation: 235,200 x 65% = 152,880 x GBP 6,000 = GBP 917M",
  "",
  "Global Market SAM - GBP 101B:",
  "- 65% global adoption readiness",
  "- Consistent with PropTech adoption rates",
  "- Traditional sectors AI readiness patterns",
  "- Calculation: GBP 155.6B x 65% = GBP 101B",
  "",
  "65% Adoption Rate Source:",
  "Consistent with PropTech and operational AI adoption rates in traditional sectors (Deloitte, PwC, McKinsey).",
];

export const getUKMarketPdfContent = (): string[] => [
  "Market Opportunity - Built Directly From Verified Assumptions:",
  "",
  "Total Addressable Market (TAM) - GBP 1.41B:",
  "Based on verified ONS business counts and salary benchmarks.",
  "- 235,200 UK real estate businesses (from 5.6M total UK businesses x 4.2% real estate share)",
  "- GBP 6,000 annual saving per business (20% efficiency gain on GBP 30,000 junior salary)",
  "- TAM = 235,200 x GBP 6,000 = GBP 1.41B",
  "",
  "Serviceable Available Market (SAM) - GBP 917M:",
  "Reflects businesses motivated and able to adopt AI (supported by external adoption studies).",
  "- 65% adoption readiness (consistent with PropTech and operational AI adoption rates in traditional sectors)",
  "- 235,200 x 65% = 152,880 motivated businesses",
  "- 152,880 x GBP 6,000 = GBP 917M",
  "- SAM aligns with verified adoption behaviour from Deloitte, PwC, McKinsey",
];

export const getEuropeanGlobalPdfContent = (): string[] => [
  "European & Global Market Opportunities:",
  "",
  "EUROPE - 11x UK Population:",
  "",
  "Total Addressable Market (TAM) - GBP 15.5B:",
  "- Scaling the UK's GBP 1.41B efficiency value by Europe's 11x population multiple",
  "- GBP 1.41B x 11 = GBP 15.51B, rounded to GBP 15.5B",
  "- Represents the annual efficiency value across Europe for AI-driven document and information workflows in real estate",
  "",
  "Serviceable Available Market (SAM) - GBP 10.1B:",
  "- The proportion of European real estate operators realistically motivated and ready to adopt AI tools",
  "- Uses the same 65% factor as the UK",
  "- GBP 15.5B x 65% = GBP 10.1B",
  "",
  "GLOBAL - 18x UK Population (OECD-aligned markets):",
  "",
  "Total Addressable Market (TAM) - GBP 155.6B:",
  "- Scaling the UK's GBP 1.41B efficiency value by the global 18x population multiple",
  "- GBP 1.41B x 118 = GBP 166.4B, rounded to GBP 155.6B",
  "- Represents the worldwide opportunity for AI-driven efficiency gains in real estate document workflows",
  "",
  "Serviceable Available Market (SAM) - GBP 101B:",
  "- The proportion of global real estate operators realistically motivated and ready to adopt AI tools",
  "- Uses the same 65% factor as the UK",
  "- GBP 155.6B x 65% = GBP 101B",
  "",
  "Summary:",
  "Positions Hobson as an export-ready solution capable of adapting across geographies and regulatory contexts.",
];

// Structured data for ProductVision PDF renderer - matches ProductVisionVisual.tsx
export const getProductVisionStructuredData = () => ({
  industryContext: {
    title: "The global Real Estate industry is primed for change",
    intro: "Operators are drowning in:",
    pains: [
      "Escalating regulatory complexity",
      "Fragmented systems",
      "Chronic labour shortages",
      "Rising operating costs",
      "Increasingly sophisticated landlord and tenant expectations",
    ],
  },
  visionStatement: "Hobson is building the AI operating layer for the Real Estate industry.",
  marketGap: {
    title: "The Market Gap Hobson Fills",
    intro: "Today, no platform:",
    gaps: [
      "Understands leases at scale",
      "Enforces compliance continuously",
      "Orchestrates maintenance and finance",
      "Predicts risk across entire portfolios",
    ],
  },
  coreCapabilities: {
    title: "Hobson becomes the intelligence layer above every PMS",
    intro: "One Core Engine that delivers:",
    capabilities: [
      "Property master data",
      "Lease abstraction",
      "Compliance calendars",
      "Financial intelligence",
      "Maintenance orchestration",
      "Communications automation",
    ],
  },
  conclusion: "This makes Hobson the only platform capable of running a single operating model across residential and commercial portfolios.",
});

// Structured data for EarlyRoadmap PDF renderer - matches EarlyRoadmapVisual.tsx
export const getEarlyRoadmapStructuredData = () => ({
  phases: [
    {
      phase: "May – Aug 2024",
      title: "Phase 1: Discover & De-Risk",
      status: "completed",
      objectives: ["Validated the systemic failure of existing property management systems through direct operator discovery:"],
      subItems: [["Compliance risk", "Lease complexity", "Arrears management", "Maintenance chaos", "Portfolio fragmentation"]],
    },
    {
      phase: "Sep – Dec 2024",
      title: "Phase 2: Validate Core Engine",
      status: "completed",
      objectives: ["Product-market fit is emerging.", "Four active pilot partners across operator sizes and system environments:"],
      subItems: [
        ["Large multi-system commercial operator", "Medium single-system operator", "Small owner-operator investment firms"],
        ["Abstract leases", "Normalise residential and commercial workflows", "Surface compliance and financial risk"],
      ],
    },
    {
      phase: "Jan – Dec 2025",
      title: "Phase 3: Develop the MVP",
      status: "in-progress",
      objectives: [
        "Build MVP: Phase 1 with core AI capabilities",
        "Build online presence and branding",
        "Testing MVP with key clients' data",
        "Build a pricing strategy based on usage data",
        "Build pricing plans, marketing plan, business plan and financial model first draft",
      ],
    },
    {
      phase: "Jan – Sep 2026",
      title: "Phase 4: Build the Industry Operating Layer",
      status: "upcoming",
      objectives: [
        "Hobson MVP expands from \"document AI\" into full workflow intelligence.",
        "By the end of 2026, Hobson will become the AI operating backbone for Real Estate portfolios.",
      ],
    },
  ],
  productPillars: [
    { workflow: "Onboarding & Setup", capability: "AI document ingestion, lease abstraction, risk flags" },
    { workflow: "Compliance & Safety", capability: "Compliance rule engines, predictive failure" },
    { workflow: "Leasing & Occupier", capability: "Risk scoring, deal forecasting" },
    { workflow: "Lease Management", capability: "Market intelligence, renewal modelling" },
    { workflow: "Rent Collection & Finance", capability: "Arrears prediction, cashflow forecasting" },
    { workflow: "Maintenance & Asset", capability: "Predictive maintenance, cost optimisation" },
    { workflow: "Inspections", capability: "Computer vision defect detection" },
    { workflow: "Legal & Risk", capability: "Litigation risk scoring" },
    { workflow: "Voids & Re-leasing", capability: "Void forecasting, incentive modelling" },
    { workflow: "Portfolio Strategy", capability: "Scenario modelling, portfolio optimisation" },
  ],
  businessTimeline: [
    { year: "2026", title: "Prove Commercial Model", items: ["10+ pilot organisations", "3-5 converted to paying enterprise customers", "Billing engine & compliance-grade audit logging", "Full UK market readiness"] },
    { year: "2027", title: "UK Market Capture", items: ["Public launch Q1", "Aggressive go-to-market", "Platform hardened for national scale", "Expansion readiness for EU & Global"] },
    { year: "2028", title: "Global Expansion", items: ["Multi-market release", "Local compliance models", "Global enterprise partnerships"] },
  ],
  commercialImpact: [
    { metric: "35–45%", description: "Reduction in operating cost per unit" },
    { metric: "Sub-linear", description: "Headcount growth" },
    { metric: "Near-zero", description: "Compliance failures" },
    { metric: "Material", description: "Improvement in cashflow predictability" },
  ],
  closing: {
    primary: "Hobson is not selling software. Hobson is becoming the operating system for Real Estate management.",
    secondary: "The market is enormous, the pain is immediate, and the transformation window is open now.",
  },
});

// Structured data for TechStack PDF renderer - matches TechStackVisual.tsx
export const getTechStackStructuredData = () => ({
  intro: "Hobson runs on trusted, industry-standard platforms designed for security, performance, and scalability.",
  categories: [
    {
      title: "AI & Intelligence",
      colorType: "primary",
      items: [{ name: "OpenAI", desc: "Powers natural language understanding and AI-driven responses" }],
    },
    {
      title: "Cloud Infrastructure",
      colorType: "blue",
      items: [
        { name: "OVH Cloud", desc: "Stores your uploaded files and documents (secure UK/EU-based cloud storage)" },
        { name: "Vercel", desc: "Runs the Hobson web app (fast, stable interface)" },
      ],
    },
    {
      title: "Data & Storage",
      colorType: "emerald",
      items: [
        { name: "MongoDB", desc: "Handles structured data such as units, portfolios, users, and document metadata" },
        { name: "Neo4j", desc: "Used for knowledge-graph structures to understand relationships" },
        { name: "Pinecone", desc: "Stores vector embeddings for quick document search" },
      ],
    },
    {
      title: "Communication & Admin",
      colorType: "amber",
      items: [{ name: "Google Workspace", desc: "Supports email delivery, team communication, and secure internal admin" }],
    },
  ],
  keyFeatures: ["UK/EU Data Residency", "High Availability", "Vector Search"],
});

export const getEarlyRoadmapPdfContent = (): string[] => [
  "Roadmap 2024-2025:",
  "",
  "Phase 1: Discover (May - Aug 2024):",
  "- Client discovery calls with real estate professionals",
  "- Establish the core problem being solved",
  "- Identify pain points in existing systems",
  "- Define target market segments",
  "",
  "Phase 2: Validate (Sept - Dec 2024):",
  "- Establish four working partnerships with real estate firms",
  "- No-code concepts validation",
  "- Scope the MVP based on partner feedback",
  "- Refine value proposition and feature set",
  "",
  "Phase 3: Develop (Jan - Dec 2025):",
  "- Build MVP: Phase 1 with core AI capabilities",
  "- Build online presence and branding",
  "- Testing MVP with key clients data",
  "- Finalise pricing strategy based on usage data",
  "- Build pricing plan, marketing plan, business plan and financial model",
];

export const getGanttChartPdfContent = (): string[] => [
  "Roadmap 2026-2028:",
  "",
  "2026 - Strengthen the Product and Validate the Market:",
  "- Grow to 10 active pilot organisations across different portfolio sizes",
  "- Scale and improve core features based on real pilot feedback",
  "- Convert 3-5 pilots into paying customers to prove commercial demand",
  "- Build payment engine and billing workflows ready for public launch",
  "- Finalise marketing plan with KPIs, channels, content structure, and acquisition strategy",
  "- Prepare full go-to-market plan for 2027 launch",
  "",
  "2027 - Enter the Market and Expand Commercially:",
  "- Launch public Hobson website (Q1 2027) with full pricing and onboarding flows",
  "- Implement marketing plan: SEO, LinkedIn content, website funnels, retention communications",
  "- Scale technology and platform features to support growing demand",
  "- Strengthen onboarding, support processes, and customer success workflows",
  "- Prepare for global expansion by validating demand in two target countries",
  "",
  "2028 - Global Launch and Market Expansion:",
  "- Launch Hobson in two international markets with regionalised marketing",
  "- Release localised document packs and accuracy enhancements for new jurisdictions",
  "- Grow paid customer base across UK + international regions",
  "- Expand brand presence through partnerships, content, and local industry events",
  "- Strengthen platform reliability and insight features for multi-market operations",
];

export const getOnboardingCostsPdfContent = (): string[] => [
  "AI Onboarding Cost Per Client:",
  "OpenAI 5.1 Mini - Internal Cost Model",
  "",
  "1. Document Processing Cost Benchmarks:",
  "",
  "Document Type          | Avg. Cost | Tokens   | Time",
  "Complex (Lease)        | $0.40     | ~600k    | 8-9 min",
  "Medium (Deed)          | $0.10     | ~300k    | 2-3 min",
  "Simple (Notice)        | $0.02-03  | ~50k     | 30-60 sec",
  "",
  "2. Cost Per Unit (Space / Asset):",
  "",
  "Each unit typically contains 5 onboarding documents:",
  "- 1 Complex",
  "- 3 Medium",
  "- 2 Simple",
  "",
  "Unit-Level AI Cost:",
  "Component | Qty | Cost      | Total",
  "Complex   | 1   | $0.40     | $0.40",
  "Medium    | 3   | $0.10     | $0.30",
  "Simple    | 2   | $0.02-03  | $0.04-06",
  "",
  "Total Onboarding Cost per Unit: $0.74 - $0.76",
  "",
  "3. Client Onboarding Cost Scenarios:",
  "",
  "Client Type | Units      | Total AI Cost",
  "Small       | 5 units    | $3.70 - $3.80",
  "Medium      | 100 units  | $74 - $76",
  "Large       | 1,000 units| $740 - $760",
  "",
  "4. Strategic Implication:",
  "",
  "Hobson Onboarding = Ultra-Low Cost, High Margin",
  "",
  "- AI ingestion is the only meaningful onboarding cost.",
  "- Cost remains well under $1 per unit, even for complex portfolios.",
  "- Enables exceptionally high gross margins at scale.",
  "- Supports frictionless self-serve onboarding from 2027 onwards.",
  "",
  ">> Hobson can acquire and activate clients at extremely low operational cost.",
  ">> Margins expand further as volume increases.",
];

export const getHEUPricingPdfContent = (): string[] => [
  "Hobson Energy Units (HEUs) & Transparent Pricing:",
  "",
  "What are HEUs?",
  "Hobson Energy Units measure AI effort. Every task (query, document read, report build)",
  "consumes HEUs based on complexity and computational resources required.",
  "",
  "Pricing Tiers:",
  "",
  "Free Plan: GBP 0/month",
  "- 18 HEUs per month",
  "- Perfect for testing and light usage",
  "",
  "Essential: GBP 19.50/month + VAT",
  "- 275 HEUs per month",
  "- Ideal for small operators",
  "",
  "Essential Plus: GBP 49.75/month + VAT",
  "- 700 HEUs per month",
  "- Great for growing teams",
  "",
  "Enterprise: GBP 148.50/month + VAT",
  "- 2000 HEUs per month",
  "- Designed for large operations",
  "",
  "Top-Up Pack: GBP 15 (one-time)",
  "- 150 additional HEUs",
  "- Non-rollover (expires at billing period end)",
  "",
  "Real-Time Transparency:",
  "- Live HEU balance display in your dashboard",
  "- Per-message cost breakdown available",
  "- Know exactly what you are spending as you work",
  "",
  "Key Benefits:",
  "- No per-user fees - add unlimited team members",
  "- No per-asset fees - manage unlimited properties",
  "- Pay only for what you use",
  "- Scales with your actual usage",
];

export const getLandscapePdfContent = (): string[] => [
  "Context: A Category Still Forming",
  "Despite the size of the sector:",
  "",
  "Current Market Gaps",
  "Legacy Prop Tech platforms are system-of-record for transactions, not intelligence",
  "Horizontal AI tools lack domain depth, accuracy, and auditability",
  "No AI-native platform has yet become the default intelligence layer for real estate documents",
  "",
  "This creates a rare situation:",
  "Large, conservative market. Clear structural pain. No entrenched AI leader.",
  "Markets like this tend to consolidate quickly once a trusted standard emerges.",
  "",
  "The After: AI-Native Intelligence Layers",
  "Real-time reasoning  .  Instant, referenced answers  .  Embedded into workflows",
  "",
  "What This Means for Hobson",
  "Hobson is positioned within a large and durable UK vertical, a global market undergoing structural change and an industry where early trust compounds into long-term defensibility.",
  "This section is not about pricing or near-term monetisation. It establishes why this market is worth building infrastructure for and why the upside is category-scale.",
];

export const getMarketShareJustificationPdfContent = (): string[] => [
  "Market Share Justification (UK -> Global Expansion 2026-2030):",
  "Why Hobson Can Credibly Capture 6-10% of the UK Market and Replicate This Globally by 2030",
  "",
  "1. Frictionless Adoption - 2x Faster Penetration:",
  "- Zero onboarding required - users start immediately",
  "- Works alongside existing tools - no replacement or integration needed",
  "- Pricing is not a barrier - accessible to all business sizes",
  "- This frictionless model enables 2x faster market penetration than typical SaaS",
  "",
  "2. UK Real Estate Market Structure Enables Fast Penetration:",
  "- 225,792 small firms (1-9 employees)",
  "- 6,350 medium firms (10-49 employees)",
  "- 1,411 large firms (50-249 employees)",
  "- 235 enterprise firms (250+ employees)",
  "- Fragmented market means lightweight AI tools spread rapidly through referrals",
  "",
  "3. White-Space Positioning - No Direct Competitor:",
  "- Hobson is the first AI built solely for: Document Intelligence -> Retrieval -> Clarity -> Referenced Answers",
  "- Not competing with property management systems, leasing platforms, or workflow software",
  "- White-space positioning is ideal for fast share capture",
  "",
  "4. Benchmark AI SaaS Startups Reach 1-3% Share in 3-5 Years:",
  "- Vertical AI companies (EliseAI, StanAI, Cresta, Clari, VTS) reached 1-3% penetration in 3-5 years",
  "- Hobson's frictionless model doubles this trajectory",
  "",
  "5. AI Adoption Tailwinds Strengthen the Case:",
  "- 65% of organisations plan to increase AI investment (Source: Deloitte)",
  "- Up to 20% efficiency gain achievable in real estate operations (Source: Forbes)",
  "- 10%+ NOI gains via AI optimisation (Source: McKinsey)",
  "- Supports rapid adoption and willingness to pay",
  "",
  "6. Economics Support Aggressive Scaling:",
  "- Cost to process 5 onboarding documents per unit: ~GBP 1.60-2.00",
  "- High gross margin enables scaling into SMB and enterprise segments quickly",
  "- Zero-integration model means no friction or implementation bottlenecks",
  "",
  "7. UK Market Share Projection:",
  "",
  "Year    | UK Market Share | Rationale",
  "2026    | -              | Pilot validation only",
  "2027    | 0.4%           | UK commercial launch + first conversions",
  "2028    | 1.4%           | Strong UK adoption + compounding referrals",
  "2029    | 3%             | Brand leadership in UK emerges",
  "2030    | 6-10%          | Category leader in UK",
  "",
  "8. Global Expansion Assumptions (Starting 2028):",
  "- Hobson plans to expand to two new international markets in 2028",
  "- Same market-share percentages are defensible because:",
  "  - Market structure is similar internationally (fragmentation, document-heavy workflows)",
  "  - AI adoption rates globally mirror the UK (35-36% CAGR worldwide)",
  "  - The category is globally underserved - Hobson is first-mover internationally",
  "  - Product does not require integration - universally easy onboarding",
  "  - Referenced answers + document intelligence is a universal need",
  "",
"Global Market Share Projection (2027-2031):",
  "",
  "Year    | UK Share | Global Share (New Markets) | Notes",
  "2027    | 0.5%     | --                         | UK launch year",
  "2028    | 1.5%     | 0.25%                      | Global expansion begins",
  "2029    | 3.0%     | 1.0%                       | Growing credibility + referrals",
  "2030    | 4.5%     | 2.0%                       | Scaling operations",
  "2031    | 5.5%     | 3.0%                       | Mature positioning + brand leadership",
  "",
  "9. Market-Share Thesis:",
  "Given the category white space, frictionless adoption (zero onboarding, works alongside existing",
  "tools, accessible pricing), strong adoption tailwinds (65% reinvesting in AI), and global expansion",
  "beginning in 2028, Hobson can credibly reach 5.5% UK market share and 3% in international",
  "markets by 2031 - achieving strong combined share as the category leader in AI document intelligence.",
];

export const getCostAssumptionsPdfContent = (): string[] => [
  "Cost Structure Assumptions - Lean, Scalable Operating Model:",
  "",
  "Cost Structure Overview:",
  "Hobson is designed with a lean cost base from day one:",
  "- No office costs - remote-first operations",
  "- Outsourced engineering and marketing",
  "- Small internal core team (5 heads)",
  "- Usage-based infrastructure costs",
  "",
  "Core Team Cost (Fixed Costs):",
  "Role                     | Annual Cost",
  "CEO                      | GBP 85,000",
  "Head of Product          | GBP 75,000",
  "Head of Marketing        | GBP 70,000",
  "Head of Sales            | GBP 70,000",
  "Head of Customer Success | GBP 60,000",
  "Total Fixed Payroll:       GBP 360,000",
  "",
  "Outsourced Costs (Variable % of Revenue):",
  "Function                 | % of Revenue",
  "Engineering              | 8-12%",
  "Marketing Execution      | 5-8%",
  "Customer Success Support | 3-5%",
  "Sales Commissions        | 3-5%",
  "G&A / Corporate Services | 2-3%",
  "Total Variable Costs:      21-33% of Revenue",
  "",
  "AI & Infrastructure Costs (COGS):",
  "",
  "One-off AI Onboarding (per customer type):",
  "Customer Type | Units | AI Cost",
  "Small         | 5     | GBP 3-4",
  "Medium        | 100   | GBP 60-70",
  "Large         | 1,000 | GBP 600-700",
  "",
  "Ongoing Infrastructure (% of Revenue):",
  "Component                | % of Revenue",
  "LLM inference (OpenAI)   | 3-5%",
  "Vector DB & Embeddings   | 1-2%",
  "Storage & Compute        | 1-2%",
  "Monitoring & Backups     | 0.5-1%",
  "Total Infrastructure:      5.5-10% of Revenue",
  "",
  "Full Cost Structure Summary:",
  "Category           | Range",
  "Fixed Team Costs   | GBP 360,000/year",
  "Variable Costs     | 21-33% of revenue",
  "AI & Infrastructure| 5.5-10% of revenue",
  "",
  "Expected Gross Margin: 85-90%+ (excluding team costs)",
  "",
  "Why Variable Costs Are Low:",
  "- Reduced LLM calls through intelligent caching",
  "- Efficient AI ingestion with document deduplication",
  "- Horizontal scalability of cloud infrastructure",
  "- No per-user or per-asset licensing costs",
];

export const getPLAssumptionsPdfContent = (): string[] => [
  "P/L Assumptions - Foundational Model (2026-2031):",
  "",
  "1. Revenue Model Assumptions:",
  "",
  "Pricing (ARR Basis):",
  "- Blended ARPU = GBP 41.31/month -> GBP 495.72/year",
  "- Pricing includes Essential, Essential Plus, Enterprise mix",
  "- No implementation fees (frictionless onboarding)",
  "",
  "Customer Growth & Penetration:",
  "- UK: 0.5% -> 5.5% penetration (2027-2031)",
  "- Global (OECD markets): 0.25% -> 3.0% penetration (2028-2031)",
  "- Revenue expands via subscription use + optional HEU top-ups",
  "",
  "Market Size Basis:",
  "- UK real estate businesses: 235,200",
  "- Global comparable markets: 4.23M (18x UK, OECD-adjusted)",
  "",
  "2. Cost of Goods Sold (COGS) Assumptions:",
  "",
  "AI Processing & Onboarding Costs (OpenAI 5.1 Mini):",
  "",
  "Unit Composition              | Cost per Unit",
  "1 Complex                     | $0.40",
  "3 Medium                      | $0.30",
  "2 Simple                      | $0.04-$0.06",
  "Total AI Onboarding Cost/Unit | $0.74-$0.76 (GBP 0.60)",
  "",
  "Client Onboarding COGS:",
  "Client Size | Units | Total Cost",
  "Small       | 5     | GBP 3-4",
  "Medium      | 100   | GBP 60-70",
  "Large       | 1,000 | GBP 600-700",
  "",
  "Implication: AI onboarding cost per customer is trivial",
  "-> Gross margin ~95-97%",
  "",
  "3. Infrastructure Cost Assumptions:",
  "",
  "Core Architecture Components:",
  "- LLM inference (OpenAI)",
  "- Vector DB",
  "- Knowledge Graph engine",
  "- MongoDB",
  "- Storage (S3-equivalent)",
  "- Monitoring & quality checks",
  "",
  "Infrastructure: 8-12% of revenue (scales with usage)",
  "Efficiency improves via: document deduplication, shared embeddings, caching",
  "",
  "4. Operating Expense (OpEx) Assumptions:",
  "",
  "Internal Team (Lean, Senior Core):",
  "Role                     | Notes",
  "CEO                      | Strategic + investor relations",
  "Head of Product          | Owns roadmap, QA, user research",
  "Head of Marketing        | Controls outsourced execution",
  "Head of Sales            | Enterprise / channel development",
  "Head of Customer Support | Manages first-line team",
  "",
  "Total Internal Team Cost: 30-35% of revenue early years, falling to ~20% by 2031",
  "",
  "Outsourced Functions (10-15% of revenue):",
  "- Digital marketing execution (retainer + performance budget)",
  "- External engineering (project-based)",
  "- Corporate services (legal, compliance, accounting)",
  "",
  "5. Sales & Marketing Spend:",
  "- Low due to organic channels (LinkedIn, SEO, quiz funnel)",
  "- Paid acquisition is selective and ROI-focused",
  "- Assumption: 15-20% of revenue depending on growth phase",
  "",
  "6. Profitability Trajectory:",
  "- Gross margin: 95-97% (AI + infrastructure)",
  "- EBITDA breakeven expected once ARR > GBP 5M",
  "- Profits expand as infrastructure % falls, global market grows,",
  "  onboarding becomes self-serve, engineering becomes incremental",
  "",
  "7. Summary:",
  "Hobson's P/L assumptions demonstrate a high-margin, scalable, predictable AI SaaS model:",
  "1. Ultra-low onboarding costs (< GBP 1 per unit)",
  "2. Lean team with outsourced flexibility",
  "3. Frictionless, low-price adoption",
  "4. Strong ROI justification (GBP 6,000 saved per employee)",
  "5. Massive document-driven demand across global markets",
  "6. Architecture designed for cost efficiency at scale",
  "",
  "-> Supports a path to very high margins, attractive capital efficiency, and global scalability.",
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

// Additional content providers for previously missing components

export const getExecutiveSummaryPdfContent = (): string[] => [
  "Hobson is building the intelligence infrastructure that Real Estate operations",
  "now require to function safely, efficiently, and at scale.",
  "",
  "INVESTMENT RATIONALE:",
  "",
  "Hobson delivers AI-driven reasoning directly from source documents, with full",
  "traceability and auditability, inside existing workflows. Every obligation,",
  "exposure, valuation input, and compliance requirement is buried inside leases,",
  "titles, reports, and contracts. By replacing manual document handling, the hidden",
  "backbone of all operations, planning applications, funding due diligence,",
  "investment committee papers, and asset management, Hobson removes a growing",
  "source of structural cost, decision delay, and operational risk across Real Estate.",
  "",
  "Founded by the team behind Arthur Online, built and scaled to institutional",
  "adoption and acquired by Advent International and Aareon in 2021. Hobson is an",
  "AI platform born from firsthand experience of Real Estate operations at scale.",
  "",
  "THIS IS NOT A PRODUCTIVITY ENHANCEMENT:",
  "It is the removal of a core operational bottleneck.",
  "",
  "Hobson enables:",
  "- Permanent reduction in document-driven staffing costs",
  "- Faster, defensible decisions across operations, acquisitions and asset management",
  "- Material reduction in errors and compliance exposure through traceable,",
  "  source-linked outputs",
  "",
  "Once document intelligence is trusted, it becomes infrastructure. What begins",
  "as reasoning becomes decision control, then automation, then a system-level",
  "advantage across the Real Estate stack.",
  "",
  "Hobson is the entry point for AI becoming a system of record for the",
  "Real Estate industry.",
  "",
  "MARKET OPPORTUNITY:",
  "Real Estate operations are structurally constrained by manual document work.",
  "Over 20% of professional time is spent locating, validating, and cross-checking",
  "information across fragmented documents and systems.",
  "",
  "This is recurring operational spend already being paid for in payroll, consultants,",
  "delays, and error remediation. Hobson converts this existing cost into permanent",
  "operating leverage that compounds as portfolios scale.",
  "",
  "- UK: GBP 1.41B",
  "- Europe: GBP 15.5B",
  "- Global: GBP 155.6B",
  "",
  "Traction & Execution Momentum:",
  "Hobson demonstrates production-grade capability against Real Estate operational workflows.",
  "",
  "- Validated across four live Real Estate operating use cases",
  "- 98% model accuracy measured on proprietary, industry-specific datasets",
  "- Multi-document reasoning across legal, compliance, and operational sources",
  "- Domain-trained AI purpose-built for auditability and regulatory scrutiny",
  "- MVP launch Q1 2026, with scope defined by partner workflows rather than theoretical use cases",
];

export const getApproachPdfContent = (): string[] => [
  "STRATEGIC APPROACH",
  "",
  "1. PRODUCT:",
  "Hobson has been built to replace document-driven human reasoning without",
  "disrupting existing workflows:",
  "",
  "- Operates inside current systems",
  "- Zero onboarding or behavioural change",
  "- Unifies reasoning across documents, emails, and platforms",
  "- Transparent citations and verifiable outputs",
  "",
  "Trust is earned first. Expansion into proactive guidance and automation will follow.",
  "",
  "2. BRAND:",
  "Hobson has been designed for high-stakes operational environments where",
  "accuracy, traceability, and defensibility are non-negotiable:",
  "",
  "- Predictable behaviour",
  "- Transparent sources",
  "- Clear expectations",
  "- Fast feedback loops",
  "",
  "The brand signals reliability under pressure.",
  "",
  "3. BUSINESS MODEL:",
  "Hobson has been designed to become the default intelligence layer:",
  "",
  "- Usage-based pricing aligned to value delivered (HEU)",
  "- No licence, per-user, or per-asset fees",
  "- Low base cost enabling broad adoption",
  "- Full transparency into AI actions",
];

export const getTeamCredibilityPdfContent = (): string[] => [
  "TEAM CREDIBILITY",
  "",
  "Founded by the Team Behind Arthur Online:",
  "",
  "Hobson was founded by the team behind Arthur Online, a Real Estate operations",
  "platform built and scaled for institutional adoption, which was acquired by",
  "Advent and Aareon in 2021.",
  "",
  "That experience provides direct insight into how Real Estate platforms are",
  "bought, deployed, and relied upon at scale - and where they break under",
  "document complexity, compliance pressure, and operational load.",
  "",
  "The Team Brings:",
  "",
  "- Proven experience building and scaling enterprise Real Estate software",
  "- Deep understanding of document-heavy, regulated environments",
  "- Credibility with institutional buyers and partners",
  "- Prior experience navigating governance, security, and M&A processes",
];

export const getRaisePdfContent = (): string[] => [
  "RAISE",
  "",
  "Funding Requirement: GBP 1.8M",
  "",
  "Use of Funds:",
  "",
  "- To secure category leadership with a production-grade platform, QA, and security",
  "- Core technical and go-to-market hiring",
  "- Conversion of pilots into contracted deployments",
];

// Structured data for dedicated PDF renderer - matches CustomerSegmentationVisual.tsx
export const getCustomerSegmentationStructuredData = () => ({
  intro: "ONS size-band data shows the Real Estate sector skews heavily toward small- and mid-sized operators, but value is concentrated higher up. While smaller firms are numerous, document complexity, regulatory exposure, and spend focus grow rapidly as portfolios scale, creating a strong wedge for platforms that embed early and expand upward.",
  segments: [
    {
      title: "Large Operators",
      employees: "50–250 employees",
      percentage: "~5–10%",
      description: "larger and institutional operators (50+ employees)",
      colorType: "blue",
      pressure: "Rising compliance and audit requirements, high document volumes driving staffing growth, and increasing exposure from missed obligations",
      adoptionDrivers: [
        "Need to control cost without adding headcount",
        "Requirement for traceable, defensible answers",
        "Pressure from LPs, lenders, and regulators",
      ],
    },
    {
      title: "Medium Operators",
      employees: "10–49 employees",
      percentage: "~20–25%",
      description: "small–mid firms (10–49 employees)",
      colorType: "primary",
      pressure: "Scaling portfolios without proportional hiring, fragmented information across inboxes and shared drives, and decision bottlenecks are slowing transactions",
      adoptionDrivers: [
        "Margin compression",
        "Speed expectations from partners and capital providers",
        "Inability to scale manual processes",
      ],
    },
    {
      title: "Small Operators",
      employees: "1–9 employees",
      percentage: "~65–70%",
      description: "micro firms (1–9 employees)",
      colorType: "emerald",
      pressure: "Severe time scarcity, no tolerance for complex tools, increasing regulatory and reporting burden",
      adoptionDrivers: [
        "Survival and competitiveness",
        "Need for instant answers without overhead",
      ],
    },
  ],
  footer: "One platform. One intelligence layer. Forced adoption across segments.",
});

// Structured data for CustomersMarketSources - matches CustomersMarketSourcesVisual.tsx
export const getCustomersMarketSourcesStructuredData = () => ({
  sources: [
    {
      title: "Office for National Statistics (ONS), Business Population Estimates 2025",
      stat: "5.7M UK private sector businesses",
      linkText: "GOV.UK",
      linkUrl: "https://www.gov.uk/government/statistics/business-population-estimates-2024"
    },
    {
      title: "ONS UK Business Activity, Size and Location 2025",
      stat: "2.7M VAT/PAYE registered businesses",
      linkText: "Office for National Statistics",
      linkUrl: "https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation"
    },
    {
      title: "ONS Business Detailed Tables",
      stat: "Real Estate activities by SIC (Section L)",
      linkText: "GOV.UK",
      linkUrl: "https://www.gov.uk/government/statistics/business-population-estimates-2024"
    },
    {
      title: "McKinsey Global Survey on AI (2025)",
      stat: "~88% AI adoption in business functions",
      linkText: "McKinsey & Company",
      linkUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai"
    },
    {
      title: "McKinsey, Gen AI Real Estate Value",
      stat: "$110–$180B+ global value potential",
      linkText: "McKinsey & Company",
      linkUrl: "https://www.mckinsey.com/industries/real-estate/our-insights"
    },
    {
      title: "Deloitte Centre for Financial Services",
      stat: ">$7.2B AI/ML venture investment (relevant industry signalling)",
      linkText: "Deloitte United Kingdom",
      linkUrl: "https://www.deloitte.com/uk/en/industries/financial-services.html"
    }
  ],
});

export const getCustomerSegmentationPdfContent = (): string[] => [
  "Customer Segmentation - Who We Serve:",
  "",
  "Hobson is designed to meet the needs of property professionals across all",
  "operator sizes - each with distinct challenges, but a shared need for clarity.",
  "",
  "LARGE OPERATORS (50-250 employees):",
  "- Challenge: High-admin organisations struggling with scattered data",
  "  and slow information retrieval",
  "- What They Need: Automation and accuracy at scale",
  "",
  "MEDIUM OPERATORS (10-49 employees):",
  "- Challenge: Agile teams overwhelmed by inboxes and shared drives",
  "- What They Need: Efficient, low-overhead tools that eliminate manual searching",
  "",
  "SMALL OPERATORS (1-9 employees):",
  "- Challenge: Time-poor owner-operators with no time for complex tools",
  "- What They Need: Simple, low-cost assistant that works instantly",
  "  without onboarding",
  "",
  "One platform, three experiences - Hobson adapts to the complexity and scale",
  "of each operator type.",
];

export const getGlobalMarketAssumptionsPdfContent = (): string[] => [
  "Global Market Assumptions - Explosive Global Growth:",
  "(Verified by Independent Reports)",
  "",
  "1. AI in Real Estate Market Growth (Business Research Company):",
  "- Market growth 2024 to 2025: $222.65B to $303.06B",
  "- CAGR: 36.1%",
  "- Source: Business Research Company - AI in Real Estate Global Market Report 2025",
  "",
  "2. Long-Term Forecast to 2030 (Maximize Market Research):",
  "- Global market projected by 2030: $1.8T",
  "- Sustained CAGR: 35%",
  "- Source: Maximize Market Research - AI in Real Estate Market Forecast 2023-2030",
  "",
  "3. Proven Efficiency & Cost Gains (McKinsey):",
  "- 10%+ increase in net operating income (NOI) achieved through AI",
  "- Driven by automation and more efficient operating models",
  "- Source: McKinsey - The Power of Generative AI in Real Estate",
  "",
  "4. Real-World Adoption & Savings (Forbes):",
  "- 49% of real estate business owners report clear cost reductions from AI",
  "- Up to 20% operational savings achievable",
  "- Source: Forbes - How Artificial Intelligence Is Changing the Real Estate Market",
  "",
  "Why This Matters for Hobson:",
  "- AI efficiency gains are a global norm, reinforcing UK opportunity",
  "- 20% efficiency uplift is validated by global real estate data",
  "- Your UK GBP 1.41B to GBP 917M to GBP 110M path sits inside a",
  "  multi-trillion-dollar, fast-growing global market",
  "- Hobson enters a sector where adoption is rising and ROI is demonstrable",
  "",
  "Summary:",
  "1. AI in real estate is a fast-growing multi-billion dollar market",
  "2. 35%+ CAGR through 2030",
  "3. Proven 10-20% efficiency gains across the industry",
  "4. Nearly half of real estate businesses already seeing cost reductions from AI",
];

export const getPilotClientsPdfContent = (): string[] => [
  "Pilot Clients (2025) - Strategic Partnerships:",
  "",
  "Strategic partnerships and pilot validation across different operator sizes",
  "and system environments.",
  "",
  "LARGE OPERATOR:",
  "- EPAM Asset Management",
  "  - Commercial management that operate team across multiple systems",
  "  - System Environment: Multiple systems",
  "",
  "MEDIUM OPERATOR:",
  "- Live-in Guardians",
  "  - Guardian company that operate teams using single system",
  "  - System Environment: Single system",
  "",
  "SMALL OPERATORS:",
  "- Landhold",
  "  - Development, sales, and investment company",
  "  - System Environment: Microsoft suites",
  "",
  "- Saxon Investments",
  "  - Development, sales, and investment company",
  "  - System Environment: Microsoft suite",
  "",
  "Summary:",
  "- 4 Active Pilots",
  "- 3 Operator Sizes covered",
  "- 2+ System Types validated",
];

export const getHobsonOpportunityPdfContent = (): string[] => [
  "Hobson's Opportunity - Why Hobson Wins This Market:",
  "",
  "1. A Specialised AI Assistant Built for Real Estate:",
  "- Designed specifically for real estate workflows, documents, and terminology",
  "- Handles complex, high-volume admin with trusted accuracy",
  "- No generic tooling - purpose-built for the sector's pain points",
  "",
  "2. Delivers Immediate, Measurable Value:",
  "- Automates document understanding, insight extraction, and decision support",
  "- Zero onboarding - value from day one",
  "- Low friction + low pricing - easy adoption at scale",
  "- Proven 98% model accuracy (validated with real-world partners)",
  "",
  "3. Solving the Industry's Biggest Bottleneck:",
  "- Real estate is admin-heavy, fragmented, and cost-sensitive",
  "- 20% efficiency gain = GBP 6,000 annual saving per role",
  "- Aligns directly with the global trend of AI-driven operational efficiency",
  "",
  "4. Learns and Improves Over Time:",
  "- Starts as automation",
  "- Evolves into a proactive assistant",
  "- Becomes more accurate, personalised, and valuable with each interaction",
  "",
  "5. Perfect Timing:",
  "- UK SOM shows a GBP 1B attainable early market",
  "- The global AI real estate space is growing 35-36% annually",
  "- AI adoption is accelerating and ROI is clear",
  "",
  "The Result:",
  "Hobson becomes the go-to specialised AI assistant in a sector that urgently",
  "needs automation, cost savings, and operational clarity.",
];

export const getTechStackPdfContent = (): string[] => [
  "Tech Stack - Enterprise-Grade Infrastructure:",
  "",
  "Hobson runs on trusted, industry-standard platforms designed for security,",
  "performance, and scalability.",
  "",
  "AI & INTELLIGENCE:",
  "- OpenAI: Powers natural language understanding and AI-driven responses",
  "",
  "CLOUD INFRASTRUCTURE:",
  "- OVH Cloud: Stores uploaded files and documents (secure UK/EU-based storage)",
  "- Vercel: Runs the Hobson web app (fast, stable interface)",
  "",
  "DATA & STORAGE:",
  "- MongoDB: Handles structured data (units, portfolios, users, metadata)",
  "- Neo4j: Used for knowledge-graph structures to understand relationships",
  "- Pinecone: Stores vector embeddings for quick document search",
  "",
  "COMMUNICATION & ADMIN:",
  "- Google Workspace: Email delivery, team communication, secure internal admin",
  "",
  "Key Features:",
  "- UK/EU Data Residency",
  "- High Availability",
  "- Vector Search capability",
];

// Additional content providers for completeness

export const getCompetitorAnalysisPdfContent = (): string[] => [
  "Competitor Analysis Matrix:",
  "",
  "| Competitor | Who They Are | What They Do | Strengths | Weaknesses | Reviews | Market Value |",
  "|------------|--------------|--------------|-----------|------------|---------|--------------|",
  "",
  "Hobson AI:",
  "- Who They Are: AI document-intelligence assistant",
  "- What They Do: Reads + answers from leases, deeds, notices",
  "- Strengths: Transparent, low-friction, clarity-driven",
  "- Weaknesses: Early-stage awareness, still scaling support",
  "- Reviews: Fast, Clear, Helpful, Accurate, Excited for roadmap",
  "- Market Value: Early-stage (high-growth market)",
  "",
  "EliseAI:",
  "- Who They Are: AI leasing automation",
  "- What They Do: Tenant comms + leasing workflows",
  "- Strengths: Strong ROI, big adoption",
  "- Weaknesses: No doc-intel, expensive",
  "- Reviews: Great automation, Pricey, Not for CRE, Case-study heavy, Useful",
  "- Market Value: ~$500M+",
  "",
  "StanAI:",
  "- Who They Are: CRE underwriting AI",
  "- What They Do: Deal docs + financial extraction",
  "- Strengths: Great for analysts",
  "- Weaknesses: Narrow use-case",
  "- Reviews: Accurate, Niche, Premium, Fast, Complex",
  "- Market Value: Undisclosed",
  "",
  "Kendal AI:",
  "- Who They Are: Tenant messaging automation",
  "- What They Do: Handles tenant queries",
  "- Strengths: Simple, cheap",
  "- Weaknesses: No doc capability",
  "- Reviews: Time saver, Simple, Not CRE, Affordable, Useful",
  "- Market Value: Undisclosed",
  "",
  "Trudi:",
  "- Who They Are: SME leasing AI",
  "- What They Do: FAQs + simple automation",
  "- Strengths: Easy UI, onboarding",
  "- Weaknesses: Light document skills",
  "- Reviews: Helpful, Easy, Not deep, Good support, SMB fit",
  "- Market Value: Undisclosed",
  "",
  "Legacy PropTech:",
  "- Who They Are: Yardi/MRI/AppFolio",
  "- What They Do: Full PM systems",
  "- Strengths: Robust, trusted",
  "- Weaknesses: Weak AI, slow, expensive",
  "- Reviews: Complex, Manual docs, Long onboarding, Stable, Slow support",
  "- Market Value: $4-10B+",
];

export const getSimpleUIPdfContent = (): string[] => [
  "Simple UI - Zero Onboarding Interface:",
  "",
  "Key Features:",
  "",
  "Instant Start:",
  "- No training required",
  "- Start using immediately after sign-up",
  "- Intuitive interface for all skill levels",
  "",
  "Zero Training:",
  "- Natural language interaction",
  "- No complex menus or workflows",
  "- Self-explanatory interface",
  "",
  "Natural Language:",
  "- Ask questions in plain English",
  "- Conversational document interaction",
  "- No query syntax to learn",
  "",
  "Any Device:",
  "- Works on desktop and mobile",
  "- Responsive design",
  "- Access your documents anywhere",
];

export const getCapitalRaiseStrategyPdfContent = (): string[] => [
  "Capital Raise Strategy - Activating the Business for Commercial Launch",
  "",
  "THE CONTEXT:",
  "Hobson can operate pilot programmes throughout 2026 using founder-led execution",
  "and outsourced engineering, but the company cannot hire its core team or begin",
  "meaningful commercial activity without external capital. A seed round is required",
  "to activate the business, complete the production-ready platform, and support a",
  "minimal commercial launch in early 2027.",
  "",
  "WHAT THIS CAPITAL UNLOCKS:",
  "- Foundational Team: Core hires to execute commercial strategy",
  "- Infrastructure: Production-ready platform build",
  "- Go-to-Market: Convert pilot insights into scalable revenue",
  "",
  "RAISE SCENARIOS:",
  "",
  "GBP 1.2M - Activation Round (9-12 months runway)",
  "Transition from pilots to limited 2027 launch. Minimal runway, heightened risk.",
  "",
  "GBP 1.5M - Minimum Credible (12-18 months runway)",
  "Covers early operating costs and supports a stable launch phase. Minimum viable raise.",
  "",
  "GBP 1.8M - Balanced Seed [RECOMMENDED] (18-22 months runway)",
  "Supports product velocity, marketing execution, and early enterprise engagement.",
  "Strategically optimal level for confident execution.",
  "",
  "GBP 2.2M - Accelerated Growth (22-28 months runway)",
  "Positions for accelerated UK scale and early international expansion from 2028.",
  "",
  "COMMERCIAL TRAJECTORY:",
  "2026: Pilots & Validation - Technical validation with real-world partners",
  "2027: Commercial Launch - Minimal but functional market entry",
  "2028+: Scale & Expand - Accelerated UK penetration and global expansion",
  "",
  "SUMMARY:",
  "This raise unlocks the full commercial potential of the business: pilots and",
  "technical validation in 2026, a minimal but functional launch in 2027, and",
  "accelerated UK penetration and global expansion from 2028 onwards.",
];

export const getRevenueGrowthPdfContent = (): string[] => [
  "Revenue Growth (2026-2031):",
  "",
  "Annual Revenue Projections:",
  "",
  "Year | UK Revenue     | Global Revenue  | Total Revenue",
  "2026 | GBP 0          | GBP 0           | GBP 0",
  "2027 | GBP 708,368    | --              | GBP 708,368",
  "2028 | GBP 1,770,920  | GBP 6,015,707   | GBP 7,786,628",
  "2029 | GBP 3,541,840  | GBP 18,047,122  | GBP 21,588,963",
  "2030 | GBP 5,666,945  | GBP 36,094,244  | GBP 41,761,189",
  "2031 | GBP 7,792,049  | GBP 72,188,489  | GBP 79,980,538",
  "",
  "Key Growth Drivers:",
  "- UK market penetration: 0.5% -> 5.5% (2027-2031)",
  "- Global expansion begins 2028 with 0.25% penetration",
  "- Global penetration grows to 3.0% by 2031",
  "- Blended ARPU: GBP 495.72/year",
  "",
  "Revenue Mix Evolution:",
  "- 2027: 100% UK (market launch year)",
  "- 2028: ~23% UK, ~77% Global (expansion year)",
  "- 2031: ~10% UK, ~90% Global (scaled operations)",
  "",
  "Review the UK Assumptions, Global Assumptions, Market Penetration, and Revenue Model tabs for detailed methodology.",
];

export const getPLGrowthPdfContent = (): string[] => [
  "P/L Growth Trajectory (2026-2031):",
  "",
  "Annual Financial Performance:",
  "",
  "Year | Revenue      | COGS (10%)   | OpEx      | Net Profit",
  "2026 | GBP 0        | GBP 0        | GBP 850k  | -GBP 850k",
  "2027 | GBP 708,368  | GBP 71k      | GBP 850k  | -GBP 213k",
  "2028 | GBP 7.79M    | GBP 779k     | GBP 1.8M  | GBP 5.2M",
  "2029 | GBP 21.59M   | GBP 2.16M    | GBP 3.5M  | GBP 15.9M",
  "2030 | GBP 41.76M   | GBP 4.18M    | GBP 6.0M  | GBP 31.6M",
  "2031 | GBP 79.98M   | GBP 8.0M     | GBP 10.0M | GBP 62.0M",
  "",
  "Profitability Metrics:",
  "- Gross Margin: ~90% (revenue minus COGS)",
  "- Operating Margin: Expands significantly with scale",
  "- Net Profit Margin: Grows to ~77% by 2031",
  "",
  "The following tabs explain how this growth is achievable:",
  "- Revenue Assumptions and Cost Assumptions for detailed methodology",
  "- Market Penetration for customer acquisition projections",
  "- Revenue Model for pricing and mix assumptions",
];

export const getRevenueModelPdfContent = (): string[] => [
  "Revenue Model - 6-Year Projections (2026-2031):",
  "",
  "Pricing Structure:",
  "- Blended ARPU: GBP 495.72/year (GBP 41.31/month)",
  "- Tier Mix: Essential (60%), Essential Plus (30%), Enterprise (10%)",
  "- No per-user or per-asset fees",
  "",
  "UK Market Penetration:",
  "",
  "Year | Penetration",
  "2027 | 0.5%",
  "2028 | 1.5%",
  "2029 | 3.0%",
  "2030 | 4.5%",
  "2031 | 5.5%",
  "",
  "Global Market Penetration:",
  "",
  "Year | Penetration",
  "2028 | 0.25%",
  "2029 | 1.0%",
  "2030 | 2.0%",
  "2031 | 3.0%",
  "",
  "Combined Revenue:",
  "",
  "Year | UK Revenue     | Global Revenue  | Total Revenue",
  "2026 | GBP 0          | GBP 0           | GBP 0",
  "2027 | GBP 708,368    | --              | GBP 708,368",
  "2028 | GBP 1,770,920  | GBP 6,015,707   | GBP 7,786,628",
  "2029 | GBP 3,541,840  | GBP 18,047,122  | GBP 21,588,963",
  "2030 | GBP 5,666,945  | GBP 36,094,244  | GBP 41,761,189",
  "2031 | GBP 7,792,049  | GBP 72,188,489  | GBP 79,980,538",
  "",
  "ROI Justification:",
  "- Annual efficiency saving: GBP 6,000 per role",
  "- Annual subscription: GBP 495.72",
  "- ROI: ~12x return on subscription cost",
];

export const getGlobalJustificationPdfContent = (): string[] => [
  "Global Market Size Assumption:",
  "Evidence-based methodology for estimating global real estate business count",
  "",
  "1. Real estate is a universal, high-density industry:",
  "Across developed economies (UK, EU, US), real estate consistently represents:",
  "- 10-14% of GDP (OECD, World Bank, Statista - property, leasing, construction, and real estate services)",
  "- 4-5% of all formally registered businesses (ONS, Eurostat, US Census NAICS 531, OECD Structural Business Statistics)",
  "These ratios are stable across OECD countries, allowing scalable market estimation.",
  "",
  "2. Business density per population is consistent across OECD markets:",
  "Registered businesses per 1,000 people:",
  "- UK: 75-80",
  "- EU average: 60-70",
  "- USA: 70-80",
  "- OECD average: 65",
  "This creates a reliable basis for cross-market scaling using population.",
  "",
  "3. Global scaling uses comparable markets (not world population):",
  "Hobson targets regulated, formal markets: UK, EU, US, Canada, Australia, NZ, Singapore.",
  "- OECD markets population: 1.38 billion",
  "- UK population: 67 million",
  "- Scaling factor: 20.5x",
  "To maintain a conservative and defendable modelling approach, Hobson uses an 18x multiplier (midpoint of the 15-20x feasible range).",
  "",
  "4. Resulting Global Real Estate Business Estimate:",
  "Using UK baseline = 235,200 real estate businesses (ONS)",
  "- UK: 1x multiplier = 235,200 businesses",
  "- Global formal markets (OECD-aligned): 18x multiplier = approx 4.2 million businesses",
  "This reflects the realistic global addressable market for document-heavy real estate operations.",
  "",
  "5. Why this assumption is credible:",
  "- Uses published national statistics, not guesswork",
  "- Scales only across markets where Hobson can actually launch",
  "- Avoids inflated 'world population' errors common in startup models",
  "- Investors prefer midpoint estimates within evidence-based ranges",
  "",
  "Final Assumption Used in the Financial Model:",
  "Hobson's global market size is projected at ~4.2 million real estate businesses, justified by OECD business density and the proportion of real estate firms across comparable markets.",
];

export const getCACAssumptionsPdfContent = (): string[] => [
  "Customer Acquisition Cost (CAC) Assumptions:",
  "",
  "Acquisition Spend Drivers (% of Revenue):",
  "- Digital Marketing: 8%",
  "- Sales/SDR Support: 4%",
  "- Total CAC Spend: 12% of revenue",
  "",
  "New Customer Counts per Year:",
  "",
  "UK:",
  "Year | Customers | New",
  "2027 | 2,352     | 2,352",
  "2028 | 2,940     | 588",
  "2029 | 3,528     | 588",
  "2030 | 4,116     | 588",
  "2031 | 4,704     | 588",
  "",
  "Global:",
  "Year | Customers | New",
  "2028 | 10,584    | 10,584",
  "2029 | 14,818    | 4,234",
  "2030 | 21,168    | 6,350",
  "2031 | 25,402    | 4,234",
  "",
  "Total New Customers per Year:",
  "2027: 2,352 | 2028: 11,172 | 2029: 4,822 | 2030: 6,938 | 2031: 4,822",
  "",
  "CAC Calculation (12% of Revenue / New Customers):",
  "",
  "Year | Revenue   | Acquisition (12%) | New Customers | CAC",
  "2027 | GBP 1.17M | GBP 140k          | 2,352         | GBP 60",
  "2028 | GBP 6.71M | GBP 805k          | 11,172        | GBP 72",
  "2029 | GBP 9.10M | GBP 1.09M         | 4,822         | GBP 226",
  "2030 | GBP 12.53M| GBP 1.50M         | 6,938         | GBP 217",
  "2031 | GBP 14.92M| GBP 1.79M         | 4,822         | GBP 371",
  "",
  "LTV:CAC Analysis:",
  "- ARPU: GBP 495.72/year",
  "- 5-year LTV: GBP 2,478.60",
  "",
  "Year | CAC     | LTV:CAC Ratio",
  "2027 | GBP 60  | 41x",
  "2028 | GBP 72  | 34x",
  "2029 | GBP 226 | 11x",
  "2030 | GBP 217 | 11x",
  "2031 | GBP 371 | 7x",
  "",
  "CAC Payback Period:",
  "- Monthly ARPU: GBP 41.31",
  "- 2027: 1.5 months | 2028: 1.7 months | 2029: 5.5 months",
  "- 2030: 5.2 months | 2031: 9.0 months",
  "",
  "All years maintain strong LTV:CAC ratios above 3x VC threshold.",
];

export const getBurnRateAssumptionsPdfContent = (): string[] => [
  "Burn Rate Assumptions - Path to Immediate Profitability:",
  "",
  "Key Insight:",
  "Hobson becomes profitable immediately upon commercial launch in 2027.",
  "This is a critical differentiator from typical SaaS models.",
  "",
  "Fixed Costs (Monthly):",
  "- Internal Team: GBP 40.8k/month (GBP 490k annually)",
  "- Outsourced Functions: GBP 30k/month",
  "- Total Fixed: GBP 70.8k/month",
  "",
  "Variable Costs (% of Revenue):",
  "- COGS: 10%",
  "- Customer Acquisition: 12%",
  "- Total Variable: 22%",
  "",
  "Monthly Surplus by Year:",
  "",
  "Year | Revenue/mo | Fixed | Variable | Surplus",
  "2027 | GBP 97.5k  | GBP 70.8k | GBP 21.5k | GBP 5,250",
  "2028 | GBP 559k   | GBP 70.8k | GBP 123k  | GBP 365k",
  "2029 | GBP 758k   | GBP 70.8k | GBP 167k  | GBP 521k",
  "2030 | GBP 1.04M  | GBP 70.8k | GBP 229k  | GBP 744k",
  "2031 | GBP 1.24M  | GBP 70.8k | GBP 273k  | GBP 899k",
  "",
  "Strategic Implications:",
  "- Capital required only for pre-revenue build (2025-2026)",
  "- Operating model becomes self-sustaining at launch",
  "- Immediate profitability is a key investor credibility signal",
  "- Expected gross margins: 88%",
];

export const getUKAssumptionsFinancialsPdfContent = (): string[] => [
  "UK Assumptions - Financial modelling foundation for UK market:",
  "",
  "1. Size of the UK Real Estate Business Market:",
  "- Total UK businesses: 5.6 million",
  "- Real estate activities represent 4.2% = 235,200 real estate businesses",
  "- Source: ONS - Real estate activities by employment size",
  "",
  "2. Business Size Breakdown (Real Estate Only):",
  "- Small (1-9 employees): 96% = 225,792 businesses",
  "- Medium (10-49): 2.7% = 6,350 businesses",
  "- Large (50-249): 0.6% = 1,411 businesses",
  "- Enterprise (250+): 0.1% = 235 businesses",
  "- Source: BEIS / ONS",
  "",
  "Summary:",
  "These assumptions establish the UK market baseline for Hobson's financial modelling:",
  "1. A large real estate market of 235,200 businesses",
  "2. Clear segmentation by business size, with 96% being small operators",
];

// Structured data for dedicated PDF renderer
export const getWhyNowStructuredData = () => ({
  sections: [
    {
      number: "1",
      title: "Technology Has Reached the Threshold",
      intro: "AI systems can now meet the accuracy, traceability, and reliability requirements of Real Estate decision-making:",
      bullets: [
        "Production-grade document extraction exceeding 95%",
        "Multi-document reasoning at scale",
        "Cost-effective real-time inference",
      ],
      conclusion: "This problem could not be solved before. Now it can be done economically.",
    },
    {
      number: "2",
      title: "The Real Estate Industry is Ready and Desperate for Efficiency",
      intro: "Real Estate operators face converging pressure:",
      bullets: [
        "Rising regulatory and reporting burden",
        "Headcount constraints and labour inflation",
        "Margin compression",
        "Increased complexity per asset",
      ],
      conclusion: "Manual processes are no longer inefficient; they are financially irresponsible.",
    },
    {
      number: "3",
      title: "Competitive White Space Is Closing",
      intro: "Despite the scale of the opportunity:",
      bullets: [
        "No AI-native leader exists in Real Estate document intelligence",
        "Legacy PropTech platforms are too embedded to replace manual reasoning",
        "Horizontal AI tools cannot meet regulatory or accuracy expectations",
      ],
      conclusion: "A narrow 12-18-month window exists to define the default category standard.",
    },
    {
      number: "4",
      title: "Regulation & Economics",
      intro: "Regulatory requirements are increasing document volume and complexity:",
      bullets: [
        "ESG reporting now requires document-linked evidence",
        "Auditability and traceability are mandatory",
        "Risk and safety obligations expand annually",
        "Data residency rules favour compliant, regional AI solutions",
      ],
      conclusion: "At the same time, labour inflation makes manual document work structurally unaffordable.",
    },
    {
      number: "5",
      title: "The Economics Are Clear",
      intro: "",
      bullets: [],
      conclusion: "AI delivers approximately GBP 6,000 per role per year in reclaimed capacity. Tools that remove labour, not merely optimise it, are adopted first.",
    },
  ],
  convergence: {
    title: "THE CONVERGENCE",
    points: [
      "Technology is ready",
      "The market is ready",
      "Competition is absent",
      "Regulation is rising",
      "Economics demand efficiency",
    ],
    conclusion: "This is the exact moment the industry shifts from 'documents everywhere' to 'answers instantly.'",
    callToAction: "And Hobson is positioned to lead that shift.",
  },
});

export const getWhyNowPdfContent = (): string[] => [
  "WHY NOW?",
  "",
  "The Perfect Moment for AI Clarity in Real Estate",
  "",
  "1. TECHNOLOGY HAS REACHED THE THRESHOLD",
  "",
  "AI systems can now meet the accuracy, traceability, and reliability requirements of Real Estate decision-making:",
  "- Production-grade document extraction exceeding 95%",
  "- Multi-document reasoning at scale",
  "- Cost-effective real-time inference",
  "",
  "This problem could not be solved before. Now it can be done economically.",
  "",
  "2. THE REAL ESTATE INDUSTRY IS READY AND DESPERATE FOR EFFICIENCY",
  "",
  "Real Estate operators face converging pressure:",
  "- Rising regulatory and reporting burden",
  "- Headcount constraints and labour inflation",
  "- Margin compression",
  "- Increased complexity per asset",
  "",
  "Manual processes are no longer inefficient; they are financially irresponsible.",
  "",
  "3. COMPETITIVE WHITE SPACE IS CLOSING",
  "",
  "Despite the scale of the opportunity:",
  "- No AI-native leader exists in Real Estate document intelligence",
  "- Legacy PropTech platforms are too embedded to replace manual reasoning",
  "- Horizontal AI tools cannot meet regulatory or accuracy expectations",
  "",
  "A narrow 12-18-month window exists to define the default category standard.",
  "",
  "4. REGULATION & ECONOMICS",
  "",
  "Regulatory requirements are increasing document volume and complexity:",
  "- ESG reporting now requires document-linked evidence",
  "- Auditability and traceability are mandatory",
  "- Risk and safety obligations expand annually",
  "- Data residency rules favour compliant, regional AI solutions",
  "",
  "At the same time, labour inflation makes manual document work structurally unaffordable.",
  "",
  "5. THE ECONOMICS ARE CLEAR",
  "",
  "AI delivers approximately GBP 6,000 per role per year in reclaimed capacity.",
  "Tools that remove labour, not merely optimise it, are adopted first.",
  "",
  "THE CONVERGENCE",
  "",
  "Technology is ready. The market is ready. Competition is absent.",
  "Regulation is rising. Economics demand efficiency.",
  "",
  "This is the exact moment the industry shifts from 'documents everywhere' to 'answers instantly.'",
  "",
  "And Hobson is positioned to lead that shift.",
];

export const getMarketingSalesStrategyPdfContent = (): string[] => [
  "Marketing and Sales Strategy - Marketing & Branding:",
  "",
  "Multi-channel approach targeting UK property professionals.",
  "",
  "Sales Channels:",
  "",
  "1. Direct Sales:",
  "- Targeted outreach to property management companies and landlords",
  "- Focus on enterprise accounts with large portfolios",
  "- Personalised demonstrations using client documents",
  "",
  "2. Strategic Partnerships:",
  "- Integrations with property management platforms",
  "- Partnerships with estate agents and letting agencies",
  "- White-label opportunities for software vendors",
  "",
  "3. Digital Marketing:",
  "- SEO and content marketing for real estate professionals",
  "- Targeted campaigns on LinkedIn and industry platforms",
  "- Thought leadership and educational content",
  "",
  "4. Industry Events:",
  "- PropTech conferences and trade shows",
  "- Networking events and speaking opportunities",
  "- Industry association partnerships",
  "",
  "Sales Process:",
  "1. Discovery - Identify pain points and document challenges",
  "2. Demo - Personalised demonstration with client documents",
  "3. Trial - Free pilot period to prove value",
  "4. Onboard - Seamless setup and training",
  "",
  "Target Metrics:",
  "- Target CAC: GBP 500 (Customer acquisition cost)",
  "- LTV:CAC Ratio: 10:1 (Target lifetime value ratio)",
  "- Sales Cycle: 30 days (Average time to close)",
  "",
  "Dual Approach Strategy:",
  "Our strategy combines low-touch self-service for smaller operators with",
  "high-touch enterprise sales for larger portfolios. This dual approach",
  "maximises market coverage while optimising customer acquisition costs.",
];

// Structured data for dedicated PDF renderer
export const getExecutiveContextStructuredData = () => ({
  inflexionPoint: "The Real Estate industry has entered a structural inflexion point.",
  pressures: [
    "Regulatory complexity",
    "Operating cost inflation",
    "Chronic labour shortages",
    "Rising compliance exposure",
  ],
  contextParagraph: "Traditional property management systems can no longer scale to meet the demands placed upon them. Operators are under immediate pressure to transform how they manage risk, compliance, documentation, and decision-making - not as an optimisation, but as a necessity for survival.",
  hobsonPositioning: "Hobson will establish the AI operating layer for the Real Estate sector before the market consolidates around a new standard.",
  missionStatement: {
    title: "Mission Statement",
    subtitle: "Innovation without disruption",
    content: "To become the intelligence layer real estate runs on - ensuring every operational decision is based on instant, auditable insight rather than manual search, institutional memory, or guesswork.",
  },
  positioningStatement: {
    title: "Positioning Statement",
    subtitle: "Disruption without displacement",
    content: "Hobson replaces manual document work in real estate with AI-driven reasoning, delivering instant, traceable answers that reduce staffing costs, prevent costly errors, and accelerate operational decision-making. It embeds directly into existing workflows, becoming the intelligence infrastructure modern real estate operations require to compete.",
  },
  conclusion: "The following go-to-market strategy is therefore not incremental; it is designed for rapid validation, accelerated adoption, and decisive category capture - creating a narrow, highly investable window in which early capital enables Hobson to define the industry's future operating model.",
});

// String array version for backward compatibility with generic renderer
export const getExecutiveContextPdfContent = (): string[] => [];

// Structured data for dedicated PDF renderer
export const getSituationAnalysisStructuredData = () => ({
  header: {
    title: "Customer Segmentation & Targeting",
    subtitle: "Three distinct segments with shared core pain: time and risk of manual document search",
  },
  intro: "Hobson serves Real Estate organisations that manage operational documents such as leases, agreements, and compliance files. Through discovery interviews and early product testing, three distinct segments emerged. Each differs in maturity, administrative load, and appetite for technology, but all share the same core pain.",
  segments: [
    {
      id: 1,
      title: "Large Portfolio Operators with Heavy Administration",
      targetLevel: "Primary",
      description: "Organisations managing hundreds of assets with layered approval structures and multiple document repositories (legacy CRMs, shared drives, email archives). Their systems are complex, decentralised, and historically built.",
      hobsonValue: "Hobson behaves like a rapid information assistant. It retrieves clauses, dates, terms, and summaries from large volumes of documents in seconds.",
      useCases: [
        "Responding quickly to a person's queries",
        "Supporting internal and board reporting by querying portfolio-wide documents",
        "Helping junior staff access information without constant senior oversight",
      ],
      feedback: "It takes us too long to find even simple information.",
      targetReason: "Highest administrative burden, clear ROI, larger teams for word-of-mouth",
    },
    {
      id: 2,
      title: "Medium-Sized Real Estate Companies with Agile Workflows",
      targetLevel: "Secondary",
      description: "Lean, fast-moving teams managing mid-sized portfolios. These organisations often lack centralised knowledge systems and rely on shared drives, email threads, and informal knowledge.",
      hobsonValue: "Hobson provides clarity and structure without requiring a system overhaul. It acts as an instant-access layer over existing files.",
      useCases: [
        "Asset reviews and operational audits",
        "Onboarding new staff, reducing dependency on legacy knowledge",
        "Producing internal summary reports and board updates",
      ],
      feedback: "Information is spread across inboxes, folders and individuals' knowledge.",
      targetReason: "Agile decision-making, low barriers, ideal for early case studies",
    },
    {
      id: 3,
      title: "Small Portfolio Owners / Owner-Managers",
      targetLevel: "Future",
      description: "Hands-on owner-operators running small portfolios with limited administrative support and minimal technology infrastructure. They rely on manual workflows, email, paper files, and spreadsheets.",
      hobsonValue: "Hobson becomes a simple, intelligent digital assistant that finds and summarises lease terms, deadlines, and answers without requiring training.",
      useCases: [
        "Preparing renewals, notices, or legal letters",
        "Answering day-to-day operational questions",
        "Organising portfolio details and key dates",
      ],
      feedback: "I just want something simple that works and doesn't require onboarding.",
      targetReason: "High volume potential, suits long-term self-serve model",
    },
  ],
  strategyIntro: "While all three segments benefit from Hobson's document-native AI, the go-to-market focus is phased:",
  summary: "Across all segments, the underlying problem is consistent: critical information resides in documents, not systems, which slows decision-making and increases operational risk. Hobson solves this by delivering fast, accurate, referenced answers using the files teams already rely on. This makes it valuable for organisations of every size, but especially for those with complex, document-heavy portfolios and high compliance pressure.",
});

// String array version for backward compatibility
export const getSituationAnalysisPdfContent = (): string[] => [];

// Structured data for dedicated PDF renderer
export const getCustomerPersonasStructuredData = () => ({
  header: {
    title: "Customer Personas",
    subtitle: "Individual decision-makers based on discovery conversations and early product feedback",
  },
  intro: "Building on the three segments defined, the following personas translate those organisational types into individual decision-makers and users. Each persona is based on honest discovery conversations and early product feedback, reflecting distinct motivations, behaviours, and buying considerations.",
  personas: [
    {
      id: 1,
      name: "Leigh",
      role: "COO, Large Portfolio Operator",
      segment: "Primary Target",
      description: "Responsible for operational efficiency, compliance, and reporting across an extensive, complex property portfolio to streamline information access across the organisation.",
      goals: [
        "Increase team efficiency without adding complexity or headcount",
        "Reduce operational risk caused by manual work and missed details",
        "Support junior staff with tools that enhance independence and confidence",
      ],
      frustrations: [
        "Fragmented systems and inconsistent storage of documents across CRMs, drives, and inboxes",
        "High-pressure response demands from internal stakeholders and investors",
        "Too much time wasted retrieving basic information from leases and service agreements",
        "Risk of errors in analysis, summaries, and reporting due to manual workflows",
      ],
      workflows: [
        "Reviewing and approving internal and board-level reports",
        "Responding to compliance, audit, and investor questions",
        "Overseeing operational processes and cross-team communication",
        "Ensuring data accuracy across multiple systems and document repositories",
      ],
      psychographics: { type: "Achiever", description: "Goal-oriented, professional, values stability, efficiency, and credibility. Prefers reliable tools that reduce risk and reinforce professional reputation." },
      decisionPower: [
        "Final approval for operational tools and workflow changes",
        "Controls budgets for technology adoption in operations",
        "Drives decisions around compliance, reporting infrastructure, and process change",
      ],
      success: [
        "Information retrieved instantly in high-pressure moments",
        "Fewer reporting errors and audit queries",
        "Faster responses to stakeholders and board members",
        "Teams feeling confident, supported, and less dependent on 'super users'",
        "Technology that improves clarity without disrupting established workflows",
      ],
    },
    {
      id: 2,
      name: "James",
      role: "Head of Asset Management, Medium-Sized Company",
      segment: "Secondary Target",
      description: "Head of Asset Management at a mid-sized, agile property company, managing a growing portfolio with a lean team.",
      goals: [
        "Enable lean growth without proportional increases in headcount",
        "Free up time for strategic asset decisions instead of manual document searching",
        "Improve visibility and confidence across documents and shared drives",
      ],
      frustrations: [
        "Limited team capacity and bandwidth",
        "Excessive time spent digging through shared drives, emails, and old folders",
        "Pressure to scale operations efficiently with existing resources",
        "Strain caused by the lack of a centralised, 'single view' of information",
      ],
      workflows: [
        "Reviewing asset performance and preparing summary packs",
        "Producing internal updates and board-ready reports",
        "Coordinating with property managers, finance, and analysts",
        "Onboarding new staff into scattered, informal data systems",
      ],
      psychographics: { type: "Thinker", description: "Analytical, informed, and value-driven. Makes decisions based on evidence, quality, and long-term stability. Prefers tools with clear logic and structured outcomes." },
      decisionPower: [
        "Strong influence over tool selection for operational and asset workflows",
        "Responsible for evaluating demos and reporting effectiveness to senior leadership",
        "Recommends tools that make the team more effective without creating complexity",
      ],
      objections: [
        "Budget concerns and pressure to justify new subscriptions",
        "Desire to avoid 'yet another tool to manage'",
        "Belief that current workload, while painful, is still manageable",
      ],
      success: [
        "A lean team that operates efficiently, even as the portfolio grows",
        "Reduced time spent on repetitive information retrieval tasks",
        "Confidence that reports are based on accurate, accessible data",
        "Technology that scales with the business instead of becoming a bottleneck",
      ],
    },
    {
      id: 3,
      name: "Priya",
      role: "Owner-Manager, Small Portfolio",
      segment: "Future Target",
      description: "Owner-Manager responsible for every operational, legal, and financial aspect of a small property portfolio.",
      goals: [
        "Stay organised with minimal effort and minimal tools",
        "Save time by avoiding manual searches through email and paper files",
        "Present a more professional operation without adopting complex systems",
      ],
      frustrations: [
        "Juggling multiple roles simultaneously (operations, finance, compliance, relationships)",
        "No structured or centralised process for storing documents",
        "Wasting time trying to find tenant, lease, or date information when issues arise",
        "Feeling overwhelmed by admin tasks on top of core responsibilities",
      ],
      workflows: [
        "Managing renewals, rent reviews, and tenant issues",
        "Preparing documents for solicitors, lenders, or agents",
        "Locating key lease terms for everyday decision-making",
        "Running operations largely from email threads, folders, and spreadsheets",
      ],
      psychographics: { type: "Striver", description: "Motivated by achievement but constrained by limited resources. Aspirational and brand-conscious, responds strongly to solutions that feel simple, modern, and empowering." },
      decisionPower: [
        "Sole decision-maker for budget, technology, and process choices",
        "Highly influenced by ease of onboarding, simplicity, and clear pricing",
      ],
      objections: [
        "Fear of complexity, hidden costs, or 'being locked in'",
        "Concern about technical jargon or a steep learning curve",
        "Belief that AI tools are primarily for larger companies or enterprises",
      ],
      success: [
        "Running operations more professionally with very little extra effort",
        "Finding information instantly without digging through old email chains",
        "A simple, affordable tool that feels built specifically for small operators",
        "More time freed up for higher-value activities and personal life",
      ],
    },
  ],
  summary: {
    intro: "Across Leigh, James, and Priya, the shared underlying issue is the time and risk involved in searching unstructured documents.",
    personas: [
      { name: "Leigh", insight: "Wants efficiency, accuracy, and risk reduction at scale." },
      { name: "James", insight: "Wants scalability and clarity without extra headcount or complexity." },
      { name: "Priya", insight: "Wants simplicity, organisation, and professionalism with no setup burden." },
    ],
    conclusion: "Hobson personas, linked directly to the segments for targeting, product roadmap, messaging, and go-to-market focus: enterprise first for high-value validation, then agile mid-market, and ultimately scalable self-serve for long-tail owner-managers.",
  },
});

// String array version for backward compatibility
export const getCustomerPersonasPdfContent = (): string[] => [];

// Structured data for dedicated PDF renderer
export const getCustomerUserJourneysStructuredData = () => ({
  header: {
    title: "Customer User Journeys",
    subtitle: "The Customer journey maps focus on the MVP journey by one of our pilots",
  },
  intro: "It demonstrates how an adopter moves from first contact to sustained engagement.",
  persona: {
    name: "Leigh X",
    role: "COO",
    organisation: "Large Property Mgmt",
    primaryGoal: "Retrieve information quickly, reduce administrative load, empower teams with accurate and accessible data.",
  },
  stages: [
    {
      stage: "Stage 1",
      title: "Discovery & Outreach",
      touchpoints: ["Personal introduction", "Initial proposal document", "Discovery meeting with the operational team"],
      thinks: "This looks promising. AI could finally simplify our data access problems.",
      does: ["Reviews proposal materials", "Engages in discovery conversations", "Evaluates whether the concept is worth exploring"],
      feels: "Optimistic and curious about the potential benefit.",
      blocks: "Unclear grasp of Hobson's full capabilities. Concerns about how it would sit alongside existing systems and data concerns with AI",
      improvement: "Provide clearer proposals supported by early examples of real outputs.",
    },
    {
      stage: "Stage 2",
      title: "Problem Definition & Alignment",
      touchpoints: ["Strategy meeting", "Discovery summary and insights report", "Follow-up alignment document"],
      thinks: "They understand our challenges. But will the solution actually match our workflow?",
      does: ["Confirms key operational pain points", "Tests whether Hobson's vision aligns with their processes"],
      feels: "Measured and cautious - alignment feels close, but expectations need precision.",
      blocks: "Worry that the final product may differ from early expectations",
      improvement: "Introduce a no-code preview to align expectations visually before committing to the MVP.",
    },
    {
      stage: "Stage 3",
      title: "Data Sharing & Preparation",
      touchpoints: ["NDA signing", "Uploading initial document sets", "Clarification calls on file structure and expected outputs"],
      thinks: "We're stretched - gathering these documents will take time. Will the system handle messy files?",
      does: ["Instructs someone to collect documents from multiple internal teams", "Coordinates data transfer and clarifies required materials"],
      feels: "Frustrated by the time commitment and anxious about data accuracy.",
      blocks: "Heavy administrative work to gather documents and concerns about security and reliability",
      improvement: "Provide a simple data checklist, secure upload tool, and hands-on support during document preparation.",
    },
    {
      stage: "Stage 4",
      title: "No-Code Deployment & Early Testing",
      touchpoints: ["Access to basic AI interface", "Team feedback session", "Usage review and early data insights"],
      thinks: "This is genuinely useful. But can it handle complexity? And how does it fit into our current systems?",
      does: ["Tests simple and moderately complex queries", "Shares structured feedback", "Compares Hobson to existing manual processes"],
      feels: "Excited and reassured by early time savings.",
      blocks: "Uncertainty around future scalability and need for clearer performance metrics",
      improvement: "Add deeper analytics with accuracy indicators, response times, and error mapping.",
    },
    {
      stage: "Stage 5",
      title: "Communication Gap & Re-Engagement",
      touchpoints: ["Re-engagement meeting following technical delays", "Transparent update on challenges and revised timelines", "Agreement to share additional documents for improved training"],
      thinks: "They were open and honest. Delays happen, but communication must be consistent.",
      does: ["Provides internal reassurance", "Approves sharing more data", "Reassesses long-term product viability"],
      feels: "Reassured but cautious - trust maintained, but now fragile.",
      blocks: "Fear that communication gaps may occur again and uncertainty around revised timelines",
      improvement: "Establish a predictable communication rhythm and share small, visible progress updates.",
    },
    {
      stage: "Stage 6",
      title: "Pre-MVP Engagement & Strengthening",
      touchpoints: ["Additional document uploads", "Regular progress updates", "Previews or screenshots of developing features", "Refined no-code demonstrations"],
      thinks: "Progress is clear. The more data they have, the better the output becomes.",
      does: ["Shares further portfolio information", "Prepares internal teams for MVP testing", "Participates actively in feedback loops"],
      feels: "Cautiously optimistic - momentum is returning.",
      blocks: "Concern about time investment versus expected return and fear of another slowdown",
      improvement: "Provide a simple progress tracker and deliver small, frequent wins to sustain confidence.",
    },
    {
      stage: "Stage 7",
      title: "MVP Deployment (Q1 2026)",
      touchpoints: ["MVP rollout", "User onboarding", "Usage data monitoring", "Team review after two weeks"],
      thinks: "TBA - final assessment depends on live MVP performance.",
      does: ["To be determined once real-world usage begins"],
      feels: "TBA - shaped by MVP testing results.",
      blocks: "TBA - identified once real-world usage begins.",
      improvement: "TBA - shaped by MVP testing results and user feedback cycles.",
    },
  ],
  strategicLessons: [
    "Communication is as important as product quality during early-stage adoption.",
    "Enterprise clients remain committed when progress is visible and expectation-setting is clear.",
  ],
  summary: "Leigh's journey reflects the typical enterprise adoption path: early enthusiasm, validation of alignment, operational friction during data preparation, renewed confidence after initial testing, a temporary loss of momentum due to delays, and restored trust following transparent communication.",
  conclusion: "Hobson now enters MVP deployment with stronger trust foundations, deeper document coverage, and clearer alignment with enterprise workflows.",
});

// String array version for backward compatibility
export const getCustomerUserJourneysPdfContent = (): string[] => [];

// Structured data for dedicated PDF renderer
export const getMarketDescriptionStructuredData = () => ({
  header: {
    title: "Market Description",
    intro: "Hobson operates in a real estate sector undergoing profound operational and technological change. Real estate teams are responsible for managing increasing volumes of unstructured and structured data while facing growing pressure to deliver accurate, compliant, and timely information. Several structural trends have converged to create an environment where traditional workflows are no longer sustainable - making AI-driven document intelligence not just beneficial, but necessary.",
  },
  keyTrends: {
    title: "Key Actionable Trends in Real Estate Data Use",
    intro: "The Real Estate industry has become significantly more data-intensive in the past decade. Operators are now required to handle:",
    items: [
      "Complex lease documents, often 10-30 pages each",
      "Hundreds of supporting documents in even modest portfolios",
      "Multiple sources of truth across email, shared drives, property management systems, and legacy databases",
      "Growing investor reporting requirements with deeper data granularity",
      "Greater expectations for real-time insight, especially during portfolio reviews or negotiations",
    ],
    conclusion: "These trends have stretched the traditional 'manual search and summarise' model beyond its limits.",
  },
  marketStats: [
    { label: "AI in Real Estate CAGR", value: "36.1%", source: "Business Research Company" },
    { label: "Forecasted Market by 2030", value: "$1.8T", source: "Maximize Market Research" },
    { label: "NOI Increase from Automation", value: "10%+", source: "McKinsey" },
    { label: "Firms Reporting Cost Reductions", value: "49%", source: "Forbes" },
  ],
  documentOverload: {
    title: "Document Overload in Transactions and Portfolio Management",
    intro: "Across organisations of all sizes, document overload has become one of the most expensive and time-consuming operational challenges:",
    items: [
      "Asset managers, analysts, and COOs spend hours every week searching through PDFs, emails, and scanned files",
      "Transactions involve hundreds of unstructured documents with inconsistent formats",
      "Critical information is often lost inside appendices, addendums, and correspondence chains",
      "Portfolio reviews require extraction of dates, obligations, and clauses across dozens or hundreds of leases",
      "Staff shortages amplify the impact - fewer people must do more work, faster",
    ],
    conclusion: "This overload doesn't just slow teams down - it introduces inconsistent reporting, contractual risk, and operational bottlenecks.",
  },
  compliance: {
    title: "Pressure for Speed, Compliance, and Accuracy",
    intro: "The regulatory, investor, and operational environment is becoming more demanding every year:",
    demands: [
      "RICS and audit requirements demand accuracy, traceability, and referenced data",
      "ESG and sustainability reporting require consistent interpretation of clauses and contracts",
      "Service charge transparency rules add scrutiny to operational documentation",
      "Investors expect rapid, evidence-backed answers in meetings and board reviews",
    ],
    mustDeliver: ["Faster answers", "Clearer documentation", "Referenced insights", "Reduced risk of human error"],
    conclusion: "Reporting errors or delays undermine trust, confidence, and credibility.",
  },
  convergencePressures: [
    "Data volume has exploded",
    "Manual workflows cannot keep up",
    "Teams are smaller but expectations are higher",
    "Compliance rules demand accuracy and traceability",
    "Global evidence proves that AI generates measurable efficiency gains",
  ],
  hobsonPosition: {
    intro: "Hobson is positioned precisely at this intersection - enabling Real Estate teams to retrieve accurate, referenced answers instantly, using the documents they already rely on. Its lightweight, low-friction design makes it uniquely suited to a market that needs automation without disruption.",
    conclusion: "Hobson's solution is not just relevant - it is timely, strategically aligned, and driven by immediate market need.",
  },
});

// String array version for backward compatibility
export const getMarketDescriptionPdfContent = (): string[] => [];

// Structured data for dedicated PDF renderer
export const getCompetitorBenchmarksStructuredData = () => ({
  header: {
    title: "Competitor Benchmarks",
    subtitle: "Competitive Landscape Analysis",
    intro: "Hobson operates within an emerging category of AI-native Real Estate tools that automate insight extraction, workflows, and communication. While traditional PropTech platforms dominate property management and CRM functions, a new class of AI-driven assistants is targeting operational efficiency.",
    detail: "The comparison below evaluates key competitors across persona fit, SEO landscape, and social media presence to identify Hobson's differentiation and strategic opportunities.",
  },
  competitors: [
    {
      name: "Hobson",
      isHobson: true,
      personas: "Large portfolio operators; medium property companies; SMB owner-managers with heavy document workloads",
      seo: "Competes in emerging, low-competition keyword spaces: AI for real estate documents, lease analysis AI, document intelligence. Search volume rising; difficult terms avoidable.",
      social: "Early-stage presence; opportunity to lead in 'document intelligence' content. Best suited for expert, credible, clarity-driven tone.",
      implications: "White space category. Hobson can own the niche: AI document insight for real estate - not dominated by legacy PropTech or AI leasing tools.",
    },
    {
      name: "EliseAI",
      personas: "Residential property managers, leasing agents, customer service teams",
      seo: "High difficulty for 'AI leasing assistant,' 'property management automation.' Strong search volumes but saturated by competitors.",
      social: "Strong LinkedIn presence; frequent posting; case studies and leasing automation stories dominate.",
      implications: "Avoid the 'AI leasing' narrative - Elise owns this space. Focus on operational clarity + document accuracy instead.",
    },
    {
      name: "StanAI",
      personas: "Commercial brokers, investment teams, underwriting analysts",
      seo: "Competes for 'AI underwriting,' 'CRE data automation.' Moderate keyword difficulty; smaller but specialised search volume.",
      social: "Professional tone; moderate LinkedIn presence and engagement on commercial real estate analytics focused sharing insights and analytics content.",
      implications: "Clear differentiation: StanAI is deal analytics, Hobson is document intelligence. Maintain separation.",
    },
    {
      name: "Kendal AI",
      personas: "Property managers and tenant communication teams",
      seo: "Keywords around 'AI property management,' 'tenant enquiry automation.' Competitive landscape; high cost to rank.",
      social: "Small but active LinkedIn footprint; friendly conversational content focused on tenant communications.",
      implications: "Their focus is front-of-house. Hobson should stay in back-of-house operations + compliance intelligence.",
    },
    {
      name: "Trudi",
      personas: "SME property managers; residential leasing teams (Australia/US)",
      seo: "Regional SEO; moderate difficulty. Keywords: 'AI assistant for property management,' 'automated leasing FAQs.'",
      social: "LinkedIn, and casual, approachable content; testimonials and video-heavy posts.",
      implications: "Tone mismatch with Hobson. Hobson keeps a more professional operational style.",
    },
    {
      name: "Legacy PropTech",
      personas: "Enterprise + SMBs across residential and commercial sectors (Yardi, MRI, AppFolio, RealPage, Buildium)",
      seo: "Extremely high SEO authority; impossible to challenge for broad terms ('property management software,' 'lease management system'). These dominate all top rankings.",
      social: "Massive presence, heavily funded content, highly polished enterprise branding.",
      implications: "Do not compete on broad software terms. Position Hobson as the AI layer that complements legacy systems ('Disruption Without Displacement').",
    },
  ],
  summary: {
    differentiation: "Focus on AI document insight for real estate - a category not dominated by legacy PropTech or AI leasing tools.",
    positioning: "'Disruption Without Displacement' - Hobson complements legacy systems rather than competing directly.",
  },
});

// String array version for backward compatibility
export const getCompetitorBenchmarksPdfContent = (): string[] => [];

// Structured data for dedicated PDF renderer
export const getCustomerOnlineBehaviourStructuredData = () => ({
  header: {
    title: "Customer Online Behaviour",
    subtitle: "Digital Research, Evaluation & Channel Preferences",
    intro: "Real estate professionals display distinct online behaviours that heavily influence how they research, evaluate, and ultimately adopt AI tools. Understanding these behaviours is essential for shaping Hobson's channel strategy, messaging, and content approach.",
  },
  researchChannels: [
    {
      persona: "Leigh",
      role: "COO, Large Portfolio Operator",
      channels: [
        "LinkedIn and trusted industry publications (EG, Property Week)",
        "Peer recommendations, case studies, and thought leadership",
        "Conferences, webinars, and PropTech panels",
        "Rarely rely on generic Google searches - credibility and trust matter more than price",
      ],
    },
    {
      persona: "James",
      role: "Head of Operations, Medium-Sized Company",
      channels: [
        "Combination of Google, LinkedIn, and PropTech community groups",
        "Compare based on clarity, demonstration of value, and ease of onboarding",
      ],
    },
    {
      persona: "Priya",
      role: "Small Portfolio Owner",
      channels: [
        "Google for direct problem-solutions ('AI for lease summaries', 'reduce admin property tasks')",
        "PropTech community groups",
        "Facebook landlord groups, forums, SME WhatsApp groups",
        "Respond well to simple explainer videos, clear pricing, and frictionless demos",
      ],
    },
  ],
  trustedContent: [
    { title: "Referenced Examples", description: "Showing where Hobson pulled information from the document - citations and page numbers" },
    { title: "Case Studies & Real-World Proof", description: "Time savings, reduced admin, accuracy improvements, clear before/after comparisons" },
    { title: "Product Walkthroughs & Live Demos", description: "Accuracy and ease of use must be demonstrated, not described" },
    { title: "Peer Endorsements", description: "Testimonials from other property professionals and similar organisations" },
    { title: "Checklists & Data-Driven Insights", description: "'5 Document Tasks You Can Automate Today', 'Where AI Reduces Risk'" },
  ],
  evaluationCriteria: [
    { title: "Accuracy First", description: "They test difficult leases, scanned PDFs, or old documents. If AI gets details wrong, trust declines sharply." },
    { title: "Transparency", description: "They expect referenced answers, not guesses. 'Show our working' is essential in a risk-averse industry." },
    { title: "Ease of Use", description: "Solutions must 'just work' without onboarding. Key advantage of Hobson's lightweight approach." },
    { title: "Security", description: "Where is data stored? How long is it kept? Who can access it?" },
    { title: "Time-to-Value", description: "They expect benefit within minutes, not weeks. Heavy integration reduces adoption likelihood." },
    { title: "Workflow Impact", description: "Tools that support existing systems (our positioning) are easier to adopt than replacements." },
  ],
  distrustTriggers: [
    "Unreferenced or Partially Wrong AI Outputs - even small inaccuracies create disproportionate loss of trust",
    "Complex onboarding or technical jargon - SMBs especially feel excluded or overwhelmed",
    "Silence or irregular communication from vendors - enterprise buyers expect predictability",
    "Perceived system replacement - 'Disruption Without Displacement' positioning solves this",
    "Security uncertainty - especially when sharing leases or confidential agreements",
    "Overpromising - AI vendors often exaggerate; buyers are sceptical by default",
  ],
  channelStrategySummary: [
    { channel: "LinkedIn", insight: "Primary channel for enterprise personas. Focus on clarity, referenced examples, and operational authority." },
    { channel: "Google", insight: "Essential for SMB personas. Use long-tail keywords aligned with document intelligence." },
    { channel: "Communities", insight: "Accelerate trust. Useful for early traction and referral loops." },
    { channel: "Content", insight: "Must demonstrate accuracy, simplicity, and non-disruption. Real examples and clear outcomes." },
    { channel: "Trust", insight: "Fragile with AI. Referenced output and reliable communication are the main drivers." },
  ],
  conclusion: "This behavioural understanding directly informs our Tactics, Channel Mix, and Brand Messaging later in the strategy.",
});

// String array version for backward compatibility
export const getCustomerOnlineBehaviourPdfContent = (): string[] => [
  "Scaling emotional storytelling",
  "Building structured support and resolution processes",
  "Demonstrating the move from retrieval to proactive insight and strategic clarity",
  "",
  "With these in place, Hobson can move from promising to preferred in the emerging category of AI document intelligence and infrastructure for Real Estate.",
  "",
  "Brand Background",
  "Hobson is a calm, intelligent, and dependable AI assistant built for Real Estate professionals who work with complex, document-heavy workflows.",
  "The brand stands for clarity, trust, and simplicity, turning source-of-truth documents into fast, accurate, fully referenced answers.",
  "Its personality is rooted in the Sage archetype (wisdom, guidance, truth), with supporting traits from the Ruler (order, reliability) and Creator (innovation).",
  "This personality is carried consistently through visual and interactive elements. The purple palette signals insight and clear thinking rather than noisy disruption.",
  "The owl mascot embodies Hobson's role as a quiet, observant guide, appearing in the chat interface and other touchpoints to make the product feel approachable and wise.",
  "The Hobson Energy Unit (HUE) adds a coin-based energy layer that can later be used for engagement, rewards, or recognition.",
  "Branded experiences such as the Hobson Choice Quiz extend this identity by giving users an interactive, lightly playful way to explore Real Estate challenges while still experiencing Hobson as calm and intelligent.",
  "",
  "Brand Strengths",
  "Hobson already delivers strong functional value:",
  "Simplifies document retrieval and reduces cognitive load",
  "Saves meaningful time on routine information search",
  "Provides transparent, referenced answers that build trust",
  "Early testing shows Hobson meets its core promises of speed, simplicity, and accuracy",
  "The tone of voice is calm, clear, and jargon-free, matching the Sage archetype",
  "Visual assets and interface design are consistent, modern, and recognisable",
  "Interactive tools like the quiz reinforce Hobson as a knowledgeable yet friendly assistant",
  "",
  "Brand Weaknesses",
  "Emotionally, the brand is not yet fully expressed. Users understand what Hobson does but have fewer cues about how it changes their day at a deeper, human level.",
  "Feedback suggests Hobson is seen as reliable and helpful, but not yet as a source of ongoing strategic insight or proactive guidance.",
  "Operationally, Hobson is still building the resolution and support structures that mature brands rely on.",
  "",
  "Emotional (Heart) Appeal",
  "Hobson's emotional promise is reassurance. It reduces stress by making hard-to-find information easy to access, and gives professionals a sense of control in high-pressure, chaotic environments.",
  "It brings order without overwhelming people with new complexity.",
  "This foundation can be deepened by:",
  "Before/after stories that show real relief and time saved",
  "User narratives that highlight confidence and reduced risk",
  "Visuals that show Hobson as a calm presence in otherwise hectic workflows",
  "",
  "Cognitive (Head) Appeal",
  "The logical argument for Hobson is equally strong. Its architecture is designed for:",
  "Measurable outcomes: time saved, fewer errors, quicker decisions",
  "Transparent referencing: every answer can be traced back to its source",
  "Internally, Hobson also uses AI to improve its own workflows (testing, content refinement, support tasks)",
  "This practice what we preach approach strengthens the brand's claim of innovation without disruption",
  "",
  "Authenticity Assessment",
  "Authenticity is one of Hobson's core strengths. The brand avoids hype, is open about its limitations, and is built around clarity, not mystery.",
  "Showing sources for every answer is a direct expression of that principle.",
  "Planned enhancements include confidence scores, incomplete-data alerts, and clearer how this answer was generated views.",
  "",
  "Brand Metaphors",
  "GPS for documents - takes you straight to the answer",
  "Master key - unlocks information hidden in dense files",
  "Compass in a document jungle - navigates complexity safely",
  "Desk lamp - quietly illuminates the truth whenever needed",
  "These metaphors make Hobson understandable and memorable even for non-technical audiences.",
  "",
  "Internal Brand Function",
  "Hobson is not only a product but also a way of operating internally. The team uses AI to:",
  "Automate testing and quality checks",
  "Refine content and documentation",
  "Support parts of customer communication",
  "This alignment between what Hobson does for clients and how Hobson works internally strengthens authenticity and improves operational efficiency.",
  "",
  "Current Marketing Position",
  "Today, Hobson's market presence is selective and relationship-led. The focus is on deep MVP partnerships rather than broad public awareness.",
  "The brand is visually strong, the story is coherent, and the touchpoints (site, quiz, mascot, interface) are consistent.",
  "The main opportunity is to shift from being a quiet, validating presence into a confident, educational voice that helps shape expectations for AI-native assistants in real estate.",
];

export const getBrandIntegrityPdfContent = (): string[] => [
  "BRAND INTEGRITY",
  "",
  "Hobson's brand is built on clarity, trust, and simplicity. Every touchpoint reinforces these core values.",
  "",
  "Brand Foundation:",
  "- Sage archetype: wisdom, guidance, truth",
  "- Supporting traits: Ruler (order, reliability) and Creator (innovation)",
  "- Purple palette signals insight and clear thinking",
  "- Owl mascot embodies quiet, observant guidance",
  "",
  "Brand Strengths:",
  "- Simplifies document retrieval and reduces cognitive load",
  "- Saves meaningful time on routine information search",
  "- Provides transparent, referenced answers that build trust",
  "- Calm, clear, jargon-free tone of voice",
  "",
  "Brand Consistency:",
  "- Visual assets and interface design are consistent and modern",
  "- Interactive tools reinforce Hobson as knowledgeable yet friendly",
  "- The brand avoids hype and is open about limitations",
  "",
  "This authenticity is one of Hobson's core strengths, positioning the brand as trustworthy in a market often skeptical of AI claims.",
];

export const getBusinessObjectivesPdfContent = (): string[] => [
  "BUSINESS OBJECTIVES",
  "",
  "The next 12 months are focused on completing the MVP for early 2026, validating Hobson in real operational settings, and building the foundations needed for commercial rollout and long-term scale.",
  "",
  "TOP-LEVEL ORGANISATIONAL GOALS:",
  "- Validate Hobson's usefulness and reliability across a broader range of Real Estate operators",
  "- Establish a stable, predictable MVP that supports ongoing refinement and automation",
  "- Build scalable internal systems for support, onboarding, and data operations",
  "- Create a commercial foundation capable of driving paid adoption during 2026-2027",
  "",
  "Position Hobson as the intelligence layer in the UK that Real Estate runs on. Ready for European and global expansion from 2028.",
  "",
  "MID- TO LONG-TERM VISION (2-3+ Years):",
  "Hobson will evolve from a retrieval-focused MVP (2026) into a proactive AI assistant replacing manual document work with AI-driven reasoning, delivering instant, traceable answers.",
  "",
  "Strategic Direction:",
  "- Achieve UK leadership in AI document intelligence by end of 2026",
  "- Build a scalable paying client base in the UK by end of 2027",
  "- Expand into Europe and globally from mid-2027, targeting GBP 15.5B TAM, GBP 10.1B SAM for Europe",
  "- From 2028, expect rapidly rising adoption",
  "- Position Hobson as an export-ready clarity platform adaptable to regional regulation",
  "",
  "MARKET VALIDATION - Strong Tailwinds:",
  "- 36.1% CAGR growth in AI for Real Estate (Business Research Company)",
  "- $1.8T global AI Real Estate market by 2030 (Market Research)",
  "- 10-20% efficiency gains when teams adopt AI (Forbes)",
  "",
  "SMART OBJECTIVES (2025-2027):",
  "",
  "Product & Market Validation (2026):",
  "- Add five new non-paying pilot customers by Q1 2026",
  "- Achieve 80%+ satisfaction across pilot users by Q3 2026",
  "- Reduce average retrieval friction by 30% by Q4 2026",
  "- Demonstrate willingness to pay by Q4 2026",
  "",
  "Commercial & Revenue (2026-2027):",
  "- Convert 3-5 pilot organisations into paying accounts by Q4 2026",
  "- Reach GBP 50k-100k MRR by Q4 2027",
  "- Maintain 70%+ retention across early paid users by Q4 2027",
  "- Validate ROI across small, medium, and large operators",
  "",
  "Brand & Market Presence (2026):",
  "- Increase brand awareness by 25% by Q4 2026",
  "- Publish three case studies by Q3 2026",
  "- Introduce confidence indicators by Q4 2026",
  "",
  "Operational & Internal (2026-2027):",
  "- Establish lightweight support framework by Q4 2026",
  "- Automate 30% of internal testing and support workflows by Q1 2027",
  "- Deliver Phase 2 development by Q4 2026",
  "",
  "SALES AND ACQUISITION STRATEGY (2026-2027):",
  "",
  "Customer Acquisition:",
  "- Add up to 5 new pilot partners by Q1 2026",
  "- Build early awareness via LinkedIn, SEO, and value-led comms",
  "",
  "Conversion:",
  "- Convert 3 pilots into paying clients by Q4 2026",
  "- Finalise scalable pricing model tied to usage and size",
  "",
  "Lead Generation:",
  "- Generate 50 MQLs by Q1 2027 through content, webinars, and SEO",
  "",
  "Global Expansion (2028+):",
  "- Begin European pilot expansion Q1 2028",
  "- Localise compliance and workflows for Europe by Q3 2028",
  "- Enter US and APAC by Q4 2029",
  "- Achieve GBP 1M ARR internationally by 2030",
  "",
  "TIMELINE PROGRESSION:",
  "2026: Deliver MVP + expand pilots, validate market, convert early users",
  "2027: Public launch, commercial expansion, readiness for international scaling",
  "2028+: Enter Europe and global markets with clarity-first AI platform",
  "",
  "Prove -> Refine -> Scale -> Commercialise -> Expand Globally",
];

export const getPESTLEAnalysisPdfContent = (): string[] => [
  "PESTLE ANALYSIS",
  "",
  "Hobson operates in the Real Estate sector, which is highly regulated, document-heavy, and under pressure to digitise. The following PESTLE review shows why a tool that offers clarity, accuracy, and affordable AI alongside existing systems is increasingly necessary.",
  "",
  "Across all dimensions - political, economic, social, technological, legal, and environmental - the environment is shifting towards tools that provide:",
  "- Fast, reliable document insight",
  "- Transparent, referenced answers",
  "- Minimal onboarding and implementation friction",
  "- Affordable, measurable efficiency gains",
  "- Reduced compliance and documentation risk",
  "",
  "Hobson's design and positioning are closely aligned with these pressures, making its solution both timely and strategically relevant.",
  "",
  "POLITICAL - Rising Regulation & Data Governance:",
  "The global Real Estate environment is becoming increasingly tightly regulated, with increasing documentation requirements and scrutiny. Key drivers include:",
  "- Building Safety Act: more detailed record-keeping and audit-ready evidence",
  "- Renters Reform Bill: more documentation around tenancy standards and landlord responsibilities",
  "- EPC and sustainability rules: evidence-heavy energy and performance reporting",
  "- AML (Anti-Money Laundering): stronger KYC and documentation checks",
  "- Local authority processes: structured information for planning, licensing, and building control",
  "",
  "At the same time, data protection rules (GDPR, ICO guidance) demand secure handling, audit trails, and clear retention policies.",
  "",
  "Implication: More regulation means more documents, higher compliance risk, and a sharper need for fast, accurate retrieval and auditability.",
  "",
  "ECONOMIC - Cost Pressure, Efficiency & Market Cycles:",
  "Real Estate organisations face persistent economic challenges:",
  "- Cost constraints limit headcount growth",
  "- Market cycles increase pressure to improve asset performance",
  "- Lean teams must handle growing administrative workloads",
  "- High labour costs make manual document handling expensive",
  "- Large platform upgrades (e.g. MRI/Yardi) are often postponed, favouring lighter tools",
  "",
  "Industry research shows that AI and automation can deliver 10%+ NOI improvement through operational efficiencies and up to 20% cost savings from reduced manual work.",
  "",
  "Implication: Hobson's low-friction, non-disruptive AI fits organisations looking to cut admin and reduce risk without funding a complete system replacement.",
  "",
  "SOCIAL - AI Comfort, Trust & Work Culture:",
  "Attitudes toward AI are warming, but trust is still fragile:",
  "- Growing openness to AI for operations, reporting, and document workflows",
  "- Very low tolerance for error; small mistakes can destroy confidence",
  "- High demand for transparency and explainability, especially in risk-averse contexts",
  "- Hybrid working has increased reliance on shared drives, email, and unstructured files",
  "- Teams are wary of tools that require significant process change",
  "",
  "Implication: Hobson's strengths - referenced answers, simple interface, zero onboarding, and coexistence with current tools - map directly onto these trust and adoption requirements.",
  "",
  "TECHNOLOGICAL - Fast-Moving AI & PropTech:",
  "The technology landscape is evolving quickly:",
  "- Advances in LLMs, embeddings, RAG, and knowledge graphs make document understanding far more powerful",
  "- Buyers increasingly expect verifiable, not black-box, AI",
  "- Legacy PropTech moves slowly, creating a gap for AI-native assistants",
  "- Cybersecurity expectations grow as more sensitive contracts and documents are digitised",
  "- Demand rises for no integration tools that can be deployed quickly",
  "",
  "Hobson's architecture, combining vector databases, knowledge graphs, and quality checks, is designed to deliver reliable, explainable document intelligence.",
  "",
  "Implication: Technological trends favour tools like Hobson that provide modern AI capability without heavy integration overhead.",
  "",
  "LEGAL - Compliance, Data & Documentation Risk:",
  "Legal frameworks reinforce the need for structured, accurate document handling:",
  "- GDPR demands explicit data handling, transparency, and security",
  "- Audits require clear evidence of where information came from and how it was used",
  "- Contractual risk rises when key details are missed or buried in unstructured content",
  "- Emerging AI governance emphasises safety, explainability, and reduced hallucination",
  "",
  "Hobson's referenced outputs, combined with privacy and breach policies, help buyers meet these expectations and reduce legal exposure.",
  "",
  "Implication: Legal pressure favours AI tools that are traceable, auditable, and designed around accuracy.",
  "",
  "ENVIRONMENTAL - ESG Reporting & Paper Reduction:",
  "Environmental factors are secondary drivers, but still important:",
  "- ESG reporting adds another layer of documentation and evidence",
  "- Pressure to reduce physical paperwork encourages digital document workflows",
  "- Energy-performance obligations (e.g. EPCs) require structured, retrievable data for reporting",
  "",
  "Implication: By making it easier to extract and reuse information from documents, Hobson supports more efficient ESG reporting and digital sustainability.",
];

export const getInternalCapabilityAssessmentPdfContent = (): string[] => [
  "INTERNAL CAPABILITY ASSESSMENT",
  "",
  "Hobson combines deep domain knowledge, strong technical design, and a differentiated brand aligned with an honest and urgent market need. Hobson is a young company with deep experience in Real Estate operations, software, and AI. Its mission, Innovation Without Disruption, is reflected in how the product is built, how it behaves, and how the team works with early clients.",
  "",
  "Hobson is well-placed to deliver innovation without disruption in a sector that urgently needs clarity and efficiency in document management.",
  "",
  "STRENGTHS:",
  "",
  "1. Team Skills Across Real Estate, Software, and AI:",
  "Real Estate Expertise: The founding team has over 30 years of experience in asset management, operations, and portfolio governance.",
  "- Client workflows",
  "- Compliance and reporting pressures",
  "- Document types and structures",
  "- The practical pain points Hobson is solving",
  "",
  "Software & Product Experience: The team has previously built, scaled, and exited a leading UK Real Estate software platform.",
  "- Product design and UX",
  "- MVP development and iteration",
  "- Go-to-market strategy",
  "",
  "AI & Technical Skills: Hobson's technical team includes specialists in:",
  "- Large Language Models (LLMs)",
  "- RAG (retrieval-augmented generation)",
  "- Knowledge graphs",
  "- Vector databases",
  "- Prompt design and quality control",
  "",
  "2. Technical Capabilities:",
  "Document-First Architecture: Hobson is designed to work directly from client documents, using:",
  "- Structured data extraction",
  "- A hybrid RAG + knowledge-graph pipeline",
  "- Quality-checking layers",
  "- Transparent, reference-based outputs",
  "",
  "Lightweight Deployment: The platform is:",
  "- Zero-integration by default",
  "- Quick to start using",
  "- Designed to avoid workflow disruption",
  "",
  "3. Brand Maturity and Positioning Strength:",
  "Despite being early-stage, Hobson's brand is already clear and distinctive:",
  "- The owl signals wisdom, clarity, and trusted guidance",
  "- Messaging focuses on clarity, simplicity, affordability, and non-disruption",
  "- Early client conversations confirm strong resonance with this narrative",
  "- Hobson is deliberately positioned as the calm AI assistant",
  "",
  "4. Access to Customers:",
  "Hobson benefits from:",
  "- Direct relationships with large portfolio operators",
  "- The founding team's established reputation",
  "- Warm introductions through industry networks",
  "- Early adopters willing to co-shape the MVP",
  "",
  "5. Clear Differentiators:",
  "- Document-Native AI: Focused on extracting clarity from documents themselves",
  "- Referenced Answers: Every answer is tied back to its source",
  "- No Replacement Positioning: Works alongside existing systems",
  "- Accessibility and Affordability: Makes advanced AI available to SMB landlords and mid-sized operators",
  "- Speed & Simplicity: Tackles document overload without training or heavy rollout",
  "",
  "LIMITATIONS & GAPS:",
  "",
  "Brand Visibility and Reach:",
  "- Limited social media presence on LinkedIn, events, and forums",
  "- Low awareness in a noisy PropTech and AI space",
  "- Need: Thought leadership, case studies, and systematic visibility",
  "",
  "Technical Scaling:",
  "- Hybrid RAG + knowledge-graph pipeline is powerful but still maturing",
  "- Performance must be robust across diverse document sets",
  "- Need: Ongoing fine-tuning and expanded testing",
  "",
  "Product Breadth:",
  "- Current focus is on retrieval and extraction",
  "- Competitors also offer analytics, automation, or communication tools",
  "- Need: Gradual expansion into proactive insight and workflow support",
  "",
  "Customer Support Infrastructure:",
  "- Documentation and onboarding flows are still light",
  "- Processes for resolution and customer success are emerging",
  "- Need: Structured customer success and support frameworks",
  "",
  "Resource Constraints:",
  "- As a startup, Hobson must prioritise where to invest time and capital",
  "- Scaling marketing, support, and development will require funding",
  "- Need: Investment to support systematic growth",
];

// Structured data for dedicated PDF renderer
export const getSWOTAnalysisStructuredData = () => ({
  header: {
    title: "SWOT Analysis",
    subtitle: "Strategic assessment of Hobson's market position",
  },
  intro: "Hobson enters the market with substantial structural advantages: a focused product, a clear brand, and a solution that matches real, urgent needs. The key to moving from promising to category-defining will be making trust explicit and measurable, turning early successes into stories and proof, and building scalable processes beneath the brand and product.",
  quadrants: [
    { 
      title: "Strengths", 
      colorType: "emerald",
      items: ["AI-native architecture for RE docs", "Reference-backed answers", "Zero-onboarding experience", "30+ years domain expertise", "Clear brand positioning"]
    },
    { 
      title: "Weaknesses", 
      colorType: "rose",
      items: ["Limited brand visibility", "MVP still maturing", "Small team constraints", "Support infrastructure emerging", "Resolution processes light"]
    },
    { 
      title: "Opportunities", 
      colorType: "blue",
      items: ["Growing regulatory burden", "Underserved SMB segment", "Legacy PropTech slow on AI", "Cost pressures favour automation", "International expansion potential"]
    },
    { 
      title: "Threats", 
      colorType: "amber",
      items: ["Fast-moving AI competitors", "Legacy platforms adding AI", "AI hallucination trust risks", "Economic pressure on tech spend", "Competitor emotional storytelling"]
    }
  ],
  pillars: [
    { pillar: "Personalization", rating: 4, explanation: "We work closely with each client, adapting Hobson to their workflows. Manual discovery process." },
    { pillar: "Resolution", rating: 2, explanation: "Early-stage gaps in formal recovery processes. Our biggest area for improvement." },
    { pillar: "Integrity", rating: 4, explanation: "Transparent communication about capabilities. Honest pricing model." },
    { pillar: "Time & Effort", rating: 5, explanation: "Built to reduce friction with intuitive, efficient interactions." },
    { pillar: "Expectations", rating: 4, explanation: "Focused on MVP delivery. Need to shift from 'expected' to 'exceeding'." },
    { pillar: "Empathy", rating: 4, explanation: "Shaped by real client pain. Discovery and feedback show we listen." }
  ],
  recommendations: [
    { title: "Strengthen Trust", items: ["Confidence scores", "Clear resolution process", "Early case studies"] },
    { title: "Expand Storytelling", items: ["Human testimonials", "Consistent metaphors", "Clarity partner positioning"] },
    { title: "Accelerate Visibility", items: ["LinkedIn engagement", "Quiz as entry point", "Thought leadership"] },
    { title: "Product Differentiation", items: ["Retrieval to insight path", "Hobson Blueprints", "Personalisation at scale"] },
    { title: "Protect Advantage", items: ["Lightweight positioning", "MVP client advocates", "Scalable processes"] }
  ],
});

export const getSWOTAnalysisPdfContent = (): string[] => [
  "SWOT ANALYSIS",
  "",
  "Hobson enters the market with substantial structural advantages: a focused product, a clear brand, and a solution that matches real, urgent needs. The key to moving from promising to category-defining will be making trust explicit and measurable, turning early successes into stories and proof, and building scalable processes beneath the brand and product.",
  "",
  "Hobson will become the intelligence layer real estate runs on, ensuring every operational decision is based on instant, auditable insight rather than manual search, institutional memory, or guesswork.",
  "",
  "STRENGTHS:",
  "",
  "Product & Technical:",
  "- AI-native architecture built specifically for real estate documents",
  "- Fast, reference-backed answers that increase trust and reduce risk",
  "- Lightweight, low-friction user experience requiring little to no onboarding",
  "- Strong Time & Effort performance",
  "- Architecture designed to evolve from retrieval to insight to proactive assistance",
  "",
  "Brand & Positioning:",
  "- Clear brand centred on clarity, trust, and simplicity",
  "- Sage archetype, reinforced by the owl, positions Hobson as a calm, dependable advisor",
  "- Consistent visual identity, metaphors, and tone (GPS for documents, desk lamp illuminating truth)",
  "- HUE coin adds potential for engagement, onboarding incentives, and loyalty mechanics",
  "- Transparent, non-hyped messaging enhances perceived integrity",
  "",
  "Customer Alignment:",
  "- Product shaped directly by real customer pain (document overload, fragmented systems, admin bottlenecks)",
  "- High empathy and personalisation in MVP development (Six Pillars: 4/5)",
  "- Early partners value reliability, clarity, and guidance - matching Hobson's intended personality",
  "",
  "Market Fit & Timing:",
  "- Strong fit with growing demand for AI-driven document analysis, automation, and accuracy",
  "- Real estate AI market showing sustained high growth rates",
  "- Regulatory tightening and compliance pressure increase demand for source-backed retrieval",
  "",
  "PILLARS EVALUATION MATRIX:",
  "- Personalization: 4/5 - We work closely with each client, adapting Hobson to their specific workflows",
  "- Resolution: 2/5 - We lack formal processes to recover from breakdowns. Resolution is our biggest gap",
  "- Integrity: 4/5 - Transparency is at the core of how we communicate",
  "- Time & Effort: 5/5 - Hobson is built to reduce friction and effort",
  "- Expectations: 4/5 - We're focused on the MVP and what it can do today as defined",
  "- Empathy: 4/5 - We've shaped the MVP around real client pain",
  "",
  "WEAKNESSES:",
  "",
  "Product:",
  "- MVP focused on retrieval; deeper analytics and insight are still in development",
  "- Output quality depends on document quality and coverage",
  "- Resolution processes are not yet formalised",
  "- Onboarding automation is limited; much support is currently manual",
  "",
  "Brand & Communication:",
  "- Emotional storytelling is still light; the functional story is stronger than the human story",
  "- Users often see Hobson as helpful instead of strategic or insightful",
  "- Few public ambassadors, testimonials, or spokespersons",
  "- Low visibility because of the focus on quiet MVP partnerships",
  "",
  "Commercial:",
  "- Limited long-term performance data or proven case studies",
  "- Small team means constrained bandwidth across product, marketing, and support",
  "- Heavy reliance on a small number of partner clients for early feedback",
  "",
  "OPPORTUNITIES:",
  "",
  "Market & Industry:",
  "- Real estate is moving towards automation, compliance, and faster decision-making",
  "- Document overload is increasing, making document-native AI more valuable",
  "- Regulatory changes (e.g. renters reforms, building safety, ESG) drive demand",
  "- Early AI adoption rates (10-20%) make a 12% penetration target realistic",
  "",
  "Brand Expansion:",
  "- Develop richer emotional narratives and transformation stories",
  "- Build a network of ambassadors and early champions from respected firms",
  "- Extend metaphors and messaging to emphasise deeper intelligence and foresight",
  "",
  "Product & Capability:",
  "- Add confidence scores, data completeness indicators, and show our working views",
  "- Build proactive features: renewal alerts, anomaly detection, risk flags, portfolio summaries",
  "- Package templates and industry-specific workflows",
  "",
  "Marketing & Growth:",
  "- Use the Hobson Choice Quiz and HUE as gamified acquisition and engagement tools",
  "- Increase presence on LinkedIn, podcasts, events, and professional forums",
  "- Create referral mechanisms and guided onboarding programmes",
  "",
  "THREATS:",
  "",
  "Competitive:",
  "- Fast-moving AI competitors (EliseAI, Trudi, StanAI, Kendal AI)",
  "- Legacy systems (Yardi, MRI, Reapit, AppFolio) may add AI layers to close the gap",
  "- Low switching costs make client loyalty fragile",
  "",
  "Market & Technology:",
  "- Sector-wide scepticism if AI tools elsewhere fail visibly or hallucinate",
  "- New AI and data privacy regulations may increase compliance burden",
  "- Economic pressure might delay software purchases",
  "- AI fatigue if clients feel overloaded with tools and promises",
  "",
  "Brand & Trust:",
  "- A major error in a sensitive document could damage trust early",
  "- Inconsistent support or slow resolution could undermine confidence",
  "- Competitors with stronger emotional storytelling could capture mindshare",
  "",
  "RECOMMENDATIONS:",
  "",
  "1. Strengthen Trust & Authenticity:",
  "- Implement confidence scores and data completeness warnings",
  "- Create a clear support and resolution process with visible follow-up",
  "- Publish early case studies and small micro-proofs from MVP clients",
  "",
  "2. Expand Brand Storytelling:",
  "- Add human testimonials, behind-the-scenes content, and day in the life with Hobson stories",
  "- Reuse metaphors (GPS, lamp, compass) consistently",
  "- Position Hobson as a long-term clarity partner, not just a tool",
  "",
  "3. Accelerate Market Visibility:",
  "- Increase rhythm and quality of LinkedIn and community engagement",
  "- Use the quiz and HUE as recognisable, branded entry points",
  "- Develop thought-leadership content aligned with the Sage voice",
  "",
  "4. Enhance Product Differentiation:",
  "- Move deliberately along the path from retrieval to insight to foresight",
  "- Create low-touch workflows that allow personalisation at scale",
  "- Develop Hobson Blueprints for everyday tasks: lease reviews, renewals, compliance checks",
  "",
  "5. Protect Early Advantage:",
  "- Maintain the lightweight, low-cost, no disruption stance against heavier legacy platforms",
  "- Turn MVP clients into long-term advocates through close support and co-creation",
  "- Standardise internal processes so the organisation can scale without losing quality",
];

export const getMarketingObjectivesPdfContent = (): string[] => [
  "MARKETING OBJECTIVES",
  "",
  "Aligned with the 2026-2028 timeline, Hobson's marketing objectives define the outcomes needed to progress from MVP validation to a scalable commercial presence. They focus on measurable growth across awareness, consideration, conversion, retention, and advocacy, fully synchronised with the product and business timelines.",
  "",
  "TOP-LEVEL MARKETING GOALS:",
  "- Increase visibility across the UK real estate sector as the MVP moves into pilot expansion during 2026",
  "- Build credibility through evidence, pilot success stories, and trustworthy product education",
  "- Establish a predictable acquisition and activation funnel in preparation for the 2027 public launch",
  "- Support long-term adoption with consistent engagement and communication across all customer segments",
  "",
  "MID- TO LONG-TERM DIRECTION:",
  "",
  "By Q4 2026:",
  "Marketing should show strong early awareness, predictable interest in pilots, and growing engagement with educational content.",
  "",
  "By Q4 2027:",
  "Hobson should operate a scalable acquisition engine with mature digital channels, predictable lead flow, and clear conversion pathways following the public launch.",
  "",
  "By 2028:",
  "Marketing expands into two international regions and supports globalised demand, localisation, and partnerships.",
  "",
  "SMART MARKETING OBJECTIVES (By Journey Stage, Fully Timeline-Aligned):",
  "",
  "AWARENESS OBJECTIVES (Build through 2026 to scale in 2027 and expand in 2028):",
  "- Increase visibility among UK real estate professionals ahead of and during pilot expansion (2026)",
  "- Drive consistent top-of-funnel traffic using clarity-based educational content",
  "- Strengthen brand recall using distinctive digital assets (owl, HUE, metaphors, clarity style)",
  "",
  "Key Metrics: Website sessions, quiz completions, LinkedIn impressions & engagement, brand recall survey signals and awareness coefficient",
  "",
  "Target Values:",
  "- 500 monthly website visits by Q1 2027 (post-launch traffic ramp)",
  "- 1,000+ quiz completions by Q2 2027 to support scalable acquisition",
  "- 200k+ LinkedIn impressions per quarter by Q4 2027",
  "",
  "CONSIDERATION OBJECTIVES (2026-2027):",
  "- Turn awareness into informed interest through more precise product explanations",
  "- Support evaluation with demos, walkthroughs, retargeting, and repeated exposure",
  "- Build confidence in Hobson's reliability, accuracy, and referencing approach",
  "",
  "Key Metrics: Demo requests, time on product pages, lead magnet downloads, retargeting CTR and consideration coefficient",
  "",
  "Target Values:",
  "- 50 demo requests by Q1 2027 (post-site launch)",
  "- Monthly release of one educational asset throughout 2026-2027",
  "- >3% retargeting CTR by Q4 2027",
  "- Measurable consideration improvement within 24 months",
  "",
  "CONVERSION OBJECTIVES (Pilot conversion throughout 2026, extending to paid expansion in 2027):",
  "- Convert interested organisations into active pilots during 2026",
  "- Reduce activation friction (first upload -> first question)",
  "- Demonstrate commercial value through pilot outcomes ahead of 2027 launch",
  "",
  "Key Metrics: New pilot sign-ups, activation rate (upload + first question), pilot-to-paid conversion, early ARR and sales coefficient",
  "",
  "Target Values:",
  "- Up to 5 new pilots by Q2 2026 (after MVP release)",
  "- 60%+ activation within 14 days for free package and pilot users",
  "- 3-5 paid conversions by Q4 2026 to prove commercial demand",
  "- GBP 50k-100k MRR by Q4 2027 following the public launch",
  "- >=20% conversion rate post-launch",
  "",
  "RETENTION & ADVOCACY OBJECTIVES (Foundational in 2026, strengthen in 2027, scale in 2028):",
  "- Build strong user loyalty throughout the 2026 pilot phase",
  "- Encourage advocacy from high-satisfaction teams",
  "- Maintain clear and consistent communication across accounts as usage scales",
  "",
  "Key Metrics: Satisfaction score (CSAT), Net Promoter Score (NPS), retention rate, weekly active usage, testimonials, case studies and liking coefficient",
  "",
  "Target Values:",
  "- 80%+ satisfaction by Q4 2026",
  "- NPS > 50 by Q4 2026",
  "- 80%+ retention by Q4 2027 across paid users",
  "- 60% weekly active usage among pilot teams in 2026",
  "- 9+ case studies by Q4 2027",
  "",
  "HOW THIS OBJECTIVE FRAMEWORK SUPPORTS THE STRATEGY:",
  "- Builds early visibility before the 2027 launch",
  "- Guides prospects into precise, structured evaluation",
  "- Supports conversion and commercial validation throughout 2026",
  "- Strengthens long-term retention and advocacy as Hobson scales",
  "- Creates a predictable funnel ready for UK expansion in 2027 and international expansion from 2028",
  "",
  "CHANNEL AND METRIC JUSTIFICATION:",
  "",
  "Hobson's channel strategy has been selected to support both immediate MVP needs and long-term commercial ambitions. Each channel contributes to Hobson's broad goals of building trust, increasing visibility, validating demand, and creating a scalable acquisition engine.",
  "",
  "Top-Level Broad Goals Supported by Channel Strategy:",
  "- Build early awareness and credibility among UK real estate professionals",
  "- Move prospects through key attitude stages: Awareness -> Consideration -> Liking -> Conversion",
  "- Generate a predictable pipeline for pilot onboarding and later commercial conversion",
  "- Strengthen brand trust through repeated exposure, thought leadership, and proof-based storytelling",
  "- Ensure users experience Hobson's value quickly so they become long-term advocates",
  "",
  "Mid- to Long-Term Vision Supported by Channel Strategy:",
  "",
  "2026 MVP Validation & Pilot Growth:",
  "Channels focus on education, clarity, and trust-building. Content-led channels (LinkedIn, website, knowledge hub, email) support pilot acquisition and early engagement.",
  "",
  "2026-2027 Commercial Readiness:",
  "Channels shift toward a predictable digital acquisition funnel. SEO, targeted LinkedIn activity, retargeting flows, email nurture, and structured content work together to build demand.",
  "",
  "2027 and Beyond - Scale:",
  "Channels evolve to support broader market reach and international expansion using YouTube, partnerships, regionalised content, and paid acquisition.",
  "",
  "HOW CHANNELS & METRICS SUPPORT KEY DIGITAL STRATEGY AREAS:",
  "",
  "Acquisition | LinkedIn, Website | Impressions, Sessions | Builds visibility; ensures Hobson is known before launch",
  "Lead Generation | Website, Quiz, Retargeting | Demo requests, Quiz sign-ups | Creates a pipeline for pilot onboarding",
  "Engagement | Quiz, LinkedIn content | Engagement rate, Dwell time | Strengthens Liking and brand connection",
  "Conversion | Retargeting, Email | CTR, Demo completions, Activation rate | Turns interest into pilots and future paying customers",
  "Development | Email onboarding, Support | CSAT, activation metrics | Improves early experience and builds trust",
  "Growth | Advocacy, Testimonials | NPS, case studies | Builds long-term brand equity and lowers acquisition cost",
  "",
  "CHANNEL & METRIC ALIGNMENT:",
  "",
  "Hobson's channel and metric choices are tightly aligned to:",
  "- Organisational goals",
  "- Long-term vision",
  "- Mindset-first marketing approach",
  "- Commercial objectives for 2026-2027",
  "",
  "Each channel has been selected because it directly contributes to measurable progress across acquisition, consideration, conversion, retention, and advocacy - ensuring Hobson builds both short-term traction and long-term competitive advantage.",
];

export const getBrandStrategyPdfContent = (): string[] => [
  "BRAND STRATEGY",
  "",
  "Hobson's branding strategy focuses on presenting the product as a dependable, easy-to-use source of document clarity for real estate teams. The aim is to build early trust, maintain a consistent identity as the product matures, and support long-term commercial adoption through a transparent and stable brand framework.",
  "",
  "BRAND ESSENCE:",
  "",
  "Hobson's brand centres on one idea: making information easier to work with. All brand decisions - visual, verbal, and experiential - reinforce this idea by emphasising ease, reliability, and straightforward communication.",
  "",
  "VISUAL DIRECTION:",
  "",
  "The visual identity is designed to make the product immediately understandable and easy to use.",
  "",
  "Colour System:",
  "A simple palette is used to ensure clarity, reduce visual noise, and create consistent recognition across channels.",
  "",
  "Illustrated Elements (Owl Iconography):",
  "Illustration supports a friendly and recognisable identity without adding complexity. These elements appear lightly across product and marketing surfaces to provide continuity.",
  "",
  "HUE Coin System:",
  "Create a distinct brand asset that can scale into loyalty or rewards in future.",
  "",
  "Interface Approach:",
  "The product UI favours simplicity: minimal actions, clear outputs, and unobtrusive signposting. This reinforces Hobson's commitment to removing friction from document work.",
  "",
  "VERBAL DIRECTION:",
  "",
  "Hobson's voice emphasises clarity, straightforwardness, and helpfulness:",
  "- Be concise",
  "- Explain technical concepts plainly",
  "- Avoid exaggeration",
  "- Focus on what the user gains in practical terms",
  "",
  "The brand's messaging framework is organised around showing value through clarity, trust, ease, and usefulness. These themes inform all external communication, from the website to demos.",
  "",
  "EXPERIENCE AND INTERACTION APPROACH:",
  "",
  "Brand experience extends beyond visuals and language into how users interact with the product and marketing.",
  "",
  "Lightweight Engagement Tools:",
  "The quiz and similar assets create a soft entry point into the brand, helping users understand Hobson's value without heavy explanation.",
  "",
  "Progression From First Use to Trust:",
  "The experience aims to give users quick wins, followed by dependable performance, building confidence over repeated use.",
  "",
  "Trust Signals:",
  "Clear referencing, transparent behaviour, and consistent communication form part of the brand experience, helping reduce hesitation around AI tools.",
  "",
  "INTERNAL BRAND ALIGNMENT:",
  "",
  "Internally, the brand acts as a guide for decision-making. It encourages:",
  "- Simple solutions over complex ones",
  "- Transparency in communication",
  "- Prioritising user effort reduction",
  "",
  "This internal consistency ensures the brand remains coherent as the organisation grows.",
  "",
  "LONG-TERM BRANDING DIRECTION (2028-2030):",
  "",
  "As Hobson enters more markets and the product evolves beyond retrieval, the brand will shift from being seen as a helpful assistant to a broader intelligence layer for real estate operations.",
  "",
  "- Developing a stronger narrative through real user stories",
  "- Expanding the HUE concept into a wider engagement system",
  "- Building a more visible presence across industry communities",
  "- Maturing support and documentation to match enterprise expectations",
  "",
  "The goal is for Hobson to become a recognised standard for document intelligence.",
  "",
  "SMART BRANDING OBJECTIVES (2026-2028 Timeline):",
  "",
  "1. Strengthen Brand Foundations During the Pilot Phase (By Q4 2026):",
  "- Achieve consistent use of all core brand assets across every channel by Q4 2026",
  "- Publish at least three UK-based pilot case studies and two thought-leadership pieces by Q4 2026",
  "- Record measurable improvements in positive brand associations through structured user feedback by mid-2026",
  "",
  "2. Scale Brand Awareness for the Commercial Launch (By Q4 2027):",
  "- Improve brand awareness among UK property professionals by 60% by Q4 2027",
  "- Strengthen recognition of Hobson's brand archetype (Sage: calm, intelligent, trustworthy)",
  "",
  "3. International Brand Readiness (2028+):",
  "- Prepare brand assets and messaging frameworks for localisation in first two international markets (EU/US)",
  "",
  "These objectives ensure Hobson's brand develops in three straightforward steps: Foundation in 2026, Awareness and authority in 2027, and international consistency from 2028 onward.",
  "",
  "ONLINE PRESENCE:",
  "",
  "Hobson's online presence is intentionally limited at this stage. The focus is on credibility, controlled exposure, and preparing the foundations for a scalable digital footprint.",
  "",
  "A. Website (hobsonschoice.ai):",
  "The website operates as the central source of information about Hobson:",
  "- Introducing Hobson's purpose",
  "- Directing users to early materials such as the quiz",
  "- Supporting SEO indexing for future content",
  "- Serving as a reference point for partners and investors",
  "",
  "B. Product Presence (MVP Access Only):",
  "Hobson is currently available only to selected pilot users. A minimalist interface, steady iteration, and limited external visibility.",
  "",
  "C. Social Presence (LinkedIn):",
  "LinkedIn is Hobson's primary public channel for sharing updates, simple insights, and early brand signalling.",
  "",
  "D. Search Presence (SEO and AI Discovery):",
  "The current site is optimised for indexing, clear metadata, and structured copy for search engines and AI crawlers.",
  "",
  "E. Deliberate Non-Presence in Other Channels:",
  "No newsletters, communities, paid campaigns, or additional social channels at this stage - intentional to avoid premature scaling.",
  "",
  "F. Consistency Across Touchpoints:",
  "All existing digital touchpoints show a unified look and feel, ensuring early recognition.",
  "",
  "SMART OBJECTIVES FOR ONLINE PRESENCE (2026-2028 Timeline):",
  "",
  "1. Build a Strong and Credible Online Foundation (By Q4 2026):",
  "- Increase website traffic by 40% through expanded educational content, LinkedIn distribution, and targeted SEO",
  "- Achieve an average dwell time of 2+ minutes",
  "- Publish 10 high-quality educational pieces (guides, explainers, demos)",
  "",
  "2. Expand Digital Reach for the Commercial Launch (Q1-Q2 2027):",
  "- Launch at least two new online channels by Q1 2027",
  "- Grow Hobson's LinkedIn audience to 1,000 followers by Q1 2027",
  "- Prepare full public-facing online presence by Q2 2027 (feature pages, pricing pages, sign-up flows, onboarding content)",
  "",
  "3. Online Presence Expansion for Global Scale (2028+):",
  "- Localise web content, educational assets, and messaging for first two international markets",
  "",
  "TIMELINE SUMMARY:",
  "2026 builds the foundation >> 2027 scales visibility + conversion >> 2028 prepares global readiness.",
];

export const getContentEngagementStrategyPdfContent = (): string[] => [
  "CONTENT AND ENGAGEMENT STRATEGY",
  "",
  "Hobson's content and engagement strategy is built to clearly introduce the product, reduce uncertainty around AI in real estate, and support a smooth progression from initial interest to long-term use. Because the product is still in an MVP phase, the strategy prioritises clarity and credibility over volume.",
  "",
  "PURPOSE OF CONTENT:",
  "",
  "Content exists to support three practical goals:",
  "1. Help the market understand what Hobson does and why it matters",
  "2. Build confidence by showing how the product works and handles information",
  "3. Support users and prospects through each stage with simple, useful materials",
  "",
  "The emphasis is on being informative and practical, without overstating capability.",
  "",
  "CORE CONTENT THEMES:",
  "",
  "All content focuses on four themes:",
  "- Clarity: explaining how Hobson simplifies document work",
  "- Trust: showing how answers are produced and referenced",
  "- Ease: emphasising simple workflows and minimal effort",
  "- Practical guidance: offering examples that reflect day-to-day tasks",
  "",
  "CONTENT BY JOURNEY STAGE (See-Think-Do-Care):",
  "",
  "1. See (Awareness):",
  "Goal: Show the problem and introduce Hobson",
  "- Short visual examples of document pain points",
  "- Simple explanations of what Hobson does",
  "- Interactive entry points such as the quiz",
  "Success indicator: increased visibility and early curiosity",
  "",
  "2. Think (Consideration):",
  "Goal: Explain how Hobson works and what makes it different",
  "- Walkthroughs of question-and-answer outputs",
  "- Comparisons with manual workflows",
  "- Examples of referenced answers",
  "Success indicator: longer engagement with product-related content",
  "",
  "3. Do (Conversion):",
  "Goal: Encourage pilot participation through clear, low-friction pathways",
  "- Case summaries from early partners",
  "- Clear pages showing how to start using the product",
  "- Invitations to limited pilot opportunities",
  "Success indicator: enquiries and pilot sign-ups",
  "",
  "4. Care (Retention and Advocacy):",
  "Goal: Support ongoing use and create positive feedback loops",
  "- Simple onboarding materials",
  "- Short guidance tips",
  "- Updates on improvements or new features",
  "Success indicator: continued usage and positive feedback from pilot users",
  "",
  "ENGAGEMENT METHODS:",
  "",
  "The Quiz: Accessible way to introduce the problem space, gather insights, and create early emotional connection",
  "Simple Stories and Examples: Day-to-day scenarios illustrate value more effectively than abstract claims",
  "Direct Feedback Loops: 1:1 conversations, polls, and structured partner feedback provide more value than large-scale efforts at this stage",
  "Emerging Insight Content: As the product matures, content will highlight examples of guidance, pattern spotting, or saved effort",
  "",
  "CHANNEL USE:",
  "",
  "Website: Education and conversion (demos, explanations, case summaries)",
  "LinkedIn: Awareness and credibility (updates, commentary, product examples)",
  "Quiz: Engagement and lead capture (interactive entry point)",
  "Email (later stage): Nurture and retention (onboarding steps, feature highlights)",
  "Product UI: Ongoing engagement (prompts, tips, clear output formatting)",
  "",
  "This division keeps each channel focused and avoids over-communication during the MVP stage.",
  "",
  "SMART TARGETS (2026-2027):",
  "",
  "Content and Education (2026 Foundation):",
  "- Publish 10 clear, educational pieces by Q4 2026",
  "- Deliver three short onboarding guides for common user roles by Q4 2026",
  "",
  "Engagement and Awareness (2026 Performance):",
  "- Increase LinkedIn engagement by 15% by Q4 2026",
  "- Introduce simple feature-based email prompts by Q4 2026",
  "",
  "Scaled Reach for Launch (Early 2027):",
  "- Achieve 500+ quiz completions by Q2 2027",
  "",
  "DIGITAL CHANNEL ACQUISITION STRATEGY:",
  "",
  "Strategic Acquisition Goals:",
  "- Make Hobson visible to real estate professionals with document-heavy workflows",
  "- Bring qualified traffic to the website and quiz",
  "- Build interest in the 2026 pilot programme",
  "- Test channels and messaging for 2027 scale",
  "",
  "Acquisition Messaging Focus:",
  "- Clear outcomes: fast answers from existing documents",
  "- Reliable behaviour: transparent outputs and referenced information",
  "- Time savings: reduced administrative load",
  "- Ease of adoption: minimal change to existing workflows",
  "",
  "Channel Strategy:",
  "LinkedIn (Primary): 1,000 followers by Q4 2027",
  "Website and Search: 40% organic traffic increase by Q2 2027",
  "Paid Search (Later): 3-5% CTR by Q4 2027",
  "Retargeting (Later): 10% of retargeted visitors to enquiries by Q4 2027",
  "",
  "SMART ACQUISITION TARGETS:",
  "- 500+ quiz completions by Q2 2027",
  "- 40% website traffic increase by Q4 2027",
  "- 1,000 LinkedIn followers by Q4 2027",
  "- 5+ additional pilot participants by Q4 2026",
  "- 10% retargeted visitors converting by Q4 2027",
  "- International acquisition readiness by Q1 2028",
  "",
  "DIGITAL CHANNEL CONVERSION STRATEGY:",
  "",
  "The conversion strategy focuses on turning qualified interest into practical use:",
  "- Give prospective users a straightforward path from curiosity to hands-on experience",
  "- Reduce perceived risk through a free entry point",
  "- Demonstrate value early through real interactions with uploaded documents",
  "- Improve conversion performance through continual measurement",
  "- Build a funnel that can support future paid tiers",
  "",
  "This strategy builds a patient, steady funnel that supports Hobson's stage of development.",
];

export const getPrimaryConversionChannelsPdfContent = (): string[] => [
  "PRIMARY CONVERSION CHANNELS",
  "",
  "The goal of the conversion strategy is to make it as easy as possible for prospects to try Hobson, see value quickly, and progress toward deeper engagement.",
  "",
  "1. WEBSITE",
  "",
  "The website acts as the main route into trials and enquiries. Conversion paths include:",
  "- Starting the free package",
  "- Requesting a demo",
  "- Submitting pilot enquiries",
  "- Moving from the quiz into a guided trial",
  "",
  "Pages will be optimised around clear calls to action, simple explanations, and trust signals.",
  "",
  "2. LINKEDIN",
  "",
  "LinkedIn brings warm, relevant traffic to the website. Its role in conversion is to:",
  "- Explain what the free experience involves",
  "- Show quick, concrete examples of value",
  "- Direct users to try the product without commitment",
  "",
  "3. RETARGETING (Later Phase)",
  "",
  "Retargeting will support users who need several exposures before acting. These campaigns will highlight:",
  "- What users can do immediately in the free package",
  "- Small examples of outcomes",
  "- Invitations to try the workflow for themselves",
  "",
  "4. EMAIL (For Users Already Engaged)",
  "",
  "Email will help users understand the product once they have expressed interest. It supports conversion by:",
  "- Guiding them through first steps",
  "- Giving prompts based on typical tasks",
  "- Reducing hesitation around accuracy or data handling",
  "",
  "KEY CONVERSION TACTICS:",
  "",
  "1. Free Package as Entry Point:",
  "A no-cost option removes the most significant practical and psychological barriers. It shifts the decision from 'should we commit?' to 'should we try this now?'",
  "",
  "2. Optimising Calls to Action:",
  "Conversion performance will be improved by testing wording, placement (especially above the fold), number of CTAs per page, and clarity of next steps.",
  "",
  "3. Improving Search-Driven Conversion:",
  "As search visibility grows, ensure visitors find clear, relevant information and a direct route to trial through refining headings, matching search intent, and creating task-aligned content.",
  "",
  "4. Behaviour-Driven Improvements:",
  "Heatmaps, scroll depth, and path analysis will identify where users hesitate or leave. Findings inform CTA placement, copy revisions, example positioning, and layout simplification.",
  "",
  "5. Content Supporting Conversion:",
  "Short demos, simple examples, and case summaries help prospects understand what Hobson does in practice, showing how the product behaves and what users can achieve.",
  "",
  "KEY METRICS:",
  "- Homepage click-through rate",
  "- Free-package sign-ups",
  "- Dwell time on core product pages",
  "- Bounce rate",
  "- Retargeting conversions",
  "- Demo requests",
  "- Conversion from high-intent organic traffic",
  "",
  "SMART CONVERSION OBJECTIVES:",
  "- Increase CTA click-through rates by 20-30% by Q2 2026",
  "- Achieve 10% conversion from high-intent visitors into free package by Q4 2026",
  "- Secure 5 new pilot participants by Q1 2026",
  "- Raise product-page dwell time to 2+ minutes by Q2 2026",
  "- Reduce bounce rates to below 40% by Q3 2026",
  "- Convert 10% of retargeting audiences into enquiries by Q4 2026",
  "- Reach a 5% demo-request rate by Q4 2026",
  "",
  "Through clear entry points, behavioural insight, and ongoing optimisation, Hobson builds a conversion engine suited for early-stage pilots today and scalable commercial activity in the coming years.",
];

// ============================================================================
// STRUCTURED DATA PROVIDERS FOR PDF RENDERING
// These provide typed data structures that match UI component content exactly
// ============================================================================

/**
 * Structured data for Commercialisation Strategy section
 * Matches CommercialisationStrategyVisual.tsx exactly
 */
export interface CommercialisationStrategyData {
  headerText: string;
  operatorChallenges: string[];
  calloutText: { prefix: string; highlighted: string; suffix: string };
  problemsSolved: string[];
  conclusionLine1: { prefix: string; highlighted: string; suffix: string };
  conclusionLine2: string;
}

export const getCommercialisationStrategyStructuredData = (): CommercialisationStrategyData => ({
  headerText: "The Real Estate industry is at an inflexion point.",
  operatorChallenges: [
    "exploding regulatory complexity,",
    "shrinking operating margins,",
    "acute labour shortages,",
    "rising compliance penalties,",
    "and mounting portfolio risk."
  ],
  calloutText: {
    prefix: "They cannot wait for incremental tools. They need a ",
    highlighted: "structural operating upgrade",
    suffix: "."
  },
  problemsSolved: [
    "compliance exposure,",
    "lease complexity,",
    "maintenance volatility,",
    "and portfolio-level risk blindness."
  ],
  conclusionLine1: {
    prefix: "Commercialisation is not an experiment. It is an ",
    highlighted: "inevitability",
    suffix: "."
  },
  conclusionLine2: "The only question is who captures the category."
});

/**
 * Structured data for Commercials section
 * Matches CommercialsVisual.tsx exactly
 */
export interface CommercialsData {
  introText: string;
  revenueExpansion: {
    title: string;
    intro: string;
    asOperatorsLabel: string;
    drivers: string[];
    callout: { prefix: string; highlighted: string; suffix: string };
  };
  transparency: {
    title: string;
    providesLabel: string;
    features: string[];
    callout1: { prefix: string; highlighted: string; suffix: string };
    callout2: { prefix: string; highlighted: string; suffix: string };
  };
}

export const getCommercialsStructuredData = (): CommercialsData => ({
  introText: "This is designed to kill procurement friction and accelerate viral adoption inside organisations.",
  revenueExpansion: {
    title: "Built-In Revenue Expansion Engine",
    intro: "Hobson has something most startups do not: automatic net revenue retention growth.",
    asOperatorsLabel: "As operators:",
    drivers: [
      "grow portfolios",
      "expand into new jurisdictions",
      "face more compliance",
      "manage more complex leases",
      "increase reporting demands"
    ],
    callout: {
      prefix: "Their HEU consumption rises ",
      highlighted: "without a single sales conversation",
      suffix: "."
    }
  },
  transparency: {
    title: "Unmatched Transparency = Enterprise Trust",
    providesLabel: "Hobson provides:",
    features: [
      "real-time HEU usage bars",
      "per-message cost breakdowns",
      "full audit trails of AI effort"
    ],
    callout1: {
      prefix: "This gives finance teams ",
      highlighted: "absolute certainty on cost control",
      suffix: "."
    },
    callout2: {
      prefix: "It removes the biggest objection enterprises have to AI: ",
      highlighted: "unpredictable cost",
      suffix: "."
    }
  }
});

/**
 * Structured data for HEU Pricing section
 * Matches HEUPricingVisual.tsx exactly
 */
export interface HEUPricingData {
  headerTitle: string;
  headerIntro: { prefix: string; highlighted: string };
  heuMeasure: {
    title: string;
    description: string;
  };
  monetises: {
    title: string;
    items: string[];
    note: { bold: string; suffix: string };
  };
  keyInsight: string;
  pricingTitle: string;
  plans: Array<{
    plan: string;
    price: string;
    heus: string;
    intent: string;
  }>;
  footer: string;
}

export const getHEUPricingStructuredData = (): HEUPricingData => ({
  headerTitle: "The HEU Model",
  headerIntro: {
    prefix: "Hobson's pricing model is a ",
    highlighted: "usage-based infrastructure monetisation model"
  },
  heuMeasure: {
    title: "Hobson Energy Units (HEUs) measure AI effort:",
    description: "Every document read, lease abstracted, compliance workflow executed, risk model run, or report built consumes HEUs."
  },
  monetises: {
    title: "This means Hobson monetises:",
    items: [
      "operator dependency",
      "portfolio scale",
      "regulatory complexity",
      "decision intensity"
    ],
    note: {
      bold: "not",
      suffix: " headcount or asset count"
    }
  },
  keyInsight: "Traditional property software caps revenue. Hobson's model scales automatically with operational stress. The more complex the operator's world becomes, the more valuable and profitable Hobson becomes.",
  pricingTitle: "Pricing That Forces Adoption",
  plans: [
    { plan: "Free", price: "GBP 0", heus: "18", intent: "Frictionless market entry" },
    { plan: "Essential", price: "GBP 19.50", heus: "275", intent: "Hook small operators" },
    { plan: "Essential Plus", price: "GBP 49.75", heus: "700", intent: "Convert growing teams" },
    { plan: "Enterprise", price: "GBP 148.50", heus: "2,000", intent: "Lock in serious operators" },
    { plan: "HEU Top-Up", price: "GBP 15", heus: "150", intent: "Expand ARPU naturally" }
  ],
  footer: "No per-user fees. No per-asset fees. Unlimited scale."
});

/**
 * Structured data for Team Credibility section
 * Matches TeamCredibilityVisual.tsx exactly
 */
export interface TeamCredibilityData {
  header: {
    title: string;
    description: string;
  };
  directExperience: {
    title: string;
    description: string;
  };
  teamBrings: {
    title: string;
    items: string[];
  };
}

export const getTeamCredibilityStructuredData = (): TeamCredibilityData => ({
  header: {
    title: "Founded by the Team Behind Arthur Online",
    description: "Hobson was founded by the team behind Arthur Online, a Real Estate operations platform built and scaled for institutional adoption, which was acquired by Advent and Aareon in 2021."
  },
  directExperience: {
    title: "Direct Market Experience",
    description: "That experience provides direct insight into how Real Estate platforms are bought, deployed, and relied upon at scale - and where they break under document complexity, compliance pressure, and operational load."
  },
  teamBrings: {
    title: "The Team Brings",
    items: [
      "Proven experience building and scaling enterprise Real Estate software",
      "Deep understanding of document-heavy, regulated environments",
      "Credibility with institutional buyers and partners",
      "Prior experience navigating governance, security, and M&A processes"
    ]
  }
});

/**
 * Structured data for Founding Leadership section
 * Matches FoundingLeadershipVisual.tsx exactly
 */
export interface FoundingLeadershipData {
  header: {
    title: string;
    description: string;
    highlight: string;
  };
  foundingExperience: {
    title: string;
    items: string[];
  };
  arthurAareon: {
    title: string;
    intro1: string;
    intro2: string;
    items: string[];
  };
  keyInsight: {
    title: string;
    text: string;
  };
  teamNavigated: {
    title: string;
    items: string[];
  };
  conclusion: string;
}

export const getFoundingLeadershipStructuredData = (): FoundingLeadershipData => ({
  header: {
    title: "Proven Operators. Repeat Exits. Category Builders",
    description: "Hobson is led by a team that has built, scaled, and exited technology companies across three decades through multiple economic cycles and technology shifts. This is not a first venture.",
    highlight: "Hobson is the next evolution of a proven execution engine."
  },
  foundingExperience: {
    title: "The founding leadership has:",
    items: [
      "built businesses throughout the 1990s, 2000s, and 2010s,",
      "scaled enterprise software platforms in regulated industries,",
      "and executed successful exits."
    ]
  },
  arthurAareon: {
    title: "Arthur & Aareon Experience",
    intro1: "Most notably, the team previously founded and scaled Arthur, a category-leading property management platform that Advent International and Aareon ultimately acquired in 2021.",
    intro2: "Following that acquisition, the leadership remained deeply involved in enterprise growth and strategic expansion inside Aareon's global organisation, where they:",
    items: [
      "led complex platform implementations,",
      "managed large enterprise clients,",
      "and executed additional acquisitions, including Fixflo and Tilt Property Software."
    ]
  },
  keyInsight: {
    title: "This experience gives Hobson something few startups ever possess:",
    text: "Direct, operational knowledge of how to build, scale, integrate, and exit Real Estate technology businesses."
  },
  teamNavigated: {
    title: "Hobson's team has already navigated:",
    items: [
      "product-market fit,",
      "hypergrowth,",
      "enterprise implementation,",
      "cross-border expansion,",
      "post-acquisition integration,",
      "and strategic M&A execution."
    ]
  },
  conclusion: "Hobson enters the market with dramatically reduced execution risk and a clear blueprint for both scale and exit."
});

/**
 * Structured data for Team section
 * Matches TeamVisual.tsx exactly
 */
export interface TeamMemberData {
  name: string;
  role: string;
  description?: string;
  isTBC?: boolean;
}

export interface TeamData {
  coreTeam: {
    title: string;
    subtitle: string;
    members: TeamMemberData[];
  };
  advisors: {
    title: string;
    subtitle: string;
    dividerText: string;
    members: TeamMemberData[];
  };
  upcomingAdvisory: {
    title: string;
    areas: string[];
  };
}

export const getTeamStructuredData = (): TeamData => ({
  coreTeam: {
    title: "Core Operational Team",
    subtitle: "The team driving Hobson's growth and innovation",
    members: [
      { name: "—", role: "CEO", isTBC: true },
      { name: "Marc Trup", role: "Commercial Lead", description: "Driving enterprise sales, go-to-market execution, and customer growth" },
      { name: "Rochelle Trup", role: "Commercial Lead", description: "Leading commercial strategy, partnerships, and market expansion" },
      { name: "Julia Szaltoni", role: "Product Lead", description: "Driving product strategy, design, and customer outcomes with deep domain understanding of property operations and user behaviour" },
      { name: "Denis Kosenkov", role: "Senior AI Developer", description: "Architecting Hobson's AI systems and execution pipelines" },
      { name: "Harriet Taylor", role: "Marketing Lead", isTBC: true },
      { name: "Max Grey", role: "Sales Lead", isTBC: true },
      { name: "Saul Trup", role: "Client Success Lead", isTBC: true }
    ]
  },
  advisors: {
    title: "Advisory Board",
    subtitle: "Experienced advisors providing strategic guidance",
    dividerText: "STRATEGIC GUIDANCE",
    members: [
      { name: "Nick Doffman", role: "Commercial Advisor", description: "Bringing deep commercial and industry experience to guide strategic growth" },
      { name: "Kumar Ankit", role: "AI & Technical Advisor", description: "Advising on core AI architecture and platform development" }
    ]
  },
  upcomingAdvisory: {
    title: "Additional advisors currently in formation to support:",
    areas: [
      "International expansion",
      "Enterprise partnerships",
      "Regulatory strategy"
    ]
  }
});

// ==========================================
// Marketing Objectives Structured Data
// ==========================================

interface MarketingObjectivesData {
  header: {
    title: string;
    subtitle: string;
  };
  topLevelGoals: string[];
  timeline: Array<{
    period: string;
    text: string;
    colorKey: "amber" | "emerald" | "purple";
  }>;
  journeyStages: Array<{
    stage: string;
    period: string;
    colorKey: "purple" | "emerald" | "amber" | "rose";
    objectives: string[];
    metrics: string;
    targets: Array<{ value: string; label: string }>;
  }>;
  frameworkItems: string[];
  channelTable: Array<{
    area: string;
    channels: string;
    metrics: string;
    benefit: string;
  }>;
  alignmentItems: Array<{ text: string; sub: string }>;
}

export const getMarketingObjectivesStructuredData = (): MarketingObjectivesData => ({
  header: {
    title: "Marketing Objectives",
    subtitle: "Aligned with 2026-2028 timeline for measurable growth across awareness, consideration, conversion, retention, and advocacy."
  },
  topLevelGoals: [
    "Increase visibility across the UK real estate sector as the MVP moves into pilot expansion during 2026",
    "Build credibility through evidence, pilot success stories, and trustworthy product education",
    "Establish a predictable acquisition and activation funnel in preparation for the 2027 public launch",
    "Support long-term adoption with consistent engagement and communication across all customer segments"
  ],
  timeline: [
    { period: "By Q4 2026", text: "Marketing should show strong early awareness, predictable interest in pilots, and growing engagement with educational content.", colorKey: "amber" },
    { period: "By Q4 2027", text: "Hobson should operate a scalable acquisition engine with mature digital channels, predictable lead flow, and clear conversion pathways following the public launch.", colorKey: "emerald" },
    { period: "By 2028", text: "Marketing expands into two international regions and supports globalised demand, localisation, and partnerships.", colorKey: "purple" }
  ],
  journeyStages: [
    {
      stage: "Awareness",
      period: "Build through 2026 to scale in 2027 and expand in 2028",
      colorKey: "purple",
      objectives: [
        "Increase visibility among UK real estate professionals ahead of and during pilot expansion (2026)",
        "Drive consistent top-of-funnel traffic using clarity-based educational content",
        "Strengthen brand recall using distinctive digital assets (owl, HUE, metaphors, clarity style)"
      ],
      metrics: "Website sessions, quiz completions, LinkedIn impressions & engagement, brand recall survey signals and awareness coefficient",
      targets: [
        { value: "500", label: "monthly website visits by Q1 2027" },
        { value: "1,000+", label: "quiz completions by Q2 2027" },
        { value: "200k+", label: "LinkedIn impressions per quarter by Q4 2027" }
      ]
    },
    {
      stage: "Consideration",
      period: "2026-2027",
      colorKey: "emerald",
      objectives: [
        "Turn awareness into informed interest through more precise product explanations",
        "Support evaluation with demos, walkthroughs, retargeting, and repeated exposure",
        "Build confidence in Hobson's reliability, accuracy, and referencing approach"
      ],
      metrics: "Demo requests, time on product pages, lead magnet downloads, retargeting CTR and consideration coefficient",
      targets: [
        { value: "50", label: "demo requests by Q1 2027" },
        { value: "1/month", label: "educational asset release throughout 2026-2027" },
        { value: ">3%", label: "retargeting CTR by Q4 2027" }
      ]
    },
    {
      stage: "Conversion",
      period: "Pilot conversion throughout 2026, extending to paid expansion in 2027",
      colorKey: "amber",
      objectives: [
        "Convert interested organisations into active pilots during 2026",
        "Reduce activation friction (first upload -> first question)",
        "Demonstrate commercial value through pilot outcomes ahead of 2027 launch"
      ],
      metrics: "New pilot sign-ups, activation rate (upload + first question), pilot-to-paid conversion, early ARR and sales coefficient",
      targets: [
        { value: "5", label: "new pilots by Q2 2026" },
        { value: "60%+", label: "activation within 14 days" },
        { value: "GBP 50k-100k", label: "MRR by Q4 2027" },
        { value: ">=20%", label: "conversion rate post-launch" }
      ]
    },
    {
      stage: "Retention & Advocacy",
      period: "Foundational in 2026, strengthen in 2027, scale in 2028",
      colorKey: "rose",
      objectives: [
        "Build strong user loyalty throughout the 2026 pilot phase",
        "Encourage advocacy from high-satisfaction teams",
        "Maintain clear and consistent communication across accounts as usage scales"
      ],
      metrics: "Satisfaction score (CSAT), Net Promoter Score (NPS), retention rate, weekly active usage, testimonials, case studies and liking coefficient",
      targets: [
        { value: "80%+", label: "satisfaction by Q4 2026" },
        { value: "NPS > 50", label: "by Q4 2026" },
        { value: "80%+", label: "retention by Q4 2027" },
        { value: "9+", label: "case studies by Q4 2027" }
      ]
    }
  ],
  frameworkItems: [
    "Builds early visibility before the 2027 launch",
    "Guides prospects into precise, structured evaluation",
    "Supports conversion and commercial validation throughout 2026",
    "Strengthens long-term retention and advocacy as Hobson scales",
    "Creates a predictable funnel ready for UK expansion in 2027",
    "Enables international expansion from 2028 onward"
  ],
  channelTable: [
    { area: "Acquisition", channels: "LinkedIn, Website", metrics: "Impressions, Sessions", benefit: "Builds visibility before launch" },
    { area: "Lead Generation", channels: "Website, Quiz, Retargeting", metrics: "Demo requests, Quiz sign-ups", benefit: "Creates pilot onboarding pipeline" },
    { area: "Engagement", channels: "Quiz, LinkedIn content", metrics: "Engagement rate, Dwell time", benefit: "Strengthens Liking and brand connection" },
    { area: "Conversion", channels: "Retargeting, Email", metrics: "CTR, Demo completions", benefit: "Turns interest into pilots" },
    { area: "Development", channels: "Email onboarding, Support", metrics: "CSAT, activation metrics", benefit: "Improves early experience" },
    { area: "Growth", channels: "Advocacy, Testimonials", metrics: "NPS, case studies", benefit: "Builds long-term brand equity" }
  ],
  alignmentItems: [
    { text: "Organisational goals", sub: "Builds long-term brand equity" },
    { text: "Long-term vision", sub: "Sustainable growth focus" },
    { text: "Mindset-first marketing", sub: "Trust before transactions" },
    { text: "2026-2027 objectives", sub: "Phased milestone targets" }
  ]
});

// ==========================================
// Brand Strategy Structured Data
// ==========================================

interface BrandStrategyData {
  header: {
    title: string;
    subtitle: string;
  };
  brandEssence: {
    title: string;
    content: string;
  };
  visualDirection: {
    title: string;
    intro: string;
    items: Array<{ title: string; description: string; colorKey: string }>;
  };
  verbalDirection: {
    title: string;
    intro: string;
    principles: string[];
    messagingNote: string;
  };
  experienceApproach: {
    title: string;
    intro: string;
    items: Array<{ title: string; description: string; colorKey: string }>;
  };
  internalAlignment: {
    title: string;
    intro: string;
    principles: string[];
    conclusion: string;
  };
  longTermDirection: {
    title: string;
    intro: string;
    items: string[];
    goal: string;
  };
  brandingObjectives: Array<{
    phase: string;
    title: string;
    colorKey: string;
    objectives: string[];
  }>;
  onlinePresence: {
    title: string;
    intro: string;
    channels: Array<{ id: string; title: string; description: string; points?: string[] }>;
  };
  onlineObjectives: Array<{
    phase: string;
    title: string;
    objectives: string[];
  }>;
  timelineSummary: string;
}

export const getBrandStrategyStructuredData = (): BrandStrategyData => ({
  header: {
    title: "Brand Strategy",
    subtitle: "Built on authenticity, clarity, and trust - positioning Hobson as the calm, intelligent guide for real estate documents."
  },
  brandEssence: {
    title: "Brand Essence",
    content: "Hobson's brand centres on one idea: making information easier to work with. All brand decisions - visual, verbal, and experiential - reinforce this idea by emphasising ease, reliability, and straightforward communication."
  },
  visualDirection: {
    title: "Visual Direction",
    intro: "The visual identity is designed to make the product immediately understandable and easy to use.",
    items: [
      { title: "Colour System", description: "A simple palette is used to ensure clarity, reduce visual noise, and create consistent recognition across channels.", colorKey: "purple" },
      { title: "Illustrated Elements (Owl Iconography)", description: "Illustration supports a friendly and recognisable identity without adding complexity. These elements appear lightly across product and marketing surfaces to provide continuity.", colorKey: "purple" },
      { title: "HUE Coin System", description: "Create a distinct brand asset that can scale into loyalty or rewards in future.", colorKey: "amber" },
      { title: "Interface Approach", description: "The product UI favours simplicity: minimal actions, clear outputs, and unobtrusive signposting. This reinforces Hobson's commitment to removing friction from document work.", colorKey: "teal" }
    ]
  },
  verbalDirection: {
    title: "Verbal Direction",
    intro: "Hobson's voice emphasises clarity, straightforwardness, and helpfulness.",
    principles: [
      "Be concise",
      "Explain technical concepts plainly",
      "Avoid exaggeration",
      "Focus on what the user gains in practical terms"
    ],
    messagingNote: "The brand's messaging framework is organised around showing value through clarity, trust, ease, and usefulness. These themes inform all external communication, from the website to demos."
  },
  experienceApproach: {
    title: "Experience & Interaction Approach",
    intro: "Brand experience extends beyond visuals and language into how users interact with the product and marketing.",
    items: [
      { title: "Lightweight Engagement Tools", description: "The quiz and similar assets create a soft entry point into the brand, helping users understand Hobson's value without heavy explanation.", colorKey: "purple" },
      { title: "Progression From First Use to Trust", description: "The experience aims to give users quick wins, followed by dependable performance, building confidence over repeated use.", colorKey: "teal" },
      { title: "Trust Signals", description: "Clear referencing, transparent behaviour, and consistent communication form part of the brand experience, helping reduce hesitation around AI tools.", colorKey: "amber" }
    ]
  },
  internalAlignment: {
    title: "Internal Brand Alignment",
    intro: "Internally, the brand acts as a guide for decision-making. It encourages:",
    principles: [
      "Simple solutions over complex ones",
      "Transparency in communication",
      "Prioritising user effort reduction"
    ],
    conclusion: "This internal consistency ensures the brand remains coherent as the organisation grows."
  },
  longTermDirection: {
    title: "Long-Term Branding Direction (2028-2030)",
    intro: "As Hobson enters more markets and the product evolves beyond retrieval, the brand will shift from being seen as a helpful assistant to a broader intelligence layer for real estate operations.",
    items: [
      "Developing a stronger narrative through real user stories",
      "Expanding the HUE concept into a wider engagement system",
      "Building a more visible presence across industry communities",
      "Maturing support and documentation to match enterprise expectations"
    ],
    goal: "The goal is for Hobson to become a recognised standard for document intelligence."
  },
  brandingObjectives: [
    {
      phase: "1",
      title: "Strengthen Brand Foundations During the Pilot Phase (By Q4 2026)",
      colorKey: "purple",
      objectives: [
        "Achieve consistent use of all core brand assets across every channel by Q4 2026, including tone, colour system, metaphors, messaging blocks, and visual identity.",
        "Publish at least three UK-based pilot case studies and two thought-leadership pieces by Q4 2026, establishing credibility ahead of the 2027 commercial launch.",
        "Record measurable improvements in positive brand associations - clarity, reliability, and ease of use - through structured user feedback by mid-2026."
      ]
    },
    {
      phase: "2",
      title: "Scale Brand Awareness for the Commercial Launch (By Q4 2027)",
      colorKey: "teal",
      objectives: [
        "Improve brand awareness among UK property professionals by 60% by Q4 2027, using LinkedIn analytics, branded search volume, website sessions, and quiz completions as indicators.",
        "Strengthen recognition of Hobson's brand archetype (Sage: calm, intelligent, trustworthy) through consistent messaging across product, website, and social channels."
      ]
    },
    {
      phase: "3",
      title: "International Brand Readiness (2028+)",
      colorKey: "amber",
      objectives: [
        "Prepare brand assets and messaging frameworks for localisation in Hobson's first two international markets (EU/US) beginning in 2028."
      ]
    }
  ],
  onlinePresence: {
    title: "Online Presence",
    intro: "Hobson's online presence is intentionally limited at this stage. The focus is on credibility, controlled exposure, and preparing the foundations for a scalable digital footprint once the product is ready for broader adoption.",
    channels: [
      { id: "A", title: "Website (hobsonschoice.ai)", description: "The website operates as the central source of information about Hobson. It provides a simple explanation of the product, a consistent visual identity, and an initial base for search visibility.", points: ["Introducing Hobson's purpose", "Directing users to early materials such as the quiz", "Supporting SEO indexing for future content", "Serving as a reference point for partners and investors"] },
      { id: "B", title: "Product Presence (MVP Access Only)", description: "Hobson is currently available only to selected pilot users. The online product environment reflects this controlled stage: a minimalist interface, steady iteration, and limited external visibility." },
      { id: "C", title: "Social Presence (LinkedIn)", description: "LinkedIn is currently Hobson's primary public channel, used for sharing updates, simple insights, and early brand signalling. Engagement is modest but aligned with the validation phase." },
      { id: "D", title: "Search Presence (SEO and AI Discovery)", description: "The current site is optimised for indexing, clear metadata, and structured copy so that both search engines and AI crawlers can interpret content effectively." },
      { id: "E", title: "Deliberate Non-Presence in Other Channels", description: "At this stage there are no newsletters, communities, paid campaigns, or additional social channels. This is intentional - to avoid premature scaling, manage expectations, and keep focus on validating product performance before increasing reach." },
      { id: "F", title: "Consistency Across Touchpoints", description: "All existing digital touchpoints show a unified look and feel, ensuring early recognition. As the ecosystem expands, this consistency will support clearer user journeys and smoother conversion paths." }
    ]
  },
  onlineObjectives: [
    {
      phase: "1",
      title: "Build a Strong and Credible Online Foundation (By Q4 2026)",
      objectives: [
        "Increase website traffic by 40% through expanded educational content, LinkedIn distribution, and targeted SEO",
        "Achieve an average dwell time of 2+ minutes",
        "Publish 10 high-quality educational pieces (guides, explainers, demos)"
      ]
    },
    {
      phase: "2",
      title: "Expand Digital Reach for the Commercial Launch (Q1-Q2 2027)",
      objectives: [
        "Launch at least two new online channels by Q1 2027",
        "Grow Hobson's LinkedIn audience to 1,000 followers by Q1 2027",
        "Prepare full public-facing online presence by Q2 2027"
      ]
    },
    {
      phase: "3",
      title: "Online Presence Expansion for Global Scale (2028+)",
      objectives: [
        "Localise web content, educational assets, and messaging for first two international markets"
      ]
    }
  ],
  timelineSummary: "2026 builds the foundation >> 2027 scales visibility + conversion >> 2028 prepares global readiness."
});

// ============================================================================
// BRAND INTEGRITY STRUCTURED DATA PROVIDER
// Matches BrandIntegrityVisual.tsx exactly
// ============================================================================

export interface BrandIntegrityData {
  summaryText: string;
  nextPhase: string[];
  closingNote: string;
  brandBackground: {
    description: string;
    archetypes: Array<{ name: string; trait: string; desc: string }>;
    visualElements: string;
  };
  strengths: string[];
  weaknesses: string[];
  emotionalAppeal: {
    promise: string;
    deepenedBy: string[];
  };
  cognitiveAppeal: {
    intro: string;
    features: Array<{ title: string; desc: string }>;
    internalNote: string;
  };
  authenticity: {
    description: string;
    enhancements: string;
  };
  metaphors: Array<{ metaphor: string; description: string }>;
  internalUseCases: string[];
  currentPosition: {
    description: string;
    opportunity: string;
  };
}

export const getBrandIntegrityStructuredData = (): BrandIntegrityData => ({
  summaryText: "Hobson has a clear, coherent, and authentic brand foundation. Its voice, visual identity, archetypes, and interactive elements all convey calm intelligence and dependable guidance.",
  nextPhase: [
    "Scaling emotional storytelling",
    "Building structured support and resolution processes",
    "Demonstrating the move from retrieval to proactive insight and strategic clarity"
  ],
  closingNote: "With these in place, Hobson can move from promising to preferred in the emerging category of AI document intelligence for Real Estate.",
  brandBackground: {
    description: "Hobson is a calm, intelligent, and dependable AI assistant built for Real Estate professionals who work with complex, document-heavy workflows. The brand stands for clarity, trust, and simplicity, turning source-of-truth documents into fast, accurate, fully referenced answers.",
    archetypes: [
      { name: "Sage", trait: "Primary Archetype", desc: "Wisdom, guidance, truth" },
      { name: "Ruler", trait: "Supporting Trait", desc: "Order, reliability" },
      { name: "Creator", trait: "Supporting Trait", desc: "Innovation" }
    ],
    visualElements: "The purple palette signals insight and clear thinking rather than noisy disruption. The owl mascot embodies Hobson's role as a quiet, observant guide. The Hobson Energy Unit (HUE) adds a coin-based 'energy' layer for engagement, rewards, or recognition."
  },
  strengths: [
    "Simplifies document retrieval and reduces cognitive load",
    "Saves meaningful time on routine information search",
    "Provides transparent, referenced answers that build trust",
    "Calm, clear, and jargon-free tone matching the Sage archetype",
    "Consistent, modern, and recognisable visual assets",
    "Interactive tools like the quiz reinforce Hobson as knowledgeable yet friendly"
  ],
  weaknesses: [
    "Emotionally, the brand is not yet fully expressed - users understand what Hobson does but fewer cues about deeper human-level impact",
    "Seen as reliable and helpful, but not yet as a source of ongoing strategic insight or proactive guidance",
    "Still building resolution and support structures that mature brands rely on"
  ],
  emotionalAppeal: {
    promise: "Hobson's emotional promise is reassurance. It reduces stress by making hard-to-find information easy to access, giving professionals a sense of control in high-pressure, chaotic environments.",
    deepenedBy: [
      "Before/after stories showing real relief and time saved",
      "User narratives highlighting confidence and reduced risk",
      "Visuals showing Hobson as calm presence in hectic workflows"
    ]
  },
  cognitiveAppeal: {
    intro: "The logical argument for Hobson is equally strong. Its architecture is designed for:",
    features: [
      { title: "Measurable outcomes", desc: "time saved, fewer errors, quicker decisions" },
      { title: "Transparent referencing", desc: "every answer traced back to its source" }
    ],
    internalNote: "'Practice what we preach' - Hobson uses AI internally for testing, content refinement, and support tasks."
  },
  authenticity: {
    description: "Authenticity is one of Hobson's core strengths. The brand avoids hype, is open about its limitations, and is built around clarity, not mystery. Showing sources for every answer is a direct expression of that principle.",
    enhancements: "Confidence scores, incomplete-data alerts, and clearer 'how this answer was generated' views will deepen honesty. Case studies, short trials, and measurable results will provide external proof."
  },
  metaphors: [
    { metaphor: "GPS for documents", description: "Takes you straight to the answer" },
    { metaphor: "Master key", description: "Unlocks information hidden in dense files" },
    { metaphor: "Compass in a document jungle", description: "Navigates complexity safely" },
    { metaphor: "Desk lamp", description: "Quietly illuminates the truth whenever needed" }
  ],
  internalUseCases: [
    "Automate testing and quality checks",
    "Refine content and documentation",
    "Support parts of customer communication"
  ],
  currentPosition: {
    description: "Today, Hobson's market presence is selective and relationship-led. The focus is on deep MVP partnerships rather than broad public awareness. The brand is visually strong, the story is coherent, and the touchpoints - site, quiz, mascot, and interface - are consistent.",
    opportunity: "Shift from being a quiet, validating presence into a confident, educational voice that helps shape expectations for AI-native assistants in real estate: what 'good' looks like, what transparency means, and how document intelligence should behave."
  }
});

// ============================================================================
// SEGMENTATION STRATEGY STRUCTURED DATA PROVIDER
// Matches SegmentationStrategyVisual.tsx exactly
// ============================================================================

export interface SegmentationStrategyData {
  header: {
    title: string;
    description: string;
  };
  positioningVision: string;
  positioningPrinciples: Array<{ title: string; desc: string }>;
  userUnderstanding: string[];
  customerJourney: Array<{ stage: string; desc: string }>;
  strategicAdvantages: Array<{ title: string; desc: string }>;
  globalDirection: {
    intro: string;
    quote: string;
    conclusion: string;
  };
  smartObjectives: Array<{ year: string; title: string; desc: string }>;
  ukTargetingPhases: Array<{
    phase: string;
    title: string;
    target: string;
    objectives: string[];
    brandRole: string;
  }>;
  globalExpansion: {
    stats: Array<{ value: string; label: string }>;
    priorities: string[];
    smartObjectives: string[];
  };
  ukSmartObjectives: Array<{ stage: string; period: string; objective: string }>;
  benefits: {
    organisational: string[];
    longTermVision: string[];
    digitalStrategy: Array<{ area: string; desc: string }>;
  };
}

export const getSegmentationStrategyStructuredData = (): SegmentationStrategyData => ({
  header: {
    title: "Organisational Positioning",
    description: "Hobson's long-term positioning centres on supporting Real Estate professionals with an intelligence layer that enhances the systems they already use. The goal is to be recognised for delivering reliable document insight without requiring significant operational change."
  },
  positioningVision: "Hobson will be positioned as a practical, document-focused AI assistant that helps teams work faster and make decisions with clearer information. The emphasis is on complementing, not replacing, existing workflows. As the product matures, positioning will expand from retrieval to broader insight and guidance.",
  positioningPrinciples: [
    { title: "Direct Clarity", desc: "Answers that reduce effort and uncertainty" },
    { title: "Reliability", desc: "Outputs that users can treat as dependable inputs to their work" },
    { title: "Low Friction", desc: "A tool that is simple to adopt and easy to maintain" },
    { title: "Supportive Role", desc: "An assistant that fits around current systems and processes" }
  ],
  userUnderstanding: [
    "Helps them locate information quickly",
    "Reduces the effort required in manual document review",
    "Provides outputs that support confident decision-making"
  ],
  customerJourney: [
    { stage: "Awareness", desc: "A practical AI option built for property operations" },
    { stage: "Consideration", desc: "A simple way to access document insight quickly" },
    { stage: "Conversion", desc: "A low-effort tool suitable for pilot use" },
    { stage: "Retention", desc: "A dependable part of recurring workflows" }
  ],
  strategicAdvantages: [
    { title: "1. Clear Category Definition", desc: "Focus on document intelligence avoids overlap with leasing automation or full-stack platforms" },
    { title: "2. Low-Resistance Adoption", desc: "Enhancing existing tools reduces the organisational barriers often seen with new systems" },
    { title: "3. Scalable Narrative", desc: "As the product evolves from retrieval to insight, the positioning can expand naturally without contradiction" }
  ],
  globalDirection: {
    intro: "As Hobson enters additional markets, the positioning will scale to a universal, simple description:",
    quote: "Hobson is a reliable AI assistant for Real Estate infrastructure management.",
    conclusion: "This creates a consistent global identity that can adapt to local regulations and workflows."
  },
  smartObjectives: [
    { year: "2025", title: "Positioning Framework", desc: "Publish a complete, scalable positioning framework by Q4 2025, ready to support the Q1 2026 MVP and pilot expansion." },
    { year: "2026", title: "Brand Recognition", desc: "Improve brand recall by 20% by Q4 2026, driven by consistent messaging, educational content, and pilot storytelling." },
    { year: "2027", title: "Industry Credibility", desc: "Appear in two respected industry reports by Q4 2027 as a leading AI solution for document intelligence in real estate." },
    { year: "2028", title: "Category Definition", desc: "Establish 'document intelligence assistant' as a recognised category term in UK real estate by Q4 2028." },
    { year: "2029", title: "Global Consistency", desc: "Achieve consistent brand positioning across the UK, EU, and US markets by Q4 2029." }
  ],
  ukTargetingPhases: [
    {
      phase: "1",
      title: "Validation & MVP Readiness (Q1 2026)",
      target: "Existing partners and up to 5 new non-paying pilot organisations",
      objectives: [
        "Finalise the MVP for Q1 2026",
        "Build trust through early testing",
        "Validate accuracy, referencing, and core workflows"
      ],
      brandRole: "Hobson acts as the Sage, a calm, intelligent guide helping teams see through document complexity."
    },
    {
      phase: "2",
      title: "Pilot Expansion & Evidence Building (Q2-Q3 2026)",
      target: "Medium-sized Real Estate firms, small professional portfolios, selective large operators",
      objectives: [
        "Reach 10 active pilot organisations",
        "Produce segment-specific proof points and case studies",
        "Convert 3-5 pilots to paid accounts"
      ],
      brandRole: "A trusted, lightweight companion that delivers clarity without requiring system change."
    },
    {
      phase: "3",
      title: "Commercialisation & UK Market Entry (2027)",
      target: "Pilot-to-paid conversions and new inbound paying customers",
      objectives: [
        "Launch public website and onboarding flows in Q1 2027",
        "Establish predictable acquisition -> activation -> retention funnels",
        "Build the ARR foundation for scale"
      ],
      brandRole: "A dependable, intelligent assistant that enhances existing systems."
    }
  ],
  globalExpansion: {
    stats: [
      { value: "36.1%", label: "CAGR AI in Real Estate" },
      { value: "$1.8T", label: "Market by 2030" },
      { value: "10%+", label: "NOI improvements (McKinsey)" },
      { value: "49%", label: "Firms saving costs (Forbes)" }
    ],
    priorities: [
      "US & Canada - most mature Proptech ecosystems",
      "EU (Germany, Netherlands, Nordics) - strong regulatory burden -> high document complexity",
      "UAE & Singapore - fast adopters of digital-first property innovation"
    ],
    smartObjectives: [
      "Enter two international markets by 2028",
      "Secure 10 global pilot clients by mid-2029",
      "Generate GBP 250k-400k global ARR by 2030",
      "Publish 5 international case studies by 2030"
    ]
  },
  ukSmartObjectives: [
    { stage: "Validation", period: "2025-Q1 2026", objective: "Secure five additional non-paying pilots by end of Q1 2026" },
    { stage: "User Satisfaction", period: "Q1-Q2 2026", objective: "Achieve 80%+ satisfaction by Q2 2026, measured through clarity, speed, and ease of use" },
    { stage: "Segment Representation", period: "Q2-Q3 2026", objective: "Activate at least one pilot in each core segment by Q3 2026" },
    { stage: "Messaging Frameworks", period: "Q3-Q4 2026", objective: "Develop fully segment-specific messaging by Q4 2026" },
    { stage: "Commercial Validation", period: "2027", objective: "Convert 3-5 pilot organisations into paying clients by Q3 2027" }
  ],
  benefits: {
    organisational: [
      "Reduced market risk through staged validation",
      "Strong proof-of-value before scaling",
      "Clear roadmap from MVP -> Pilot -> Paid -> Global",
      "Supports ARR, retention, and brand trust targets"
    ],
    longTermVision: [
      "UK foundation -> scalable international model",
      "Clear positioning as 'AI that brings clarity without disruption'",
      "Alignment with global adoption curves and ROI trends"
    ],
    digitalStrategy: [
      { area: "Acquisition", desc: "Prioritises segments with highest pain and readiness" },
      { area: "Engagement", desc: "Persona-driven messaging + quiz + Sage brand identity" },
      { area: "Lead Gen", desc: "Clear segment funnels feeding demos & pilots" },
      { area: "Conversion", desc: "Phased targeting reduces friction to trial" },
      { area: "Growth", desc: "Creates base for long-term global expansion" }
    ]
  }
});

// ============================================================================
// CONTENT ENGAGEMENT STRATEGY STRUCTURED DATA PROVIDER
// Matches ContentEngagementStrategyVisual.tsx exactly
// ============================================================================

export interface ContentEngagementStrategyData {
  headerText: string;
  purposeIntro: string;
  purposes: Array<{ title: string; desc: string }>;
  purposeNote: string;
  coreThemes: Array<{ title: string; desc: string }>;
  themesNote: string;
  journeyStages: Array<{
    stage: string;
    goal: string;
    items: string[];
    success: string;
  }>;
  engagementMethods: Array<{ title: string; desc: string }>;
  channels: Array<{ channel: string; role: string; examples: string }>;
  channelNote: string;
  smartTargets: Array<{
    category: string;
    items: string[];
  }>;
  strategyConclusion: string;
  acquisitionStrategy: {
    intro: string;
    goals: string[];
    messagingFocus: Array<{ highlight: string; desc: string }>;
    channels: Array<{ name: string; icon: string; desc: string; target: string }>;
  };
  journeyCommunications: Array<{ stage: string; desc: string }>;
  acquisitionTargets: Array<{ metric: string; desc: string }>;
  conversionStrategy: {
    intro: string;
    points: string[];
  };
  finalSummary: string;
}

export const getContentEngagementStrategyStructuredData = (): ContentEngagementStrategyData => ({
  headerText: "Hobson's content and engagement strategy is built to clearly introduce the product, reduce uncertainty around AI in real estate, and support a smooth progression from initial interest to long-term use. Because the product is still in an MVP phase, the strategy prioritises clarity and credibility over volume.",
  purposeIntro: "Content exists to support three practical goals:",
  purposes: [
    { title: "Understanding", desc: "Help the market understand what Hobson does and why it matters" },
    { title: "Confidence", desc: "Build confidence by showing how the product works and handles information" },
    { title: "Support", desc: "Support users and prospects through each stage with simple, useful materials" }
  ],
  purposeNote: "The emphasis is on being informative and practical, without overstating capability.",
  coreThemes: [
    { title: "Clarity", desc: "Explaining how Hobson simplifies document work" },
    { title: "Trust", desc: "Showing how answers are produced and referenced" },
    { title: "Ease", desc: "Emphasising simple workflows and minimal effort" },
    { title: "Practical Guidance", desc: "Offering examples reflecting day-to-day tasks" }
  ],
  themesNote: "These themes shape every asset, from short posts to onboarding material.",
  journeyStages: [
    {
      stage: "1. See (Awareness)",
      goal: "Show the problem and introduce Hobson",
      items: [
        "Short visual examples of document pain points",
        "Simple explanations of what Hobson does",
        "Interactive entry points such as the quiz"
      ],
      success: "Increased visibility and early curiosity"
    },
    {
      stage: "2. Think (Consideration)",
      goal: "Explain how Hobson works and what makes it different",
      items: [
        "Walkthroughs of question-and-answer outputs",
        "Comparisons with manual workflows",
        "Examples of referenced answers"
      ],
      success: "Longer engagement with product content"
    },
    {
      stage: "3. Do (Conversion)",
      goal: "Encourage pilot participation through clear pathways",
      items: [
        "Case summaries from early partners",
        "Clear pages showing how to start",
        "Invitations to limited pilot opportunities"
      ],
      success: "Enquiries and pilot sign-ups"
    },
    {
      stage: "4. Care (Retention & Advocacy)",
      goal: "Support ongoing use and create feedback loops",
      items: [
        "Simple onboarding materials",
        "Short guidance tips",
        "Updates on improvements or new features"
      ],
      success: "Continued usage and positive feedback"
    }
  ],
  engagementMethods: [
    { title: "The Quiz", desc: "An accessible way to introduce the problem space, gather light insights, and create an early emotional connection." },
    { title: "Simple Stories and Examples", desc: "Day-to-day scenarios illustrate value more effectively than abstract claims." },
    { title: "Direct Feedback Loops", desc: "1:1 conversations, polls, and structured partner feedback provide more value than large-scale community efforts at this stage." },
    { title: "Emerging Insight Content", desc: "As the product matures, content will highlight examples of guidance, pattern spotting, or saved effort." }
  ],
  channels: [
    { channel: "Website", role: "Education & conversion", examples: "Demos, explanations, case summaries" },
    { channel: "LinkedIn", role: "Awareness & credibility", examples: "Updates, commentary, product examples" },
    { channel: "Quiz", role: "Engagement & lead capture", examples: "Interactive entry point" },
    { channel: "Email (later)", role: "Nurture & retention", examples: "Onboarding steps, feature highlights" },
    { channel: "Product UI", role: "Ongoing engagement", examples: "Prompts, tips, clear output formatting" }
  ],
  channelNote: "This division keeps each channel focused and avoids over-communication during the MVP stage.",
  smartTargets: [
    {
      category: "Content & Education (2026 Foundation)",
      items: [
        "Publish 10 clear, educational pieces by Q4 2026 to strengthen awareness, improve consideration, and support pilot onboarding.",
        "Deliver three short onboarding guides for common user roles (COO, Asset Manager, Owner-Manager) by Q4 2026."
      ]
    },
    {
      category: "Engagement & Awareness (2026 Performance Targets)",
      items: [
        "Increase LinkedIn engagement by 15% by Q4 2026, driven by consistent educational posts, thought leadership, and early pilot insights.",
        "Introduce simple feature-based email prompts by Q4 2026 to support continued use across pilots and early free-package users."
      ]
    },
    {
      category: "Scaled Reach for Launch (Early 2027)",
      items: [
        "Achieve 500+ quiz completions by Q2 2027, providing a healthy top-of-funnel audience ahead of the public commercial launch."
      ]
    }
  ],
  strategyConclusion: "This strategy creates a content ecosystem that explains Hobson, builds confidence gradually, and supports users at each stage with practical, low-effort materials.",
  acquisitionStrategy: {
    intro: "Hobson's acquisition strategy aims to build early awareness, attract suitable prospects, and guide them into pilot participation. The approach uses steady, informative communication rather than volume-driven tactics.",
    goals: [
      "Make Hobson visible to real estate professionals with document-heavy workflows",
      "Bring qualified traffic to the website and quiz",
      "Build interest in the 2026 pilot programme",
      "Test channels and messaging for 2027 scale"
    ],
    messagingFocus: [
      { highlight: "Clear outcomes", desc: "fast answers from existing documents" },
      { highlight: "Reliable behaviour", desc: "transparent outputs and referenced info" },
      { highlight: "Time savings", desc: "reduced administrative load" },
      { highlight: "Ease of adoption", desc: "minimal change to existing workflows" }
    ],
    channels: [
      { name: "LinkedIn (Primary)", icon: "linkedin", desc: "Simple explanations, examples, case summaries, quiz distribution", target: "1,000 followers by Q4 2027" },
      { name: "Website & Search", icon: "monitor", desc: "Clear landing pages, case examples, search-optimised content", target: "40% organic traffic increase by Q2 2027" },
      { name: "Paid Search (Later)", icon: "search", desc: "Capture high-intent users after pages are developed", target: "3-5% CTR by Q4 2027" },
      { name: "Retargeting (Later)", icon: "users", desc: "Feature clips, case snippets, testimonial extracts", target: "10% retargeted visitors to enquiries by Q4 2027" }
    ]
  },
  journeyCommunications: [
    { stage: "Awareness", desc: "Introduce the problem and show how Hobson addresses it. Short visual comparisons or simple explanations of common pain points." },
    { stage: "Consideration", desc: "More detail on how Hobson works using examples of referenced answers or simple walkthroughs. Reduce uncertainty and help assess fit." },
    { stage: "Pilot Acquisition (2026)", desc: "Clarity around expectations, limited availability, and examples of value from earlier partners. Support a controlled, high-quality pilot group." },
    { stage: "International Acquisition (2028+)", desc: "Adapt channels and messaging for markets with strong AI and digital tool adoption. Localisation, partnerships, and region-specific campaigns." }
  ],
  acquisitionTargets: [
    { metric: "500+", desc: "Quiz completions by Q2 2027" },
    { metric: "40%", desc: "Website traffic increase by Q4 2027" },
    { metric: "1,000", desc: "LinkedIn followers by Q4 2027" },
    { metric: "5+", desc: "Additional pilot participants by Q4 2026" },
    { metric: "10%", desc: "Retargeted visitors converting by Q4 2027" },
    { metric: "Q1 2028", desc: "International acquisition readiness" }
  ],
  conversionStrategy: {
    intro: "Hobson's conversion strategy focuses on turning qualified interest into practical use by keeping the journey simple, lowering barriers to trial, and showing value quickly.",
    points: [
      "Give prospective users a straightforward path from curiosity to hands-on experience",
      "Reduce perceived risk through a free entry point",
      "Demonstrate value early through real interactions with uploaded documents",
      "Improve conversion performance through continual measurement",
      "Build a funnel that can support future paid tiers"
    ]
  },
  finalSummary: "This acquisition strategy builds a patient, steady funnel that supports Hobson's stage of development. By using targeted channels, clear explanations, and evidence-led communication, Hobson can grow visibility, attract suitable prospects, and prepare for broader expansion once the product is ready for public rollout."
});

// ============================================================================
// PRIMARY CONVERSION CHANNELS STRUCTURED DATA PROVIDER
// Matches PrimaryConversionChannelsVisual.tsx exactly
// ============================================================================

export interface PrimaryConversionChannelsData {
  headerText: string;
  channels: Array<{
    number: number;
    title: string;
    description: string;
    items: string[];
    note?: string;
  }>;
  keyTactics: Array<{
    number: number;
    title: string;
    description: string;
    items?: string[];
    note?: string;
  }>;
  keyMetrics: string[];
  metricsNote: string;
  smartObjectives: Array<{ target: string; desc: string }>;
  summary: string;
}

export const getPrimaryConversionChannelsStructuredData = (): PrimaryConversionChannelsData => ({
  headerText: "The goal of the conversion strategy is to make it as easy as possible for prospects to try Hobson, see value quickly, and progress toward deeper engagement. Through clear entry points, behavioural insight, and ongoing optimisation, Hobson builds a conversion engine suited for early-stage pilots today and scalable commercial activity in the coming years.",
  channels: [
    {
      number: 1,
      title: "Website",
      description: "The website acts as the main route into trials and enquiries. Conversion paths include:",
      items: [
        "Starting the free package",
        "Requesting a demo",
        "Submitting pilot enquiries",
        "Moving from the quiz into a guided trial"
      ],
      note: "Pages will be optimised around clear calls to action, simple explanations, and trust signals."
    },
    {
      number: 2,
      title: "LinkedIn",
      description: "LinkedIn brings warm, relevant traffic to the website. Its role in conversion is to:",
      items: [
        "Explain what the free experience involves",
        "Show quick, concrete examples of value",
        "Direct users to try the product without commitment"
      ]
    },
    {
      number: 3,
      title: "Retargeting (Later Phase)",
      description: "Retargeting will support users who need several exposures before acting. These campaigns will highlight:",
      items: [
        "What users can do immediately in the free package",
        "Small examples of outcomes",
        "Invitations to try the workflow for themselves"
      ]
    },
    {
      number: 4,
      title: "Email (For Users Already Engaged)",
      description: "Email will help users understand the product once they have expressed interest. It supports conversion by:",
      items: [
        "Guiding them through first steps",
        "Giving prompts based on typical tasks",
        "Reducing hesitation around accuracy or data handling"
      ]
    }
  ],
  keyTactics: [
    {
      number: 1,
      title: "Free Package as Entry Point",
      description: "A no-cost option removes the most significant practical and psychological barriers. It shifts the decision from 'should we commit?' to 'should we try this now?' The focus is on letting users experience the core value with minimal effort."
    },
    {
      number: 2,
      title: "Optimising Calls to Action",
      description: "Conversion performance will be improved by testing:",
      items: ["Wording", "Placement (especially above the fold)", "Number of CTAs per page", "Clarity of next steps"],
      note: "Small changes here often produce meaningful gains."
    },
    {
      number: 3,
      title: "Improving Search-Driven Conversion",
      description: "As search visibility grows, ensure visitors find clear, relevant information and a direct route to trial:",
      items: ["Refining headings and page structure", "Ensuring pages match search intent", "Creating content aligned with typical tasks"],
      note: "Better-matched traffic increases conversion efficiency."
    },
    {
      number: 4,
      title: "Behaviour-Driven Improvements",
      description: "Heatmaps, scroll depth, and path analysis will be used to identify where users hesitate or leave. Findings inform:",
      items: ["CTA placement", "Copy revisions", "Example positioning", "Layout simplification"],
      note: "The aim is to make the journey feel effortless."
    },
    {
      number: 5,
      title: "Content Supporting Conversion",
      description: "Short demos, simple examples, and case summaries help prospects understand what Hobson does in practice. Content is used to close the gap between interest and action by showing:",
      items: ["How the product behaves", "What users can achieve in a first session", "Real cases that reflect day-to-day tasks"]
    }
  ],
  keyMetrics: [
    "Homepage click-through rate",
    "Free-package sign-ups",
    "Dwell time on core product pages",
    "Bounce rate",
    "Retargeting conversions",
    "Demo requests",
    "Conversion from high-intent organic traffic"
  ],
  metricsNote: "These measures show where to refine the journey.",
  smartObjectives: [
    { target: "20-30%", desc: "Increase CTA click-through rates by Q2 2026" },
    { target: "10%", desc: "Conversion from high-intent visitors into free package by Q4 2026" },
    { target: "5", desc: "New pilot participants by Q1 2026" },
    { target: "2+ min", desc: "Product-page dwell time by Q2 2026" },
    { target: "<40%", desc: "Reduce bounce rates by Q3 2026" },
    { target: "10%", desc: "Convert retargeting audiences into enquiries by Q4 2026" },
    { target: "5%", desc: "Demo-request rate by Q4 2026" }
  ],
  summary: "Through clear entry points, behavioural insight, and ongoing optimisation, Hobson builds a conversion engine suited for early-stage pilots today and scalable commercial activity in the coming years."
});

// Acquisition Executive Summary content provider
export const getAcquisitionExecutiveSummaryPdfContent = (): string[] => [
  "Acquisition and Sales Strategy",
  "",
  "Hobson's acquisition and sales strategy is engineered to deliver rapid, defensible revenue growth while building long-term category leadership in AI-driven Real Estate intelligence.",
  "",
  "THE STRATEGY COMBINES:",
  "",
  "1. Low-Friction Entry",
  "   Pilot-led adoption that reduces barriers and builds trust through hands-on experience",
  "",
  "2. High-Retention Expansion",
  "   Operational dependency drives retention as Hobson becomes embedded in daily workflows",
  "",
  "3. Scalable International Growth",
  "   Global expansion path aligned with AI adoption trends and regulatory pressure",
  "",
  "STAGED GROWTH TIMELINE:",
  "",
  "2026 - De-Risk",
  "   De-risk product and messaging through pilots",
  "",
  "2027 - Convert",
  "   Convert early trust into predictable UK ARR",
  "",
  "2028-30 - Expand",
  "   Expand internationally as category leader",
  "",
  "STRATEGIC BENEFITS:",
  "",
  "- Minimised Risk: Commercial risk reduced through staged validation",
  "- Accelerated Revenue: Faster time-to-revenue via pilot conversions",
  "- Structural Defensibility: Embedded in daily operational workflows",
  "",
  "KEY INSIGHT:",
  "Rather than aggressive short-term selling, Hobson compounds trust and dependency - critical in a risk-sensitive industry where switching costs rise rapidly once systems become operational infrastructure.",
  "",
  "TARGETING AND SEGMENTATION STRATEGY:",
  "Hobson's targeting and segmentation strategy is designed to guide the organisation from early MVP validation in the UK to scalable commercial expansion and, ultimately, global market entry. The strategy is grounded in real discovery work, behavioural insight, industry adoption patterns, and the brand's Sage archetype - positioning Hobson as a calm, intelligent guide in a complex, high-pressure industry.",
  "",
  "HIGH-LEVEL PROPOSITION AND MARKETING MIX:",
  "",
  "- Brand Identity: Calm Sage Archetype - Intelligent guide in complex industry",
  "- Product Design: Lightweight and Simple - Minimal friction, maximum clarity",
  "- Pricing: Accessible Entry - Low barriers, expansion-based growth",
  "- Promotion: Education and Credibility - Thought leadership and trust-building",
  "",
  "POSITIONING STATEMENT:",
  "The Clarity Engine for Real Estate - Hobson establishes itself as the clarity engine for Real Estate - simple, intelligent, and trustworthy. These elements create a coherent pathway from early UK validation to global expansion by 2028-2030."
];

// Acquisition Executive Summary structured data provider
export const getAcquisitionExecutiveSummaryStructuredData = () => ({
  title: "Acquisition and Sales Strategy",
  subtitle: "Rapid, defensible revenue growth with long-term category leadership",
  strategyCombines: [
    {
      title: "Low-Friction Entry",
      description: "Pilot-led adoption that reduces barriers and builds trust through hands-on experience"
    },
    {
      title: "High-Retention Expansion",
      description: "Operational dependency drives retention as Hobson becomes embedded in daily workflows"
    },
    {
      title: "Scalable International Growth",
      description: "Global expansion path aligned with AI adoption trends and regulatory pressure"
    }
  ],
  growthTimeline: [
    {
      year: "2026",
      phase: "De-Risk",
      description: "De-risk product and messaging through pilots"
    },
    {
      year: "2027",
      phase: "Convert",
      description: "Convert early trust into predictable UK ARR"
    },
    {
      year: "2028-30",
      phase: "Expand",
      description: "Expand internationally as category leader"
    }
  ],
  strategicBenefits: [
    {
      title: "Minimised Risk",
      description: "Commercial risk reduced through staged validation"
    },
    {
      title: "Accelerated Revenue",
      description: "Faster time-to-revenue via pilot conversions"
    },
    {
      title: "Structural Defensibility",
      description: "Embedded in daily operational workflows"
    }
  ],
  keyInsight: "Rather than aggressive short-term selling, Hobson compounds trust and dependency - critical in a risk-sensitive industry where switching costs rise rapidly once systems become operational infrastructure.",
  targetingStrategy: "Hobson's targeting and segmentation strategy is designed to guide the organisation from early MVP validation in the UK to scalable commercial expansion and, ultimately, global market entry. The strategy is grounded in real discovery work, behavioural insight, industry adoption patterns, and the brand's Sage archetype - positioning Hobson as a calm, intelligent guide in a complex, high-pressure industry.",
  marketingMix: [
    {
      category: "Brand Identity",
      title: "Calm Sage Archetype",
      description: "Intelligent guide in complex industry"
    },
    {
      category: "Product Design",
      title: "Lightweight and Simple",
      description: "Minimal friction, maximum clarity"
    },
    {
      category: "Pricing",
      title: "Accessible Entry",
      description: "Low barriers, expansion-based growth"
    },
    {
      category: "Promotion",
      title: "Education and Credibility",
      description: "Thought leadership and trust-building"
    }
  ],
  positioningStatement: {
    title: "The Clarity Engine for Real Estate",
    description: "Hobson establishes itself as the clarity engine for Real Estate - simple, intelligent, and trustworthy. These elements create a coherent pathway from early UK validation to global expansion by 2028-2030."
  }
});

// Go-to-Market Strategy content provider
export const getGoToMarketStrategyPdfContent = (): string[] => [
  "Go-to-Market Strategy",
  "",
  "Multi-channel approach targeting UK property professionals",
  "",
  "SALES CHANNELS:",
  "",
  "1. Direct Sales",
  "   Targeted outreach to property management companies and landlords",
  "",
  "2. Strategic Partnerships",
  "   Integrations with property management platforms and estate agents",
  "",
  "3. Digital Marketing",
  "   SEO, content marketing, and targeted campaigns for real estate professionals",
  "",
  "4. Industry Events",
  "   PropTech conferences, trade shows, and networking events",
  "",
  "SALES PROCESS:",
  "",
  "Step 1: Discovery",
  "   Identify pain points and document challenges",
  "",
  "Step 2: Demo",
  "   Personalised demonstration with client documents",
  "",
  "Step 3: Trial",
  "   Free pilot period to prove value",
  "",
  "Step 4: Onboard",
  "   Seamless setup and training",
  "",
  "TARGET METRICS:",
  "",
  "- Target CAC: GBP 500 (Customer acquisition cost)",
  "- LTV:CAC Ratio: 10:1 (Target lifetime value ratio)",
  "- Sales Cycle: 30 days (Average time to close)",
  "",
  "CONCLUSION:",
  "Our strategy combines low-touch self-service for smaller operators with high-touch enterprise sales for larger portfolios. This dual approach maximises market coverage while optimising customer acquisition costs."
];

// Go-to-Market Strategy structured data provider
export const getGoToMarketStrategyStructuredData = () => ({
  title: "Go-to-Market Strategy",
  subtitle: "Multi-channel approach targeting UK property professionals",
  salesChannels: [
    {
      title: "Direct Sales",
      description: "Targeted outreach to property management companies and landlords",
      colorTheme: "blue"
    },
    {
      title: "Strategic Partnerships",
      description: "Integrations with property management platforms and estate agents",
      colorTheme: "purple"
    },
    {
      title: "Digital Marketing",
      description: "SEO, content marketing, and targeted campaigns for real estate professionals",
      colorTheme: "emerald"
    },
    {
      title: "Industry Events",
      description: "PropTech conferences, trade shows, and networking events",
      colorTheme: "amber"
    }
  ],
  salesProcess: [
    {
      step: "Discovery",
      description: "Identify pain points and document challenges"
    },
    {
      step: "Demo",
      description: "Personalised demonstration with client documents"
    },
    {
      step: "Trial",
      description: "Free pilot period to prove value"
    },
    {
      step: "Onboard",
      description: "Seamless setup and training"
    }
  ],
  targetMetrics: [
    {
      label: "Target CAC",
      value: "GBP 500",
      subtitle: "Customer acquisition cost"
    },
    {
      label: "LTV:CAC Ratio",
      value: "10:1",
      subtitle: "Target lifetime value ratio"
    },
    {
      label: "Sales Cycle",
      value: "30 days",
      subtitle: "Average time to close"
    }
  ],
  conclusion: {
    highlight1: "low-touch self-service",
    highlight2: "high-touch enterprise sales",
    summary: "This dual approach maximises market coverage while optimising customer acquisition costs."
  }
});

// Customer Segmentation Visual content provider
export const getCustomerSegmentationVisualPdfContent = (): string[] => [
  "Customer Segmentation",
  "",
  "ONS size-band data shows the Real Estate sector skews heavily toward small- and mid-sized operators, but value is concentrated higher up. While smaller firms are numerous, document complexity, regulatory exposure, and spend focus grow rapidly as portfolios scale, creating a strong wedge for platforms that embed early and expand upward.",
  "",
  "SEGMENT 1: LARGE OPERATORS (50-250 employees)",
  "Market Share: ~5-10%",
  "",
  "Pressure:",
  "Rising compliance and audit requirements, high document volumes driving staffing growth, and increasing exposure from missed obligations",
  "",
  "What Forces Adoption:",
  "- Need to control cost without adding headcount",
  "- Requirement for traceable, defensible answers",
  "- Pressure from LPs, lenders, and regulators",
  "",
  "SEGMENT 2: MEDIUM OPERATORS (10-49 employees)",
  "Market Share: ~20-25%",
  "",
  "Pressure:",
  "Scaling portfolios without proportional hiring, fragmented information across inboxes and shared drives, and decision bottlenecks are slowing transactions",
  "",
  "What Forces Adoption:",
  "- Margin compression",
  "- Speed expectations from partners and capital providers",
  "- Inability to scale manual processes",
  "",
  "SEGMENT 3: SMALL OPERATORS (1-9 employees)",
  "Market Share: ~65-70%",
  "",
  "Pressure:",
  "Severe time scarcity, no tolerance for complex tools, increasing regulatory and reporting burden",
  "",
  "What Forces Adoption:",
  "- Survival and competitiveness",
  "- Need for instant answers without overhead",
  "",
  "KEY INSIGHT:",
  "One platform. One intelligence layer. Forced adoption across segments."
];

// Customer Segmentation Visual structured data provider
export const getCustomerSegmentationVisualStructuredData = () => ({
  title: "Customer Segmentation",
  overview: "ONS size-band data shows the Real Estate sector skews heavily toward small- and mid-sized operators, but value is concentrated higher up. While smaller firms are numerous, document complexity, regulatory exposure, and spend focus grow rapidly as portfolios scale, creating a strong wedge for platforms that embed early and expand upward.",
  segments: [
    {
      title: "Large Operators",
      employees: "50-250 employees",
      percentage: "~5-10%",
      description: "larger and institutional operators (50+ employees)",
      colorTheme: "blue",
      pressure: "Rising compliance and audit requirements, high document volumes driving staffing growth, and increasing exposure from missed obligations",
      adoptionDrivers: [
        "Need to control cost without adding headcount",
        "Requirement for traceable, defensible answers",
        "Pressure from LPs, lenders, and regulators"
      ]
    },
    {
      title: "Medium Operators",
      employees: "10-49 employees",
      percentage: "~20-25%",
      description: "small-mid firms (10-49 employees)",
      colorTheme: "purple",
      pressure: "Scaling portfolios without proportional hiring, fragmented information across inboxes and shared drives, and decision bottlenecks are slowing transactions",
      adoptionDrivers: [
        "Margin compression",
        "Speed expectations from partners and capital providers",
        "Inability to scale manual processes"
      ]
    },
    {
      title: "Small Operators",
      employees: "1-9 employees",
      percentage: "~65-70%",
      description: "micro firms (1-9 employees)",
      colorTheme: "emerald",
      pressure: "Severe time scarcity, no tolerance for complex tools, increasing regulatory and reporting burden",
      adoptionDrivers: [
        "Survival and competitiveness",
        "Need for instant answers without overhead"
      ]
    }
  ],
  keyInsight: "One platform. One intelligence layer. Forced adoption across segments."
});

// Map of component types to their content providers
export const pdfContentMap: Record<string, () => string[]> = {
  executiveSummary: getExecutiveSummaryPdfContent,
  approach: getApproachPdfContent,
  customerSegmentation: getCustomerSegmentationPdfContent,
  globalMarketAssumptions: getGlobalMarketAssumptionsPdfContent,
  pilotClients: getPilotClientsPdfContent,
  hobsonOpportunity: getHobsonOpportunityPdfContent,
  techStack: getTechStackPdfContent,
  ukMarketAssumptions: getUKMarketAssumptionsPdfContent,
  targetMarket: getTargetMarketPdfContent,
  sam: getSAMPdfContent,
  ukMarket: getUKMarketPdfContent,
  europeanGlobal: getEuropeanGlobalPdfContent,
  earlyRoadmap: getEarlyRoadmapPdfContent,
  ganttChart: getGanttChartPdfContent,
  onboardingCosts: getOnboardingCostsPdfContent,
  heuPricing: getHEUPricingPdfContent,
  landscape: getLandscapePdfContent,
  marketShareJustification: getMarketShareJustificationPdfContent,
  costAssumptions: getCostAssumptionsPdfContent,
  plAssumptions: getPLAssumptionsPdfContent,
  // New providers added
  competitorAnalysis: getCompetitorAnalysisPdfContent,
  simpleUI: getSimpleUIPdfContent,
  capitalRaiseStrategy: getCapitalRaiseStrategyPdfContent,
  revenueGrowth: getRevenueGrowthPdfContent,
  plGrowth: getPLGrowthPdfContent,
  revenueModel: getRevenueModelPdfContent,
  globalJustification: getGlobalJustificationPdfContent,
  cacAssumptions: getCACAssumptionsPdfContent,
  burnRateAssumptions: getBurnRateAssumptionsPdfContent,
  ukAssumptionsFinancials: getUKAssumptionsFinancialsPdfContent,
  whyNow: getWhyNowPdfContent,
  teamCredibility: getTeamCredibilityPdfContent,
  raise: getRaisePdfContent,
  marketingSalesStrategy: getMarketingSalesStrategyPdfContent,
  executiveContext: getExecutiveContextPdfContent,
  situationAnalysis: getSituationAnalysisPdfContent,
  customerPersonas: getCustomerPersonasPdfContent,
  customerUserJourneys: getCustomerUserJourneysPdfContent,
  marketDescription: getMarketDescriptionPdfContent,
  competitorBenchmarks: getCompetitorBenchmarksPdfContent,
  customerOnlineBehaviour: getCustomerOnlineBehaviourPdfContent,
  brandIntegrity: getBrandIntegrityPdfContent,
  businessObjectives: getBusinessObjectivesPdfContent,
  pestleAnalysis: getPESTLEAnalysisPdfContent,
  internalCapabilityAssessment: getInternalCapabilityAssessmentPdfContent,
  swotAnalysis: getSWOTAnalysisPdfContent,
  marketingObjectives: getMarketingObjectivesPdfContent,
  brandStrategy: getBrandStrategyPdfContent,
  contentEngagementStrategy: getContentEngagementStrategyPdfContent,
  primaryConversionChannels: getPrimaryConversionChannelsPdfContent,
  // Acquisition & Sales Strategy providers
  acquisitionExecutiveSummary: getAcquisitionExecutiveSummaryPdfContent,
  goToMarketStrategy: getGoToMarketStrategyPdfContent,
  customerSegmentationVisual: getCustomerSegmentationVisualPdfContent,
};

// Get PDF content for any visual component type
export const getPdfContentForComponent = (componentType: string): string[] | null => {
  const provider = pdfContentMap[componentType];
  return provider ? provider() : null;
};

// ============================================================================
// FINANCIAL OVERVIEW & ASSUMPTIONS - STRUCTURED DATA PROVIDERS
// ============================================================================

// Financials Executive Summary content provider
export const getFinancialsExecutiveSummaryPdfContent = (): string[] => [
  "Financials Executive Summary",
  "",
  "Hobson's financial profile reflects the creation of a new infrastructure layer for Real Estate operations.",
  "",
  "This is not a conventional SaaS growth story. It is the monetisation of unavoidable structural change in one of the world's largest, most document-intensive industries, driven by regulatory escalation, labour scarcity, margin compression, and compounding operational complexity.",
  "",
  "The business converts existing, locked-in operating costs into high-margin, recurring revenue, producing a growth model that is both aggressive in trajectory and unusually low in commercial risk.",
  "",
  "With a GBP 1.8M seed round, Hobson funds the full 2026 build year and enters 2027 fully staffed, production-ready, and positioned for rapid commercial expansion. From close to launch, the company becomes cash flow positive quickly, with operating leverage increasing each year as adoption compounds and automation deepens.",
  "",
  "FIVE-YEAR FINANCIAL MODEL DELIVERS:",
  "",
  "- Revenue growth from GBP 708,368 in 2027 to GBP 79.98M by 2031",
  "- ~160% five-year CAGR",
  "- 85-90%+ gross margins with net margins expanding toward 70%+ at scale",
  "- EBITDA breakeven above GBP 5M ARR, reached early in the forecast period",
  "- Infrastructure-grade unit economics with rapid CAC payback",
  "",
  "STRUCTURAL PERFORMANCE:",
  "This performance is driven by structural market forces, not discretionary software demand. Hobson's usage-based model scales automatically with customer complexity, regulatory burden, and portfolio growth, creating built-in net revenue expansion and durable long-term defensibility."
];

// Financials Executive Summary structured data provider
export const getFinancialsExecutiveSummaryStructuredData = () => ({
  title: "Financials Executive Summary",
  introduction: "Hobson's financial profile reflects the creation of a new infrastructure layer for Real Estate operations.",
  context: [
    "This is not a conventional SaaS growth story. It is the monetisation of unavoidable structural change in one of the world's largest, most document-intensive industries, driven by regulatory escalation, labour scarcity, margin compression, and compounding operational complexity.",
    "The business converts existing, locked-in operating costs into high-margin, recurring revenue, producing a growth model that is both aggressive in trajectory and unusually low in commercial risk.",
    "With a GBP 1.8M seed round, Hobson funds the full 2026 build year and enters 2027 fully staffed, production-ready, and positioned for rapid commercial expansion. From close to launch, the company becomes cash flow positive quickly, with operating leverage increasing each year as adoption compounds and automation deepens."
  ],
  fiveYearMetrics: [
    { label: "Revenue growth from GBP 708,368 in 2027 to GBP 79.98M by 2031", icon: "TrendingUp" },
    { label: "~160% five-year CAGR", icon: "BarChart3" },
    { label: "85-90%+ gross margins with net margins expanding toward 70%+ at scale", icon: "Target" },
    { label: "EBITDA breakeven above GBP 5M ARR, reached early in the forecast period", icon: "DollarSign" },
    { label: "Infrastructure-grade unit economics with rapid CAC payback", icon: "Zap" }
  ],
  structuralPerformance: "This performance is driven by structural market forces, not discretionary software demand. Hobson's usage-based model scales automatically with customer complexity, regulatory burden, and portfolio growth, creating built-in net revenue expansion and durable long-term defensibility."
});

// P&L Assumptions Detailed content provider
export const getPLAssumptionsDetailedPdfContent = (): string[] => [
  "P and L Model Assumptions",
  "",
  "REVENUE MODEL ASSUMPTIONS:",
  "",
  "Pricing (ARR basis):",
  "- Blended ARPU = GBP 41.31/month -> GBP 495.72/year",
  "- Pricing includes Essential, Essential Plus, Enterprise mix",
  "- No implementation fees (frictionless onboarding)",
  "",
  "Customer Growth and Penetration (Aligned to GTM Timeline):",
  "- UK: 0.5% -> 5.5% penetration (2027-2031)",
  "- Global (OECD markets): 0.25% -> 3.0% penetration (2028-2031)",
  "- Revenue expands via subscription use + optional HEU top-ups",
  "",
  "Market Size Basis:",
  "- UK real estate businesses: 235,200",
  "- Global comparable markets: 4.23M (18x UK, OECD-adjusted)",
  "",
  "COST OF GOODS SOLD (COGS) ASSUMPTIONS:",
  "",
  "AI Processing and Onboarding Costs (Based on OpenAI 5.1 Mini):",
  "- 1 Complex document: $0.40",
  "- 3 Medium documents: $0.30",
  "- 2 Simple documents: $0.04-$0.06",
  "- Total AI Onboarding Cost/Unit: $0.74-$0.76 (GBP 0.60)",
  "",
  "Client Onboarding COGS:",
  "- Small (5 units): GBP 3-4",
  "- Medium (100 units): GBP 60-70",
  "- Large (1,000 units): GBP 600-700",
  "",
  "Implication: AI onboarding cost per customer is trivial -> Gross margin ~95-97%",
  "",
  "INFRASTRUCTURE COST ASSUMPTIONS:",
  "",
  "Core Architecture Components:",
  "- LLM inference (OpenAI)",
  "- Vector DB",
  "- Knowledge Graph engine",
  "- MongoDB",
  "- Storage (S3-equivalent)",
  "- Monitoring and quality checks",
  "",
  "Infrastructure Assumptions:",
  "- Cost = 8-12% of revenue (scales with usage)",
  "- Efficiency improves over time via document deduplication, shared embeddings, caching",
  "",
  "OPERATING EXPENSE (OpEx) ASSUMPTIONS:",
  "",
  "Internal Team (Lean, Senior Core):",
  "- CEO: Fixed salary - Strategic + investor relations",
  "- Head of Product: Fixed salary - Owns roadmap, QA, user research",
  "- Head of Marketing: Fixed salary - Controls outsourced execution",
  "- Head of Sales: Fixed + light commissions - Enterprise / channel development",
  "- Head of Customer Support: Fixed salary - Manages first-line team",
  "- Internal Support Agents: Salaries - Scale with customers",
  "",
  "Total Internal Team Cost: 30-35% of revenue in early years, falling to ~20% by 2031",
  "",
  "Outsourced Functions:",
  "- Digital marketing execution: Retainer + performance budget",
  "- External engineering: Project-based (new features, scaling)",
  "- Corporate services: Legal, compliance, accounting",
  "- Assumption: 10-15% of revenue",
  "",
  "SALES AND MARKETING SPEND:",
  "- Low due to organic channels (LinkedIn, SEO, quiz funnel)",
  "- Paid acquisition is selective and ROI-focused",
  "- Channels scale gradually after 2027 launch",
  "- Assumption: 15-20% of revenue depending on growth phase",
  "",
  "PROFITABILITY TRAJECTORY:",
  "- Gross margin: 95-97% (AI + infrastructure)",
  "- EBITDA breakeven expected once ARR > GBP 5M",
  "- Profits expand as infrastructure % falls, global market grows, onboarding becomes self-serve",
  "",
  "SUMMARY:",
  "Hobson's P/L assumptions demonstrate a high-margin, scalable, predictable AI SaaS model backed by:",
  "1. Ultra-low onboarding costs (< GBP 1 per unit)",
  "2. Lean team with outsourced flexibility",
  "3. Frictionless, low-price adoption",
  "4. Strong ROI justification (GBP 6,000 saved per employee)",
  "5. Massive document-driven demand across global markets",
  "6. Architecture designed for cost efficiency at scale",
  "",
  "This supports a path to very high margins, attractive capital efficiency, and global scalability."
];

// P&L Assumptions Detailed structured data provider
export const getPLAssumptionsDetailedStructuredData = () => ({
  title: "P and L Model Assumptions",
  revenueModel: {
    pricing: {
      blendedARPU: "GBP 41.31/month -> GBP 495.72/year",
      tiers: "Essential, Essential Plus, Enterprise mix",
      implementationFees: "No implementation fees (frictionless onboarding)"
    },
    customerGrowth: {
      ukPenetration: "1.0% -> 2.0% (2027-2031)",
      globalPenetration: "0.25% -> 0.6% (2028-2031)",
      revenueExpansion: "Subscription use + optional HEU top-ups"
    },
    marketSize: {
      uk: "235,200 businesses",
      global: "4.23M (18x UK, OECD-adjusted)"
    }
  },
  cogs: {
    aiProcessingCosts: [
      { type: "Complex", cost: "$0.40" },
      { type: "Medium (3x)", cost: "$0.30" },
      { type: "Simple (2x)", cost: "$0.04-$0.06" }
    ],
    totalPerUnit: "$0.74-$0.76 (GBP 0.60)",
    clientOnboarding: [
      { size: "Small", units: 5, cost: "GBP 3-4" },
      { size: "Medium", units: 100, cost: "GBP 60-70" },
      { size: "Large", units: 1000, cost: "GBP 600-700" }
    ],
    grossMargin: "~95-97%"
  },
  infrastructure: {
    components: [
      "LLM inference (OpenAI)",
      "Vector DB",
      "Knowledge Graph engine",
      "MongoDB",
      "Storage (S3-equivalent)",
      "Monitoring and quality checks"
    ],
    costAsPercentOfRevenue: "8-12%"
  },
  opex: {
    internalTeam: [
      { role: "CEO", cost: "Fixed salary", notes: "Strategic + investor relations" },
      { role: "Head of Product", cost: "Fixed salary", notes: "Owns roadmap, QA, user research" },
      { role: "Head of Marketing", cost: "Fixed salary", notes: "Controls outsourced execution" },
      { role: "Head of Sales", cost: "Fixed + light commissions", notes: "Enterprise / channel development" },
      { role: "Head of Customer Support", cost: "Fixed salary", notes: "Manages first-line team" },
      { role: "Internal Support Agents", cost: "Salaries", notes: "Scale with customers" }
    ],
    teamCostPercentage: "30-35% early years, falling to ~20% by 2031",
    outsourcedFunctions: [
      { function: "Digital marketing execution", cost: "Retainer + performance budget" },
      { function: "External engineering", cost: "Project-based" },
      { function: "Corporate services", cost: "Legal, compliance, accounting" }
    ],
    outsourcedPercentage: "10-15% of revenue"
  },
  salesMarketing: {
    channels: "LinkedIn, SEO, quiz funnel",
    paidAcquisition: "Selective and ROI-focused",
    assumption: "15-20% of revenue depending on growth phase"
  },
  profitability: {
    grossMargin: "95-97%",
    ebitdaBreakeven: "ARR > GBP 5M",
    drivers: "Infrastructure % falls, global market grows, onboarding becomes self-serve"
  },
  summary: [
    "Ultra-low onboarding costs (< GBP 1 per unit)",
    "Lean team with outsourced flexibility",
    "Frictionless, low-price adoption",
    "Strong ROI justification (GBP 6,000 saved per employee)",
    "Massive document-driven demand across global markets",
    "Architecture designed for cost efficiency at scale"
  ]
});

// Cost Assumptions Detailed content provider
export const getCostAssumptionsDetailedPdfContent = (): string[] => [
  "Cost Structure Assumptions",
  "",
  "COST STRUCTURE OVERVIEW:",
  "Hobson operates with an ultra-lean cost base due to its architecture:",
  "- No office costs",
  "- No integration or field-support costs",
  "- Minimal onboarding costs (AI-token based)",
  "- Core team = 5 roles",
  "- Engineering and marketing execution outsourced",
  "",
  "CORE TEAM COST (Fixed Cost Layer):",
  "Internal headcount (UK-based realistic salaries):",
  "- CEO: GBP 120,000",
  "- Head of Marketing: GBP 70,000",
  "- Product Owner: GBP 85,000",
  "- Head of Customer Support: GBP 55,000",
  "- Head of Sales: GBP 85,000",
  "- Total Fixed Payroll: GBP 415,000/year",
  "",
  "Only these roles are internal. Engineering, design, and marketing execution are outsourced - converting heavy fixed cost into scalable variable cost.",
  "",
  "OUTSOURCED COSTS (% of Revenue Layer):",
  "- Engineering (outsourced): 12% - Model tuning, RAG improvements, K-Graph pipelines, UI updates",
  "- Digital Marketing (outsourced): 8% - Paid campaigns, SEO, content ops",
  "- Customer Success: 5% - Training, support tickets, role-based guidance flows",
  "- Sales/SDR Support: 4% - Commission + outsourced pipeline research",
  "- General and Admin: 3% - Legal, accounting, compliance, insurance",
  "- Total Variable Cost Load: 32%",
  "",
  "AI AND INFRASTRUCTURE COSTS (Direct COGS Layer):",
  "Based on actual architectural workflow (LLM ingestion -> MongoDB -> Vector DB -> K-Graph -> query engine -> RAG fallback).",
  "",
  "AI Onboarding Cost Per Client (One-Off):",
  "- Small (5 units): $3.70-$3.80",
  "- Medium (100 units): $74-$76",
  "- Large (1,000 units): $740-$760",
  "- Converted to pounds: GBP 0.59-0.61 per unit",
  "",
  "Core insight: Onboarding cost rounds to ~GBP 1 per small client, ~GBP 60 per medium, ~GBP 600 per large. This gives Hobson extremely high gross margins.",
  "",
  "Infrastructure Costs (% of revenue):",
  "- Document Storage + Vector DB: 4%",
  "- LLM Query API (OpenAI Mini): 5%",
  "- Knowledge Graph Compute + Retrieval: 2%",
  "- Monitoring + Logging (Datadog etc.): 1%",
  "- Total Infra Cost: 12%",
  "",
  "FULL COST STRUCTURE SUMMARY:",
  "- Fixed Headcount: GBP 415,000/year",
  "- Variable Ops (outsourced): 32% of revenue",
  "- AI + Infra COGS: 12% of revenue",
  "- Onboarding AI Cost: GBP 1-600 per client (tiny)",
  "",
  "OVERALL GROSS MARGIN EXPECTATION:",
  "Because onboarding is negligible, and infra is 12%:",
  "- Expected Gross Margin: 88%",
  "- Net Margin at Scale: 40-55%",
  "",
  "This is excellent for a SaaS model and very investor friendly."
];

// Cost Assumptions Detailed structured data provider
export const getCostAssumptionsDetailedStructuredData = () => ({
  title: "Cost Structure Assumptions",
  overview: {
    description: "Hobson operates with an ultra-lean cost base due to its architecture",
    benefits: [
      "No office costs",
      "No integration or field-support costs",
      "Minimal onboarding costs (AI-token based)",
      "Core team = 5 roles",
      "Engineering and marketing execution outsourced"
    ]
  },
  coreTeam: {
    roles: [
      { role: "CEO", annualCost: "GBP 120,000" },
      { role: "Head of Marketing", annualCost: "GBP 70,000" },
      { role: "Product Owner", annualCost: "GBP 85,000" },
      { role: "Head of Customer Support", annualCost: "GBP 55,000" },
      { role: "Head of Sales", annualCost: "GBP 85,000" }
    ],
    totalFixedPayroll: "GBP 415,000/year",
    note: "Only these roles are internal. Engineering, design, and marketing execution are outsourced - converting heavy fixed cost into scalable variable cost."
  },
  outsourcedCosts: [
    { area: "Engineering (outsourced)", percentage: "12%", description: "Model tuning, RAG improvements, K-Graph pipelines, UI updates" },
    { area: "Digital Marketing (outsourced)", percentage: "8%", description: "Paid campaigns, SEO, content ops" },
    { area: "Customer Success", percentage: "5%", description: "Training, support tickets, role-based guidance flows" },
    { area: "Sales/SDR Support", percentage: "4%", description: "Commission + outsourced pipeline research" },
    { area: "General and Admin", percentage: "3%", description: "Legal, accounting, compliance, insurance" }
  ],
  totalVariableCostLoad: "32%",
  aiInfrastructure: {
    onboardingCosts: [
      { clientType: "Small", units: 5, cost: "$3.70-$3.80" },
      { clientType: "Medium", units: 100, cost: "$74-$76" },
      { clientType: "Large", units: 1000, cost: "$740-$760" }
    ],
    perUnitCostGBP: "GBP 0.59-0.61",
    infrastructureCosts: [
      { type: "Document Storage + Vector DB", percentage: "4%" },
      { type: "LLM Query API (OpenAI Mini)", percentage: "5%" },
      { type: "Knowledge Graph Compute + Retrieval", percentage: "2%" },
      { type: "Monitoring + Logging (Datadog etc.)", percentage: "1%" }
    ],
    totalInfraCost: "12%"
  },
  summary: {
    fixedHeadcount: "GBP 415,000/year",
    variableOps: "32% of revenue",
    aiInfraCOGS: "12% of revenue",
    onboardingCost: "GBP 1-600 per client"
  },
  margins: {
    expectedGrossMargin: "88%",
    netMarginAtScale: "40-55%"
  }
});

// Onboarding Costs Detailed content provider
export const getOnboardingCostsDetailedPdfContent = (): string[] => [
  "AI Onboarding Cost Per Client",
  "OpenAI 5.1 Mini - Internal Cost Model",
  "",
  "1. DOCUMENT PROCESSING COST BENCHMARKS:",
  "- Complex (Lease): $0.40, ~600k tokens, 8-9 minutes",
  "- Medium (Deed): $0.10, ~300k tokens, 2-3 minutes",
  "- Simple (Notice): $0.02-$0.03, ~50k tokens, 30-60 seconds",
  "",
  "2. COST PER UNIT (Space/Asset):",
  "Each unit typically contains 5 onboarding documents:",
  "- 1 Complex",
  "- 3 Medium",
  "- 2 Simple",
  "",
  "Unit-Level AI Cost:",
  "- Complex (1x): $0.40",
  "- Medium (3x): $0.30",
  "- Simple (2x): $0.04-$0.06",
  "- Total Onboarding Cost per Unit: $0.74-$0.76",
  "",
  "3. CLIENT ONBOARDING COST SCENARIOS:",
  "- Small (5 units): $3.70-$3.80",
  "- Medium (100 units): $74-$76",
  "- Large (1,000 units): $740-$760",
  "",
  "4. STRATEGIC IMPLICATION:",
  "Hobson Onboarding = Ultra-Low Cost, High Margin",
  "",
  "- AI ingestion is the only meaningful onboarding cost",
  "- Cost remains well under $1 per unit, even for complex portfolios",
  "- Enables exceptionally high gross margins at scale",
  "- Supports frictionless self-serve onboarding from 2027 onwards",
  "",
  "-> Hobson can acquire and activate clients at extremely low operational cost",
  "-> Margins expand further as volume increases"
];

// Onboarding Costs Detailed structured data provider
export const getOnboardingCostsDetailedStructuredData = () => ({
  title: "AI Onboarding Cost Per Client",
  subtitle: "OpenAI 5.1 Mini - Internal Cost Model",
  documentProcessingBenchmarks: [
    { type: "Complex (Lease)", cost: "$0.40", tokens: "~600k", time: "8-9 minutes" },
    { type: "Medium (Deed)", cost: "$0.10", tokens: "~300k", time: "2-3 minutes" },
    { type: "Simple (Notice)", cost: "$0.02-$0.03", tokens: "~50k", time: "30-60 seconds" }
  ],
  unitComposition: {
    description: "Each unit typically contains 5 onboarding documents",
    breakdown: ["1 Complex", "3 Medium", "2 Simple"]
  },
  unitLevelCost: {
    complex: "$0.40",
    medium: "$0.30",
    simple: "$0.04-$0.06",
    total: "$0.74-$0.76 per unit"
  },
  clientScenarios: [
    { type: "Small", units: 5, cost: "$3.70-$3.80" },
    { type: "Medium", units: 100, cost: "$74-$76" },
    { type: "Large", units: 1000, cost: "$740-$760" }
  ],
  strategicImplication: {
    title: "Hobson Onboarding = Ultra-Low Cost, High Margin",
    points: [
      "AI ingestion is the only meaningful onboarding cost",
      "Cost remains well under $1 per unit, even for complex portfolios",
      "Enables exceptionally high gross margins at scale",
      "Supports frictionless self-serve onboarding from 2027 onwards"
    ],
    conclusions: [
      "Hobson can acquire and activate clients at extremely low operational cost",
      "Margins expand further as volume increases"
    ]
  }
});

// UK Assumptions Financials Detailed content provider
export const getUKAssumptionsFinancialsDetailedPdfContent = (): string[] => [
  "UK Assumptions - Financial Modelling Foundation",
  "",
  "1. SIZE OF THE UK REAL ESTATE BUSINESS MARKET:",
  "- Total UK businesses: 5.6 million",
  "- Real estate businesses (4.2%): 235,200",
  "- Source: ONS - Real estate activities by employment size",
  "",
  "2. BUSINESS SIZE BREAKDOWN (Real Estate Only):",
  "- Small (1-9 employees): 96% = 225,792 businesses",
  "- Medium (10-49): 2.7% = 6,350 businesses",
  "- Large (50-249): 0.6% = 1,411 businesses",
  "- Enterprise (250+): 0.1% = 235 businesses",
  "- Source: BEIS / ONS",
  "",
  "SUMMARY:",
  "These assumptions establish the UK market baseline for Hobson's financial modelling:",
  "1. A large real estate market of 235,200 businesses",
  "2. Clear segmentation by business size, with 96% being small operators"
];

// UK Assumptions Financials Detailed structured data provider
export const getUKAssumptionsFinancialsDetailedStructuredData = () => ({
  title: "UK Assumptions",
  subtitle: "Financial modelling foundation for UK market",
  marketSize: {
    totalUKBusinesses: "5.6 million",
    realEstatePercentage: "4.2%",
    realEstateBusinesses: "235,200",
    source: "ONS - Real estate activities by employment size"
  },
  businessSizeBreakdown: [
    { size: "Small (1-9 employees)", percentage: "96%", count: "225,792" },
    { size: "Medium (10-49)", percentage: "2.7%", count: "6,350" },
    { size: "Large (50-249)", percentage: "0.6%", count: "1,411" },
    { size: "Enterprise (250+)", percentage: "0.1%", count: "235" }
  ],
  source: "Department for Business, Energy and Industrial Strategy (BEIS) / Office for National Statistics (ONS)",
  summary: [
    "A large real estate market of 235,200 businesses",
    "Clear segmentation by business size, with 96% being small operators"
  ]
});

// CAC Assumptions Detailed content provider
export const getCACAssumptionsDetailedPdfContent = (): string[] => [
  "Customer Acquisition Cost (CAC) Assumptions",
  "",
  "CORE INPUTS - Revenue (ARR):",
  "- 2027: GBP 708,368",
  "- 2028: GBP 7.79M",
  "- 2029: GBP 21.59M",
  "- 2030: GBP 41.76M",
  "- 2031: GBP 79.98M",
  "",
  "UK MARKET PENETRATION:",
  "- 2027: 0.5%",
  "- 2028: 1.5%",
  "- 2029: 3.0%",
  "- 2030: 4.5%",
  "- 2031: 5.5%",
  "",
  "GLOBAL MARKET PENETRATION:",
  "- 2028: 0.25%",
  "- 2029: 1.0%",
  "- 2030: 2.0%",
  "- 2031: 3.0%",
  "",
  "ACQUISITION SPEND (% of Revenue):",
  "- Digital Marketing: 8%",
  "- Sales/SDR: 4%",
  "- Total CAC Spend: 12% of Annual Revenue",
  "",
  "CAC TABLE (2027-2031):",
  "Formula: CAC = (Revenue x 12%) / New Customers",
  "",
  "- 2027: GBP 708k revenue, GBP 85k spend -> CAC optimised for UK launch",
  "- 2028: GBP 7.79M revenue, GBP 935k spend -> CAC efficient with global expansion",
  "- 2029: GBP 21.59M revenue, GBP 2.59M spend -> CAC scales with growth",
  "- 2030: GBP 41.76M revenue, GBP 5.01M spend -> Continued efficiency",
  "- 2031: GBP 79.98M revenue, GBP 9.60M spend -> Mature market positioning",
  "",
  "CAC TREND INTERPRETATION:",
  "",
  "Early Years (2027-2028): Low CAC",
  "- UK-only launch with low marketing intensity",
  "- High volume of early global customers when global market opens in 2028",
  "",
  "Middle Years (2029-2030): Modest Rise",
  "- CAC rises modestly as marketing becomes more competitive globally",
  "",
  "2031 Spike: Normal for Maturing SaaS",
  "- Penetration slows -> fewer incremental customers",
  "- Same 12% spend spread across fewer new accounts",
  "- This is normal for SaaS models approaching market saturation",
  "",
  "LTV:CAC RATIO:",
  "- ARPU: GBP 495.72/year",
  "- LTV (5-year lifetime): GBP 2,478.60",
  "",
  "- 2027: CAC GBP 60, LTV:CAC 41x",
  "- 2028: CAC GBP 72, LTV:CAC 34x",
  "- 2029: CAC GBP 226, LTV:CAC 11x",
  "- 2030: CAC GBP 217, LTV:CAC 11x",
  "- 2031: CAC GBP 371, LTV:CAC 7x",
  "",
  "VC-attractive threshold is 3x. Your model is far above this at 7x-41x.",
  "",
  "CAC PAYBACK PERIOD:",
  "Formula: Payback = CAC / Monthly ARPU (GBP 41.31)",
  "",
  "- 2027: 1.5 months",
  "- 2028: 1.7 months",
  "- 2029: 5.5 months",
  "- 2030: 5.3 months",
  "- 2031: 9.0 months",
  "",
  "Sub-12-month payback is strong. Most years are under 6 months."
];

// CAC Assumptions Detailed structured data provider
export const getCACAssumptionsDetailedStructuredData = () => ({
  title: "Customer Acquisition Cost (CAC) Assumptions",
  revenueByYear: [
    { year: "2027", value: "GBP 708,368" },
    { year: "2028", value: "GBP 7.79M" },
    { year: "2029", value: "GBP 21.59M" },
    { year: "2030", value: "GBP 41.76M" },
    { year: "2031", value: "GBP 79.98M" }
  ],
  ukPenetration: [
    { year: "2027", share: "0.5%" },
    { year: "2028", share: "1.5%" },
    { year: "2029", share: "3.0%" },
    { year: "2030", share: "4.5%" },
    { year: "2031", share: "5.5%" }
  ],
  globalPenetration: [
    { year: "2028", share: "0.25%" },
    { year: "2029", share: "1.0%" },
    { year: "2030", share: "2.0%" },
    { year: "2031", share: "3.0%" }
  ],
  acquisitionSpend: {
    digitalMarketing: "8%",
    salesSDR: "4%",
    total: "12% of Annual Revenue"
  },
  cacTable: [
    { year: "2027", revenue: "GBP 708k", spend: "GBP 85k", customers: "UK launch", cac: "Optimised" },
    { year: "2028", revenue: "GBP 7.79M", spend: "GBP 935k", customers: "Global expansion", cac: "Efficient" },
    { year: "2029", revenue: "GBP 21.59M", spend: "GBP 2.59M", customers: "Scaling", cac: "Growth phase" },
    { year: "2030", revenue: "GBP 41.76M", spend: "GBP 5.01M", customers: "Maturing", cac: "Continued efficiency" },
    { year: "2031", revenue: "GBP 79.98M", spend: "GBP 9.60M", customers: "At scale", cac: "Mature positioning" }
  ],
  cacTrends: [
    { period: "Early Years (2027-2028)", title: "Low CAC", points: ["UK-only launch with low marketing intensity", "High volume of early global customers when global market opens in 2028"] },
    { period: "Middle Years (2029-2030)", title: "Modest Rise", points: ["CAC rises modestly as marketing becomes more competitive globally"] },
    { period: "2031", title: "Normal for Maturing SaaS", points: ["Penetration growth continues", "Same 12% spend as percentage of revenue", "This is normal for SaaS models at scale"] }
  ],
  ltvCacRatio: {
    arpu: "GBP 495.72/year",
    ltv: "GBP 2,478.60",
    ratios: [
      { year: "2027", cac: "Optimised", ratio: "Strong" },
      { year: "2028", cac: "Efficient", ratio: "Strong" },
      { year: "2029", cac: "Growth phase", ratio: "Healthy" },
      { year: "2030", cac: "Continued efficiency", ratio: "Healthy" },
      { year: "2031", cac: "Mature positioning", ratio: "Sustainable" }
    ],
    vcThreshold: "3x",
    modelRange: "Consistently above threshold"
  },
  cacPayback: [
    { year: "2027", months: "< 6" },
    { year: "2028", months: "< 6" },
    { year: "2029", months: "< 12" },
    { year: "2030", months: "< 12" },
    { year: "2031", months: "< 12" }
  ]
});

// Burn Rate Assumptions Detailed content provider
export const getBurnRateAssumptionsDetailedPdfContent = (): string[] => [
  "Burn Rate Assumptions (2027-2031)",
  "A clear and defensible financial model for monthly burn, profitability timing, and fundraise needs",
  "",
  "RECOMMENDED SEED RAISE: GBP 1.5M - 2.2M",
  "Covers 18-24 months and early commercialisation",
  "",
  "Breakdown:",
  "- Pre-2027 engineering: GBP 500k-700k",
  "- Team hiring and runway: GBP 750k",
  "- Initial marketing: GBP 150k",
  "- Buffer: GBP 300k",
  "",
  "Key: You avoid unnecessary dilution because the operating model is profitable from Year 1.",
  "",
  "Our operating model does not require capital. Our build and go-to-market acceleration do. The model below shows how the business becomes cashflow-positive almost immediately once revenue begins in 2027.",
  "",
  "1. CORE OPERATING MODEL ASSUMPTIONS:",
  "",
  "Fixed Internal Team (Payroll + Employer Costs):",
  "- CEO: GBP 120,000",
  "- Head of Marketing: GBP 80,000",
  "- Product Owner: GBP 90,000",
  "- Head of Customer Support: GBP 70,000",
  "- Head of Sales: GBP 90,000",
  "- Customer Support Officer: GBP 40,000",
  "- Total Fixed Payroll: GBP 490,000/year -> GBP 40,800/month",
  "",
  "Outsourced Fixed Costs:",
  "- Engineering (outsourced): GBP 300,000",
  "- Legal, compliance, finance: GBP 40,000",
  "- Contractors/overflow: GBP 20,000",
  "- Total Outsourced Fixed: GBP 360,000/year -> GBP 30,000/month",
  "",
  "Total Fixed Operating Cost: GBP 850,000/year -> GBP 70,800/month",
  "",
  "2. COGS (INFRASTRUCTURE) ASSUMPTIONS:",
  "- AI inference: 6%",
  "- Vector DB: 1.5%",
  "- Cloud compute: 2%",
  "- Storage: 0.5%",
  "- Total COGS: 10% of revenue",
  "",
  "3. CUSTOMER ACQUISITION SPEND:",
  "- Digital Marketing: 8%",
  "- SDR/Sales comp: 4%",
  "- Total CAC Spend: 12% of revenue",
  "",
  "4. TOTAL VARIABLE COST LOAD:",
  "COGS 10% + CAC 12% = 22%",
  "",
  "5. BURN FORMULA:",
  "Monthly Burn = Fixed Costs + Variable Costs - Monthly Revenue",
  "- Fixed Costs: GBP 70,800/month",
  "- Variable Costs: 22% of revenue",
  "- Monthly Revenue: Annual / 12",
  "",
  "6. BURN RATE BY YEAR (Based on Revenue Model):",
  "",
  "2027 - UK Launch Year:",
  "- Revenue: GBP 708,368",
  "- Variable: GBP 13,000",
  "- Costs: GBP 83,800",
  "- Monthly Position: Near breakeven",
  "",
  "2028 - Global Expansion:",
  "- Revenue: GBP 7.79M",
  "- Variable: GBP 143,000",
  "- Costs: GBP 213,800",
  "- Monthly Surplus: GBP 435,000",
  "",
  "2029 - Scaling:",
  "- Revenue: GBP 21.59M",
  "- Variable: GBP 396,000",
  "- Costs: GBP 466,800",
  "- Monthly Surplus: GBP 1.33M",
  "",
  "2030 - Maturing:",
  "- Revenue: GBP 41.76M",
  "- Variable: GBP 766,000",
  "- Costs: GBP 836,800",
  "- Monthly Surplus: GBP 2.64M",
  "",
  "2031 - At Scale:",
  "- Revenue: GBP 79.98M",
  "- Variable: GBP 1.47M",
  "- Costs: GBP 1.54M",
  "- Monthly Surplus: GBP 5.12M"
];

// Burn Rate Assumptions Detailed structured data provider
export const getBurnRateAssumptionsDetailedStructuredData = () => ({
  title: "Burn Rate Assumptions (2027-2031)",
  subtitle: "A clear and defensible financial model for monthly burn, profitability timing, and fundraise needs",
  seedRaise: {
    recommended: "GBP 1.5M - 2.2M",
    coverage: "18-24 months and early commercialisation",
    breakdown: [
      { item: "Pre-2027 engineering", amount: "GBP 500k-700k" },
      { item: "Team hiring and runway", amount: "GBP 750k" },
      { item: "Initial marketing", amount: "GBP 150k" },
      { item: "Buffer", amount: "GBP 300k" }
    ],
    keyInsight: "You avoid unnecessary dilution because the operating model is profitable from Year 1."
  },
  operatingModel: {
    note: "Our operating model does not require capital. Our build and go-to-market acceleration do. The model below shows how the business becomes cashflow-positive almost immediately once revenue begins in 2027.",
    fixedTeam: [
      { role: "CEO", cost: "GBP 120,000" },
      { role: "Head of Marketing", cost: "GBP 80,000" },
      { role: "Product Owner", cost: "GBP 90,000" },
      { role: "Head of Customer Support", cost: "GBP 70,000" },
      { role: "Head of Sales", cost: "GBP 90,000" },
      { role: "Customer Support Officer", cost: "GBP 40,000" }
    ],
    totalFixedPayroll: { annual: "GBP 490,000", monthly: "GBP 40,800" },
    outsourcedFixed: [
      { function: "Engineering (outsourced)", cost: "GBP 300,000" },
      { function: "Legal, compliance, finance", cost: "GBP 40,000" },
      { function: "Contractors/overflow", cost: "GBP 20,000" }
    ],
    totalOutsourcedFixed: { annual: "GBP 360,000", monthly: "GBP 30,000" },
    totalFixed: { annual: "GBP 850,000", monthly: "GBP 70,800" }
  },
  cogs: {
    aiInference: "6%",
    vectorDB: "1.5%",
    cloudCompute: "2%",
    storage: "0.5%",
    total: "10% of revenue"
  },
  cacSpend: {
    digitalMarketing: "8%",
    sdrSalesComp: "4%",
    total: "12% of revenue"
  },
  totalVariableCostLoad: "22%",
  burnFormula: {
    formula: "Monthly Burn = Fixed Costs + Variable Costs - Monthly Revenue",
    fixedCosts: "GBP 70,800/month",
    variableCosts: "22% of revenue",
    monthlyRevenue: "Annual / 12"
  },
  yearlyBreakdown: [
    { year: "2027", status: "UK Launch Year", revenue: "GBP 708,368", variable: "GBP 13,000", costs: "GBP 83,800", surplus: "Near breakeven" },
    { year: "2028", status: "Global Expansion", revenue: "GBP 7.79M", variable: "GBP 143,000", costs: "GBP 213,800", surplus: "GBP 435,000" },
    { year: "2029", status: "Scaling", revenue: "GBP 21.59M", variable: "GBP 396,000", costs: "GBP 466,800", surplus: "GBP 1.33M" },
    { year: "2030", status: "Maturing", revenue: "GBP 41.76M", variable: "GBP 766,000", costs: "GBP 836,800", surplus: "GBP 2.64M" },
    { year: "2031", status: "At Scale", revenue: "GBP 79.98M", variable: "GBP 1.47M", costs: "GBP 1.54M", surplus: "GBP 5.12M" }
  ]
});

// PESTLE Analysis structured data provider - matches PESTLEAnalysisVisual.tsx
export const getPESTLEAnalysisStructuredData = () => ({
  header: {
    title: "PESTLE Analysis",
    subtitle: "Macro-environmental factors shaping the UK PropTech landscape"
  },
  intro: "Hobson operates in the Real Estate sector, which is highly regulated, document-heavy, and under pressure to digitise. The following PESTLE review shows why a tool that offers clarity, accuracy, and affordable AI alongside existing systems is increasingly necessary.",
  keyDrivers: [
    "Fast, reliable document insight",
    "Transparent, referenced answers",
    "Minimal onboarding and implementation friction",
    "Affordable, measurable efficiency gains",
    "Reduced compliance and documentation risk"
  ],
  keyDriversIntro: "Across all dimensions - political, economic, social, technological, legal, and environmental - the environment is shifting towards tools that provide:",
  keyDriversConclusion: "Hobson's design and positioning are closely aligned with these pressures, making its solution both timely and strategically relevant.",
  factors: [
    {
      letter: "P",
      title: "Political",
      subtitle: "Rising Regulation & Data Governance",
      colorType: "blue",
      intro: "The global Real Estate environment is becoming increasingly tightly regulated, with increasing documentation requirements and scrutiny. Key drivers include:",
      items: [
        "Building Safety Act: more detailed record-keeping and audit-ready evidence",
        "Renters Reform Bill: more documentation around tenancy standards and landlord responsibilities",
        "EPC and sustainability rules: evidence-heavy energy and performance reporting",
        "AML (Anti-Money Laundering): stronger KYC and documentation checks",
        "Local authority processes: structured information for planning, licensing, and building control"
      ],
      additionalNote: "At the same time, data protection rules (GDPR, ICO guidance) demand secure handling, audit trails, and clear retention policies. Hobson's AI Privacy Policy and Data Breach Protocol are designed to support these requirements.",
      implication: "More regulation means more documents, higher compliance risk, and a sharper need for fast, accurate retrieval and auditability."
    },
    {
      letter: "E",
      title: "Economic",
      subtitle: "Cost Pressure, Efficiency & Market Cycles",
      colorType: "emerald",
      intro: "Real Estate organisations face persistent economic challenges:",
      items: [
        "Cost constraints limit headcount growth",
        "Market cycles increase pressure to improve asset performance",
        "Lean teams must handle growing administrative workloads",
        "High labour costs make manual document handling expensive",
        "Large platform upgrades (e.g. MRI/Yardi) are often postponed, favouring lighter tools"
      ],
      additionalNote: "Industry research shows that AI and automation can deliver 10%+ NOI improvement through operational efficiencies and up to 20% cost savings from reduced manual work.",
      implication: "Hobson's low-friction, non-disruptive AI fits organisations looking to cut admin and reduce risk without funding a complete system replacement."
    },
    {
      letter: "S",
      title: "Social",
      subtitle: "AI Comfort, Trust & Work Culture",
      colorType: "purple",
      intro: "Attitudes toward AI are warming, but trust is still fragile:",
      items: [
        "Growing openness to AI for operations, reporting, and document workflows",
        "Very low tolerance for error; small mistakes can destroy confidence",
        "High demand for transparency and explainability, especially in risk-averse contexts",
        "Hybrid working has increased reliance on shared drives, email, and unstructured files",
        "Teams are wary of tools that require significant process change or rip and replace systems"
      ],
      implication: "Hobson's strengths - referenced answers, simple interface, zero onboarding, and coexistence with current tools - map directly onto these trust and adoption requirements."
    },
    {
      letter: "T",
      title: "Technological",
      subtitle: "Fast-Moving AI & PropTech",
      colorType: "amber",
      intro: "The technology landscape is evolving quickly:",
      items: [
        "Advances in LLMs, embeddings, RAG, and knowledge graphs make document understanding far more powerful",
        "Buyers increasingly expect verifiable, not black-box, AI",
        "Legacy PropTech moves slowly, creating a gap for AI-native assistants",
        "Cybersecurity expectations grow as more sensitive contracts and documents are digitised",
        "Demand rises for no integration tools that can be deployed quickly"
      ],
      additionalNote: "Hobson's architecture, combining vector databases, knowledge graphs, and quality checks, is designed to deliver reliable, explainable document intelligence.",
      implication: "Technological trends favour tools like Hobson that provide modern AI capability without heavy integration overhead."
    },
    {
      letter: "L",
      title: "Legal",
      subtitle: "Compliance, Data & Documentation Risk",
      colorType: "rose",
      intro: "Legal frameworks reinforce the need for structured, accurate document handling:",
      items: [
        "GDPR demands explicit data handling, transparency, and security",
        "Audits require clear evidence of where information came from and how it was used",
        "Contractual risk rises when key details are missed or buried in unstructured content",
        "Emerging AI governance emphasises safety, explainability, and reduced hallucination"
      ],
      additionalNote: "Hobson's referenced outputs, combined with privacy and breach policies, help buyers meet these expectations and reduce legal exposure.",
      implication: "Legal pressure favours AI tools that are traceable, auditable, and designed around accuracy."
    },
    {
      letter: "E",
      title: "Environmental",
      subtitle: "ESG Reporting & Paper Reduction",
      colorType: "teal",
      intro: "Environmental factors are secondary drivers, but still important:",
      items: [
        "ESG reporting adds another layer of documentation and evidence",
        "Pressure to reduce physical paperwork encourages digital document workflows",
        "Energy-performance obligations (e.g. EPCs) require structured, retrievable data for reporting"
      ],
      implication: "By making it easier to extract and reuse information from documents, Hobson supports more efficient ESG reporting and digital sustainability."
    }
  ]
});

// Internal Capability Assessment structured data provider - matches InternalCapabilityAssessmentVisual.tsx
export const getInternalCapabilityAssessmentStructuredData = () => ({
  header: {
    title: "Internal Capability Assessment",
    subtitle: "Evaluating organisational strengths and development areas"
  },
  intro: "Hobson combines deep domain knowledge, strong technical design, and a differentiated brand aligned with an honest and urgent market need. Hobson is a young company with deep experience in Real Estate operations, software, and AI. Its mission, Innovation Without Disruption, is reflected in how the product is built, how it behaves, and how the team works with early clients.",
  keyMessage: {
    primary: "Hobson is well-placed to deliver innovation without disruption in a sector that urgently needs clarity and efficiency in document management.",
    secondary: "This assessment covers the main internal strengths and the gaps that must be addressed to scale effectively."
  },
  strengths: [
    {
      title: "Team Skills Across Real Estate, Software, and AI",
      colorType: "blue",
      subsections: [
        {
          subtitle: "Real Estate Expertise",
          intro: "The founding team has over 30 years of experience in asset management, operations, and portfolio governance, giving Hobson a grounded understanding of:",
          items: ["Client workflows", "Compliance and reporting pressures", "Document types and structures", "The practical pain points Hobson is solving"]
        },
        {
          subtitle: "Software & Product Experience",
          intro: "The team has previously built, scaled, and exited a leading UK Real Estate software platform, bringing skills in:",
          items: ["Product design and UX", "MVP development and iteration", "Go-to-market strategy"]
        },
        {
          subtitle: "AI & Technical Skills",
          intro: "Hobson's technical team includes specialists in:",
          items: ["Large Language Models (LLMs)", "RAG (retrieval-augmented generation)", "Knowledge graphs", "Vector databases", "Prompt design and quality control"]
        }
      ],
      note: "These capabilities are essential to building an AI product that is accurate, referenceable, and safe for a risk-aware sector."
    },
    {
      title: "Technical Capabilities",
      colorType: "purple",
      subsections: [
        {
          subtitle: "Document-First Architecture",
          intro: "Hobson is designed to work directly from client documents, using:",
          items: ["Structured data extraction", "A hybrid RAG + knowledge-graph pipeline", "Quality-checking layers", "Transparent, reference-based outputs"]
        },
        {
          subtitle: "Lightweight Deployment",
          intro: "The platform is:",
          items: ["Zero-integration by default", "Quick to start using", "Designed to avoid workflow disruption"]
        }
      ],
      note: "This supports the promise of Disruption Without Displacement - Hobson enhances existing systems rather than replacing them."
    },
    {
      title: "Brand Maturity and Positioning Strength",
      colorType: "emerald",
      intro: "Despite being early-stage, Hobson's brand is already clear and distinctive:",
      items: [
        "The owl signals wisdom, clarity, and trusted guidance",
        "Messaging focuses on clarity, simplicity, affordability, and non-disruption",
        "Early client conversations confirm strong resonance with this narrative"
      ],
      note: "Hobson is deliberately positioned as the calm AI assistant - a partner in clarity, not another complex platform."
    },
    {
      title: "Access to Customers",
      colorType: "amber",
      intro: "Hobson benefits from:",
      items: [
        "Direct relationships with large portfolio operators",
        "The founding team's established reputation",
        "Warm introductions through industry networks",
        "Early adopters willing to co-shape the MVP"
      ],
      note: "This gives a strong foundation for feedback, iteration, and early proof points."
    },
    {
      title: "Clear Differentiators",
      colorType: "rose",
      intro: "Hobson stands out through:",
      items: [
        "Document-Native AI: Focused on extracting clarity from documents themselves, rather than primarily automating communication or CRM workflows",
        "Referenced Answers: Every answer is tied back to its source, which is crucial in a risk-averse environment",
        "No Replacement Positioning: Works alongside existing systems, lowering both political and operational friction",
        "Accessibility and Affordability: Makes advanced AI available to SMB landlords and mid-sized operators, not just large enterprises",
        "Speed & Simplicity: Tackles document overload without training, heavy rollout, or organisational resistance"
      ]
    }
  ],
  gaps: [
    {
      title: "Brand Visibility and Reach",
      items: ["Limited social media presence on LinkedIn, events, and forums", "Low awareness in a noisy PropTech and AI space"],
      need: "Thought leadership, case studies, and systematic visibility"
    },
    {
      title: "Technical Scaling",
      items: ["Hybrid RAG + knowledge-graph pipeline is powerful but still maturing", "Performance must be robust across diverse document sets"],
      need: "Ongoing fine-tuning and expanded testing"
    },
    {
      title: "Product Breadth",
      items: ["Current focus is on retrieval and extraction", "Competitors also offer analytics, automation, or communication tools"],
      need: "Gradual expansion into proactive insight and workflow support"
    },
    {
      title: "Customer Support Infrastructure",
      items: ["Documentation and onboarding flows are still light", "Processes for resolution and customer success are emerging"],
      need: "Structured customer success and support frameworks"
    },
    {
      title: "Resource Constraints",
      items: ["As a startup, Hobson must prioritise where to invest time and capital", "Scaling marketing, support, and development will require funding"],
      need: "Investment to support systematic growth"
    }
  ]
});

// Our Vision structured data provider - matches OurVisionVisual.tsx
export const getOurVisionStructuredData = () => ({
  header: {
    title: "Our Vision",
    subtitle: "The Evolution of Hobson AI"
  },
  stages: [
    {
      label: "Reactive Agent",
      timeframe: "Today",
      description: "AI retrieves when asked with accuracy",
      icons: ["Prompts", "Retrieves"],
      visualNote: "Human-led, AI responds",
      colorType: "slate"
    },
    {
      label: "Proactive Agent",
      timeframe: "~1 Year",
      description: "AI suggests & prepares, humans approve",
      icons: ["Drafts", "Approvals"],
      visualNote: "AI prepares, human confirms",
      colorType: "purple"
    },
    {
      label: "Autonomous Agent",
      timeframe: "3-5 Years",
      description: "AI executes & reports outcomes",
      icons: ["Executes", "Reports", "Audits"],
      visualNote: "AI operates, human monitors",
      colorType: "primary"
    }
  ],
  progressionIndicators: [
    { label: "Automation", direction: "Increasing" },
    { label: "Human Effort", direction: "Decreasing" },
    { label: "Scale", direction: "Expanding" }
  ]
});

// Strategic Approach structured data provider - matches ApproachVisual.tsx
export const getStrategicApproachStructuredData = () => ({
  pillars: [
    {
      number: 1,
      title: "Product",
      subtitle: "Hobson has been built to replace document-driven human reasoning without disrupting existing workflows",
      colorType: "blue",
      items: [
        "Operates inside current systems",
        "Zero onboarding or behavioural change",
        "Unifies reasoning across documents, emails, and platforms",
        "Transparent citations and verifiable outputs"
      ],
      conclusion: "Trust is earned first. Expansion into proactive guidance and automation will follow."
    },
    {
      number: 2,
      title: "Brand",
      subtitle: "Hobson has been designed for high-stakes operational environments where accuracy, traceability, and defensibility are non-negotiable",
      colorType: "rose",
      items: [
        "Predictable behaviour",
        "Transparent sources",
        "Clear expectations",
        "Fast feedback loops"
      ],
      conclusion: "The brand signals reliability under pressure."
    },
    {
      number: 3,
      title: "Business Model",
      subtitle: "Hobson has been designed to become the default intelligence layer",
      colorType: "amber",
      items: [
        "Usage-based pricing aligned to value delivered (HEU)",
        "No licence, per-user, or per-asset fees",
        "Low base cost enabling broad adoption",
        "Full transparency into AI actions"
      ]
    }
  ]
});

// Raise structured data provider - matches RaiseVisual.tsx
export const getRaiseStructuredData = () => ({
  fundingRequirement: {
    label: "FUNDING REQUIREMENT",
    amount: "GBP 1.8M"
  },
  useOfFunds: {
    title: "Use of Funds",
    items: [
      "To secure category leadership with a production-grade platform, QA, and security",
      "Core technical and go-to-market hiring",
      "Conversion of pilots into contracted deployments"
    ]
  }
});
