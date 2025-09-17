import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import investorSplitScreenImage from '@/assets/investor-split-screen-v2.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="h-full flex flex-col px-2 sm:px-4 relative" style={{ height: '100%', minHeight: '200px', position: 'relative' }}>
      <div className="absolute top-1/4 left-0 right-0 text-center text-xs sm:text-sm md:text-base font-semibold text-foreground px-2 leading-tight">
        By 2030, the property industry will spend $1.8T on AI - <span className="text-primary">Enter Hobson AI</span>
      </div>
      <div className="flex-1 flex items-center justify-center pt-8 sm:pt-12">
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