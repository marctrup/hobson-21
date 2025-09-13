import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const CTASlide = () => {
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-brand-orange to-brand-orange/80 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <p className="text-muted-foreground max-w-sm mx-auto text-xs sm:text-sm px-2">
          Start getting instant answers from your documents today. No setup, no hassle.
        </p>
      </div>
      <Button 
        size="lg" 
        variant="cta"
        className="w-full max-w-xs mx-auto text-sm sm:text-lg py-4 sm:py-6"
        onClick={() => window.open('https://hobsonschoice.ai', '_blank')}
      >
        Try Hobson Free
      </Button>
      <p className="text-xs text-muted-foreground">
        Free plan • No credit card • Instant access
      </p>
    </div>
  );
};