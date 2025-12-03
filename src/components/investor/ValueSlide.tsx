import React from 'react';
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

        <div className="flex items-center justify-center py-2 sm:py-4 -mt-[3px]">
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <img 
              src={heuUsage} 
              alt="HEU Usage Display" 
              className="w-36 h-auto sm:w-48 md:w-56 rounded-lg shadow-md"
              loading="lazy"
              decoding="async"
            />
            <span className="text-[10px] sm:text-xs text-primary font-medium">Real-time Usage</span>
          </div>
        </div>

      </div>
    </div>
  );
};
