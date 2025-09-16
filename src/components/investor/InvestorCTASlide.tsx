import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="text-center space-y-6 sm:space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          Why Now
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground max-w-md mx-auto">
          <p>• Massive market growth → $1.8T by 2030</p>
          <p>• Proven inefficiencies → £708B global savings potential</p>
          <p>• Lightweight AI solutions poised to scale fast</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-base sm:text-lg font-semibold text-foreground">Join Us</h4>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm px-2">
          Join us at the inflection point — where efficiency meets disruption.
        </p>
        
        <Button 
          size="lg" 
          variant="cta"
          className="text-sm sm:text-base px-6 py-3 font-semibold"
          onClick={() => window.open('mailto:rochelle.t@hobsonschoice.ai?subject=Partnership Discussion', '_blank')}
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact Us
        </Button>
      </div>
    </div>
  );
};