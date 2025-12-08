/**
 * Investment PDF Generator
 * 
 * Architecture:
 * - One function per card type
 * - Each function receives the card's tabs as input
 * - Output is the PDF generated directly from the tab data
 * - This guarantees PDF content matches UI content exactly
 */

import { jsPDF } from "jspdf";

// PDF Configuration
const PDF_CONFIG = {
  margin: 20,
  primaryColor: [124, 58, 237] as [number, number, number],
  textDark: [31, 41, 55] as [number, number, number],
  textGray: [75, 85, 99] as [number, number, number],
  textLight: [107, 114, 128] as [number, number, number],
  bgLight: [249, 250, 251] as [number, number, number],
};

// Types for tab/page content
export interface ContentSection {
  title: string;
  subtitle?: string;
  items?: string[];
  conclusion?: string;
  teamMembers?: TeamMember[];
}

export interface TeamMember {
  name: string;
  role: string;
  linkedin?: string;
}

export interface TabContent {
  overview?: string;
  sections: ContentSection[];
}

export interface Tab {
  title: string;
  content: TabContent;
  showCustomVisual?: boolean;
  customVisualComponent?: string;
  image?: string;
  pdfImage?: string;
  imageAlt?: string;
}

export interface CardSection {
  id: string;
  title: string;
  subtitle: string;
  pages: Tab[];
}

/**
 * Remove emojis and fix special characters for PDF compatibility
 */
const sanitizeText = (text: string): string => {
  return text
    .replace(/⭐/g, "")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/✓/g, "-")
    .replace(/✔/g, "-")
    .replace(/✗/g, "x")
    .replace(/✘/g, "x")
    .replace(/•/g, "-")
    .replace(/⦁/g, "-")
    .replace(/≈/g, "~")
    .replace(/×/g, "x")
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/…/g, "...")
    .replace(/£/g, "GBP ")
    .replace(/[\u{2B50}]/gu, "")
    .replace(/[\u{1F000}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "")
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F700}-\u{1F77F}]/gu, "")
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, "")
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, "")
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "")
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "")
    .replace(/[\u{200D}]/gu, "")
    .trim()
    .replace(/\s+/g, " ");
};

/**
 * Custom visual content generators
 * These extract the exact text content shown in each visual component
 */
