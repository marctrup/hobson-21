import React from "react";

interface YearSection {
  year: string;
  title: string;
  goal: string;
  objectives: string[];
  strategicAlignment?: string;
}

const timelineData: YearSection[] = [
  {
    year: "2026",
    title: "Strengthen the Product and Validate the Market",
    goal: "Expand pilot testing, refine the product, and prepare for commercial launch.",
    objectives: [
      "Grow to **10 active pilot organisations** across different portfolio sizes.",
      "Scale and improve core features based on real pilot feedback.",
      "Convert **3–5 pilots into paying customers** to validate commercial demand.",
      "Build the **payment engine** and billing workflows required for public launch.",
      "Finalise the **marketing plan**, including KPIs, channel strategy, content structure, and acquisition approach.",
      "Prepare the full go-to-market plan for the **2027 launch**.",
    ],
    strategicAlignment: "These objectives align with 2026 tactics, including clarity-led content, early SEO groundwork, CTA testing, onboarding sequences, retention tips, pilot storytelling, and persona-based messaging.",
  },
  {
    year: "2027",
    title: "Enter the Market and Expand Commercially",
    goal: "Launch publicly, scale paid users, and prepare for international expansion.",
    objectives: [
      "Launch the **public Hobson website in Q1 2027** with pricing, onboarding flows, and structured funnels.",
      "Implement the full **marketing plan** across SEO, LinkedIn, email nurture, retargeting, and retention communications.",
      "Scale the technology and platform features to support increasing usage and more complex queries.",
      "Strengthen onboarding, support, and customer success workflows for enterprise readiness.",
      "Prepare for global expansion by validating demand and compliance requirements in **two target countries**.",
    ],
    strategicAlignment: "These objectives match 2027 tactics including funnel automation, case study production, paid acquisition scaling, structured support systems, and Teams/Slack integration prototypes.",
  },
  {
    year: "2028",
    title: "Global Launch and Market Expansion",
    goal: "Move beyond the UK and establish Hobson as an international solution.",
    objectives: [
      "Launch Hobson in **two international markets** with regionalised marketing, onboarding flows, and documentation.",
      "Release localised document packs and accuracy improvements tailored to new jurisdictions.",
      "Grow the paid customer base across the UK and international regions.",
      "Expand brand presence through partnerships, industry events, and region-specific content.",
      "Strengthen platform reliability, insight features, and multi-market operational support.",
    ],
    strategicAlignment: "These objectives correspond to 2028 tactics including localised landing pages, regional PPC, YouTube expansion, global advocacy programmes, and international governance standards.",
  },
];

const formatText = (text: string) => {
  // Convert **text** to bold spans
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={index} className="font-semibold text-primary">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
};

export const GanttChartVisual: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold text-foreground mb-6">
        Hobson Growth Timeline (2026–2028)
      </h2>

      {timelineData.map((section, index) => (
        <div
          key={section.year}
          className={`bg-background border border-border rounded-lg overflow-hidden ${
            index === 0
              ? "border-l-4 border-l-purple-500"
              : index === 1
              ? "border-l-4 border-l-blue-500"
              : "border-l-4 border-l-green-500"
          }`}
        >
          {/* Year Header */}
          <div
            className={`px-4 py-3 ${
              index === 0
                ? "bg-purple-50 dark:bg-purple-950/30"
                : index === 1
                ? "bg-blue-50 dark:bg-blue-950/30"
                : "bg-green-50 dark:bg-green-950/30"
            }`}
          >
            <h3 className="text-lg font-semibold text-foreground">
              {section.year} — {section.title}
            </h3>
          </div>

          {/* Content */}
          <div className="px-4 py-4 space-y-4">
            {/* Goal */}
            <div>
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Goal:
              </span>
              <p className="text-sm text-foreground mt-1">{section.goal}</p>
            </div>

            {/* Key Objectives */}
            <div>
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Key Objectives
              </span>
              <ul className="mt-2 space-y-2">
                {section.objectives.map((objective, objIndex) => (
                  <li
                    key={objIndex}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        index === 0
                          ? "bg-purple-500"
                          : index === 1
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    />
                    <span>{formatText(objective)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Alignment */}
            {section.strategicAlignment && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Strategic alignment:
                </span>
                <p className="text-sm text-muted-foreground mt-1 italic">
                  {section.strategicAlignment}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
