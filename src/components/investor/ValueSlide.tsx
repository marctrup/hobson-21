import React from 'react';
import { Sparkles, TrendingDown, TrendingUp } from 'lucide-react';

export const ValueSlide = () => {
  const values = [
    { icon: Sparkles, label: 'Instant Insight', color: 'from-[#7c3aed] to-[#a78bfa]' },
    { icon: TrendingDown, label: 'Lower Costs', color: 'from-[#06b6d4] to-[#22d3ee]' },
    { icon: TrendingUp, label: 'Productivity Gains', color: 'from-[#10b981] to-[#34d399]' }
  ];

  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-12 sm:pb-20">
      <div className="text-center max-w-2xl space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e293b] leading-tight">
          Clarity From Chaos
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-3 sm:py-6">
          {values.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <span className="text-xs sm:text-sm md:text-base text-[#1e293b] font-semibold">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-sm sm:text-base md:text-xl text-primary leading-relaxed font-semibold max-w-xl mx-auto px-2">
          Unlocking real AI value across the real estate stack
        </p>
      </div>
    </div>
  );
};
