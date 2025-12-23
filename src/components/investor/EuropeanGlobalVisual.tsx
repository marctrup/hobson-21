import React from 'react';
import { TrendingUp, Globe, CheckCircle, AlertTriangle } from 'lucide-react';

export const EuropeanGlobalVisual = () => {
  const researchFindings = [
    "AI adoption in Real Estate is growing at ~35–36% CAGR",
    "A projected $1.8T global AI-in-real-estate market by 2030",
    "Measurable NOI and operational performance improvements at scale",
  ];

  const structuralPressures = [
    "Labour shortages",
    "Rising compliance and ESG requirements",
    "Margin compression",
    "Increasing asset complexity",
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Intro text */}
      <div className="text-sm lg:text-base text-muted-foreground">
        Independent global research firms consistently show:
      </div>

      {/* Research findings */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Global Market Research</h4>
        </div>
        <div className="space-y-3">
          {researchFindings.map((finding, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm lg:text-base text-foreground">{finding}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Structural pressure intro */}
      <div className="text-sm lg:text-base text-muted-foreground">
        This growth is not driven by experimentation, but by structural pressure:
      </div>

      {/* Structural pressures */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Structural Pressures Driving Adoption</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {structuralPressures.map((pressure, index) => (
            <div key={index} className="flex items-center gap-3 bg-background/50 rounded-lg p-3 border border-border/50">
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span className="text-sm lg:text-base text-foreground">{pressure}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-primary">UK Within Global Context</h4>
        </div>
        <p className="text-sm lg:text-base text-muted-foreground">
          The UK opportunity, therefore, sits inside a much larger global transition, with similar regulatory and document dynamics across Europe, North America, and OECD markets.
        </p>
      </div>
    </div>
  );
};
