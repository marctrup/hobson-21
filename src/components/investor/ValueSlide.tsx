import React from 'react';
import { Sparkles, TrendingDown, TrendingUp } from 'lucide-react';

export const ValueSlide = () => {
  const values = [
    { icon: Sparkles, label: 'Instant Insight', color: 'from-[#7c3aed] to-[#a78bfa]' },
    { icon: TrendingDown, label: 'Lower Costs', color: 'from-[#06b6d4] to-[#22d3ee]' },
    { icon: TrendingUp, label: 'Productivity Gains', color: 'from-[#10b981] to-[#34d399]' }
  ];

  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-24 sm:pb-20">
      <div className="text-center max-w-2xl space-y-2 sm:space-y-4 md:space-y-6">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#1e293b] leading-tight">
          Clarity From Chaos
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 py-1 sm:py-2 md:py-4">
          {values.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-[#1e293b] font-semibold">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm md:text-base lg:text-xl text-primary leading-snug sm:leading-relaxed font-semibold max-w-xl mx-auto px-2 pb-2">
          Unlocking real AI value across the real estate stack
        </p>
      </div>
    </div>
  );
};
