import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const SimpleHomepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showExplainerVideo, setShowExplainerVideo] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link to="/">
                <img 
                  src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" 
                  alt="Hobson's Choice AI Logo" 
                  className="h-12 md:h-16" 
                />
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-4">
                <Link to="/features" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2">
                  Features
                </Link>
                <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2">
                  Blog
                </Link>
                <Link to="/about" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2">
                  About
                </Link>
                <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2">
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh] max-w-7xl mx-auto">
              <div className="space-y-8 text-center lg:text-left lg:pl-8">
                <div className="space-y-6">
                  <div className="relative">
                    <Badge className="absolute -top-12 left-0 text-sm">🚀 Now in Beta</Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]">
                      AI-Document Intelligence for the{" "}
                      <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Property Industry
                      </span>
                    </h1>
                  </div>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Transform your property documents with intelligent analysis, automated insights, and instant answers to complex property questions.
                  </p>
                </div>

                <div className="mt-8 flex justify-center lg:justify-start">
                  <Button
                    className="group relative bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setShowExplainerVideo(true)}
                  >
                    <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                    Watch Demo
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>
                </div>

                <div className="relative w-80 h-52 rounded-2xl overflow-hidden shadow-xl border-4 border-white/20 mx-auto lg:mx-0">
                  <img
                    src="/lovable-uploads/915c8f99-05e9-4948-aa5d-7704686f4175.png"
                    alt="Georgia explaining AI features"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">"Would it help if I explained a bit more?"</p>
                    <p className="text-xs opacity-90">Click to hear from Georgia</p>
                  </div>
                </div>
              </div>

              <div className="relative lg:pl-16">
                <div className="relative">
                  <div className="absolute top-4 left-4 w-[95%] h-full bg-muted/20 rounded-2xl shadow-sm transform rotate-2"></div>
                  <div className="absolute top-2 left-2 w-[90%] h-full bg-muted/40 rounded-2xl shadow-md transform rotate-1"></div>
                  <div className="absolute top-1 left-1 w-[90%] h-full bg-muted/60 rounded-2xl shadow-lg transform -rotate-0.5"></div>
                  
                  <div className="relative z-10 w-full mx-auto scale-[1.53]">
                    <img
                      src="/lovable-uploads/4351fb54-1d77-416e-9474-3c80e483a83c.png"
                      alt="Document processing demo"
                      className="w-full h-auto object-cover rounded-2xl shadow-sm"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl border border-border max-w-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">Your Documents now have a voice</div>
                    <div className="text-lg font-semibold text-secondary mb-4">Are you ready to listen?</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
              <p className="text-xl text-muted-foreground">Powered by advanced AI technology</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Document Analysis</h3>
                <p className="text-muted-foreground">Upload any property document and get instant insights and answers</p>
              </div>
              <div className="text-center p-6">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Q&A</h3>
                <p className="text-muted-foreground">Ask complex questions about your documents in natural language</p>
              </div>
              <div className="text-center p-6">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">99.9% Accuracy</h3>
                <p className="text-muted-foreground">Industry-leading accuracy for property document processing</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">Join our free pilot program today</p>
            <Button size="lg" className="px-8 py-4 text-lg">
              Start Free Pilot
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Video Dialog */}
      <Dialog open={showExplainerVideo} onOpenChange={setShowExplainerVideo}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-center">Meet Georgia</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <video 
              className="w-full h-full rounded-lg"
              controls
              src="/src/assets/avitar-hobson.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};