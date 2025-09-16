import React from 'react';

export const InvestorCoverSlide = () => {
  return (
    <div className="space-y-4 sm:space-y-6 text-center">
      {/* Key Points */}
      <div className="space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-destructive"></div>
          <p className="text-xs sm:text-sm font-semibold text-destructive">
            Manual processes waste billions in time & costs
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <p className="text-xs sm:text-sm font-semibold text-green-600">
            AI can unlock £708B+ global efficiency savings
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-background to-primary/5 rounded-lg p-2 sm:p-3 border border-primary/10">
          <p className="text-sm sm:text-base font-bold text-foreground">
            Hobson: lightweight, accurate, scalable AI for property
          </p>
        </div>
      </div>
    </div>
  );
};