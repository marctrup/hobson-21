import React from "react";

const competitorData = [
  {
    competitor: "Hobson",
    personas: [
      "Large portfolio operators",
      "Medium property companies",
      "SMB owner-managers handling heavy document workflows",
    ],
    seo: [
      "Competes in emerging, low-competition spaces: AI for real estate documents, lease analysis AI, document intelligence.",
      "Search volume rising; avoids saturated \"property management software\" terms.",
    ],
    social: [
      "Early-stage presence.",
      "Opportunity to own the \"document intelligence\" voice.",
      "Best suited to clarity-driven, expert content.",
    ],
    implications: "White-space category: Hobson can dominate AI document insight for real estate — a niche not occupied by legacy PropTech or AI leasing tools.",
    isHobson: true,
  },
  {
    competitor: "EliseAI",
    personas: [
      "Residential property managers",
      "Leasing agents",
      "Customer service teams",
    ],
    seo: [
      "High difficulty: AI leasing assistant, property management automation.",
      "Large search volume but saturated.",
    ],
    social: [
      "Strong LinkedIn presence; regular posting.",
      "Case-study heavy; automation-first narrative.",
    ],
    implications: "Avoid leasing automation positioning. Focus instead on operational clarity, document accuracy, and retrieval.",
    isHobson: false,
  },
  {
    competitor: "StanAI",
    personas: [
      "Commercial brokers",
      "Investment teams",
      "Underwriting analysts",
    ],
    seo: [
      "Competes in AI underwriting, CRE data automation.",
      "Moderate difficulty; specialist search volume.",
    ],
    social: [
      "Professional tone, consistent posting.",
      "CRE analytics-focused insights.",
    ],
    implications: "Clear separation: StanAI = deal analytics; Hobson = document intelligence. Keep messaging distinct to avoid confusion.",
    isHobson: false,
  },
  {
    competitor: "Kendal AI",
    personas: [
      "Property managers",
      "Tenant communication teams",
    ],
    seo: [
      "Competitive and costly terms: AI property management, tenant enquiry automation.",
    ],
    social: [
      "Small but active LinkedIn presence.",
      "Conversational tone focused on tenant messaging use-cases.",
    ],
    implications: "Their domain is front-of-house. Hobson should stay positioned as back-of-house clarity, accuracy, and compliance intelligence.",
    isHobson: false,
  },
  {
    competitor: "Trudi",
    personas: [
      "SME property managers",
      "Residential leasing teams (AU/US)",
    ],
    seo: [
      "Regional keywords; moderate difficulty.",
      "Terms like AI assistant for property management growing.",
    ],
    social: [
      "Warm, approachable brand style.",
      "Video and testimonial-led content.",
    ],
    implications: "Tone mismatch advantage: Hobson wins by maintaining a more professional, operationally-focused identity.",
    isHobson: false,
  },
  {
    competitor: "Legacy PropTech",
    subtext: "(Yardi, MRI, AppFolio, RealPage, Buildium)",
    personas: [
      "Enterprises + SMBs across commercial & residential",
    ],
    seo: [
      "Extremely high domain authority.",
      "Completely dominate broad terms: property management software, lease management system.",
    ],
    social: [
      "Large-scale presence; polished enterprise brand; huge budget.",
    ],
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
          Hobson
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary/10">
              <th className="border border-border p-3 text-left font-semibold text-foreground">Competitor</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Customer Personas Served</th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">SEO Landscape<br/><span className="font-normal text-xs text-muted-foreground">(Competition, Keywords, Search Volume)</span></th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Social Media Presence<br/><span className="font-normal text-xs text-muted-foreground">(Reach, Engagement, Style)</span></th>
              <th className="border border-border p-3 text-left font-semibold text-foreground">Strategic Implications for Hobson</th>
            </tr>
          </thead>
          <tbody>
            {competitorData.map((row, index) => (
              <tr 
                key={row.competitor} 
                className={`${row.isHobson ? "bg-primary/5" : index % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
              >
                <td className="border border-border p-3 align-top min-w-[100px]">
                  <div className={`${row.isHobson ? "text-primary font-bold" : "font-semibold text-foreground"}`}>
                    {row.competitor}
                  </div>
                  {row.subtext && (
                    <div className="text-xs text-muted-foreground mt-1">{row.subtext}</div>
                  )}
                </td>
                <td className="border border-border p-3 align-top text-muted-foreground min-w-[150px]">
                  <ul className="space-y-1">
                    {row.personas.map((item, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-border p-3 align-top text-muted-foreground min-w-[200px]">
                  <ul className="space-y-1">
                    {row.seo.map((item, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-border p-3 align-top text-muted-foreground min-w-[180px]">
                  <ul className="space-y-1">
                    {row.social.map((item, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className={`border border-border p-3 align-top min-w-[200px] ${row.isHobson ? "text-primary font-medium" : "text-muted-foreground"}`}>
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
                <div className="text-xs font-normal text-muted-foreground mt-1">{row.subtext}</div>
              )}
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold text-foreground mb-2">Customer Personas Served</div>
                <ul className="space-y-1 text-muted-foreground">
                  {row.personas.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="font-semibold text-foreground mb-2">SEO Landscape</div>
                <ul className="space-y-1 text-muted-foreground">
                  {row.seo.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="font-semibold text-foreground mb-2">Social Media Presence</div>
                <ul className="space-y-1 text-muted-foreground">
                  {row.social.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="font-semibold text-foreground mb-2">Strategic Implications</div>
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
