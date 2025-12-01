import React from 'react';
import { Layers, Scissors, Rocket } from 'lucide-react';

export const ImpactSlide = () => {
  const impacts = [
    { icon: Layers, text: 'Elevates workflows' },
    { icon: Scissors, text: 'Cuts waste' },
    { icon: Rocket, text: 'Accelerates adoption' }
  ];

  return (
    <div className="h-full flex items-center justify-center px-6 sm:px-8 pb-20">
      <div className="text-center max-w-2xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e293b] leading-tight">
          Efficiency Without<br />Upheaval
        </h2>

        <div className="space-y-2 py-3">
          {impacts.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#f8fafc] border-l-4 border-[#7c3aed]">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <item.icon className="w-4 h-4 text-[#7c3aed]" />
              </div>
              <span className="text-sm text-[#1e293b] font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <p className="text-base sm:text-xl text-[#475569] leading-relaxed font-light max-w-xl mx-auto pb-2">
          A lightweight layer that transforms operations
        </p>
      </div>
    </div>
  );
};
