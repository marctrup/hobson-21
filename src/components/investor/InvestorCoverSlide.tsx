import React from 'react';

export const InvestorCoverSlide = () => {
  return (
    <div className="space-y-4 sm:space-y-6 text-center">
      {/* Main Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Hobson AI
        </h1>
        <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full"></div>
      </div>

      {/* Market Opportunity Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-xl p-3 sm:p-4 border border-primary/20">
        <p className="text-sm sm:text-base font-bold text-primary leading-tight">
          Capturing a $1.8T AI-in-Property opportunity by 2030
        </p>
      </div>

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