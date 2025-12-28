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
import { getPdfContentForComponent, getExecutiveContextStructuredData, getSituationAnalysisStructuredData, getCustomerPersonasStructuredData, getCustomerUserJourneysStructuredData, getMarketDescriptionStructuredData, getCompetitorBenchmarksStructuredData, getCustomerOnlineBehaviourStructuredData } from "@/components/investor/data/pdfContentProviders";
import { competitorData } from "@/components/investor/data/competitorData";

// ============================================================================
// PDF CONFIGURATION - MASTER DEFAULTS
// ============================================================================
// All sizing, spacing, and typography values are defined here.
// These values supersede any hardcoded values in render functions.
// Values extracted from Strategy & Approach cards as the baseline.
// ============================================================================

const PDF_CONFIG = {
  // ============================================================================
  // PAGE LAYOUT
  // ============================================================================
  margin: 20,

  // ============================================================================
  // FONT SIZES (in points) - from Strategy & Approach cards
  // ============================================================================
  fontSize: {
    pageTitle: 18,        // Tab/page titles (H1 equivalent)
    sectionTitle: 13,     // Section headers within content (H2)
    cardTitle: 12,        // Card/box titles (H3)
    body: 10,             // Standard body text
    bodySmall: 9,         // Secondary info, labels
    caption: 8,           // Footnotes, sources
    stat: 16,             // Large statistics/numbers
  },

  // ============================================================================
  // LINE HEIGHT (in points) - vertical spacing between lines
  // ============================================================================
  lineHeight: {
    body: 5,              // Standard line spacing for body text
    tight: 4,             // Compact lists, dense content
    loose: 6,             // Headers, titles with more breathing room
  },

  // ============================================================================
  // LINE HEIGHT FACTOR - multiplier for doc.text() lineHeightFactor option
  // From Strategy & Approach: 1.2 for headers, 1.25 for body paragraphs
  // ============================================================================
  lineHeightFactor: {
    tight: 1.2,           // Compact headers, inflexion point text
    body: 1.25,           // Standard paragraphs, justified text
    loose: 1.35,          // Headers with more breathing room
  },

  // ============================================================================
  // SPACING (in points) - gaps between elements
  // From Strategy & Approach cards
  // ============================================================================
  spacing: {
    sectionGap: 8,        // Gap between major sections
    cardGap: 6,           // Gap between cards/boxes (yPosition += height + 6)
    headingGap: 5,        // Gap between title and subtitle
    paragraphGap: 4,      // Gap between paragraphs
    titleToContent: 6,    // Gap between header area and main content
    subtitleToBullets: 4, // Gap between subtitle and bullet list
    bulletIndent: 6,      // Indent for bullet point text from bullet
    listItemGap: 1,       // Extra gap after each list item
    boxToBox: 5,          // Gap between adjacent boxes (missionBoxY + missionBoxHeight + 5)
    contentStart: 8,      // Y offset for first content line inside box (yPosition + 8)
    headerToContent: 18,  // Header row height before content box
  },

  // ============================================================================
  // CIRCLE SIZES (radius in points) - from Strategy & Approach
  // ============================================================================
  circleSize: {
    bullet: 0.8,          // Small bullet points in lists
    small: 1.2,           // Pressure box warning icons (PDF_CONFIG.circleSize.small)
    medium: 2.0,          // Card header icons, badges
    large: 3.2,           // Section headers, numbered badges
    xlarge: 4.0,          // Hero section icons
  },

  // ============================================================================
  // BOX/CARD SIZING (in points) - from Strategy & Approach
  // ============================================================================
  box: {
    paddingX: 8,          // Horizontal padding (innerPadding, ctxPadding, posPadding, etc.)
    paddingTop: 8,        // Top padding inside boxes
    paddingBottom: 6,     // Bottom padding inside boxes
    paddingCompact: 6,    // Compact padding for dense cards
    borderRadius: 3,      // Corner radius for roundedRect (3, 3)
    borderRadiusSmall: 2, // Smaller radius for pressure boxes
    borderWidth: 0.3,     // Default border stroke width
    borderWidthThin: 0.2, // Thin border for subtle cards/content boxes
    minBoxHeight: 18,     // Minimum box height (pressureBoxHeight)
    contentBoxPadding: 6, // Padding inside content boxes (missionBoxHeight calculation +6)
  },

  // ============================================================================
  // CARD LAYOUT - from Strategy & Approach
  // ============================================================================
  card: {
    iconSize: 8,          // Icon dimensions in cards
    iconGap: 4,           // Gap after icon before text
    iconOffsetX: 10,      // X position of icon from card edge (margin + 10)
    textOffsetX: 20,      // X position of text after icon (margin + 20)
    titleHeight: 5,       // Height occupied by title text line
    subtitleGap: 7,       // Gap from title baseline to subtitle (yPosition + 8 vs + 15)
    contentGap: 6,        // Gap between header area and content
    headerHeight: 18,     // Total header area before content box starts
  },

  // ============================================================================
  // TEXT RENDERING DEFAULTS
  // ============================================================================
  text: {
    align: "justify" as const, // Default text alignment for paragraphs
    maxLines: 50,         // Safety limit for text wrapping
  },

  // ============================================================================
  // COLORS - RGB values matched to design system
  // ============================================================================
  primaryColor: [124, 58, 237] as [number, number, number],
  primaryLight: [168, 113, 246] as [number, number, number],
  primaryBg: [240, 235, 255] as [number, number, number],
  primaryBgLight: [250, 245, 255] as [number, number, number],
  primaryBgMedium: [245, 238, 255] as [number, number, number],
  textDark: [9, 9, 25] as [number, number, number],
  textGray: [100, 116, 139] as [number, number, number],
  textLight: [148, 163, 184] as [number, number, number],
  bgLight: [241, 245, 249] as [number, number, number],
  bgWhite: [255, 255, 255] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  headerBg: [245, 243, 255] as [number, number, number],
  emerald: [5, 150, 105] as [number, number, number],
  emeraldLight: [16, 185, 129] as [number, number, number],
  emeraldBg: [236, 253, 245] as [number, number, number],
  emeraldBgLight: [240, 253, 248] as [number, number, number],
  emeraldBorder: [167, 243, 208] as [number, number, number],
  blue: [37, 99, 235] as [number, number, number],
  blueBg: [239, 246, 255] as [number, number, number],
  blueBorder: [219, 234, 254] as [number, number, number],
  rose: [225, 29, 72] as [number, number, number],
  roseBg: [255, 241, 242] as [number, number, number],
  roseBorder: [254, 205, 211] as [number, number, number],
  amber: [217, 119, 6] as [number, number, number],
  amberBg: [255, 251, 235] as [number, number, number],
  amberBorder: [253, 230, 138] as [number, number, number],
};

// ============================================================================
// DERIVED HELPERS - Use PDF_CONFIG values
// ============================================================================

// Legacy compatibility - maps old BOX_SIZING to new PDF_CONFIG.box
const BOX_SIZING = {
  paddingTop: PDF_CONFIG.box.paddingTop,
  paddingBottom: PDF_CONFIG.box.paddingBottom,
  paddingX: PDF_CONFIG.box.paddingX,
  iconSize: PDF_CONFIG.card.iconSize,
  iconGap: PDF_CONFIG.card.iconGap,
  titleHeight: PDF_CONFIG.card.titleHeight,
  subtitleGap: PDF_CONFIG.card.subtitleGap,
  contentGap: PDF_CONFIG.card.contentGap,
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
  const subtitleToDescGap = PDF_CONFIG.spacing.subtitleToBullets + 4; // Gap between subtitle and description
  
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
  doc.circle(x + 8, y + 10, PDF_CONFIG.circleSize.large, "F");
  
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
  doc.circle(x + 4, y - 1, PDF_CONFIG.circleSize.large, "F");
  
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
    newY += hasBulletsFollowing ? PDF_CONFIG.spacing.subtitleToBullets : PDF_CONFIG.spacing.paragraphGap;
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
    doc.circle(x + 3, currentY - 2, PDF_CONFIG.circleSize.small, "F");
    
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
  doc.circle(x + 12, titleY - 2, PDF_CONFIG.circleSize.medium, "F");
  
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
  
  // Header row - matches bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 (stronger purple gradient)
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.rect(margin, yPosition, maxWidth, 14, "F");
  
  // Header border - matches border-primary/20
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
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
      
      // Re-render header on new page with purple gradient styling
      doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
      doc.rect(margin, yPosition, maxWidth, 14, "F");
      doc.setDrawColor(...PDF_CONFIG.primaryLight);
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
    
    // Alternating row background - matches on-screen purple gradient styling
    // Even rows: from-primary/10 via-primary/5 to-primary/10
    // Odd rows: from-secondary via-muted/50 to-secondary
    if (isHobson) {
      doc.setFillColor(...PDF_CONFIG.primaryBg); // Stronger purple for Hobson
    } else if (rowIndex % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.primaryBgLight); // Light purple tint
    } else {
      doc.setFillColor(...PDF_CONFIG.primaryBgMedium); // Slightly stronger purple
    }
    doc.rect(margin, yPosition, maxWidth, rowHeight, "F");
    
    // Draw cell borders - matches border-primary/20
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
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
 * Render Our Vision visual with timeline showing AI evolution
 * Replicates: 3 stage timeline from Reactive to Proactive to Autonomous Agent
 */
const renderOurVision = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Subtitle
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyFont(doc);
  doc.text("The Evolution of Hobson AI", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 14;

  // Define stage colors to match the visual exactly
  const slateColor: [number, number, number] = [100, 116, 139];  // slate-500
  const purpleColor: [number, number, number] = [147, 51, 234];  // purple-600
  const primaryColor = PDF_CONFIG.primaryColor;                   // brand purple

  // Light background colors for each stage
  const slateBg: [number, number, number] = [241, 245, 249];     // slate-100
  const purpleBg: [number, number, number] = [253, 251, 255];    // very light purple
  const primaryBg: [number, number, number] = [245, 238, 255];   // primary/20

  const stages = [
    {
      label: "Reactive Agent",
      timeframe: "Today",
      description: "AI retrieves when asked with accuracy",
      icons: ["Prompts", "Retrieves"],
      visualNote: "Human-led, AI responds",
      color: slateColor,
      bgColor: slateBg,
    },
    {
      label: "Proactive Agent",
      timeframe: "~1 Year",
      description: "AI suggests & prepares, humans approve",
      icons: ["Drafts", "Approvals"],
      visualNote: "AI prepares, human confirms",
      color: purpleColor,
      bgColor: purpleBg,
    },
    {
      label: "Autonomous Agent",
      timeframe: "3-5 Years",
      description: "AI executes & reports outcomes",
      icons: ["Executes", "Audits"],
      visualNote: "AI operates, human monitors",
      color: primaryColor,
      bgColor: primaryBg,
    },
  ];

  // Calculate card dimensions - taller cards to fit all content
  const cardWidth = (maxWidth - 12) / 3; // 3 cards with gaps
  const cardHeight = 72; // Increased height

  // Render timeline cards
  stages.forEach((stage, index) => {
    const cardX = margin + index * (cardWidth + 6);

    // Card background with distinct color per stage
    doc.setFillColor(...stage.bgColor);
    doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 3, 3, "F");

    // Card border with stage color
    doc.setDrawColor(...stage.color);
    doc.setLineWidth(1);
    doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 3, 3, "S");

    // Timeframe badge with stage color
    doc.setFillColor(...stage.color);
    setBodySmallFont(doc);
    const badgeWidth = doc.getTextWidth(stage.timeframe) + 10;
    const badgeX = cardX + (cardWidth - badgeWidth) / 2;
    doc.roundedRect(badgeX, yPosition + 5, badgeWidth, 9, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(stage.timeframe, cardX + cardWidth / 2, yPosition + 11, { align: "center" });

    // Stage label with stage color
    doc.setTextColor(...stage.color);
    setCardTitleFont(doc);
    doc.text(stage.label, cardX + cardWidth / 2, yPosition + 24, { align: "center" });

    // Icon labels as pills
    setBodySmallFont(doc);
    const iconY = yPosition + 34;
    let iconTotalWidth = 0;
    stage.icons.forEach((icon) => {
      iconTotalWidth += doc.getTextWidth(icon) + 12;
    });
    let iconX = cardX + (cardWidth - iconTotalWidth) / 2;
    stage.icons.forEach((icon) => {
      const pillWidth = doc.getTextWidth(icon) + 8;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(iconX, iconY - 4, pillWidth, 9, 2, 2, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.text(icon, iconX + 4, iconY + 2);
      iconX += pillWidth + 4;
    });

    // Description
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    const descLines = doc.splitTextToSize(stage.description, cardWidth - 10);
    doc.text(descLines, cardX + cardWidth / 2, yPosition + 48, { align: "center" });

    // Visual note at bottom
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.text(stage.visualNote, cardX + cardWidth / 2, yPosition + 66, { align: "center" });
  });

  yPosition += cardHeight + 14;

  // Progression indicators section
  yPosition = checkPageBreak(doc, yPosition, 30, pageHeight, margin);

  // Use the exact same colors for dots as the cards
  const indicators = [
    { label: "Automation", direction: "Increasing", colors: [slateColor, purpleColor, primaryColor] },
    { label: "Human Effort", direction: "Decreasing", colors: [primaryColor, purpleColor, slateColor] },
    { label: "Scale", direction: "Expanding", colors: [slateColor, purpleColor, primaryColor] },
  ];

  const indicatorWidth = maxWidth / 3;
  indicators.forEach((indicator, index) => {
    const indX = margin + index * indicatorWidth + indicatorWidth / 2;

    // Label
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(8);
    doc.text(indicator.label.toUpperCase(), indX, yPosition, { align: "center" });

    // Dots with correct colors
    const dotY = yPosition + 7;
    const dotRadius = 2.5;
    const dotGap = 10;
    indicator.colors.forEach((color, dotIndex) => {
      const dotX = indX - dotGap + dotIndex * dotGap;
      doc.setFillColor(...color);
      doc.circle(dotX, dotY, dotRadius, "F");
    });

    // Direction
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.text(indicator.direction, indX, yPosition + 16, { align: "center" });
  });

  yPosition += PDF_CONFIG.spacing.sectionGap;
  return yPosition;
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
  const boxPaddingX = 10;
  const boxPaddingTop = 8;
  const boxPaddingBottom = 6;

  const openingStatement = "Hobson is building the intelligence infrastructure that Real Estate operations now require to function safely, efficiently, and at scale.";

  // --- Draw opening statement box ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  const contentMaxWidth = boxW - boxPaddingX * 2;
  const openingLines = doc.splitTextToSize(sanitizeText(openingStatement), contentMaxWidth);
  const openingLineHeight = PDF_CONFIG.lineHeight.loose + 2; // Larger line height for section title font
  const openingBoxH = boxPaddingTop + openingLines.length * openingLineHeight + boxPaddingBottom;

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(boxX, yPosition, boxW, openingBoxH, 4, 4, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.5);
  doc.roundedRect(boxX, yPosition, boxW, openingBoxH, 4, 4, "S");

  let openingY = yPosition + boxPaddingTop + 4; // +4 for font baseline offset
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
    openingY += openingLineHeight;
  });

  yPosition += openingBoxH + 8;

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

  // --- Measure heights (set font first for accurate measurement) ---
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  const textContentWidth = boxW - boxPaddingX * 2; // Full width minus padding
  const para1Lines = doc.splitTextToSize(sanitizeText(para1), textContentWidth);
  const founderLines = doc.splitTextToSize(sanitizeText(founderNote), textContentWidth - 16);
  const para2Lines = doc.splitTextToSize(sanitizeText(para2), textContentWidth);
  const closingLines = doc.splitTextToSize(sanitizeText(closing), textContentWidth);

  const gapSm = 2;
  const gapMd = 4;
  const bulletGap = 1;

  const para1Height = para1Lines.length * PDF_CONFIG.lineHeight.body;
  const founderHeight = founderLines.length * PDF_CONFIG.lineHeight.body + 8; // box padding
  const para2Height = para2Lines.length * PDF_CONFIG.lineHeight.body;
  const closingHeight = closingLines.length * PDF_CONFIG.lineHeight.loose;
  const enablesItemsHeight = enablesItems.length * (PDF_CONFIG.lineHeight.body * 2 + bulletGap);

  const rationaleCalloutHeight = 12;

  const boxH =
    boxPaddingTop + 4 + // +4 for baseline offset
    14 + // header row
    gapMd +
    para1Height +
    gapMd +
    founderHeight +
    gapMd + 6 + // Extra spacing before callout
    rationaleCalloutHeight +
    gapMd +
    PDF_CONFIG.lineHeight.body + // "Hobson enables:"
    gapSm +
    enablesItemsHeight +
    gapMd +
    para2Height +
    gapMd +
    closingHeight +
    2; // Reduced bottom padding

  // --- Draw card ---
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(boxX, yPosition, boxW, boxH, 4, 4, "F");

  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.5);
  doc.roundedRect(boxX, yPosition, boxW, boxH, 4, 4, "S");

  // Header
  const headerY = yPosition + boxPaddingTop + 8; // +8 for baseline offset
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 12, headerY - 2, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Investment Rationale", margin + 20, headerY);

  // Content
  let contentY = headerY + 10;
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
  const founderBoxY = contentY - 4;
  const founderBoxH = founderLines.length * PDF_CONFIG.lineHeight.body + 8;
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(textX, founderBoxY, textContentWidth, founderBoxH, 2, 2, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(textX, founderBoxY, textContentWidth, founderBoxH, 2, 2, "S");

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  contentY = founderBoxY + 6;
  founderLines.forEach((l: string) => {
    // Highlight "Arthur Online" in purple (not bold)
    if (l.includes("Arthur Online")) {
      const parts = l.split("Arthur Online");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.text(parts[0], textX + 8, contentY);
      const part1Width = doc.getTextWidth(parts[0]);
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.text("Arthur Online", textX + 8 + part1Width, contentY);
      const highlightWidth = doc.getTextWidth("Arthur Online");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.text(parts[1] || "", textX + 8 + part1Width + highlightWidth, contentY);
    } else {
      doc.text(l, textX + 8, contentY);
    }
    contentY += PDF_CONFIG.lineHeight.body;
  });

  contentY += gapMd + 12; // Extra spacing between founder note and callout

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
    doc.circle(textX + 3, contentY - 2, PDF_CONFIG.circleSize.small, "F");

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
  doc.circle(margin + 4, yPosition - 1, PDF_CONFIG.circleSize.large, "F");
  
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
  const calloutHeight = 34;
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
  doc.text("Real Estate operations are structurally constrained by manual document work.", calloutTextX, calloutTextY);
  
  calloutTextY += 6;
  doc.setFont("helvetica", "normal");
  doc.text("Over ", calloutTextX, calloutTextY);
  const overWidth = doc.getTextWidth("Over ");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("20% of professional time", calloutTextX + overWidth, calloutTextY);
  const timeWidth = doc.getTextWidth("20% of professional time");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  doc.text(" is spent locating, validating, and cross-checking information.", calloutTextX + overWidth + timeWidth, calloutTextY);
  
  calloutTextY += 6;
  doc.text("This is recurring operational spend already being paid. Hobson converts this into ", calloutTextX, calloutTextY);
  
  calloutTextY += 5;
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("permanent operating leverage", calloutTextX, calloutTextY);
  const levWidth = doc.getTextWidth("permanent operating leverage");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  doc.text(" that compounds as portfolios scale.", calloutTextX + levWidth, calloutTextY);
  
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
  doc.circle(margin + 4, yPosition - 1, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Traction & Execution Momentum", margin + 14, yPosition);
  yPosition += 12;

  // Intro paragraph
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  const introText = "Hobson demonstrates production-grade capability against Real Estate operational workflows.";
  const introLines = doc.splitTextToSize(introText, maxWidth);
  introLines.forEach((line: string) => {
    doc.text(line, margin, yPosition);
    yPosition += PDF_CONFIG.lineHeight.body;
  });
  yPosition += 4;

  // Bullet points
  const tractionBullets = [
    "Validated across four live Real Estate operating use cases",
    "98% model accuracy measured on proprietary, industry-specific datasets",
    "Multi-document reasoning across legal, compliance, and operational sources",
    "Domain-trained AI purpose-built for auditability and regulatory scrutiny",
    "MVP launch Q1 2026, with scope defined by partner workflows rather than theoretical use cases",
  ];

  tractionBullets.forEach((bullet) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + 3, yPosition - 2, PDF_CONFIG.circleSize.small, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "normal");
    
    const bulletLines = doc.splitTextToSize(bullet, maxWidth - 10);
    bulletLines.forEach((line: string) => {
      doc.text(line, margin + 8, yPosition);
      yPosition += PDF_CONFIG.lineHeight.body;
    });
    yPosition += 2;
  });

  yPosition += 8;

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
      title: "Technology Has Reached the Threshold",
      intro: "AI systems can now meet the accuracy, traceability, and reliability requirements of Real Estate decision-making:",
      bullets: [
        "Production-grade document extraction exceeding 95%",
        "Multi-document reasoning at scale",
        "Cost-effective real-time inference",
      ],
      conclusion: "This problem could not be solved before. Now it can be done economically.",
    },
    {
      number: "2",
      title: "The Real Estate Industry is Ready and Desperate for Efficiency",
      intro: "Real Estate operators face converging pressure:",
      bullets: [
        "Rising regulatory and reporting burden",
        "Headcount constraints and labour inflation",
        "Margin compression",
        "Increased complexity per asset",
      ],
      conclusion: "Manual processes are no longer inefficient; they are financially irresponsible.",
    },
    {
      number: "3",
      title: "Competitive White Space Is Closing",
      intro: "Despite the scale of the opportunity:",
      bullets: [
        "No AI-native leader exists in Real Estate document intelligence",
        "Legacy PropTech platforms are too embedded to replace manual reasoning",
        "Horizontal AI tools cannot meet regulatory or accuracy expectations",
      ],
      conclusion: "A narrow 12-18-month window exists to define the default category standard.",
    },
    {
      number: "4",
      title: "Regulation & Economics",
      intro: "Regulatory requirements are increasing document volume and complexity:",
      bullets: [
        "ESG reporting now requires document-linked evidence",
        "Auditability and traceability are mandatory",
        "Risk and safety obligations expand annually",
        "Data residency rules favour compliant, regional AI solutions",
      ],
      conclusion: "At the same time, labour inflation makes manual document work structurally unaffordable.",
    },
    {
      number: "5",
      title: "The Economics Are Clear",
      intro: "",
      bullets: [],
      conclusion: "AI delivers approximately GBP 6,000 per role per year in reclaimed capacity. Tools that remove labour, not merely optimise it, are adopted first.",
    },
  ];

  sections.forEach((section) => {
    // Measure text with correct font for wrapping
    setBodySmallFont(doc);
    const contentWidth = maxWidth - 32; // padding + number badge gutter
    const introLines = section.intro ? doc.splitTextToSize(sanitizeText(section.intro), contentWidth) : [];
    const bulletLinesByItem = section.bullets.map((b) =>
      doc.splitTextToSize(sanitizeText(b), contentWidth - 12)
    );
    const conclusionLines = section.conclusion
      ? doc.splitTextToSize(sanitizeText(section.conclusion), contentWidth)
      : [];

    // Dynamic card height based on wrapped content
    const titleHeight = section.title ? 10 : 4;
    const introHeight = introLines.length * PDF_CONFIG.lineHeight.body;
    const bulletsHeight =
      bulletLinesByItem.reduce((sum, lines) => sum + lines.length * PDF_CONFIG.lineHeight.body + 2, 0) || 0;
    const conclusionHeight = conclusionLines.length * PDF_CONFIG.lineHeight.body;
    const padding = 8; // reduced internal padding
    const cardHeight = titleHeight + 4 + introHeight + 4 + bulletsHeight + 4 + conclusionHeight + padding;

    // Check for page break
    yPosition = checkPageBreak(doc, yPosition, cardHeight + 8, pageHeight, margin);

    // Section card
    renderContentCard(doc, margin, yPosition, maxWidth, cardHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

    // Number badge
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.large, "F");

    // Title
    let cursorY = yPosition + 10; // reduced top padding
    doc.setTextColor(...PDF_CONFIG.textDark);
    setCardTitleFont(doc);
    if (section.title) {
      doc.text(section.title, margin + 20, cursorY);
    }

    // Intro
    cursorY = yPosition + 19; // moved down 3px for more spacing after title
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    introLines.forEach((line: string) => {
      doc.text(line, margin + 20, cursorY);
      cursorY += PDF_CONFIG.lineHeight.body;
    });

    // Bullets
    cursorY += 2;
    setBodySmallFont(doc);
    bulletLinesByItem.forEach((lines) => {
      doc.setFillColor(...PDF_CONFIG.primaryLight);
      doc.circle(margin + 22, cursorY - 1.5, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      lines.forEach((line: string) => {
        doc.text(line, margin + 28, cursorY);
        cursorY += PDF_CONFIG.lineHeight.body;
      });
      cursorY += 1;
    });

    // Conclusion (left border accent)
    cursorY += 2;
    const accentH = Math.max(6, conclusionLines.length * PDF_CONFIG.lineHeight.body);
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(margin + 6, cursorY - 4, 2, accentH, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.setFont("helvetica", "italic");
    conclusionLines.forEach((line: string) => {
      doc.text(line, margin + 12, cursorY);
      cursorY += PDF_CONFIG.lineHeight.body;
    });

    yPosition += cardHeight + 6; // reduced gap between cards
  });

  // Convergence section - bright purple background with white text
  yPosition = checkPageBreak(doc, yPosition, 65, pageHeight, margin);

  // Convergence background - solid purple (primary color)
  const convergenceHeight = 60;
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.roundedRect(margin, yPosition, maxWidth, convergenceHeight, 4, 4, "F");

  // Header - no icon
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
 * Render Why Now – Why Speed visual with styling matching on-screen component
 * Replicates: Header, three converging forces, market reset, Hobson's advantage, closing statement
 */
const renderWhyNowSpeed = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Header - pale blue box with purple text
  const headerHeight = 16;
  doc.setFillColor(219, 234, 254); // blue-100
  doc.setDrawColor(191, 219, 254); // blue-200
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "FD");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyBoldFont(doc);
  doc.text("The Real Estate industry is now choosing its intelligence layer", margin + 8, yPosition + 10);
  yPosition += headerHeight + 8;

  // Three Converging Forces section
  yPosition = checkPageBreak(doc, yPosition, 80, pageHeight, margin);
  
  const forcesHeight = 75;
  renderContentCard(doc, margin, yPosition, maxWidth, forcesHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  
  // Section header with icon
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Three forces are converging", margin + 20, yPosition + 12);
  
  const forces = [
    { title: "Technology is finally viable", desc: "AI can now deliver production-grade accuracy, auditability, and multi-document reasoning at scale - capabilities that did not exist even three years ago." },
    { title: "Economics leave no slack", desc: "Labour inflation, margin compression, and headcount constraints make manual document work structurally unaffordable." },
    { title: "Regulation is locking complexity in", desc: "Audit trails, ESG reporting, and risk obligations permanently increase document volume and scrutiny." },
  ];

  let forceY = yPosition + 22;
  forces.forEach((force) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 14, forceY, PDF_CONFIG.circleSize.medium, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodyBoldFont(doc);
    doc.text(force.title, margin + 22, forceY + 1);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    const descLines = doc.splitTextToSize(sanitizeText(force.desc), maxWidth - 30);
    let descY = forceY + 6;
    descLines.forEach((line: string) => {
      doc.text(line, margin + 22, descY);
      descY += PDF_CONFIG.lineHeight.tight;
    });
    forceY = descY + 4;
  });
  
  yPosition += forcesHeight + 6;

  // Market Reset section - amber background
  yPosition = checkPageBreak(doc, yPosition, 50, pageHeight, margin);
  
  const resetHeight = 46;
  doc.setFillColor(255, 251, 235); // amber-50
  doc.setDrawColor(253, 230, 138); // amber-200
  doc.roundedRect(margin, yPosition, maxWidth, resetHeight, 3, 3, "FD");
  
  // Header with warning icon
  doc.setFillColor(217, 119, 6); // amber-600
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("When forces converge, markets reset", margin + 20, yPosition + 12);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  const resetText1 = "The first trusted system becomes embedded. Standards form quickly. Switching costs rise. Late entrants struggle to displace incumbents.";
  const resetLines1 = doc.splitTextToSize(sanitizeText(resetText1), maxWidth - 16);
  let resetY = yPosition + 20;
  resetLines1.forEach((line: string) => {
    doc.text(line, margin + 8, resetY);
    resetY += PDF_CONFIG.lineHeight.tight;
  });
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodyBoldFont(doc);
  doc.text("This creates a narrow 12-18-month window to define the default system of record for AI in Real Estate.", margin + 8, resetY + 2);
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyBoldFont(doc);
  doc.text("Hobson is positioned to win that window.", margin + 8, resetY + 10);
  
  yPosition += resetHeight + 6;

  // Hobson's Advantage section
  yPosition = checkPageBreak(doc, yPosition, 40, pageHeight, margin);
  
  const advantageHeight = 36;
  renderContentCard(doc, margin, yPosition, maxWidth, advantageHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Hobson's Advantage", margin + 8, yPosition + 10);
  
  const advantages = [
    "Purpose-built AI for real estate complexity",
    "Auditable, source-linked reasoning",
    "Zero workflow disruption",
    "Designed for institutional trust",
  ];
  
  const advColWidth = (maxWidth - 16) / 2;
  let advY = yPosition + 18;
  advantages.forEach((adv, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const advX = margin + 8 + col * advColWidth;
    const advYPos = advY + row * 8;
    
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(advX + 2, advYPos - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    doc.text(adv, advX + 8, advYPos);
  });
  
  // "Once adopted" statement - purple
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyBoldFont(doc);
  doc.text("Once adopted, Hobson becomes operational infrastructure, not a tool.", margin + 8, yPosition + 32);
  
  yPosition += advantageHeight + 6;

  // Closing Statement - gradient-like purple box
  yPosition = checkPageBreak(doc, yPosition, 35, pageHeight, margin);
  
  const closingHeight = 32;
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, closingHeight, 3, 3, "FD");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodyBoldFont(doc);
  doc.text("This is a category-creation moment.", pageWidth / 2, yPosition + 10, { align: "center" });
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("The market is significant, and the pressure is real. The window is closing.", pageWidth / 2, yPosition + 18, { align: "center" });
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyBoldFont(doc);
  doc.text("Hobson is building the system of record for AI-driven real estate operations.", pageWidth / 2, yPosition + 26, { align: "center" });
  
  yPosition += closingHeight + PDF_CONFIG.spacing.sectionGap;
  return yPosition;
};

/**
 * Render Customers & Market Sources visual with clickable links
 */
const renderCustomersMarketSources = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  const sources = [
    {
      title: "Office for National Statistics (ONS), Business Population Estimates 2025",
      stat: "5.7M UK private sector businesses",
      linkText: "GOV.UK",
      linkUrl: "https://www.gov.uk/government/statistics/business-population-estimates-2024"
    },
    {
      title: "ONS UK Business Activity, Size and Location 2025",
      stat: "2.7M VAT/PAYE registered businesses",
      linkText: "Office for National Statistics",
      linkUrl: "https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation"
    },
    {
      title: "ONS Business Detailed Tables",
      stat: "Real Estate activities by SIC (Section L)",
      linkText: "GOV.UK",
      linkUrl: "https://www.gov.uk/government/statistics/business-population-estimates-2024"
    },
    {
      title: "McKinsey Global Survey on AI (2025)",
      stat: "~88% AI adoption in business functions",
      linkText: "McKinsey & Company",
      linkUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai"
    },
    {
      title: "McKinsey, Gen AI Real Estate Value",
      stat: "$110-$180B+ global value potential",
      linkText: "McKinsey & Company",
      linkUrl: "https://www.mckinsey.com/industries/real-estate/our-insights"
    },
    {
      title: "Deloitte Centre for Financial Services",
      stat: ">$7.2B AI/ML venture investment (relevant industry signalling)",
      linkText: "Deloitte United Kingdom",
      linkUrl: "https://www.deloitte.com/uk/en/industries/financial-services.html"
    }
  ];

  // Section header
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 4, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Data Sources", margin + 18, yPosition + 6);
  yPosition += 16;

  // Sources list
  sources.forEach((source, index) => {
    yPosition = checkPageBreak(doc, yPosition, 24, pageHeight, margin);
    
    // Title
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodyBoldFont(doc);
    const titleLines = doc.splitTextToSize(sanitizeText(source.title), maxWidth - 10);
    titleLines.forEach((line: string) => {
      doc.text(line, margin + 4, yPosition);
      yPosition += PDF_CONFIG.lineHeight.body;
    });
    
    // Stat
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    doc.text(sanitizeText(source.stat), margin + 4, yPosition);
    yPosition += PDF_CONFIG.lineHeight.body;
    
    // Link
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    setBodySmallFont(doc);
    const linkText = source.linkText;
    doc.text(linkText, margin + 4, yPosition);
    const linkWidth = doc.getTextWidth(linkText);
    doc.link(margin + 4, yPosition - 3, linkWidth, 5, { url: source.linkUrl });
    
    yPosition += 8;
    
    // Divider (except for last item)
    if (index < sources.length - 1) {
      doc.setDrawColor(...PDF_CONFIG.primaryLight);
      doc.setLineWidth(0.2);
      doc.line(margin + 4, yPosition - 2, margin + maxWidth - 4, yPosition - 2);
    }
  });

  yPosition += PDF_CONFIG.spacing.sectionGap;
  return yPosition;
};

