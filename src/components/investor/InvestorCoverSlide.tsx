import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

export const InvestorCoverSlide = () => {
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center">
          <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          Property Tech Revolution
        </h2>
        <p className="text-muted-foreground max-w-xs mx-auto text-xs sm:text-sm px-2">
          Positioned to disrupt a rapidly growing AI-in-Property market, projected to hit $1.8T by 2030
        </p>
      </div>
    </div>
  );
};