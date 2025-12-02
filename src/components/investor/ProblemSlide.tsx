import React from 'react';

export const ProblemSlide = () => {
  const markets = [
    { region: 'UK', value: '£6B' },
    { region: 'Europe', value: '£66B' },
    { region: 'Global', value: '£660B' }
  ];

  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-8 sm:pb-16">
      <div className="text-center max-w-2xl space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e293b] leading-tight">
          The AI Opportunity
        </h2>
        
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 py-2 sm:py-3">
          {markets.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                {item.region}
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#7c3aed]">
                {item.value}
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-[#94a3b8] mt-1">
                Efficiency savings
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm md:text-base text-[#475569] leading-relaxed max-w-md mx-auto px-2 pt-2">
          AI-driven efficiency gains in real estate operations
        </p>
      </div>
    </div>
  );
};
