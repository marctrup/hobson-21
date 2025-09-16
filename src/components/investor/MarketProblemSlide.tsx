import React from 'react';

export const MarketProblemSlide = () => {
  return (
    <div className="space-y-4 sm:space-y-6 h-full flex flex-col justify-center">
      {/* Problem Section */}
      <div className="bg-gradient-to-r from-destructive/10 to-destructive/5 p-4 sm:p-6 rounded-lg border border-destructive/20">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-bold text-destructive mb-2 sm:mb-3">
            Why Old Systems Can't Keep Up
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Outdated systems are costly, complex, and ripe for disruption
          </p>
        </div>
      </div>

      {/* Solution Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 sm:p-6 rounded-lg border border-primary/20">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
            Hobson Unlocks the Future
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Smarter, faster, and leaner AI built for professionals.
          </p>
        </div>
      </div>
    </div>
  );
};