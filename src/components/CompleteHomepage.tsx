import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Brain, Zap, Search, Shield, Users, Globe, Building2, TrendingUp, MapPin, PenTool, CreditCard, Heart } from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";
import { Badge } from "@/components/ui/badge";
import { SimpleCard, SimpleCardContent } from "@/components/ui/simple-card";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// Lazy load video only when needed

export const CompleteHomepage = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>AI Property Management Software | Document Intelligence | Hobson AI</title>
        <meta name="description" content="Transform your property documents with intelligent analysis, automated insights, and instant answers to complex property questions. AI-Document Intelligence for the Property Industry." />
        <meta name="keywords" content="AI property management, document intelligence, property AI software, real estate automation, property document analysis" />
        <meta property="og:title" content="AI-Document Intelligence for the Property Industry | Hobson AI" />
        <meta property="og:description" content="Transform your property documents with intelligent analysis, automated insights, and instant answers to complex property questions." />
        <meta property="og:image" content="https://hobsonschoice.ai/lovable-uploads/915c8f99-05e9-4948-aa5d-7704686f4175.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HobsonAI" />
        <meta name="twitter:title" content="AI-Document Intelligence for the Property Industry" />
        <meta name="twitter:description" content="Transform your property documents with intelligent analysis, automated insights, and instant answers to complex property questions." />
        <meta name="twitter:image" content="https://hobsonschoice.ai/lovable-uploads/915c8f99-05e9-4948-aa5d-7704686f4175.png" />
        <link rel="canonical" href="https://hobsonschoice.ai/property-management-software" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" as="image" />
        <link rel="prefetch" href="/lovable-uploads/8aff0aa2-12fe-473e-85a2-63855803ec66.png" as="image" />
        <link rel="prefetch" href="/lovable-uploads/2cabb871-e6fa-4afe-80ea-21ccf0053048.png" as="image" />
        <link rel="dns-prefetch" href="//player.vimeo.com" />
        <link rel="dns-prefetch" href="//vimeo.com" />
        <link rel="dns-prefetch" href="//f.vimeocdn.com" />
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://vimeo.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" role="banner">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="relative">
                <Link to="/" onClick={closeMobileMenu}>
                  <OptimizedImage
                    src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png"
                    alt="Hobson's Choice AI - AI-powered property management software company logo"
                    className="h-12 md:h-16 w-auto"
                    priority
                  />
                </Link>
                {/* Beta Badge - Positioned under the last 'n' */}
                <div className="absolute -bottom-1 -right-[60px]">
                  <Badge variant="outline" className="text-gray-400 border-gray-200 text-xs">
                    🚀 Now in Beta
                  </Badge>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
                <Link to="/features" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
                <Link to="/about" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <SimpleButton
                variant="ghost"
                size="icon"
                className="md:hidden bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-purple-500" strokeWidth={1.5} />
                ) : (
                  <Menu className="h-6 w-6 text-purple-500" strokeWidth={1.5} />
                )}
              </SimpleButton>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <nav className="md:hidden mt-4 pb-4 border-t pt-4" role="navigation" aria-label="Mobile navigation">
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/features" 
                    className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    Features
                  </Link>
                  <Link 
                    to="/blog" 
                    className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    Blog
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </Link>
                </div>
              </nav>
            )}
          </div>
        </header>

        <main id="main-content" className="min-h-screen bg-background" role="main">
          {/* Hero Section with left-aligned beta badge */}
          <section className="py-25" aria-labelledby="hero-heading">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-16 items-start">
                {/* Left side container */}
                <div className="relative mt-0" style={{ marginTop: '30px' }}>
                  <div className="relative flex flex-col items-center justify-center">
                    <div className="transform">
                      <div className="relative transform scale-[0.93] w-[calc(100%-20px)] pb-5 pt-14">
                        <div className="relative" style={{ 
                          transform: 'perspective(1000px) rotateY(15deg)',
                          filter: 'drop-shadow(20px 15px 30px rgba(0, 0, 0, 0.25)) drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.18))'
                        }}>
                          <OptimizedImage
                            src="/lovable-uploads/folder-with-glasses.png"
                            alt="Smart document with glasses - AI capabilities"
                            className="w-full h-auto object-contain transform scale-[1.375] block"
                            width={320}
                            height={320}
                            loading="lazy"
                            fetchPriority="low"
                          />
                        </div>
                        {/* Text below the image */}
                        <div className="text-center p-4 -mt-10" style={{ marginTop: '-50px' }}>
                          <h3 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-3">Your Documents now have a voice</h3>
                          <p className="text-primary font-semibold text-xl md:text-2xl">Are you ready to listen?</p>
                        </div>
                        {/* Enhanced 3D Shadow base for white background */}
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-8 bg-black/20 rounded-full blur-2xl opacity-70"></div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-56 h-6 bg-black/10 rounded-full blur-xl opacity-80"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side container */}
                <div className="relative pt-10 mt-20">
                  <div className="space-y-8">
                  <div>
                    <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                      <span className="text-foreground">AI-Document Intelligence for the </span>
                      <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Property Industry
                      </span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
                      Transform your property documents with intelligent analysis, automated insights, and instant answers to complex property questions.
                    </p>
                  </div>

                  {/* Georgia Video - Exact match to public site */}
                  <Dialog 
                    open={videoDialogOpen} 
                    onOpenChange={(open) => {
                      setVideoDialogOpen(open);
                      if (!open) {
                        setVideoLoaded(false); // Reset video state when dialog closes
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                       <div className="max-w-[280px] cursor-pointer group transform scale-[1.08]">
                         <div className="relative transform transition-transform duration-300 group-hover:scale-105 bg-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl">
                           <OptimizedImage
                             src="/lovable-uploads/2cabb871-e6fa-4afe-80ea-21ccf0053048.png"
                             alt="Georgia from Hobson AI explaining new AI property management software - the features and benefits"
                             className="w-full h-auto rounded-xl object-cover aspect-[3/2]"
                             width={200}
                             height={133}
                             loading="lazy"
                             fetchPriority="low"
                           />
                         </div>
                        <div className="mt-6">
                          <h3 className="text-sm font-semibold mb-2 text-foreground">"Would it help if I explained a bit more?"</h3>
                          <p className="text-muted-foreground text-sm">Click to hear from Georgia</p>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl w-full p-2 overflow-hidden" style={{ zIndex: 50 }}>
                      {/* Custom close button with higher z-index */}
                       <button 
                         onClick={() => {
                           console.log("Close button clicked!");
                           setVideoDialogOpen(false);
                           setVideoLoaded(false);
                         }}
                         className="absolute right-4 top-4 z-[60] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background border border-border p-1"
                         aria-label="Close video"
                       >
                        <X className="h-4 w-4" />
                      </button>
                      <DialogTitle className="sr-only">Meet Georgia - Property AI Assistant</DialogTitle>
                      <DialogDescription className="sr-only">
                        Watch Georgia explain how Hobson's AI can transform your property management workflow
                      </DialogDescription>
                       <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                          {/* Video loads but stays hidden until ready */}
                           <iframe
                             className={`w-full h-full rounded-lg absolute inset-0 transition-opacity duration-500 ${videoLoaded ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                             src="https://player.vimeo.com/video/1106432593?autoplay=1&muted=1&byline=0&portrait=0"
                             title="Meet Georgia - Property AI Assistant"
                             frameBorder="0"
                             allow="autoplay; fullscreen; picture-in-picture"
                             allowFullScreen
                              onLoad={() => {
                                // Only hide spinner once video content is actually loaded
                                setTimeout(() => setVideoLoaded(true), 1500);
                              }}
                           ></iframe>
                          {/* Spinner overlay covers everything */}
                          <div className={`absolute inset-0 bg-muted rounded-lg flex items-center justify-center z-20 transition-opacity duration-500 ${videoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                       </div>
                    </DialogContent>
                  </Dialog>
                </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Hobson AI Section - White cards with hover pop effects */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Hobson AI?</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our AI-powered platform that revolutionises how property professionals work with documents and data.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Top Row */}
                <div className="text-center bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Intelligent Analysis</h3>
                  <p className="text-muted-foreground">
                    Advanced AI understands context and extracts meaningful insights from complex property documents.
                  </p>
                </div>
                
                <div className="text-center bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Get instant answers to complex questions that would take hours of manual research.
                  </p>
                </div>
                
                <div className="text-center bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Smart Search</h3>
                  <p className="text-muted-foreground">
                    Find exactly what you need across thousands of documents with natural language queries.
                  </p>
                </div>
                
                {/* Bottom Row */}
                <div className="text-center bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Enterprise Security</h3>
                  <p className="text-muted-foreground">
                    Bank-level security ensures your sensitive property data is always protected.
                  </p>
                </div>
                
                <div className="text-center bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Team Collaboration</h3>
                  <p className="text-muted-foreground">
                    Share insights and work together seamlessly across your entire organization.
                  </p>
                </div>
                
                <div className="text-center bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Always Available</h3>
                  <p className="text-muted-foreground">
                    Access your AI assistant 24/7 from anywhere in the world on any device.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Property Intelligence Section - Clean layout with large icons */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Property Intelligence for the Industry
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  One AI assistant for all your property documentation needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-6xl mx-auto">
                {/* Top Row */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <Building2 className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Property Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Streamline tenant documentation and lease analysis
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <TrendingUp className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Property Sales</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Accelerate deal analysis and due diligence
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <MapPin className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Surveying</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Automate report generation and data extraction
                  </p>
                </div>
                
                {/* Bottom Row */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <PenTool className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Planning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Process planning documents and regulatory requirements
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <CreditCard className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Lending</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Speed up loan documentation and risk assessment
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Compliance</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Keep on top of repeat visits and documentation updates
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section - Connected steps with lines */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">How It Works</h2>
                <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
              </div>

              <div className="max-w-6xl mx-auto">
                {/* Connected Steps */}
                <div className="relative">
                  {/* Connection Line */}
                  <div className="hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
                    <div className="flex justify-between items-center px-16">
                      <div className="flex-1 h-0.5 bg-primary/20"></div>
                      <div className="w-16"></div>
                      <div className="flex-1 h-0.5 bg-primary/20"></div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="grid md:grid-cols-3 gap-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-8 relative z-10">
                        1
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">Upload & Connect</h3>
                      <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Upload your documents or connect your existing systems. Our AI instantly begins processing and indexing your content.
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-8 relative z-10">
                        2
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">Ask Questions</h3>
                      <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Ask natural language questions about your properties, leases, contracts, or any document content.
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-8 relative z-10">
                        3
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">Get Insights</h3>
                      <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Receive instant, accurate answers with full source citations and actionable recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* CTA Section - Clean layout without card */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                  Ready to think about AI in your property business but unsure how?
                </h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                  Join our exclusive pilot program and be among the first to experience the future of property intelligence.
                </p>
                <div className="mb-8">
                  <SimpleButton 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium"
                    asChild
                  >
                    <Link to="/contact">Contact Us →</Link>
                  </SimpleButton>
                </div>
              </div>
            </div>
          </section>

          {/* Security Badges */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex justify-center items-center gap-16 max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Trusted by industry leaders</span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-16 border-t">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-12">
                {/* Logo */}
                <div>
                  <OptimizedImage
                    src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png"
                    alt="Hobson's Choice AI logo"
                    className="h-12 w-auto"
                  />
                </div>
                
                {/* Product Column */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-foreground">Product</h4>
                  <div className="space-y-3">
                    <Link to="/features" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Features
                    </Link>
                    <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Join our pilot programme
                    </Link>
                  </div>
                </div>
                
                {/* Company Column */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-foreground">Company</h4>
                  <div className="space-y-3">
                    <Link to="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </Link>
                    <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                      About
                    </Link>
                    <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};