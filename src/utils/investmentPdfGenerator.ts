/**
 * Investment PDF Generator
 * 
 * Architecture:
 * - One function per card type
 * - Each function receives the card's tabs as input
 * - Output is the PDF generated directly from the tab data
 * - This guarantees PDF content matches UI content exactly
 * 
 * IMPORTANT: All PDF content is sourced from pdfContentProviders.ts
 * to ensure single source of truth. When data is edited, tabs are added,
 * or new data is created, update pdfContentProviders.ts and the changes
 * will automatically propagate to PDF generation.
 */

import { jsPDF } from "jspdf";
import { getPdfContentForComponent } from "@/components/investor/data/pdfContentProviders";
import { competitorData } from "@/components/investor/data/competitorData";

// PDF Configuration - Colors matched to design system (index.css)
// Primary: HSL 269 91% 52% = RGB 124, 58, 237 (#7c3aed)
// Primary Light: HSL 269 75% 65% = RGB 168, 113, 246 (#a871f6)
// Background: HSL 0 0% 100% = RGB 255, 255, 255
// Foreground: HSL 222.2 84% 4.9% = RGB 9, 9, 25 (~dark)
// Muted: HSL 210 40% 96.1% = RGB 241, 245, 249 (#f1f5f9)
// Border: HSL 214.3 31.8% 91.4% = RGB 226, 232, 240 (#e2e8f0)
const PDF_CONFIG = {
  margin: 20,
  primaryColor: [124, 58, 237] as [number, number, number],       // hsl(269 91% 52%) - brand purple
  primaryLight: [168, 113, 246] as [number, number, number],      // hsl(269 75% 65%) - lighter purple
  primaryBg: [240, 235, 255] as [number, number, number],         // Very light purple for Hobson row
  primaryBgLight: [250, 245, 255] as [number, number, number],    // from-primary/5 - very subtle purple
  primaryBgMedium: [245, 238, 255] as [number, number, number],   // via-primary/10 - subtle purple
  textDark: [9, 9, 25] as [number, number, number],               // hsl(222.2 84% 4.9%) - foreground
  textGray: [100, 116, 139] as [number, number, number],          // hsl(215.4 16.3% 46.9%) - muted-foreground
  textLight: [148, 163, 184] as [number, number, number],         // lighter muted
  bgLight: [241, 245, 249] as [number, number, number],           // hsl(210 40% 96.1%) - muted bg
  bgWhite: [255, 255, 255] as [number, number, number],           // white
  border: [226, 232, 240] as [number, number, number],            // hsl(214.3 31.8% 91.4%) - border color
  headerBg: [245, 243, 255] as [number, number, number],          // primary/10 - light purple header
  // Emerald colors for market section
  emerald: [5, 150, 105] as [number, number, number],             // emerald-600
  emeraldLight: [16, 185, 129] as [number, number, number],       // emerald-500
  emeraldBg: [236, 253, 245] as [number, number, number],         // emerald-50
  emeraldBgLight: [240, 253, 248] as [number, number, number],    // from-emerald-50
  emeraldBorder: [167, 243, 208] as [number, number, number],     // emerald-200/50
  // Blue colors for traction section
  blue: [37, 99, 235] as [number, number, number],                // blue-600
  blueBg: [239, 246, 255] as [number, number, number],            // blue-50/50
  blueBorder: [219, 234, 254] as [number, number, number],        // blue-100
  // Rose colors for brand section
  rose: [225, 29, 72] as [number, number, number],                // rose-600
  roseBg: [255, 241, 242] as [number, number, number],            // rose-50
  roseBorder: [254, 205, 211] as [number, number, number],        // rose-200
  // Amber colors for business section
  amber: [217, 119, 6] as [number, number, number],               // amber-600
  amberBg: [255, 251, 235] as [number, number, number],           // amber-50
  amberBorder: [253, 230, 138] as [number, number, number],       // amber-200
};

// Types for tab/page content
export interface ContentSection {
  title: string;
  subtitle?: string;
  items?: string[];
  conclusion?: string;
  teamMembers?: TeamMember[];
}

export interface TeamMember {
  name: string;
  role: string;
  linkedin?: string;
}

export interface TabContent {
  overview?: string;
  sections: ContentSection[];
}

export interface Tab {
  title: string;
  content: TabContent;
  showCustomVisual?: boolean;
  customVisualComponent?: string;
  image?: string;
  pdfImage?: string;
  imageAlt?: string;
}

export interface CardSection {
  id: string;
  title: string;
  subtitle: string;
  pages: Tab[];
}

/**
 * Remove emojis and fix special characters for PDF compatibility
 */
const sanitizeText = (text: string): string => {
  return text
    .replace(/⭐/g, "")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/✓/g, "-")
    .replace(/✔/g, "-")
    .replace(/✗/g, "x")
    .replace(/✘/g, "x")
    .replace(/•/g, "-")
    .replace(/⦁/g, "-")
    .replace(/≈/g, "~")
    .replace(/×/g, "x")
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/…/g, "...")
    .replace(/£/g, "GBP ")
    .replace(/[\u{2B50}]/gu, "")
    .replace(/[\u{1F000}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "")
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F700}-\u{1F77F}]/gu, "")
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, "")
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, "")
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "")
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "")
    .replace(/[\u{200D}]/gu, "")
    .trim()
    .replace(/\s+/g, " ");
};

/**
 * Get custom visual content for PDF rendering
 * 
 * ARCHITECTURE: This function delegates to pdfContentProviders.ts
 * which is the single source of truth for all PDF content.
 * 
 * To add new content:
 * 1. Add a new content provider function in pdfContentProviders.ts
 * 2. Add it to the pdfContentMap in that file
 * 3. The content will automatically be available here
 */
const getCustomVisualContent = (componentType: string): string[] => {
  const content = getPdfContentForComponent(componentType);
  return content || [];
};

/**
 * Render competitor analysis as a proper table
 */
