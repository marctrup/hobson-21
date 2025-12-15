import React from 'react';
import { Shield, Target, Zap, Heart, CheckCircle2, Rocket, Calendar, Coins, Eye, Ban, AlertTriangle } from 'lucide-react';

export const ApproachVisual = () => {
  const productItems = [
    'Starts at the **document layer**, the source of truth for every decision',
    '**Embeds into existing systems** — no rip-and-replace',
    'Delivers **auditable answers with visible sources**; no black boxes, no hallucinations',
    'Zero learning curve; value from day one',
    'Architecture designed to expand only after trust is proven'
  ];

  const brandItems = [
    'Human, calm, and precise — not "AI hype"',
    'Clear limits, clear sources, clear expectations',
    'Adapts to role and context',
    'Improves where users feel pain, not where theory says it should'
  ];

  const businessItems = [
    { label: 'No licence fees', icon: Ban },
    { label: 'No per-user fees', icon: Ban },
    { label: 'No per-asset fees', icon: Ban },
    { label: 'Usage-based pricing only', sublabel: 'Hobson Energy Units', icon: Coins },
    { label: 'Full transparency', sublabel: 'into what Hobson did and why', icon: Eye }
  ];

  const capitalItems = [
    'Production platform completion',
    'AI scaling, security, and QA',
    'Core hires',
    'Go-to-market and pilot-to-contract conversion'
  ];

  const whyWinsReasons = [
    { text: "Don't replace what already works", icon: Shield },
    { text: "Don't trust what can't prove itself", icon: Eye }
  ];

  // Helper to render text with **bold** markdown
  const renderBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, idx) => 
      idx % 2 === 1 ? <span key={idx} className="font-semibold text-primary">{part}</span> : part
    );
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="text-xl font-bold text-foreground mb-2">Built for a market that says "nooooo" to shortcuts</h3>
          <p className="text-muted-foreground">
            A strategy designed around how real estate actually adopts technology — not how we wish it would.
          </p>
        </div>
      </div>

      {/* 1. Product Strategy */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold text-sm">1</div>
          <div>
            <h4 className="font-semibold text-foreground">Product Strategy — Trust First, Then Scale</h4>
            <p className="text-sm text-muted-foreground">Built for how real estate actually adopts technology</p>
          </div>
        </div>
        
        <div className="space-y-2 pl-11">
          {productItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{renderBoldText(item)}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-foreground">
              <span className="text-blue-700 dark:text-blue-400">Outcome:</span> A trusted clarity engine that earns adoption before asking for change.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Brand Strategy */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold text-sm">2</div>
          <div>
            <h4 className="font-semibold text-foreground">Brand Strategy — Confidence Through Honesty</h4>
            <p className="text-sm text-muted-foreground">Designed for operators under real pressure</p>
          </div>
        </div>
        
        <div className="space-y-2 pl-11">
          {brandItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <Heart className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-medium text-foreground">
              <span className="text-rose-700 dark:text-rose-400">Outcome:</span> A brand that feels reliable before it feels intelligent.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Business Strategy */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold text-sm">3</div>
          <div>
            <h4 className="font-semibold text-foreground">Business Strategy — Remove Adoption Friction</h4>
            <p className="text-sm text-muted-foreground">Pricing that reflects real buyer psychology</p>
          </div>
        </div>
        
        <div className="pl-11 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {businessItems.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-center">
              <item.icon className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
              <div className="font-medium text-amber-700 dark:text-amber-400 text-xs">{item.label}</div>
              {item.sublabel && <div className="text-[10px] text-muted-foreground mt-0.5">{item.sublabel}</div>}
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-foreground">
              <span className="text-amber-700 dark:text-amber-400">Outcome:</span> Low-risk entry, fast pilots, scalable expansion.
            </span>
          </div>
        </div>
      </div>

      {/* Why This Wins */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-foreground">Why This Wins</h4>
        </div>
        
        <div className="pl-11">
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
            <p className="text-sm text-foreground mb-4">
              Most AI platforms fail here by demanding <span className="font-semibold text-primary">system replacement</span> and offering <span className="font-semibold text-primary">speed without truth</span>.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Hobson is built around the two non-negotiables of this market:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {whyWinsReasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-emerald-200/50 dark:border-emerald-800/30">
                  <reason.icon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium text-foreground text-sm">{reason.text}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-4 text-center">
              We solve both by design.
            </p>
          </div>
        </div>
      </div>

      {/* Capital Plan */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Capital Plan</h4>
            <p className="text-sm text-muted-foreground">Raise: 2026 | Commercial Launch: 2027</p>
          </div>
        </div>
        
        <div className="pl-11">
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-3">Funds allocated to:</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {capitalItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-primary/20">
              <p className="text-sm text-foreground">
                Once commercialised, the model is <span className="font-semibold text-primary">cashflow-positive by design</span>, enabling efficient scale with minimal dilution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="text-center py-6 border-t border-border/50">
        <p className="text-lg font-semibold text-foreground">
          No shortcuts.
        </p>
        <p className="text-lg text-muted-foreground">
          Accuracy before autonomy. Trust before scale.
        </p>
      </div>
    </div>
  );
};
