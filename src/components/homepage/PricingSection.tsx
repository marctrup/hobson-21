import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { PricingHeroVideo } from "@/components/videos/PricingHeroVideo";

export const PricingSection = () => {
  const [billingCycles, setBillingCycles] = useState({
    essential: false,
    essentialPlus: false,
    enterprise: false
  });
  
  // Pricing data with monthly and annual amounts (20% discount for annual)
  const pricingData = {
    essential: {
      monthly: 19.50,
      annual: 15.60, // 20% discount
      heus: 275
    },
    essentialPlus: {
      monthly: 49.75,
      annual: 39.80, // 20% discount
      heus: 700
    },
    enterprise: {
      monthly: 148.50,
      annual: 118.80, // 20% discount
      heus: 2000
    }
  };

  const formatPrice = (plan: keyof typeof pricingData) => {
    const isAnnual = billingCycles[plan];
    const price = isAnnual ? pricingData[plan].annual : pricingData[plan].monthly;
    return price.toFixed(2);
  };

  const toggleBilling = (plan: keyof typeof pricingData) => {
    setBillingCycles(prev => ({
      ...prev,
      [plan]: !prev[plan]
    }));
  };

  const PricingToggle = ({ planKey }: { planKey: keyof typeof pricingData }) => {
    const isAnnual = billingCycles[planKey];
    
    return (
      <div className="space-y-2 mb-4 px-4">
        <div className="flex items-center justify-center gap-2">
          <span className={`text-xs ${!isAnnual ? 'font-medium text-purple-700' : 'text-muted-foreground'} transition-colors`}>Monthly</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={isAnnual}
              onChange={(e) => toggleBilling(planKey)}
            />
            <div 
              className={`w-9 h-5 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                isAnnual ? 'bg-purple-500 shadow-md' : 'bg-purple-200'
              } touch-manipulation`}
              onClick={() => toggleBilling(planKey)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleBilling(planKey);
                }
              }}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                isAnnual ? 'transform translate-x-4' : 'left-0.5'
              }`}></div>
            </div>
          </div>
          <span className={`text-xs ${isAnnual ? 'font-medium text-purple-700' : 'text-muted-foreground'} transition-colors`}>Annual</span>
        </div>
        {isAnnual && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 px-2 py-1">Save 20%</Badge>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="pricing-section" className="pt-0 pb-16 md:pt-0 md:pb-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16 mt-[32px]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Choose Your AI Journey</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            Revolutionary pricing that charges for actual AI work, not users or properties. Scale seamlessly with unlimited users, properties, and features.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            Forget per-user fees. Forget per-property fees. Hobson charges for the actual work our AI does — measured in{" "}
            <span className="font-semibold text-primary">Hobson Energy Units (HEUs)</span>.
          </p>
        </div>
        
        {/* Pricing Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto items-stretch px-4 sm:px-0">
          
          {/* Free Plan */}
          <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="text-center pb-3 sm:pb-4 flex-shrink-0">
              <CardTitle className="text-base sm:text-lg font-bold">Free</CardTitle>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2">£0</div>
              <div className="text-xs sm:text-sm text-purple-600 font-medium mt-1">18 HEUs</div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow px-3 sm:px-6">
              <div className="flex-grow">
                <p className="text-xs text-muted-foreground mb-3 sm:mb-4">
                  For light, occasional tasks.
                </p>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-xs">All features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-xs">Unlimited users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-xs">Unlimited documents</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs sm:text-sm mt-auto py-2">
                Start Free
              </Button>
            </CardContent>
          </Card>

          {/* Essential Plan */}
          <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="text-center pb-4 flex-shrink-0">
              <CardTitle className="text-lg font-bold">Essential</CardTitle>
               <div className="text-3xl font-bold text-purple-600 mt-2">
                 £{formatPrice('essential')}<span className="text-sm font-normal">/month</span>
                 {billingCycles.essential && <div className="text-xs text-muted-foreground line-through">£{pricingData.essential.monthly.toFixed(2)}</div>}
               </div>
               <div className="text-sm text-purple-600 font-medium mt-1">275 HEUs</div>
             </CardHeader>
             <CardContent className="flex flex-col flex-grow">
               <div className="flex-grow">
                 <p className="text-xs text-muted-foreground mb-4">
                   For steady monthly workloads.
                 </p>
                  <PricingToggle planKey="essential" />
                  <div className="space-y-3 mb-6">
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                     <span className="text-xs">Everything in Free</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                     <span className="text-xs">Priority support</span>
                   </div>
                 </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm mt-auto">
                Choose Essential
              </Button>
            </CardContent>
          </Card>

           {/* Essential Plus - Most Popular */}
          <Card className="relative bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-400 shadow-2xl transform scale-105 hover:scale-110 transition-all duration-300 flex flex-col h-full">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-medium shadow-lg whitespace-nowrap">
                ⭐ Most Popular
              </Badge>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-700"></div>
            <CardHeader className="text-center pb-4 pt-6 flex-shrink-0">
              <CardTitle className="text-lg font-bold">Essential Plus</CardTitle>
               <div className="text-3xl font-bold text-purple-700 mt-2">
                 £{formatPrice('essentialPlus')}<span className="text-sm font-normal">/month</span>
                 {billingCycles.essentialPlus && <div className="text-xs text-muted-foreground line-through">£{pricingData.essentialPlus.monthly.toFixed(2)}</div>}
               </div>
               <div className="text-sm text-purple-700 font-medium mt-1">700 HEUs</div>
             </CardHeader>
             <CardContent className="flex flex-col flex-grow">
               <div className="flex-grow">
                 <p className="text-xs text-muted-foreground mb-4">
                   For heavy, frequent use.
                 </p>
                  <PricingToggle planKey="essentialPlus" />
                  <div className="space-y-3 mb-6">
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                     <span className="text-xs">Everything in Essential</span>
                   </div>
                 </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm mt-auto">
                Choose Essential +
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="text-center pb-4 flex-shrink-0">
              <CardTitle className="text-lg font-bold">Enterprise</CardTitle>
              <div className="text-3xl font-bold text-purple-600 mt-2">
                £{formatPrice('enterprise')}<span className="text-sm font-normal">/month</span>
                {billingCycles.enterprise && <div className="text-xs text-muted-foreground line-through">£{pricingData.enterprise.monthly.toFixed(2)}</div>}
              </div>
              <div className="text-sm text-purple-600 font-medium mt-1">2,000 HEUs</div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-xs text-muted-foreground mb-4">
                  For high-volume, daily demands.
                </p>
                <PricingToggle planKey="enterprise" />
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-xs">Everything in Plus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-xs">Build a knowledge base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-xs">Dedicated support</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm mt-auto">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section with Video */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 px-4 sm:px-0">
            Understand more about our pricing philosophy with Sarah
          </p>
          <div className="px-4 sm:px-0">
            <PricingHeroVideo />
          </div>
        </div>
      </div>
    </section>
  );
};