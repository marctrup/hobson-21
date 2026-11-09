import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";
import { HobsonGateway, HobsonGatewayMobile, serifStack } from "@/components/HobsonGateway";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { OrchestrationDemo } from "@/components/homepage/OrchestrationDemo";
import { ClosingSection } from "@/components/homepage/ClosingSection";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";



import { PilotApplicationForm } from "@/components/homepage/PilotApplicationForm";

import { AudienceStrip } from "@/components/homepage/AudienceStrip";
import { TalkToYourPapers } from "@/components/homepage/TalkToYourPapers";
import { TrustStrip } from "@/components/homepage/TrustStrip";
import { TestimonialSection } from "@/components/homepage/TestimonialSection";





import { structuredData } from "@/utils/seo-data";
import { CONTENT } from "@/config/content";

export const Homepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPilotForm, setShowPilotForm] = useState(false);

  
  const content = CONTENT;
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return <>
      <Helmet>
        {/* Title, description, Open Graph and Twitter tags are provided by the
            static index.html for the homepage — setting them here would
            duplicate them in the rendered DOM. Only homepage-specific extras
            live in this Helmet block. */}
        <meta name="keywords" content="AI property management, tenancy agreement analysis, property AI, document automation, real estate AI, property technology, AI document analysis" />

        {/* OpenAI/ChatGPT specific meta tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />

        <meta property="og:url" content="https://hobsonschoice.ai/" />
        <meta property="og:site_name" content="Hobson AI" />

        <link rel="canonical" href="https://hobsonschoice.ai/" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/hobson-logo.png" as="image" />
        
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

              {/* Desktop Navigation - each way Hobson directs you, in his own words */}
              <nav className="hidden md:flex items-center gap-7" role="navigation" aria-label="Main navigation">
                {[
                  { to: "/founder", label: "Founders", title: "Meet the Founders of Hobson AI", voice: "How I came to be" },
                  { to: "/blog", label: "Blog", title: "Property Management Insights", voice: "Notes from my desk" },
                  { to: "/learn", label: "Learn", title: "Hobson AI FAQ", voice: "Where I keep my notes" },
                  { to: "/contact", label: "Contact", title: "Contact Real Estate Software Support", voice: "Talk to me" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex flex-col items-start py-1 outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-brass/60"
                    title={link.title}
                  >
                    <span className="relative text-[15px] text-ink leading-none">
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass/60 transition-all duration-500 group-hover:w-full group-hover:bg-brass"
                      />
                    </span>
                    <span
                      className="mt-2 text-[10px] font-bold text-muted-foreground italic leading-none"
                      style={serifStack}
                    >
                      {link.voice}
                    </span>
                  </Link>
                ))}

                {/* Gateway to the app */}
                <HobsonGateway className="ml-2" />
              </nav>

              {/* Mobile Menu Button */}
              <SimpleButton variant="ghost" size="icon" className="md:hidden bg-bone-wash hover:bg-bone border border-bone rounded-md" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                {isMobileMenuOpen ? <X className="h-6 w-6" style={{ color: "var(--ink)" }} strokeWidth={1.5} /> : <Menu className="h-6 w-6" style={{ color: "var(--ink)" }} strokeWidth={1.5} />}
              </SimpleButton>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && <nav className="md:hidden mt-4 pb-4 border-t pt-4" role="navigation" aria-label="Mobile navigation">
                <div className="flex flex-col">
                  {[
                    { to: "/", label: "Home", voice: "Start with me" },
                    { to: "/founder", label: "Founders", voice: "How I came to be" },
                    { to: "/blog", label: "Blog", voice: "Notes from my desk" },
                    { to: "/learn", label: "Learn", voice: "Where I keep my notes" },
                    { to: "/contact", label: "Contact", voice: "Talk to me" },
                  ].map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="group flex flex-col border-b border-border py-3"
                      onClick={closeMobileMenu}
                    >
                      <span className="text-lg text-ink leading-tight">{link.label}</span>
                      <span className="mt-1 text-xs font-bold text-muted-foreground italic leading-tight" style={serifStack}>
                        {link.voice}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-4">
                    <HobsonGatewayMobile onClick={closeMobileMenu} />
                  </div>
                </div>
              </nav>}
          </div>
        </header>

        <main id="main-content" className="min-h-screen bg-background overflow-x-hidden" role="main">
          {/* Hero Section - Two Column Layout */}
          <section className="relative pt-12 sm:pt-16 pb-4 overflow-hidden bg-wash" aria-labelledby="hero-heading">
            <div className="container mx-auto px-4 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center py-6 sm:py-8 lg:py-12">
                {/* Left Container - H1 and Strap Line */}
                <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                  <h1 id="hero-heading" className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                    <span className="text-foreground">
                      <span className="text-primary">I am Hobson</span>
                      {content.hero.title.replace(/^I am Hobson/, "")} </span>
                    {(() => {
                      const highlight = content.hero.titleHighlight;
                      const lastWord = "property.";
                      const prefix = highlight.endsWith(lastWord)
                        ? highlight.slice(0, -lastWord.length)
                        : highlight + " ";
                      return (
                        <>
                          <span className="text-foreground">{prefix}{lastWord}</span>
                        </>
                      );

                    })()}
                  </h1>
                  <p className="text-muted-foreground leading-relaxed text-lg sm:text-xl">{content.hero.subtitle}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug tracking-tight pt-4 sm:pt-6">
                    <span className="text-muted-foreground">Claude reads your documents.</span>{" "}
                    <span className="text-foreground">I understand your business.</span>

                  </p>
                  
                  
                </div>

                {/* Right Container - Orchestration Demo */}
                <div className="relative mt-8 lg:mt-[5px]">
                  <OrchestrationDemo />
                </div>

              </div>
            </div>
          </section>

          {/* Audience Strip */}
          <AudienceStrip />

          {/* Talk to your papers */}
          <TalkToYourPapers />

          {/* Trust Strip */}
          <TrustStrip />

          {/* Remarks from visitors, before the final invitation */}
          <TestimonialSection />



          <PilotApplicationForm showForm={showPilotForm} setShowForm={setShowPilotForm} />

          <ClosingSection />

          {/* Footer */}
          <HomepageFooter />
        </main>
      </div>
    </>;
};

