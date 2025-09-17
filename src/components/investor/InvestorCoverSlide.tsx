import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import investorSplitScreenImage from '@/assets/investor-split-screen-v2.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-1">
      <div className="text-center text-xs sm:text-lg font-semibold text-foreground px-2 leading-tight border-2 border-red-500" style={{ marginTop: '20px', marginBottom: '8px' }}>
        By 2030, the property industry will spend $1.8T on AI - <span className="text-primary">Enter Hobson AI</span>
      </div>
      <div className="flex items-center justify-center w-full border-2 border-red-500" style={{ marginTop: '5px' }}>
        <OptimizedImage
          src={investorSplitScreenImage}
          alt="Split-screen comparison showing transformation from chaotic paperwork to organized digital workspace with AI-powered property management"
          className="rounded-lg shadow-lg max-w-full h-auto w-full max-w-[300px] sm:max-w-[400px]"
          width={400}
          height={400}
          priority={true}
        />
      </div>
    </div>
  );
};