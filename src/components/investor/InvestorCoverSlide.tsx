import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import investorSplitScreenImage from '@/assets/investor-split-screen-v2.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="text-center text-lg font-semibold text-foreground px-4">
        By 2030 $1.8T to be spent by the property industry on AI
      </div>
      <div className="flex items-end justify-center" style={{ marginBottom: '-107px' }}>
        <OptimizedImage
          src={investorSplitScreenImage}
          alt="Split-screen comparison showing transformation from chaotic paperwork to organized digital workspace with AI-powered property management"
          className="rounded-lg shadow-lg max-w-full h-auto"
          width={400}
          height={400}
          priority={true}
        />
      </div>
    </div>
  );
};