const renderCompetitorTable = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  
  // Table title - matches on-screen text-xl font-bold text-foreground
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Competitor Analysis", margin, yPosition);
  yPosition += 12;
  
  // Column configuration - includes Reviews column to match on-screen
  const colWidths = [22, 26, 30, 24, 24, 30, 20]; // 7 columns
  const headers = ["Competitor", "Who They Are", "What They Do", "Strengths", "Weaknesses", "Representative Reviews", "Market Value"];
  
  // Header row - matches bg-primary/10 (light purple background)
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 10, "F");
  
  // Header border - matches border-border
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.rect(margin, yPosition, maxWidth, 10, "S");
  
  // Header text - matches font-semibold text-foreground
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  
  let xPos = margin + 2;
  headers.forEach((header, i) => {
    const headerLines = doc.splitTextToSize(header, colWidths[i] - 3);
    doc.text(headerLines, xPos, yPosition + 4);
    xPos += colWidths[i];
  });
  yPosition += 10;
  
  // Data rows
  doc.setFont("helvetica", "normal");
  
  competitorData.forEach((competitor, rowIndex) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
      
      // Re-render header on new page
      doc.setFillColor(...PDF_CONFIG.headerBg);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
      doc.setDrawColor(...PDF_CONFIG.border);
      doc.rect(margin, yPosition, maxWidth, 10, "S");
      
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      
      xPos = margin + 2;
      headers.forEach((header, i) => {
        const headerLines = doc.splitTextToSize(header, colWidths[i] - 3);
        doc.text(headerLines, xPos, yPosition + 4);
        xPos += colWidths[i];
      });
      yPosition += 10;
      doc.setFont("helvetica", "normal");
    }
    
    const rowHeight = 18;
    const isHobson = competitor.competitor === "Hobson AI";
    
    // Alternating row background - matches on-screen bg-background / bg-muted/30
    if (isHobson) {
      // Special highlight for Hobson row
      doc.setFillColor(...PDF_CONFIG.primaryBg);
    } else if (rowIndex % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgWhite);
    } else {
      doc.setFillColor(...PDF_CONFIG.bgLight);
    }
    doc.rect(margin, yPosition, maxWidth, rowHeight, "F");
    
    // Draw cell borders - matches border-border
    doc.setDrawColor(...PDF_CONFIG.border);
    doc.rect(margin, yPosition, maxWidth, rowHeight, "S");
    
    // Draw vertical cell dividers
    xPos = margin;
    colWidths.forEach((width) => {
      xPos += width;
      if (xPos < margin + maxWidth) {
        doc.line(xPos, yPosition, xPos, yPosition + rowHeight);
      }
    });
    
    // Cell content
    doc.setFontSize(5.5);
    xPos = margin + 2;
    const cellY = yPosition + 4;
    
    // Competitor name - matches font-semibold text-foreground
    doc.setFont("helvetica", "bold");
    if (isHobson) {
      doc.setTextColor(...PDF_CONFIG.primaryColor);
    } else {
      doc.setTextColor(...PDF_CONFIG.textDark);
    }
    const nameLines = doc.splitTextToSize(sanitizeText(competitor.competitor), colWidths[0] - 4);
    doc.text(nameLines, xPos, cellY);
    xPos += colWidths[0];
    
    // Reset to normal text - matches text-muted-foreground
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    
    // Who They Are
    const whoLines = doc.splitTextToSize(sanitizeText(competitor.whoTheyAre), colWidths[1] - 4);
    doc.text(whoLines, xPos, cellY);
    xPos += colWidths[1];
    
    // What They Do
    const whatLines = doc.splitTextToSize(sanitizeText(competitor.whatTheyDo), colWidths[2] - 4);
    doc.text(whatLines, xPos, cellY);
    xPos += colWidths[2];
    
    // Strengths
    const strengthLines = doc.splitTextToSize(sanitizeText(competitor.strengths), colWidths[3] - 4);
    doc.text(strengthLines, xPos, cellY);
    xPos += colWidths[3];
    
    // Weaknesses
    const weaknessLines = doc.splitTextToSize(sanitizeText(competitor.weaknesses), colWidths[4] - 4);
    doc.text(weaknessLines, xPos, cellY);
    xPos += colWidths[4];
    
    // Reviews - format as comma-separated quoted strings
    const reviewsText = competitor.reviews.map(r => `"${r}"`).join(", ");
    const reviewLines = doc.splitTextToSize(sanitizeText(reviewsText), colWidths[5] - 4);
    doc.text(reviewLines, xPos, cellY);
    xPos += colWidths[5];
    
    // Market Value - matches text-foreground font-medium
    doc.setTextColor(...PDF_CONFIG.textDark);
    const valueLines = doc.splitTextToSize(sanitizeText(competitor.marketValue), colWidths[6] - 4);
    doc.text(valueLines, xPos, cellY);
    
    yPosition += rowHeight;
  });
  
  return yPosition + 10;
};

/**
 * Render Executive Summary with visual styling matching on-screen component
 * Replicates: Hero card (purple gradient), Addressable Market (emerald cards), Traction (blue cards)
 */
const renderExecutiveSummary = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // ===== HERO STATEMENT SECTION =====
  // Matches: bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl
  const heroHeight = 70;
  
  // Draw gradient background (simulate with solid light purple)
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, heroHeight, 4, 4, "F");
  
  // Draw border
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPosition, maxWidth, heroHeight, 4, 4, "S");
  
  // Brain icon - simple filled rounded square with purple color
  const iconSize = 12;
  const iconX = margin + 8;
  const iconY = yPosition + 8;
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.roundedRect(iconX, iconY, iconSize, iconSize, 2, 2, "F");
  
  // Title: Hobson AI (positioned after icon)
  const textStartX = iconX + iconSize + 6;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Hobson AI", textStartX, iconY + 5);
  
  // Subtitle: Specialised AI for Real Estate
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Specialised AI for Real Estate", textStartX, iconY + 12);
  
  // Main description text
  const descY = iconY + iconSize + 10;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Render as single wrapped paragraph (simplified - no inline highlights for PDF)
  const fullDesc = "Turning complex documents and decisions into clear, reliable insight. Zero onboarding. Trusted accuracy from day one. Continuous learning that shifts from basic automation to proactive support - unlocking major efficiency gains across the entire property lifecycle.";
  const descLines = doc.splitTextToSize(fullDesc, maxWidth - 16);
  doc.text(descLines, margin + 8, descY);
  
  yPosition += heroHeight + 12;

  // ===== ADDRESSABLE MARKET SECTION =====
  // Check for page break
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }
  
  // Section header with globe icon (small filled circle)
  const globeIconX = margin;
  const globeIconY = yPosition - 3;
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(globeIconX + 3, globeIconY, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Addressable Market", margin + 10, yPosition);
  yPosition += 5;
  
  // Subtitle
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Annual Efficiency Savings", margin + 2, yPosition);
  yPosition += 10;
  
  // Three market cards - matches: bg-gradient-to-b from-emerald-50 to-emerald-100/50 border border-emerald-200/50 rounded-xl
  const cardWidth = (maxWidth - 10) / 3;
  const cardHeight = 40;
  const cardSpacing = 5;
  
  const marketData = [
    { value: "GBP 1.41B", label: "UK Savings" },
    { value: "GBP 15.5B", label: "European Savings" },
    { value: "GBP 155.6B", label: "Global Savings" },
  ];
  
  marketData.forEach((data, idx) => {
    const cardX = margin + idx * (cardWidth + cardSpacing);
    
    // Card background - emerald gradient
    doc.setFillColor(...PDF_CONFIG.emeraldBg);
    doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 3, 3, "F");
    
    // Card border
    doc.setDrawColor(...PDF_CONFIG.emeraldBorder);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 3, 3, "S");
    
    // Value - large emerald text centered
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(data.value, cardX + cardWidth / 2, yPosition + 18, { align: "center" });
    
    // Label - muted text centered
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(data.label, cardX + cardWidth / 2, yPosition + 30, { align: "center" });
  });
  
  yPosition += cardHeight + 8;
  
  // Market description text
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const marketDesc = "Real estate professionals lose 20% of admin time to document chaos. These figures represent the annual savings Hobson can unlock - and the opportunity we're built to capture.";
  const marketDescLines = doc.splitTextToSize(sanitizeText(marketDesc), maxWidth);
  doc.text(marketDescLines, margin, yPosition);
  yPosition += marketDescLines.length * 5 + 12;

  // ===== TRACTION & MILESTONES SECTION =====
  // Check for page break
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = margin;
  }
  
  // Section header with rocket icon (small filled circle)
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 3, yPosition - 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Traction & Milestones", margin + 10, yPosition);
  yPosition += 10;
  
  // Traction cards in 2x2 grid - matches: bg-blue-50/50 border border-blue-100 rounded-lg
  const tractionCardWidth = (maxWidth - 8) / 2;
  const tractionCardHeight = 28;
  const tractionSpacing = 4;
  
  const tractionData = [
    { title: "MVP Launch Q1 2026", subtitle: "Validated with 4 real-world partners" },
    { title: "98% Model Accuracy", subtitle: "Tested on real industry data" },
    { title: "Multi-Document Support", subtitle: "Legal, compliance, operational reports" },
    { title: "Domain-Trained AI", subtitle: "Built for reliability and depth" },
  ];
  
  tractionData.forEach((data, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + col * (tractionCardWidth + tractionSpacing);
    const cardY = yPosition + row * (tractionCardHeight + tractionSpacing);
    
    // Card background - blue
    doc.setFillColor(...PDF_CONFIG.blueBg);
    doc.roundedRect(cardX, cardY, tractionCardWidth, tractionCardHeight, 2, 2, "F");
    
    // Card border
    doc.setDrawColor(...PDF_CONFIG.blueBorder);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, cardY, tractionCardWidth, tractionCardHeight, 2, 2, "S");
    
    // Icon - simple filled circle (no text inside)
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(cardX + 8, cardY + 12, 3, "F");
    
    // Title (positioned after icon)
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(data.title, cardX + 16, cardY + 10);
    
    // Subtitle
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(data.subtitle, cardX + 16, cardY + 18);
  });
  
  yPosition += 2 * (tractionCardHeight + tractionSpacing) + 10;

  return yPosition;
};

