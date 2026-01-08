import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { GlobalHeader } from "@/components/GlobalHeader";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import {
  Lock,
  FileText,
  Download,
  BarChart,
  TrendingUp,
  Code,
  Users,
  Target,
  Map,
  DollarSign,
  PieChart,
  Briefcase,
  BookOpen,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/OptimizedImage";
import hobsonLogo from "/hobson-logo.png";
import mvpArchitecture from "@/assets/mvp-ai-architecture.png";
import hobsonDevicesCombined from "@/assets/hobson-devices-combined.png";
import aiArchitectureDiagram from "@/assets/ai-architecture-diagram.jpg";
import plForecastChart from "@/assets/pl-forecast-chart.png";
import revenueGrowthChart from "@/assets/revenue-growth-chart.png";
import { CompetitiveLandscapeVisual } from "@/components/investor/CompetitiveLandscapeVisual";
import { CompetitiveMatrixVisual } from "@/components/investor/CompetitiveMatrixVisual";
import { EuropeanGlobalVisual } from "@/components/investor/EuropeanGlobalVisual";
import { HEUPricingVisual } from "@/components/investor/HEUPricingVisual";
import { AIProcessingVisual } from "@/components/investor/AIProcessingVisual";
import { SimpleUIVisual } from "@/components/investor/SimpleUIVisual";
import { GanttChartVisual } from "@/components/investor/GanttChartVisual";
import { EarlyRoadmapVisual } from "@/components/investor/EarlyRoadmapVisual";
import { UKMarketVisual } from "@/components/investor/UKMarketVisual";
import OnboardingCostsVisual from "@/components/investor/OnboardingCostsVisual";
import CompetitorAnalysisMatrix from "@/components/investor/CompetitorAnalysisMatrix";
import { TargetMarketVisual } from "@/components/investor/TargetMarketVisual";
import { SAMVisual } from "@/components/investor/SAMVisual";
import { UKMarketAssumptionsVisual } from "@/components/investor/UKMarketAssumptionsVisual";
import { UKAssumptionsFinancialsVisual } from "@/components/investor/UKAssumptionsFinancialsVisual";
import { GlobalMarketAssumptionsVisual } from "@/components/investor/GlobalMarketAssumptionsVisual";
import MarketShareJustificationVisual from "@/components/investor/MarketShareJustificationVisual";
import RevenueModelVisual from "@/components/investor/RevenueModelVisual";
import GlobalJustificationVisual from "@/components/investor/GlobalJustificationVisual";
import RevenueGrowthVisual from "@/components/investor/RevenueGrowthVisual";
import CostAssumptionsVisual from "@/components/investor/CostAssumptionsVisual";
import PLAssumptionsVisual from "@/components/investor/PLAssumptionsVisual";
import PLGrowthVisual from "@/components/investor/PLGrowthVisual";
import CACAssumptionsVisual from "@/components/investor/CACAssumptionsVisual";
import { ExecutiveSummaryVisual } from "@/components/investor/ExecutiveSummaryVisual";
import { ApproachVisual } from "@/components/investor/ApproachVisual";
import { CustomerSegmentationVisual } from "@/components/investor/CustomerSegmentationVisual";
import { SectorScaleOpportunityVisual } from "@/components/investor/SectorScaleOpportunityVisual";

import { PilotClientsVisual } from "@/components/investor/PilotClientsVisual";
import { TechStackVisual } from "@/components/investor/TechStackVisual";
import WhyNowVisual from "@/components/investor/WhyNowVisual";
import { WhyNowSpeedVisual } from "@/components/investor/WhyNowSpeedVisual";
import OurVisionVisual from "@/components/investor/OurVisionVisual";
import ProductVisionVisual from "@/components/investor/ProductVisionVisual";
import { CustomersMarketSourcesVisual } from "@/components/investor/CustomersMarketSourcesVisual";
import { TeamCredibilityVisual } from "@/components/investor/TeamCredibilityVisual";
import { FoundingLeadershipVisual } from "@/components/investor/FoundingLeadershipVisual";
import { TeamVisual } from "@/components/investor/TeamVisual";
import { RaiseVisual } from "@/components/investor/RaiseVisual";
import { CommercialisationStrategyVisual } from "@/components/investor/CommercialisationStrategyVisual";
import BusinessObjectivesVisual from "@/components/investor/BusinessObjectivesVisual";
import CommercialsVisual from "@/components/investor/CommercialsVisual";
import { MarketingSalesStrategyVisual } from "@/components/investor/MarketingSalesStrategyVisual";
import { ExecutiveContextVisual } from "@/components/investor/ExecutiveContextVisual";
import { SituationAnalysisVisual } from "@/components/investor/SituationAnalysisVisual";
import { CustomerPersonasVisual } from "@/components/investor/CustomerPersonasVisual";
import { CustomerUserJourneysVisual } from "@/components/investor/CustomerUserJourneysVisual";
import { MarketDescriptionVisual } from "@/components/investor/MarketDescriptionVisual";
import { CompetitorBenchmarksVisual } from "@/components/investor/CompetitorBenchmarksVisual";
import { CustomerOnlineBehaviourVisual } from "@/components/investor/CustomerOnlineBehaviourVisual";
import { BrandIntegrityVisual } from "@/components/investor/BrandIntegrityVisual";
import { PESTLEAnalysisVisual } from "@/components/investor/PESTLEAnalysisVisual";
import { InternalCapabilityAssessmentVisual } from "@/components/investor/InternalCapabilityAssessmentVisual";
import { SWOTAnalysisVisual } from "@/components/investor/SWOTAnalysisVisual";
import { MarketingObjectivesVisual } from "@/components/investor/MarketingObjectivesVisual";
import { BrandStrategyVisual } from "@/components/investor/BrandStrategyVisual";
import { ContentEngagementStrategyVisual } from "@/components/investor/ContentEngagementStrategyVisual";
import { PrimaryConversionChannelsVisual } from "@/components/investor/PrimaryConversionChannelsVisual";
import { AcquisitionExecutiveSummaryVisual } from "@/components/investor/AcquisitionExecutiveSummaryVisual";
import { StrategicContextPositioningVisual } from "@/components/investor/StrategicContextPositioningVisual";
import { SegmentationStrategyVisual } from "@/components/investor/SegmentationStrategyVisual";
import { ThePropositionVisual } from "@/components/investor/ThePropositionVisual";
import { FinancialsExecutiveSummaryVisual } from "@/components/investor/FinancialsExecutiveSummaryVisual";

import CapitalRaiseStrategyVisual from "@/components/investor/CapitalRaiseStrategyVisual";
import { getCompetitorPdfContent } from "@/components/investor/data/competitorData";
import { generateCardPdf, generateFullBusinessPlanPdf, CardSection, BusinessPlanCards, FundingRequirement } from "@/utils/investmentPdfGenerator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { jsPDF } from "jspdf";

// Section data with pages
const sections = [
  {
    id: "strategy",
    title: "Strategy & Approach",
    subtitle: "Summary & Strategic Approach",
    icon: Target,
    color: "from-blue-500/10 to-blue-600/10",
    iconColor: "text-blue-600",
    pages: [
      {
        title: "Executive Summary",
        showCustomVisual: true,
        customVisualComponent: "executiveSummary",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Our Vision",
        showCustomVisual: true,
        customVisualComponent: "ourVision",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Why Now?",
        showCustomVisual: true,
        customVisualComponent: "whyNow",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Strategic Approach",
        showCustomVisual: true,
        customVisualComponent: "approach",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Team Credibility",
        showCustomVisual: true,
        customVisualComponent: "teamCredibility",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Raise",
        showCustomVisual: true,
        customVisualComponent: "raise",
        content: {
          overview: "",
          sections: [],
        },
      },
    ],
  },
  {
    id: "market",
    title: "Customers & Market",
    subtitle: "UK & Global opportunities",
    icon: Users,
    color: "from-purple-500/10 to-purple-600/10",
    iconColor: "text-purple-600",
    pages: [
      {
        title: "Sector Scale & Opportunity",
        showCustomVisual: true,
        customVisualComponent: "sectorScaleOpportunity",
        content: {
          overview: "",
          sections: [
            {
              title: "Document-Governed Industry",
              items: [
                "Every core activity is governed by complex, long-lived documents",
                "Operations, planning applications, funding and refinancing",
                "Acquisitions, disposals, leasing, compliance",
                "ESG reporting and asset management",
              ],
            },
            {
              title: "Compounding Complexity",
              items: [
                "Unlike many sectors, this document burden does not shrink with digitisation",
                "It compounds over time as portfolios grow",
                "Regulation increases annually",
                "Reporting standards continue to tighten",
              ],
            },
            {
              title: "Structural Demand",
              items: [
                "Real Estate represents structurally persistent demand for document intelligence",
                "Not a cyclical or discretionary software market",
                "Fundamental operational necessity",
                "Growing regulatory and compliance requirements",
              ],
            },
          ],
        },
      },
      {
        title: "Customer Segmentation",
        showCustomVisual: true,
        customVisualComponent: "customerSegmentation",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "UK Market Size",
        showCustomVisual: true,
        customVisualComponent: "ukMarketAssumptions",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Global Opportunity",
        showCustomVisual: true,
        customVisualComponent: "europeanGlobal",
        content: {
          overview: "Market expansion opportunities across European and Global markets",
          sections: [
            {
              title: "Europe",
              subtitle: "11× UK Population Multiple",
              items: [
                "Europe's population is 11× larger than the UK",
                "UK efficiency value per business: £6,000 (20% time gain)",
                "UK TAM baseline: £1.41B",
                "Applying the 11× multiple gives a simple, directional estimate",
                "Same conservative assumptions: 65% motivated (SAM), 12% obtainable (SOM)",
              ],
            },
            {
              title: "Total Addressable Market (TAM)",
              subtitle: "£15.5B",
              items: [
                "Scaling the UK's £1.41B efficiency value by Europe's 11× population multiple",
                "£1.41B × 11 = £15.51B, rounded to £15.5B",
                "Represents the annual efficiency value across Europe for AI-driven document and information workflows in real estate",
              ],
            },
            {
              title: "Serviceable Available Market (SAM)",
              subtitle: "£10.1B",
              items: [
                "The proportion of European real estate operators realistically motivated and ready to adopt AI tools",
                "Uses the same 65% factor as the UK",
                "£15.5B × 65% = £10.1B",
              ],
            },
            {
              title: "Serviceable Obtainable Market (SOM)",
              subtitle: "£1.2B",
              items: [
                "A credible near-term reach for Hobson within Europe",
                "Assumes 12% penetration of motivated organisations",
                "£10.1B × 12% = £1.21B, rounded to £1.2B",
              ],
            },
            {
              title: "Summary",
              items: [
                "Europe's population is 11× larger than the UK, creating a major expansion opportunity.",
                "Using the UK's £6,000 efficiency saving per business and £1.41B TAM as the baseline, Europe represents a £15.5B TAM.",
                "With 65% of operators realistically motivated to adopt AI, the SAM is £10.1B.",
                "Assuming 12% penetration, Hobson's near-term obtainable market (SOM) is £1.2B.",
                "Europe's fragmented systems, compliance demands, and multilingual documentation make AI-native assistants especially valuable.",
                "Represents a high-potential early export region for Hobson.",
              ],
            },
            {
              title: "Global",
              subtitle: "118× UK Population Multiple",
              items: [
                "The global population is 118× larger than the UK",
                "UK efficiency value per business: £6,000 (20% time gain)",
                "UK TAM baseline: £1.41B",
                "Applying the 118× multiple provides a simple, directional global estimate",
                "Same conservative assumptions: 65% motivated (SAM), 12% obtainable (SOM)",
              ],
            },
            {
              title: "Total Addressable Market (TAM)",
              subtitle: "£155.6B",
              items: [
                "Scaling the UK's £1.41B efficiency value by the global population multiple",
                "£1.41B × 118 = £166.4B, rounded to £155.6B for conservatism",
                "Represents the worldwide opportunity for AI-driven efficiency gains in real estate document workflows",
              ],
            },
            {
              title: "Serviceable Available Market (SAM)",
              subtitle: "£101B",
              items: [
                "The share of the global market realistically motivated and able to adopt AI tools",
                "Uses the same 65% factor as the UK",
                "£155.6B × 65% = £101B",
              ],
            },
            {
              title: "Serviceable Obtainable Market (SOM)",
              subtitle: "£12.1B",
              items: [
                "Credible near-term reach for Hobson in global markets",
                "Assumes 12% penetration of motivated buyers",
                "£101B × 12% = £12.1B",
              ],
            },
            {
              title: "Summary",
              items: [
                "The global population is 118× larger than the UK, giving Hobson exceptional international scalability.",
                "Applying the UK's £6,000 efficiency saving and £1.41B TAM, the global TAM reaches £155.6B.",
                "With 65% global motivation to adopt AI, the SAM is £101B.",
                "At 12% penetration, Hobson's obtainable global market (SOM) is £12.1B.",
                "Highlights a massive, underserved global opportunity for AI-driven document and workflow automation.",
                "Positions Hobson as an export-ready solution capable of adapting across geographies and regulatory contexts.",
              ],
            },
          ],
        },
      },
      {
        title: "Competitive Landscape",
        showCustomVisual: true,
        customVisualComponent: "landscape",
        content: {
          // NOTE: PDF uses the custom visual renderer for this page.
          // Keep overview empty so we never render stale/duplicate copy above the visual.
          overview: "",
          sections: [
            {
              title: "Context: A Category Still Forming",
              subtitle: "Despite the size of the sector:",
              items: [],
            },
            {
              title: "Current Market Gaps",
              items: [
                "Legacy Prop Tech platforms are system-of-record for transactions, not intelligence",
                "Horizontal AI tools lack domain depth, accuracy, and auditability",
                "No AI-native platform has yet become the default intelligence layer for real estate documents",
              ],
            },
            {
              title: "This creates a rare situation:",
              items: [
                "Large, conservative market",
                "Clear structural pain",
                "No entrenched AI leader",
                "Markets like this tend to consolidate quickly once a trusted standard emerges.",
              ],
            },
            {
              title: "The After: AI-Native Intelligence Layers",
              items: [
                "Real-time reasoning",
                "Instant, referenced answers",
                "Embedded into workflows",
              ],
            },
            {
              title: "What This Means for Hobson",
              items: [
                "Hobson is positioned within a large and durable UK vertical, a global market undergoing structural change and an industry where early trust compounds into long-term defensibility.",
                "This section is not about pricing or near-term monetisation. It establishes why this market is worth building infrastructure for and why the upside is category-scale.",
              ],
            },
          ],
        },
      },
      {
        title: "Competitor Analysis",
        showCustomVisual: true,
        customVisualComponent: "competitorAnalysis",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Why Now – Why Speed",
        showCustomVisual: true,
        customVisualComponent: "whyNowSpeed",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Customers & Market Sources",
        showCustomVisual: true,
        customVisualComponent: "customersMarketSources",
        content: {
          overview: "",
          sections: [],
        },
      },
    ],
  },
  {
    id: "roadmap",
    title: "Product Vision & Roadmap",
    subtitle: "Timeline & Innovation",
    icon: Map,
    color: "from-green-500/10 to-green-600/10",
    iconColor: "text-green-600",
    pages: [
      {
        title: "Product Vision",
        showCustomVisual: true,
        customVisualComponent: "productVision",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Timeline and Innovation",
        showCustomVisual: true,
        customVisualComponent: "earlyRoadmap",
        content: {
          overview:
            "Strategic product development timeline covering discovery, validation, and development phases.",
          sections: [
            {
              title: "May – Aug 2024: Discover",
              items: [
                "Client discovery calls with real estate professionals",
                "Establish the core problem being solved",
                "Identify pain points in existing systems",
                "Define target market segments",
              ],
            },
            {
              title: "Sept – Dec 2024: Validate",
              items: [
                "Establish four working partnerships with real estate firms",
                "No-code concepts validation",
                "Scope the MVP based on partner feedback",
                "Refine value proposition and feature set",
              ],
            },
            {
              title: "Jan – Dec 2025: Develop",
              items: [
                "Build MVP: Phase 1 with core AI capabilities",
                "Build online presence and branding",
                "Testing MVP with key clients data",
                "Finalise pricing strategy based on usage data",
                "Build pricing plan",
                "Build a marketing plan",
                "Build a business plan and financial model",
              ],
            },
          ],
        },
      },
      {
        title: "AI Architecture",
        image: aiArchitectureDiagram,
        content: {
          overview:
            "When traditional RAG approaches failed to meet the accuracy and reliability required for property and legal data, we moved quickly—building a structured, governed retrieval model designed for enterprise use. This gives us predictable performance, clear auditability, and a defensible system of record.\n\nWith this foundation in place, we will reintroduce RAG selectively to accelerate onboarding, broaden question coverage, and enhance the user experience through discovery and summarisation—without compromising the integrity of governed facts or legal authority.",
          sections: [],
        },
      },
      {
        title: "Simple UI",
        showCustomVisual: true,
        customVisualComponent: "simpleUI",
        pdfImage: hobsonDevicesCombined,
        content: {
          overview:
            "No Onboarding Required. Upload documents and start asking questions immediately. Simple, intuitive interfaces across all devices.",
          sections: [
            {
              title: "Cross-Platform Interfaces",
              items: [
                "🖥️ Web Interface: Property Map View with satellite imagery and navigation",
                "📱 Mobile Chat Interface: Conversational AI on the go",
              ],
            },
            {
              title: "Key Benefits",
              items: [
                "⚡ Instant Start: Begin using immediately with no setup required",
                "🎯 Zero Training: Intuitive design anyone can use from day one",
                "💬 Natural Language: Ask questions in plain English",
                "📱 Any Device: Works seamlessly on desktop, tablet, and mobile",
              ],
            },
          ],
        },
      },
      {
        title: "Tech Stack",
        showCustomVisual: true,
        customVisualComponent: "techStack",
        content: {
          overview: "",
          sections: [],
        },
      },
    ],
  },
  {
    id: "commercials",
    title: "Commercials",
    subtitle: "Pricing transparency",
    icon: DollarSign,
    color: "from-amber-500/10 to-amber-600/10",
    iconColor: "text-amber-600",
    pages: [
      {
        title: "Commercialisation Strategy",
        showCustomVisual: true,
        customVisualComponent: "commercialisationStrategy",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Business Objectives",
        showCustomVisual: true,
        customVisualComponent: "businessObjectives",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "HEU & Pricing",
        showCustomVisual: true,
        customVisualComponent: "heuPricing",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Commercial Philosophy",
        showCustomVisual: true,
        customVisualComponent: "commercials",
        content: {
          overview: "",
          sections: [],
        },
      },
    ],
  },
  {
    id: "team",
    title: "Leadership & Team",
    subtitle: "Leadership & Key Personnel",
    icon: Briefcase,
    color: "from-indigo-500/10 to-indigo-600/10",
    iconColor: "text-indigo-600",
    pages: [
      {
        title: "Founding & Leadership",
        showCustomVisual: true,
        customVisualComponent: "foundingLeadership",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Team",
        showCustomVisual: true,
        customVisualComponent: "team",
        content: {
          overview: "",
          sections: [],
        },
      },
    ],
  },
  {
    id: "marketing-sales",
    title: "Marketing Strategy",
    subtitle: "Marketing & Branding",
    icon: Target,
    color: "from-teal-500/10 to-teal-600/10",
    iconColor: "text-teal-600",
    pages: [
      {
        title: "Executive Summary",
        showCustomVisual: true,
        customVisualComponent: "executiveContext",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Situation Analysis",
        showCustomVisual: true,
        customVisualComponent: "situationAnalysis",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Customer Personas",
        showCustomVisual: true,
        customVisualComponent: "customerPersonas",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Customer User Journeys",
        showCustomVisual: true,
        customVisualComponent: "customerUserJourneys",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Market Description",
        showCustomVisual: true,
        customVisualComponent: "marketDescription",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Competitor Benchmarks",
        showCustomVisual: true,
        customVisualComponent: "competitorBenchmarks",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Customer Online Behaviour",
        showCustomVisual: true,
        customVisualComponent: "customerOnlineBehaviour",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Brand Integrity, Perception & Positioning",
        showCustomVisual: true,
        customVisualComponent: "brandIntegrity",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "PESTLE Analysis",
        showCustomVisual: true,
        customVisualComponent: "pestleAnalysis",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Internal Capability Assessment",
        showCustomVisual: true,
        customVisualComponent: "internalCapabilityAssessment",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "SWOT Analysis",
        showCustomVisual: true,
        customVisualComponent: "swotAnalysis",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Marketing Objectives",
        showCustomVisual: true,
        customVisualComponent: "marketingObjectives",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Brand Strategy",
        showCustomVisual: true,
        customVisualComponent: "brandStrategy",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Content and Engagement Strategy",
        showCustomVisual: true,
        customVisualComponent: "contentEngagementStrategy",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Primary Conversion Channels",
        showCustomVisual: true,
        customVisualComponent: "primaryConversionChannels",
        content: {
          overview: "",
          sections: [],
        },
      },
    ],
  },
  {
    id: "acquisition-sales",
    title: "Acquisition & Sales Strategy",
    subtitle: "Customer Acquisition Plan",
    icon: TrendingUp,
    color: "from-cyan-500/10 to-cyan-600/10",
    iconColor: "text-cyan-600",
    pages: [
      {
        title: "Executive Summary",
        showCustomVisual: true,
        customVisualComponent: "acquisitionExecutiveSummary",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Strategic Context & Positioning",
        showCustomVisual: true,
        customVisualComponent: "strategicContextPositioning",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Organisational Positioning",
        showCustomVisual: true,
        customVisualComponent: "segmentationStrategy",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "The Proposition",
        showCustomVisual: true,
        customVisualComponent: "theProposition",
        content: {
          overview: "",
          sections: [],
        },
      },
    ],
  },
  {
    id: "financials",
    title: "Financial Overview & Assumptions",
    subtitle: "Forecasts & Assumptions",
    icon: PieChart,
    color: "from-red-500/10 to-red-600/10",
    iconColor: "text-red-600",
    pages: [
      {
        title: "Executive Summary",
        showCustomVisual: true,
        customVisualComponent: "financialsExecutiveSummary",
        content: {
          overview: "Hobson's financial profile reflects the creation of a new infrastructure layer for Real Estate operations.\n\nThis is not a conventional SaaS growth story. It is the monetisation of unavoidable structural change in one of the world's largest, most document-intensive industries, driven by regulatory escalation, labour scarcity, margin compression, and compounding operational complexity.\n\nThe business converts existing, locked-in operating costs into high-margin, recurring revenue, producing a growth model that is both aggressive in trajectory and unusually low in commercial risk.\n\nWith a £1.8M seed round, Hobson funds the full 2026 build year and enters 2027 fully staffed, production-ready, and positioned for rapid commercial expansion. From close to launch, the company becomes cash flow positive quickly, with operating leverage increasing each year as adoption compounds and automation deepens.",
          sections: [
            {
              title: "Five-Year Financial Model Delivers",
              items: [
                "Revenue growth from £1.17M in 2027 to £14.92M by 2031",
                "~90% five-year CAGR",
                "85–90%+ gross margins with net margins expanding toward 40–55% at scale",
                "EBITDA breakeven above £5M ARR, reached early in the forecast period",
                "Infrastructure-grade unit economics with rapid CAC payback",
              ],
            },
            {
              title: "Structural Performance",
              items: [
                "This performance is driven by structural market forces, not discretionary software demand.",
                "Hobson's usage-based model scales automatically with customer complexity, regulatory burden, and portfolio growth, creating built-in net revenue expansion and durable long-term defensibility.",
              ],
            },
          ],
        },
      },
      {
        title: "Capital Raise Strategy",
        showCustomVisual: true,
        customVisualComponent: "capitalRaiseStrategy",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Commercial Trajectory",
        showCustomVisual: true,
        customVisualComponent: "revenueGrowth",
        pdfImage: revenueGrowthChart,
        imageAlt: "Revenue Growth Chart 2027-2031",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "P/L Growth",
        showCustomVisual: true,
        customVisualComponent: "plGrowth",
        pdfImage: plForecastChart,
        imageAlt: "P/L Growth Forecast 2027-2031",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "UK Assumptions",
        showCustomVisual: true,
        customVisualComponent: "ukAssumptionsFinancials",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Global Assumptions",
        showCustomVisual: true,
        customVisualComponent: "globalJustification",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Market Penetration",
        showCustomVisual: true,
        customVisualComponent: "marketShareJustification",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Revenue Model",
        showCustomVisual: true,
        customVisualComponent: "revenueModel",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Cost Assumptions",
        showCustomVisual: true,
        customVisualComponent: "costAssumptions",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "Onboarding Cost Detail",
        showCustomVisual: true,
        customVisualComponent: "onboardingCosts",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "P/L Assumptions",
        showCustomVisual: true,
        customVisualComponent: "plAssumptions",
        content: {
          overview: "",
          sections: [],
        },
      },
      {
        title: "CAC Assumptions",
        showCustomVisual: true,
        customVisualComponent: "cacAssumptions",
        content: {
          overview: "",
          sections: [],
        },
      },
    ],
  },
  {
    id: "financial-downloads",
    title: "Financial Modeling Downloads",
    subtitle: "Detailed Financial Spreadsheets",
    icon: FileSpreadsheet,
    color: "from-emerald-500/10 to-emerald-600/10",
    iconColor: "text-emerald-600",
    pages: [
      {
        title: "Available Downloads",
        content: {
          overview: "",
          sections: [],
        },
        downloads: [
          { name: "Financial Projections 2025-2030.xlsx", path: "/financials/projections.xlsx" },
          { name: "Operating Expenses Breakdown.xlsx", path: "/financials/opex.xlsx" },
          { name: "Revenue Model.xlsx", path: "/financials/revenue.xlsx" },
          { name: "Unit Economics.xlsx", path: "/financials/unit-economics.xlsx" },
        ],
      },
    ],
  },
];

// Investment Opportunity Page Component
const InvestmentOpportunity = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<(typeof sections)[0] | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const navigate = useNavigate();
  const contentScrollRef = React.useRef<HTMLDivElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  // Focus password input when page loads
  React.useEffect(() => {
    if (!isAuthenticated && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [isAuthenticated]);

  // Scroll to top when tab changes or modal opens
  React.useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentPageIndex, selectedSection]);
  const { toast } = useToast();

  // Function to generate PDF from section data - uses new architecture
  const generatePDF = (section: (typeof sections)[0]) => {
    generateCardPdf(section as CardSection);
  };

  // Function to generate combined PDF with all sections - uses new architecture
  const generateFullBusinessPlan = () => {
    // Explicit mapping of cards by their purpose
    const cards: BusinessPlanCards = {
      strategyPositioning: sections[0] as CardSection,  // Strategy & Positioning
      customersMarket: sections[1] as CardSection,       // Customers & Market
      roadmapProduct: sections[2] as CardSection,        // Roadmap & Product
      commercials: sections[3] as CardSection,           // Commercials
      team: sections[4] as CardSection,                  // Team
      marketingSales: sections[5] as CardSection,        // Marketing & Sales Strategy
      acquisitionSales: sections[6] as CardSection,      // Acquisition & Sales Strategy
      financials: sections[7] as CardSection,            // Financials
    };
    
    // Funding requirement data for cover page
    const fundingRequirement: FundingRequirement = {
      amount: "£1.8M",
      description: "",
    };
    
    generateFullBusinessPlanPdf(cards, fundingRequirement);
  };

  // Check if user has already authenticated in this session
  useEffect(() => {
    const authenticated = sessionStorage.getItem("investment_authenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }

    // Clear authentication when navigating away or closing the page
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("investment_authenticated");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup: Remove auth when component unmounts (user navigates away)
    return () => {
      sessionStorage.removeItem("investment_authenticated");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call edge function to verify password
      const { data, error } = await supabase.functions.invoke("verify-investment-password", {
        body: { password },
      });

      if (error) throw error;

      if (data.valid) {
        sessionStorage.setItem("investment_authenticated", "true");
        setIsAuthenticated(true);
        toast({
          title: "Access Granted",
          description: "Welcome to the Investment Opportunity page",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password",
          variant: "destructive",
        });
        setPassword("");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <GlobalHeader />
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <Card className="w-full max-w-md p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-center mb-2">Investment Opportunity</h1>
              <p className="text-muted-foreground text-center text-sm">This page is password protected</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="text-sm font-medium mb-2 block">
                  Password
                </label>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                  className="w-full"
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Access Page"}
              </Button>
            </form>
          </Card>
        </div>
        <HomepageFooter />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto gap-2">
              <Link to="/" className="transition-opacity hover:opacity-80">
                <OptimizedImage src={hobsonLogo} alt="Hobson AI Logo" className="h-8 sm:h-10 md:h-12" />
              </Link>
              <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-foreground">Investment Opportunity</h1>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-6 sm:py-8 md:py-12 border-b bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-5xl mx-auto">
              {/* Mission Statement */}
              <div className="mb-10 sm:mb-12 pb-8 sm:pb-10 border-b border-border/40">
                <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3 text-center">
                  Mission Statement
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed text-center max-w-4xl mx-auto">
                  <span className="text-primary font-semibold">Innovation without disruption.</span> To become the intelligence layer real estate runs on—ensuring every operational decision is based on instant, auditable insight rather than manual search, institutional memory, or guesswork.
                </p>
              </div>

              {/* Positioning Statement */}
              <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b">
                <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3 text-center">
                  Positioning Statement
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed text-center max-w-4xl mx-auto">
                  <span className="text-primary font-semibold">Disruption without displacement.</span> Hobson replaces manual document work in real estate with AI-driven reasoning, delivering instant, traceable answers that reduce staffing costs, prevent costly errors, and accelerate operational decision-making. It embeds directly into existing workflows, becoming the intelligence infrastructure modern real estate operations require to compete.
                </p>
              </div>

              {/* Funding Requirement Section */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 sm:p-8 text-center max-w-sm">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Funding Requirement
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">£1.8M</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic text-center mt-6">
                Materials on this page are confidential and intended for authorised investors only
              </p>
            </div>
          </div>
        </section>

        {/* Section Cards Grid */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Business Plan Sections</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto px-2">
                  Explore individual sections below to view detailed information or download as separate documents, or
                </p>
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300"
                  onClick={() => setShowDownloadConfirm(true)}
                >
                  <Download className="w-4 h-4" />
                  Download Complete Business Plan
                </Button>
              </div>

              {/* Download Confirmation Dialog */}
              <Dialog open={showDownloadConfirm} onOpenChange={setShowDownloadConfirm}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Download Business Plan PDF</DialogTitle>
                    <DialogDescription className="pt-2">
                      The following sections will be included in your PDF:
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Included:</p>
                      <ul className="space-y-1">
                        {[
                          "Strategy & Approach",
                          "Customers & Market",
                          "Product Vision & Roadmap",
                          "Commercials",
                          "Leadership & Team",
                          "Marketing Strategy",
                          "Acquisition & Sales Strategy",
                          "Financial Overview & Assumptions"
                        ].map((title) => (
                          <li key={title} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {title}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Not Included:</p>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                          Financial Modeling Downloads
                          <span className="text-xs text-muted-foreground/70">(download separately)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowDownloadConfirm(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setShowDownloadConfirm(false);
                        try {
                          toast({
                            title: "Generating Business Plan",
                            description: "Combining sections into one PDF...",
                          });
                          generateFullBusinessPlan();
                          toast({
                            title: "PDF Downloaded",
                            description: "Business Plan has been saved to your downloads folder",
                          });
                        } catch (error) {
                          console.error("Error generating business plan:", error);
                          toast({
                            title: "Error",
                            description: "Failed to generate PDF. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sections.map((section) => (
                  <Card
                    key={section.id}
                    className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
                  >
                    <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <section.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${section.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-foreground mb-1">{section.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{section.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(section as any).directDownload ? (
                          <Button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const response = await fetch((section as any).directDownload.path);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = (section as any).directDownload.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('Download failed:', error);
                              }
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1.5 sm:gap-2 h-9 text-xs sm:text-sm"
                          >
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Download Word</span>
                            <span className="xs:hidden">Word</span>
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSection(section);
                              }}
                              variant="secondary"
                              size="sm"
                              className="flex-1 gap-1.5 sm:gap-2 h-9 text-xs sm:text-sm"
                            >
                              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">View</span>
                              <span className="xs:hidden">View</span>
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();

                                try {
                                  toast({
                                    title: "Generating PDF",
                                    description: "Creating your document...",
                                  });

                                  generatePDF(section);

                                  toast({
                                    title: "PDF Downloaded",
                                    description: `${section.title} PDF has been saved to your downloads folder`,
                                  });
                                } catch (error) {
                                  console.error("Error generating PDF:", error);
                                  toast({
                                    title: "Error",
                                    description: "Failed to generate PDF. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              variant="outline"
                              size="sm"
                              className="flex-1 gap-1.5 sm:gap-2 h-9 text-xs sm:text-sm"
                            >
                              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">Download {section.id === "financial-downloads" ? "Excel" : "PDF"}</span>
                              <span className="xs:hidden">{section.id === "financial-downloads" ? "Excel" : "PDF"}</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link to="/" className="inline-block transition-opacity hover:opacity-80">
                <OptimizedImage src={hobsonLogo} alt="Hobson AI Logo" className="h-12 mx-auto mb-4" />
              </Link>
              <p className="text-sm text-muted-foreground mb-2">© 2024 Hobson's Choice AI. All rights reserved.</p>
              <p className="text-sm text-muted-foreground">
                Investor Relations:{" "}
                <a href="mailto:rochelle.t@hobsonschoice.ai" className="text-primary hover:underline">
                  rochelle.t@hobsonschoice.ai
                </a>
              </p>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Confidential and proprietary. Not for distribution.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal Dialog */}
      <Dialog
        open={!!selectedSection}
        onOpenChange={() => {
          setSelectedSection(null);
          setCurrentPageIndex(0);
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[95vh] sm:max-h-[92vh] overflow-hidden flex flex-col p-4 sm:p-6">
          {selectedSection && (
            <>
              <DialogHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-3 sm:gap-4 mb-2">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${selectedSection.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <selectedSection.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedSection.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl">{selectedSection.title}</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1">
                      {selectedSection.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Page Navigation Tabs */}
              {selectedSection.pages.length > 1 && (
                <div className="border-b -mx-4 sm:-mx-6 px-4 sm:px-6">
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {selectedSection.pages.map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPageIndex(idx)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors flex-shrink-0 ${
                          currentPageIndex === idx
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {page.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div ref={contentScrollRef} className="flex-1 overflow-y-auto mt-4 sm:mt-6 space-y-6 sm:space-y-8 -mx-4 sm:-mx-6 px-4 sm:px-6">
                {selectedSection.pages[currentPageIndex] && (
                  <>
                    {/* Custom Visual Component for Executive Summary */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "executiveSummary" && (
                      <ExecutiveSummaryVisual />
                    )}

                    {/* Custom Visual Component for Approach */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "approach" && (
                      <ApproachVisual />
                    )}

                    {/* Custom Visual Component for Our Vision */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "ourVision" && (
                      <OurVisionVisual />
                    )}

                    {/* Custom Visual Component for Why Now */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "whyNow" && (
                      <WhyNowVisual />
                    )}

                    {/* Custom Visual Component for Product Vision */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "productVision" && (
                      <ProductVisionVisual />
                    )}

                    {/* Custom Visual Component for Team Credibility */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "teamCredibility" && (
                      <TeamCredibilityVisual />
                    )}

                    {/* Custom Visual Component for Founding & Leadership */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "foundingLeadership" && (
                      <FoundingLeadershipVisual />
                    )}

                    {/* Custom Visual Component for Team */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "team" && (
                      <TeamVisual />
                    )}

                    {/* Custom Visual Component for Raise */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "raise" && (
                      <RaiseVisual />
                    )}

                    {/* Custom Visual Component for Sector Scale & Opportunity */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "sectorScaleOpportunity" && (
                      <SectorScaleOpportunityVisual />
                    )}

                    {/* Custom Visual Component for Customer Segmentation */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "customerSegmentation" && (
                      <CustomerSegmentationVisual />
                    )}


                    {/* Custom Visual Component for Pilot Clients */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "pilotClients" && (
                      <PilotClientsVisual />
                    )}

                    {/* Custom Visual Component for Market Landscape */}
                    {(selectedSection.pages[currentPageIndex] as any).showCustomVisual &&
                      (selectedSection.pages[currentPageIndex] as any).customVisualComponent === "landscape" && (
                        <CompetitiveLandscapeVisual />
                      )}

                    {/* Custom Visual Component for Market Overview */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "matrix" && (
                      <CompetitiveMatrixVisual />
                    )}

                    {/* Custom Visual Component for European & Global */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "europeanGlobal" && (
                      <EuropeanGlobalVisual />
                    )}

                    {/* Custom Visual Component for UK Market */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "ukMarket" && (
                      <UKMarketVisual />
                    )}

                    {/* Custom Visual Component for Commercialisation Strategy */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "commercialisationStrategy" && (
                      <CommercialisationStrategyVisual />
                    )}

                    {/* Custom Visual Component for Business Objectives */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "businessObjectives" && (
                      <BusinessObjectivesVisual />
                    )}

                    {/* Custom Visual Component for HEU & Pricing */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "heuPricing" && (
                      <HEUPricingVisual />
                    )}

                    {/* Custom Visual Component for Commercials */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "commercials" && (
                      <CommercialsVisual />
                    )}

                    {/* Custom Visual Component for Simple UI */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "simpleUI" && (
                      <SimpleUIVisual />
                    )}

                    {/* Custom Visual Component for Tech Stack */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "techStack" && (
                      <TechStackVisual />
                    )}

                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "competitorAnalysis" && (
                      <CompetitorAnalysisMatrix />
                    )}

                    {/* Custom Visual Component for Why Now Speed */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "whyNowSpeed" && (
                      <WhyNowSpeedVisual />
                    )}

                    {/* Custom Visual Component for Customers & Market Sources */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "customersMarketSources" && (
                      <CustomersMarketSourcesVisual />
                    )}

                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "ukMarketAssumptions" && (
                      <UKMarketAssumptionsVisual />
                    )}

                    {/* Custom Visual Component for UK Assumptions (Financials section) */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "ukAssumptionsFinancials" && (
                      <UKAssumptionsFinancialsVisual />
                    )}

                    {/* Custom Visual Component for Global Market Assumptions */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "globalMarketAssumptions" && (
                      <GlobalMarketAssumptionsVisual />
                    )}

                    {/* Custom Visual Component for Target Market */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "targetMarket" && (
                      <TargetMarketVisual />
                    )}

                    {/* Custom Visual Component for SAM */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "sam" && (
                      <SAMVisual />
                    )}

                    {/* Custom Visual Component for Onboarding Costs */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "onboardingCosts" && (
                      <OnboardingCostsVisual />
                    )}

                    {/* Custom Visual Component for Market Share Justification */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "marketShareJustification" && (
                      <MarketShareJustificationVisual />
                    )}

                    {/* Custom Visual Component for Revenue Model */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "revenueModel" && (
                      <RevenueModelVisual />
                    )}

                    {/* Custom Visual Component for Cost Assumptions */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "costAssumptions" && (
                      <CostAssumptionsVisual />
                    )}

                    {/* Custom Visual Component for P/L Assumptions */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "plAssumptions" && (
                      <PLAssumptionsVisual />
                    )}

                    {/* Custom Visual Component for CAC Assumptions */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "cacAssumptions" && (
                      <CACAssumptionsVisual />
                    )}


                    {/* Custom Visual Component for Global Justification */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "globalJustification" && (
                      <GlobalJustificationVisual />
                    )}

                    {/* Custom Visual Component for P/L Growth */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "plGrowth" && (
                      <PLGrowthVisual />
                    )}

                    {/* Custom Visual Component for Revenue Growth */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "revenueGrowth" && (
                      <RevenueGrowthVisual />
                    )}

                    {/* Custom Visual Component for Financials Executive Summary */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "financialsExecutiveSummary" && (
                      <FinancialsExecutiveSummaryVisual />
                    )}

                    {/* Custom Visual Component for Capital Raise Strategy */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "capitalRaiseStrategy" && (
                      <CapitalRaiseStrategyVisual />
                    )}

                    {/* Custom Visual Component for Gantt Chart */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "ganttChart" && (
                      <GanttChartVisual />
                    )}

                    {/* Custom Visual Component for Early Roadmap */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "earlyRoadmap" && (
                      <EarlyRoadmapVisual />
                    )}

                    {/* Custom Visual Component for Marketing & Sales Strategy */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "marketingSalesStrategy" && (
                      <MarketingSalesStrategyVisual />
                    )}

                    {/* Custom Visual Component for Executive Context */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "executiveContext" && (
                      <ExecutiveContextVisual />
                    )}

                    {/* Custom Visual Component for Situation Analysis */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "situationAnalysis" && (
                      <SituationAnalysisVisual />
                    )}

                    {/* Custom Visual Component for Customer Personas */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "customerPersonas" && (
                      <CustomerPersonasVisual />
                    )}

                    {/* Custom Visual Component for Customer User Journeys */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "customerUserJourneys" && (
                      <CustomerUserJourneysVisual />
                    )}

                    {/* Custom Visual Component for Market Description */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "marketDescription" && (
                      <MarketDescriptionVisual />
                    )}

                    {/* Custom Visual Component for Competitor Benchmarks */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "competitorBenchmarks" && (
                      <CompetitorBenchmarksVisual />
                    )}

                    {/* Custom Visual Component for Customer Online Behaviour */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "customerOnlineBehaviour" && (
                      <CustomerOnlineBehaviourVisual />
                    )}

                    {/* Custom Visual Component for Brand Integrity */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "brandIntegrity" && (
                      <BrandIntegrityVisual />
                    )}

                    {/* Custom Visual Component for PESTLE Analysis */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "pestleAnalysis" && (
                      <PESTLEAnalysisVisual />
                    )}

                    {/* Custom Visual Component for Internal Capability Assessment */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "internalCapabilityAssessment" && (
                      <InternalCapabilityAssessmentVisual />
                    )}

                    {/* Custom Visual Component for SWOT Analysis */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "swotAnalysis" && (
                      <SWOTAnalysisVisual />
                    )}

                    {/* Custom Visual Component for Marketing Objectives */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "marketingObjectives" && (
                      <MarketingObjectivesVisual />
                    )}

                    {/* Custom Visual Component for Brand Strategy */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "brandStrategy" && (
                      <BrandStrategyVisual />
                    )}

                    {/* Custom Visual Component for Content and Engagement Strategy */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "contentEngagementStrategy" && (
                      <ContentEngagementStrategyVisual />
                    )}

                    {/* Custom Visual Component for Primary Conversion Channels */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "primaryConversionChannels" && (
                      <PrimaryConversionChannelsVisual />
                    )}

                    {/* Custom Visual Component for Acquisition Executive Summary */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "acquisitionExecutiveSummary" && (
                      <AcquisitionExecutiveSummaryVisual />
                    )}
                    {/* Custom Visual Component for Strategic Context & Positioning */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "strategicContextPositioning" && (
                      <StrategicContextPositioningVisual />
                    )}
                    {/* Custom Visual Component for Segmentation Strategy */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "segmentationStrategy" && (
                      <SegmentationStrategyVisual />
                    )}
                    {/* Custom Visual Component for The Proposition */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "theProposition" && (
                      <ThePropositionVisual />
                    )}
                    {/* Custom Visual Component for AI Processing */}
                    {(selectedSection.pages[currentPageIndex] as any).isVisual && <AIProcessingVisual />}

                    {/* Overview */}
                    {!(selectedSection.pages[currentPageIndex] as any).showCustomVisual &&
                      !(selectedSection.pages[currentPageIndex] as any).isVisual && 
                      selectedSection.pages[currentPageIndex].content.overview && (
                        (() => {
                          const isAdvisoryPage = selectedSection.pages[currentPageIndex].title === "Advisory Board";
                          return (
                            <div className={`relative overflow-hidden rounded-xl border p-6 sm:p-8 ${
                              isAdvisoryPage 
                                ? "bg-gradient-to-r from-sky-50 via-sky-100/50 to-sky-50 border-sky-300/40" 
                                : "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20"
                            }`}>
                              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 ${
                                isAdvisoryPage ? "bg-sky-200/30" : "bg-primary/5"
                              }`} />
                              <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-1/2 -translate-x-1/2 ${
                                isAdvisoryPage ? "bg-sky-200/30" : "bg-primary/5"
                              }`} />
                              <div className="relative flex items-center gap-4">
                                <div className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0 ${
                                  isAdvisoryPage ? "bg-sky-200/50" : "bg-primary/10"
                                }`}>
                                  <Users className={`w-6 h-6 ${isAdvisoryPage ? "text-sky-700" : "text-primary"}`} />
                                </div>
                                <div className="text-sm sm:text-base md:text-lg text-foreground leading-relaxed font-medium space-y-4">
                                  {selectedSection.pages[currentPageIndex].content.overview.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      )}

                    {/* Image (if present) */}
                    {(selectedSection.pages[currentPageIndex] as any).image && (
                      <div className="w-full bg-background rounded-lg p-4 sm:p-6 border border-border mt-4">
                        <img
                          src={(selectedSection.pages[currentPageIndex] as any).image}
                          alt={(selectedSection.pages[currentPageIndex] as any).imageAlt || "Architecture diagram"}
                          className="w-full h-auto rounded-lg"
                          loading="eager"
                        />
                      </div>
                    )}

                    {/* Content Sections */}
                    {!(selectedSection.pages[currentPageIndex] as any).showCustomVisual &&
                      !(selectedSection.pages[currentPageIndex] as any).isVisual &&
                      selectedSection.pages[currentPageIndex].content.sections.map((contentSection: any, idx) => {
                        // Determine if section should have white background
                        const hasWhiteBg =
                          contentSection.teamMembers ||
                          /\d{4}:/.test(contentSection.title) ||
                          /^\d+\./.test(contentSection.title) ||
                          contentSection.title.includes("Operator") ||
                          contentSection.title.startsWith("Step") ||
                          contentSection.title.includes("Technical Components") ||
                          contentSection.title.includes("Focus") ||
                          contentSection.title.includes("Opportunity") ||
                          contentSection.title.includes("Model") ||
                          contentSection.title.includes("Traction") ||
                          contentSection.title.includes("Milestones") ||
                          contentSection.title.includes("TAM") ||
                          contentSection.title.includes("SAM") ||
                          contentSection.title.includes("SOM") ||
                          contentSection.title.includes("Overview") ||
                          contentSection.title.includes("Summary") ||
                          contentSection.title.includes("Traditional") ||
                          contentSection.title.includes("Next-Generation") ||
                          contentSection.title.includes("Competitive") ||
                          contentSection.title.includes("Europe") ||
                          contentSection.title.includes("Global") ||
                          contentSection.title.includes("Cloud") ||
                          contentSection.title.includes("Data") ||
                          contentSection.title.includes("Communication") ||
                          contentSection.title.includes("AI &") ||
                          contentSection.title.includes("Baseline") ||
                          contentSection.title.includes("Assumptions") ||
                          contentSection.title.includes("Why 12%") ||
                          contentSection.title.includes("Why a 12%") ||
                          contentSection.title.includes("Cost & Savings") ||
                          contentSection.title.includes("Verified Evidence") ||
                          contentSection.title.includes("Why This Matters") ||
                          contentSection.title.includes("Explosive") ||
                          contentSection.title.includes("Specialised") ||
                          contentSection.title.includes("Delivers") ||
                          contentSection.title.includes("Solving") ||
                          contentSection.title.includes("Learns") ||
                          contentSection.title.includes("Perfect Timing") ||
                          contentSection.title.includes("The Result");

                        return (
                          <div key={idx} className="space-y-3 sm:space-y-4">
                            <div
                              className={`${hasWhiteBg ? "bg-white border-b-2 border-primary/20" : "bg-primary"} rounded-lg px-4 py-3 mb-4`}
                            >
                              <h3
                                className={`text-base sm:text-lg md:text-xl font-bold ${hasWhiteBg ? "text-foreground" : "text-white"}`}
                              >
                                {contentSection.title}
                              </h3>
                              {contentSection.subtitle && (
                                <p
                                  className={`text-xs sm:text-sm mt-1 ${hasWhiteBg ? "text-muted-foreground" : "text-white/90"}`}
                                >
                                  {contentSection.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Team Members Grid */}
                            {contentSection.teamMembers ? (
                              (() => {
                                const isAdvisory = contentSection.title.includes("Advisory");
                                return (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {contentSection.teamMembers.map((member: any, memberIdx: number) => (
                                      <div
                                        key={memberIdx}
                                        className={`border-2 rounded-lg bg-white transition-colors overflow-hidden ${
                                          isAdvisory 
                                            ? "border-sky-300/50 hover:border-sky-400" 
                                            : "border-primary/30 hover:border-primary"
                                        }`}
                                      >
                                        <div className="text-center">
                                          <div className={`px-4 py-3 ${
                                            isAdvisory 
                                              ? "bg-gradient-to-r from-sky-100 to-sky-50" 
                                              : "bg-primary/20"
                                          }`}>
                                            <span className={`text-xs sm:text-sm font-semibold uppercase tracking-wide ${
                                              isAdvisory ? "text-slate-800" : "text-primary"
                                            }`}>
                                              {member.role}
                                            </span>
                                          </div>
                                          <div className="pt-2 px-4 pb-4 sm:pt-3 sm:px-6 sm:pb-6 space-y-3">
                                            <h4 className="text-lg sm:text-xl font-bold text-foreground min-h-[3rem] flex items-center justify-center">
                                              {member.name}
                                            </h4>
                                            {member.linkedin ? (
                                              <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-xs sm:text-sm underline inline-flex items-center gap-1 transition-colors ${
                                                  isAdvisory 
                                                    ? "text-sky-700 hover:text-sky-800" 
                                                    : "text-purple-800 hover:text-purple-900"
                                                }`}
                                              >
                                                <span>LinkedIn Profile</span>
                                                <span className="text-[10px]">↗</span>
                                              </a>
                                            ) : (
                                              <span className="text-xs sm:text-sm text-muted-foreground italic">
                                                Coming Soon
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()
                            ) : (
                              /* Regular Items List */
                              <ul className="space-y-2 sm:space-y-3 pl-3 sm:pl-4">
                                {contentSection.items?.map((item: string, itemIdx: number) => (
                                  <li key={itemIdx} className="flex items-start gap-2 sm:gap-3 text-foreground">
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/60 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                                    <span className="text-xs sm:text-sm md:text-base leading-relaxed">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {/* Conclusion without bullet */}
                            {contentSection.conclusion && (
                              <div className="bg-muted/30 border border-border rounded-lg p-3 lg:p-4 mt-4">
                                <p className="text-sm lg:text-base text-muted-foreground">
                                  {contentSection.conclusion}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {/* Downloads Section */}
                    {(selectedSection.pages[currentPageIndex] as any).downloads && (
                      <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                        <div className="mb-4">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">Download Files</h3>
                        </div>
                        <div className="flex items-center justify-center py-8 px-4 rounded-lg border border-dashed border-border/50 bg-muted/20">
                          <p className="text-sm text-muted-foreground">Not Yet Available</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Page Navigation Arrows */}
              {selectedSection.pages.length > 1 && (
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t mt-4 gap-2 -mx-4 sm:-mx-6 px-4 sm:px-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                    disabled={currentPageIndex === 0}
                    size="sm"
                    className="gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden xs:inline">Previous</span>
                    <span className="xs:hidden">Prev</span>
                  </Button>

                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {currentPageIndex + 1} / {selectedSection.pages.length}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPageIndex(Math.min(selectedSection.pages.length - 1, currentPageIndex + 1))
                    }
                    disabled={currentPageIndex === selectedSection.pages.length - 1}
                    size="sm"
                    className="gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <span className="hidden xs:inline">Next</span>
                    <span className="xs:hidden">Next</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvestmentOpportunity;
