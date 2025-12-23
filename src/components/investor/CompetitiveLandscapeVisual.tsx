import React from 'react';
import { AlertTriangle, Sparkles, Globe, CheckCircle } from 'lucide-react';

export const CompetitiveLandscapeVisual = () => {
  const marketGaps = [
    "Legacy Prop Tech platforms are system-of-record for transactions, not intelligence",
    "Horizontal AI tools lack domain depth, accuracy, and auditability",
    "No AI-native platform has yet become the default intelligence layer for real estate documents",
  ];

  const rareSituation = [
    "Large, conservative market",
    "Clear structural pain",
    "No entrenched AI leader",
  ];

  const aiNativeFeatures = [
    "Real-time reasoning",
    "Instant, referenced answers",
    "Embedded into workflows",
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="pb-3 border-b-2 border-primary/20">
        <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">Context: A Category Still Forming</h3>
        <p className="text-xs lg:text-sm text-muted-foreground">Despite the size of the sector:</p>
      </div>

      {/* Market Gaps */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Current Market Gaps</h4>
        </div>
        <div className="space-y-2">
          {marketGaps.map((gap, index) => (
            <div key={index} className="flex items-start gap-2 bg-background/50 rounded-lg p-2 border border-border/50">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
              <span className="text-sm lg:text-base text-foreground">{gap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rare Situation */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <p className="text-sm lg:text-base text-muted-foreground mb-4">This creates a rare situation:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rareSituation.map((item, index) => (
            <div key={index} className="bg-background/50 rounded-lg p-3 border border-border/50 text-center">
              <span className="text-sm lg:text-base font-medium text-foreground">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-sm lg:text-base text-muted-foreground mt-4 italic">
          Markets like this tend to consolidate quickly once a trusted standard emerges.
        </p>
      </div>

      {/* AI-Native Features */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-green-600" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">The After: AI-Native Intelligence Layers</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {aiNativeFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 bg-background/50 rounded-lg p-3 border border-border/50">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm lg:text-base text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What This Means for Hobson */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-primary">What This Means for Hobson</h4>
        </div>
        <p className="text-sm lg:text-base text-muted-foreground mb-4">
          Hobson is positioned within a large and durable UK vertical, a global market undergoing structural change and an industry where early trust compounds into long-term defensibility.
        </p>
        <p className="text-xs lg:text-sm text-muted-foreground italic">
          This section is not about pricing or near-term monetisation. It establishes why this market is worth building infrastructure for and why the upside is category-scale.
        </p>
      </div>
    </div>
  );
};
