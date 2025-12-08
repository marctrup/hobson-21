import React from 'react';
import { Globe, Building2, BarChart3, Calculator, CheckCircle, TrendingUp } from 'lucide-react';

const GlobalJustificationVisual = () => {
  const businessDensity = [
    { region: "UK", density: "75-80" },
    { region: "EU average", density: "60-70" },
    { region: "USA", density: "70-80" },
    { region: "OECD average", density: "65" }
  ];

  const marketEstimate = [
    { region: "UK", multiplier: "1×", businesses: "235,200" },
    { region: "Global formal markets (OECD-aligned)", multiplier: "18×", businesses: "≈ 4.2 million" }
  ];

  const credibilityPoints = [
    "Uses published national statistics, not guesswork",
    "Scales only across markets where Hobson can actually launch",
    "Avoids inflated \"world population\" errors common in startup models",
    "Investors prefer midpoint estimates within evidence-based ranges"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">Global Market Size Assumption</h3>
        <p className="text-muted-foreground text-sm">
          Evidence-based methodology for estimating global real estate business count
        </p>
      </div>

      {/* Section 1: Universal Industry */}
      <div className="bg-secondary/30 rounded-lg p-5 border border-border/50">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">1. Real estate is a universal, high-density industry</h4>
            <p className="text-muted-foreground text-sm mt-1">
              Across developed economies (UK, EU, US), real estate consistently represents:
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 ml-12">
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <p className="text-2xl font-bold text-primary">10-14%</p>
            <p className="text-sm text-foreground">of GDP</p>
            <p className="text-xs text-muted-foreground mt-1">OECD, World Bank, Statista — property, leasing, construction, and real estate services</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/30">
            <p className="text-2xl font-bold text-primary">4-5%</p>
            <p className="text-sm text-foreground">of all formally registered businesses</p>
            <p className="text-xs text-muted-foreground mt-1">ONS, Eurostat, US Census NAICS 531, OECD Structural Business Statistics</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 ml-12 italic">
          These ratios are stable across OECD countries, allowing scalable market estimation.
        </p>
      </div>

      {/* Section 2: Business Density */}
      <div className="bg-secondary/30 rounded-lg p-5 border border-border/50">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">2. Business density per population is consistent across OECD markets</h4>
            <p className="text-muted-foreground text-sm mt-1">
              Registered businesses per 1,000 people:
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-12">
          {businessDensity.map((item, index) => (
            <div key={index} className="bg-background/50 rounded-lg p-3 border border-border/30 text-center">
              <p className="text-lg font-bold text-primary">{item.density}</p>
              <p className="text-xs text-muted-foreground">{item.region}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 ml-12 italic">
          This creates a reliable basis for cross-market scaling using population.
        </p>
      </div>

      {/* Section 3: Global Scaling */}
      <div className="bg-secondary/30 rounded-lg p-5 border border-border/50">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">3. Global scaling uses comparable markets (not world population)</h4>
            <p className="text-muted-foreground text-sm mt-1">
              Hobson targets regulated, formal markets: UK, EU, US, Canada, Australia, NZ, Singapore.
            </p>
          </div>
        </div>
        <div className="ml-12 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-background/50 rounded-lg p-3 border border-border/30 text-center">
              <p className="text-sm text-muted-foreground">OECD markets population</p>
              <p className="text-xl font-bold text-foreground">1.38 billion</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3 border border-border/30 text-center">
              <p className="text-sm text-muted-foreground">UK population</p>
              <p className="text-xl font-bold text-foreground">67 million</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3 border border-border/30 text-center">
              <p className="text-sm text-muted-foreground">Scaling factor</p>
              <p className="text-xl font-bold text-primary">20.5×</p>
            </div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/30 text-center">
            <p className="text-sm text-foreground">
              To maintain a conservative and defendable modelling approach, Hobson uses an{" "}
              <span className="font-bold text-primary">18× multiplier</span>{" "}
              (midpoint of the 15-20× feasible range).
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Resulting Estimate */}
      <div className="bg-secondary/30 rounded-lg p-5 border border-border/50">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">4. Resulting Global Real Estate Business Estimate</h4>
            <p className="text-muted-foreground text-sm mt-1">
              Using UK baseline = 235,200 real estate businesses (ONS)
            </p>
          </div>
        </div>
        <div className="ml-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Region</th>
                <th className="text-center py-2 px-3 text-muted-foreground font-medium">Multiplier</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Estimated Businesses</th>
              </tr>
            </thead>
            <tbody>
              {marketEstimate.map((item, index) => (
                <tr key={index} className={index === 1 ? "bg-primary/5" : ""}>
                  <td className="py-3 px-3 font-medium text-foreground">{item.region}</td>
                  <td className="py-3 px-3 text-center text-primary font-bold">{item.multiplier}</td>
                  <td className="py-3 px-3 text-right font-bold text-foreground">{item.businesses}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground mt-3 italic">
            This reflects the realistic global addressable market for document-heavy real estate operations.
          </p>
        </div>
      </div>

      {/* Section 5: Credibility */}
      <div className="bg-secondary/30 rounded-lg p-5 border border-border/50">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">5. Why this assumption is credible</h4>
          </div>
        </div>
        <div className="ml-12 grid md:grid-cols-2 gap-2">
          {credibilityPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Assumption */}
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/20 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Final Assumption Used in the Financial Model</p>
        <p className="text-foreground font-medium">
          Hobson's global market size is projected at{" "}
          <span className="text-primary font-bold">~4.2 million real estate businesses</span>, justified by 
          OECD business density and the proportion of real estate firms across comparable markets.
        </p>
      </div>
    </div>
  );
};

export default GlobalJustificationVisual;
