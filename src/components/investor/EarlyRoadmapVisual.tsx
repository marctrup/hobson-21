import React from "react";

interface PhaseSection {
  phase: string;
  title: string;
  objectives: string[];
}

const timelineData: PhaseSection[] = [
  {
    phase: "May – Aug 2024",
    title: "Discover",
    objectives: [
      "Client discovery calls with real estate professionals",
      "Establish the core problem being solved",
      "Identify pain points in existing systems",
      "Define target market segments",
    ],
  },
  {
    phase: "Sept – Dec 2024",
    title: "Validate",
    objectives: [
      "Establish **four working partnerships** with real estate firms",
      "No-code concepts validation",
      "Scope the **MVP** based on partner feedback",
      "Refine value proposition and feature set",
    ],
  },
  {
    phase: "Jan – Dec 2025",
    title: "Develop",
    objectives: [
      "Build **MVP: Phase 1** with core AI capabilities",
      "Build online presence and branding",
      "Testing MVP with key clients data",
      "Finalise **pricing strategy** based on usage data",
      "Build a **marketing plan**",
      "Build a **business plan** and financial model",
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

export const EarlyRoadmapVisual: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold text-foreground mb-6">
        Hobson Roadmap (2024–2025)
      </h2>

      {timelineData.map((section, index) => (
        <div
          key={section.phase}
          className={`bg-background border border-border rounded-lg overflow-hidden ${
            index === 0
              ? "border-l-4 border-l-amber-500"
              : index === 1
              ? "border-l-4 border-l-orange-500"
              : "border-l-4 border-l-red-500"
          }`}
        >
          {/* Phase Header */}
          <div
            className={`px-4 py-3 ${
              index === 0
                ? "bg-amber-50 dark:bg-amber-950/30"
                : index === 1
                ? "bg-orange-50 dark:bg-orange-950/30"
                : "bg-red-50 dark:bg-red-950/30"
            }`}
          >
            <h3 className="text-lg font-semibold text-foreground">
              {section.phase}: {section.title}
            </h3>
          </div>

          {/* Content */}
          <div className="px-4 py-4">
            {/* Key Objectives */}
            <ul className="space-y-2">
              {section.objectives.map((objective, objIndex) => (
                <li
                  key={objIndex}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      index === 0
                        ? "bg-amber-500"
                        : index === 1
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span>{formatText(objective)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
