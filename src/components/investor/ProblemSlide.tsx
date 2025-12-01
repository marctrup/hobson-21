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
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#7c3aed]" />
              </div>
              <span className="text-xs sm:text-sm text-[#475569] font-medium leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-light max-w-xl mx-auto">
          Making fast, accurate answers hard to get
        </p>
      </div>
    </div>
  );
};
