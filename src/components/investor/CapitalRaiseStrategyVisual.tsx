import React from 'react';
import { Rocket, Users, Globe, AlertTriangle, CheckCircle, ArrowRight, Zap, DollarSign } from 'lucide-react';

const CapitalRaiseStrategyVisual = () => {
  const scenarios = [{
    amount: "£1.2M",
    label: "Activation Round",
    runway: "9–12 months",
    risk: "high",
    description: "Transition from pilots to limited 2027 launch. Elevated risk.",
    color: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-600"
  }, {
    amount: "£1.5M",
    label: "Minimum Credible Raise",
    runway: "12–18 months",
    risk: "medium",
    description: "Covers early operating costs and supports a stable launch phase. Minimum viable raise.",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-600"
  }, {
    amount: "£1.8M",
    label: "Balanced Seed Round",
    runway: "18–22 months",
    risk: "optimal",
    description: "Supports product velocity, marketing execution, and early enterprise engagement. Strategically optimal.",
    color: "from-primary/20 to-primary/10",
    borderColor: "border-primary/50",
    textColor: "text-primary",
    recommended: true
  }, {
    amount: "£2.2M",
    label: "Accelerated Growth",
    runway: "22–28 months",
    risk: "low",
    description: "Positions for rapid UK scale and early international expansion. Global ready.",
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-600"
  }];

  const useOfFunds = [
    { label: "Pre-launch engineering (outsourced)", amount: "£150k–£250k" },
    { label: "Team hiring & runway", amount: "£750k" },
    { label: "Initial marketing", amount: "£150k" },
    { label: "Buffer", amount: "£300k" }
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
        <p className="text-muted-foreground leading-relaxed">
          Hobson can run pilot programmes throughout 2026 with founder-led execution and outsourced engineering, 
          but <span className="text-foreground font-medium">cannot hire its core team or begin meaningful 
          commercial activity without external capital</span>. The seed round activates the business: completing the production platform, hiring the team, and preparing for a commercial launch in early 2027.
        </p>
      </div>

      {/* Why This Raise Is Needed */}
      <div className="bg-muted/30 rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Why This Raise Is Needed</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our operating model does <span className="text-foreground font-bold">not</span> require ongoing capital.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our <span className="text-foreground font-bold">build and go-to-market acceleration do.</span>
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          The seed round funds the entire 2026 build year so that the business can launch ready, staffed, and immediately profitable in 2027.
        </p>
      </div>

      {/* What the Capital Unlocks */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">What This Capital Unlocks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Foundational Team</p>
              <p className="text-sm text-muted-foreground">Core hires to execute commercial strategy</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Infrastructure</p>
              <p className="text-sm text-muted-foreground">Production-ready platform build</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Go-to-Market Strategy</p>
              <p className="text-sm text-muted-foreground">Convert pilot insights into scalable revenue</p>
            </div>
          </div>
        </div>

        {/* Use of Funds */}
        <div className="bg-background/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-primary" />
            <p className="font-medium text-foreground">Use of Funds</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {useOfFunds.map((item, index) => (
              <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-semibold text-foreground">{item.amount}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-sm font-semibold text-primary">Total: £1.5M–£2.2M</p>
        </div>
      </div>

      {/* Four Scenarios */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Raise Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario, index) => <div key={index} className={`relative bg-gradient-to-br ${scenario.color} rounded-xl p-5 border ${scenario.borderColor} ${scenario.recommended ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
              {scenario.recommended && <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Recommended
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
              <p className="text-sm text-muted-foreground">{scenario.description}</p>
              <div className="mt-3 flex items-center gap-2">
                {scenario.risk === "high" && <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-500/20 px-2 py-1 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> Elevated Risk
                  </span>}
                {scenario.risk === "optimal" && <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Strategically Optimal
                  </span>}
                {scenario.risk === "low" && <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/20 px-2 py-1 rounded-full">
                    <Globe className="w-3 h-3" /> Global Ready
                  </span>}
              </div>
            </div>)}
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
            <p className="text-sm font-medium text-primary mb-2">Commercial Launch</p>
          </div>
          <div className="hidden md:flex items-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground mb-1">2028+</p>
            <p className="text-sm font-medium text-primary mb-2">Scale & Expand</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-3">Summary</h3>
        <p className="text-foreground leading-relaxed">
          The £1.5M–£2.2M raise funds the full pre-revenue build and early commercialisation. Once revenue begins in 2027, the lean operating model becomes cashflow-positive almost immediately, avoiding unnecessary dilution and demonstrating exceptional capital efficiency.
        </p>
      </div>
    </div>;
};

export default CapitalRaiseStrategyVisual;