/**
 * Render Strategic Approach visual with styling matching on-screen component
 * Updated to match new simplified content structure
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

  // ===== PILLAR 1: PRODUCT =====
  yPosition = checkPageBreak(doc, yPosition, 70, pageHeight, margin);

  // Number badge
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Product", margin + 18, yPosition + 7);

  // Subtitle - wrap long text
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  const productSubtitle = "Hobson has been built to replace document-driven human reasoning without disrupting existing workflows";
  const productSubLines = doc.splitTextToSize(sanitizeText(productSubtitle), maxWidth - 30);
  let subY = yPosition + 14;
  productSubLines.forEach((line: string) => {
    doc.text(line, margin + 18, subY);
    subY += PDF_CONFIG.lineHeight.body;
  });
  yPosition = subY + 4;

  const productItems = [
    "Operates inside current systems",
    "Zero onboarding or behavioural change",
    "Unifies reasoning across documents, emails, and platforms",
    "Transparent citations and verifiable outputs",
  ];

  yPosition = renderBulletList(doc, productItems, margin + 4, yPosition, maxWidth - 8, PDF_CONFIG.blue, PDF_CONFIG.textDark);
  yPosition += 2;

  // Conclusion box
  doc.setFillColor(...PDF_CONFIG.blueBg);
  const productConclusionHeight = 12;
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, productConclusionHeight, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.text("Trust is earned first. Expansion into proactive guidance and automation will follow.", margin + 14, yPosition + 7);
  yPosition += productConclusionHeight + 8;

  // ===== PILLAR 2: BRAND =====
  yPosition = checkPageBreak(doc, yPosition, 70, pageHeight, margin);

  // Number badge
  doc.setFillColor(...PDF_CONFIG.rose);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Brand", margin + 18, yPosition + 7);

  // Subtitle - wrap long text
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  const brandSubtitle = "Hobson has been designed for high-stakes operational environments where accuracy, traceability, and defensibility are non-negotiable";
  const brandSubLines = doc.splitTextToSize(sanitizeText(brandSubtitle), maxWidth - 30);
  subY = yPosition + 14;
  brandSubLines.forEach((line: string) => {
    doc.text(line, margin + 18, subY);
    subY += PDF_CONFIG.lineHeight.body;
  });
  yPosition = subY + 4;

  const brandItems = [
    "Predictable behaviour",
    "Transparent sources",
    "Clear expectations",
    "Fast feedback loops",
  ];

  yPosition = renderBulletList(doc, brandItems, margin + 4, yPosition, maxWidth - 8, PDF_CONFIG.rose, PDF_CONFIG.textDark);
  yPosition += 2;

  // Conclusion box
  doc.setFillColor(...PDF_CONFIG.roseBg);
  const brandConclusionHeight = 10;
  doc.roundedRect(margin + 8, yPosition, maxWidth - 16, brandConclusionHeight, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.text("The brand signals reliability under pressure.", margin + 14, yPosition + 6);
  yPosition += brandConclusionHeight + 8;

  // ===== PILLAR 3: BUSINESS MODEL =====
  yPosition = checkPageBreak(doc, yPosition, 60, pageHeight, margin);

  // Number badge
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Business Model", margin + 18, yPosition + 7);

  // Subtitle
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Hobson has been designed to become the default intelligence layer", margin + 18, yPosition + 14);
  yPosition += 14 + PDF_CONFIG.spacing.subtitleToBullets + PDF_CONFIG.lineHeight.body;

  const businessItems = [
    "Usage-based pricing aligned to value delivered (HEU)",
    "No licence, per-user, or per-asset fees",
    "Low base cost enabling broad adoption",
    "Full transparency into AI actions",
  ];

  yPosition = renderBulletList(doc, businessItems, margin + 4, yPosition, maxWidth - 8, PDF_CONFIG.amber, PDF_CONFIG.textDark);
  yPosition += PDF_CONFIG.spacing.sectionGap;

  return yPosition;
};

/**
 * Render Team Credibility visual matching on-screen component
 */
