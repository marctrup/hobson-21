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
import { CompetitiveLandscapeVisual } from "@/components/investor/CompetitiveLandscapeVisual";
import { CompetitiveMatrixVisual } from "@/components/investor/CompetitiveMatrixVisual";
import { EuropeanGlobalVisual } from "@/components/investor/EuropeanGlobalVisual";
import { HEUPricingVisual } from "@/components/investor/HEUPricingVisual";
import { AIProcessingVisual } from "@/components/investor/AIProcessingVisual";
import { SimpleUIVisual } from "@/components/investor/SimpleUIVisual";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { jsPDF } from "jspdf";

// Section data with pages
const sections = [
  {
    id: "strategy",
    title: "Strategy & Positioning",
    subtitle: "Executive Summary & Approach",
    icon: Target,
    color: "from-blue-500/10 to-blue-600/10",
    iconColor: "text-blue-600",
    pages: [
      {
        title: "Executive Summary",
        content: {
          overview:
            "Hobson is an AI-native assistant tailored for the real estate industry. It automates insight extraction, decision support, and document understanding—built for trust, accuracy, and zero onboarding. Hobson becomes smarter over time, evolving into a proactive operations co-pilot.",
          sections: [
            {
              title: "Market Opportunity",
              items: [
                "£6B UK efficiency savings potential",
                "£66B in Europe, £708B globally",
                "134K+ UK real estate firms; 96% are small operators",
                "PropTech is rapidly evolving from passive tools to intelligent assistants — Hobson leads this next wave",
              ],
            },
            {
              title: "Traction & Milestones",
              items: [
                "MVP live, validated with 4 real-world partners",
                "Partners include EPAM Asset Management, Live-in Guardians, and Landhold Investments",
                "Document types: leases, deeds, floorplans, certificates",
                "Phase 2 planned for Oct 2025: mobile, API, deeper AI",
              ],
            },
            {
              title: "Revenue Model",
              items: [
                "Usage-based via Hobson Energy Units (HEUs)",
                "No per-user or license fees",
                "Plans: Free, Monthly (£20+VAT), Onboarding, Top-up",
                "Typical cost: £0.54 for full lease extraction; ~£0.001 for simple queries",
              ],
            },
          ],
        },
      },
      {
        title: "Approach",
        content: {
          overview:
            "Our strategic approach combines AI innovation with deep real estate industry expertise to deliver unprecedented value through three key focus areas.",
          sections: [
            {
              title: "Brand Focus",
              items: [
                "Personalisation – Deliver relevant, context-aware experiences",
                "Integrity – Be transparent and set clear expectations",
                "Expectations – Meet essentials first, then exceed over time",
                "Resolution – Act on feedback and data to improve fast",
                "Time & Effort – Make every interaction simple and efficient",
                "Empathy – Design for real-world client challenges",
              ],
            },
            {
              title: "Product Focus",
              items: [
                "Helps users retrieve and unify information they already have, even if scattered across documents or systems",
                "Simple interface with no learning curve",
                "Works alongside existing tools, with a gentle adoption curve",
                "Designed to be a trust-building assistant, becoming more proactive and helpful over time",
                "Future vision: anticipates user needs, takes initiative, supports workflows",
              ],
            },
            {
              title: "Business Focus",
              items: [
                "No license, per-user, or per-asset pricing",
                "Users pay based on usage, measured in Hobson's Energy Units",
                "Transparent way to account for effort put into tasks (answering questions, reading documents, building reports)",
                "Flexible billing that matches real usage",
                "Low base cost to grab market share",
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "market",
    title: "Market & Customers",
    subtitle: "Customer Segmentation, Market Size, Competitive Landscape & Efficiency Savings",
    icon: Users,
    color: "from-purple-500/10 to-purple-600/10",
    iconColor: "text-purple-600",
    pages: [
      {
        title: "UK Market Opportunity",
        content: {
          overview:
            "UK real estate businesses: ≈235,200 • Average junior salary: £30,000 • 20% efficiency gain = £6,000 saved per employee • Assumes at least one admin/document-handling role per business (conservative)",
          sections: [
            {
              title: "Total Addressable Market (TAM)",
              subtitle: "Value: £1.41B",
              items: [
                "Total annual efficiency savings available across all UK real estate businesses from a 20% reduction in document-related admin time",
                "235,200 × £6,000 = £1.41B",
              ],
            },
            {
              title: "Serviceable Available Market (SAM)",
              subtitle: "Value: £917M",
              items: [
                "Real estate businesses motivated and able to adopt AI tools",
                "Assumes 65% adoption motivation, reflecting a realistic level for this traditional sector",
                "235,200 × 65% = 152,880 businesses",
                "152,880 × £6,000 = £917M",
              ],
            },
            {
              title: "Serviceable Obtainable Market (SOM)",
              subtitle: "Value: £110M",
              items: [
                "A credible early-stage share Hobson can capture based on simple onboarding, low cost, and strong user demand",
                "Assumes 12% market penetration within the motivated segment",
                "152,880 × 12% = 18,345 businesses",
                "18,345 × £6,000 = £110M",
              ],
            },
            {
              title: "Summary",
              items: [
                "The UK real estate market is large, fragmented, and admin-heavy",
                "Even modest efficiency gains create a £1.41B TAM",
                "Nearly £1B in realistic adoption potential",
                "Clear £110M attainable early market for Hobson's AI assistant",
              ],
            },
          ],
        },
      },
      {
        title: "Customer Segmentation and Efficiency Gains",
        content: {
          overview:
            "A 20% efficiency improvement = £6,000 saved per year per role, based on a UK junior admin salary of £30,000. This reflects time saved on searching, retrieving, and extracting information from leases and other documents.",
          sections: [
            {
              title: "Large Operators (50–250 employees)",
              items: [
                "High-admin organisations struggling with scattered data and slow information retrieval, needing automation and accuracy at scale.",
                "Efficiency Gain: Typically £30,000–£120,000+ per year, as multiple staff perform document-heavy tasks.",
              ],
            },
            {
              title: "Medium Operators (10–49 employees)",
              items: [
                "Agile teams overwhelmed by inboxes and shared drives, looking for efficient, low-overhead tools that eliminate manual searching.",
                "Efficiency Gain: Usually £6,000–£30,000 per year, depending on staff involved in document workflows.",
              ],
            },
            {
              title: "Small Operators (1–9 employees)",
              items: [
                "Time-poor owner-operators needing a simple, low-cost assistant that works instantly without onboarding or a tech stack.",
                "Efficiency Gain: At least £6,000 per year even with just one person handling admin/document tasks.",
              ],
            },
          ],
        },
      },
      {
        title: "European & Global Opportunities",
        showCustomVisual: true,
        customVisualComponent: "europeanGlobal",
        content: {
          overview: "Market expansion opportunities across European and Global markets",
          sections: [
            {
              title: "Europe Overview",
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
              title: "Europe TAM",
              subtitle: "£15.5B",
              items: [
                "Scaling the UK's £1.41B efficiency value by Europe's 11× population multiple",
                "£1.41B × 11 = £15.51B, rounded to £15.5B",
                "Represents the annual efficiency value across Europe for AI-driven document and information workflows in real estate",
              ],
            },
            {
              title: "Europe SAM",
              subtitle: "£10.1B",
              items: [
                "The proportion of European real estate operators realistically motivated and ready to adopt AI tools",
                "Uses the same 65% factor as the UK",
                "£15.5B × 65% = £10.1B",
              ],
            },
            {
              title: "Europe SOM",
              subtitle: "£1.2B",
              items: [
                "A credible near-term reach for Hobson within Europe",
                "Assumes 12% penetration of motivated organisations",
                "£10.1B × 12% = £1.21B, rounded to £1.2B",
              ],
            },
            {
              title: "Europe Summary",
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
              title: "Global Overview",
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
              title: "Global TAM",
              subtitle: "£155.6B",
              items: [
                "Scaling the UK's £1.41B efficiency value by the global population multiple",
                "£1.41B × 118 = £166.4B, rounded to £155.6B for conservatism",
                "Represents the worldwide opportunity for AI-driven efficiency gains in real estate document workflows",
              ],
            },
            {
              title: "Global SAM",
              subtitle: "£101B",
              items: [
                "The share of the global market realistically motivated and able to adopt AI tools",
                "Uses the same 65% factor as the UK",
                "£155.6B × 65% = £101B",
              ],
            },
            {
              title: "Global SOM",
              subtitle: "£12.1B",
              items: [
                "Credible near-term reach for Hobson in global markets",
                "Assumes 12% penetration of motivated buyers",
                "£101B × 12% = £12.1B",
              ],
            },
            {
              title: "Global Summary",
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
        title: "Market Landscape",
        showCustomVisual: true,
        content: {
          overview:
            "The next winners in real estate tech will be AI-native. Traditional cloud systems cannot deliver reasoning, accuracy, or instant answers — AI-native tools can.",
          sections: [
            {
              title: "Traditional Cloud Solutions",
              subtitle: 'The Overcrowded "Before"',
              items: [
                "Overcrowded market with 100+ competitors",
                "High cost, slow innovation cycles",
                "Still reliant on manual information retrieval",
                "Complex interfaces requiring extensive training",
                "Heavy infrastructure with long implementation times",
              ],
            },
            {
              title: "Next-Generation AI Solutions",
              subtitle: 'The Emerging "After"',
              items: [
                "Hobson (Category Leader) - AI-native assistant for real estate documents",
                "EliseAI - Conversational AI for real estate management",
                "Trudi - AI compliance assistant",
                "StanAI - Real estate document analysis",
                "Kendal AI - real estate operations automation",
              ],
            },
            {
              title: "Hobson's Competitive Advantages",
              items: [
                "Instant, referenced answers from source documents",
                "Simple, lightweight, and low cost entry point",
                "Designed for accuracy with citation-backed responses",
                "Zero onboarding required - works immediately",
                "Usage-based pricing eliminates adoption barriers",
                "Built for trust and continuous learning from user feedback",
              ],
            },
            {
              title: "Market Transition",
              items: [
                "The industry is shifting from passive cloud storage to active AI assistance",
                "Traditional PropTech focuses on data capture; AI-native tools deliver insights",
                "Winner-takes-most dynamics emerging in AI category",
                "Early movers building defensible positions through data and user trust",
                "Hobson positioned at the forefront of this category transition",
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "roadmap",
    title: "Roadmap & Product",
    subtitle: "Timeline, Milestones, Pilot clients & Development Philosophy",
    icon: Map,
    color: "from-green-500/10 to-green-600/10",
    iconColor: "text-green-600",
    pages: [
      {
        title: "Timeline & Milestones",
        content: {
          overview:
            "Strategic product development timeline from MVP to Phase 2 and beyond, structured across four key phases.",
          sections: [
            {
              title: "May - Aug 2024: Discover",
              items: [
                "Client discovery calls with real estate professionals",
                "Establish the core problem being solved",
                "Identify pain points in existing systems",
                "Define target market segments",
              ],
            },
            {
              title: "Sept-Dec 2024: Validate",
              items: [
                "Establish 4 working partnerships with real estate firms",
                "No-code concepts validation",
                "Scope the MVP (Phase 1) based on partner feedback",
                "Refine value proposition and feature set",
              ],
            },
            {
              title: "Jan - Dec 2025: Develop",
              items: [
                "Build MVP: Phase 1 with core AI capabilities",
                "Testing Phase 1 with key clients in real-world scenarios",
                "Finalise pricing strategy based on usage data",
                "Build Phase 2 with enhanced features",
                "Develop go-to-market strategy for broader launch",
              ],
            },
            {
              title: "2026: Prepare for Launch",
              items: ["Launch MVP to our pilot clients Q1"],
            },
          ],
        },
      },
      {
        title: "Pilot clients",
        content: {
          overview:
            "Our approach to building strategic partnerships and pilot validation across different operator sizes and system environments.",
          sections: [
            {
              title: "Large Operator",
              items: ["EPAM Asset Management - Commercial management that operate team across multiple systems"],
            },
            {
              title: "Medium Operator",
              items: ["Live-in Guardians - Guardian company that operate teams using single system"],
            },
            {
              title: "Small Operators",
              items: [
                "Landhold - Development, sales, and investment company using Microsoft suites",
                "Saxon Investments - Development, sales, and investment company using Microsoft suite",
              ],
            },
          ],
        },
      },
      {
        title: "AI Architecture",
        image: mvpArchitecture,
        imageAlt:
          "AI Architecture workflow diagram showing document parsing and AI-driven query resolver with two main processing steps",
        content: {
          overview:
            "Hobson's technical architecture leverages cutting-edge AI components to transform unstructured property documents into queryable, structured knowledge.",
          sections: [
            {
              title: "Step 1: Document Parsing Pipeline",
              items: [
                "📄 Document Upload: Users upload leases, rent rolls, and real estate documents",
                "✂️ Intelligent Chunking: Documents split into meaningful segments using embedding models",
                "🧠 Knowledge Graph Generation: LightRAG creates entity-relationship graphs from content",
                "🔍 Entity & Relation Extraction: Identifies properties, tenants, clauses, dates, financial terms",
                "💾 Multi-Layer Storage: Vector DB for semantic search, Knowledge Graph for relationships, MongoDB for structured data",
                "🎯 Fine-Tuned Extraction: Document-specific prompts pull key values (rent, dates, addresses, clauses)",
              ],
            },
            {
              title: "Step 2: AI-Driven Query Resolver",
              items: [
                "💬 Natural Language Interface: Users ask questions in plain English via chat",
                "🔎 Query Parser: Identifies intent, extracts keywords, determines context (user, property ID)",
                "⚙️ Query Engine: Fetches relevant data and documents based on parsed query",
                "✅ Quality Check: Validates response accuracy and completeness before delivery",
                "📝 Answer Generation: LLM synthesizes natural, contextual responses with source references",
                "🔄 RAG Fallback: If quality check fails, system uses retrieval-augmented generation for best possible answer",
              ],
            },
            {
              title: "Technical Components & Scalability",
              items: [
                "🤖 AI Models: Proprietary logic layer + LLM for reasoning and natural language generation",
                "🗄️ Storage Architecture: MongoDB (structured data), Vector DB (embeddings), Knowledge Graph (relationships)",
                "📋 Notes System: Fine-tuned prompts ensure domain-specific accuracy and extract critical data points",
                "☁️ Cloud Infrastructure: Scalable architecture handles multiple properties and concurrent users",
                "🔒 Security: Document data encrypted at rest and in transit, user-scoped access controls",
              ],
            },
          ],
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
        content: {
          overview:
            "Hobson runs on trusted, industry-standard platforms designed for security, performance, and scalability.",
          sections: [
            {
              title: "AI & Intelligence",
              items: [
                "🤖 OpenAI: Powers natural language understanding and AI-driven responses",
              ],
            },
            {
              title: "Cloud Infrastructure",
              items: [
                "☁️ OVH Cloud: Stores your uploaded files and documents (secure UK/EU-based cloud storage)",
                "⚡ Vercel: Runs the Hobson web app (fast, stable interface)",
              ],
            },
            {
              title: "Data & Storage",
              items: [
                "🗄️ MongoDB: Handles structured data such as units, portfolios, users, and document metadata",
                "🔗 Neo4j: Used for knowledge-graph structures to understand relationships",
                "🔍 Pinecone: Stores vector embeddings for quick document search",
              ],
            },
            {
              title: "Communication & Admin",
              items: [
                "📧 Google Workspace (G Suite): Supports email delivery, team communication, and secure internal admin",
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "commercials",
    title: "Commercials",
    subtitle: "HEU System, Pricing, and Transparent Usage",
    icon: DollarSign,
    color: "from-amber-500/10 to-amber-600/10",
    iconColor: "text-amber-600",
    pages: [
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
        title: "AI Processing Time & Cost Examples",
        isVisual: true,
      },
    ],
  },
  {
    id: "financials",
    title: "Financials",
    subtitle: "Forecast & Assumptions, OPEX, COP & Staffing",
    icon: PieChart,
    color: "from-red-500/10 to-red-600/10",
    iconColor: "text-red-600",
    pages: [
      {
        title: "Financial Forecast",
        content: {
          overview: "Revenue projections and growth assumptions.",
          sections: [],
        },
      },
      {
        title: "Operating Expenses",
        content: {
          overview: "Detailed breakdown of operational costs.",
          sections: [],
        },
      },
      {
        title: "Cost of Product",
        content: {
          overview: "Infrastructure and AI cost analysis.",
          sections: [],
        },
      },
      {
        title: "Staffing",
        content: {
          overview: "Team growth plan and hiring roadmap.",
          sections: [],
        },
      },
    ],
  },
  {
    id: "team",
    title: "Team",
    subtitle: "Leadership & Key Personnel",
    icon: Briefcase,
    color: "from-indigo-500/10 to-indigo-600/10",
    iconColor: "text-indigo-600",
    pages: [
      {
        title: "Core Team",
        content: {
          overview: "Meet the core team driving Hobson's innovation and growth.",
          sections: [
            {
              title: "Core Team",
              teamMembers: [
                {
                  name: "Julia Szaltoni",
                  role: "Product Lead",
                  linkedin: "https://www.linkedin.com/in/juliaszalontai/",
                },
                {
                  name: "Rochelle Trup",
                  role: "Commercial Lead",
                  linkedin: "https://www.linkedin.com/in/rochelle-trup-1962641b/",
                },
                {
                  name: "Marc Trup",
                  role: "Commercial Lead",
                  linkedin: "https://www.linkedin.com/in/marc-trup-100761299/",
                },
                {
                  name: "Denis Kosenkov",
                  role: "Senior AI Developer",
                  linkedin: "https://www.linkedin.com/in/denis-kosenkov-362412239/",
                },
                {
                  name: "Kumar Ankit",
                  role: "AI & Technical Lead",
                  linkedin: "https://www.linkedin.com/in/kumarankit01/",
                },
              ],
            },
          ],
        },
      },
      {
        title: "Advisory Board",
        content: {
          overview: "Experienced advisors providing strategic guidance and industry expertise.",
          sections: [
            {
              title: "Advisory Board",
              teamMembers: [
                {
                  name: "Nick Doffman",
                  role: "Commercial Advisor",
                  linkedin: "https://www.linkedin.com/in/nick-doffman-9180b887/",
                },
                {
                  name: "TBA",
                  role: "Advisor",
                  linkedin: null,
                },
                {
                  name: "TBA",
                  role: "Advisor",
                  linkedin: null,
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing Strategy",
    subtitle: "Go-to-Market Plan & Customer Acquisition",
    icon: BookOpen,
    color: "from-teal-500/10 to-teal-600/10",
    iconColor: "text-teal-600",
    pages: [
      {
        title: "Go-to-Market Strategy",
        content: {
          overview: "Our comprehensive approach to market entry and customer acquisition.",
          sections: [],
        },
      },
      {
        title: "Customer Acquisition",
        content: {
          overview: "Strategies and channels for acquiring and retaining customers.",
          sections: [],
        },
      },
      {
        title: "Market Positioning",
        content: {
          overview: "How we differentiate and position Hobson in the competitive landscape.",
          sections: [],
        },
      },
    ],
  },
  {
    id: "financial-downloads",
    title: "Financial Downloads",
    subtitle: "Detailed Financial Spreadsheets & Models",
    icon: FileSpreadsheet,
    color: "from-emerald-500/10 to-emerald-600/10",
    iconColor: "text-emerald-600",
    pages: [
      {
        title: "Available Downloads",
        content: {
          overview: "Download detailed financial models and spreadsheets for comprehensive analysis.",
          sections: [
            {
              title: "Financial Models",
              items: [
                "Revenue Projections (5-Year)",
                "Operating Expense Breakdown",
                "Cash Flow Analysis",
                "Break-even Analysis",
                "Unit Economics Model",
              ],
            },
            {
              title: "Supporting Documents",
              items: [
                "Cost of Product Analysis",
                "Staffing Plan & Costs",
                "Customer Acquisition Cost (CAC) Model",
                "Lifetime Value (LTV) Calculations",
              ],
            },
          ],
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

const InvestmentOpportunity = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<(typeof sections)[0] | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to generate PDF from section data
  const generatePDF = (section: typeof sections[0]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = 20;
    
    // Helper function to remove emojis and fix special characters for PDF
    const removeEmojis = (text: string) => {
      // Comprehensive emoji removal regex and special character replacements
      return text
        .replace(/≈/g, '~') // Replace approximately equal with tilde
        .replace(/×/g, 'x') // Replace multiplication sign
        .replace(/—/g, '-') // Replace em dash
        .replace(/–/g, '-') // Replace en dash
        .replace(/'/g, "'") // Replace smart quote
        .replace(/'/g, "'") // Replace smart quote
        .replace(/"/g, '"') // Replace smart quote
        .replace(/"/g, '"') // Replace smart quote
        .replace(/…/g, '...') // Replace ellipsis
        .replace(/[\u{1F000}-\u{1F9FF}]/gu, '') // Emoticons, symbols, pictographs
        .replace(/[\u{2600}-\u{26FF}]/gu, '') // Miscellaneous Symbols
        .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
        .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation Selectors
        .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '') // Regional Indicator Symbols (flags)
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Miscellaneous Symbols and Pictographs
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map Symbols
        .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical Symbols
        .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes Extended
        .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
        .replace(/[\u{200D}]/gu, '') // Zero Width Joiner
        .trim()
        .replace(/\s+/g, ' '); // Normalize whitespace
    };

    // Cover Page - Purple gradient effect with white text
    doc.setFillColor(124, 58, 237); // Purple background
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // HOBSON AI logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('HOBSON AI', pageWidth / 2, 80, { align: 'center' });
    
    // Section title
    doc.setFontSize(32);
    const titleLines = doc.splitTextToSize(section.title, maxWidth - 20);
    doc.text(titleLines, pageWidth / 2, 110, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const subtitleLines = doc.splitTextToSize(section.subtitle, maxWidth - 20);
    doc.text(subtitleLines, pageWidth / 2, 140, { align: 'center' });
    
    // Investment Opportunity Document label
    doc.setFontSize(10);
    doc.text('Investment Opportunity Document', pageWidth / 2, 170, { align: 'center' });
    
    // Date
    const currentDate = new Date().toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(currentDate, pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Content pages - white background with colored text
    section.pages.forEach((page: any, pageIndex: number) => {
      doc.addPage();
      yPosition = margin;
      
      // Handle pages with images specially
      const pageImage = page.image || page.pdfImage;
      const isSimpleUI = page.customVisualComponent === "simpleUI";
      if (pageImage) {
        // Page title - Purple
        doc.setTextColor(124, 58, 237);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        const cleanedPageTitle = removeEmojis(page.title);
        const pageTitleLines = doc.splitTextToSize(cleanedPageTitle, maxWidth);
        doc.text(pageTitleLines, margin, yPosition);
        yPosition += pageTitleLines.length * 8 + 10;
        
        // Determine aspect ratio and size based on image type
        const aspectRatio = isSimpleUI ? 0.75 : 1.7;
        // For simpleUI, use smaller image to fit content on same page
        const imgWidth = isSimpleUI ? maxWidth * 0.7 : maxWidth;
        const targetHeight = imgWidth * aspectRatio;
        const availableHeight = isSimpleUI ? 80 : pageHeight - yPosition - 30;
        
        // Scale image to fit on current page if needed
        let finalWidth = imgWidth;
        let finalHeight = targetHeight;
        if (targetHeight > availableHeight) {
          finalHeight = availableHeight;
          finalWidth = finalHeight / aspectRatio;
        }
        
        try {
          // Center the image for simpleUI
          const imgX = isSimpleUI ? margin + (maxWidth - finalWidth) / 2 : margin;
          doc.addImage(pageImage, 'PNG', imgX, yPosition, finalWidth, finalHeight);
          yPosition += finalHeight + 10;
        } catch (error) {
          console.error('Error adding image to PDF:', error);
        }
        
        // For non-simpleUI pages, start content on next page
        if (!isSimpleUI) {
          doc.addPage();
          yPosition = margin;
        }
      } else {
        // Page title - Purple (for non-image pages)
        doc.setTextColor(124, 58, 237);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        const cleanedPageTitle = removeEmojis(page.title);
        const pageTitleLines = doc.splitTextToSize(cleanedPageTitle, maxWidth);
        doc.text(pageTitleLines, margin, yPosition);
        yPosition += pageTitleLines.length * 8 + 5;
        
        // Purple line under title
        doc.setDrawColor(124, 58, 237);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }
      
      // Overview - Dark gray on light background (for all pages)
      if (page.content?.overview) {
        doc.setFillColor(249, 250, 251);
        
        doc.setTextColor(55, 65, 81);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const cleanedOverview = removeEmojis(page.content.overview);
        const overviewLines = doc.splitTextToSize(cleanedOverview, maxWidth - 10);
        
        const lineSpacing = 8;
        const boxHeight = overviewLines.length * lineSpacing + 8;
        doc.rect(margin, yPosition, maxWidth, boxHeight, 'F');
        
        // Render text with proper line spacing
        doc.text(overviewLines, margin + 5, yPosition + 6, { lineHeightFactor: 1.4 });
        
        yPosition += boxHeight + 8;
      }
      
      // Handle visual-only pages with fallback content
      if ((page as any).isVisual && page.title === "AI Processing Time & Cost Examples") {
        doc.setTextColor(75, 85, 99);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const visualContent = [
          "AI Processing Time & Cost Examples:",
          "",
          "Document Complexity Estimates:",
          "• Complex documents (leases with schedules): 15-30 seconds",
          "• Medium complexity (standard leases): 8-15 seconds",
          "• Low complexity (deeds, certificates): 3-8 seconds",
          "",
          "Real Customer Examples:",
          "",
          "EPAM Example:",
          "• 29 documents (leases + deeds)",
          "• Total tokens: 17.6M",
          "• Total cost: $10.51",
          "• Average: ~$0.36 per document",
          "• Individual leases: ~$0.38 each",
          "",
          "Drapers Example:",
          "• 19 head leases",
          "• Total tokens: 19.1M",
          "• Total cost: $7.77",
          "• Average: ~$0.41 per lease",
          "",
          "Key Takeaways:",
          "• Lease processing costs more than deeds due to complexity",
          "• AI processing is fast, predictable, and inexpensive",
          "• Even heavy portfolios cost single-digit dollars to index",
          "• Processing time measured in seconds, not hours",
          "• Transparent, usage-based pricing with no hidden costs"
        ];
        
        visualContent.forEach((line) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
          }
          
          if (line === "") {
            yPosition += 5;
          } else if (line.endsWith(":")) {
            doc.setFont('helvetica', 'bold');
            doc.text(line, margin, yPosition);
            yPosition += 7;
            doc.setFont('helvetica', 'normal');
          } else {
            doc.text(line, margin, yPosition);
            yPosition += 5.5;
          }
        });
        
        yPosition += 10;
      }
      
      // Handle HEU Pricing visual page
      if ((page as any).showCustomVisual && (page as any).customVisualComponent === "heuPricing") {
        doc.setTextColor(75, 85, 99);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const pricingContent = [
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
          "• Non-rollover, expires end of billing period",
          "",
          "Real-Time Transparency:",
          "• Usage bars show HEU consumption in real-time",
          "• Per-message cost breakdown visible in chat",
          "• No hidden fees or surprise charges",
          "• Users always know exactly what they're paying for",
          "",
          "Typical Costs:",
          "• Full lease extraction: ~£0.54",
          "• Simple query: ~£0.001",
          "• Document indexing: varies by complexity",
          "",
          "Business Model Benefits:",
          "• No license fees",
          "• No per-user charges",
          "• No per-asset pricing",
          "• Pay only for actual usage",
          "• Flexible billing that scales with your needs"
        ];
        
        pricingContent.forEach((line) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
          }
          
          if (line === "") {
            yPosition += 5;
          } else if (line.endsWith(":") || line.startsWith("Free Plan") || line.startsWith("Essential") || line.startsWith("Enterprise") || line.startsWith("Top-Up")) {
            doc.setFont('helvetica', 'bold');
            doc.text(line, margin, yPosition);
            yPosition += 7;
            doc.setFont('helvetica', 'normal');
          } else {
            doc.text(line, margin, yPosition);
            yPosition += 5.5;
          }
        });
        
        yPosition += 10;
      }
      
      // Sections
      if (page.content?.sections) {
        page.content.sections.forEach((section: any) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Section title - Dark gray, bold
        doc.setTextColor(31, 41, 55);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const cleanedSectionTitle = removeEmojis(section.title);
        const sectionTitleLines = doc.splitTextToSize(cleanedSectionTitle, maxWidth);
        doc.text(sectionTitleLines, margin, yPosition);
        yPosition += sectionTitleLines.length * 7 + 3;
        
        // Subtitle - Purple
        if (section.subtitle) {
          doc.setTextColor(124, 58, 237);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const cleanedSubtitle = removeEmojis(section.subtitle);
          const subtitleLines = doc.splitTextToSize(cleanedSubtitle, maxWidth);
          doc.text(subtitleLines, margin, yPosition);
          yPosition += subtitleLines.length * 6 + 5;
        }
        
        // Handle Team Members
        if (section.teamMembers && Array.isArray(section.teamMembers)) {
          const membersPerRow = 3;
          const cardWidth = (maxWidth - 10) / membersPerRow;
          const cardHeight = 35;
          const cardSpacing = 5;
          
          section.teamMembers.forEach((member: any, idx: number) => {
            const col = idx % membersPerRow;
            const row = Math.floor(idx / membersPerRow);
            const xPos = margin + col * cardWidth;
            const cardYPos = yPosition + row * (cardHeight + cardSpacing);
            
            // Check if we need a new page for this row
            if (cardYPos > pageHeight - 60 && col === 0) {
              doc.addPage();
              yPosition = margin;
              const newCardYPos = yPosition + (row - Math.floor(idx / membersPerRow)) * (cardHeight + cardSpacing);
            }
            
            const finalYPos = col === 0 && row > 0 && yPosition < margin + 20 ? margin : cardYPos;
            
            // Draw card border
            doc.setDrawColor(124, 58, 237);
            doc.setLineWidth(0.5);
            doc.rect(xPos + 2, finalYPos, cardWidth - 6, cardHeight);
            
            // Role (top section with background)
            doc.setFillColor(124, 58, 237);
            doc.rect(xPos + 2, finalYPos, cardWidth - 6, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(member.role, xPos + cardWidth / 2, finalYPos + 5, { align: 'center' });
            
            // Name
            doc.setTextColor(31, 41, 55);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            const nameLines = doc.splitTextToSize(member.name, cardWidth - 12);
            doc.text(nameLines, xPos + cardWidth / 2, finalYPos + 16, { align: 'center' });
            
            // LinkedIn link
            if (member.linkedin) {
              doc.setTextColor(124, 58, 237);
              doc.setFontSize(7);
              doc.setFont('helvetica', 'normal');
              const linkText = 'LinkedIn Profile';
              const linkY = finalYPos + 26;
              
              // Render text first
              doc.text(linkText, xPos + cardWidth / 2, linkY, { align: 'center' });
              
              // Add clickable link annotation over the text
              const textWidth = doc.getTextWidth(linkText);
              doc.link(
                xPos + (cardWidth - textWidth) / 2, 
                linkY - 3, 
                textWidth, 
                4, 
                { url: member.linkedin }
              );
            } else {
              doc.setTextColor(156, 163, 175);
              doc.setFontSize(7);
              doc.setFont('helvetica', 'italic');
              doc.text('Coming Soon', xPos + cardWidth / 2, finalYPos + 26, { align: 'center' });
            }
          });
          
          // Move position down after all team members
          const totalRows = Math.ceil(section.teamMembers.length / membersPerRow);
          yPosition += totalRows * (cardHeight + cardSpacing) + 5;
        }
        
        // Handle regular items
        if (section.items && Array.isArray(section.items)) {
          doc.setTextColor(75, 85, 99);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          
          section.items.forEach((item: string) => {
            if (yPosition > pageHeight - 40) {
              doc.addPage();
              yPosition = margin;
            }
            
            // Bullet point - Purple
            doc.setTextColor(124, 58, 237);
            doc.setFont('helvetica', 'bold');
            doc.text('•', margin + 2, yPosition);
            
            // Item text - Dark gray
            doc.setTextColor(75, 85, 99);
            doc.setFont('helvetica', 'normal');
            const cleanedItem = removeEmojis(item);
            const itemLines = doc.splitTextToSize(cleanedItem, maxWidth - 10);
            doc.text(itemLines, margin + 8, yPosition);
            yPosition += itemLines.length * 5 + 3;
          });
        }
        
        yPosition += 8;
      });
      }
    });

    // Add footer to all pages except cover
    const totalPages = doc.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `© ${new Date().getFullYear()} Hobson AI - Confidential Investment Materials`,
        margin,
        pageHeight - 10
      );
      doc.text(`Page ${i - 1} of ${totalPages - 1}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    // Save the PDF
    doc.save(`Hobson-${section.title.replace(/[^a-z0-9]/gi, '-')}.pdf`);
  };

  // Function to generate combined PDF with all sections
  const generateFullBusinessPlan = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // Helper function to remove emojis from text
    const removeEmojis = (text: string) => {
      // Comprehensive emoji removal regex
      return text
        .replace(/[\u{1F000}-\u{1F9FF}]/gu, '') // Emoticons, symbols, pictographs
        .replace(/[\u{2600}-\u{26FF}]/gu, '') // Miscellaneous Symbols
        .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
        .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation Selectors
        .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '') // Regional Indicator Symbols (flags)
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Miscellaneous Symbols and Pictographs
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map Symbols
        .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical Symbols
        .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes Extended
        .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
        .replace(/[\u{200D}]/gu, '') // Zero Width Joiner
        .trim()
        .replace(/\s+/g, ' '); // Normalize whitespace
    };
    
    // Track page numbers for each section
    const sectionPageNumbers: { [key: string]: number } = {};
    
    // Cover Page - Purple gradient
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('HOBSON AI', pageWidth / 2, 60, { align: 'center' });
    
    doc.setFontSize(36);
    doc.text('Full Business Plan', pageWidth / 2, 100, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Investment Opportunity Document', pageWidth / 2, 130, { align: 'center' });
    
    // Add funding requirement with enhanced design
    const fundingY = 165;
    
    // Add decorative lines above
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 80, fundingY - 15, pageWidth / 2 + 80, fundingY - 15);
    
    // Add funding label with opacity effect
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('FUNDING REQUIREMENT', pageWidth / 2, fundingY, { align: 'center' });
    
    // Add funding amount - extra large and bold
    doc.setFontSize(42);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('£750,000', pageWidth / 2, fundingY + 20, { align: 'center' });
    
    // Add decorative lines below
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 80, fundingY + 30, pageWidth / 2 + 80, fundingY + 30);
    
    const currentDate = new Date().toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.setFontSize(10);
    doc.text(currentDate, pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Add index page
    doc.addPage();
    let indexY = margin;
    
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Contents', pageWidth / 2, indexY, { align: 'center' });
    indexY += 15;
    
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(1);
    doc.line(margin + 40, indexY, pageWidth - margin - 40, indexY);
    indexY += 15;
    
    // Store index page number
    const indexPageNum = doc.getNumberOfPages();
    
    // First pass: Calculate page numbers
    let currentPageNum = indexPageNum + 1;
    sections.forEach((section) => {
      sectionPageNumbers[section.id] = currentPageNum;
      section.pages.forEach((page: any) => {
        const isSimpleUI = page.customVisualComponent === "simpleUI";
        if (!page.content || (page.showCustomVisual && !isSimpleUI)) {
          return;
        }
        currentPageNum++;
      });
    });
    
    // Draw index cards (2 columns)
    const cardWidth = (pageWidth - margin * 2 - 10) / 2;
    const cardHeight = 45;
    const cardSpacing = 10;
    let cardX = margin;
    let cardY = indexY;
    let cardCount = 0;
    
    sections.forEach((section, idx) => {
      if (cardY + cardHeight > pageHeight - 30) {
        doc.addPage();
        cardY = margin;
        cardX = margin;
        cardCount = 0;
      }
      
      // Card background with subtle gradient effect
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, 'F');
      
      // Colored top border
      const colors = [
        [59, 130, 246], // blue
        [168, 85, 247], // purple
        [34, 197, 94],  // green
        [234, 179, 8],  // yellow
        [239, 68, 68],  // red
        [236, 72, 153], // pink
        [14, 165, 233], // cyan
      ];
      const color = colors[idx % colors.length];
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(cardX, cardY, cardWidth, 3, 1, 1, 'F');
      
      // Section title
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(section.title, cardWidth - 10);
      doc.text(titleLines, cardX + 5, cardY + 12);
      
      // Section subtitle
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const subtitleLines = doc.splitTextToSize(section.subtitle, cardWidth - 10);
      doc.text(subtitleLines, cardX + 5, cardY + 12 + (titleLines.length * 5) + 3);
      
      // Page number
      doc.setTextColor(124, 58, 237);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Page ${sectionPageNumbers[section.id] - 1}`, cardX + cardWidth - 5, cardY + cardHeight - 5, { align: 'right' });
      
      // Add clickable link
      doc.link(cardX, cardY, cardWidth, cardHeight, { pageNumber: sectionPageNumbers[section.id] });
      
      // Position for next card
      cardCount++;
      if (cardCount % 2 === 0) {
        cardX = margin;
        cardY += cardHeight + cardSpacing;
      } else {
        cardX = margin + cardWidth + cardSpacing;
      }
    });

    // Loop through all sections in order
    sections.forEach((section) => {
      // Add purple section separator page
      doc.addPage();
      doc.setFillColor(124, 58, 237);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      
      const titleLines = doc.splitTextToSize(section.title, pageWidth - 80);
      const titleHeight = titleLines.length * 12;
      const titleY = (pageHeight - titleHeight) / 2;
      
      doc.text(titleLines, pageWidth / 2, titleY, { align: 'center' });
      
      if (section.subtitle) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        const subtitleLines = doc.splitTextToSize(section.subtitle, pageWidth - 80);
        doc.text(subtitleLines, pageWidth / 2, titleY + titleHeight + 15, { align: 'center' });
      }
      
      section.pages.forEach((page: any) => {
        // Skip pages without content, but allow simpleUI pages that have content
        const isSimpleUI = page.customVisualComponent === "simpleUI";
        if (!page.content || (page.showCustomVisual && !isSimpleUI)) {
          return;
        }
        
        doc.addPage();
        let yPosition = margin;
        
        // Handle pages with images specially
        const pageImage = page.image || page.pdfImage;
        if (pageImage) {
          // Page title - Purple
          doc.setTextColor(124, 58, 237);
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          const pageTitleLines = doc.splitTextToSize(page.title, maxWidth);
          doc.text(pageTitleLines, margin, yPosition);
          yPosition += pageTitleLines.length * 8 + 10;
          
          // Determine aspect ratio and size based on image type
          const isSimpleUI = page.customVisualComponent === "simpleUI";
          const aspectRatio = isSimpleUI ? 0.75 : 1.7;
          // For simpleUI, use smaller image to fit content on same page
          const imgWidth = isSimpleUI ? maxWidth * 0.7 : maxWidth;
          const targetHeight = imgWidth * aspectRatio;
          const availableHeight = isSimpleUI ? 80 : pageHeight - yPosition - 30;
          
          // Scale image to fit on current page if needed
          let finalWidth = imgWidth;
          let finalHeight = targetHeight;
          if (targetHeight > availableHeight) {
            finalHeight = availableHeight;
            finalWidth = finalHeight / aspectRatio;
          }
          
          try {
            // Center the image for simpleUI
            const imgX = isSimpleUI ? margin + (maxWidth - finalWidth) / 2 : margin;
            doc.addImage(pageImage, 'PNG', imgX, yPosition, finalWidth, finalHeight);
            yPosition += finalHeight + 10;
          } catch (error) {
            console.error('Error adding image to PDF:', error);
          }
          
          // For non-simpleUI pages, start content on next page
          if (!isSimpleUI) {
            doc.addPage();
            yPosition = margin;
          }
        } else {
          // Page title - Purple (for non-image pages)
          doc.setTextColor(124, 58, 237);
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          const pageTitleLines = doc.splitTextToSize(page.title, maxWidth);
          doc.text(pageTitleLines, margin, yPosition);
          yPosition += pageTitleLines.length * 8 + 5;
          
          // Purple line under title
          doc.setDrawColor(124, 58, 237);
          doc.setLineWidth(0.5);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
        }

        // Overview
        if (page.content.overview) {
          doc.setFillColor(249, 250, 251);
          doc.setTextColor(55, 65, 81);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const overviewLines = doc.splitTextToSize(page.content.overview, maxWidth - 10);
          
          const boxHeight = overviewLines.length * 5 + 10;
          doc.rect(margin, yPosition, maxWidth, boxHeight, 'F');
          doc.text(overviewLines, margin + 5, yPosition + 7);
          yPosition += boxHeight + 8;
        }
        
        // Sections
        if (page.content.sections && Array.isArray(page.content.sections)) {
          page.content.sections.forEach((section: any) => {
            if (yPosition > pageHeight - 60) {
              doc.addPage();
              yPosition = margin;
            }
            
            // Section title
            doc.setTextColor(31, 41, 55);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            const sectionTitleLines = doc.splitTextToSize(section.title, maxWidth);
            doc.text(sectionTitleLines, margin, yPosition);
            yPosition += sectionTitleLines.length * 7 + 3;
            
            // Subtitle
            if (section.subtitle) {
              doc.setTextColor(124, 58, 237);
              doc.setFontSize(12);
              doc.setFont('helvetica', 'bold');
              const subtitleLines = doc.splitTextToSize(section.subtitle, maxWidth);
              doc.text(subtitleLines, margin, yPosition);
              yPosition += subtitleLines.length * 6 + 5;
            }
            
            // Handle Team Members
            if (section.teamMembers && Array.isArray(section.teamMembers)) {
              const membersPerRow = 3;
              const cardWidth = (maxWidth - 10) / membersPerRow;
              const cardHeight = 35;
              const cardSpacing = 5;
              
              section.teamMembers.forEach((member: any, idx: number) => {
                const col = idx % membersPerRow;
                const row = Math.floor(idx / membersPerRow);
                const xPos = margin + col * cardWidth;
                const cardYPos = yPosition + row * (cardHeight + cardSpacing);
                
                // Check if we need a new page for this row
                if (cardYPos > pageHeight - 60 && col === 0) {
                  doc.addPage();
                  yPosition = margin;
                }
                
                const finalYPos = col === 0 && row > 0 && yPosition < margin + 20 ? margin : cardYPos;
                
                // Draw card border
                doc.setDrawColor(124, 58, 237);
                doc.setLineWidth(0.5);
                doc.rect(xPos + 2, finalYPos, cardWidth - 6, cardHeight);
                
                // Role (top section with background)
                doc.setFillColor(124, 58, 237);
                doc.rect(xPos + 2, finalYPos, cardWidth - 6, 8, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'bold');
                doc.text(member.role, xPos + cardWidth / 2, finalYPos + 5, { align: 'center' });
                
                // Name
                doc.setTextColor(31, 41, 55);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                const nameLines = doc.splitTextToSize(member.name, cardWidth - 12);
                doc.text(nameLines, xPos + cardWidth / 2, finalYPos + 16, { align: 'center' });
                
                // LinkedIn link
                if (member.linkedin) {
                  doc.setTextColor(124, 58, 237);
                  doc.setFontSize(7);
                  doc.setFont('helvetica', 'normal');
                  const linkText = 'LinkedIn Profile';
                  const linkY = finalYPos + 26;
                  
                  // Render text first
                  doc.text(linkText, xPos + cardWidth / 2, linkY, { align: 'center' });
                  
                  // Add clickable link annotation over the text
                  const textWidth = doc.getTextWidth(linkText);
                  doc.link(
                    xPos + (cardWidth - textWidth) / 2, 
                    linkY - 3, 
                    textWidth, 
                    4, 
                    { url: member.linkedin }
                  );
                } else {
                  doc.setTextColor(156, 163, 175);
                  doc.setFontSize(7);
                  doc.setFont('helvetica', 'italic');
                  doc.text('Coming Soon', xPos + cardWidth / 2, finalYPos + 26, { align: 'center' });
                }
              });
              
              // Move position down after all team members
              const totalRows = Math.ceil(section.teamMembers.length / membersPerRow);
              yPosition += totalRows * (cardHeight + cardSpacing) + 5;
            }
            
            // Items
            if (section.items && Array.isArray(section.items)) {
              doc.setTextColor(75, 85, 99);
              doc.setFontSize(9);
              doc.setFont('helvetica', 'normal');
              
              section.items.forEach((item: string) => {
                if (yPosition > pageHeight - 40) {
                  doc.addPage();
                  yPosition = margin;
                }
                
                // Bullet point
                doc.setTextColor(124, 58, 237);
                doc.setFont('helvetica', 'bold');
                doc.text('•', margin + 2, yPosition);
                
                // Item text
                doc.setTextColor(75, 85, 99);
                doc.setFont('helvetica', 'normal');
                const cleanedItem = removeEmojis(item);
                const itemLines = doc.splitTextToSize(cleanedItem, maxWidth - 10);
                doc.text(itemLines, margin + 8, yPosition);
                yPosition += itemLines.length * 5 + 3;
              });
            }
            
            yPosition += 8;
          });
        }
      });
    });

    // Add footer to all pages except cover
    const totalPages = doc.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `© ${new Date().getFullYear()} Hobson AI - Confidential Investment Materials`,
        margin,
        pageHeight - 10
      );
      // Skip page number on index page
      if (i !== indexPageNum) {
        doc.text(`Page ${i - 2} of ${totalPages - 2}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }
    }

    // Save the combined PDF
    doc.save('Hobson-Full-Business-Plan.pdf');
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
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                  className="w-full"
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
                  <span className="text-primary font-semibold">Innovation without disruption.</span> To bring clarity and connected insight to real estate professionals by delivering instant, accurate, AI-enhanced answers that build on the systems and documents they already use.
                </p>
              </div>

              {/* Positioning Statement */}
              <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b">
                <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3 text-center">
                  Positioning Statement
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed text-center max-w-4xl mx-auto">
                  <span className="text-primary font-semibold">Disruption without displacement.</span> Hobson brings AI clarity to real estate operations by transforming unstructured documents and fragmented data into immediate, trustworthy answers. It enhances — rather than replaces — existing CRMs and workflows, offering a lightweight, low-cost layer that delivers enterprise-grade accuracy. Hobson creates meaningful productivity gains, lowers operating costs, and provides a stepping stone for widespread AI adoption across the sector.
                </p>
              </div>

              {/* Funding Requirement Section */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 sm:p-8 text-center max-w-sm">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Funding Requirement</p>
                  <p className="text-3xl sm:text-4xl font-bold text-primary">£750,000</p>
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
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                  Business Plan Sections
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto px-2">
                  Explore individual sections below to view detailed information or download as separate documents, or
                </p>
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300"
                  onClick={() => {
                    try {
                      toast({
                        title: "Generating Full Business Plan",
                        description: "Combining all sections into one PDF...",
                      });
                      generateFullBusinessPlan();
                      toast({
                        title: "PDF Downloaded",
                        description: "Full Business Plan has been saved to your downloads folder",
                      });
                    } catch (error) {
                      console.error('Error generating full business plan:', error);
                      toast({
                        title: "Error",
                        description: "Failed to generate PDF. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download Complete Business Plan
                </Button>
              </div>

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
                              console.error('Error generating PDF:', error);
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
                          <span className="hidden xs:inline">Download PDF</span>
                          <span className="xs:hidden">PDF</span>
                        </Button>
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
        <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
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
              <div className="flex-1 overflow-y-auto mt-4 sm:mt-6 space-y-6 sm:space-y-8 -mx-4 sm:-mx-6 px-4 sm:px-6">
                {selectedSection.pages[currentPageIndex] && (
                  <>
                    {/* Custom Visual Component for Market Landscape */}
                    {(selectedSection.pages[currentPageIndex] as any).showCustomVisual &&
                      (selectedSection.pages[currentPageIndex] as any).customVisualComponent !== "matrix" &&
                      (selectedSection.pages[currentPageIndex] as any).customVisualComponent !== "europeanGlobal" &&
                      (selectedSection.pages[currentPageIndex] as any).customVisualComponent !== "heuPricing" &&
                      (selectedSection.pages[currentPageIndex] as any).customVisualComponent !== "simpleUI" && (
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

                    {/* Custom Visual Component for HEU & Pricing */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "heuPricing" && (
                      <HEUPricingVisual />
                    )}

                    {/* Custom Visual Component for Simple UI */}
                    {(selectedSection.pages[currentPageIndex] as any).customVisualComponent === "simpleUI" && (
                      <SimpleUIVisual />
                    )}

                    {/* Custom Visual Component for AI Processing */}
                    {(selectedSection.pages[currentPageIndex] as any).isVisual && <AIProcessingVisual />}

                    {/* Overview */}
                    {!(selectedSection.pages[currentPageIndex] as any).showCustomVisual &&
                      !(selectedSection.pages[currentPageIndex] as any).isVisual && (
                        <div className="prose prose-sm max-w-none">
                          <p className="text-sm sm:text-base md:text-lg text-foreground leading-relaxed">
                            {selectedSection.pages[currentPageIndex].content.overview}
                          </p>
                        </div>
                      )}

                    {/* Image (if present) */}
                    {(selectedSection.pages[currentPageIndex] as any).image && (
                      <div className="w-full bg-muted/30 rounded-lg p-6 border border-border">
                        <img
                          src={(selectedSection.pages[currentPageIndex] as any).image}
                          alt={(selectedSection.pages[currentPageIndex] as any).imageAlt || "Architecture diagram"}
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      </div>
                    )}

                    {/* Content Sections */}
                    {!(selectedSection.pages[currentPageIndex] as any).showCustomVisual &&
                      !(selectedSection.pages[currentPageIndex] as any).isVisual &&
                      selectedSection.pages[currentPageIndex].content.sections.map((contentSection: any, idx) => {
                        // Determine if section should have white background
                        const hasWhiteBg = contentSection.teamMembers || 
                          /\d{4}:/.test(contentSection.title) || 
                          contentSection.title.includes('Operator') || 
                          contentSection.title.startsWith('Step') || 
                          contentSection.title.includes('Technical Components') ||
                          contentSection.title.includes('Focus') ||
                          contentSection.title.includes('Opportunity') ||
                          contentSection.title.includes('Model') ||
                          contentSection.title.includes('Traction') ||
                          contentSection.title.includes('Milestones') ||
                          contentSection.title.includes('TAM') ||
                          contentSection.title.includes('SAM') ||
                          contentSection.title.includes('SOM') ||
                          contentSection.title.includes('Overview') ||
                          contentSection.title.includes('Summary') ||
                          contentSection.title.includes('Traditional') ||
                          contentSection.title.includes('Next-Generation') ||
                          contentSection.title.includes('Competitive') ||
                          contentSection.title.includes('Europe') ||
                          contentSection.title.includes('Global') ||
                          contentSection.title.includes('Cloud') ||
                          contentSection.title.includes('Data') ||
                          contentSection.title.includes('Communication') ||
                          contentSection.title.includes('AI &');
                        
                        return (
                        <div key={idx} className="space-y-3 sm:space-y-4">
                          <div className={`${hasWhiteBg ? 'bg-white border-b-2 border-primary/20' : 'bg-primary'} rounded-lg px-4 py-3 mb-4`}>
                            <h3 className={`text-base sm:text-lg md:text-xl font-bold ${hasWhiteBg ? 'text-foreground' : 'text-white'}`}>
                              {contentSection.title}
                            </h3>
                            {contentSection.subtitle && (
                              <p className={`text-xs sm:text-sm mt-1 ${hasWhiteBg ? 'text-muted-foreground' : 'text-white/90'}`}>{contentSection.subtitle}</p>
                            )}
                          </div>
                          
                          {/* Team Members Grid */}
                          {contentSection.teamMembers ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                              {contentSection.teamMembers.map((member: any, memberIdx: number) => (
                                <div
                                  key={memberIdx}
                                  className="border-2 border-primary/30 rounded-lg bg-white hover:border-primary transition-colors overflow-hidden"
                                >
                                  <div className="text-center">
                                    <div className="bg-primary/20 px-4 py-3">
                                      <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide">
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
                                          className="text-xs sm:text-sm text-purple-800 hover:text-purple-900 underline inline-flex items-center gap-1 transition-colors"
                                        >
                                          <span>LinkedIn Profile</span>
                                          <span className="text-[10px]">↗</span>
                                        </a>
                                      ) : (
                                        <span className="text-xs sm:text-sm text-muted-foreground italic">Coming Soon</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
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
                        </div>
                        );
                      })}

                    {/* Downloads Section */}
                    {(selectedSection.pages[currentPageIndex] as any).downloads && (
                      <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                        <div className="bg-primary rounded-lg px-4 py-3 mb-4">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                            Download Files
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                          {(selectedSection.pages[currentPageIndex] as any).downloads.map(
                            (download: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-background border border-border rounded-lg p-4 sm:p-5 hover:border-primary/50 transition-colors flex flex-col"
                              >
                                <div className="flex items-start gap-3 mb-4">
                                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground leading-relaxed">
                                      {download.name}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = download.path;
                                    link.download = download.name;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);

                                    toast({
                                      title: "Download Started",
                                      description: `Downloading ${download.name}`,
                                    });
                                  }}
                                  size="sm"
                                  className="gap-2 text-xs w-full"
                                >
                                  <Download className="w-4 h-4" />
                                  Download File
                                </Button>
                              </div>
                            ),
                          )}
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
