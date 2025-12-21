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
    body: 5,            // Standard line spacing (tighter)
    tight: 4,           // Compact lists
    loose: 6,           // Headers, titles
  },
  spacing: {
    sectionGap: 8,       // Gap between major sections
    cardGap: 6,          // Gap between cards
    headingGap: 5,       // Gap between title and subtitle (was 3, now 5)
    paragraphGap: 4,     // Gap between paragraphs
    titleToContent: 6,   // Gap between header area and main content
  },
  // Standardized circle/icon sizes
  circleSize: {
    header: 4,           // Section headers (like Addressable Market)
    cardBadge: 2,        // Inside cards/boxes
    bullet: 1,           // Bullet points (minimal)
    pillarBadge: 3,      // Numbered pillar badges
    goalIcon: 2,         // Goal box icons
  },
  subtitleToBullets: 4,  // Gap between subtitle and bullet list
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
 * STANDARDIZED BOX SIZING SYSTEM
 * All box heights should be calculated dynamically based on content
 * to ensure consistent spacing across all PDF sections.
 * 
 * Standard padding values:
 * - paddingTop: 8pt (space from box top to first content)
 * - paddingBottom: 6pt (space from last content to box bottom)
 * - paddingX: 8pt (horizontal padding)
 */
const BOX_SIZING = {
  paddingTop: 6,
  paddingBottom: 4,
  paddingX: 6,
  iconSize: 8,         // Reduced from 12
  iconGap: 4,          // Gap after icon (reduced)
  titleHeight: 5,      // Height occupied by title text
  subtitleGap: 4,      // Gap between title and subtitle (reduced)
  contentGap: 4,       // Gap between header area and content (reduced)
};

/**
 * Calculate hero box height dynamically based on content
 * @param doc - jsPDF instance for measuring text
 * @param descText - Description text to measure
 * @param maxWidth - Maximum width for text wrapping
 * @param hasSubtitle - Whether box includes a subtitle
 */
const calculateHeroBoxHeight = (
  doc: jsPDF,
  descText: string,
  maxWidth: number,
  hasSubtitle: boolean = true
): number => {
  const descLines = doc.splitTextToSize(sanitizeText(descText), maxWidth - BOX_SIZING.paddingX * 2);
  const descHeight = descLines.length * PDF_CONFIG.lineHeight.body;
  
  // Header: title + subtitle + gap to description
  const titleHeight = 5; // Title line
  const subtitleHeight = hasSubtitle ? BOX_SIZING.subtitleGap + 5 : 0; // Subtitle line
  const subtitleToDescGap = PDF_CONFIG.subtitleToBullets + 4; // Gap between subtitle and description
  
  return BOX_SIZING.paddingTop + titleHeight + subtitleHeight + subtitleToDescGap + descHeight + BOX_SIZING.paddingBottom;
};

/**
 * Calculate box height based on number of items and line spacing
 * This prevents text from overflowing fixed-height boxes
 */
const calculateBoxHeight = (
  itemCount: number,
  headerHeight: number = 12,
  lineHeight: number = PDF_CONFIG.lineHeight.body,
  paddingBottom: number = 4
): number => {
  return headerHeight + (itemCount * lineHeight) + paddingBottom;
};

/**
 * Calculate dynamic card height for numbered section cards
 * Accounts for header, content rows, and padding
 */
const calculateSectionCardHeight = (
  contentRows: number,
  hasStatRow: boolean = false,
  hasTableRows: number = 0
): number => {
  const headerHeight = 20; // Title row + gap to content (was 10, now 20 to account for title at +12 and content at +24)
  const statRowHeight = hasStatRow ? 14 : 0; // Large stat + label (reduced)
  const tableHeight = hasTableRows * PDF_CONFIG.lineHeight.body;
  const padding = 8; // Bottom padding (increased from 6)
  return headerHeight + statRowHeight + tableHeight + (contentRows * PDF_CONFIG.lineHeight.body) + padding;
};

/**
 * Render a numbered section card with icon, title, and flexible content area
 * Returns the ending Y position
 */
const renderNumberedSectionCard = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  bgColor: [number, number, number],
  iconColor: [number, number, number],
  title: string
): { cardY: number; contentY: number } => {
  // Card background
  doc.setFillColor(...bgColor);
  doc.roundedRect(x, y, width, height, 3, 3, "F");
  
  // Number circle - uses pillarBadge size for numbered sections
  doc.setFillColor(...iconColor);
  doc.circle(x + 8, y + 10, PDF_CONFIG.circleSize.pillarBadge, "F");
  
  // Title
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(title, x + 16, y + 12);
  
  return { cardY: y + height, contentY: y + 24 };
};

/**
 * Standard card padding constants
 */
const CARD_PADDING = {
  horizontal: 10,
  vertical: 12,
  iconOffset: 20,      // Text offset when icon is present
  titleToContent: 14,  // Space between title and first content line
};

/**
 * Set font to page title style (18pt bold)
 */
const setPageTitleFont = (doc: jsPDF): void => {
  doc.setFontSize(PDF_CONFIG.fontSize.pageTitle);
  doc.setFont("helvetica", "bold");
};

/**
 * Set font to section title style (13pt bold)
 */
const setSectionTitleFont = (doc: jsPDF): void => {
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
};

/**
 * Set font to card title style (12pt bold)
 */
const setCardTitleFont = (doc: jsPDF): void => {
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
};

/**
 * Set font to body style (10pt normal)
 */
const setBodyFont = (doc: jsPDF): void => {
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
};

/**
 * Set font to body bold style (10pt bold)
 */
const setBodyBoldFont = (doc: jsPDF): void => {
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
};

/**
 * Set font to body small style (9pt normal)
 */
const setBodySmallFont = (doc: jsPDF): void => {
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
};

/**
 * Set font to caption style (8pt normal)
 */
const setCaptionFont = (doc: jsPDF): void => {
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.setFont("helvetica", "normal");
};

/**
 * Set font to stat style (16pt bold) for large numbers
 */
const setStatFont = (doc: jsPDF): void => {
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setFont("helvetica", "bold");
};

/**
 * Render a standard content card with consistent styling
 * Returns the Y position after the card
 */
const renderContentCard = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  bgColor: [number, number, number],
  borderColor?: [number, number, number],
  accentBarColor?: [number, number, number],
  accentBarWidth: number = 4
): number => {
  // Background
  doc.setFillColor(...bgColor);
  doc.roundedRect(x, y, width, height, 3, 3, "F");
  
  // Border if specified
  if (borderColor) {
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, height, 3, 3, "S");
  }
  
  // Accent bar if specified
  if (accentBarColor) {
    doc.setFillColor(...accentBarColor);
    doc.rect(x, y, accentBarWidth, height, "F");
  }
  
  return y + height;
};

/**
 * Render a section header with icon
 * Returns the Y position after the header
 * @param hasBulletsFollowing - if true, adds extra spacing for bullet list
 */
const renderSectionHeader = (
  doc: jsPDF,
  title: string,
  subtitle: string | null,
  x: number,
  y: number,
  iconColor: [number, number, number],
  textColor: [number, number, number],
  hasBulletsFollowing: boolean = false
): number => {
  // Icon circle aligned with text - uses header size
  doc.setFillColor(...iconColor);
  doc.circle(x + 4, y - 1, PDF_CONFIG.circleSize.header, "F");
  
  // Title
  doc.setTextColor(...textColor);
  setCardTitleFont(doc);
  doc.text(title, x + 14, y);
  
  let newY = y + PDF_CONFIG.spacing.headingGap;
  
  // Subtitle if provided
  if (subtitle) {
    doc.setTextColor(...textColor);
    setBodyFont(doc);
    doc.text(subtitle, x + 14, newY);
    newY += hasBulletsFollowing ? PDF_CONFIG.subtitleToBullets : PDF_CONFIG.spacing.paragraphGap;
  }
  
  return newY;
};

/**
 * Render bullet list with consistent styling
 * Returns the Y position after the list
 */
const renderBulletList = (
  doc: jsPDF,
  items: string[],
  x: number,
  y: number,
  maxWidth: number,
  bulletColor: [number, number, number],
  textColor: [number, number, number]
): number => {
  let currentY = y;
  setBodyFont(doc);
  
  items.forEach((item) => {
    // Bullet point - uses bullet size
    doc.setFillColor(...bulletColor);
    doc.circle(x + 3, currentY - 2, PDF_CONFIG.circleSize.bullet, "F");
    
    // Text - closer to bullet
    doc.setTextColor(...textColor);
    const lines = doc.splitTextToSize(sanitizeText(item), maxWidth - 10);
    lines.forEach((line: string) => {
      doc.text(line, x + 7, currentY);
      currentY += PDF_CONFIG.lineHeight.body;
    });
    currentY += 2; // Extra spacing between items
  });
  
  return currentY;
};

/**
 * Render a feature/traction card with icon, title, and subtitle
 */
const renderFeatureCard = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  subtitle: string,
  bgColor: [number, number, number],
  borderColor: [number, number, number],
  iconColor: [number, number, number]
): void => {
  // Card background
  doc.setFillColor(...bgColor);
  doc.roundedRect(x, y, width, height, 3, 3, "F");
  
  // Card border
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, width, height, 3, 3, "S");
  
  // Icon - filled circle inside card - align with title baseline
  const titleY = y + height / 2 - 2;
  doc.setFillColor(...iconColor);
  doc.circle(x + 12, titleY - 2, PDF_CONFIG.circleSize.cardBadge, "F");
  
  // Title
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodyBoldFont(doc);
  doc.text(title, x + 22, titleY);
  
  // Subtitle
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text(subtitle, x + 22, y + height / 2 + 10);
};

/**
 * Render a stat card with large value and label
 */
const renderStatCard = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  label: string,
  bgColor: [number, number, number],
  borderColor: [number, number, number],
  valueColor: [number, number, number]
): void => {
  // Card background
  doc.setFillColor(...bgColor);
  doc.roundedRect(x, y, width, height, 3, 3, "F");
  
  // Card border
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, width, height, 3, 3, "S");
  
  // Value - large centered
  doc.setTextColor(...valueColor);
  setStatFont(doc);
  doc.text(value, x + width / 2, y + height / 2 - 2, { align: "center" });
  
  // Label - small centered
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text(label, x + width / 2, y + height / 2 + 12, { align: "center" });
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
 * @param lineHeight - Height between lines (default: PDF_CONFIG.lineHeight.body)
 * @returns The Y position after the last line
 */
const renderSpacedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number = PDF_CONFIG.lineHeight.body
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
  lineHeight: number = PDF_CONFIG.lineHeight.body
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
 * Check if content will overflow page and add new page if needed
 * Returns the Y position (margin if new page added, current Y otherwise)
 */
const checkPageBreak = (
  doc: jsPDF,
  currentY: number,
  requiredHeight: number,
  pageHeight: number,
  margin: number
): number => {
  if (currentY + requiredHeight > pageHeight - margin) {
    doc.addPage();
    return margin;
  }
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
  setBodySmallFont(doc);
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
      setBodySmallFont(doc);
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
    
    const rowHeight = 22;
    const isHobson = competitor.competitor === "Hobson AI";
    
    // Alternating row background - matches on-screen bg-background / bg-muted/30
    if (isHobson) {
      doc.setFillColor(...PDF_CONFIG.primaryBg);
    } else if (rowIndex % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgWhite);
    } else {
      doc.setFillColor(...PDF_CONFIG.bgLight);
    }
    doc.rect(margin, yPosition, maxWidth, rowHeight, "F");
    
    // Draw cell borders
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
    
    // Cell content - use caption font for table cells
    setCaptionFont(doc);
    xPos = margin + 2;
    const cellY = yPosition + 5;
    
    // Competitor name
    doc.setFont("helvetica", "bold");
    if (isHobson) {
      doc.setTextColor(...PDF_CONFIG.primaryColor);
    } else {
      doc.setTextColor(...PDF_CONFIG.textDark);
    }
    const nameLines = doc.splitTextToSize(sanitizeText(competitor.competitor), colWidths[0] - 4);
    doc.text(nameLines, xPos, cellY);
    xPos += colWidths[0];
    
    // Reset to normal text
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
    
    // Reviews
    const reviewsText = competitor.reviews.map(r => `"${r}"`).join(", ");
    const reviewLines = doc.splitTextToSize(sanitizeText(reviewsText), colWidths[5] - 4);
    doc.text(reviewLines, xPos, cellY);
    xPos += colWidths[5];
    
    // Market Value
    doc.setTextColor(...PDF_CONFIG.textDark);
    const valueLines = doc.splitTextToSize(sanitizeText(competitor.marketValue), colWidths[6] - 4);
    doc.text(valueLines, xPos, cellY);
    
    yPosition += rowHeight;
  });
  
  return yPosition + 10;
};

