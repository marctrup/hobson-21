import React from 'react';
import { Wallet, CheckCircle, FileText, Users } from 'lucide-react';

export const SolutionSlide = () => {
  const solutions = [
    { icon: Wallet, text: 'Budget-friendly plans', color: 'text-primary' },
    { icon: CheckCircle, text: 'Fast, reliable answers from source documents', color: 'text-primary' },
    { icon: FileText, text: 'Simple, lightweight interface', color: 'text-primary' },
    { icon: Users, text: 'Quick to set up and easy to use', color: 'text-primary' }
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="grid grid-cols-1 gap-2 sm:gap-4">
        {solutions.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
            <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color} flex-shrink-0`} />
            <span className="text-foreground font-medium text-xs sm:text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};