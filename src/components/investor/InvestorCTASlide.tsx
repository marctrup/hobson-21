import React from 'react';
import { Mail, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="text-center space-y-6 sm:space-y-8 p-4">
      {/* Why Now Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Zap className="w-3 h-3 text-primary" />
          <span className="text-xs font-semibold text-primary">Why Now</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          The Perfect Storm for AI Disruption
        </h2>
      </div>

      {/* Key Points */}
      <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
        <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-md">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-foreground">Market Growth</p>
            <p className="text-xs text-muted-foreground">$1.8T by 2030</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-md">
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-foreground">Savings Potential</p>
            <p className="text-xs text-muted-foreground">£708B globally</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-md">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-foreground">AI Solutions</p>
            <p className="text-xs text-muted-foreground">Ready to scale</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
            Ready to Transform Property?
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-4 leading-relaxed">
            Join us at the inflection point — where efficiency meets disruption.
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