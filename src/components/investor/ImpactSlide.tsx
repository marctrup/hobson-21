import React from 'react';
import { Layers, Scissors, Rocket } from 'lucide-react';

export const ImpactSlide = () => {
  const impacts = [
    { icon: Layers, text: 'Elevates workflows' },
    { icon: Scissors, text: 'Cuts waste' },
    { icon: Rocket, text: 'Accelerates adoption' }
  ];

  return (
    <div className="h-full flex items-center justify-center px-6 sm:px-8">
      <div className="text-center max-w-2xl space-y-8">
        <div className="space-y-3">
          <div className="text-xs sm:text-sm font-semibold text-[#7c3aed] uppercase tracking-wider">
            The Impact
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#1e293b] leading-tight">
            Efficiency Without<br />Upheaval
          </h2>
        </div>

        <div className="space-y-4 py-6">
          {impacts.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-[#f8fafc] border-l-4 border-[#7c3aed]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#7c3aed]" />
              </div>
              <span className="text-base sm:text-lg text-[#1e293b] font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <p className="text-base sm:text-xl text-[#475569] leading-relaxed font-light max-w-xl mx-auto">
          A lightweight layer that transforms operations
        </p>
      </div>
    </div>
  );
};
