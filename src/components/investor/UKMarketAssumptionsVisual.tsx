import React from 'react';
import { Building2, Users, TrendingUp, ExternalLink, MapPin, Store, Utensils, Dumbbell, Ruler, FileSearch } from 'lucide-react';

export const UKMarketAssumptionsVisual = () => {
  const realEstateTypes = [
    "Property owners and operators",
    "Asset and investment managers",
    "Letting and management agents",
    "Development and mixed-use operators",
  ];

  const adjacentMarkets = [
    { icon: Store, label: "Retail tenants & chains", range: "~180k–200k" },
    { icon: Utensils, label: "Restaurants, cafés & hospitality groups", range: "~200k–215k" },
    { icon: Dumbbell, label: "Gyms & leisure operators", range: "~15k–25k" },
    { icon: Ruler, label: "Architectural practices", range: "~40k–45k" },
    { icon: FileSearch, label: "Planning consultants, surveyors & built-environment professionals", range: "~30k–40k" },
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Subtitle - title is shown in tab */}
      <div className="pb-3 border-b-2 border-primary/20">
        <p className="text-xs lg:text-sm text-muted-foreground">According to the UK government and ONS Business Population Estimates</p>
      </div>

      {/* Section 1: Total UK Businesses */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">UK Business Population</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-2xl lg:text-3xl font-bold text-primary">~5.6 million</p>
            <p className="text-xs lg:text-sm text-muted-foreground">Total UK businesses</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-2xl lg:text-3xl font-bold text-primary">~2.6 million</p>
            <p className="text-xs lg:text-sm text-muted-foreground">VAT and/or PAYE-registered businesses</p>
          </div>
        </div>
        <p className="text-xs lg:text-sm text-muted-foreground mt-3 italic">
          These represent the formal operating economy where regulated workflows, payroll, and compliance tooling are required
        </p>
      </div>

      {/* Section 2: UK Real Estate Sector */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">UK Real Estate Sector</h4>
        </div>
        <p className="text-xs lg:text-sm text-muted-foreground mb-3">
          Using ONS Standard Industrial Classification (SIC Section L – Real Estate Activities)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-xl lg:text-2xl font-bold text-primary">~3–4%</p>
            <p className="text-xs lg:text-sm text-muted-foreground">of VAT/PAYE-registered UK firms</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-xl lg:text-2xl font-bold text-primary">~80,000–110,000</p>
            <p className="text-xs lg:text-sm text-muted-foreground">Real estate businesses in the UK</p>
          </div>
        </div>

        <p className="text-xs lg:text-sm text-muted-foreground mb-2">These include:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {realEstateTypes.map((type, index) => (
            <div key={index} className="flex items-center gap-2 text-xs lg:text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
              <span>{type}</span>
            </div>
          ))}
        </div>

        <p className="text-xs lg:text-sm text-muted-foreground mt-4 italic">
          This is a large, fragmented, and operationally complex customer base, with document volume increasing year over year.
        </p>
      </div>

      {/* Section 3: Core Market */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Core Market Entry</h4>
        </div>
        <div className="bg-background/50 rounded-lg p-4 border border-border/50 mb-3">
          <p className="text-2xl lg:text-3xl font-bold text-primary text-center">~90,000</p>
          <p className="text-sm text-muted-foreground text-center mt-1">Real estate operators where document intelligence is mission-critical</p>
        </div>
        <p className="text-xs lg:text-sm text-muted-foreground text-center">
          Then expand into a <span className="font-semibold text-primary">500,000+</span> business adjacent market built on the same document foundations.
        </p>
      </div>

      {/* Section 4: Adjacent Market */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Adjacent Market (Expansion Opportunity)</h4>
        </div>
        
        <p className="text-xs lg:text-sm text-muted-foreground mb-4">Includes:</p>
        
        <div className="space-y-2">
          {adjacentMarkets.map((market, index) => (
            <div key={index} className="flex items-center justify-between bg-background/50 rounded-lg p-3 border border-border/50">
              <div className="flex items-center gap-3">
                <market.icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-xs lg:text-sm text-foreground">{market.label}</span>
              </div>
              <span className="text-xs lg:text-sm font-semibold text-green-700">{market.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 lg:p-5">
        <h4 className="text-sm lg:text-base font-semibold text-primary mb-3">Summary</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Core Market</p>
              <p className="text-xs lg:text-sm text-muted-foreground">~90,000 real estate operators where document intelligence is mission-critical</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Expansion Market</p>
              <p className="text-xs lg:text-sm text-muted-foreground">500,000+ adjacent businesses built on the same document foundations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
