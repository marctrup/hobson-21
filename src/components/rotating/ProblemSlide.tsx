import React from 'react';
import { TrendingUp, PoundSterling, FileText, X } from 'lucide-react';

export const ProblemSlide = () => {
  const problems = [
    { icon: PoundSterling, text: 'Expensive monthly subscriptions', color: 'text-danger' },
    { icon: FileText, text: 'Manual, time-consuming data extraction', color: 'text-danger' },
    { icon: X, text: 'Complex, menu-driven interfaces', color: 'text-danger' },
    { icon: TrendingUp, text: 'Slow onboarding and steep learning curve', color: 'text-danger' }
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="grid grid-cols-1 gap-2 sm:gap-4">
        {problems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-danger-bg rounded-lg border border-danger-border">
            <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color} flex-shrink-0`} />
            <span className="text-foreground font-medium text-xs sm:text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};