/**
 * Render Why Now visual with styling matching on-screen component
 * Replicates: 5 numbered sections with purple cards, convergence footer
 */
const renderWhyNow = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Header
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Why Now?", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 6;
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("The Perfect Moment for AI Clarity in Real Estate", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  const sections = [
    {
      number: "1",
      title: "Technology Has Finally Caught Up",
      intro: "For years, real estate workflows were too messy for past-generation technology. Today:",
      bullets: [
        "LLMs with the right layer deliver production-grade accuracy",
        "Document intelligence hits 95%+ extraction quality",
        "Infrastructure costs have fallen 10x in three years",
      ],
      conclusion: "The technology to solve document problems properly didn't exist until now.",
    },
    {
      number: "2",
      title: "The Industry Is Ready for Efficiency",
      intro: "Real estate operators have never been under this much pressure:",
      bullets: [
        "65% of businesses plan to increase AI spend (Deloitte)",
        "COVID forced digital maturity a decade early",
        "Talent shortages make manual processes unsustainable",
      ],
      conclusion: "The market isn't experimenting with AI anymore - it's actively shopping for it.",
    },
    {
      number: "3",
      title: "Massive Competitive White Space",
      intro: "Despite the size of the opportunity:",
      bullets: [
        "No AI-native leader exists in document intelligence for real estate",
        "Legacy PropTech is too slow and too integrated",
        "A 12-18 month window exists to become the category standard",
      ],
      conclusion: "This is one of the last major AI verticals without a clear winner.",
    },
    {
      number: "4",
      title: "Regulation Making Documents More Complex",
      intro: "Real estate compliance is exploding:",
      bullets: [
        "New transparency and audit trail requirements",
        "ESG reporting requires document-linked evidence",
        "Data residency rules favour UK/EU-based AI solutions",
      ],
      conclusion: "More rules -> more documents -> more need for automation.",
    },
    {
      number: "5",
      title: "Economics Forcing Waste Removal",
      intro: "Margins are compressing across the industry:",
      bullets: [
        "Operational costs rising, headcount limits",
        "Labour inflation making manual work unaffordable",
        "AI delivers ~GBP 6,000 per role per year in savings",
      ],
      conclusion: "When budgets tighten, tools that eliminate waste get adopted fastest.",
    },
  ];

  sections.forEach((section) => {
    // Check for page break
    if (yPosition > pageHeight - 70) {
      doc.addPage();
      yPosition = margin;
    }

    // Section card background
    const cardHeight = 52;
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "S");

    // Number badge (filled circle only - no text)
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 8, yPosition + 10, 5, "F");

    // Title
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin + 18, yPosition + 10);

    // Intro
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(section.intro, margin + 18, yPosition + 18);

    // Bullets
    let bulletY = yPosition + 25;
    section.bullets.forEach((bullet) => {
      doc.setFillColor(...PDF_CONFIG.primaryLight);
      doc.circle(margin + 20, bulletY - 1, 1, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFontSize(7);
      doc.text(bullet, margin + 24, bulletY);
      bulletY += 5;
    });

    // Conclusion (left border accent)
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(margin + 4, yPosition + 42, 2, 8, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    const conclusionLines = doc.splitTextToSize(section.conclusion, maxWidth - 20);
    doc.text(conclusionLines, margin + 10, yPosition + 47);

    yPosition += cardHeight + 6;
  });

  // Convergence section
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  // Convergence background
  const convergenceHeight = 45;
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, convergenceHeight, 4, 4, "F");

  // Header
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(pageWidth / 2 - 30, yPosition + 10, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("The Convergence", pageWidth / 2, yPosition + 12, { align: "center" });

  // Points as pills
  const points = ["Technology ready", "Market ready", "Competition absent", "Regulation rising", "Economics demand efficiency"];
  const pillY = yPosition + 22;
  let pillX = margin + 8;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  points.forEach((point) => {
    const textWidth = doc.getTextWidth(point) + 8;
    doc.setFillColor(...PDF_CONFIG.primaryBg);
    doc.roundedRect(pillX, pillY - 4, textWidth, 8, 2, 2, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.text(point, pillX + 4, pillY + 1);
    pillX += textWidth + 4;
  });

  // Closing statement
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("'documents everywhere' -> 'answers instantly.' Hobson leads this shift.", pageWidth / 2, yPosition + 38, { align: "center" });

  yPosition += convergenceHeight + 10;
  return yPosition;
};

/**
 * Render Strategic Approach visual with styling matching on-screen component
 * Replicates: Intro card, 3 numbered pillars (Product/Brand/Business), Why We Raise section
 */
const renderStrategicApproach = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // ===== INTRO SECTION =====
  const introHeight = 45;
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, 4, 4, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, 4, 4, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Our Strategic Approach", margin + 8, yPosition + 10);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const introText = "Hobson combines AI innovation with deep real estate experience to create a platform that feels familiar, works instantly, and delivers clarity without disruption.";
  const introLines = doc.splitTextToSize(introText, maxWidth - 16);
  doc.text(introLines, margin + 8, yPosition + 18);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8);
  const pillarsText = "Built around three pillars: Product, Brand, and Business Model - aligned toward a 2027 commercial launch, funded by a 2026 seed round.";
  const pillarsLines = doc.splitTextToSize(pillarsText, maxWidth - 16);
  doc.text(pillarsLines, margin + 8, yPosition + 35);

  yPosition += introHeight + 10;

  // ===== PILLAR 1: PRODUCT =====
  if (yPosition > pageHeight - 70) {
    doc.addPage();
    yPosition = margin;
  }

  // Number badge (filled circle only - no text)
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 6, yPosition + 4, 5, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(11);
  doc.text("Product Approach", margin + 16, yPosition + 5);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Built for the way real estate actually works", margin + 16, yPosition + 11);
  yPosition += 16;

  const productItems = [
    "Unifies scattered information across documents, emails, and systems",
    "Simple interface with zero learning curve",
    "Works alongside existing workflows - no disruption",
    "Designed to earn trust: citations, transparency, no hallucinations",
    "Becomes more helpful over time - proactive support",
  ];

  productItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + 10, yPosition, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(8);
    doc.text(item, margin + 16, yPosition + 1);
    yPosition += 6;
  });

  // Goal box
  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, 10, 2, 2, "F");
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 14, yPosition + 5, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Goal: A clarity engine that feels like part of the team on day one.", margin + 20, yPosition + 6);
  yPosition += 16;

  // ===== PILLAR 2: BRAND =====
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  // Number badge (filled circle only - no text)
  doc.setFillColor(...PDF_CONFIG.rose);
  doc.circle(margin + 6, yPosition + 4, 5, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(11);
  doc.text("Brand Approach", margin + 16, yPosition + 5);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Human, helpful, and honest", margin + 16, yPosition + 11);
  yPosition += 16;

  const brandItems = [
    { label: "Personalisation", desc: "Adapts to context and role" },
    { label: "Integrity", desc: "Transparent, visible sources" },
    { label: "Expectations", desc: "Essentials first, then expand" },
    { label: "Resolution", desc: "Act on feedback quickly" },
    { label: "Time & Effort", desc: "Every interaction effortless" },
    { label: "Empathy", desc: "Built for real-world pressure" },
  ];

  // 3x2 grid of brand cards
  const brandCardWidth = (maxWidth - 20) / 3;
  const brandCardHeight = 18;
  brandItems.forEach((item, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const cardX = margin + 8 + col * (brandCardWidth + 4);
    const cardY = yPosition + row * (brandCardHeight + 4);

    doc.setFillColor(...PDF_CONFIG.roseBg);
    doc.roundedRect(cardX, cardY, brandCardWidth, brandCardHeight, 2, 2, "F");
    doc.setDrawColor(...PDF_CONFIG.roseBorder);
    doc.setLineWidth(0.2);
    doc.roundedRect(cardX, cardY, brandCardWidth, brandCardHeight, 2, 2, "S");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, cardX + 3, cardY + 6);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(item.desc, cardX + 3, cardY + 12);
  });
  yPosition += 2 * (brandCardHeight + 4) + 6;

  // Goal box
  doc.setFillColor(...PDF_CONFIG.roseBg);
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, 10, 2, 2, "F");
  doc.setFillColor(...PDF_CONFIG.rose);
  doc.circle(margin + 14, yPosition + 5, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Goal: A brand that embodies Innovation without disruption.", margin + 20, yPosition + 6);
  yPosition += 16;

  // ===== PILLAR 3: BUSINESS =====
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = margin;
  }

  // Number badge (filled circle only - no text)
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 6, yPosition + 4, 5, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(11);
  doc.text("Business Approach", margin + 16, yPosition + 5);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Built for mass adoption and rapid scaling", margin + 16, yPosition + 11);
  yPosition += 16;

  // No fees cards (3 emerald cards)
  const noFeeItems = ["No licence fees", "No per-user fees", "No per-asset fees"];
  const noFeeCardWidth = (maxWidth - 20) / 3;
  noFeeItems.forEach((item, idx) => {
    const cardX = margin + 8 + idx * (noFeeCardWidth + 4);
    doc.setFillColor(...PDF_CONFIG.emeraldBg);
    doc.roundedRect(cardX, yPosition, noFeeCardWidth, 16, 2, 2, "F");
    doc.setDrawColor(...PDF_CONFIG.emeraldBorder);
    doc.setLineWidth(0.2);
    doc.roundedRect(cardX, yPosition, noFeeCardWidth, 16, 2, 2, "S");

    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(cardX + noFeeCardWidth / 2, yPosition + 5, 2, "F");
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(item, cardX + noFeeCardWidth / 2, yPosition + 12, { align: "center" });
  });
  yPosition += 22;

  // Business model cards (2x2 amber cards)
  const bizItems = [
    { label: "Usage-Based Pricing", desc: "Pay via HEUs - only for what you use" },
    { label: "Full Transparency", desc: "See exactly what Hobson did and why" },
    { label: "Low Base Cost", desc: "Frictionless entry for any business size" },
    { label: "Flexible Billing", desc: "Enables high-volume market capture" },
  ];
  const bizCardWidth = (maxWidth - 16) / 2;
  const bizCardHeight = 18;
  bizItems.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + 8 + col * (bizCardWidth + 4);
    const cardY = yPosition + row * (bizCardHeight + 4);

    doc.setFillColor(...PDF_CONFIG.amberBg);
    doc.roundedRect(cardX, cardY, bizCardWidth, bizCardHeight, 2, 2, "F");
    doc.setDrawColor(...PDF_CONFIG.amberBorder);
    doc.setLineWidth(0.2);
    doc.roundedRect(cardX, cardY, bizCardWidth, bizCardHeight, 2, 2, "S");

    doc.setFillColor(...PDF_CONFIG.amber);
    doc.circle(cardX + 6, cardY + 5, 2, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, cardX + 12, cardY + 6);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(item.desc, cardX + 12, cardY + 12);
  });
  yPosition += 2 * (bizCardHeight + 4) + 6;

  // Goal box
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, 10, 2, 2, "F");
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 14, yPosition + 5, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Goal: Category-defining AI document intelligence layer.", margin + 20, yPosition + 6);
  yPosition += 16;

  // ===== WHY WE RAISE IN 2026 =====
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  // Rocket badge
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 6, yPosition + 4, 5, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Why We Raise in 2026", margin + 16, yPosition + 6);
  yPosition += 14;

  // Raise box
  const raiseHeight = 45;
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, raiseHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, raiseHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("To deliver a 2027 commercial launch, we need to complete:", margin + 12, yPosition + 8);

  const raiseItems = ["Full production platform", "AI scaling", "Stability, QA, security", "Core hiring", "GTM development", "Pilot conversion"];
  let raiseX = margin + 12;
  let raiseY = yPosition + 16;
  raiseItems.forEach((item, idx) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(raiseX + 2, raiseY, 1, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(7);
    doc.text(item, raiseX + 6, raiseY + 1);
    if (idx === 2) {
      raiseX = margin + 12;
      raiseY += 7;
    } else {
      raiseX += 52;
    }
  });

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("We raise in 2026 to ensure everything is in place before revenue begins in 2027.", margin + 12, yPosition + 38);

  yPosition += raiseHeight + 10;
  return yPosition;
};

