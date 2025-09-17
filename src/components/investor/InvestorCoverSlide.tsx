import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import investorSplitScreenImage from '@/assets/investor-split-screen-v2.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="h-full flex flex-col px-2 sm:px-4" style={{ height: '100%', minHeight: '200px' }}>
      <div className="text-center space-y-1 sm:space-y-2 md:space-y-4 flex flex-col h-full">
        <div className="text-xs sm:text-sm md:text-base font-semibold text-foreground px-2 leading-tight flex-shrink-0 py-1">
          By 2030, the property industry will spend £1.4T on AI - <span className="text-primary">Enter Hobson AI</span>
        </div>
        <div className="flex items-center justify-center flex-1 min-h-0 max-h-[60%]">
          <OptimizedImage
            src={investorSplitScreenImage}
            alt="Split-screen comparison showing transformation from chaotic paperwork to organized digital workspace with AI-powered property management"
            className="rounded-lg shadow-lg max-w-full h-auto w-full max-w-[120px] sm:max-w-[200px] md:max-w-[288px] object-contain"
            width={400}
            height={400}
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};