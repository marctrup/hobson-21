import React from 'react';
import { Mail, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="text-center space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* CTA Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            Back the AI revolution reshaping the property industry
          </h3>
          
          <Button 
            size="lg" 
            variant="cta"
            className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300 min-h-[44px]"
            onClick={() => window.open('mailto:rochelle.t@hobsonschoice.ai?subject=Investment Opportunity', '_blank')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Start the Conversation
          </Button>
        </div>
      </div>
    </div>
  );
};