import React from 'react';
import { Target, Compass, Eye, Users, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';

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
              Hobson's targeting and segmentation strategy guides the organisation from early MVP validation in the UK to scalable commercial expansion and global market entry.
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
          <p className="text-sm text-foreground mb-3">The strategy is grounded in:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <Eye className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Real discovery work</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <Users className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Observed behavioural patterns</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Industry adoption dynamics</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Calm, intelligent guide positioning</span>
            </div>
          </div>
        </div>
      </div>

      {/* High-Level Positioning */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Compass className="w-3 h-3 text-primary" />
          </div>
          High-Level Positioning
        </h3>
        <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
          <p className="text-sm text-foreground leading-relaxed">
            Hobson is positioned as <span className="text-primary font-semibold">the clarity engine for Real Estate</span> - simple, intelligent, and trustworthy.
          </p>
        </div>
      </div>

      {/* Marketing Mix */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">Marketing Mix Reinforcement</h3>
        <p className="text-sm text-muted-foreground">The marketing mix reinforces this positioning at every layer:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Brand Identity</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Calm presence</p>
          </div>
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Product Design</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Lightweight</p>
          </div>
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Pricing</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Accessible</p>
          </div>
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Promotion</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Educational</p>
          </div>
        </div>
      </div>

      {/* Commercial Pathway */}
      <div className="rounded-lg bg-accent/50 border border-accent p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-1">Commercial Pathway</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Together, these elements create a coherent commercial pathway from early UK validation to international expansion by 2028-2030.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};