const renderTeamCredibility = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Header box
  const headerHeight = 36;
  renderContentCard(doc, margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Founded by the Team Behind Arthur Online", margin + 12, yPosition + 14);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const headerText = "Hobson was founded by the team behind Arthur Online, a Real Estate operations platform built and scaled for institutional adoption, which was acquired by Advent and Aareon in 2021.";
  const headerLines = doc.splitTextToSize(sanitizeText(headerText), maxWidth - 24);
  let headerY = yPosition + 22;
  headerLines.forEach((line: string) => {
    doc.text(line, margin + 12, headerY);
    headerY += PDF_CONFIG.lineHeight.body;
  });

  yPosition += headerHeight + 12;

  // Section 1: Direct Market Experience
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Direct Market Experience", margin + 18, yPosition + 7);
  yPosition += 14;

  // Experience box
  const expHeight = 24;
  renderContentCard(doc, margin + 10, yPosition, maxWidth - 20, expHeight, PDF_CONFIG.blueBg, PDF_CONFIG.blueBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const expText = "That experience provides direct insight into how Real Estate platforms are bought, deployed, and relied upon at scale - and where they break under document complexity, compliance pressure, and operational load.";
  const expLines = doc.splitTextToSize(sanitizeText(expText), maxWidth - 40);
  let expY = yPosition + 8;
  expLines.forEach((line: string) => {
    doc.text(line, margin + 18, expY);
    expY += PDF_CONFIG.lineHeight.body;
  });

  yPosition += expHeight + 12;

  // Section 2: The Team Brings
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("The Team Brings", margin + 18, yPosition + 7);
  yPosition += 14;

  const teamBrings = [
    "Proven experience building and scaling enterprise Real Estate software",
    "Deep understanding of document-heavy, regulated environments",
    "Credibility with institutional buyers and partners",
    "Prior experience navigating governance, security, and M&A processes",
  ];

  // 2x2 grid of cards
  const cardWidth = (maxWidth - 30) / 2;
  const cardHeight = 24;
  teamBrings.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + 10 + col * (cardWidth + 6);
    const cardY = yPosition + row * (cardHeight + 6);

    renderContentCard(doc, cardX, cardY, cardWidth, cardHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(cardX + 8, cardY + 8, PDF_CONFIG.circleSize.medium, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    const itemLines = doc.splitTextToSize(sanitizeText(item), cardWidth - 20);
    let itemY = cardY + 8;
    itemLines.forEach((line: string) => {
      doc.text(line, cardX + 14, itemY);
      itemY += PDF_CONFIG.lineHeight.body;
    });
  });

  yPosition += 2 * (cardHeight + 6) + PDF_CONFIG.spacing.sectionGap;
  return yPosition;
};

/**
 * Render Founding & Leadership visual matching on-screen component
 */
const renderFoundingLeadership = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Helper for page break
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header box - Proven Operators
  checkPageBreak(50);
  const headerHeight = 48;
  renderContentCard(doc, margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Proven Operators. Repeat Exits. Category Builders", margin + 18, yPosition + 14);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const headerText = "Hobson is led by a team that has built, scaled, and exited technology companies across three decades through multiple economic cycles and technology shifts. This is not a first venture.";
  const headerLines = doc.splitTextToSize(sanitizeText(headerText), maxWidth - 24);
  let headerY = yPosition + 24;
  headerLines.forEach((line: string) => {
    doc.text(line, margin + 12, headerY);
    headerY += PDF_CONFIG.lineHeight.body;
  });

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Hobson is the next evolution of a proven execution engine.", margin + 12, headerY + 2);
  doc.setFont("helvetica", "normal");

  yPosition += headerHeight + 12;

  // Section 1: The founding leadership has
  checkPageBreak(45);
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  doc.setTextColor(...PDF_CONFIG.bgWhite);
  doc.setFontSize(8);
  doc.text("1", margin + 8, yPosition + 7, { align: "center" });

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("The founding leadership has:", margin + 18, yPosition + 7);
  yPosition += 14;

  const foundingExperience = [
    "built businesses throughout the 1990s, 2000s, and 2010s,",
    "scaled enterprise software platforms in regulated industries,",
    "and executed successful exits."
  ];

  foundingExperience.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + 14, yPosition + 2, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.text(sanitizeText(item), margin + 20, yPosition + 3);
    yPosition += PDF_CONFIG.lineHeight.body + 1;
  });

  yPosition += 8;

  // Section 2: Arthur & Aareon Experience
  checkPageBreak(65);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  doc.setTextColor(...PDF_CONFIG.bgWhite);
  doc.setFontSize(8);
  doc.text("2", margin + 8, yPosition + 7, { align: "center" });

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Arthur & Aareon Experience", margin + 18, yPosition + 7);
  yPosition += 14;

  const arthurBoxHeight = 52;
  renderContentCard(doc, margin + 10, yPosition, maxWidth - 20, arthurBoxHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const arthurText1 = "Most notably, the team previously founded and scaled Arthur, a category-leading property management platform that Advent International and Aareon ultimately acquired in 2021.";
  const arthurLines1 = doc.splitTextToSize(sanitizeText(arthurText1), maxWidth - 40);
  let arthurY = yPosition + 8;
  arthurLines1.forEach((line: string) => {
    doc.text(line, margin + 18, arthurY);
    arthurY += PDF_CONFIG.lineHeight.body;
  });

  arthurY += 2;
  const arthurText2 = "Following that acquisition, the leadership remained deeply involved in enterprise growth and strategic expansion inside Aareon's global organisation, where they:";
  const arthurLines2 = doc.splitTextToSize(sanitizeText(arthurText2), maxWidth - 40);
  arthurLines2.forEach((line: string) => {
    doc.text(line, margin + 18, arthurY);
    arthurY += PDF_CONFIG.lineHeight.body;
  });

  arthurY += 2;
  const aareonExperience = [
    "led complex platform implementations,",
    "managed large enterprise clients,",
    "and executed additional acquisitions, including Fixflo and Tilt Property Software."
  ];

  aareonExperience.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 22, arthurY - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(sanitizeText(item), margin + 28, arthurY);
    arthurY += PDF_CONFIG.lineHeight.body;
  });

  yPosition += arthurBoxHeight + 12;

  // Section 3: Key Insight
  checkPageBreak(30);
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  doc.setTextColor(...PDF_CONFIG.bgWhite);
  doc.setFontSize(8);
  doc.text("3", margin + 8, yPosition + 7, { align: "center" });

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("This experience gives Hobson something few startups ever possess:", margin + 18, yPosition + 7);
  yPosition += 14;

  const insightBoxHeight = 16;
  renderContentCard(doc, margin + 10, yPosition, maxWidth - 20, insightBoxHeight, PDF_CONFIG.amberBg, PDF_CONFIG.amberBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Direct, operational knowledge of how to build, scale, integrate, and exit Real Estate technology businesses.", margin + 18, yPosition + 10);
  doc.setFont("helvetica", "normal");

  yPosition += insightBoxHeight + 12;

  // Section 4: What Team Has Navigated
  checkPageBreak(60);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  doc.setTextColor(...PDF_CONFIG.bgWhite);
  doc.setFontSize(8);
  doc.text("4", margin + 8, yPosition + 7, { align: "center" });

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Hobson's team has already navigated:", margin + 18, yPosition + 7);
  yPosition += 14;

  const teamNavigated = [
    "product-market fit,",
    "hypergrowth,",
    "enterprise implementation,",
    "cross-border expansion,",
    "post-acquisition integration,",
    "and strategic M&A execution."
  ];

  // 2x3 grid
  const cardWidth = (maxWidth - 30) / 2;
  const cardHeight = 16;
  teamNavigated.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + 10 + col * (cardWidth + 6);
    const cardY = yPosition + row * (cardHeight + 4);

    renderContentCard(doc, cardX, cardY, cardWidth, cardHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(cardX + 8, cardY + 8, PDF_CONFIG.circleSize.small, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.text(sanitizeText(item), cardX + 14, cardY + 10);
  });

  yPosition += 3 * (cardHeight + 4) + 12;

  // Conclusion box
  checkPageBreak(24);
  const conclusionHeight = 20;
  renderContentCard(doc, margin, yPosition, maxWidth, conclusionHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  const conclusionText = "Hobson enters the market with dramatically reduced execution risk and a clear blueprint for both scale and exit.";
  doc.text(sanitizeText(conclusionText), margin + 18, yPosition + 12);
  doc.setFont("helvetica", "normal");

  yPosition += conclusionHeight + PDF_CONFIG.spacing.sectionGap;
  return yPosition;
};

/**
 * Render Team visual matching on-screen component
 */
const renderTeam = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Helper for page break
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Core Team data
  const coreTeam = [
    { name: "—", role: "CEO", description: "", isTBC: true },
    { name: "Marc Trup", role: "Commercial Lead", description: "Driving enterprise sales, go-to-market execution, and customer growth" },
    { name: "Rochelle Trup", role: "Commercial Lead", description: "Leading commercial strategy, partnerships, and market expansion" },
    { name: "Julia Szaltoni", role: "Product Lead", description: "Driving product strategy, design, and customer outcomes with deep domain understanding of property operations and user behaviour" },
    { name: "Denis Kosenkov", role: "Senior AI Developer", description: "Architecting Hobson's AI systems and execution pipelines" },
    { name: "Kumar Ankit", role: "AI & Technical Lead", description: "Leading the core AI architecture and platform development" },
    { name: "Harriet Taylor", role: "Marketing Lead", description: "", isTBC: true },
    { name: "Max Grey", role: "Sales Lead", description: "", isTBC: true },
    { name: "Saul Trup", role: "Client Success Lead", description: "", isTBC: true },
  ];

  // Section 1: Core Operational Team Header
  checkPageBreak(30);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 6, PDF_CONFIG.circleSize.large, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Core Operational Team", margin + 18, yPosition + 8);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("The team driving Hobson's growth and innovation", margin + 18, yPosition + 16);
  yPosition += 24;

  // Team member cards - 2 columns
  const cardWidth = (maxWidth - 8) / 2;
  const cardHeight = 36;
  
  coreTeam.forEach((member, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    
    if (col === 0) {
      checkPageBreak(cardHeight + 6);
    }
    
    const cardX = margin + col * (cardWidth + 8);
    const cardY = col === 0 ? yPosition : yPosition;

    // Card background
    renderContentCard(doc, cardX, cardY, cardWidth, cardHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);

    // TBC badge
    if (member.isTBC) {
      doc.setFillColor(...PDF_CONFIG.amberBg);
      doc.roundedRect(cardX + cardWidth - 22, cardY + 4, 18, 8, 2, 2, "F");
      doc.setTextColor(...PDF_CONFIG.amber);
      doc.setFontSize(6);
      doc.text("TBC", cardX + cardWidth - 13, cardY + 9.5, { align: "center" });
    }

    // Initials circle
    const initials = member.name.split(' ').map(n => n[0]).join('');
    doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
    doc.circle(cardX + 14, cardY + 14, 8, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(initials, cardX + 14, cardY + 16.5, { align: "center" });

    // Name and role
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(member.name, cardX + 26, cardY + 12);

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(member.role, cardX + 26, cardY + 18);

    // Description
    if (member.description) {
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(7);
      const descLines = doc.splitTextToSize(sanitizeText(member.description), cardWidth - 32);
      let descY = cardY + 25;
      descLines.slice(0, 2).forEach((line: string) => {
        doc.text(line, cardX + 26, descY);
        descY += 4;
      });
    }

    if (col === 1 || idx === coreTeam.length - 1) {
      yPosition += cardHeight + 4;
    }
  });

  yPosition += 8;

  // Divider
  checkPageBreak(40);
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.setLineWidth(0.3);
  doc.line(margin + 40, yPosition, margin + maxWidth - 40, yPosition);
  
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  const dividerText = "STRATEGIC GUIDANCE";
  const dividerTextWidth = doc.getTextWidth(dividerText) + 16;
  doc.rect(margin + (maxWidth - dividerTextWidth) / 2, yPosition - 4, dividerTextWidth, 8, "F");
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(7);
  doc.text(dividerText, margin + maxWidth / 2, yPosition + 2, { align: "center" });
  yPosition += 16;

  // Section 2: Advisory Board Header
  doc.setFillColor(...PDF_CONFIG.textGray);
  doc.circle(margin + 8, yPosition + 6, PDF_CONFIG.circleSize.large, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Advisory Board", margin + 18, yPosition + 8);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Experienced advisors providing strategic guidance", margin + 18, yPosition + 16);
  yPosition += 24;

  // Advisor card
  const advisorCardHeight = 28;
  renderContentCard(doc, margin, yPosition, cardWidth, advisorCardHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);

  // Initials
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.circle(margin + 14, yPosition + 14, 8, "FD");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("ND", margin + 14, yPosition + 16.5, { align: "center" });

  // Name and role
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Nick Doffman", margin + 26, yPosition + 11);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Commercial Advisor", margin + 26, yPosition + 17);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(7);
  doc.text("Bringing deep commercial and industry experience to guide strategic growth", margin + 26, yPosition + 24);

  yPosition += advisorCardHeight + 10;

  // Upcoming advisors box
  checkPageBreak(40);
  const upcomingHeight = 32;
  renderContentCard(doc, margin, yPosition, maxWidth, upcomingHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 8, PDF_CONFIG.circleSize.small, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Additional advisors currently in formation to support:", margin + 16, yPosition + 10);

  const upcomingAreas = ["International expansion", "Enterprise partnerships", "Regulatory strategy"];
  const areaWidth = (maxWidth - 24) / 3;
  
  upcomingAreas.forEach((area, idx) => {
    const areaX = margin + 8 + idx * areaWidth;
    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.roundedRect(areaX, yPosition + 16, areaWidth - 4, 12, 2, 2, "F");
    
    doc.setFillColor(...PDF_CONFIG.textGray);
    doc.circle(areaX + 6, yPosition + 22, PDF_CONFIG.circleSize.small, "F");
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(area, areaX + 12, yPosition + 24);
  });

  yPosition += upcomingHeight + PDF_CONFIG.spacing.sectionGap;
  return yPosition;
};

/**
 * Render Raise visual matching on-screen component
 */
const renderRaise = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Funding header box
  const headerHeight = 32;
  renderContentCard(doc, margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  // Funding icon circle - aligned with FUNDING REQUIREMENT text
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 20, yPosition + 10, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("FUNDING REQUIREMENT", margin + 28, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setStatFont(doc);
  doc.text("GBP 1.8M", margin + 36, yPosition + 24);

  yPosition += headerHeight + 12;

  // Use of Funds section
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Use of Funds", margin + 18, yPosition + 7);
  yPosition += 14;

  const useOfFunds = [
    "To secure category leadership with a production-grade platform, QA, and security",
    "Core technical and go-to-market hiring",
    "Conversion of pilots into contracted deployments",
  ];

  useOfFunds.forEach((item) => {
    const cardHeight = 16;
    renderContentCard(doc, margin + 10, yPosition, maxWidth - 20, cardHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 20, yPosition + 8, PDF_CONFIG.circleSize.medium, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.text(item, margin + 28, yPosition + 10);

    yPosition += cardHeight + 4;
  });

  yPosition += PDF_CONFIG.spacing.sectionGap;
  return yPosition;
};

/**
 * Render Sector Scale & Opportunity visual
 */
const renderSectorScaleOpportunity = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Strapline box - left justified text
  const straplineText = "Real estate is one of the largest and most document-intensive industries in the UK and globally.";
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  const straplineLines = doc.splitTextToSize(straplineText, maxWidth - 30);
  const straplineHeight = Math.max(28, 14 + (straplineLines.length * 6));
  
  renderContentCard(doc, margin, yPosition, maxWidth, straplineHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  
  // Left justify text, vertically centered in box
  const textStartY = yPosition + (straplineHeight / 2) - ((straplineLines.length - 1) * 3);
  straplineLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + 15, textStartY + (idx * 6));
  });
  
  yPosition += straplineHeight + 10;

  // Document-Governed Industry section
  yPosition = checkPageBreak(doc, yPosition, 65, pageHeight, margin);
  const docGovHeight = 60;
  renderContentCard(doc, margin, yPosition, maxWidth, docGovHeight, PDF_CONFIG.blueBg, PDF_CONFIG.blueBorder);

  // Icon and title
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Document-Governed Industry", margin + 22, yPosition + 14);

  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Every core activity is governed by complex, long-lived documents:", margin + 10, yPosition + 24);

  // Activities grid - 2 columns
  const activities = [
    "Operations", "Planning Applications",
    "Funding & Refinancing", "Acquisitions & Disposals",
    "Leasing", "Compliance",
    "ESG Reporting", "Asset Management"
  ];

  const colWidth = (maxWidth - 30) / 2;
  let activityY = yPosition + 32;
  activities.forEach((activity, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + 10 + (col * colWidth);
    const yPos = activityY + (row * 7);
    
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(xPos + 2, yPos - 1.5, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.text(activity, xPos + 7, yPos);
  });

  yPosition += docGovHeight + 8;

  // Compounding Complexity section
  yPosition = checkPageBreak(doc, yPosition, 50, pageHeight, margin);
  const compoundHeight = 45;
  renderContentCard(doc, margin, yPosition, maxWidth, compoundHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.border);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Compounding Complexity", margin + 22, yPosition + 14);

  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Unlike many sectors, this document burden does not shrink with digitisation. It compounds over time:", margin + 10, yPosition + 24);

  // Stats row
  const stats = [
    { title: "Portfolios", subtitle: "Grow in size and complexity" },
    { title: "Regulation", subtitle: "Increases annually" },
    { title: "Reporting", subtitle: "Standards tighten continuously" }
  ];
  const statWidth = (maxWidth - 30) / 3;
  stats.forEach((stat, idx) => {
    const xPos = margin + 10 + (idx * statWidth);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(stat.title, xPos, yPosition + 34);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(stat.subtitle, xPos, yPosition + 40);
  });

  yPosition += compoundHeight + 8;

  // Structural Demand section
  // Structural Demand section (wrap-safe)
  const structuralText =
    "Real Estate represents structurally persistent demand for document intelligence — not a cyclical or discretionary software market.";
  const structuralLines = doc.splitTextToSize(sanitizeText(structuralText), maxWidth - 20);
  const structuralHeight = Math.max(38, 22 + structuralLines.length * PDF_CONFIG.lineHeight.body);

  yPosition = checkPageBreak(doc, yPosition, structuralHeight + 4, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, structuralHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Structural Demand", margin + 22, yPosition + 13);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.setFont("helvetica", "normal");
  renderSpacedText(doc, structuralText, margin + 10, yPosition + 26, maxWidth - 20, PDF_CONFIG.lineHeight.body);

  yPosition += structuralHeight + PDF_CONFIG.spacing.sectionGap;
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

  // Description - left aligned
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  const introText = "ONS size-band data shows the Real Estate sector skews heavily toward small- and mid-sized operators, but value is concentrated higher up. While smaller firms are numerous, document complexity, regulatory exposure, and spend focus grow rapidly as portfolios scale, creating a strong wedge for platforms that embed early and expand upward.";
  yPosition = renderSpacedText(doc, introText, margin, yPosition, maxWidth, PDF_CONFIG.lineHeight.body);
  yPosition += 10;

  const segments = [
    {
      title: "Large Operators",
      employees: "50–250 employees",
      percentage: "~5–10%",
      description: "larger and institutional operators (50+ employees)",
      color: PDF_CONFIG.blue,
      bgColor: [239, 246, 255] as [number, number, number],
      pressure: "Rising compliance and audit requirements, high document volumes driving staffing growth, and increasing exposure from missed obligations",
      adoptionDrivers: [
        "Need to control cost without adding headcount",
        "Requirement for traceable, defensible answers",
        "Pressure from LPs, lenders, and regulators",
      ],
    },
    {
      title: "Medium Operators",
      employees: "10–49 employees",
      percentage: "~20–25%",
      description: "small–mid firms (10–49 employees)",
      color: PDF_CONFIG.primaryColor,
      bgColor: PDF_CONFIG.primaryBgLight,
      pressure: "Scaling portfolios without proportional hiring, fragmented information across inboxes and shared drives, and decision bottlenecks are slowing transactions",
      adoptionDrivers: [
        "Margin compression",
        "Speed expectations from partners and capital providers",
        "Inability to scale manual processes",
      ],
    },
    {
      title: "Small Operators",
      employees: "1–9 employees",
      percentage: "~65–70%",
      description: "micro firms (1–9 employees)",
      color: PDF_CONFIG.emerald,
      bgColor: [236, 253, 245] as [number, number, number],
      pressure: "Severe time scarcity, no tolerance for complex tools, increasing regulatory and reporting burden",
      adoptionDrivers: [
        "Survival and competitiveness",
        "Need for instant answers without overhead",
      ],
    },
  ];

  segments.forEach((segment) => {
    // Calculate dynamic card height based on content
    setBodySmallFont(doc);
    const pressureLines = doc.splitTextToSize(sanitizeText(segment.pressure), maxWidth / 2 - 45);
    const driverLines = segment.adoptionDrivers.length;
    const contentLines = Math.max(pressureLines.length, driverLines + 1);
    const cardHeight = Math.max(75, 45 + contentLines * 5);

    yPosition = checkPageBreak(doc, yPosition, cardHeight + 8, pageHeight, margin);
    renderContentCard(doc, margin, yPosition, maxWidth, cardHeight, segment.bgColor, segment.color);

    // Header row - icon and title inline
    const headerY = yPosition + 14;
    const headerIconSize = PDF_CONFIG.circleSize.large;
    doc.setFillColor(...segment.color);
    doc.circle(margin + 12, headerY - 2, headerIconSize, "F");

    // Title - aligned with icon center
    doc.setTextColor(...PDF_CONFIG.textDark);
    setCardTitleFont(doc);
    doc.text(segment.title, margin + 22, headerY);

    // Percentage and description on second line
    doc.setTextColor(...segment.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(segment.percentage, margin + 22, yPosition + 22);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(segment.description, margin + 22 + doc.getTextWidth(segment.percentage + " "), yPosition + 22);

    // Two-column layout for PRESSURE and WHAT FORCES ADOPTION
    const colStartY = yPosition + 34;
    const iconSize = PDF_CONFIG.circleSize.medium;

    // PRESSURE section - left column
    const leftColIconX = margin + 12;
    const leftColTextX = margin + 22;
    
    // Pressure header with inline icon
    doc.setFillColor(...segment.color);
    doc.circle(leftColIconX, colStartY - 1, iconSize, "F");
    setCaptionFont(doc);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("PRESSURE", leftColTextX, colStartY);
    
    // Pressure content
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    renderSpacedText(doc, segment.pressure, leftColTextX, colStartY + 8, maxWidth / 2 - 40, PDF_CONFIG.lineHeight.body);

    // WHAT FORCES ADOPTION section - right column
    const rightColIconX = margin + maxWidth / 2 + 12;
    const rightColTextX = margin + maxWidth / 2 + 22;

    // Adoption header with inline icon
    doc.setFillColor(...segment.color);
    doc.circle(rightColIconX, colStartY - 1, iconSize, "F");
    setCaptionFont(doc);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("WHAT FORCES ADOPTION", rightColTextX, colStartY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    const rightColMaxWidth = maxWidth / 2 - 30;
    let driverY = colStartY + 8;
    segment.adoptionDrivers.forEach((driver) => {
      const wrappedDriver = doc.splitTextToSize(sanitizeText(driver), rightColMaxWidth);
      wrappedDriver.forEach((line: string, lineIndex: number) => {
        const prefix = lineIndex === 0 ? "•  " : "   ";
        doc.text(`${prefix}${line}`, rightColTextX, driverY);
        driverY += PDF_CONFIG.lineHeight.tight + 1;
      });
    });

    yPosition += cardHeight + PDF_CONFIG.spacing.cardGap;
  });

  // Footer insight - purple text with spacing
  yPosition = checkPageBreak(doc, yPosition, 22, pageHeight, margin);
  yPosition += 4; // Add gap from last card
  renderContentCard(doc, margin, yPosition, maxWidth, 14, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodySmallFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("One platform.  One intelligence layer.  Forced adoption across segments.", pageWidth / 2, yPosition + 9, { align: "center" });
  yPosition += 18;

  return yPosition;
};

/**
 * Render UK Market Size visual (updated)
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

  // Subtitle
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  doc.text("According to the UK government and ONS Business Population Estimates", margin, yPosition);
  yPosition += 12;

  // Section 1: UK Business Population
  yPosition = checkPageBreak(doc, yPosition, 50, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 46, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("UK Business Population", margin + 16, yPosition + 12);

  // Stats row
  const statsLeftX = margin + 12;
  const statsRightX = margin + maxWidth / 2 + 8;
  setStatFont(doc);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("~5.6 million", statsLeftX, yPosition + 28);
  doc.text("~2.6 million", statsRightX, yPosition + 28);
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Total UK businesses", statsLeftX, yPosition + 36);
  doc.text("VAT and/or PAYE-registered businesses", statsRightX, yPosition + 36);
  yPosition += 54;

  // Section 2: UK Real Estate Sector
  yPosition = checkPageBreak(doc, yPosition, 75, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 70, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("UK Real Estate Sector", margin + 16, yPosition + 12);
  
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Using ONS Standard Industrial Classification (SIC Section L - Real Estate Activities)", margin + 12, yPosition + 22);

  // Stats
  setStatFont(doc);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("~3-4%", statsLeftX, yPosition + 36);
  doc.text("~80,000-110,000", statsRightX, yPosition + 36);
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("of VAT/PAYE-registered UK firms", statsLeftX, yPosition + 44);
  doc.text("Real estate businesses in the UK", statsRightX, yPosition + 44);

  // Types list
  const realEstateTypes = [
    "Property owners and operators",
    "Asset and investment managers",
    "Letting and management agents",
    "Development and mixed-use operators",
  ];
  let typeY = yPosition + 54;
  doc.setTextColor(...PDF_CONFIG.textDark);
  realEstateTypes.forEach((type, index) => {
    const xPos = index % 2 === 0 ? margin + 12 : margin + maxWidth / 2;
    if (index % 2 === 0 && index > 0) typeY += PDF_CONFIG.lineHeight.body;
    doc.text(`• ${type}`, xPos, typeY);
  });
  yPosition += 78;

  // Section 3: Core Market
  yPosition = checkPageBreak(doc, yPosition, 50, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 46, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Core Market Entry", margin + 16, yPosition + 12);

  const centerX = margin + maxWidth / 2;
  setStatFont(doc);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("~90,000", centerX, yPosition + 28, { align: "center" });
  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Real estate operators where document intelligence is mission-critical", centerX, yPosition + 38, { align: "center" });
  yPosition += 54;

  // Section 4: Adjacent Market
  const adjacentMarkets = [
    { label: "Retail tenants & chains", range: "~180k-200k" },
    { label: "Restaurants, cafes & hospitality groups", range: "~200k-215k" },
    { label: "Gyms & leisure operators", range: "~15k-25k" },
    { label: "Architectural practices", range: "~40k-45k" },
    { label: "Planning consultants, surveyors & built-environment professionals", range: "~30k-40k" },
  ];
  const section4Height = 30 + adjacentMarkets.length * 8;
  yPosition = checkPageBreak(doc, yPosition, section4Height + 8, pageHeight, margin);
  const greenBg: [number, number, number] = [236, 253, 245];
  renderContentCard(doc, margin, yPosition, maxWidth, section4Height, greenBg, PDF_CONFIG.emerald);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Adjacent Market (Expansion Opportunity)", margin + 16, yPosition + 12);

  let adjacentY = yPosition + 24;
  setBodyFont(doc);
  adjacentMarkets.forEach((market) => {
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(`• ${market.label}`, margin + 12, adjacentY);
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.setFont("helvetica", "bold");
    doc.text(market.range, margin + maxWidth - 30, adjacentY);
    doc.setFont("helvetica", "normal");
    adjacentY += 8;
  });
  yPosition += section4Height + 8;

  // Summary section
  yPosition = checkPageBreak(doc, yPosition, 58, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 54, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setCardTitleFont(doc);
  doc.text("Summary", margin + 8, yPosition + 12);

  setBodyFont(doc);
  // Item 1 - Core Market
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 16, yPosition + 24, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("1", margin + 14.8, yPosition + 25.5);
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodyFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("Core Market", margin + 24, yPosition + 25);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("~90,000 real estate operators where document intelligence is mission-critical", margin + 24, yPosition + 32);

  // Item 2 - Expansion Market
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 16, yPosition + 42, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("2", margin + 14.8, yPosition + 43.5);
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodyFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("Expansion Market", margin + 24, yPosition + 43);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("500,000+ adjacent businesses built on the same document foundations", margin + 24, yPosition + 50);
  yPosition += 62;

  return yPosition;
};

/**
 * Render Competitive Landscape visual
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

  // Header - matching visual
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setSectionTitleFont(doc);
  doc.text("Context: A Category Still Forming", margin, yPosition);
  yPosition += 8;
  
  // Subtitle
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  doc.text("Despite the size of the sector:", margin, yPosition);
  yPosition += 12;

  // Market Gaps box
  const marketGaps = [
    "Legacy Prop Tech platforms are system-of-record for transactions, not intelligence",
    "Horizontal AI tools lack domain depth, accuracy, and auditability",
    "No AI-native platform has yet become the default intelligence layer for real estate documents",
  ];
  const gapsBoxHeight = 24 + marketGaps.length * 14;
  yPosition = checkPageBreak(doc, yPosition, gapsBoxHeight + 8, pageHeight, margin);
  const amberBg: [number, number, number] = [255, 251, 235];
  const amberColor: [number, number, number] = [217, 119, 6];
  renderContentCard(doc, margin, yPosition, maxWidth, gapsBoxHeight, amberBg, amberColor);
  doc.setFillColor(...amberColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Current Market Gaps", margin + 16, yPosition + 12);

  let gapY = yPosition + 26;
  setBodyFont(doc);
  marketGaps.forEach((gap) => {
    doc.setFillColor(...amberColor);
    doc.circle(margin + 14, gapY - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    const gapLines = doc.splitTextToSize(sanitizeText(gap), maxWidth - 30);
    gapLines.forEach((line: string, idx: number) => {
      doc.text(line, margin + 20, gapY + idx * 5);
    });
    gapY += 14;
  });
  yPosition += gapsBoxHeight + 10;

  // Rare Situation section
  yPosition = checkPageBreak(doc, yPosition, 60, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 55, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  
  // "This creates a rare situation:" text
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  doc.text("This creates a rare situation:", margin + 8, yPosition + 12);
  
  // Three items centered - purple text
  const rareSituation = ["Large, conservative market", "Clear structural pain", "No entrenched AI leader"];
  setBodyFont(doc);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  const situationText = rareSituation.join("  .  ");
  doc.text(situationText, pageWidth / 2, yPosition + 28, { align: "center" });
  
  // Consolidation note - italic
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  doc.setFont("helvetica", "italic");
  doc.text("Markets like this tend to consolidate quickly once a trusted standard emerges.", margin + 8, yPosition + 44);
  doc.setFont("helvetica", "normal");
  yPosition += 62;

  // AI-Native Features box
  const aiFeatures = ["Real-time reasoning", "Instant, referenced answers", "Embedded into workflows"];
  yPosition = checkPageBreak(doc, yPosition, 45, pageHeight, margin);
  const greenBg: [number, number, number] = [236, 253, 245];
  renderContentCard(doc, margin, yPosition, maxWidth, 40, greenBg, PDF_CONFIG.emerald);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("The After: AI-Native Intelligence Layers", margin + 16, yPosition + 12);

  // Features as centered text separated by full stops
  setBodyFont(doc);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PDF_CONFIG.textDark);
  const featuresText = aiFeatures.join("  .  ");
  doc.text(featuresText, pageWidth / 2, yPosition + 28, { align: "center" });
  doc.setFont("helvetica", "normal");
  yPosition += 48;

  // What This Means for Hobson box
  yPosition = checkPageBreak(doc, yPosition, 60, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 55, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setCardTitleFont(doc);
  doc.text("What This Means for Hobson", margin + 16, yPosition + 12);

  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  const hobsonText = "Hobson is positioned within a large and durable UK vertical, a global market undergoing structural change and an industry where early trust compounds into long-term defensibility.";
  const hobsonLines = doc.splitTextToSize(sanitizeText(hobsonText), maxWidth - 24);
  let hobsonY = yPosition + 24;
  hobsonLines.forEach((line: string) => {
    doc.text(line, margin + 12, hobsonY);
    hobsonY += PDF_CONFIG.lineHeight.body;
  });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  const closingText = "This section is not about pricing or near-term monetisation. It establishes why this market is worth building infrastructure for and why the upside is category-scale.";
  const closingLines = doc.splitTextToSize(sanitizeText(closingText), maxWidth - 24);
  let closingY = hobsonY + 4;
  closingLines.forEach((line: string) => {
    doc.text(line, margin + 12, closingY);
    closingY += PDF_CONFIG.lineHeight.body;
  });
  yPosition += 62;

  return yPosition;
};

/**
 * Render Global Opportunity visual
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

  // Intro text
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  doc.text("Independent global research firms consistently show:", margin, yPosition);
  yPosition += 12;

  // Research findings box
  const researchFindings = [
    "AI adoption in Real Estate is growing at ~35-36% CAGR",
    "A projected $1.8T global AI-in-real-estate market by 2030",
    "Measurable NOI and operational performance improvements at scale",
  ];
  const researchBoxHeight = 20 + researchFindings.length * 8;
  yPosition = checkPageBreak(doc, yPosition, researchBoxHeight + 8, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, researchBoxHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Global Market Research", margin + 16, yPosition + 12);

  let findingY = yPosition + 24;
  setBodyFont(doc);
  researchFindings.forEach((finding) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 14, findingY - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(finding, margin + 20, findingY);
    findingY += 8;
  });
  yPosition += researchBoxHeight + 10;

  // Structural pressure intro
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  doc.text("This growth is not driven by experimentation, but by structural pressure:", margin, yPosition);
  yPosition += 12;

  // Structural pressures box
  const structuralPressures = [
    "Labour shortages",
    "Rising compliance and ESG requirements",
    "Margin compression",
    "Increasing asset complexity",
  ];
  const pressureBoxHeight = 20 + Math.ceil(structuralPressures.length / 2) * 10;
  yPosition = checkPageBreak(doc, yPosition, pressureBoxHeight + 8, pageHeight, margin);
  const amberBg: [number, number, number] = [255, 251, 235];
  const amberColor: [number, number, number] = [217, 119, 6];
  renderContentCard(doc, margin, yPosition, maxWidth, pressureBoxHeight, amberBg, amberColor);
  doc.setFillColor(...amberColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Structural Pressures Driving Adoption", margin + 16, yPosition + 12);

  let pressureY = yPosition + 24;
  setBodyFont(doc);
  structuralPressures.forEach((pressure, index) => {
    const xPos = index % 2 === 0 ? margin + 12 : margin + maxWidth / 2;
    if (index % 2 === 0 && index > 0) pressureY += 10;
    doc.setFillColor(...amberColor);
    doc.circle(xPos + 2, pressureY - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(pressure, xPos + 8, pressureY);
  });
  yPosition += pressureBoxHeight + 10;

  // UK Within Global Context box
  yPosition = checkPageBreak(doc, yPosition, 45, pageHeight, margin);
  renderContentCard(doc, margin, yPosition, maxWidth, 40, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setCardTitleFont(doc);
  doc.text("UK Within Global Context", margin + 16, yPosition + 12);

  setBodyFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  const conclusionText = "The UK opportunity, therefore, sits inside a much larger global transition, with similar regulatory and document dynamics across Europe, North America, and OECD markets.";
  const conclusionLines = doc.splitTextToSize(sanitizeText(conclusionText), maxWidth - 24);
  let conclusionY = yPosition + 24;
  conclusionLines.forEach((line: string) => {
    doc.text(line, margin + 12, conclusionY);
    conclusionY += PDF_CONFIG.lineHeight.body;
  });
  yPosition += 48;

  return yPosition;
};

/**
 * Render Product Vision visual
 */
const renderProductVision = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Subtitle
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyFont(doc);
  doc.text("The AI Operating Layer for Real Estate", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  // Industry Context box
  const industryPains = [
    "Escalating regulatory complexity",
    "Fragmented systems",
    "Chronic labour shortages",
    "Rising operating costs",
    "Increasingly sophisticated landlord and tenant expectations",
  ];
  
  const industryBoxHeight = 70;
  yPosition = checkPageBreak(doc, yPosition, industryBoxHeight + 8, pageHeight, margin);
  doc.setFillColor(255, 251, 235); // amber-50
  doc.setDrawColor(253, 230, 138); // amber-200
  doc.roundedRect(margin, yPosition, maxWidth, industryBoxHeight, 3, 3, "FD");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("The global Real Estate industry is primed for change", margin + 8, yPosition + 12);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Operators are drowning in:", margin + 8, yPosition + 22);
  
  let painY = yPosition + 30;
  industryPains.forEach((pain) => {
    doc.setFillColor(217, 119, 6); // amber-600
    doc.circle(margin + 14, painY - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(pain, margin + 20, painY);
    painY += 7;
  });
  
  yPosition += industryBoxHeight + 8;

  // Vision statement box
  yPosition = checkPageBreak(doc, yPosition, 24, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "FD");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setCardTitleFont(doc);
  doc.text("Hobson is building the AI operating layer for the Real Estate industry.", pageWidth / 2, yPosition + 12, { align: "center" });
  yPosition += 28;

  // Market Gap box
  const marketGaps = [
    "Understands leases at scale",
    "Enforces compliance continuously",
    "Orchestrates maintenance and finance",
    "Predicts risk across entire portfolios",
  ];
  
  const gapBoxHeight = 58;
  yPosition = checkPageBreak(doc, yPosition, gapBoxHeight + 8, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, gapBoxHeight, 3, 3, "FD");
  
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("The Market Gap Hobson Fills", margin + 16, yPosition + 12);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Today, no platform:", margin + 8, yPosition + 24);
  
  let gapY = yPosition + 32;
  marketGaps.forEach((gap) => {
    doc.setFillColor(239, 68, 68); // red-500
    doc.circle(margin + 14, gapY - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(gap, margin + 20, gapY);
    gapY += 6;
  });
  yPosition += gapBoxHeight + 8;

  // Core Capabilities box
  const coreCapabilities = [
    "Property master data",
    "Lease abstraction",
    "Compliance calendars",
    "Financial intelligence",
    "Maintenance orchestration",
    "Communications automation",
  ];
  
  const capBoxHeight = 52;
  yPosition = checkPageBreak(doc, yPosition, capBoxHeight + 8, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, capBoxHeight, 3, 3, "FD");
  
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Hobson becomes the intelligence layer above every PMS", margin + 16, yPosition + 12);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("One Core Engine that delivers:", margin + 8, yPosition + 22);
  
  // 2x3 grid of capabilities
  let capY = yPosition + 30;
  coreCapabilities.forEach((cap, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + 8 + (col * (maxWidth / 2 - 4));
    const yPos = capY + (row * 7);
    
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(xPos + 2, yPos - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(cap, xPos + 8, yPos);
  });
  yPosition += capBoxHeight + 8;

  // Closing statement
  yPosition = checkPageBreak(doc, yPosition, 28, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.roundedRect(margin, yPosition, maxWidth, 24, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  setBodyBoldFont(doc);
  const closingText = "This makes Hobson the only platform capable of running a single operating model across residential and commercial portfolios.";
  const closingLines = doc.splitTextToSize(sanitizeText(closingText), maxWidth - 20);
  const closingLineHeight = 6;
  const closingTotalHeight = closingLines.length * closingLineHeight;
  const closingStartY = yPosition + (24 - closingTotalHeight) / 2 + 4;
  closingLines.forEach((line: string, idx: number) => {
    doc.text(line, pageWidth / 2, closingStartY + idx * closingLineHeight, { align: "center" });
  });
  yPosition += 32;

  return yPosition;
};

/**
 * Render Timeline and Innovation visual (updated from Early Roadmap)
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

  // Subtitle
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  doc.text("Strategic product development timeline covering discovery, validation, and development phases", margin, yPosition);
  yPosition += 12;

  // Phase 1: Discover & De-Risk
  const phase1Height = 55;
  yPosition = checkPageBreak(doc, yPosition, phase1Height + 8, pageHeight, margin);
  doc.setFillColor(236, 253, 245); // green-50
  doc.roundedRect(margin, yPosition, maxWidth, phase1Height, 3, 3, "F");
  doc.setFillColor(5, 150, 105); // green-600
  doc.rect(margin, yPosition, 4, phase1Height, "F");

  doc.setTextColor(5, 150, 105);
  setCardTitleFont(doc);
  doc.text("Phase 1: Discover & De-Risk", margin + 12, yPosition + 12);
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("May - Aug 2024  |  Completed", margin + maxWidth - 80, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.text("Validated systemic failure of existing property management systems:", margin + 12, yPosition + 24);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Confirmed market need for:", margin + 12, yPosition + 32);
  
  const phase1Items = ["Compliance risk", "Lease complexity", "Arrears management", "Maintenance chaos", "Portfolio fragmentation"];
  let p1Y = yPosition + 40;
  phase1Items.forEach((item, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const xPos = margin + 12 + (col * 55);
    const yPos = p1Y + (row * 6);
    doc.setFillColor(5, 150, 105);
    doc.circle(xPos + 2, yPos - 1, PDF_CONFIG.circleSize.small, "F");
    doc.text(item, xPos + 6, yPos);
  });
  yPosition += phase1Height + 6;

  // Phase 2: Validate Core Engine
  const phase2Height = 98;
  yPosition = checkPageBreak(doc, yPosition, phase2Height + 8, pageHeight, margin);
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(margin, yPosition, maxWidth, phase2Height, 3, 3, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(margin, yPosition, 4, phase2Height, "F");

  doc.setTextColor(5, 150, 105);
  setCardTitleFont(doc);
  doc.text("Phase 2: Validate Core Engine", margin + 12, yPosition + 12);
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Sep - Dec 2024  |  Completed", margin + maxWidth - 80, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text("Product-market fit is emerging.", margin + 12, yPosition + 24);
  doc.text("Four active pilot partners across operator sizes and system environments:", margin + 12, yPosition + 32);
  
  const phase2PilotItems = ["Large multi-system commercial operator", "Medium single-system operator", "Small owner-operator investment firms"];
  let p2Y = yPosition + 40;
  phase2PilotItems.forEach((item) => {
    doc.setFillColor(5, 150, 105);
    doc.circle(margin + 14, p2Y - 1, PDF_CONFIG.circleSize.small, "F");
    doc.text(item, margin + 18, p2Y);
    p2Y += 6;
  });
  
  doc.setFont("helvetica", "bold");
  doc.text("Validated Hobson's ability to:", margin + 12, p2Y + 2);
  doc.setFont("helvetica", "normal");
  
  const phase2AbilityItems = ["Abstract leases", "Normalise residential and commercial workflows", "Surface compliance and financial risk"];
  p2Y += 10;
  phase2AbilityItems.forEach((item) => {
    doc.setFillColor(5, 150, 105);
    doc.circle(margin + 14, p2Y - 1, PDF_CONFIG.circleSize.small, "F");
    doc.text(item, margin + 18, p2Y);
    p2Y += 6;
  });
  yPosition += phase2Height + 6;

  // Phase 3: Develop the MVP
  const phase3Items = [
    "Build MVP with core AI capabilities",
    "Online presence and branding",
    "Testing with key clients",
    "Pricing strategy",
    "Business plan",
  ];

  const phase3LineHeight = 6;
  const phase3HeaderHeight = 18; // title row space
  const phase3TopPadding = 8;
  const phase3BottomPadding = 8;
  const phase3ItemsStartOffset = 24;
  const phase3TextStartX = margin + 22;
  const phase3BulletX = margin + 16;
  const phase3TextMaxWidth = maxWidth - (phase3TextStartX - margin) - 10;

  // Compute dynamic height based on wrapped lines
  let phase3ItemsHeight = 0;
  phase3Items.forEach((item) => {
    const lines = doc.splitTextToSize(sanitizeText(item), phase3TextMaxWidth);
    phase3ItemsHeight += lines.length * phase3LineHeight;
  });

  const phase3Height =
    phase3ItemsStartOffset + phase3ItemsHeight + phase3BottomPadding;

  yPosition = checkPageBreak(doc, yPosition, phase3Height + 8, pageHeight, margin);
  doc.setFillColor(255, 251, 235); // amber-50
  doc.roundedRect(margin, yPosition, maxWidth, phase3Height, 3, 3, "F");
  doc.setFillColor(217, 119, 6); // amber-600
  doc.rect(margin, yPosition, 4, phase3Height, "F");

  doc.setTextColor(217, 119, 6);
  setCardTitleFont(doc);
  doc.text("Phase 3: Develop the MVP", margin + 12, yPosition + 12);
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Jan - Dec 2025  |  In Progress", margin + maxWidth - 80, yPosition + 12);

  // Bullets (default circles) with wrapping + proper spacing
  let p3Y = yPosition + phase3ItemsStartOffset;
  doc.setTextColor(...PDF_CONFIG.textDark);
  phase3Items.forEach((item) => {
    const lines = doc.splitTextToSize(sanitizeText(item), phase3TextMaxWidth);

    // bullet for first line
    doc.setFillColor(217, 119, 6);
    doc.circle(phase3BulletX, p3Y - 1, PDF_CONFIG.circleSize.small, "F");

    // first line
    doc.text(lines[0], phase3TextStartX, p3Y);
    p3Y += phase3LineHeight;

    // wrapped lines (indented, no extra bullet)
    for (let i = 1; i < lines.length; i += 1) {
      doc.text(lines[i], phase3TextStartX, p3Y);
      p3Y += phase3LineHeight;
    }
  });

  yPosition += phase3Height + 6;

  // Phase 4: Build the Industry Operating Layer
  const phase4Height = 42;
  yPosition = checkPageBreak(doc, yPosition, phase4Height + 8, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, phase4Height, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.rect(margin, yPosition, 4, phase4Height, "F");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setCardTitleFont(doc);
  doc.text("Phase 4: Build the Industry Operating Layer", margin + 12, yPosition + 12);
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text("Jan - Sep 2026  |  Upcoming", margin + 12, yPosition + 20);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text("Hobson MVP expands from \"document AI\" into full workflow intelligence.", margin + 12, yPosition + 30);
  yPosition += phase4Height + 10;

  // 2026-2028 Business Timeline
  yPosition = checkPageBreak(doc, yPosition, 50, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 4, yPosition - 1, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("2026-2028: Scale, Monetise, Dominate", margin + 12, yPosition);
  yPosition += 12;

  const businessPhases = [
    { year: "2026", title: "Prove Commercial Model", items: ["10+ pilot organisations", "3-5 paying customers", "Full UK market readiness"] },
    { year: "2027", title: "UK Market Capture", items: ["Public launch Q1", "Aggressive go-to-market", "Platform hardened for scale"] },
    { year: "2028", title: "Global Expansion", items: ["Multi-market release", "Local compliance models", "Global partnerships"] },
  ];

  const cardWidth = (maxWidth - 12) / 3;
  const cardHeight = 50;
  businessPhases.forEach((phase, idx) => {
    const cardX = margin + idx * (cardWidth + 6);
    
    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.setDrawColor(...PDF_CONFIG.border);
    doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 3, 3, "FD");
    
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.roundedRect(cardX + 4, yPosition + 4, 24, 8, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(phase.year, cardX + 16, yPosition + 9, { align: "center" });
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.setFont("helvetica", "bold");
    doc.text(phase.title, cardX + 4, yPosition + 20);
    
    doc.setFont("helvetica", "normal");
    let itemY = yPosition + 28;
    phase.items.forEach((item) => {
      doc.setFillColor(...PDF_CONFIG.primaryColor);
      doc.circle(cardX + 8, itemY - 1, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.text(item, cardX + 12, itemY);
      itemY += 6;
    });
  });
  yPosition += cardHeight + 12;

  // Commercial Impact
  yPosition = checkPageBreak(doc, yPosition, 36, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 32, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Commercial Impact for Operators", margin + 8, yPosition + 10);
  
  const impacts = [
    { value: "35-45%", label: "Cost reduction per unit" },
    { value: "Sub-linear", label: "Headcount growth" },
    { value: "Near-zero", label: "Compliance failures" },
    { value: "Material", label: "Cashflow predictability" },
  ];
  
  const impactWidth = (maxWidth - 16) / 4;
  impacts.forEach((impact, idx) => {
    const xPos = margin + 8 + idx * impactWidth;
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    setBodyBoldFont(doc);
    doc.text(impact.value, xPos, yPosition + 20);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.text(impact.label, xPos, yPosition + 26);
  });
  yPosition += 40;

  // Closing statement
  yPosition = checkPageBreak(doc, yPosition, 24, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  setBodyBoldFont(doc);
  doc.text("Hobson is becoming the operating system for Real Estate management.", pageWidth / 2, yPosition + 12, { align: "center" });
  yPosition += 28;

  return yPosition;
};

/**
 * Render Commercialisation Strategy visual
 * Uses PDF_CONFIG defaults for all sizing and spacing
 */
const renderCommercialisationStrategy = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { box, spacing, circleSize, lineHeightFactor } = PDF_CONFIG;

  // Helper for page break
  const checkBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header box - Inflexion Point
  checkBreak(28);
  const headerHeight = 24;
  renderContentCard(doc, margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.amberBg, PDF_CONFIG.amberBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("The Real Estate industry is at an inflexion point.", margin + box.paddingX + 4, yPosition + 15);

  yPosition += headerHeight + spacing.sectionGap + 4;

  // Section 1: Operators Are Facing
  checkBreak(70);
  doc.setFillColor(...PDF_CONFIG.rose);
  doc.circle(margin + box.paddingX, yPosition + 5, circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Operators are facing:", margin + PDF_CONFIG.card.textOffsetX - 2, yPosition + 7);
  yPosition += spacing.headerToContent - 4;

  const challenges = [
    "exploding regulatory complexity,",
    "shrinking operating margins,",
    "acute labour shortages,",
    "rising compliance penalties,",
    "and mounting portfolio risk."
  ];

  challenges.forEach((challenge) => {
    const cardHeight = 14;
    renderContentCard(doc, margin + PDF_CONFIG.card.iconOffsetX, yPosition, maxWidth - PDF_CONFIG.card.textOffsetX, cardHeight, PDF_CONFIG.roseBg, PDF_CONFIG.roseBorder);
    
    doc.setFillColor(...PDF_CONFIG.rose);
    doc.circle(margin + PDF_CONFIG.card.textOffsetX - 2, yPosition + 7, circleSize.small, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.text(sanitizeText(challenge), margin + PDF_CONFIG.card.textOffsetX + 4, yPosition + 9);
    yPosition += cardHeight + 3;
  });

  yPosition += spacing.paragraphGap;

  // Callout box
  const calloutHeight = 20;
  renderContentCard(doc, margin + PDF_CONFIG.card.iconOffsetX, yPosition, maxWidth - PDF_CONFIG.card.textOffsetX, calloutHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("They cannot wait for incremental tools. They need a ", margin + box.paddingX * 2, yPosition + 12);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("structural operating upgrade", margin + box.paddingX * 2 + doc.getTextWidth("They cannot wait for incremental tools. They need a "), yPosition + 12);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(".", margin + box.paddingX * 2 + doc.getTextWidth("They cannot wait for incremental tools. They need a structural operating upgrade"), yPosition + 12);
  doc.setFont("helvetica", "normal");

  yPosition += calloutHeight + spacing.sectionGap + 4;

  // Section 2: Hobson's Product
  checkBreak(60);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + box.paddingX, yPosition + 5, circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Hobson's product is already solving existential problems:", margin + PDF_CONFIG.card.textOffsetX - 2, yPosition + 7);
  yPosition += spacing.headerToContent - 4;

  const problemsSolved = [
    "compliance exposure,",
    "lease complexity,",
    "maintenance volatility,",
    "and portfolio-level risk blindness."
  ];

  // 2x2 grid
  const cardWidth = (maxWidth - 30) / 2;
  const cardHeight = 20;
  problemsSolved.forEach((problem, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + PDF_CONFIG.card.iconOffsetX + col * (cardWidth + spacing.cardGap);
    const cardY = yPosition + row * (cardHeight + spacing.paragraphGap);

    renderContentCard(doc, cardX, cardY, cardWidth, cardHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(cardX + PDF_CONFIG.card.iconOffsetX, cardY + 10, circleSize.small, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.text(sanitizeText(problem), cardX + box.paddingX * 2, cardY + 12);
  });

  yPosition += 2 * (cardHeight + spacing.paragraphGap) + spacing.sectionGap + 4;

  // Conclusion box
  checkBreak(32);
  const conclusionHeight = 28;
  renderContentCard(doc, margin, yPosition, maxWidth, conclusionHeight, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + box.paddingX + 4, yPosition + 14, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Commercialisation is not an experiment. It is an ", margin + PDF_CONFIG.card.textOffsetX, yPosition + 11);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("inevitability", margin + PDF_CONFIG.card.textOffsetX + doc.getTextWidth("Commercialisation is not an experiment. It is an "), yPosition + 11);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(".", margin + PDF_CONFIG.card.textOffsetX + doc.getTextWidth("Commercialisation is not an experiment. It is an inevitability"), yPosition + 11);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.text("The only question is who captures the category.", margin + PDF_CONFIG.card.textOffsetX, yPosition + 21);
  doc.setFont("helvetica", "normal");

  yPosition += conclusionHeight + spacing.sectionGap;
  return yPosition;
};

/**
 * Render Commercials visual
 * Uses PDF_CONFIG defaults for all sizing and spacing
 */
const renderCommercials = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { box, spacing, circleSize, lineHeight } = PDF_CONFIG;

  // Helper for page break
  const checkBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header - Intro text
  checkBreak(20);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  const introText = "This is designed to kill procurement friction and accelerate viral adoption inside organisations.";
  const introLines = doc.splitTextToSize(introText, maxWidth);
  doc.text(introLines, pageWidth / 2, yPosition, { align: "center" });
  yPosition += introLines.length * lineHeight.loose + spacing.sectionGap + 8;

  // Section 1: Revenue Expansion Engine
  checkBreak(100);
  const revenueCardHeight = 90;
  renderContentCard(doc, margin, yPosition, maxWidth, revenueCardHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

  // Header with circle icon
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + PDF_CONFIG.card.textOffsetX, yPosition + 14, circleSize.xlarge + 2, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Built-In Revenue Expansion Engine", margin + PDF_CONFIG.card.textOffsetX + 12, yPosition + spacing.headerToContent);

  yPosition += 28;

  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  const revenueIntro = "Hobson has something most startups do not: automatic net revenue retention growth.";
  doc.text(revenueIntro, margin + box.paddingX * 2, yPosition);
  yPosition += spacing.sectionGap + 2;

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("As operators:", margin + box.paddingX * 2, yPosition);
  yPosition += box.paddingX;

  const expansionDrivers = [
    "grow portfolios,",
    "expand into new jurisdictions,",
    "face more compliance,",
    "manage more complex leases,",
    "increase reporting demands,"
  ];

  doc.setFont("helvetica", "normal");
  expansionDrivers.forEach((driver) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + PDF_CONFIG.card.textOffsetX + 2, yPosition - 1, circleSize.small + 0.3, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(driver, margin + PDF_CONFIG.card.textOffsetX + box.paddingX, yPosition);
    yPosition += spacing.cardGap;
  });

  yPosition += spacing.cardGap;

  // Callout
  const calloutY = yPosition;
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin + box.paddingX + 4, calloutY - spacing.paragraphGap, maxWidth - box.paddingX * 3, 14, box.borderRadiusSmall, box.borderRadiusSmall, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  doc.text("Their HEU consumption rises ", margin + PDF_CONFIG.card.textOffsetX, calloutY + lineHeight.body);
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFont("helvetica", "bold");
  doc.text("without a single sales conversation", margin + PDF_CONFIG.card.textOffsetX + doc.getTextWidth("Their HEU consumption rises "), calloutY + lineHeight.body);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(".", margin + PDF_CONFIG.card.textOffsetX + doc.getTextWidth("Their HEU consumption rises without a single sales conversation"), calloutY + lineHeight.body);

  yPosition += 24;

  // Section 2: Transparency
  checkBreak(80);
  const transparencyCardHeight = 70;
  renderContentCard(doc, margin, yPosition, maxWidth, transparencyCardHeight, PDF_CONFIG.blueBg, PDF_CONFIG.blueBorder);

  // Header with circle icon
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + PDF_CONFIG.card.textOffsetX, yPosition + 14, circleSize.xlarge + 2, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Unmatched Transparency = Enterprise Trust", margin + PDF_CONFIG.card.textOffsetX + 12, yPosition + spacing.headerToContent);

  yPosition += 28;

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  setBodySmallFont(doc);
  doc.text("Hobson provides:", margin + box.paddingX * 2, yPosition);
  yPosition += box.paddingX;

  const transparencyFeatures = [
    "real-time HEU usage bars,",
    "per-message cost breakdowns,",
    "full audit trails of AI effort"
  ];

  doc.setFont("helvetica", "normal");
  transparencyFeatures.forEach((feature) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + PDF_CONFIG.card.textOffsetX + 2, yPosition - 1, circleSize.small + 0.3, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(feature, margin + PDF_CONFIG.card.textOffsetX + box.paddingX, yPosition);
    yPosition += spacing.cardGap;
  });

  yPosition += spacing.sectionGap + 2;

  // Bottom callout box
  checkBreak(30);
  const bottomCalloutHeight = 24;
  renderContentCard(doc, margin, yPosition, maxWidth, bottomCalloutHeight, PDF_CONFIG.blueBg, PDF_CONFIG.blueBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("This gives finance teams ", margin + box.paddingX * 2, yPosition + spacing.sectionGap + 2);
  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFont("helvetica", "bold");
  doc.text("absolute certainty on cost control", margin + box.paddingX * 2 + doc.getTextWidth("This gives finance teams "), yPosition + spacing.sectionGap + 2);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(".", margin + box.paddingX * 2 + doc.getTextWidth("This gives finance teams absolute certainty on cost control"), yPosition + spacing.sectionGap + 2);

  doc.setFont("helvetica", "normal");
  doc.text("It removes the biggest objection enterprises have to AI: ", margin + box.paddingX * 2, yPosition + spacing.headerToContent);
  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFont("helvetica", "bold");
  doc.text("unpredictable cost", margin + box.paddingX * 2 + doc.getTextWidth("It removes the biggest objection enterprises have to AI: "), yPosition + spacing.headerToContent);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(".", margin + box.paddingX * 2 + doc.getTextWidth("It removes the biggest objection enterprises have to AI: unpredictable cost"), yPosition + spacing.headerToContent);

  yPosition += bottomCalloutHeight + spacing.sectionGap;
  return yPosition;
};

/**
 * Render Business Objectives visual
 * Uses PDF_CONFIG defaults for all sizing and spacing
 */
const renderBusinessObjectives = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { box, spacing, circleSize, lineHeight, lineHeightFactor } = PDF_CONFIG;

  // Helper for page break
  const checkBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Intro box
  checkBreak(40);
  const introText = "The next 12 months are focused on completing the MVP for early 2026, validating Hobson in real operational settings, and building the foundations needed for commercial rollout and long-term scale.";
  const innerTextWidth = maxWidth - box.paddingX * 2;
  const introLines = doc.splitTextToSize(introText, innerTextWidth);
  const introHeight = introLines.length * lineHeight.body + spacing.sectionGap + 2;
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(introText, margin + box.paddingX, yPosition + spacing.contentStart, {
    maxWidth: innerTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.body,
  });
  yPosition += introHeight + spacing.sectionGap + 2;

  // Top-Level Organisational Goals
  checkBreak(65);
  const orgGoalsHeight = 62;
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, orgGoalsHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.emeraldBorder);
  doc.roundedRect(margin, yPosition, maxWidth, orgGoalsHeight, box.borderRadius, box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + box.paddingX + 6, yPosition + 12, circleSize.large + 0.8, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Top-Level Organisational Goals", margin + PDF_CONFIG.card.textOffsetX + 4, yPosition + 14);
  
  const orgGoals = [
    "Validate Hobson's usefulness and reliability across a broader range of Real Estate operators",
    "Establish a stable, predictable MVP that supports ongoing refinement and automation",
    "Build scalable internal systems for support, onboarding, and data operations",
    "Create a commercial foundation capable of driving paid adoption during 2026-2027"
  ];
  
  let goalY = yPosition + 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  orgGoals.forEach((goal) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + box.paddingX + 4, goalY - 1, circleSize.bullet, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    const goalLines = doc.splitTextToSize(goal, maxWidth - 24);
    goalLines.forEach((line: string, idx: number) => {
      doc.text(line, margin + box.paddingX * 2, goalY + idx * lineHeight.tight);
    });
    goalY += goalLines.length * lineHeight.tight + 2;
  });
  yPosition += orgGoalsHeight + spacing.cardGap + 2;

  // Mid- to Long-Term Vision
  checkBreak(60);
  const visionHeight = 55;
  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, yPosition, maxWidth, visionHeight, box.borderRadius, box.borderRadius, "F");
  
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + box.paddingX * 2, yPosition + 14, circleSize.xlarge + 1, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Mid- to Long-Term Vision (2-3+ Years)", margin + PDF_CONFIG.card.textOffsetX + 8, yPosition + spacing.headerToContent);
  
  doc.setFont("helvetica", "normal");
  setBodySmallFont(doc);
  doc.setTextColor(...PDF_CONFIG.textGray);
  const visionText = "Hobson will evolve from a retrieval-focused MVP (2026) into a proactive AI assistant replacing manual document work in Real Estate with AI-driven reasoning, delivering instant, traceable answers.";
  const visionLines = doc.splitTextToSize(visionText, maxWidth - box.paddingX * 2.5);
  visionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + box.paddingX + 2, yPosition + 30 + idx * lineHeight.body);
  });
  yPosition += visionHeight + spacing.sectionGap + 2;

  // Market Validation Stats
  checkBreak(45);
  const statsHeight = 40;
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, statsHeight, box.borderRadius, box.borderRadius, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Market Validation Shows Strong Tailwinds", margin + box.paddingX + 2, yPosition + 14);

  const stats = [
    { value: "36.1%", label: "CAGR in AI for Real Estate" },
    { value: "$1.8T", label: "Global market by 2030" },
    { value: "10-20%", label: "Efficiency gains with AI" }
  ];
  
  const statWidth = (maxWidth - box.paddingX * 2.5) / 3;
  stats.forEach((stat, idx) => {
    const xPos = margin + box.paddingX + 2 + idx * statWidth;
    doc.setTextColor(...PDF_CONFIG.amber);
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, xPos + statWidth / 2, yPosition + 28, { align: "center" });
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(stat.label, xPos + statWidth / 2, yPosition + 35, { align: "center" });
  });
  yPosition += statsHeight + spacing.sectionGap + 2;

  // SMART Objectives Header
  checkBreak(20);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Objectives (2025-2027 Timeline)", margin, yPosition);
  yPosition += spacing.headerToContent - 4;

  // Objectives grid - 4 categories
  const objectives = [
    {
      title: "Product & Market Validation (2026)",
      color: PDF_CONFIG.primaryColor,
      bgColor: PDF_CONFIG.primaryBgLight,
      items: [
        "Add five new non-paying pilot customers by Q1 2026",
        "Achieve 80%+ satisfaction across pilot users by Q3 2026",
        "Reduce average retrieval friction by 30% by Q4 2026",
        "Demonstrate willingness to pay by Q4 2026"
      ]
    },
    {
      title: "Commercial & Revenue (2026-2027)",
      color: PDF_CONFIG.emerald,
      bgColor: PDF_CONFIG.emeraldBg,
      items: [
        "Convert 3-5 pilots into paying accounts by Q4 2026",
        "Reach GBP 50k-100k MRR by Q4 2027",
        "Maintain 70%+ retention across early paid users by Q4 2027",
        "Validate ROI across small, medium, and large operators"
      ]
    },
    {
      title: "Brand & Market Presence (2026)",
      color: PDF_CONFIG.rose,
      bgColor: PDF_CONFIG.roseBg,
      items: [
        "Increase brand awareness by 25% by Q4 2026",
        "Publish three case studies by Q3 2026",
        "Introduce confidence indicators by Q4 2026"
      ]
    },
    {
      title: "Operational & Internal (2026-2027)",
      color: PDF_CONFIG.textGray,
      bgColor: PDF_CONFIG.bgLight,
      items: [
        "Establish lightweight support framework by Q4 2026",
        "Automate 30% of internal workflows by Q1 2027",
        "Deliver Phase 2 development by Q4 2026"
      ]
    }
  ];

  const colWidth = (maxWidth - spacing.cardGap - 2) / 2;
  const objCardHeight = 55;
  
  // Row 1 - first two objectives
  checkBreak(objCardHeight * 2 + spacing.cardGap + 20);
  
  // Draw first row (2 cards side by side)
  for (let i = 0; i < 2; i++) {
    const obj = objectives[i];
    const xPos = margin + i * (colWidth + spacing.cardGap + 2);
    
    doc.setFillColor(...obj.bgColor);
    doc.roundedRect(xPos, yPosition, colWidth, objCardHeight, box.borderRadius, box.borderRadius, "F");
    
    doc.setFillColor(...obj.color);
    doc.circle(xPos + box.paddingX + 2, yPosition + 10, circleSize.large - 0.2, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(obj.title, xPos + PDF_CONFIG.card.textOffsetX - 2, yPosition + 12);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    let itemY = yPosition + 22;
    obj.items.forEach((item) => {
      doc.setFillColor(...obj.color);
      doc.circle(xPos + box.paddingX + 2, itemY - 1, circleSize.bullet, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      const itemLines = doc.splitTextToSize(item, colWidth - box.paddingX * 2.5);
      itemLines.forEach((line: string, lineIdx: number) => {
        doc.text(line, xPos + box.paddingX + 6, itemY + lineIdx * lineHeight.tight);
      });
      itemY += itemLines.length * lineHeight.tight + 2;
    });
  }
  yPosition += objCardHeight + spacing.cardGap;

  // Row 2 - second two objectives
  for (let i = 2; i < 4; i++) {
    const obj = objectives[i];
    const xPos = margin + (i - 2) * (colWidth + spacing.cardGap + 2);
    
    doc.setFillColor(...obj.bgColor);
    doc.roundedRect(xPos, yPosition, colWidth, objCardHeight, box.borderRadius, box.borderRadius, "F");
    
    doc.setFillColor(...obj.color);
    doc.circle(xPos + box.paddingX + 2, yPosition + 10, circleSize.large - 0.2, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(obj.title, xPos + PDF_CONFIG.card.textOffsetX - 2, yPosition + 12);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    let itemY = yPosition + 22;
    obj.items.forEach((item) => {
      doc.setFillColor(...obj.color);
      doc.circle(xPos + box.paddingX + 2, itemY - 1, circleSize.bullet, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      const itemLines = doc.splitTextToSize(item, colWidth - box.paddingX * 2.5);
      itemLines.forEach((line: string, lineIdx: number) => {
        doc.text(line, xPos + box.paddingX + 6, itemY + lineIdx * lineHeight.tight);
      });
      itemY += itemLines.length * lineHeight.tight + 2;
    });
  }
  yPosition += objCardHeight + spacing.sectionGap + 4;

  // Timeline Progression
  checkBreak(50);
  const timelineBoxHeight = 45;
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, timelineBoxHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, timelineBoxHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Business Objectives Create a Clean Progression", pageWidth / 2, yPosition + 12, { align: "center" });

  const timeline = [
    { year: "2026", desc: "Deliver MVP + expand pilots, validate market" },
    { year: "2027", desc: "Public launch, commercial expansion" },
    { year: "2028+", desc: "Enter Europe and global markets" }
  ];
  
  const timelineWidth = (maxWidth - box.paddingX * 2.5) / 3;
  timeline.forEach((t, idx) => {
    const xPos = margin + box.paddingX + 2 + idx * timelineWidth;
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(t.year, xPos + timelineWidth / 2, yPosition + 26, { align: "center" });
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(t.desc, timelineWidth - 10);
    descLines.forEach((line: string, lineIdx: number) => {
      doc.text(line, xPos + timelineWidth / 2, yPosition + 34 + lineIdx * lineHeight.tight, { align: "center" });
    });
  });
  yPosition += timelineBoxHeight + spacing.sectionGap + 2;

  // Flow: Prove -> Refine -> Scale -> Commercialise -> Expand
  checkBreak(20);
  const flowItems = ["Prove", "Refine", "Scale", "Commercialise", "Expand Globally"];
  const flowItemWidth = (maxWidth - 30) / flowItems.length;
  
  flowItems.forEach((item, idx) => {
    const xPos = margin + idx * flowItemWidth + idx * spacing.cardGap;
    doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
    doc.roundedRect(xPos, yPosition, flowItemWidth, 14, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(item, xPos + flowItemWidth / 2, yPosition + 9, { align: "center" });
    
    if (idx < flowItems.length - 1) {
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.text("->", xPos + flowItemWidth + 1, yPosition + 9);
    }
  });
  yPosition += 24;

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
    const cardHeight = headerHeight + PDF_CONFIG.spacing.subtitleToBullets + objectivesHeight + 8;
    
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
    let objY = yPosition + headerHeight + PDF_CONFIG.spacing.subtitleToBullets;
    setBodySmallFont(doc);
    yearData.objectives.forEach((obj) => {
      doc.setFillColor(...yearData.color);
      doc.circle(margin + 16, objY - 1, PDF_CONFIG.circleSize.small, "F");
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
    const titleToItemsGap = PDF_CONFIG.spacing.subtitleToBullets;
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
      doc.circle(margin + 14, itemY - 1, PDF_CONFIG.circleSize.small, "F");
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
 * Uses PDF_CONFIG defaults for all sizing and spacing
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
  const { box, spacing, circleSize, lineHeight } = PDF_CONFIG;

  // Helper for page break
  const checkBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header - The HEU Model
  checkBreak(32);
  const headerHeight = 28;
  renderContentCard(doc, margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + box.paddingX + 4, yPosition + 14, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("The HEU Model", margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  doc.text("Hobson's pricing model is a ", margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + 21);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("usage-based infrastructure monetisation model", margin + PDF_CONFIG.card.textOffsetX + 2 + doc.getTextWidth("Hobson's pricing model is a "), yPosition + 21);
  doc.setFont("helvetica", "normal");

  yPosition += headerHeight + spacing.sectionGap + 4;

  // Section 1: What HEUs Measure
  checkBreak(40);
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + box.paddingX, yPosition + 5, circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Hobson Energy Units (HEUs) measure AI effort:", margin + PDF_CONFIG.card.textOffsetX - 2, yPosition + 7);
  yPosition += spacing.headerToContent - 4;

  const heuBoxHeight = 20;
  renderContentCard(doc, margin + PDF_CONFIG.card.iconOffsetX, yPosition, maxWidth - PDF_CONFIG.card.textOffsetX, heuBoxHeight, PDF_CONFIG.blueBg, PDF_CONFIG.blueBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const heuText = "Every document read, lease abstracted, compliance workflow executed, risk model run, or report built consumes HEUs.";
  const heuLines = doc.splitTextToSize(sanitizeText(heuText), maxWidth - box.paddingX * 5);
  let heuY = yPosition + spacing.contentStart;
  heuLines.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.card.textOffsetX - 2, heuY);
    heuY += lineHeight.body;
  });

  yPosition += heuBoxHeight + spacing.sectionGap + 4;

  // Section 2: What Hobson Monetises
  checkBreak(65);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + box.paddingX, yPosition + 5, circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("This means Hobson monetises:", margin + PDF_CONFIG.card.textOffsetX - 2, yPosition + 7);
  yPosition += spacing.headerToContent - 4;

  const monetises = [
    "operator dependency",
    "portfolio scale",
    "regulatory complexity",
    "decision intensity"
  ];

  // 2x2 grid
  const cardWidth = (maxWidth - 30) / 2;
  const cardHeight = 16;
  monetises.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + PDF_CONFIG.card.iconOffsetX + col * (cardWidth + spacing.cardGap);
    const cardY = yPosition + row * (cardHeight + spacing.paragraphGap);

    renderContentCard(doc, cardX, cardY, cardWidth, cardHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(cardX + PDF_CONFIG.card.iconOffsetX, cardY + 8, circleSize.small, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.text(sanitizeText(item), cardX + box.paddingX * 2, cardY + 10);
  });

  yPosition += 2 * (cardHeight + spacing.paragraphGap) + spacing.cardGap;

  // "not headcount" note
  renderContentCard(doc, margin + PDF_CONFIG.card.iconOffsetX, yPosition, maxWidth - PDF_CONFIG.card.textOffsetX, 12, PDF_CONFIG.bgLight, PDF_CONFIG.border);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("not", margin + PDF_CONFIG.card.textOffsetX - 2, yPosition + spacing.contentStart);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text(" headcount or asset count", margin + PDF_CONFIG.card.textOffsetX - 2 + doc.getTextWidth("not "), yPosition + spacing.contentStart);

  yPosition += 20;

  // Key insight box
  checkBreak(28);
  const insightHeight = 24;
  renderContentCard(doc, margin, yPosition, maxWidth, insightHeight, PDF_CONFIG.amberBg, PDF_CONFIG.amberBorder);

  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + PDF_CONFIG.card.iconOffsetX, yPosition + 12, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const insightText = "Traditional property software caps revenue. Hobson's model scales automatically with operational stress. The more complex the operator's world becomes, the more valuable and profitable Hobson becomes.";
  const insightLines = doc.splitTextToSize(sanitizeText(insightText), maxWidth - box.paddingX * 3.5);
  let insightY = yPosition + spacing.contentStart;
  insightLines.slice(0, 2).forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.card.textOffsetX - 2, insightY);
    insightY += lineHeight.body;
  });

  yPosition += insightHeight + spacing.sectionGap + 4;

  // Section 3: Pricing Table
  checkBreak(80);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + box.paddingX, yPosition + 5, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Pricing That Forces Adoption", margin + box.paddingX * 2, yPosition + 7);
  yPosition += spacing.headerToContent - 4;

  // Table headers
  const colWidths = [35, 30, 22, 70];
  const tableX = margin;
  const rowHeight = 12;

  // Header row
  renderContentCard(doc, tableX, yPosition, maxWidth, rowHeight, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  
  let headerX = tableX + spacing.paragraphGap;
  ["Plan", "Monthly Price", "HEUs", "Strategic Intent"].forEach((header, idx) => {
    doc.text(header, headerX, yPosition + spacing.contentStart);
    headerX += colWidths[idx] + spacing.paragraphGap;
  });
  yPosition += rowHeight;

  // Data rows
  const plans = [
    { plan: "Free", price: "GBP 0", heus: "18", intent: "Frictionless market entry" },
    { plan: "Essential", price: "GBP 19.50", heus: "275", intent: "Hook small operators" },
    { plan: "Essential Plus", price: "GBP 49.75", heus: "700", intent: "Convert growing teams" },
    { plan: "Enterprise", price: "GBP 148.50", heus: "2,000", intent: "Lock in serious operators" },
    { plan: "HEU Top-Up", price: "GBP 15", heus: "150", intent: "Expand ARPU naturally" },
  ];

  plans.forEach((row, idx) => {
    const bgColor = idx % 2 === 0 ? PDF_CONFIG.bgWhite : PDF_CONFIG.bgLight;
    renderContentCard(doc, tableX, yPosition, maxWidth, rowHeight, bgColor, PDF_CONFIG.border);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setTextColor(...PDF_CONFIG.textDark);
    
    let cellX = tableX + spacing.paragraphGap;
    doc.text(row.plan, cellX, yPosition + spacing.contentStart);
    cellX += colWidths[0] + spacing.paragraphGap;
    
    doc.setFont("helvetica", "normal");
    doc.text(row.price, cellX, yPosition + spacing.contentStart);
    cellX += colWidths[1] + spacing.paragraphGap;
    
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(row.heus, cellX, yPosition + spacing.contentStart);
    cellX += colWidths[2] + spacing.paragraphGap;
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(row.intent, cellX, yPosition + spacing.contentStart);
    
    yPosition += rowHeight;
  });

  yPosition += spacing.sectionGap + 2;

  // Footer - No Fees
  checkBreak(24);
  const footerHeight = 20;
  renderContentCard(doc, margin, yPosition, maxWidth, footerHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + maxWidth / 2 - 80, yPosition + 10, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.text("No per-user fees. No per-asset fees. Unlimited scale.", margin + maxWidth / 2, yPosition + 12, { align: "center" });

  yPosition += footerHeight + spacing.sectionGap;
  return yPosition;
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
    doc.circle(margin + 10, mY - 1, PDF_CONFIG.circleSize.small, "F");
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
 * Render PDF provider content as visual cards (used for Marketing & Sales Strategy tabs)
 * This avoids the plain "text dump" fallback while keeping content sourced from pdfContentProviders.
 */
const renderProviderCards = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number,
  componentType: string
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  const themes: Record<
    string,
    { bg: [number, number, number]; border: [number, number, number]; accent: [number, number, number] }
  > = {
    executiveContext: { bg: PDF_CONFIG.primaryBgLight, border: PDF_CONFIG.primaryLight, accent: PDF_CONFIG.primaryColor },
    situationAnalysis: { bg: PDF_CONFIG.blueBg, border: PDF_CONFIG.blueBorder, accent: PDF_CONFIG.blue },
    customerPersonas: { bg: PDF_CONFIG.emeraldBg, border: PDF_CONFIG.emeraldBorder, accent: PDF_CONFIG.emerald },
    customerUserJourneys: { bg: PDF_CONFIG.emeraldBg, border: PDF_CONFIG.emeraldBorder, accent: PDF_CONFIG.emeraldLight },
    marketDescription: { bg: PDF_CONFIG.primaryBgLight, border: PDF_CONFIG.primaryLight, accent: PDF_CONFIG.primaryColor },
    competitorBenchmarks: { bg: PDF_CONFIG.bgLight, border: PDF_CONFIG.border, accent: PDF_CONFIG.primaryLight },
    customerOnlineBehaviour: { bg: PDF_CONFIG.primaryBgLight, border: PDF_CONFIG.primaryLight, accent: PDF_CONFIG.primaryColor },
  };

  const theme = themes[componentType] || {
    bg: PDF_CONFIG.bgLight,
    border: PDF_CONFIG.border,
    accent: PDF_CONFIG.primaryColor,
  };

  const lines = getCustomVisualContent(componentType);
  if (!lines.length) return yPosition;

  // Split into blocks by blank line
  const blocks: string[][] = [];
  let current: string[] = [];
  lines.forEach((raw) => {
    const line = sanitizeText(raw);
    if (!line) {
      if (current.length) {
        blocks.push(current);
        current = [];
      }
      return;
    }
    current.push(line);
  });
  if (current.length) blocks.push(current);

  blocks.forEach((block) => {
    const title = block[0].endsWith(":") ? block[0].slice(0, -1) : block[0];
    const body = block.slice(1);

    const bodyLineHeight = PDF_CONFIG.lineHeight.body;

    // Measure body height (including wrapping)
    let measuredLines = 0;
    body.forEach((l) => {
      const isBullet = l.startsWith("-");
      const clean = l.replace(/^[-\s]+/, "");
      const wrapped = doc.splitTextToSize(clean, maxWidth - (isBullet ? 30 : 22));
      measuredLines += Math.max(1, wrapped.length);
      measuredLines += 0.2; // subtle spacing between items
    });

    // Dynamic height so text never overflows the box
    const headerHeight = 24; // title row + spacing
    const bottomPadding = 8;
    const cardHeight = Math.max(34, headerHeight + measuredLines * bodyLineHeight + bottomPadding);

    // Page break based on actual card height
    yPosition = checkPageBreak(doc, yPosition, cardHeight + PDF_CONFIG.spacing.cardGap, pageHeight, margin);

    // Card background + border
    doc.setFillColor(...theme.bg);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "S");

    // Accent bar
    doc.setFillColor(...theme.accent);
    doc.rect(margin, yPosition, 3, cardHeight, "F");

    // Header circle (no number)
    doc.setFillColor(...theme.accent);
    doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

    // Title
    doc.setTextColor(...PDF_CONFIG.textDark);
    setCardTitleFont(doc);
    doc.text(title, margin + 22, yPosition + 14);

    // Body
    let contentY = yPosition + 24;
    setBodyFont(doc);
    doc.setTextColor(...PDF_CONFIG.textGray);

    body.forEach((l) => {
      const isBullet = l.startsWith("-");
      const clean = l.replace(/^[-\s]+/, "");
      const wrapped = doc.splitTextToSize(clean, maxWidth - (isBullet ? 30 : 22));

      if (isBullet) {
        doc.setFillColor(...theme.accent);
        doc.circle(margin + 12, contentY - 2, PDF_CONFIG.circleSize.small, "F");
        wrapped.forEach((w: string) => {
          doc.text(w, margin + 18, contentY);
          contentY += bodyLineHeight;
        });
        contentY += 1;
      } else {
        wrapped.forEach((w: string) => {
          doc.text(w, margin + 8, contentY);
          contentY += bodyLineHeight;
        });
        contentY += 1;
      }
    });

    yPosition += cardHeight + PDF_CONFIG.spacing.cardGap;
  });

  return yPosition;
};

/**
 * Render Executive Context visual - matches the UI layout exactly
 */
const renderExecutiveContext = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const bodyLine = PDF_CONFIG.lineHeight.body;

  const data = getExecutiveContextStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Teal theme colors
  const tealAccent: [number, number, number] = [20, 184, 166]; // teal-500
  const tealBg: [number, number, number] = [240, 253, 250]; // teal-50
  const tealBorder: [number, number, number] = [153, 246, 228]; // teal-200
  
  // Slate theme colors
  const slateBg: [number, number, number] = [248, 250, 252]; // slate-50
  const slateBorder: [number, number, number] = [226, 232, 240]; // slate-200
  
  // Red/amber colors for pressures
  const redAccent: [number, number, number] = [220, 38, 38]; // red-600
  const redBg: [number, number, number] = [254, 242, 242]; // red-50
  const redBorder: [number, number, number] = [254, 202, 202]; // red-200
  
  // Amber colors for conclusion
  const amberBg: [number, number, number] = [255, 251, 235]; // amber-50
  const amberBorder: [number, number, number] = [253, 230, 138]; // amber-200

  // 1. Inflexion Point header box - tighter sizing with justified text
  const innerPadding = 8;
  const innerTextWidth = maxWidth - innerPadding * 2;
  const inflexionLines = doc.splitTextToSize(sanitizeText(data.inflexionPoint), innerTextWidth);
  const inflexionHeight = 10 + inflexionLines.length * (bodyLine * 1.2);
  fitPage(inflexionHeight + 6);

  doc.setFillColor(...tealBg);
  doc.roundedRect(margin, yPosition, maxWidth, inflexionHeight, 3, 3, "F");
  doc.setDrawColor(...tealBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, inflexionHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.inflexionPoint), margin + innerPadding, yPosition + 10, {
    maxWidth: innerTextWidth,
    align: "justify",
    lineHeightFactor: 1.2,
  });
  yPosition += inflexionHeight + 6;

  let textY = 0;

  // 2. Pressures - 2x2 grid
  fitPage(50);
  const pressureBoxWidth = (maxWidth - 6) / 2;
  const pressureBoxHeight = 18;
  
  data.pressures.forEach((pressure, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = margin + col * (pressureBoxWidth + 6);
    const y = yPosition + row * (pressureBoxHeight + 4);

    doc.setFillColor(...redBg);
    doc.roundedRect(x, y, pressureBoxWidth, pressureBoxHeight, 2, 2, "F");
    doc.setDrawColor(...redBorder);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, pressureBoxWidth, pressureBoxHeight, 2, 2, "S");

    // Warning icon (triangle)
    doc.setFillColor(...redAccent);
    doc.circle(x + 10, y + pressureBoxHeight / 2, PDF_CONFIG.circleSize.small, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(pressure), x + 18, y + 11);
  });
  yPosition += (pressureBoxHeight + 4) * 2 + 6;

  // 3. Context paragraph box - tighter with justified text
  const ctxPadding = 8;
  const ctxTextWidth = maxWidth - ctxPadding * 2;
  const contextLines = doc.splitTextToSize(sanitizeText(data.contextParagraph), ctxTextWidth);
  const contextHeight = 8 + contextLines.length * (bodyLine * 1.25);
  fitPage(contextHeight + 6);

  doc.setFillColor(...slateBg);
  doc.roundedRect(margin, yPosition, maxWidth, contextHeight, 3, 3, "F");
  doc.setDrawColor(...slateBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, contextHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.contextParagraph), margin + ctxPadding, yPosition + 8, {
    maxWidth: ctxTextWidth,
    align: "justify",
    lineHeightFactor: 1.25,
  });
  yPosition += contextHeight + 6;

  // 4. Hobson positioning box (purple themed) - tighter with justified text
  const posPadding = 8;
  const posTextWidth = maxWidth - posPadding * 2 - 14; // account for circle
  const posLines = doc.splitTextToSize(sanitizeText(data.hobsonPositioning), posTextWidth);
  const posHeight = 8 + posLines.length * (bodyLine * 1.25);
  fitPage(posHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, posHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, posHeight, 3, 3, "S");

  // Circle aligned with first line of text
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.hobsonPositioning), margin + 20, yPosition + 8, {
    maxWidth: posTextWidth,
    align: "justify",
    lineHeightFactor: 1.25,
  });
  yPosition += posHeight + 6;

  // 5. Mission Statement - compact layout with justified text
  const missionPadding = 8;
  const missionTextWidth = maxWidth - missionPadding * 2;
  const missionContentLines = doc.splitTextToSize(sanitizeText(data.missionStatement.content), missionTextWidth);
  const missionBoxHeight = missionContentLines.length * (bodyLine * 1.25) + 6;
  const missionHeight = 18 + missionBoxHeight;
  fitPage(missionHeight + 4);

  // Header row
  doc.setFillColor(...tealAccent);
  doc.circle(margin + 10, yPosition + 6, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.missionStatement.title, margin + 20, yPosition + 8);

  doc.setTextColor(...tealAccent);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text(data.missionStatement.subtitle, margin + 20, yPosition + 15);

  // Content box
  const missionBoxY = yPosition + 18;
  doc.setFillColor(...tealBg);
  doc.roundedRect(margin, missionBoxY, maxWidth, missionBoxHeight, 3, 3, "F");
  doc.setDrawColor(...tealBorder);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, missionBoxY, maxWidth, missionBoxHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.missionStatement.content), margin + missionPadding, missionBoxY + 6, {
    maxWidth: missionTextWidth,
    align: "justify",
    lineHeightFactor: 1.25,
  });
  yPosition = missionBoxY + missionBoxHeight + 5;

  // 6. Positioning Statement - compact layout with justified text
  const posStmtPadding = 8;
  const posStmtTextWidth = maxWidth - posStmtPadding * 2;
  const positionContentLines = doc.splitTextToSize(sanitizeText(data.positioningStatement.content), posStmtTextWidth);
  const positionBoxHeight = positionContentLines.length * (bodyLine * 1.25) + 6;
  const positionHeight = 18 + positionBoxHeight;
  fitPage(positionHeight + 4);

  // Header row
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 6, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.positioningStatement.title, margin + 20, yPosition + 8);

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text(data.positioningStatement.subtitle, margin + 20, yPosition + 15);

  // Content box
  const positionBoxY = yPosition + 18;
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, positionBoxY, maxWidth, positionBoxHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, positionBoxY, maxWidth, positionBoxHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.positioningStatement.content), margin + posStmtPadding, positionBoxY + 6, {
    maxWidth: posStmtTextWidth,
    align: "justify",
    lineHeightFactor: 1.25,
  });
  yPosition = positionBoxY + positionBoxHeight + 5;

  // 7. Conclusion box (amber themed) - tighter with justified text
  const concPadding = 8;
  const concTextWidth = maxWidth - concPadding * 2;
  const conclusionLines = doc.splitTextToSize(sanitizeText(data.conclusion), concTextWidth);
  const conclusionHeight = 8 + conclusionLines.length * (bodyLine * 1.25);
  fitPage(conclusionHeight + 6);

  doc.setFillColor(...amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, conclusionHeight, 3, 3, "F");
  doc.setDrawColor(...amberBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, conclusionHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.conclusion), margin + concPadding, yPosition + 8, {
    maxWidth: concTextWidth,
    align: "justify",
    lineHeightFactor: 1.25,
  });
  yPosition += conclusionHeight + 6;

  return yPosition;
};

/**
 * Render Customer Segmentation & Targeting (Situation Analysis) - matches UI layout
 */
const renderSituationAnalysis = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const bodyLine = PDF_CONFIG.lineHeight.body;

  const data = getSituationAnalysisStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Color themes for segments
  const segmentThemes = [
    { bg: [239, 246, 255] as [number, number, number], border: [191, 219, 254] as [number, number, number], accent: [37, 99, 235] as [number, number, number] }, // blue
    { bg: [250, 245, 255] as [number, number, number], border: [221, 214, 254] as [number, number, number], accent: [124, 58, 237] as [number, number, number] }, // purple
    { bg: [236, 253, 245] as [number, number, number], border: [167, 243, 208] as [number, number, number], accent: [5, 150, 105] as [number, number, number] }, // emerald
  ];

  // Teal theme
  const tealBg: [number, number, number] = [240, 253, 250];
  const tealBorder: [number, number, number] = [153, 246, 228];
  const tealAccent: [number, number, number] = [20, 184, 166];

  // Slate theme
  const slateBg: [number, number, number] = [248, 250, 252];
  const slateBorder: [number, number, number] = [226, 232, 240];

  // 1. Header box
  const headerHeight = 28;
  fitPage(headerHeight + 6);

  doc.setFillColor(...tealBg);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "F");
  doc.setDrawColor(...tealBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "S");

  doc.setFillColor(...tealAccent);
  doc.circle(margin + 12, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + 22, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.header.subtitle), margin + 22, yPosition + 22);

  yPosition += headerHeight + 6;

  // 2. Intro paragraph - tighter with justified text
  const introPadding = 8;
  const introTextWidth = maxWidth - introPadding * 2;
  const introLines = doc.splitTextToSize(sanitizeText(data.intro), introTextWidth);
  const introHeight = 8 + introLines.length * (bodyLine * 1.25);
  fitPage(introHeight + 6);

  doc.setFillColor(...slateBg);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, 3, 3, "F");
  doc.setDrawColor(...slateBorder);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.intro), margin + introPadding, yPosition + 8, {
    maxWidth: introTextWidth,
    align: "justify",
    lineHeightFactor: 1.25,
  });
  let textY = 0;
  yPosition += introHeight + 6;

  // 3. Segments
  data.segments.forEach((segment, idx) => {
    const theme = segmentThemes[idx];

    // Calculate segment card height
    const descLines = doc.splitTextToSize(sanitizeText(segment.description), maxWidth - 16);
    const valueLines = doc.splitTextToSize(sanitizeText(segment.hobsonValue), maxWidth - 56);
    const useCaseHeight = segment.useCases.length * (bodyLine + 1);
    const feedbackLines = doc.splitTextToSize(`Client feedback: "${segment.feedback}"`, maxWidth - 20);
    
    const segmentHeight = 32 + descLines.length * bodyLine + 8 + valueLines.length * bodyLine + 12 + useCaseHeight + 8 + feedbackLines.length * bodyLine + 12;
    fitPage(segmentHeight + 8);

    // Main segment card
    doc.setFillColor(...theme.bg);
    doc.roundedRect(margin, yPosition, maxWidth, segmentHeight, 3, 3, "F");
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPosition, maxWidth, segmentHeight, 3, 3, "S");

    // Segment header - circle aligned with text
    doc.setFillColor(...theme.accent);
    doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(`Segment ${segment.id}:`, margin + 22, yPosition + 14);

    // Target label (no box, just colored text) - add spacing between segment and target
    doc.setTextColor(...theme.accent);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    const targetX = margin + 22 + doc.getTextWidth(`Segment ${segment.id}:`) + 12; // 12pt gap
    doc.text(`${segment.targetLevel} Target`, targetX, yPosition + 14);

    // Title
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(segment.title), margin + 22, yPosition + 24);

    textY = yPosition + 32;

    // Description
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    descLines.forEach((line: string) => {
      doc.text(line, margin + 8, textY);
      textY += bodyLine;
    });
    textY += 4;

    // Hobson value box - narrower width
    const valueBoxY = textY;
    const valueBoxWidth = maxWidth - 40; // narrower box
    const valueBoxHeight = valueLines.length * bodyLine + 10;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 6, valueBoxY, valueBoxWidth, valueBoxHeight, 2, 2, "F");
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin + 6, valueBoxY, valueBoxWidth, valueBoxHeight, 2, 2, "S");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    textY = valueBoxY + 6;
    valueLines.forEach((line: string) => {
      doc.text(line, margin + 12, textY);
      textY += bodyLine;
    });
    textY = valueBoxY + valueBoxHeight + 4;

    // Use cases
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    segment.useCases.forEach((useCase) => {
      doc.setFillColor(...theme.accent);
      doc.circle(margin + 12, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
      doc.text(sanitizeText(useCase), margin + 18, textY);
      textY += bodyLine + 1;
    });
    textY += 4;

    // Client feedback
    const feedbackBoxY = textY;
    const feedbackBoxHeight = feedbackLines.length * bodyLine + 8;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 6, feedbackBoxY, maxWidth - 12, feedbackBoxHeight, 2, 2, "F");
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(margin + 6, feedbackBoxY, 3, feedbackBoxHeight, "F");

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "italic");
    textY = feedbackBoxY + 6;
    feedbackLines.forEach((line: string) => {
      doc.text(line, margin + 14, textY);
      textY += bodyLine;
    });

    yPosition += segmentHeight + 6;
  });

  // 4. Targeting Strategy
  fitPage(60);
  
  doc.setFillColor(...tealAccent);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Targeting Strategy", margin + 18, yPosition + 8);
  yPosition += 14;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const strategyLines = doc.splitTextToSize(sanitizeText(data.strategyIntro), maxWidth);
  strategyLines.forEach((line: string) => {
    doc.text(line, margin, yPosition);
    yPosition += bodyLine;
  });
  yPosition += 4;

  // Strategy items (inline with circles)
  data.segments.forEach((segment, idx) => {
    const theme = segmentThemes[idx];
    
    // Circle indicator
    doc.setFillColor(...theme.accent);
    doc.circle(margin + 4, yPosition + 3, PDF_CONFIG.circleSize.small, "F");
    
    // Target level label
    doc.setTextColor(...theme.accent);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(`${segment.targetLevel} Target`, margin + 12, yPosition + 5);
    
    // Segment label
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(`Segment ${segment.id}`, margin + 50, yPosition + 5);
    
    // Reason text
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(segment.targetReason), margin + 75, yPosition + 5);
    
    yPosition += 10;
  });
  yPosition += 6;

  // 5. Summary - tighter with justified text
  const summaryPadding = 10;
  const summaryTextWidth = maxWidth - summaryPadding * 2;
  const summaryLines = doc.splitTextToSize(sanitizeText(data.summary), summaryTextWidth);
  const summaryHeight = 18 + summaryLines.length * (bodyLine * 1.25);
  fitPage(summaryHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin + summaryPadding, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.summary), margin + summaryPadding, yPosition + 20, {
    maxWidth: summaryTextWidth,
    align: "justify",
    lineHeightFactor: 1.25,
  });
  yPosition += summaryHeight + 6;

  return yPosition;
};

