/**
 * Investor Summary PDF Generator
 * 
 * Architecture:
 * - One function per section type
 * - Each section is rendered on its own page
 * - This guarantees PDF content matches UI content exactly
 */

import { jsPDF } from "jspdf";

// PDF Configuration
const PDF_CONFIG = {
  margin: 20,
  primaryColor: [124, 58, 237] as [number, number, number],
  textDark: [31, 41, 55] as [number, number, number],
  textGray: [75, 85, 99] as [number, number, number],
  textLight: [107, 114, 128] as [number, number, number],
  bgLight: [249, 250, 251] as [number, number, number],
};

// Section types
export interface HeroSection {
  type: "hero";
  brandName: string;
  headline: string;
  highlightedHeadline: string;
  taglines: string[];
}

export interface PainSection {
  type: "pain";
  description: string;
  quote: string;
  conclusion: string[];
  callToAction: string;
}

export interface SolutionSection {
  type: "solution";
  title: string;
  problemStatement: string;
  response: string;
  keyMessage: string;
  features: string[];
  description: string;
}

export interface MagicSection {
  type: "magic";
  title: string;
  subtitle: string;
  underTheHood: string[];
  userMessage: string;
  benefits: string[];
  testimonial: string;
}

export interface MarketSection {
  type: "market";
  title: string;
  subtitle: string;
  stats: { value: string; label: string }[];
  tamExplanation: string;
  noItems: string[];
  positioning: string[];
  conclusion: string;
}

export interface BusinessModelSection {
  type: "businessModel";
  title: string;
  features: string[];
  metrics: { value: string; label: string }[];
  tagline: string;
  referralNote: string;
}

export interface RaiseSection {
  type: "raise";
  title: string;
  subtitle: string[];
  options: { amount: string; label: string; desc: string; recommended?: boolean }[];
  recommendation: { amount: string; description: string };
  closingStatement: string;
}

export interface ClosingSection {
  type: "closing";
  title: string;
  philosophy: string;
  pitch: string;
  brandName: string;
  callToAction: string;
  contactPrompt: string;
  contactEmail: string;
}

export type InvestorSummarySection =
  | HeroSection
  | PainSection
  | SolutionSection
  | MagicSection
  | MarketSection
  | BusinessModelSection
  | RaiseSection
  | ClosingSection;

/**
 * Sanitize text for PDF compatibility
 */
const sanitizeText = (text: string): string => {
  return text
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/•/g, "-")
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
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .trim();
};

/**
 * Render hero section
 */
const renderHeroSection = (doc: jsPDF, section: HeroSection, margin: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  
  // Brand name
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(section.brandName, centerX, 80, { align: "center" });
  
  // Main headline
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(section.headline, centerX, 110, { align: "center" });
  
  // Highlighted headline
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(36);
  doc.text(section.highlightedHeadline, centerX, 125, { align: "center" });
  
  // Taglines
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  let taglineY = 160;
  section.taglines.forEach((tagline) => {
    doc.text(sanitizeText(tagline), centerX, taglineY, { align: "center" });
    taglineY += 18;
  });
};

/**
 * Render pain section
 */
const renderPainSection = (doc: jsPDF, section: PainSection, margin: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = 60;
  
  // Description
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(sanitizeText(section.description), contentWidth);
  doc.text(descLines, margin, y);
  y += descLines.length * 7 + 15;
  
  // Quote box
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(...PDF_CONFIG.primaryColor);
  doc.rect(margin, y, contentWidth, 40, "FD");
  doc.setLineWidth(2);
  doc.line(margin, y, margin, y + 40);
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  const quoteLines = doc.splitTextToSize(sanitizeText(section.quote), contentWidth - 20);
  doc.text(quoteLines, margin + 10, y + 15);
  y += 55;
  
  // Conclusion lines
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  section.conclusion.forEach((line) => {
    doc.text(sanitizeText(line), margin, y);
    y += 12;
  });
  
  // Call to action
  y += 5;
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(section.callToAction), margin, y);
};

/**
 * Render solution section
 */
