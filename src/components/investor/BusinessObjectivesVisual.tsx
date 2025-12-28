import React from 'react';
import { Target, TrendingUp, Users, Rocket, Shield, Globe, Zap, Award } from 'lucide-react';

const objectives = [
  {
    icon: Target,
    title: "Category Leadership",
    description: "Establish Hobson as the trusted AI intelligence layer for UK real estate within 24 months",
    metrics: ["First-mover positioning", "Brand recognition", "Thought leadership"],
    color: "from-primary/10 to-primary/20",
    iconColor: "text-primary",
    borderColor: "border-primary/20"
  },
  {
    icon: TrendingUp,
    title: "Revenue Growth",
    description: "Achieve sustainable, high-margin recurring revenue through usage-based pricing",
    metrics: ["100%+ net revenue retention", "Predictable HEU consumption", "Low churn"],
    color: "from-emerald-500/10 to-emerald-600/20",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-500/20"
  },
  {
    icon: Users,
    title: "Customer Acquisition",
    description: "Grow customer base through product-led growth and enterprise referrals",
    metrics: ["Viral adoption within firms", "High NPS scores", "Case study pipeline"],
    color: "from-blue-500/10 to-blue-600/20",
    iconColor: "text-blue-600",
    borderColor: "border-blue-500/20"
  },
  {
    icon: Rocket,
    title: "Product Excellence",
    description: "Deliver an AI assistant that sets the standard for accuracy, speed, and usability",
    metrics: ["Sub-second responses", "95%+ accuracy", "Intuitive UX"],
    color: "from-amber-500/10 to-amber-600/20",
    iconColor: "text-amber-600",
    borderColor: "border-amber-500/20"
  },
];

const strategicPriorities = [
  { icon: Shield, text: "Build defensible trust with enterprise customers" },
  { icon: Globe, text: "Prepare for European expansion by Q4 2026" },
  { icon: Zap, text: "Maintain technical velocity and innovation edge" },
  { icon: Award, text: "Establish industry partnerships and integrations" },
];

const BusinessObjectivesVisual = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-lg text-muted-foreground italic">
          Clear objectives drive every decision, from product development to go-to-market strategy.
        </p>
      </div>

      {/* Main Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {objectives.map((objective, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${objective.color} rounded-2xl p-6 border ${objective.borderColor}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-background/50 rounded-xl`}>
                <objective.icon className={`w-6 h-6 ${objective.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-foreground">{objective.title}</h3>
            </div>
            
            <p className="text-muted-foreground mb-4">{objective.description}</p>
            
            <div className="space-y-2">
              {objective.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${objective.iconColor} bg-current`} />
                  <span className="text-sm text-foreground">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Priorities */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-8 border border-primary/20">
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Strategic Priorities</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategicPriorities.map((priority, index) => (
            <div key={index} className="flex items-center gap-3 bg-background/50 rounded-lg p-4 border border-primary/10">
              <priority.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-foreground">{priority.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <p className="text-center text-foreground">
          These objectives align product, sales, and operations toward a single goal:{' '}
          <span className="text-primary font-semibold">becoming the category-defining AI platform for real estate professionals</span>.
        </p>
      </div>
    </div>
  );
};

export default BusinessObjectivesVisual;
