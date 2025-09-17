import React from 'react';
import { Mail, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="flex flex-col h-full text-center justify-between">
      {/* Top spacing for purple border */}
      <div className="pt-6 sm:pt-8"></div>
      
      {/* Centered content - properly centered between purple and CTA */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-4 sm:py-8">
        {/* Add any header/strapline content here when needed */}
      </div>
      
      {/* CTA Section */}
      <div className="flex justify-center pb-6 sm:pb-8">
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
  );
};