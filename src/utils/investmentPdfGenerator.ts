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
import { getPdfContentForComponent, getExecutiveContextStructuredData, getSituationAnalysisStructuredData, getCustomerPersonasStructuredData, getCustomerUserJourneysStructuredData, getMarketDescriptionStructuredData, getCompetitorBenchmarksStructuredData, getCustomerOnlineBehaviourStructuredData, getWhyNowStructuredData, getSWOTAnalysisStructuredData, getCustomerSegmentationStructuredData, getCustomersMarketSourcesStructuredData, getProductVisionStructuredData, getEarlyRoadmapStructuredData, getTechStackStructuredData, getCommercialisationStrategyStructuredData, getCommercialsStructuredData, getHEUPricingStructuredData, getTeamCredibilityStructuredData, getFoundingLeadershipStructuredData, getTeamStructuredData, getMarketingObjectivesStructuredData, getBrandStrategyStructuredData, getBrandIntegrityStructuredData, getSegmentationStrategyStructuredData, getContentEngagementStrategyStructuredData, getPrimaryConversionChannelsStructuredData, getAcquisitionExecutiveSummaryStructuredData, getGoToMarketStrategyStructuredData, getCustomerSegmentationVisualStructuredData, getFinancialsExecutiveSummaryStructuredData, getPLAssumptionsDetailedStructuredData, getCostAssumptionsDetailedStructuredData, getOnboardingCostsDetailedStructuredData, getUKAssumptionsFinancialsDetailedStructuredData, getCACAssumptionsDetailedStructuredData, getBurnRateAssumptionsDetailedStructuredData, getPESTLEAnalysisStructuredData, getInternalCapabilityAssessmentStructuredData, getOurVisionStructuredData, getStrategicApproachStructuredData, getRaiseStructuredData } from "@/components/investor/data/pdfContentProviders";
import { competitorData } from "@/components/investor/data/competitorData";

// ============================================================================
// PDF CONFIGURATION - MASTER DEFAULTS (Strategy & Approach Reference)
// ============================================================================
// All sizing, spacing, typography, and COLOR values are defined here.
// Values extracted from Strategy & Approach section handlers as the canonical source.
// These are the SINGLE SOURCE OF TRUTH for all PDF rendering.
// ALL handlers must use PDF_CONFIG values - no hardcoded colors allowed.
// ============================================================================

const PDF_CONFIG = {
  // ============================================================================
  // PAGE LAYOUT
  // ============================================================================
  margin: 20,

  // ============================================================================
  // FONT SIZES (in points) - from Strategy & Approach
  // ============================================================================
  fontSize: {
    pageTitle: 18,        // Tab/page titles
    sectionTitle: 13,     // Section headers
    cardTitle: 12,        // Card/box titles (doc.setFontSize(PDF_CONFIG.fontSize.cardTitle))
    statLarge: 10,        // Large stat values
    body: 9,              // Standard body text (doc.setFontSize(PDF_CONFIG.fontSize.body))
    bodySmall: 8,         // Secondary info, labels (doc.setFontSize(PDF_CONFIG.fontSize.bodySmall))
    caption: 8,           // Footnotes, sources (same as bodySmall)
    small: 7,             // Small labels, badges
    tiny: 6,              // Very small text (sublabels, fine print)
    micro: 5,             // Smallest text (dense tables)
    stat: 16,             // Large statistics
  },

  // ============================================================================
  // LINE HEIGHT (in points) - vertical spacing between lines
  // DEFAULT: Use lineHeight.body (5pt) for standard compact text spacing
  // These are the PRIMARY values to use for consistent PDF output
  // ============================================================================
  lineHeight: {
    body: 5,              // DEFAULT - Standard line spacing (use for most text)
    tight: 4,             // Compact lists, dense tables
    loose: 6,             // Headers, titles, relaxed spacing
    relaxed: 7,           // Extra relaxed spacing
    spacious: 8,          // Large gaps between items
  },

  // ============================================================================
  // LINE HEIGHT FACTOR - multiplier for doc.text() lineHeightFactor option
  // From: lineHeightFactor: 1.2 (headers), lineHeightFactor: 1.25 (body)
  // ============================================================================
  lineHeightFactor: {
    tight: 1.2,           // Headers, inflexion point (lineHeightFactor: 1.2)
    body: 1.25,           // Standard paragraphs (lineHeightFactor: 1.25)
    loose: 1.35,          // Extra breathing room
  },

  // ============================================================================
  // CALCULATED LINE HEIGHTS (in points) - fontSize × lineHeightFactor
  // AVOID: These create airy spacing. Only use for special cases requiring 
  // extra breathing room (e.g., large headings, callout boxes)
  // PREFER: lineHeight.body (5pt) for standard text rendering
  // ============================================================================
  calculatedLineHeight: {
    body: 9 * 1.25,       // 11.25pt - AIRY - only for special cases
    bodyLoose: 9 * 1.35,  // 12.15pt - VERY AIRY - callouts only
    bodyTight: 9 * 1.2,   // 10.8pt - still airy compared to lineHeight.body
    small: 8 * 1.25,      // 10pt - small text with extra space
    smallTight: 8 * 1.2,  // 9.6pt - compact small text
    caption: 8 * 1.2,     // 9.6pt - caption/footnote text
    title: 12 * 1.2,      // 14.4pt - card titles
    sectionTitle: 13 * 1.2, // 15.6pt - section headers
  },

  // ============================================================================
  // SPACING (in points) - gaps between elements
  // Extracted from Strategy & Approach exact values
  // ============================================================================
  spacing: {
    sectionGap: 8,        // Major section gap
    cardGap: 6,           // Gap between cards (pressureBoxWidth + 6, yPosition += height + 6)
    boxGap: 4,            // Gap between rows in grid (pressureBoxHeight + 4)
    boxToBox: 5,          // Gap between adjacent content boxes (missionBoxY + height + 5)
    paragraphGap: 4,      // Gap between paragraphs
    headingGap: 5,        // Gap between title and subtitle
    titleToContent: 6,    // Gap between header and content
    subtitleToBullets: 4, // Gap between subtitle and bullet list
    contentStart: 8,      // Y offset for first text line (yPosition + 8)
    headerIconY: 6,       // Y offset for header icons (yPosition + 6)
    titleY: 8,            // Y offset for title text (yPosition + 8)
    subtitleY: 15,        // Y offset for subtitle text (yPosition + 15)
    contentBoxStart: 18,  // Y offset where content box starts (yPosition + 18)
    headerToContent: 18,  // Alias for contentBoxStart
    boxTopPadding: 10,    // Top padding for box height calc (10 + lines * factor)
    boxContentPadding: 6, // Content box internal padding (+6 in height calc)
    pageBreakMargin: 40,  // Bottom margin for page break check
    circleOffset: 10,     // X offset for circle from margin
    itemGap: 12,          // Gap between items/sections
    textIndent: 18,       // Standard text indent from margin
    contentPadding: 14,   // Padding for content areas
    bulletOffset: 8,      // X offset for bullet circles
    bulletTextOffset: 20, // X offset for text after bullets
    gridGap: 10,          // Gap between grid columns
  },

  // ============================================================================
  // NUMBERED CIRCLE - positioning for numbers inside circles
  // ============================================================================
  numberedCircle: {
    yOffset: 5,           // Y offset from yPosition for circle center
    textYOffset: 1,       // Additional Y offset for text centering inside circle
  },

  // ============================================================================
  // CIRCLE SIZES (radius in points) - from Strategy & Approach
  // From: PDF_CONFIG.circleSize.small, PDF_CONFIG.circleSize.medium
  // ============================================================================
  circleSize: {
    bullet: 0.8,          // Tiny bullet points
    small: 1.2,           // Pressure box icons (PDF_CONFIG.circleSize.small)
    medium: 2.0,          // Section header icons (PDF_CONFIG.circleSize.medium)
    large: 3.2,           // Numbered badges
    xlarge: 4.0,          // Hero section icons
  },

  // ============================================================================
  // BOX/CARD SIZING (in points) - from Strategy & Approach
  // From: innerPadding = 8, roundedRect(..., 3, 3), setLineWidth(0.3)
  // ============================================================================
  box: {
    paddingX: 8,          // Horizontal padding (innerPadding = 8, ctxPadding = 8, etc.)
    paddingTop: 8,        // Top padding
    paddingBottom: 6,     // Bottom padding
    borderRadius: 3,      // Main box corners (roundedRect(..., 3, 3))
    borderRadiusSmall: 2, // Pressure/small box corners (roundedRect(..., 2, 2))
    borderWidth: 0.3,     // Main border stroke (setLineWidth(0.3))
    borderWidthThin: 0.2, // Content box border (setLineWidth(0.2))
    minHeight: 18,        // Minimum box height (pressureBoxHeight = 18)
  },

  // ============================================================================
  // CARD LAYOUT - from Strategy & Approach
  // From: circle at x + 10, text at margin + 20, text at x + 18
  // ============================================================================
  card: {
    iconOffsetX: 10,      // X position of icon from edge (margin + 10, x + 10)
    textOffsetX: 20,      // X position of text after icon (margin + 20)
    textOffsetXSmall: 18, // Smaller text offset for pressure boxes (x + 18)
    iconSize: 8,          // Icon dimensions
    iconGap: 4,           // Gap after icon
    titleHeight: 5,       // Title line height
    subtitleGap: 7,       // Gap from title to subtitle (15 - 8 = 7)
    contentGap: 6,        // Gap between header and content
    headerHeight: 18,     // Header area before content box
  },

  // ============================================================================
  // TEXT RENDERING DEFAULTS
  // ============================================================================
  text: {
    align: "justify" as const, // Default alignment (align: "justify")
  },

  // ============================================================================
  // COLORS - RGB values (single source of truth for all PDF rendering)
  // ============================================================================
  // Primary/Purple
  primaryColor: [124, 58, 237] as [number, number, number],
  primaryDark: [147, 51, 234] as [number, number, number],    // purple-600
  primaryLight: [168, 113, 246] as [number, number, number],
  primaryBg: [240, 235, 255] as [number, number, number],
  primaryBgLight: [250, 245, 255] as [number, number, number],
  primaryBgMedium: [245, 238, 255] as [number, number, number],
  primaryBorder: [221, 214, 254] as [number, number, number], // purple-200
  
  // Text
  textDark: [9, 9, 25] as [number, number, number],
  textGray: [100, 116, 139] as [number, number, number],
  textLight: [148, 163, 184] as [number, number, number],
  
  // Backgrounds
  bgLight: [241, 245, 249] as [number, number, number],       // slate-100
  bgWhite: [255, 255, 255] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],        // slate-200
  headerBg: [245, 243, 255] as [number, number, number],
  
  // Slate
  slate: [100, 116, 139] as [number, number, number],         // slate-500
  slateBg: [248, 250, 252] as [number, number, number],       // slate-50
  slateBorder: [226, 232, 240] as [number, number, number],   // slate-200
  
  // Emerald/Green
  emerald: [5, 150, 105] as [number, number, number],         // emerald-600
  emeraldLight: [16, 185, 129] as [number, number, number],
  emeraldBg: [236, 253, 245] as [number, number, number],     // emerald-50
  emeraldBgLight: [240, 253, 248] as [number, number, number],
  emeraldBorder: [167, 243, 208] as [number, number, number], // emerald-200
  green: [34, 197, 94] as [number, number, number],           // green-500
  greenBg: [240, 253, 244] as [number, number, number],       // green-50
  
  // Blue
  blue: [37, 99, 235] as [number, number, number],            // blue-600
  blueLight: [59, 130, 246] as [number, number, number],      // blue-500
  blueBg: [239, 246, 255] as [number, number, number],        // blue-50
  blueBorder: [219, 234, 254] as [number, number, number],    // blue-200
  
  // Teal
  teal: [20, 184, 166] as [number, number, number],           // teal-500
  tealBg: [240, 253, 250] as [number, number, number],        // teal-50
  tealBorder: [153, 246, 228] as [number, number, number],    // teal-200
  
  // Rose/Red
  rose: [225, 29, 72] as [number, number, number],            // rose-600
  roseBg: [255, 241, 242] as [number, number, number],        // rose-50
  roseBorder: [254, 205, 211] as [number, number, number],    // rose-200
  red: [220, 38, 38] as [number, number, number],             // red-600
  redLight: [239, 68, 68] as [number, number, number],        // red-500
  redBg: [254, 242, 242] as [number, number, number],         // red-50
  redBorder: [254, 202, 202] as [number, number, number],     // red-200
  
  // Amber
  amber: [217, 119, 6] as [number, number, number],           // amber-600
  amberBg: [255, 251, 235] as [number, number, number],       // amber-50
  amberBorder: [253, 230, 138] as [number, number, number],   // amber-200
  
  // Pink
  pink: [219, 39, 119] as [number, number, number],           // pink-600
  pinkBg: [253, 242, 248] as [number, number, number],        // pink-50
  pinkBorder: [251, 207, 232] as [number, number, number],    // pink-200
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

// ============================================================================
// TEXT WRAPPING HELPERS
// ============================================================================
// IMPORTANT: jsPDF's splitTextToSize() uses the CURRENT font settings to
// calculate line breaks. If you call it before setting the correct font,
// wrapping will be incorrect. These helpers ensure font is set first.
// ============================================================================

type FontStyle = "body" | "bodySmall" | "caption" | "cardTitle" | "sectionTitle" | "pageTitle" | "stat";

/**
 * Split text to size with correct font metrics.
 * Sets the specified font BEFORE measuring, ensuring accurate line wrapping.
 * 
 * @param doc - jsPDF instance
 * @param text - Text to wrap
 * @param maxWidth - Maximum width for wrapping
 * @param fontStyle - Which font style to use for measuring
 * @param bold - Whether to use bold weight (default: false for body styles)
 * @returns Array of wrapped lines
 */
const splitTextWithFont = (
  doc: jsPDF,
  text: string,
  maxWidth: number,
  fontStyle: FontStyle = "body",
  bold: boolean = false
): string[] => {
  // Set font before measuring
  const fontSizeMap: Record<FontStyle, number> = {
    body: PDF_CONFIG.fontSize.body,
    bodySmall: PDF_CONFIG.fontSize.bodySmall,
    caption: PDF_CONFIG.fontSize.caption,
    cardTitle: PDF_CONFIG.fontSize.cardTitle,
    sectionTitle: PDF_CONFIG.fontSize.sectionTitle,
    pageTitle: PDF_CONFIG.fontSize.pageTitle,
    stat: PDF_CONFIG.fontSize.stat,
  };
  
  doc.setFontSize(fontSizeMap[fontStyle]);
  doc.setFont("helvetica", bold ? "bold" : "normal");
  
  return doc.splitTextToSize(sanitizeText(text), maxWidth);
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

  // Source content from provider
  const data = getOurVisionStructuredData();

  // Subtitle
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyFont(doc);
  doc.text(data.header.subtitle, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 14;

  // Color mapping for stages
  const colorMap: Record<string, { color: [number, number, number]; bgColor: [number, number, number] }> = {
    slate: { color: PDF_CONFIG.textGray, bgColor: PDF_CONFIG.bgLight },
    purple: { color: PDF_CONFIG.primaryDark, bgColor: PDF_CONFIG.primaryBgLight },
    primary: { color: PDF_CONFIG.primaryColor, bgColor: PDF_CONFIG.primaryBgMedium }
  };

  // Calculate card dimensions
  const cardWidth = (maxWidth - 12) / 3;
  const cardHeight = 72;

  // Render timeline cards
  data.stages.forEach((stage, index) => {
    const cardX = margin + index * (cardWidth + 6);
    const colors = colorMap[stage.colorType] || colorMap.slate;

    // Card background
    doc.setFillColor(...colors.bgColor);
    doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 3, 3, "F");

    // Card border
    doc.setDrawColor(...colors.color);
    doc.setLineWidth(1);
    doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 3, 3, "S");

    // Timeframe badge
    doc.setFillColor(...colors.color);
    setBodySmallFont(doc);
    const badgeWidth = doc.getTextWidth(stage.timeframe) + 10;
    const badgeX = cardX + (cardWidth - badgeWidth) / 2;
    doc.roundedRect(badgeX, yPosition + 5, badgeWidth, 9, 4, 4, "F");
    doc.setTextColor(...PDF_CONFIG.bgWhite);
    doc.text(stage.timeframe, cardX + cardWidth / 2, yPosition + 11, { align: "center" });

    // Stage label
    doc.setTextColor(...colors.color);
    setCardTitleFont(doc);
    doc.text(stage.label, cardX + cardWidth / 2, yPosition + 24, { align: "center" });

    // Icon labels as pills - use smaller font for better fit
    doc.setFontSize(6);
    const iconY = yPosition + 34;
    const pillPadding = 4;
    const pillGap = 2;
    let iconTotalWidth = 0;
    stage.icons.forEach((icon) => {
      iconTotalWidth += doc.getTextWidth(icon) + pillPadding * 2;
    });
    iconTotalWidth += (stage.icons.length - 1) * pillGap;
    
    // Ensure icons fit within card with margins
    const maxIconsWidth = cardWidth - 8;
    const scale = iconTotalWidth > maxIconsWidth ? maxIconsWidth / iconTotalWidth : 1;
    
    let iconX = cardX + (cardWidth - Math.min(iconTotalWidth, maxIconsWidth)) / 2;
    stage.icons.forEach((icon) => {
      const pillWidth = (doc.getTextWidth(icon) + pillPadding * 2) * scale;
      doc.setFillColor(...PDF_CONFIG.bgWhite);
      doc.roundedRect(iconX, iconY - 4, pillWidth, 8, 2, 2, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.text(icon, iconX + pillWidth / 2, iconY + 1, { align: "center" });
      iconX += pillWidth + pillGap;
    });

    // Description
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    const descLines = doc.splitTextToSize(stage.description, cardWidth - 10);
    doc.text(descLines, cardX + cardWidth / 2, yPosition + 48, { align: "center" });

    // Visual note
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.text(stage.visualNote, cardX + cardWidth / 2, yPosition + 66, { align: "center" });
  });

  yPosition += cardHeight + 14;

  // Progression indicators
  yPosition = checkPageBreak(doc, yPosition, 30, pageHeight, margin);

  const indicatorWidth = maxWidth / 3;
  const indicatorColors = [
    [PDF_CONFIG.textGray, PDF_CONFIG.primaryDark, PDF_CONFIG.primaryColor],
    [PDF_CONFIG.primaryColor, PDF_CONFIG.primaryDark, PDF_CONFIG.textGray],
    [PDF_CONFIG.textGray, PDF_CONFIG.primaryDark, PDF_CONFIG.primaryColor]
  ];

  data.progressionIndicators.forEach((indicator, index) => {
    const indX = margin + index * indicatorWidth + indicatorWidth / 2;

    // Dots first
    const dotY = yPosition;
    const dotRadius = 2.5;
    const dotGap = 10;
    indicatorColors[index].forEach((color, dotIndex) => {
      const dotX = indX - dotGap + dotIndex * dotGap;
      doc.setFillColor(...color);
      doc.circle(dotX, dotY, dotRadius, "F");
    });

    // Label aligned with dots
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.text(indicator.label.toUpperCase(), indX, yPosition + 10, { align: "center" });

    // Direction with larger gap
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.text(indicator.direction, indX, yPosition + 20, { align: "center" });
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

  // Use tight line heights for dense card content (matches default compact look)
  const bodyLineHeight = PDF_CONFIG.lineHeight.body + 1; // 6pt - compact but readable
  const looseLineHeight = PDF_CONFIG.lineHeight.loose; // 6pt for closing statement
  
  const para1Height = para1Lines.length * bodyLineHeight;
  const founderHeight = founderLines.length * bodyLineHeight + 8; // box padding
  const para2Height = para2Lines.length * bodyLineHeight;
  const closingHeight = closingLines.length * looseLineHeight;
  // Calculate enables items height based on actual wrapped lines
  let enablesItemsHeight = 0;
  enablesItems.forEach((item) => {
    const lines = doc.splitTextToSize(sanitizeText(item), contentMaxWidth - 10);
    enablesItemsHeight += lines.length * bodyLineHeight + bulletGap;
  });

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
    bodyLineHeight + // "Hobson enables:"
    gapSm +
    enablesItemsHeight +
    gapMd +
    para2Height +
    gapMd +
    closingHeight +
    2; // Reduced bottom padding

  // Check if Investment Rationale box fits on current page
  const rationaleFooterReserve = 18;
  if (yPosition + boxH > pageHeight - rationaleFooterReserve) {
    doc.addPage();
    yPosition = margin;
  }

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
    contentY += bodyLineHeight;
  });

  contentY += gapMd;

  // Founder note box
  const founderBoxY = contentY - 4;
  const founderBoxH = founderLines.length * bodyLineHeight + 8;
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
    contentY += bodyLineHeight;
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
  contentY += bodyLineHeight + gapSm;

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
      contentY += bodyLineHeight;
    });
    contentY += bulletGap;
  });

  contentY += gapMd;

  // Paragraph 2
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  para2Lines.forEach((l: string) => {
    doc.text(l, textX, contentY);
    contentY += bodyLineHeight;
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
    contentY += looseLineHeight;
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

  // Source content from provider
  const whyNowData = getWhyNowStructuredData();
  const { sections } = whyNowData;

  // Subtitle only - main title "Why Now?" already rendered by renderTabContent
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyFont(doc);
  doc.text("The Perfect Moment for AI Clarity in Real Estate", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 14;

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

  // Convergence section - light background matching on-screen update
  yPosition = checkPageBreak(doc, yPosition, 85, pageHeight, margin);

  // Convergence background - white with purple border (matches on-screen bg-white border-2 border-purple-200)
  const convergenceBoxHeight = 50; // Box only contains title and pills
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(1);
  doc.roundedRect(margin, yPosition, maxWidth, convergenceBoxHeight, 4, 4, "FD");

  // Header - purple text on white background
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setCardTitleFont(doc);
  doc.text(whyNowData.convergence.title, pageWidth / 2, yPosition + 12, { align: "center" });

  // Points as pills with light purple background (matches on-screen bg-purple-50 border-purple-200)
  const points = whyNowData.convergence.points;
  setBodySmallFont(doc);
  
  // Row 1: first 3 points
  let pillY = yPosition + 24;
  let totalWidth1 = 0;
  points.slice(0, 3).forEach((point) => {
    totalWidth1 += doc.getTextWidth(point) + 14;
  });
  let pillX = (pageWidth - totalWidth1) / 2;
  
  points.slice(0, 3).forEach((point) => {
    const textWidth = doc.getTextWidth(point) + 10;
    // Light purple pill background (matches on-screen bg-purple-50)
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(pillX, pillY - 4, textWidth, 10, 5, 5, "FD");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.text(point, pillX + 5, pillY + 2);
    pillX += textWidth + 4;
  });
  
  // Row 2: remaining points
  pillY += 13;
  let totalWidth2 = 0;
  points.slice(3).forEach((point) => {
    totalWidth2 += doc.getTextWidth(point) + 14;
  });
  pillX = (pageWidth - totalWidth2) / 2;
  
  points.slice(3).forEach((point) => {
    const textWidth = doc.getTextWidth(point) + 10;
    // Light purple pill background
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(pillX, pillY - 4, textWidth, 10, 5, 5, "FD");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.text(point, pillX + 5, pillY + 2);
    pillX += textWidth + 4;
  });

  // Move yPosition past the box
  yPosition += convergenceBoxHeight + 8;

  // Closing statement - BELOW the box, centered
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodyBoldFont(doc);
  const closingText = `${whyNowData.convergence.conclusion} ${whyNowData.convergence.callToAction}`;
  const closingLines = doc.splitTextToSize(closingText, maxWidth - 20);
  closingLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPosition, { align: "center" });
    yPosition += PDF_CONFIG.lineHeight.body;
  });

  yPosition += PDF_CONFIG.spacing.sectionGap;
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

  // Header - pale blue box with purple text (using PDF_CONFIG colors)
  const headerHeight = 16;
  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.setDrawColor(...PDF_CONFIG.blueBorder);
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

  // Market Reset section - amber background (using PDF_CONFIG colors)
  yPosition = checkPageBreak(doc, yPosition, 50, pageHeight, margin);
  
  const resetHeight = 46;
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.setDrawColor(...PDF_CONFIG.amberBorder);
  doc.roundedRect(margin, yPosition, maxWidth, resetHeight, 3, 3, "FD");
  
  // Header with warning icon
  doc.setFillColor(...PDF_CONFIG.amber);
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
  doc.text("This creates a narrow 12-36-month window to define the default system of record for AI in Real Estate.", margin + 8, resetY + 2);
  
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
 * Uses PDF_CONFIG defaults for all sizing and spacing - NO hardcoded values
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
  const { box, spacing, circleSize, lineHeight, card } = PDF_CONFIG;

  // Derived values from config
  const smallOffset = box.borderRadiusSmall;
  const itemHeight = spacing.headerToContent + lineHeight.body * 2;

  // Source content from provider
  const data = getCustomersMarketSourcesStructuredData();
  const sources = data.sources;

  // Section header
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + box.paddingX, yPosition + spacing.paragraphGap, circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text("Data Sources", margin + card.textOffsetX, yPosition + spacing.cardGap);
  yPosition += spacing.headerToContent;

  // Sources list (no horizontal dividers - text wraps naturally)
  sources.forEach((source) => {
    // Calculate actual height needed for this item
    doc.setTextColor(...PDF_CONFIG.textDark);
    const titleLines = splitTextWithFont(doc, source.title, maxWidth - card.iconOffsetX, "body", true);
    const actualItemHeight = titleLines.length * lineHeight.body + lineHeight.body * 2 + spacing.cardGap;
    
    yPosition = checkPageBreak(doc, yPosition, actualItemHeight, pageHeight, margin);
    
    // Title
    titleLines.forEach((line: string) => {
      doc.text(line, margin + spacing.paragraphGap, yPosition);
      yPosition += lineHeight.body;
    });
    
    // Stat
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    doc.text(sanitizeText(source.stat), margin + spacing.paragraphGap, yPosition);
    yPosition += lineHeight.body;
    
    // Link
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    setBodySmallFont(doc);
    const linkText = source.linkText;
    doc.text(linkText, margin + spacing.paragraphGap, yPosition);
    const linkWidth = doc.getTextWidth(linkText);
    doc.link(margin + spacing.paragraphGap, yPosition - smallOffset, linkWidth, lineHeight.body, { url: source.linkUrl });
    
    yPosition += spacing.cardGap + 2; // Gap between items instead of divider line
  });

  yPosition += spacing.sectionGap;
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

  // Source content from provider
  const data = getStrategicApproachStructuredData();

  // Color mapping for pillars
  const colorMap: Record<string, { accent: [number, number, number]; bg: [number, number, number] }> = {
    blue: { accent: PDF_CONFIG.blue, bg: PDF_CONFIG.blueBg },
    rose: { accent: PDF_CONFIG.rose, bg: PDF_CONFIG.roseBg },
    amber: { accent: PDF_CONFIG.amber, bg: PDF_CONFIG.amberBg }
  };

  data.pillars.forEach((pillar) => {
    yPosition = checkPageBreak(doc, yPosition, 70, pageHeight, margin);
    const colors = colorMap[pillar.colorType] || colorMap.blue;

    // Number badge
    doc.setFillColor(...colors.accent);
    doc.circle(margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    setCardTitleFont(doc);
    doc.text(pillar.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset);

    // Subtitle - wrap long text
    doc.setTextColor(...PDF_CONFIG.textGray);
    setBodySmallFont(doc);
    const subLines = doc.splitTextToSize(sanitizeText(pillar.subtitle), maxWidth - 30);
    let subY = yPosition + 14;
    subLines.forEach((line: string) => {
      doc.text(line, margin + 18, subY);
      subY += PDF_CONFIG.lineHeight.body;
    });
    yPosition = subY + 4;

    yPosition = renderBulletList(doc, pillar.items, margin + 4, yPosition, maxWidth - 8, colors.accent, PDF_CONFIG.textDark);
    yPosition += 2;

    // Conclusion box (if exists)
    if (pillar.conclusion) {
      doc.setFillColor(...colors.bg);
      const conclusionLines = doc.splitTextToSize(sanitizeText(pillar.conclusion), maxWidth - 30);
      const conclusionHeight = 6 + conclusionLines.length * 5;
      doc.roundedRect(margin + 8, yPosition, maxWidth - 16, conclusionHeight, 2, 2, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      setBodySmallFont(doc);
      doc.text(conclusionLines, margin + 14, yPosition + 6);
      yPosition += conclusionHeight + 8;
    } else {
      yPosition += 8;
    }
  });

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

  // Source content from provider - single source of truth
  const data = getTeamCredibilityStructuredData();

  // Header box
  const headerHeight = 36;
  renderContentCard(doc, margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.header.title, margin + 12, yPosition + 14);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const headerLines = doc.splitTextToSize(sanitizeText(data.header.description), maxWidth - 24);
  let headerY = yPosition + 22;
  headerLines.forEach((line: string) => {
    doc.text(line, margin + 12, headerY);
    headerY += PDF_CONFIG.lineHeight.body;
  });

  yPosition += headerHeight + 12;

  // Section 1: Direct Market Experience
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.directExperience.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset);
  yPosition += PDF_CONFIG.spacing.contentPadding;

  // Experience box
  const expHeight = 24;
  renderContentCard(doc, margin + 10, yPosition, maxWidth - 20, expHeight, PDF_CONFIG.blueBg, PDF_CONFIG.blueBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const expLines = doc.splitTextToSize(sanitizeText(data.directExperience.description), maxWidth - 40);
  let expY = yPosition + 8;
  expLines.forEach((line: string) => {
    doc.text(line, margin + 18, expY);
    expY += PDF_CONFIG.lineHeight.body;
  });

  yPosition += expHeight + 12;

  // Section 2: The Team Brings
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.teamBrings.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset);
  yPosition += PDF_CONFIG.spacing.contentPadding;

  // 2x2 grid of cards - use provider content
  const cardWidth = (maxWidth - 30) / 2;
  const cardHeight = 24;
  data.teamBrings.items.forEach((item, idx) => {
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
    if (yPosition + requiredSpace > pageHeight - PDF_CONFIG.spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Source content from provider - single source of truth
  const data = getFoundingLeadershipStructuredData();

  // Header box - Proven Operators
  checkPageBreak(50);
  const headerHeight = 48;
  renderContentCard(doc, margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + PDF_CONFIG.spacing.circleOffset, yPosition + PDF_CONFIG.spacing.itemGap, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.header.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.spacing.contentPadding);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const headerLines = doc.splitTextToSize(sanitizeText(data.header.description), maxWidth - PDF_CONFIG.spacing.textIndent - PDF_CONFIG.spacing.itemGap);
  let headerY = yPosition + PDF_CONFIG.spacing.textIndent + PDF_CONFIG.spacing.itemGap;
  headerLines.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.spacing.itemGap, headerY);
    headerY += PDF_CONFIG.lineHeight.body;
  });

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.highlight, margin + PDF_CONFIG.spacing.itemGap, headerY + 2);
  doc.setFont("helvetica", "normal");

  yPosition += headerHeight + PDF_CONFIG.spacing.itemGap;

  // Section 1: The founding leadership has
  checkPageBreak(45);
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  doc.setTextColor(...PDF_CONFIG.bgWhite);
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.text("1", margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset, { align: "center" });

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.foundingExperience.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset);
  yPosition += PDF_CONFIG.spacing.contentPadding;

  data.foundingExperience.items.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + PDF_CONFIG.spacing.contentPadding, yPosition + 2, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.text(sanitizeText(item), margin + PDF_CONFIG.spacing.bulletTextOffset, yPosition + 3);
    yPosition += PDF_CONFIG.lineHeight.body + 1;
  });

  yPosition += PDF_CONFIG.spacing.bulletOffset;

  // Section 2: Arthur & Aareon Experience
  checkPageBreak(65);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  doc.setTextColor(...PDF_CONFIG.bgWhite);
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.text("2", margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset, { align: "center" });

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.arthurAareon.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset);
  yPosition += PDF_CONFIG.spacing.contentPadding;

  const arthurBoxHeight = 52;
  renderContentCard(doc, margin + PDF_CONFIG.spacing.circleOffset, yPosition, maxWidth - PDF_CONFIG.spacing.bulletTextOffset, arthurBoxHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const arthurLines1 = doc.splitTextToSize(sanitizeText(data.arthurAareon.intro1), maxWidth - PDF_CONFIG.spacing.pageBreakMargin);
  let arthurY = yPosition + PDF_CONFIG.spacing.bulletOffset;
  arthurLines1.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.spacing.textIndent, arthurY);
    arthurY += PDF_CONFIG.lineHeight.body;
  });

  arthurY += 2;
  const arthurLines2 = doc.splitTextToSize(sanitizeText(data.arthurAareon.intro2), maxWidth - PDF_CONFIG.spacing.pageBreakMargin);
  arthurLines2.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.spacing.textIndent, arthurY);
    arthurY += PDF_CONFIG.lineHeight.body;
  });

  arthurY += 2;
  data.arthurAareon.items.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + PDF_CONFIG.spacing.bulletTextOffset + 2, arthurY - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(sanitizeText(item), margin + PDF_CONFIG.spacing.bulletTextOffset + PDF_CONFIG.spacing.bulletOffset, arthurY);
    arthurY += PDF_CONFIG.lineHeight.body;
  });

  yPosition += arthurBoxHeight + PDF_CONFIG.spacing.itemGap;

  // Section 3: Key Insight
  checkPageBreak(30);
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  doc.setTextColor(...PDF_CONFIG.bgWhite);
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.text("3", margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset, { align: "center" });

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.keyInsight.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset);
  yPosition += PDF_CONFIG.spacing.contentPadding;

  const insightBoxHeight = 16;
  renderContentCard(doc, margin + PDF_CONFIG.spacing.circleOffset, yPosition, maxWidth - PDF_CONFIG.spacing.bulletTextOffset, insightBoxHeight, PDF_CONFIG.amberBg, PDF_CONFIG.amberBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text(data.keyInsight.text, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.spacing.circleOffset);
  doc.setFont("helvetica", "normal");

  yPosition += insightBoxHeight + PDF_CONFIG.spacing.itemGap;

  // Section 4: What Team Has Navigated
  checkPageBreak(60);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  doc.setTextColor(...PDF_CONFIG.bgWhite);
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.text("4", margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset, { align: "center" });

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.teamNavigated.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.numberedCircle.yOffset + PDF_CONFIG.numberedCircle.textYOffset);
  yPosition += PDF_CONFIG.spacing.contentPadding;

  // 2x3 grid - use provider content
  const cardWidth = (maxWidth - PDF_CONFIG.spacing.gridGap * 3) / 2;
  const cardHeight = 16;
  data.teamNavigated.items.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + PDF_CONFIG.spacing.circleOffset + col * (cardWidth + PDF_CONFIG.spacing.cardGap);
    const cardY = yPosition + row * (cardHeight + PDF_CONFIG.spacing.boxGap);

    renderContentCard(doc, cardX, cardY, cardWidth, cardHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(cardX + PDF_CONFIG.spacing.bulletOffset, cardY + PDF_CONFIG.spacing.bulletOffset, PDF_CONFIG.circleSize.small, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.text(sanitizeText(item), cardX + PDF_CONFIG.spacing.contentPadding, cardY + PDF_CONFIG.spacing.circleOffset);
  });

  yPosition += 3 * (cardHeight + PDF_CONFIG.spacing.boxGap) + PDF_CONFIG.spacing.itemGap;

  // Conclusion box - use provider content
  checkPageBreak(24);
  const conclusionHeight = 20;
  renderContentCard(doc, margin, yPosition, maxWidth, conclusionHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + PDF_CONFIG.spacing.circleOffset, yPosition + PDF_CONFIG.spacing.circleOffset, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text(sanitizeText(data.conclusion), margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.spacing.itemGap);
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
    if (yPosition + requiredSpace > pageHeight - PDF_CONFIG.spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Source content from provider - single source of truth
  const data = getTeamStructuredData();

  // Section 1: Core Operational Team Header
  checkPageBreak(30);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.spacing.cardGap, PDF_CONFIG.circleSize.large, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.coreTeam.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.spacing.bulletOffset);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text(data.coreTeam.subtitle, margin + PDF_CONFIG.spacing.textIndent, yPosition + 16);
  yPosition += 24;

  // Team member cards - 2 columns
  const cardWidth = (maxWidth - PDF_CONFIG.spacing.bulletOffset) / 2;
  const cardHeight = 36;
  
  data.coreTeam.members.forEach((member, idx) => {
    const col = idx % 2;
    
    if (col === 0) {
      checkPageBreak(cardHeight + PDF_CONFIG.spacing.cardGap);
    }
    
    const cardX = margin + col * (cardWidth + PDF_CONFIG.spacing.bulletOffset);
    const cardY = yPosition;

    // Card background
    renderContentCard(doc, cardX, cardY, cardWidth, cardHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);

    // TBC badge
    if (member.isTBC) {
      doc.setFillColor(...PDF_CONFIG.amberBg);
      doc.roundedRect(cardX + cardWidth - 22, cardY + PDF_CONFIG.spacing.boxGap, 18, PDF_CONFIG.spacing.bulletOffset, PDF_CONFIG.box.borderRadiusSmall, PDF_CONFIG.box.borderRadiusSmall, "F");
      doc.setTextColor(...PDF_CONFIG.amber);
      doc.setFontSize(PDF_CONFIG.fontSize.caption);
      doc.text("TBC", cardX + cardWidth - 13, cardY + 9.5, { align: "center" });
    }

    // Initials circle
    const initials = member.name.split(' ').map(n => n[0]).join('');
    doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
    doc.circle(cardX + PDF_CONFIG.spacing.contentPadding, cardY + PDF_CONFIG.spacing.contentPadding, PDF_CONFIG.spacing.bulletOffset, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(initials, cardX + PDF_CONFIG.spacing.contentPadding, cardY + 16.5, { align: "center" });

    // Name and role
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.text(member.name, cardX + 26, cardY + PDF_CONFIG.spacing.itemGap);

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.text(member.role, cardX + 26, cardY + PDF_CONFIG.spacing.textIndent);

    // Description
    if (member.description) {
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(PDF_CONFIG.fontSize.caption);
      const descLines = doc.splitTextToSize(sanitizeText(member.description), cardWidth - 32);
      let descY = cardY + 25;
      descLines.slice(0, 2).forEach((line: string) => {
        doc.text(line, cardX + 26, descY);
        descY += PDF_CONFIG.spacing.boxGap;
      });
    }

    if (col === 1 || idx === data.coreTeam.members.length - 1) {
      yPosition += cardHeight + PDF_CONFIG.spacing.boxGap;
    }
  });

  yPosition += PDF_CONFIG.spacing.bulletOffset;

  // Divider
  checkPageBreak(PDF_CONFIG.spacing.pageBreakMargin);
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.line(margin + PDF_CONFIG.spacing.pageBreakMargin, yPosition, margin + maxWidth - PDF_CONFIG.spacing.pageBreakMargin, yPosition);
  
  doc.setFillColor(...PDF_CONFIG.bgWhite);
  const dividerTextWidth = doc.getTextWidth(data.advisors.dividerText) + 16;
  doc.rect(margin + (maxWidth - dividerTextWidth) / 2, yPosition - PDF_CONFIG.spacing.boxGap, dividerTextWidth, PDF_CONFIG.spacing.bulletOffset, "F");
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.text(data.advisors.dividerText, margin + maxWidth / 2, yPosition + 2, { align: "center" });
  yPosition += 16;

  // Section 2: Advisory Board Header
  doc.setFillColor(...PDF_CONFIG.textGray);
  doc.circle(margin + PDF_CONFIG.spacing.bulletOffset, yPosition + PDF_CONFIG.spacing.cardGap, PDF_CONFIG.circleSize.large, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.advisors.title, margin + PDF_CONFIG.spacing.textIndent, yPosition + PDF_CONFIG.spacing.bulletOffset);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text(data.advisors.subtitle, margin + PDF_CONFIG.spacing.textIndent, yPosition + 16);
  yPosition += 24;

  // Advisor cards - 2 columns like core team
  const advisorTextMaxWidth = cardWidth - 32; // Account for initials circle and padding
  const advisorCardHeight = 36; // Fixed height matching core team cards
  
  data.advisors.members.forEach((advisor, idx) => {
    const col = idx % 2;
    
    if (col === 0) {
      checkPageBreak(advisorCardHeight + PDF_CONFIG.spacing.cardGap);
    }
    
    const cardX = margin + col * (cardWidth + PDF_CONFIG.spacing.bulletOffset);
    const cardY = yPosition;
    
    renderContentCard(doc, cardX, cardY, cardWidth, advisorCardHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);

    // Initials
    const initials = advisor.name.split(' ').map(n => n[0]).join('');
    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.setDrawColor(...PDF_CONFIG.border);
    doc.circle(cardX + PDF_CONFIG.spacing.contentPadding, cardY + PDF_CONFIG.spacing.contentPadding, PDF_CONFIG.spacing.bulletOffset, "FD");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(initials, cardX + PDF_CONFIG.spacing.contentPadding, cardY + 16.5, { align: "center" });

    // Name and role
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.text(advisor.name, cardX + 26, cardY + PDF_CONFIG.spacing.itemGap);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.text(advisor.role, cardX + 26, cardY + PDF_CONFIG.spacing.textIndent);

    // Description
    if (advisor.description) {
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(PDF_CONFIG.fontSize.caption);
      const descLines = doc.splitTextToSize(sanitizeText(advisor.description), advisorTextMaxWidth);
      let descY = cardY + 25;
      descLines.slice(0, 2).forEach((line: string) => {
        doc.text(line, cardX + 26, descY);
        descY += PDF_CONFIG.spacing.boxGap;
      });
    }
    
    if (col === 1 || idx === data.advisors.members.length - 1) {
      yPosition += advisorCardHeight + PDF_CONFIG.spacing.boxGap;
    }
  });

  yPosition += PDF_CONFIG.spacing.circleOffset - PDF_CONFIG.spacing.boxGap;

  // Upcoming advisors box - use provider content
  checkPageBreak(PDF_CONFIG.spacing.pageBreakMargin);
  const upcomingHeight = 32;
  renderContentCard(doc, margin, yPosition, maxWidth, upcomingHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + PDF_CONFIG.spacing.circleOffset, yPosition + PDF_CONFIG.spacing.bulletOffset, PDF_CONFIG.circleSize.small, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.text(data.upcomingAdvisory.title, margin + 16, yPosition + PDF_CONFIG.spacing.circleOffset);

  const areaWidth = (maxWidth - 24) / 3;
  
  data.upcomingAdvisory.areas.forEach((area, idx) => {
    const areaX = margin + PDF_CONFIG.spacing.bulletOffset + idx * areaWidth;
    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.roundedRect(areaX, yPosition + 16, areaWidth - PDF_CONFIG.spacing.boxGap, PDF_CONFIG.spacing.itemGap, PDF_CONFIG.box.borderRadiusSmall, PDF_CONFIG.box.borderRadiusSmall, "F");
    
    doc.setFillColor(...PDF_CONFIG.textGray);
    doc.circle(areaX + PDF_CONFIG.spacing.cardGap, yPosition + 22, PDF_CONFIG.circleSize.small, "F");
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.text(area, areaX + PDF_CONFIG.spacing.itemGap, yPosition + 24);
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

  // Source content from provider
  const data = getRaiseStructuredData();

  // Funding header box
  const headerHeight = 32;
  renderContentCard(doc, margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  // Funding icon circle
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 20, yPosition + 10, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text(data.fundingRequirement.label, margin + 28, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setStatFont(doc);
  doc.text(data.fundingRequirement.amount, margin + 36, yPosition + 24);

  yPosition += headerHeight + 12;

  // Use of Funds section
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 8, yPosition + 5, PDF_CONFIG.circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.useOfFunds.title, margin + 18, yPosition + 7);
  yPosition += 14;

  data.useOfFunds.items.forEach((item) => {
    const cardHeight = 16;
    renderContentCard(doc, margin + 10, yPosition, maxWidth - 20, cardHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + 20, yPosition + 8, PDF_CONFIG.circleSize.medium, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    doc.text(sanitizeText(item), margin + 28, yPosition + 10);

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
    doc.setFontSize(PDF_CONFIG.fontSize.statLarge);
    doc.text(stat.title, xPos, yPosition + 34);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
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
  const { box, spacing, circleSize, fontSize, lineHeight } = PDF_CONFIG;
  const bodyLine = lineHeight.body; // Use tight 5pt spacing as default

  // Source content from provider
  const segmentData = getCustomerSegmentationStructuredData();

  // Description - left aligned
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  yPosition = renderSpacedText(doc, segmentData.intro, margin, yPosition, maxWidth, bodyLine);
  yPosition += spacing.cardGap;

  // Map color types to PDF_CONFIG colors
  const colorMap: Record<string, { color: [number, number, number]; bgColor: [number, number, number] }> = {
    blue: { color: PDF_CONFIG.blue, bgColor: [239, 246, 255] as [number, number, number] },
    primary: { color: PDF_CONFIG.primaryColor, bgColor: PDF_CONFIG.primaryBgLight },
    emerald: { color: PDF_CONFIG.emerald, bgColor: [236, 253, 245] as [number, number, number] },
  };

  segmentData.segments.forEach((segment) => {
    const colors = colorMap[segment.colorType] || colorMap.primary;
    // Calculate dynamic card height based on content
    setBodySmallFont(doc);
    const pressureLines = doc.splitTextToSize(sanitizeText(segment.pressure), maxWidth / 2 - spacing.bulletTextOffset - spacing.contentPadding);
    const driverLines = segment.adoptionDrivers.length;
    const contentLines = Math.max(pressureLines.length, driverLines + 1);
    const cardHeight = Math.max(85, spacing.bulletTextOffset + spacing.contentPadding + contentLines * bodyLine + 10); // Extra height for looser spacing

    yPosition = checkPageBreak(doc, yPosition, cardHeight + spacing.cardGap, pageHeight, margin);
    renderContentCard(doc, margin, yPosition, maxWidth, cardHeight, colors.bgColor, colors.color);

    // Header row - icon and title inline
    const headerY = yPosition + spacing.contentPadding;
    const headerIconSize = circleSize.large;
    doc.setFillColor(...colors.color);
    doc.circle(margin + spacing.circleOffset, headerY, headerIconSize, "F");

    // Title - aligned with icon center
    doc.setTextColor(...PDF_CONFIG.textDark);
    setCardTitleFont(doc);
    doc.text(segment.title, margin + spacing.bulletTextOffset, headerY + 1);

    // Percentage and description on second line (with extra spacing from header)
    const percentageY = yPosition + spacing.contentBoxStart + 4; // Extra 4pt spacing
    doc.setTextColor(...colors.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize.bodySmall);
    doc.text(segment.percentage, margin + spacing.bulletTextOffset, percentageY);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(segment.description, margin + spacing.bulletTextOffset + doc.getTextWidth(segment.percentage + " "), percentageY);

    // Two-column layout for PRESSURE and WHAT FORCES ADOPTION (extra spacing from percentage row)
    const colStartY = percentageY + spacing.contentPadding + 4; // Extra 4pt spacing

    // PRESSURE section - left column
    const leftColIconX = margin + spacing.circleOffset;
    const leftColTextX = margin + spacing.bulletTextOffset;
    
    // Pressure header with inline icon
    doc.setFillColor(...colors.color);
    doc.circle(leftColIconX, colStartY, circleSize.medium, "F");
    setCaptionFont(doc);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("PRESSURE", leftColTextX, colStartY + 1);
    
    // Pressure content
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    renderSpacedText(doc, segment.pressure, leftColTextX, colStartY + spacing.cardGap, maxWidth / 2 - spacing.bulletTextOffset - spacing.circleOffset, bodyLine);

    // WHAT FORCES ADOPTION section - right column
    const rightColIconX = margin + maxWidth / 2 + spacing.circleOffset;
    const rightColTextX = margin + maxWidth / 2 + spacing.bulletTextOffset;

    // Adoption header with inline icon
    doc.setFillColor(...colors.color);
    doc.circle(rightColIconX, colStartY, circleSize.medium, "F");
    setCaptionFont(doc);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text("WHAT FORCES ADOPTION", rightColTextX, colStartY + 1);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textDark);
    setBodySmallFont(doc);
    const rightColMaxWidth = maxWidth / 2 - spacing.bulletTextOffset;
    let driverY = colStartY + spacing.cardGap;
    segment.adoptionDrivers.forEach((driver) => {
      const wrappedDriver = doc.splitTextToSize(sanitizeText(driver), rightColMaxWidth);
      wrappedDriver.forEach((line: string, lineIndex: number) => {
        const prefix = lineIndex === 0 ? "•  " : "   ";
        doc.text(`${prefix}${line}`, rightColTextX, driverY);
        driverY += lineHeight.tight + 1;
      });
    });

    yPosition += cardHeight + spacing.cardGap;
  });

  // Footer insight - purple text with spacing
  yPosition = checkPageBreak(doc, yPosition, spacing.contentBoxStart + spacing.cardGap, pageHeight, margin);
  yPosition += spacing.boxGap; // Add gap from last card
  renderContentCard(doc, margin, yPosition, maxWidth, spacing.contentPadding, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  setBodySmallFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text(segmentData.footer, pageWidth / 2, yPosition + spacing.cardGap, { align: "center" });
  yPosition += spacing.bulletTextOffset;

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
  const greenBg = PDF_CONFIG.emeraldBg;
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
  const item1CircleY = yPosition + 24;
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 16, item1CircleY, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.setFont("helvetica", "bold");
  doc.text("1", margin + 16, item1CircleY + PDF_CONFIG.numberedCircle.textYOffset, { align: "center" });
  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodyFont(doc);
  doc.setFont("helvetica", "bold");
  doc.text("Core Market", margin + 24, yPosition + 25);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("~90,000 real estate operators where document intelligence is mission-critical", margin + 24, yPosition + 32);

  // Item 2 - Expansion Market
  const item2CircleY = yPosition + 42;
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 16, item2CircleY, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.setFont("helvetica", "bold");
  doc.text("2", margin + 16, item2CircleY + PDF_CONFIG.numberedCircle.textYOffset, { align: "center" });
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

  // Source content from provider
  const data = getProductVisionStructuredData();

  // Industry Context box
  const industryPains = data.industryContext.pains;
  
  const industryBoxHeight = 70;
  yPosition = checkPageBreak(doc, yPosition, industryBoxHeight + 8, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.setDrawColor(...PDF_CONFIG.amberBorder);
  doc.roundedRect(margin, yPosition, maxWidth, industryBoxHeight, 3, 3, "FD");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.industryContext.title, margin + 8, yPosition + 12);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text(data.industryContext.intro, margin + 8, yPosition + 22);
  
  let painY = yPosition + 30;
  industryPains.forEach((pain) => {
    doc.setFillColor(...PDF_CONFIG.amber);
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
  doc.text(data.visionStatement, pageWidth / 2, yPosition + 12, { align: "center" });
  yPosition += 28;

  // Market Gap box
  const marketGaps = data.marketGap.gaps;
  
  const gapBoxHeight = 58;
  yPosition = checkPageBreak(doc, yPosition, gapBoxHeight + 8, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, gapBoxHeight, 3, 3, "FD");
  
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.marketGap.title, margin + 16, yPosition + 12);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text(data.marketGap.intro, margin + 8, yPosition + 24);
  
  let gapY = yPosition + 32;
  marketGaps.forEach((gap) => {
    doc.setFillColor(...PDF_CONFIG.redLight);
    doc.circle(margin + 14, gapY - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(gap, margin + 20, gapY);
    gapY += 6;
  });
  yPosition += gapBoxHeight + 8;

  // Core Capabilities box
  const coreCapabilities = data.coreCapabilities.capabilities;
  
  const capBoxHeight = 52;
  yPosition = checkPageBreak(doc, yPosition, capBoxHeight + 8, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, capBoxHeight, 3, 3, "FD");
  
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 8, yPosition + 10, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.coreCapabilities.title, margin + 16, yPosition + 12);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text(data.coreCapabilities.intro, margin + 8, yPosition + 22);
  
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
  
  doc.setTextColor(...PDF_CONFIG.bgWhite);
  setBodyBoldFont(doc);
  const closingText = data.conclusion;
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

  // Phase 1: Discover & De-Risk
  const phase1Height = 55;
  yPosition = checkPageBreak(doc, yPosition, phase1Height + 8, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, phase1Height, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.rect(margin, yPosition, 4, phase1Height, "F");

  doc.setTextColor(...PDF_CONFIG.emerald);
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
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(xPos + 2, yPos - 1, PDF_CONFIG.circleSize.small, "F");
    doc.text(item, xPos + 6, yPos);
  });
  yPosition += phase1Height + 6;

  // Phase 2: Validate Core Engine
  const phase2Height = 98;
  yPosition = checkPageBreak(doc, yPosition, phase2Height + 8, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, phase2Height, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.rect(margin, yPosition, 4, phase2Height, "F");

  doc.setTextColor(...PDF_CONFIG.emerald);
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
    doc.setFillColor(...PDF_CONFIG.emerald);
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
    doc.setFillColor(...PDF_CONFIG.emerald);
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
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, phase3Height, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.rect(margin, yPosition, 4, phase3Height, "F");

  doc.setTextColor(...PDF_CONFIG.amber);
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
    doc.setFillColor(...PDF_CONFIG.amber);
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
    doc.setTextColor(...PDF_CONFIG.bgWhite);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
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
    doc.setFontSize(PDF_CONFIG.fontSize.small);
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
 * Render Commercialisation Strategy visual (Commercial Philosophy)
 * Uses PDF_CONFIG defaults for all sizing and spacing - NO hardcoded values
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
  const { box, spacing, circleSize, fontSize, card, lineHeight } = PDF_CONFIG;

  // Page break margin derived from config
  const pageBreakMargin = margin * 2;

  // Helper for page break
  const checkBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Source content from provider - single source of truth
  const data = getCommercialisationStrategyStructuredData();

  // All derived values from PDF_CONFIG - no magic numbers
  const headerBoxHeight = spacing.headerToContent + spacing.cardGap;
  const headerTextY = spacing.subtitleY;
  const challengeCardHeight = spacing.titleY + spacing.cardGap;
  const challengeTextY = fontSize.bodySmall;
  const challengeCircleY = challengeTextY - box.borderRadiusSmall;
  const calloutHeight = spacing.headerToContent + box.borderRadiusSmall;
  const calloutTextY = fontSize.cardTitle;
  const sectionCircleY = lineHeight.body;
  const sectionTitleY = sectionCircleY + box.borderRadiusSmall;
  const gridCardHeight = spacing.headerToContent + box.borderRadiusSmall;
  const gridCircleY = spacing.boxTopPadding;
  const gridTextY = fontSize.cardTitle;
  const conclusionHeight = spacing.headerToContent + spacing.boxTopPadding;
  const conclusionCircleY = spacing.titleY + spacing.cardGap;
  const conclusionLine1Y = fontSize.cardTitle - 1;
  const conclusionLine2Y = conclusionLine1Y + lineHeight.body;

  // Header box - Inflexion Point
  checkBreak(headerBoxHeight + spacing.cardGap);
  renderContentCard(doc, margin, yPosition, maxWidth, headerBoxHeight, PDF_CONFIG.amberBg, PDF_CONFIG.amberBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.headerText, margin + box.paddingX + spacing.subtitleToBullets, yPosition + headerTextY);

  yPosition += headerBoxHeight + spacing.sectionGap + spacing.subtitleToBullets;

  // Section 1: Operators Are Facing
  checkBreak(spacing.boxTopPadding * 7);
  doc.setFillColor(...PDF_CONFIG.rose);
  doc.circle(margin + box.paddingX, yPosition + sectionCircleY, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Operators are facing:", margin + card.textOffsetX - box.borderRadiusSmall, yPosition + sectionTitleY);
  yPosition += spacing.headerToContent - spacing.subtitleToBullets;

  // Use challenges from provider
  data.operatorChallenges.forEach((challenge) => {
    renderContentCard(doc, margin + card.iconOffsetX, yPosition, maxWidth - card.textOffsetX, challengeCardHeight, PDF_CONFIG.roseBg, PDF_CONFIG.roseBorder);
    
    doc.setFillColor(...PDF_CONFIG.rose);
    doc.circle(margin + card.textOffsetX - box.borderRadiusSmall, yPosition + challengeCircleY, circleSize.small, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(challenge), margin + card.textOffsetX + spacing.subtitleToBullets, yPosition + challengeTextY);
    yPosition += challengeCardHeight + box.borderRadius;
  });

  yPosition += spacing.paragraphGap;

  // Callout box - use provider content
  renderContentCard(doc, margin + card.iconOffsetX, yPosition, maxWidth - card.textOffsetX, calloutHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize.bodySmall);
  doc.text(data.calloutText.prefix, margin + box.paddingX + box.paddingX, yPosition + calloutTextY);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text(data.calloutText.highlighted, margin + box.paddingX + box.paddingX + doc.getTextWidth(data.calloutText.prefix), yPosition + calloutTextY);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(data.calloutText.suffix, margin + box.paddingX + box.paddingX + doc.getTextWidth(data.calloutText.prefix + data.calloutText.highlighted), yPosition + calloutTextY);
  doc.setFont("helvetica", "normal");

  yPosition += calloutHeight + spacing.sectionGap + spacing.subtitleToBullets;

  // Section 2: Hobson's Product
  checkBreak(spacing.boxTopPadding * 6);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + box.paddingX, yPosition + sectionCircleY, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Hobson's product is already solving existential problems:", margin + card.textOffsetX - box.borderRadiusSmall, yPosition + sectionTitleY);
  yPosition += spacing.headerToContent - spacing.subtitleToBullets;

  // 2x2 grid - use provider content
  const gridGap = spacing.headerToContent + spacing.boxTopPadding;
  const cardWidth = (maxWidth - gridGap) / 2;
  data.problemsSolved.forEach((problem, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + card.iconOffsetX + col * (cardWidth + spacing.cardGap);
    const cardY = yPosition + row * (gridCardHeight + spacing.paragraphGap);

    renderContentCard(doc, cardX, cardY, cardWidth, gridCardHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(cardX + card.iconOffsetX, cardY + gridCircleY, circleSize.small, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(problem), cardX + box.paddingX + box.paddingX, cardY + gridTextY);
  });

  const gridRows = 2;
  yPosition += gridRows * (gridCardHeight + spacing.paragraphGap) + spacing.sectionGap + spacing.subtitleToBullets;

  // Conclusion box - use provider content
  checkBreak(conclusionHeight + spacing.sectionGap);
  renderContentCard(doc, margin, yPosition, maxWidth, conclusionHeight, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + box.paddingX + spacing.subtitleToBullets, yPosition + conclusionCircleY, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize.bodySmall);
  doc.text(data.conclusionLine1.prefix, margin + card.textOffsetX, yPosition + conclusionLine1Y);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text(data.conclusionLine1.highlighted, margin + card.textOffsetX + doc.getTextWidth(data.conclusionLine1.prefix), yPosition + conclusionLine1Y);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(data.conclusionLine1.suffix, margin + card.textOffsetX + doc.getTextWidth(data.conclusionLine1.prefix + data.conclusionLine1.highlighted), yPosition + conclusionLine1Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize.body);
  doc.text(data.conclusionLine2, margin + card.textOffsetX, yPosition + conclusionLine2Y);
  doc.setFont("helvetica", "normal");

  yPosition += conclusionHeight + spacing.sectionGap;
  return yPosition;
};

/**
 * Render Commercials visual (Commercial Philosophy)
 * Uses PDF_CONFIG defaults for all sizing and spacing - NO hardcoded values
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
  const { box, spacing, circleSize, lineHeight, fontSize, card } = PDF_CONFIG;

  // Derived values from config
  const pageBreakMargin = margin * 2;
  const smallOffset = box.borderRadiusSmall;
  const standardBoxHeight = box.minHeight + smallOffset;

  // Helper for page break
  const checkBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Source content from provider - single source of truth
  const data = getCommercialsStructuredData();

  // Header - Intro text
  const introHeight = standardBoxHeight;
  checkBreak(introHeight + spacing.sectionGap);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(fontSize.body);
  const introLines = splitTextWithFont(doc, data.introText, maxWidth, "body", false);
  doc.setFont("helvetica", "italic"); // Reset after splitTextWithFont
  doc.text(introLines, pageWidth / 2, yPosition, { align: "center" });
  yPosition += introLines.length * lineHeight.loose + spacing.sectionGap + box.paddingX;

  // Section 1: Revenue Expansion Engine
  const revenueCardHeight = spacing.boxTopPadding * 9;
  checkBreak(revenueCardHeight + spacing.sectionGap);
  renderContentCard(doc, margin, yPosition, maxWidth, revenueCardHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

  // Header with circle icon
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + card.textOffsetX, yPosition + spacing.headerToContent - smallOffset, circleSize.xlarge, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.revenueExpansion.title, margin + card.textOffsetX + card.iconOffsetX + smallOffset, yPosition + spacing.headerToContent);

  yPosition += standardBoxHeight + spacing.cardGap;

  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodySmallFont(doc);
  doc.text(data.revenueExpansion.intro, margin + box.paddingX * 2, yPosition);
  yPosition += spacing.sectionGap + smallOffset;

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text(data.revenueExpansion.asOperatorsLabel, margin + box.paddingX * 2, yPosition);
  yPosition += box.paddingX;

  doc.setFont("helvetica", "normal");
  data.revenueExpansion.drivers.forEach((driver) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + card.textOffsetX + smallOffset, yPosition - 1, circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(driver, margin + card.textOffsetX + box.paddingX, yPosition);
    yPosition += spacing.cardGap;
  });

  yPosition += spacing.cardGap;

  // Callout
  const calloutY = yPosition;
  const calloutHeight = spacing.headerToContent - smallOffset;
  doc.setFillColor(...PDF_CONFIG.emeraldBgLight);
  doc.roundedRect(margin + box.paddingX + smallOffset, calloutY - spacing.paragraphGap, maxWidth - box.paddingX * 3, calloutHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  doc.text(data.revenueExpansion.callout.prefix, margin + card.textOffsetX, calloutY + lineHeight.body);
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFont("helvetica", "bold");
  doc.text(data.revenueExpansion.callout.highlighted, margin + card.textOffsetX + doc.getTextWidth(data.revenueExpansion.callout.prefix), calloutY + lineHeight.body);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(data.revenueExpansion.callout.suffix, margin + card.textOffsetX + doc.getTextWidth(data.revenueExpansion.callout.prefix + data.revenueExpansion.callout.highlighted), calloutY + lineHeight.body);

  yPosition += standardBoxHeight + spacing.cardGap;

  // Section 2: Transparency
  const transparencyCardHeight = spacing.boxTopPadding * 7;
  checkBreak(transparencyCardHeight + spacing.sectionGap);
  renderContentCard(doc, margin, yPosition, maxWidth, transparencyCardHeight, PDF_CONFIG.blueBg, PDF_CONFIG.blueBorder);

  // Header with circle icon
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + card.textOffsetX, yPosition + spacing.headerToContent - smallOffset, circleSize.xlarge, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.transparency.title, margin + card.textOffsetX + card.iconOffsetX + smallOffset, yPosition + spacing.headerToContent);

  yPosition += standardBoxHeight + spacing.cardGap;

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  setBodySmallFont(doc);
  doc.text(data.transparency.providesLabel, margin + box.paddingX * 2, yPosition);
  yPosition += box.paddingX;

  doc.setFont("helvetica", "normal");
  data.transparency.features.forEach((feature) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + card.textOffsetX + smallOffset, yPosition - 1, circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(feature, margin + card.textOffsetX + box.paddingX, yPosition);
    yPosition += spacing.cardGap;
  });

  yPosition += spacing.sectionGap + smallOffset;

  // Bottom callout box
  const bottomCalloutHeight = standardBoxHeight + spacing.cardGap;
  checkBreak(bottomCalloutHeight + spacing.sectionGap);
  renderContentCard(doc, margin, yPosition, maxWidth, bottomCalloutHeight, PDF_CONFIG.blueBg, PDF_CONFIG.blueBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize.bodySmall);
  const line1Y = yPosition + spacing.sectionGap + smallOffset;
  doc.text(data.transparency.callout1.prefix, margin + box.paddingX * 2, line1Y);
  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFont("helvetica", "bold");
  doc.text(data.transparency.callout1.highlighted, margin + box.paddingX * 2 + doc.getTextWidth(data.transparency.callout1.prefix), line1Y);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(data.transparency.callout1.suffix, margin + box.paddingX * 2 + doc.getTextWidth(data.transparency.callout1.prefix + data.transparency.callout1.highlighted), line1Y);

  doc.setFont("helvetica", "normal");
  const line2Y = yPosition + spacing.headerToContent;
  doc.text(data.transparency.callout2.prefix, margin + box.paddingX * 2, line2Y);
  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFont("helvetica", "bold");
  doc.text(data.transparency.callout2.highlighted, margin + box.paddingX * 2 + doc.getTextWidth(data.transparency.callout2.prefix), line2Y);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text(data.transparency.callout2.suffix, margin + box.paddingX * 2 + doc.getTextWidth(data.transparency.callout2.prefix + data.transparency.callout2.highlighted), line2Y);

  yPosition += bottomCalloutHeight + spacing.sectionGap;
  return yPosition;
};

/**
 * Render Business Objectives visual
 * Uses PDF_CONFIG defaults for all sizing and spacing - NO hardcoded values
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
  const { box, spacing, circleSize, lineHeight, lineHeightFactor, fontSize, card } = PDF_CONFIG;

  // Page break margin derived from config
  const pageBreakMargin = margin * 2;

  // Helper for page break
  const checkBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Intro box (match Strategy & Approach padded line-by-line rendering)
  checkBreak(pageBreakMargin);

  // Source the intro sentence from the single source of truth (pdfContentProviders)
  const businessObjectivesContent = getCustomVisualContent("businessObjectives");
  const introText =
    businessObjectivesContent[2] ||
    "The next 12 months are focused on completing the MVP for early 2026, validating Hobson in real operational settings, and building the foundations needed for commercial rollout and long-term scale.";

  // Strip any accidental surrounding quotes
  const introSafe = introText.replace(/^"|"$/g, "");

  // Use helper to set font and split text with correct metrics
  const innerTextWidth = maxWidth - box.paddingX * 2;
  const introLines = splitTextWithFont(doc, introSafe, innerTextWidth, "body", false);
  const introLineHeight = lineHeight.body; // explicit, consistent line spacing
  const introHeight = box.paddingTop + introLines.length * introLineHeight + box.paddingBottom;

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textGray);


  let introY = yPosition + box.paddingTop + box.borderRadiusSmall; // baseline offset
  introLines.forEach((line: string) => {
    doc.text(line, margin + box.paddingX, introY);
    introY += introLineHeight;
  });

  yPosition += introHeight + spacing.sectionGap;

  // Top-Level Organisational Goals
  const orgGoalsHeaderY = spacing.titleY + spacing.subtitleToBullets;
  const orgGoalsContentStartY = orgGoalsHeaderY + spacing.cardGap + spacing.cardGap;
  const orgGoalsHeight = spacing.boxTopPadding * 6 + box.borderRadiusSmall;
  checkBreak(orgGoalsHeight + spacing.cardGap);
  
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, orgGoalsHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.emeraldBorder);
  doc.roundedRect(margin, yPosition, maxWidth, orgGoalsHeight, box.borderRadius, box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + card.iconOffsetX, yPosition + orgGoalsHeaderY, circleSize.medium, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Top-Level Organisational Goals", margin + card.textOffsetX, yPosition + orgGoalsHeaderY + box.borderRadiusSmall);
  
  const orgGoals = [
    "Validate Hobson's usefulness and reliability across a broader range of Real Estate operators",
    "Establish a stable, predictable MVP that supports ongoing refinement and automation",
    "Build scalable internal systems for support, onboarding, and data operations",
    "Create a commercial foundation capable of driving paid adoption during 2026-2027"
  ];
  
  let goalY = yPosition + orgGoalsContentStartY;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize.caption);
  orgGoals.forEach((goal) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + box.paddingX + spacing.subtitleToBullets, goalY - 1, circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    const goalLines = doc.splitTextToSize(goal, maxWidth - card.textOffsetX - box.paddingX);
    goalLines.forEach((line: string, idx: number) => {
      doc.text(line, margin + card.textOffsetX, goalY + idx * lineHeight.tight);
    });
    goalY += goalLines.length * lineHeight.tight + box.borderRadiusSmall;
  });
  yPosition += orgGoalsHeight + spacing.cardGap;

  // Mid- to Long-Term Vision
  const visionHeight = spacing.boxTopPadding * 5 + lineHeight.body;
  const visionHeaderY = spacing.titleY + spacing.cardGap;
  const visionContentY = visionHeaderY + spacing.headerToContent - box.borderRadiusSmall;
  checkBreak(visionHeight + spacing.sectionGap);
  
  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, yPosition, maxWidth, visionHeight, box.borderRadius, box.borderRadius, "F");
  
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + card.iconOffsetX, yPosition + visionHeaderY, circleSize.medium, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Mid- to Long-Term Vision (2-3+ Years)", margin + card.textOffsetX, yPosition + spacing.headerToContent);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize.bodySmall);
  doc.setTextColor(...PDF_CONFIG.textGray);
  const visionText = "Hobson will evolve from a retrieval-focused MVP (2026) into a proactive AI assistant replacing manual document work in Real Estate with AI-driven reasoning, delivering instant, traceable answers.";
  const visionLines = doc.splitTextToSize(visionText, maxWidth - box.paddingX - box.paddingX - box.paddingX / 2);
  visionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + box.paddingX + box.borderRadiusSmall, yPosition + visionContentY + idx * lineHeight.body);
  });
  yPosition += visionHeight + spacing.sectionGap;

  // Market Validation Stats
  const statsHeight = spacing.boxTopPadding * 4;
  const statsHeaderY = spacing.titleY + spacing.cardGap;
  const statsValueY = statsHeaderY + spacing.titleY + spacing.cardGap;
  const statsLabelY = statsValueY + card.subtitleGap;
  checkBreak(statsHeight + spacing.sectionGap);
  
  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, statsHeight, box.borderRadius, box.borderRadius, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Market Validation Shows Strong Tailwinds", margin + box.paddingX + box.borderRadiusSmall, yPosition + statsHeaderY);

  const stats = [
    { value: "36.1%", label: "CAGR in AI for Real Estate" },
    { value: "$1.8T", label: "Global market by 2030" },
    { value: "10-20%", label: "Efficiency gains with AI" }
  ];
  
  const statWidth = (maxWidth - box.paddingX - box.paddingX - box.paddingX / 2) / 3;
  stats.forEach((stat, idx) => {
    const xPos = margin + box.paddingX + box.borderRadiusSmall + idx * statWidth;
    doc.setTextColor(...PDF_CONFIG.amber);
    doc.setFontSize(fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, xPos + statWidth / 2, yPosition + statsValueY, { align: "center" });
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption - 1);
    doc.setFont("helvetica", "normal");
    doc.text(stat.label, xPos + statWidth / 2, yPosition + statsLabelY, { align: "center" });
  });
  yPosition += statsHeight + spacing.sectionGap;

  // SMART Objectives Header
  checkBreak(spacing.headerToContent);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Objectives (2025-2027 Timeline)", margin, yPosition);
  yPosition += spacing.headerToContent - spacing.subtitleToBullets;

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

  const colWidth = (maxWidth - spacing.cardGap - box.borderRadiusSmall) / 2;
  const objCardHeight = visionHeight;
  const objHeaderY = spacing.boxTopPadding;
  const objTitleY = objHeaderY + box.borderRadiusSmall;
  const objContentStartY = objTitleY + spacing.boxTopPadding;
  
  // Row 1 - first two objectives
  checkBreak(objCardHeight + objCardHeight + spacing.cardGap + spacing.headerToContent);
  
  // Draw first row (2 cards side by side)
  for (let i = 0; i < 2; i++) {
    const obj = objectives[i];
    const xPos = margin + i * (colWidth + spacing.cardGap + box.borderRadiusSmall);
    
    doc.setFillColor(...obj.bgColor);
    doc.roundedRect(xPos, yPosition, colWidth, objCardHeight, box.borderRadius, box.borderRadius, "F");
    
    doc.setFillColor(...obj.color);
    doc.circle(xPos + box.paddingX + box.borderRadiusSmall, yPosition + objHeaderY, circleSize.medium, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(obj.title, xPos + card.textOffsetX - box.borderRadiusSmall, yPosition + objTitleY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize.caption - 1);
    let itemY = yPosition + objContentStartY;
    obj.items.forEach((item) => {
      doc.setFillColor(...obj.color);
      doc.circle(xPos + box.paddingX + box.borderRadiusSmall, itemY - 1, circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      const itemLines = doc.splitTextToSize(item, colWidth - box.paddingX - box.paddingX - box.paddingX / 2);
      itemLines.forEach((line: string, lineIdx: number) => {
        doc.text(line, xPos + box.paddingX + spacing.cardGap, itemY + lineIdx * lineHeight.tight);
      });
      itemY += itemLines.length * lineHeight.tight + box.borderRadiusSmall;
    });
  }
  yPosition += objCardHeight + spacing.cardGap;

  // Row 2 - second two objectives
  for (let i = 2; i < 4; i++) {
    const obj = objectives[i];
    const xPos = margin + (i - 2) * (colWidth + spacing.cardGap + box.borderRadiusSmall);
    
    doc.setFillColor(...obj.bgColor);
    doc.roundedRect(xPos, yPosition, colWidth, objCardHeight, box.borderRadius, box.borderRadius, "F");
    
    doc.setFillColor(...obj.color);
    doc.circle(xPos + box.paddingX + box.borderRadiusSmall, yPosition + objHeaderY, circleSize.medium, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(obj.title, xPos + card.textOffsetX - box.borderRadiusSmall, yPosition + objTitleY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize.caption - 1);
    let itemY = yPosition + objContentStartY;
    obj.items.forEach((item) => {
      doc.setFillColor(...obj.color);
      doc.circle(xPos + box.paddingX + box.borderRadiusSmall, itemY - 1, circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
      const itemLines = doc.splitTextToSize(item, colWidth - box.paddingX - box.paddingX - box.paddingX / 2);
      itemLines.forEach((line: string, lineIdx: number) => {
        doc.text(line, xPos + box.paddingX + spacing.cardGap, itemY + lineIdx * lineHeight.tight);
      });
      itemY += itemLines.length * lineHeight.tight + box.borderRadiusSmall;
    });
  }
  yPosition += objCardHeight + spacing.sectionGap + spacing.subtitleToBullets;

  // Timeline Progression
  const timelineBoxHeight = statsHeight + lineHeight.body;
  const timelineHeaderY = objTitleY;
  const timelineYearY = timelineHeaderY + spacing.titleY + spacing.cardGap;
  const timelineDescY = timelineYearY + spacing.titleY;
  checkBreak(timelineBoxHeight + spacing.sectionGap);
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, timelineBoxHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, timelineBoxHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Business Objectives Create a Clean Progression", pageWidth / 2, yPosition + timelineHeaderY, { align: "center" });

  const timeline = [
    { year: "2026", desc: "Deliver MVP + expand pilots, validate market" },
    { year: "2027", desc: "Public launch, commercial expansion" },
    { year: "2028+", desc: "Enter Europe and global markets" }
  ];
  
  const timelineWidth = (maxWidth - box.paddingX - box.paddingX - box.paddingX / 2) / 3;
  timeline.forEach((t, idx) => {
    const xPos = margin + box.paddingX + box.borderRadiusSmall + idx * timelineWidth;
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.cardTitle - 1);
    doc.setFont("helvetica", "bold");
    doc.text(t.year, xPos + timelineWidth / 2, yPosition + timelineYearY, { align: "center" });
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption - 1);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(t.desc, timelineWidth - spacing.boxTopPadding);
    descLines.forEach((line: string, lineIdx: number) => {
      doc.text(line, xPos + timelineWidth / 2, yPosition + timelineDescY + lineIdx * lineHeight.tight, { align: "center" });
    });
  });
  yPosition += timelineBoxHeight + spacing.sectionGap;

  // Flow: Prove -> Refine -> Scale -> Commercialise -> Expand
  const flowHeight = spacing.titleY + spacing.cardGap;
  const flowTextY = flowHeight - lineHeight.body;
  checkBreak(flowHeight + spacing.sectionGap);
  
  const flowItems = ["Prove", "Refine", "Scale", "Commercialise", "Expand Globally"];
  const flowItemWidth = (maxWidth - spacing.headerToContent - spacing.boxTopPadding - box.borderRadiusSmall) / flowItems.length;
  
  flowItems.forEach((item, idx) => {
    const xPos = margin + idx * flowItemWidth + idx * spacing.cardGap;
    doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
    doc.roundedRect(xPos, yPosition, flowItemWidth, flowHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(item, xPos + flowItemWidth / 2, yPosition + flowTextY, { align: "center" });
    
    if (idx < flowItems.length - 1) {
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.text("->", xPos + flowItemWidth + 1, yPosition + flowTextY);
    }
  });
  yPosition += flowHeight + spacing.sectionGap + spacing.cardGap;

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

  // Source content from provider
  const techStackData = getTechStackStructuredData();

  // Intro
  doc.setTextColor(...PDF_CONFIG.textGray);
  setBodyFont(doc);
  yPosition = renderSpacedText(
    doc,
    techStackData.intro,
    margin,
    yPosition,
    maxWidth,
    PDF_CONFIG.lineHeight.body
  );
  yPosition += 10;

  // Map color types to PDF_CONFIG colors
  const colorMap: Record<string, { color: [number, number, number]; bgColor: [number, number, number] }> = {
    primary: { color: PDF_CONFIG.primaryColor, bgColor: PDF_CONFIG.primaryBgLight },
    blue: { color: PDF_CONFIG.blue, bgColor: PDF_CONFIG.blueBg },
    emerald: { color: PDF_CONFIG.emerald, bgColor: PDF_CONFIG.emeraldBg },
    amber: { color: PDF_CONFIG.amber, bgColor: PDF_CONFIG.amberBg },
  };

  techStackData.categories.forEach((category) => {
    const colors = colorMap[category.colorType] || colorMap.primary;
    const items = category.items.map(item => `${item.name} - ${item.desc}`);
    // Calculate content height: title + gap + items
    const titleHeight = 10;
    const titleToItemsGap = PDF_CONFIG.spacing.subtitleToBullets;
    const itemsHeight = items.length * PDF_CONFIG.lineHeight.body;
    const contentHeight = titleHeight + titleToItemsGap + itemsHeight;
    
    // Add vertical padding for centering
    const verticalPadding = 8;
    const cardHeight = contentHeight + verticalPadding * 2;
    
    yPosition = checkPageBreak(doc, yPosition, cardHeight + 8, pageHeight, margin);
    
    // Card background
    renderContentCard(doc, margin, yPosition, maxWidth, cardHeight, colors.bgColor, colors.color);
    
    // Left accent
    doc.setFillColor(...colors.color);
    doc.rect(margin, yPosition, 4, cardHeight, "F");

    // Calculate vertical center offset
    const contentStartY = yPosition + verticalPadding;
    
    // Title - centered in top portion
    doc.setTextColor(...colors.color);
    setBodyFont(doc);
    doc.setFont("helvetica", "bold");
    doc.text(category.title, margin + 12, contentStartY + 8);

    // Items - start after title with proper gap
    let itemY = contentStartY + titleHeight + titleToItemsGap;
    setBodySmallFont(doc);
    doc.setFont("helvetica", "normal");
    items.forEach((item) => {
      doc.setFillColor(...colors.color);
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
  doc.text(`Key Features: ${techStackData.keyFeatures.join("  |  ")}`, pageWidth / 2, yPosition + 12, { align: "center" });
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
 * Uses PDF_CONFIG defaults for all sizing and spacing - NO hardcoded values
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
  const { box, spacing, circleSize, lineHeight, fontSize, card } = PDF_CONFIG;

  // Derived values from config
  const pageBreakMargin = margin * 2;
  const smallOffset = box.borderRadiusSmall;
  const standardBoxHeight = box.minHeight + smallOffset;
  const rowHeight = box.minHeight - spacing.boxGap;

  // Helper for page break
  const checkBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Source content from provider - single source of truth
  const data = getHEUPricingStructuredData();

  // Header - The HEU Model
  const headerHeight = standardBoxHeight + spacing.cardGap;
  checkBreak(headerHeight + spacing.sectionGap);
  renderContentCard(doc, margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.primaryBgLight, PDF_CONFIG.primaryLight);

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + box.paddingX + smallOffset, yPosition + headerHeight / 2, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.headerTitle, margin + card.textOffsetX + smallOffset, yPosition + spacing.contentStart + smallOffset);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const pricingIntroY = yPosition + spacing.contentStart + spacing.cardGap + lineHeight.body;
  doc.text(data.headerIntro.prefix, margin + card.textOffsetX + smallOffset, pricingIntroY);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(data.headerIntro.highlighted, margin + card.textOffsetX + smallOffset + doc.getTextWidth(data.headerIntro.prefix), pricingIntroY);
  doc.setFont("helvetica", "normal");

  yPosition += headerHeight + spacing.sectionGap + smallOffset;

  // Section 1: What HEUs Measure
  const heuSectionHeight = standardBoxHeight + spacing.cardGap;
  checkBreak(heuSectionHeight + spacing.sectionGap);
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + box.paddingX, yPosition + lineHeight.body, circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.heuMeasure.title, margin + card.textOffsetX - smallOffset, yPosition + lineHeight.body + smallOffset);
  yPosition += spacing.headerToContent - smallOffset;

  const heuBoxHeight = standardBoxHeight;
  renderContentCard(doc, margin + card.iconOffsetX, yPosition, maxWidth - card.textOffsetX, heuBoxHeight, PDF_CONFIG.blueBg, PDF_CONFIG.blueBorder);

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const heuLines = splitTextWithFont(doc, data.heuMeasure.description, maxWidth - box.paddingX * 5, "bodySmall", false);
  let heuY = yPosition + spacing.contentStart;
  heuLines.forEach((line: string) => {
    doc.text(line, margin + card.textOffsetX - smallOffset, heuY);
    heuY += lineHeight.body;
  });

  yPosition += heuBoxHeight + spacing.sectionGap + smallOffset;

  // Section 2: What Hobson Monetises
  const monetisesGridHeight = (box.minHeight * 2) + spacing.paragraphGap + spacing.cardGap;
  checkBreak(monetisesGridHeight + spacing.sectionGap);
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + box.paddingX, yPosition + lineHeight.body, circleSize.large, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.monetises.title, margin + card.textOffsetX - smallOffset, yPosition + lineHeight.body + smallOffset);
  yPosition += spacing.headerToContent - smallOffset;

  // 2x2 grid - use provider content
  const gridGap = margin + spacing.cardGap;
  const cardWidth = (maxWidth - gridGap) / 2;
  const cardHeight = box.minHeight;
  data.monetises.items.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = margin + card.iconOffsetX + col * (cardWidth + spacing.cardGap);
    const cardY = yPosition + row * (cardHeight + spacing.paragraphGap);

    renderContentCard(doc, cardX, cardY, cardWidth, cardHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(cardX + card.iconOffsetX, cardY + cardHeight / 2, circleSize.small, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize.bodySmall);
    doc.text(sanitizeText(item), cardX + box.paddingX * 2, cardY + cardHeight / 2 + smallOffset);
  });

  yPosition += 2 * (cardHeight + spacing.paragraphGap) + spacing.cardGap;

  // "not headcount" note - use provider content
  const noteHeight = rowHeight;
  renderContentCard(doc, margin + card.iconOffsetX, yPosition, maxWidth - card.textOffsetX, noteHeight, PDF_CONFIG.bgLight, PDF_CONFIG.border);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize.caption);
  doc.text(data.monetises.note.bold, margin + card.textOffsetX - smallOffset, yPosition + spacing.contentStart);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  doc.text(data.monetises.note.suffix, margin + card.textOffsetX - smallOffset + doc.getTextWidth(data.monetises.note.bold + " "), yPosition + spacing.contentStart);

  yPosition += noteHeight + spacing.sectionGap;

  // Key insight box - use provider content
  const insightHeight = standardBoxHeight + spacing.cardGap + 8;
  checkBreak(insightHeight + spacing.sectionGap);
  renderContentCard(doc, margin, yPosition, maxWidth, insightHeight, PDF_CONFIG.amberBg, PDF_CONFIG.amberBorder);

  doc.setFillColor(...PDF_CONFIG.amber);
  const circleY = yPosition + spacing.contentStart + 2;
  doc.circle(margin + card.iconOffsetX, circleY, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setBodySmallFont(doc);
  const insightLines = splitTextWithFont(doc, data.keyInsight, maxWidth - box.paddingX * 4, "bodySmall", false);
  // First line aligned with circle center
  doc.text(insightLines[0] || "", margin + card.textOffsetX - smallOffset, circleY + 1);
  // Second line with larger gap
  if (insightLines[1]) {
    doc.text(insightLines[1], margin + card.textOffsetX - smallOffset, circleY + lineHeight.body + 6);
  }

  yPosition += insightHeight + spacing.sectionGap + smallOffset;

  // Section 3: Pricing Table - use provider content
  const tableRows = 6; // header + 5 data rows
  const tableHeight = tableRows * rowHeight + spacing.sectionGap;
  checkBreak(tableHeight + spacing.sectionGap);
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + box.paddingX, yPosition + lineHeight.body, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  setCardTitleFont(doc);
  doc.text(data.pricingTitle, margin + box.paddingX * 2, yPosition + lineHeight.body + smallOffset);
  yPosition += spacing.headerToContent - smallOffset;

  // Table headers - column widths as proportions of maxWidth
  const colWidths = [
    maxWidth * 0.20,  // Plan
    maxWidth * 0.18,  // Monthly Price
    maxWidth * 0.13,  // HEUs
    maxWidth * 0.41   // Strategic Intent
  ];
  const tableX = margin;

  // Header row
  renderContentCard(doc, tableX, yPosition, maxWidth, rowHeight, PDF_CONFIG.primaryBgMedium, PDF_CONFIG.primaryLight);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize.caption);
  
  let headerX = tableX + spacing.paragraphGap;
  ["Plan", "Monthly Price", "HEUs", "Strategic Intent"].forEach((header, idx) => {
    doc.text(header, headerX, yPosition + spacing.contentStart);
    headerX += colWidths[idx] + spacing.paragraphGap;
  });
  yPosition += rowHeight;

  // Data rows - use provider content
  data.plans.forEach((row, idx) => {
    const bgColor = idx % 2 === 0 ? PDF_CONFIG.bgWhite : PDF_CONFIG.bgLight;
    renderContentCard(doc, tableX, yPosition, maxWidth, rowHeight, bgColor, PDF_CONFIG.border);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize.caption);
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

  yPosition += spacing.sectionGap + smallOffset;

  // Footer - No Fees - use provider content
  const footerHeight = standardBoxHeight;
  checkBreak(footerHeight + spacing.sectionGap);
  renderContentCard(doc, margin, yPosition, maxWidth, footerHeight, PDF_CONFIG.emeraldBg, PDF_CONFIG.emeraldBorder);

  doc.setFillColor(...PDF_CONFIG.emerald);
  const footerCircleX = margin + maxWidth / 2 - box.paddingX * spacing.boxTopPadding;
  doc.circle(footerCircleX, yPosition + footerHeight / 2, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize.body);
  doc.text(data.footer, margin + maxWidth / 2, yPosition + footerHeight / 2 + smallOffset, { align: "center" });

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

  // Header
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("5-Year Revenue Model (2027-2031)", margin, yPosition);
  yPosition += 6;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("Post-pilot commercial launch -> UK scale -> Global expansion -> Stabilised growth", margin, yPosition);
  yPosition += 14;

  // Market Size Basis box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 42, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, 42, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Market Size Basis", margin + 18, yPosition + 12);

  const halfWidth = (maxWidth - 16) / 2;
  // UK Market
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin + 6, yPosition + 18, halfWidth, 18, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("UK Real Estate Businesses", margin + 10, yPosition + 26);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("235,200", margin + 10, yPosition + 34);

  // Global Market
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin + halfWidth + 12, yPosition + 18, halfWidth, 18, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Global Comparable Markets (OECD-aligned)", margin + halfWidth + 16, yPosition + 26);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("~4.23M (18x UK market)", margin + halfWidth + 16, yPosition + 34);
  yPosition += 50;

  // Pricing Plans & ARPU table
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 4, yPosition + 4, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Pricing Plans & ARPU", margin + 12, yPosition + 6);
  yPosition += 14;

  const pricingColWidths = [50, 45, 40];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  let xPos = margin + 4;
  ["Plan", "Monthly Price", "Mix Assumption"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += pricingColWidths[i];
  });
  yPosition += 12;

  const pricingPlans = [
    ["Essential", "GBP 19.50", "60%"],
    ["Essential Plus", "GBP 49.75", "30%"],
    ["Enterprise", "GBP 148.50", "10%"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  pricingPlans.forEach((row, rowIdx) => {
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
      xPos += pricingColWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 6;

  // ARPU summary box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 24, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Blended ARPU (Monthly)", margin + 8, yPosition + 10);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("GBP 41.31", margin + 60, yPosition + 10);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Annual ARPU", margin + 100, yPosition + 10);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("GBP 495.72", margin + 135, yPosition + 10);
  yPosition += 32;

  // UK Market Penetration table
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("UK Market Penetration & Customers", margin, yPosition);
  yPosition += 10;

  const colWidths = [30, 35, 35, 35];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  xPos = margin + 4;
  ["Year", "Penetration", "Customers", "New"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += colWidths[i];
  });
  yPosition += 12;

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
      doc.setTextColor(...(i === 1 ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
      if (i === 1) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(cell, xPos, yPosition + 7);
      xPos += colWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 10;

  // Global Market Penetration table
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Global Market Penetration & Customers", margin, yPosition);
  yPosition += 10;

  const globalColWidths = [30, 35, 35, 35];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  xPos = margin + 4;
  ["Year", "Penetration", "Customers", "New"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += globalColWidths[i];
  });
  yPosition += 12;

  const globalData = [
    ["2028", "0.25%", "10,584", "10,584"],
    ["2029", "0.35%", "14,818", "4,234"],
    ["2030", "0.5%", "21,168", "6,350"],
    ["2031", "0.6%", "25,402", "4,234"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  globalData.forEach((row, rowIdx) => {
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
      xPos += globalColWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 10;

  // Combined Revenue table
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Revenue Projection (ARR)", margin, yPosition);
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
      if (i === 3) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(cell, xPos, yPosition + 7);
      xPos += revColWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 10;

  // Investor Headline Projection box
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 38, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.emeraldBorder);
  doc.roundedRect(margin, yPosition, maxWidth, 38, 3, 3, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Investor Headline Projection", margin + maxWidth / 2, yPosition + 10, { align: "center" });
  
  const headlineYears = ["2027", "2028", "2029", "2030", "2031"];
  const headlineRevenues = ["GBP 1.17M", "GBP 6.71M", "GBP 9.10M", "GBP 12.53M", "GBP 14.92M"];
  const headlineColWidth = (maxWidth - 20) / 5;
  headlineYears.forEach((year, idx) => {
    const hlX = margin + 10 + idx * headlineColWidth;
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(year, hlX, yPosition + 22);
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(headlineRevenues[idx], hlX, yPosition + 32);
  });
  yPosition += 46;

  // Why These Numbers Are Credible
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Why These Numbers Are Credible", margin, yPosition);
  yPosition += 10;

  const credibilityPoints = [
    { title: "Low-Friction Pricing", desc: "Mass-adoption friendly pricing fits SMB + mid-size + enterprise land-and-expand strategy." },
    { title: "No Onboarding Barrier", desc: "Zero integration cost accelerates penetration far faster than traditional PropTech." },
    { title: "Strong, Quantifiable ROI", desc: "20% efficiency gain per admin -> GBP 6,000+ annual saving. ARPU of GBP 495/year makes adoption a 'no brainer'." },
    { title: "AI Category Whitespace", desc: "No global leader in 'AI document intelligence' - Hobson can own the category." },
    { title: "Conservative Assumptions", desc: "Realistic adoption levels for SaaS utility - nowhere near aggressive VC-hype assumptions." },
  ];

  const credColWidth = (maxWidth - 8) / 2;
  const credCardHeight = 30;
  credibilityPoints.forEach((point, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const credX = margin + col * (credColWidth + 8);
    const credY = yPosition + row * (credCardHeight + 6);

    if (credY > pageHeight - 40) { doc.addPage(); yPosition = margin; }

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(credX, credY, credColWidth, credCardHeight, 3, 3, "F");
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
    doc.roundedRect(credX, credY, credColWidth, credCardHeight, 3, 3, "S");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(point.title, credX + 6, credY + 10);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(point.desc, credColWidth - 12);
    descLines.forEach((line: string, lineIdx: number) => {
      doc.text(line, credX + 6, credY + 17 + lineIdx * 4);
    });
  });
  yPosition += Math.ceil(credibilityPoints.length / 2) * (credCardHeight + 6) + 8;

  // Model Summary box
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 52, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, 52, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Model Summary", margin + 8, yPosition + 12);

  const summaryItems = [
    { label: "Market:", value: "UK 235,200 -> Global 4.23M businesses" },
    { label: "ARPU:", value: "GBP 495.72 annually" },
    { label: "UK Penetration:", value: "1.0% -> 2.0% (2027-2031)" },
    { label: "Global Penetration:", value: "0.25% -> 0.6% (2028-2031)" },
    { label: "Revenue Growth:", value: "GBP 1.17M -> GBP 14.92M (2027-2031)" },
  ];

  let summaryY = yPosition + 20;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  summaryItems.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(item.label, margin + 10, summaryY);
    doc.setTextColor(...(item.label === "Revenue Growth:" ? PDF_CONFIG.primaryColor : PDF_CONFIG.textDark));
    doc.setFont("helvetica", "bold");
    doc.text(item.value, margin + 55, summaryY);
    summaryY += 6;
  });
  yPosition += 60;

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
 * Render Financials Executive Summary
 * Provides overview of Hobson's financial profile and key metrics
 */
const renderFinancialsExecutiveSummary = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;

  // Introduction paragraphs
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");

  const introParagraphs = [
    "Hobson's financial profile reflects the creation of a new infrastructure layer for Real Estate operations.",
    "This is not a conventional SaaS growth story. It is the monetisation of unavoidable structural change in one of the world's largest, most document-intensive industries, driven by regulatory escalation, labour scarcity, margin compression, and compounding operational complexity.",
    "The business converts existing, locked-in operating costs into high-margin, recurring revenue, producing a growth model that is both aggressive in trajectory and unusually low in commercial risk.",
    "With a £5M seed round, Hobson funds the full 2026 build year and enters 2027 fully staffed, production-ready, and positioned for rapid commercial expansion. From close to launch, the company becomes cash flow positive quickly, with operating leverage increasing each year as adoption compounds and automation deepens."
  ];

  introParagraphs.forEach((para) => {
    const wrapped = doc.splitTextToSize(para, maxWidth);
    doc.text(wrapped, margin, yPosition, { lineHeightFactor: PDF_CONFIG.lineHeightFactor.body });
    yPosition += wrapped.length * PDF_CONFIG.lineHeight.body + PDF_CONFIG.spacing.paragraphGap;
  });
  yPosition += PDF_CONFIG.spacing.sectionGap;

  // Five-Year Financial Model section
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 70, 4, 4, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Five-Year Financial Model Delivers", margin + 10, yPosition + 12);
  yPosition += 20;

  const metrics = [
    "Revenue growth from £0.708M in 2027 to £100M by 2031",
    "Gross margin ≈90%",
    "EBITDA breakeven above £5M ARR, reached early in the forecast period",
    "Infrastructure-grade unit economics with rapid CAC payback"
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  metrics.forEach((metric) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 14, yPosition - 1, 1.5, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(metric, margin + 20, yPosition);
    yPosition += PDF_CONFIG.lineHeight.body + 2;
  });
  yPosition += 24;

  // Structural Performance section
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 44, 4, 4, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Structural Performance", margin + 10, yPosition + 12);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  
  const structuralText = "This performance is driven by structural market forces, not discretionary software demand. Hobson's usage-based model scales automatically with customer complexity, regulatory burden, and portfolio growth, creating built-in net revenue expansion and durable long-term defensibility.";
  const structuralWrapped = doc.splitTextToSize(structuralText, maxWidth - 20);
  doc.text(structuralWrapped, margin + 10, yPosition + 22, { lineHeightFactor: PDF_CONFIG.lineHeightFactor.body });
  yPosition += 54;

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

  // Target Raise badge
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, 120, 16, 4, 4, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Target Raise: £5M Seed Round", margin + 8, yPosition + 11);
  yPosition += 26;

  // Introduction paragraphs
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");

  const introParagraphs = [
    "This raises funds for the full 2026 build year, supports a strong UK commercial launch in 2027, and establishes Hobson as the category-defining intelligence layer for Real Estate operations.",
    "The £5M raise is calibrated for optimal execution: accelerated product velocity, full go-to-market activation, early enterprise engagement, and controlled international readiness."
  ];

  introParagraphs.forEach((para) => {
    const wrapped = doc.splitTextToSize(para, maxWidth);
    doc.text(wrapped, margin, yPosition, { lineHeightFactor: PDF_CONFIG.lineHeightFactor.body });
    yPosition += wrapped.length * PDF_CONFIG.lineHeight.body + PDF_CONFIG.spacing.paragraphGap;
  });

  // Highlighted box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 14, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("This capital establishes readiness, not loss coverage.", margin + maxWidth / 2, yPosition + 9, { align: "center" });
  yPosition += 22;

  // What the Capital Unlocks
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("What the Capital Unlocks", margin, yPosition);
  yPosition += 12;

  const unlocks = [
    { title: "Foundational Team (from June 2026)", desc: "Core commercial and product leadership ahead of launch." },
    { title: "Production-Ready Platform", desc: "Completion of ingestion engine, AI scaling, UI/UX, quality systems, security hardening, and release engineering." },
    { title: "Go-to-Market Activation", desc: "Brand development, funnel creation, messaging, early campaigns, and systematic conversion of pilots into contracted recurring revenue." }
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
    const descWrapped = doc.splitTextToSize(item.desc, maxWidth - 10);
    doc.text(descWrapped, margin + 10, yPosition);
    yPosition += descWrapped.length * PDF_CONFIG.lineHeight.body + 4;
  });
  yPosition += 8;

  // Use of Funds Table
  if (yPosition > pageHeight - 120) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Use of Funds (planned deployment of £5M)", margin, yPosition);
  yPosition += 12;

  const useOfFunds = [
    { category: "Product & Engineering", allocation: "£2,000,000", description: "Core platform build, data pipelines, reliability/security, roadmap delivery." },
    { category: "Sales & Marketing", allocation: "£1,750,000", description: "Initial GTM engine: sales and marketing hires, marketing foundations, pipeline build." },
    { category: "Operations / G&A", allocation: "£750,000", description: "Finance/legal, customer success coverage, tools, basic corporate infrastructure." },
    { category: "Data / Compliance / Security", allocation: "£250,000", description: "Enterprise readiness: security hardening, policies, light-touch audits." },
    { category: "Contingency", allocation: "£250,000", description: "Execution buffer for hiring delays, timing variance, and unforeseen costs." },
  ];

  // Table header
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 10, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Category", margin + 8, yPosition + 7);
  doc.text("Allocation", margin + 90, yPosition + 7);
  doc.text("Description", margin + 130, yPosition + 7);
  yPosition += 14;

  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  useOfFunds.forEach((item) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.category, margin + 8, yPosition);
    doc.text(item.allocation, margin + 90, yPosition);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    const descWrapped = doc.splitTextToSize(item.description, 55);
    doc.text(descWrapped, margin + 130, yPosition);
    yPosition += Math.max(descWrapped.length * 5, 10);
  });
  yPosition += 6;

  // Total
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Total use of funds", margin + 8, yPosition + 13);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.text("£5,000,000", margin + 90, yPosition + 13);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Sum of allocations above", margin + 130, yPosition + 13);
  yPosition += 28;

  // Burn & Runway Strategy
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Burn & Runway Strategy", margin, yPosition);
  yPosition += 12;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("Burn is planned to be pre-revenue.", margin, yPosition);
  yPosition += 10;

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("The £5M seed round:", margin, yPosition);
  yPosition += 10;

  const burnPoints = [
    "Fully funds the 2026 build year",
    "Positions Hobson to enter 2027 fully staffed and production-ready",
    "Supports aggressive go-to-market execution during launch",
    "Preserves sufficient capital for early international readiness",
  ];

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  burnPoints.forEach((point) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 4, yPosition - 1, 1.5, "F");
    doc.text(point, margin + 10, yPosition);
    yPosition += 7;
  });
  yPosition += 8;

  // Cash flow positive callout
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 14, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("From 2027 onward, Hobson becomes cash flow positive quickly as revenue scales.", margin + maxWidth / 2, yPosition + 9, { align: "center" });
  yPosition += 22;

  return yPosition;
};


/**
 * Render Cost Assumptions visual with standardized fonts
 * Matches CostAssumptionsVisual.tsx - includes all 5 sections
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

  // Section 1: Cost Structure Overview
  doc.setFillColor(250, 245, 255); // purple-50
  doc.roundedRect(margin, yPosition, maxWidth, 58, 3, 3, "F");
  doc.setDrawColor(233, 213, 255); // purple-200
  doc.roundedRect(margin, yPosition, maxWidth, 58, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Cost Structure Overview", margin + 8, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Hobson operates with an ultra-lean cost base due to its architecture:", margin + 8, yPosition + 22);

  const overviewItems = [
    "No office costs",
    "No integration or field-support costs",
    "Minimal onboarding costs (AI-token based)",
    "Core team = 5 roles",
    "Engineering and marketing execution outsourced",
  ];
  let itemY = yPosition + 30;
  overviewItems.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.text("✓", margin + 10, itemY);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 18, itemY);
    itemY += 5.5;
  });
  yPosition += 66;

  // Section 2: Core Team Cost
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(239, 246, 255); // blue-50
  doc.roundedRect(margin, yPosition, maxWidth, 70, 3, 3, "F");
  doc.setDrawColor(191, 219, 254); // blue-200
  doc.roundedRect(margin, yPosition, maxWidth, 70, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Core Team Cost (Fixed Cost Layer)", margin + 8, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Internal headcount (UK-based realistic salaries):", margin + 8, yPosition + 22);

  const teamCosts = [
    { role: "CEO", cost: "GBP 120,000" },
    { role: "Head of Marketing", cost: "GBP 70,000" },
    { role: "Product Owner", cost: "GBP 85,000" },
    { role: "Head of Customer Support", cost: "GBP 55,000" },
    { role: "Head of Sales", cost: "GBP 85,000" },
    { role: "Total Fixed Payroll", cost: "GBP 415,000 / year", bold: true },
  ];

  let teamY = yPosition + 30;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  teamCosts.forEach((item) => {
    if ((item as any).bold) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin + 6, teamY - 4, maxWidth - 12, 8, "F");
    }
    doc.setFont("helvetica", (item as any).bold ? "bold" : "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.role, margin + 10, teamY);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.cost, margin + maxWidth - 50, teamY, { align: "right" });
    teamY += 6;
  });
  yPosition += 78;

  // Section 3: Outsourced Costs
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(255, 251, 235); // amber-50
  doc.roundedRect(margin, yPosition, maxWidth, 66, 3, 3, "F");
  doc.setDrawColor(253, 230, 138); // amber-200
  doc.roundedRect(margin, yPosition, maxWidth, 66, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Outsourced Costs (% of Revenue Layer)", margin + 8, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Used to scale efficiently, predictable for investors.", margin + 8, yPosition + 22);

  const variableCosts = [
    { category: "Engineering (outsourced)", pct: "12%" },
    { category: "Digital Marketing (outsourced)", pct: "8%" },
    { category: "Customer Success", pct: "5%" },
    { category: "Sales / SDR Support", pct: "4%" },
    { category: "General & Admin", pct: "3%" },
    { category: "Total Variable Cost Load", pct: "32%", bold: true },
  ];

  let varY = yPosition + 30;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  variableCosts.forEach((item) => {
    if ((item as any).bold) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin + 6, varY - 4, maxWidth - 12, 8, "F");
    }
    doc.setFont("helvetica", (item as any).bold ? "bold" : "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.category, margin + 10, varY);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(item.pct, margin + maxWidth - 50, varY, { align: "right" });
    varY += 6;
  });
  yPosition += 74;

  // Section 4: AI & Infrastructure Costs
  if (yPosition > pageHeight - 100) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(236, 253, 245); // green-50
  doc.roundedRect(margin, yPosition, maxWidth, 90, 3, 3, "F");
  doc.setDrawColor(167, 243, 208); // green-200
  doc.roundedRect(margin, yPosition, maxWidth, 90, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("AI & Infrastructure Costs (Direct COGS Layer)", margin + 8, yPosition + 12);

  // AI Onboarding Cost table
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("AI Onboarding Cost Per Client (One-Off)", margin + 8, yPosition + 24);

  const onboardingCosts = [
    { type: "Small (5 units)", cost: "$3.70-$3.80" },
    { type: "Medium (100 units)", cost: "$74-$76" },
    { type: "Large (1,000 units)", cost: "$740-$760" },
  ];
  let onboardY = yPosition + 32;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  onboardingCosts.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.type, margin + 12, onboardY);
    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.setFont("helvetica", "bold");
    doc.text(item.cost, margin + 75, onboardY);
    doc.setFont("helvetica", "normal");
    onboardY += 6;
  });

  // Infrastructure Costs table
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Infrastructure Costs (% of revenue)", margin + 8, yPosition + 58);

  const infraCosts = [
    { component: "Document Storage + Vector DB", pct: "4%" },
    { component: "LLM Query API (OpenAI Mini)", pct: "5%" },
    { component: "Knowledge Graph Compute + Retrieval", pct: "2%" },
    { component: "Monitoring + Logging", pct: "1%" },
  ];
  let infraY = yPosition + 66;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  infraCosts.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.component, margin + 12, infraY);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(item.pct, margin + maxWidth - 50, infraY, { align: "right" });
    doc.setFont("helvetica", "normal");
    infraY += 5;
  });
  yPosition += 98;

  // Section 5: Full Cost Structure Summary
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.roundedRect(margin, yPosition, maxWidth, 64, 3, 3, "F");
  doc.setDrawColor(199, 210, 254); // indigo-200
  doc.roundedRect(margin, yPosition, maxWidth, 64, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Full Cost Structure Summary", margin + 8, yPosition + 12);

  const summaryItems = [
    { label: "Fixed Headcount", value: "GBP 415,000 / year" },
    { label: "Variable Ops (outsourced)", value: "32% of revenue" },
    { label: "AI + Infra COGS", value: "12% of revenue" },
    { label: "Onboarding AI Cost", value: "GBP 1-600 per client (tiny)" },
  ];
  let summaryY = yPosition + 22;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  summaryItems.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.label, margin + 10, summaryY);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.value, margin + maxWidth - 50, summaryY, { align: "right" });
    summaryY += 6;
  });

  // Overall Gross Margin box
  doc.setFillColor(238, 242, 255); // indigo-100/50
  doc.roundedRect(margin + 8, yPosition + 46, maxWidth - 16, 14, 2, 2, "F");
  const marginHalfWidth = (maxWidth - 32) / 2;
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("88%", margin + 16 + marginHalfWidth / 2, yPosition + 55, { align: "center" });
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  doc.setFont("helvetica", "normal");
  doc.text("Expected Gross Margin", margin + 16 + marginHalfWidth / 2, yPosition + 60, { align: "center" });

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("40-55%", margin + 24 + marginHalfWidth + marginHalfWidth / 2, yPosition + 55, { align: "center" });
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  doc.setFont("helvetica", "normal");
  doc.text("Net Margin at Scale", margin + 24 + marginHalfWidth + marginHalfWidth / 2, yPosition + 60, { align: "center" });

  yPosition += 72;

  // Investor-friendly note
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 16, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("This is excellent for a SaaS model and very investor friendly.", margin + 8, yPosition + 10);
  yPosition += 22;

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
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
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
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
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

  // CAC Trend Interpretation
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Interpreting the CAC Trend", margin, yPosition);
  yPosition += 10;

  const trendCards = [
    { title: "Early Years (2027-2028): Low CAC", color: PDF_CONFIG.emeraldBg, border: PDF_CONFIG.emerald, items: ["UK-only launch with low marketing intensity", "High volume of early global customers when global market opens in 2028"] },
    { title: "Middle Years (2029-2030): Modest Rise", color: PDF_CONFIG.amberBg, border: PDF_CONFIG.amber, items: ["CAC rises modestly as marketing becomes more competitive globally"] },
    { title: "2031 Spike: Normal for Maturing SaaS", color: [255, 237, 213] as [number, number, number], border: PDF_CONFIG.amber, items: ["Penetration slows -> fewer incremental customers", "Same 12% spend spread across fewer new accounts", "This is normal for SaaS models approaching market saturation"] },
  ];

  trendCards.forEach((card) => {
    if (yPosition > pageHeight - 40) { doc.addPage(); yPosition = margin; }
    const cardHeight = 10 + card.items.length * 6;
    doc.setFillColor(...card.color);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, 3, 3, "F");
    doc.setDrawColor(...card.border);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, margin, yPosition + cardHeight);

    doc.setTextColor(...card.border);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(card.title, margin + 8, yPosition + 8);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    let itemY = yPosition + 16;
    card.items.forEach((item) => {
      doc.text("• " + item, margin + 10, itemY);
      itemY += 6;
    });
    yPosition += cardHeight + 6;
  });
  yPosition += 6;

  // LTV:CAC Analysis with table
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("CAC vs ARPU (LTV Comparison)", margin, yPosition);
  yPosition += 10;

  // ARPU/LTV summary
  const halfWidth = (maxWidth - 10) / 2;
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, halfWidth, 22, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("ARPU", margin + 8, yPosition + 10);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("GBP 495.72 / year", margin + 8, yPosition + 18);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + halfWidth + 10, yPosition, halfWidth, 22, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("LTV (5-year lifetime)", margin + halfWidth + 18, yPosition + 10);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("GBP 2,478.60", margin + halfWidth + 18, yPosition + 18);
  yPosition += 28;

  // LTV:CAC table
  const ltvColWidths = [30, 40, 40, 35];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  xPos = margin + 4;
  ["Year", "CAC", "LTV", "LTV:CAC"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += ltvColWidths[i];
  });
  yPosition += 12;

  const ltvData = [
    ["2027", "GBP 60", "GBP 2,478.60", "41x"],
    ["2028", "GBP 72", "GBP 2,478.60", "34x"],
    ["2029", "GBP 226", "GBP 2,478.60", "11x"],
    ["2030", "GBP 217", "GBP 2,478.60", "11x"],
    ["2031", "GBP 371", "GBP 2,478.60", "7x"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  ltvData.forEach((row, rowIdx) => {
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
      xPos += ltvColWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 6;

  // VC threshold note
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 16, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("VC-attractive threshold is 3x. Your model is far above this at 7x-41x.", margin + 8, yPosition + 10);
  yPosition += 22;

  // CAC Payback Period
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("CAC Payback Period", margin, yPosition);
  yPosition += 6;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Formula: Payback = CAC / Monthly ARPU (GBP 41.31)", margin, yPosition);
  yPosition += 10;

  const paybackColWidths = [30, 40, 50];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  xPos = margin + 4;
  ["Year", "CAC", "Payback (months)"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += paybackColWidths[i];
  });
  yPosition += 12;

  const paybackData = [
    ["2027", "GBP 60", "1.5 months"],
    ["2028", "GBP 72", "1.7 months"],
    ["2029", "GBP 226", "5.5 months"],
    ["2030", "GBP 217", "5.3 months"],
    ["2031", "GBP 371", "9.0 months"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  paybackData.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 2 ? PDF_CONFIG.emerald : PDF_CONFIG.textGray));
      if (i === 2) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(cell, xPos, yPosition + 7);
      xPos += paybackColWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 6;

  // CAC Takeaways
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("CAC Takeaways", margin, yPosition);
  yPosition += 10;

  const takeaways = [
    "All payback periods under 12 months - exceeds VC benchmark",
    "LTV:CAC consistently above 3x threshold (range: 7x-41x)",
    "Rising CAC in later years is normal as market matures",
    "Model remains highly capital-efficient throughout forecast period",
  ];

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  takeaways.forEach((item) => {
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
 * Matches OnboardingCostsVisual.tsx - includes all 4 sections
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

  // Header
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("AI Onboarding Cost Per Client", margin, yPosition);
  yPosition += 6;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("OpenAI 5.1 Mini - Internal Cost Model", margin, yPosition);
  yPosition += 14;

  // Section 1: Document Processing Cost Benchmarks
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 52, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 52, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("1. Document Processing Cost Benchmarks", margin + 18, yPosition + 12);

  const docColWidths = [50, 35, 35, 35];
  let tableY = yPosition + 20;
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin + 6, tableY, maxWidth - 12, 10, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  doc.setFont("helvetica", "bold");
  
  let xPos = margin + 10;
  ["Document Type", "Avg. Cost", "Avg. Tokens", "Time"].forEach((header, i) => {
    doc.text(header, xPos, tableY + 7);
    xPos += docColWidths[i];
  });
  tableY += 10;

  const docData = [
    ["Complex (Lease)", "$0.40", "~600k", "8-9 min"],
    ["Medium (Deed)", "$0.10", "~300k", "2-3 min"],
    ["Simple (Notice)", "$0.02-$0.03", "~50k", "30-60 sec"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  docData.forEach((row) => {
    xPos = margin + 10;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 1 ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
      if (i === 1) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(cell, xPos, tableY + 5);
      xPos += docColWidths[i];
    });
    tableY += 7;
  });
  yPosition += 60;

  // Section 2: Cost Per Unit
  if (yPosition > pageHeight - 80) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 70, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 70, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("2. Cost Per Unit (Space / Asset)", margin + 18, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Each unit typically contains 5 onboarding documents:", margin + 8, yPosition + 24);

  // Doc type badges
  const badges = ["1 Complex", "3 Medium", "2 Simple"];
  let badgeX = margin + 10;
  badges.forEach((badge) => {
    const badgeWidth = doc.getTextWidth(badge) + 8;
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(badgeX, yPosition + 28, badgeWidth, 10, 2, 2, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "bold");
    doc.text(badge, badgeX + 4, yPosition + 35);
    badgeX += badgeWidth + 6;
  });

  // Unit cost summary box
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + 8, yPosition + 44, maxWidth - 16, 20, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Total Onboarding Cost per Unit", margin + maxWidth / 2, yPosition + 52, { align: "center" });
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("$0.74 - $0.76 per unit", margin + maxWidth / 2, yPosition + 60, { align: "center" });
  yPosition += 78;

  // Section 3: Client Onboarding Cost Scenarios
  if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 52, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 52, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("3. Client Onboarding Cost Scenarios", margin + 18, yPosition + 12);

  const clientColWidths = [45, 45, 55];
  tableY = yPosition + 20;
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin + 6, tableY, maxWidth - 12, 10, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  doc.setFont("helvetica", "bold");
  
  xPos = margin + 10;
  ["Client Type", "Units", "Total AI Cost"].forEach((header, i) => {
    doc.text(header, xPos, tableY + 7);
    xPos += clientColWidths[i];
  });
  tableY += 10;

  const clientData = [
    ["Small", "5 units", "$3.70 - $3.80"],
    ["Medium", "100 units", "$74 - $76"],
    ["Large", "1,000 units", "$740 - $760"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  clientData.forEach((row) => {
    xPos = margin + 10;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 2 ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
      if (i === 2) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(cell, xPos, tableY + 5);
      xPos += clientColWidths[i];
    });
    tableY += 7;
  });
  yPosition += 60;

  // Section 4: Strategic Implication
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 66, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, 66, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("4. Strategic Implication", margin + 18, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.text("Hobson Onboarding = Ultra-Low Cost, High Margin", margin + 8, yPosition + 24);

  const strategyItems = [
    "AI ingestion is the only meaningful onboarding cost.",
    "Cost remains well under $1 per unit, even for complex portfolios.",
    "Enables exceptionally high gross margins at scale.",
    "Supports frictionless self-serve onboarding from 2027 onwards.",
  ];

  let stratY = yPosition + 32;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  strategyItems.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.text("✓", margin + 10, stratY);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item, margin + 18, stratY);
    stratY += 6;
  });

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("→ Hobson can acquire and activate clients at extremely low operational cost.", margin + 8, yPosition + 58);
  yPosition += 74;

  return yPosition;
};

/**
 * Render P/L Growth visual with standardized fonts
 * Matches PLGrowthVisual.tsx - includes Cost Structure & Unit Economics section
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

  // Cost Structure & Unit Economics Header
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 3, 3, "S");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Cost Structure & Unit Economics", margin + 18, yPosition + 12);
  yPosition += 28;

  // Fixed Operating Base
  yPosition = checkPageBreak(doc, yPosition, 85, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 82, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 82, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Fixed Operating Base", margin + 18, yPosition + 12);

  let itemY = yPosition + 22;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");

  // Fixed internal team
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Fixed internal team", margin + 8, itemY);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("GBP 415k / year", margin + maxWidth - 60, itemY);
  itemY += 8;

  // Variable outsourced costs
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("Variable outsourced costs", margin + 8, itemY);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("32% of revenue", margin + maxWidth - 60, itemY);
  itemY += 10;

  // Variable cost breakdown
  const variableCosts = [
    { category: "Engineering & Design", percentage: "10-14%" },
    { category: "Marketing Execution", percentage: "5-8%" },
    { category: "Customer Success", percentage: "3-5%" },
    { category: "Sales Commissions", percentage: "3-5%" },
    { category: "G&A", percentage: "2-3%" },
  ];
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.line(margin + 12, itemY - 2, margin + 12, itemY + variableCosts.length * 6);
  variableCosts.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.category, margin + 16, itemY);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.percentage, margin + maxWidth - 60, itemY);
    itemY += 6;
  });
  itemY += 4;

  // AI & COGS
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("AI & infrastructure COGS", margin + 8, itemY);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("~12% of revenue", margin + maxWidth - 60, itemY);
  itemY += 8;

  // Gross margin highlight
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + 6, itemY - 4, maxWidth - 12, 10, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.text("Expected gross margin", margin + 10, itemY + 2);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.text("90%+", margin + maxWidth - 60, itemY + 2);
  yPosition += 90;

  // Onboarding and AI Economics
  yPosition = checkPageBreak(doc, yPosition, 70, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 68, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 68, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Onboarding and AI Economics", margin + 8, yPosition + 12);

  // Processing Cost by Document table
  let tableY = yPosition + 20;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Processing Cost by Document", margin + 8, tableY);
  tableY += 8;

  const processingCosts = [
    { type: "Complex (Leases)", cost: "~$0.40" },
    { type: "Medium (Deeds)", cost: "~$0.10" },
    { type: "Simple (Notices)", cost: "~$0.02-0.03" },
  ];
  doc.setFont("helvetica", "normal");
  processingCosts.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.type, margin + 10, tableY);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.cost, margin + 55, tableY);
    tableY += 6;
  });

  // Onboarding Cost by Customer Size table
  tableY += 4;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("Onboarding Cost by Customer Size", margin + maxWidth / 2, yPosition + 28);

  const onboardingCosts = [
    { size: "Small", cost: "GBP 3-4" },
    { size: "Medium", cost: "GBP 74-76" },
    { size: "Large", cost: "GBP 600-700" },
  ];
  let onboardY = yPosition + 36;
  doc.setFont("helvetica", "normal");
  onboardingCosts.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.size, margin + maxWidth / 2 + 2, onboardY);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.cost, margin + maxWidth / 2 + 40, onboardY);
    onboardY += 6;
  });

  // Ultra-low onboarding highlight
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + 6, yPosition + 56, maxWidth - 12, 10, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  const lowCostText = "Ultra-low onboarding costs enable frictionless scaling.";
  doc.text(lowCostText, margin + maxWidth / 2, yPosition + 62, { align: "center" });
  yPosition += 76;

  // P/L & Profitability Profile
  yPosition = checkPageBreak(doc, yPosition, 55, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 52, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 52, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("P/L & Profitability Profile", margin + 18, yPosition + 12);

  const profitItems = [
    { label: "Infrastructure / COGS", value: "5-10% of revenue" },
    { label: "Operating costs", value: "30-35% early -> ~20% by 2031" },
    { label: "Net profit by 2031", value: "~GBP 4.5M", highlight: true },
    { label: "EBITDA breakeven", value: "ARR > GBP 5M" },
    { label: "Net margins at scale", value: "40-55%", highlight: true },
  ];
  let profitY = yPosition + 22;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  profitItems.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(item.label, margin + 8, profitY);
    if (item.highlight) {
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.setFont("helvetica", "bold");
    } else {
      doc.setTextColor(...PDF_CONFIG.textDark);
    }
    doc.text(item.value, margin + maxWidth - 70, profitY);
    profitY += 6;
  });
  yPosition += 58;

  // Customer Acquisition Economics
  yPosition = checkPageBreak(doc, yPosition, 45, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 42, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 42, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Acquisition Economics", margin + 18, yPosition + 12);

  // 4-column grid for CAC metrics
  const cacMetrics = [
    { label: "CAC Spend", value: "12%", sublabel: "of revenue" },
    { label: "5-Year LTV", value: "GBP 2,478.60", sublabel: "" },
    { label: "LTV : CAC", value: "7x to 41x", sublabel: "" },
    { label: "CAC Payback", value: "1.5-9 mo", sublabel: "" },
  ];
  const cacColWidth = (maxWidth - 30) / 4;
  cacMetrics.forEach((metric, idx) => {
    const xPos = margin + 8 + idx * (cacColWidth + 6);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "normal");
    doc.text(metric.label, xPos, yPosition + 24);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(metric.value, xPos, yPosition + 32);
    if (metric.sublabel) {
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(PDF_CONFIG.fontSize.tiny);
      doc.setFont("helvetica", "normal");
      doc.text(metric.sublabel, xPos, yPosition + 38);
    }
  });
  yPosition += 50;

  // Explainer box
  yPosition = checkPageBreak(doc, yPosition, 35, pageHeight, margin);
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
  yPosition += 38;

  // Note about chart
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "italic");
  const plNoteText = "See the interactive P/L Forecast Chart in the web version. Shows Infrastructure/COGS, Operating Costs, and Net Profit 2027-2031.";
  const wrappedPlNote = doc.splitTextToSize(plNoteText, maxWidth - 12);
  const plNoteLineHeight = PDF_CONFIG.lineHeight.relaxed;
  const plNoteBoxHeight = wrappedPlNote.length * plNoteLineHeight + 12;
  
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, plNoteBoxHeight, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textGray);
  wrappedPlNote.forEach((line: string, idx: number) => {
    doc.text(line, margin + 6, yPosition + 10 + idx * plNoteLineHeight);
  });
  yPosition += plNoteBoxHeight + 6;

  // Key metrics grid - 3 columns
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
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "bold");
    doc.text(metric.label, xPos + colWidth / 2, yPosition + 8, { align: "center" });

    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.text(metric.value, xPos + colWidth / 2, yPosition + 17, { align: "center" });

    doc.setFontSize(PDF_CONFIG.fontSize.tiny);
    doc.setFont("helvetica", "normal");
    doc.text(metric.sublabel, xPos + colWidth / 2, yPosition + 24, { align: "center" });
  });
  yPosition += 34;

  return yPosition;
};

/**
 * Render Revenue Growth visual with standardized fonts
 * Matches RevenueGrowthVisual.tsx - includes Commercial Phases, projections, and assumptions
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

  // Commercial Phases table
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 38, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 38, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Commercial Phases", margin + 8, yPosition + 12);

  const phases = [
    { phase: "2026", focus: "Platform build, pilots, validation" },
    { phase: "2027", focus: "UK commercial launch" },
    { phase: "2028+", focus: "UK scale and global expansion" },
  ];
  let phaseY = yPosition + 22;
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  phases.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(item.phase, margin + 10, phaseY);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(item.focus, margin + 35, phaseY);
    phaseY += 5;
  });
  yPosition += 46;

  // Five-Year Revenue Projection
  yPosition = checkPageBreak(doc, yPosition, 60, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 55, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 55, 3, 3, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Five-Year Revenue Projection", margin + 18, yPosition + 12);

  // Revenue table
  const revenueData = [
    { year: "2027", uk: "GBP 1.17M", global: "-", total: "GBP 1.17M" },
    { year: "2028", uk: "GBP 1.46M", global: "GBP 5.25M", total: "GBP 6.71M" },
    { year: "2029", uk: "GBP 1.75M", global: "GBP 7.35M", total: "GBP 9.10M" },
    { year: "2030", uk: "GBP 2.04M", global: "GBP 10.49M", total: "GBP 12.53M" },
    { year: "2031", uk: "GBP 2.33M", global: "GBP 12.59M", total: "GBP 14.92M" },
  ];

  let tableY = yPosition + 22;
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("Year", margin + 10, tableY);
  doc.text("UK Revenue", margin + 40, tableY);
  doc.text("Global", margin + 80, tableY);
  doc.text("Total", margin + 120, tableY);
  tableY += 6;

  doc.setFont("helvetica", "normal");
  revenueData.forEach((item) => {
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(item.year, margin + 10, tableY);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(item.uk, margin + 40, tableY);
    doc.text(item.global, margin + 80, tableY);
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(item.total, margin + 120, tableY);
    doc.setFont("helvetica", "normal");
    tableY += 5;
  });

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + 6, yPosition + 48, maxWidth - 12, 6, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  doc.text("5-Year CAGR: ~90%", margin + maxWidth / 2, yPosition + 52, { align: "center" });
  yPosition += 62;

  // Market & Revenue Assumptions - 2 columns
  yPosition = checkPageBreak(doc, yPosition, 50, pageHeight, margin);
  const halfWidth = (maxWidth - 6) / 2;

  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, halfWidth, 46, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("UK Market", margin + 18, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("235,200 real estate businesses", margin + 8, yPosition + 22);
  doc.text("Annual efficiency saving: GBP 6,000", margin + 8, yPosition + 28);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("UK TAM: GBP 1.41B | SAM: GBP 917M", margin + 8, yPosition + 40);

  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin + halfWidth + 6, yPosition, halfWidth, 46, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + halfWidth + 16, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Global Market", margin + halfWidth + 24, yPosition + 12);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text("4.23M comparable businesses", margin + halfWidth + 14, yPosition + 24);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.text("Global TAM: GBP 155.6B", margin + halfWidth + 14, yPosition + 34);
  yPosition += 54;

  // Customer ROI highlight
  yPosition = checkPageBreak(doc, yPosition, 18, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, 14, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Customer ROI: ~12x (GBP 6,000 saving vs GBP 495.72)", margin + maxWidth / 2, yPosition + 9, { align: "center" });
  yPosition += 22;

  // Summary Stats - 4 columns
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
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "normal");
    doc.text(stat.label, xPos + colWidth / 2, yPosition + 8, { align: "center" });

    doc.setTextColor(...stat.color);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, xPos + colWidth / 2, yPosition + 20, { align: "center" });
  });
  yPosition += 34;

  // Key Revenue Milestones section
  yPosition = checkPageBreak(doc, yPosition, 50, pageHeight, margin);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 42, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, 42, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Key Revenue Milestones", margin + 8, yPosition + 12);

  const milestones = [
    { year: "2027", desc: "UK commercial launch, first paying customers", color: PDF_CONFIG.amber },
    { year: "2028", desc: "Global expansion begins, revenue accelerates", color: PDF_CONFIG.blue },
    { year: "2031", desc: "~30,000 customers, category leadership", color: PDF_CONFIG.primaryColor },
  ];

  const milestoneColWidth = (maxWidth - 24) / 3;
  milestones.forEach((milestone, idx) => {
    const msX = margin + 8 + idx * (milestoneColWidth + 6);
    doc.setFillColor(...milestone.color);
    doc.circle(msX + 4, yPosition + 24, 2.5, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(milestone.year + ":", msX + 10, yPosition + 26);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(milestone.desc, milestoneColWidth - 16);
    descLines.forEach((line: string, lineIdx: number) => {
      doc.text(line, msX + 10, yPosition + 32 + lineIdx * 5);
    });
  });
  yPosition += 50;

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
  yPosition += 12;

  // Global Expansion section
  if (yPosition > pageHeight - 130) { doc.addPage(); yPosition = margin; }
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Global Expansion (Starting 2028)", margin, yPosition);
  yPosition += 10;

  // Why Global Assumption is Defensible box
  const defensibleBoxHeight = 52;
  doc.setFillColor(220, 252, 231); // light green
  doc.roundedRect(margin, yPosition, maxWidth, defensibleBoxHeight, 3, 3, "F");
  doc.setDrawColor(34, 197, 94); // green border
  doc.roundedRect(margin, yPosition, maxWidth, defensibleBoxHeight, 3, 3, "S");

  doc.setTextColor(21, 128, 61); // green text
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("✔ Same market-share percentages are defensible internationally because:", margin + 8, yPosition + 12);

  const defensiblePoints = [
    "Real estate sectors in US/EU have similar fragmentation",
    "AI adoption rates globally mirror the UK (35-36% CAGR)",
    "The category is globally underserved",
    "No integration required means universal onboarding",
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setTextColor(...PDF_CONFIG.textGray);
  let defY = yPosition + 22;
  defensiblePoints.forEach((point) => {
    doc.text(`• ${point}`, margin + 12, defY);
    defY += 7;
  });
  yPosition += defensibleBoxHeight + 10;

  // Global Expansion table
  if (yPosition > pageHeight - 70) { doc.addPage(); yPosition = margin; }
  const globalColWidths = [30, 30, 30, 60];
  doc.setFillColor(...PDF_CONFIG.headerBg);
  doc.rect(margin, yPosition, maxWidth, 12, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");

  xPos = margin + 4;
  ["Year", "UK", "Global", "Notes"].forEach((header, i) => {
    doc.text(header, xPos, yPosition + 8);
    xPos += globalColWidths[i];
  });
  yPosition += 12;

  const globalData = [
    ["2028", "1.4%", "0.6%", "Launch year; initial adoption"],
    ["2029", "3%", "1.6%", "Growing credibility + referrals"],
    ["2030", "6%", "2-4%", "Mature positioning + brand leadership"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  globalData.forEach((row, rowIdx) => {
    if (yPosition > pageHeight - 25) { doc.addPage(); yPosition = margin; }
    
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...PDF_CONFIG.bgLight);
      doc.rect(margin, yPosition, maxWidth, 10, "F");
    }
    xPos = margin + 4;
    row.forEach((cell, i) => {
      doc.setTextColor(...(i === 1 || i === 2 ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
      if (i === 1 || i === 2) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(cell, xPos, yPosition + 7);
      xPos += globalColWidths[i];
    });
    yPosition += 10;
  });
  yPosition += 10;

  // Market-Share Thoughts / Investor Thesis box
  if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = margin; }
  const thesisBoxHeight = 40;
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, thesisBoxHeight, 3, 3, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.roundedRect(margin, yPosition, maxWidth, thesisBoxHeight, 3, 3, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Market-Share Thoughts", margin + 8, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const thesisText = "Given the category white space, frictionless adoption, strong adoption tailwinds (65% reinvesting in AI), and global expansion from 2028, Hobson can credibly reach 6% UK market share and 2-4% in new international markets by 2030 — achieving 8-10% combined share as category leader.";
  const thesisLines = doc.splitTextToSize(thesisText, maxWidth - 16);
  let thesisY = yPosition + 22;
  thesisLines.forEach((line: string) => {
    doc.text(line, margin + 8, thesisY);
    thesisY += 5.5;
  });
  yPosition += thesisBoxHeight + 8;

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
 * Render PDF provider content as visual cards (used for Marketing Strategy tabs)
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

  const { box, spacing, circleSize, fontSize, lineHeight, card } = PDF_CONFIG;
  
  blocks.forEach((block) => {
    const title = block[0].endsWith(":") ? block[0].slice(0, -1) : block[0];
    const body = block.slice(1);

    const bodyLineHeight = lineHeight.body;
    const bulletTextWidth = maxWidth - spacing.bulletTextOffset - spacing.itemGap;
    const normalTextWidth = maxWidth - card.textOffsetX - spacing.paragraphGap;

    // Measure body height (including wrapping) - use splitTextWithFont for correct metrics
    let measuredLines = 0;
    body.forEach((l) => {
      const isBullet = l.startsWith("-");
      const clean = l.replace(/^[-\s]+/, "");
      const wrapped = splitTextWithFont(doc, clean, isBullet ? bulletTextWidth : normalTextWidth, "body", false);
      measuredLines += Math.max(1, wrapped.length);
      measuredLines += 0.2; // subtle spacing between items
    });

    // Dynamic height so text never overflows the box
    const headerHeight = card.headerHeight + spacing.cardGap; // title row + spacing
    const bottomPadding = box.paddingTop;
    const cardHeight = Math.max(box.minHeight + fontSize.stat, headerHeight + measuredLines * bodyLineHeight + bottomPadding);

    // Page break based on actual card height
    yPosition = checkPageBreak(doc, yPosition, cardHeight + spacing.cardGap, pageHeight, margin);

    // Card background + border
    doc.setFillColor(...theme.bg);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(box.borderWidth);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, box.borderRadius, box.borderRadius, "S");

    // Accent bar
    doc.setFillColor(...theme.accent);
    doc.rect(margin, yPosition, box.borderRadius, cardHeight, "F");

    // Header circle (no number)
    doc.setFillColor(...theme.accent);
    const circleY = yPosition + spacing.itemGap;
    doc.circle(margin + spacing.itemGap, circleY, circleSize.medium, "F");

    // Title
    doc.setTextColor(...PDF_CONFIG.textDark);
    setCardTitleFont(doc);
    doc.text(title, margin + card.textOffsetX + spacing.paragraphGap, yPosition + spacing.contentPadding);

    // Body
    let contentY = yPosition + headerHeight + spacing.cardGap;
    setBodyFont(doc);
    doc.setTextColor(...PDF_CONFIG.textGray);

    body.forEach((l) => {
      const isBullet = l.startsWith("-");
      const clean = l.replace(/^[-\s]+/, "");
      const wrapped = splitTextWithFont(doc, clean, isBullet ? bulletTextWidth : normalTextWidth, "body", false);

      if (isBullet) {
        doc.setFillColor(...theme.accent);
        doc.circle(margin + spacing.itemGap, contentY - circleSize.small, circleSize.small, "F");
        wrapped.forEach((w: string) => {
          doc.text(w, margin + spacing.textIndent, contentY);
          contentY += bodyLineHeight;
        });
        contentY += 1;
      } else {
        wrapped.forEach((w: string) => {
          doc.text(w, margin + box.paddingX, contentY);
          contentY += bodyLineHeight;
        });
        contentY += 1;
      }
    });

    yPosition += cardHeight + spacing.cardGap;
  });

  return yPosition;
};

/**
 * Render Executive Summary visual - matches the UI layout exactly
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
  const { box, spacing, circleSize, fontSize, lineHeight, lineHeightFactor } = PDF_CONFIG;
  const bodyLine = lineHeight.body;

  const data = getExecutiveContextStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Use PDF_CONFIG colors instead of local variables
  const tealAccent = PDF_CONFIG.teal;
  const tealBg = PDF_CONFIG.tealBg;
  const tealBorder = PDF_CONFIG.tealBorder;
  
  const slateBg = PDF_CONFIG.slateBg;
  const slateBorder = PDF_CONFIG.slateBorder;
  
  const redAccent = PDF_CONFIG.red;
  const redBg = PDF_CONFIG.redBg;
  const redBorder = PDF_CONFIG.redBorder;
  
  const amberBg = PDF_CONFIG.amberBg;
  const amberBorder = PDF_CONFIG.amberBorder;

  // 1. Inflexion Point header box - tighter sizing with justified text
  const innerPadding = box.paddingX;
  const innerTextWidth = maxWidth - innerPadding * 2;
  const inflexionLines = splitTextWithFont(doc, data.inflexionPoint, innerTextWidth, "cardTitle", true);
  const inflexionHeight = spacing.boxTopPadding + inflexionLines.length * (bodyLine * lineHeightFactor.tight);
  fitPage(inflexionHeight + spacing.cardGap);

  doc.setFillColor(...tealBg);
  doc.roundedRect(margin, yPosition, maxWidth, inflexionHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...tealBorder);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, inflexionHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.inflexionPoint), margin + innerPadding, yPosition + spacing.boxTopPadding, {
    maxWidth: innerTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.tight,
  });
  yPosition += inflexionHeight + spacing.cardGap;

  let textY = 0;

  // 2. Pressures - 2x2 grid
  fitPage(50);
  const pressureBoxWidth = (maxWidth - spacing.cardGap) / 2;
  const pressureBoxHeight = box.minHeight;
  
  data.pressures.forEach((pressure, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = margin + col * (pressureBoxWidth + spacing.cardGap);
    const y = yPosition + row * (pressureBoxHeight + spacing.boxGap);

    doc.setFillColor(...redBg);
    doc.roundedRect(x, y, pressureBoxWidth, pressureBoxHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    doc.setDrawColor(...redBorder);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(x, y, pressureBoxWidth, pressureBoxHeight, box.borderRadiusSmall, box.borderRadiusSmall, "S");

    // Warning icon (triangle)
    doc.setFillColor(...redAccent);
    doc.circle(x + spacing.circleOffset, y + pressureBoxHeight / 2, circleSize.small, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(pressure), x + spacing.textIndent, y + 11);
  });
  yPosition += (pressureBoxHeight + spacing.boxGap) * 2 + spacing.cardGap;

  // 3. Context paragraph box - tighter with justified text
  const ctxPadding = box.paddingX;
  const ctxTextWidth = maxWidth - ctxPadding * 2;
  const contextLines = splitTextWithFont(doc, data.contextParagraph, ctxTextWidth, "body", false);
  const contextHeight = box.paddingX + contextLines.length * (bodyLine * lineHeightFactor.body);
  fitPage(contextHeight + spacing.cardGap);

  doc.setFillColor(...slateBg);
  doc.roundedRect(margin, yPosition, maxWidth, contextHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...slateBorder);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, contextHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.contextParagraph), margin + ctxPadding, yPosition + box.paddingX, {
    maxWidth: ctxTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.body,
  });
  yPosition += contextHeight + spacing.cardGap;

  // 4. Hobson positioning box (purple themed) - tighter with justified text
  const posPadding = box.paddingX;
  const posTextWidth = maxWidth - posPadding * 2 - spacing.contentPadding; // account for circle
  const posLines = splitTextWithFont(doc, data.hobsonPositioning, posTextWidth, "body", true);
  const posHeight = box.paddingX + posLines.length * (bodyLine * lineHeightFactor.body);
  fitPage(posHeight + spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, posHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, posHeight, box.borderRadius, box.borderRadius, "S");

  // Circle aligned with first line of text
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + spacing.circleOffset, yPosition + spacing.circleOffset, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.hobsonPositioning), margin + spacing.bulletTextOffset, yPosition + box.paddingX, {
    maxWidth: posTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.body,
  });
  yPosition += posHeight + spacing.cardGap;

  // 5. Mission Statement - compact layout with justified text
  const missionPadding = box.paddingX;
  const missionTextWidth = maxWidth - missionPadding * 2;
  const missionContentLines = splitTextWithFont(doc, data.missionStatement.content, missionTextWidth, "body", false);
  const missionBoxHeight = missionContentLines.length * lineHeight.body + box.paddingTop + box.paddingBottom;
  const missionHeaderHeight = spacing.contentBoxStart + spacing.paragraphGap; // Space for title + subtitle + gap before box
  const missionHeight = missionHeaderHeight + missionBoxHeight;
  fitPage(missionHeight + spacing.sectionGap);

  // Header row - title with circle
  doc.setFillColor(...tealAccent);
  doc.circle(margin + spacing.circleOffset, yPosition + spacing.sectionGap, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.missionStatement.title, margin + spacing.bulletTextOffset, yPosition + spacing.sectionGap + fontSize.cardTitle / 3);

  // Subtitle - positioned below title with proper gap
  doc.setTextColor(...tealAccent);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text(data.missionStatement.subtitle, margin + spacing.bulletTextOffset, yPosition + spacing.sectionGap + fontSize.cardTitle + spacing.paragraphGap);

  // Content box - starts below header with gap
  const missionBoxY = yPosition + missionHeaderHeight;
  doc.setFillColor(...tealBg);
  doc.roundedRect(margin, missionBoxY, maxWidth, missionBoxHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...tealBorder);
  doc.setLineWidth(box.borderWidthThin);
  doc.roundedRect(margin, missionBoxY, maxWidth, missionBoxHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.missionStatement.content), margin + missionPadding, missionBoxY + box.paddingTop, {
    maxWidth: missionTextWidth,
    align: PDF_CONFIG.text.align,
    lineHeightFactor: lineHeightFactor.body,
  });
  yPosition = missionBoxY + missionBoxHeight + spacing.sectionGap;

  // 6. Positioning Statement - compact layout with justified text
  const posStmtPadding = box.paddingX;
  const posStmtTextWidth = maxWidth - posStmtPadding * 2;
  const positionContentLines = splitTextWithFont(doc, data.positioningStatement.content, posStmtTextWidth, "body", false);
  const positionBoxHeight = positionContentLines.length * (bodyLine * lineHeightFactor.body) + spacing.cardGap;
  const positionHeight = spacing.contentBoxStart + positionBoxHeight;
  fitPage(positionHeight + spacing.boxGap);

  // Header row
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + spacing.circleOffset, yPosition + spacing.cardGap, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.positioningStatement.title, margin + spacing.bulletTextOffset, yPosition + box.paddingX);

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text(data.positioningStatement.subtitle, margin + spacing.bulletTextOffset, yPosition + spacing.subtitleY);

  // Content box
  const positionBoxY = yPosition + spacing.contentBoxStart;
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, positionBoxY, maxWidth, positionBoxHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidthThin);
  doc.roundedRect(margin, positionBoxY, maxWidth, positionBoxHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.positioningStatement.content), margin + posStmtPadding, positionBoxY + spacing.cardGap, {
    maxWidth: posStmtTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.body,
  });
  yPosition = positionBoxY + positionBoxHeight + spacing.boxToBox;

  // 7. Conclusion box (amber themed) - tighter with justified text
  const concPadding = box.paddingX;
  const concTextWidth = maxWidth - concPadding * 2;
  const conclusionLines = splitTextWithFont(doc, data.conclusion, concTextWidth, "body", false);
  const conclusionHeight = box.paddingX + conclusionLines.length * (bodyLine * lineHeightFactor.body);
  fitPage(conclusionHeight + spacing.cardGap);

  doc.setFillColor(...amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, conclusionHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...amberBorder);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, conclusionHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.conclusion), margin + concPadding, yPosition + box.paddingX, {
    maxWidth: concTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.body,
  });
  yPosition += conclusionHeight + spacing.cardGap;

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
  const { box, spacing, circleSize, fontSize, lineHeight, lineHeightFactor } = PDF_CONFIG;
  const bodyLine = lineHeight.body;

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

  // Use PDF_CONFIG colors
  const tealBg = PDF_CONFIG.tealBg;
  const tealBorder = PDF_CONFIG.tealBorder;
  const tealAccent = PDF_CONFIG.teal;

  const slateBg = PDF_CONFIG.slateBg;
  const slateBorder = PDF_CONFIG.slateBorder;

  // 1. Header box
  const headerHeight = spacing.contentBoxStart + spacing.sectionGap;
  fitPage(headerHeight + spacing.paragraphGap);

  doc.setFillColor(...tealBg);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...tealBorder);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");

  doc.setFillColor(...tealAccent);
  doc.circle(margin + spacing.circleOffset, yPosition + spacing.contentPadding, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + spacing.bulletTextOffset, yPosition + spacing.itemGap);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.header.subtitle), margin + spacing.bulletTextOffset, yPosition + spacing.contentBoxStart);

  yPosition += headerHeight + spacing.paragraphGap;

  // 2. Intro paragraph - tighter with justified text
  const introPadding = box.paddingX;
  const introTextWidth = maxWidth - introPadding * 2;
  const introLines = splitTextWithFont(doc, data.intro, introTextWidth, "body", false);
  const introHeight = box.paddingX + introLines.length * (bodyLine * lineHeightFactor.body);
  fitPage(introHeight + spacing.cardGap);

  doc.setFillColor(...slateBg);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...slateBorder);
  doc.setLineWidth(box.borderWidthThin);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.intro), margin + introPadding, yPosition + box.paddingX, {
    maxWidth: introTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.body,
  });
  let textY = 0;
  yPosition += introHeight + spacing.cardGap;

  // 3. Segments
  data.segments.forEach((segment, idx) => {
    const theme = segmentThemes[idx];

    // Calculate segment card height - use splitTextWithFont for correct metrics
    const descLines = splitTextWithFont(doc, segment.description, maxWidth - spacing.bulletTextOffset, "bodySmall", false);
    const valueLines = splitTextWithFont(doc, segment.hobsonValue, maxWidth - spacing.bulletTextOffset * 2, "bodySmall", true);
    const useCaseHeight = segment.useCases.length * (bodyLine + spacing.paragraphGap / 2);
    const feedbackLines = splitTextWithFont(doc, `Client feedback: "${segment.feedback}"`, maxWidth - spacing.bulletTextOffset, "bodySmall", false);
    
    // Segment height with proper padding for feedback box
    const segmentHeight = spacing.contentBoxStart + lineHeight.loose + descLines.length * bodyLine + spacing.sectionGap + valueLines.length * bodyLine + spacing.boxTopPadding + spacing.sectionGap + useCaseHeight + spacing.sectionGap + feedbackLines.length * bodyLine + box.paddingTop + box.paddingBottom + spacing.sectionGap;
    fitPage(segmentHeight + spacing.sectionGap);

    // Main segment card
    doc.setFillColor(...theme.bg);
    doc.roundedRect(margin, yPosition, maxWidth, segmentHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(box.borderWidth);
    doc.roundedRect(margin, yPosition, maxWidth, segmentHeight, box.borderRadius, box.borderRadius, "S");

    // Segment header - circle aligned with text
    const segmentHeaderY = yPosition + spacing.contentPadding;
    doc.setFillColor(...theme.accent);
    doc.circle(margin + spacing.circleOffset, segmentHeaderY, circleSize.medium, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(`Segment ${segment.id}:`, margin + spacing.bulletTextOffset, segmentHeaderY + 1);

    // Target label in a colored box - centered within box
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    const targetText = `${segment.targetLevel} Target`;
    const targetTextWidth = doc.getTextWidth(targetText);
    const targetBoxPadding = spacing.boxGap;
    const targetBoxWidth = targetTextWidth + targetBoxPadding * 2;
    const targetBoxHeight = lineHeight.body + spacing.boxGap;
    const targetX = margin + spacing.bulletTextOffset + doc.getTextWidth(`Segment ${segment.id}:`) + spacing.cardGap + spacing.paragraphGap;
    const targetBoxY = segmentHeaderY - targetBoxHeight / 2 - 1;
    
    // Draw target box with accent color background
    doc.setFillColor(...theme.accent);
    doc.roundedRect(targetX, targetBoxY, targetBoxWidth, targetBoxHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    
    // Draw target text in white - centered horizontally and vertically
    doc.setTextColor(255, 255, 255);
    const targetTextCenterX = targetX + targetBoxWidth / 2;
    const targetTextCenterY = targetBoxY + targetBoxHeight / 2 + fontSize.bodySmall / 3;
    doc.text(targetText, targetTextCenterX, targetTextCenterY, { align: "center" });

    // Title - positioned below header with proper spacing
    const titleY = segmentHeaderY + lineHeight.body + spacing.boxGap;
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(segment.title), margin + spacing.bulletTextOffset, titleY);

    textY = titleY + lineHeight.body + spacing.boxGap;

    // Description
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    descLines.forEach((line: string) => {
      doc.text(line, margin + box.paddingX, textY);
      textY += bodyLine;
    });
    textY += spacing.boxGap;

    // Hobson value box - left justified text, vertically centered
    const valueBoxY = textY;
    const valueBoxWidth = maxWidth - spacing.bulletTextOffset;
    const valueBoxHeight = valueLines.length * bodyLine + spacing.boxTopPadding;
    const valueBoxX = margin + spacing.paragraphGap;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(valueBoxX, valueBoxY, valueBoxWidth, valueBoxHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(valueBoxX, valueBoxY, valueBoxWidth, valueBoxHeight, box.borderRadiusSmall, box.borderRadiusSmall, "S");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    // Vertically centered, left aligned
    const valueTotalTextHeight = valueLines.length * bodyLine;
    const valueTextStartY = valueBoxY + (valueBoxHeight - valueTotalTextHeight) / 2 + fontSize.bodySmall / 2;
    valueLines.forEach((line: string, lineIdx: number) => {
      doc.text(line, valueBoxX + box.paddingX, valueTextStartY + lineIdx * bodyLine);
    });
    textY = valueBoxY + valueBoxHeight + spacing.sectionGap;

    // Use cases - with more spacing from box above
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    segment.useCases.forEach((useCase) => {
      doc.setFillColor(...theme.accent);
      doc.circle(margin + spacing.sectionGap, textY - circleSize.small, circleSize.small, "F");
      doc.text(sanitizeText(useCase), margin + spacing.textIndent, textY);
      textY += bodyLine + spacing.paragraphGap / 2;
    });
    textY += spacing.paragraphGap;

    // Client feedback - box sized to fit text with proper padding
    const feedbackBoxY = textY;
    const feedbackBoxHeight = feedbackLines.length * bodyLine + box.paddingTop + box.paddingBottom;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + spacing.paragraphGap, feedbackBoxY, maxWidth - spacing.sectionGap, feedbackBoxHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(margin + spacing.paragraphGap, feedbackBoxY, box.borderRadius, feedbackBoxHeight, "F");

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "italic");
    let feedbackTextY = feedbackBoxY + box.paddingTop;
    feedbackLines.forEach((line: string) => {
      doc.text(line, margin + spacing.contentPadding, feedbackTextY);
      feedbackTextY += bodyLine;
    });

    yPosition += segmentHeight + spacing.sectionGap;
  });

  // 4. Targeting Strategy - force new page with proper card layout
  doc.addPage();
  yPosition = margin;
  
  // Header section
  doc.setFillColor(...tealBg);
  const headerBoxHeight = spacing.contentBoxStart + spacing.sectionGap;
  doc.roundedRect(margin, yPosition, maxWidth, headerBoxHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...tealBorder);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerBoxHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setFillColor(...tealAccent);
  doc.circle(margin + spacing.circleOffset, yPosition + spacing.sectionGap, circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Targeting Strategy", margin + spacing.bulletTextOffset, yPosition + spacing.sectionGap + fontSize.cardTitle / 3);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(data.strategyIntro, margin + spacing.bulletTextOffset, yPosition + spacing.sectionGap + fontSize.cardTitle + spacing.paragraphGap);
  
  yPosition += headerBoxHeight + spacing.sectionGap;

  // Strategy items - each in its own styled row
  const segmentCardHeight = lineHeight.body + bodyLine + box.paddingTop + box.paddingBottom;
  data.segments.forEach((segment, idx) => {
    const theme = segmentThemes[idx];
    
    // Segment card background
    doc.setFillColor(...theme.bg);
    doc.roundedRect(margin, yPosition, maxWidth, segmentCardHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(margin, yPosition, maxWidth, segmentCardHeight, box.borderRadiusSmall, box.borderRadiusSmall, "S");
    
    // Circle indicator
    doc.setFillColor(...theme.accent);
    doc.circle(margin + spacing.sectionGap, yPosition + segmentCardHeight / 2, circleSize.small, "F");
    
    // Target level label + Segment label on same line
    const labelY = yPosition + box.paddingTop + fontSize.bodySmall / 2;
    doc.setTextColor(...theme.accent);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(`${segment.targetLevel} Target`, margin + spacing.textIndent, labelY);
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    const targetLabelWidth = doc.getTextWidth(`${segment.targetLevel} Target `);
    doc.text(`Segment ${segment.id}`, margin + spacing.textIndent + targetLabelWidth + spacing.paragraphGap, labelY);
    
    // Reason text on next line
    const reasonY = labelY + lineHeight.body + spacing.paragraphGap;
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(segment.targetReason), margin + spacing.textIndent, reasonY);
    
    yPosition += segmentCardHeight + spacing.paragraphGap;
  });
  
  yPosition += spacing.sectionGap;

  // 5. Summary - tighter with justified text
  const summaryPadding = spacing.circleOffset;
  const summaryTextWidth = maxWidth - summaryPadding * 2;
  const summaryLines = splitTextWithFont(doc, data.summary, summaryTextWidth, "body", false);
  const summaryHeight = spacing.contentBoxStart + summaryLines.length * (bodyLine * lineHeightFactor.body);
  fitPage(summaryHeight + spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin + summaryPadding, yPosition + spacing.itemGap);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.summary), margin + summaryPadding, yPosition + spacing.bulletTextOffset, {
    maxWidth: summaryTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.body,
  });
  yPosition += summaryHeight + spacing.cardGap;

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
  const { box, spacing, circleSize, fontSize, lineHeight, lineHeightFactor } = PDF_CONFIG;
  const bodyLine = lineHeight.body;

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

  // Header - increased height to fit title and subtitle
  const headerHeight = spacing.contentPadding + lineHeight.body + lineHeight.body + spacing.contentPadding;
  fitPage(headerHeight + spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");

  // Circle aligned with title
  const headerCircleY = yPosition + spacing.contentPadding;
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + spacing.circleOffset, headerCircleY, circleSize.medium, "F");

  // Title aligned with circle
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + spacing.bulletTextOffset, headerCircleY + 1);

  // Subtitle below title with tighter spacing
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const subtitleLines = splitTextWithFont(doc, data.header.subtitle, maxWidth - spacing.bulletTextOffset - spacing.circleOffset, "bodySmall", false);
  doc.text(subtitleLines[0] || "", margin + spacing.bulletTextOffset, headerCircleY + lineHeight.body + spacing.boxGap);

  yPosition += headerHeight + spacing.cardGap;

  // Intro - tighter with justified text
  const introPadding = spacing.circleOffset;
  const introTextWidth = maxWidth - introPadding * 2;
  const introLines = splitTextWithFont(doc, data.intro, introTextWidth, "body", false);
  const introHeight = spacing.boxTopPadding + introLines.length * (bodyLine * lineHeightFactor.body);
  fitPage(introHeight + spacing.cardGap);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition, maxWidth, introHeight, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.intro), margin + introPadding, yPosition + spacing.boxTopPadding, {
    maxWidth: introTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.body,
  });
  let textY = 0;
  yPosition += introHeight + spacing.contentPadding;

  yPosition += box.borderRadius; // Extra spacing before persona cards
  // Render each persona
  data.personas.forEach((persona, idx) => {
    const theme = personaThemes[idx];

    // Calculate card height using splitTextWithFont
    const descLines = splitTextWithFont(doc, persona.description, maxWidth - spacing.bulletTextOffset, "bodySmall", false);
    const goalsHeight = persona.goals.length * (bodyLine + 1);
    const frustHeight = persona.frustrations.length * (bodyLine + 1);
    const workflowHeight = persona.workflows.length * (bodyLine + 1);
    const successHeight = persona.success.length * (bodyLine + 1);

    const cardHeight = 36 + descLines.length * bodyLine + box.paddingX + goalsHeight + box.paddingX + frustHeight + box.paddingX + workflowHeight + box.paddingX + successHeight + spacing.itemGap;
    fitPage(cardHeight + box.paddingX);

    // Main card
    doc.setFillColor(...theme.bg);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(box.borderWidth);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, box.borderRadius, box.borderRadius, "S");

    // Header row - align circle with name text
    const circleY = yPosition + spacing.contentPadding;
    doc.setFillColor(...theme.accent);
    doc.circle(margin + spacing.itemGap, circleY, circleSize.medium, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    // Align name text vertically with circle center
    const nameY = circleY + 1;
    doc.text(persona.name, margin + spacing.bulletTextOffset, nameY);

    // Segment badge - centered text, aligned with name
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    const badgeText = persona.segment;
    const badgeTextWidth = doc.getTextWidth(badgeText);
    const badgePadding = spacing.boxGap;
    const badgeWidth = badgeTextWidth + badgePadding * 2;
    const badgeHeight = spacing.circleOffset;
    const badgeX = margin + spacing.bulletTextOffset + doc.getTextWidth(persona.name) + box.paddingX;
    const badgeY = circleY - badgeHeight / 2;
    
    doc.setFillColor(...theme.accent);
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(badgeText, badgeX + badgePadding, badgeY + badgeHeight / 2 + 1);

    // Role - positioned below name with proper spacing
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(persona.role), margin + spacing.bulletTextOffset, circleY + lineHeight.body + 2);

    textY = yPosition + 36;

    // Description
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    descLines.forEach((line: string) => {
      doc.text(line, margin + box.paddingX, textY);
      textY += bodyLine;
    });
    textY += spacing.cardGap;

    // Helper function for sections
    const renderSection = (title: string, items: string[]) => {
      doc.setTextColor(...theme.accent);
      doc.setFontSize(fontSize.bodySmall);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + box.paddingX, textY);
      textY += bodyLine + box.borderRadiusSmall;

      doc.setTextColor(...PDF_CONFIG.textDark);
      doc.setFont("helvetica", "normal");
      items.forEach((item) => {
        doc.setFillColor(...theme.accent);
        doc.circle(margin + spacing.itemGap, textY - 1.5, circleSize.small, "F");
        const itemLines = splitTextWithFont(doc, item, maxWidth - spacing.bulletTextOffset - spacing.cardGap, "bodySmall", false);
        doc.text(itemLines[0] || "", margin + spacing.textIndent, textY);
        textY += bodyLine + 1;
      });
      textY += box.borderRadiusSmall;
    };

    renderSection("Goals", persona.goals);
    renderSection("Frustrations", persona.frustrations);
    renderSection("Workflows", persona.workflows);
    renderSection("Success Looks Like", persona.success);

    yPosition += cardHeight + spacing.cardGap;
  });

  // Summary - tighter layout
  const summaryPadding = box.paddingX;
  const summaryTextWidth = maxWidth - summaryPadding * 2;
  const summaryIntroLines = splitTextWithFont(doc, data.summary.intro, summaryTextWidth, "body", false);
  const conclusionLines = splitTextWithFont(doc, data.summary.conclusion, summaryTextWidth, "body", false);
  const summaryHeight = spacing.contentBoxStart + summaryIntroLines.length * (bodyLine * lineHeightFactor.tight) + data.summary.personas.length * (bodyLine + 1) + spacing.cardGap + conclusionLines.length * (bodyLine * lineHeightFactor.tight) + spacing.boxGap;
  fitPage(summaryHeight + spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin + summaryPadding, yPosition + spacing.circleOffset);

  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.summary.intro), margin + summaryPadding, yPosition + spacing.contentBoxStart, {
    maxWidth: summaryTextWidth,
    lineHeightFactor: lineHeightFactor.tight,
  });
  textY = yPosition + spacing.contentBoxStart + summaryIntroLines.length * (bodyLine * lineHeightFactor.tight) + box.borderRadius;

  data.summary.personas.forEach((p) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${p.name}: `, margin + summaryPadding, textY);
    doc.setFont("helvetica", "normal");
    const insightWidth = summaryTextWidth - doc.getTextWidth(`${p.name}: `);
    const insightLines = splitTextWithFont(doc, p.insight, insightWidth, "body", false);
    doc.text(insightLines[0] || "", margin + summaryPadding + doc.getTextWidth(`${p.name}: `), textY);
    textY += bodyLine + 1;
  });
  textY += box.borderRadius;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.text(sanitizeText(data.summary.conclusion), margin + summaryPadding, textY, {
    maxWidth: summaryTextWidth,
    lineHeightFactor: lineHeightFactor.tight,
  });

  yPosition += summaryHeight + spacing.cardGap;
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
  const { box, spacing, circleSize, fontSize, lineHeight } = PDF_CONFIG;
  const bodyLine = lineHeight.body;

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

  // Header - height includes title + subtitle + padding
  const headerHeight = spacing.contentPadding + lineHeight.body + lineHeight.body + spacing.contentPadding;
  fitPage(headerHeight + spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");

  // Circle aligned with title text baseline
  const headerCircleY = yPosition + spacing.contentPadding;
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + spacing.circleOffset, headerCircleY, circleSize.medium, "F");

  // Title aligned with circle
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + spacing.bulletTextOffset, headerCircleY + 1);

  // Subtitle below title
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.header.subtitle), margin + spacing.bulletTextOffset, headerCircleY + lineHeight.body + spacing.boxGap);

  yPosition += headerHeight + spacing.cardGap;

  // Persona box
  const personaHeight = 32;
  fitPage(personaHeight + spacing.cardGap);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition, maxWidth, personaHeight, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.persona.name} - ${data.persona.role}`, margin + box.paddingX, yPosition + spacing.itemGap);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(`Organisation: ${data.persona.organisation}`, margin + box.paddingX, yPosition + spacing.bulletTextOffset);
  doc.text(`Goal: ${data.persona.primaryGoal}`, margin + box.paddingX, yPosition + 28);

  yPosition += personaHeight + spacing.cardGap;

  // Render stages
  data.stages.forEach((stage, idx) => {
    const color = stageColors[idx % stageColors.length];

    // Calculate stage card height using splitTextWithFont
    const touchpointsHeight = stage.touchpoints.length * (bodyLine + 1);
    const thinksLines = splitTextWithFont(doc, `Thinks: ${stage.thinks}`, maxWidth - spacing.bulletTextOffset, "bodySmall", false);
    const feelsLines = splitTextWithFont(doc, `Feels: ${stage.feels}`, maxWidth - spacing.bulletTextOffset, "bodySmall", false);
    const blocksLines = splitTextWithFont(doc, `Blocks: ${stage.blocks}`, maxWidth - spacing.bulletTextOffset, "bodySmall", false);
    const improvementLines = splitTextWithFont(doc, `Improvement: ${stage.improvement}`, maxWidth - spacing.bulletTextOffset, "bodySmall", false);
    const doesHeight = stage.does.length * (bodyLine + 1);

    const stageHeight = 30 + touchpointsHeight + box.paddingX + thinksLines.length * bodyLine + spacing.boxGap + doesHeight + spacing.boxGap + feelsLines.length * bodyLine + spacing.boxGap + blocksLines.length * bodyLine + spacing.boxGap + improvementLines.length * bodyLine + box.paddingX;
    fitPage(stageHeight + box.paddingX);

    // Stage card
    doc.setFillColor(250, 250, 252);
    doc.roundedRect(margin, yPosition, maxWidth, stageHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition, maxWidth, stageHeight, box.borderRadius, box.borderRadius, "S");

    // Color bar on left
    doc.setFillColor(...color);
    doc.rect(margin, yPosition, spacing.boxGap, stageHeight, "F");

    // Header
    doc.setFillColor(...color);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    const stageBadgeWidth = doc.getTextWidth(stage.stage) + box.paddingX;
    doc.roundedRect(margin + spacing.circleOffset, yPosition + spacing.boxGap, stageBadgeWidth, spacing.circleOffset, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    doc.text(stage.stage, margin + spacing.contentPadding, yPosition + 10.5);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(stage.title), margin + stageBadgeWidth + spacing.bulletTextOffset - spacing.paragraphGap, yPosition + spacing.itemGap);

    let textY = yPosition + 24;

    // Touchpoints
    doc.setTextColor(...color);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text("Touchpoints:", margin + spacing.circleOffset, textY);
    textY += bodyLine;

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    stage.touchpoints.forEach((tp) => {
      doc.setFillColor(...color);
      doc.circle(margin + spacing.contentPadding, textY - 1.5, circleSize.small, "F");
      doc.text(sanitizeText(tp), margin + spacing.bulletTextOffset, textY);
      textY += bodyLine + 1;
    });
    textY += spacing.boxGap;

    // Thinks
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFont("helvetica", "italic");
    thinksLines.forEach((line: string) => {
      doc.text(line, margin + spacing.circleOffset, textY);
      textY += bodyLine;
    });
    textY += box.borderRadiusSmall;

    // Does
    doc.setFont("helvetica", "bold");
    doc.text("Does:", margin + spacing.circleOffset, textY);
    textY += bodyLine;
    doc.setFont("helvetica", "normal");
    stage.does.forEach((d) => {
      doc.text(`- ${sanitizeText(d)}`, margin + spacing.contentPadding, textY);
      textY += bodyLine + 1;
    });
    textY += box.borderRadiusSmall;

    // Feels
    doc.setFont("helvetica", "normal");
    feelsLines.forEach((line: string) => {
      doc.text(line, margin + spacing.circleOffset, textY);
      textY += bodyLine;
    });
    textY += box.borderRadiusSmall;

    // Blocks
    doc.setTextColor(...PDF_CONFIG.rose);
    blocksLines.forEach((line: string) => {
      doc.text(line, margin + spacing.circleOffset, textY);
      textY += bodyLine;
    });
    textY += box.borderRadiusSmall;

    // Improvement
    doc.setTextColor(...PDF_CONFIG.emerald);
    improvementLines.forEach((line: string) => {
      doc.text(line, margin + spacing.circleOffset, textY);
      textY += bodyLine;
    });

    yPosition += stageHeight + spacing.cardGap;
  });

  // Strategic lessons
  const lessonsHeight = spacing.bulletTextOffset + data.strategicLessons.length * (bodyLine + box.borderRadiusSmall);
  fitPage(lessonsHeight + spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, lessonsHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.amberBorder);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, lessonsHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.amber);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Strategic Lessons", margin + box.paddingX, yPosition + spacing.itemGap);

  let textY = yPosition + spacing.bulletTextOffset;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  data.strategicLessons.forEach((lesson) => {
    doc.setFillColor(...PDF_CONFIG.amber);
    doc.circle(margin + spacing.itemGap, textY - 1.5, circleSize.small, "F");
    doc.text(sanitizeText(lesson), margin + spacing.textIndent, textY);
    textY += bodyLine + box.borderRadiusSmall;
  });

  yPosition += lessonsHeight + spacing.cardGap;

  // Summary and conclusion
  const innerPadding = box.paddingX;
  const innerTextWidth = maxWidth - innerPadding * 2;
  const summaryLines = splitTextWithFont(doc, data.summary, innerTextWidth, "body", false);
  const conclusionLines = splitTextWithFont(doc, data.conclusion, innerTextWidth, "body", true);
  const summaryBoxHeight = spacing.bulletTextOffset + summaryLines.length * bodyLine + box.paddingX + conclusionLines.length * bodyLine + box.paddingX;
  fitPage(summaryBoxHeight + spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, summaryBoxHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, summaryBoxHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  textY = yPosition + spacing.circleOffset;
  summaryLines.forEach((line: string) => {
    doc.text(line, margin + innerPadding, textY);
    textY += bodyLine;
  });
  textY += spacing.cardGap;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  conclusionLines.forEach((line: string) => {
    doc.text(line, margin + innerPadding, textY);
    textY += bodyLine;
  });

  yPosition += summaryBoxHeight + spacing.cardGap;
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
  const { box, spacing, circleSize, fontSize, lineHeight, lineHeightFactor } = PDF_CONFIG;
  const bodyLine = lineHeight.body;

  const data = getMarketDescriptionStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // 1. INTRO SECTION (Blue gradient box) - matches visual blue box
  const innerPaddingX = spacing.circleOffset;
  const innerTextWidth = maxWidth - innerPaddingX * 2;
  const introLineSpacing = 5.5; // tighter line spacing
  const introLines = splitTextWithFont(doc, data.header.intro, innerTextWidth, "body", false);
  // Compact box: title area (14) + text lines + small bottom padding (4)
  const headerHeight = spacing.contentPadding + introLines.length * introLineSpacing + spacing.boxGap;
  fitPage(headerHeight + spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.blueBorder);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + innerPaddingX, yPosition + spacing.itemGap);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  let textY = yPosition + spacing.contentBoxStart;

  // Render as a single justified paragraph with tighter line height
  doc.text(sanitizeText(data.header.intro), margin + innerPaddingX, textY, {
    maxWidth: innerTextWidth,
    align: "justify",
    lineHeightFactor: lineHeightFactor.loose,
  });

  yPosition += headerHeight + spacing.cardGap;

  // 2. KEY ACTIONABLE TRENDS SECTION (Slate/gray box) - matches visual slate box
  const trendsIntroLines = splitTextWithFont(doc, data.keyTrends.intro, innerTextWidth, "body", false);
  const trendsConclusionLines = splitTextWithFont(doc, data.keyTrends.conclusion, innerTextWidth, "body", false);
  const trendsItemsHeight = data.keyTrends.items.length * (bodyLine + box.borderRadiusSmall);
  const trendsHeight = 24 + trendsIntroLines.length * bodyLine + spacing.cardGap + trendsItemsHeight + spacing.cardGap + trendsConclusionLines.length * bodyLine + spacing.circleOffset;
  fitPage(trendsHeight + spacing.cardGap);

  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, yPosition, maxWidth, trendsHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, trendsHeight, box.borderRadius, box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + spacing.itemGap, yPosition + spacing.itemGap, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.keyTrends.title), margin + spacing.bulletTextOffset + spacing.paragraphGap, yPosition + spacing.contentPadding);

  textY = yPosition + 26;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  trendsIntroLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === trendsIntroLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });
  textY += spacing.boxGap;

  data.keyTrends.items.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + spacing.contentPadding, textY - 1.5, circleSize.small, "F");
    const itemLines = splitTextWithFont(doc, item, innerTextWidth - spacing.contentPadding, "body", false);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(itemLines[0] || "", margin + spacing.bulletTextOffset, textY);
    textY += bodyLine + box.borderRadiusSmall;
  });
  textY += spacing.boxGap;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "italic");
  trendsConclusionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === trendsConclusionLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });

  yPosition += trendsHeight + box.paddingX;

  // 3. GROWING DEMAND FOR AUTOMATION (Purple box with stats) - matches visual purple box
  const automationIntro = "Automation is no longer optional in property operations. Global research consistently shows that companies adopting AI and automation are outperforming those that do not:";
  const automationIntroLines = splitTextWithFont(doc, automationIntro, innerTextWidth, "body", false);
  const automationConclusion = "Operators increasingly recognise that manual administrative work is not scalable, especially in a market with leaner teams, higher data demands, and greater expectation for operational transparency.";
  const automationConclusionLines = splitTextWithFont(doc, automationConclusion, innerTextWidth, "body", false);
  
  const statRowHeight = 32;
  const automationHeight = 26 + automationIntroLines.length * bodyLine + box.paddingX + statRowHeight * 2 + box.paddingX + automationConclusionLines.length * bodyLine + spacing.circleOffset;
  fitPage(automationHeight + spacing.cardGap);

  // Purple gradient background
  doc.setFillColor(250, 245, 255); // purple-50
  doc.roundedRect(margin, yPosition, maxWidth, automationHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(233, 213, 255); // purple-200
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, automationHeight, box.borderRadius, box.borderRadius, "S");

  doc.setFillColor(147, 51, 234); // purple-600
  doc.circle(margin + spacing.itemGap, yPosition + spacing.itemGap, circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Growing Demand for Automation", margin + spacing.bulletTextOffset + spacing.paragraphGap, yPosition + spacing.contentPadding);

  textY = yPosition + 26;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  automationIntroLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === automationIntroLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });
  textY += spacing.cardGap;

  // Stats grid (2x2)
  const statWidth = (maxWidth - 24) / 2;
  data.marketStats.forEach((stat, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const x = margin + box.paddingX + col * (statWidth + box.paddingX);
    const y = textY + row * (statRowHeight + spacing.boxGap);

    doc.setFillColor(255, 255, 255); // white background
    doc.roundedRect(x, y, statWidth, statRowHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(233, 213, 255); // purple-200
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(x, y, statWidth, statRowHeight, box.borderRadius, box.borderRadius, "S");

    doc.setTextColor(147, 51, 234); // purple-600
    doc.setFontSize(fontSize.stat);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, x + statWidth / 2, y + spacing.itemGap, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(stat.label), x + statWidth / 2, y + spacing.bulletTextOffset, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.text(`Ref: ${stat.source}`, x + statWidth / 2, y + 27, { align: "center" });
  });

  textY += statRowHeight * 2 + spacing.itemGap;
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  automationConclusionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === automationConclusionLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });

  yPosition += automationHeight + box.paddingX;

  // 4. DOCUMENT OVERLOAD SECTION (Amber box) - matches visual amber box
  const docIntroLines = splitTextWithFont(doc, sanitizeText(data.documentOverload.intro), innerTextWidth, "body", false);
  const docConclusionLines = splitTextWithFont(doc, sanitizeText(data.documentOverload.conclusion), innerTextWidth, "body", false);
  const docItemsHeight = data.documentOverload.items.length * (bodyLine + 2);
  const docHeight = 26 + docIntroLines.length * bodyLine + PDF_CONFIG.spacing.sectionGap + docItemsHeight + PDF_CONFIG.spacing.sectionGap + docConclusionLines.length * bodyLine + PDF_CONFIG.box.paddingBottom;
  fitPage(docHeight + PDF_CONFIG.spacing.sectionGap);

  doc.setFillColor(255, 251, 235); // amber-50
  doc.roundedRect(margin, yPosition, maxWidth, docHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(253, 230, 138); // amber-200
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, docHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setFillColor(217, 119, 6); // amber-600
  doc.circle(margin + PDF_CONFIG.spacing.circleOffset + 2, yPosition + PDF_CONFIG.spacing.circleOffset + 2, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.documentOverload.title), margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + PDF_CONFIG.spacing.contentStart + PDF_CONFIG.spacing.sectionGap);

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
  textY += PDF_CONFIG.spacing.paragraphGap;

  data.documentOverload.items.forEach((item) => {
    doc.setFillColor(217, 119, 6); // amber-600
    doc.circle(margin + PDF_CONFIG.spacing.contentPadding, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const itemLines = splitTextWithFont(doc, sanitizeText(item), innerTextWidth - PDF_CONFIG.spacing.contentPadding, "body", false);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(itemLines[0] || "", margin + PDF_CONFIG.spacing.bulletTextOffset, textY);
    textY += bodyLine + 2;
  });
  textY += PDF_CONFIG.spacing.paragraphGap;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "italic");
  docConclusionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === docConclusionLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });

  yPosition += docHeight + PDF_CONFIG.spacing.cardGap;

  // 5. PRESSURE FOR SPEED, COMPLIANCE, ACCURACY (Emerald box) - matches visual emerald box
  const compIntroLines = splitTextWithFont(doc, sanitizeText(data.compliance.intro), innerTextWidth, "body", false);
  const compConclusionLines = splitTextWithFont(doc, sanitizeText(data.compliance.conclusion), innerTextWidth, "body", false);
  const demandsHeight = data.compliance.demands.length * (bodyLine + 2);
  const mustDeliverHeight = data.compliance.mustDeliver.length * (bodyLine + 2);
  const compHeight = 26 + compIntroLines.length * bodyLine + PDF_CONFIG.spacing.sectionGap + 12 + demandsHeight + 12 + 12 + mustDeliverHeight + PDF_CONFIG.spacing.sectionGap + compConclusionLines.length * bodyLine + PDF_CONFIG.box.paddingBottom;
  fitPage(compHeight + PDF_CONFIG.spacing.sectionGap);

  doc.setFillColor(236, 253, 245); // emerald-50
  doc.roundedRect(margin, yPosition, maxWidth, compHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, compHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setFillColor(5, 150, 105); // emerald-600
  doc.circle(margin + PDF_CONFIG.spacing.circleOffset + 2, yPosition + PDF_CONFIG.spacing.circleOffset + 2, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.compliance.title), margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + PDF_CONFIG.spacing.contentStart + PDF_CONFIG.spacing.sectionGap);

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
  textY += PDF_CONFIG.spacing.sectionGap;

  // Regulatory & Investor Demands subheader
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Regulatory & Investor Demands:", margin + PDF_CONFIG.spacing.circleOffset, textY);
  textY += bodyLine + 2;

  doc.setFont("helvetica", "normal");
  data.compliance.demands.forEach((item) => {
    doc.setFillColor(5, 150, 105); // emerald-600
    doc.circle(margin + PDF_CONFIG.spacing.contentPadding, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(sanitizeText(item), margin + PDF_CONFIG.spacing.bulletTextOffset, textY);
    textY += bodyLine + 2;
  });
  textY += PDF_CONFIG.spacing.sectionGap;

  // Organisations Must Deliver subheader
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.text("Organisations Must Deliver:", margin + PDF_CONFIG.spacing.circleOffset, textY);
  textY += bodyLine + 2;

  doc.setFont("helvetica", "normal");
  data.compliance.mustDeliver.forEach((item) => {
    doc.setFillColor(5, 150, 105); // emerald-600
    doc.circle(margin + PDF_CONFIG.spacing.contentPadding, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(sanitizeText(item), margin + PDF_CONFIG.spacing.bulletTextOffset, textY);
    textY += bodyLine + 2;
  });
  textY += PDF_CONFIG.spacing.paragraphGap;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "italic");
  compConclusionLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + innerPaddingX, textY, {
      maxWidth: innerTextWidth,
      align: idx === compConclusionLines.length - 1 ? "left" : "justify",
    });
    textY += bodyLine;
  });

  yPosition += compHeight + PDF_CONFIG.spacing.cardGap;

  // 6. ACTIONABLE INSIGHTS (4 colored cards in 2x2 grid) - matches visual insight cards
  const insightCardWidth = (maxWidth - spacing.cardGap) / 2;
  const insightCardHeight = 48;
  const insights = [
    { title: "Data-Intensive Operations", insight: "Real Estate teams now need tools that turn static documents into usable, queryable information.", color: "blue" },
    { title: "Strategic Automation", insight: "Automation is now a strategic priority, not a future aspiration.", color: "purple" },
    { title: "Document Overload", insight: "AI-driven document interpretation is the only scalable solution to unstructured portfolio data.", color: "amber" },
    { title: "Speed & Compliance", insight: "Speed is no longer a competitive advantage - it is a compliance and credibility requirement.", color: "emerald" },
  ];

  fitPage(insightCardHeight * 2 + spacing.paragraphGap);

  insights.forEach((item, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const x = margin + col * (insightCardWidth + spacing.cardGap);
    const y = yPosition + row * (insightCardHeight + spacing.paragraphGap);

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
    doc.roundedRect(x, y, insightCardWidth, insightCardHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(x, y, insightCardWidth, insightCardHeight, box.borderRadius, box.borderRadius, "S");

    // Circle positioned at top left of card
    const circleY = y + 10;
    const circleX = x + 8;
    doc.setFillColor(...iconColor);
    doc.circle(circleX, circleY, circleSize.medium, "F");

    // "ACTIONABLE INSIGHT" label - positioned to the right of circle with proper gap
    const labelX = circleX + circleSize.medium + 4; // Circle radius + gap
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text("ACTIONABLE INSIGHT", labelX, circleY + 1);

    // Insight text below label - starts from left edge with padding
    const insightTextPadding = 8;
    const insightTextWidth = insightCardWidth - insightTextPadding * 2;
    const insightLines = splitTextWithFont(doc, sanitizeText(item.insight), insightTextWidth, "bodySmall", false);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    let insightY = y + 20; // Fixed position below the label row
    insightLines.forEach((line: string) => {
      doc.text(line, x + insightTextPadding, insightY);
      insightY += bodyLine;
    });
  });

  yPosition += insightCardHeight * 2 + spacing.paragraphGap;

  // 7. WHY THE PROBLEM MATTERS NOW (Red box) - matches visual red box
  const whyNowIntro = "The operational landscape shows a clear convergence of pressures:";
  const whyNowConclusion = "Real estate operators urgently need tools that deliver clarity from complexity, without requiring system overhauls or disruptive implementation.";
  const whyNowIntroLines = splitTextWithFont(doc, sanitizeText(whyNowIntro), innerTextWidth, "body", false);
  const whyNowConclusionLines = splitTextWithFont(doc, sanitizeText(whyNowConclusion), innerTextWidth, "body", false);
  const pressuresGridHeight = Math.ceil(data.convergencePressures.length / 2) * 24;
  const whyNowHeight = 26 + whyNowIntroLines.length * bodyLine + PDF_CONFIG.spacing.sectionGap + pressuresGridHeight + PDF_CONFIG.spacing.cardGap + whyNowConclusionLines.length * bodyLine + PDF_CONFIG.box.paddingBottom;
  fitPage(whyNowHeight + PDF_CONFIG.spacing.sectionGap);

  doc.setFillColor(254, 242, 242); // red-50
  doc.roundedRect(margin, yPosition, maxWidth, whyNowHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(254, 202, 202); // red-200
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, whyNowHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setFillColor(220, 38, 38); // red-600
  doc.circle(margin + PDF_CONFIG.spacing.circleOffset + 2, yPosition + PDF_CONFIG.spacing.circleOffset + 2, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Why the Problem Matters Now", margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + PDF_CONFIG.spacing.contentStart + PDF_CONFIG.spacing.sectionGap);

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
  textY += PDF_CONFIG.spacing.sectionGap;

  // Pressures as numbered grid
  const pressureCardWidth = (maxWidth - 24) / 3;
  data.convergencePressures.forEach((pressure, idx) => {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const x = margin + PDF_CONFIG.spacing.cardGap + 2 + col * (pressureCardWidth + PDF_CONFIG.spacing.paragraphGap);
    const y = textY + row * 22;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, pressureCardWidth, 18, PDF_CONFIG.box.borderRadiusSmall, PDF_CONFIG.box.borderRadiusSmall, "F");
    doc.setDrawColor(254, 202, 202);
    doc.setLineWidth(PDF_CONFIG.box.borderWidthThin);
    doc.roundedRect(x, y, pressureCardWidth, 18, PDF_CONFIG.box.borderRadiusSmall, PDF_CONFIG.box.borderRadiusSmall, "S");

    doc.setTextColor(220, 38, 38); // red-600
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}.`, x + PDF_CONFIG.spacing.paragraphGap, y + 11);

    const pressureLines = splitTextWithFont(doc, sanitizeText(pressure), pressureCardWidth - 18, "caption", false);
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(pressureLines[0] || "", x + PDF_CONFIG.spacing.contentPadding, y + 11);
  });

  textY += pressuresGridHeight + PDF_CONFIG.spacing.sectionGap;
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

  yPosition += whyNowHeight + PDF_CONFIG.spacing.cardGap;

  // 8. HOBSON'S STRATEGIC POSITION - using PDF_CONFIG values
  const conclusionBoxPadding = box.paddingX;
  const conclusionBoxWidth = maxWidth - conclusionBoxPadding * 2;
  const conclusionInnerPadding = box.paddingX * 1.5; // Extra padding for text inside conclusion box
  const conclusionTextWidth = conclusionBoxWidth - conclusionInnerPadding * 2; // Proper inner padding on both sides
  const posIntroLines = splitTextWithFont(doc, sanitizeText(data.hobsonPosition.intro), maxWidth - box.paddingX * 2, "body", false);
  const posConclusionLines = splitTextWithFont(doc, sanitizeText(data.hobsonPosition.conclusion), conclusionTextWidth, "body", false);
  
  // Height calculation with proper padding - include title height
  const titleHeight = fontSize.cardTitle + spacing.sectionGap;
  const conclusionBoxHeight = posConclusionLines.length * bodyLine + box.paddingTop + box.paddingBottom;
  const posHeight = titleHeight + spacing.contentPadding + posIntroLines.length * bodyLine + spacing.sectionGap + conclusionBoxHeight + spacing.paragraphGap;
  fitPage(posHeight + spacing.paragraphGap);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, posHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, posHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Hobson's Strategic Position", margin + box.paddingX, yPosition + spacing.sectionGap + fontSize.cardTitle / 2);

  // Start intro text AFTER title with proper spacing
  textY = yPosition + titleHeight + spacing.contentPadding;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  posIntroLines.forEach((line: string) => {
    doc.text(line, margin + box.paddingX, textY);
    textY += bodyLine;
  });
  textY += spacing.sectionGap;

  // Conclusion in highlighted box with proper padding
  const conclusionBoxY = textY;
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin + conclusionBoxPadding, conclusionBoxY, conclusionBoxWidth, conclusionBoxHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.emeraldBorder);
  doc.setLineWidth(box.borderWidthThin);
  doc.roundedRect(margin + conclusionBoxPadding, conclusionBoxY, conclusionBoxWidth, conclusionBoxHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFont("helvetica", "bold");
  let conclusionTextY = conclusionBoxY + box.paddingTop;
  posConclusionLines.forEach((line: string) => {
    doc.text(line, margin + conclusionBoxPadding + conclusionInnerPadding, conclusionTextY);
    conclusionTextY += bodyLine;
  });

  yPosition += posHeight + spacing.paragraphGap;
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
  const bodyLine = PDF_CONFIG.lineHeight.body; // Use tight 5pt spacing as default

  const data = getCompetitorBenchmarksStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Header - tight spacing using PDF_CONFIG defaults
  const innerPadding = PDF_CONFIG.spacing.cardGap;
  const innerTextWidth = maxWidth - innerPadding * 2;
  const introLines = splitTextWithFont(doc, sanitizeText(data.header.intro), innerTextWidth, "body", false);
  const detailLines = splitTextWithFont(doc, sanitizeText(data.header.detail), innerTextWidth, "body", false);
  // Compact header using tight line heights
  const headerHeight = 22 + introLines.length * bodyLine + 2 + detailLines.length * bodyLine + 4;
  fitPage(headerHeight + PDF_CONFIG.spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.blueBorder);
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + PDF_CONFIG.spacing.circleOffset + 2, yPosition + 11, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + PDF_CONFIG.fontSize.body);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.header.subtitle), margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + 17);

  // Intro paragraph - tight line spacing
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  let introY = yPosition + 24;
  introLines.forEach((line: string) => {
    doc.text(line, margin + innerPadding, introY);
    introY += bodyLine;
  });

  // Detail paragraph - tight spacing
  introY += 2;
  doc.setTextColor(...PDF_CONFIG.textGray);
  detailLines.forEach((line: string) => {
    doc.text(line, margin + innerPadding, introY);
    introY += bodyLine;
  });

  yPosition += headerHeight + PDF_CONFIG.spacing.cardGap;

  // Competitor cards
  let textY = yPosition;
  data.competitors.forEach((competitor) => {
    const personaLines = splitTextWithFont(doc, `Personas: ${sanitizeText(competitor.personas)}`, maxWidth - PDF_CONFIG.card.textOffsetX, "bodySmall", false);
    const seoLines = splitTextWithFont(doc, `SEO: ${sanitizeText(competitor.seo)}`, maxWidth - PDF_CONFIG.card.textOffsetX, "bodySmall", false);
    const socialLines = splitTextWithFont(doc, `Social: ${sanitizeText(competitor.social)}`, maxWidth - PDF_CONFIG.card.textOffsetX, "bodySmall", false);
    const implLines = splitTextWithFont(doc, `Implications: ${sanitizeText(competitor.implications)}`, maxWidth - PDF_CONFIG.card.textOffsetX, "bodySmall", false);

    // Tighter card height calculation
    const sectionGap = 1; // Minimal gap between sections
    const cardHeight = 18 + personaLines.length * bodyLine + sectionGap + seoLines.length * bodyLine + sectionGap + socialLines.length * bodyLine + sectionGap + implLines.length * bodyLine + 4;
    fitPage(cardHeight + 4);

    const isHobson = competitor.isHobson;
    const bgColor = isHobson ? PDF_CONFIG.primaryBgLight : [248, 250, 252] as [number, number, number];
    const borderColor = isHobson ? PDF_CONFIG.primaryLight : [226, 232, 240] as [number, number, number];
    const accentColor = isHobson ? PDF_CONFIG.primaryColor : PDF_CONFIG.blue;

    doc.setFillColor(...bgColor);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(isHobson ? 0.5 : PDF_CONFIG.box.borderWidth);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

    // Name
    doc.setFillColor(...accentColor);
    doc.circle(margin + PDF_CONFIG.spacing.circleOffset + 2, yPosition + 8, PDF_CONFIG.circleSize.medium, "F");

    doc.setTextColor(...(isHobson ? PDF_CONFIG.primaryColor : PDF_CONFIG.textDark));
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(competitor.name, margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + 9);

    textY = yPosition + 16;

    // Personas
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    personaLines.forEach((line: string) => {
      doc.text(line, margin + PDF_CONFIG.box.paddingX, textY);
      textY += bodyLine;
    });
    textY += sectionGap;

    // SEO
    seoLines.forEach((line: string) => {
      doc.text(line, margin + PDF_CONFIG.box.paddingX, textY);
      textY += bodyLine;
    });
    textY += sectionGap;

    // Social
    socialLines.forEach((line: string) => {
      doc.text(line, margin + PDF_CONFIG.box.paddingX, textY);
      textY += bodyLine;
    });
    textY += sectionGap;

    // Implications
    doc.setTextColor(...(isHobson ? PDF_CONFIG.primaryColor : PDF_CONFIG.textGray));
    doc.setFont("helvetica", "italic");
    implLines.forEach((line: string) => {
      doc.text(line, margin + PDF_CONFIG.box.paddingX, textY);
      textY += bodyLine;
    });

    yPosition += cardHeight + 4;
  });

  // Summary - tight spacing using PDF_CONFIG.lineHeight.body
  const summaryPadding = PDF_CONFIG.box.paddingX;
  const summaryTextWidth = maxWidth - summaryPadding * 2;
  const diffLines = splitTextWithFont(doc, `Differentiation: ${sanitizeText(data.summary.differentiation)}`, summaryTextWidth, "body", false);
  const posLines = splitTextWithFont(doc, `Positioning: ${sanitizeText(data.summary.positioning)}`, summaryTextWidth, "body", true);
  // Compact height: header (14) + diff lines + gap (2) + pos lines + bottom padding (4)
  const summaryHeight = 14 + diffLines.length * bodyLine + 2 + posLines.length * bodyLine + 4;
  fitPage(summaryHeight + 4);

  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin + summaryPadding, yPosition + 9);

  textY = yPosition + 16;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  diffLines.forEach((line: string) => {
    doc.text(line, margin + summaryPadding, textY);
    textY += bodyLine;
  });
  textY += 2; // Tight gap between sections

  doc.setFont("helvetica", "bold");
  posLines.forEach((line: string) => {
    doc.text(line, margin + summaryPadding, textY);
    textY += bodyLine;
  });

  yPosition += summaryHeight + 4;
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
  const bodyLine = PDF_CONFIG.lineHeight.body; // Use tight 5pt spacing as default

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

  // Header - properly sized box with intro text
  const innerPadding = 8;
  const innerTextWidth = maxWidth - innerPadding * 2;
  const introText = sanitizeText(data.header.intro);
  const introLines = splitTextWithFont(doc, introText, innerTextWidth, "body", false);
  // Box height: title+subtitle area (24) + intro text + bottom padding (6)
  const headerHeight = 24 + introLines.length * bodyLine + 6;
  fitPage(headerHeight + 12);

  doc.setFillColor(...PDF_CONFIG.blueBg);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.blueBorder);
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + 8, yPosition + 9, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + 16, yPosition + 10);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.header.subtitle), margin + 16, yPosition + 18);

  // Intro text starting below title/subtitle
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  let introY = yPosition + 26;
  introLines.forEach((line: string) => {
    doc.text(line, margin + innerPadding, introY);
    introY += bodyLine;
  });

  let textY = 0;
  yPosition += headerHeight + 10; // Extra spacing after header box

  // Where Customers Research Tools section
  fitPage(12);
  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Where Customers Research Tools", margin, yPosition);
  yPosition += 10; // More spacing after section header

  // Research channels for each persona - tight cards
  data.researchChannels.forEach((persona, idx) => {
    const colors = personaColors[idx];
    const channelsHeight = persona.channels.length * (bodyLine + 1);
    const cardHeight = 18 + channelsHeight + 4;
    fitPage(cardHeight + 4);

    doc.setFillColor(...colors.bg);
    doc.roundedRect(margin, yPosition, maxWidth, cardHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");

    // Persona initial circle
    doc.setFillColor(...colors.accent);
    doc.circle(margin + 8, yPosition + 9, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(persona.persona.charAt(0), margin + 6, yPosition + 10);

    // Persona name and role
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
    doc.setFont("helvetica", "bold");
    doc.text(persona.persona, margin + 16, yPosition + 9);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(persona.role), margin + 16, yPosition + 16);

    textY = yPosition + 22;
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    persona.channels.forEach((channel) => {
      doc.setFillColor(...colors.accent);
      doc.circle(margin + 8, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
      const channelLines = splitTextWithFont(doc, sanitizeText(channel), maxWidth - 20, "bodySmall", false);
      doc.text(channelLines[0] || "", margin + 14, textY);
      textY += bodyLine + 1;
    });

    yPosition += cardHeight + 4;
  });

  // What Content They Trust section
  // Calculate total height needed for entire section upfront
  const trustCardWidth = (maxWidth - PDF_CONFIG.spacing.cardGap) / 2;
  const trustCardHeight = 32;
  const totalTrustRows = Math.ceil(data.trustedContent.length / 2);
  const totalTrustSectionHeight = PDF_CONFIG.spacing.cardGap + PDF_CONFIG.spacing.circleOffset + 
    totalTrustRows * (trustCardHeight + PDF_CONFIG.spacing.paragraphGap) + PDF_CONFIG.spacing.cardGap;
  fitPage(totalTrustSectionHeight);

  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("What Content They Trust", margin, yPosition);
  yPosition += PDF_CONFIG.spacing.cardGap;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Across all personas, the content that builds trust is:", margin, yPosition);
  yPosition += PDF_CONFIG.spacing.circleOffset;

  // Trust content cards (2 column grid) - render all at once since we reserved space
  const trustStartY = yPosition;
  data.trustedContent.forEach((item, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;

    const x = margin + col * (trustCardWidth + PDF_CONFIG.spacing.cardGap);
    const y = trustStartY + row * (trustCardHeight + PDF_CONFIG.spacing.paragraphGap);

    doc.setFillColor(...PDF_CONFIG.emeraldBg);
    doc.roundedRect(x, y, trustCardWidth, trustCardHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");

    doc.setTextColor(...PDF_CONFIG.emerald);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(item.title), x + PDF_CONFIG.spacing.sectionGap, y + PDF_CONFIG.spacing.circleOffset);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, sanitizeText(item.description), trustCardWidth - PDF_CONFIG.spacing.circleOffset - 2, "caption", false);
    doc.text(descLines.slice(0, 2), x + PDF_CONFIG.spacing.sectionGap, y + PDF_CONFIG.spacing.textIndent);
  });

  yPosition = trustStartY + totalTrustRows * (trustCardHeight + PDF_CONFIG.spacing.paragraphGap) + PDF_CONFIG.spacing.cardGap;

  // How Customers Evaluate AI Solutions section
  // Calculate total height needed for entire section
  const evalCardHeight = 30;
  const totalEvalRows = Math.ceil(data.evaluationCriteria.length / 2);
  const totalEvalSectionHeight = PDF_CONFIG.spacing.circleOffset + 2 + totalEvalRows * (evalCardHeight + PDF_CONFIG.spacing.paragraphGap);
  fitPage(totalEvalSectionHeight);

  doc.setTextColor(...PDF_CONFIG.amber);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("How Customers Evaluate AI Solutions", margin, yPosition);
  yPosition += PDF_CONFIG.spacing.circleOffset;

  // Evaluation criteria cards (2 column grid)
  const evalCardWidth = (maxWidth - PDF_CONFIG.spacing.cardGap) / 2;

  data.evaluationCriteria.forEach((item, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;

    if (col === 0) {
      fitPage(evalCardHeight + PDF_CONFIG.spacing.paragraphGap);
    }

    const x = margin + col * (evalCardWidth + PDF_CONFIG.spacing.cardGap);
    const y = yPosition + row * (evalCardHeight + PDF_CONFIG.spacing.paragraphGap);

    doc.setFillColor(...PDF_CONFIG.amberBg);
    doc.roundedRect(x, y, evalCardWidth, evalCardHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");

    doc.setTextColor(...PDF_CONFIG.amber);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(item.title), x + PDF_CONFIG.spacing.sectionGap, y + PDF_CONFIG.spacing.circleOffset);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, sanitizeText(item.description), evalCardWidth - PDF_CONFIG.spacing.circleOffset - 2, "caption", false);
    doc.text(descLines.slice(0, 2), x + PDF_CONFIG.spacing.sectionGap, y + PDF_CONFIG.spacing.textIndent);
  });

  yPosition += Math.ceil(data.evaluationCriteria.length / 2) * (evalCardHeight + PDF_CONFIG.spacing.paragraphGap) + PDF_CONFIG.spacing.cardGap;

  // What Triggers Distrust section - tight bullet spacing
  const bulletSpacing = bodyLine; // 5pt per bullet - tight
  const distrustHeight = 14 + data.distrustTriggers.length * bulletSpacing + 2;
  fitPage(distrustHeight + 4);

  doc.setFillColor(...PDF_CONFIG.roseBg);
  doc.roundedRect(margin, yPosition, maxWidth, distrustHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.roseBorder);
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, distrustHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.rose);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("What Triggers Distrust or Hesitation", margin + 8, yPosition + 9);

  textY = yPosition + 16;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  data.distrustTriggers.forEach((trigger) => {
    doc.setFillColor(...PDF_CONFIG.rose);
    doc.circle(margin + 8, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const triggerLines = splitTextWithFont(doc, sanitizeText(trigger), maxWidth - 20, "bodySmall", false);
    doc.text(triggerLines[0] || "", margin + 14, textY);
    textY += bulletSpacing;
  });

  yPosition += distrustHeight + 10; // Extra spacing after distrust box

  // Channel Strategy Summary section
  fitPage(PDF_CONFIG.card.textOffsetX);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("How These Behaviours Shape Hobson's Channel Strategy", margin, yPosition);
  yPosition += PDF_CONFIG.spacing.circleOffset;

  data.channelStrategySummary.forEach((item, idx) => {
    const insightLines = splitTextWithFont(doc, `${item.channel}: ${sanitizeText(item.insight)}`, maxWidth - 24, "body", false);
    const itemHeight = PDF_CONFIG.spacing.cardGap + 2 + insightLines.length * bodyLine;
    fitPage(itemHeight + PDF_CONFIG.spacing.paragraphGap);

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(margin, yPosition, maxWidth, itemHeight, PDF_CONFIG.box.borderRadiusSmall, PDF_CONFIG.box.borderRadiusSmall, "F");

    // Number badge
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + PDF_CONFIG.spacing.circleOffset, yPosition + itemHeight / 2, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}`, margin + PDF_CONFIG.spacing.cardGap + 2, yPosition + itemHeight / 2 + PDF_CONFIG.spacing.itemGap);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.body);
    doc.setFont("helvetica", "normal");
    let lineY = yPosition + PDF_CONFIG.spacing.sectionGap;
    insightLines.forEach((line: string) => {
      doc.text(line, margin + PDF_CONFIG.card.textOffsetX, lineY);
      lineY += bodyLine;
    });

    yPosition += itemHeight + PDF_CONFIG.spacing.paragraphGap;
  });

  yPosition += PDF_CONFIG.spacing.paragraphGap;

  // Conclusion
  const conclusionLines = splitTextWithFont(doc, sanitizeText(data.conclusion), maxWidth - 16, "body", true);
  const conclusionHeight = PDF_CONFIG.spacing.circleOffset + 2 + conclusionLines.length * bodyLine;
  fitPage(conclusionHeight + PDF_CONFIG.spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, conclusionHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, conclusionHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  textY = yPosition + PDF_CONFIG.spacing.cardGap + 2;
  conclusionLines.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.spacing.cardGap + 2, textY);
    textY += bodyLine;
  });

  yPosition += conclusionHeight + PDF_CONFIG.spacing.cardGap;
  return yPosition;
};

/**
 * Render Brand Integrity, Perception & Positioning visual
 * Uses structured data from provider - no hardcoded content
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

  // Source content from provider
  const data = getBrandIntegrityStructuredData();

  const bodyLine = PDF_CONFIG.lineHeight.body;
  const smallLine = PDF_CONFIG.lineHeight.tight;

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  const measureWrappedLines = (text: string, width: number, fontStyle: FontStyle = "body", bold: boolean = false): string[] =>
    splitTextWithFont(doc, sanitizeText(text), width, fontStyle, bold);

  // -------- Brand Summary --------
  const summaryLines = measureWrappedLines(data.summaryText, maxWidth - 20);
  const nextPhaseGap = 8; // Gap between paragraph and bullet points

  const summaryHeight =
    32 + summaryLines.length * bodyLine + nextPhaseGap + data.nextPhase.length * (smallLine + 3) + 12;
  fitPage(summaryHeight + PDF_CONFIG.spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(PDF_CONFIG.box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + PDF_CONFIG.spacing.contentPadding, yPosition + PDF_CONFIG.spacing.contentPadding, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Summary", margin + 24, yPosition + 16);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Clear, Coherent, and Authentic Brand Foundation", margin + 24, yPosition + 26);

  // Main paragraph text
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  let textY = yPosition + 38;
  summaryLines.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.box.paddingX, textY);
    textY += bodyLine;
  });

  // Add gap before bullet points
  textY += nextPhaseGap;

  // Bullet point items
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  data.nextPhase.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + PDF_CONFIG.spacing.circleOffset + 2, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    const wrapped = measureWrappedLines(item, maxWidth - 30, "bodySmall", false);
    wrapped.forEach((w: string) => {
      doc.text(w, margin + PDF_CONFIG.spacing.textIndent, textY);
      textY += smallLine;
    });
    textY += 3;
  });

  yPosition += summaryHeight + PDF_CONFIG.spacing.cardGap;

  // -------- Brand Background --------
  const purpleBg = PDF_CONFIG.primaryBgLight;
  const purpleBorder = PDF_CONFIG.primaryBorder;

  const bgLines = measureWrappedLines(data.brandBackground.description, maxWidth - 16);

  const archetypeRowHeight = 30;
  const backgroundHeight = PDF_CONFIG.card.textOffsetX + 2 + bgLines.length * bodyLine + archetypeRowHeight + PDF_CONFIG.card.headerHeight;
  fitPage(backgroundHeight + PDF_CONFIG.spacing.cardGap);

  doc.setFillColor(...purpleBg);
  doc.roundedRect(margin, yPosition, maxWidth, backgroundHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...purpleBorder);
  doc.roundedRect(margin, yPosition, maxWidth, backgroundHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + PDF_CONFIG.spacing.contentPadding, yPosition + PDF_CONFIG.spacing.contentPadding, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Background", margin + 24, yPosition + 16);

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  textY = yPosition + 28;
  bgLines.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.box.paddingX, textY);
    textY += bodyLine;
  });

  // Archetypes row
  const archTop = textY + PDF_CONFIG.spacing.sectionGap;
  const archWidth = (maxWidth - 24) / 3;
  data.brandBackground.archetypes.forEach((arch, idx) => {
    const xPos = margin + PDF_CONFIG.box.paddingX + idx * (archWidth + PDF_CONFIG.spacing.paragraphGap);
    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.roundedRect(xPos, archTop, archWidth, 24, PDF_CONFIG.box.borderRadiusSmall, PDF_CONFIG.box.borderRadiusSmall, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(arch.trait.toUpperCase(), xPos + PDF_CONFIG.spacing.paragraphGap, archTop + PDF_CONFIG.box.paddingX);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.text(arch.name, xPos + PDF_CONFIG.spacing.paragraphGap, archTop + 15);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(arch.desc, xPos + PDF_CONFIG.spacing.paragraphGap, archTop + 21);
  });

  yPosition += backgroundHeight + PDF_CONFIG.spacing.cardGap;

  // -------- Strengths & Weaknesses --------
  fitPage(90);
  const colWidth = (maxWidth - PDF_CONFIG.spacing.cardGap) / 2;

  const emeraldBg = PDF_CONFIG.emeraldBg;
  const emeraldBorder = PDF_CONFIG.emeraldBorder;
  const amberBg = PDF_CONFIG.amberBg;
  const amberBorder = PDF_CONFIG.amberBorder;

  const calcListHeight = (items: string[], width: number) => {
    let lines = 0;
    items.forEach((it) => {
      lines += Math.max(1, splitTextWithFont(doc, sanitizeText(it), width, "bodySmall", false).length);
      lines += 0.2;
    });
    return PDF_CONFIG.card.textOffsetX + 2 + lines * smallLine + PDF_CONFIG.spacing.circleOffset;
  };

  const strengthsHeight = calcListHeight(data.strengths, colWidth - PDF_CONFIG.card.textOffsetX);
  const weaknessesHeight = calcListHeight(data.weaknesses, colWidth - PDF_CONFIG.card.textOffsetX);
  const swHeight = Math.max(strengthsHeight, weaknessesHeight);
  fitPage(swHeight + PDF_CONFIG.spacing.cardGap);

  // Strengths
  doc.setFillColor(...emeraldBg);
  doc.roundedRect(margin, yPosition, colWidth, swHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...emeraldBorder);
  doc.roundedRect(margin, yPosition, colWidth, swHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + PDF_CONFIG.spacing.circleOffset + 2, yPosition + PDF_CONFIG.spacing.circleOffset + 2, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Strengths", margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + PDF_CONFIG.spacing.contentPadding);

  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  textY = yPosition + PDF_CONFIG.card.headerHeight + PDF_CONFIG.spacing.cardGap;
  data.strengths.forEach((it) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + PDF_CONFIG.box.paddingX, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const wrapped = splitTextWithFont(doc, sanitizeText(it), colWidth - PDF_CONFIG.card.textOffsetX, "bodySmall", false);
    wrapped.forEach((w: string) => {
      doc.text(w, margin + PDF_CONFIG.spacing.contentPadding, textY);
      textY += smallLine;
    });
    textY += 1;
  });

  // Weaknesses
  const wx = margin + colWidth + PDF_CONFIG.spacing.cardGap;
  doc.setFillColor(...amberBg);
  doc.roundedRect(wx, yPosition, colWidth, swHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...amberBorder);
  doc.roundedRect(wx, yPosition, colWidth, swHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(wx + PDF_CONFIG.spacing.circleOffset + 2, yPosition + PDF_CONFIG.spacing.circleOffset + 2, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Weaknesses (Opportunities)", wx + PDF_CONFIG.card.textOffsetX + 2, yPosition + PDF_CONFIG.spacing.contentPadding);

  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  textY = yPosition + PDF_CONFIG.card.headerHeight + PDF_CONFIG.spacing.cardGap;
  data.weaknesses.forEach((it) => {
    doc.setFillColor(...PDF_CONFIG.amber);
    doc.circle(wx + PDF_CONFIG.box.paddingX, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const wrapped = splitTextWithFont(doc, sanitizeText(it), colWidth - PDF_CONFIG.card.textOffsetX, "bodySmall", false);
    wrapped.forEach((w: string) => {
      doc.text(w, wx + PDF_CONFIG.spacing.contentPadding, textY);
      textY += smallLine;
    });
    textY += 1;
  });

  yPosition += swHeight + PDF_CONFIG.spacing.cardGap;

  // -------- Emotional & Cognitive Appeal --------
  const pinkBg = PDF_CONFIG.pinkBg;
  const pinkBorder = PDF_CONFIG.pinkBorder;
  const pink = PDF_CONFIG.pink;

  const blueBg = PDF_CONFIG.blueBg;
  const blueBorder = PDF_CONFIG.blueBorder;
  const blue = PDF_CONFIG.blue;

  const emotionalLines = measureWrappedLines(data.emotionalAppeal.promise, colWidth - 16, "bodySmall", false);

  const cognitiveItems = data.cognitiveAppeal.features.map(f => `${f.title}: ${f.desc}`);

  const cognitiveLinesCount = cognitiveItems.reduce((acc, it) => {
    return acc + Math.max(1, splitTextWithFont(doc, sanitizeText(it), colWidth - PDF_CONFIG.card.textOffsetX, "bodySmall", false).length);
  }, 0);

  const appealHeight = Math.max(
    PDF_CONFIG.card.textOffsetX + 2 + emotionalLines.length * smallLine + PDF_CONFIG.spacing.circleOffset,
    PDF_CONFIG.card.textOffsetX + 2 + cognitiveLinesCount * smallLine + PDF_CONFIG.spacing.contentPadding
  );

  fitPage(appealHeight + PDF_CONFIG.spacing.cardGap);

  // Emotional
  doc.setFillColor(...pinkBg);
  doc.roundedRect(margin, yPosition, colWidth, appealHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...pinkBorder);
  doc.roundedRect(margin, yPosition, colWidth, appealHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");
  doc.setFillColor(...pink);
  doc.circle(margin + PDF_CONFIG.spacing.circleOffset + 2, yPosition + PDF_CONFIG.spacing.circleOffset + 2, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Emotional (Heart) Appeal", margin + PDF_CONFIG.card.textOffsetX + 2, yPosition + PDF_CONFIG.spacing.contentPadding);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  textY = yPosition + PDF_CONFIG.card.headerHeight + PDF_CONFIG.spacing.cardGap;
  emotionalLines.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.box.paddingX, textY);
    textY += smallLine;
  });

  // Cognitive
  const cx = margin + colWidth + PDF_CONFIG.spacing.cardGap;
  doc.setFillColor(...blueBg);
  doc.roundedRect(cx, yPosition, colWidth, appealHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...blueBorder);
  doc.roundedRect(cx, yPosition, colWidth, appealHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");
  doc.setFillColor(...blue);
  doc.circle(cx + PDF_CONFIG.spacing.circleOffset + 2, yPosition + PDF_CONFIG.spacing.circleOffset + 2, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Cognitive (Head) Appeal", cx + PDF_CONFIG.card.textOffsetX + 2, yPosition + PDF_CONFIG.spacing.contentPadding);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  textY = yPosition + PDF_CONFIG.card.headerHeight + PDF_CONFIG.spacing.cardGap;
  cognitiveItems.forEach((it) => {
    doc.setFillColor(...blue);
    doc.circle(cx + PDF_CONFIG.box.paddingX, textY - 1.5, PDF_CONFIG.circleSize.small, "F");
    const wrapped = splitTextWithFont(doc, sanitizeText(it), colWidth - PDF_CONFIG.card.textOffsetX, "bodySmall", false);
    wrapped.forEach((w: string) => {
      doc.text(w, cx + PDF_CONFIG.spacing.contentPadding, textY);
      textY += smallLine;
    });
    textY += 1;
  });

  yPosition += appealHeight + PDF_CONFIG.spacing.cardGap;

  // -------- Brand Metaphors --------
  const metaphorsHeight = PDF_CONFIG.card.textOffsetX + 2 + 28 + PDF_CONFIG.spacing.circleOffset;
  fitPage(metaphorsHeight + PDF_CONFIG.spacing.cardGap);

  doc.setFillColor(...amberBg);
  doc.roundedRect(margin, yPosition, maxWidth, metaphorsHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...amberBorder);
  doc.roundedRect(margin, yPosition, maxWidth, metaphorsHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + PDF_CONFIG.spacing.contentPadding, yPosition + PDF_CONFIG.spacing.circleOffset + 2, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Brand Metaphors", margin + 24, yPosition + PDF_CONFIG.spacing.contentPadding);

  const metaWidth = (maxWidth - 24) / 4;
  data.metaphors.forEach((meta, idx) => {
    const xPos = margin + PDF_CONFIG.box.paddingX + idx * (metaWidth + PDF_CONFIG.spacing.paragraphGap);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(xPos, yPosition + PDF_CONFIG.card.textOffsetX + 2, metaWidth, 24, PDF_CONFIG.box.borderRadiusSmall, PDF_CONFIG.box.borderRadiusSmall, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    const title = splitTextWithFont(doc, meta.metaphor, metaWidth - PDF_CONFIG.box.paddingX, "bodySmall", true);
    doc.text(title[0] || "", xPos + PDF_CONFIG.spacing.paragraphGap, yPosition + 31);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, meta.description, metaWidth - PDF_CONFIG.box.paddingX, "caption", false);
    doc.text(descLines[0] || "", xPos + PDF_CONFIG.spacing.paragraphGap, yPosition + 41);
  });

  yPosition += metaphorsHeight + PDF_CONFIG.spacing.cardGap;

  // -------- Current Marketing Position --------
  const positionLines = measureWrappedLines(data.currentPosition.description, maxWidth - 16);

  const opportunityText = `Opportunity: ${data.currentPosition.opportunity}`;
  const opportunityLines = measureWrappedLines(opportunityText, maxWidth - 28, "caption", true);

  const positionHeight = PDF_CONFIG.card.textOffsetX + 2 + positionLines.length * bodyLine + opportunityLines.length * PDF_CONFIG.spacing.paragraphGap + PDF_CONFIG.card.headerHeight;
  fitPage(positionHeight + PDF_CONFIG.spacing.cardGap);

  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, positionHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.roundedRect(margin, yPosition, maxWidth, positionHeight, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + PDF_CONFIG.spacing.contentPadding, yPosition + PDF_CONFIG.spacing.circleOffset + 2, PDF_CONFIG.circleSize.medium, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Current Marketing Position", margin + 24, yPosition + PDF_CONFIG.spacing.contentPadding);

  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textGray);
  textY = yPosition + PDF_CONFIG.card.headerHeight + PDF_CONFIG.spacing.cardGap;
  positionLines.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.box.paddingX, textY);
    textY += bodyLine;
  });

  // Opportunity callout
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  const calloutY = textY + PDF_CONFIG.spacing.paragraphGap;
  const calloutHeight = opportunityLines.length * PDF_CONFIG.spacing.paragraphGap + PDF_CONFIG.spacing.sectionGap;
  doc.roundedRect(margin + PDF_CONFIG.box.paddingX, calloutY, maxWidth - 16, calloutHeight, PDF_CONFIG.box.borderRadiusSmall, PDF_CONFIG.box.borderRadiusSmall, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.setFont("helvetica", "bold");

  let oy = calloutY + PDF_CONFIG.spacing.paragraphGap;
  opportunityLines.forEach((line: string) => {
    doc.text(line, margin + PDF_CONFIG.spacing.circleOffset + 2, oy);
    oy += PDF_CONFIG.spacing.paragraphGap;
  });

  yPosition += positionHeight + PDF_CONFIG.spacing.itemGap;

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

  // Source content from provider
  const data = getPESTLEAnalysisStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Color mapping for factors
  const colorMap: Record<string, { bg: [number, number, number]; accent: [number, number, number] }> = {
    blue: { bg: PDF_CONFIG.blueBg, accent: PDF_CONFIG.blue },
    emerald: { bg: PDF_CONFIG.emeraldBg, accent: PDF_CONFIG.emerald },
    purple: { bg: PDF_CONFIG.primaryBgLight, accent: PDF_CONFIG.primaryColor },
    amber: { bg: PDF_CONFIG.amberBg, accent: PDF_CONFIG.amber },
    rose: { bg: PDF_CONFIG.roseBg, accent: PDF_CONFIG.rose },
    teal: { bg: PDF_CONFIG.tealBg, accent: PDF_CONFIG.teal }
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
  doc.text(data.header.title, margin + 24, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(data.header.subtitle, margin + 24, yPosition + 26);
  yPosition += 48;

  // Key drivers
  fitPage(50);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 45, 3, 3, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(data.keyDriversIntro), margin + 8, yPosition + 10);
  let ky = yPosition + 18;
  data.keyDrivers.forEach((driver) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + 12, ky - 1, PDF_CONFIG.circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(driver, margin + 18, ky);
    ky += 5;
  });
  yPosition += 53;

  // PESTLE factors
  const cardHeight = 50;
  const cardWidth = (maxWidth - 8) / 2;

  data.factors.forEach((factor, idx) => {
    const col = idx % 2;
    const colors = colorMap[factor.colorType] || colorMap.blue;
    
    if (col === 0) {
      fitPage(cardHeight + 8);
    }
    
    const xPos = margin + col * (cardWidth + 8);
    const cardY = yPosition;

    doc.setFillColor(...colors.bg);
    doc.roundedRect(xPos, cardY, cardWidth, cardHeight, 3, 3, "F");
    
    doc.setFillColor(...colors.accent);
    const circleX = xPos + 10;
    const circleY = cardY + 10;
    doc.circle(circleX, circleY, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    const letterWidth = doc.getTextWidth(factor.letter);
    doc.text(factor.letter, circleX - letterWidth / 2, circleY + 3);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(factor.title, xPos + 20, cardY + 12);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(factor.subtitle, xPos + 20, cardY + 18);

    let itemY = cardY + 26;
    // Show first 5 items max to fit in card
    const displayItems = factor.items.slice(0, 5);
    displayItems.forEach((item) => {
      doc.setFillColor(...colors.accent);
      doc.circle(xPos + 10, itemY - 1, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(PDF_CONFIG.fontSize.caption);
      const wrapped = doc.splitTextToSize(sanitizeText(item), cardWidth - 20);
      doc.text(wrapped[0], xPos + 16, itemY);
      itemY += PDF_CONFIG.lineHeight.body;
    });

    if (col === 1) {
      yPosition += cardHeight + 6;
    }
  });

  if (data.factors.length % 2 === 1) {
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

  // Source content from provider
  const data = getInternalCapabilityAssessmentStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Color mapping for strengths
  const colorMap: Record<string, { bg: [number, number, number]; accent: [number, number, number] }> = {
    blue: { bg: PDF_CONFIG.blueBg, accent: PDF_CONFIG.blue },
    purple: { bg: PDF_CONFIG.primaryBgLight, accent: PDF_CONFIG.primaryColor },
    emerald: { bg: PDF_CONFIG.emeraldBg, accent: PDF_CONFIG.emerald },
    amber: { bg: PDF_CONFIG.amberBg, accent: PDF_CONFIG.amber },
    rose: { bg: PDF_CONFIG.roseBg, accent: PDF_CONFIG.rose }
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
  doc.text(data.header.title, margin + 24, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.body);
  doc.setFont("helvetica", "normal");
  const introLines = doc.splitTextToSize(sanitizeText(data.keyMessage.primary), maxWidth - 32);
  introLines.forEach((line: string, i: number) => {
    doc.text(line, margin + 24, yPosition + 26 + i * 5);
  });
  yPosition += 53;

  // Strengths header
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

  // Render strengths from provider data
  data.strengths.forEach((strength, idx) => {
    const col = idx % 2;
    const colors = colorMap[strength.colorType] || colorMap.emerald;
    
    if (col === 0) {
      fitPage(strengthCardHeight + 6);
    }
    const xPos = margin + col * (strengthCardWidth + 8);
    
    doc.setFillColor(...colors.bg);
    doc.roundedRect(xPos, yPosition, strengthCardWidth, strengthCardHeight, 3, 3, "F");
    
    doc.setFillColor(...colors.accent);
    doc.circle(xPos + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    // Truncate title if needed
    const truncatedTitle = strength.title.length > 25 ? strength.title.substring(0, 22) + "..." : strength.title;
    doc.text(truncatedTitle, xPos + 20, yPosition + 12);

    let itemY = yPosition + 20;
    // Get items from subsections or items array
    const displayItems: string[] = [];
    if (strength.subsections) {
      strength.subsections.forEach(sub => {
        displayItems.push(...sub.items.slice(0, 1));
      });
    } else if (strength.items) {
      displayItems.push(...strength.items.slice(0, 3));
    }
    
    displayItems.slice(0, 3).forEach((item) => {
      doc.setFillColor(...colors.accent);
      doc.circle(xPos + 10, itemY - 1, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(PDF_CONFIG.fontSize.caption);
      doc.setFont("helvetica", "normal");
      const truncatedItem = item.length > 35 ? item.substring(0, 32) + "..." : item;
      doc.text(truncatedItem, xPos + 16, itemY);
      itemY += PDF_CONFIG.lineHeight.loose;
    });

    if (col === 1 || idx === data.strengths.length - 1) {
      yPosition += strengthCardHeight + 6;
    }
  });

  // Gaps header - force page break to keep title with content
  // Calculate space needed: header (14) + at least 2 gap cards (32 + 6 each)
  const gapsRequiredSpace = 14 + (32 + 6) * 2;
  fitPage(gapsRequiredSpace);
  
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + 6, yPosition + 4, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Limitations & Gaps", margin + 16, yPosition + 6);
  yPosition += 14;

  const gapCardWidth = (maxWidth - 8) / 2;
  const gapCardHeight = 32;
  const gapCardPadding = 6;
  const gapTextMaxWidth = gapCardWidth - gapCardPadding * 2;

  data.gaps.forEach((gap, idx) => {
    const col = idx % 2;
    if (col === 0) {
      fitPage(gapCardHeight + 6);
    }
    const xPos = margin + col * (gapCardWidth + 8);
    
    doc.setFillColor(...PDF_CONFIG.amberBg);
    doc.roundedRect(xPos, yPosition, gapCardWidth, gapCardHeight, 3, 3, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(gap.title, xPos + gapCardPadding, yPosition + 11);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");
    const needText = "Need: " + gap.need;
    const needLines = doc.splitTextToSize(sanitizeText(needText), gapTextMaxWidth);
    doc.text(needLines[0], xPos + gapCardPadding, yPosition + 22);

    if (col === 1 || idx === data.gaps.length - 1) {
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

  // Source content from provider
  const swotData = getSWOTAnalysisStructuredData();

  // Header
  fitPage(45);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 40, 3, 3, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 14, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(PDF_CONFIG.fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(swotData.header.title, margin + 24, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(swotData.header.subtitle, margin + 24, yPosition + 26);
  yPosition += 48;

  // Map color types to PDF_CONFIG colors
  const colorMap: Record<string, { bg: [number, number, number]; accent: [number, number, number] }> = {
    emerald: { bg: PDF_CONFIG.emeraldBg, accent: PDF_CONFIG.emerald },
    rose: { bg: PDF_CONFIG.roseBg, accent: PDF_CONFIG.rose },
    blue: { bg: PDF_CONFIG.blueBg, accent: PDF_CONFIG.blue },
    amber: { bg: PDF_CONFIG.amberBg, accent: PDF_CONFIG.amber },
  };

  const cardWidth = (maxWidth - 8) / 2;
  const cardHeight = 55;

  swotData.quadrants.forEach((quadrant, idx) => {
    const col = idx % 2;
    if (col === 0) {
      fitPage(cardHeight + 8);
    }
    const xPos = margin + col * (cardWidth + 8);
    const colors = colorMap[quadrant.colorType] || colorMap.blue;

    doc.setFillColor(...colors.bg);
    doc.roundedRect(xPos, yPosition, cardWidth, cardHeight, 3, 3, "F");
    
    doc.setFillColor(...colors.accent);
    doc.circle(xPos + 10, yPosition + 10, PDF_CONFIG.circleSize.medium, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(quadrant.title, xPos + 20, yPosition + 12);

    let itemY = yPosition + 22;
    quadrant.items.forEach((item) => {
      doc.setFillColor(...colors.accent);
      doc.circle(xPos + 10, itemY - 1, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(PDF_CONFIG.fontSize.caption);
      doc.setFont("helvetica", "normal");
      doc.text(item, xPos + 16, itemY);
      itemY += PDF_CONFIG.lineHeight.loose;
    });

    if (col === 1) {
      yPosition += cardHeight + 6;
    }
  });

  // Pillars Evaluation Matrix - full table with explanations
  const pillarsData = swotData.pillars;

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

  doc.setFontSize(PDF_CONFIG.fontSize.caption);
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
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(pillar.pillar, col1X, rowY);

    // Rating
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(pillar.rating + "/5", col2X, rowY);

    // Explanation - properly wrapped
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
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

  const recommendations = swotData.recommendations;

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
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text((idx + 1) + ". " + rec.title, xPos + 6, yPosition + 10);

    let itemY = yPosition + 18;
    rec.items.forEach((item) => {
      doc.setFillColor(...PDF_CONFIG.primaryColor);
      doc.circle(xPos + 8, itemY - 1, PDF_CONFIG.circleSize.small, "F");
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(PDF_CONFIG.fontSize.caption);
      doc.setFont("helvetica", "normal");
      doc.text(item, xPos + 13, itemY);
      itemY += PDF_CONFIG.lineHeight.loose;
    });

    if (col === 2 || idx === recommendations.length - 1) {
      yPosition += recCardHeight + 6;
    }
  });

  return yPosition;
};

/**
 * Render Marketing Objectives visual - uses structured data from provider
 */
const renderMarketingObjectives = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, spacing, box, circleSize } = PDF_CONFIG;

  const data = getMarketingObjectivesStructuredData();

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Color mapping for timeline and stages
  const colorMap: Record<string, { bg: [number, number, number]; accent: [number, number, number] }> = {
    amber: { bg: PDF_CONFIG.amberBg, accent: PDF_CONFIG.amber },
    emerald: { bg: PDF_CONFIG.emeraldBg, accent: PDF_CONFIG.emerald },
    purple: { bg: PDF_CONFIG.primaryBgLight, accent: PDF_CONFIG.primaryColor },
    rose: { bg: PDF_CONFIG.roseBg, accent: PDF_CONFIG.rose }
  };

  // Header
  fitPage(50);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 45, PDF_CONFIG.box.borderRadius, PDF_CONFIG.box.borderRadius, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + spacing.contentPadding, yPosition + spacing.contentPadding, circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + spacing.bulletTextOffset + 4, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const headerLines = splitTextWithFont(doc, data.header.subtitle, maxWidth - 32, "bodySmall", false);
  doc.text(headerLines, margin + spacing.bulletTextOffset + 4, yPosition + 26);
  yPosition += 53;

  // Top-Level Marketing Goals
  fitPage(60);
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Top-Level Marketing Goals", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const goalCardWidth = (maxWidth - spacing.gridGap) / 2;
  const goalCardHeight = 35;

  data.topLevelGoals.forEach((goal, idx) => {
    const col = idx % 2;
    if (col === 0) {
      fitPage(goalCardHeight + spacing.gridGap);
    }
    const xPos = margin + col * (goalCardWidth + spacing.gridGap);

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPosition, goalCardWidth, goalCardHeight, box.borderRadius, box.borderRadius, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    const goalLines = splitTextWithFont(doc, sanitizeText(goal), goalCardWidth - box.paddingX * 2, "bodySmall", false);
    doc.text(goalLines.slice(0, 3), xPos + box.paddingX, yPosition + 12);

    if (col === 1) {
      yPosition += goalCardHeight + spacing.gridGap;
    }
  });
  if (data.topLevelGoals.length % 2 === 0) {
    yPosition += goalCardHeight + spacing.gridGap;
  }

  // Mid- to Long-Term Direction
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Mid- to Long-Term Direction", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const timelineCardWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const timelineCardHeight = 55;
  fitPage(timelineCardHeight + spacing.sectionGap);

  data.timeline.forEach((item, idx) => {
    const colors = colorMap[item.colorKey];
    const xPos = margin + idx * (timelineCardWidth + spacing.gridGap);

    doc.setFillColor(...colors.bg);
    doc.roundedRect(xPos, yPosition, timelineCardWidth, timelineCardHeight, box.borderRadius, box.borderRadius, "F");

    doc.setTextColor(...colors.accent);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(item.period, xPos + box.paddingX, yPosition + 12);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const textLines = splitTextWithFont(doc, sanitizeText(item.text), timelineCardWidth - box.paddingX * 2, "caption", false);
    doc.text(textLines.slice(0, 4), xPos + box.paddingX, yPosition + 22);
  });

  yPosition += timelineCardHeight + spacing.sectionGap;

  // SMART Marketing Objectives - Journey Stages
  doc.addPage();
  yPosition = margin;

  fitPage(20);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Marketing Objectives (By Journey Stage)", margin, yPosition);
  yPosition += lineHeight.loose + spacing.sectionGap;

  const stageCardWidth = (maxWidth - spacing.gridGap) / 2;
  const stageCardHeight = 95;

  data.journeyStages.forEach((stage, idx) => {
    const colors = colorMap[stage.colorKey];
    const col = idx % 2;
    if (col === 0) {
      fitPage(stageCardHeight + spacing.gridGap);
    }
    const xPos = margin + col * (stageCardWidth + spacing.gridGap);

    // Card background
    doc.setFillColor(...colors.bg);
    doc.setDrawColor(...PDF_CONFIG.border);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(xPos, yPosition, stageCardWidth, stageCardHeight, box.borderRadius, box.borderRadius, "FD");

    // Header - stage name
    doc.setTextColor(...colors.accent);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(stage.stage, xPos + box.paddingX, yPosition + 12);
    
    // Period - below header
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(stage.period, xPos + box.paddingX, yPosition + 20);

    // Objectives
    let textY = yPosition + 30;
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    stage.objectives.forEach((obj) => {
      doc.setFillColor(...colors.accent);
      doc.circle(xPos + 8, textY - 1, circleSize.bullet, "F");
      doc.text(sanitizeText(obj).slice(0, 50), xPos + 12, textY);
      textY += lineHeight.body;
    });

    // Metrics
    textY += 2;
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "italic");
    doc.text("Metrics: " + stage.metrics.slice(0, 45) + "...", xPos + box.paddingX, textY);

    // Targets
    textY += lineHeight.body + 2;
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.accent);
    stage.targets.slice(0, 2).forEach((target) => {
      doc.text("- " + sanitizeText(target.value + " " + target.label).slice(0, 35), xPos + box.paddingX, textY);
      textY += lineHeight.body;
    });

    if (col === 1) {
      yPosition += stageCardHeight + spacing.gridGap;
    }
  });

  if (data.journeyStages.length % 2 === 0) {
    yPosition += stageCardHeight + spacing.gridGap;
  }

  // Framework Support Section
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("How This Framework Supports the Strategy", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const frameworkCardWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const frameworkCardHeight = 24;

  data.frameworkItems.forEach((item, idx) => {
    const col = idx % 3;
    if (col === 0) {
      fitPage(frameworkCardHeight + spacing.paragraphGap);
    }
    const xPos = margin + col * (frameworkCardWidth + spacing.gridGap);

    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.roundedRect(xPos, yPosition, frameworkCardWidth, frameworkCardHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");

    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(xPos + 8, yPosition + frameworkCardHeight / 2, circleSize.small, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const itemLines = splitTextWithFont(doc, sanitizeText(item), frameworkCardWidth - 16, "caption", false);
    doc.text(itemLines.slice(0, 2), xPos + 14, yPosition + 10);

    if (col === 2 || idx === data.frameworkItems.length - 1) {
      yPosition += frameworkCardHeight + spacing.paragraphGap;
    }
  });

  // Channel & Metrics Table
  doc.addPage();
  yPosition = margin;

  fitPage(20);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Channel and Metric Justification", margin, yPosition);
  yPosition += lineHeight.loose + spacing.sectionGap;

  // Table header
  const colWidths = [32, 45, 45, maxWidth - 122];
  const tableHeaderHeight = 14;
  const tableRowHeight = 18;

  fitPage(tableHeaderHeight + 10);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.rect(margin, yPosition, maxWidth, tableHeaderHeight, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "bold");
  let colX = margin + 4;
  ["Strategy Area", "Channels", "Metrics", "How It Benefits Hobson"].forEach((header, idx) => {
    doc.text(header, colX, yPosition + 10);
    colX += colWidths[idx];
  });
  yPosition += tableHeaderHeight;

  data.channelTable.forEach((row, idx) => {
    fitPage(tableRowHeight);
    const rowBg = idx % 2 === 0 ? PDF_CONFIG.bgWhite : PDF_CONFIG.bgLight;
    doc.setFillColor(...rowBg);
    doc.rect(margin, yPosition, maxWidth, tableRowHeight, "F");

    doc.setFontSize(fontSize.caption);
    colX = margin + 4;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.text(row.area, colX, yPosition + 12);
    colX += colWidths[0];

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.text(row.channels, colX, yPosition + 12);
    colX += colWidths[1];
    doc.text(row.metrics, colX, yPosition + 12);
    colX += colWidths[2];
    const benefitLines = splitTextWithFont(doc, sanitizeText(row.benefit), colWidths[3] - 4, "caption", false);
    doc.text(benefitLines[0] || "", colX, yPosition + 12);

    yPosition += tableRowHeight;
  });

  yPosition += spacing.sectionGap;

  // Alignment Summary
  fitPage(70);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 65, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 65, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Channel & Metric Alignment", margin + box.paddingX, yPosition + 14);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Hobson's channel and metric choices are tightly aligned to:", margin + box.paddingX, yPosition + 26);

  const alignItemWidth = (maxWidth - box.paddingX * 2 - spacing.gridGap) / 2;
  data.alignmentItems.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + box.paddingX + col * (alignItemWidth + spacing.gridGap);
    const yPos = yPosition + 32 + row * 15;
    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.roundedRect(xPos, yPos, alignItemWidth, 13, 2, 2, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(item.text, xPos + 4, yPos + 9);
  });

  yPosition += 73;

  return yPosition;
};

/**
 * Render Brand Strategy visual - uses structured data from provider
 */
const renderBrandStrategy = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, lineHeightFactor, spacing, box } = PDF_CONFIG;

  const data = getBrandStrategyStructuredData();

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
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.header.title, margin + 24, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const headerLines = splitTextWithFont(doc, data.header.subtitle, maxWidth - 32, "bodySmall", false);
  doc.text(headerLines, margin + 24, yPosition + 26);
  yPosition += 53;

  // Brand Essence
  const essenceHeight = 40;
  fitPage(essenceHeight + spacing.paragraphGap);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, essenceHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, essenceHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.brandEssence.title, margin + box.paddingX, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const essenceLines = splitTextWithFont(doc, sanitizeText(data.brandEssence.content), maxWidth - box.paddingX * 2, "bodySmall", false);
  doc.text(essenceLines.slice(0, 2), margin + box.paddingX, yPosition + 24);
  yPosition += essenceHeight + spacing.sectionGap;

  // Visual Direction
  fitPage(70);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.visualDirection.title, margin, yPosition);
  yPosition += lineHeight.loose;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(data.visualDirection.intro, margin, yPosition);
  yPosition += lineHeight.body + spacing.paragraphGap;

  const visualCardWidth = (maxWidth - spacing.gridGap) / 2;
  const visualCardHeight = 32;

  data.visualDirection.items.forEach((item, idx) => {
    const col = idx % 2;
    if (col === 0) {
      fitPage(visualCardHeight + spacing.paragraphGap);
    }
    const xPos = margin + col * (visualCardWidth + spacing.gridGap);

    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.roundedRect(xPos, yPosition, visualCardWidth, visualCardHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(xPos, yPosition, 4, visualCardHeight, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(item.title, xPos + 10, yPosition + 10);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, sanitizeText(item.description), visualCardWidth - 14, "caption", false);
    doc.text(descLines.slice(0, 2), xPos + 10, yPosition + 20);

    if (col === 1) {
      yPosition += visualCardHeight + spacing.paragraphGap;
    }
  });
  if (data.visualDirection.items.length % 2 !== 0) {
    yPosition += visualCardHeight + spacing.paragraphGap;
  }

  yPosition += spacing.sectionGap;

  // Verbal Direction - 2 columns layout for better readability
  const verbalPrincipleWidth = (maxWidth - box.paddingX * 2 - spacing.gridGap) / 2;
  const verbalPrincipleRows = Math.ceil(data.verbalDirection.principles.length / 2);
  const verbalBoxHeight = 34 + verbalPrincipleRows * 18;
  
  fitPage(verbalBoxHeight + 8);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, verbalBoxHeight, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.verbalDirection.title, margin + box.paddingX, yPosition + 14);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(data.verbalDirection.intro, margin + box.paddingX, yPosition + 24);

  data.verbalDirection.principles.forEach((principle, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + box.paddingX + col * (verbalPrincipleWidth + spacing.gridGap);
    const yPos = yPosition + 32 + row * 18;
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPos, verbalPrincipleWidth, 14, 2, 2, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(principle, xPos + 6, yPos + 9);
  });

  yPosition += verbalBoxHeight + 8;

  // Experience & Interaction Approach - responsive card heights (prevents overlap)
  fitPage(80);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.experienceApproach.title, margin, yPosition);
  yPosition += lineHeight.loose;

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(data.experienceApproach.intro, margin, yPosition);
  yPosition += lineHeight.body + spacing.paragraphGap;

  const expCardWidth = (maxWidth - spacing.gridGap) / 2;
  const expInnerW = expCardWidth - 16;
  const expMaxDescLines = 6;

  const expCards = data.experienceApproach.items.map((item) => {
    const titleLines = splitTextWithFont(doc, sanitizeText(item.title), expInnerW, "bodySmall", true);
    const descLines = splitTextWithFont(doc, sanitizeText(item.description), expInnerW, "caption", false);
    const descShown = descLines.slice(0, expMaxDescLines);

    // top padding (10) + title + gap (4) + desc + bottom padding (10)
    const titleBlockH = Math.min(2, titleLines.length) * lineHeight.body;
    const descBlockH = descShown.length * lineHeight.body;
    const computedH = 10 + titleBlockH + 4 + descBlockH + 10;

    return {
      item,
      titleLines,
      descShown,
      height: Math.max(62, computedH),
    };
  });

  const expRowCount = Math.ceil(expCards.length / 2);
  const expRowHeights = Array.from({ length: expRowCount }, (_, r) => {
    const left = expCards[r * 2]?.height ?? 0;
    const right = expCards[r * 2 + 1]?.height ?? 0;
    return Math.max(left, right);
  });

  const expTotalHeight =
    expRowHeights.reduce((acc, h) => acc + h, 0) +
    (expRowCount > 1 ? (expRowCount - 1) * spacing.paragraphGap : 0);

  fitPage(expTotalHeight + spacing.sectionGap);

  const expColors: [number, number, number][] = [PDF_CONFIG.primaryBgLight, PDF_CONFIG.emeraldBg, PDF_CONFIG.amberBg];

  const expStartY = yPosition;
  expCards.forEach((card, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);

    const rowY =
      expStartY +
      expRowHeights.slice(0, row).reduce((acc, h) => acc + h, 0) +
      row * spacing.paragraphGap;

    const xPos = margin + col * (expCardWidth + spacing.gridGap);

    doc.setFillColor(...expColors[idx % expColors.length]);
    doc.roundedRect(xPos, rowY, expCardWidth, expRowHeights[row], box.borderRadiusSmall, box.borderRadiusSmall, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(card.titleLines.slice(0, 2), xPos + 8, rowY + 14);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descY = rowY + 14 + Math.min(2, card.titleLines.length) * lineHeight.body + 6;
    doc.text(card.descShown, xPos + 8, descY);
  });

  yPosition = expStartY + expTotalHeight + spacing.sectionGap;

  // Internal Brand Alignment - wrap intro + 2-column principles (prevents overlap)
  const internalIntroLines = splitTextWithFont(
    doc,
    sanitizeText(data.internalAlignment.intro),
    maxWidth - box.paddingX * 2,
    "bodySmall",
    false
  );

  const alignPillWidth = (maxWidth - box.paddingX * 2 - spacing.gridGap) / 2;
  const alignPills = data.internalAlignment.principles.map((p) => {
    const lines = splitTextWithFont(doc, sanitizeText(p), alignPillWidth - 12, "caption", false);
    const height = Math.max(14, 6 + Math.min(2, lines.length) * lineHeight.body);
    return { lines, height };
  });

  const alignRows = Math.ceil(alignPills.length / 2);
  const alignRowHeights = Array.from({ length: alignRows }, (_, r) => {
    const left = alignPills[r * 2]?.height ?? 0;
    const right = alignPills[r * 2 + 1]?.height ?? 0;
    return Math.max(left, right);
  });

  const internalBoxHeight =
    18 + // title block
    internalIntroLines.length * lineHeight.body +
    8 + // gap
    alignRowHeights.reduce((acc, h) => acc + h, 0) +
    (alignRows > 1 ? (alignRows - 1) * 6 : 0) +
    10; // bottom padding

  fitPage(internalBoxHeight + 8);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, internalBoxHeight, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.internalAlignment.title, margin + box.paddingX, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  let iaY = yPosition + 22;
  internalIntroLines.forEach((l: string) => {
    doc.text(l, margin + box.paddingX, iaY);
    iaY += lineHeight.body;
  });

  iaY += 6;
  alignPills.forEach((pill, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + box.paddingX + col * (alignPillWidth + spacing.gridGap);
    const rowY = iaY + alignRowHeights.slice(0, row).reduce((acc, h) => acc + h, 0) + row * 6;

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, rowY, alignPillWidth, alignRowHeights[row], 2, 2, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(pill.lines.slice(0, 2), xPos + 6, rowY + 9);
  });

  yPosition += internalBoxHeight + 8;

  // Long-Term Branding Direction - dynamically sized box
  const ltdIntroLines = splitTextWithFont(
    doc,
    sanitizeText(data.longTermDirection.intro),
    maxWidth - box.paddingX * 2,
    "bodySmall",
    false
  );
  const ltdItemCount = data.longTermDirection.items.length;
  const ltdBoxHeight =
    14 + // title top padding
    Math.min(3, ltdIntroLines.length) * lineHeight.body + // intro lines
    8 + // gap before bullets
    ltdItemCount * lineHeight.body + // bullet items
    8 + // gap before goal
    lineHeight.body + // goal line
    10; // bottom padding

  fitPage(ltdBoxHeight + 8);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, ltdBoxHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, ltdBoxHeight, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.longTermDirection.title, margin + box.paddingX, yPosition + 12);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  let ltdTextY = yPosition + 22;
  ltdIntroLines.slice(0, 3).forEach((line: string) => {
    doc.text(line, margin + box.paddingX, ltdTextY);
    ltdTextY += lineHeight.body;
  });

  ltdTextY += 4;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.caption);
  data.longTermDirection.items.forEach((item) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + box.paddingX + 4, ltdTextY - 1, PDF_CONFIG.circleSize.small, "F");
    const wrappedItem = splitTextWithFont(doc, sanitizeText(item), maxWidth - box.paddingX * 2 - 14, "caption", false);
    doc.text(wrappedItem[0] || "", margin + box.paddingX + 10, ltdTextY);
    ltdTextY += lineHeight.body;
  });

  ltdTextY += 4;
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text(data.longTermDirection.goal, margin + box.paddingX, ltdTextY);

  yPosition += ltdBoxHeight + 8;

  // SMART Branding Objectives
  fitPage(80);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Branding Objectives (2026-2028 Timeline)", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const objColors: Record<string, { bg: [number, number, number]; accent: [number, number, number] }> = {
    purple: { bg: PDF_CONFIG.primaryBgLight, accent: PDF_CONFIG.primaryColor },
    teal: { bg: PDF_CONFIG.emeraldBg, accent: PDF_CONFIG.emerald },
    amber: { bg: PDF_CONFIG.amberBg, accent: PDF_CONFIG.amber }
  };

  data.brandingObjectives.forEach((obj) => {
    const colors = objColors[obj.colorKey];
    
    // Calculate dynamic height based on wrapped text
    let totalObjLines = 0;
    const wrappedObjectives = obj.objectives.map((objective) => {
      const lines = splitTextWithFont(doc, sanitizeText(objective), maxWidth - box.paddingX * 2 - 14, "caption", false);
      totalObjLines += lines.length;
      return lines;
    });
    
    const objHeight = 16 + totalObjLines * lineHeight.body + 8; // title + lines + padding
    fitPage(objHeight + spacing.paragraphGap);

    doc.setFillColor(...colors.bg);
    doc.roundedRect(margin, yPosition, maxWidth, objHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");

    doc.setTextColor(...colors.accent);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(`${obj.phase}. ${obj.title}`, margin + box.paddingX, yPosition + 12);

    let objY = yPosition + 22;
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    wrappedObjectives.forEach((lines) => {
      doc.setFillColor(...colors.accent);
      doc.circle(margin + box.paddingX + 4, objY - 1, PDF_CONFIG.circleSize.small, "F");
      lines.forEach((line: string, lineIdx: number) => {
        const xOffset = lineIdx === 0 ? 10 : 10;
        doc.text(line, margin + box.paddingX + xOffset, objY);
        objY += lineHeight.body;
      });
    });

    yPosition += objHeight + spacing.paragraphGap;
  });

  // Online Presence Section - new page for readability
  doc.addPage();
  yPosition = margin;

  fitPage(50);
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 45, box.borderRadius, box.borderRadius, "F");
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + 14, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text(data.onlinePresence.title, margin + 24, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const opIntroLines = splitTextWithFont(doc, sanitizeText(data.onlinePresence.intro), maxWidth - 32, "bodySmall", false);
  doc.text(opIntroLines.slice(0, 2), margin + 24, yPosition + 26);
  yPosition += 53;

  // Online channels (render optional 2x2 point boxes inside each channel card)
  data.onlinePresence.channels.forEach((channel) => {
    const descLines = splitTextWithFont(
      doc,
      sanitizeText(channel.description),
      maxWidth - box.paddingX * 2,
      "caption",
      false
    );

    const pointCols = 2;
    const pointGap = 6;
    const hasPoints = Array.isArray(channel.points) && channel.points.length > 0;
    const points = hasPoints ? channel.points!.slice(0, 4) : [];
    const pointBoxW = hasPoints
      ? (maxWidth - box.paddingX * 2 - pointGap) / pointCols
      : 0;

    const pointBoxH = 12;
    const pointRows = hasPoints ? Math.ceil(points.length / pointCols) : 0;

    const channelHeight =
      12 + // top padding + title baseline
      Math.min(3, descLines.length) * lineHeight.body +
      (hasPoints ? 8 + pointRows * pointBoxH + (pointRows - 1) * 4 : 0) +
      10; // bottom padding

    fitPage(channelHeight + spacing.paragraphGap);

    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.roundedRect(margin, yPosition, maxWidth, channelHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");

    // Title
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(`${channel.id}. ${channel.title}`, margin + box.paddingX, yPosition + 12);

    // Description
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    let channelY = yPosition + 22;
    descLines.slice(0, 3).forEach((l: string) => {
      doc.text(l, margin + box.paddingX, channelY);
      channelY += lineHeight.body;
    });

    // 2x2 point boxes (if present)
    if (hasPoints) {
      channelY += 4;
      points.forEach((pt, idx) => {
        const col = idx % pointCols;
        const row = Math.floor(idx / pointCols);
        const x = margin + box.paddingX + col * (pointBoxW + pointGap);
        const y = channelY + row * (pointBoxH + 4);

        doc.setFillColor(...PDF_CONFIG.primaryBgLight);
        doc.roundedRect(x, y, pointBoxW, pointBoxH, 2, 2, "F");

        doc.setTextColor(...PDF_CONFIG.primaryColor);
        doc.setFontSize(fontSize.caption);
        doc.setFont("helvetica", "normal");
        const ptLines = splitTextWithFont(doc, sanitizeText(pt), pointBoxW - 10, "caption", false);
        doc.text(ptLines[0] || "", x + 5, y + 8);
      });
    }

    yPosition += channelHeight + spacing.paragraphGap;
  });

  yPosition += spacing.sectionGap;

  // SMART Objectives for Online Presence
  fitPage(20);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Objectives for Online Presence", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  data.onlineObjectives.forEach((obj, idx) => {
    const colors = [PDF_CONFIG.primaryBgLight, PDF_CONFIG.emeraldBg, PDF_CONFIG.amberBg][idx];
    
    // Calculate dynamic height based on wrapped text
    let totalObjLines = 0;
    const wrappedObjectives = obj.objectives.map((objective) => {
      const lines = splitTextWithFont(doc, sanitizeText(objective), maxWidth - box.paddingX * 2 - 14, "caption", false);
      totalObjLines += lines.length;
      return lines;
    });
    
    const objHeight = 16 + totalObjLines * lineHeight.body + 8; // title + lines + padding
    fitPage(objHeight + spacing.paragraphGap);

    doc.setFillColor(...colors);
    doc.roundedRect(margin, yPosition, maxWidth, objHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(`${obj.phase}. ${obj.title}`, margin + box.paddingX, yPosition + 12);

    let objY = yPosition + 22;
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    wrappedObjectives.forEach((lines) => {
      doc.setFillColor(...PDF_CONFIG.primaryColor);
      doc.circle(margin + box.paddingX + 4, objY - 1, PDF_CONFIG.circleSize.small, "F");
      lines.forEach((line: string) => {
        doc.text(line, margin + box.paddingX + 10, objY);
        objY += lineHeight.body;
      });
    });

    yPosition += objHeight + spacing.paragraphGap;
  });

  // Timeline Summary
  fitPage(25);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 20, box.borderRadius, box.borderRadius, "F");
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(data.timelineSummary), margin + maxWidth / 2, yPosition + 12, { align: "center" });

  yPosition += 28;

  return yPosition;
};

/**
 * Render Content and Engagement Strategy visual
 */
const renderContentEngagementStrategy = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, spacing, box } = PDF_CONFIG;

  const fitPage = (required: number) => {
    yPosition = checkPageBreak(doc, yPosition, required, pageHeight, margin);
  };

  // Header
  fitPage(50);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 45, box.borderRadius, box.borderRadius, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + 14, yPosition + 14, PDF_CONFIG.circleSize.medium, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Content and Engagement Strategy", margin + 24, yPosition + 16);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const headerText = "Built to clearly introduce the product, reduce uncertainty around AI in real estate, and support smooth progression from initial interest to long-term use. Prioritising clarity and credibility over volume.";
  const headerLines = splitTextWithFont(doc, headerText, maxWidth - 32, "bodySmall", false);
  doc.text(headerLines, margin + 24, yPosition + 26);
  yPosition += 53;

  // Purpose of Content - using light background for readability
  fitPage(55);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 50, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 50, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Purpose of Content", margin + box.paddingX, yPosition + 14);

  const purposes = [
    { title: "Understanding", desc: "Help the market understand what Hobson does and why it matters" },
    { title: "Confidence", desc: "Show how the product works and handles information" },
    { title: "Support", desc: "Support users through each stage with simple, useful materials" }
  ];

  const purposeWidth = (maxWidth - box.paddingX * 2 - spacing.gridGap * 2) / 3;
  purposes.forEach((purpose, idx) => {
    const xPos = margin + box.paddingX + idx * (purposeWidth + spacing.gridGap);
    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.roundedRect(xPos, yPosition + 22, purposeWidth, 24, 2, 2, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(purpose.title, xPos + 4, yPosition + 30);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    const descLines = splitTextWithFont(doc, purpose.desc, purposeWidth - 8, "caption", false);
    doc.text(descLines[0] || "", xPos + 4, yPosition + 38);
  });

  yPosition += 58;

  // Core Content Themes
  const themeContainerHeight = 65;
  fitPage(themeContainerHeight);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, themeContainerHeight, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Core Content Themes", margin + box.paddingX, yPosition + 14);

  const themes = [
    { title: "Clarity", desc: "Explaining how Hobson simplifies document work" },
    { title: "Trust", desc: "Showing how answers are produced and referenced" },
    { title: "Ease", desc: "Emphasising simple workflows and minimal effort" },
    { title: "Practical Guidance", desc: "Examples reflecting day-to-day tasks" }
  ];

  const themeWidth = (maxWidth - box.paddingX * 2 - spacing.gridGap) / 2;
  const themeBoxHeight = 16;
  themes.forEach((theme, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + box.paddingX + col * (themeWidth + spacing.gridGap);
    const yPos = yPosition + 22 + row * (themeBoxHeight + 4);
    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.roundedRect(xPos, yPos, themeWidth, themeBoxHeight, 2, 2, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    // Center text vertically and horizontally
    const textWidth = doc.getTextWidth(theme.title);
    const textX = xPos + (themeWidth - textWidth) / 2;
    const textY = yPos + (themeBoxHeight / 2) + 3;
    doc.text(theme.title, textX, textY);
  });

  yPosition += themeContainerHeight + 8;

  // Content by Journey Stage (See-Think-Do-Care)
  fitPage(85);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Content by Journey Stage (See-Think-Do-Care)", margin, yPosition);
  yPosition += 12;

  const journeyStages = [
    { stage: "1. See (Awareness)", goal: "Show the problem and introduce Hobson", items: ["Visual examples of document pain points", "Simple explanations of what Hobson does", "Interactive entry points (quiz)"], success: "Increased visibility and curiosity", color: PDF_CONFIG.primaryBgLight },
    { stage: "2. Think (Consideration)", goal: "Explain how Hobson works", items: ["Q&A output walkthroughs", "Comparisons with manual workflows", "Examples of referenced answers"], success: "Longer engagement", color: PDF_CONFIG.emeraldBg },
    { stage: "3. Do (Conversion)", goal: "Encourage pilot participation", items: ["Case summaries from partners", "Clear pages on how to start", "Pilot invitations"], success: "Enquiries and sign-ups", color: [255, 243, 224] as [number, number, number] },
    { stage: "4. Care (Retention)", goal: "Support ongoing use", items: ["Onboarding materials", "Guidance tips", "Feature updates"], success: "Continued usage", color: [255, 228, 230] as [number, number, number] }
  ];

  const stageWidth = (maxWidth - spacing.gridGap) / 2;
  const stageHeight = 65;
  
  journeyStages.forEach((stage, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    if (col === 0) {
      fitPage(stageHeight + spacing.gridGap);
    }
    const xPos = margin + col * (stageWidth + spacing.gridGap);
    const yPos = yPosition + row * (stageHeight + spacing.gridGap);
    const textMaxWidth = stageWidth - 10;
    
    doc.setFillColor(...stage.color);
    doc.roundedRect(xPos, yPos, stageWidth, stageHeight, 2, 2, "F");
    
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(stage.stage, xPos + 5, yPos + 10);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.tiny);
    doc.setFont("helvetica", "normal");
    doc.text(stage.goal, xPos + 5, yPos + 18);
    
    stage.items.forEach((item, iIdx) => {
      const itemText = doc.splitTextToSize("- " + item, textMaxWidth);
      doc.text(itemText[0], xPos + 5, yPos + 27 + iIdx * PDF_CONFIG.lineHeight.relaxed);
    });
    
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.micro);
    doc.text("Success: " + stage.success, xPos + 5, yPos + 58);
  });

  yPosition += (stageHeight + spacing.gridGap) * 2 + 4;

  // Engagement Methods
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Engagement Methods", margin, yPosition);
  yPosition += 10;

  const methods = [
    { title: "The Quiz", desc: "Accessible way to introduce the problem space and create early emotional connection" },
    { title: "Simple Stories", desc: "Day-to-day scenarios illustrate value more effectively than abstract claims" },
    { title: "Feedback Loops", desc: "1:1 conversations, polls, and structured partner feedback" },
    { title: "Insight Content", desc: "Examples of guidance, pattern spotting, or saved effort as product matures" }
  ];

  const methodWidth = (maxWidth - spacing.gridGap) / 2;
  const methodHeight = 38;
  
  methods.forEach((method, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    if (col === 0) {
      fitPage(methodHeight + spacing.gridGap);
    }
    const xPos = margin + col * (methodWidth + spacing.gridGap);
    const yPos = yPosition + row * (methodHeight + spacing.gridGap);
    const bgColors = [PDF_CONFIG.primaryBgLight, PDF_CONFIG.emeraldBg, [255, 243, 224] as [number, number, number], [255, 228, 230] as [number, number, number]];
    
    doc.setFillColor(...bgColors[idx]);
    doc.roundedRect(xPos, yPos, methodWidth, methodHeight, 2, 2, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(method.title, xPos + 5, yPos + 11);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, method.desc, methodWidth - 10, "caption", false);
    doc.text(descLines.slice(0, 2), xPos + 5, yPos + 21);
  });

  yPosition += (methodHeight + spacing.gridGap) * 2 + 4;

  // Channel Use Table
  fitPage(55);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Channel Use", margin, yPosition);
  yPosition += 10;

  // Table header
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 12, 2, 2, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "bold");
  doc.text("Channel", margin + 4, yPosition + 8);
  doc.text("Role", margin + 45, yPosition + 8);
  doc.text("Examples", margin + 100, yPosition + 8);
  yPosition += 14;

  const channels = [
    { channel: "Website", role: "Education & conversion", examples: "Demos, explanations, case summaries" },
    { channel: "LinkedIn", role: "Awareness & credibility", examples: "Updates, commentary, product examples" },
    { channel: "Quiz", role: "Engagement & lead capture", examples: "Interactive entry point" },
    { channel: "Email (later)", role: "Nurture & retention", examples: "Onboarding steps, feature highlights" },
    { channel: "Product UI", role: "Ongoing engagement", examples: "Prompts, tips, clear output formatting" }
  ];

  channels.forEach((ch, idx) => {
    doc.setFillColor(...(idx % 2 === 0 ? PDF_CONFIG.bgWhite : PDF_CONFIG.bgLight));
    doc.roundedRect(margin, yPosition, maxWidth, 8, 0, 0, "F");
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(ch.channel, margin + 4, yPosition + 6);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(ch.role, margin + 45, yPosition + 6);
    doc.text(ch.examples, margin + 100, yPosition + 6);
    yPosition += 8;
  });

  yPosition += spacing.sectionGap * 2; // extra gap before next section

  // SMART Targets
  fitPage(70);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Targets (2026-2027)", margin, yPosition);
  yPosition += 10;

  const smartSections = [
    { title: "Content & Education (2026)", items: ["Publish 10 educational pieces by Q4 2026", "Deliver 3 onboarding guides for user roles by Q4 2026"], color: PDF_CONFIG.primaryBgLight },
    { title: "Engagement & Awareness (2026)", items: ["Increase LinkedIn engagement by 15% by Q4 2026", "Introduce email prompts by Q4 2026"], color: PDF_CONFIG.emeraldBg },
    { title: "Scaled Reach (2027)", items: ["Achieve 500+ quiz completions by Q2 2027"], color: [255, 243, 224] as [number, number, number] }
  ];

  const smartWidth = (maxWidth - spacing.gridGap * 2) / 3;
  smartSections.forEach((section, idx) => {
    const xPos = margin + idx * (smartWidth + spacing.gridGap);
    doc.setFillColor(...section.color);
    doc.roundedRect(xPos, yPosition, smartWidth, 45, 2, 2, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, xPos + 4, yPosition + 10);
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    section.items.forEach((item, iIdx) => {
      const itemLines = splitTextWithFont(doc, "- " + item, smartWidth - 8, "caption", false);
      doc.text(itemLines[0] || "", xPos + 4, yPosition + 20 + iIdx * 12);
    });
  });

  yPosition += 53;

  // Digital Channel Acquisition Strategy - using light background
  fitPage(70);
  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 65, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.border);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 65, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Digital Channel Acquisition Strategy", margin + box.paddingX, yPosition + 14);

  const acqGoals = [
    "Make Hobson visible to real estate professionals with document-heavy workflows",
    "Bring qualified traffic to the website and quiz",
    "Build interest in the 2026 pilot programme",
    "Test channels and messaging for 2027 scale"
  ];

  const leftColWidth = (maxWidth / 2) - box.paddingX - 5;
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  acqGoals.forEach((goal, idx) => {
    const goalLines = doc.splitTextToSize("- " + goal, leftColWidth);
    doc.text(goalLines[0], margin + box.paddingX, yPosition + 24 + idx * 7);
  });

  // Channel targets on right side
  const channelTargets = [
    { channel: "LinkedIn", target: "1,000 followers by Q4 2027" },
    { channel: "Website", target: "40% traffic increase by Q2 2027" },
    { channel: "Paid Search", target: "3-5% CTR by Q4 2027" }
  ];

  const targetX = margin + maxWidth / 2 + 10;
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Channel Targets:", targetX, yPosition + 24);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFont("helvetica", "normal");
  channelTargets.forEach((ct, idx) => {
    doc.text(ct.channel + ": " + ct.target, targetX, yPosition + 32 + idx * 7);
  });

  yPosition += 73;

  // SMART Acquisition Targets - 2-row layout with larger boxes
  const acqTargets = [
    { metric: "500+", desc: "Quiz completions Q2 2027" },
    { metric: "40%", desc: "Traffic increase Q4 2027" },
    { metric: "1,000", desc: "LinkedIn followers Q4 2027" },
    { metric: "5+", desc: "Pilot participants Q4 2026" },
    { metric: "10%", desc: "Retargeting conversion Q4 2027" },
    { metric: "Q1 2028", desc: "International readiness" }
  ];

  const acqCols = 3;
  const acqRows = Math.ceil(acqTargets.length / acqCols);
  const acqBoxW = (maxWidth - box.paddingX * 2 - spacing.gridGap * (acqCols - 1)) / acqCols;
  const acqBoxH = 28;
  const acqContainerH = 20 + acqRows * acqBoxH + (acqRows - 1) * 6 + 10;

  fitPage(acqContainerH + 8);
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, acqContainerH, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Acquisition Targets", margin + box.paddingX, yPosition + 14);

  const acqStartY = yPosition + 22;
  acqTargets.forEach((target, idx) => {
    const col = idx % acqCols;
    const row = Math.floor(idx / acqCols);
    const xPos = margin + box.paddingX + col * (acqBoxW + spacing.gridGap);
    const yPos = acqStartY + row * (acqBoxH + 6);

    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.roundedRect(xPos, yPos, acqBoxW, acqBoxH, 3, 3, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(target.metric, xPos + 8, yPos + 12);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, sanitizeText(target.desc), acqBoxW - 16, "caption", false);
    doc.text(descLines.slice(0, 2), xPos + 8, yPos + 22);
  });

  yPosition += acqContainerH + 8;

  // Digital Channel Conversion Strategy - using light background
  fitPage(45);
  doc.setFillColor(...PDF_CONFIG.emeraldBg);
  doc.roundedRect(margin, yPosition, maxWidth, 40, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.emeraldBorder);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 40, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Digital Channel Conversion Strategy", margin + box.paddingX, yPosition + 14);

  const conversionPoints = [
    "Straightforward path from curiosity to hands-on experience",
    "Reduce perceived risk through free entry point",
    "Demonstrate value early through real interactions",
    "Continual measurement and improvement",
    "Build funnel for future paid tiers"
  ];

  const convWidth = (maxWidth - box.paddingX * 2 - spacing.gridGap * 4) / 5;
  conversionPoints.forEach((point, idx) => {
    const xPos = margin + box.paddingX + idx * (convWidth + spacing.gridGap);
    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.roundedRect(xPos, yPosition + 20, convWidth, 16, 2, 2, "F");
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(PDF_CONFIG.fontSize.micro);
    doc.setFont("helvetica", "normal");
    const pointLines = splitTextWithFont(doc, point, convWidth - 4, "caption", false);
    doc.text(pointLines.slice(0, 2), xPos + 2, yPosition + 26);
  });

  yPosition += 48;

  return yPosition;
};

/**
 * Render Primary Conversion Channels visual
 */
const renderPrimaryConversionChannels = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { spacing, box, numberedCircle, fontSize, lineHeight } = PDF_CONFIG;

  // Note: Title already rendered by renderTabContent, skip duplicate

  // Introduction
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textDark);
  const introText = "The goal of the conversion strategy is to make it as easy as possible for prospects to try Hobson, see value quickly, and progress toward deeper engagement.";
  const introLines = doc.splitTextToSize(introText, maxWidth);
  doc.text(introLines, margin, yPosition);
  yPosition += introLines.length * lineHeight.body + spacing.sectionGap;

  // Channel 1: Website - using light background for readability
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 42, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 42, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("1. Website", margin + box.paddingX, yPosition + spacing.titleY);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("The website acts as the main route into trials and enquiries. Conversion paths include:", margin + box.paddingX, yPosition + 16);
  
  const websitePaths = ["Starting the free package", "Requesting a demo", "Submitting pilot enquiries", "Moving from quiz to guided trial"];
  const pathWidth = (maxWidth - box.paddingX * 2 - spacing.gridGap * 3) / 4;
  const pathBoxH = 22;
  websitePaths.forEach((path, idx) => {
    const xPos = margin + box.paddingX + idx * (pathWidth + spacing.gridGap);
    const boxY = yPosition + 22;

    doc.setFillColor(...PDF_CONFIG.bgWhite);
    doc.roundedRect(xPos, boxY, pathWidth, pathBoxH, 2, 2, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.caption);
    doc.setFont("helvetica", "normal");

    const pathLines = splitTextWithFont(doc, sanitizeText(path), pathWidth - 8, "caption", false).slice(0, 2);
    // Center vertically
    const lineCount = pathLines.length;
    const lineH = 4;
    const totalTextH = lineCount * lineH;
    const textStartY = boxY + (pathBoxH - totalTextH) / 2 + lineH;
    pathLines.forEach((line: string, lIdx: number) => {
      doc.text(line, xPos + pathWidth / 2, textStartY + lIdx * lineH, { align: "center" });
    });
  });
  yPosition += 52;

  // Channel 2: LinkedIn
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margin, yPosition, maxWidth, 32, 3, 3, "F");
  
  doc.setFillColor(...PDF_CONFIG.blue);
  doc.circle(margin + spacing.circleOffset, yPosition + numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("2", margin + spacing.circleOffset - 1.5, yPosition + numberedCircle.yOffset + numberedCircle.textYOffset);
  
  doc.setTextColor(...PDF_CONFIG.blue);
  doc.setFontSize(fontSize.cardTitle);
  doc.text("LinkedIn", margin + spacing.bulletTextOffset, yPosition + spacing.titleY);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  const linkedinPoints = ["Explain what the free experience involves", "Show quick, concrete examples of value", "Direct users to try without commitment"];
  let liY = yPosition + 16;
  linkedinPoints.forEach((point) => {
    doc.setFillColor(...PDF_CONFIG.blue);
    doc.circle(margin + spacing.bulletOffset, liY + 1, 1.5, "F");
    doc.text(point, margin + spacing.bulletTextOffset, liY + 2);
    liY += lineHeight.body;
  });
  yPosition += 38;

  // Check for page break
  if (yPosition > pageHeight - spacing.pageBreakMargin) {
    doc.addPage();
    yPosition = margin;
  }

  // Channel 3: Retargeting
  doc.setFillColor(240, 253, 250);
  doc.roundedRect(margin, yPosition, maxWidth, 32, 3, 3, "F");
  
  doc.setFillColor(...PDF_CONFIG.emerald);
  doc.circle(margin + spacing.circleOffset, yPosition + numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("3", margin + spacing.circleOffset - 1.5, yPosition + numberedCircle.yOffset + numberedCircle.textYOffset);
  
  doc.setTextColor(...PDF_CONFIG.emerald);
  doc.setFontSize(fontSize.cardTitle);
  doc.text("Retargeting (Later Phase)", margin + spacing.bulletTextOffset, yPosition + spacing.titleY);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  const retargetPoints = ["What users can do immediately in the free package", "Small examples of outcomes", "Invitations to try the workflow"];
  let rtY = yPosition + 16;
  retargetPoints.forEach((point) => {
    doc.setFillColor(...PDF_CONFIG.emerald);
    doc.circle(margin + spacing.bulletOffset, rtY + 1, 1.5, "F");
    doc.text(point, margin + spacing.bulletTextOffset, rtY + 2);
    rtY += lineHeight.body;
  });
  yPosition += 38;

  // Channel 4: Email
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(margin, yPosition, maxWidth, 32, 3, 3, "F");
  
  doc.setFillColor(...PDF_CONFIG.amber);
  doc.circle(margin + spacing.circleOffset, yPosition + numberedCircle.yOffset, PDF_CONFIG.circleSize.large, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("4", margin + spacing.circleOffset - 1.5, yPosition + numberedCircle.yOffset + numberedCircle.textYOffset);
  
  doc.setTextColor(...PDF_CONFIG.amber);
  doc.setFontSize(fontSize.cardTitle);
  doc.text("Email (For Users Already Engaged)", margin + spacing.bulletTextOffset, yPosition + spacing.titleY);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  const emailPoints = ["Guiding them through first steps", "Giving prompts based on typical tasks", "Reducing hesitation around accuracy"];
  let emY = yPosition + 16;
  emailPoints.forEach((point) => {
    doc.setFillColor(...PDF_CONFIG.amber);
    doc.circle(margin + spacing.bulletOffset, emY + 1, 1.5, "F");
    doc.text(point, margin + spacing.bulletTextOffset, emY + 2);
    emY += lineHeight.body;
  });
  yPosition += 38;

  // Check for page break
  if (yPosition > pageHeight - spacing.pageBreakMargin) {
    doc.addPage();
    yPosition = margin;
  }

  // Key Conversion Tactics - using light background for readability
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, 55, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 55, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Key Conversion Tactics", margin + box.paddingX, yPosition + spacing.titleY);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  const tactics = [
    "1. Free Package as Entry Point - Removes practical and psychological barriers",
    "2. Optimising CTAs - Testing wording, placement, number per page, clarity",
    "3. Search-Driven Conversion - Matching search intent with clear information",
    "4. Behaviour-Driven Improvements - Heatmaps, scroll depth, path analysis",
    "5. Content Supporting Conversion - Demos, examples, case summaries"
  ];
  let tacticY = yPosition + 16;
  tactics.forEach((tactic) => {
    doc.text(tactic, margin + box.paddingX, tacticY);
    tacticY += lineHeight.body + 2;
  });
  yPosition += 62;

  // Check for page break
  if (yPosition > pageHeight - spacing.pageBreakMargin) {
    doc.addPage();
    yPosition = margin;
  }

  // Key Metrics - 2-row layout with larger boxes for readability
  const metrics = [
    "Homepage click-through rate",
    "Free-package sign-ups",
    "Dwell time on product pages",
    "Bounce rate",
    "Retargeting conversions",
    "Demo requests",
    "High-intent conversion"
  ];

  const metricsRow1 = metrics.slice(0, 4);
  const metricsRow2 = metrics.slice(4);

  const metricBoxHeight = 22;
  const rowGap = 8;
  const headerHeight = 18;
  const keyMetricsHeight = headerHeight + metricBoxHeight + rowGap + metricBoxHeight + 12;

  doc.setFillColor(...PDF_CONFIG.bgLight);
  doc.roundedRect(margin, yPosition, maxWidth, keyMetricsHeight, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Key Metrics", margin + box.paddingX, yPosition + 14);

  doc.setFontSize(PDF_CONFIG.fontSize.caption);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textDark);

  const row1Width = (maxWidth - box.paddingX * 2 - spacing.gridGap * (metricsRow1.length - 1)) / metricsRow1.length;
  const row1Y = yPosition + headerHeight + 4;
  metricsRow1.forEach((metric, idx) => {
    const xPos = margin + box.paddingX + idx * (row1Width + spacing.gridGap);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(xPos, row1Y, row1Width, metricBoxHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    const metricLines = splitTextWithFont(doc, sanitizeText(metric), row1Width - 8, "caption", false);
    // Center vertically: for 1 line, center at box midpoint; for 2 lines, offset upward
    const lineCount = Math.min(2, metricLines.length);
    const lineH = 4;
    const totalTextH = lineCount * lineH;
    const textStartY = row1Y + (metricBoxHeight - totalTextH) / 2 + lineH;
    metricLines.slice(0, 2).forEach((line: string, lIdx: number) => {
      doc.text(line, xPos + row1Width / 2, textStartY + lIdx * lineH, { align: "center" });
    });
  });

  const row2Width = (maxWidth - box.paddingX * 2 - spacing.gridGap * (metricsRow2.length - 1)) / metricsRow2.length;
  const row2Y = row1Y + metricBoxHeight + rowGap;
  metricsRow2.forEach((metric, idx) => {
    const xPos = margin + box.paddingX + idx * (row2Width + spacing.gridGap);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(xPos, row2Y, row2Width, metricBoxHeight, box.borderRadiusSmall, box.borderRadiusSmall, "F");
    const metricLines = splitTextWithFont(doc, sanitizeText(metric), row2Width - 8, "caption", false);
    // Center vertically: for 1 line, center at box midpoint; for 2 lines, offset upward
    const lineCount = Math.min(2, metricLines.length);
    const lineH = 4;
    const totalTextH = lineCount * lineH;
    const textStartY = row2Y + (metricBoxHeight - totalTextH) / 2 + lineH;
    metricLines.slice(0, 2).forEach((line: string, lIdx: number) => {
      doc.text(line, xPos + row2Width / 2, textStartY + lIdx * lineH, { align: "center" });
    });
  });

  yPosition += keyMetricsHeight + spacing.sectionGap;

  // SMART Conversion Objectives - dynamically sized box
  const objectives = [
    "Increase CTA click-through rates by 20-30% by Q2 2026",
    "Achieve 10% conversion from high-intent visitors into free package by Q4 2026",
    "Secure 5 new pilot participants by Q1 2026",
    "Raise product-page dwell time to 2+ minutes by Q2 2026",
    "Reduce bounce rates to below 40% by Q3 2026",
    "Convert 10% of retargeting audiences into enquiries by Q4 2026",
    "Reach a 5% demo-request rate by Q4 2026"
  ];

  const objBoxPaddingTop = 16; // space before title
  const titleToListGap = 12; // space between title and first bullet
  const objItemHeight = lineHeight.body + 2; // slightly more breathing room per item
  const objBoxPaddingBottom = 12;
  const objBoxHeight = objBoxPaddingTop + titleToListGap + objectives.length * objItemHeight + objBoxPaddingBottom;

  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  doc.roundedRect(margin, yPosition, maxWidth, objBoxHeight, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Conversion Objectives", margin + box.paddingX, yPosition + objBoxPaddingTop);

  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PDF_CONFIG.textDark);

  let objY = yPosition + objBoxPaddingTop + titleToListGap;
  objectives.forEach((obj) => {
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(margin + box.paddingX + 4, objY - 1, PDF_CONFIG.circleSize.bullet, "F");
    const wrappedObj = splitTextWithFont(doc, sanitizeText(obj), maxWidth - box.paddingX * 2 - 14, "bodySmall", false);
    doc.text(wrappedObj[0] || "", margin + box.paddingX + 12, objY);
    objY += objItemHeight;
  });

  yPosition += objBoxHeight + spacing.sectionGap;

  return yPosition;
};


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
  doc.setFontSize(PDF_CONFIG.fontSize.statLarge);
  doc.text("Investment Opportunity Document", pageWidth / 2, 170, { align: "center" });

  // Date
  const currentDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(currentDate, pageWidth / 2, pageHeight - 20, { align: "center" });
};

// ============================================================================
// ACQUISITION & SALES STRATEGY RENDERERS
// ============================================================================

/**
 * Render Acquisition Executive Summary visual
 */
const renderAcquisitionExecutiveSummary = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, lineHeightFactor, spacing, box, circleSize } = PDF_CONFIG;

  const fitPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header
  const headerHeight = spacing.contentPadding + lineHeight.body + lineHeight.body + spacing.contentPadding;
  fitPage(headerHeight);
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", margin + box.paddingX, yPosition + spacing.contentPadding);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Acquisition and sales strategy for rapid, defensible revenue growth", margin + box.paddingX, yPosition + spacing.contentPadding + lineHeight.loose);
  
  yPosition += headerHeight + spacing.sectionGap;

  // Strategic Overview
  fitPage(55);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Strategic Overview", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const overviewText = "Hobson's acquisition and sales strategy is engineered to deliver rapid, defensible revenue growth while building long-term category leadership in AI-driven Real Estate intelligence.";
  
  doc.setFillColor(248, 250, 252);
  const overviewLines = splitTextWithFont(doc, overviewText, maxWidth - box.paddingX * 2, "body", false);
  const overviewHeight = overviewLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom;
  
  doc.roundedRect(margin, yPosition, maxWidth, overviewHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(box.borderWidthThin);
  doc.roundedRect(margin, yPosition, maxWidth, overviewHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(overviewLines, margin + box.paddingX, yPosition + box.paddingTop, { lineHeightFactor: lineHeightFactor.body });
  
  yPosition += overviewHeight + spacing.sectionGap;

  // Strategy Combines - Three pillars
  fitPage(75);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("The Strategy Combines", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const strategyCombines = [
    { 
      title: "Low-Friction Entry", 
      desc: "Pilot-led adoption that reduces barriers and builds trust through hands-on experience",
      color: [139, 92, 246] as [number, number, number],
      bgColor: [245, 238, 255] as [number, number, number]
    },
    { 
      title: "High-Retention Expansion", 
      desc: "Operational dependency drives retention as Hobson becomes embedded in daily workflows",
      color: [6, 182, 212] as [number, number, number],
      bgColor: [236, 254, 255] as [number, number, number]
    },
    { 
      title: "Scalable International Growth", 
      desc: "Global expansion path aligned with AI adoption trends and regulatory pressure",
      color: [34, 197, 94] as [number, number, number],
      bgColor: [240, 253, 244] as [number, number, number]
    },
  ];

  const pillarWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const pillarHeight = 58;

  strategyCombines.forEach((pillar, idx) => {
    const xPos = margin + idx * (pillarWidth + spacing.gridGap);
    const textMaxWidth = pillarWidth - box.paddingX * 2;

    doc.setFillColor(...pillar.bgColor);
    doc.roundedRect(xPos, yPosition, pillarWidth, pillarHeight, box.borderRadius, box.borderRadius, "F");

    doc.setTextColor(...pillar.color);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(pillar.title, xPos + box.paddingX, yPosition + 14);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, pillar.desc, textMaxWidth, "caption", false);
    doc.text(descLines, xPos + box.paddingX, yPosition + 24, { lineHeightFactor: lineHeightFactor.body });
  });

  yPosition += pillarHeight + spacing.sectionGap;

  // Growth Timeline - Staged approach
  fitPage(70);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Staged Growth Timeline", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const growthStages = [
    { 
      year: "2026", 
      phase: "De-Risk", 
      desc: "De-risk product and messaging through pilots",
      color: [100, 116, 139] as [number, number, number]
    },
    { 
      year: "2027", 
      phase: "Convert", 
      desc: "Convert early trust into predictable UK ARR",
      color: [139, 92, 246] as [number, number, number]
    },
    { 
      year: "2028-30", 
      phase: "Expand", 
      desc: "Expand internationally as category leader",
      color: [34, 197, 94] as [number, number, number]
    },
  ];

  const stageWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const stageHeight = 50;

  growthStages.forEach((stage, idx) => {
    const xPos = margin + idx * (stageWidth + spacing.gridGap);
    const textMaxWidth = stageWidth - box.paddingX * 2;

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(xPos, yPosition, stageWidth, stageHeight, box.borderRadius, box.borderRadius, "F");
    
    // Colored left border
    doc.setFillColor(...stage.color);
    doc.rect(xPos, yPosition, 3, stageHeight, "F");

    // Year text
    doc.setTextColor(...stage.color);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(stage.year, xPos + box.paddingX, yPosition + 16);

    // Phase title - positioned after year
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    const yearWidth = doc.getTextWidth(stage.year);
    doc.text(stage.phase, xPos + box.paddingX + yearWidth + 6, yPosition + 16);

    // Description
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, stage.desc, textMaxWidth, "caption", false);
    doc.text(descLines, xPos + box.paddingX, yPosition + 30, { lineHeightFactor: lineHeightFactor.body });
  });

  yPosition += stageHeight + spacing.sectionGap;

  // Strategic Benefits
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Strategic Benefits", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const benefits = [
    { title: "Minimised Risk", desc: "Commercial risk reduced through staged validation" },
    { title: "Accelerated Revenue", desc: "Faster time-to-revenue via pilot conversions" },
    { title: "Structural Defensibility", desc: "Embedded in daily operational workflows" },
  ];

  const benefitWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const benefitHeight = 42;

  benefits.forEach((benefit, idx) => {
    const xPos = margin + idx * (benefitWidth + spacing.gridGap);
    const textMaxWidth = benefitWidth - box.paddingX * 2;

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPosition, benefitWidth, benefitHeight, box.borderRadius, box.borderRadius, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(benefit.title, xPos + box.paddingX, yPosition + 14);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, benefit.desc, textMaxWidth, "caption", false);
    doc.text(descLines, xPos + box.paddingX, yPosition + 26, { lineHeightFactor: lineHeightFactor.body });
  });

  yPosition += benefitHeight + spacing.sectionGap;

  // Key Insight Box
  fitPage(45);
  const trustText = "Rather than aggressive short-term selling, Hobson compounds trust and dependency - critical in a risk-sensitive industry where switching costs rise rapidly once systems become operational infrastructure.";
  
  doc.setFillColor(254, 249, 195);
  const trustLines = splitTextWithFont(doc, trustText, maxWidth - box.paddingX * 2, "body", false);
  const trustHeight = trustLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom + 10;
  
  doc.roundedRect(margin, yPosition, maxWidth, trustHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(253, 224, 71);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, trustHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(161, 98, 7);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Key Insight", margin + box.paddingX, yPosition + box.paddingTop);
  
  doc.setTextColor(113, 63, 18);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(trustLines, margin + box.paddingX, yPosition + box.paddingTop + 12, { lineHeightFactor: lineHeightFactor.body });
  
  yPosition += trustHeight + spacing.sectionGap;

  // NEW PAGE - Targeting & Segmentation
  doc.addPage();
  yPosition = margin;

  // Targeting Strategy Header
  fitPage(headerHeight);
  doc.setFillColor(236, 254, 255);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(165, 243, 252);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(8, 145, 178);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Targeting & Segmentation Strategy", margin + box.paddingX, yPosition + spacing.contentPadding);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("From UK MVP validation to global market entry", margin + box.paddingX, yPosition + spacing.contentPadding + lineHeight.loose);
  
  yPosition += headerHeight + spacing.sectionGap;

  // Targeting Overview
  fitPage(50);
  const targetingText = "Hobson's targeting and segmentation strategy is designed to guide the organisation from early MVP validation in the UK to scalable commercial expansion and, ultimately, global market entry. The strategy is grounded in real discovery work, behavioural insight, industry adoption patterns, and the brand's Sage archetype - positioning Hobson as a calm, intelligent guide in a complex, high-pressure industry.";
  
  doc.setFillColor(248, 250, 252);
  const targetingLines = splitTextWithFont(doc, targetingText, maxWidth - box.paddingX * 2, "body", false);
  const targetingHeight = targetingLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom;
  
  doc.roundedRect(margin, yPosition, maxWidth, targetingHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(box.borderWidthThin);
  doc.roundedRect(margin, yPosition, maxWidth, targetingHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(targetingLines, margin + box.paddingX, yPosition + box.paddingTop, { lineHeightFactor: lineHeightFactor.body });
  
  yPosition += targetingHeight + spacing.sectionGap;

  // Marketing Mix
  fitPage(85);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("High-Level Proposition & Marketing Mix", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const marketingMix = [
    { 
      element: "Brand Identity", 
      value: "Calm Sage Archetype",
      desc: "Intelligent guide in complex industry",
      color: [139, 92, 246] as [number, number, number]
    },
    { 
      element: "Product Design", 
      value: "Lightweight & Simple",
      desc: "Minimal friction, maximum clarity",
      color: [6, 182, 212] as [number, number, number]
    },
    { 
      element: "Pricing", 
      value: "Accessible Entry",
      desc: "Low barriers, expansion-based growth",
      color: [34, 197, 94] as [number, number, number]
    },
    { 
      element: "Promotion", 
      value: "Education & Credibility",
      desc: "Thought leadership and trust-building",
      color: [234, 179, 8] as [number, number, number]
    },
  ];

  const mixWidth = (maxWidth - spacing.gridGap * 3) / 4;
  const mixHeight = 62;

  marketingMix.forEach((mix, idx) => {
    const xPos = margin + idx * (mixWidth + spacing.gridGap);

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(xPos, yPosition, mixWidth, mixHeight, box.borderRadius, box.borderRadius, "F");
    
    doc.setFillColor(...mix.color);
    doc.rect(xPos, yPosition, mixWidth, 3, "F");

    doc.setTextColor(...mix.color);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(mix.element, xPos + box.paddingX / 2, yPosition + 14);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    const valueLines = doc.splitTextToSize(mix.value, mixWidth - box.paddingX);
    doc.text(valueLines, xPos + box.paddingX / 2, yPosition + 26);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(mix.desc, mixWidth - box.paddingX);
    doc.text(descLines, xPos + box.paddingX / 2, yPosition + 42, { lineHeightFactor: lineHeightFactor.body });
  });

  yPosition += mixHeight + spacing.sectionGap;

  // Positioning Statement
  fitPage(50);
  const positionText = "Hobson establishes itself as the clarity engine for Real Estate - simple, intelligent, and trustworthy. These elements create a coherent pathway from early UK validation to global expansion by 2028-2030.";
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  const positionLines = splitTextWithFont(doc, positionText, maxWidth - box.paddingX * 2, "body", false);
  const positionHeight = positionLines.length * (lineHeight.body * lineHeightFactor.tight) + box.paddingTop + box.paddingBottom + 14;
  
  doc.roundedRect(margin, yPosition, maxWidth, positionHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, positionHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("The Clarity Engine for Real Estate", margin + box.paddingX, yPosition + box.paddingTop);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(positionLines, margin + box.paddingX, yPosition + box.paddingTop + 10, { lineHeightFactor: lineHeightFactor.tight });
  
  yPosition += positionHeight + spacing.sectionGap;

  return yPosition;
};
/**
 * Render The Proposition visual - Full Marketing Mix (7Ps)
 */
const renderTheProposition = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, lineHeightFactor, spacing, box } = PDF_CONFIG;
  let currentPageNum = 1;
  const sectionName = "The Proposition";

  // Helper to render page header with section name and page number
  const renderPageHeader = (subsection: string) => {
    // Section header bar
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(0, 0, pageWidth, 12, "F");
    
    // Section name on left
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "bold");
    doc.text(sectionName, margin, 8);
    
    // Subsection name in center
    doc.setFont("helvetica", "normal");
    doc.text(subsection, pageWidth / 2, 8, { align: "center" });
    
    // Page indicator on right
    doc.text(`Page ${currentPageNum}`, pageWidth - margin, 8, { align: "right" });
    
    currentPageNum++;
  };

  const fitPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin + 16; // Extra space for header
    }
  };

  const startNewPage = (subsection: string) => {
    doc.addPage();
    renderPageHeader(subsection);
    yPosition = margin + 16; // Start content below header
  };

  // Use PDF_CONFIG colors
  const blueColor = PDF_CONFIG.blueLight;
  const blueBg = PDF_CONFIG.blueBg;
  const purpleColor = PDF_CONFIG.primaryDark;
  const purpleBg = PDF_CONFIG.primaryBgLight;
  const greenColor = PDF_CONFIG.green;
  const greenBg = PDF_CONFIG.greenBg;
  const amberColor = PDF_CONFIG.amber;
  const amberBg = PDF_CONFIG.amberBg;

  // Header
  fitPage(45);
  const headerHeight = spacing.contentPadding + lineHeight.body * 2 + spacing.contentPadding;
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("The Proposition", margin + box.paddingX, yPosition + spacing.contentPadding);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  const headerSubtext = "Hobson's core proposition: a calm, intelligent assistant transforming document-heavy workflows into instant, accurate, referenced answers.";
  const headerLines = splitTextWithFont(doc, headerSubtext, maxWidth - box.paddingX * 2, "bodySmall", false);
  doc.text(headerLines, margin + box.paddingX, yPosition + spacing.contentPadding + lineHeight.loose);
  
  yPosition += headerHeight + spacing.sectionGap;

  // Core Proposition Statement
  fitPage(35);
  doc.setFillColor(248, 250, 252);
  const coreStatement = "Hobson turns document chaos into clarity - fast, accurate answers drawn directly from the files you already rely on.";
  const coreLines = splitTextWithFont(doc, coreStatement, maxWidth - box.paddingX * 2, "body", false);
  const coreHeight = coreLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom + 6;
  
  doc.roundedRect(margin, yPosition, maxWidth, coreHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, coreHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "italic");
  doc.text(coreLines, pageWidth / 2, yPosition + box.paddingTop + 3, { align: "center", lineHeightFactor: lineHeightFactor.body });
  
  yPosition += coreHeight + spacing.sectionGap;

  // Product Strategy Section
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Product Strategy", margin, yPosition);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Hobson is an AI-native assistant explicitly built for real estate", margin, yPosition + lineHeight.loose);
  yPosition += lineHeight.loose + lineHeight.body + spacing.paragraphGap;

  // Product Strategy 3-column grid
  const prodColWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const prodColHeight = 68;
  
  const productStrategies = [
    {
      title: "1. Core Value",
      items: ["Instant answers from source documents", "Transparent citations for verification", "Simple interface, no onboarding"]
    },
    {
      title: "2. Brand Experience",
      items: ["Sage-inspired identity: calm, wise", "Purple palette for insight/clarity", "Owl mascot, HUE coin engagement", "Hobson Choice quiz for awareness"]
    },
    {
      title: "3. Future Evolution",
      items: ["From retrieval to proactive insight", "Cross-document pattern detection", "Integrations with CRMs and storage"]
    }
  ];

  productStrategies.forEach((strat, idx) => {
    const xPos = margin + idx * (prodColWidth + spacing.gridGap);
    
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPosition, prodColWidth, prodColHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(xPos, yPosition, prodColWidth, prodColHeight, box.borderRadius, box.borderRadius, "S");
    
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(strat.title, xPos + box.paddingX, yPosition + 10);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    let itemY = yPosition + 20;
    strat.items.forEach((item) => {
      const itemLines = splitTextWithFont(doc, "- " + item, prodColWidth - box.paddingX * 2, "caption", false);
      doc.text(itemLines, xPos + box.paddingX, itemY);
      itemY += itemLines.length * lineHeight.tight + 2;
    });
  });

  yPosition += prodColHeight + spacing.sectionGap;

  // Price Strategy Section (New Page)
  startNewPage("Price & Place Strategy");

  fitPage(40);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Price Strategy (2026-2028)", margin, yPosition);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Lightweight, low-friction alternative to bulky enterprise systems", margin, yPosition + lineHeight.loose);
  yPosition += lineHeight.loose + lineHeight.body + spacing.paragraphGap;

  // Price Strategy Phases
  const pricePhases = [
    { num: "1", title: "MVP & Validation (Q1 2026)", color: blueColor, bg: blueBg, items: ["Fully free access for pilot partners", "No credit card, no setup costs"] },
    { num: "2", title: "Pilot Expansion (Q2-Q4 2026)", color: purpleColor, bg: purpleBg, items: ["Continue free for approved pilots", "Usage-based pricing prototypes", "Shape tiered pricing model"] },
    { num: "3", title: "Commercial Launch (2027)", color: greenColor, bg: greenBg, items: ["Formal usage-based pricing launch", "Three-tier: Starter/Pro/Enterprise", "Optional add-ons available"] },
    { num: "4", title: "Global Expansion (2028+)", color: amberColor, bg: amberBg, items: ["Localised pricing for EU/Int'l", "Enterprise bundles for multi-region", "Affordability as differentiator"] }
  ];

  pricePhases.forEach((phase) => {
    fitPage(40);
    const phaseHeight = 38;
    
    doc.setFillColor(...phase.bg);
    doc.roundedRect(margin, yPosition, maxWidth, phaseHeight, box.borderRadius, box.borderRadius, "F");
    
    // Phase number circle
    doc.setFillColor(...phase.color);
    doc.circle(margin + 14, yPosition + 12, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(phase.num, margin + 14, yPosition + 14, { align: "center" });
    
    // Phase title
    doc.setTextColor(...phase.color);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(phase.title, margin + 28, yPosition + 12);
    
    // Phase items
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const itemsText = phase.items.join(" | ");
    const itemLines = splitTextWithFont(doc, itemsText, maxWidth - 30, "caption", false);
    doc.text(itemLines, margin + 28, yPosition + 26);
    
    yPosition += phaseHeight + spacing.cardGap;
  });

  yPosition += spacing.sectionGap;

  // Place (Channel Strategy) Section
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Place (Channel Strategy)", margin, yPosition);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Distribution evolves with product maturity", margin, yPosition + lineHeight.loose);
  yPosition += lineHeight.loose + lineHeight.body + spacing.paragraphGap;

  // Channel Strategy 3-column
  const channelColWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const channelColHeight = 65;
  
  const channels = [
    { year: "2026: MVP & Pilot", color: blueColor, items: ["Relationship-led onboarding", "Founder network outreach", "Closed-platform testing", "LinkedIn education"] },
    { year: "2027: UK Commercial", color: greenColor, items: ["Public website + self-serve", "LinkedIn Ads to UK operators", "Webinars and live demos", "Industry communities"] },
    { year: "2028+: Global Expansion", color: amberColor, items: ["Localised sites for EU/US", "Regional CRE partners", "International digital acquisition", "Evidence-led expansion"] }
  ];

  channels.forEach((ch, idx) => {
    const xPos = margin + idx * (channelColWidth + spacing.gridGap);
    
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(xPos, yPosition, channelColWidth, channelColHeight, box.borderRadius, box.borderRadius, "F");
    
    // Left accent bar
    doc.setFillColor(...ch.color);
    doc.rect(xPos, yPosition, 3, channelColHeight, "F");
    
    doc.setTextColor(...ch.color);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(ch.year, xPos + box.paddingX, yPosition + 12);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    let chY = yPosition + 24;
    ch.items.forEach((item) => {
      doc.text("- " + item, xPos + box.paddingX, chY);
      chY += lineHeight.tight + 1;
    });
  });

  yPosition += channelColHeight + spacing.sectionGap;

  // Promotion Strategy Section (New Page)
  startNewPage("Promotion Strategy");

  fitPage(40);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Promotion Strategy", margin, yPosition);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Calm, clear, intelligent, and trustworthy brand identity", margin, yPosition + lineHeight.loose);
  yPosition += lineHeight.loose + lineHeight.body + spacing.paragraphGap;

  // Promotion by year
  const promoYears = [
    { year: "2026: Validation & Education", color: blueColor, bg: blueBg, items: ["Educational AI content", "Hobson Choice Quiz", "Pilot case studies", "Founder-led LinkedIn", "Explainer videos"] },
    { year: "2027: Commercial Launch", color: greenColor, bg: greenBg, items: ["Full-funnel LinkedIn campaigns", "PR and testimonials", "Educational webinars", "Email nurture sequences"] },
    { year: "2028+: International", color: amberColor, bg: amberBg, items: ["Localised content", "Region-specific webinars", "Industry partnerships"] }
  ];

  const promoColWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const promoColHeight = 60;

  promoYears.forEach((promo, idx) => {
    const xPos = margin + idx * (promoColWidth + spacing.gridGap);
    
    doc.setFillColor(...promo.bg);
    doc.roundedRect(xPos, yPosition, promoColWidth, promoColHeight, box.borderRadius, box.borderRadius, "F");
    
    doc.setTextColor(...promo.color);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(promo.year, xPos + box.paddingX, yPosition + 12);
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    let promoY = yPosition + 24;
    promo.items.forEach((item) => {
      doc.text("- " + item, xPos + box.paddingX, promoY);
      promoY += lineHeight.tight + 1;
    });
  });

  yPosition += promoColHeight + spacing.sectionGap;

  // SMART Promotional Targets
  fitPage(60);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Promotional Targets", margin, yPosition);
  yPosition += lineHeight.body + spacing.paragraphGap;

  const smartTargets = [
    { period: "By Q4 2026", color: blueColor, targets: ["20% awareness lift", "500+ qualified contacts", "15% demo to pilot conversion"] },
    { period: "By 2027", color: greenColor, targets: ["Predictable acquisition funnel", "10+ educational assets", "5-10% sign-up intent uplift"] },
    { period: "By 2028", color: amberColor, targets: ["Localised content (2 markets)", "2-3 regional partnerships", "Global awareness benchmarks"] }
  ];

  const smartColWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const smartColHeight = 55;

  smartTargets.forEach((target, idx) => {
    const xPos = margin + idx * (smartColWidth + spacing.gridGap);
    
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(xPos, yPosition, smartColWidth, smartColHeight, box.borderRadius, box.borderRadius, "F");
    
    doc.setTextColor(...target.color);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(target.period, xPos + smartColWidth / 2, yPosition + 12, { align: "center" });
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    let targetY = yPosition + 24;
    target.targets.forEach((t) => {
      doc.text(t, xPos + smartColWidth / 2, targetY, { align: "center" });
      targetY += lineHeight.tight + 1;
    });
  });

  yPosition += smartColHeight + spacing.sectionGap;

  // Communication Voice
  fitPage(25);
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "italic");
  doc.text("Communication voice: calm, wise, factual, and reassuring - consistent with Hobson's Sage archetype.", margin, yPosition);
  yPosition += lineHeight.body + spacing.sectionGap;

  // Supporting Strategies: People, Process, Physical Evidence (New Page)
  startNewPage("Supporting Strategies");

  fitPage(40);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Supporting Strategies", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  // 3-column for People, Process, Physical Evidence
  const suppColWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const suppColHeight = 75;

  const supportingStrategies = [
    {
      title: "People Strategy",
      items: ["Founder-led interaction during pilots", "Supportive, helpful tone throughout", "Future customer success with Sage qualities"]
    },
    {
      title: "Process Strategy",
      subtitle: "Delivering the promised simplicity:",
      items: ["Minimal steps: upload to answer", "Transparent citations reduce uncertainty", "Clear feedback loops with pilots"]
    },
    {
      title: "Physical Evidence",
      subtitle: "Digital cues that reinforce trust:",
      items: ["Consistent purple colour palette", "Owl mascot as wisdom symbol", "HUE coin for engagement", "Professional, citation-focused UI"]
    }
  ];

  supportingStrategies.forEach((strat, idx) => {
    const xPos = margin + idx * (suppColWidth + spacing.gridGap);
    
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPosition, suppColWidth, suppColHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(xPos, yPosition, suppColWidth, suppColHeight, box.borderRadius, box.borderRadius, "S");
    
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(strat.title, xPos + box.paddingX, yPosition + 12);
    
    let suppY = yPosition + 22;
    if (strat.subtitle) {
      doc.setTextColor(...PDF_CONFIG.textGray);
      doc.setFontSize(PDF_CONFIG.fontSize.small);
      doc.setFont("helvetica", "normal");
      doc.text(strat.subtitle, xPos + box.paddingX, suppY);
      suppY += 10;
    }
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    strat.items.forEach((item) => {
      doc.text("- " + item, xPos + box.paddingX, suppY);
      suppY += lineHeight.tight + 2;
    });
  });

  yPosition += suppColHeight + spacing.sectionGap;

  // Strategic Summary
  fitPage(50);
  const summaryText = "Build trust first during 2026, momentum and commercial traction during 2027, and international reach from 2028 onward. This supports Hobson's long-term goal of becoming the recognised global category leader in AI-powered document intelligence for Real Estate.";
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  const summaryLines = splitTextWithFont(doc, summaryText, maxWidth - box.paddingX * 2, "body", false);
  const summaryHeight = summaryLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom + 10;
  
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Strategic Summary", margin + box.paddingX, yPosition + box.paddingTop);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(summaryLines, margin + box.paddingX, yPosition + box.paddingTop + 14, { lineHeightFactor: lineHeightFactor.tight });
  
  yPosition += summaryHeight + spacing.sectionGap;

  return yPosition;
};

/**
 * Render Strategic Context & Positioning visual
 */
const renderStrategicContextPositioning = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, lineHeightFactor, spacing, box } = PDF_CONFIG;

  const fitPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header
  const headerHeight = spacing.contentPadding + lineHeight.body + lineHeight.body + spacing.contentPadding;
  fitPage(headerHeight);
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Strategic Context & Positioning", margin + box.paddingX, yPosition + spacing.contentPadding);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("From UK MVP validation to global market entry", margin + box.paddingX, yPosition + spacing.contentPadding + lineHeight.loose);
  
  yPosition += headerHeight + spacing.sectionGap;

  // Overview
  fitPage(45);
  const overviewText = "Hobson's targeting and segmentation strategy guides the organisation from early MVP validation in the UK to scalable commercial expansion and global market entry.";
  
  doc.setFillColor(248, 250, 252);
  const overviewLines = splitTextWithFont(doc, overviewText, maxWidth - box.paddingX * 2, "body", false);
  const overviewHeight = overviewLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom;
  
  doc.roundedRect(margin, yPosition, maxWidth, overviewHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(box.borderWidthThin);
  doc.roundedRect(margin, yPosition, maxWidth, overviewHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(overviewLines, margin + box.paddingX, yPosition + box.paddingTop, { lineHeightFactor: lineHeightFactor.body });
  
  yPosition += overviewHeight + spacing.sectionGap;

  // Strategy Foundation
  fitPage(60);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Strategy Foundation", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const foundations = [
    "Real discovery work",
    "Observed behavioural patterns",
    "Industry adoption dynamics",
    "Calm, intelligent guide positioning"
  ];

  const foundationWidth = (maxWidth - spacing.gridGap) / 2;
  const foundationHeight = 28;

  foundations.forEach((item, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const xPos = margin + col * (foundationWidth + spacing.gridGap);
    const yPos = yPosition + row * (foundationHeight + spacing.gridGap);

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPos, foundationWidth, foundationHeight, box.borderRadius, box.borderRadius, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "normal");
    doc.text(item, xPos + box.paddingX, yPos + 17);
  });

  yPosition += (foundationHeight * 2) + spacing.gridGap + spacing.sectionGap;

  // High-Level Positioning
  fitPage(40);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("High-Level Positioning", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const positionText = "Hobson is positioned as the clarity engine for Real Estate - simple, intelligent, and trustworthy.";
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  const positionLines = splitTextWithFont(doc, positionText, maxWidth - box.paddingX * 2, "body", false);
  const positionHeight = positionLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom;
  
  doc.roundedRect(margin, yPosition, maxWidth, positionHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, positionHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(positionLines, margin + box.paddingX, yPosition + box.paddingTop, { lineHeightFactor: lineHeightFactor.body });
  
  yPosition += positionHeight + spacing.sectionGap;

  // Marketing Mix
  fitPage(55);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Marketing Mix Reinforcement", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const mixItems = [
    { element: "Brand Identity", value: "Calm presence" },
    { element: "Product Design", value: "Lightweight" },
    { element: "Pricing", value: "Accessible" },
    { element: "Promotion", value: "Educational" },
  ];

  const mixWidth = (maxWidth - spacing.gridGap * 3) / 4;
  const mixHeight = 38;

  mixItems.forEach((item, idx) => {
    const xPos = margin + idx * (mixWidth + spacing.gridGap);

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(xPos, yPosition, mixWidth, mixHeight, box.borderRadius, box.borderRadius, "F");
    
    // Left border
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(xPos, yPosition, 3, mixHeight, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(item.element, xPos + box.paddingX, yPosition + 14);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(item.value, xPos + box.paddingX, yPosition + 26);
  });

  yPosition += mixHeight + spacing.sectionGap;

  // Commercial Pathway
  fitPage(40);
  const pathwayText = "Together, these elements create a coherent commercial pathway from early UK validation to international expansion by 2028-2030.";
  
  doc.setFillColor(240, 253, 244);
  const pathwayLines = splitTextWithFont(doc, pathwayText, maxWidth - box.paddingX * 2, "body", false);
  const pathwayHeight = pathwayLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom + 10;
  
  doc.roundedRect(margin, yPosition, maxWidth, pathwayHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(134, 239, 172);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, pathwayHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Commercial Pathway", margin + box.paddingX, yPosition + box.paddingTop);
  
  doc.setTextColor(21, 128, 61);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(pathwayLines, margin + box.paddingX, yPosition + box.paddingTop + 12, { lineHeightFactor: lineHeightFactor.tight });
  
  yPosition += pathwayHeight + spacing.sectionGap;

  // NEW: Segmentation Strategy Section
  doc.addPage();
  yPosition = margin;

  // Segmentation Strategy Header
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Segmentation Strategy (UK, 2024-2027)", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  // Core Drivers
  const driversText = "Segmentation is based on four core drivers:";
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(driversText, margin, yPosition);
  yPosition += lineHeight.body + spacing.paragraphGap;

  const drivers = [
    "Document volume",
    "Workflow complexity",
    "Decision-making structure",
    "Psychographic orientation (VALS)"
  ];

  const driverWidth = (maxWidth - spacing.gridGap) / 2;
  const driverHeight = 28;

  drivers.forEach((driver, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + col * (driverWidth + spacing.gridGap);
    const yPos = yPosition + row * (driverHeight + spacing.gridGap);
    
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPos, driverWidth, driverHeight, box.borderRadius, box.borderRadius, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(driver, xPos + box.paddingX, yPos + 17);
  });

  yPosition += (driverHeight + spacing.gridGap) * 2;

  // Three Customer Segments
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text("Hobson serves three actionable customer groups, validated through MVP discovery:", margin, yPosition);
  yPosition += lineHeight.body + spacing.sectionGap;

  const segments = [
    {
      title: "Segment 1: Large Portfolio Operators",
      characteristics: "High administrative load, multiple systems, compliance risk, slow information retrieval.",
      vals: "Achievers, Thinkers who value reliability, accuracy, and professional competence.",
      why: "High-value accounts with strong long-term retention potential."
    },
    {
      title: "Segment 2: Medium Real Estate Companies",
      characteristics: "Fast-paced, agile, scaling portfolios; information scattered across drives and emails.",
      vals: "Strivers, Innovators who value simplicity, speed, and practical tools.",
      why: "Quick adopters of lightweight AI tools with minimal friction."
    },
    {
      title: "Segment 3: Small Firms & Owner-Managers",
      characteristics: "Limited time, minimal tech stack, fragmented document handling.",
      vals: "Makers, Survivors that value timesaving, stress reduction, clarity.",
      why: "Large volume of potential customers and the lowest barriers to use."
    }
  ];

  segments.forEach((segment) => {
    fitPage(75);
    
    // Segment card
    const segmentCardHeight = 70;
    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(margin, yPosition, maxWidth, segmentCardHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(...PDF_CONFIG.primaryLight);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(margin, yPosition, maxWidth, segmentCardHeight, box.borderRadius, box.borderRadius, "S");
    
    // Title
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(segment.title, margin + box.paddingX, yPosition + 12);
    
    // Characteristics
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text("Characteristics: ", margin + box.paddingX, yPosition + 26);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    const charLines = splitTextWithFont(doc, segment.characteristics, maxWidth - box.paddingX * 2 - 50, "caption", false);
    doc.text(charLines, margin + box.paddingX + 50, yPosition + 26);
    
    // VALS Profile
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text("VALS Profile: ", margin + box.paddingX, yPosition + 40);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_CONFIG.textGray);
    const valsLines = splitTextWithFont(doc, segment.vals, maxWidth - box.paddingX * 2 - 45, "caption", false);
    doc.text(valsLines, margin + box.paddingX + 45, yPosition + 40);
    
    // Why Segment Matters
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text("Why Segment Matters: ", margin + box.paddingX, yPosition + 58);
    doc.setFont("helvetica", "normal");
    doc.text(segment.why, margin + box.paddingX + 70, yPosition + 58);
    
    yPosition += segmentCardHeight + spacing.gridGap;
  });

  // MVP Findings note
  fitPage(30);
  const mvpNote = "This segmentation reflects our MVP findings: the core pain, \"information is too hard to find,\" is universal, but the intensity and business value differ by segment.";
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "italic");
  const mvpLines = splitTextWithFont(doc, mvpNote, maxWidth, "caption", false);
  doc.text(mvpLines, margin, yPosition, { lineHeightFactor: lineHeightFactor.body });
  yPosition += mvpLines.length * (lineHeight.body * lineHeightFactor.body) + spacing.sectionGap;

  // Core Insight
  fitPage(50);
  const insightText = "Across all segments, the underlying pain is identical - \"Information is too hard to find\". What varies is the intensity of pain and the commercial value of resolving it, which determines prioritisation and revenue weighting.";
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  const insightLines = splitTextWithFont(doc, insightText, maxWidth - box.paddingX * 2, "body", false);
  const insightHeight = insightLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom + 10;
  
  doc.roundedRect(margin, yPosition, maxWidth, insightHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, insightHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Core Insight", margin + box.paddingX, yPosition + box.paddingTop);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(insightLines, margin + box.paddingX, yPosition + box.paddingTop + 14, { lineHeightFactor: lineHeightFactor.tight });
  
  yPosition += insightHeight + spacing.sectionGap;

  // Mindset-Based Targeting
  doc.addPage();
  yPosition = margin;

  // Header
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, spacing.contentBoxStart + spacing.sectionGap, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, spacing.contentBoxStart + spacing.sectionGap, box.borderRadius, box.borderRadius, "S");

  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.circle(margin + spacing.circleOffset, yPosition + spacing.sectionGap, PDF_CONFIG.circleSize.medium, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Mindset-Based Targeting", margin + spacing.bulletTextOffset, yPosition + spacing.sectionGap + fontSize.sectionTitle / 3);

  const mindsetIntro = "Strategic targeting aligns with our consumer attitude model, where customers progress through:";
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text(mindsetIntro, margin + spacing.bulletTextOffset, yPosition + spacing.sectionGap + fontSize.sectionTitle + spacing.paragraphGap);
  
  yPosition += spacing.contentBoxStart + spacing.sectionGap + spacing.sectionGap;

  // Funnel stages - horizontal flow
  const stages = ["Awareness", "Consideration", "Liking", "Conversion"];
  const stageWidth = (maxWidth - (stages.length - 1) * spacing.sectionGap) / stages.length;
  const stageHeight = spacing.contentBoxStart;

  stages.forEach((stage, idx) => {
    const xPos = margin + idx * (stageWidth + spacing.sectionGap);
    
    // Stage bubble with gradient effect
    if (idx === stages.length - 1) {
      doc.setFillColor(...PDF_CONFIG.primaryColor);
    } else {
      doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
    }
    doc.roundedRect(xPos, yPosition, stageWidth, stageHeight, box.borderRadius, box.borderRadius, "F");
    
    if (idx === stages.length - 1) {
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setTextColor(...PDF_CONFIG.primaryColor);
    }
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(stage, xPos + stageWidth / 2, yPosition + stageHeight / 2 + fontSize.bodySmall / 3, { align: "center" });
    
    // Arrow between stages
    if (idx < stages.length - 1) {
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.setFontSize(fontSize.body);
      doc.text("→", xPos + stageWidth + spacing.sectionGap / 2 - 3, yPosition + stageHeight / 2 + 1);
    }
  });

  yPosition += stageHeight + spacing.sectionGap;

  // Stage details - 2x2 grid with proper text wrapping
  const stageDetails = [
    { stage: "Awareness", desc: "Learning that Hobson exists", channel: "LinkedIn + thought leadership" },
    { stage: "Consideration", desc: "Understanding what Hobson does", channel: "Website clarity, demos, video explainers" },
    { stage: "Liking", desc: "Emotional trust & brand connection", channel: "Hobson quiz, brand storytelling, case studies" },
    { stage: "Conversion", desc: "Requesting a demo or pilot", channel: "Retargeting, email, onboarding flows" },
  ];

  const detailWidth = (maxWidth - spacing.gridGap) / 2;
  const detailHeight = spacing.contentBoxStart * 2 + spacing.paragraphGap;

  stageDetails.forEach((detail, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const xPos = margin + col * (detailWidth + spacing.gridGap);
    const yPos = yPosition + row * (detailHeight + spacing.paragraphGap);

    if (row === 0 && col === 0) {
      fitPage(detailHeight * 2 + spacing.paragraphGap);
    }

    // Card background
    doc.setFillColor(...PDF_CONFIG.bgLight);
    doc.roundedRect(xPos, yPos, detailWidth, detailHeight, box.borderRadius, box.borderRadius, "F");
    
    // Left accent bar
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(xPos, yPos + box.borderRadius, box.borderRadius, detailHeight - box.borderRadius * 2, "F");

    // Stage title
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(detail.stage, xPos + box.paddingX + spacing.paragraphGap, yPos + box.paddingTop + fontSize.bodySmall);

    // Description
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(detail.desc, xPos + box.paddingX + spacing.paragraphGap, yPos + box.paddingTop + fontSize.bodySmall + lineHeight.body + spacing.paragraphGap);

    // Channel with arrow - wrap if needed
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    const channelText = "→ " + detail.channel;
    const channelLines = splitTextWithFont(doc, channelText, detailWidth - box.paddingX * 2, "caption", false);
    let channelY = yPos + box.paddingTop + fontSize.bodySmall + lineHeight.body * 2 + spacing.paragraphGap;
    channelLines.forEach((line: string) => {
      doc.text(line, xPos + box.paddingX + spacing.paragraphGap, channelY);
      channelY += lineHeight.tight;
    });
  });

  yPosition += (detailHeight * 2) + spacing.paragraphGap + spacing.sectionGap;

  // Trust-First Approach
  fitPage(45);
  const trustText = "This mindset-first approach ensures that Hobson builds trust before asking for adoption, which is essential in risk-sensitive sectors such as real estate.";
  
  doc.setFillColor(240, 253, 244);
  const trustLines = splitTextWithFont(doc, trustText, maxWidth - box.paddingX * 2, "body", false);
  const trustHeight = trustLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom + 10;
  
  doc.roundedRect(margin, yPosition, maxWidth, trustHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(134, 239, 172);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, trustHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Trust-First Approach", margin + box.paddingX, yPosition + box.paddingTop);
  
  doc.setTextColor(21, 128, 61);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(trustLines, margin + box.paddingX, yPosition + box.paddingTop + 12, { lineHeightFactor: lineHeightFactor.tight });
  
  yPosition += trustHeight + spacing.sectionGap;

  return yPosition;
};

/**
 * Render Organisational Positioning visual (comprehensive positioning strategy)
 */
const renderOrganisationalPositioning = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, lineHeightFactor, spacing, box } = PDF_CONFIG;

  const fitPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header
  const headerHeight = spacing.contentPadding + lineHeight.body + lineHeight.body + spacing.contentPadding;
  fitPage(headerHeight);
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Organisational Positioning", margin + box.paddingX, yPosition + spacing.contentPadding);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Strategic positioning for Real Estate professionals", margin + box.paddingX, yPosition + spacing.contentPadding + lineHeight.loose);
  
  yPosition += headerHeight + spacing.sectionGap;

  // Overview
  fitPage(50);
  const overviewText = "Hobson's long-term positioning centres on supporting Real Estate professionals with an intelligence layer that enhances the systems they already use. The goal is to be recognised for delivering reliable document insight without requiring significant operational change.";
  
  doc.setFillColor(248, 250, 252);
  const overviewLines = splitTextWithFont(doc, overviewText, maxWidth - box.paddingX * 2, "body", false);
  const overviewHeight = overviewLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom;
  
  doc.roundedRect(margin, yPosition, maxWidth, overviewHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(box.borderWidthThin);
  doc.roundedRect(margin, yPosition, maxWidth, overviewHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(overviewLines, margin + box.paddingX, yPosition + box.paddingTop, { lineHeightFactor: lineHeightFactor.body });
  
  yPosition += overviewHeight + spacing.sectionGap;

  // Strategic Positioning Vision
  fitPage(60);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Strategic Positioning Vision", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const visionText = "Hobson will be positioned as a practical, document-focused AI assistant that helps teams work faster and make decisions with clearer information. The emphasis is on complementing, not replacing, existing workflows. As the product matures, positioning will expand from retrieval to broader insight and guidance.";
  
  doc.setFillColor(248, 250, 252);
  const visionLines = splitTextWithFont(doc, visionText, maxWidth - box.paddingX * 2, "body", false);
  const visionHeight = visionLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom;
  
  doc.roundedRect(margin, yPosition, maxWidth, visionHeight, box.borderRadius, box.borderRadius, "F");
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(visionLines, margin + box.paddingX, yPosition + box.paddingTop, { lineHeightFactor: lineHeightFactor.body });
  
  yPosition += visionHeight + spacing.sectionGap;

  // Positioning Principles
  fitPage(80);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Positioning Principles", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const principles = [
    { title: "Direct Clarity", desc: "Answers that reduce effort and uncertainty" },
    { title: "Reliability", desc: "Outputs that users can treat as dependable inputs to their work" },
    { title: "Low Friction", desc: "A tool that is simple to adopt and easy to maintain" },
    { title: "Supportive Role", desc: "An assistant that fits around current systems and processes" },
  ];

  const principleWidth = (maxWidth - spacing.gridGap) / 2;
  const principleHeight = 32;

  principles.forEach((principle, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const xPos = margin + col * (principleWidth + spacing.gridGap);
    const yPos = yPosition + row * (principleHeight + spacing.gridGap);

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPos, principleWidth, principleHeight, box.borderRadius, box.borderRadius, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(principle.title, xPos + box.paddingX, yPos + 12);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(principle.desc, xPos + box.paddingX, yPos + 22);
  });

  yPosition += (principleHeight * 2) + spacing.gridGap + spacing.sectionGap;

  // How Users Should Understand Hobson
  fitPage(60);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("How Users Should Understand Hobson", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const userUnderstanding = [
    "Helps them locate information quickly",
    "Reduces the effort required in manual document review",
    "Provides outputs that support confident decision-making",
  ];

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition, maxWidth, 40, box.borderRadius, box.borderRadius, "F");
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.rect(margin, yPosition, 3, 40, "F");

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  doc.text("Across user groups, Hobson should be understood as a tool that:", margin + box.paddingX, yPosition + 10);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  userUnderstanding.forEach((item, idx) => {
    doc.text("- " + item, margin + box.paddingX, yPosition + 20 + idx * lineHeight.body);
  });

  yPosition += 45 + spacing.sectionGap;

  // Positioning Across Customer Journey
  fitPage(60);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Positioning Across the Customer Journey", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const journeyStages = [
    { stage: "Awareness", desc: "A practical AI option built for property operations", color: [59, 130, 246] as [number, number, number] },
    { stage: "Consideration", desc: "A simple way to access document insight quickly", color: [168, 85, 247] as [number, number, number] },
    { stage: "Conversion", desc: "A low-effort tool suitable for pilot use", color: [34, 197, 94] as [number, number, number] },
    { stage: "Retention", desc: "A dependable part of recurring workflows", color: [245, 158, 11] as [number, number, number] },
  ];

  const stageWidth = (maxWidth - spacing.gridGap * 3) / 4;
  const stageHeight = 45;

  journeyStages.forEach((stage, idx) => {
    const xPos = margin + idx * (stageWidth + spacing.gridGap);

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(xPos, yPosition, stageWidth, stageHeight, box.borderRadius, box.borderRadius, "F");

    doc.setTextColor(...stage.color);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(stage.stage, xPos + 4, yPosition + 12);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, stage.desc, stageWidth - 8, "caption", false);
    doc.text(descLines, xPos + 4, yPosition + 22, { lineHeightFactor: lineHeightFactor.tight });
  });

  yPosition += stageHeight + spacing.sectionGap;

  // Strategic Advantages
  fitPage(55);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Strategic Advantages of the Positioning", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const advantages = [
    { title: "1. Clear Category Definition", desc: "Focus on document intelligence avoids overlap with leasing automation" },
    { title: "2. Low-Resistance Adoption", desc: "Enhancing existing tools reduces organisational barriers" },
    { title: "3. Scalable Narrative", desc: "Positioning can expand naturally from retrieval to insight" },
  ];

  const advantageWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const advantageHeight = 40;

  advantages.forEach((adv, idx) => {
    const xPos = margin + idx * (advantageWidth + spacing.gridGap);

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(xPos, yPosition, advantageWidth, advantageHeight, box.borderRadius, box.borderRadius, "F");
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.rect(xPos, yPosition, 3, advantageHeight, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(adv.title, xPos + box.paddingX, yPosition + 12);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "normal");
    const descLines = splitTextWithFont(doc, adv.desc, advantageWidth - box.paddingX * 2, "caption", false);
    doc.text(descLines, xPos + box.paddingX, yPosition + 22, { lineHeightFactor: lineHeightFactor.tight });
  });

  yPosition += advantageHeight + spacing.sectionGap;

  // Global Positioning Direction
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Global Positioning Direction (2028-2030)", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, yPosition, maxWidth, 40, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(134, 239, 172);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 40, box.borderRadius, box.borderRadius, "S");

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  doc.text("As Hobson enters additional markets, the positioning will scale to:", margin + box.paddingX, yPosition + 10);

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "bolditalic");
  doc.text("\"Hobson is a reliable AI assistant for Real Estate infrastructure management.\"", margin + box.paddingX, yPosition + 22);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  doc.text("This creates a consistent global identity that can adapt to local regulations and workflows.", margin + box.paddingX, yPosition + 32);

  yPosition += 45 + spacing.sectionGap;

  // SMART Positioning Objectives
  fitPage(90);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Positioning Objectives (2025-2030)", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const smartObjectives = [
    { year: "2025", title: "Positioning Framework", desc: "Publish complete, scalable positioning framework by Q4 2025" },
    { year: "2026", title: "Brand Recognition", desc: "Improve brand recall by 20% by Q4 2026" },
    { year: "2027", title: "Industry Credibility", desc: "Appear in two respected industry reports by Q4 2027" },
    { year: "2028", title: "Category Definition", desc: "Establish 'document intelligence assistant' as recognised category term" },
    { year: "2029", title: "Global Consistency", desc: "Achieve consistent brand positioning across UK, EU, and US markets" },
  ];

  smartObjectives.forEach((obj, idx) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, yPosition, maxWidth, 14, 2, 2, "F");

    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.roundedRect(margin + 4, yPosition + 3, 24, 8, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_CONFIG.fontSize.tiny);
    doc.setFont("helvetica", "bold");
    doc.text(obj.year, margin + 10, yPosition + 8);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    doc.text(obj.title + ":", margin + 32, yPosition + 9);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    doc.text(obj.desc, margin + 75, yPosition + 9);

    yPosition += 16;
  });

  yPosition += spacing.sectionGap;

  // Positioning Vision Summary
  fitPage(40);
  const summaryText = "Hobson is the accessible intelligence layer for Real Estate teams. It creates room for product evolution, supports commercial adoption, and offers a stable message for the UK and future international markets.";
  
  doc.setFillColor(...PDF_CONFIG.primaryBgMedium);
  const summaryLines = splitTextWithFont(doc, summaryText, maxWidth - box.paddingX * 2, "body", false);
  const summaryHeight = summaryLines.length * (lineHeight.body * lineHeightFactor.body) + box.paddingTop + box.paddingBottom + 10;
  
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, summaryHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Positioning Vision Summary", margin + box.paddingX, yPosition + box.paddingTop);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "normal");
  doc.text(summaryLines, margin + box.paddingX, yPosition + box.paddingTop + 12, { lineHeightFactor: lineHeightFactor.body });
  
  yPosition += summaryHeight + spacing.sectionGap;

  // UK Targeting Strategy
  doc.addPage();
  yPosition = margin;

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("UK Targeting Strategy (2025-2027)", margin, yPosition);
  yPosition += lineHeight.loose + spacing.sectionGap;

  // Phase 1
  fitPage(70);
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margin, yPosition, maxWidth, 60, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(191, 219, 254);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 60, box.borderRadius, box.borderRadius, "S");

  doc.setFillColor(59, 130, 246);
  doc.circle(margin + 12, yPosition + 12, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("1", margin + 10, yPosition + 14);

  doc.setTextColor(29, 78, 216);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Phase 1: Validation & MVP Readiness (Q1 2026)", margin + 22, yPosition + 14);

  doc.setTextColor(59, 130, 246);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  doc.text("Target: Existing partners and up to 5 new non-paying pilot organisations", margin + 22, yPosition + 24);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  const phase1Items = ["Finalise the MVP for Q1 2026", "Build trust through early testing", "Validate accuracy, referencing, and core workflows"];
  phase1Items.forEach((item, idx) => {
    doc.text("- " + item, margin + 22, yPosition + 34 + idx * 6);
  });

  doc.setTextColor(29, 78, 216);
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  doc.setFont("helvetica", "italic");
  doc.text("Brand Role: Hobson acts as the Sage, a calm, intelligent guide helping teams see through document complexity.", margin + 8, yPosition + 54);

  yPosition += 65 + spacing.cardGap;

  // Phase 2
  fitPage(70);
  doc.setFillColor(250, 245, 255);
  doc.roundedRect(margin, yPosition, maxWidth, 60, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(221, 214, 254);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 60, box.borderRadius, box.borderRadius, "S");

  doc.setFillColor(168, 85, 247);
  doc.circle(margin + 12, yPosition + 12, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("2", margin + 10, yPosition + 14);

  doc.setTextColor(126, 34, 206);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Phase 2: Pilot Expansion & Evidence Building (Q2-Q3 2026)", margin + 22, yPosition + 14);

  doc.setTextColor(168, 85, 247);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  doc.text("Target: Medium-sized Real Estate firms, small professional portfolios, selective large operators", margin + 22, yPosition + 24);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  const phase2Items = ["Reach 10 active pilot organisations", "Produce segment-specific proof points and case studies", "Convert 3-5 pilots to paid accounts"];
  phase2Items.forEach((item, idx) => {
    doc.text("- " + item, margin + 22, yPosition + 34 + idx * 6);
  });

  doc.setTextColor(126, 34, 206);
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  doc.setFont("helvetica", "italic");
  doc.text("Brand Role: A trusted, lightweight companion that delivers clarity without requiring system change.", margin + 8, yPosition + 54);

  yPosition += 65 + spacing.cardGap;

  // Phase 3
  fitPage(70);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, yPosition, maxWidth, 60, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(187, 247, 208);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, 60, box.borderRadius, box.borderRadius, "S");

  doc.setFillColor(34, 197, 94);
  doc.circle(margin + 12, yPosition + 12, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("3", margin + 10, yPosition + 14);

  doc.setTextColor(21, 128, 61);
  doc.setFontSize(fontSize.body);
  doc.setFont("helvetica", "bold");
  doc.text("Phase 3: Commercialisation & UK Market Entry (2027)", margin + 22, yPosition + 14);

  doc.setTextColor(34, 197, 94);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  doc.text("Target: Pilot-to-paid conversions and new inbound paying customers", margin + 22, yPosition + 24);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  const phase3Items = ["Launch public website and onboarding flows in Q1 2027", "Establish predictable acquisition -> activation -> retention funnels", "Build the ARR foundation for scale"];
  phase3Items.forEach((item, idx) => {
    doc.text("- " + item, margin + 22, yPosition + 34 + idx * 6);
  });

  doc.setTextColor(21, 128, 61);
  doc.setFontSize(PDF_CONFIG.fontSize.small);
  doc.setFont("helvetica", "italic");
  doc.text("Brand Role: A dependable, intelligent assistant that enhances existing systems.", margin + 8, yPosition + 54);

  yPosition += 65 + spacing.sectionGap;

  // Global Expansion Strategy
  fitPage(100);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Global Expansion Strategy (2028-2030)", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition, maxWidth, 85, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Grounded in verified market growth data:", margin + box.paddingX, yPosition + 10);

  // Stats row
  const statsData = [
    { value: "36.1%", label: "CAGR AI in Real Estate" },
    { value: "$1.8T", label: "Market by 2030" },
    { value: "10%+", label: "NOI improvements (McKinsey)" },
    { value: "49%", label: "Firms saving costs (Forbes)" },
  ];

  const statWidth = (maxWidth - box.paddingX * 2 - spacing.gridGap * 3) / 4;
  statsData.forEach((stat, idx) => {
    const xPos = margin + box.paddingX + idx * (statWidth + spacing.gridGap);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(xPos, yPosition + 15, statWidth, 18, 2, 2, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.statLarge);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, xPos + statWidth / 2, yPosition + 24, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.tiny);
    doc.setFont("helvetica", "normal");
    doc.text(stat.label, xPos + statWidth / 2, yPosition + 30, { align: "center" });
  });

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Global Targeting Priorities:", margin + box.paddingX, yPosition + 42);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  doc.text("- US & Canada - most mature Proptech ecosystems", margin + box.paddingX, yPosition + 50);
  doc.text("- EU (Germany, Netherlands, Nordics) - strong regulatory burden -> high document complexity", margin + box.paddingX, yPosition + 56);
  doc.text("- UAE & Singapore - fast adopters of digital-first property innovation", margin + box.paddingX, yPosition + 62);

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Global SMART Objectives (2028-2030):", margin + box.paddingX, yPosition + 72);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  doc.text("- Enter two international markets by 2028", margin + box.paddingX, yPosition + 80);
  doc.text("- Secure 10 global pilot clients by mid-2029", margin + box.paddingX + 70, yPosition + 80);

  yPosition += 90 + spacing.sectionGap;

  // SMART Objectives for UK Targeting
  fitPage(80);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("SMART Objectives for UK Targeting (2025-2027)", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const ukObjectives = [
    { stage: "Validation", period: "2025-Q1 2026", objective: "Secure five additional non-paying pilots by end of Q1 2026" },
    { stage: "User Satisfaction", period: "Q1-Q2 2026", objective: "Achieve 80%+ satisfaction by Q2 2026" },
    { stage: "Segment Representation", period: "Q2-Q3 2026", objective: "Activate at least one pilot in each core segment by Q3 2026" },
    { stage: "Messaging Frameworks", period: "Q3-Q4 2026", objective: "Develop fully segment-specific messaging by Q4 2026" },
    { stage: "Commercial Validation", period: "2027", objective: "Convert 3-5 pilot organisations into paying clients by Q3 2027" },
  ];

  ukObjectives.forEach((obj, idx) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, yPosition, maxWidth, 12, 2, 2, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "bold");
    doc.text(obj.stage, margin + 4, yPosition + 7);

    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(PDF_CONFIG.fontSize.tiny);
    doc.setFont("helvetica", "normal");
    doc.text(obj.period, margin + 50, yPosition + 7);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.text(obj.objective, margin + 75, yPosition + 7);

    yPosition += 14;
  });

  yPosition += spacing.sectionGap;

  // How This Targeting Strategy Supports Hobson's Goals
  fitPage(70);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("How This Targeting Strategy Supports Hobson's Goals", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const halfWidth = (maxWidth - spacing.gridGap) / 2;

  // Top-Level Benefits
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, halfWidth, 50, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Top-Level Organisational Benefits", margin + box.paddingX, yPosition + 10);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  const benefits = [
    "Reduced market risk through staged validation",
    "Strong proof-of-value before scaling",
    "Clear roadmap from MVP -> Pilot -> Paid -> Global",
    "Supports ARR, retention, and brand trust targets",
  ];
  benefits.forEach((item, idx) => {
    doc.text("- " + item, margin + box.paddingX, yPosition + 20 + idx * 7);
  });

  // Vision Alignment
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin + halfWidth + spacing.gridGap, yPosition, halfWidth, 50, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Mid- to Long-Term Vision Alignment", margin + halfWidth + spacing.gridGap + box.paddingX, yPosition + 10);

  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.caption);
  doc.setFont("helvetica", "normal");
  const visionItems = [
    "UK foundation -> scalable international model",
    "Clear positioning as 'AI that brings clarity'",
    "Alignment with global adoption curves and ROI",
  ];
  visionItems.forEach((item, idx) => {
    doc.text("- " + item, margin + halfWidth + spacing.gridGap + box.paddingX, yPosition + 20 + idx * 7);
  });

  yPosition += 55 + spacing.cardGap;

  // Digital Strategy Areas
  fitPage(45);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPosition, maxWidth, 35, box.borderRadius, box.borderRadius, "F");

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  doc.text("Supports Digital Strategy Areas", margin + box.paddingX, yPosition + 10);

  const strategyAreas = [
    { area: "Acquisition", desc: "Prioritises segments with highest pain" },
    { area: "Engagement", desc: "Persona-driven messaging + quiz" },
    { area: "Lead Gen", desc: "Clear segment funnels" },
    { area: "Conversion", desc: "Phased targeting reduces friction" },
    { area: "Growth", desc: "Base for global expansion" },
  ];

  const areaWidth = (maxWidth - box.paddingX * 2 - spacing.gridGap * 4) / 5;
  strategyAreas.forEach((item, idx) => {
    const xPos = margin + box.paddingX + idx * (areaWidth + spacing.gridGap);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(xPos, yPosition + 15, areaWidth, 16, 2, 2, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(PDF_CONFIG.fontSize.small);
    doc.setFont("helvetica", "bold");
    doc.text(item.area, xPos + areaWidth / 2, yPosition + 21, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.micro);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(item.desc, areaWidth - 4);
    doc.text(descLines[0], xPos + areaWidth / 2, yPosition + 27, { align: "center" });
  });

  yPosition += 40 + spacing.sectionGap;

  return yPosition;
};

/**
 * Render Acquisition Strategy Overview visual
 */
const renderAcquisitionStrategyOverview = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, lineHeightFactor, spacing, box, circleSize } = PDF_CONFIG;

  // Fit page helper
  const fitPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header
  const headerHeight = spacing.contentPadding + lineHeight.body + lineHeight.body + spacing.contentPadding;
  fitPage(headerHeight);
  
  doc.setFillColor(...PDF_CONFIG.primaryBgLight);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(...PDF_CONFIG.primaryLight);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Acquisition Strategy Overview", margin + box.paddingX, yPosition + spacing.contentPadding);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Targeted approach to customer acquisition in the property management sector", margin + box.paddingX, yPosition + spacing.contentPadding + lineHeight.loose);
  
  yPosition += headerHeight + spacing.sectionGap;

  // Acquisition Channels
  const channels = [
    { title: "Enterprise Sales", desc: "Direct outreach to property management companies with 50+ properties" },
    { title: "Strategic Partnerships", desc: "Collaborations with industry associations and PropTech vendors" },
    { title: "Content Marketing", desc: "Thought leadership through whitepapers, webinars, and case studies" },
    { title: "Referral Programs", desc: "Incentivised referrals from existing satisfied clients" },
  ];

  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Key Acquisition Channels", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const channelWidth = (maxWidth - spacing.gridGap) / 2;
  const channelHeight = 40;

  channels.forEach((channel, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    
    if (col === 0 && row > 0) {
      yPosition += channelHeight + spacing.cardGap;
    }
    
    if (col === 0) {
      fitPage(channelHeight);
    }

    const xPos = margin + col * (channelWidth + spacing.gridGap);
    const yPos = col === 0 ? yPosition : yPosition;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(xPos, yPos, channelWidth, channelHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(xPos, yPos, channelWidth, channelHeight, box.borderRadius, box.borderRadius, "S");

    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(xPos + spacing.circleOffset, yPos + 12, circleSize.medium, "F");

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(channel.title, xPos + spacing.bulletTextOffset, yPos + 12);

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(channel.desc, channelWidth - spacing.bulletTextOffset - box.paddingX);
    doc.text(descLines, xPos + spacing.bulletTextOffset, yPos + 22, { lineHeightFactor: lineHeightFactor.body });
  });

  yPosition += channelHeight + spacing.sectionGap;

  // Target Metrics
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Acquisition Targets", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const metrics = [
    { value: "100", label: "Pilot clients by Y1", sublabel: "Property managers" },
    { value: "15%", label: "Conversion rate", sublabel: "Lead to customer" },
    { value: "GBP 500", label: "CAC target", sublabel: "Cost per acquisition" },
  ];

  const metricWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const metricHeight = 45;

  metrics.forEach((metric, idx) => {
    const xPos = margin + idx * (metricWidth + spacing.gridGap);

    doc.setFillColor(...PDF_CONFIG.primaryBgLight);
    doc.roundedRect(xPos, yPosition, metricWidth, metricHeight, box.borderRadius, box.borderRadius, "F");

    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(fontSize.stat);
    doc.setFont("helvetica", "bold");
    doc.text(metric.value, xPos + metricWidth / 2, yPosition + 18, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(metric.label, xPos + metricWidth / 2, yPosition + 30, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(metric.sublabel, xPos + metricWidth / 2, yPosition + 38, { align: "center" });
  });

  yPosition += metricHeight + spacing.sectionGap;

  return yPosition;
};

/**
 * Render Sales Funnel visual
 */
const renderSalesFunnel = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, lineHeightFactor, spacing, box, circleSize } = PDF_CONFIG;

  const fitPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header
  const headerHeight = spacing.contentPadding + lineHeight.body + lineHeight.body + spacing.contentPadding;
  fitPage(headerHeight);
  
  doc.setFillColor(236, 254, 255);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(165, 243, 252);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(8, 145, 178);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Sales Funnel", margin + box.paddingX, yPosition + spacing.contentPadding);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("End-to-end customer journey from awareness to conversion", margin + box.paddingX, yPosition + spacing.contentPadding + lineHeight.loose);
  
  yPosition += headerHeight + spacing.sectionGap;

  // Funnel Stages
  const stages = [
    { stage: "Awareness", volume: "1,000", rate: "100%", activities: "Content marketing, industry events, SEO" },
    { stage: "Interest", volume: "300", rate: "30%", activities: "Webinars, whitepapers, email nurture" },
    { stage: "Consideration", volume: "100", rate: "33%", activities: "Demo requests, consultations" },
    { stage: "Intent", volume: "50", rate: "50%", activities: "Proposals, pilot programs" },
    { stage: "Conversion", volume: "15", rate: "30%", activities: "Contract negotiation, onboarding" },
  ];

  const stageHeight = 28;
  const tableWidth = maxWidth;
  const colWidths = [tableWidth * 0.15, tableWidth * 0.12, tableWidth * 0.1, tableWidth * 0.63];

  // Table header
  fitPage(stageHeight);
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, yPosition, tableWidth, stageHeight - 4, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "bold");
  
  let xPos = margin + box.paddingX;
  doc.text("Stage", xPos, yPosition + 10);
  xPos += colWidths[0];
  doc.text("Volume", xPos, yPosition + 10);
  xPos += colWidths[1];
  doc.text("Rate", xPos, yPosition + 10);
  xPos += colWidths[2];
  doc.text("Key Activities", xPos, yPosition + 10);
  
  yPosition += stageHeight - 4;

  // Table rows
  stages.forEach((stage, idx) => {
    fitPage(stageHeight);
    
    if (idx % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, yPosition, tableWidth, stageHeight - 4, "F");
    }

    doc.setFontSize(fontSize.bodySmall);
    xPos = margin + box.paddingX;
    
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(stage.stage, xPos, yPosition + 10);
    xPos += colWidths[0];
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFont("helvetica", "bold");
    doc.text(stage.volume, xPos, yPosition + 10);
    xPos += colWidths[1];
    
    doc.setTextColor(22, 163, 74);
    doc.setFont("helvetica", "normal");
    doc.text(stage.rate, xPos, yPosition + 10);
    xPos += colWidths[2];
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFont("helvetica", "normal");
    const actLines = doc.splitTextToSize(stage.activities, colWidths[3] - box.paddingX);
    doc.text(actLines[0], xPos, yPosition + 10);
    
    yPosition += stageHeight - 4;
  });

  yPosition += spacing.sectionGap;

  return yPosition;
};

/**
 * Render Lead Generation visual
 */
const renderLeadGeneration = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, lineHeightFactor, spacing, box, circleSize } = PDF_CONFIG;

  const fitPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header
  const headerHeight = spacing.contentPadding + lineHeight.body + lineHeight.body + spacing.contentPadding;
  fitPage(headerHeight);
  
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(134, 239, 172);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(22, 163, 74);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Lead Generation Strategy", margin + box.paddingX, yPosition + spacing.contentPadding);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Multi-channel approach to generating qualified leads", margin + box.paddingX, yPosition + spacing.contentPadding + lineHeight.loose);
  
  yPosition += headerHeight + spacing.sectionGap;

  // Lead Sources
  const sources = [
    { 
      channel: "Inbound Marketing", 
      percentage: "40%",
      tactics: ["SEO-optimised content", "Industry blog posts", "Webinar series", "Case studies"]
    },
    { 
      channel: "Outbound Sales", 
      percentage: "35%",
      tactics: ["Targeted email campaigns", "LinkedIn outreach", "Cold calling", "Industry events"]
    },
    { 
      channel: "Partnerships", 
      percentage: "25%",
      tactics: ["PropTech integrations", "Industry associations", "Referral programs", "Co-marketing"]
    },
  ];

  sources.forEach((source, idx) => {
    const sourceHeight = 50;
    fitPage(sourceHeight);

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, yPosition, maxWidth, sourceHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(margin, yPosition, maxWidth, sourceHeight, box.borderRadius, box.borderRadius, "S");

    // Channel name and percentage
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(source.channel, margin + box.paddingX, yPosition + 12);

    doc.setTextColor(22, 163, 74);
    doc.setFontSize(fontSize.sectionTitle);
    doc.setFont("helvetica", "bold");
    doc.text(source.percentage, margin + maxWidth - 30, yPosition + 12);

    // Tactics
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    
    let tacticX = margin + box.paddingX;
    source.tactics.forEach((tactic, tIdx) => {
      const tacticY = yPosition + 24 + Math.floor(tIdx / 2) * lineHeight.body;
      const tacticXPos = tacticX + (tIdx % 2) * (maxWidth / 2 - box.paddingX);
      
      doc.setFillColor(...PDF_CONFIG.primaryColor);
      doc.circle(tacticXPos, tacticY - 1, circleSize.bullet, "F");
      doc.text(tactic, tacticXPos + 4, tacticY);
    });

    yPosition += sourceHeight + spacing.cardGap;
  });

  yPosition += spacing.sectionGap;

  return yPosition;
};

/**
 * Render Conversion Strategy visual
 */
const renderConversionStrategy = (
  doc: jsPDF,
  startY: number,
  margin: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPosition = startY;
  const maxWidth = pageWidth - margin * 2;
  const { fontSize, lineHeight, lineHeightFactor, spacing, box, circleSize } = PDF_CONFIG;

  const fitPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - spacing.pageBreakMargin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header
  const headerHeight = spacing.contentPadding + lineHeight.body + lineHeight.body + spacing.contentPadding;
  fitPage(headerHeight);
  
  doc.setFillColor(254, 249, 195);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "F");
  doc.setDrawColor(253, 224, 71);
  doc.setLineWidth(box.borderWidth);
  doc.roundedRect(margin, yPosition, maxWidth, headerHeight, box.borderRadius, box.borderRadius, "S");
  
  doc.setTextColor(161, 98, 7);
  doc.setFontSize(fontSize.cardTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Conversion Strategy", margin + box.paddingX, yPosition + spacing.contentPadding);
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(fontSize.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.text("Optimising the path from prospect to paying customer", margin + box.paddingX, yPosition + spacing.contentPadding + lineHeight.loose);
  
  yPosition += headerHeight + spacing.sectionGap;

  // Conversion Steps
  const steps = [
    { step: "1", title: "Discovery Call", desc: "Understand pain points and document workflows" },
    { step: "2", title: "Product Demo", desc: "Tailored demonstration with client's actual documents" },
    { step: "3", title: "Pilot Program", desc: "30-day free trial with dedicated onboarding support" },
    { step: "4", title: "ROI Review", desc: "Quantify time savings and efficiency gains" },
    { step: "5", title: "Contract", desc: "Flexible pricing based on portfolio size" },
  ];

  const stepWidth = (maxWidth - spacing.gridGap * 4) / 5;
  const stepHeight = 70;

  fitPage(stepHeight);

  steps.forEach((step, idx) => {
    const xPos = margin + idx * (stepWidth + spacing.gridGap);

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(xPos, yPosition, stepWidth, stepHeight, box.borderRadius, box.borderRadius, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(box.borderWidthThin);
    doc.roundedRect(xPos, yPosition, stepWidth, stepHeight, box.borderRadius, box.borderRadius, "S");

    // Step number
    doc.setFillColor(...PDF_CONFIG.primaryColor);
    doc.circle(xPos + stepWidth / 2, yPosition + 15, circleSize.large, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text(step.step, xPos + stepWidth / 2, yPosition + 17, { align: "center" });

    // Title
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(step.title, stepWidth - 4);
    doc.text(titleLines, xPos + stepWidth / 2, yPosition + 32, { align: "center" });

    // Description
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(PDF_CONFIG.fontSize.tiny);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(step.desc, stepWidth - 6);
    doc.text(descLines, xPos + stepWidth / 2, yPosition + 45, { align: "center", lineHeightFactor: lineHeightFactor.body });
  });

  yPosition += stepHeight + spacing.sectionGap;

  // Key Conversion Metrics
  fitPage(50);
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(fontSize.sectionTitle);
  doc.setFont("helvetica", "bold");
  doc.text("Key Conversion Metrics", margin, yPosition);
  yPosition += lineHeight.loose + spacing.paragraphGap;

  const convMetrics = [
    { value: "30%", label: "Demo to Pilot", desc: "Conversion rate" },
    { value: "70%", label: "Pilot to Paid", desc: "After 30-day trial" },
    { value: "14 days", label: "Avg Sales Cycle", desc: "From demo to close" },
  ];

  const metricWidth = (maxWidth - spacing.gridGap * 2) / 3;
  const metricHeight = 45;

  convMetrics.forEach((metric, idx) => {
    const xPos = margin + idx * (metricWidth + spacing.gridGap);

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(xPos, yPosition, metricWidth, metricHeight, box.borderRadius, box.borderRadius, "F");

    doc.setTextColor(22, 163, 74);
    doc.setFontSize(fontSize.stat);
    doc.setFont("helvetica", "bold");
    doc.text(metric.value, xPos + metricWidth / 2, yPosition + 18, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(metric.label, xPos + metricWidth / 2, yPosition + 30, { align: "center" });

    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(fontSize.caption);
    doc.setFont("helvetica", "normal");
    doc.text(metric.desc, xPos + metricWidth / 2, yPosition + 38, { align: "center" });
  });

  yPosition += metricHeight + spacing.sectionGap;

  return yPosition;
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
    doc.setFontSize(PDF_CONFIG.fontSize.statLarge);
    doc.setFont("helvetica", "normal");
    const cleanedOverview = sanitizeText(tab.content.overview);
    
    // Split by double newlines for paragraphs
    const paragraphs = cleanedOverview.split('\n\n').filter(p => p.trim());
    const lineHeight = 6;
    const paragraphGap = 4;
    
    // Calculate total content height
    let totalContentHeight = 0;
    const allParagraphLines: string[][] = [];
    paragraphs.forEach((paragraph, idx) => {
      const lines = doc.splitTextToSize(paragraph.trim(), maxWidth - 16);
      allParagraphLines.push(lines);
      totalContentHeight += lines.length * lineHeight;
      if (idx < paragraphs.length - 1) {
        totalContentHeight += paragraphGap;
      }
    });
    
    const verticalPadding = 10;
    const boxHeight = totalContentHeight + verticalPadding * 2;
    
    doc.rect(margin, yPosition, maxWidth, boxHeight, "F");
    
    // Render paragraphs
    let overviewY = yPosition + verticalPadding + 4;
    allParagraphLines.forEach((lines, idx) => {
      lines.forEach((line: string) => {
        doc.text(line, margin + 8, overviewY);
        overviewY += lineHeight;
      });
      if (idx < allParagraphLines.length - 1) {
        overviewY += paragraphGap;
      }
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
    else if (componentType === "financialsExecutiveSummary") {
      yPosition = renderFinancialsExecutiveSummary(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "plGrowth") {
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
    // Marketing Strategy renderers
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
    } else if (componentType === "marketingObjectives") {
      yPosition = renderMarketingObjectives(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "brandStrategy") {
      yPosition = renderBrandStrategy(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "contentEngagementStrategy") {
      yPosition = renderContentEngagementStrategy(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "primaryConversionChannels") {
      yPosition = renderPrimaryConversionChannels(doc, yPosition, margin, pageWidth, pageHeight);
    }
    // Acquisition & Sales Strategy renderers
    else if (componentType === "acquisitionExecutiveSummary") {
      yPosition = renderAcquisitionExecutiveSummary(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "strategicContextPositioning") {
      yPosition = renderStrategicContextPositioning(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "segmentationStrategy") {
      yPosition = renderOrganisationalPositioning(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "theProposition") {
      yPosition = renderTheProposition(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "acquisitionStrategyOverview") {
      yPosition = renderAcquisitionStrategyOverview(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "salesFunnel") {
      yPosition = renderSalesFunnel(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "leadGeneration") {
      yPosition = renderLeadGeneration(doc, yPosition, margin, pageWidth, pageHeight);
    } else if (componentType === "conversionStrategy") {
      yPosition = renderConversionStrategy(doc, yPosition, margin, pageWidth, pageHeight);
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
          doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
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
            doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
            doc.setFont("helvetica", "normal");
            const linkText = "LinkedIn Profile";
            const linkY = finalYPos + 32;
            doc.text(linkText, xPos + cardWidth / 2, linkY, { align: "center" });
            const textWidth = doc.getTextWidth(linkText);
            doc.link(xPos + (cardWidth - textWidth) / 2, linkY - 3, textWidth, 4, { url: member.linkedin });
          } else {
            doc.setTextColor(...PDF_CONFIG.textLight);
            doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
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
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
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
  acquisitionSales: CardSection;
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
    cards.acquisitionSales,
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
  doc.setFontSize(PDF_CONFIG.fontSize.statLarge);
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
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}`, cardX + 8, cardY + 15);

    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(section.title, cardWidth - 35);
    doc.text(titleLines, cardX + 20, cardY + 15);

    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
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
    doc.setFontSize(PDF_CONFIG.fontSize.bodySmall);
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
