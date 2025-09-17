import React from 'react';
import { Mail, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Centered heading in white space */}
      <h3 className="text-sm sm:text-lg md:text-xl font-bold text-foreground leading-tight max-w-[280px] sm:max-w-sm">
        Back the AI revolution reshaping the property industry
      </h3>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-3 sm:p-6 w-full max-w-[300px] sm:max-w-sm">
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
  );
};