/**
 * Render Customer Segmentation visual
 */
const renderCustomerSegmentation = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Header
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Who We Serve", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 6;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const introLines = doc.splitTextToSize(
    "Hobson is designed to meet the needs of real estate professionals across all operator sizes—each with distinct challenges, but a shared need for clarity.",
    maxWidth - 20
  );
  doc.text(introLines, pageWidth / 2, yPosition, { align: "center" });
  yPosition += introLines.length * 5 + 10;

  const segments = [
    {
      title: "Large Operators",
      employees: "50–250 employees",
      color: PDF_CONFIG.blue,
      bgColor: [239, 246, 255] as [number, number, number],
      challenge: "High-admin organisations struggling with scattered data and slow information retrieval",
      need: "Automation and accuracy at scale",
    },
    {
      title: "Medium Operators",
      employees: "10–49 employees",
      color: PDF_CONFIG.primaryColor,
      bgColor: PDF_CONFIG.primaryBgLight,
      challenge: "Agile teams overwhelmed by inboxes and shared drives",
      need: "Efficient, low-overhead tools that eliminate manual searching",
    },
    {
      title: "Small Operators",
      employees: "1–9 employees",
      color: PDF_CONFIG.emerald,
      bgColor: [236, 253, 245] as [number, number, number],
      challenge: "Time-poor owner-operators with no time for complex tools",
      need: "Simple, low-cost assistant that works instantly without onboarding",
    },
  ];

  segments.forEach((segment) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    const cardHeight = 42;
    doc.setFillColor(...segment.bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");

    // Icon circle (no text inside)
    doc.setFillColor(...segment.color);
    doc.circle(margin + 10, yPosition + 12, 5, "F");

    // Title & employees
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(segment.title, margin + 20, yPosition + 10);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`(${segment.employees})`, margin + 20 + doc.getTextWidth(segment.title) + 4, yPosition + 10);

    // Challenge
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("CHALLENGE", margin + 8, yPosition + 22);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    const challengeLines = doc.splitTextToSize(segment.challenge, maxWidth / 2 - 15);
    doc.text(challengeLines, margin + 8, yPosition + 28);

    // Need
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("WHAT THEY NEED", margin + maxWidth / 2, yPosition + 22);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    const needLines = doc.splitTextToSize(segment.need, maxWidth / 2 - 15);
    doc.text(needLines, margin + maxWidth / 2, yPosition + 28);

    yPosition += cardHeight + 6;
  });

  // Footer insight
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 16, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("One platform, three experiences", margin + 8, yPosition + 10);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(" — Hobson adapts to the complexity and scale of each operator type.", margin + 8 + doc.getTextWidth("One platform, three experiences"), yPosition + 10);
  yPosition += 20;

  return yPosition;
};

