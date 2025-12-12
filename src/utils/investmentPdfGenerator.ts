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
  // STANDARDIZED FONT SIZES (for print readability)
  fontSize: {
    pageTitle: 18,      // Tab/page titles
    sectionTitle: 13,   // Section headers within content
    cardTitle: 12,      // Card/box titles
    body: 10,           // Standard body text (was 8-9, now 10)
    bodySmall: 9,       // Secondary info, labels
    caption: 8,         // Footnotes, sources
    stat: 16,           // Large statistics/numbers
  },
  lineHeight: {
    body: 6,            // Standard line spacing
    tight: 5,           // Compact lists
    loose: 8,           // Headers, titles
  },
  // Colors
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
 * Render text with explicit line spacing (prevents cramped text)
 * This is the default method for multi-line text rendering.
 * 
 * @param doc - jsPDF instance
 * @param text - Text to render (will be split to fit width)
 * @param x - X position
 * @param y - Starting Y position
 * @param maxWidth - Maximum width for text wrapping
 * @param lineHeight - Height between lines (default: 5)
 * @returns The Y position after the last line
 */
const renderSpacedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number = 5
): number => {
  const lines = doc.splitTextToSize(sanitizeText(text), maxWidth);
  let currentY = y;
  lines.forEach((line: string) => {
    doc.text(line, x, currentY);
    currentY += lineHeight;
  });
  return currentY;
};

/**
 * Render centered text with explicit line spacing
 */
const renderSpacedTextCentered = (
  doc: jsPDF,
  text: string,
  centerX: number,
  y: number,
  maxWidth: number,
  lineHeight: number = 5
): number => {
  const lines = doc.splitTextToSize(sanitizeText(text), maxWidth);
  let currentY = y;
  lines.forEach((line: string) => {
    doc.text(line, centerX, currentY, { align: "center" });
    currentY += lineHeight;
  });
  return currentY;
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
  doc.setFontSize(PDF_CONFIG.fontSize.pageTitle); // 18pt
  doc.setFont("helvetica", "bold");
  doc.text("Competitor Analysis", margin, yPosition);
  yPosition += 14;
  
  // Column configuration - balanced widths to fit page (A4 = 210mm, margins = 40mm, content = 170mm)
  // Total column width should match maxWidth (~170)
  const colWidths = [22, 24, 28, 22, 24, 28, 22]; // 7 columns = 170
  const headers = ["Competitor", "Who They Are", "What They Do", "Strengths", "Weaknesses", "Reviews", "Market Value"];
  
  // Header row - matches bg-primary/10 (light purple background)
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 14, "F");
  
  // Header border - matches border-border
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.rect(margin, yPosition, maxWidth, 14, "S");
  
  // Header text - matches font-semibold text-foreground
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8); // Increased from 6pt
  doc.setFont("helvetica", "bold");
  
  let xPos = margin + 2;
  headers.forEach((header, i) => {
    const headerLines = doc.splitTextToSize(header, colWidths[i] - 3);
    doc.text(headerLines, xPos, yPosition + 5);
    xPos += colWidths[i];
  });
  yPosition += 14;
  
  // Data rows
  doc.setFont("helvetica", "normal");
  
  competitorData.forEach((competitor, rowIndex) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
      
      // Re-render header on new page
      doc.setFillColor(...PDF_CONFIG.headerBg);
      doc.rect(margin, yPosition, maxWidth, 14, "F");
      doc.setDrawColor(...PDF_CONFIG.border);
      doc.rect(margin, yPosition, maxWidth, 14, "S");
      
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      
      xPos = margin + 2;
      headers.forEach((header, i) => {
        const headerLines = doc.splitTextToSize(header, colWidths[i] - 3);
        doc.text(headerLines, xPos, yPosition + 5);
        xPos += colWidths[i];
      });
      yPosition += 14;
      doc.setFont("helvetica", "normal");
    }
    
    const rowHeight = 22; // Increased from 18 for larger text
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
    
    // Cell content - increased from 5.5pt to 7pt
    doc.setFontSize(7);
    xPos = margin + 2;
    const cellY = yPosition + 5;
    
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
  const descY = iconY + iconSize + 12;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Render as single wrapped paragraph with better line spacing
  const fullDesc = "Turning complex documents and decisions into clear, reliable insight. Zero onboarding. Trusted accuracy from day one. Continuous learning that shifts from basic automation to proactive support - unlocking major efficiency gains across the entire property lifecycle.";
  const descLines = doc.splitTextToSize(fullDesc, maxWidth - 20);
  let descLineY = descY;
  descLines.forEach((line: string) => {
    doc.text(line, margin + 8, descLineY);
    descLineY += 6; // Explicit line spacing (increased from default ~4)
  });
  
  yPosition += heroHeight + 14;

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
  yPosition = renderSpacedText(doc, marketDesc, margin, yPosition, maxWidth, 6);
  yPosition += 10;

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
    renderSpacedText(doc, section.conclusion, margin + 10, yPosition + 47, maxWidth - 20, 5);

    yPosition += cardHeight + 8;
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
  const introEndY = renderSpacedText(doc, introText, margin + 8, yPosition + 18, maxWidth - 16, 6);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8);
  const pillarsText = "Built around three pillars: Product, Brand, and Business Model - aligned toward a 2027 commercial launch, funded by a 2026 seed round.";
  renderSpacedText(doc, pillarsText, margin + 8, introEndY + 4, maxWidth - 16, 6);

  yPosition += introHeight + 12;

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
    doc.setFontSize(9);
    doc.text(item, margin + 16, yPosition + 1);
    yPosition += 8; // Increased from 6 for better line spacing
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

  // 3x2 grid of brand cards - with better spacing
  const brandCardWidth = (maxWidth - 24) / 3;
  const brandCardHeight = 22; // Increased from 18
  brandItems.forEach((item, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const cardX = margin + 8 + col * (brandCardWidth + 6);
    const cardY = yPosition + row * (brandCardHeight + 6);

    doc.setFillColor(...PDF_CONFIG.roseBg);
    doc.roundedRect(cardX, cardY, brandCardWidth, brandCardHeight, 2, 2, "F");
    doc.setDrawColor(...PDF_CONFIG.roseBorder);
    doc.setLineWidth(0.2);
    doc.roundedRect(cardX, cardY, brandCardWidth, brandCardHeight, 2, 2, "S");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, cardX + 4, cardY + 8);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(item.desc, cardX + 4, cardY + 16);
  });
  yPosition += 2 * (brandCardHeight + 6) + 8;

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
  yPosition = renderSpacedTextCentered(
    doc,
    "Hobson is designed to meet the needs of real estate professionals across all operator sizes—each with distinct challenges, but a shared need for clarity.",
    pageWidth / 2,
    yPosition,
    maxWidth - 20,
    6
  );
  yPosition += 8;

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
    if (yPosition > pageHeight - 70) {
      doc.addPage();
      yPosition = margin;
    }

    const cardHeight = 55; // Increased from 42 for better spacing
    doc.setFillColor(...segment.bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");

    // Icon circle (no text inside)
    doc.setFillColor(...segment.color);
    doc.circle(margin + 10, yPosition + 14, 5, "F");

    // Title & employees - increased vertical spacing
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(segment.title, margin + 20, yPosition + 12);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`(${segment.employees})`, margin + 20, yPosition + 20);

    // Challenge - moved down with more spacing
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("CHALLENGE", margin + 10, yPosition + 32);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(8);
    renderSpacedText(doc, segment.challenge, margin + 10, yPosition + 40, maxWidth / 2 - 25, 5);

    // Need - moved to right side with better spacing
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("WHAT THEY NEED", margin + maxWidth / 2 + 5, yPosition + 32);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(8);
    renderSpacedText(doc, segment.need, margin + maxWidth / 2 + 5, yPosition + 40, maxWidth / 2 - 25, 5);

    yPosition += cardHeight + 8; // Increased spacing between cards
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
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Market Opportunity", margin, yPosition);
  yPosition += 6;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("Built Directly From Verified Assumptions", margin, yPosition);
  yPosition += 14;

  // TAM Box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 60, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Total Addressable Market (TAM)", margin + 8, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 1.41B", margin + maxWidth - 50, yPosition + 12);
  
  const tamItems = [
    "235,200 UK real estate businesses (5.6M total x 4.2%)",
    "GBP 6,000 annual saving per business (20% efficiency on GBP 30k salary)",
    "TAM = 235,200 x GBP 6,000 = GBP 1.41B",
  ];
  let itemY = yPosition + 26;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  tamItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryLight);
    doc.circle(margin + 12, itemY - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, margin + 18, itemY);
    itemY += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 68;

  // SAM Box
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 60, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Serviceable Available Market (SAM)", margin + 8, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 917M", margin + maxWidth - 50, yPosition + 12);
  
  const samItems = [
    "65% adoption readiness (Deloitte, PwC, McKinsey)",
    "235,200 x 65% = 152,880 motivated businesses",
    "152,880 x GBP 6,000 = GBP 917M",
  ];
  itemY = yPosition + 26;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  samItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryLight);
    doc.circle(margin + 12, itemY - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, margin + 18, itemY);
    itemY += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 68;

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
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Global Market Assumptions", margin, yPosition);
  yPosition += 6;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("Explosive Global Growth (Verified by Independent Reports)", margin, yPosition);
  yPosition += 14;

  const sections = [
    {
      num: "1",
      title: "AI in Real Estate Market Growth",
      source: "Business Research Company",
      stat1: "$222.65B to $303.06B",
      stat1Label: "Market growth 2024-2025",
      stat2: "36.1% CAGR",
      stat2Label: "",
    },
    {
      num: "2",
      title: "Long-Term Forecast to 2030",
      source: "Maximize Market Research",
      stat1: "$1.8T by 2030",
      stat1Label: "Global market size",
      stat2: "35% CAGR",
      stat2Label: "Sustained growth",
    },
    {
      num: "3",
      title: "Proven Efficiency & Cost Gains",
      source: "McKinsey",
      stat1: "10%+ NOI increase",
      stat1Label: "Net operating income gains",
      stat2: "",
      stat2Label: "",
    },
    {
      num: "4",
      title: "Real-World Adoption & Savings",
      source: "Forbes",
      stat1: "49% report cost cuts",
      stat1Label: "Clear cost reductions",
      stat2: "Up to 20% savings",
      stat2Label: "Operational efficiency",
    },
  ];

  sections.forEach((section) => {
    if (yPosition > pageHeight - 55) {
      doc.addPage();
      yPosition = margin;
    }

    const cardHeight = 46;
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");

    // Circle indicator
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 8, yPosition + 10, 4, "F");

    // Title
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(`${section.title} (${section.source})`, margin + 16, yPosition + 12);

    // Stats - larger and clearer
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(section.stat1, margin + 12, yPosition + 26);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(section.stat1Label, margin + 12, yPosition + 36);

    if (section.stat2) {
      doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.setFont("helvetica", "bold");
      doc.text(section.stat2, margin + maxWidth / 2 + 10, yPosition + 26);
      doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFont("helvetica", "normal");
      doc.text(section.stat2Label, margin + maxWidth / 2 + 10, yPosition + 36);
    }

    yPosition += cardHeight + 8;
  });

  // Why This Matters
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  const greenBg: [number, number, number] = [236, 253, 245];
  doc.setFillColor(...greenBg);
  doc.roundedRect(margin, yPosition, maxWidth, 44, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 8, yPosition + 10, 4, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Why This Matters for Hobson", margin + 16, yPosition + 12);
  
  const whyItems = [
    "AI efficiency gains are a global norm",
    "20% efficiency uplift validated by global data",
    "UK GBP 1.41B sits inside multi-billion-dollar global market",
    "Adoption rising and ROI demonstrable",
  ];
  let whyY = yPosition + 22;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  whyItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 14, whyY - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, margin + 20, whyY);
    whyY += PDF_CONFIG.lineHeight.body;
  });
  yPosition += 50;

  return yPosition;
};

