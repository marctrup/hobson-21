import React from 'react';
import { Zap, Target, BarChart3, Shield } from 'lucide-react';

export const ValuePropositionSlide = () => {
  const solutions = [
    { icon: Zap, text: 'Lightweight, low-cost AI solution', color: 'text-primary' },
    { icon: Target, text: 'Instant, accurate document analysis', color: 'text-primary' },
    { icon: BarChart3, text: 'Measurable time & cost savings', color: 'text-primary' },
    { icon: Shield, text: 'Trusted, scalable platform', color: 'text-primary' }
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Hobson's Solution</h3>
        <p className="text-xs text-muted-foreground">Replacing bloated systems with intelligent efficiency</p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {solutions.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
            <item.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${item.color} flex-shrink-0`} />
            <span className="text-foreground font-medium text-xs sm:text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};