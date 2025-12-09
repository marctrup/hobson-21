import React from 'react';
import { Rocket, Users, Globe, AlertTriangle, CheckCircle, ArrowRight, Zap, DollarSign, Lightbulb, Shield } from 'lucide-react';

const CapitalRaiseStrategyVisual = () => {
  const scenarios = [{
    amount: "£1.2M",
    label: "Activation Round",
    runway: "9–12 months",
    risk: "high",
    description: "Moves from pilots to limited launch but leaves little margin for error.",
    badge: "Higher risk",
    color: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-600"
  }, {
    amount: "£1.5M",
    label: "Minimum Credible Raise",
    runway: "12–18 months",
    risk: "medium",
    description: "Funds core team, engineering, GTM setup and ensures a stable commercial launch in 2027.",
    badge: "Recommended minimum",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-600"
  }, {
    amount: "£1.8M",
    label: "Balanced Seed Round",
    runway: "18–22 months",
    risk: "optimal",
    description: "Supports stronger product velocity, full marketing activation, and early enterprise conversations.",
    badge: "Optimal execution",
    color: "from-primary/20 to-primary/10",
    borderColor: "border-primary/50",
    textColor: "text-primary",
    recommended: true
  }, {
    amount: "£2.2M",
    label: "Accelerated Growth",
    runway: "22–28 months",
    risk: "low",
    description: "Funds UK scale and prepares for early international market entry from 2028.",
    badge: "Global ready",
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-600"
  }];

  const useOfFunds = [
    { label: "Team hiring & 2026 payroll (Jun–Dec)", amount: "£207k" },
    { label: "Outsourced engineering (pre-launch build)", amount: "£150k–£250k" },
    { label: "Legal, compliance, finance", amount: "£40k" },
    { label: "Early marketing + GTM prep", amount: "£100k–£150k" },
    { label: "Buffer (investor standard)", amount: "£250k–£300k" }
  ];

  return <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Capital Raise Strategy</h2>
        <p className="text-muted-foreground">Activating the Business for Commercial Launch</p>
      </div>

      {/* The Context */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">The Context</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Hobson can run pilot programmes throughout 2026 using founder-led execution and outsourced engineering.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-3">
          But the business <span className="text-foreground font-bold">cannot hire its core team or execute a commercial launch without external capital</span>.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          A seed round funds the <span className="text-foreground font-bold">2026 build year</span>, prepares the organisation for launch, and enables the business to enter 2027 fully staffed, ready, and revenue-generating.
        </p>
      </div>

      {/* What the Capital Unlocks */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">What This Capital Unlocks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Foundational Team (from June 2026)</p>
              <p className="text-sm text-muted-foreground">Hiring the core commercial and product team ahead of launch.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Production-Ready Platform</p>
              <p className="text-sm text-muted-foreground">Completing the ingestion engine, knowledge graph scaling, UI/UX, quality systems, and release engineering.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Go-to-Market Activation</p>
              <p className="text-sm text-muted-foreground">Brand, funnel, messaging, early campaigns and converting pilots into scalable recurring revenue.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Use of Funds (Corrected) */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Use of Funds (Corrected)</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          {useOfFunds.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-foreground">{item.label}</p>
              <p className="text-sm font-bold text-foreground">{item.amount}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-foreground">Total Pre-Revenue Need:</p>
            <p className="font-bold text-primary text-lg">£750k–£950k</p>
          </div>
          <p className="text-sm text-muted-foreground">
            This excludes runway. To fund the full 2026 build phase <em>and</em> provide 18–24 months of stability → <span className="text-foreground font-bold">£1.5M–£2.2M seed round is required.</span>
          </p>
        </div>
      </div>

      {/* Four Scenarios */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Raise Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario, index) => <div key={index} className={`relative bg-gradient-to-br ${scenario.color} rounded-xl p-5 border ${scenario.borderColor} ${scenario.recommended ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
              {scenario.recommended && <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Preferred
                </div>}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className={`text-2xl font-bold ${scenario.textColor}`}>{scenario.amount}</p>
                  <p className="text-sm font-medium text-foreground">{scenario.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Runway</p>
                  <p className="text-sm font-semibold text-foreground">{scenario.runway}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
              <div className="flex items-center gap-2">
                {scenario.risk === "high" && <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-500/20 px-2 py-1 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> {scenario.badge}
                  </span>}
                {scenario.risk === "medium" && <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-500/20 px-2 py-1 rounded-full">
                    <Shield className="w-3 h-3" /> {scenario.badge}
                  </span>}
                {scenario.risk === "optimal" && <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> {scenario.badge}
                  </span>}
                {scenario.risk === "low" && <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/20 px-2 py-1 rounded-full">
                    <Globe className="w-3 h-3" /> {scenario.badge}
                  </span>}
              </div>
            </div>)}
        </div>
      </div>

      {/* Burn Insight */}
      <div className="bg-muted/30 rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Burn Insight (Corrected for Model)</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Your burn is <span className="text-foreground font-bold">entirely pre-revenue</span>.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Once revenue begins in 2027, the business becomes <span className="text-foreground font-bold">cashflow-positive almost immediately</span>, due to high margins and low operating overhead.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-foreground font-semibold text-center">The seed round does not fund losses — it funds readiness.</p>
        </div>
      </div>

      {/* Timeline Trajectory */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Commercial Trajectory</h3>
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <div className="flex-1 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground mb-1">2026</p>
            <p className="text-sm font-medium text-primary mb-2">Pilots & Validation</p>
          </div>
          <div className="hidden md:flex items-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground mb-1">2027</p>
            <p className="text-sm font-medium text-primary mb-2">Minimal but Functional Commercial Launch</p>
          </div>
          <div className="hidden md:flex items-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground mb-1">2028+</p>
            <p className="text-sm font-medium text-primary mb-2">UK Scale & Global Expansion</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-3">Summary</h3>
        <p className="text-foreground leading-relaxed">
          The £1.5M–£2.2M raise funds the full 2026 build period: platform completion, core team hiring, GTM development, and operating runway. From 2027 onward, Hobson becomes cashflow-positive, offering exceptional capital efficiency and minimal dilution risk.
        </p>
      </div>
    </div>;
};

export default CapitalRaiseStrategyVisual;
