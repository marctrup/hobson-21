import React from 'react';
import { Database, ExternalLink } from 'lucide-react';

export const CustomersMarketSourcesVisual = () => {
  const sources = [
    {
      title: "Office for National Statistics (ONS), Business Population Estimates 2025",
      stat: "5.7M UK private sector businesses",
      linkText: "GOV.UK",
      linkUrl: "https://www.gov.uk/government/statistics/business-population-estimates-2024"
    },
    {
      title: "ONS UK Business Activity, Size and Location 2025",
      stat: "2.7M VAT/PAYE registered businesses",
      linkText: "Office for National Statistics",
      linkUrl: "https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation"
    },
    {
      title: "ONS Business Detailed Tables",
      stat: "Real Estate activities by SIC (Section L)",
      linkText: "GOV.UK",
      linkUrl: "https://www.gov.uk/government/statistics/business-population-estimates-2024"
    },
    {
      title: "McKinsey Global Survey on AI (2025)",
      stat: "~88% AI adoption in business functions",
      linkText: "McKinsey & Company",
      linkUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai"
    },
    {
      title: "McKinsey, Gen AI Real Estate Value",
      stat: "$110–$180B+ global value potential",
      linkText: "McKinsey & Company",
      linkUrl: "https://www.mckinsey.com/industries/real-estate/our-insights"
    },
    {
      title: "Deloitte Centre for Financial Services",
      stat: ">$7.2B AI/ML venture investment (relevant industry signalling)",
      linkText: "Deloitte United Kingdom",
      linkUrl: "https://www.deloitte.com/uk/en/industries/financial-services.html"
    }
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="p-4 lg:p-5 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/80 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/30">
        <h3 className="text-sm lg:text-base font-semibold text-primary text-left">
          Customers & Market Sources
        </h3>
      </div>

      {/* Sources List */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Data Sources</h4>
        </div>
        
        <div className="space-y-4">
          {sources.map((source, index) => (
            <div key={index} className="flex flex-col gap-1 pb-3 border-b border-primary/10 last:border-b-0 last:pb-0">
              <p className="text-sm lg:text-base font-medium text-foreground">
                {source.title}
              </p>
              <p className="text-xs lg:text-sm text-muted-foreground">
                {source.stat}
              </p>
              <a 
                href={source.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs lg:text-sm text-primary hover:underline w-fit"
              >
                {source.linkText}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