const renderSolutionSection = (doc: jsPDF, section: SolutionSection, margin: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const centerX = pageWidth / 2;
  let y = 50;
  
  // Title
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(section.title, centerX, y, { align: "center" });
  y += 25;
  
  // Problem statement
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(section.problemStatement), centerX, y, { align: "center" });
  y += 15;
  
  // Response (in red/destructive color)
  doc.setTextColor(220, 38, 38);
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  const responseLines = doc.splitTextToSize(sanitizeText(section.response), contentWidth - 40);
  doc.text(responseLines, centerX, y, { align: "center" });
  y += responseLines.length * 7 + 15;
  
  // Key message
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(section.keyMessage), centerX, y, { align: "center" });
  y += 30;
  
  // Features grid
  const featureWidth = (contentWidth - 20) / 2;
  let featureX = margin;
  let featureY = y;
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  section.features.forEach((feature, idx) => {
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(featureX, featureY, featureWidth, 25, 3, 3, "F");
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.text(sanitizeText(feature), featureX + featureWidth / 2, featureY + 15, { align: "center" });
    
    if (idx % 2 === 0) {
      featureX = margin + featureWidth + 20;
    } else {
      featureX = margin;
      featureY += 30;
    }
  });
  
  y = featureY + 40;
  
  // Description
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(sanitizeText(section.description), contentWidth);
  doc.text(descLines, centerX, y, { align: "center" });
};

/**
 * Render magic section
 */
const renderMagicSection = (doc: jsPDF, section: MagicSection, margin: number, owlImage?: string): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const centerX = pageWidth / 2;
  let y = 25;
  
  // Owl mascot at top (natural aspect ratio ~1:1.3 width:height)
  if (owlImage) {
    try {
      const owlWidth = 32;
      const owlHeight = 42; // Taller than wide for natural owl mascot proportions
      doc.addImage(owlImage, "PNG", centerX - owlWidth / 2, y, owlWidth, owlHeight);
      y += owlHeight + 8;
    } catch (e) {
      console.warn("Could not add owl image to PDF:", e);
    }
  }
  
  // Title
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(section.title, centerX, y, { align: "center" });
  y += 10;
  
  // Subtitle
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(18);
  doc.text(section.subtitle, centerX, y, { align: "center" });
  y += 25;
  
  // Under the hood box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, y, contentWidth, 35, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Under the hood", centerX, y + 8, { align: "center" });
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const hoodText = section.underTheHood.join(" -> ");
  doc.text(sanitizeText(hoodText), centerX, y + 22, { align: "center" });
  y += 45;
  
  // User message box
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.setDrawColor(...PDF_CONFIG.primaryColor);
  doc.rect(margin, y, 3, 30, "F");
  doc.setFillColor(249, 250, 251);
  doc.rect(margin + 3, y, contentWidth - 3, 30, "F");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("To the user", centerX, y + 10, { align: "center" });
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text(sanitizeText(section.userMessage), centerX, y + 22, { align: "center" });
  y += 40;
  
  // Benefits
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  section.benefits.forEach((benefit) => {
    const lines = doc.splitTextToSize(sanitizeText(benefit), contentWidth);
    doc.text(lines, centerX, y, { align: "center" });
    y += lines.length * 6 + 6;
  });
  
  y += 5;
  
  // Testimonial
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(section.testimonial), centerX, y, { align: "center" });
};

/**
 * Render market section
 */
const renderMarketSection = (doc: jsPDF, section: MarketSection, margin: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const centerX = pageWidth / 2;
  let y = 35;
  
  // Title
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(section.title), centerX, y, { align: "center" });
  y += 10;
  
  // Subtitle
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(section.subtitle), centerX, y, { align: "center" });
  y += 18;
  
  // Stats
  const statWidth = (contentWidth - 20) / section.stats.length;
  section.stats.forEach((stat, idx) => {
    const statX = margin + idx * (statWidth + 10);
    
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(statX, y, statWidth, 40, 3, 3, "F");
    
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(stat.value), statX + statWidth / 2, y + 18, { align: "center" });
    
    doc.setTextColor(...PDF_CONFIG.textGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const labelLines = doc.splitTextToSize(sanitizeText(stat.label), statWidth - 10);
    doc.text(labelLines, statX + statWidth / 2, y + 30, { align: "center" });
  });
  y += 48;
  
  // TAM explanation
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const tamLines = doc.splitTextToSize(sanitizeText(section.tamExplanation), contentWidth);
  doc.text(tamLines, centerX, y, { align: "center" });
  y += tamLines.length * 5 + 12;
  
  // "There is:" items
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, y, contentWidth, 42, 3, 3, "F");
  
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(8);
  doc.text("There is:", centerX, y + 8, { align: "center" });
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  let itemY = y + 18;
  const itemWidth = contentWidth / 2 - 10;
  section.noItems.forEach((item, idx) => {
    const itemX = margin + 10 + (idx % 2) * (itemWidth + 10);
    if (idx > 0 && idx % 2 === 0) itemY += 10;
    doc.text("x " + sanitizeText(item), itemX, itemY);
  });
  y += 50;
  
  // Positioning
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  section.positioning.forEach((line) => {
    doc.text(sanitizeText(line), centerX, y, { align: "center" });
    y += 9;
  });
  y += 4;
  
  // Conclusion
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(section.conclusion), centerX, y, { align: "center" });
};

