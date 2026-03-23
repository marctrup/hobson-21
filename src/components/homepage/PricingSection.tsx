import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Zap } from "lucide-react";

import owlMascot from "@/assets/owl-mascot.png";
import { useContent, useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

// --- Sub-components ---

const PricingToggle = ({
  isAnnual,
  onToggle,
  labels,
}: {
  isAnnual: boolean;
  onToggle: () => void;
  labels: { monthly: string; annual: string; save: string };
}) => (
  <div className="space-y-2 mb-4 px-4">
    <div className="flex items-center justify-center gap-2">
      <span className={`text-xs ${!isAnnual ? 'font-medium text-primary' : 'text-muted-foreground'} transition-colors`}>
        {labels.monthly}
      </span>
      <div
        className={`relative w-9 h-5 rounded-full cursor-pointer transition-all duration-300 ${isAnnual ? 'bg-primary shadow-md' : 'bg-primary/30'} touch-manipulation`}
        onClick={onToggle}
        role="switch"
        aria-checked={isAnnual}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isAnnual ? 'translate-x-4' : 'left-0.5'}`} />
      </div>
      <span className={`text-xs ${isAnnual ? 'font-medium text-primary' : 'text-muted-foreground'} transition-colors`}>
        {labels.annual}
      </span>
    </div>
    {isAnnual && (
      <div className="flex justify-center">
        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary px-2 py-1">
          {labels.save}
        </Badge>
      </div>
    )}
  </div>
);

const FeatureList = ({ features, iconClass = "text-primary" }: { features: readonly string[]; iconClass?: string }) => (
  <div className="space-y-2.5">
    {features.map((feature, i) => (
      <div key={i} className="flex items-start gap-2">
        <CheckCircle2 className={`h-4 w-4 ${iconClass} flex-shrink-0 mt-0.5`} />
        <span className="text-xs leading-relaxed">{feature}</span>
      </div>
    ))}
  </div>
);

export const PricingSection = () => {
  const content = useContent();
  const { language } = useLanguage();
  const pricing = content.pricing;
  const isGerman = language === 'de';
  const isUAE = language === 'ae';
  const hasLongCurrency = isGerman || isUAE;
  const navigate = useNavigate();

  const [isAnnualEssential, setIsAnnualEssential] = useState(false);
  const [isAnnualPlus, setIsAnnualPlus] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");

  const proceedToCheckout = async (priceId: string, email?: string) => {
    setLoadingPlan(priceId);
    setEmailDialogOpen(false);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, email },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCheckout = async (priceId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      await proceedToCheckout(priceId, user.email);
      return;
    }
    setPendingPriceId(priceId);
    setEmailInput("");
    setEmailError("");
    setEmailDialogOpen(true);
  };

  const handleEmailSubmit = () => {
    const result = emailSchema.safeParse(emailInput);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return;
    }
    if (pendingPriceId) proceedToCheckout(pendingPriceId, result.data);
  };

  const getPriceId = (plan: 'essential' | 'essentialPlus' = 'essential') => {
    const ids = (pricing.plans[plan] as any).stripePriceIds;
    if (!ids) return null;
    const annual = plan === 'essentialPlus' ? isAnnualPlus : isAnnualEssential;
    return annual && ids.annual ? ids.annual : ids.monthly;
  };

  const formatPrice = (price: number) => {
    const formatted = price.toFixed(2);
    return pricing.currencyPosition === "after"
      ? `${formatted}${pricing.currency}`
      : `${pricing.currency}${formatted}`;
  };

  const essentialPrice = isAnnualEssential
    ? pricing.plans.essential.priceAnnual
    : pricing.plans.essential.priceMonthly;

  const essentialPlusData = (pricing.plans as any).essentialPlus;
  const essentialPlusPrice = essentialPlusData
    ? (isAnnualPlus ? essentialPlusData.priceAnnual : essentialPlusData.priceMonthly)
    : null;

  const aiBoost = (pricing as any).aiBoost;

  return (
    <section id="pricing-section" className="pt-9 pb-16 md:pt-9 md:pb-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={owlMascot} alt="Hobson AI Owl Mascot" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
            <h2 className={`font-bold text-foreground ${isGerman ? 'text-xl sm:text-2xl md:text-3xl' : 'text-2xl sm:text-3xl md:text-4xl'}`}>
              {pricing.title}
            </h2>
          </div>
          <p className={`text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0 ${isGerman ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>
            {pricing.subtitle}
          </p>
        </div>

        {/* 5-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 max-w-7xl mx-auto items-stretch px-4 sm:px-0">

          {/* FREE */}
          <Card className="relative bg-gradient-to-br from-card to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary/60" />
            <CardHeader className="text-center pb-3 flex-shrink-0">
              <CardTitle className="text-base sm:text-lg font-bold">{pricing.plans.free.name}</CardTitle>
              <div className={`font-bold text-primary mt-2 ${hasLongCurrency ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}>
                {formatPrice(pricing.plans.free.price)}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow px-3 sm:px-5">
              <p className="text-xs text-muted-foreground mb-3">{pricing.plans.free.tagline}</p>
              <p className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wide mb-2">Includes</p>
              <div className="flex-grow">
                <FeatureList features={pricing.plans.free.features} />
                {(pricing.plans.free as any).upgradeNote && (
                  <p className="text-[11px] text-muted-foreground mt-4 italic">
                    {(pricing.plans.free as any).upgradeNote}
                  </p>
                )}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground text-xs sm:text-sm mt-4 py-2"
                onClick={() => window.open('https://hobson-three.vercel.app/signup', '_blank')}
              >
                {pricing.plans.free.button}
              </Button>
            </CardContent>
          </Card>

          {/* ESSENTIAL — Most Popular */}
          <Card className="relative bg-gradient-to-br from-primary/5 to-primary/15 border-2 border-primary shadow-xl flex flex-col h-full">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-medium shadow-lg whitespace-nowrap">
                {pricing.plans.essential.popular}
              </Badge>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/80" />
            <CardHeader className="text-center pb-3 pt-6 flex-shrink-0">
              <CardTitle className="text-base sm:text-lg font-bold">{pricing.plans.essential.name}</CardTitle>
              <div className={`font-bold text-primary mt-2 ${hasLongCurrency ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'}`}>
                {formatPrice(essentialPrice)}
                <span className={`font-normal ${hasLongCurrency ? 'text-[10px]' : 'text-xs'}`}> {pricing.perMonth}</span>
              </div>
              {isAnnualEssential && (
                <div className="text-xs text-muted-foreground line-through">
                  {formatPrice(pricing.plans.essential.priceMonthly)}
                </div>
              )}
            </CardHeader>
            <CardContent className="flex flex-col flex-grow px-3 sm:px-5">
              <p className="text-xs text-muted-foreground mb-3">{pricing.plans.essential.tagline}</p>
              <PricingToggle isAnnual={isAnnualEssential} onToggle={() => setIsAnnualEssential(!isAnnualEssential)} labels={pricing.billingToggle} />
              <div className="flex-grow">
                <FeatureList features={pricing.plans.essential.features} />

                {/* Boost callout inside Essential */}
                {(pricing.plans.essential as any).boostNote && (
                  <div className="mt-4 p-3 rounded-lg bg-accent/50 border border-accent">
                    <p className="text-xs font-semibold text-foreground mb-1">{(pricing.plans.essential as any).boostNote}</p>
                    <p className="text-[11px] text-muted-foreground whitespace-pre-line">{(pricing.plans.essential as any).boostDetail}</p>
                    <p className="text-[11px] text-muted-foreground mt-2 italic">{(pricing.plans.essential as any).boostTagline}</p>
                  </div>
                )}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-xs sm:text-sm mt-4"
                onClick={() => handleCheckout(getPriceId()!)}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === getPriceId() ? <Loader2 className="h-4 w-4 animate-spin" /> : pricing.plans.essential.button}
              </Button>
            </CardContent>
          </Card>

          {/* ESSENTIAL PLUS */}
          {essentialPlusData && (
            <Card className="relative bg-gradient-to-br from-card to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-primary/80" />
              <CardHeader className="text-center pb-3 flex-shrink-0">
                <CardTitle className="text-base sm:text-lg font-bold">{essentialPlusData.name}</CardTitle>
                <div className={`font-bold text-primary mt-2 ${hasLongCurrency ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'}`}>
                  {formatPrice(essentialPlusPrice)}
                  <span className={`font-normal ${hasLongCurrency ? 'text-[10px]' : 'text-xs'}`}> {pricing.perMonth}</span>
                </div>
                {isAnnual && (
                  <div className="text-xs text-muted-foreground line-through">
                    {formatPrice(essentialPlusData.priceMonthly)}
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex flex-col flex-grow px-3 sm:px-5">
                <p className="text-xs text-muted-foreground mb-3">{essentialPlusData.tagline}</p>
                <PricingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} labels={pricing.billingToggle} />
                <div className="flex-grow">
                  <FeatureList features={essentialPlusData.features} />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground text-xs sm:text-sm mt-4"
                  onClick={() => {
                    const priceId = getPriceId('essentialPlus');
                    if (priceId) handleCheckout(priceId);
                    else navigate('/contact');
                  }}
                  disabled={loadingPlan !== null}
                >
                  {essentialPlusData.button}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ENTERPRISE */}
          <Card className="relative bg-gradient-to-br from-card to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary/60" />
            <CardHeader className="text-center pb-3 flex-shrink-0">
              <CardTitle className="text-base sm:text-lg font-bold">{pricing.plans.enterprise.name}</CardTitle>
              <div className="font-bold text-primary mt-2 text-2xl sm:text-3xl">Custom</div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow px-3 sm:px-5">
              <p className="text-xs text-muted-foreground mb-3">{pricing.plans.enterprise.tagline}</p>
              <div className="flex-grow">
                <FeatureList features={pricing.plans.enterprise.features} />
                {(pricing.plans.enterprise as any).closingNote && (
                  <p className="text-[11px] text-muted-foreground mt-4 italic">
                    {(pricing.plans.enterprise as any).closingNote}
                  </p>
                )}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground text-xs sm:text-sm mt-4"
                onClick={() => navigate('/contact')}
              >
                {pricing.plans.enterprise.button}
              </Button>
            </CardContent>
          </Card>

          {/* AI BOOST */}
          {aiBoost && (
            <Card className="relative bg-gradient-to-br from-accent/30 to-accent/10 border border-accent hover:border-primary/40 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
              <CardHeader className="text-center pb-3 flex-shrink-0">
                <CardTitle className="text-base sm:text-lg font-bold flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  {aiBoost.name}
                </CardTitle>
                <Badge variant="outline" className="mx-auto mt-1 text-[10px] border-amber-400/50 text-amber-700 dark:text-amber-400">
                  {aiBoost.subtitle}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow px-3 sm:px-5">
                <p className="text-xs text-muted-foreground mb-3">{aiBoost.description}</p>
                <div className="text-center mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-foreground">{aiBoost.price}</span>
                </div>
                <div className="flex-grow">
                  <div className="space-y-2.5">
                    {aiBoost.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span className="text-xs">{f}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-4 italic">{aiBoost.closingNote}</p>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm mt-4"
                  onClick={() => {
                    const boostPriceId = aiBoost.stripePriceId;
                    if (boostPriceId) {
                      handleCheckout(boostPriceId);
                    } else {
                      window.open('https://hobson-three.vercel.app/signup', '_blank');
                    }
                  }}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === aiBoost.stripePriceId ? <Loader2 className="h-4 w-4 animate-spin" /> : (aiBoost.button || "Buy AI Boost")}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter your email</DialogTitle>
            <DialogDescription>We'll use this to set up your subscription account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); handleEmailSubmit(); }} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={e => { setEmailInput(e.target.value); setEmailError(""); }}
                autoFocus
              />
              {emailError && <p className="text-sm text-destructive mt-1">{emailError}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loadingPlan !== null}>
              {loadingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue to checkout"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
