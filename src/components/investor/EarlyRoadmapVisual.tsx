import React from "react";
import { CheckCircle, Clock, Rocket, Building2, FileText, Shield, DollarSign, Wrench, Eye, Scale, Home, BarChart3, Globe, Users, TrendingUp, Zap } from "lucide-react";
interface PhaseSection {
  phase: string;
  title: string;
  status: "completed" | "in-progress" | "upcoming";
  objectives: string[];
  subItems?: string[][];
}
const timelineData: PhaseSection[] = [{
  phase: "May – Aug 2024",
  title: "Phase 1: Discover & De-Risk",
  status: "completed",
  objectives: ["Validated the systemic failure of existing property management systems through direct operator discovery:"],
  subItems: [["Compliance risk", "Lease complexity", "Arrears management", "Maintenance chaos", "Portfolio fragmentation"], ["AI lease abstraction", "AI compliance orchestration", "AI financial intelligence"]]
}, {
  phase: "Sep – Dec 2024",
  title: "Phase 2: Validate Core Engine",
  status: "completed",
  objectives: ["Product-market fit is emerging.", "Four active pilot partners across operator sizes and system environments:"],
  subItems: [["Large multi-system commercial operator", "Medium single-system operator", "Small owner-operator investment firms"], ["Abstract leases", "Normalise residential and commercial workflows", "Surface compliance and financial risk"]]
}, {
  phase: "Jan – Dec 2025",
  title: "Phase 3: Develop the MVP",
  status: "in-progress",
  objectives: ["Build MVP: Phase 1 with core AI capabilities", "Build online presence and branding", "Testing MVP with key clients' data", "Build a pricing strategy based on usage data", "Build pricing plans, marketing plan, business plan and financial model first draft"]
}, {
  phase: "Jan – Sep 2026",
  title: "Phase 4: Build the Industry Operating Layer",
  status: "upcoming",
  objectives: ["Hobson MVP expands from \"document AI\" into full workflow intelligence.", "By the end of 2026, Hobson will become the AI operating backbone for Real Estate portfolios."]
}];
const productPillars = [{
  workflow: "Onboarding & Setup",
  capability: "AI document ingestion, lease abstraction, risk flags",
  icon: FileText
}, {
  workflow: "Compliance & Safety",
  capability: "Compliance rule engines, predictive failure",
  icon: Shield
}, {
  workflow: "Leasing & Occupier",
  capability: "Risk scoring, deal forecasting",
  icon: Users
}, {
  workflow: "Lease Management",
  capability: "Market intelligence, renewal modelling",
  icon: Building2
}, {
  workflow: "Rent Collection & Finance",
  capability: "Arrears prediction, cashflow forecasting",
  icon: DollarSign
}, {
  workflow: "Maintenance & Asset",
  capability: "Predictive maintenance, cost optimisation",
  icon: Wrench
}, {
  workflow: "Inspections",
  capability: "Computer vision defect detection",
  icon: Eye
}, {
  workflow: "Legal & Risk",
  capability: "Litigation risk scoring",
  icon: Scale
}, {
  workflow: "Voids & Re-leasing",
  capability: "Void forecasting, incentive modelling",
  icon: Home
}, {
  workflow: "Portfolio Strategy",
  capability: "Scenario modelling, portfolio optimisation",
  icon: BarChart3
}];
const businessTimeline = [{
  year: "2026",
  title: "Prove Commercial Model",
  items: ["10+ pilot organisations", "3-5 converted to paying enterprise customers", "Billing engine & compliance-grade audit logging", "Full UK market readiness"]
}, {
  year: "2027",
  title: "UK Market Capture",
  items: ["Public launch Q1", "Aggressive go-to-market", "Platform hardened for national scale", "Expansion readiness for EU & Global"]
}, {
  year: "2028",
  title: "Global Expansion",
  items: ["Multi-market release", "Local compliance models", "Global enterprise partnerships"]
}];
const commercialImpact = [{
  metric: "35–45%",
  description: "Reduction in operating cost per unit"
}, {
  metric: "Sub-linear",
  description: "Headcount growth"
}, {
  metric: "Near-zero",
  description: "Compliance failures"
}, {
  metric: "Material",
  description: "Improvement in cashflow predictability"
}];
export const EarlyRoadmapVisual: React.FC = () => {
  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === "in-progress") return <Clock className="w-5 h-5 text-amber-600" />;
    return <Rocket className="w-5 h-5 text-purple-600" />;
  };
  const getStatusColor = (status: string, index: number) => {
    if (status === "completed") return "border-l-green-500 bg-green-50/50";
    if (status === "in-progress") return "border-l-amber-500 bg-amber-50/50";
    return "border-l-purple-500 bg-purple-50/50";
  };
  return <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Timeline and Innovation</h2>
        <p className="text-muted-foreground">
          Strategic product development timeline covering discovery, validation, and development phases
        </p>
      </div>

      {/* Development Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Product Development Timeline
        </h3>
        {timelineData.map((section, index) => <div key={section.phase} className={`bg-background border border-border rounded-lg overflow-hidden border-l-4 ${getStatusColor(section.status, index)}`}>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(section.status)}
                <div>
                  <h4 className="font-semibold text-foreground">{section.title}</h4>
                  <span className="text-sm text-muted-foreground">{section.phase}</span>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${section.status === "completed" ? "bg-green-100 text-green-700" : section.status === "in-progress" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"}`}>
                {section.status === "completed" ? "Completed" : section.status === "in-progress" ? "In Progress" : "Upcoming"}
              </span>
            </div>
            <div className="px-4 pb-4">
              <ul className="space-y-2">
                {section.objectives.map((objective, objIndex) => <li key={objIndex} className="text-sm text-foreground flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{objective}</span>
                  </li>)}
              </ul>
              {section.subItems && section.subItems.map((group, groupIndex) => <div key={groupIndex} className="ml-4 mt-2">
                  {groupIndex === 0 && section.phase === "May – Aug 2024" && <p className="text-xs text-muted-foreground mb-1">Confirmed market need for:</p>}
                  {groupIndex === 1 && section.phase === "Sep – Dec 2024" && <p className="text-xs text-muted-foreground mb-1 mt-3 font-semibold">Validated Hobson's ability to:</p>}
                  <ul className="space-y-1">
                    {group.map((item, itemIndex) => <li key={itemIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        {item}
                      </li>)}
                  </ul>
                </div>)}
            </div>
          </div>)}
      </div>

      {/* 2026 Product Pillars */}
      <div className="bg-gradient-to-br from-primary/5 to-purple-50 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          2026 Product Pillars - Mapped to Industry Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {productPillars.map((pillar, index) => <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 flex items-start gap-3">
              <pillar.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-foreground">{pillar.workflow}</span>
                <p className="text-xs text-muted-foreground">{pillar.capability}</p>
              </div>
            </div>)}
        </div>
        <p className="text-sm text-muted-foreground mt-4 italic text-center">
          All capabilities drawn directly from tested Real Estate workflows.
        </p>
      </div>

      {/* Business Development Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          2026–2028: Scale, Monetise, Dominate
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {businessTimeline.map((phase, index) => <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded">
                  {phase.year}
                </span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">{phase.title}</h4>
              <ul className="space-y-1">
                {phase.items.map((item, itemIndex) => <li key={itemIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                    {item}
                  </li>)}
              </ul>
            </div>)}
        </div>
      </div>

      {/* Commercial Impact */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-foreground mb-4">Commercial Impact for Operators</h3>
        <p className="text-sm text-muted-foreground mb-4">Hobson enables:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {commercialImpact.map((impact, index) => <div key={index} className="text-center">
              <div className="text-xl font-bold text-primary mb-1">{impact.metric}</div>
              <div className="text-xs text-muted-foreground">{impact.description}</div>
            </div>)}
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          + Portfolio-wide decision intelligence
        </p>
      </div>

      {/* Closing Statement */}
      <div className="bg-primary text-white rounded-xl p-6 text-center space-y-3">
        <p className="text-lg font-semibold">
          Hobson is not selling software. Hobson is becoming the operating system for Real Estate management.
        </p>
        <p className="text-sm opacity-90">
          The market is enormous, the pain is immediate, and the transformation window is open now.
        </p>
      </div>
    </div>;
};