import React from 'react';
import { Target, TrendingUp, Shield, Zap, Globe, Calendar, CheckCircle2, Lightbulb, Users, Rocket } from 'lucide-react';

export const AcquisitionExecutiveSummaryVisual = () => {
  return (
    <div className="space-y-8">
      {/* Opening Statement */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 sm:p-8">
        <p className="text-lg leading-loose text-foreground">
          Hobson's acquisition and sales strategy is engineered to deliver{' '}
          <span className="text-primary font-semibold">rapid, defensible revenue growth</span> while building long-term category leadership in AI-driven Real Estate intelligence.
        </p>
      </div>

      {/* Strategy Combines */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          The Strategy Combines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <h4 className="font-semibold text-purple-600 dark:text-purple-400">Low-Friction Entry</h4>
            </div>
            <p className="text-sm text-muted-foreground">Pilot-led adoption that reduces barriers and builds trust through hands-on experience</p>
          </div>
          <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
              </div>
              <h4 className="font-semibold text-cyan-600 dark:text-cyan-400">High-Retention Expansion</h4>
            </div>
            <p className="text-sm text-muted-foreground">Operational dependency drives retention as Hobson becomes embedded in daily workflows</p>
          </div>
          <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-green-500" />
              </div>
              <h4 className="font-semibold text-green-600 dark:text-green-400">Scalable International Growth</h4>
            </div>
            <p className="text-sm text-muted-foreground">Global expansion path aligned with AI adoption trends and regulatory pressure</p>
          </div>
        </div>
      </div>

      {/* Staged Growth Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Staged Growth Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800/50 border-t-4 border-slate-500 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-slate-500 text-white text-xs font-bold">2026</span>
              <span className="font-semibold text-slate-600 dark:text-slate-400">De-Risk</span>
            </div>
            <p className="text-sm text-muted-foreground">De-risk product and messaging through pilots</p>
          </div>
          <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 border-t-4 border-purple-500 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">2027</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">Convert</span>
            </div>
            <p className="text-sm text-muted-foreground">Convert early trust into predictable UK ARR</p>
          </div>
          <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border-t-4 border-green-500 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold">2028-2030</span>
              <span className="font-semibold text-green-600 dark:text-green-400">Expand</span>
            </div>
            <p className="text-sm text-muted-foreground">Expand internationally as category leader</p>
          </div>
        </div>
      </div>

      {/* Strategic Benefits */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Strategic Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-primary/10 border border-primary/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-primary">Minimised Risk</h4>
            </div>
            <p className="text-sm text-muted-foreground">Commercial risk reduced through staged validation</p>
          </div>
          <div className="rounded-xl bg-primary/10 border border-primary/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-primary">Accelerated Revenue</h4>
            </div>
            <p className="text-sm text-muted-foreground">Faster time-to-revenue via pilot conversions</p>
          </div>
          <div className="rounded-xl bg-primary/10 border border-primary/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-primary">Structural Defensibility</h4>
            </div>
            <p className="text-sm text-muted-foreground">Embedded in daily operational workflows</p>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-2">Key Insight</h4>
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              Rather than aggressive short-term selling, Hobson compounds trust and dependency - critical in a risk-sensitive industry where switching costs rise rapidly once systems become operational infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Targeting & Segmentation */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-background to-cyan-500/5 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-cyan-500" />
          <h3 className="text-lg font-bold text-foreground">Targeting & Segmentation Strategy</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Hobson's targeting and segmentation strategy is designed to guide the organisation from early MVP validation in the UK to scalable commercial expansion and, ultimately, global market entry. The strategy is grounded in real discovery work, behavioural insight, industry adoption patterns, and the brand's Sage archetype - positioning Hobson as a calm, intelligent guide in a complex, high-pressure industry.
        </p>
      </div>

      {/* Marketing Mix */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">High-Level Proposition & Marketing Mix</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border-t-4 border-purple-500 p-4">
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">Brand Identity</p>
            <p className="text-sm font-semibold text-foreground mb-1">Calm Sage Archetype</p>
            <p className="text-xs text-muted-foreground">Intelligent guide in complex industry</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border-t-4 border-cyan-500 p-4">
            <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1">Product Design</p>
            <p className="text-sm font-semibold text-foreground mb-1">Lightweight & Simple</p>
            <p className="text-xs text-muted-foreground">Minimal friction, maximum clarity</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border-t-4 border-green-500 p-4">
            <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">Pricing</p>
            <p className="text-sm font-semibold text-foreground mb-1">Accessible Entry</p>
            <p className="text-xs text-muted-foreground">Low barriers, expansion-based growth</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border-t-4 border-amber-500 p-4">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">Promotion</p>
            <p className="text-sm font-semibold text-foreground mb-1">Education & Credibility</p>
            <p className="text-xs text-muted-foreground">Thought leadership and trust-building</p>
          </div>
        </div>
      </div>

      {/* Positioning Statement */}
      <div className="rounded-xl bg-primary/10 border border-primary/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-primary mb-2">The Clarity Engine for Real Estate</h4>
            <p className="text-sm text-foreground leading-relaxed">
              Hobson establishes itself as the clarity engine for Real Estate - simple, intelligent, and trustworthy. These elements create a coherent pathway from early UK validation to global expansion by 2028-2030.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
