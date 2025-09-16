import React from 'react';
import { Mail, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="text-center space-y-6 sm:space-y-8 p-4">
      {/* CTA Section */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
            The Perfect Storm for AI Disruption
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-4 leading-relaxed">
            Inefficiency meets innovation — change is inevitable.
          </p>
          
          <Button 
            size="lg" 
            variant="cta"
            className="text-sm sm:text-base px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
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