/**
 * Render Market Landscape (Traditional vs AI-Native) visual
 */
const renderMarketLandscape = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Note: Tab title "Market Landscape" is already rendered by the tab renderer
  // So we skip the header here to avoid duplication
  
  // Subtitle only (no duplicate header)
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body); // 10pt for readability
  doc.setFont("helvetica", "normal");
  doc.text("AI-native tools can deliver what traditional cloud systems cannot - reasoning, accuracy, and instant answers.", margin, yPosition);
  yPosition += 12;

  // SECTION 1: Traditional Cloud Solutions
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 55, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle); // 12pt
  doc.setFont("helvetica", "bold");
  doc.text("Traditional Cloud Solutions", margin + 8, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.body); // 10pt
  doc.setFont("helvetica", "normal");
  doc.text("The Overcrowded Before - 100+ competitors including:", margin + 8, yPosition + 24);
  
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall); // 9pt
  doc.text("AppFolio, Yardi, RealPage, Entrata, MRI, Buildium, Rent Manager, VTS, CoStar...", margin + 8, yPosition + 35);
  
  const issues = ["Overcrowded market", "High cost, slow innovation", "Manual information retrieval"];
  let issueX = margin + 8;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall); // 9pt
  issues.forEach((issue) => {
    doc.setFillColor(239, 68, 68);
    doc.circle(issueX, yPosition + 47, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(issue, issueX + 4, yPosition + 48);
    issueX += 55;
  });
  yPosition += 62;

  // SECTION 2: AI-Native Solutions
  const greenBg: [number, number, number] = [236, 253, 245];
  doc.setFillColor(...greenBg);
  doc.roundedRect(margin, yPosition, maxWidth, 65, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.emerald);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPosition, maxWidth, 65, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle); // 12pt
  doc.setFont("helvetica", "bold");
  doc.text("Next-Generation AI Solutions", margin + 8, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.body); // 10pt
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("The Emerging After - AI-native tools delivering real value:", margin + 8, yPosition + 24);

  // AI companies in a row
  const aiCompanies = ["Hobson (Leader)", "EliseAI", "Trudi", "StanAI", "Kendal AI"];
  let aiX = margin + 8;
  aiCompanies.forEach((company, idx) => {
    if (idx === 0) {
      doc.setFillColor(209, 250, 229);
      doc.roundedRect(aiX, yPosition + 28, 40, 12, 2, 2, "F");
      doc.setTextColor(...PDF_CONFIG.emerald);
      doc.setFontSize(PDF_CONFIG.fontSize.body); // 10pt
      doc.setFont("helvetica", "bold");
      doc.text(company, aiX + 3, yPosition + 36);
      aiX += 45;
    } else {
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFontSize(PDF_CONFIG.fontSize.bodySmall); // 9pt
      doc.setFont("helvetica", "normal");
      doc.text(company, aiX, yPosition + 36);
      aiX += 28;
    }
  });

  const benefits = ["Instant, referenced answers", "Simple, lightweight, low cost", "Designed for accuracy"];
  let benefitX = margin + 8;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall); // 9pt
  benefits.forEach((benefit) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(benefitX, yPosition + 55, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(benefit, benefitX + 4, yPosition + 56);
    benefitX += 55;
  });
  yPosition += 72;

  // Transition message
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 16, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body); // 10pt
  doc.setFont("helvetica", "bold");
  doc.text("Industry Transition: From passive cloud storage to active AI assistance", margin + 8, yPosition + 10);
  yPosition += 20;

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
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Europe", margin, yPosition);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("11x UK Population Multiple", margin + 40, yPosition);
  yPosition += 12;

  // Europe TAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, colWidth, 42, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("TAM", margin + 8, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 15.5B", margin + 8, yPosition + 26);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("GBP 1.41B x 11", margin + 8, yPosition + 36);

  // Europe SAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + colWidth + 10, yPosition, colWidth, 42, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("SAM", margin + colWidth + 18, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 10.1B", margin + colWidth + 18, yPosition + 26);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("GBP 15.5B x 65%", margin + colWidth + 18, yPosition + 36);
  yPosition += 50;

  // GLOBAL Section
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Global", margin, yPosition);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("18x UK Population Multiple (OECD markets)", margin + 35, yPosition);
  yPosition += 12;

  // Global TAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, colWidth, 42, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("TAM", margin + 8, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 155.6B", margin + 8, yPosition + 26);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("GBP 1.41B x 118 (adjusted)", margin + 8, yPosition + 36);

  // Global SAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + colWidth + 10, yPosition, colWidth, 42, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("SAM", margin + colWidth + 18, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 101B", margin + colWidth + 18, yPosition + 26);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("GBP 155.6B x 65%", margin + colWidth + 18, yPosition + 36);
  yPosition += 50;

  // Summary
  if (yPosition > pageHeight - 28) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 22, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  const summaryText = "Positions Hobson as an export-ready solution capable of adapting across geographies and regulatory contexts.";
  doc.text(summaryText, margin + 8, yPosition + 14);
  yPosition += 28;

  return yPosition;
};

