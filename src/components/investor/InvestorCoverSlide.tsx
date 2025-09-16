import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import investorSplitScreenImage from '@/assets/investor-split-screen-v2.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2" style={{ marginBottom: '-107px' }}>
      <OptimizedImage
        src={investorSplitScreenImage}
        alt="Split-screen comparison showing transformation from chaotic paperwork to organized digital workspace with AI-powered property management"
        className="rounded-lg shadow-lg max-w-full h-auto"
        width={400}
        height={400}
        priority={true}
      />
    </div>
  );
};