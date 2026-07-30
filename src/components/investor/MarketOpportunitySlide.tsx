import React from 'react';

export const MarketOpportunitySlide = () => {
  return (
    <div className="h-full flex items-center justify-center" style={{ height: '100%', minHeight: '200px', position: 'relative' }}>
      <div className="w-full max-w-xs mx-auto">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-sm sm:text-lg font-bold text-foreground px-2 mb-2 sm:mb-3">
            Inefficiency meets innovation.
          </h2>
          <h3 className="text-xs sm:text-sm font-semibold text-foreground px-2">Efficiency Savings Potential</h3>
          
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-paper to-success-bg rounded-lg border border-bone">
              <span className="text-[10px] sm:text-xs font-medium text-foreground">UK:</span>
              <span className="text-sm sm:text-lg font-bold text-charcoal">£6B</span>
            </div>
            
            <div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-paper to-paper rounded-lg border border-bone">
              <span className="text-[10px] sm:text-xs font-medium text-foreground">Europe:</span>
              <span className="text-sm sm:text-lg font-bold text-charcoal">£66B</span>
            </div>
            
            <div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-paper to-danger-bg rounded-lg border border-bone">
              <span className="text-[10px] sm:text-xs font-medium text-foreground">Global:</span>
              <span className="text-sm sm:text-lg font-bold text-charcoal">£708B</span>
            </div>
          </div>
          
          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed px-2">
            AI tools unlock billions in savings across property markets worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};