/**
 * Render Early Roadmap (2024-2025) visual
 */
const renderEarlyRoadmap = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  const phases = [
    {
      phase: "1",
      title: "Discover",
      timeframe: "May - Aug 2024",
      color: PDF_CONFIG.blue,
      bgColor: PDF_CONFIG.blueBg,
      borderColor: PDF_CONFIG.blueBorder,
      objectives: [
        "Client discovery calls with real estate professionals",
        "Establish the core problem being solved",
        "Identify pain points in existing systems",
        "Define target market segments",
      ],
    },
    {
      phase: "2",
      title: "Validate",
      timeframe: "Sept - Dec 2024",
      color: PDF_CONFIG.primaryColor,
      bgColor: PDF_CONFIG.primaryBgLight,
      borderColor: PDF_CONFIG.primaryLight,
      objectives: [
        "Establish four working partnerships with real estate firms",
        "No-code concepts validation",
        "Scope the MVP based on partner feedback",
        "Refine value proposition and feature set",
      ],
    },
    {
      phase: "3",
      title: "Develop",
      timeframe: "Jan - Dec 2025",
      color: PDF_CONFIG.emerald,
      bgColor: PDF_CONFIG.emeraldBg,
      borderColor: PDF_CONFIG.emeraldBorder,
      objectives: [
        "Build MVP: Phase 1 with core AI capabilities",
        "Build online presence and branding",
        "Testing MVP with key clients data",
        "Finalise pricing strategy based on usage data",
        "Build pricing plan, marketing plan, business plan and financial model",
      ],
    },
  ];

  phases.forEach((phase, idx) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    const cardHeight = 50 + phase.objectives.length * 7;
    
    // Card background
    doc.setFillColor(...phase.bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    
    // Left accent border
    doc.setFillColor(...phase.color);
    doc.rect(margin, yPosition, 4, cardHeight, "F");

    // Phase title and timeframe
    doc.setTextColor(...phase.color);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Phase ${phase.phase}: ${phase.title}`, margin + 12, yPosition + 12);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(phase.timeframe, margin + maxWidth - 60, yPosition + 12);

    // Objectives
    let objY = yPosition + 24;
    doc.setFontSize(9);
    phase.objectives.forEach((obj) => {
      doc.setFillColor(...phase.color);
      doc.circle(margin + 16, objY - 1, 1.5, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(obj, margin + 22, objY);
      objY += 7;
    });

    yPosition += cardHeight + 8;
  });

  return yPosition;
};

/**
 * Render Gantt Chart (2026-2028) visual
 */
const renderGanttChart = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  const years = [
    {
      year: "2026",
      title: "Strengthen & Validate",
      goal: "Validate commercial model and prepare for market entry",
      color: PDF_CONFIG.blue,
      bgColor: PDF_CONFIG.blueBg,
      objectives: [
        "Grow to 10 active pilot organisations across different portfolio sizes",
        "Scale and improve core features based on real pilot feedback",
        "Convert 3-5 pilots into paying customers to prove commercial demand",
        "Build payment engine and billing workflows ready for public launch",
        "Finalise marketing plan with KPIs, channels, content structure",
        "Prepare full go-to-market plan for 2027 launch",
      ],
    },
    {
      year: "2027",
      title: "Market Entry",
      goal: "Launch commercially and expand UK presence",
      color: PDF_CONFIG.primaryColor,
      bgColor: PDF_CONFIG.primaryBgLight,
      objectives: [
        "Launch public Hobson website (Q1 2027) with full pricing and onboarding flows",
        "Implement marketing plan: SEO, LinkedIn content, website funnels",
        "Scale technology and platform features to support growing demand",
        "Strengthen onboarding, support processes, and customer success workflows",
        "Prepare for global expansion by validating demand in two target countries",
      ],
    },
    {
      year: "2028",
      title: "Global Expansion",
      goal: "Enter international markets and scale platform",
      color: PDF_CONFIG.emerald,
      bgColor: PDF_CONFIG.emeraldBg,
      objectives: [
        "Launch Hobson in two international markets with regionalised marketing",
        "Release localised document packs and accuracy enhancements",
        "Grow paid customer base across UK + international regions",
        "Expand brand presence through partnerships and local events",
        "Strengthen platform reliability for multi-market operations",
      ],
    },
  ];

  years.forEach((yearData) => {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    const cardHeight = 55 + yearData.objectives.length * 7;
    
    // Card background
    doc.setFillColor(...yearData.bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    
    // Left accent border
    doc.setFillColor(...yearData.color);
    doc.rect(margin, yPosition, 4, cardHeight, "F");

    // Year badge
    doc.setFillColor(...yearData.color);
    doc.roundedRect(margin + 12, yPosition + 6, 28, 14, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(yearData.year, margin + 26, yPosition + 15, { align: "center" });

    // Title and goal
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(11);
    doc.text(yearData.title, margin + 48, yPosition + 14);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Goal: ${yearData.goal}`, margin + 12, yPosition + 28);

    // Objectives
    let objY = yPosition + 40;
    doc.setFontSize(8);
    yearData.objectives.forEach((obj) => {
      doc.setFillColor(...yearData.color);
      doc.circle(margin + 16, objY - 1, 1, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(obj, margin + 22, objY);
      objY += 7;
    });

    yPosition += cardHeight + 8;
  });

  return yPosition;
};

/**
 * Render Pilot Clients visual
 */
const renderPilotClients = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Intro text
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  yPosition = renderSpacedText(
    doc,
    "Strategic partnerships and pilot validation across different operator sizes and system environments.",
    margin,
    yPosition,
    maxWidth,
    6
  );
  yPosition += 10;

  const pilots = [
    {
      type: "LARGE OPERATOR",
      color: PDF_CONFIG.blue,
      bgColor: PDF_CONFIG.blueBg,
      clients: [
        { name: "EPAM Asset Management", desc: "Commercial management operating teams across multiple systems", system: "Multiple systems" },
      ],
    },
    {
      type: "MEDIUM OPERATOR",
      color: PDF_CONFIG.primaryColor,
      bgColor: PDF_CONFIG.primaryBgLight,
      clients: [
        { name: "Live-in Guardians", desc: "Guardian company operating teams using single system", system: "Single system" },
      ],
    },
    {
      type: "SMALL OPERATORS",
      color: PDF_CONFIG.emerald,
      bgColor: PDF_CONFIG.emeraldBg,
      clients: [
        { name: "Landhold", desc: "Development, sales, and investment company", system: "Microsoft suites" },
        { name: "Saxon Investments", desc: "Development, sales, and investment company", system: "Microsoft suite" },
      ],
    },
  ];

  pilots.forEach((pilotGroup) => {
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    // Type header
    doc.setFillColor(...pilotGroup.color);
    doc.roundedRect(margin, yPosition, 80, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(pilotGroup.type, margin + 40, yPosition + 8, { align: "center" });
    yPosition += 18;

    pilotGroup.clients.forEach((client) => {
      const cardHeight = 28;
      doc.setFillColor(...pilotGroup.bgColor);
      doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 2, 2, "F");
      
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(client.name, margin + 8, yPosition + 10);
      
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(client.desc, margin + 8, yPosition + 18);
      
      doc.setTextColor(...pilotGroup.color);
      doc.text(`System: ${client.system}`, margin + maxWidth - 60, yPosition + 10);
      
      yPosition += cardHeight + 4;
    });

    yPosition += 6;
  });

  // Summary box
  if (yPosition > pageHeight - 30) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("4 Active Pilots  |  3 Operator Sizes  |  2+ System Types", pageWidth / 2, yPosition + 12, { align: "center" });
  yPosition += 26;

  return yPosition;
};

/**
 * Render Tech Stack visual
 */
