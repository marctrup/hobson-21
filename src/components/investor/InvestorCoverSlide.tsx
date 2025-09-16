import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import investorSplitScreenImage from '@/assets/investor-split-screen-v2.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="flex items-center justify-center mt-2">
      <OptimizedImage
        src={investorSplitScreenImage}
        alt="Split-screen comparison showing transformation from chaotic paperwork to organized digital workspace with AI-powered property management"
        className="rounded-lg shadow-lg max-w-full h-auto border-2 border-red-500"
        width={400}
        height={400}
        priority={true}
      />
    </div>
  );
};