/**
 * Render Customer Personas - matches UI layout with persona cards
 */
const renderCustomerPersonas = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const bodyLine = PDF_CONFIG.lineHeight.body;

  const data = getCustomerPersonasStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Color themes for personas
  const personaThemes = [
    { bg: [239, 246, 255] as [number, number, number], border: [191, 219, 254] as [number, number, number], accent: [37, 99, 235] as [number, number, number] }, // blue - Primary
    { bg: [250, 245, 255] as [number, number, number], border: [221, 214, 254] as [number, number, number], accent: [124, 58, 237] as [number, number, number] }, // purple - Secondary
    { bg: [236, 253, 245] as [number, number, number], border: [167, 243, 208] as [number, number, number], accent: [5, 150, 105] as [number, number, number] }, // emerald - Future
  ];

  // Header
  const headerHeight = 28;
  fitPage(headerHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 12, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + 22, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const subtitleLines = doc.splitTextToSize(sanitizeText(data.header.subtitle), maxWidth - 30);
  doc.text(subtitleLines[0] || "", margin + 22, yPosition + 22);

  yPosition += headerHeight + 6;

  // Intro - tighter with justified text
  const introPadding = 10;
  const introTextWidth = maxWidth - introPadding * 2;
  const introLines = doc.splitTextToSize(sanitizeText(data.intro), introTextWidth);
  const introHeight = 10 + introLines.length * (bodyLine * 1.25);
  fitPage(introHeight + 6);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, 3, 3, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.intro), margin + introPadding, yPosition + 10, {
    maxWidth: introTextWidth,
    align: "justify",
    lineHeightFactor: 1.25,
  });
  let textY = 0;
  yPosition += introHeight + 14;

  yPosition += 3; // Extra spacing before persona cards
  // Render each persona
  data.personas.forEach((persona, idx) => {
    const theme = personaThemes[idx];

    // Calculate card height
    const descLines = doc.splitTextToSize(sanitizeText(persona.description), maxWidth - 16);
    const goalsHeight = persona.goals.length * (bodyLine + 1);
    const frustHeight = persona.frustrations.length * (bodyLine + 1);
    const workflowHeight = persona.workflows.length * (bodyLine + 1);
    const successHeight = persona.success.length * (bodyLine + 1);

    const cardHeight = 36 + descLines.length * bodyLine + 8 + goalsHeight + 8 + frustHeight + 8 + workflowHeight + 8 + successHeight + 12;
    fitPage(cardHeight + 8);

    // Main card
    doc.setFillColor(...theme.bg);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "S");

    // Header row
    doc.setFillColor(...theme.accent);
    doc.circle(margin + 12, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(persona.name, margin + 22, yPosition + 12);

    // Segment badge
    const badgeX = margin + 22 + doc.getTextWidth(persona.name) + 8;
    const badgeText = persona.segment;
    const badgeWidth = doc.getTextWidth(badgeText) + 8;
    doc.setFillColor(...theme.accent);
    doc.roundedRect(badgeX, yPosition + 5, badgeWidth, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(badgeText, badgeX + 4, yPosition + 11.5);

    // Role
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(persona.role), margin + 22, yPosition + 24);

    textY = yPosition + 36;

    // Description
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    descLines.forEach((line: string) => {
      doc.text(line, margin + 8, textY);
      textY += bodyLine;
    });
    textY += 6;

    // Helper function for sections
    const renderSection = (title: string, items: string[]) => {
      doc.setTextColor(...theme.accent);
      doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 8, textY);
      textY += bodyLine + 2;

      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFont("helvetica", "normal");
      items.forEach((item) => {
        doc.setFillColor(...theme.accent);
        doc.circle(margin + 12, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
        const itemLines = doc.splitTextToSize(sanitizeText(item), maxWidth - 24);
        doc.text(itemLines[0] || "", margin + 18, textY);
        textY += bodyLine + 1;
      });
      textY += 2;
    };

    renderSection("Goals", persona.goals);
    renderSection("Frustrations", persona.frustrations);
    renderSection("Workflows", persona.workflows);
    renderSection("Success Looks Like", persona.success);

    yPosition += cardHeight + 6;
  });

  // Summary - tighter layout
  const summaryPadding = 8;
  const summaryTextWidth = maxWidth - summaryPadding * 2;
  const summaryIntroLines = doc.splitTextToSize(sanitizeText(data.summary.intro), summaryTextWidth);
  const conclusionLines = doc.splitTextToSize(sanitizeText(data.summary.conclusion), summaryTextWidth);
  const summaryHeight = 18 + summaryIntroLines.length * (bodyLine * 1.2) + data.summary.personas.length * (bodyLine + 1) + 6 + conclusionLines.length * (bodyLine * 1.2) + 4;
  fitPage(summaryHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin + summaryPadding, yPosition + 10);

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.summary.intro), margin + summaryPadding, yPosition + 18, {
    maxWidth: summaryTextWidth,
    lineHeightFactor: 1.2,
  });
  textY = yPosition + 18 + summaryIntroLines.length * (bodyLine * 1.2) + 3;

  data.summary.personas.forEach((p) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${p.name}: `, margin + summaryPadding, textY);
    doc.setFont("helvetica", "normal");
    const insightWidth = summaryTextWidth - doc.getTextWidth(`${p.name}: `);
    const insightLines = doc.splitTextToSize(sanitizeText(p.insight), insightWidth);
    doc.text(insightLines[0] || "", margin + summaryPadding + doc.getTextWidth(`${p.name}: `), textY);
    textY += bodyLine + 1;
  });
  textY += 3;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text(sanitizeText(data.summary.conclusion), margin + summaryPadding, textY, {
    maxWidth: summaryTextWidth,
    lineHeightFactor: 1.2,
  });

  yPosition += summaryHeight + 6;
  return yPosition;
};

/**
 * Render Customer User Journeys - matches UI layout with stage cards
 */
const renderCustomerUserJourneys = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const bodyLine = PDF_CONFIG.lineHeight.body;

  const data = getCustomerUserJourneysStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Stage colors
  const stageColors = [
    [37, 99, 235] as [number, number, number],   // blue
    [124, 58, 237] as [number, number, number],  // purple
    [5, 150, 105] as [number, number, number],   // emerald
    [234, 179, 8] as [number, number, number],   // amber
    [239, 68, 68] as [number, number, number],   // red
    [20, 184, 166] as [number, number, number],  // teal
    [107, 114, 128] as [number, number, number], // gray
  ];

  // Header
  const headerHeight = 28;
  fitPage(headerHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 12, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + 22, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.header.subtitle), margin + 22, yPosition + 22);

  yPosition += headerHeight + 6;

  // Persona box
  const personaHeight = 32;
  fitPage(personaHeight + 6);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition, maxWidth, personaHeight, 3, 3, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.persona.name} - ${data.persona.role}`, margin + 8, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(`Organisation: ${data.persona.organisation}`, margin + 8, yPosition + 20);
  doc.text(`Goal: ${data.persona.primaryGoal}`, margin + 8, yPosition + 28);

  yPosition += personaHeight + 6;

  // Render stages
  data.stages.forEach((stage, idx) => {
    const color = stageColors[idx % stageColors.length];

    // Calculate stage card height
    const touchpointsHeight = stage.touchpoints.length * (bodyLine + 1);
    const thinksLines = doc.splitTextToSize(`Thinks: ${sanitizeText(stage.thinks)}`, maxWidth - 20);
    const feelsLines = doc.splitTextToSize(`Feels: ${sanitizeText(stage.feels)}`, maxWidth - 20);
    const blocksLines = doc.splitTextToSize(`Blocks: ${sanitizeText(stage.blocks)}`, maxWidth - 20);
    const improvementLines = doc.splitTextToSize(`Improvement: ${sanitizeText(stage.improvement)}`, maxWidth - 20);
    const doesHeight = stage.does.length * (bodyLine + 1);

    const stageHeight = 30 + touchpointsHeight + 8 + thinksLines.length * bodyLine + 4 + doesHeight + 4 + feelsLines.length * bodyLine + 4 + blocksLines.length * bodyLine + 4 + improvementLines.length * bodyLine + 8;
    fitPage(stageHeight + 8);

    // Stage card
    doc.setFillColor(250, 250, 252);
    doc.roundedRect(margin, yPosition, maxWidth, stageHeight, 3, 3, "F");
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition, maxWidth, stageHeight, 3, 3, "S");

    // Color bar on left
    doc.setFillColor(...color);
    doc.rect(margin, yPosition, 4, stageHeight, "F");

    // Header
    doc.setFillColor(...color);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    const stageBadgeWidth = doc.getTextWidth(stage.stage) + 8;
    doc.roundedRect(margin + 10, yPosition + 4, stageBadgeWidth, 10, 2, 2, "F");
    doc.text(stage.stage, margin + 14, yPosition + 10.5);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(stage.title), margin + stageBadgeWidth + 16, yPosition + 12);

    let textY = yPosition + 24;

    // Touchpoints
    doc.setTextColor(...color);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text("Touchpoints:", margin + 10, textY);
    textY += bodyLine;

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    stage.touchpoints.forEach((tp) => {
      doc.setFillColor(...color);
      doc.circle(margin + 14, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
      doc.text(sanitizeText(tp), margin + 20, textY);
      textY += bodyLine + 1;
    });
    textY += 4;

    // Thinks
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFont("helvetica", "italic");
    thinksLines.forEach((line: string) => {
      doc.text(line, margin + 10, textY);
      textY += bodyLine;
    });
    textY += 2;

    // Does
    doc.setFont("helvetica", "bold");
    doc.text("Does:", margin + 10, textY);
    textY += bodyLine;
    doc.setFont("helvetica", "normal");
    stage.does.forEach((d) => {
      doc.text(`- ${sanitizeText(d)}`, margin + 14, textY);
      textY += bodyLine + 1;
    });
    textY += 2;

    // Feels
    doc.setFont("helvetica", "normal");
    feelsLines.forEach((line: string) => {
      doc.text(line, margin + 10, textY);
      textY += bodyLine;
    });
    textY += 2;

    // Blocks
    doc.setTextColor(...PDF_CONFIG.rose);
    blocksLines.forEach((line: string) => {
      doc.text(line, margin + 10, textY);
      textY += bodyLine;
    });
    textY += 2;

    // Improvement
    doc.setTextColor(...PDF_CONFIG.emerald);
    improvementLines.forEach((line: string) => {
      doc.text(line, margin + 10, textY);
      textY += bodyLine;
    });

    yPosition += stageHeight + 6;
  });

  // Strategic lessons
  const lessonsHeight = 20 + data.strategicLessons.length * (bodyLine + 2);
  fitPage(lessonsHeight + 6);

  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, lessonsHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.amberBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, lessonsHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.amber);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Strategic Lessons", margin + 8, yPosition + 12);

  let textY = yPosition + 20;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  data.strategicLessons.forEach((lesson) => {
    doc.setFillColor(...PDF_CONFIG.amber);
    doc.circle(margin + 12, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    doc.text(sanitizeText(lesson), margin + 18, textY);
    textY += bodyLine + 2;
  });

  yPosition += lessonsHeight + 6;

  // Summary and conclusion
  const innerPadding = 8;
  const innerTextWidth = maxWidth - innerPadding * 2;
  const summaryLines = doc.splitTextToSize(sanitizeText(data.summary), innerTextWidth);
  const conclusionLines = doc.splitTextToSize(sanitizeText(data.conclusion), innerTextWidth);
  const summaryBoxHeight = 16 + summaryLines.length * bodyLine + 8 + conclusionLines.length * bodyLine + 8;
  fitPage(summaryBoxHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, summaryBoxHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, summaryBoxHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  textY = yPosition + 10;
  summaryLines.forEach((line: string) => {
    doc.text(line, margin + innerPadding, textY);
    textY += bodyLine;
  });
  textY += 6;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  conclusionLines.forEach((line: string) => {
    doc.text(line, margin + innerPadding, textY);
    textY += bodyLine;
  });

  yPosition += summaryBoxHeight + 6;
  return yPosition;
};

/**
 * Render Market Description - matches UI layout exactly
 */
const renderMarketDescription = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const bodyLine = PDF_CONFIG.lineHeight.body;

  const data = getMarketDescriptionStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // 1. INTRO SECTION (Blue gradient box) - matches visual blue box
  const innerPaddingX = 10;
  const innerTextWidth = maxWidth - innerPaddingX * 2;
  const introLineSpacing = 5.5; // tighter line spacing
  const introLines = doc.splitTextToSize(sanitizeText(data.header.intro), innerTextWidth);
  // Compact box: title area (14) + text lines + small bottom padding (4)
  const headerHeight = 14 + introLines.length * introLineSpacing + 4;
  fitPage(headerHeight + 6);

  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.blueBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + innerPaddingX, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  let textY = yPosition + 18;

  // Render as a single justified paragraph with tighter line height
  doc.text(sanitizeText(data.header.intro), margin + innerPaddingX, textY, {
    maxWidth: innerTextWidth,
    align: "justify",
    lineHeightFactor: 1.3,
  });

  yPosition += headerHeight + 6;

  // 2. KEY ACTIONABLE TRENDS SECTION (Slate/gray box) - matches visual slate box
  const trendsIntroLines = doc.splitTextToSize(sanitizeText(data.keyTrends.intro), innerTextWidth);
  const trendsConclusionLines = doc.splitTextToSize(sanitizeText(data.keyTrends.conclusion), innerTextWidth);
  const trendsItemsHeight = data.keyTrends.items.length * (bodyLine + 2);
  const trendsHeight = 24 + trendsIntroLines.length * bodyLine + 6 + trendsItemsHeight + 6 + trendsConclusionLines.length * bodyLine + 10;
  fitPage(trendsHeight + 6);

  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, yPosition, maxWidth, trendsHeight, 3, 3, "F");
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, trendsHeight, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.keyTrends.title), margin + 22, yPosition + 14);

  textY = yPosition + 26;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  trendsIntroLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === trendsIntroLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });
  textY += 4;

  data.keyTrends.items.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + 14, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const itemLines = doc.splitTextToSize(sanitizeText(item), innerTextWidth - 14);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(itemLines[0] || "", margin + 20, textY);
    textY += bodyLine + 2;
  });
  textY += 4;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "italic");
  trendsConclusionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === trendsConclusionLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });

  yPosition += trendsHeight + 8;

  // 3. GROWING DEMAND FOR AUTOMATION (Purple box with stats) - matches visual purple box
  const automationIntro = "Automation is no longer optional in property operations. Global research consistently shows that companies adopting AI and automation are outperforming those that do not:";
  const automationIntroLines = doc.splitTextToSize(sanitizeText(automationIntro), innerTextWidth);
  const automationConclusion = "Operators increasingly recognise that manual administrative work is not scalable, especially in a market with leaner teams, higher data demands, and greater expectation for operational transparency.";
  const automationConclusionLines = doc.splitTextToSize(sanitizeText(automationConclusion), innerTextWidth);
  
  const statRowHeight = 32;
  const automationHeight = 26 + automationIntroLines.length * bodyLine + 8 + statRowHeight * 2 + 8 + automationConclusionLines.length * bodyLine + 10;
  fitPage(automationHeight + 6);

  // Purple gradient background
  doc.setFillColor(250, 245, 255); // purple-50
  doc.roundedRect(margin, yPosition, maxWidth, automationHeight, 3, 3, "F");
  doc.setDrawColor(233, 213, 255); // purple-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, automationHeight, 3, 3, "S");

  doc.setFillColor(147, 51, 234); // purple-600
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Growing Demand for Automation", margin + 22, yPosition + 14);

  textY = yPosition + 26;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  automationIntroLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === automationIntroLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });
  textY += 6;

  // Stats grid (2x2)
  const statWidth = (maxWidth - 24) / 2;
  data.marketStats.forEach((stat, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const x = margin + 8 + col * (statWidth + 8);
    const y = textY + row * (statRowHeight + 4);

    doc.setFillColor(255, 255, 255); // white background
    doc.roundedRect(x, y, statWidth, statRowHeight, 3, 3, "F");
    doc.setDrawColor(233, 213, 255); // purple-200
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, statWidth, statRowHeight, 3, 3, "S");

    doc.setTextColor(147, 51, 234); // purple-600
    doc.setFontSize(PDF_CONFIG.fontSize.stat);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, x + statWidth / 2, y + 12, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(stat.label), x + statWidth / 2, y + 20, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.text(`Ref: ${stat.source}`, x + statWidth / 2, y + 27, { align: "center" });
  });

  textY += statRowHeight * 2 + 12;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  automationConclusionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === automationConclusionLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });

  yPosition += automationHeight + 8;

  // 4. DOCUMENT OVERLOAD SECTION (Amber box) - matches visual amber box
  const docIntroLines = doc.splitTextToSize(sanitizeText(data.documentOverload.intro), innerTextWidth);
  const docConclusionLines = doc.splitTextToSize(sanitizeText(data.documentOverload.conclusion), innerTextWidth);
  const docItemsHeight = data.documentOverload.items.length * (bodyLine + 2);
  const docHeight = 26 + docIntroLines.length * bodyLine + 6 + docItemsHeight + 6 + docConclusionLines.length * bodyLine + 8;
  fitPage(docHeight + 6);

  doc.setFillColor(255, 251, 235); // amber-50
  doc.roundedRect(margin, yPosition, maxWidth, docHeight, 3, 3, "F");
  doc.setDrawColor(253, 230, 138); // amber-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, docHeight, 3, 3, "S");

  doc.setFillColor(217, 119, 6); // amber-600
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.documentOverload.title), margin + 22, yPosition + 14);

  textY = yPosition + 26;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  docIntroLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === docIntroLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });
  textY += 4;

  data.documentOverload.items.forEach((item) => {
    doc.setFillColor(217, 119, 6); // amber-600
    doc.circle(margin + 14, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const itemLines = doc.splitTextToSize(sanitizeText(item), innerTextWidth - 14);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(itemLines[0] || "", margin + 20, textY);
    textY += bodyLine + 2;
  });
  textY += 4;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "italic");
  docConclusionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === docConclusionLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });

  yPosition += docHeight + 8;

  // 5. PRESSURE FOR SPEED, COMPLIANCE, ACCURACY (Emerald box) - matches visual emerald box
  const compIntroLines = doc.splitTextToSize(sanitizeText(data.compliance.intro), innerTextWidth);
  const compConclusionLines = doc.splitTextToSize(sanitizeText(data.compliance.conclusion), innerTextWidth);
  const demandsHeight = data.compliance.demands.length * (bodyLine + 2);
  const mustDeliverHeight = data.compliance.mustDeliver.length * (bodyLine + 2);
  const compHeight = 26 + compIntroLines.length * bodyLine + 6 + 12 + demandsHeight + 12 + 12 + mustDeliverHeight + 6 + compConclusionLines.length * bodyLine + 8;
  fitPage(compHeight + 6);

  doc.setFillColor(236, 253, 245); // emerald-50
  doc.roundedRect(margin, yPosition, maxWidth, compHeight, 3, 3, "F");
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, compHeight, 3, 3, "S");

  doc.setFillColor(5, 150, 105); // emerald-600
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.compliance.title), margin + 22, yPosition + 14);

  textY = yPosition + 26;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  compIntroLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === compIntroLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });
  textY += 6;

  // Regulatory & Investor Demands subheader
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Regulatory & Investor Demands:", margin + 10, textY);
  textY += bodyLine + 2;

  doc.setFont("helvetica", "normal");
  data.compliance.demands.forEach((item) => {
    doc.setFillColor(5, 150, 105); // emerald-600
    doc.circle(margin + 14, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(sanitizeText(item), margin + 20, textY);
    textY += bodyLine + 2;
  });
  textY += 6;

  // Organisations Must Deliver subheader
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Organisations Must Deliver:", margin + 10, textY);
  textY += bodyLine + 2;

  doc.setFont("helvetica", "normal");
  data.compliance.mustDeliver.forEach((item) => {
    doc.setFillColor(5, 150, 105); // emerald-600
    doc.circle(margin + 14, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(sanitizeText(item), margin + 20, textY);
    textY += bodyLine + 2;
  });
  textY += 4;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "italic");
  compConclusionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === compConclusionLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });

  yPosition += compHeight + 8;

  // 6. ACTIONABLE INSIGHTS (4 colored cards in 2x2 grid) - matches visual insight cards
  const insightCardWidth = (maxWidth - 8) / 2;
  const insightCardHeight = 48;
  const insights = [
    { title: "Data-Intensive Operations", insight: "Real Estate teams now need tools that turn static documents into usable, queryable information.", color: "blue" },
    { title: "Strategic Automation", insight: "Automation is now a strategic priority, not a future aspiration.", color: "purple" },
    { title: "Document Overload", insight: "AI-driven document interpretation is the only scalable solution to unstructured portfolio data.", color: "amber" },
    { title: "Speed & Compliance", insight: "Speed is no longer a competitive advantage - it is a compliance and credibility requirement.", color: "emerald" },
  ];

  fitPage(insightCardHeight * 2 + 12);

  insights.forEach((item, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const x = margin + col * (insightCardWidth + 8);
    const y = yPosition + row * (insightCardHeight + 4);

    // Set colors based on type
    let bgColor: [number, number, number], borderColor: [number, number, number], iconColor: [number, number, number];
    switch (item.color) {
      case "blue":
        bgColor = [239, 246, 255]; borderColor = [191, 219, 254]; iconColor = [37, 99, 235];
        break;
      case "purple":
        bgColor = [250, 245, 255]; borderColor = [233, 213, 255]; iconColor = [147, 51, 234];
        break;
      case "amber":
        bgColor = [255, 251, 235]; borderColor = [253, 230, 138]; iconColor = [217, 119, 6];
        break;
      case "emerald":
      default:
        bgColor = [236, 253, 245]; borderColor = [167, 243, 208]; iconColor = [5, 150, 105];
        break;
    }

    doc.setFillColor(...bgColor);
    doc.roundedRect(x, y, insightCardWidth, insightCardHeight, 3, 3, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, insightCardWidth, insightCardHeight, 3, 3, "S");

    doc.setFillColor(...iconColor);
    doc.circle(x + 10, y + 14, PDF_CONFIG.circleSize.medium, "F");

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("ACTIONABLE INSIGHT", x + 20, y + 12);

    const insightLines = doc.splitTextToSize(sanitizeText(item.insight), insightCardWidth - 16);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    let insightY = y + 22;
    insightLines.forEach((line: string) => {
      doc.text(line, x + 10, insightY);
      insightY += bodyLine;
    });
  });

  yPosition += insightCardHeight * 2 + 12;

  // 7. WHY THE PROBLEM MATTERS NOW (Red box) - matches visual red box
  const whyNowIntro = "The operational landscape shows a clear convergence of pressures:";
  const whyNowConclusion = "Real estate operators urgently need tools that deliver clarity from complexity, without requiring system overhauls or disruptive implementation.";
  const whyNowIntroLines = doc.splitTextToSize(sanitizeText(whyNowIntro), innerTextWidth);
  const whyNowConclusionLines = doc.splitTextToSize(sanitizeText(whyNowConclusion), innerTextWidth);
  const pressuresGridHeight = Math.ceil(data.convergencePressures.length / 2) * 24;
  const whyNowHeight = 26 + whyNowIntroLines.length * bodyLine + 6 + pressuresGridHeight + 8 + whyNowConclusionLines.length * bodyLine + 8;
  fitPage(whyNowHeight + 6);

  doc.setFillColor(254, 242, 242); // red-50
  doc.roundedRect(margin, yPosition, maxWidth, whyNowHeight, 3, 3, "F");
  doc.setDrawColor(254, 202, 202); // red-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, whyNowHeight, 3, 3, "S");

  doc.setFillColor(220, 38, 38); // red-600
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Why the Problem Matters Now", margin + 22, yPosition + 14);

  textY = yPosition + 26;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  whyNowIntroLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === whyNowIntroLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });
  textY += 6;

  // Pressures as numbered grid
  const pressureCardWidth = (maxWidth - 24) / 3;
  data.convergencePressures.forEach((pressure, idx) => {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const x = margin + 8 + col * (pressureCardWidth + 4);
    const y = textY + row * 22;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, pressureCardWidth, 18, 2, 2, "F");
    doc.setDrawColor(254, 202, 202);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, pressureCardWidth, 18, 2, 2, "S");

    doc.setTextColor(220, 38, 38); // red-600
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}.`, x + 4, y + 11);

    const pressureLines = doc.splitTextToSize(sanitizeText(pressure), pressureCardWidth - 18);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(pressureLines[0] || "", x + 14, y + 11);
  });

  textY += pressuresGridHeight + 6;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  whyNowConclusionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === whyNowConclusionLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });

  yPosition += whyNowHeight + 8;

  // 8. HOBSON'S STRATEGIC POSITION (Primary/purple box) - matches visual primary box
  const posIntroLines = doc.splitTextToSize(sanitizeText(data.hobsonPosition.intro), innerTextWidth);
  const posConclusionLines = doc.splitTextToSize(sanitizeText(data.hobsonPosition.conclusion), innerTextWidth - 8);
  const posHeight = 20 + posIntroLines.length * bodyLine + 10 + posConclusionLines.length * bodyLine + 14;
  fitPage(posHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, posHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, posHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Hobson's Strategic Position", margin + 10, yPosition + 14);

  textY = yPosition + 26;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  posIntroLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === posIntroLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });
  textY += 6;

  // Conclusion in highlighted box
  const conclusionBoxHeight = posConclusionLines.length * bodyLine + 10;
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.roundedRect(margin + 8, textY - 4, maxWidth - 16, conclusionBoxHeight, 3, 3, "F");
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.setLineWidth(0.2);
  doc.roundedRect(margin + 8, textY - 4, maxWidth - 16, conclusionBoxHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  textY += 2;
  posConclusionLines.forEach((line: string) => {
    doc.text(line, margin + 14, textY);
    textY += bodyLine;
  });

  yPosition += posHeight + 6;
  return yPosition;
};

/**
 * Render Competitor Benchmarks - matches UI layout with competitor cards
 */
const renderCompetitorBenchmarks = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const bodyLine = PDF_CONFIG.lineHeight.body;

  const data = getCompetitorBenchmarksStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Header - tighter spacing
  const innerPadding = 6;
  const innerTextWidth = maxWidth - innerPadding * 2;
  const introLineSpacing = 5.5;
  const introLines = doc.splitTextToSize(sanitizeText(data.header.intro), innerTextWidth);
  const detailLines = doc.splitTextToSize(sanitizeText(data.header.detail), innerTextWidth);
  // Compact header: title area (22) + intro lines + gap (2) + detail lines + bottom padding (3)
  const headerHeight = 22 + introLines.length * introLineSpacing + 2 + detailLines.length * introLineSpacing + 3;
  fitPage(headerHeight + 6);

  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.blueBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 12, yPosition + 11, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + 22, yPosition + 9);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.header.subtitle), margin + 22, yPosition + 17);

  // Single justified paragraph for intro
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  const introStartY = yPosition + 24;
  doc.text(sanitizeText(data.header.intro), margin + innerPadding, introStartY, {
    maxWidth: innerTextWidth,
    align: "justify",
    lineHeightFactor: 1.4,
  });

  // Single justified paragraph for detail - reduced gap
  const detailStartY = introStartY + introLines.length * introLineSpacing + 2;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text(sanitizeText(data.header.detail), margin + innerPadding, detailStartY, {
    maxWidth: innerTextWidth,
    align: "justify",
    lineHeightFactor: 1.4,
  });

  yPosition += headerHeight + 6;

  // Competitor cards
  let textY = yPosition;
  data.competitors.forEach((competitor) => {
    const personaLines = doc.splitTextToSize(`Personas: ${sanitizeText(competitor.personas)}`, maxWidth - 20);
    const seoLines = doc.splitTextToSize(`SEO: ${sanitizeText(competitor.seo)}`, maxWidth - 20);
    const socialLines = doc.splitTextToSize(`Social: ${sanitizeText(competitor.social)}`, maxWidth - 20);
    const implLines = doc.splitTextToSize(`Implications: ${sanitizeText(competitor.implications)}`, maxWidth - 20);

    const cardHeight = 24 + personaLines.length * bodyLine + 4 + seoLines.length * bodyLine + 4 + socialLines.length * bodyLine + 4 + implLines.length * bodyLine + 8;
    fitPage(cardHeight + 6);

    const isHobson = competitor.isHobson;
    const bgColor = isHobson ? PDF_CONFIG.primaryBgLight : [248, 250, 252] as [number, number, number];
    const borderColor = isHobson ? PDF_CONFIG.primaryLight : [226, 232, 240] as [number, number, number];
    const accentColor = isHobson ? PDF_CONFIG.primaryColor : PDF_CONFIG.blue;

    doc.setFillColor(...bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(isHobson ? 0.5 : 0.3);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "S");

    // Name
    doc.setFillColor(...accentColor);
    doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

    doc.setTextColor(...(isHobson ? PDF_CONFIG.primaryColor : PDF_CONFIG.textDark));
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(competitor.name, margin + 22, yPosition + 14);

    textY = yPosition + 26;

    // Personas
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    personaLines.forEach((line: string) => {
      doc.text(line, margin + 8, textY);
      textY += bodyLine;
    });
    textY += 2;

    // SEO
    seoLines.forEach((line: string) => {
      doc.text(line, margin + 8, textY);
      textY += bodyLine;
    });
    textY += 2;

    // Social
    socialLines.forEach((line: string) => {
      doc.text(line, margin + 8, textY);
      textY += bodyLine;
    });
    textY += 2;

    // Implications
    doc.setTextColor(...(isHobson ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
    doc.setFont("helvetica", "italic");
    implLines.forEach((line: string) => {
      doc.text(line, margin + 8, textY);
      textY += bodyLine;
    });

    yPosition += cardHeight + 6;
  });

  // Summary
  const summaryPadding = 8;
  const summaryTextWidth = maxWidth - summaryPadding * 2;
  const diffLines = doc.splitTextToSize(`Differentiation: ${sanitizeText(data.summary.differentiation)}`, summaryTextWidth);
  const posLines = doc.splitTextToSize(`Positioning: ${sanitizeText(data.summary.positioning)}`, summaryTextWidth);
  const summaryHeight = 18 + diffLines.length * bodyLine + 4 + posLines.length * bodyLine + 8;
  fitPage(summaryHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin + summaryPadding, yPosition + 12);

  textY = yPosition + 22;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  diffLines.forEach((line: string) => {
    doc.text(line, margin + summaryPadding, textY);
    textY += bodyLine;
  });
  textY += 2;

  doc.setFont("helvetica", "bold");
  posLines.forEach((line: string) => {
    doc.text(line, margin + summaryPadding, textY);
    textY += bodyLine;
  });

  yPosition += summaryHeight + 6;
  return yPosition;
};

/**
 * Render Customer Online Behaviour - matches UI layout
 */
const renderCustomerOnlineBehaviour = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const bodyLine = PDF_CONFIG.lineHeight.body;

  const data = getCustomerOnlineBehaviourStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Persona colors
  const personaColors = [
    { bg: [239, 246, 255] as [number, number, number], accent: [37, 99, 235] as [number, number, number] }, // blue - Leigh
    { bg: [250, 245, 255] as [number, number, number], accent: [124, 58, 237] as [number, number, number] }, // purple - James
    { bg: [236, 253, 245] as [number, number, number], accent: [5, 150, 105] as [number, number, number] }, // emerald - Priya
  ];

  // Header - single justified paragraph
  const innerPadding = 6;
  const innerTextWidth = maxWidth - innerPadding * 2;
  const introText = sanitizeText(data.header.intro);
  const introLines = doc.splitTextToSize(introText, innerTextWidth);
  const introHeight = introLines.length * (bodyLine * 1.3) + 4;
  const headerHeight = 28 + introHeight;
  fitPage(headerHeight + 6);

  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.blueBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 12, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + 22, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.header.subtitle), margin + 22, yPosition + 22);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.text(introText, margin + innerPadding, yPosition + 32, {
    maxWidth: innerTextWidth,
    align: "justify",
    lineHeightFactor: 1.3,
  });

  let textY = 0;

  yPosition += headerHeight + 8;

  // Where Customers Research Tools section
  fitPage(20);
  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Where Customers Research Tools", margin, yPosition);
  yPosition += 12;

  // Research channels for each persona
  data.researchChannels.forEach((persona, idx) => {
    const colors = personaColors[idx];
    const channelsHeight = persona.channels.length * (bodyLine + 2);
    const cardHeight = 24 + channelsHeight + 8;
    fitPage(cardHeight + 6);

    doc.setFillColor(...colors.bg);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");

    // Persona initial circle
    doc.setFillColor(...colors.accent);
    doc.circle(margin + 12, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(persona.persona.charAt(0), margin + 10, yPosition + 16);

    // Persona name and role
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(persona.persona, margin + 22, yPosition + 12);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(persona.role), margin + 22, yPosition + 20);

    textY = yPosition + 28;
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    persona.channels.forEach((channel) => {
      doc.setFillColor(...colors.accent);
      doc.circle(margin + 12, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
      const channelLines = doc.splitTextToSize(sanitizeText(channel), maxWidth - 24);
      doc.text(channelLines[0] || "", margin + 18, textY);
      textY += bodyLine + 2;
    });

    yPosition += cardHeight + 6;
  });

  // What Content They Trust section
  fitPage(20);
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("What Content They Trust", margin, yPosition);
  yPosition += 8;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Across all personas, the content that builds trust is:", margin, yPosition);
  yPosition += 10;

  // Trust content cards (2 column grid)
  const trustCardWidth = (maxWidth - 8) / 2;
  const trustCardHeight = 32;

  data.trustedContent.forEach((item, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    
    if (col === 0) {
      fitPage(trustCardHeight + 4);
    }

    const x = margin + col * (trustCardWidth + 8);
    const y = yPosition + row * (trustCardHeight + 4);

    doc.setFillColor(...PDF_CONFIG.emeraldBg);
    doc.roundedRect(x, y, trustCardWidth, trustCardHeight, 3, 3, "F");

    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(item.title), x + 6, y + 10);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(sanitizeText(item.description), trustCardWidth - 12);
    doc.text(descLines.slice(0, 2), x + 6, y + 18);
  });

  yPosition += Math.ceil(data.trustedContent.length / 2) * (trustCardHeight + 4) + 8;

  // How Customers Evaluate AI Solutions section
  // Calculate total height needed for entire section
  const evalCardHeight = 30;
  const totalEvalRows = Math.ceil(data.evaluationCriteria.length / 2);
  const totalEvalSectionHeight = 12 + totalEvalRows * (evalCardHeight + 4);
  fitPage(totalEvalSectionHeight);

  doc.setTextColor(...PDF_CONFIG.amber);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("How Customers Evaluate AI Solutions", margin, yPosition);
  yPosition += 10;

  // Evaluation criteria cards (2 column grid)
  const evalCardWidth = (maxWidth - 8) / 2;

  data.evaluationCriteria.forEach((item, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;

    if (col === 0) {
      fitPage(evalCardHeight + 4);
    }

    const x = margin + col * (evalCardWidth + 8);
    const y = yPosition + row * (evalCardHeight + 4);

    doc.setFillColor(...PDF_CONFIG.amberBg);
    doc.roundedRect(x, y, evalCardWidth, evalCardHeight, 3, 3, "F");

    doc.setTextColor(...PDF_CONFIG.amber);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(item.title), x + 6, y + 10);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(sanitizeText(item.description), evalCardWidth - 12);
    doc.text(descLines.slice(0, 2), x + 6, y + 18);
  });

  yPosition += Math.ceil(data.evaluationCriteria.length / 2) * (evalCardHeight + 4) + 8;

  // What Triggers Distrust section
  const distrustHeight = 18 + data.distrustTriggers.length * (bodyLine + 2);
  fitPage(distrustHeight + 6);

  doc.setFillColor(...PDF_CONFIG.roseBg);
  doc.roundedRect(margin, yPosition, maxWidth, distrustHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.roseBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, distrustHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.rose);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("What Triggers Distrust or Hesitation", margin + 8, yPosition + 12);

  textY = yPosition + 22;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  data.distrustTriggers.forEach((trigger) => {
    doc.setFillColor(...PDF_CONFIG.rose);
    doc.circle(margin + 12, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const triggerLines = doc.splitTextToSize(sanitizeText(trigger), maxWidth - 24);
    doc.text(triggerLines[0] || "", margin + 18, textY);
    textY += bodyLine + 2;
  });

  yPosition += distrustHeight + 8;

  // Channel Strategy Summary section
  fitPage(20);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("How These Behaviours Shape Hobson's Channel Strategy", margin, yPosition);
  yPosition += 10;

  data.channelStrategySummary.forEach((item, idx) => {
    const insightLines = doc.splitTextToSize(`${item.channel}: ${sanitizeText(item.insight)}`, maxWidth - 24);
    const itemHeight = 8 + insightLines.length * bodyLine;
    fitPage(itemHeight + 4);

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(margin, yPosition, maxWidth, itemHeight, 2, 2, "F");

    // Number badge
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 10, yPosition + itemHeight / 2, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}`, margin + 8, yPosition + itemHeight / 2 + 2);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "normal");
    let lineY = yPosition + 6;
    insightLines.forEach((line: string) => {
      doc.text(line, margin + 20, lineY);
      lineY += bodyLine;
    });

    yPosition += itemHeight + 4;
  });

  yPosition += 4;

  // Conclusion
  const conclusionLines = doc.splitTextToSize(sanitizeText(data.conclusion), maxWidth - 16);
  const conclusionHeight = 12 + conclusionLines.length * bodyLine;
  fitPage(conclusionHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, conclusionHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, conclusionHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  textY = yPosition + 8;
  conclusionLines.forEach((line: string) => {
    doc.text(line, margin + 8, textY);
    textY += bodyLine;
  });

  yPosition += conclusionHeight + 6;
  return yPosition;
};