const renderTechStack = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Intro
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  yPosition = renderSpacedText(
    doc,
    "Hobson runs on trusted, industry-standard platforms designed for security, performance, and scalability.",
    margin,
    yPosition,
    maxWidth,
    6
  );
  yPosition += 10;

  const categories = [
    {
      title: "AI & Intelligence",
      color: PDF_CONFIG.primaryColor,
      bgColor: PDF_CONFIG.primaryBgLight,
      items: ["OpenAI - Powers natural language understanding and AI-driven responses"],
    },
    {
      title: "Cloud Infrastructure",
      color: PDF_CONFIG.blue,
      bgColor: PDF_CONFIG.blueBg,
      items: [
        "OVH Cloud - Stores uploaded files and documents (secure UK/EU-based storage)",
        "Vercel - Runs the Hobson web app (fast, stable interface)",
      ],
    },
    {
      title: "Data & Storage",
      color: PDF_CONFIG.emerald,
      bgColor: PDF_CONFIG.emeraldBg,
      items: [
        "MongoDB - Handles structured data (units, portfolios, users, metadata)",
        "Neo4j - Used for knowledge-graph structures to understand relationships",
        "Pinecone - Stores vector embeddings for quick document search",
      ],
    },
    {
      title: "Communication & Admin",
      color: PDF_CONFIG.amber,
      bgColor: PDF_CONFIG.amberBg,
      items: ["Google Workspace - Email delivery, team communication, secure internal admin"],
    },
  ];

  categories.forEach((category) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    const cardHeight = 18 + category.items.length * 10;
    
    // Card background
    doc.setFillColor(...category.bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    
    // Left accent
    doc.setFillColor(...category.color);
    doc.rect(margin, yPosition, 4, cardHeight, "F");

    // Title
    doc.setTextColor(...category.color);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(category.title, margin + 12, yPosition + 10);

    // Items
    let itemY = yPosition + 20;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    category.items.forEach((item) => {
      doc.setFillColor(...category.color);
      doc.circle(margin + 14, itemY - 1, 1, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(item, margin + 20, itemY);
      itemY += 10;
    });

    yPosition += cardHeight + 6;
  });

  // Key features box
  if (yPosition > pageHeight - 30) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 18, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Key Features: UK/EU Data Residency  |  High Availability  |  Vector Search", pageWidth / 2, yPosition + 11, { align: "center" });
  yPosition += 24;

  return yPosition;
};

/**
 * Render Simple UI visual
 */
const renderSimpleUI = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  const features = [
    { title: "Instant Start", desc: "No training required - start immediately after sign-up", color: PDF_CONFIG.blue },
    { title: "Zero Training", desc: "Intuitive interface for all skill levels - no complex menus", color: PDF_CONFIG.primaryColor },
    { title: "Natural Language", desc: "Ask questions in plain English - no query syntax to learn", color: PDF_CONFIG.emerald },
    { title: "Any Device", desc: "Works on desktop and mobile with responsive design", color: PDF_CONFIG.amber },
  ];

  // 2x2 grid of feature cards
  const cardWidth = (maxWidth - 8) / 2;
  const cardHeight = 35;

  features.forEach((feature, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + col * (cardWidth + 8);
    const yPos = yPosition + row * (cardHeight + 6);

    // Card background
    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 3, 3, "F");
    
    // Left accent
    doc.setFillColor(...feature.color);
    doc.rect(xPos, yPos, 4, cardHeight, "F");

    // Title
    doc.setTextColor(...feature.color);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(feature.title, xPos + 10, yPos + 12);

    // Description
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(feature.desc, cardWidth - 16);
    descLines.forEach((line: string, lineIdx: number) => {
      doc.text(line, xPos + 10, yPos + 22 + lineIdx * 6);
    });
  });

  yPosition += 2 * (cardHeight + 6) + 10;

  // Summary box
  if (yPosition > pageHeight - 25) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Zero Onboarding Interface - Ready to use from day one", pageWidth / 2, yPosition + 12, { align: "center" });
  yPosition += 26;

  return yPosition;
};

/**
 * Render HEU Pricing visual with standardized fonts
 */