/**
 * Render UK Market Assumptions visual
 */
const renderUKMarketAssumptions = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Header
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("UK Market Assumptions", margin, yPosition);
  yPosition += 5;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Evidence-based framework for market sizing", margin, yPosition);
  yPosition += 10;

  // Section 1: Market Size
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 30, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 6, yPosition + 8, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("1. Size of the UK Real Estate Business Market", margin + 12, yPosition + 9);
  
  doc.setFontSize(14);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("5.6M", margin + 8, yPosition + 22);
  doc.setFontSize(7);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("Total UK businesses", margin + 28, yPosition + 22);
  
  doc.setFontSize(14);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("235,200", margin + maxWidth / 2, yPosition + 22);
  doc.setFontSize(7);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("Real estate businesses (4.2%)", margin + maxWidth / 2 + 32, yPosition + 22);
  yPosition += 36;

  // Section 2: Business Size Breakdown
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 38, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 6, yPosition + 8, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("2. Business Size Breakdown (Real Estate Only)", margin + 12, yPosition + 9);
  
  const sizeData = [
    { size: "Small (1–9)", pct: "96%", count: "225,792" },
    { size: "Medium (10–49)", pct: "2.7%", count: "6,350" },
    { size: "Large (50–249)", pct: "0.6%", count: "1,411" },
    { size: "Enterprise (250+)", pct: "0.1%", count: "235" },
  ];
  let tableY = yPosition + 18;
  doc.setFontSize(7);
  sizeData.forEach((row) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(row.size, margin + 8, tableY);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(row.pct, margin + 60, tableY);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(row.count, margin + 85, tableY);
    tableY += 5;
  });
  yPosition += 44;

  // Section 3: AI Investment Readiness
  if (yPosition > pageHeight - 35) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 28, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 6, yPosition + 8, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("3. AI Investment Readiness", margin + 12, yPosition + 9);
  doc.setFontSize(18);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("65%", margin + 8, yPosition + 22);
  doc.setFontSize(8);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("of UK businesses are primed to invest in AI (Source: Deloitte)", margin + 28, yPosition + 22);
  yPosition += 34;

  // Section 4: Labour Cost
  if (yPosition > pageHeight - 35) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 28, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 6, yPosition + 8, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("4. Labour Cost Baseline", margin + 12, yPosition + 9);
  doc.setFontSize(18);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("£30,000", margin + 8, yPosition + 22);
  doc.setFontSize(8);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("Average junior real estate salary", margin + 42, yPosition + 22);
  yPosition += 34;

  // Section 5: Efficiency Gain
  if (yPosition > pageHeight - 35) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, 28, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 6, yPosition + 8, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("5. AI Efficiency Gain Assumption — 20%", margin + 12, yPosition + 9);
  doc.setFontSize(8);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("Based on Forbes, Morgan Stanley, and Drooms research on AI in real estate", margin + 8, yPosition + 20);
  yPosition += 34;

  // Section 6: Financial Impact
  if (yPosition > pageHeight - 30) { doc.addPage(); yPosition = margin; }
  const greenBg: [number, number, number] = [236, 253, 245];
  doc.setFillColor(...greenBg);
  doc.roundedRect(margin, yPosition, maxWidth, 24, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 6, yPosition + 8, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("6. Financial Impact: 20% efficiency gain =", margin + 12, yPosition + 9);
  doc.setFontSize(14);
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.text("£6,000", margin + 100, yPosition + 9);
  doc.setFontSize(8);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("annual saving per admin/document-handling role", margin + 8, yPosition + 18);
  yPosition += 30;

  return yPosition;
};

/**
 * Render UK Market Opportunity (TAM/SAM) visual
 */
const renderUKMarketOpportunity = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Header
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Market Opportunity", margin, yPosition);
  yPosition += 5;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Built Directly From Verified Assumptions", margin, yPosition);
  yPosition += 12;

  // TAM Box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 50, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Total Addressable Market (TAM)", margin + 8, yPosition + 10);
  doc.setFontSize(16);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("£1.41B", margin + maxWidth - 35, yPosition + 10);
  
  const tamItems = [
    "235,200 UK real estate businesses (5.6M total × 4.2%)",
    "£6,000 annual saving per business (20% efficiency on £30k salary)",
    "TAM = 235,200 × £6,000 = £1.41B",
  ];
  let itemY = yPosition + 20;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  tamItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryLight);
    doc.circle(margin + 12, itemY - 1, 1, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, margin + 16, itemY);
    itemY += 6;
  });
  yPosition += 56;

  // SAM Box
  if (yPosition > pageHeight - 55) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 50, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Serviceable Available Market (SAM)", margin + 8, yPosition + 10);
  doc.setFontSize(16);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("£917M", margin + maxWidth - 35, yPosition + 10);
  
  const samItems = [
    "65% adoption readiness (Deloitte, PwC, McKinsey)",
    "235,200 × 65% = 152,880 motivated businesses",
    "152,880 × £6,000 = £917M",
  ];
  itemY = yPosition + 20;
  samItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryLight);
    doc.circle(margin + 12, itemY - 1, 1, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, margin + 16, itemY);
    itemY += 6;
  });
  yPosition += 56;

  return yPosition;
};

/**
 * Render Global Market Assumptions visual
 */
