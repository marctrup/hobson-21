import React from 'react';
import { Handshake, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-xl sm:rounded-2xl flex items-center justify-center">
          <Handshake className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          Investment Opportunity
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto text-xs sm:text-sm px-2">
          Be part of the $1.8T AI-in-Property transformation.
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          size="lg" 
          variant="cta"
          className="w-full max-w-xs mx-auto text-sm sm:text-base py-3 sm:py-4"
          onClick={() => window.open('mailto:investors@hobsonschoice.ai?subject=Investment Opportunity', '_blank')}
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact Investors
        </Button>
        
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>• Disruptive pricing</span>
          <span>• Proven track record</span>
          <span>• Growing market</span>
        </div>
      </div>
    </div>
  );
};