const renderHEUPricing = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // What are HEUs intro
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("What are Hobson Energy Units (HEUs)?", margin, yPosition);
  yPosition += 10;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  yPosition = renderSpacedText(
    doc,
    "HEUs measure AI effort. Every task (query, document read, report build) consumes HEUs based on complexity and computational resources required.",
    margin,
    yPosition,
    maxWidth,
    PDF_CONFIG.lineHeight.body
  );
  yPosition += 12;

  // Pricing tiers
  const tiers = [
    { name: "Free", price: "GBP 0/month", heu: "18 HEUs", desc: "Perfect for testing", color: PDF_CONFIG.textGray },
    { name: "Essential", price: "GBP 19.50/month", heu: "275 HEUs", desc: "Ideal for small operators", color: PDF_CONFIG.primaryColor },
    { name: "Essential Plus", price: "GBP 49.75/month", heu: "700 HEUs", desc: "Great for growing teams", color: PDF_CONFIG.primaryColor },
    { name: "Enterprise", price: "GBP 148.50/month", heu: "2000 HEUs", desc: "Designed for large operations", color: PDF_CONFIG.primaryColor },
  ];

  const cardWidth = (maxWidth - 12) / 2;
  const cardHeight = 40;

  tiers.forEach((tier, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + col * (cardWidth + 12);
    const yPos = yPosition + row * (cardHeight + 8);

    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...tier.color);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 3, 3, "S");

    doc.setTextColor(...tier.color);
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(tier.name, xPos + 8, yPos + 12);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.text(tier.price, xPos + cardWidth - 8, yPos + 12, { align: "right" });

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(tier.heu, xPos + 8, yPos + 24);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(tier.desc, xPos + 8, yPos + 34);
  });

  yPosition += 2 * (cardHeight + 8) + 12;

  // Top-up pack
  if (yPosition > pageHeight - 40) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, 28, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.amber);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Top-Up Pack: GBP 15 (one-time)", margin + 8, yPosition + 12);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("150 additional HEUs - Non-rollover (expires at billing period end)", margin + 8, yPosition + 22);
  yPosition += 36;

  // Key benefits
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Key Benefits:", margin, yPosition);
  yPosition += 10;

  const benefits = [
    "No per-user fees - add unlimited team members",
    "No per-asset fees - manage unlimited properties",
    "Pay only for what you use",
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  benefits.forEach((benefit) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 4, yPosition - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(benefit, margin + 10, yPosition);
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 12;

  // COMPLETE USAGE TRANSPARENCY SECTION
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Complete Usage Transparency", margin, yPosition);
  yPosition += 12;

  // Two-column layout for transparency visuals
  const colWidth = (maxWidth - 10) / 2;

  // LEFT COLUMN: Real-Time HEU Bar
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, colWidth, 70, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, colWidth, 70, 3, 3, "S");

  // Header
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 12, yPosition + 12, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text("|||", margin + 10, yPosition + 14);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Real-Time HEU Bar", margin + 22, yPosition + 14);

  // HEU Bar visualization
  const barY = yPosition + 24;
  const barWidth = colWidth - 16;
  const barHeight = 14;
  
  // Used portion (gray)
  doc.setFillColor(156, 163, 175); // gray-400
  doc.rect(margin + 8, barY, barWidth * 0.6, barHeight, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("420 used", margin + 8 + (barWidth * 0.3), barY + 10, { align: "center" });
  
  // Remaining portion (purple)
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.rect(margin + 8 + (barWidth * 0.6), barY, barWidth * 0.4, barHeight, "F");
  doc.text("280 left", margin + 8 + (barWidth * 0.8), barY + 10, { align: "center" });

  // Total label
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("700 total HEUs", margin + 8 + (barWidth / 2), barY + 22, { align: "center" });

  // Description
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const barDesc = doc.splitTextToSize("Real-time tracking shows exactly how much you've used and what remains.", colWidth - 20);
  doc.text(barDesc, margin + 8, barY + 34);

  // RIGHT COLUMN: Per-Message Cost
  const rightX = margin + colWidth + 10;
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(rightX, yPosition, colWidth, 70, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(rightX, yPosition, colWidth, 70, 3, 3, "S");

  // Header
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(rightX + 12, yPosition + 12, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text("O", rightX + 10, yPosition + 14);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Per-Message Cost", rightX + 22, yPosition + 14);

  // Cost breakdown box
  const costBoxY = yPosition + 22;
  doc.setFillColor(249, 250, 251); // gray-50
  doc.roundedRect(rightX + 8, costBoxY, colWidth - 16, 38, 2, 2, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(rightX + 8, costBoxY, colWidth - 16, 38, 2, 2, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Message Usage Details", rightX + 12, costBoxY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const costDetails = [
    ["HEU Cost:", "0.05"],
    ["Query Type:", "Simple extraction"],
    ["Processing:", "1.2s"],
  ];
  
  let detailY = costBoxY + 16;
  costDetails.forEach(([label, value]) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(label, rightX + 12, detailY);
    doc.setTextColor(...(label === "HEU Cost:" ? PDF_CONFIG.primaryColor : PDF_CONFIG.textDark));
    doc.text(value, rightX + colWidth - 20, detailY, { align: "right" });
    detailY += 7;
  });

  // Description
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const costDesc = doc.splitTextToSize("Click ... on any message for detailed breakdown. Every action is itemised.", colWidth - 20);
  doc.text(costDesc, rightX + 8, yPosition + 64);

  yPosition += 78;

  return yPosition + 10;
};

/**
 * Render Revenue Model visual with standardized fonts
 */
const renderRevenueModel = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Pricing structure
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Pricing Structure", margin, yPosition);
  yPosition += 10;

  const pricingPoints = [
    "Blended ARPU: GBP 495.72/year (GBP 41.31/month)",
    "Tier Mix: Essential (60%), Essential Plus (30%), Enterprise (10%)",
    "No per-user or per-asset fees"
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  pricingPoints.forEach((point) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 4, yPosition - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(point, margin + 10, yPosition);
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 8;

  // UK Market table
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("UK Market Penetration & Customers", margin, yPosition);
  yPosition += 10;

  // Table header
  const colWidths = [30, 35, 35, 35];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  let xPos = margin + 4;
  ["Year", "Penetration", "Customers", "New"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += colWidths[i];
  });
  yPosition += 12;

  // UK data rows
  const ukData = [
    ["2027", "1.0%", "2,352", "2,352"],
    ["2028", "1.25%", "2,940", "588"],
    ["2029", "1.5%", "3,528", "588"],
    ["2030", "1.75%", "4,116", "588"],
    ["2031", "2.0%", "4,704", "588"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  ukData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.text(cell, xPos, yPosition + 7);
      xPos += colWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 12;

  // Combined Revenue table
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Combined Revenue (2027-2031)", margin, yPosition);
  yPosition += 10;

  const revColWidths = [30, 40, 45, 45];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  xPos = margin + 4;
  ["Year", "UK Revenue", "Global Revenue", "Total"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += revColWidths[i];
  });
  yPosition += 12;

  const revenueData = [
    ["2027", "GBP 1.17M", "--", "GBP 1.17M"],
    ["2028", "GBP 1.46M", "GBP 5.25M", "GBP 6.71M"],
    ["2029", "GBP 1.75M", "GBP 7.35M", "GBP 9.10M"],
    ["2030", "GBP 2.04M", "GBP 10.49M", "GBP 12.53M"],
    ["2031", "GBP 2.33M", "GBP 12.59M", "GBP 14.92M"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  revenueData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 3 ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
      doc.text(cell, xPos, yPosition + 7);
      xPos += revColWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 10;

  // ROI box
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 24, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("ROI: ~12x return on subscription cost", margin + 8, yPosition + 10);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("GBP 6,000 annual saving vs GBP 495.72 subscription", margin + 8, yPosition + 18);
  yPosition += 30;

  return yPosition;
};

/**
 * Render Capital Raise Strategy visual with standardized fonts
 */
const renderCapitalRaiseStrategy = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Context
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("The Context", margin, yPosition);
  yPosition += 10;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  yPosition = renderSpacedText(
    doc,
    "Hobson can operate pilot programmes throughout 2026 using founder-led execution and outsourced engineering, but the company cannot hire its core team or begin meaningful commercial activity without external capital.",
    margin,
    yPosition,
    maxWidth,
    PDF_CONFIG.lineHeight.body
  );
  yPosition += 12;

  // What capital unlocks
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("What This Capital Unlocks", margin, yPosition);
  yPosition += 10;

  const unlocks = [
    "Foundational Team: Core hires to execute commercial strategy",
    "Infrastructure: Production-ready platform build",
    "Go-to-Market: Convert pilot insights into scalable revenue"
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  unlocks.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 4, yPosition - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 10, yPosition);
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 10;

  // Raise scenarios
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Raise Scenarios", margin, yPosition);
  yPosition += 12;

  const scenarios = [
    { amount: "GBP 1.2M", name: "Activation Round", runway: "9-12 months", desc: "Minimal runway, heightened risk", recommended: false },
    { amount: "GBP 1.5M", name: "Minimum Credible", runway: "12-18 months", desc: "Stable launch phase", recommended: false },
    { amount: "GBP 1.8M", name: "Balanced Seed", runway: "18-22 months", desc: "Product velocity + marketing execution", recommended: true },
    { amount: "GBP 2.2M", name: "Accelerated Growth", runway: "22-28 months", desc: "Early international expansion", recommended: false },
  ];

  const cardHeight = 32;
  scenarios.forEach((scenario) => {
    if (yPosition > pageHeight - 40) { doc.addPage(); yPosition = margin; }

    const bgColor = scenario.recommended ? PDF_CONFIG.primaryBgLight : PDF_CONFIG.bgLight;
    const borderColor = scenario.recommended ? PDF_CONFIG.primaryColor : PDF_CONFIG.border;

    doc.setFillColor(...bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(scenario.recommended ? 1 : 0.5);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "S");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(scenario.amount, margin + 8, yPosition + 12);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.text(scenario.name, margin + 55, yPosition + 12);

    if (scenario.recommended) {
      doc.setFillColor(...PDF_CONFIG.primaryColor);
      doc.roundedRect(margin + maxWidth - 70, yPosition + 4, 60, 10, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.text("RECOMMENDED", margin + maxWidth - 40, yPosition + 11, { align: "center" });
    }

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(`${scenario.runway} runway - ${scenario.desc}`, margin + 8, yPosition + 24);

    yPosition += cardHeight + 6;
  });

  return yPosition + 10;
};

/**
 * Render Cost Assumptions visual with standardized fonts
 */
const renderCostAssumptions = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Fixed Team Costs
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Fixed Internal Team Costs (GBP 415,000/year)", margin, yPosition);
  yPosition += 10;

  const teamCosts = [
    { role: "CEO", cost: "GBP 120,000" },
    { role: "Head of Marketing", cost: "GBP 70,000" },
    { role: "Product Owner", cost: "GBP 85,000" },
    { role: "Head of Customer Support", cost: "GBP 55,000" },
    { role: "Head of Sales", cost: "GBP 85,000" },
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  teamCosts.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.role, margin + 8, yPosition);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.cost, margin + maxWidth - 60, yPosition, { align: "right" });
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 10;

  // Variable Costs
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Variable Outsourced Costs (32% of Revenue)", margin, yPosition);
  yPosition += 10;

  const variableCosts = [
    { category: "Engineering & Design", range: "10-14%" },
    { category: "Marketing Execution", range: "5-8%" },
    { category: "Customer Success Support", range: "3-5%" },
    { category: "Sales Commissions", range: "3-5%" },
    { category: "G&A / Corporate Services", range: "2-3%" },
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  variableCosts.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.category, margin + 8, yPosition);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.text(item.range, margin + maxWidth - 40, yPosition, { align: "right" });
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 10;

  // Infrastructure COGS
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("AI & Infrastructure COGS (12% of Revenue)", margin, yPosition);
  yPosition += 10;

  const infraCosts = [
    { component: "LLM inference (OpenAI)", range: "3-5%" },
    { component: "Vector DB & Embeddings", range: "1-2%" },
    { component: "Storage & Compute", range: "1-2%" },
    { component: "Monitoring & Backups", range: "0.5-1%" },
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  infraCosts.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.component, margin + 8, yPosition);
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.text(item.range, margin + maxWidth - 40, yPosition, { align: "right" });
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 10;

  // Summary box
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Expected Gross Margin: 85-90%+ (excluding team costs)", margin + 8, yPosition + 12);
  yPosition += 26;

  return yPosition;
};

/**
 * Render CAC Assumptions visual with standardized fonts
 */
const renderCACAssumptions = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Spend drivers
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Acquisition Spend Drivers", margin, yPosition);
  yPosition += 10;

  const drivers = [
    { category: "Digital Marketing", pct: "8%" },
    { category: "Sales/SDR Support", pct: "4%" },
    { category: "Total CAC Spend", pct: "12% of revenue" },
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  drivers.forEach((item, idx) => {
    const isBold = idx === 2;
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...(isBold ? PDF_CONFIG.textDark : PDF_CONFIG.textGray));
    doc.text(item.category, margin + 8, yPosition);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.text(item.pct, margin + maxWidth - 50, yPosition, { align: "right" });
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 12;

  // CAC table
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("CAC Calculation (12% of Revenue / New Customers)", margin, yPosition);
  yPosition += 10;

  const colWidths = [25, 40, 42, 40, 25];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  
  let xPos = margin + 4;
  ["Year", "Revenue", "Acq. (12%)", "New Cust.", "CAC"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += colWidths[i];
  });
  yPosition += 12;

  const cacData = [
    ["2027", "GBP 1.17M", "GBP 140k", "2,352", "GBP 60"],
    ["2028", "GBP 6.71M", "GBP 805k", "11,172", "GBP 72"],
    ["2029", "GBP 9.10M", "GBP 1.09M", "4,822", "GBP 226"],
    ["2030", "GBP 12.53M", "GBP 1.50M", "6,938", "GBP 217"],
    ["2031", "GBP 14.92M", "GBP 1.79M", "4,822", "GBP 371"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  cacData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 4 ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
      doc.text(cell, xPos, yPosition + 7);
      xPos += colWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 12;

  // LTV:CAC Analysis
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("LTV:CAC Analysis", margin, yPosition);
  yPosition += 10;

  const ltvItems = [
    "ARPU: GBP 495.72/year",
    "5-Year LTV: GBP 2,478.60",
    "LTV:CAC Ratios: 7x - 41x (far exceeds 3x benchmark)",
    "CAC Payback: 1.5 - 9 months (all under 12-month target)"
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  ltvItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 4, yPosition - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 10, yPosition);
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });

  return yPosition + 10;
};

/**
 * Render Burn Rate Assumptions visual with standardized fonts
 */
const renderBurnRateAssumptions = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Key message
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 22, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Hobson becomes profitable immediately upon commercial launch in 2027", margin + 8, yPosition + 14);
  yPosition += 30;

  // Fixed costs
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Fixed Monthly Costs: GBP 70,800", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Internal team: GBP 40,800  |  Outsourced functions: GBP 30,000", margin + 8, yPosition);
  yPosition += 14;

  // Variable costs
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Variable Costs: 22% of Revenue", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("COGS: 10%  |  Customer acquisition: 12%", margin + 8, yPosition);
  yPosition += 14;

  // Monthly surplus table
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Surplus (Profit) Trajectory", margin, yPosition);
  yPosition += 10;

  const colWidths = [30, 45, 45, 45];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  let xPos = margin + 4;
  ["Year", "Monthly Revenue", "Monthly Costs", "Surplus"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += colWidths[i];
  });
  yPosition += 12;

  const burnData = [
    ["2027", "GBP 97.5k", "GBP 92.3k", "GBP 5,250"],
    ["2028", "GBP 559k", "GBP 193.8k", "GBP 365,200"],
    ["2029", "GBP 758k", "GBP 237.3k", "GBP 520,700"],
    ["2030", "GBP 1.04M", "GBP 300.5k", "GBP 743,520"],
    ["2031", "GBP 1.24M", "GBP 344.3k", "GBP 898,740"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  burnData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 3 ? PDF_CONFIG.emerald : PDF_CONFIG.textGray));
      doc.text(cell, xPos, yPosition + 7);
      xPos += colWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 10;

  // Summary
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Expected Gross Margin: 88% | Capital needed only for pre-revenue build (2025-2026)", margin + 8, yPosition + 12);
  yPosition += 26;

  return yPosition;
};

/**
 * Render Onboarding Costs visual with standardized fonts
 */
const renderOnboardingCosts = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Intro
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  yPosition = renderSpacedText(
    doc,
    "Real-world AI processing costs demonstrate unit economics underlying Hobson's HEU model.",
    margin,
    yPosition,
    maxWidth,
    PDF_CONFIG.lineHeight.body
  );
  yPosition += 12;

  // Document cost table
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("AI Processing Costs by Document Type", margin, yPosition);
  yPosition += 10;

  const colWidths = [50, 40, 40, 40];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  let xPos = margin + 4;
  ["Document Type", "Tokens", "Time", "Cost"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += colWidths[i];
  });
  yPosition += 12;

  const docData = [
    ["Complex (Leases)", "~600k", "8-9 min", "~$0.40"],
    ["Medium (Deeds)", "~300k", "2-3 min", "~$0.10"],
    ["Simple (Notices)", "~50k", "30-60 sec", "~$0.02-0.03"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  docData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 3 ? PDF_CONFIG.emerald : PDF_CONFIG.textGray));
      doc.text(cell, xPos, yPosition + 7);
      xPos += colWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 12;

  // Customer portfolio costs
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Onboarding Costs by Size", margin, yPosition);
  yPosition += 10;

  const portfolioCosts = [
    { size: "Small (5 units)", cost: "$3.70 - $3.80", desc: "5 docs per unit" },
    { size: "Medium (100 units)", cost: "$74 - $76", desc: "Standard portfolio" },
    { size: "Large (1,000 units)", cost: "$740 - $760", desc: "Enterprise scale" },
  ];

  portfolioCosts.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.roundedRect(margin, yPosition, maxWidth, 18, 2, 2, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(item.size, margin + 8, yPosition + 11);
    
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.text(item.cost, margin + 100, yPosition + 11);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(item.desc, margin + maxWidth - 60, yPosition + 11, { align: "right" });
    
    yPosition += 22;
  });
  yPosition += 8;

  // Conclusion
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Ultra-low onboarding costs enable high margins and frictionless self-serve onboarding", margin + 8, yPosition + 12);
  yPosition += 26;

  return yPosition;
};

