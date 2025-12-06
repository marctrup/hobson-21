import React from "react";

interface GanttRow {
  workstream: string;
  quarters: ("full" | "partial" | "light" | "none")[];
}

interface YearSection {
  year: string;
  title: string;
  rows: GanttRow[];
}

const ganttData: YearSection[] = [
  {
    year: "2026",
    title: "Pilot Growth, Feature Scaling, Commercial Prep",
    rows: [
      { workstream: "Pilot Expansion (Grow to 10)", quarters: ["full", "full", "partial", "light"] },
      { workstream: "Feature Development (Pilot-Led)", quarters: ["full", "full", "full", "full"] },
      { workstream: "Convert 3–5 Pilots to Paid", quarters: ["light", "partial", "full", "full"] },
      { workstream: "Build Payment Engine", quarters: ["light", "full", "full", "partial"] },
      { workstream: "Marketing Plan (KPIs + Strategy)", quarters: ["partial", "full", "full", "light"] },
      { workstream: "Prep for 2027 Launch", quarters: ["light", "partial", "full", "full"] },
    ],
  },
  {
    year: "2027",
    title: "Public Launch, Scale, International Prep",
    rows: [
      { workstream: "Public Website Launch", quarters: ["full", "light", "light", "light"] },
      { workstream: "Implement Marketing Plan", quarters: ["full", "full", "full", "full"] },
      { workstream: "Scale Tech & Features", quarters: ["partial", "full", "full", "full"] },
      { workstream: "Customer Success & Support Systems", quarters: ["full", "full", "full", "full"] },
      { workstream: "Prepare for 2-Country Global Launch", quarters: ["light", "partial", "full", "full"] },
    ],
  },
  {
    year: "2028",
    title: "Global Launch & International Growth",
    rows: [
      { workstream: "Launch in 2 Countries", quarters: ["full", "full", "light", "light"] },
      { workstream: "Localised Marketing & Documentation", quarters: ["full", "full", "partial", "partial"] },
      { workstream: "Grow International Customer Base", quarters: ["light", "partial", "full", "full"] },
      { workstream: "Platform Strengthening (Multi-Market)", quarters: ["partial", "full", "full", "full"] },
    ],
  },
];

const getBarColor = (level: "full" | "partial" | "light" | "none", yearIndex: number) => {
  const colorSchemes = [
    { full: "bg-purple-600", partial: "bg-purple-400", light: "bg-purple-200" },
    { full: "bg-blue-600", partial: "bg-blue-400", light: "bg-blue-200" },
    { full: "bg-green-600", partial: "bg-green-400", light: "bg-green-200" },
  ];
  
  const scheme = colorSchemes[yearIndex % colorSchemes.length];
  if (level === "none") return "bg-transparent";
  return scheme[level];
};

const getBarWidth = (level: "full" | "partial" | "light" | "none") => {
  switch (level) {
    case "full": return "w-full";
    case "partial": return "w-2/3";
    case "light": return "w-1/3";
    case "none": return "w-0";
  }
};

export const GanttChartVisual: React.FC = () => {
  return (
    <div className="w-full space-y-8">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
        <span className="font-medium text-foreground">Legend:</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 bg-purple-600 rounded-sm"></div>
          <span className="text-muted-foreground">Active (Full)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-400 rounded-sm"></div>
          <span className="text-muted-foreground">Active (Partial)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-purple-200 rounded-sm"></div>
          <span className="text-muted-foreground">Planned/Light</span>
        </div>
      </div>

      {ganttData.map((yearSection, yearIndex) => (
        <div key={yearSection.year} className="bg-background border border-border rounded-lg overflow-hidden">
          {/* Year Header */}
          <div className={`px-4 py-3 ${
            yearIndex === 0 ? "bg-purple-50 dark:bg-purple-950/30" :
            yearIndex === 1 ? "bg-blue-50 dark:bg-blue-950/30" :
            "bg-green-50 dark:bg-green-950/30"
          }`}>
            <h3 className="text-lg font-semibold text-foreground">
              {yearSection.year} — {yearSection.title}
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2 text-sm font-medium text-muted-foreground w-[45%]">
                    Workstream
                  </th>
                  <th className="text-center px-2 py-2 text-sm font-medium text-muted-foreground w-[13.75%]">
                    Q1 {yearSection.year}
                  </th>
                  <th className="text-center px-2 py-2 text-sm font-medium text-muted-foreground w-[13.75%]">
                    Q2 {yearSection.year}
                  </th>
                  <th className="text-center px-2 py-2 text-sm font-medium text-muted-foreground w-[13.75%]">
                    Q3 {yearSection.year}
                  </th>
                  <th className="text-center px-2 py-2 text-sm font-medium text-muted-foreground w-[13.75%]">
                    Q4 {yearSection.year}
                  </th>
                </tr>
              </thead>
              <tbody>
                {yearSection.rows.map((row, rowIndex) => (
                  <tr 
                    key={row.workstream} 
                    className={`border-b border-border/50 last:border-b-0 ${
                      rowIndex % 2 === 0 ? "bg-background" : "bg-muted/10"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-foreground font-medium">
                      {row.workstream}
                    </td>
                    {row.quarters.map((level, qIndex) => (
                      <td key={qIndex} className="px-2 py-3">
                        <div className="flex justify-center">
                          <div className="w-full max-w-[80px] h-6 bg-muted/20 rounded-sm overflow-hidden flex items-center">
                            <div 
                              className={`h-full ${getBarWidth(level)} ${getBarColor(level, yearIndex)} rounded-sm transition-all duration-300`}
                            ></div>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
