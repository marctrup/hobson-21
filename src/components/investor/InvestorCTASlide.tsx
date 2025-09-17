import React from 'react';
import { Mail, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="h-full flex items-center justify-center" style={{ height: '100%', minHeight: '200px' }}>
      <div className="text-center space-y-4 sm:space-y-6 px-2">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-sm sm:text-lg md:text-xl font-bold text-foreground leading-tight">
            Investment Opportunity
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed max-w-xs mx-auto">
            Be part of the $1.8T AI-in-Property transformation.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-2 sm:p-4 w-full max-w-[280px] sm:max-w-sm">
            <Button 
              size="lg" 
              variant="cta"
              className="text-[10px] sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300 min-h-[32px] sm:min-h-[40px] w-full"
              onClick={() => window.open('mailto:rochelle.t@hobsonschoice.ai?subject=Investment Opportunity', '_blank')}
            >
              <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
              Start the Conversation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};