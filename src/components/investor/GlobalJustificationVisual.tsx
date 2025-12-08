import React from 'react';
import { Globe, TrendingUp, Users, Building2, Zap, Target } from 'lucide-react';

const GlobalJustificationVisual = () => {
  const globalFactors = [
    {
      icon: Globe,
      title: "Universal Pain Point",
      description: "Property document complexity exists in every market. Hobson's core value proposition—turning documents into insight—translates globally without product changes."
    },
    {
      icon: Building2,
      title: "Market Structure Similarity",
      description: "Fragmented property management across UK, Europe, and global markets creates identical adoption conditions. No single dominant platform to displace."
    },
    {
      icon: Zap,
      title: "Zero Localisation Barrier",
      description: "AI-native architecture handles multi-language documents natively. No manual translation or market-specific product builds required."
    },
    {
      icon: Users,
      title: "Proven UK Playbook",
      description: "UK market validation provides replicable go-to-market strategy. Pilot learnings, pricing model, and onboarding approach transfer directly to new markets."
    },
    {
      icon: TrendingUp,
      title: "Global AI Adoption Wave",
      description: "65% AI investment intent is a global trend, not UK-specific. International markets show equal or greater appetite for AI-powered efficiency tools."
    },
    {
      icon: Target,
      title: "Strategic Market Selection",
      description: "2028+ expansion targets English-speaking markets first (Ireland, Australia, Canada), then EU markets with established property sectors."
    }
  ];

  const expansionTimeline = [
    { year: "2026-2027", focus: "UK", markets: "United Kingdom", notes: "Validate, scale, achieve 3% penetration" },
    { year: "2028", focus: "Phase 1", markets: "Ireland, Australia", notes: "English-speaking, similar legal frameworks" },
    { year: "2029", focus: "Phase 2", markets: "Canada, Netherlands, Germany", notes: "Mature property markets, high AI readiness" },
    { year: "2030", focus: "Phase 3", markets: "France, Spain, Nordics", notes: "Broader EU expansion, localised support" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">Why Global Expansion Is Credible</h3>
        <p className="text-muted-foreground">
          Hobson's architecture and market positioning enable efficient international scaling
        </p>
      </div>

      {/* Key Factors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {globalFactors.map((factor, index) => (
          <div key={index} className="bg-secondary/30 rounded-lg p-4 border border-border/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <factor.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{factor.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{factor.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expansion Timeline */}
      <div className="bg-secondary/20 rounded-lg p-6 border border-border/50">
        <h4 className="font-semibold text-foreground mb-4 text-center">Global Expansion Timeline</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Timeline</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Phase</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Markets</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Strategy</th>
              </tr>
            </thead>
            <tbody>
              {expansionTimeline.map((phase, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-3 px-3 font-medium text-foreground">{phase.year}</td>
                  <td className="py-3 px-3 text-primary font-medium">{phase.focus}</td>
                  <td className="py-3 px-3 text-foreground">{phase.markets}</td>
                  <td className="py-3 px-3 text-muted-foreground">{phase.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/20 text-center">
        <p className="text-foreground font-medium">
          <span className="text-primary font-bold">Global Thesis:</span> Hobson's frictionless, language-agnostic AI architecture 
          combined with proven UK playbook enables capital-efficient expansion to £101B global SAM, 
          targeting 2-4% international penetration by 2030.
        </p>
      </div>
    </div>
  );
};

export default GlobalJustificationVisual;
