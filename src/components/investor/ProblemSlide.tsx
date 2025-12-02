import React from 'react';
export const ProblemSlide = () => {
  const markets = [{
    region: 'UK',
    value: '£6B',
    size: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
    gradient: 'from-[#c4b5fd] to-[#a78bfa]'
  }, {
    region: 'Europe',
    value: '£66B',
    size: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
    gradient: 'from-[#a78bfa] to-[#8b5cf6]'
  }, {
    region: 'Global',
    value: '£708B',
    size: 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32',
    gradient: 'from-[#8b5cf6] to-[#7c3aed]'
  }];
  return <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-8 sm:pb-16">
      <div className="text-center max-w-2xl space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e293b] leading-tight">
          The AI Opportunity
        </h2>
        
        <div className="flex items-end justify-center gap-4 sm:gap-6 md:gap-8 py-2 sm:py-3">
          {markets.map((item, idx) => <div key={idx} className="flex flex-col items-center">
              <div className={`${item.size} rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                <span className="text-[10px] sm:text-sm md:text-base font-bold text-white">
                  {item.value}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#1e293b] mt-2">
                {item.region}
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-[#64748b]">
                Efficiency savings
              </span>
            </div>)}
        </div>

        <p className="text-xs sm:text-sm md:text-base text-[#475569] leading-relaxed max-w-md mx-auto px-2 pt-2">Proving our model in the UK’s £6B efficiency-saving market sets us up to scale across Europe and into a £708B global space.</p>
      </div>
    </div>;
};