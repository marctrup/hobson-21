import React from 'react';
import { Target, TrendingUp, Shield, Zap, Globe, Calendar, CheckCircle2, Lightbulb, Users, Rocket } from 'lucide-react';

export const AcquisitionExecutiveSummaryVisual = () => {
  return (
    <div className="space-y-6">
      {/* Header - Full Width Box */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">Acquisition & Sales Strategy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hobson's acquisition and sales strategy is engineered to deliver <span className="text-primary font-semibold">rapid, defensible revenue growth</span> while building long-term category leadership in AI-driven Real Estate intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Combines */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="w-3 h-3 text-primary" />
          </div>
          The Strategy Combines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-3 h-3 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-primary">Low-Friction Entry</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Pilot-led adoption that reduces barriers and builds trust through hands-on experience</p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-primary">High-Retention Expansion</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Operational dependency drives retention as Hobson becomes embedded in daily workflows</p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Globe className="w-3 h-3 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-primary">Scalable International Growth</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Global expansion path aligned with AI adoption trends and regulatory pressure</p>
          </div>
        </div>
      </div>

      {/* Staged Growth Timeline */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Calendar className="w-3 h-3 text-primary" />
          </div>
          Staged Growth Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 border-l-4 border-muted-foreground p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-muted-foreground text-background text-xs font-bold">2026</span>
              <span className="font-semibold text-sm text-foreground">De-Risk</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">De-risk product and messaging through pilots</p>
          </div>
          <div className="rounded-lg bg-primary/5 border-l-4 border-primary p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">2027</span>
              <span className="font-semibold text-sm text-foreground">Convert</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Convert early trust into predictable UK ARR</p>
          </div>
          <div className="rounded-lg bg-primary/10 border-l-4 border-primary p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">2028-30</span>
              <span className="font-semibold text-sm text-foreground">Expand</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Expand internationally as category leader</p>
          </div>
        </div>
      </div>

      {/* Strategic Benefits */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-primary" />
          </div>
          Strategic Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-2.5 h-2.5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-primary">Minimised Risk</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Commercial risk reduced through staged validation</p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Rocket className="w-2.5 h-2.5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-primary">Accelerated Revenue</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Faster time-to-revenue via pilot conversions</p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-primary">Structural Defensibility</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Embedded in daily operational workflows</p>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="rounded-lg bg-accent/50 border border-accent p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-1">Key Insight</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rather than aggressive short-term selling, Hobson compounds trust and dependency - critical in a risk-sensitive industry where switching costs rise rapidly once systems become operational infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Targeting & Segmentation */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-3 h-3 text-primary" />
          </div>
          <h3 className="text-base font-bold text-foreground">Targeting & Segmentation Strategy</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Hobson's targeting and segmentation strategy is designed to guide the organisation from early MVP validation in the UK to scalable commercial expansion and, ultimately, global market entry. The strategy is grounded in real discovery work, behavioural insight, industry adoption patterns, and the brand's Sage archetype - positioning Hobson as a calm, intelligent guide in a complex, high-pressure industry.
        </p>
      </div>

      {/* Marketing Mix */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">High-Level Proposition & Marketing Mix</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Brand Identity</p>
            <p className="text-xs font-semibold text-foreground mb-0.5">Calm Sage Archetype</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Intelligent guide in complex industry</p>
          </div>
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Product Design</p>
            <p className="text-xs font-semibold text-foreground mb-0.5">Lightweight & Simple</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Minimal friction, maximum clarity</p>
          </div>
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Pricing</p>
            <p className="text-xs font-semibold text-foreground mb-0.5">Accessible Entry</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Low barriers, expansion-based growth</p>
          </div>
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Promotion</p>
            <p className="text-xs font-semibold text-foreground mb-0.5">Education & Credibility</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Thought leadership and trust-building</p>
          </div>
        </div>
      </div>

      {/* Positioning Statement */}
      <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary mb-1">The Clarity Engine for Real Estate</h4>
            <p className="text-xs text-foreground leading-relaxed">
              Hobson establishes itself as the clarity engine for Real Estate - simple, intelligent, and trustworthy. These elements create a coherent pathway from early UK validation to global expansion by 2028-2030.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