/**
 * Render P/L Growth visual with standardized fonts
 */
const renderPLGrowth = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Explainer box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 30, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, 30, 3, 3, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("The following tabs explain how this growth is achievable", margin + 8, yPosition + 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Review the Revenue Assumptions and Cost Assumptions tabs for detailed methodology.", margin + 8, yPosition + 22);
  yPosition += 40;

  // Key metrics grid - 3 columns
  const colWidth = (maxWidth - 16) / 3;
  const metrics = [
    { label: "Infrastructure / COGS", value: "5-10%", sublabel: "of revenue", color: PDF_CONFIG.amber, bgColor: PDF_CONFIG.amberBg },
    { label: "Operating Costs", value: "30-35%", sublabel: "of revenue (early years)", color: PDF_CONFIG.blue, bgColor: PDF_CONFIG.blueBg },
    { label: "Net Profit", value: "GBP 4.5M", sublabel: "by 2031", color: PDF_CONFIG.emerald, bgColor: PDF_CONFIG.emeraldBg },
  ];

  metrics.forEach((metric, idx) => {
    const xPos = margin + idx * (colWidth + 8);
    doc.setFillColor(...metric.bgColor);
    doc.roundedRect(xPos, yPosition, colWidth, 40, 3, 3, "F");
    doc.setDrawColor(...metric.color);
    doc.roundedRect(xPos, yPosition, colWidth, 40, 3, 3, "S");

    doc.setTextColor(...metric.color);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(metric.label, xPos + colWidth / 2, yPosition + 10, { align: "center" });

    doc.setFontSize(PDF_CONFIG.fontSize.stat);
    doc.text(metric.value, xPos + colWidth / 2, yPosition + 26, { align: "center" });

    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(metric.sublabel, xPos + colWidth / 2, yPosition + 34, { align: "center" });
  });
  yPosition += 50;

  // Growth trajectory table
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("P/L Growth Trajectory (2027-2031)", margin, yPosition);
  yPosition += 10;

  const colWidths = [30, 35, 40, 35, 30];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");

  let xPos = margin + 4;
  ["Year", "Revenue", "Operating", "COGS", "Net Profit"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += colWidths[i];
  });
  yPosition += 12;

  const plData = [
    ["2027", "GBP 1.17M", "GBP 409k", "GBP 117k", "GBP 644k"],
    ["2028", "GBP 6.71M", "GBP 2.35M", "GBP 671k", "GBP 3.69M"],
    ["2029", "GBP 9.10M", "GBP 3.19M", "GBP 910k", "GBP 5.01M"],
    ["2030", "GBP 12.53M", "GBP 4.39M", "GBP 1.25M", "GBP 6.89M"],
    ["2031", "GBP 14.92M", "GBP 5.22M", "GBP 1.49M", "GBP 8.21M"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  plData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 4 ? PDF_CONFIG.emerald : PDF_CONFIG.textGray));
      if (i === 4) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(cell, xPos, yPosition + 7);
      xPos += colWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 10;

  return yPosition;
};

