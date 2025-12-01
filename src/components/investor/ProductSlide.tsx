import React from 'react';
import { Plus, Shield, Zap } from 'lucide-react';

export const ProductSlide = () => {
  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-12 sm:pb-20">
      <div className="text-center max-w-2xl space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e293b] leading-tight px-2">
          Innovation That Fits,<br />Not Replaces
        </h2>

        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 py-4 sm:py-6">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-[#f1f5f9]">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 text-[#475569]" />
            <span className="text-[10px] sm:text-xs md:text-sm text-[#475569] font-medium">Your tools</span>
          </div>
          
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 text-[#7c3aed]" strokeWidth={3} />
          
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa]">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 text-white" />
            <span className="text-[10px] sm:text-xs md:text-sm text-white font-semibold">Hobson AI</span>
          </div>
        </div>

        <p className="text-sm sm:text-base md:text-xl text-[#7c3aed] leading-relaxed font-semibold max-w-xl mx-auto px-2">
          Enterprise-grade accuracy with zero workflow friction
        </p>
      </div>
    </div>
  );
};
