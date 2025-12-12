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
  textDark: [9, 9, 25] as [number, number, number],               // hsl(222.2 84% 4.9%) - foreground
  textGray: [100, 116, 139] as [number, number, number],          // hsl(215.4 16.3% 46.9%) - muted-foreground
  textLight: [148, 163, 184] as [number, number, number],         // lighter muted
  bgLight: [241, 245, 249] as [number, number, number],           // hsl(210 40% 96.1%) - muted bg
  bgWhite: [255, 255, 255] as [number, number, number],           // white
  border: [226, 232, 240] as [number, number, number],            // hsl(214.3 31.8% 91.4%) - border color
  headerBg: [245, 243, 255] as [number, number, number],          // primary/10 - light purple header
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
    // Special handling for competitor analysis - render as table
    if (componentType === "competitorAnalysis") {
      yPosition = renderCompetitorTable(doc, yPosition, margin, pageWidth, pageHeight);
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