/**
 * Render Revenue Growth visual with standardized fonts
 */
const renderRevenueGrowth = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Explainer box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 30, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, 30, 3, 3, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Revenue projections based on verified market assumptions", margin + 8, yPosition + 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Review UK Assumptions, Global Assumptions, and Revenue Model tabs for details.", margin + 8, yPosition + 22);
  yPosition += 40;

  // Revenue breakdown table
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Revenue Growth (2027-2031)", margin, yPosition);
  yPosition += 10;

  const colWidths = [30, 40, 45, 45];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");

  let xPos = margin + 4;
  ["Year", "UK Revenue", "Global Revenue", "Total"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += colWidths[i];
  });
  yPosition += 12;

  const revenueData = [
    ["2027", "GBP 1.17M", "--", "GBP 1.17M"],
    ["2028", "GBP 1.46M", "GBP 5.25M", "GBP 6.71M"],
    ["2029", "GBP 1.75M", "GBP 7.35M", "GBP 9.10M"],
    ["2030", "GBP 2.04M", "GBP 10.49M", "GBP 12.53M"],
    ["2031", "GBP 2.33M", "GBP 12.59M", "GBP 14.92M"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  revenueData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 3 ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
      if (i === 3) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(cell, xPos, yPosition + 7);
      xPos += colWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 12;

  // Key drivers
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Key Revenue Drivers:", margin, yPosition);
  yPosition += 10;

  const drivers = [
    "UK commercial launch 2027 with 1.0% penetration growing to 2.0% by 2031",
    "Global expansion from 2028: 0.25% penetration growing to 0.6% by 2031",
    "Blended ARPU of GBP 495.72/year across Essential, Essential Plus, Enterprise tiers",
    "Total addressable: 235,200 UK businesses + 4.23M global OECD businesses",
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  drivers.forEach((driver) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 4, yPosition - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(driver, margin + 10, yPosition);
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 10;

  return yPosition;
};

/**
 * Render UK Assumptions for Financials with standardized fonts
 */
const renderUKAssumptionsFinancials = (
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
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("UK Assumptions (Financial Modelling Basis)", margin, yPosition);
  yPosition += 12;

  // Market size box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 50, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("1. UK Real Estate Business Market", margin + 8, yPosition + 12);

  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("235,200", margin + 8, yPosition + 28);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("UK real estate businesses (5.6M total x 4.2%)", margin + 55, yPosition + 28);

  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Source: Office for National Statistics (ONS)", margin + 8, yPosition + 42);
  yPosition += 58;

  // Efficiency assumption box
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 50, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("2. Annual Efficiency Savings Per Business", margin + 8, yPosition + 12);

  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.text("GBP 6,000", margin + 8, yPosition + 28);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("per admin/document-handling role per year", margin + 55, yPosition + 28);

  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Basis: 20% efficiency gain on GBP 30,000 average junior salary", margin + 8, yPosition + 42);
  yPosition += 58;

  // AI investment readiness
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 40, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("3. AI Investment Readiness", margin + 8, yPosition + 12);

  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("65%", margin + 8, yPosition + 28);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text("of UK businesses primed to invest in AI (Deloitte, 2024)", margin + 35, yPosition + 28);
  yPosition += 48;

  // TAM/SAM summary
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 40, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Model Basis:", margin + 8, yPosition + 12);

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("TAM = 235,200 x GBP 6,000 = GBP 1.41B", margin + 8, yPosition + 24);
  doc.text("SAM = GBP 1.41B x 65% = GBP 917M", margin + 8, yPosition + 34);
  yPosition += 48;

  return yPosition;
};

/**
 * Render Market Penetration / Market Share Justification visual
 */
const renderMarketPenetration = (
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
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Market Share Justification", margin, yPosition);
  yPosition += 6;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("Why Hobson can credibly capture 6-10% of the UK market by 2030", margin, yPosition);
  yPosition += 14;

  // Justification points - 2 column layout
  const justifications = [
    { title: "Frictionless Adoption", desc: "Zero onboarding, works alongside existing tools — 2x faster penetration" },
    { title: "Fragmented Market", desc: "225,792 small firms, 6,350 medium — lightweight AI spreads via referrals" },
    { title: "White-Space Positioning", desc: "First AI for Document Intelligence -> Clarity -> Referenced Answers" },
    { title: "Benchmark Precedent", desc: "Vertical AI companies reached 1-3% in 3-5 years; Hobson doubles this" },
    { title: "AI Adoption Tailwinds", desc: "65% of organisations plan to increase AI investment (Deloitte)" },
    { title: "Favourable Unit Economics", desc: "~GBP 0.60 per unit onboarding cost enables aggressive scaling" },
  ];

  const colWidth = (maxWidth - 8) / 2;
  const cardHeight = 32;

  justifications.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + col * (colWidth + 8);
    const yPos = yPosition + row * (cardHeight + 6);

    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPos, colWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
    doc.roundedRect(xPos, yPos, colWidth, cardHeight, 3, 3, "S");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(item.title, xPos + 8, yPos + 12);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(item.desc, colWidth - 16);
    doc.text(descLines, xPos + 8, yPos + 22);
  });

  yPosition += 3 * (cardHeight + 6) + 10;

  // UK Market Share table
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("UK Market Share Projection", margin, yPosition);
  yPosition += 10;

  const colWidths = [30, 30, 80];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");

  let xPos = margin + 4;
  ["Year", "Share", "Rationale"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += colWidths[i];
  });
  yPosition += 12;

  const ukData = [
    ["2026", "-", "Pilot validation only"],
    ["2027", "0.4%", "UK commercial launch + first conversions"],
    ["2028", "1.4%", "Strong UK adoption + compounding referrals"],
    ["2029", "3%", "Brand leadership in UK emerges"],
    ["2030", "6-10%", "Category leader in UK"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  ukData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 1 ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
      if (i === 1) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(cell, xPos, yPosition + 7);
      xPos += colWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 12;

  // Summary box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 24, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Target: 6% UK + 2-4% international = 8-10% combined by 2030", margin + 8, yPosition + 14);
  yPosition += 30;

  return yPosition;
};

/**
 * Render P/L Assumptions visual with standardized fonts
 */
const renderPLAssumptions = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Section 1: Revenue Model
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 65, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.rect(margin, yPosition, 4, 65, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Revenue Model Assumptions", margin + 12, yPosition + 12);

  const revenueItems = [
    "Blended ARPU = GBP 41.31/month -> GBP 495.72/year",
    "Pricing mix: Essential, Essential Plus, Enterprise",
    "UK: 1.0% -> 2.0% penetration (2027-2031)",
    "Global: 0.25% -> 0.6% penetration (2028-2031)",
    "UK market: 235,200 businesses | Global: 4.23M",
  ];

  let itemY = yPosition + 24;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  revenueItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 16, itemY - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 22, itemY);
    itemY += 8;
  });
  yPosition += 73;

  // Section 2: COGS Assumptions
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 55, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.rect(margin, yPosition, 4, 55, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Cost of Goods Sold (COGS) Assumptions", margin + 12, yPosition + 12);

  const cogsItems = [
    "AI onboarding: ~GBP 0.60 per unit (5 docs average)",
    "Client onboarding: GBP 3-4 (small) to GBP 600-700 (large)",
    "Gross margin: ~95-97%",
  ];

  itemY = yPosition + 24;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  cogsItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 16, itemY - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 22, itemY);
    itemY += 8;
  });
  yPosition += 63;

  // Section 3: Infrastructure
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, yPosition, maxWidth, 45, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.rect(margin, yPosition, 4, 45, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Infrastructure Cost Assumptions", margin + 12, yPosition + 12);

  const infraItems = [
    "8-12% of revenue (scales with usage)",
    "Includes: LLM API, vector DB, knowledge graph, storage, monitoring",
  ];

  itemY = yPosition + 24;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  infraItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + 16, itemY - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 22, itemY);
    itemY += 8;
  });
  yPosition += 53;

  // Section 4: OpEx
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, 65, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.rect(margin, yPosition, 4, 65, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Operating Expense (OpEx) Assumptions", margin + 12, yPosition + 12);

  const opexItems = [
    "Internal team: 30-35% of revenue (early), falling to ~20% by 2031",
    "Core team: CEO, Head of Product, Marketing, Sales, Support",
    "Outsourced: 10-15% of revenue (engineering, marketing execution)",
    "Sales & Marketing: 15-20% of revenue",
  ];

  itemY = yPosition + 24;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  opexItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.amber);
    doc.circle(margin + 16, itemY - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 22, itemY);
    itemY += 8;
  });
  yPosition += 73;

  // Summary
  if (yPosition > pageHeight - 30) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, 24, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("EBITDA breakeven at ARR > GBP 5M | Net margins expanding to 40-55% at scale", margin + 8, yPosition + 14);
  yPosition += 30;

  return yPosition;
};

