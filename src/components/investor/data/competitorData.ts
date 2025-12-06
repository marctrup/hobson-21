// Single source of truth for competitor analysis data
// Used by both CompetitorAnalysisMatrix UI component and PDF generation

export interface CompetitorInfo {
  competitor: string;
  whoTheyAre: string;
  whatTheyDo: string;
  strengths: string;
  weaknesses: string;
  reviews: string[];
  marketValue: string;
}

export const competitorData: CompetitorInfo[] = [
  {
    competitor: "Hobson AI",
    whoTheyAre: "AI document-intelligence assistant",
    whatTheyDo: "Reads + answers from leases, deeds, notices",
    strengths: "Transparent, low-friction, clarity-driven",
    weaknesses: "Early-stage awareness, still scaling support",
    reviews: ["Fast", "Clear", "Helpful", "Accurate", "Excited for roadmap"],
    marketValue: "Early-stage (high-growth market)",
  },
  {
    competitor: "EliseAI",
    whoTheyAre: "AI leasing automation",
    whatTheyDo: "Tenant comms + leasing workflows",
    strengths: "Strong ROI, big adoption",
    weaknesses: "No doc-intel, expensive",
    reviews: ["Great automation", "Pricey", "Not for CRE", "Case-study heavy", "Useful"],
    marketValue: "~$500M+",
  },
  {
    competitor: "StanAI",
    whoTheyAre: "CRE underwriting AI",
    whatTheyDo: "Deal docs + financial extraction",
    strengths: "Great for analysts",
    weaknesses: "Narrow use-case",
    reviews: ["Accurate", "Niche", "Premium", "Fast", "Complex"],
    marketValue: "Undisclosed",
  },
  {
    competitor: "Kendal AI",
    whoTheyAre: "Tenant messaging automation",
    whatTheyDo: "Handles tenant queries",
    strengths: "Simple, cheap",
    weaknesses: "No doc capability",
    reviews: ["Time saver", "Simple", "Not CRE", "Affordable", "Useful"],
    marketValue: "Undisclosed",
  },
  {
    competitor: "Trudi",
    whoTheyAre: "SME leasing AI",
    whatTheyDo: "FAQs + simple automation",
    strengths: "Easy UI, onboarding",
    weaknesses: "Light document skills",
    reviews: ["Helpful", "Easy", "Not deep", "Good support", "SMB fit"],
    marketValue: "Undisclosed",
  },
  {
    competitor: "Legacy PropTech",
    whoTheyAre: "Yardi/MRI/AppFolio",
    whatTheyDo: "Full PM systems",
    strengths: "Robust, trusted",
    weaknesses: "Weak AI, slow, expensive",
    reviews: ["Complex", "Manual docs", "Long onboarding", "Stable", "Slow support"],
    marketValue: "$4–10B+",
  },
];

// Helper function to generate PDF content from competitor data
export const getCompetitorPdfContent = (): string[] => {
  const content: string[] = ["Competitor Analysis:", ""];
  
  competitorData.forEach((competitor) => {
    content.push(`${competitor.competitor}:`);
    content.push(`• Who They Are: ${competitor.whoTheyAre}`);
    content.push(`• What They Do: ${competitor.whatTheyDo}`);
    content.push(`• Strengths: ${competitor.strengths}`);
    content.push(`• Weaknesses: ${competitor.weaknesses}`);
    content.push(`• Reviews: ${competitor.reviews.map(r => `"${r}"`).join(", ")}`);
    content.push(`• Market Value: ${competitor.marketValue}`);
    content.push("");
  });
  
  return content;
};
