import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import investorSplitScreenImage from '@/assets/investor-split-screen-v2.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="h-full flex flex-col justify-center px-2 sm:px-4" style={{ height: '100%', minHeight: '200px' }}>
      <div className="text-center space-y-1 sm:space-y-2 md:space-y-4 h-full flex flex-col">
        <div className="text-xs sm:text-sm md:text-base font-semibold text-foreground px-2 leading-tight flex-shrink-0 py-1">
          By 2030, the property industry will spend £1.4T on AI - <span className="text-primary">Enter Hobson AI</span>
        </div>
        <div className="flex items-center justify-center flex-1 min-h-0 px-2">
          <div className="w-full max-w-[180px] sm:max-w-[240px] md:max-w-[300px]">
            <OptimizedImage
              src={investorSplitScreenImage}
              alt="Split-screen comparison showing transformation from chaotic paperwork to organized digital workspace with AI-powered property management"
              className="rounded-lg shadow-lg w-full h-auto object-contain"
              width={400}
              height={400}
              priority={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};