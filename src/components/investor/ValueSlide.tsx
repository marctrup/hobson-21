import React from 'react';
import heuCoin from '@/assets/heu-coin.png';
import heuUsage from '@/assets/heu-usage-display.png';

export const ValueSlide = () => {
  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-16 sm:pb-20">
      <div className="text-center max-w-3xl space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#1e293b] leading-tight px-2">
          Transparent, Low-Cost Pricing
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-[#475569] max-w-lg mx-auto px-2">
          Pay only for what you use with Hobson Energy Units
        </p>

        <div className="flex items-center justify-center gap-4 sm:gap-8 py-2 sm:py-4">
          {/* HEU Coin */}
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <img 
              src={heuCoin} 
              alt="HEU Coin" 
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
            />
            <span className="text-[10px] sm:text-xs text-[#475569] font-medium">HEU Currency</span>
          </div>

          {/* Usage Display */}
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <img 
              src={heuUsage} 
              alt="HEU Usage Display" 
              className="w-28 h-auto sm:w-40 md:w-48 rounded-lg shadow-md"
            />
            <span className="text-[10px] sm:text-xs text-[#475569] font-medium">Real-time Usage</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-primary leading-snug font-semibold max-w-xl mx-auto px-2">
          Full visibility into every query cost
        </p>
      </div>
    </div>
  );
};