/**
 * Render Brand Integrity, Perception & Positioning visual
 */
const renderBrandIntegrity = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  const bodyLine = 5;
  const smallLine = 5;

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  const measureWrappedLines = (text: string, width: number): string[] =>
    doc.splitTextToSize(sanitizeText(text), width);

  // -------- Brand Summary --------
  const summaryText =
    "Hobson has a clear, coherent, and authentic brand foundation. Its voice, visual identity, archetypes, and interactive elements all convey calm intelligence and dependable guidance.";
  const summaryLines = measureWrappedLines(summaryText, maxWidth - 16);
  const nextPhase = [
    "Scaling emotional storytelling",
    "Building structured support and resolution processes",
    "Demonstrating the move from retrieval to proactive insight and strategic clarity",
  ];

  const summaryHeight =
    28 + summaryLines.length * bodyLine + nextPhase.length * (smallLine + 1) + 16;
  fitPage(summaryHeight + 6);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 14, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Summary", margin + 24, yPosition + 16);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Clear, Coherent, and Authentic Brand Foundation", margin + 24, yPosition + 24);

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  let textY = yPosition + 34;
  summaryLines.forEach((line: string) => {
    doc.text(line, margin + 8, textY);
    textY += bodyLine;
  });

  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  nextPhase.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 12, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    const wrapped = measureWrappedLines(item, maxWidth - 30);
    wrapped.forEach((w: string) => {
      doc.text(w, margin + 18, textY);
      textY += smallLine;
    });
    textY += 1;
  });

  yPosition += summaryHeight + 8;

  // -------- Brand Background --------
  const purpleBg: [number, number, number] = [250, 245, 255];
  const purpleBorder: [number, number, number] = [221, 214, 254];

  const bgText =
    "Hobson is a calm, intelligent, and dependable AI assistant built for Real Estate professionals who work with complex, document-heavy workflows. The brand stands for clarity, trust, and simplicity.";
  const bgLines = measureWrappedLines(bgText, maxWidth - 16);

  const archetypeRowHeight = 30;
  const backgroundHeight = 22 + bgLines.length * bodyLine + archetypeRowHeight + 18;
  fitPage(backgroundHeight + 6);

  doc.setFillColor(...purpleBg);
  doc.roundedRect(margin, yPosition, maxWidth, backgroundHeight, 3, 3, "F");
  doc.setDrawColor(...purpleBorder);
  doc.roundedRect(margin, yPosition, maxWidth, backgroundHeight, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 14, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Background", margin + 24, yPosition + 16);

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  textY = yPosition + 28;
  bgLines.forEach((line: string) => {
    doc.text(line, margin + 8, textY);
    textY += bodyLine;
  });

  // Archetypes row (positioned dynamically)
  const archetypes = [
    { name: "Sage", trait: "Primary Archetype", desc: "Wisdom, guidance, truth" },
    { name: "Ruler", trait: "Supporting Trait", desc: "Order, reliability" },
    { name: "Creator", trait: "Supporting Trait", desc: "Innovation" },
  ];
  const archTop = textY + 6;
  const archWidth = (maxWidth - 24) / 3;
  archetypes.forEach((arch, idx) => {
    const xPos = margin + 8 + idx * (archWidth + 4);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(xPos, archTop, archWidth, 24, 2, 2, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(arch.trait.toUpperCase(), xPos + 4, archTop + 8);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.text(arch.name, xPos + 4, archTop + 15);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(arch.desc, xPos + 4, archTop + 21);
  });

  yPosition += backgroundHeight + 8;

  // -------- Strengths & Weaknesses --------
  fitPage(90);
  const colWidth = (maxWidth - 8) / 2;

  const emeraldBg: [number, number, number] = [236, 253, 245];
  const emeraldBorder: [number, number, number] = [167, 243, 208];
  const amberBg: [number, number, number] = [255, 251, 235];
  const amberBorder: [number, number, number] = [253, 230, 138];

  const strengths = [
    "Simplifies document retrieval and reduces cognitive load",
    "Saves meaningful time on routine information search",
    "Provides transparent, referenced answers that build trust",
    "Calm, clear, jargon-free tone matching the Sage archetype",
    "Consistent, modern, and recognisable visual assets",
    "Interactive tools like the quiz reinforce Hobson as knowledgeable yet friendly",
  ];

  const weaknesses = [
    "Emotionally, the brand is not yet fully expressed - users understand what Hobson does but have fewer cues about deeper impact",
    "Seen as reliable and helpful, but not yet as a source of ongoing strategic insight or proactive guidance",
    "Still building resolution and support structures that mature brands rely on",
  ];

  const calcListHeight = (items: string[], width: number) => {
    let lines = 0;
    items.forEach((it) => {
      lines += Math.max(1, doc.splitTextToSize(sanitizeText(it), width).length);
      lines += 0.2;
    });
    return 22 + lines * smallLine + 10;
  };

  const strengthsHeight = calcListHeight(strengths, colWidth - 20);
  const weaknessesHeight = calcListHeight(weaknesses, colWidth - 20);
  const swHeight = Math.max(strengthsHeight, weaknessesHeight);
  fitPage(swHeight + 6);

  // Strengths
  doc.setFillColor(...emeraldBg);
  doc.roundedRect(margin, yPosition, colWidth, swHeight, 3, 3, "F");
  doc.setDrawColor(...emeraldBorder);
  doc.roundedRect(margin, yPosition, colWidth, swHeight, 3, 3, "S");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Strengths", margin + 22, yPosition + 14);

  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  textY = yPosition + 26;
  strengths.forEach((it) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 8, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const wrapped = doc.splitTextToSize(sanitizeText(it), colWidth - 20);
    wrapped.forEach((w: string) => {
      doc.text(w, margin + 14, textY);
      textY += smallLine;
    });
    textY += 1;
  });

  // Weaknesses
  const wx = margin + colWidth + 8;
  doc.setFillColor(...amberBg);
  doc.roundedRect(wx, yPosition, colWidth, swHeight, 3, 3, "F");
  doc.setDrawColor(...amberBorder);
  doc.roundedRect(wx, yPosition, colWidth, swHeight, 3, 3, "S");
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(wx + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Weaknesses (Opportunities)", wx + 22, yPosition + 14);

  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  textY = yPosition + 26;
  weaknesses.forEach((it) => {
    doc.setFillColor(...PDF_CONFIG.amber);
    doc.circle(wx + 8, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const wrapped = doc.splitTextToSize(sanitizeText(it), colWidth - 20);
    wrapped.forEach((w: string) => {
      doc.text(w, wx + 14, textY);
      textY += smallLine;
    });
    textY += 1;
  });

  yPosition += swHeight + 8;

  // -------- Emotional & Cognitive Appeal --------
  const pinkBg: [number, number, number] = [253, 242, 248];
  const pinkBorder: [number, number, number] = [251, 207, 232];
  const pink: [number, number, number] = [219, 39, 119];

  const blueBg: [number, number, number] = [239, 246, 255];
  const blueBorder: [number, number, number] = [191, 219, 254];
  const blue: [number, number, number] = [37, 99, 235];

  const emotionalText =
    "Hobson's emotional promise is reassurance. It reduces stress by making hard-to-find information easy to access, and gives professionals a sense of control in high-pressure, chaotic environments.";
  const emotionalLines = measureWrappedLines(emotionalText, colWidth - 16);

  const cognitiveItems = [
    "Measurable outcomes: time saved, fewer errors, quicker decisions",
    "Transparent referencing: every answer can be traced back to its source",
  ];

  const cognitiveLinesCount = cognitiveItems.reduce((acc, it) => {
    return acc + Math.max(1, doc.splitTextToSize(sanitizeText(it), colWidth - 20).length);
  }, 0);

  const appealHeight = Math.max(
    22 + emotionalLines.length * smallLine + 10,
    22 + cognitiveLinesCount * smallLine + 14
  );

  fitPage(appealHeight + 6);

  // Emotional
  doc.setFillColor(...pinkBg);
  doc.roundedRect(margin, yPosition, colWidth, appealHeight, 3, 3, "F");
  doc.setDrawColor(...pinkBorder);
  doc.roundedRect(margin, yPosition, colWidth, appealHeight, 3, 3, "S");
  doc.setFillColor(...pink);
  doc.circle(margin + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Emotional (Heart) Appeal", margin + 22, yPosition + 14);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  textY = yPosition + 26;
  emotionalLines.forEach((line: string) => {
    doc.text(line, margin + 8, textY);
    textY += smallLine;
  });

  // Cognitive
  const cx = margin + colWidth + 8;
  doc.setFillColor(...blueBg);
  doc.roundedRect(cx, yPosition, colWidth, appealHeight, 3, 3, "F");
  doc.setDrawColor(...blueBorder);
  doc.roundedRect(cx, yPosition, colWidth, appealHeight, 3, 3, "S");
  doc.setFillColor(...blue);
  doc.circle(cx + 12, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Cognitive (Head) Appeal", cx + 22, yPosition + 14);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  textY = yPosition + 26;
  cognitiveItems.forEach((it) => {
    doc.setFillColor(...blue);
    doc.circle(cx + 8, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const wrapped = doc.splitTextToSize(sanitizeText(it), colWidth - 20);
    wrapped.forEach((w: string) => {
      doc.text(w, cx + 14, textY);
      textY += smallLine;
    });
    textY += 1;
  });

  yPosition += appealHeight + 8;

  // -------- Brand Metaphors --------
  const metaphors = [
    { metaphor: "GPS for documents", desc: "Takes you straight to the answer" },
    { metaphor: "Master key", desc: "Unlocks information hidden in dense files" },
    { metaphor: "Compass in a document jungle", desc: "Navigates complexity safely" },
    { metaphor: "Desk lamp", desc: "Quietly illuminates the truth whenever needed" },
  ];

  const metaphorsHeight = 22 + 28 + 10; // header + tiles + padding
  fitPage(metaphorsHeight + 6);

  doc.setFillColor(...amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, metaphorsHeight, 3, 3, "F");
  doc.setDrawColor(...amberBorder);
  doc.roundedRect(margin, yPosition, maxWidth, metaphorsHeight, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 14, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Metaphors", margin + 24, yPosition + 14);

  const metaWidth = (maxWidth - 24) / 4;
  metaphors.forEach((meta, idx) => {
    const xPos = margin + 8 + idx * (metaWidth + 4);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(xPos, yPosition + 22, metaWidth, 24, 2, 2, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const title = doc.splitTextToSize(meta.metaphor, metaWidth - 8);
    doc.text(title[0] || "", xPos + 4, yPosition + 31);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(meta.desc, metaWidth - 8);
    doc.text(descLines[0] || "", xPos + 4, yPosition + 41);
  });

  yPosition += metaphorsHeight + 8;

  // -------- Current Marketing Position --------
  const positionText =
    "Today, Hobson's market presence is selective and relationship-led. The focus is on deep MVP partnerships rather than broad public awareness. The brand is visually strong and touchpoints are consistent.";
  const positionLines = measureWrappedLines(positionText, maxWidth - 16);

  const opportunityText =
    "Opportunity: Shift from a quiet, validating presence into a confident, educational voice shaping expectations for AI-native assistants in real estate.";
  const opportunityLines = measureWrappedLines(opportunityText, maxWidth - 28);

  const positionHeight = 22 + positionLines.length * bodyLine + opportunityLines.length * 4 + 18;
  fitPage(positionHeight + 6);

  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, positionHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, positionHeight, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 14, yPosition + 12, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Current Marketing Position", margin + 24, yPosition + 14);

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  textY = yPosition + 26;
  positionLines.forEach((line: string) => {
    doc.text(line, margin + 8, textY);
    textY += bodyLine;
  });

  // Opportunity callout (wrapped)
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  const calloutY = textY + 4;
  const calloutHeight = opportunityLines.length * 4 + 6;
  doc.roundedRect(margin + 8, calloutY, maxWidth - 16, calloutHeight, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");

  let oy = calloutY + 4;
  opportunityLines.forEach((line: string) => {
    doc.text(line, margin + 12, oy);
    oy += 4;
  });

  yPosition += positionHeight + 2;

  return yPosition;
};

/**
 * Render PESTLE Analysis visual
 */
const renderPESTLEAnalysis = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Header
  fitPage(45);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 40, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 14, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("PESTLE Analysis", margin + 24, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Macro-environmental factors shaping the UK PropTech landscape", margin + 24, yPosition + 26);
  yPosition += 48;

  // Key drivers
  const keyDrivers = [
    "Fast, reliable document insight",
    "Transparent, referenced answers",
    "Minimal onboarding and implementation friction",
    "Affordable, measurable efficiency gains",
    "Reduced compliance and documentation risk"
  ];

  fitPage(50);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 45, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("The environment is shifting towards tools that provide:", margin + 8, yPosition + 10);
  let ky = yPosition + 18;
  keyDrivers.forEach((driver) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 12, ky - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(driver, margin + 18, ky);
    ky += 5;
  });
  yPosition += 53;

  // PESTLE factors
  const factors = [
    { letter: "P", title: "Political", subtitle: "Rising Regulation & Data Governance", color: PDF_CONFIG.blueBg, accent: PDF_CONFIG.blue, items: ["Building Safety Act compliance", "Renters Reform Bill documentation", "EPC and sustainability reporting", "AML documentation checks", "GDPR audit trails"] },
    { letter: "E", title: "Economic", subtitle: "Cost Pressure & Efficiency", color: PDF_CONFIG.emeraldBg, accent: PDF_CONFIG.emerald, items: ["Cost constraints limit headcount", "Market cycles increase pressure", "Lean teams handle growing workloads", "10%+ NOI improvement from AI", "Up to 20% cost savings possible"] },
    { letter: "S", title: "Social", subtitle: "AI Comfort & Trust", color: PDF_CONFIG.primaryBgLight, accent: PDF_CONFIG.primaryColor, items: ["Growing AI openness", "Low tolerance for error", "High demand for transparency", "Hybrid working increases file reliance", "Aversion to rip and replace"] },
    { letter: "T", title: "Technological", subtitle: "Fast-Moving AI & PropTech", color: PDF_CONFIG.amberBg, accent: PDF_CONFIG.amber, items: ["LLM and RAG advances", "Verifiable AI expectations", "Legacy PropTech moves slowly", "Cybersecurity expectations grow", "No integration tools in demand"] },
    { letter: "L", title: "Legal", subtitle: "Compliance & Documentation Risk", color: PDF_CONFIG.roseBg, accent: PDF_CONFIG.rose, items: ["GDPR transparency demands", "Audit evidence requirements", "Contractual risk from missed details", "AI governance and explainability"] },
    { letter: "E", title: "Environmental", subtitle: "ESG & Paper Reduction", color: PDF_CONFIG.emeraldBg, accent: PDF_CONFIG.emeraldLight, items: ["ESG reporting documentation", "Paperless workflow pressure", "EPC data requirements"] }
  ];

  const cardHeight = 50;
  const cardWidth = (maxWidth - 8) / 2;

  factors.forEach((factor, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    
    if (col === 0) {
      fitPage(cardHeight + 8);
    }
    
    const xPos = margin + col * (cardWidth + 8);
    const cardY = col === 0 ? yPosition : yPosition;

    doc.setFillColor(...factor.color);
    doc.roundedRect(xPos, cardY, cardWidth, cardHeight, 3, 3, "F");
    
    doc.setFillColor(...factor.accent);
    doc.circle(xPos + 10, cardY + 10, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(factor.letter, xPos + 8, cardY + 12);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(factor.title, xPos + 20, cardY + 12);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(factor.subtitle, xPos + 20, cardY + 18);

    let itemY = cardY + 26;
    factor.items.forEach((item) => {
      doc.setFillColor(...factor.accent);
      doc.circle(xPos + 10, itemY - 1, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(7);
      const wrapped = doc.splitTextToSize(item, cardWidth - 20);
      doc.text(wrapped[0], xPos + 16, itemY);
      itemY += 5;
    });

    if (col === 1) {
      yPosition += cardHeight + 6;
    }
  });

  if (factors.length % 2 === 1) {
    yPosition += cardHeight + 6;
  }

  return yPosition;
};

/**
 * Render Internal Capability Assessment visual
 */
const renderInternalCapabilityAssessment = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Header
  fitPage(50);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 45, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 14, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Internal Capability Assessment", margin + 24, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  const introText = "Hobson combines deep domain knowledge, strong technical design, and a differentiated brand aligned with market need.";
  const introLines = doc.splitTextToSize(introText, maxWidth - 32);
  introLines.forEach((line: string, i: number) => {
    doc.text(line, margin + 24, yPosition + 26 + i * 5);
  });
  yPosition += 53;

  // Strengths
  const strengths = [
    { title: "Team Skills", items: ["30+ years Real Estate experience", "Built/scaled/exited UK RE software", "AI/ML specialists in-house"] },
    { title: "Technical Capabilities", items: ["Document-first architecture", "Hybrid RAG + knowledge graph", "Zero-integration deployment"] },
    { title: "Brand Positioning", items: ["Owl = wisdom and clarity", "Calm AI assistant positioning", "Strong early resonance"] },
    { title: "Customer Access", items: ["Direct portfolio operator relationships", "Warm industry introductions", "Early adopters co-shaping MVP"] },
    { title: "Clear Differentiators", items: ["Document-native AI focus", "Referenced answers always", "No replacement positioning"] }
  ];

  fitPage(20);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 6, yPosition + 4, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Strengths", margin + 16, yPosition + 6);
  yPosition += 14;

  const strengthCardWidth = (maxWidth - 8) / 2;
  const strengthCardHeight = 42;

  strengths.forEach((strength, idx) => {
    const col = idx % 2;
    if (col === 0) {
      fitPage(strengthCardHeight + 6);
    }
    const xPos = margin + col * (strengthCardWidth + 8);
    
    doc.setFillColor(...PDF_CONFIG.emeraldBg);
    doc.roundedRect(xPos, yPosition, strengthCardWidth, strengthCardHeight, 3, 3, "F");
    
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(xPos + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(strength.title, xPos + 20, yPosition + 12);

    let itemY = yPosition + 20;
    strength.items.forEach((item) => {
      doc.setFillColor(...PDF_CONFIG.emerald);
      doc.circle(xPos + 10, itemY - 1, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(item, xPos + 16, itemY);
      itemY += 6;
    });

    if (col === 1 || idx === strengths.length - 1) {
      yPosition += strengthCardHeight + 6;
    }
  });

  // Gaps
  fitPage(20);
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 6, yPosition + 4, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Limitations & Gaps", margin + 16, yPosition + 6);
  yPosition += 14;

  const gaps = [
    { title: "Brand Visibility", need: "Thought leadership, case studies" },
    { title: "Technical Scaling", need: "Fine-tuning and expanded testing" },
    { title: "Product Breadth", need: "Proactive insight expansion" },
    { title: "Support Infrastructure", need: "Customer success frameworks" },
    { title: "Resource Constraints", need: "Investment for systematic growth" }
  ];

  const gapCardWidth = (maxWidth - 16) / 3;
  const gapCardHeight = 28;

  gaps.forEach((gap, idx) => {
    const col = idx % 3;
    if (col === 0) {
      fitPage(gapCardHeight + 6);
    }
    const xPos = margin + col * (gapCardWidth + 8);
    
    doc.setFillColor(...PDF_CONFIG.amberBg);
    doc.roundedRect(xPos, yPosition, gapCardWidth, gapCardHeight, 3, 3, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(gap.title, xPos + 6, yPosition + 10);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text("Need: " + gap.need, xPos + 6, yPosition + 20);

    if (col === 2 || idx === gaps.length - 1) {
      yPosition += gapCardHeight + 6;
    }
  });

  return yPosition;
};

/**
 * Render SWOT Analysis visual
 */
const renderSWOTAnalysis = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Header
  fitPage(45);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 40, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 14, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SWOT Analysis", margin + 24, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Strategic assessment of Hobson's market position", margin + 24, yPosition + 26);
  yPosition += 48;

  const swotData = [
    { 
      title: "Strengths", 
      color: PDF_CONFIG.emeraldBg, 
      accent: PDF_CONFIG.emerald,
      items: ["AI-native architecture for RE docs", "Reference-backed answers", "Zero-onboarding experience", "30+ years domain expertise", "Clear brand positioning"]
    },
    { 
      title: "Weaknesses", 
      color: PDF_CONFIG.roseBg, 
      accent: PDF_CONFIG.rose,
      items: ["Limited brand visibility", "MVP still maturing", "Small team constraints", "Support infrastructure emerging", "Resolution processes light"]
    },
    { 
      title: "Opportunities", 
      color: PDF_CONFIG.blueBg, 
      accent: PDF_CONFIG.blue,
      items: ["Growing regulatory burden", "Underserved SMB segment", "Legacy PropTech slow on AI", "Cost pressures favour automation", "International expansion potential"]
    },
    { 
      title: "Threats", 
      color: PDF_CONFIG.amberBg, 
      accent: PDF_CONFIG.amber,
      items: ["Fast-moving AI competitors", "Legacy platforms adding AI", "AI hallucination trust risks", "Economic pressure on tech spend", "Competitor emotional storytelling"]
    }
  ];

  const cardWidth = (maxWidth - 8) / 2;
  const cardHeight = 55;

  swotData.forEach((quadrant, idx) => {
    const col = idx % 2;
    if (col === 0) {
      fitPage(cardHeight + 8);
    }
    const xPos = margin + col * (cardWidth + 8);

    doc.setFillColor(...quadrant.color);
    doc.roundedRect(xPos, yPosition, cardWidth, cardHeight, 3, 3, "F");
    
    doc.setFillColor(...quadrant.accent);
    doc.circle(xPos + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(quadrant.title, xPos + 20, yPosition + 12);

    let itemY = yPosition + 22;
    quadrant.items.forEach((item) => {
      doc.setFillColor(...quadrant.accent);
      doc.circle(xPos + 10, itemY - 1, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(item, xPos + 16, itemY);
      itemY += 6;
    });

    if (col === 1) {
      yPosition += cardHeight + 6;
    }
  });

  // Pillars Evaluation Matrix - full table with explanations
  const pillarsData = [
    { pillar: "Personalization", rating: 4, explanation: "We work closely with each client, adapting Hobson to their workflows. Manual discovery process." },
    { pillar: "Resolution", rating: 2, explanation: "Early-stage gaps in formal recovery processes. Our biggest area for improvement." },
    { pillar: "Integrity", rating: 4, explanation: "Transparent communication about capabilities. Honest pricing model." },
    { pillar: "Time & Effort", rating: 5, explanation: "Built to reduce friction with intuitive, efficient interactions." },
    { pillar: "Expectations", rating: 4, explanation: "Focused on MVP delivery. Need to shift from 'expected' to 'exceeding'." },
    { pillar: "Empathy", rating: 4, explanation: "Shaped by real client pain. Discovery and feedback show we listen." }
  ];

  // Calculate total height for pillars table
  const pillarRowHeight = 16;
  const pillarTableHeaderHeight = 20;
  const pillarTableHeight = pillarTableHeaderHeight + pillarsData.length * pillarRowHeight + 6;
  
  // Force new page to ensure entire table fits
  fitPage(pillarTableHeight + 20);

  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, pillarTableHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPosition, maxWidth, pillarTableHeight, 3, 3, "S");

  // Table header
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Pillars Evaluation Matrix", margin + 8, yPosition + 12);

  // Column headers
  const col1X = margin + 8;
  const col2X = margin + 48;
  const col3X = margin + 72;
  const headerY = yPosition + pillarTableHeaderHeight;

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Pillar", col1X, headerY);
  doc.text("Rating", col2X, headerY);
  doc.text("Explanation", col3X, headerY);

  // Draw header line
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.setLineWidth(0.2);
  doc.line(margin + 8, headerY + 3, margin + maxWidth - 8, headerY + 3);

  // Table rows
  let rowY = headerY + 12;
  const explanationWidth = maxWidth - 80;

  pillarsData.forEach((pillar) => {
    // Pillar name
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(pillar.pillar, col1X, rowY);

    // Rating
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(pillar.rating + "/5", col2X, rowY);

    // Explanation - properly wrapped
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const explLines = doc.splitTextToSize(sanitizeText(pillar.explanation), explanationWidth);
    doc.text(explLines[0] || "", col3X, rowY);

    rowY += pillarRowHeight;
  });

  yPosition += pillarTableHeight + 8;

  // Recommendations header
  fitPage(20);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 6, yPosition + 4, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Recommendations", margin + 16, yPosition + 6);
  yPosition += 14;

  const recommendations = [
    { title: "Strengthen Trust", items: ["Confidence scores", "Clear resolution process", "Early case studies"] },
    { title: "Expand Storytelling", items: ["Human testimonials", "Consistent metaphors", "Clarity partner positioning"] },
    { title: "Accelerate Visibility", items: ["LinkedIn engagement", "Quiz as entry point", "Thought leadership"] },
    { title: "Product Differentiation", items: ["Retrieval to insight path", "Hobson Blueprints", "Personalisation at scale"] },
    { title: "Protect Advantage", items: ["Lightweight positioning", "MVP client advocates", "Scalable processes"] }
  ];

  const recCardWidth = (maxWidth - 16) / 3;
  const recCardHeight = 38;

  recommendations.forEach((rec, idx) => {
    const col = idx % 3;
    if (col === 0) {
      fitPage(recCardHeight + 6);
    }
    const xPos = margin + col * (recCardWidth + 8);
    
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPosition, recCardWidth, recCardHeight, 3, 3, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text((idx + 1) + ". " + rec.title, xPos + 6, yPosition + 10);

    let itemY = yPosition + 18;
    rec.items.forEach((item) => {
      doc.setFillColor(...PDF_CONFIG.primaryColor);
      doc.circle(xPos + 8, itemY - 1, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(item, xPos + 13, itemY);
      itemY += 6;
    });

    if (col === 2 || idx === recommendations.length - 1) {
      yPosition += recCardHeight + 6;
    }
  });

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
    } else if (componentType === "ourVision") {
      yPosition = renderOurVision(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "whyNow") {
      yPosition = renderWhyNow(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "whyNowSpeed") {
      yPosition = renderWhyNowSpeed(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "customersMarketSources") {
      yPosition = renderCustomersMarketSources(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "approach") {
      yPosition = renderStrategicApproach(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "teamCredibility") {
      yPosition = renderTeamCredibility(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "foundingLeadership") {
      yPosition = renderFoundingLeadership(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "team") {
      yPosition = renderTeam(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "raise") {
      yPosition = renderRaise(doc, yPosition, margin, pageWidth, pageHeight);
    }
    // Customers & Market renderers
    else if (componentType === "sectorScaleOpportunity") {
      yPosition = renderSectorScaleOpportunity(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "customerSegmentation") {
      yPosition = renderCustomerSegmentation(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "ukMarketAssumptions") {
      yPosition = renderUKMarketAssumptions(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "europeanGlobal") {
      yPosition = renderEuropeanGlobal(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "landscape") {
      yPosition = renderMarketLandscape(doc, yPosition, margin, pageWidth, pageHeight);
    }
    // Roadmap & Product renderers
    else if (componentType === "productVision") {
      yPosition = renderProductVision(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "earlyRoadmap") {
      yPosition = renderEarlyRoadmap(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "techStack") {
      yPosition = renderTechStack(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "simpleUI") {
      yPosition = renderSimpleUI(doc, yPosition, margin, pageWidth, pageHeight);
    }
    // Commercials renderers
    else if (componentType === "commercialisationStrategy") {
      yPosition = renderCommercialisationStrategy(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "businessObjectives") {
      yPosition = renderBusinessObjectives(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "heuPricing") {
      yPosition = renderHEUPricing(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "commercials") {
      yPosition = renderCommercials(doc, yPosition, margin, pageWidth, pageHeight);
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
    }
    // Marketing & Sales Strategy renderers
    else if (componentType === "executiveContext") {
      yPosition = renderExecutiveContext(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "situationAnalysis") {
      yPosition = renderSituationAnalysis(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "customerPersonas") {
      yPosition = renderCustomerPersonas(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "customerUserJourneys") {
      yPosition = renderCustomerUserJourneys(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "marketDescription") {
      yPosition = renderMarketDescription(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "competitorBenchmarks") {
      yPosition = renderCompetitorBenchmarks(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "customerOnlineBehaviour") {
      yPosition = renderCustomerOnlineBehaviour(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "brandIntegrity") {
      yPosition = renderBrandIntegrity(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "pestleAnalysis") {
      yPosition = renderPESTLEAnalysis(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "internalCapabilityAssessment") {
      yPosition = renderInternalCapabilityAssessment(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "swotAnalysis") {
      yPosition = renderSWOTAnalysis(doc, yPosition, margin, pageWidth, pageHeight);
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
  marketingSales: CardSection;
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

  // Explicit ordered list of cards to include - filter out sections with no pages
  const allSections: CardSection[] = [
    cards.strategyPositioning,
    cards.customersMarket,
    cards.roadmapProduct,
    cards.commercials,
    cards.team,
    cards.marketingSales,
    cards.financials,
  ];
  
  // Only include sections that have content (pages)
  const includedSections: CardSection[] = allSections.filter(
    section => section.pages && section.pages.length > 0
  );

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