/**
 * Render business model section
 */
const renderBusinessModelSection = (doc: jsPDF, section: BusinessModelSection, margin: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const centerX = pageWidth / 2;
  let y = 50;
  
  // Title
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(section.title), centerX, y, { align: "center" });
  y += 30;
  
  // Features grid (3 columns)
  const featureWidth = (contentWidth - 20) / 3;
  let featureX = margin;
  let featureY = y;
  
  section.features.forEach((feature, idx) => {
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(featureX, featureY, featureWidth, 35, 3, 3, "F");
    
    doc.setTextColor(...PDF_CONFIG.primaryColor);
    doc.setFontSize(10);
    doc.text("✓", featureX + featureWidth / 2, featureY + 12, { align: "center" });
    
    doc.setTextColor(...PDF_CONFIG.textDark);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const featureLines = doc.splitTextToSize(sanitizeText(feature), featureWidth - 10);
    doc.text(featureLines, featureX + featureWidth / 2, featureY + 22, { align: "center" });
    
    if ((idx + 1) % 3 === 0) {
      featureX = margin;
      featureY += 40;
    } else {
      featureX += featureWidth + 10;
    }
  });
  
  y = featureY + 20;
  
  // Metrics box
  doc.setFillColor(...PDF_CONFIG.primaryColor);
  doc.roundedRect(margin, y, contentWidth, 50, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("The kicker", centerX, y + 12, { align: "center" });
  
  const metricWidth = contentWidth / section.metrics.length;
  section.metrics.forEach((metric, idx) => {
    const metricX = margin + idx * metricWidth;
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(metric.value), metricX + metricWidth / 2, y + 30, { align: "center" });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(metric.label), metricX + metricWidth / 2, y + 42, { align: "center" });
  });
  y += 65;
  
  // Tagline
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(section.tagline), centerX, y, { align: "center" });
  y += 18;
  
  // Referral note
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const referralLines = doc.splitTextToSize(sanitizeText(section.referralNote), contentWidth);
  doc.text(referralLines, centerX, y, { align: "center" });
};

/**
 * Render raise section
 */
const renderRaiseSection = (doc: jsPDF, section: RaiseSection, margin: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const centerX = pageWidth / 2;
  let y = 35;
  
  // Title
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText(section.title), centerX, y, { align: "center" });
  y += 12;
  
  // Subtitle
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  section.subtitle.forEach((line) => {
    doc.text(sanitizeText(line), centerX, y, { align: "center" });
    y += 8;
  });
  y += 8;
  
  // Options grid
  const optionWidth = (contentWidth - 30) / 4;
  section.options.forEach((option, idx) => {
    const optionX = margin + idx * (optionWidth + 10);
    
    if (option.recommended) {
      doc.setFillColor(...PDF_CONFIG.primaryColor);
      doc.roundedRect(optionX, y, optionWidth, 60, 3, 3, "F");
      
      // Recommended badge
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(optionX + 3, y + 4, optionWidth - 6, 10, 2, 2, "F");
      doc.setTextColor(...PDF_CONFIG.primaryColor);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text("PREFERRED", optionX + optionWidth / 2, y + 10, { align: "center" });
      
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(optionX, y, optionWidth, 60, 3, 3, "F");
      doc.setTextColor(...PDF_CONFIG.textDark);
    }
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(option.amount), optionX + optionWidth / 2, y + 28, { align: "center" });
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText(option.label), optionX + optionWidth / 2, y + 40, { align: "center" });
    
    doc.setFontSize(6);
    const descLines = doc.splitTextToSize(sanitizeText(option.desc), optionWidth - 8);
    doc.text(descLines, optionX + optionWidth / 2, y + 50, { align: "center" });
  });
  y += 72;
  
  // Recommendation box
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(...PDF_CONFIG.primaryColor);
  doc.rect(margin, y, 3, 40, "F");
  doc.rect(margin + 3, y, contentWidth - 3, 40, "F");
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Our recommendation", centerX, y + 10, { align: "center" });
  
  doc.setFontSize(16);
  doc.text(sanitizeText(section.recommendation.amount), centerX, y + 24, { align: "center" });
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText(section.recommendation.description), centerX, y + 34, { align: "center" });
  y += 50;
  
  // Closing statement
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(9);
  const closingLines = doc.splitTextToSize(sanitizeText(section.closingStatement), contentWidth);
  doc.text(closingLines, centerX, y, { align: "center" });
};

