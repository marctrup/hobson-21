import React from 'react';
import { Mail, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="text-center space-y-3 sm:space-y-6 p-1 sm:p-4">
      {/* CTA Section */}
      <div className="space-y-2 sm:space-y-4">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-3 sm:p-6">
          <h3 className="text-xs sm:text-base font-bold text-foreground mb-2 sm:mb-4 leading-tight">
            Back the AI revolution reshaping the property industry
          </h3>
          
          <Button 
            size="lg" 
            variant="cta"
            className="text-xs sm:text-base px-3 sm:px-6 py-2 sm:py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300 min-h-[40px] sm:min-h-[44px] w-full sm:w-auto"
            onClick={() => window.open('mailto:rochelle.t@hobsonschoice.ai?subject=Investment Opportunity', '_blank')}
          >
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Start the Conversation
          </Button>
        </div>
      </div>
    </div>
  );
};