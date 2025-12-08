import React from 'react';
import { DollarSign, Target, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

const CapitalRaiseStrategyVisual = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Capital Raise Strategy</h2>
        <p className="text-muted-foreground">Seed Round Funding Requirements & Use of Funds</p>
      </div>

      {/* Funding Target */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Seed Round Target</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-4xl font-bold text-primary mb-2">£1.5M – £2M</p>
          <p className="text-muted-foreground">18–24 months runway covering pre-launch build and early commercialisation</p>
        </div>
      </div>

      {/* Use of Funds */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Target className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Use of Funds</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="font-medium text-foreground">Pre-2027 Engineering Build</span>
            </div>
            <span className="font-bold text-primary">£500k – £700k</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="font-medium text-foreground">Team Hiring & Runway</span>
            </div>
            <span className="font-bold text-blue-500">£750k</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="font-medium text-foreground">Initial Marketing Ramp</span>
            </div>
            <span className="font-bold text-amber-500">£150k</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="font-medium text-foreground">Operational Buffer</span>
            </div>
            <span className="font-bold text-emerald-500">£300k</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Calendar className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Investment Timeline</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Pre-Revenue Phase</p>
            <p className="font-semibold text-foreground">2025 – 2026</p>
            <p className="text-sm text-muted-foreground mt-2">Development, pilot testing, and market preparation</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Commercial Launch</p>
            <p className="font-semibold text-foreground">Q1 2027</p>
            <p className="text-sm text-muted-foreground mt-2">Public launch with full pricing and onboarding flows</p>
          </div>
        </div>
      </div>

      {/* Path to Profitability */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Path to Profitability</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-foreground">Profitability from Year 1 (2027) — £5,250/month surplus in first commercial year</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-foreground">Capital required only for pre-revenue development phase, not ongoing operations</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-foreground">Scaling to £898,740/month surplus by 2031</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-foreground">Ultra-lean model with outsourced execution strategy</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20">
        <h4 className="font-semibold text-foreground mb-3">Summary</h4>
        <p className="text-muted-foreground">
          Hobson requires <span className="font-semibold text-foreground">£1.5M–£2M seed funding</span> to complete 
          pre-launch development and reach commercial launch in Q1 2027. The capital-efficient model reflects 
          lightweight team structure and outsourced execution, with profitability achieved immediately upon 
          market entry — requiring no additional funding rounds for ongoing operations.
        </p>
      </div>
    </div>
  );
};

export default CapitalRaiseStrategyVisual;
