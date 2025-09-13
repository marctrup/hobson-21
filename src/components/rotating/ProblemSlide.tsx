import React from 'react';
import { TrendingUp, PoundSterling, FileText, X } from 'lucide-react';

export const ProblemSlide = () => {
  const problems = [
    { icon: PoundSterling, text: 'Expensive monthly subscriptions', color: 'text-red-500' },
    { icon: TrendingUp, text: 'Pricing that punishes growth', color: 'text-red-500' },
    { icon: FileText, text: 'Manual information extraction', color: 'text-red-500' },
    { icon: X, text: 'Complex, menu-driven interface', color: 'text-red-500' }
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="grid grid-cols-1 gap-2 sm:gap-4">
        {problems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
            <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color} flex-shrink-0`} />
            <span className="text-foreground font-medium text-xs sm:text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};