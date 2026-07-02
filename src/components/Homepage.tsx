import React, { useState } from "react";
import { InterestModal } from "@/components/InterestModal";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, FileText, CheckCircle, Building2 } from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { OrchestrationDemo } from "@/components/homepage/OrchestrationDemo";
import { ClosingSection } from "@/components/homepage/ClosingSection";



import { PilotApplicationForm } from "@/components/homepage/PilotApplicationForm";

import { AudienceStrip } from "@/components/homepage/AudienceStrip";
import { TrustStrip } from "@/components/homepage/TrustStrip";


import { TrustedConversationSection } from "@/components/homepage/TrustedConversationSection";
import { TheTeamSection } from "@/components/homepage/TheTeamSection";


import { structuredData } from "@/utils/seo-data";
import { CONTENT } from "@/config/content";
import hobsonAnswerTight from "@/assets/hobson-answer-tight.png.asset.json";

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
        <title>Hobson AI — The AI co-worker built for property</title>
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
                <Link to="/pricing" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link to="/founder" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Founder
                </Link>
                <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                    {content.header.nav.blog}
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
                  <Link to="/pricing" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    Pricing
                  </Link>
                  <Link to="/founder" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    Founder
                  </Link>
                  <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                      {content.header.nav.blog}
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
          <section className="relative pt-12 sm:pt-16 pb-4 overflow-hidden" aria-labelledby="hero-heading">
            {/* Subtle radial glow behind the headline */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 30% 40%, hsl(var(--primary) / 0.08) 0%, transparent 55%)',
              }}
            />
            <div className="container mx-auto px-4 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center py-6 sm:py-8 lg:py-12">
                {/* Left Container - H1 and Strap Line */}
                <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                  <h1 id="hero-heading" className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                    <span className="text-foreground">{content.hero.title} </span>
                    {(() => {
                      const highlight = content.hero.titleHighlight;
                      const lastWord = "property.";
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
                  
                </div>

                {/* Right Container - Orchestration Demo */}
                <div className="relative mt-8 lg:mt-[5px]">
                  <OrchestrationDemo />
                </div>

              </div>
            </div>
          </section>

          {/* One Trusted Conversation */}
          <TrustedConversationSection />

          {/* The Team */}
          <TheTeamSection />

          {/* Founder CTA card */}
          <section className="py-12 sm:py-16" aria-labelledby="founder-cta-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-background to-background p-8 sm:p-10 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="space-y-2">
                    <h2 id="founder-cta-heading" className="text-xl sm:text-2xl font-bold text-foreground">
                      Watch a co-founder's story
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
                      Hobson was created by people who understand the day-to-day reality of property work.
                    </p>
                  </div>
                  <Link
                    to="/founder"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 whitespace-nowrap shrink-0"
                  >
                    Watch a co-founder's story
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Audience Strip */}
          <AudienceStrip />

          {/* Product Screenshot — Document Q&A */}
          <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden" aria-labelledby="screenshot-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
                  <span className="inline-block text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-4">
                    See Hobson in action
                  </span>
                  <h2
                    id="screenshot-heading"
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight"
                  >
                    Ask once.{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Get the full picture.
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Every document you share becomes part of my understanding of your portfolio. When you ask me a question, I bring together the right knowledge and always show you the evidence behind my answer.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  {/* Screenshot — tight, polished frame */}
                  <div className="lg:col-span-6">
                    <div className="relative mx-auto max-w-md lg:max-w-none">
                      <div className="absolute -inset-8 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-[2.5rem] blur-3xl opacity-60" />
                      <div className="relative rounded-2xl border border-border/60 bg-background shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.25)] overflow-hidden">
                        {/* faux browser chrome */}
                        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50 bg-muted/40">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                        </div>
                        <img
                          src={hobsonAnswerTight.url}
                          alt="Hobson answering a rent question by referencing two uploaded tenancy documents and citing each source"
                          className="w-full h-auto block"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature narrative */}
                  <div className="lg:col-span-6 space-y-8">
                    <div className="flex gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1.5">Understanding built over time</h3>
                        <p className="text-muted-foreground leading-relaxed">Every document you share becomes part of my understanding of your portfolio, allowing me to connect information across leases, plans, reports and every other record you entrust to me.</p>
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1.5">Evidence you can trust</h3>
                        <p className="text-muted-foreground leading-relaxed">Every answer I give is supported by the evidence behind it, with clear references back to the relevant documents and clauses.</p>
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1.5">Understanding beyond the documents</h3>
                        <p className="text-muted-foreground leading-relaxed">I build an understanding of your portfolio, your properties, your people and your obligations, so every answer reflects your business—not just the words in a document.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Strip */}
          <TrustStrip />


          <PilotApplicationForm showForm={showPilotForm} setShowForm={setShowPilotForm} />

          <ClosingSection />

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
                    
                    <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
                    <Link to="/founder" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Founder</Link>
                    <Link to="/blog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                    <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                    <Link to="/privacy-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="/data-protection" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Data Protection</Link>
                    <Link to="/refund-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
                    <Link to="/investment-opportunity" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Investment Opportunity</Link>
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
