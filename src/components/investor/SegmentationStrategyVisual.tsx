import React from 'react';
import { Users, Target, Building2, Home, Briefcase, TrendingUp, CheckCircle2 } from 'lucide-react';

export const SegmentationStrategyVisual = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">Segmentation Strategy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hobson's market segmentation identifies distinct customer groups with specific needs, behaviours, and adoption patterns across the UK property sector.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Segments */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="w-3 h-3 text-primary" />
          </div>
          Primary Customer Segments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Property Management Companies</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Mid-sized firms managing 100-1,000+ units seeking operational efficiency
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">High volume</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">Process-driven</span>
            </div>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Estate Agents & Letting Agents</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Agents handling tenancy agreements and compliance documentation
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">Client-facing</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">Time-sensitive</span>
            </div>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Portfolio Landlords</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Private landlords with 5+ properties requiring compliance oversight
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">Cost-conscious</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">Self-managed</span>
            </div>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Build-to-Rent Operators</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Institutional operators with large-scale residential portfolios
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">Enterprise</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">Tech-forward</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmentation Criteria */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">Segmentation Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-4">
            <p className="text-xs font-bold text-primary mb-1">Portfolio Size</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Number of units under management determines complexity and value</p>
          </div>
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-4">
            <p className="text-xs font-bold text-primary mb-1">Tech Maturity</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Current digital adoption influences onboarding approach</p>
          </div>
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-4">
            <p className="text-xs font-bold text-primary mb-1">Pain Intensity</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Urgency of document and compliance challenges</p>
          </div>
        </div>
      </div>

      {/* Priority Focus */}
      <div className="rounded-lg bg-accent/50 border border-accent p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-1">Initial Focus: Mid-Market Property Managers</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The pilot phase prioritises mid-sized property management companies (100-500 units) as they represent the optimal balance of operational complexity, decision-making speed, and growth potential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};