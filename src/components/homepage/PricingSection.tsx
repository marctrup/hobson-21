import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { PricingHeroVideo } from "@/components/videos/PricingHeroVideo";
import owlMascot from "@/assets/owl-mascot.png";
import { useContent, useLanguage } from "@/contexts/LanguageContext";

export const PricingSection = () => {
  const content = useContent();
  const { language } = useLanguage();
  const pricing = content.pricing;
  const isGerman = language === 'de';
  const isUAE = language === 'ae';
  const hasLongCurrency = isGerman || isUAE;
  
  const [billingCycles, setBillingCycles] = useState({
    essential: false,
    essentialPlus: false,
    enterprise: false
  });

  const formatPrice = (price: number) => {
    const formatted = price.toFixed(2);
    if (pricing.currencyPosition === "after") {
      return `${formatted}${pricing.currency}`;
    }
    return `${pricing.currency}${formatted}`;
  };

  const getPrice = (plan: 'essential' | 'essentialPlus' | 'enterprise') => {
    const isAnnual = billingCycles[plan];
    const planData = pricing.plans[plan];
    return isAnnual ? planData.priceAnnual : planData.priceMonthly;
  };

  const getOriginalPrice = (plan: 'essential' | 'essentialPlus' | 'enterprise') => {
    return pricing.plans[plan].priceMonthly;
  };

  const toggleBilling = (plan: keyof typeof billingCycles) => {
    setBillingCycles(prev => ({
      ...prev,
      [plan]: !prev[plan]
    }));
  };

  const PricingToggle = ({
    planKey
  }: {
    planKey: keyof typeof billingCycles;
  }) => {
    const isAnnual = billingCycles[planKey];
    return (
      <div className="space-y-2 mb-4 px-4">
        <div className="flex items-center justify-center gap-2">
          <span className={`text-xs ${!isAnnual ? 'font-medium text-purple-700' : 'text-muted-foreground'} transition-colors`}>
            {pricing.billingToggle.monthly}
          </span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={isAnnual} onChange={() => toggleBilling(planKey)} />
            <div 
              className={`w-9 h-5 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${isAnnual ? 'bg-purple-500 shadow-md' : 'bg-purple-200'} touch-manipulation`} 
              onClick={() => toggleBilling(planKey)} 
              role="button" 
              tabIndex={0} 
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleBilling(planKey);
                }
              }}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isAnnual ? 'transform translate-x-4' : 'left-0.5'}`}></div>
            </div>
          </div>
          <span className={`text-xs ${isAnnual ? 'font-medium text-purple-700' : 'text-muted-foreground'} transition-colors`}>
            {pricing.billingToggle.annual}
          </span>
        </div>
        {isAnnual && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 px-2 py-1">
              {pricing.billingToggle.save}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="pricing-section" className="pt-9 pb-16 md:pt-9 md:pb-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={owlMascot} alt="Hobson AI Owl Mascot" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
            <h2 className={`font-bold text-foreground ${isGerman ? 'text-xl sm:text-2xl md:text-3xl' : 'text-2xl sm:text-3xl md:text-4xl'}`}>
              {pricing.title}
            </h2>
          </div>
          <p className={`text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0 ${isGerman ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>
            {pricing.subtitle}
          </p>
          <p className={`text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0 ${isGerman ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
            {pricing.description}{" "}
            <span className="font-semibold text-primary">{pricing.heuLabel}</span>.
          </p>
        </div>
        
        {/* Pricing Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto items-stretch px-4 sm:px-0">
          
          {/* Free Plan */}
          <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="text-center pb-3 sm:pb-4 flex-shrink-0">
              <CardTitle className="text-base sm:text-lg font-bold">{pricing.plans.free.name}</CardTitle>
              <div className={`font-bold text-purple-600 mt-2 ${hasLongCurrency ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}>
                {formatPrice(pricing.plans.free.price)}
              </div>
              <div className="text-xs sm:text-sm text-purple-600 font-medium mt-1">{pricing.plans.free.heus} HEUs</div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow px-3 sm:px-6">
              <div className="flex-grow">
                <p className="text-xs text-muted-foreground mb-3 sm:mb-4">
                  {pricing.plans.free.tagline}
                </p>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {pricing.plans.free.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs sm:text-sm mt-auto py-2">
                {pricing.plans.free.button}
              </Button>
            </CardContent>
          </Card>

          {/* Essential Plan */}
          <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="text-center pb-4 flex-shrink-0">
              <CardTitle className="text-lg font-bold">{pricing.plans.essential.name}</CardTitle>
              <div className={`font-bold text-purple-600 mt-2 ${hasLongCurrency ? 'text-xl sm:text-2xl' : 'text-3xl'}`}>
                {formatPrice(getPrice('essential'))}<span className={`font-normal ${hasLongCurrency ? 'text-xs' : 'text-sm'}`}>{pricing.perMonth}</span>
                {billingCycles.essential && (
                  <div className="text-xs text-muted-foreground line-through">
                    {formatPrice(getOriginalPrice('essential'))}
                  </div>
                )}
              </div>
              <div className="text-sm text-purple-600 font-medium mt-1">{pricing.plans.essential.heus} HEUs</div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-xs text-muted-foreground mb-4">
                  {pricing.plans.essential.tagline}
                </p>
                <PricingToggle planKey="essential" />
                <div className="space-y-3 mb-6">
                  {pricing.plans.essential.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm mt-auto">
                {pricing.plans.essential.button}
              </Button>
            </CardContent>
          </Card>

          {/* Essential Plus - Most Popular */}
          <Card className="relative bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-400 shadow-2xl transform scale-105 hover:scale-110 transition-all duration-300 flex flex-col h-full">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-medium shadow-lg whitespace-nowrap">
                {pricing.plans.essentialPlus.popular}
              </Badge>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-700"></div>
            <CardHeader className="text-center pb-4 pt-6 flex-shrink-0">
              <CardTitle className="text-lg font-bold">{pricing.plans.essentialPlus.name}</CardTitle>
              <div className={`font-bold text-purple-700 mt-2 ${hasLongCurrency ? 'text-xl sm:text-2xl' : 'text-3xl'}`}>
                {formatPrice(getPrice('essentialPlus'))}<span className={`font-normal ${hasLongCurrency ? 'text-xs' : 'text-sm'}`}>{pricing.perMonth}</span>
                {billingCycles.essentialPlus && (
                  <div className="text-xs text-muted-foreground line-through">
                    {formatPrice(getOriginalPrice('essentialPlus'))}
                  </div>
                )}
              </div>
              <div className="text-sm text-purple-700 font-medium mt-1">{pricing.plans.essentialPlus.heus} HEUs</div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-xs text-muted-foreground mb-4">
                  {pricing.plans.essentialPlus.tagline}
                </p>
                <PricingToggle planKey="essentialPlus" />
                <div className="space-y-3 mb-6">
                  {pricing.plans.essentialPlus.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm mt-auto">
                {pricing.plans.essentialPlus.button}
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <CardHeader className="text-center pb-4 flex-shrink-0">
              <CardTitle className="text-lg font-bold">{pricing.plans.enterprise.name}</CardTitle>
              <div className={`font-bold text-purple-600 mt-2 ${hasLongCurrency ? 'text-xl sm:text-2xl' : 'text-3xl'}`}>
                {formatPrice(getPrice('enterprise'))}<span className={`font-normal ${hasLongCurrency ? 'text-xs' : 'text-sm'}`}>{pricing.perMonth}</span>
                {billingCycles.enterprise && (
                  <div className="text-xs text-muted-foreground line-through">
                    {formatPrice(getOriginalPrice('enterprise'))}
                  </div>
                )}
              </div>
              <div className="text-sm text-purple-600 font-medium mt-1">{pricing.plans.enterprise.heus.toLocaleString()} HEUs</div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-xs text-muted-foreground mb-4">
                  {pricing.plans.enterprise.tagline}
                </p>
                <PricingToggle planKey="enterprise" />
                <div className="space-y-3 mb-6">
                  {pricing.plans.enterprise.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm mt-auto">
                {pricing.plans.enterprise.button}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section with Video */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-base sm:text-lg text-muted-foreground mb-2 px-4 sm:px-0">
            {pricing.videoSection.title}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 px-4 sm:px-0">
            {pricing.videoSection.subtitle}
          </p>
          <div className="px-4 sm:px-0">
            <PricingHeroVideo />
          </div>
        </div>
      </div>
    </section>
  );
};
