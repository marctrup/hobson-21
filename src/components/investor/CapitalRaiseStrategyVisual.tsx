import React from 'react';
import { Users, Zap, Rocket, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

const CapitalRaiseStrategyVisual = () => {
  const useOfFunds = [
    { category: "Team hiring & 2026 payroll (Jun–Dec)", allocation: "£207k" },
    { category: "Outsourced engineering (pre-launch build)", allocation: "£200k" },
    { category: "Legal, compliance, finance", allocation: "£40k" },
    { category: "Early marketing & GTM preparation", allocation: "£125k" },
    { category: "Operational buffer & contingency", allocation: "£275k" },
  ];

  const burnPoints = [
    "Fully funds the 2026 build year",
    "Positions Hobson to enter 2027 fully staffed and production-ready",
    "Supports aggressive go-to-market execution during launch",
    "Preserves sufficient capital for early international readiness",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <DollarSign className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold text-primary">Target Raise: £1.8M Seed Round</span>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <p className="text-foreground leading-relaxed">
          This raises funds for the full 2026 build year, supports a strong UK commercial launch in 2027, and establishes Hobson as the category-defining intelligence layer for Real Estate operations.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The £1.8M raise is calibrated for optimal execution: accelerated product velocity, full go-to-market activation, early enterprise engagement, and controlled international readiness.
        </p>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-foreground font-semibold text-center">This capital establishes readiness, not loss coverage.</p>
        </div>
      </div>

      {/* What the Capital Unlocks */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">What the Capital Unlocks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Foundational Team (from June 2026)</p>
              <p className="text-sm text-muted-foreground">Core commercial and product leadership ahead of launch.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Production-Ready Platform</p>
              <p className="text-sm text-muted-foreground">Completion of ingestion engine, AI scaling, UI/UX, quality systems, security hardening, and release engineering.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Go-to-Market Activation</p>
              <p className="text-sm text-muted-foreground">Brand development, funnel creation, messaging, early campaigns, and systematic conversion of pilots into contracted recurring revenue.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Use of Funds Table */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Use of Funds</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Category</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {useOfFunds.map((item, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-3 px-4 text-sm text-muted-foreground">{item.category}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground text-right">{item.allocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center bg-primary/5 rounded-lg p-4">
            <p className="font-semibold text-foreground">Pre-Revenue Operating Requirement</p>
            <p className="font-bold text-primary text-xl">£847k</p>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Remaining capital extends runway through commercial launch and early scale, providing 18–22 months of total runway.
          </p>
        </div>
      </div>

      {/* Burn & Runway Strategy */}
      <div className="bg-muted/30 rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Burn & Runway Strategy</h3>
        </div>
        
        <p className="text-muted-foreground leading-relaxed mb-4">
          Burn is planned to be <span className="text-foreground font-bold">pre-revenue</span>.
        </p>
        
        <p className="text-foreground font-medium mb-3">The £1.8M seed round:</p>
        
        <div className="space-y-2 mb-6">
          {burnPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-foreground font-semibold text-center">
            From 2027 onward, Hobson becomes cash flow positive quickly as revenue scales.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CapitalRaiseStrategyVisual;
