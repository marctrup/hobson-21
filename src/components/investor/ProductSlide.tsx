import React from 'react';
import { Plus, Shield, Zap } from 'lucide-react';

export const ProductSlide = () => {
  return (
    <div className="h-full flex items-center justify-center px-6 sm:px-8 pb-20">
      <div className="text-center max-w-2xl space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e293b] leading-tight">
          Innovation That Fits,<br />Not Replaces
        </h2>

        <div className="flex items-center justify-center gap-3 sm:gap-4 py-6">
          <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-[#f1f5f9]">
            <Shield className="w-7 h-7 sm:w-10 sm:h-10 text-[#475569]" />
            <span className="text-xs sm:text-sm text-[#475569] font-medium">Your tools</span>
          </div>
          
          <Plus className="w-7 h-7 sm:w-10 sm:h-10 text-[#7c3aed]" strokeWidth={3} />
          
          <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa]">
            <Zap className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            <span className="text-xs sm:text-sm text-white font-semibold">Hobson AI</span>
          </div>
        </div>

        <p className="text-base sm:text-xl text-[#7c3aed] leading-relaxed font-semibold max-w-xl mx-auto">
          Enterprise-grade accuracy with zero workflow friction
        </p>
      </div>
    </div>
  );
};
