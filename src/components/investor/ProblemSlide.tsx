import React from 'react';
import { FileQuestion, Split, Clock } from 'lucide-react';

export const ProblemSlide = () => {
  const problems = [
    { icon: Split, label: 'Scattered Documents' },
    { icon: FileQuestion, label: 'Fragmented Systems' },
    { icon: Clock, label: 'Manual Processes' }
  ];

  return (
    <div className="h-full flex items-center justify-center px-6 sm:px-8">
      <div className="text-center max-w-2xl space-y-8">
        <div className="space-y-3">
          <div className="text-xs sm:text-sm font-semibold text-[#7c3aed] uppercase tracking-wider">
            The Problem
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#1e293b] leading-tight">
            The Industry's Blind Spot
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 sm:gap-6 py-6">
          {problems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#7c3aed]" />
              </div>
              <span className="text-xs sm:text-sm text-[#475569] font-medium leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-base sm:text-xl text-[#475569] leading-relaxed font-light max-w-xl mx-auto">
          Making fast, accurate answers hard to get
        </p>
      </div>
    </div>
  );
};
