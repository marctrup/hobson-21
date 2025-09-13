import React from 'react';
import { CheckCircle, CreditCard } from 'lucide-react';

export const FreePlanSlide = () => {
  const features = [
    'All core AI features included',
    'Document analysis & extraction',
    'Instant Q&A capabilities',
    'Source-referenced answers'
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-br from-primary/10 to-primary-light/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-primary/20">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm sm:text-base">Free Forever</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Perfect for low-usage professionals</p>
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>No credit card required</span>
      </div>
    </div>
  );
};