const getCustomVisualContent = (componentType: string): string[] => {
  switch (componentType) {
    case "ukMarketAssumptions":
      return [
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

    case "ukAssumptionsFinancials":
      return [
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

    case "targetMarket":
      return [
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

    case "sam":
      return [
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

    case "ukMarket":
      return [
        "UK Market Opportunity - Built Directly From Verified Assumptions:",
        "",
        "Total Addressable Market (TAM) - GBP 1.41B:",
        "- Based on verified ONS business counts and salary benchmarks",
        "- 235,200 UK real estate businesses (5.6M total UK businesses x 4.2% real estate share)",
        "- GBP 6,000 annual saving per business (20% efficiency gain on GBP 30,000 junior salary)",
        "- TAM = 235,200 x GBP 6,000 = GBP 1.41B",
        "",
        "Serviceable Available Market (SAM) - GBP 917M:",
        "- Reflects businesses motivated and able to adopt AI",
        "- 65% adoption readiness (consistent with PropTech and operational AI adoption rates)",
        "- 235,200 x 65% = 152,880 motivated businesses",
        "- 152,880 x GBP 6,000 = GBP 917M",
        "",
        "Serviceable Obtainable Market (SOM) - GBP 110M:",
        "- Built using the evidence-backed 12% early penetration assumption",
        "- 12% sits within verified 8-20% early-stage adoption range (McKinsey, PwC, Deloitte)",
        "- 152,880 x 12% = 18,345 early adopters",
        "- 18,345 x GBP 6,000 = GBP 110M",
        "",
        "SOM is intentionally conservative and supported by industry-verified adoption behaviour.",
      ];

    case "europeanGlobal":
      return [
        "European & Global Market Opportunities:",
        "",
        "EUROPE (11x UK Population Multiple):",
        "",
        "Total Addressable Market (TAM) - GBP 15.5B:",
        "- Scaling UK's GBP 1.41B by Europe's 11x population multiple",
        "- Represents annual efficiency value across Europe for AI-driven document workflows",
        "",
        "Serviceable Available Market (SAM) - GBP 10.1B:",
        "- 65% of European operators motivated and ready to adopt AI tools",
        "- GBP 15.5B x 65% = GBP 10.1B",
        "",
        "Serviceable Obtainable Market (SOM) - GBP 1.2B:",
        "- 12% penetration of motivated organisations",
        "- GBP 10.1B x 12% = GBP 1.2B",
        "",
        "GLOBAL (118x UK Population Multiple):",
        "",
        "Total Addressable Market (TAM) - GBP 155.6B:",
        "- Scaling UK's GBP 1.41B by global 118x population multiple",
        "- Worldwide opportunity for AI-driven efficiency gains in real estate",
        "",
        "Serviceable Available Market (SAM) - GBP 101B:",
        "- 65% of global market motivated to adopt AI tools",
        "- GBP 155.6B x 65% = GBP 101B",
        "",
        "Serviceable Obtainable Market (SOM) - GBP 12.1B:",
        "- 12% penetration of motivated buyers",
        "- GBP 101B x 12% = GBP 12.1B",
      ];

    case "earlyRoadmap":
      return [
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
        "- Testing MVP with key clients in real-world scenarios",
        "- Finalise pricing strategy based on usage data",
        "- Build pricing plan, marketing plan, business plan and financial model",
      ];

    case "ganttChart":
      return [
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

    case "onboardingCosts":
      return [
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

    case "heuPricing":
      return [
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

    case "landscape":
      return [
        "Market Landscape - The Next Winners in Real Estate Tech Will Be AI-Native:",
        "",
        "Traditional cloud systems cannot deliver reasoning, accuracy, or instant answers",
        "- AI-native tools can.",
        "",
        "Traditional Cloud Solutions - The Overcrowded Before:",
        "- Overcrowded market with 100+ competitors",
        "- High cost, slow innovation cycles",
        "- Still reliant on manual information retrieval",
        "- Complex interfaces requiring extensive training",
        "- Heavy infrastructure with long implementation times",
        "",
        "Next-Generation AI Solutions - The Emerging After:",
        "- Hobson (Category Leader) - AI-native assistant for real estate documents",
        "- EliseAI - Conversational AI for real estate management",
        "- Trudi - AI compliance assistant",
        "- StanAI - Property management automation",
        "- Kendal AI - Lease abstraction and analysis",
        "",
        "Key Differentiators of AI-Native Solutions:",
        "- Instant, referenced answers from source documents",
        "- Simple, lightweight, and low cost",
        "- Designed for accuracy and automation",
        "- Zero training required",
        "- Works alongside existing systems",
      ];

    case "competitorAnalysis":
      return [
        "Competitor Analysis Matrix:",
        "",
        "Hobson AI:",
        "- Who: AI-native document assistant for real estate",
        "- What: Instant answers from property documents with source citations",
        "- Strengths: Zero onboarding, transparent pricing, property-specific AI",
        "- Weaknesses: Pre-revenue, building market awareness",
        "",
        "EliseAI:",
        "- Who: Conversational AI for property management",
        "- What: AI leasing agent and resident communication",
        "- Strengths: Strong in multifamily, good automation",
        "- Weaknesses: Narrow focus on leasing, limited document intelligence",
        "",
        "StanAI:",
        "- Who: Property management automation platform",
        "- What: Automates routine property management tasks",
        "- Strengths: Workflow automation, integration capabilities",
        "- Weaknesses: Less focus on document understanding",
        "",
        "Kendal AI:",
        "- Who: Lease abstraction and analysis",
        "- What: Extracts key terms from commercial leases",
        "- Strengths: Good at structured extraction",
        "- Weaknesses: Requires manual review, limited conversational ability",
        "",
        "Trudi:",
        "- Who: AI compliance assistant",
        "- What: Helps agents stay compliant with regulations",
        "- Strengths: Compliance focus, audit trails",
        "- Weaknesses: Narrow use case, not document-centric",
        "",
        "Legacy PropTech:",
        "- Who: Traditional property management software (Yardi, AppFolio, etc.)",
        "- What: Full-suite property management platforms",
        "- Strengths: Feature-rich, market presence",
        "- Weaknesses: High cost, complex implementation, limited AI",
      ];

    case "simpleUI":
      return [
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

    case "costAssumptions":
      return [
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

    case "plAssumptions":
      return [
        "P/L Assumptions - Foundational Model (2027-2031):",
        "",
        "1. Revenue Model Assumptions:",
        "",
        "Pricing (ARR Basis):",
        "- Blended ARPU = GBP 41.31/month -> GBP 495.72/year",
        "- Pricing includes Essential, Essential Plus, Enterprise mix",
        "- No implementation fees (frictionless onboarding)",
        "",
        "Customer Growth & Penetration:",
        "- UK: 1.0% -> 2.0% penetration (2027-2031)",
        "- Global (OECD markets): 0.25% -> 0.6% penetration (2028-2031)",
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

    case "capitalRaiseStrategy":
      return [
        "Capital Raise Strategy — Activating the Business for Commercial Launch",
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
        "GBP 1.2M — Activation Round (9-12 months runway)",
        "Transition from pilots to limited 2027 launch. Minimal runway, heightened risk.",
        "",
        "GBP 1.5M — Minimum Credible (12-18 months runway)",
        "Covers early operating costs and supports a stable launch phase. Minimum viable raise.",
        "",
        "GBP 1.8M — Balanced Seed [RECOMMENDED] (18-22 months runway)",
        "Supports product velocity, marketing execution, and early enterprise engagement.",
        "Strategically optimal level for confident execution.",
        "",
        "GBP 2.2M — Accelerated Growth (22-28 months runway)",
        "Positions for accelerated UK scale and early international expansion from 2028.",
        "",
        "COMMERCIAL TRAJECTORY:",
        "2026: Pilots & Validation — Technical validation with real-world partners",
        "2027: Commercial Launch — Minimal but functional market entry",
        "2028+: Scale & Expand — Accelerated UK penetration and global expansion",
        "",
        "SUMMARY:",
        "This raise unlocks the full commercial potential of the business: pilots and",
        "technical validation in 2026, a minimal but functional launch in 2027, and",
        "accelerated UK penetration and global expansion from 2028 onwards.",
      ];

    case "revenueGrowth":
      return [
        "Revenue Growth (2027-2031):",
        "",
        "Annual Revenue Projections:",
        "",
        "Year | Revenue  | UK Revenue | Global Revenue",
        "2027 | GBP 1.17M | GBP 1.17M  | --",
        "2028 | GBP 6.71M | GBP 1.46M  | GBP 5.25M",
        "2029 | GBP 9.10M | GBP 1.75M  | GBP 7.35M",
        "2030 | GBP 12.53M| GBP 2.04M  | GBP 10.49M",
        "2031 | GBP 14.92M| GBP 2.33M  | GBP 12.59M",
        "",
        "Key Growth Drivers:",
        "- UK market penetration: 1.0% -> 2.0% (2027-2031)",
        "- Global expansion begins 2028 with 0.25% penetration",
        "- Global penetration grows to 0.6% by 2031",
        "- Blended ARPU: GBP 495.72/year",
        "",
        "Revenue Mix Evolution:",
        "- 2027: 100% UK (market launch year)",
        "- 2028: ~22% UK, ~78% Global (expansion year)",
        "- 2031: ~16% UK, ~84% Global (scaled operations)",
        "",
        "Review the UK Assumptions, Global Assumptions, Market Penetration, and Revenue Model tabs for detailed methodology.",
      ];

    case "plGrowth":
      return [
        "P/L Growth Trajectory (2027-2031):",
        "",
        "Annual Financial Performance:",
        "",
        "Year | Revenue   | COGS (10%) | OpEx    | Net Profit",
        "2027 | GBP 1.17M | GBP 117k   | GBP 850k| GBP 203k",
        "2028 | GBP 6.71M | GBP 671k   | GBP 1.6M| GBP 4.4M",
        "2029 | GBP 9.10M | GBP 910k   | GBP 2.0M| GBP 6.2M",
        "2030 | GBP 12.53M| GBP 1.25M  | GBP 2.5M| GBP 8.8M",
        "2031 | GBP 14.92M| GBP 1.49M  | GBP 2.8M| GBP 10.6M",
        "",
        "Profitability Metrics:",
        "- Gross Margin: ~90% (revenue minus COGS)",
        "- Operating Margin: Expands from ~17% (2027) to ~71% (2031)",
        "- Net Profit Margin: Grows significantly with scale",
        "",
        "The following tabs explain how this growth is achievable:",
        "- Revenue Assumptions and Cost Assumptions for detailed methodology",
        "- Market Penetration for customer acquisition projections",
        "- Revenue Model for pricing and mix assumptions",
      ];

    case "revenueModel":
      return [
        "Revenue Model - 5-Year Projections (2027-2031):",
        "",
        "Pricing Structure:",
        "- Blended ARPU: GBP 495.72/year (GBP 41.31/month)",
        "- Tier Mix: Essential (60%), Essential Plus (30%), Enterprise (10%)",
        "- No per-user or per-asset fees",
        "",
        "UK Market Penetration & Customers:",
        "",
        "Year | Penetration | Customers | New Customers",
        "2027 | 1.0%        | 2,352     | 2,352",
        "2028 | 1.25%       | 2,940     | 588",
        "2029 | 1.5%        | 3,528     | 588",
        "2030 | 1.75%       | 4,116     | 588",
        "2031 | 2.0%        | 4,704     | 588",
        "",
        "Global Market Penetration & Customers:",
        "",
        "Year | Penetration | Customers | New Customers",
        "2028 | 0.25%       | 10,584    | 10,584",
        "2029 | 0.35%       | 14,818    | 4,234",
        "2030 | 0.5%        | 21,168    | 6,350",
        "2031 | 0.6%        | 25,402    | 4,234",
        "",
        "Combined Revenue:",
        "",
        "Year | UK Revenue  | Global Revenue | Total Revenue",
        "2027 | GBP 1.17M   | --             | GBP 1.17M",
        "2028 | GBP 1.46M   | GBP 5.25M      | GBP 6.71M",
        "2029 | GBP 1.75M   | GBP 7.35M      | GBP 9.10M",
        "2030 | GBP 2.04M   | GBP 10.49M     | GBP 12.53M",
        "2031 | GBP 2.33M   | GBP 12.59M     | GBP 14.92M",
        "",
        "ROI Justification:",
        "- Annual efficiency saving: GBP 6,000 per role",
        "- Annual subscription: GBP 495.72",
        "- ROI: ~12x return on subscription cost",
      ];

    case "marketShareJustification":
      return [
        "Market Penetration Justification:",
        "",
        "Why Hobson Can Capture Market Share:",
        "",
        "1. UK Market Structure:",
        "- Highly fragmented market (235,200 businesses)",
        "- No dominant AI-native solution",
        "- Enables fast adoption via targeted approach",
        "",
        "2. White-Space Positioning:",
        "- First AI-native document intelligence tool for real estate",
        "- Not competing with property management systems",
        "- Complementary to existing workflows",
        "",
        "3. Benchmark Comparable Companies:",
        "- Vertical AI SaaS typically reaches 1-3% penetration in 3-5 years",
        "- Hobson targets 2x this rate due to frictionless adoption",
        "",
        "4. AI Adoption Tailwinds:",
        "- 65% of organisations plan to increase AI investment (Deloitte)",
        "- Real estate is underserved by AI solutions",
        "",
        "5. Attractive Unit Economics:",
        "- Low CAC (GBP 60-371 depending on year)",
        "- High LTV (GBP 2,479 over 5 years)",
        "- LTV:CAC ratio of 7-41x",
        "",
        "6. 2x Penetration Multiplier Rationale:",
        "- Zero onboarding required - works immediately",
        "- Accessible usage-based pricing",
        "- No switching costs - lightweight assistant model",
        "",
        "Market Share Projections:",
        "",
        "UK: 1.0% (2027) -> 2.0% (2031)",
        "Global: 0.25% (2028) -> 0.6% (2031)",
        "Combined UK + Global: 4-5% by 2030 as category leader",
      ];

    case "globalJustification":
      return [
        "Global Market Assumptions - OECD Multiplier Methodology:",
        "",
        "Why 18x Multiplier from UK Baseline:",
        "",
        "Population Comparison:",
        "- UK population: 67 million",
        "- OECD comparable markets: 1.38 billion",
        "- Ratio: 1.38B / 67M = 20.6x",
        "- Conservative adjustment: 18x (accounts for market variations)",
        "",
        "OECD-Aligned Comparable Markets:",
        "- United Kingdom (baseline)",
        "- European Union countries",
        "- United States",
        "- Canada",
        "- Australia",
        "- New Zealand",
        "- Singapore",
        "",
        "Business Density Consistency:",
        "- OECD average: ~65 registered businesses per 1,000 people",
        "- UK: 75-80 per 1,000",
        "- EU: 60-70 per 1,000",
        "- US: 70-80 per 1,000",
        "",
        "Real Estate Share Consistency:",
        "- Real estate represents 4-5% of formally registered businesses across OECD",
        "- Consistent with UK's 4.2% share",
        "",
        "Global Market Calculation:",
        "- UK real estate businesses: 235,200",
        "- Global estimate: 235,200 x 18 = 4.23 million businesses",
        "",
        "This approach:",
        "- Scales only across formal, regulated real estate markets",
        "- Avoids inflated 'world population' estimation errors",
        "- Focuses on markets where Hobson can realistically launch",
        "- Provides investor-defensible methodology",
      ];

    case "cacAssumptions":
      return [
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
        "All payback periods under 12 months - excellent for SaaS.",
        "LTV:CAC ratio of 7-41x far exceeds VC-attractive threshold of 3x.",
      ];

    case "burnRateAssumptions":
      return [
        "Burn Rate Assumptions (2027-2031):",
        "",
        "RECOMMENDED SEED RAISE: GBP 1.5M - GBP 2M",
        "Covers 18-24 months and early commercialisation",
        "",
        "Funding Allocation:",
        "- Pre-2027 engineering build: GBP 500k-700k",
        "- Team hiring & runway: GBP 750k",
        "- Initial marketing ramp: GBP 150k",
        "- Buffer: GBP 300k",
        "",
        "1. CORE OPERATING MODEL ASSUMPTIONS",
        "",
        "Fixed Internal Team (Annual):",
        "- CEO: GBP 120,000",
        "- Head of Marketing: GBP 80,000",
        "- Product Owner: GBP 90,000",
        "- Head of Customer Support: GBP 70,000",
        "- Head of Sales: GBP 90,000",
        "- Customer Support Officer: GBP 40,000",
        "Total Fixed Payroll: GBP 490,000/year -> GBP 40,800/month",
        "",
        "Outsourced Fixed Costs (Annual):",
        "- Engineering (outsourced): GBP 300,000",
        "- Legal, compliance, finance: GBP 40,000",
        "- Contractors / overflow: GBP 20,000",
        "Total Outsourced Fixed: GBP 360,000/year -> GBP 30,000/month",
        "",
        "TOTAL FIXED OPERATING COST: GBP 850,000/year -> GBP 70,800/month",
        "",
        "2. COGS (INFRASTRUCTURE) - 10% of Revenue:",
        "- AI inference: 6%",
        "- Vector DB: 1.5%",
        "- Cloud compute: 2%",
        "- Storage & bandwidth: 0.5%",
        "",
        "3. CUSTOMER ACQUISITION - 12% of Revenue:",
        "- Digital Marketing (execution): 8%",
        "- SDR / Sales variable comp: 4%",
        "",
        "4. TOTAL VARIABLE COST: 22% of Revenue (COGS 10% + CAC 12%)",
        "",
        "5. BURN FORMULA:",
        "Monthly Burn = Fixed Costs + Variable Costs - Monthly Revenue",
        "- Fixed Costs: GBP 70,800/month",
        "- Variable Costs: 22% of revenue",
        "",
        "6. BURN RATE BY YEAR:",
        "",
        "2027:",
        "- Revenue: GBP 1.17M -> GBP 97,500/month",
        "- Variable (22%): GBP 21,450",
        "- Total costs: GBP 92,250",
        "- Monthly surplus: GBP 5,250",
        "-> PROFITABLE IN YEAR 1",
        "",
        "2028:",
        "- Revenue: GBP 6.71M -> GBP 559,000/month",
        "- Variable (22%): GBP 123,000",
        "- Total costs: GBP 193,800",
        "- Monthly surplus: GBP 365,200",
        "",
        "2029:",
        "- Revenue: GBP 9.10M -> GBP 758,333/month",
        "- Monthly surplus: GBP 520,700",
        "",
        "2030:",
        "- Revenue: GBP 12.53M -> GBP 1.044M/month",
        "- Monthly surplus: GBP 743,520",
        "",
        "2031:",
        "- Revenue: GBP 14.92M -> GBP 1.243M/month",
        "- Monthly surplus: GBP 898,740",
        "",
        "7. KEY INVESTOR INSIGHTS:",
        "1. Cashflow-positive almost immediately in Year 1",
        "2. Extremely capital-efficient model",
        "3. Gross margin >78% by 2030 (classic SaaS signature)",
        "4. Capital only needed for pre-revenue build (2025-2026)",
        "",
        "Your OPERATING model does not require capital.",
        "Your BUILD and GO-TO-MARKET ACCELERATION do.",
        "GBP 1.5M-2M avoids unnecessary dilution because the operating model is profitable.",
      ];

    default:
      return [];
  }
};

/**
 * Create cover page for a section PDF
 */
const createCoverPage = (
  doc: jsPDF,
  title: string,
  subtitle: string
): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Purple background
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // HOBSON AI logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("HOBSON AI", pageWidth / 2, 80, { align: "center" });

  // Section title
  doc.setFontSize(32);
  const maxWidth = pageWidth - PDF_CONFIG.margin * 2;
  const titleLines = doc.splitTextToSize(title, maxWidth - 20);
  doc.text(titleLines, pageWidth / 2, 110, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  const subtitleLines = doc.splitTextToSize(subtitle, maxWidth - 20);
  doc.text(subtitleLines, pageWidth / 2, 140, { align: "center" });

  // Label
  doc.setFontSize(10);
  doc.text("Investment Opportunity Document", pageWidth / 2, 170, { align: "center" });

  // Date
  const currentDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(currentDate, pageWidth / 2, pageHeight - 20, { align: "center" });
};

/**
 * Render a tab's content to PDF
 */
const renderTabContent = (
  doc: jsPDF,
  tab: Tab,
  startY: number
): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PDF_CONFIG.margin;
  const maxWidth = pageWidth - margin * 2;
  let yPosition = startY;

  // Tab title
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const cleanedTitle = sanitizeText(tab.title);
  const titleLines = doc.splitTextToSize(cleanedTitle, maxWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 8 + 5;

  // Purple line under title
  doc.setDrawColor(...PDF_CONFIG.primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Handle image if present (either image or pdfImage)
  const imageToUse = tab.image || tab.pdfImage;
  if (imageToUse) {
    try {
      // AI Architecture gets its own full page for proper display
      if (tab.title === "AI Architecture") {
        // Start fresh on this page - title already rendered above
        // Use most of the remaining page for the image
        const availableHeight = pageHeight - yPosition - 20;
        
        // Architecture diagram - tall portrait aspect ratio (height/width = 1.3)
        const naturalAspectRatio = 1.3;
        
        // Calculate to fit available space while maintaining ratio
        let imgWidth = maxWidth;
        let imgHeight = imgWidth * naturalAspectRatio;
        
        // Scale to fit if needed
        if (imgHeight > availableHeight) {
          imgHeight = availableHeight;
          imgWidth = imgHeight / naturalAspectRatio;
        }
        
        // Center horizontally
        const xOffset = margin + (maxWidth - imgWidth) / 2;
        
        doc.addImage(imageToUse, "PNG", xOffset, yPosition, imgWidth, imgHeight);
        
        // Text content on new page
        doc.addPage();
        yPosition = margin;
      } else if (tab.title === "Simple UI") {
        // Simple UI - portrait device mockup
        const aspectRatio = 0.8;
        const imgWidth = maxWidth * 0.7; // Slightly smaller
        const imgHeight = imgWidth * aspectRatio;
        
        if (yPosition + imgHeight > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Center horizontally
        const xOffset = margin + (maxWidth - imgWidth) / 2;
        doc.addImage(imageToUse, "PNG", xOffset, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } else {
        // Other images - default handling
        const aspectRatio = 0.6;
        const imgWidth = maxWidth;
        const imgHeight = imgWidth * aspectRatio;
        
        if (yPosition + imgHeight > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        doc.addImage(imageToUse, "PNG", margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }
    } catch (error) {
      console.error("Error adding image to PDF:", error);
    }
  }

  // Overview
  if (tab.content?.overview) {
    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const cleanedOverview = sanitizeText(tab.content.overview);
    const overviewLines = doc.splitTextToSize(cleanedOverview, maxWidth - 10);
    const boxHeight = overviewLines.length * 8 + 8;
    doc.rect(margin, yPosition, maxWidth, boxHeight, "F");
    doc.text(overviewLines, margin + 5, yPosition + 6, { lineHeightFactor: 1.4 });
    yPosition += boxHeight + 8;
  }

  // Custom visual content
  const componentType = tab.customVisualComponent;
  if (tab.showCustomVisual && componentType) {
    const customContent = getCustomVisualContent(componentType);
    if (customContent.length > 0) {
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      customContent.forEach((line) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        const cleanLine = sanitizeText(line);
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
      yPosition += 10;
    }
  }

  // Content sections
  if (tab.content?.sections) {
    tab.content.sections.forEach((section) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }

      // Section title
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const cleanedSectionTitle = sanitizeText(section.title);
      const sectionTitleLines = doc.splitTextToSize(cleanedSectionTitle, maxWidth);
      doc.text(sectionTitleLines, margin, yPosition);
      yPosition += sectionTitleLines.length * 7 + 3;

      // Subtitle
      if (section.subtitle) {
        doc.setTextColor(...PDF_CONFIG.primaryColor);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const cleanedSubtitle = sanitizeText(section.subtitle);
        const subtitleLines = doc.splitTextToSize(cleanedSubtitle, maxWidth);
        doc.text(subtitleLines, margin, yPosition);
        yPosition += subtitleLines.length * 6 + 5;
      }

      // Team members
      if (section.teamMembers && Array.isArray(section.teamMembers)) {
        const membersPerRow = 3;
        const cardWidth = (maxWidth - 10) / membersPerRow;
        const cardHeight = 35;
        const cardSpacing = 5;

        section.teamMembers.forEach((member, idx) => {
          const col = idx % membersPerRow;
          const row = Math.floor(idx / membersPerRow);
          const xPos = margin + col * cardWidth;
          const cardYPos = yPosition + row * (cardHeight + cardSpacing);

          if (cardYPos > pageHeight - 60 && col === 0) {
            doc.addPage();
            yPosition = margin;
          }

          const finalYPos = col === 0 && row > 0 && yPosition < margin + 20 ? margin : cardYPos;

          // Card border
          doc.setDrawColor(...PDF_CONFIG.primaryColor);
          doc.setLineWidth(0.5);
          doc.rect(xPos + 2, finalYPos, cardWidth - 6, cardHeight);

          // Role header
          doc.setFillColor(...PDF_CONFIG.primaryColor);
          doc.rect(xPos + 2, finalYPos, cardWidth - 6, 8, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text(member.role, xPos + cardWidth / 2, finalYPos + 5, { align: "center" });

          // Name
          doc.setTextColor(...PDF_CONFIG.textDark);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          const nameLines = doc.splitTextToSize(member.name, cardWidth - 12);
          doc.text(nameLines, xPos + cardWidth / 2, finalYPos + 16, { align: "center" });

          // LinkedIn
          if (member.linkedin) {
            doc.setTextColor(...PDF_CONFIG.primaryColor);
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            const linkText = "LinkedIn Profile";
            const linkY = finalYPos + 26;
            doc.text(linkText, xPos + cardWidth / 2, linkY, { align: "center" });
            const textWidth = doc.getTextWidth(linkText);
            doc.link(xPos + (cardWidth - textWidth) / 2, linkY - 3, textWidth, 4, { url: member.linkedin });
          } else {
            doc.setTextColor(...PDF_CONFIG.textLight);
            doc.setFontSize(7);
            doc.setFont("helvetica", "italic");
            doc.text("Coming Soon", xPos + cardWidth / 2, finalYPos + 26, { align: "center" });
          }
        });

        const totalRows = Math.ceil(section.teamMembers.length / membersPerRow);
        yPosition += totalRows * (cardHeight + cardSpacing) + 5;
      }

      // Items
      if (section.items && Array.isArray(section.items)) {
        doc.setTextColor(...PDF_CONFIG.textGray);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        section.items.forEach((item) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
          }

          // Bullet
          doc.setTextColor(...PDF_CONFIG.primaryColor);
          doc.setFont("helvetica", "bold");
          doc.text("-", margin + 2, yPosition);

          // Text
          doc.setTextColor(...PDF_CONFIG.textGray);
          doc.setFont("helvetica", "normal");
          const cleanedItem = sanitizeText(item);
          const itemLines = doc.splitTextToSize(cleanedItem, maxWidth - 10);
          doc.text(itemLines, margin + 8, yPosition);
          yPosition += itemLines.length * 5 + 3;
        });
      }

      // Conclusion
      if (section.conclusion) {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(200, 200, 200);
        const cleanedConclusion = sanitizeText(section.conclusion);
        const conclusionLines = doc.splitTextToSize(cleanedConclusion, maxWidth - 16);
        const boxHeight = conclusionLines.length * 5 + 8;
        doc.roundedRect(margin, yPosition - 2, maxWidth, boxHeight, 2, 2, "FD");

        doc.setTextColor(...PDF_CONFIG.textGray);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(conclusionLines, margin + 8, yPosition + 4);
        yPosition += boxHeight + 5;
      }

      yPosition += 8;
    });
  }

  return yPosition;
};

/**
 * Add footer to all pages except cover
 */
const addFooters = (doc: jsPDF): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PDF_CONFIG.margin;
  const totalPages = doc.getNumberOfPages();

  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `(C) ${new Date().getFullYear()} Hobson AI - Confidential Investment Materials`,
      margin,
      pageHeight - 10
    );
    doc.text(`Page ${i - 1} of ${totalPages - 1}`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }
};

/**
 * Generate PDF for a single card section
 * 
 * @param section - The card section containing all tabs
 * @returns void - Downloads the PDF directly
 */
export const generateCardPdf = (section: CardSection): void => {
  const doc = new jsPDF();
  const margin = PDF_CONFIG.margin;

  // Create cover page
  createCoverPage(doc, section.title, section.subtitle);

  // Render each tab
  section.pages.forEach((tab) => {
    doc.addPage();
    renderTabContent(doc, tab, margin);
  });

  // Add footers
  addFooters(doc);

  // Save
  const filename = `Hobson-${section.title.replace(/[^a-z0-9]/gi, "-")}.pdf`;
  doc.save(filename);
};

/**
 * Business Plan Cards - explicit interface for the 6 included cards
 */
export interface BusinessPlanCards {
  strategyPositioning: CardSection;
  customersMarket: CardSection;
  roadmapProduct: CardSection;
  commercials: CardSection;
  team: CardSection;
  financials: CardSection;
}

/**
 * Generate complete business plan PDF with all 6 cards
 * 
 * @param cards - Object containing all 6 card sections explicitly
 * @returns void - Downloads the PDF directly
 */
export const generateFullBusinessPlanPdf = (cards: BusinessPlanCards): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PDF_CONFIG.margin;

  // Explicit ordered list of cards to include
  const includedSections: CardSection[] = [
    cards.strategyPositioning,
    cards.customersMarket,
    cards.roadmapProduct,
    cards.commercials,
    cards.team,
    cards.financials,
  ];

  // Cover page
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("HOBSON AI", pageWidth / 2, 60, { align: "center" });

  doc.setFontSize(36);
  doc.text("Full Business Plan", pageWidth / 2, 100, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Investment Opportunity Document", pageWidth / 2, 130, { align: "center" });

  // Funding requirement
  const fundingY = 165;
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 80, fundingY - 15, pageWidth / 2 + 80, fundingY - 15);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FUNDING REQUIREMENT", pageWidth / 2, fundingY, { align: "center" });

  doc.setFontSize(42);
  doc.text("GBP 1,000,000", pageWidth / 2, fundingY + 20, { align: "center" });

  doc.line(pageWidth / 2 - 80, fundingY + 30, pageWidth / 2 + 80, fundingY + 30);

  const currentDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(10);
  doc.text(currentDate, pageWidth / 2, pageHeight - 20, { align: "center" });

  // Index page
  doc.addPage();
  let indexY = margin;

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Contents", pageWidth / 2, indexY, { align: "center" });
  indexY += 15;

  doc.setDrawColor(...PDF_CONFIG.primaryColor);
  doc.setLineWidth(1);
  doc.line(margin + 40, indexY, pageWidth - margin - 40, indexY);
  indexY += 15;

  const indexPageNum = doc.getNumberOfPages();

  // Calculate page numbers
  const sectionPageNumbers: { [key: string]: number } = {};
  let currentPageNum = indexPageNum + 1;
  includedSections.forEach((section) => {
    sectionPageNumbers[section.id] = currentPageNum;
    section.pages.forEach(() => {
      currentPageNum++;
    });
  });

  // Draw index cards
  const cardWidth = (pageWidth - margin * 2 - 10) / 2;
  const cardHeight = 45;
  let cardX = margin;
  let cardY = indexY;
  let cardCount = 0;

  const colors = [
    [59, 130, 246],   // Strategy - blue
    [168, 85, 247],   // Customers - purple
    [34, 197, 94],    // Roadmap - green
    [234, 179, 8],    // Commercials - yellow
    [239, 68, 68],    // Team - red
    [236, 72, 153],   // Financials - pink
  ];

  includedSections.forEach((section, idx) => {
    if (cardY + cardHeight > pageHeight - 30) {
      doc.addPage();
      cardY = margin;
      cardX = margin;
      cardCount = 0;
    }

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, "F");

    const [r, g, b] = colors[idx % colors.length];
    doc.setFillColor(r, g, b);
    doc.rect(cardX, cardY, cardWidth, 3, "F");

    doc.setTextColor(r, g, b);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}`, cardX + 8, cardY + 15);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(section.title, cardWidth - 35);
    doc.text(titleLines, cardX + 20, cardY + 15);

    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const subtitleLines = doc.splitTextToSize(section.subtitle, cardWidth - 20);
    doc.text(subtitleLines[0] || "", cardX + 8, cardY + 30);

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const pageNum = sectionPageNumbers[section.id];
    doc.text(`p.${pageNum - 1}`, cardX + cardWidth - 20, cardY + 38);

    // Add link
    doc.link(cardX, cardY, cardWidth, cardHeight, { pageNumber: pageNum });

    cardCount++;
    if (cardCount % 2 === 0) {
      cardX = margin;
      cardY += cardHeight + 10;
    } else {
      cardX = margin + cardWidth + 10;
    }
  });

  // Render all section content with section divider pages
  includedSections.forEach((section, idx) => {
    // Add section divider page
    doc.addPage();
    const [r, g, b] = colors[idx % colors.length];
    
    // Section divider - colored header bar
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 60, "F");
    
    // Section number
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}`, pageWidth / 2, 42, { align: "center" });
    
    // Section title
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, pageWidth / 2, 100, { align: "center" });
    
    // Section subtitle
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(section.subtitle, pageWidth / 2, 120, { align: "center" });
    
    // Decorative line
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(2);
    doc.line(pageWidth / 2 - 40, 135, pageWidth / 2 + 40, 135);
    
    // List of tabs in this section
    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let tabListY = 160;
    section.pages.forEach((tab, tabIdx) => {
      doc.text(`${tabIdx + 1}. ${tab.title}`, pageWidth / 2, tabListY, { align: "center" });
      tabListY += 12;
    });
    
    // Render each tab
    section.pages.forEach((tab) => {
      doc.addPage();
      renderTabContent(doc, tab, margin);
    });
  });

  // Add footers (skip cover and index)
  const totalPages = doc.getNumberOfPages();
  for (let i = 3; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `(C) ${new Date().getFullYear()} Hobson AI - Confidential Investment Materials`,
      margin,
      pageHeight - 10
    );
    doc.text(`Page ${i - 2} of ${totalPages - 2}`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  doc.save("Hobson-Full-Business-Plan.pdf");
};
