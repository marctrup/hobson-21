import React from 'react';

export const MarketOpportunitySlide = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">Efficiency Savings Potential</h3>
        
        <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
          <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20 shadow-sm">
            <div className="text-center">
              <div className="text-xs font-medium text-muted-foreground mb-1">UK</div>
              <div className="text-xl font-bold text-primary">£6B</div>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-primary/15 to-primary/10 rounded-xl p-4 border border-primary/30 shadow-md transform scale-105">
            <div className="text-center">
              <div className="text-xs font-medium text-muted-foreground mb-1">Europe</div>
              <div className="text-2xl font-bold text-primary">£66B</div>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-primary/20 to-primary/15 rounded-xl p-5 border border-primary/40 shadow-lg transform scale-110">
            <div className="text-center">
              <div className="text-xs font-medium text-muted-foreground mb-1">Global</div>
              <div className="text-2xl font-bold text-primary">£708B</div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed px-2">
          Lightweight, accurate AI tools unlock billions in cost and time savings across property markets worldwide.
        </p>
      </div>
    </div>
  );
};