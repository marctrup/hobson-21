import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import investorSplitScreen from '../assets/investor-split-screen.png';

export const InvestorCoverSlide = () => {
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <div className="w-full max-w-xs mx-auto">
        <img 
          src={investorSplitScreen} 
          alt="AI transformation in property industry - before and after comparison"
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};