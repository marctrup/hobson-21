import React from 'react';

export const MarketProblemSlide = () => {
  return (
    <div className="h-full flex flex-col justify-center px-1" style={{ height: '100%', minHeight: '200px' }}>
      <div className="space-y-1.5 sm:space-y-3">
        {/* Problem Section */}
        <div className="bg-gradient-to-r from-destructive/10 to-destructive/5 p-2 sm:p-3 rounded-lg border border-destructive/20">
          <div className="text-center">
            <h3 className="text-xs sm:text-base font-bold text-destructive mb-1 sm:mb-2">
              Why Old Systems Can't Keep Up
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-relaxed">
              Outdated systems are costly, complex, and ripe for disruption
            </p>
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-2 sm:p-3 rounded-lg border border-primary/20">
          <div className="text-center">
            <h3 className="text-xs sm:text-base font-bold text-primary mb-1 sm:mb-2">
              Hobson Unlocks the Future
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-relaxed">
              Smarter, faster, and leaner AI built for professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};