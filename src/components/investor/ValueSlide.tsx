import React from 'react';
import { Sparkles, TrendingDown, TrendingUp } from 'lucide-react';

export const ValueSlide = () => {
  const values = [
    { icon: Sparkles, label: 'Instant Insight', color: 'from-[#7c3aed] to-[#a78bfa]' },
    { icon: TrendingDown, label: 'Lower Costs', color: 'from-[#06b6d4] to-[#22d3ee]' },
    { icon: TrendingUp, label: 'Productivity Gains', color: 'from-[#10b981] to-[#34d399]' }
  ];

  return (
    <div className="h-full flex items-center justify-center px-6 sm:px-8 pb-20">
      <div className="text-center max-w-2xl space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e293b] leading-tight">
          Clarity From Chaos
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
          {values.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="text-sm sm:text-base text-[#1e293b] font-semibold">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-base sm:text-xl text-[#475569] leading-relaxed font-light max-w-xl mx-auto">
          Unlocking real AI value across the real estate stack
        </p>
      </div>
    </div>
  );
};
