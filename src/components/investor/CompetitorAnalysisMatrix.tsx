import React from "react";
import { competitorData } from "./data/competitorData";

const CompetitorAnalysisMatrix: React.FC = () => {
  return (
    <div className="space-y-6">

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary/10">
              <th className="border border-border p-3 text-left font-semibold text-foreground">Competitor</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Who They Are</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">What They Do</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Strengths</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Weaknesses</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">5 x Representative Reviews</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Market Value</th>
            </tr>
          </thead>
          <tbody>
            {competitorData.map((row, index) => (
              <tr 
                key={row.competitor} 
                className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
              >
                <td className="border border-border p-3 align-top font-semibold text-foreground">
                  {row.competitor}
                </td>
                <td className="border border-border p-3 align-top text-muted-foreground">
                  {row.whoTheyAre}
                </td>
                <td className="border border-border p-3 align-top text-muted-foreground">
                  {row.whatTheyDo}
                </td>
                <td className="border border-border p-3 align-top text-muted-foreground">
                  {row.strengths}
                </td>
                <td className="border border-border p-3 align-top text-muted-foreground">
                  {row.weaknesses}
                </td>
                <td className="border border-border p-3 align-top text-muted-foreground">
                  <div className="flex flex-wrap gap-1">
                    {row.reviews.map((review, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                        "{review}"
                      </span>
                    ))}
                  </div>
                </td>
                <td className="border border-border p-3 align-top text-foreground font-medium">
                  {row.marketValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {competitorData.map((row) => (
          <div 
            key={row.competitor} 
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="text-lg font-bold mb-3 text-foreground">
              {row.competitor}
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-semibold text-foreground text-xs mb-1">Who They Are</div>
                  <div className="text-muted-foreground">{row.whoTheyAre}</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-xs mb-1">What They Do</div>
                  <div className="text-muted-foreground">{row.whatTheyDo}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-semibold text-foreground text-xs mb-1">Strengths</div>
                  <div className="text-muted-foreground">{row.strengths}</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-xs mb-1">Weaknesses</div>
                  <div className="text-muted-foreground">{row.weaknesses}</div>
                </div>
              </div>
              
              <div>
                <div className="font-semibold text-foreground text-xs mb-1">Representative Reviews</div>
                <div className="flex flex-wrap gap-1">
                  {row.reviews.map((review, i) => (
                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                      "{review}"
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="font-semibold text-foreground text-xs mb-1">Market Value</div>
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
