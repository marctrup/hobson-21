import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import investorSplitScreenImage from '@/assets/investor-split-screen-v2.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="flex flex-col items-center justify-start h-full px-2 sm:px-4 pt-4 sm:pt-6">
      <div className="text-center text-[11px] sm:text-xs md:text-sm font-semibold text-foreground px-2 leading-tight mb-3 sm:mb-4">
        By 2030, the property industry will spend $1.8T on AI - <span className="text-primary">Enter Hobson AI</span>
      </div>
      <div className="flex items-center justify-center w-full flex-1">
        <OptimizedImage
          src={investorSplitScreenImage}
          alt="Split-screen comparison showing transformation from chaotic paperwork to organized digital workspace with AI-powered property management"
          className="rounded-lg shadow-lg max-w-full h-auto w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] object-contain"
          width={400}
          height={400}
          priority={true}
        />
      </div>
    </div>
  );
};