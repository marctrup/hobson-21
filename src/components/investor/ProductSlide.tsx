import React from 'react';
import hobsonWeb from '@/assets/hobson-web-interface.png';
import hobsonMobile from '@/assets/hobson-mobile-interface.png';
import desktopFrame from '@/assets/desktop-frame.png';
import phoneFrame from '@/assets/phone-frame.png';

export const ProductSlide = () => {
  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-16 sm:pb-20">
      <div className="text-center max-w-3xl space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#1e293b] leading-tight px-2">
          Simple Interface.<br />Powerful Results.
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-[#475569] max-w-lg mx-auto px-2">
          No training required. Works where you already work.
        </p>

        <div className="flex items-start justify-center gap-4 sm:gap-6 py-2 sm:py-4">
          {/* Desktop with screenshot */}
          <div className="relative">
            <img 
              src={desktopFrame} 
              alt="Desktop" 
              className="w-44 sm:w-56 md:w-72 h-auto"
            />
            <img 
              src={hobsonWeb} 
              alt="Hobson web interface" 
              className="absolute top-[4%] left-[4%] w-[92%] h-[70%] object-cover"
            />
          </div>

          {/* Phone with screenshot */}
          <div className="relative mt-[6px]">
            <img 
              src={phoneFrame} 
              alt="Phone" 
              className="w-14 sm:w-20 md:w-24 h-auto"
            />
            <img 
              src={hobsonMobile} 
              alt="Hobson mobile interface" 
              className="absolute top-[3%] left-[5%] w-[90%] h-[94%] object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
