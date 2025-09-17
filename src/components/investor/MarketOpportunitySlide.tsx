import React from 'react';

export const MarketOpportunitySlide = () => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-center space-y-3 sm:space-y-4">
        <h3 className="text-sm sm:text-base font-semibold text-foreground px-2">Efficiency Savings Potential</h3>
        
        <div className="space-y-2 sm:space-y-3 max-w-[280px] mx-auto">
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
            <span className="text-sm font-medium text-foreground">UK:</span>
            <span className="text-lg sm:text-xl font-bold text-teal-700">£6B</span>
          </div>
          
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
            <span className="text-sm font-medium text-foreground">Europe:</span>
            <span className="text-lg sm:text-xl font-bold text-cyan-700">£66B</span>
          </div>
          
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <span className="text-sm font-medium text-foreground">Global:</span>
            <span className="text-lg sm:text-xl font-bold text-purple-700">£708B</span>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-2 max-w-[300px] mx-auto">
          AI tools unlock billions in savings across property markets worldwide.
        </p>
      </div>
    </div>
  );
};