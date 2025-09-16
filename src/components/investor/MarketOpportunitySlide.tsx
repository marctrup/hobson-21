import React from 'react';
import { TrendingUp, Target, Globe, Rocket } from 'lucide-react';

export const MarketOpportunitySlide = () => {
  const metrics = [
    { icon: Globe, label: 'Market Size', value: '£15B+', color: 'text-primary' },
    { icon: Target, label: 'TAM Growth', value: '12% CAGR', color: 'text-primary' },
    { icon: TrendingUp, label: 'AI Adoption', value: 'Accelerating', color: 'text-primary' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-xl mb-3 flex items-center justify-center">
          <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Market Opportunity</h3>
        <p className="text-xs text-muted-foreground">Massive, growing market ready for disruption</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-gradient-to-r from-primary/5 to-primary-light/5 p-3 sm:p-4 rounded-lg border border-primary/10">
            <div className="flex items-center gap-3">
              <metric.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${metric.color}`} />
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-muted-foreground">{metric.label}</div>
                <div className="text-sm sm:text-base font-bold text-foreground">{metric.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};