import React from 'react';
import { FileQuestion, Split, Clock } from 'lucide-react';

export const ProblemSlide = () => {
  const problems = [
    { icon: Split, label: 'Scattered Documents' },
    { icon: FileQuestion, label: 'Fragmented Systems' },
    { icon: Clock, label: 'Manual Processes' }
  ];

  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 pb-12 sm:pb-20">
      <div className="text-center max-w-2xl space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e293b] leading-tight">
          The Industry's Blind Spot
        </h2>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 py-2 sm:py-4">
          {problems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 sm:gap-2">
              <div className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                <item.icon className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#7c3aed]" />
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm text-[#475569] font-medium leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-sm sm:text-base md:text-xl text-[#7c3aed] leading-relaxed font-semibold max-w-xl mx-auto px-2">
          Making fast, accurate answers hard to get
        </p>
      </div>
    </div>
  );
};
