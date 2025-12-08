import React from 'react';
import { Rocket, Users, Globe, AlertTriangle, CheckCircle, ArrowRight, Zap } from 'lucide-react';
const CapitalRaiseStrategyVisual = () => {
  const scenarios = [{
    amount: "£1.2M",
    label: "Activation Round",
    runway: "9–12 months",
    risk: "high",
    description: "Transition from pilots to limited 2027 launch. Minimal runway, heightened execution risk.",
    color: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-600"
  }, {
    amount: "£1.5M",
    label: "Minimum Credible",
    runway: "12–18 months",
    risk: "medium",
    description: "Covers early operating costs and supports a stable launch phase. Minimum viable raise.",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-600"
  }, {
    amount: "£1.8M",
    label: "Balanced Seed",
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
    description: "Positions for accelerated UK scale and early international expansion from 2028.",
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-600"
  }];
  return <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Capital Raise Strategy</h2>
        <p className="text-muted-foreground">Activating the Business for Commercial Launch</p>
      </div>

      {/* The Story */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">The Context</h3>
        <p className="text-muted-foreground leading-relaxed">
          Hobson can operate pilot programmes throughout 2026 using founder-led execution and outsourced engineering, 
          but <span className="text-foreground font-medium">the company cannot hire its core team or begin meaningful 
          commercial activity without external capital</span>. A seed round is required to activate the business, 
          complete the production-ready platform, and support a minimal commercial launch in early 2027.
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
              <p className="font-medium text-foreground">Go-to-Market-Strategy</p>
              <p className="text-sm text-muted-foreground">Convert pilot insights into scalable revenue</p>
            </div>
          </div>
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
                    <AlertTriangle className="w-3 h-3" /> Higher Risk
                  </span>}
                {scenario.risk === "optimal" && <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Optimal Execution
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
            <p className="text-xs text-muted-foreground">Technical validation with real-world partners</p>
          </div>
          <div className="hidden md:flex items-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground mb-1">2027</p>
            <p className="text-sm font-medium text-primary mb-2">Commercial Launch</p>
            <p className="text-xs text-muted-foreground">Minimal but functional market entry</p>
          </div>
          <div className="hidden md:flex items-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground mb-1">2028+</p>
            <p className="text-sm font-medium text-primary mb-2">Scale & Expand</p>
            <p className="text-xs text-muted-foreground">Accelerated UK penetration and global expansion</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <p className="text-foreground leading-relaxed">
          This raise unlocks the full commercial potential of the business: pilots and technical validation in 2026, 
          a minimal but functional launch in 2027, and accelerated UK penetration and global expansion from 2028 onwards.
        </p>
      </div>
    </div>;
};
export default CapitalRaiseStrategyVisual;