const renderGlobalMarketAssumptions = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Header
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Global Market Assumptions", margin, yPosition);
  yPosition += 5;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Explosive Global Growth (Verified by Independent Reports)", margin, yPosition);
  yPosition += 12;

  const sections = [
    {
      num: "1",
      title: "AI in Real Estate Market Growth",
      source: "Business Research Company",
      stat1: "$222.65B → $303.06B",
      stat1Label: "Market growth 2024 to 2025",
      stat2: "36.1%",
      stat2Label: "CAGR",
    },
    {
      num: "2",
      title: "Long-Term Forecast to 2030",
      source: "Maximize Market Research",
      stat1: "$1.8T",
      stat1Label: "Global market by 2030",
      stat2: "35%",
      stat2Label: "Sustained CAGR",
    },
    {
      num: "3",
      title: "Proven Efficiency & Cost Gains",
      source: "McKinsey",
      stat1: "10%+",
      stat1Label: "Increase in net operating income",
      stat2: "",
      stat2Label: "",
    },
    {
      num: "4",
      title: "Real-World Adoption & Savings",
      source: "Forbes",
      stat1: "49%",
      stat1Label: "Report clear cost reductions",
      stat2: "Up to 20%",
      stat2Label: "Operational savings",
    },
  ];

  sections.forEach((section) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    const cardHeight = section.stat2 ? 32 : 28;
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");

    // Circle indicator (no number)
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 6, yPosition + 8, 3, "F");

    // Title
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${section.title} (${section.source})`, margin + 12, yPosition + 9);

    // Stats
    doc.setFontSize(12);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.text(section.stat1, margin + 8, yPosition + 22);
    doc.setFontSize(7);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(section.stat1Label, margin + 8 + doc.getTextWidth(section.stat1) + 4, yPosition + 22);

    if (section.stat2) {
      doc.setFontSize(12);
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.setFont("helvetica", "bold");
      doc.text(section.stat2, margin + maxWidth / 2, yPosition + 22);
      doc.setFontSize(7);
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFont("helvetica", "normal");
      doc.text(section.stat2Label, margin + maxWidth / 2 + doc.getTextWidth(section.stat2) + 4, yPosition + 22);
    }

    yPosition += cardHeight + 6;
  });

  // Why This Matters
  if (yPosition > pageHeight - 45) { doc.addPage(); yPosition = margin; }
  const greenBg: [number, number, number] = [236, 253, 245];
  doc.setFillColor(...greenBg);
  doc.roundedRect(margin, yPosition, maxWidth, 38, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 6, yPosition + 8, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Why This Matters for Hobson", margin + 12, yPosition + 9);
  
  const whyItems = [
    "AI efficiency gains are a global norm",
    "20% efficiency uplift validated by global data",
    "UK £1.41B sits inside multi-billion-dollar global market",
    "Adoption rising and ROI demonstrable",
  ];
  let whyY = yPosition + 18;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  whyItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 10, whyY - 1, 1, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, margin + 14, whyY);
    whyY += 5;
  });
  yPosition += 44;

  return yPosition;
};

/**
 * Render European & Global Opportunities visual
 */
const renderEuropeanGlobal = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const colWidth = (maxWidth - 10) / 2;

  // EUROPE Section
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Europe", margin, yPosition);
  doc.setFontSize(8);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("11× UK Population Multiple", margin + 35, yPosition);
  yPosition += 10;

  // Europe TAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, colWidth, 36, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("TAM", margin + 6, yPosition + 10);
  doc.setFontSize(14);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("£15.5B", margin + 6, yPosition + 22);
  doc.setFontSize(7);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("£1.41B × 11", margin + 6, yPosition + 30);

  // Europe SAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + colWidth + 10, yPosition, colWidth, 36, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("SAM", margin + colWidth + 16, yPosition + 10);
  doc.setFontSize(14);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("£10.1B", margin + colWidth + 16, yPosition + 22);
  doc.setFontSize(7);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("£15.5B × 65%", margin + colWidth + 16, yPosition + 30);
  yPosition += 44;

  // GLOBAL Section
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Global", margin, yPosition);
  doc.setFontSize(8);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("18× UK Population Multiple (OECD markets)", margin + 32, yPosition);
  yPosition += 10;

  // Global TAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, colWidth, 36, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("TAM", margin + 6, yPosition + 10);
  doc.setFontSize(14);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("£155.6B", margin + 6, yPosition + 22);
  doc.setFontSize(7);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("£1.41B × 118 (adjusted)", margin + 6, yPosition + 30);

  // Global SAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + colWidth + 10, yPosition, colWidth, 36, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("SAM", margin + colWidth + 16, yPosition + 10);
  doc.setFontSize(14);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("£101B", margin + colWidth + 16, yPosition + 22);
  doc.setFontSize(7);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("£155.6B × 65%", margin + colWidth + 16, yPosition + 30);
  yPosition += 44;

  // Summary
  if (yPosition > pageHeight - 25) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 18, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const summaryText = "Positions Hobson as an export-ready solution capable of adapting across geographies and regulatory contexts.";
  doc.text(summaryText, margin + 6, yPosition + 11);
  yPosition += 24;

  return yPosition;
};

/**
 * Create cover page for a section PDF
 */
const createCoverPage = (
  doc: jsPDF,
  title: string,
  subtitle: string
): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Purple background
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // HOBSON AI logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("HOBSON AI", pageWidth / 2, 80, { align: "center" });

  // Section title
  doc.setFontSize(32);
  const maxWidth = pageWidth - PDF_CONFIG.margin * 2;
  const titleLines = doc.splitTextToSize(title, maxWidth - 20);
  doc.text(titleLines, pageWidth / 2, 110, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  const subtitleLines = doc.splitTextToSize(subtitle, maxWidth - 20);
  doc.text(subtitleLines, pageWidth / 2, 140, { align: "center" });

  // Label
  doc.setFontSize(10);
  doc.text("Investment Opportunity Document", pageWidth / 2, 170, { align: "center" });

  // Date
  const currentDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(currentDate, pageWidth / 2, pageHeight - 20, { align: "center" });
};

/**
 * Render a tab's content to PDF
 */
const renderTabContent = (
  doc: jsPDF,
  tab: Tab,
  startY: number
): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PDF_CONFIG.margin;
  const maxWidth = pageWidth - margin * 2;
  let yPosition = startY;

  // Tab title
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const cleanedTitle = sanitizeText(tab.title);
  const titleLines = doc.splitTextToSize(cleanedTitle, maxWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 8 + 5;

  // Purple line under title
  doc.setDrawColor(...PDF_CONFIG.primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Handle image if present (either image or pdfImage)
  const imageToUse = tab.image || tab.pdfImage;
  if (imageToUse) {
    try {
      // AI Architecture gets its own handling for proper display
      if (tab.title === "AI Architecture") {
        // Architecture diagram - landscape aspect ratio (width > height)
        // The uploaded image is approximately 16:9 landscape format
        const naturalAspectRatio = 0.6; // height/width ratio (landscape)
        
        const imgWidth = maxWidth;
        const imgHeight = imgWidth * naturalAspectRatio;
        
        // Check if we need a new page
        if (yPosition + imgHeight > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.addImage(imageToUse, "JPEG", margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 15;
      } else if (tab.title === "Simple UI") {
        // Simple UI - portrait device mockup
        const aspectRatio = 0.8;
        const imgWidth = maxWidth * 0.7; // Slightly smaller
        const imgHeight = imgWidth * aspectRatio;
        
        if (yPosition + imgHeight > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Center horizontally
        const xOffset = margin + (maxWidth - imgWidth) / 2;
        doc.addImage(imageToUse, "PNG", xOffset, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } else if (tab.title === "P/L Growth" || tab.title === "Revenue Growth") {
        // Chart images - landscape aspect ratio for bar charts
        const aspectRatio = 0.625; // Approx 16:10 ratio for charts
        const imgWidth = maxWidth;
        const imgHeight = imgWidth * aspectRatio;
        
        if (yPosition + imgHeight > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        doc.addImage(imageToUse, "PNG", margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 15;
      } else {
        // Other images - default handling
        const aspectRatio = 0.6;
        const imgWidth = maxWidth;
        const imgHeight = imgWidth * aspectRatio;
        
        if (yPosition + imgHeight > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        doc.addImage(imageToUse, "PNG", margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }
    } catch (error) {
      console.error("Error adding image to PDF:", error);
    }
  }

  // Overview
  if (tab.content?.overview) {
    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const cleanedOverview = sanitizeText(tab.content.overview);
    const overviewLines = doc.splitTextToSize(cleanedOverview, maxWidth - 10);
    const boxHeight = overviewLines.length * 8 + 8;
    doc.rect(margin, yPosition, maxWidth, boxHeight, "F");
    doc.text(overviewLines, margin + 5, yPosition + 6, { lineHeightFactor: 1.4 });
    yPosition += boxHeight + 8;
  }

  // Custom visual content - when present, this REPLACES content.sections to avoid duplication
  const componentType = tab.customVisualComponent;
  const hasCustomVisual = tab.showCustomVisual && componentType;
  
  if (hasCustomVisual) {
    // Strategy & Approach renderers
    if (componentType === "competitorAnalysis") {
      yPosition = renderCompetitorTable(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "executiveSummary") {
      yPosition = renderExecutiveSummary(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "whyNow") {
      yPosition = renderWhyNow(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "approach") {
      yPosition = renderStrategicApproach(doc, yPosition, margin, pageWidth, pageHeight);
    } 
    // Customers & Market renderers
    else if (componentType === "customerSegmentation") {
      yPosition = renderCustomerSegmentation(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "ukMarketAssumptions") {
      yPosition = renderUKMarketAssumptions(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "ukMarket") {
      yPosition = renderUKMarketOpportunity(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "globalMarketAssumptions") {
      yPosition = renderGlobalMarketAssumptions(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "europeanGlobal") {
      yPosition = renderEuropeanGlobal(doc, yPosition, margin, pageWidth, pageHeight);
    } else {
      const customContent = getCustomVisualContent(componentType);
      if (customContent.length > 0) {
        doc.setTextColor(...PDF_CONFIG.textGray);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        customContent.forEach((line) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
          }

          const cleanLine = sanitizeText(line);
          if (cleanLine === "") {
            yPosition += 5;
          } else if (cleanLine.endsWith(":")) {
            doc.setFont("helvetica", "bold");
            doc.text(cleanLine, margin, yPosition);
            yPosition += 7;
            doc.setFont("helvetica", "normal");
          } else {
            doc.text(cleanLine, margin, yPosition);
            yPosition += 5.5;
          }
        });
        yPosition += 10;
      }
    }
  }

  // Content sections - only render if no custom visual (to avoid duplication)
  if (!hasCustomVisual && tab.content?.sections) {
    tab.content.sections.forEach((section) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }

      // Section title
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const cleanedSectionTitle = sanitizeText(section.title);
      const sectionTitleLines = doc.splitTextToSize(cleanedSectionTitle, maxWidth);
      doc.text(sectionTitleLines, margin, yPosition);
      yPosition += sectionTitleLines.length * 7 + 3;

      // Subtitle
      if (section.subtitle) {
        doc.setTextColor(...PDF_CONFIG.primaryColor);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const cleanedSubtitle = sanitizeText(section.subtitle);
        const subtitleLines = doc.splitTextToSize(cleanedSubtitle, maxWidth);
        doc.text(subtitleLines, margin, yPosition);
        yPosition += subtitleLines.length * 6 + 5;
      }

      // Team members
      if (section.teamMembers && Array.isArray(section.teamMembers)) {
        const membersPerRow = 3;
        const cardWidth = (maxWidth - 10) / membersPerRow;
        const cardHeight = 35;
        const cardSpacing = 5;

        section.teamMembers.forEach((member, idx) => {
          const col = idx % membersPerRow;
          const row = Math.floor(idx / membersPerRow);
          const xPos = margin + col * cardWidth;
          const cardYPos = yPosition + row * (cardHeight + cardSpacing);

          if (cardYPos > pageHeight - 60 && col === 0) {
            doc.addPage();
            yPosition = margin;
          }

          const finalYPos = col === 0 && row > 0 && yPosition < margin + 20 ? margin : cardYPos;

          // Card border
          doc.setDrawColor(...PDF_CONFIG.primaryColor);
          doc.setLineWidth(0.5);
          doc.rect(xPos + 2, finalYPos, cardWidth - 6, cardHeight);

          // Role header
          doc.setFillColor(...PDF_CONFIG.primaryColor);
          doc.rect(xPos + 2, finalYPos, cardWidth - 6, 8, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text(member.role, xPos + cardWidth / 2, finalYPos + 5, { align: "center" });

          // Name
          doc.setTextColor(...PDF_CONFIG.textDark);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          const nameLines = doc.splitTextToSize(member.name, cardWidth - 12);
          doc.text(nameLines, xPos + cardWidth / 2, finalYPos + 16, { align: "center" });

          // LinkedIn
          if (member.linkedin) {
            doc.setTextColor(...PDF_CONFIG.primaryColor);
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            const linkText = "LinkedIn Profile";
            const linkY = finalYPos + 26;
            doc.text(linkText, xPos + cardWidth / 2, linkY, { align: "center" });
            const textWidth = doc.getTextWidth(linkText);
            doc.link(xPos + (cardWidth - textWidth) / 2, linkY - 3, textWidth, 4, { url: member.linkedin });
          } else {
            doc.setTextColor(...PDF_CONFIG.textLight);
            doc.setFontSize(7);
            doc.setFont("helvetica", "italic");
            doc.text("Coming Soon", xPos + cardWidth / 2, finalYPos + 26, { align: "center" });
          }
        });

        const totalRows = Math.ceil(section.teamMembers.length / membersPerRow);
        yPosition += totalRows * (cardHeight + cardSpacing) + 5;
      }

      // Items
      if (section.items && Array.isArray(section.items)) {
        doc.setTextColor(...PDF_CONFIG.textGray);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        section.items.forEach((item) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
          }

          // Bullet
          doc.setTextColor(...PDF_CONFIG.primaryColor);
          doc.setFont("helvetica", "bold");
          doc.text("-", margin + 2, yPosition);

          // Text
          doc.setTextColor(...PDF_CONFIG.textGray);
          doc.setFont("helvetica", "normal");
          const cleanedItem = sanitizeText(item);
          const itemLines = doc.splitTextToSize(cleanedItem, maxWidth - 10);
          doc.text(itemLines, margin + 8, yPosition);
          yPosition += itemLines.length * 5 + 3;
        });
      }

      // Conclusion
      if (section.conclusion) {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(200, 200, 200);
        const cleanedConclusion = sanitizeText(section.conclusion);
        const conclusionLines = doc.splitTextToSize(cleanedConclusion, maxWidth - 16);
        const boxHeight = conclusionLines.length * 5 + 8;
        doc.roundedRect(margin, yPosition - 2, maxWidth, boxHeight, 2, 2, "FD");

        doc.setTextColor(...PDF_CONFIG.textGray);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(conclusionLines, margin + 8, yPosition + 4);
        yPosition += boxHeight + 5;
      }

      yPosition += 8;
    });
  }

  return yPosition;
};

/**
 * Add footer to all pages except cover
 */
const addFooters = (doc: jsPDF): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PDF_CONFIG.margin;
  const totalPages = doc.getNumberOfPages();

  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `(C) ${new Date().getFullYear()} Hobson AI - Confidential Investment Materials`,
      margin,
      pageHeight - 10
    );
    doc.text(`Page ${i - 1} of ${totalPages - 1}`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }
};

/**
 * Generate PDF for a single card section
 * 
 * @param section - The card section containing all tabs
 * @returns void - Downloads the PDF directly
 */
export const generateCardPdf = (section: CardSection): void => {
  const doc = new jsPDF();
  const margin = PDF_CONFIG.margin;

  // Create cover page
  createCoverPage(doc, section.title, section.subtitle);

  // Render each tab
  section.pages.forEach((tab) => {
    doc.addPage();
    renderTabContent(doc, tab, margin);
  });

  // Add footers
  addFooters(doc);

  // Save
  const filename = `Hobson-${section.title.replace(/[^a-z0-9]/gi, "-")}.pdf`;
  doc.save(filename);
};

/**
 * Business Plan Cards - explicit interface for the 6 included cards
 */
export interface BusinessPlanCards {
  strategyPositioning: CardSection;
  customersMarket: CardSection;
  roadmapProduct: CardSection;
  commercials: CardSection;
  team: CardSection;
  financials: CardSection;
}

/**
 * Funding requirement info for cover page
 */
export interface FundingRequirement {
  amount: string;
  description: string;
}

/**
 * Generate complete business plan PDF with all 6 cards
 * 
 * @param cards - Object containing all 6 card sections explicitly
 * @param fundingRequirement - Optional funding requirement data for cover page
 * @returns void - Downloads the PDF directly
 */
export const generateFullBusinessPlanPdf = (
  cards: BusinessPlanCards,
  fundingRequirement?: FundingRequirement
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PDF_CONFIG.margin;

  // Explicit ordered list of cards to include
  const includedSections: CardSection[] = [
    cards.strategyPositioning,
    cards.customersMarket,
    cards.roadmapProduct,
    cards.commercials,
    cards.team,
    cards.financials,
  ];

  // Cover page
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("HOBSON AI", pageWidth / 2, 60, { align: "center" });

  doc.setFontSize(36);
  doc.text("Full Business Plan", pageWidth / 2, 100, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Investment Opportunity Document", pageWidth / 2, 130, { align: "center" });

  // Funding requirement - use provided data or defaults
  const fundingAmount = fundingRequirement?.amount || "GBP 1.5M - 2.2M";
  const fundingDesc = fundingRequirement?.description || "Covers 18-24 months and early commercialisation";
  
  const fundingY = 165;
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 80, fundingY - 15, pageWidth / 2 + 80, fundingY - 15);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FUNDING REQUIREMENT", pageWidth / 2, fundingY, { align: "center" });

  doc.setFontSize(36);
  const sanitizedAmount = sanitizeText(fundingAmount);
  doc.text(sanitizedAmount, pageWidth / 2, fundingY + 18, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const sanitizedDesc = sanitizeText(fundingDesc);
  doc.text(sanitizedDesc, pageWidth / 2, fundingY + 32, { align: "center" });

  doc.line(pageWidth / 2 - 80, fundingY + 42, pageWidth / 2 + 80, fundingY + 42);

  const currentDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(10);
  doc.text(currentDate, pageWidth / 2, pageHeight - 20, { align: "center" });

  // Index page
  doc.addPage();
  let indexY = margin;

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Contents", pageWidth / 2, indexY, { align: "center" });
  indexY += 15;

  doc.setDrawColor(...PDF_CONFIG.primaryColor);
  doc.setLineWidth(1);
  doc.line(margin + 40, indexY, pageWidth - margin - 40, indexY);
  indexY += 15;

  const indexPageNum = doc.getNumberOfPages();

  // Calculate page numbers
  const sectionPageNumbers: { [key: string]: number } = {};
  let currentPageNum = indexPageNum + 1;
  includedSections.forEach((section) => {
    sectionPageNumbers[section.id] = currentPageNum;
    section.pages.forEach(() => {
      currentPageNum++;
    });
  });

  // Draw index cards
  const cardWidth = (pageWidth - margin * 2 - 10) / 2;
  const cardHeight = 45;
  let cardX = margin;
  let cardY = indexY;
  let cardCount = 0;

  const colors = [
    [59, 130, 246],   // Strategy - blue
    [168, 85, 247],   // Customers - purple
    [34, 197, 94],    // Roadmap - green
    [234, 179, 8],    // Commercials - yellow
    [239, 68, 68],    // Team - red
    [236, 72, 153],   // Financials - pink
  ];

  includedSections.forEach((section, idx) => {
    if (cardY + cardHeight > pageHeight - 30) {
      doc.addPage();
      cardY = margin;
      cardX = margin;
      cardCount = 0;
    }

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, "F");

    const [r, g, b] = colors[idx % colors.length];
    doc.setFillColor(r, g, b);
    doc.rect(cardX, cardY, cardWidth, 3, "F");

    doc.setTextColor(r, g, b);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}`, cardX + 8, cardY + 15);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(section.title, cardWidth - 35);
    doc.text(titleLines, cardX + 20, cardY + 15);

    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const subtitleLines = doc.splitTextToSize(section.subtitle, cardWidth - 20);
    doc.text(subtitleLines[0] || "", cardX + 8, cardY + 30);

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const pageNum = sectionPageNumbers[section.id];
    doc.text(`p.${pageNum - 1}`, cardX + cardWidth - 20, cardY + 38);

    // Add link
    doc.link(cardX, cardY, cardWidth, cardHeight, { pageNumber: pageNum });

    cardCount++;
    if (cardCount % 2 === 0) {
      cardX = margin;
      cardY += cardHeight + 10;
    } else {
      cardX = margin + cardWidth + 10;
    }
  });

  // Render all section content with section divider pages
  includedSections.forEach((section, idx) => {
    // Add section divider page
    doc.addPage();
    const [r, g, b] = colors[idx % colors.length];
    
    // Section divider - colored header bar
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 60, "F");
    
    // Section number
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}`, pageWidth / 2, 42, { align: "center" });
    
    // Section title
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, pageWidth / 2, 100, { align: "center" });
    
    // Section subtitle
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(section.subtitle, pageWidth / 2, 120, { align: "center" });
    
    // Decorative line
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(2);
    doc.line(pageWidth / 2 - 40, 135, pageWidth / 2 + 40, 135);
    
    // List of tabs in this section
    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let tabListY = 160;
    section.pages.forEach((tab, tabIdx) => {
      doc.text(`${tabIdx + 1}. ${tab.title}`, pageWidth / 2, tabListY, { align: "center" });
      tabListY += 12;
    });
    
    // Render each tab
    section.pages.forEach((tab) => {
      doc.addPage();
      renderTabContent(doc, tab, margin);
    });
  });

  // Add footers (skip cover and index)
  const totalPages = doc.getNumberOfPages();
  for (let i = 3; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `(C) ${new Date().getFullYear()} Hobson AI - Confidential Investment Materials`,
      margin,
      pageHeight - 10
    );
    doc.text(`Page ${i - 2} of ${totalPages - 2}`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  doc.save("Hobson-Full-Business-Plan.pdf");
};
