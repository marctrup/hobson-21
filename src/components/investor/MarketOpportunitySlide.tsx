import React from 'react';

export const MarketOpportunitySlide = () => {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="text-center space-y-2 sm:space-y-3">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground px-2">Efficiency Savings Potential</h3>
        
        <div className="space-y-1.5 sm:space-y-2 max-w-full mx-auto">
          <div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
            <span className="text-[10px] sm:text-xs font-medium text-foreground">UK:</span>
            <span className="text-sm sm:text-lg font-bold text-teal-700">£6B</span>
          </div>
          
          <div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
            <span className="text-[10px] sm:text-xs font-medium text-foreground">Europe:</span>
            <span className="text-sm sm:text-lg font-bold text-cyan-700">£66B</span>
          </div>
          
          <div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <span className="text-[10px] sm:text-xs font-medium text-foreground">Global:</span>
            <span className="text-sm sm:text-lg font-bold text-purple-700">£708B</span>
          </div>
        </div>
        
        <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed px-2 max-w-full mx-auto">
          AI tools unlock billions in savings across property markets worldwide.
        </p>
      </div>
    </div>
  );
};