/**
 * Render Global Justification visual with standardized fonts
 */
const renderGlobalJustification = (
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
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Global Market Justification", margin, yPosition);
  yPosition += 6;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("Why the 18x OECD multiplier is defensible", margin, yPosition);
  yPosition += 14;

  // OECD methodology box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 55, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("OECD Business Density Methodology", margin + 8, yPosition + 12);

  const methodItems = [
    "UK baseline: 235,200 real estate businesses",
    "OECD markets: ~65 businesses per 1,000 people (consistent across UK, EU, US)",
    "Target population: 1.38B (UK, EU, US, Canada, Australia, NZ, Singapore)",
    "Multiplier: 1.38B / 67M UK = 20.6x, conservative 18x applied",
    "Result: 235,200 x 18 = 4.23M comparable businesses",
  ];

  let itemY = yPosition + 24;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  methodItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 12, itemY - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 18, itemY);
    itemY += 8;
  });
  yPosition += 63;

  // Why defensible box
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 50, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Why Same Penetration Rates Apply Globally", margin + 8, yPosition + 12);

  const defenseItems = [
    "Real estate sectors in US/EU have similar fragmentation patterns",
    "AI adoption rates globally mirror UK (35-36% CAGR)",
    "Category is globally underserved - no incumbent leader",
    "No integration required means universal onboarding",
  ];

  itemY = yPosition + 24;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  defenseItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 12, itemY - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 18, itemY);
    itemY += 8;
  });
  yPosition += 58;

  // TAM summary
  if (yPosition > pageHeight - 40) { doc.addPage(); yPosition = margin; }
  const colWidth = (maxWidth - 10) / 2;
  
  // UK TAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, colWidth, 35, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("UK TAM", margin + 8, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 1.41B", margin + 8, yPosition + 28);

  // Global TAM
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + colWidth + 10, yPosition, colWidth, 35, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Global TAM", margin + colWidth + 18, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 155.6B", margin + colWidth + 18, yPosition + 28);
  yPosition += 43;

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
  yPosition = renderSpacedText(doc, cleanedTitle, margin, yPosition, maxWidth, 8);
  yPosition += 2;

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
    const overviewLines = doc.splitTextToSize(cleanedOverview, maxWidth - 16);
    const boxHeight = overviewLines.length * 7 + 12; // More padding
    doc.rect(margin, yPosition, maxWidth, boxHeight, "F");
    // Use explicit line spacing for overview
    let overviewY = yPosition + 8;
    overviewLines.forEach((line: string) => {
      doc.text(line, margin + 8, overviewY);
      overviewY += 6; // Explicit 6pt line spacing
    });
    yPosition += boxHeight + 10;
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
    } else if (componentType === "landscape") {
      yPosition = renderMarketLandscape(doc, yPosition, margin, pageWidth, pageHeight);
    }
    // Roadmap & Product renderers
    else if (componentType === "earlyRoadmap") {
      yPosition = renderEarlyRoadmap(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "ganttChart") {
      yPosition = renderGanttChart(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "pilotClients") {
      yPosition = renderPilotClients(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "techStack") {
      yPosition = renderTechStack(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "simpleUI") {
      yPosition = renderSimpleUI(doc, yPosition, margin, pageWidth, pageHeight);
    }
    // Commercials renderers
    else if (componentType === "heuPricing") {
      yPosition = renderHEUPricing(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "revenueModel") {
      yPosition = renderRevenueModel(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "capitalRaiseStrategy") {
      yPosition = renderCapitalRaiseStrategy(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "costAssumptions") {
      yPosition = renderCostAssumptions(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "cacAssumptions") {
      yPosition = renderCACAssumptions(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "burnRateAssumptions") {
      yPosition = renderBurnRateAssumptions(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "onboardingCosts") {
      yPosition = renderOnboardingCosts(doc, yPosition, margin, pageWidth, pageHeight);
    }
    // Financials renderers
    else if (componentType === "plGrowth") {
      yPosition = renderPLGrowth(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "revenueGrowth") {
      yPosition = renderRevenueGrowth(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "ukAssumptionsFinancials") {
      yPosition = renderUKAssumptionsFinancials(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "marketPenetration" || componentType === "marketShareJustification") {
      yPosition = renderMarketPenetration(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "plAssumptions") {
      yPosition = renderPLAssumptions(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "globalJustification") {
      yPosition = renderGlobalJustification(doc, yPosition, margin, pageWidth, pageHeight);
    } else {
      const customContent = getCustomVisualContent(componentType);
      if (customContent.length > 0) {
        doc.setTextColor(...PDF_CONFIG.textDark);
        doc.setFontSize(PDF_CONFIG.fontSize.body);
        doc.setFont("helvetica", "normal");

        customContent.forEach((line) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
          }

          const cleanLine = sanitizeText(line);
          if (cleanLine === "") {
            yPosition += PDF_CONFIG.lineHeight.body;
          } else if (cleanLine.endsWith(":")) {
            // Section headers - bold but same size
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...PDF_CONFIG.textDark);
            doc.text(cleanLine, margin, yPosition);
            yPosition += PDF_CONFIG.lineHeight.loose;
            doc.setFont("helvetica", "normal");
          } else if (cleanLine.startsWith("-") || cleanLine.startsWith(">>")) {
            // List items - normal weight, not bold
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...PDF_CONFIG.textDark);
            doc.text(cleanLine, margin, yPosition);
            yPosition += PDF_CONFIG.lineHeight.body + 1;
          } else {
            // Regular text - normal weight
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...PDF_CONFIG.textDark);
            doc.text(cleanLine, margin, yPosition);
            yPosition += PDF_CONFIG.lineHeight.body + 1;
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
      doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
      doc.setFont("helvetica", "bold");
      const cleanedSectionTitle = sanitizeText(section.title);
      yPosition = renderSpacedText(doc, cleanedSectionTitle, margin, yPosition, maxWidth, PDF_CONFIG.lineHeight.loose);
      yPosition += 4;

      // Subtitle
      if (section.subtitle) {
        doc.setTextColor(...PDF_CONFIG.primaryColor);
        doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
        doc.setFont("helvetica", "bold");
        const cleanedSubtitle = sanitizeText(section.subtitle);
        yPosition = renderSpacedText(doc, cleanedSubtitle, margin, yPosition, maxWidth, PDF_CONFIG.lineHeight.body);
        yPosition += 4;
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

          // Text with proper line spacing
          doc.setTextColor(...PDF_CONFIG.textGray);
          doc.setFont("helvetica", "normal");
          const cleanedItem = sanitizeText(item);
          const itemEndY = renderSpacedText(doc, cleanedItem, margin + 8, yPosition, maxWidth - 12, 5);
          yPosition = itemEndY + 2;
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
        const conclusionLines = doc.splitTextToSize(cleanedConclusion, maxWidth - 20);
        const boxHeight = conclusionLines.length * 6 + 12; // More padding
        doc.roundedRect(margin, yPosition - 2, maxWidth, boxHeight, 2, 2, "FD");

        doc.setTextColor(...PDF_CONFIG.textGray);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        // Explicit line spacing for conclusion
        let conclusionY = yPosition + 6;
        conclusionLines.forEach((line: string) => {
          doc.text(line, margin + 10, conclusionY);
          conclusionY += 6;
        });
        yPosition += boxHeight + 6;
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
