import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          Why Now
        </h3>
        <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
          <p>Massive market growth → $1.8T by 2030</p>
          <p>Proven inefficiencies → £708B global savings potential</p>
          <p>Lightweight AI solutions poised to scale fast</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-base sm:text-lg font-semibold text-foreground">Join Us</h4>
        <p className="text-muted-foreground max-w-sm mx-auto text-xs sm:text-sm px-2">
          Partner with us to redefine property with intelligent AI.
        </p>
        
        <Button 
          size="lg" 
          variant="cta"
          className="w-full max-w-xs mx-auto text-sm sm:text-base py-3 sm:py-4"
          onClick={() => window.open('mailto:investors@hobsonschoice.ai?subject=Investment Opportunity', '_blank')}
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact Us
        </Button>
      </div>
    </div>
  );
};