import React from "react";

interface YearSection {
  year: string;
  title: string;
  goal: string;
  objectives: string[];
}

const timelineData: YearSection[] = [
  {
    year: "2026",
    title: "Strengthen the Product and Validate the Market",
    goal: "Expand pilot testing, refine the product, and prepare for commercial launch.",
    objectives: [
      "Grow to **10 active pilot organisations** across different portfolio sizes.",
      "Scale and improve core features based on real pilot feedback.",
      "Convert **3–5 pilots into paying customers** to prove commercial demand.",
      "Build a **payment engine** and billing workflows ready for public launch.",
      "Finalise the **marketing plan**, including KPIs, channels, content structure, and acquisition strategy.",
      "Prepare the full go-to-market plan for **2027 launch**.",
    ],
  },
  {
    year: "2027",
    title: "Enter the Market and Expand Commercially",
    goal: "Launch publicly, grow paid users, and prepare for international expansion.",
    objectives: [
      "Launch the **public Hobson website (Q1 2027)** with full pricing and onboarding flows.",
      "Implement the **marketing plan**, including SEO, LinkedIn content, website funnels, and retention communications.",
      "Scale the technology and platform features to support growing demand.",
      "Strengthen onboarding, support processes, and customer success workflows.",
      "Prepare for global expansion by validating demand and compliance requirements in **two target countries**.",
    ],
  },
  {
    year: "2028",
    title: "Global Launch and Market Expansion",
    goal: "Move beyond the UK and establish Hobson as an international solution.",
    objectives: [
      "Launch Hobson in **two international markets**, supported by regionalised marketing and documentation.",
      "Release localised document packs and accuracy enhancements for new jurisdictions.",
      "Grow paid customer base across UK + international regions.",
      "Expand brand presence through partnerships, content, and local industry events.",
      "Strengthen platform reliability and insight features to support multi-market operations.",
    ],
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
          </div>
        </div>
      ))}
    </div>
  );
};