/**
 * Render closing section
 */
const renderClosingSection = (doc: jsPDF, section: ClosingSection, margin: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const centerX = pageWidth / 2;
  let y = 60;
  
  // Title
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(section.title, centerX, y, { align: "center" });
  y += 25;
  
  // Philosophy
  doc.setTextColor(...PDF_CONFIG.textGray);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const philLines = doc.splitTextToSize(sanitizeText(section.philosophy), contentWidth);
  doc.text(philLines, centerX, y, { align: "center" });
  y += philLines.length * 7 + 20;
  
  // Pitch
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(12);
  const pitchLines = doc.splitTextToSize(sanitizeText(section.pitch), contentWidth);
  doc.text(pitchLines, centerX, y, { align: "center" });
  y += pitchLines.length * 7 + 20;
  
  // Brand name
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(section.brandName, centerX, y, { align: "center" });
  y += 25;
  
  // Call to action
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(section.callToAction, centerX, y, { align: "center" });
  y += 35;
  
  // Contact box
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(...PDF_CONFIG.primaryColor);
  doc.rect(margin, y, 3, 45, "F");
  doc.rect(margin + 3, y, contentWidth - 3, 45, "F");
  
  doc.setTextColor(...PDF_CONFIG.textDark);
  doc.setFontSize(11);
  doc.text(section.contactPrompt, centerX, y + 18, { align: "center" });
  
  doc.setTextColor(...PDF_CONFIG.primaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(section.contactEmail, centerX, y + 32, { align: "center" });
};

/**
 * Generate investor summary PDF with all sections
 */
export const generateInvestorSummaryPdf = (sections: InvestorSummarySection[], owlImage?: string): jsPDF => {
  const doc = new jsPDF("p", "mm", "a4");
  const margin = PDF_CONFIG.margin;
  const pageHeight = doc.internal.pageSize.getHeight();
  
  sections.forEach((section, idx) => {
    if (idx > 0) {
      doc.addPage();
    }
    
    switch (section.type) {
      case "hero":
        renderHeroSection(doc, section, margin);
        break;
      case "pain":
        renderPainSection(doc, section, margin);
        break;
      case "solution":
        renderSolutionSection(doc, section, margin);
        break;
      case "magic":
        renderMagicSection(doc, section, margin, owlImage);
        break;
      case "market":
        renderMarketSection(doc, section, margin);
        break;
      case "businessModel":
        renderBusinessModelSection(doc, section, margin);
        break;
      case "raise":
        renderRaiseSection(doc, section, margin);
        break;
      case "closing":
        renderClosingSection(doc, section, margin);
        break;
    }
    
    // Add footer
    doc.setTextColor(...PDF_CONFIG.textLight);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `© ${new Date().getFullYear()} Hobson AI - Confidential`,
      margin,
      pageHeight - 10
    );
    doc.text(
      `Page ${idx + 1} of ${sections.length}`,
      doc.internal.pageSize.getWidth() - margin,
      pageHeight - 10,
      { align: "right" }
    );
  });
  
  return doc;
};

/**
 * Download investor summary PDF
 */
export const downloadInvestorSummaryPdf = (sections: InvestorSummarySection[], owlImage?: string, filename: string = "Hobson-AI-Investor-Summary.pdf"): void => {
  const doc = generateInvestorSummaryPdf(sections, owlImage);
  doc.save(filename);
};
