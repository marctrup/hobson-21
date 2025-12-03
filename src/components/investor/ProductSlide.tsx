import React from 'react';
import hobsonCarouselDevices from '@/assets/hobson-carousel-devices.png';

export const ProductSlide = () => {
  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-16 sm:pb-20">
      <div className="text-center max-w-3xl space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#1e293b] leading-tight px-2">
          Simple Interface.<br />Powerful Results.
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-[#475569] max-w-lg mx-auto px-2">
          No training, instant referenced answers
        </p>

        <div className="flex justify-center py-2 sm:py-4">
          <img 
            src={hobsonCarouselDevices} 
            alt="Hobson interface on desktop and mobile" 
            className="w-full max-w-md sm:max-w-lg md:max-w-xl h-auto"
          />
        </div>
      </div>
    </div>
  );
};
