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
        "Department for Business, Energy & Industrial Strategy (BEIS) / ONS",
        "- consistent with PropTech and operational AI adoption rates in traditional sectors (Deloitte, PwC, McKinsey).",
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
        
        // Architecture diagram - use taller aspect ratio (height/width = 0.95)
        // More portrait orientation as per actual image
        const naturalAspectRatio = 0.95;
        
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

  // Render all section content
  includedSections.forEach((section) => {
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
