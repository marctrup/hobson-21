import React, { useState } from "react";
import { InterestModal } from "@/components/InterestModal";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { PropertyManagementVisualization } from "@/components/homepage/PropertyManagementVisualization";

import { FeaturesSection } from "@/components/homepage/FeaturesSection";
import MobileShowcase from "@/components/features/MobileShowcase";

import { PilotApplicationForm } from "@/components/homepage/PilotApplicationForm";
import { HobsonJourneySection } from "@/components/homepage/HobsonJourneySection";
import { AudienceStrip } from "@/components/homepage/AudienceStrip";
import { TrustStrip } from "@/components/homepage/TrustStrip";

import { YouTubeVideoSection } from "@/components/homepage/YouTubeVideoSection";

import owlMascot from "@/assets/owl-mascot.png";
import { structuredData } from "@/utils/seo-data";
import { CONTENT } from "@/config/content";

export const Homepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPilotForm, setShowPilotForm] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const content = CONTENT;
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return <>
      <Helmet>
        <title>Homepage | Hobson AI — AI assistance to operators, occupiers and owners of real estate</title>
        <meta name="description" content={content.seo.description} />
        <meta name="keywords" content="AI property management, tenancy agreement analysis, property AI, document automation, real estate AI, property technology, AI document analysis" />
        
        {/* OpenAI/ChatGPT specific meta tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Document Intelligence for Property Management | Hobson AI" />
        <meta property="og:description" content={content.seo.description} />
        <meta property="og:image" content="https://hobsonschoice.ai/hobson-owl-social.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hobsonschoice.ai/" />
        <meta property="og:site_name" content="Hobson AI" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HobsonAI" />
        <meta name="twitter:title" content="AI Document Intelligence for Property Management" />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content="https://hobsonschoice.ai/hobson-owl-social.png" />
        
        <link rel="canonical" href="https://hobsonschoice.ai/" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/hobson-logo.png" as="image" />
        <link rel="preload" href={owlMascot} as="image" />
        
{/* Structured Data for AI Crawlers */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData.organization)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(structuredData.softwareApplication)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" role="banner">
          <div className="container mx-auto px-4 py-1">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="relative">
                <Link to="/" onClick={closeMobileMenu}>
                  <OptimizedImage src="/hobson-logo.png" alt={content.header.logoAlt} className="h-[59px] w-auto" priority />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
                <Link to="/how-hobson-thinks" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  How Hobson Thinks
                </Link>
                <Link to="/pricing" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                    {content.header.nav.blog}
                  </Link>
                <Link to="/learn/smart-navigation" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Learn
                </Link>
                <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
                
                {/* Login button */}
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
                >
                  Login
                </button>
                
              </nav>

              {/* Mobile Menu Button */}
              <SimpleButton variant="ghost" size="icon" className="md:hidden bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                {isMobileMenuOpen ? <X className="h-6 w-6 text-purple-500" strokeWidth={1.5} /> : <Menu className="h-6 w-6 text-purple-500" strokeWidth={1.5} />}
              </SimpleButton>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && <nav className="md:hidden mt-4 pb-4 border-t pt-4" role="navigation" aria-label="Mobile navigation">
                <div className="flex flex-col gap-4">
                  <Link to="/how-hobson-thinks" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    How Hobson Thinks
                  </Link>
                  <Link to="/pricing" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    Pricing
                  </Link>
                  <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                      {content.header.nav.blog}
                    </Link>
                  <Link to="/learn/smart-navigation" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    Learn
                  </Link>
                  <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    Contact
                  </Link>
                  {/* Login button */}
                  <button
                    onClick={() => { closeMobileMenu(); setIsLoginModalOpen(true); }}
                    className="inline-flex h-9 w-fit items-center justify-center rounded-md border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
                  >
                    Login
                  </button>
                   
                </div>
              </nav>}
          </div>
        </header>

        <main id="main-content" className="min-h-screen bg-background overflow-x-hidden" role="main">
          {/* Hero Section - Two Column Layout */}
          <section className="pt-12 sm:pt-16 pb-4" aria-labelledby="hero-heading">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center py-6 sm:py-8 lg:py-12">
                {/* Left Container - H1 and Strap Line */}
                <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                  <h1 id="hero-heading" className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                    <span className="text-foreground">{content.hero.title} </span>
                    {(() => {
                      const highlight = content.hero.titleHighlight;
                      const lastWord = "automatically.";
                      const prefix = highlight.endsWith(lastWord)
                        ? highlight.slice(0, -lastWord.length)
                        : highlight + " ";
                      return (
                        <>
                          <span className="text-primary">{prefix}</span>
                          <span className="bg-gradient-to-r from-primary via-primary/80 to-accent-teal bg-clip-text text-transparent">
                            {lastWord}
                          </span>
                        </>
                      );
                    })()}
                  </h1>
                  <p className="text-muted-foreground leading-relaxed text-lg sm:text-xl">{content.hero.subtitle}</p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    <span className="text-muted-foreground">ChatGPT may read a lease, but</span>{" "}
                    <span className="text-primary font-medium">Hobson understands the unit.</span>
                  </p>
                  
                </div>

                {/* Right Container - Document to Insights Visualization */}
                <div className="relative mt-8 lg:mt-[5px] font-space border-[2px] sm:border-[3px] border-gray-500 rounded-lg" style={{
                transform: 'perspective(1000px) rotateY(-10deg)',
                transformStyle: 'preserve-3d',
                boxShadow: '15px 15px 40px rgba(0, 0, 0, 0.06), 8px 8px 25px rgba(0, 0, 0, 0.04)',
              }}>
                  <PropertyManagementVisualization />
                </div>

              </div>
            </div>
          </section>

          {/* YouTube Explainer Video */}
          <YouTubeVideoSection
            videoId="MXutUHZFXIs"
            title="Short Video Explaining our vision for Hobson"
          />

          {/* Audience Strip */}
          <AudienceStrip />

          {/* The Hobson Journey */}
          <HobsonJourneySection />

          {/* Features Section */}
          <FeaturesSection />

          {/* Mobile App Showcase */}
          <MobileShowcase />



          {/* Trust Strip */}
          <TrustStrip />

          <PilotApplicationForm showForm={showPilotForm} setShowForm={setShowPilotForm} />

          {/* Footer */}
          <footer className="py-12 md:py-20 border-t bg-muted/30">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid md:grid-cols-4 gap-10 md:gap-12">
                {/* Logo & tagline */}
                <div className="md:col-span-2">
                  <OptimizedImage src="/hobson-logo.png" alt={content.header.logoAlt} className="h-[48px] w-auto mb-4" />
                  <p className="text-sm text-muted-foreground max-w-md">
                    AI assistance to operators, occupiers and owners of real estate.
                  </p>
                  <div className="flex items-center gap-4 mt-6">
                    <a
                      href="https://www.linkedin.com/company/103275921"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Follow Hobson's Choice AI on LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                </div>

                {/* Company links */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5">{content.footer.company.title}</h4>
                  <div className="space-y-3">
                    <Link to="/how-hobson-thinks" className="block text-sm text-muted-foreground hover:text-primary transition-colors">How Hobson Thinks</Link>
                    <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
                    <Link to="/blog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                    <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                    <Link to="/privacy-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="/data-protection" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Data Protection</Link>
                    <Link to="/refund-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
                    <Link to="/investment-opportunity" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Investment Opportunity</Link>
                  </div>
                </div>

                {/* Learn links */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5">Learn</h4>
                  <div className="space-y-3">
                    <Link to="/learn/faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
                    <Link to="/learn/glossary" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Glossary</Link>
                    <Link to="/learn/smart-navigation" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Smart Navigation</Link>
                    <Link to="/learn/integrations" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Integrations</Link>
                  </div>
                </div>
              </div>

              <div className="border-t mt-12 pt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Hobson's Choice AI Ltd. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
      <InterestModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} source="login-interest" />
    </>;
};
