import React from 'react';

export const InvestorCoverSlide = () => {
  return (
    <div className="space-y-3 sm:space-y-4 text-center">
      {/* The Problem */}
      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-destructive">The Problem</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
          Property professionals waste billions on bloated, slow, and costly systems. Manual processes drain time, cut margins, and stall adoption.
        </p>
      </div>

      {/* The Solution */}
      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-primary">The Solution</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
          Hobson AI transforms source-of-truth documents into instant, accurate answers. Lightweight, low-cost, and easy to adopt — designed for trust and scale.
        </p>
      </div>

      {/* The Prize */}
      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-primary">The Prize</h3>
        <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
          <p className="font-semibold">$1.8T AI-in-Property market by 2030</p>
          <p>£708B in global efficiency savings potential</p>
          <p className="text-primary font-medium">Well-placed to win big in a $1.8T market shift</p>
        </div>
      </div>
    </div>
  );
};