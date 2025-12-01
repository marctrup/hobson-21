import React from 'react';
import { FileQuestion, Split, Clock } from 'lucide-react';

export const ProblemSlide = () => {
  const problems = [
    { icon: Split, label: 'Scattered Documents' },
    { icon: FileQuestion, label: 'Fragmented Systems' },
    { icon: Clock, label: 'Manual Processes' }
  ];

  return (
    <div className="h-full flex items-center justify-center px-6 sm:px-8 pb-20">
      <div className="text-center max-w-2xl space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e293b] leading-tight">
          The Industry's Blind Spot
        </h2>
        
        <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4">
          {problems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                <item.icon className="w-7 h-7 sm:w-10 sm:h-10 text-[#7c3aed]" />
              </div>
              <span className="text-xs sm:text-sm text-[#475569] font-medium leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-lg sm:text-2xl text-[#7c3aed] leading-relaxed font-semibold max-w-xl mx-auto">
          Making fast, accurate answers hard to get
        </p>
      </div>
    </div>
  );
};
