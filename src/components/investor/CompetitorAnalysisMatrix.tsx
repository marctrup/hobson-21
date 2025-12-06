import React from "react";

const competitorData = [
  {
    competitor: "Hobson",
    personas: "Large portfolio operators; medium property companies; SMB owner-managers with document-heavy workflows",
    seo: "Emerging, low-competition keywords: AI for real estate documents, lease analysis AI, document intelligence. Rising search volume.",
    social: "Early-stage presence; opportunity to lead in \"document intelligence.\" Clarity-driven tone works best.",
    implications: "White-space category Hobson can own: AI document insight for real estate.",
    isHobson: true,
  },
  {
    competitor: "EliseAI",
    personas: "Residential property managers, leasing agents, customer service teams",
    seo: "High difficulty: AI leasing assistant, property management automation. Saturated vertical.",
    social: "Strong LinkedIn presence; case-study and automation-led stories.",
    implications: "Avoid leasing automation narrative; differentiate through document clarity + operational intelligence.",
    isHobson: false,
  },
  {
    competitor: "StanAI",
    personas: "Commercial brokers; investment teams; underwriting analysts",
    seo: "Moderate difficulty terms: AI underwriting, CRE data automation. Specialist traffic.",
    social: "Professional CRE-focused content; moderate engagement.",
    implications: "Keep distance: StanAI = deal analytics; Hobson = document intelligence.",
    isHobson: false,
  },
  {
    competitor: "Kendal AI",
    personas: "Property managers; tenant communication teams",
    seo: "Competitive keywords: AI property management, tenant enquiry automation.",
    social: "Small but active presence; conversational tone.",
    implications: "Position Hobson as back-office clarity + compliance tool, not tenant comms.",
    isHobson: false,
  },
  {
    competitor: "Trudi",
    personas: "SME property managers; residential leasing teams (AU/US)",
    seo: "Moderate regional SEO difficulty.",
    social: "Approachable brand; video-heavy testimonials.",
    implications: "Hobson wins by staying professional, operational, accuracy-led.",
    isHobson: false,
  },
  {
    competitor: "Legacy PropTech",
    subtext: "(Yardi, MRI, AppFolio, RealPage)",
    personas: "Enterprise + SMB",
    seo: "Very high SEO authority; dominate broad terms like property management software.",
    social: "Massive presence; enterprise branding.",
    implications: "Do not compete on broad software terms. Position Hobson as the AI layer that complements existing systems.",
    isHobson: false,
  },
];

const CompetitorAnalysisMatrix: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          Competitive Landscape & Strategic Positioning Matrix
        </h3>
        <p className="text-muted-foreground text-sm">
          Strategic analysis of key competitors and positioning opportunities
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary/10">
              <th className="border border-border p-3 text-left font-semibold text-foreground">Competitor</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Customer Personas Served</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">SEO Landscape</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Social Media Presence</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Strategic Implications for Hobson</th>
            </tr>
          </thead>
          <tbody>
            {competitorData.map((row, index) => (
              <tr 
                key={row.competitor} 
                className={`${row.isHobson ? "bg-primary/5 font-medium" : index % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
              >
                <td className="border border-border p-3 align-top">
                  <div className={`${row.isHobson ? "text-primary font-bold" : "font-semibold text-foreground"}`}>
                    {row.competitor}
                  </div>
                  {row.subtext && (
                    <div className="text-xs text-muted-foreground mt-1">{row.subtext}</div>
                  )}
                </td>
                <td className="border border-border p-3 align-top text-muted-foreground">{row.personas}</td>
                <td className="border border-border p-3 align-top text-muted-foreground">{row.seo}</td>
                <td className="border border-border p-3 align-top text-muted-foreground">{row.social}</td>
                <td className={`border border-border p-3 align-top ${row.isHobson ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {row.implications}
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
            className={`rounded-lg border p-4 ${row.isHobson ? "border-primary bg-primary/5" : "border-border bg-card"}`}
          >
            <div className={`text-lg font-bold mb-3 ${row.isHobson ? "text-primary" : "text-foreground"}`}>
              {row.competitor}
              {row.subtext && (
                <span className="text-xs font-normal text-muted-foreground ml-2">{row.subtext}</span>
              )}
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-semibold text-foreground mb-1">Customer Personas</div>
                <div className="text-muted-foreground">{row.personas}</div>
              </div>
              
              <div>
                <div className="font-semibold text-foreground mb-1">SEO Landscape</div>
                <div className="text-muted-foreground">{row.seo}</div>
              </div>
              
              <div>
                <div className="font-semibold text-foreground mb-1">Social Media</div>
                <div className="text-muted-foreground">{row.social}</div>
              </div>
              
              <div>
                <div className="font-semibold text-foreground mb-1">Strategic Implications</div>
                <div className={row.isHobson ? "text-primary font-medium" : "text-muted-foreground"}>
                  {row.implications}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorAnalysisMatrix;
