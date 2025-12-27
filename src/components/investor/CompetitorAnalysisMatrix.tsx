import React from "react";
import { competitorData } from "./data/competitorData";

const CompetitorAnalysisMatrix: React.FC = () => {
  return (
    <div className="space-y-6">

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse text-sm rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20">
              <th className="border border-primary/20 p-3 text-left font-semibold text-foreground">Company</th>
              <th className="border border-primary/20 p-3 text-left font-semibold text-foreground">Who They Are</th>
              <th className="border border-primary/20 p-3 text-left font-semibold text-foreground">What They Do</th>
              <th className="border border-primary/20 p-3 text-left font-semibold text-foreground">Strengths</th>
              <th className="border border-primary/20 p-3 text-left font-semibold text-foreground">Weaknesses</th>
              <th className="border border-primary/20 p-3 text-left font-semibold text-foreground">5 x Representative Reviews</th>
              <th className="border border-primary/20 p-3 text-left font-semibold text-foreground">Market Value</th>
            </tr>
          </thead>
          <tbody>
            {competitorData.map((row, index) => (
              <tr 
                key={row.competitor} 
                className={index % 2 === 0 
                  ? "bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" 
                  : "bg-gradient-to-r from-secondary/80 via-muted/50 to-secondary/80"
                }
              >
                <td className="border border-primary/20 p-3 align-top font-semibold text-foreground">
                  {row.competitor}
                </td>
                <td className="border border-primary/20 p-3 align-top text-muted-foreground">
                  {row.whoTheyAre}
                </td>
                <td className="border border-primary/20 p-3 align-top text-muted-foreground">
                  {row.whatTheyDo}
                </td>
                <td className="border border-primary/20 p-3 align-top text-muted-foreground">
                  {row.strengths}
                </td>
                <td className="border border-primary/20 p-3 align-top text-muted-foreground">
                  {row.weaknesses}
                </td>
                <td className="border border-primary/20 p-3 align-top text-muted-foreground">
                  <div className="flex flex-wrap gap-1">
                    {row.reviews.map((review, i) => (
                      <span key={i} className="text-xs bg-primary/10 px-2 py-1 rounded text-foreground">
                        "{review}"
                      </span>
                    ))}
                  </div>
                </td>
                <td className="border border-primary/20 p-3 align-top text-foreground font-medium">
                  {row.marketValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {competitorData.map((row, index) => (
          <div 
            key={row.competitor} 
            className={`rounded-xl border border-primary/20 p-4 ${
              index % 2 === 0 
                ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10' 
                : 'bg-gradient-to-br from-secondary via-muted/50 to-secondary'
            }`}
          >
            <div className="text-lg font-bold mb-3 text-foreground">
              {row.competitor}
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-background/60 rounded-lg p-2 border border-border/50">
                  <div className="font-semibold text-primary text-xs mb-1">Who They Are</div>
                  <div className="text-muted-foreground">{row.whoTheyAre}</div>
                </div>
                <div className="bg-background/60 rounded-lg p-2 border border-border/50">
                  <div className="font-semibold text-primary text-xs mb-1">What They Do</div>
                  <div className="text-muted-foreground">{row.whatTheyDo}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-background/60 rounded-lg p-2 border border-border/50">
                  <div className="font-semibold text-primary text-xs mb-1">Strengths</div>
                  <div className="text-muted-foreground">{row.strengths}</div>
                </div>
                <div className="bg-background/60 rounded-lg p-2 border border-border/50">
                  <div className="font-semibold text-primary text-xs mb-1">Weaknesses</div>
                  <div className="text-muted-foreground">{row.weaknesses}</div>
                </div>
              </div>
              
              <div className="bg-background/60 rounded-lg p-2 border border-border/50">
                <div className="font-semibold text-primary text-xs mb-1">Representative Reviews</div>
                <div className="flex flex-wrap gap-1">
                  {row.reviews.map((review, i) => (
                    <span key={i} className="text-xs bg-primary/10 px-2 py-1 rounded text-muted-foreground">
                      "{review}"
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-background/60 rounded-lg p-2 border border-border/50">
                <div className="font-semibold text-primary text-xs mb-1">Market Value</div>
                <div className="text-foreground font-medium">{row.marketValue}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorAnalysisMatrix;
