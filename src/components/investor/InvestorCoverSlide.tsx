import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import investorSplitScreenImage from '@/assets/investor-split-screen-v2.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="flex flex-col items-center justify-start h-full px-2 sm:px-4 pt-2 sm:pt-4">
      <div className="text-center text-xs sm:text-sm md:text-base font-semibold text-foreground px-2 leading-tight mb-2 sm:mb-3">
        By 2030, the property industry will spend $1.8T on AI - <span className="text-primary">Enter Hobson AI</span>
      </div>
      <div className="flex items-center justify-center w-full flex-1 min-h-0">
        <OptimizedImage
          src={investorSplitScreenImage}
          alt="Split-screen comparison showing transformation from chaotic paperwork to organized digital workspace with AI-powered property management"
          className="rounded-lg shadow-lg max-w-full h-auto w-full max-w-[160px] sm:max-w-[200px] md:max-w-[240px] object-contain"
          width={400}
          height={400}
          priority={true}
        />
      </div>
    </div>
  );
};