import React from 'react';
import { Heart, Shield, Target, Zap, Clock, Users, Puzzle, Sparkles, TrendingUp, Coins, BarChart3, Lightbulb, CheckCircle2, Rocket, Calendar } from 'lucide-react';

export const ApproachVisual = () => {
  const productItems = [
    'Unifies scattered information across documents, emails, and systems',
    'A simple interface with zero learning curve',
    'Works alongside existing workflows — no disruption, no integration burden',
    'Designed to earn trust: citations, transparency, no hallucinations',
    'Becomes more helpful over time → proactive support, guided workflows',
    'Current business activity (pilots, document processing, manual insights) directly informs the production platform',
  ];

  const brandItems = [
    { label: 'Personalisation', desc: 'Responses adapt to context and user role' },
    { label: 'Integrity', desc: 'Transparent behaviour, clear expectations, visible sources' },
    { label: 'Expectations', desc: 'Do the essentials flawlessly, then expand capability' },
    { label: 'Resolution', desc: 'Act on feedback quickly; improve where it matters' },
    { label: 'Time & Effort', desc: 'Every interaction should feel effortless' },
    { label: 'Empathy', desc: 'Designed for real-world operator pressure, not theory' },
  ];

  const businessItems = [
    { label: 'No licence fees', icon: CheckCircle2 },
    { label: 'No per-user fees', icon: CheckCircle2 },
    { label: 'No per-asset fees', icon: CheckCircle2 },
  ];

  const raiseItems = [
    'Full production platform',
    'Knowledge graph scaling',
    'Stability, QA, security',
    'Core hiring',
    'GTM development',
    'Pilot conversion frameworks',
  ];

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative space-y-3">
          <h3 className="text-lg font-bold text-foreground">Our Strategic Approach</h3>
          <p className="text-muted-foreground leading-relaxed">
            Hobson combines AI innovation with deep real estate experience to create a platform that feels familiar, 
            works instantly, and delivers clarity without disruption.
          </p>
          <p className="text-sm text-foreground">
            Built around <span className="font-semibold text-primary">three pillars: Product, Brand, and Business Model</span> — 
            all aligned toward a <span className="font-semibold">2027 commercial launch</span>, funded by a <span className="font-semibold">2026 seed round</span>.
          </p>
        </div>
      </div>

      {/* 1. Product Approach */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold text-sm">1</div>
          <div>
            <h4 className="font-semibold text-foreground">Product Approach</h4>
            <p className="text-sm text-muted-foreground">Built for the way real estate actually works</p>
          </div>
        </div>
        
        <div className="space-y-2 pl-11">
          {productItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-foreground">Goal: A clarity engine that feels like part of the team on day one.</span>
          </div>
        </div>
      </div>

      {/* 2. Brand Approach */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold text-sm">2</div>
          <div>
            <h4 className="font-semibold text-foreground">Brand Approach</h4>
            <p className="text-sm text-muted-foreground">Make AI feel human, helpful, and honest</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-11">
          {brandItems.map((item, idx) => (
            <div 
              key={idx} 
              className="p-3 rounded-lg bg-gradient-to-br from-rose-50/80 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/10 border border-rose-100 dark:border-rose-900/30"
            >
              <div className="font-medium text-foreground text-sm mb-1">{item.label}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-medium text-foreground">Goal: A brand that embodies <em>Innovation without disruption</em>.</span>
          </div>
        </div>
      </div>

      {/* 3. Business Approach */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold text-sm">3</div>
          <div>
            <h4 className="font-semibold text-foreground">Business Approach</h4>
            <p className="text-sm text-muted-foreground">A model built for mass adoption and rapid scaling</p>
          </div>
        </div>
        
        <div className="pl-11 space-y-3">
          {/* No fees badges */}
          <div className="flex flex-wrap gap-2">
            {businessItems.map((item, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-amber-100/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/30"
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </span>
            ))}
          </div>
          
          {/* Business details */}
          <div className="grid sm:grid-cols-2 gap-2">
            <div className="flex items-start gap-2 text-sm">
              <Coins className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground"><strong>Usage-based pricing</strong> via Hobson Energy Units (HEUs)</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground"><strong>Full transparency</strong> — customers see exactly what Hobson did and why</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground"><strong>Low base cost</strong> → frictionless entry</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground"><strong>Flexible billing</strong> → high-volume market capture</span>
            </div>
          </div>
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-foreground">Goal: Become the category-defining AI document intelligence layer across UK and global real estate.</span>
          </div>
        </div>
      </div>

      {/* Why We Raise in 2026 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
            <Rocket className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-foreground">Why We Raise in 2026</h4>
        </div>
        
        <div className="pl-11">
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
            <p className="text-sm text-foreground mb-4">
              To deliver a <span className="font-semibold">2027 commercial launch</span>, we need to complete:
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {raiseItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-primary/20 space-y-2">
              <p className="text-sm text-foreground">
                We raise in <span className="font-semibold text-primary">2026</span> to ensure everything is in place <span className="font-semibold">before</span> revenue begins in 2027.
              </p>
              <p className="text-sm text-muted-foreground">
                Once commercial activity starts, the operating model becomes <span className="font-semibold text-foreground">immediately cashflow-positive</span>, enabling efficient scale with minimal dilution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
