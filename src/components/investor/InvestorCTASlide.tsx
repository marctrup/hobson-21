import React from 'react';
import { Mail, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const InvestorCTASlide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex flex-col justify-center items-center p-6 sm:p-8">
      {/* Main Content Card */}
      <div className="max-w-4xl w-full space-y-8 sm:space-y-12">
        
        {/* Why Now Section */}
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Why Now</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight">
              The Perfect Storm for
              <span className="block text-primary">AI-Driven Disruption</span>
            </h2>
          </div>

          {/* Key Points Grid */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Market Growth</h3>
              <p className="text-sm text-muted-foreground">$1.8T by 2030</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Savings Potential</h3>
              <p className="text-sm text-muted-foreground">£708B globally</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI Solutions</h3>
              <p className="text-sm text-muted-foreground">Ready to scale fast</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 sm:p-10">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
              Ready to Transform Property?
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base mb-6 leading-relaxed">
              Join us at the inflection point — where efficiency meets disruption.
            </p>
            
            <Button 
              size="lg" 
              variant="cta"
              className="text-base sm:text-lg px-8 py-4 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => window.open('mailto:rochelle.t@hobsonschoice.ai?subject=Investment Opportunity', '_blank')}
            >
              <Mail className="w-5 h-5 mr-3" />
              Start the Conversation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};