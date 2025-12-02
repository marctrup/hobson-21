import React from 'react';
import hobsonWeb from '@/assets/hobson-web-interface.png';
import hobsonMobile from '@/assets/hobson-mobile-interface.png';

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

        <div className="flex items-center justify-center gap-3 sm:gap-6 py-2 sm:py-4">
          {/* Web Interface */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className="rounded-lg overflow-hidden shadow-lg border border-[#e2e8f0] bg-white">
              <img 
                src={hobsonWeb} 
                alt="Hobson web interface" 
                className="w-36 sm:w-48 md:w-64 h-auto object-cover"
              />
            </div>
            <span className="text-[10px] sm:text-xs text-[#64748b] font-medium">Web</span>
          </div>

          {/* Mobile Interface */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className="rounded-xl overflow-hidden shadow-lg border border-[#e2e8f0] bg-white">
              <img 
                src={hobsonMobile} 
                alt="Hobson mobile interface" 
                className="w-20 sm:w-28 md:w-36 h-auto object-cover"
              />
            </div>
            <span className="text-[10px] sm:text-xs text-[#64748b] font-medium">Mobile</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm md:text-base text-[#7c3aed] leading-relaxed font-semibold max-w-md mx-auto px-2">
          Ask questions. Get instant, referenced answers.
        </p>
      </div>
    </div>
  );
};