/**
 * Render Executive Summary with visual styling matching on-screen component
 * Replicates: Why AI Fails section, The Hobson Approach, Market Opportunity, Traction cards
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

  // ===== OPENING STATEMENT =====
  // NOTE: This section must remain in sync with src/components/investor/ExecutiveSummaryVisual.tsx
  const boxX = margin;
  const boxW = maxWidth;
  const boxPaddingX = 12;
  const boxPaddingTop = 14;
  const boxPaddingBottom = 12;

  const openingStatement = "Hobson is building the intelligence infrastructure that Real Estate operations now require to function safely, efficiently, and at scale.";

  // --- Draw opening statement box ---
  setBodyFont(doc);
  const contentMaxWidth = boxW - boxPaddingX * 2;
  const openingLines = doc.splitTextToSize(sanitizeText(openingStatement), contentMaxWidth);
  const openingBoxH = boxPaddingTop + openingLines.length * PDF_CONFIG.lineHeight.body + boxPaddingBottom;

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(boxX, yPosition, boxW, openingBoxH, 4, 4, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.5);
  doc.roundedRect(boxX, yPosition, boxW, openingBoxH, 4, 4, "S");

  let openingY = yPosition + boxPaddingTop;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  openingLines.forEach((l: string) => {
    // Highlight "intelligence infrastructure" in primary color
    if (l.includes("intelligence infrastructure")) {
      const parts = l.split("intelligence infrastructure");
      const x = boxX + boxPaddingX;
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(parts[0], x, openingY);
      const part1Width = doc.getTextWidth(parts[0]);
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.text("intelligence infrastructure", x + part1Width, openingY);
      const highlightWidth = doc.getTextWidth("intelligence infrastructure");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(parts[1] || "", x + part1Width + highlightWidth, openingY);
    } else {
      doc.text(l, boxX + boxPaddingX, openingY);
    }
    openingY += PDF_CONFIG.lineHeight.body;
  });

  yPosition += openingBoxH + PDF_CONFIG.spacing.sectionGap;

  // ===== INVESTMENT RATIONALE BOX =====
  const para1 =
    "Hobson delivers AI-driven reasoning directly from source documents, with full traceability and auditability, inside existing workflows. Every obligation, exposure, valuation input, and compliance requirement is buried inside leases, titles, reports, and contracts. By replacing manual document handling, the hidden backbone of all operations, planning applications, funding due diligence, investment committee papers, and asset management, Hobson removes a growing source of structural cost, decision delay, and operational risk across Real Estate.";

  const founderNote =
    "Founded by the team behind Arthur Online, built and scaled to institutional adoption and acquired by Advent International and Aareon in 2021. Hobson is an AI platform born from firsthand experience of Real Estate operations at scale.";

  const calloutText = "This is not a productivity enhancement. It is the removal of a core operational bottleneck.";

  const enablesItems = [
    "Permanent reduction in document-driven staffing costs",
    "Faster, defensible decisions across operations, acquisitions and asset management",
    "Material reduction in errors and compliance exposure through traceable, source-linked outputs",
  ];

  const para2 =
    "Once document intelligence is trusted, it becomes infrastructure. What begins as reasoning becomes decision control, then automation, then a system-level advantage across the Real Estate stack.";

  const closing =
    "Hobson is the entry point for AI becoming a system of record for the Real Estate industry.";

  // --- Measure heights ---
  const para1Lines = doc.splitTextToSize(sanitizeText(para1), contentMaxWidth);
  const founderLines = doc.splitTextToSize(sanitizeText(founderNote), contentMaxWidth - 16);
  const para2Lines = doc.splitTextToSize(sanitizeText(para2), contentMaxWidth);
  const closingLines = doc.splitTextToSize(sanitizeText(closing), contentMaxWidth);

  const gapSm = 4;
  const gapMd = 8;
  const bulletGap = 2;

  const para1Height = para1Lines.length * PDF_CONFIG.lineHeight.body;
  const founderHeight = founderLines.length * PDF_CONFIG.lineHeight.body + 12; // box padding
  const para2Height = para2Lines.length * PDF_CONFIG.lineHeight.body;
  const closingHeight = closingLines.length * PDF_CONFIG.lineHeight.loose;
  const enablesItemsHeight = enablesItems.length * (PDF_CONFIG.lineHeight.body * 2 + bulletGap);

  const rationaleCalloutHeight = 12;

  const boxH =
    boxPaddingTop +
    14 + // header row
    gapMd +
    para1Height +
    gapMd +
    founderHeight +
    gapMd +
    rationaleCalloutHeight +
    gapMd +
    PDF_CONFIG.lineHeight.body + // "Hobson enables:"
    gapSm +
    enablesItemsHeight +
    gapMd +
    para2Height +
    gapMd +
    closingHeight +
    boxPaddingBottom;

  // --- Draw card ---
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(boxX, yPosition, boxW, boxH, 4, 4, "F");

  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.5);
  doc.roundedRect(boxX, yPosition, boxW, boxH, 4, 4, "S");

  // Header
  const headerY = yPosition + 14;
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 12, headerY - 2, 3, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Investment Rationale", margin + 20, headerY);

  // Content
  let contentY = headerY + 12;
  const textX = boxX + boxPaddingX;

  // Paragraph 1 - main description
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textDark);
  para1Lines.forEach((l: string) => {
    doc.text(l, textX, contentY);
    contentY += PDF_CONFIG.lineHeight.body;
  });

  contentY += gapMd;

  // Founder note box
  const founderBoxY = contentY - 6;
  const founderBoxH = founderLines.length * PDF_CONFIG.lineHeight.body + 12;
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(textX, founderBoxY, contentMaxWidth, founderBoxH, 2, 2, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(textX, founderBoxY, contentMaxWidth, founderBoxH, 2, 2, "S");

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  contentY = founderBoxY + 8;
  founderLines.forEach((l: string) => {
    // Highlight "Arthur Online" in bold
    if (l.includes("Arthur Online")) {
      const parts = l.split("Arthur Online");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.text(parts[0], textX + 8, contentY);
      const part1Width = doc.getTextWidth(parts[0]);
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFont("helvetica", "bold");
      doc.text("Arthur Online", textX + 8 + part1Width, contentY);
      const highlightWidth = doc.getTextWidth("Arthur Online");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFont("helvetica", "normal");
      doc.text(parts[1] || "", textX + 8 + part1Width + highlightWidth, contentY);
    } else {
      doc.text(l, textX + 8, contentY);
    }
    contentY += PDF_CONFIG.lineHeight.body;
  });

  contentY += gapMd + 4;

  // Callout: This is not a productivity enhancement
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(textX, contentY - 8, contentMaxWidth, 12, 2, 2, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.rect(textX, contentY - 8, 3, 12, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(calloutText), textX + 8, contentY);
  contentY += 16;

  // "Hobson enables:"
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("Hobson enables:", textX, contentY);
  contentY += PDF_CONFIG.lineHeight.body + gapSm;

  // Enables bullets with icons
  doc.setFont("helvetica", "normal");
  enablesItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(textX + 3, contentY - 2, PDF_CONFIG.circleSize.bullet, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    const lines = doc.splitTextToSize(sanitizeText(item), contentMaxWidth - 10);
    lines.forEach((line: string, lineIdx: number) => {
      // Bold the first phrase in each item
      if (lineIdx === 0) {
        const boldPhrases = ["Permanent reduction", "Faster, defensible decisions", "Material reduction"];
        const matchedPhrase = boldPhrases.find(p => line.includes(p));
        if (matchedPhrase) {
          const parts = line.split(matchedPhrase);
          doc.setFont("helvetica", "bold");
          doc.text(matchedPhrase, textX + 7, contentY);
          const boldWidth = doc.getTextWidth(matchedPhrase);
          doc.setFont("helvetica", "normal");
          doc.text(parts[1] || "", textX + 7 + boldWidth, contentY);
        } else {
          doc.text(line, textX + 7, contentY);
        }
      } else {
        doc.text(line, textX + 7, contentY);
      }
      contentY += PDF_CONFIG.lineHeight.body;
    });
    contentY += bulletGap;
  });

  contentY += gapMd;

  // Paragraph 2
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  para2Lines.forEach((l: string) => {
    doc.text(l, textX, contentY);
    contentY += PDF_CONFIG.lineHeight.body;
  });

  contentY += gapMd;

  // Closing statement (bold with "system of record" in primary color)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PDF_CONFIG.textDark);
  closingLines.forEach((l: string) => {
    if (l.includes("system of record")) {
      const parts = l.split("system of record");
      doc.text(parts[0], textX, contentY);
      const part1Width = doc.getTextWidth(parts[0]);
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.text("system of record", textX + part1Width, contentY);
      const highlightWidth = doc.getTextWidth("system of record");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(parts[1] || "", textX + part1Width + highlightWidth, contentY);
    } else {
      doc.text(l, textX, contentY);
    }
    contentY += PDF_CONFIG.lineHeight.loose;
  });

  yPosition += boxH + PDF_CONFIG.spacing.sectionGap;


  // ===== MARKET OPPORTUNITY SECTION =====

  // ===== MARKET OPPORTUNITY SECTION =====
  // Check for page break
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }
  
  // Section header with globe icon
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 4, yPosition - 1, PDF_CONFIG.circleSize.header, "F");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Market Opportunity", margin + 12, yPosition);
  yPosition += PDF_CONFIG.spacing.titleToContent;
  
  // Three market cards
  const cardWidth = (maxWidth - 10) / 3;
  const cardHeight = 32;
  const cardSpacing = 5;
  
  const marketData = [
    { value: "GBP 1.41B", label: "UK" },
    { value: "GBP 15.5B", label: "Europe" },
    { value: "GBP 155.6B", label: "Global" },
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
    doc.setFontSize(PDF_CONFIG.fontSize.stat);
    doc.setFont("helvetica", "bold");
    doc.text(data.value, cardX + cardWidth / 2, yPosition + 14, { align: "center" });
    
    // Label
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(data.label, cardX + cardWidth / 2, yPosition + 24, { align: "center" });
  });
  
  yPosition += cardHeight + PDF_CONFIG.spacing.cardGap;
  
  // Market description callout box with left border
  const calloutHeight = 28;
  const calloutX = margin;
  const calloutWidth = maxWidth;
  
  // Draw callout background
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(calloutX, yPosition, calloutWidth, calloutHeight, 3, 3, "F");
  
  // Draw left border (4px purple)
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.roundedRect(calloutX, yPosition, 3, calloutHeight, 1.5, 1.5, "F");
  
  // Callout text
  const calloutTextX = calloutX + 10;
  let calloutTextY = yPosition + 8;
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Real estate operations are structurally inefficient.", calloutTextX, calloutTextY);
  
  calloutTextY += 5;
  doc.setFont("helvetica", "normal");
  doc.text("Over ", calloutTextX, calloutTextY);
  const overWidth = doc.getTextWidth("Over ");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("20% of professional time", calloutTextX + overWidth, calloutTextY);
  const timeWidth = doc.getTextWidth("20% of professional time");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  doc.text(" is lost to document handling. Hobson converts this into ", calloutTextX + overWidth + timeWidth, calloutTextY);
  
  calloutTextY += 5;
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("permanent operating leverage", calloutTextX, calloutTextY);
  const levWidth = doc.getTextWidth("permanent operating leverage");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  doc.text("—value AI-native operators will capture.", calloutTextX + levWidth, calloutTextY);
  
  yPosition += calloutHeight + PDF_CONFIG.spacing.sectionGap;

  // ===== TRACTION & MILESTONES SECTION =====
  const tractionCardWidth = (maxWidth - 10) / 2;
  const tractionCardHeight = 44;
  const tractionSpacing = 8;
  const cardTextMaxWidth = tractionCardWidth - 28;
  const fullWidthCardHeight = 36;

  const footerReserve = 18;
  const tractionHeaderHeight = 14;
  const tractionBlockHeight =
    tractionHeaderHeight + 2 * (tractionCardHeight + tractionSpacing) + fullWidthCardHeight + 12;

  if (yPosition + tractionBlockHeight > pageHeight - footerReserve) {
    doc.addPage();
    yPosition = margin;
  }

  // Extra spacing before Traction section
  yPosition += 8;

  // Section header with rocket icon
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 4, yPosition - 1, PDF_CONFIG.circleSize.header, "F");

  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Traction & Execution Momentum", margin + 14, yPosition);
  yPosition += 14;

  const tractionData = [
    { title: "MVP Launch — Q1 2026", subtitle: "On track, with scope defined by live partner workflows" },
    { title: "Validated with 4 Operating Partners", subtitle: "Use cases proven inside real estate organisations" },
    { title: "98% Model Accuracy", subtitle: "Measured on proprietary, industry-specific datasets" },
    { title: "Multi-Document Reasoning", subtitle: "Legal, compliance, and operational documents, analysed together" },
  ];
  
  tractionData.forEach((data, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + col * (tractionCardWidth + tractionSpacing);
    const cardY = yPosition + row * (tractionCardHeight + tractionSpacing);
    
    doc.setFillColor(...PDF_CONFIG.blueBg);
    doc.roundedRect(cardX, cardY, tractionCardWidth, tractionCardHeight, 3, 3, "F");
    
    doc.setDrawColor(...PDF_CONFIG.blueBorder);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, cardY, tractionCardWidth, tractionCardHeight, 3, 3, "S");
    
    const titleY = cardY + 14;
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(cardX + 10, titleY - 2, PDF_CONFIG.circleSize.cardBadge, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    
    const titleLines = doc.splitTextToSize(data.title, cardTextMaxWidth);
    doc.text(titleLines[0], cardX + 20, titleY);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    const subtitleLines = doc.splitTextToSize(data.subtitle, cardTextMaxWidth);
    let subtitleY = cardY + 26;
    subtitleLines.forEach((line: string) => {
      doc.text(line, cardX + 20, subtitleY);
      subtitleY += 5;
    });
  });
  
  yPosition += 2 * (tractionCardHeight + tractionSpacing);
  
  // Domain-Trained AI - full-width card
  const fullWidthCardY = yPosition;
  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, fullWidthCardY, maxWidth, fullWidthCardHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.blueBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, fullWidthCardY, maxWidth, fullWidthCardHeight, 3, 3, "S");
  
  const domainTitleY = fullWidthCardY + 14;
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 10, domainTitleY - 2, PDF_CONFIG.circleSize.cardBadge, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Domain-Trained AI", margin + 20, domainTitleY);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Purpose-built for real estate complexity, reliability, and auditability", margin + 20, fullWidthCardY + 26);
  
  yPosition += fullWidthCardHeight + 12;

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

  // Subtitle only - main title "Why Now?" already rendered by renderTabContent
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyFont(doc);
  doc.text("The Perfect Moment for AI Clarity in Real Estate", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 14;

  const sections = [
    {
      number: "1",
      title: "Technology Has Finally Caught Up",
      intro: "For years, real estate workflows were too messy for past-generation technology. Today:",
      bullets: [
        "Add the right layer on top of an LLM, and you get specialised AI with production-grade accuracy",
        "Document intelligence routinely hits 95%+ extraction quality",
        "Infrastructure costs have fallen 10x in three years",
        "Real-time AI inference is cheap enough to deploy at scale",
      ],
      conclusion: "The technology to solve document problems properly didn't exist until now. Now it does - and it's affordable.",
    },
    {
      number: "2",
      title: "The Industry Is Ready - and Desperate - for Efficiency",
      intro: "Real estate operators have never been under this much pressure:",
      bullets: [
        "65% of businesses plan to increase AI spend (Deloitte)",
        "COVID forced digital maturity a decade early",
        "Remote workflows normalised digital document dependency",
        "Talent shortages make manual processes unsustainable",
      ],
      conclusion: "The market isn't experimenting with AI anymore - it's actively shopping for it.",
    },
    {
      number: "3",
      title: "Massive Competitive White Space - Nobody Owns This Category Yet",
      intro: "Despite the size of the opportunity:",
      bullets: [
        "No AI-native leader exists in document intelligence for real estate",
        "Legacy PropTech is too slow and too integrated",
        "Horizontal AI tools can't meet regulatory or accuracy expectations",
        "A 12-18 month window exists to become the default category standard",
      ],
      conclusion: "This is one of the last major AI verticals without a clear winner.",
    },
    {
      number: "4",
      title: "Regulation Is Making Documents More Complex - Not Less",
      intro: "Real estate compliance is exploding:",
      bullets: [
        "New transparency and audit trail requirements",
        "ESG reporting now requires document-linked evidence",
        "Risk, safety, and building regulations tightening yearly",
        "Data residency rules favour UK/EU-based AI solutions",
      ],
      conclusion: "More rules -> more documents -> more cost -> more need for automation.",
    },
    {
      number: "5",
      title: "Economics Are Forcing Operators to Remove Waste",
      intro: "Margins are compressing across the industry:",
      bullets: [
        "Operational costs rising",
        "Headcount limits across property and asset management",
        "Labour inflation making manual work unaffordable",
        "AI delivers ~GBP 6,000 per role per year in time savings",
      ],
      conclusion: "When budgets tighten, tools that eliminate waste get adopted fastest.",
    },
  ];

  sections.forEach((section) => {
    // Calculate dynamic card height based on content - tighter spacing
    const titleHeight = 10;
    const introHeight = 8;
    const bulletsHeight = section.bullets.length * PDF_CONFIG.lineHeight.body;
    const conclusionHeight = 10;
    const padding = 10; // Reduced padding
    const cardHeight = titleHeight + introHeight + bulletsHeight + conclusionHeight + padding;
    
    // Check for page break with calculated height
    yPosition = checkPageBreak(doc, yPosition, cardHeight + 8, pageHeight, margin);

    // Section card with dynamic height
    renderContentCard(doc, margin, yPosition, maxWidth, cardHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

    // Number badge (filled circle) - pillarBadge size
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.pillarBadge, "F");

    // Title
    doc.setTextColor(...PDF_CONFIG.textDark);
    setCardTitleFont(doc);
    doc.text(section.title, margin + 20, yPosition + 12);

    // Intro - reduced gap after title
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    doc.text(section.intro, margin + 20, yPosition + 20);

    // Bullets with proper spacing using body font - add subtitleToBullets gap
    let bulletY = yPosition + 20 + PDF_CONFIG.subtitleToBullets + PDF_CONFIG.lineHeight.body;
    setBodySmallFont(doc);
    section.bullets.forEach((bullet) => {
      doc.setFillColor(...PDF_CONFIG.primaryLight);
      doc.circle(margin + 22, bulletY - 1.5, PDF_CONFIG.circleSize.bullet, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(bullet, margin + 28, bulletY);
      bulletY += PDF_CONFIG.lineHeight.body;
    });

    // Conclusion (left border accent) - position relative to bullets end
    const conclusionY = bulletY + 2;
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(margin + 6, conclusionY - 4, 2, 6, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.setFont("helvetica", "italic");
    doc.text(section.conclusion, margin + 12, conclusionY);

    yPosition += cardHeight + PDF_CONFIG.spacing.cardGap;
  });

  // Convergence section - bright purple background with white text
  yPosition = checkPageBreak(doc, yPosition, 65, pageHeight, margin);

  // Convergence background - solid purple (primary color)
  const convergenceHeight = 60;
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.roundedRect(margin, yPosition, maxWidth, convergenceHeight, 4, 4, "F");

  // Header with icon
  doc.setFillColor(255, 255, 255); // white circle
  doc.circle(pageWidth / 2 - 40, yPosition + 12, PDF_CONFIG.circleSize.header, "F");
  doc.setTextColor(255, 255, 255); // white text
  setCardTitleFont(doc);
  doc.text("The Convergence", pageWidth / 2, yPosition + 14, { align: "center" });

  // Points as pills with lighter purple background
  const points = ["Technology ready", "Market ready", "Competition absent", "Regulation rising", "Economics demand efficiency"];
  setBodySmallFont(doc);
  
  // Row 1: first 3 points
  let pillY = yPosition + 26;
  let totalWidth1 = 0;
  points.slice(0, 3).forEach((point) => {
    totalWidth1 += doc.getTextWidth(point) + 14;
  });
  let pillX = (pageWidth - totalWidth1) / 2;
  
  points.slice(0, 3).forEach((point) => {
    const textWidth = doc.getTextWidth(point) + 10;
    // Lighter purple pill (blend of purple and white)
    doc.setFillColor(180, 140, 220); // lighter purple
    doc.roundedRect(pillX, pillY - 4, textWidth, 10, 5, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(point, pillX + 5, pillY + 2);
    pillX += textWidth + 4;
  });
  
  // Row 2: last 2 points
  pillY += 13;
  let totalWidth2 = 0;
  points.slice(3).forEach((point) => {
    totalWidth2 += doc.getTextWidth(point) + 14;
  });
  pillX = (pageWidth - totalWidth2) / 2;
  
  points.slice(3).forEach((point) => {
    const textWidth = doc.getTextWidth(point) + 10;
    doc.setFillColor(180, 140, 220); // lighter purple
    doc.roundedRect(pillX, pillY - 4, textWidth, 10, 5, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(point, pillX + 5, pillY + 2);
    pillX += textWidth + 4;
  });

  // Closing statement - white text
  doc.setTextColor(255, 255, 255);
  setBodyBoldFont(doc);
  doc.text("'documents everywhere' -> 'answers instantly.' Hobson leads this shift.", pageWidth / 2, yPosition + 54, { align: "center" });

  yPosition += convergenceHeight + PDF_CONFIG.spacing.sectionGap;
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
  const introHeight = 40;
  renderContentCard(doc, margin, yPosition, maxWidth, introHeight, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Our Strategic Approach", margin + 10, yPosition + 10);

  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  const introText = "Hobson combines AI innovation with deep real estate experience to create a platform that feels familiar, works instantly, and delivers clarity without disruption.";
  const introEndY = renderSpacedText(doc, introText, margin + 10, yPosition + 18, maxWidth - 20, PDF_CONFIG.lineHeight.body);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCaptionFont(doc);
  const pillarsText = "Built around three pillars: Product, Brand, and Business Model - aligned toward a 2027 commercial launch, funded by a 2026 seed round.";
  renderSpacedText(doc, pillarsText, margin + 10, introEndY + 1, maxWidth - 20, PDF_CONFIG.lineHeight.tight);

  yPosition += introHeight + PDF_CONFIG.spacing.sectionGap;

  // ===== PILLAR 1: PRODUCT =====
  yPosition = checkPageBreak(doc, yPosition, 70, pageHeight, margin);

  // Number badge - pillarBadge size
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.pillarBadge, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Product Approach", margin + 18, yPosition + 7);
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Built for the way real estate actually works", margin + 18, yPosition + 14);
  yPosition += 14 + PDF_CONFIG.subtitleToBullets + PDF_CONFIG.lineHeight.body;

  const productItems = [
    "Unifies scattered information across documents, emails, and systems",
    "A simple interface with zero learning curve",
    "Works alongside existing workflows - no disruption",
    "Designed to earn trust: citations, transparency, no hallucinations",
    "Becomes more helpful over time -> proactive support, guided workflows",
    "Current business activity (pilots, document processing, insights) directly informs the production platform",
  ];

  yPosition = renderBulletList(doc, productItems, margin + 4, yPosition, maxWidth - 8, PDF_CONFIG.blue, PDF_CONFIG.textDark);
  yPosition += 2;

  // Goal box
  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, 12, 2, 2, "F");
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 16, yPosition + 6, PDF_CONFIG.circleSize.goalIcon, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("Goal: A clarity engine that feels like part of the team on day one.", margin + 24, yPosition + 8);
  yPosition += 16;

  // ===== PILLAR 2: BRAND =====
  yPosition = checkPageBreak(doc, yPosition, 70, pageHeight, margin);

  // Number badge - pillarBadge size
  doc.setFillColor(...PDF_CONFIG.rose);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.pillarBadge, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Brand Approach", margin + 18, yPosition + 7);
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Human, helpful, and honest", margin + 18, yPosition + 14);
  yPosition += 14 + PDF_CONFIG.subtitleToBullets + PDF_CONFIG.lineHeight.body;

  const brandItems = [
    { label: "Personalisation", desc: "Adapts to context and role" },
    { label: "Integrity", desc: "Transparent, visible sources" },
    { label: "Expectations", desc: "Essentials first, then expand" },
    { label: "Resolution", desc: "Act on feedback quickly" },
    { label: "Time & Effort", desc: "Every interaction effortless" },
    { label: "Empathy", desc: "Built for real-world pressure" },
  ];

  // 3x2 grid of brand cards
  const brandCardWidth = (maxWidth - 24) / 3;
  const brandCardHeight = 22;
  brandItems.forEach((item, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const cardX = margin + 8 + col * (brandCardWidth + 4);
    const cardY = yPosition + row * (brandCardHeight + 4);

    renderContentCard(doc, cardX, cardY, brandCardWidth, brandCardHeight, PDF_CONFIG.roseBg, PDF_CONFIG.roseBorder);

    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodyBoldFont(doc);
    doc.text(item.label, cardX + 5, cardY + 9);
    doc.setTextColor(...PDF_CONFIG.textGray);
    setCaptionFont(doc);
    doc.text(item.desc, cardX + 5, cardY + 17);
  });
  yPosition += 2 * (brandCardHeight + 4) + 4;

  // Goal box
  doc.setFillColor(...PDF_CONFIG.roseBg);
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, 12, 2, 2, "F");
  doc.setFillColor(...PDF_CONFIG.rose);
  doc.circle(margin + 16, yPosition + 6, PDF_CONFIG.circleSize.goalIcon, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("Goal: A brand that embodies Innovation without disruption.", margin + 24, yPosition + 8);
  yPosition += 16;

  // ===== PILLAR 3: BUSINESS =====
  yPosition = checkPageBreak(doc, yPosition, 80, pageHeight, margin);

  // Number badge - pillarBadge size
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.pillarBadge, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Business Approach", margin + 18, yPosition + 7);
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Built for mass adoption and rapid scaling", margin + 18, yPosition + 14);
  yPosition += 14 + PDF_CONFIG.subtitleToBullets + PDF_CONFIG.lineHeight.body;

  // No fees cards (3 emerald cards)
  const noFeeItems = ["No licence fees", "No per-user fees", "No per-asset fees"];
  const noFeeCardWidth = (maxWidth - 20) / 3;
  noFeeItems.forEach((item, idx) => {
    const cardX = margin + 8 + idx * (noFeeCardWidth + 4);
    renderContentCard(doc, cardX, yPosition, noFeeCardWidth, 16, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(cardX + noFeeCardWidth / 2, yPosition + 5, PDF_CONFIG.circleSize.goalIcon, "F");
    doc.setTextColor(...PDF_CONFIG.emerald);
    setCaptionFont(doc);
    doc.setFont("helvetica", "bold");
    doc.text(item, cardX + noFeeCardWidth / 2, yPosition + 12, { align: "center" });
  });
  yPosition += 20;

  // Business model cards (2x2 amber cards)
  const bizItems = [
    { label: "Usage-Based Pricing", desc: "Pay via HEUs - only for what you use" },
    { label: "Full Transparency", desc: "See exactly what Hobson did and why" },
    { label: "Low Base Cost", desc: "Frictionless entry for any business size" },
    { label: "Flexible Billing", desc: "Enables high-volume market capture" },
  ];
  const bizCardWidth = (maxWidth - 16) / 2;
  const bizCardHeight = 20;
  bizItems.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + 8 + col * (bizCardWidth + 4);
    const cardY = yPosition + row * (bizCardHeight + 4);

    renderContentCard(doc, cardX, cardY, bizCardWidth, bizCardHeight, PDF_CONFIG.amberBg, PDF_CONFIG.amberBorder);

    doc.setFillColor(...PDF_CONFIG.amber);
    doc.circle(cardX + 7, cardY + 7, PDF_CONFIG.circleSize.goalIcon, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, cardX + 13, cardY + 8);
    doc.setTextColor(...PDF_CONFIG.textGray);
    setCaptionFont(doc);
    doc.text(item.desc, cardX + 13, cardY + 16);
  });
  yPosition += 2 * (bizCardHeight + 4) + 4;

  // Goal box
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, 12, 2, 2, "F");
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 16, yPosition + 6, PDF_CONFIG.circleSize.goalIcon, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("Goal: Category-defining AI document intelligence layer.", margin + 24, yPosition + 8);
  yPosition += 16;

  // ===== WHY WE RAISE IN 2026 =====
  yPosition = checkPageBreak(doc, yPosition, 50, pageHeight, margin);

  // Rocket badge - pillarBadge size
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.pillarBadge, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Why We Raise in 2026", margin + 18, yPosition + 7);
  yPosition += 12;

  // Raise box
  const raiseHeight = 42;
  renderContentCard(doc, margin + 8, yPosition, maxWidth - 16, raiseHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.text("To deliver a 2027 commercial launch, we need to complete:", margin + 14, yPosition + 10);

  const raiseItems = ["Full production platform", "AI scaling", "Stability, QA, security", "Core hiring", "GTM development", "Pilot conversion"];
  let raiseX = margin + 14;
  let raiseY = yPosition + 18;
  setCaptionFont(doc);
  raiseItems.forEach((item, idx) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(raiseX + 3, raiseY, PDF_CONFIG.circleSize.bullet, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, raiseX + 8, raiseY + 1);
    if (idx === 2) {
      raiseX = margin + 14;
      raiseY += PDF_CONFIG.lineHeight.body;
    } else {
      raiseX += 54;
    }
  });

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodySmallFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("We raise in 2026 to ensure everything is in place before revenue begins in 2027.", margin + 14, yPosition + 36);

  yPosition += raiseHeight + PDF_CONFIG.spacing.sectionGap;
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
  const pageWidthCalc = pageWidth;

  // Description only - main title "Customer Segmentation" already rendered by renderTabContent
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  yPosition = renderSpacedTextCentered(
    doc,
    "Hobson is designed to meet the needs of real estate professionals across all operator sizes—each with distinct challenges, but a shared need for clarity.",
    pageWidthCalc / 2,
    yPosition,
    maxWidth - 20,
    PDF_CONFIG.lineHeight.body
  );
  yPosition += 8;

  const segments = [
    {
      title: "Large Operators",
      employees: "50-250 employees",
      color: PDF_CONFIG.blue,
      bgColor: [239, 246, 255] as [number, number, number],
      challenge: "High-admin organisations struggling with scattered data and slow information retrieval",
      need: "Automation and accuracy at scale",
    },
    {
      title: "Medium Operators",
      employees: "10-49 employees",
      color: PDF_CONFIG.primaryColor,
      bgColor: PDF_CONFIG.primaryBgLight,
      challenge: "Agile teams overwhelmed by inboxes and shared drives",
      need: "Efficient, low-overhead tools that eliminate manual searching",
    },
    {
      title: "Small Operators",
      employees: "1-9 employees",
      color: PDF_CONFIG.emerald,
      bgColor: [236, 253, 245] as [number, number, number],
      challenge: "Time-poor owner-operators with no time for complex tools",
      need: "Simple, low-cost assistant that works instantly without onboarding",
    },
  ];

  segments.forEach((segment) => {
    yPosition = checkPageBreak(doc, yPosition, 56, pageHeight, margin);

    const cardHeight = 52; // Reduced height
    renderContentCard(doc, margin, yPosition, maxWidth, cardHeight, segment.bgColor, segment.color);

    // Icon circle - cardBadge size (inside card) - align with title baseline
    const segmentTitleY = yPosition + 10;
    doc.setFillColor(...segment.color);
    doc.circle(margin + 10, segmentTitleY - 2, PDF_CONFIG.circleSize.cardBadge, "F");

    // Title & employees
    doc.setTextColor(...PDF_CONFIG.textDark);
    setCardTitleFont(doc);
    doc.text(segment.title, margin + 20, segmentTitleY);
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    doc.text(`(${segment.employees})`, margin + 20, yPosition + 18);

    // Challenge - reduced gap between label and content
    setCaptionFont(doc);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("CHALLENGE", margin + 10, yPosition + 28);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    renderSpacedText(doc, segment.challenge, margin + 10, yPosition + 34, maxWidth / 2 - 25, PDF_CONFIG.lineHeight.tight);

    // Need - reduced gap between label and content
    setCaptionFont(doc);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("WHAT THEY NEED", margin + maxWidth / 2 + 5, yPosition + 28);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    renderSpacedText(doc, segment.need, margin + maxWidth / 2 + 5, yPosition + 34, maxWidth / 2 - 25, PDF_CONFIG.lineHeight.tight);

    yPosition += cardHeight + PDF_CONFIG.spacing.cardGap;
  });

  // Footer insight
  renderContentCard(doc, margin, yPosition, maxWidth, 14, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.text("One platform, three experiences", margin + 8, yPosition + 9);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(" — Hobson adapts to the complexity and scale of each operator type.", margin + 8 + doc.getTextWidth("One platform, three experiences"), yPosition + 9);
  yPosition += 18;

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

  // Note: Tab title "UK Market Assumptions" is already rendered by renderTabContent
  // Only render subtitle here
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  doc.text("Evidence-based framework for market sizing", margin, yPosition);
  yPosition += 12;

  // Section 1: Market Size (dynamic height + wrap-safe)
  const statsLeftX = margin + 12;
  const statsRightX = margin + maxWidth / 2 + 8;
  const statsColWidth = maxWidth / 2 - 20;

  const leftStat = "5.6M";
  const leftLabel = "Total UK businesses";
  const rightStat = "235,200";
  const rightLabel = "Real estate businesses (4.2%)";

  setBodyFont(doc);
  const leftLabelLines = doc.splitTextToSize(sanitizeText(leftLabel), statsColWidth);
  const rightLabelLines = doc.splitTextToSize(sanitizeText(rightLabel), statsColWidth);
  const labelLineHeight = PDF_CONFIG.lineHeight.body;
  const maxLabelLines = Math.max(leftLabelLines.length, rightLabelLines.length);

  const section1Height = Math.max(36, 36 + (maxLabelLines * labelLineHeight) + 6);

  yPosition = checkPageBreak(doc, yPosition, section1Height + 8, pageHeight, margin);
  const statsY = yPosition + 28;
  const labelY = statsY + 8;

  renderContentCard(doc, margin, yPosition, maxWidth, section1Height, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.pillarBadge, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("1. Size of the UK Real Estate Business Market", margin + 16, yPosition + 12);

  // Left stat block
  setStatFont(doc);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text(leftStat, statsLeftX, statsY);
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  leftLabelLines.forEach((line: string, idx: number) => {
    doc.text(line, statsLeftX, labelY + idx * labelLineHeight);
  });

  // Right stat block
  setStatFont(doc);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text(rightStat, statsRightX, statsY);
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  rightLabelLines.forEach((line: string, idx: number) => {
    doc.text(line, statsRightX, labelY + idx * labelLineHeight);
  });

  yPosition += section1Height + 8;

  // Section 2: Business Size Breakdown - calculate dynamic height
  const sizeData = [
    { size: "Small (1-9)", pct: "96%", count: "225,792" },
    { size: "Medium (10-49)", pct: "2.7%", count: "6,350" },
    { size: "Large (50-249)", pct: "0.6%", count: "1,411" },
    { size: "Enterprise (250+)", pct: "0.1%", count: "235" },
  ];
  const section2Height = calculateSectionCardHeight(0, false, sizeData.length);
  yPosition = checkPageBreak(doc, yPosition, section2Height + 8, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, section2Height, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.pillarBadge, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("2. Business Size Breakdown (Real Estate Only)", margin + 16, yPosition + 12);
  
  let tableY = yPosition + 24;
  setBodyFont(doc);
  sizeData.forEach((row) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(row.size, margin + 12, tableY);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(row.pct, margin + 70, tableY);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(row.count, margin + 100, tableY);
    tableY += PDF_CONFIG.lineHeight.body;
  });
  yPosition += section2Height + 8;

  // Section 3: AI Investment Readiness
  yPosition = checkPageBreak(doc, yPosition, 40, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 36, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.pillarBadge, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("3. AI Investment Readiness", margin + 16, yPosition + 12);
  setStatFont(doc);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("65%", margin + 12, yPosition + 28);
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("of UK businesses are primed to invest in AI (Source: Deloitte)", margin + 36, yPosition + 28);
  yPosition += 44;

  // Section 4: Labour Cost
  yPosition = checkPageBreak(doc, yPosition, 40, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 36, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.pillarBadge, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("4. Labour Cost Baseline", margin + 16, yPosition + 12);
  setStatFont(doc);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("£30,000", margin + 12, yPosition + 28);
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Average junior real estate salary", margin + 52, yPosition + 28);
  yPosition += 44;

  // Section 5: Efficiency Gain
  yPosition = checkPageBreak(doc, yPosition, 40, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 36, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.pillarBadge, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("5. AI Efficiency Gain Assumption — 20%", margin + 16, yPosition + 12);
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Based on Forbes, Morgan Stanley, and Drooms research on AI in real estate", margin + 12, yPosition + 26);
  yPosition += 44;

  // Section 6: Financial Impact
  yPosition = checkPageBreak(doc, yPosition, 40, pageHeight, margin);
  const greenBg: [number, number, number] = [236, 253, 245];
  renderContentCard(doc, margin, yPosition, maxWidth, 36, greenBg, PDF_CONFIG.emerald);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.pillarBadge, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("6. Financial Impact: 20% efficiency gain =", margin + 16, yPosition + 12);
  setStatFont(doc);
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.text("£6,000", margin + 120, yPosition + 12);
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("annual saving per admin/document-handling role", margin + 12, yPosition + 26);
  yPosition += 44;

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

  // TAM Box - dynamic height based on content
  const tamBoxHeight = 38; // Header (10) + 3 items × 5 + padding (13)
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, tamBoxHeight, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Total Addressable Market (TAM)", margin + 8, yPosition + 10);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 1.41B", margin + maxWidth - 50, yPosition + 10);
  
  const tamItems = [
    "235,200 UK real estate businesses (5.6M total x 4.2%)",
    "GBP 6,000 annual saving per business (20% efficiency on GBP 30k salary)",
    "TAM = 235,200 x GBP 6,000 = GBP 1.41B",
  ];
  let itemY = yPosition + 18;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  tamItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryLight);
    doc.circle(margin + 12, itemY - 1, PDF_CONFIG.circleSize.bullet, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, margin + 18, itemY);
    itemY += PDF_CONFIG.lineHeight.body;
  });
  yPosition += tamBoxHeight + 6;

  // SAM Box - dynamic height based on content
  const samBoxHeight = 38; // Header (10) + 3 items × 5 + padding (13)
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, samBoxHeight, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Serviceable Available Market (SAM)", margin + 8, yPosition + 10);
  doc.setFontSize(PDF_CONFIG.fontSize.stat);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("GBP 917M", margin + maxWidth - 50, yPosition + 10);
  
  const samItems = [
    "65% adoption readiness (Deloitte, PwC, McKinsey)",
    "235,200 x 65% = 152,880 motivated businesses",
    "152,880 x GBP 6,000 = GBP 917M",
  ];
  itemY = yPosition + 18;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  samItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryLight);
    doc.circle(margin + 12, itemY - 1, PDF_CONFIG.circleSize.bullet, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, margin + 18, itemY);
    itemY += PDF_CONFIG.lineHeight.body;
  });
  yPosition += samBoxHeight + 6;

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

  // Subtitle only - main title already rendered by renderTabContent
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
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
    doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.pillarBadge, "F");

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
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  const greenBg: [number, number, number] = [236, 253, 245];
  const whyItems = [
    "AI efficiency gains are a global norm",
    "20% efficiency uplift validated by global data",
    "UK GBP 1.41B sits inside multi-billion-dollar global market",
    "Adoption rising and ROI demonstrable",
  ];
  const whyBoxHeight = 20 + (whyItems.length * PDF_CONFIG.lineHeight.body) + 8; // Dynamic height
  doc.setFillColor(...greenBg);
  doc.roundedRect(margin, yPosition, maxWidth, whyBoxHeight, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.pillarBadge, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Why This Matters for Hobson", margin + 16, yPosition + 12);
  
  let whyY = yPosition + 24;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  whyItems.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 14, whyY - 1, PDF_CONFIG.circleSize.bullet, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item, margin + 20, whyY);
    whyY += PDF_CONFIG.lineHeight.body;
  });
  yPosition += whyBoxHeight + 6;

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
    doc.circle(issueX, yPosition + 47, PDF_CONFIG.circleSize.bullet, "F");
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
    doc.circle(benefitX, yPosition + 55, PDF_CONFIG.circleSize.bullet, "F");
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
  if (yPosition > pageHeight - 32) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 26, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const summaryText = "Positions Hobson as an export-ready solution capable of adapting across geographies and regulatory contexts.";
  doc.text(summaryText, margin + 8, yPosition + 16);
  yPosition += 32;

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
    // Calculate tighter card height: header (16) + gap to bullets (6) + bullets + bottom padding (6)
    const cardHeight = 16 + 6 + phase.objectives.length * PDF_CONFIG.lineHeight.body + 8;
    yPosition = checkPageBreak(doc, yPosition, cardHeight + 8, pageHeight, margin);
    
    // Card background
    doc.setFillColor(...phase.bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    
    // Left accent border
    doc.setFillColor(...phase.color);
    doc.rect(margin, yPosition, 4, cardHeight, "F");

    // Phase title and timeframe
    doc.setTextColor(...phase.color);
    setCardTitleFont(doc);
    doc.text(`Phase ${phase.phase}: ${phase.title}`, margin + 12, yPosition + 12);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    doc.text(phase.timeframe, margin + maxWidth - 60, yPosition + 12);

    // Objectives - tighter spacing after title
    let objY = yPosition + 12 + PDF_CONFIG.subtitleToBullets + PDF_CONFIG.lineHeight.body;
    setBodySmallFont(doc);
    phase.objectives.forEach((obj) => {
      doc.setFillColor(...phase.color);
      doc.circle(margin + 16, objY - 1, PDF_CONFIG.circleSize.bullet, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(obj, margin + 22, objY);
      objY += PDF_CONFIG.lineHeight.body;
    });

    yPosition += cardHeight + 6;
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
    // Calculate tighter card height: header area (32) + gap (4) + objectives + bottom padding (6)
    const headerHeight = 30; // Year badge + title + goal
    const objectivesHeight = yearData.objectives.length * PDF_CONFIG.lineHeight.body;
    const cardHeight = headerHeight + PDF_CONFIG.subtitleToBullets + objectivesHeight + 8;
    
    yPosition = checkPageBreak(doc, yPosition, cardHeight + 8, pageHeight, margin);
    
    // Card background
    doc.setFillColor(...yearData.bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    
    // Left accent border
    doc.setFillColor(...yearData.color);
    doc.rect(margin, yPosition, 4, cardHeight, "F");

    // Year badge
    doc.setFillColor(...yearData.color);
    doc.roundedRect(margin + 12, yPosition + 6, 28, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    setBodyFont(doc);
    doc.setFont("helvetica", "bold");
    doc.text(yearData.year, margin + 26, yPosition + 14, { align: "center" });

    // Title and goal
    doc.setTextColor(...PDF_CONFIG.textDark);
    setCardTitleFont(doc);
    doc.text(yearData.title, margin + 48, yPosition + 13);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    doc.text(`Goal: ${yearData.goal}`, margin + 12, yPosition + 24);

    // Objectives - start after header with proper gap
    let objY = yPosition + headerHeight + PDF_CONFIG.subtitleToBullets;
    setBodySmallFont(doc);
    yearData.objectives.forEach((obj) => {
      doc.setFillColor(...yearData.color);
      doc.circle(margin + 16, objY - 1, PDF_CONFIG.circleSize.bullet, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(obj, margin + 22, objY);
      objY += PDF_CONFIG.lineHeight.body;
    });

    yPosition += cardHeight + 6;
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
  setBodyFont(doc);
  yPosition = renderSpacedText(
    doc,
    "Strategic partnerships and pilot validation across different operator sizes and system environments.",
    margin,
    yPosition,
    maxWidth,
    PDF_CONFIG.lineHeight.body
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
    yPosition = checkPageBreak(doc, yPosition, 60, pageHeight, margin);

    // Type header
    doc.setFillColor(...pilotGroup.color);
    doc.roundedRect(margin, yPosition, 80, 14, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    setBodySmallFont(doc);
    doc.setFont("helvetica", "bold");
    doc.text(pilotGroup.type, margin + 40, yPosition + 9, { align: "center" });
    yPosition += 18;

    pilotGroup.clients.forEach((client) => {
      const cardHeight = 32;
      renderContentCard(doc, margin, yPosition, maxWidth, cardHeight, pilotGroup.bgColor, pilotGroup.color);
      
      doc.setTextColor(...PDF_CONFIG.textDark);
      setBodyFont(doc);
      doc.setFont("helvetica", "bold");
      doc.text(client.name, margin + 8, yPosition + 12);
      
      doc.setTextColor(...PDF_CONFIG.textGray);
      setBodySmallFont(doc);
      doc.setFont("helvetica", "normal");
      doc.text(client.desc, margin + 8, yPosition + 22);
      
      doc.setTextColor(...pilotGroup.color);
      doc.text(`System: ${client.system}`, margin + maxWidth - 60, yPosition + 12);
      
      yPosition += cardHeight + 4;
    });

    yPosition += 6;
  });

  // Summary box
  yPosition = checkPageBreak(doc, yPosition, 30, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 22, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("4 Active Pilots  |  3 Operator Sizes  |  2+ System Types", pageWidth / 2, yPosition + 13, { align: "center" });
  yPosition += 28;

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
  setBodyFont(doc);
  yPosition = renderSpacedText(
    doc,
    "Hobson runs on trusted, industry-standard platforms designed for security, performance, and scalability.",
    margin,
    yPosition,
    maxWidth,
    PDF_CONFIG.lineHeight.body
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
    // Calculate content height: title + gap + items
    const titleHeight = 10;
    const titleToItemsGap = PDF_CONFIG.subtitleToBullets;
    const itemsHeight = category.items.length * PDF_CONFIG.lineHeight.body;
    const contentHeight = titleHeight + titleToItemsGap + itemsHeight;
    
    // Add vertical padding for centering
    const verticalPadding = 8;
    const cardHeight = contentHeight + verticalPadding * 2;
    
    yPosition = checkPageBreak(doc, yPosition, cardHeight + 8, pageHeight, margin);
    
    // Card background
    renderContentCard(doc, margin, yPosition, maxWidth, cardHeight, category.bgColor, category.color);
    
    // Left accent
    doc.setFillColor(...category.color);
    doc.rect(margin, yPosition, 4, cardHeight, "F");

    // Calculate vertical center offset
    const contentStartY = yPosition + verticalPadding;
    
    // Title - centered in top portion
    doc.setTextColor(...category.color);
    setBodyFont(doc);
    doc.setFont("helvetica", "bold");
    doc.text(category.title, margin + 12, contentStartY + 8);

    // Items - start after title with proper gap
    let itemY = contentStartY + titleHeight + titleToItemsGap;
    setBodySmallFont(doc);
    doc.setFont("helvetica", "normal");
    category.items.forEach((item) => {
      doc.setFillColor(...category.color);
      doc.circle(margin + 14, itemY - 1, PDF_CONFIG.circleSize.bullet, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.text(item, margin + 20, itemY);
      itemY += PDF_CONFIG.lineHeight.body;
    });

    yPosition += cardHeight + 6;
  });

  // Key features box
  yPosition = checkPageBreak(doc, yPosition, 30, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 20, PDF_CONFIG.bgLight, PDF_CONFIG.border);
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("Key Features: UK/EU Data Residency  |  High Availability  |  Vector Search", pageWidth / 2, yPosition + 12, { align: "center" });
  yPosition += 26;

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
  const cardHeight = 38;

  features.forEach((feature, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + col * (cardWidth + 8);
    const yPos = yPosition + row * (cardHeight + 6);

    // Card background
    renderContentCard(doc, xPos, yPos, cardWidth, cardHeight, PDF_CONFIG.bgLight, feature.color);
    
    // Left accent
    doc.setFillColor(...feature.color);
    doc.rect(xPos, yPos, 4, cardHeight, "F");

    // Title
    doc.setTextColor(...feature.color);
    setBodyFont(doc);
    doc.setFont("helvetica", "bold");
    doc.text(feature.title, xPos + 10, yPos + 14);

    // Description
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(feature.desc, cardWidth - 16);
    descLines.forEach((line: string, lineIdx: number) => {
      doc.text(line, xPos + 10, yPos + 24 + lineIdx * PDF_CONFIG.lineHeight.tight);
    });
  });

  yPosition += 2 * (cardHeight + 6) + 10;

  // Summary box
  yPosition = checkPageBreak(doc, yPosition, 30, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 22, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("Zero Onboarding Interface - Ready to use from day one", pageWidth / 2, yPosition + 13, { align: "center" });
  yPosition += 28;

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
  const cardHeight = 32; // Reduced from 40

  tiers.forEach((tier, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + col * (cardWidth + 12);
    const yPos = yPosition + row * (cardHeight + 6);

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
    doc.text(tier.name, xPos + 6, yPos + 10);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.text(tier.price, xPos + cardWidth - 6, yPos + 10, { align: "right" });

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(tier.heu, xPos + 6, yPos + 19);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(tier.desc, xPos + 6, yPos + 27);
  });

  yPosition += 2 * (cardHeight + 6) + 8;

  // Top-up pack - tighter box
  if (yPosition > pageHeight - 40) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, 22, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.amber);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Top-Up Pack: GBP 15 (one-time)", margin + 6, yPosition + 10);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("150 additional HEUs - Non-rollover (expires at billing period end)", margin + 6, yPosition + 18);
  yPosition += 34; // Increased gap before Key Benefits

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
    doc.circle(margin + 4, yPosition - 1, PDF_CONFIG.circleSize.bullet, "F");
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
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.pillarBadge, "F");
  
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
  doc.circle(rightX + 12, yPosition + 12, PDF_CONFIG.circleSize.pillarBadge, "F");
  
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
 * IMPORTANT: This must match CapitalRaiseStrategyVisual.tsx exactly
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
  const valueCol = margin + maxWidth - 10;

  // Context
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("The Context", margin, yPosition);
  yPosition += 10;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  const contextText = [
    "Hobson can run pilot programmes throughout 2026 using founder-led execution and outsourced engineering.",
    "But the business cannot hire its core team or execute a commercial launch without external capital.",
    "A seed round funds the 2026 build year, prepares the organisation for launch, and enables the business to enter 2027 fully staffed, ready, and revenue-generating."
  ];
  contextText.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, maxWidth);
    doc.text(wrapped, margin, yPosition);
    yPosition += wrapped.length * PDF_CONFIG.lineHeight.body + 1; // Tighter paragraph spacing
  });
  yPosition += 6;

  // What capital unlocks
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("What This Capital Unlocks", margin, yPosition);
  yPosition += 12;

  const unlocks = [
    { title: "Foundational Team (from June 2026)", desc: "Hiring the core commercial and product team ahead of launch." },
    { title: "Production-Ready Platform", desc: "Completing the ingestion engine, AI scaling, UI/UX, quality systems, and release engineering." },
    { title: "Go-to-Market Activation", desc: "Brand, funnel, messaging, early campaigns and converting pilots into scalable recurring revenue." }
  ];

  unlocks.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 4, yPosition - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(item.title, margin + 10, yPosition);
    yPosition += 6;
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.text(item.desc, margin + 10, yPosition);
    yPosition += 10;
  });
  yPosition += 8;

  // Use of Funds
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Use of Funds", margin, yPosition);
  yPosition += 12;

  const useOfFunds = [
    { label: "Team hiring & 2026 payroll (Jun-Dec)", amount: "GBP 207k" },
    { label: "Outsourced engineering (pre-launch build)", amount: "GBP 150k-250k" },
    { label: "Legal, compliance, finance", amount: "GBP 40k" },
    { label: "Early marketing + GTM prep", amount: "GBP 100k-150k" },
    { label: "Buffer (investor standard)", amount: "GBP 250k-300k" },
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  useOfFunds.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.label, margin + 8, yPosition);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.amount, valueCol, yPosition, { align: "right" });
    yPosition += 8;
  });
  yPosition += 6;

  // Total
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 24, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Total Pre-Revenue Need:", margin + 8, yPosition + 10);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.text("GBP 750k-950k", valueCol, yPosition + 10, { align: "right" });
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("To fund 2026 build + 18-24 months runway: GBP 1.5M-GBP 2.2M seed round required.", margin + 8, yPosition + 20);
  yPosition += 32;

  // Raise scenarios
  if (yPosition > pageHeight - 100) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Raise Scenarios", margin, yPosition);
  yPosition += 12;

  const scenarios = [
    { amount: "GBP 1.2M", name: "Activation Round", runway: "9-12 months", desc: "Moves from pilots to limited launch but leaves little margin for error.", badge: "Higher risk", recommended: false, badgeColor: [217, 119, 6] as [number, number, number] },
    { amount: "GBP 1.5M", name: "Minimum Credible Raise", runway: "12-18 months", desc: "Funds core team, engineering, GTM setup and ensures a stable commercial launch in 2027.", badge: "Recommended minimum", recommended: false, badgeColor: [37, 99, 235] as [number, number, number] },
    { amount: "GBP 1.8M", name: "Balanced Seed Round", runway: "18-22 months", desc: "Supports stronger product velocity, full marketing activation, and early enterprise conversations.", badge: "Optimal execution", recommended: true, badgeColor: PDF_CONFIG.primaryColor },
    { amount: "GBP 2.2M", name: "Accelerated Growth", runway: "22-28 months", desc: "Funds UK scale and prepares for early international market entry from 2028.", badge: "Global ready", recommended: false, badgeColor: [5, 150, 105] as [number, number, number] },
  ];

  const cardHeight = 48;
  const colWidth = (maxWidth - 8) / 2;

  scenarios.forEach((scenario, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + col * (colWidth + 8);
    const yPos = yPosition + row * (cardHeight + 8);

    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    const bgColor = scenario.recommended ? PDF_CONFIG.primaryBgLight : PDF_CONFIG.bgLight;
    const borderColor = scenario.recommended ? PDF_CONFIG.primaryColor : PDF_CONFIG.border;

    doc.setFillColor(...bgColor);
    doc.roundedRect(xPos, yPos, colWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(scenario.recommended ? 1.5 : 0.5);
    doc.roundedRect(xPos, yPos, colWidth, cardHeight, 3, 3, "S");

    // Preferred badge for recommended
    if (scenario.recommended) {
      doc.setFillColor(...PDF_CONFIG.primaryColor);
      doc.roundedRect(xPos + 8, yPos - 4, 30, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text("Preferred", xPos + 23, yPos + 1, { align: "center" });
    }

    // Amount and label
    doc.setTextColor(...(scenario.badgeColor as [number, number, number]));
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(scenario.amount, xPos + 8, yPos + 12);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.text(scenario.name, xPos + 8, yPos + 20);

    // Runway
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Runway: " + scenario.runway, xPos + colWidth - 8, yPos + 12, { align: "right" });

    // Description (wrapped)
    doc.setFontSize(7);
    const descLines = doc.splitTextToSize(scenario.desc, colWidth - 16);
    doc.text(descLines.slice(0, 2), xPos + 8, yPos + 28);

    // Badge
    doc.setFillColor(...(scenario.badgeColor as [number, number, number]));
    doc.roundedRect(xPos + 8, yPos + cardHeight - 10, 35, 7, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(scenario.badge, xPos + 8 + 17.5, yPos + cardHeight - 5.5, { align: "center" });
  });

  yPosition += 2 * (cardHeight + 8) + 12;

  // Burn Insight
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 36, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Burn Insight", margin + 8, yPosition + 12);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("Your burn is entirely pre-revenue. Once revenue begins in 2027, the business", margin + 8, yPosition + 22);
  doc.text("becomes cashflow-positive almost immediately. The seed round funds readiness, not losses.", margin + 8, yPosition + 30);
  yPosition += 44;

  // Commercial Trajectory
  if (yPosition > pageHeight - 40) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Commercial Trajectory", margin, yPosition);
  yPosition += 10;

  const trajectory = [
    { year: "2026", phase: "Pilots & Validation" },
    { year: "2027", phase: "Commercial Launch" },
    { year: "2028+", phase: "UK Scale & Global Expansion" },
  ];
  const trajWidth = (maxWidth - 16) / 3;
  trajectory.forEach((item, idx) => {
    const xPos = margin + idx * (trajWidth + 8);
    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.roundedRect(xPos, yPosition, trajWidth, 24, 3, 3, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(item.year, xPos + trajWidth / 2, yPosition + 10, { align: "center" });
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(item.phase, xPos + trajWidth / 2, yPosition + 18, { align: "center" });
  });
  yPosition += 32;

  // Summary
  if (yPosition > pageHeight - 45) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 38, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin + 8, yPosition + 12);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  const summaryText = doc.splitTextToSize("The GBP 1.5M-2.2M raise funds the full 2026 build period: platform completion, core team hiring, GTM development, and operating runway. From 2027 onward, Hobson becomes cashflow-positive.", maxWidth - 16);
  doc.text(summaryText, margin + 8, yPosition + 22, { lineHeightFactor: 1.4 });
  yPosition += 46;

  return yPosition;
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
  yPosition += 12;

  const teamCosts = [
    { role: "CEO", cost: "GBP 120,000" },
    { role: "Head of Marketing", cost: "GBP 70,000" },
    { role: "Product Owner", cost: "GBP 85,000" },
    { role: "Head of Customer Support", cost: "GBP 55,000" },
    { role: "Head of Sales", cost: "GBP 85,000" },
  ];

  const valueCol = margin + maxWidth - 10;
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  teamCosts.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.role, margin + 8, yPosition);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.cost, valueCol, yPosition, { align: "right" });
    yPosition += 8;
  });
  yPosition += 14;

  // Variable Costs
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Variable Outsourced Costs (32% of Revenue)", margin, yPosition);
  yPosition += 12;

  const variableCosts = [
    { category: "Engineering & Design", range: "10-14%" },
    { category: "Marketing Execution", range: "5-8%" },
    { category: "Customer Success Support", range: "3-5%" },
    { category: "Sales Commissions", range: "3-5%" },
    { category: "G&A / Corporate Services", range: "2-3%" },
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  variableCosts.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.category, margin + 8, yPosition);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.text(item.range, valueCol, yPosition, { align: "right" });
    yPosition += 8;
  });
  yPosition += 14;

  // Infrastructure COGS
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("AI & Infrastructure COGS (12% of Revenue)", margin, yPosition);
  yPosition += 12;

  const infraCosts = [
    { component: "LLM inference (OpenAI)", range: "3-5%" },
    { component: "Vector DB & Embeddings", range: "1-2%" },
    { component: "Storage & Compute", range: "1-2%" },
    { component: "Monitoring & Backups", range: "0.5-1%" },
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  infraCosts.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.component, margin + 8, yPosition);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.text(item.range, valueCol, yPosition, { align: "right" });
    yPosition += 8;
  });
  yPosition += 14;

  // Summary box
  if (yPosition > pageHeight - 35) { doc.addPage(); yPosition = margin; }
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

  // Use columns for better spacing
  const sizeColX = margin + 8;
  const costColX = margin + 80;
  const descColX = margin + 130;

  portfolioCosts.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.roundedRect(margin, yPosition, maxWidth, 18, 2, 2, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(item.size, sizeColX, yPosition + 11);
    
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.text(item.cost, costColX, yPosition + 11);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(item.desc, descColX, yPosition + 11);
    
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
 * Matches PLGrowthVisual.tsx - shows explainer box + 3 key metrics cards
 * Note: The UI shows an image chart; PDF shows the key metrics summary only
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

  // Note about chart - with proper text wrapping
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "italic");
  const plNoteText = "See the interactive P/L Forecast Chart in the web version. Shows Infrastructure/COGS, Operating Costs, and Net Profit 2027-2031.";
  const wrappedPlNote = doc.splitTextToSize(plNoteText, maxWidth - 12);
  const plNoteLineHeight = 7;
  const plNoteBoxHeight = wrappedPlNote.length * plNoteLineHeight + 12;
  
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, plNoteBoxHeight, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  wrappedPlNote.forEach((line: string, idx: number) => {
    doc.text(line, margin + 6, yPosition + 10 + idx * plNoteLineHeight);
  });
  yPosition += plNoteBoxHeight + 6;

  // Key metrics grid - 3 columns matching Revenue Growth box sizing
  yPosition = checkPageBreak(doc, yPosition, 36, pageHeight, margin);
  const colWidth = (maxWidth - 18) / 3;
  const metrics = [
    { label: "Infrastructure / COGS", value: "5-10%", sublabel: "of revenue", color: PDF_CONFIG.amber, bgColor: PDF_CONFIG.amberBg },
    { label: "Operating Costs", value: "30-35%", sublabel: "of revenue (early years)", color: PDF_CONFIG.blue, bgColor: PDF_CONFIG.blueBg },
    { label: "Net Profit", value: "GBP 4.5M", sublabel: "by 2031", color: PDF_CONFIG.emerald, bgColor: PDF_CONFIG.emeraldBg },
  ];

  metrics.forEach((metric, idx) => {
    const xPos = margin + idx * (colWidth + 6);
    doc.setFillColor(...metric.bgColor);
    doc.roundedRect(xPos, yPosition, colWidth, 28, 3, 3, "F");
    doc.setDrawColor(...metric.color);
    doc.roundedRect(xPos, yPosition, colWidth, 28, 3, 3, "S");

    doc.setTextColor(...metric.color);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(metric.label, xPos + colWidth / 2, yPosition + 8, { align: "center" });

    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.text(metric.value, xPos + colWidth / 2, yPosition + 17, { align: "center" });

    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(metric.sublabel, xPos + colWidth / 2, yPosition + 24, { align: "center" });
  });
  yPosition += 34;

  return yPosition;
};

/**
 * Render Revenue Growth visual with standardized fonts
 * Matches RevenueGrowthVisual.tsx - shows header, explainer, chart note, and summary stats
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

  // Header
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Revenue Growth (2027-2031)", margin, yPosition);
  yPosition += 6;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("5-year revenue projection from UK launch through global expansion", margin, yPosition);
  yPosition += 14;

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
  doc.text("Review UK Assumptions, Global Assumptions, Market Penetration, and Revenue Model tabs.", margin + 8, yPosition + 22);
  yPosition += 40;

  // Note about chart - with proper line spacing
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "italic");
  const noteText = "See the interactive Revenue Growth Chart in the web version. Stacked bars show UK (amber) and Global (blue) revenue by year.";
  const wrappedNote = doc.splitTextToSize(noteText, maxWidth - 12);
  const noteLineHeight = 7;
  const noteBoxHeight = wrappedNote.length * noteLineHeight + 12;
  
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, noteBoxHeight, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  wrappedNote.forEach((line: string, idx: number) => {
    doc.text(line, margin + 6, yPosition + 10 + idx * noteLineHeight);
  });
  yPosition += noteBoxHeight + 6;

  // Summary Stats - 4 columns matching the visual - tighter boxes
  yPosition = checkPageBreak(doc, yPosition, 36, pageHeight, margin);
  const colWidth = (maxWidth - 18) / 4;
  const stats = [
    { label: "2027 (UK Launch)", value: "GBP 1.17M", color: PDF_CONFIG.amber, bgColor: PDF_CONFIG.amberBg },
    { label: "2028 (Global Start)", value: "GBP 6.71M", color: PDF_CONFIG.blue, bgColor: PDF_CONFIG.blueBg },
    { label: "2031 (Year 5)", value: "GBP 14.92M", color: PDF_CONFIG.primaryColor, bgColor: PDF_CONFIG.primaryBgLight },
    { label: "5-Year CAGR", value: "~90%", color: PDF_CONFIG.emerald, bgColor: PDF_CONFIG.emeraldBg },
  ];

  stats.forEach((stat, idx) => {
    const xPos = margin + idx * (colWidth + 6);
    doc.setFillColor(...stat.bgColor);
    doc.roundedRect(xPos, yPosition, colWidth, 28, 3, 3, "F");
    doc.setDrawColor(...stat.color);
    doc.roundedRect(xPos, yPosition, colWidth, 28, 3, 3, "S");

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(stat.label, xPos + colWidth / 2, yPosition + 8, { align: "center" });

    doc.setTextColor(...stat.color);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, xPos + colWidth / 2, yPosition + 20, { align: "center" });
  });
  yPosition += 34;

  // Key Milestones - tighter box
  yPosition = checkPageBreak(doc, yPosition, 38, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 34, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Key Revenue Milestones", margin + 6, yPosition + 10);
  
  const milestones = [
    { year: "2027", desc: "UK commercial launch, first paying customers", color: PDF_CONFIG.amber },
    { year: "2028", desc: "Global expansion begins, revenue accelerates", color: PDF_CONFIG.blue },
    { year: "2031", desc: "~30,000 customers, category leadership", color: PDF_CONFIG.primaryColor },
  ];
  
  let mY = yPosition + 18;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  milestones.forEach((m) => {
    doc.setFillColor(...m.color);
    doc.circle(margin + 10, mY - 1, PDF_CONFIG.circleSize.bullet, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFont("helvetica", "bold");
    doc.text(m.year + ":", margin + 14, mY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(m.desc, margin + 28, mY);
    mY += 5;
  });
  yPosition += 40;

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

  // Justification points - 2 column layout with full text (7 points to match visual)
  const justifications = [
    { title: "Frictionless Adoption", desc: "Zero onboarding, works alongside existing tools, and pricing is not a barrier - enabling 2x faster market penetration than typical SaaS." },
    { title: "Fragmented Market Structure", desc: "225,792 small firms, 6,350 medium, 1,411 large, 235 enterprise - lightweight AI spreads rapidly through referrals." },
    { title: "White-Space Positioning", desc: "First AI built solely for Document Intelligence -> Retrieval -> Clarity -> Referenced Answers. No direct competitor." },
    { title: "Benchmark Precedent", desc: "Vertical AI companies (EliseAI, StanAI, Cresta) reached 1-3% penetration in 3-5 years - Hobson's frictionless model doubles this." },
    { title: "AI Adoption Tailwinds", desc: "65% of organisations plan to increase AI investment (Deloitte). Up to 20% efficiency gain achievable (Forbes)." },
    { title: "Favourable Unit Economics", desc: "~GBP 1.60-2.00 per unit onboarding cost. High gross margin enables aggressive SMB and enterprise scaling." },
    { title: "Global Replicability", desc: "Similar market structure, AI adoption rates, and universal document needs support international expansion." },
  ];

  const colWidth = (maxWidth - 8) / 2;
  const cardHeight = 46; // Compact height with tighter line spacing
  const cardSpacing = 6;

  justifications.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + col * (colWidth + 8);
    const yPos = yPosition + row * (cardHeight + cardSpacing);

    // Check page break for each row
    if (yPos > pageHeight - 65) {
      doc.addPage();
      yPosition = margin;
    }

    const actualY = yPosition + row * (cardHeight + cardSpacing);

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, actualY, colWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
    doc.roundedRect(xPos, actualY, colWidth, cardHeight, 3, 3, "S");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(item.title, xPos + 6, actualY + 12);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(item.desc, colWidth - 12);
    let descY = actualY + 22;
    descLines.forEach((line: string) => {
      doc.text(line, xPos + 6, descY);
      descY += 5.5;
    });
  });

  // 7 items = 4 rows (0,1 in row0; 2,3 in row1; 4,5 in row2; 6 in row3)
  yPosition += 4 * (cardHeight + cardSpacing) + 8;

  // UK Market Share table - need space for header + 5 rows + summary = ~100 units
  if (yPosition > pageHeight - 110) { doc.addPage(); yPosition = margin; }
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
    // Check for page break before each row
    if (yPosition > pageHeight - 25) { doc.addPage(); yPosition = margin; }
    
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
  yPosition += 8;

  // Summary box - ensure it fits on page
  if (yPosition > pageHeight - 35) { doc.addPage(); yPosition = margin; }
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
  doc.roundedRect(margin, yPosition, maxWidth, 65, 3, 3, "F");
  
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
    itemY += 9;
  });
  yPosition += 73;

  // Why defensible box
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 58, 3, 3, "F");
  
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
    itemY += 9;
  });
  yPosition += 66;

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
    
    // Calculate box height with proper vertical padding
    const lineHeight = 6;
    const contentHeight = overviewLines.length * lineHeight;
    const verticalPadding = 10; // Equal top and bottom padding
    const boxHeight = contentHeight + verticalPadding * 2;
    
    doc.rect(margin, yPosition, maxWidth, boxHeight, "F");
    
    // Center text vertically in box
    let overviewY = yPosition + verticalPadding + 4; // 4pt offset for text baseline
    overviewLines.forEach((line: string) => {
      doc.text(line, margin + 8, overviewY);
      overviewY += lineHeight;
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
        const cardHeight = 42; // Increased height for better spacing
        const cardSpacing = 8; // Increased spacing between rows

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

          // Role header - taller for better readability
          doc.setFillColor(...PDF_CONFIG.primaryColor);
          doc.rect(xPos + 2, finalYPos, cardWidth - 6, 10, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.text(member.role, xPos + cardWidth / 2, finalYPos + 7, { align: "center" });

          // Name - with more vertical space
          doc.setTextColor(...PDF_CONFIG.textDark);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          const nameLines = doc.splitTextToSize(member.name, cardWidth - 12);
          doc.text(nameLines, xPos + cardWidth / 2, finalYPos + 20, { align: "center" });

          // LinkedIn - positioned lower
          if (member.linkedin) {
            doc.setTextColor(...PDF_CONFIG.primaryColor);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            const linkText = "LinkedIn Profile";
            const linkY = finalYPos + 32;
            doc.text(linkText, xPos + cardWidth / 2, linkY, { align: "center" });
            const textWidth = doc.getTextWidth(linkText);
            doc.link(xPos + (cardWidth - textWidth) / 2, linkY - 3, textWidth, 4, { url: member.linkedin });
          } else {
            doc.setTextColor(...PDF_CONFIG.textLight);
            doc.setFontSize(8);
            doc.setFont("helvetica", "italic");
            doc.text("Coming Soon", xPos + cardWidth / 2, finalYPos + 32, { align: "center" });
          }
        });

        const totalRows = Math.ceil(section.teamMembers.length / membersPerRow);
        yPosition += totalRows * (cardHeight + cardSpacing) + 8;
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
