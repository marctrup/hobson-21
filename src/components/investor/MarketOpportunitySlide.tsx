import React from 'react';
import { Rocket } from 'lucide-react';

export const MarketOpportunitySlide = () => {
  const markets = [
    { 
      title: 'UK MARKET', 
      value: '£6B', 
      subtitle: 'Efficiency savings',
      gradient: 'from-teal-400 to-green-500',
      size: 'w-16 h-16 sm:w-20 sm:h-20'
    },
    { 
      title: 'EUROPEAN MARKET', 
      value: '£66B', 
      subtitle: 'Efficiency Savings',
      gradient: 'from-cyan-400 to-blue-500',
      size: 'w-20 h-20 sm:w-24 sm:h-24'
    },
    { 
      title: 'GLOBAL MARKET', 
      value: '£708B', 
      subtitle: 'Efficiency Savings',
      gradient: 'from-purple-400 to-pink-500',
      size: 'w-24 h-24 sm:w-28 sm:h-28'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-xl mb-3 flex items-center justify-center">
          <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Market Opportunity</h3>
        <p className="text-xs text-muted-foreground">A massive $1.8T AI-in-Property market, primed for efficiency-driven disruption.</p>
      </div>
      
      <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
        {markets.map((market, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="text-center flex-shrink-0">
              <div className={`${market.size} mx-auto bg-gradient-to-br ${market.gradient} rounded-full flex flex-col items-center justify-center text-white mb-1`}>
                <div className="text-[6px] sm:text-[8px] font-medium opacity-75 leading-tight">{market.title}</div>
                <div className="text-xs sm:text-sm font-bold leading-none">{market.value}</div>
                <div className="text-[5px] sm:text-[7px] opacity-75 leading-tight">{market.subtitle}</div>
              </div>
            </div>
            {idx < markets.length - 1 && (
              <div className="flex-shrink-0">
                <div className="w-3 h-0.5 sm:w-4 sm:h-0.5 bg-gradient-to-r from-muted-foreground to-primary/50 rounded"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};