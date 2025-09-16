import React from 'react';
import { AlertTriangle, DollarSign, Clock, Users } from 'lucide-react';

export const MarketProblemSlide = () => {
  const problems = [
    { icon: DollarSign, text: 'Budgets drained by bloated, expensive systems', color: 'text-red-500' },
    { icon: Clock, text: 'Hours lost to manual document handling', color: 'text-red-500' },
    { icon: AlertTriangle, text: 'Profitability reduced by inefficient workflows', color: 'text-red-500' },
    { icon: Users, text: 'Low adoption due to unnecessary complexity', color: 'text-red-500' }
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Market Opportunity</h3>
        <p className="text-xs text-muted-foreground">AI-in-Property is projected to become a $1.8T market by 2030 — primed for solutions that are lightweight, accurate, and scalable.</p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {problems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
            <item.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${item.color} flex-shrink-0`} />
            <span className="text-foreground font-medium text-xs sm:text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};