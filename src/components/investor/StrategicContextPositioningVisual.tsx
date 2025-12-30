import React from 'react';
import { Target, Users, Compass, Shield, TrendingUp, Lightbulb, Globe, CheckCircle2 } from 'lucide-react';

export const StrategicContextPositioningVisual = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">Strategic Context & Positioning</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hobson's targeting and segmentation strategy is designed to guide the organisation from early MVP validation in the UK to scalable commercial expansion and global market entry.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Foundation */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="w-3 h-3 text-primary" />
          </div>
          Strategy Foundation
        </h3>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The strategy is grounded in real discovery work, behavioural insight, industry adoption patterns, and the brand's Sage archetype - positioning Hobson as a calm, intelligent guide in a complex, high-pressure industry.
          </p>
        </div>
      </div>

      {/* Key Strategic Pillars */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-3 h-3 text-primary" />
          </div>
          Key Strategic Pillars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Behavioural Insight</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Deep understanding of how property professionals make decisions under pressure
            </p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Industry Adoption Patterns</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Aligning with proven technology adoption curves in real estate
            </p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Sage Archetype</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Brand positioning as a calm, intelligent guide in complexity
            </p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Global Scalability</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Framework designed for UK validation then international expansion
            </p>
          </div>
        </div>
      </div>

      {/* Growth Trajectory */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-primary" />
          </div>
          Growth Trajectory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 border-l-4 border-muted-foreground p-4">
            <p className="text-xs font-bold text-muted-foreground mb-1">Phase 1</p>
            <p className="text-sm font-semibold text-foreground mb-1">UK MVP Validation</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Early product-market fit through pilots</p>
          </div>
          <div className="rounded-lg bg-primary/5 border-l-4 border-primary p-4">
            <p className="text-xs font-bold text-primary mb-1">Phase 2</p>
            <p className="text-sm font-semibold text-foreground mb-1">Commercial Expansion</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Scale across UK property sectors</p>
          </div>
          <div className="rounded-lg bg-primary/10 border-l-4 border-primary p-4">
            <p className="text-xs font-bold text-primary mb-1">Phase 3</p>
            <p className="text-sm font-semibold text-foreground mb-1">Global Market Entry</p>
            <p className="text-xs text-muted-foreground leading-relaxed">International expansion as category leader</p>
          </div>
        </div>
      </div>

      {/* Positioning Statement */}
      <div className="rounded-lg bg-accent/50 border border-accent p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-1">Market Positioning</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hobson is positioned as the clarity engine for Real Estate - simple, intelligent, and trustworthy. This positioning creates a coherent pathway from early UK validation to global expansion by 2028-2030.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};