import React from 'react';
import { Plus, Shield, Zap } from 'lucide-react';

export const ProductSlide = () => {
  return (
    <div className="h-full flex items-center justify-center px-6 sm:px-8">
      <div className="text-center max-w-2xl space-y-8">
        <div className="space-y-3">
          <div className="text-xs sm:text-sm font-semibold text-[#7c3aed] uppercase tracking-wider">
            The Product
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#1e293b] leading-tight">
            Innovation That Fits,<br />Not Replaces
          </h2>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 py-6">
          <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-[#f1f5f9]">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#475569]" />
            <span className="text-xs sm:text-sm text-[#475569] font-medium">Your CRMs</span>
          </div>
          
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[#7c3aed]" strokeWidth={3} />
          
          <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa]">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <span className="text-xs sm:text-sm text-white font-semibold">Hobson AI</span>
          </div>
        </div>

        <p className="text-base sm:text-xl text-[#475569] leading-relaxed font-light max-w-xl mx-auto">
          Enterprise-grade accuracy with zero workflow friction
        </p>
      </div>
    </div>
  );
};
