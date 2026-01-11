import React from "react";
import { TrendingUp, Users, Building2, Target, CheckCircle, Globe, PoundSterling } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RevenueModelVisual = () => {
  const pricingPlans = [
    { plan: "Essential", price: "£19.50", mix: "60%" },
    { plan: "Essential Plus", price: "£49.75", mix: "30%" },
    { plan: "Enterprise", price: "£148.50", mix: "10%" },
  ];

  const ukPenetration = [
    { year: "2027", penetration: "1.0%", customers: "2,352" },
    { year: "2028", penetration: "1.25%", customers: "2,940" },
    { year: "2029", penetration: "1.5%", customers: "3,528" },
    { year: "2030", penetration: "1.75%", customers: "4,116" },
    { year: "2031", penetration: "2.0%", customers: "4,704" },
  ];

  const globalPenetration = [
    { year: "2028", penetration: "0.25%", customers: "10,584" },
    { year: "2029", penetration: "0.35%", customers: "14,818" },
    { year: "2030", penetration: "0.5%", customers: "21,168" },
    { year: "2031", penetration: "0.6%", customers: "25,402" },
  ];

  const revenueProjection = [
    { year: "2027", ukRevenue: "£0.708M", globalRevenue: "—", totalRevenue: "£0.708M" },
    { year: "2028", ukRevenue: "£1.46M", globalRevenue: "£5.25M", totalRevenue: "£6.71M" },
    { year: "2029", ukRevenue: "£1.75M", globalRevenue: "£7.35M", totalRevenue: "£9.10M" },
    { year: "2030", ukRevenue: "£2.04M", globalRevenue: "£10.49M", totalRevenue: "£12.53M" },
    { year: "2031", ukRevenue: "£2.33M", globalRevenue: "£12.59M", totalRevenue: "£14.92M" },
  ];

  const credibilityPoints = [
    {
      title: "Low-Friction Pricing",
      description: "Mass-adoption friendly pricing fits SMB + mid-size + enterprise land-and-expand strategy.",
    },
    {
      title: "No Onboarding Barrier",
      description: "Zero integration cost accelerates penetration far faster than traditional PropTech.",
    },
    {
      title: "Strong, Quantifiable ROI",
      description: "20% efficiency gain per admin → £6,000+ annual saving. ARPU of £495/year makes adoption a 'no brainer'.",
    },
    {
      title: "AI Category Whitespace",
      description: "No global leader in 'AI document intelligence' — Hobson can own the category.",
    },
    {
      title: "Conservative Assumptions",
      description: "Realistic adoption levels for SaaS utility — nowhere near aggressive VC-hype assumptions.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">5-Year Revenue Model (2027–2031)</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Post-pilot commercial launch → UK scale → Global expansion → Stabilised growth
        </p>
      </div>

      {/* Market Size Basis */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Market Size Basis
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground">UK Real Estate Businesses</p>
            <p className="text-2xl font-bold text-primary">235,200</p>
          </div>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Global Comparable Markets (OECD-aligned)</p>
            <p className="text-2xl font-bold text-primary">≈ 4.23M</p>
            <p className="text-xs text-muted-foreground mt-1">18× UK market — conservative and justified</p>
          </div>
        </div>
      </div>

      {/* Pricing Plans & ARPU */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <PoundSterling className="w-5 h-5 text-primary" />
          Pricing Plans & ARPU
        </h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="font-semibold">Plan</TableHead>
                <TableHead className="font-semibold">Monthly Price</TableHead>
                <TableHead className="font-semibold">Mix Assumption</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingPlans.map((plan, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                  <TableCell className="font-medium">{plan.plan}</TableCell>
                  <TableCell className="text-primary font-semibold">{plan.price}</TableCell>
                  <TableCell>{plan.mix}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Blended ARPU (Monthly)</p>
              <p className="text-xl font-bold text-primary">£41.31</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual ARPU</p>
              <p className="text-xl font-bold text-primary">£607</p>
            </div>
          </div>
        </div>
      </div>

      {/* Penetration Assumptions */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Penetration Assumptions
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Conservative and defensible — aligned to growth timeline and go-to-market readiness.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* UK Penetration */}
          <div>
            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-4 bg-primary/20 rounded text-xs flex items-center justify-center">UK</span>
              UK Market
            </h5>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10">
                    <TableHead className="font-semibold text-xs">Year</TableHead>
                    <TableHead className="font-semibold text-xs">Penetration</TableHead>
                    <TableHead className="font-semibold text-xs">Customers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ukPenetration.map((row, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                      <TableCell className="font-medium text-sm">{row.year}</TableCell>
                      <TableCell className="text-primary font-semibold text-sm">{row.penetration}</TableCell>
                      <TableCell className="text-sm">{row.customers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Global Penetration */}
          <div>
            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Global Market (OECD)
            </h5>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10">
                    <TableHead className="font-semibold text-xs">Year</TableHead>
                    <TableHead className="font-semibold text-xs">Penetration</TableHead>
                    <TableHead className="font-semibold text-xs">Customers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalPenetration.map((row, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                      <TableCell className="font-medium text-sm">{row.year}</TableCell>
                      <TableCell className="text-primary font-semibold text-sm">{row.penetration}</TableCell>
                      <TableCell className="text-sm">{row.customers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Projection */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Revenue Projection (ARR)
        </h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="font-semibold">Year</TableHead>
                <TableHead className="font-semibold">UK Revenue</TableHead>
                <TableHead className="font-semibold">Global Revenue</TableHead>
                <TableHead className="font-semibold">Total Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueProjection.map((row, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                  <TableCell className="font-medium">{row.year}</TableCell>
                  <TableCell>{row.ukRevenue}</TableCell>
                  <TableCell>{row.globalRevenue}</TableCell>
                  <TableCell className="text-primary font-bold">{row.totalRevenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Headline Projection */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 via-green-500/5 to-green-500/10 border border-green-500/30">
        <h4 className="font-semibold text-foreground mb-4 text-center">Investor Headline Projection</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          {revenueProjection.map((row, index) => (
            <div key={index} className="p-3 bg-background/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{row.year}</p>
              <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">{row.totalRevenue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why These Numbers Are Reasonable */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Why These Numbers Are Credible
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {credibilityPoints.map((point, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
            >
              <h5 className="font-semibold text-foreground text-sm mb-2">{point.title}</h5>
              <p className="text-xs text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Formula */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30">
        <h4 className="font-semibold text-foreground mb-3">Model Summary</h4>
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Market:</span> <span className="font-medium">UK 235,200 → Global 4.23M businesses</span></p>
          <p><span className="text-muted-foreground">ARPU:</span> <span className="font-medium">£607 annually</span></p>
          <p><span className="text-muted-foreground">UK Penetration:</span> <span className="font-medium">1.0% → 2.0% (2027–2031)</span></p>
          <p><span className="text-muted-foreground">Global Penetration:</span> <span className="font-medium">0.25% → 0.6% (2028–2031)</span></p>
          <p><span className="text-muted-foreground">Revenue Growth:</span> <span className="font-medium text-primary">£0.708M → £14.92M (2027–2031)</span></p>
        </div>
      </div>
    </div>
  );
};

export default RevenueModelVisual;
