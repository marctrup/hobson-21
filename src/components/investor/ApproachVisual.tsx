import React from 'react';
import { Heart, Shield, Target, Zap, Clock, Users, Puzzle, Sparkles, TrendingUp, Coins, BarChart3, Lightbulb } from 'lucide-react';

export const ApproachVisual = () => {
  const brandFocusItems = [
    { icon: Sparkles, label: 'Personalisation', desc: 'Deliver relevant, context-aware experiences' },
    { icon: Shield, label: 'Integrity', desc: 'Be transparent and set clear expectations' },
    { icon: Target, label: 'Expectations', desc: 'Meet essentials first, then exceed over time' },
    { icon: Zap, label: 'Resolution', desc: 'Act on feedback and data to improve fast' },
    { icon: Clock, label: 'Time & Effort', desc: 'Make every interaction simple and efficient' },
    { icon: Heart, label: 'Empathy', desc: 'Design for real-world client challenges' },
  ];

  const productFocusItems = [
    { icon: Puzzle, text: 'Retrieve and unify scattered information across documents and systems' },
    { icon: Sparkles, text: 'Simple interface with no learning curve' },
    { icon: TrendingUp, text: 'Works alongside existing tools with gentle adoption curve' },
    { icon: Shield, text: 'Trust-building assistant that becomes more proactive over time' },
    { icon: Lightbulb, text: 'Future vision: anticipates needs and supports workflows' },
  ];

  const businessFocusItems = [
    { label: 'No license fees', highlight: true },
    { label: 'No per-user fees', highlight: true },
    { label: 'No per-asset fees', highlight: true },
  ];

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="text-center pb-2">
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Our strategic approach combines <span className="font-semibold text-foreground">AI innovation</span> with 
          deep <span className="font-semibold text-foreground">real estate industry expertise</span> to deliver 
          unprecedented value through three key focus areas.
        </p>
      </div>

      {/* Brand Focus */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center">
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <h4 className="font-semibold text-foreground">Brand Focus</h4>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {brandFocusItems.map((item, idx) => (
            <div 
              key={idx} 
              className="p-3 rounded-xl bg-gradient-to-br from-rose-50/80 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/10 border border-rose-100 dark:border-rose-900/30"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <item.icon className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="font-medium text-foreground text-sm">{item.label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Focus */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
            <Puzzle className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="font-semibold text-foreground">Product Focus</h4>
        </div>
        
        <div className="space-y-2">
          {productFocusItems.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30"
            >
              <item.icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Business Focus */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <h4 className="font-semibold text-foreground">Business Focus</h4>
        </div>
        
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30">
          {/* No fees badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {businessFocusItems.map((item, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 text-sm font-medium rounded-full bg-white/80 dark:bg-white/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/30"
              >
                ✓ {item.label}
              </span>
            ))}
          </div>
          
          {/* Business model details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground text-sm">Usage-Based Pricing</div>
                <div className="text-xs text-muted-foreground">Pay based on usage, measured in Hobson Energy Units</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground text-sm">Full Transparency</div>
                <div className="text-xs text-muted-foreground">Clear accounting for effort put into tasks—questions, documents, reports</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground text-sm">Market Capture Strategy</div>
                <div className="text-xs text-muted-foreground">Low base cost and flexible billing to grab market share</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
