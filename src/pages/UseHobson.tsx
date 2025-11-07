import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, CheckCircle, Users, Clock, ArrowRight, FileText, Sparkles } from "lucide-react";

export const UseHobson = () => {
  return (
    <>
      <Helmet>
        <title>Use Hobson AI - Get 1,000 Free HEUs | Property Document Intelligence</title>
        <meta name="description" content="Start using Hobson AI today. Get 1,000 free HEUs to analyze your property documents with AI-powered clarity and instant answers." />
        <meta name="keywords" content="Hobson AI, property documents, AI assistant, free trial, document analysis" />
        <meta property="og:title" content="Use Hobson AI - Get 1,000 Free HEUs | Property Document Intelligence" />
        <meta property="og:description" content="Start using Hobson AI today. Get 1,000 free HEUs to analyze your property documents with AI-powered clarity and instant answers." />
        <link rel="canonical" href="https://hobsonschoice.ai/usehobson" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/">
                <OptimizedImage 
                  src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png"
                  alt="Hobson AI Logo" 
                  className="h-12 w-auto" 
                  priority 
                />
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main>
          {/* Scarcity Banner */}
          <div className="bg-primary text-primary-foreground py-3">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Limited Time: Get 1,000 Free HEUs when you sign up today!</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <section className="pt-16 pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="secondary" className="mb-6 px-4 py-2">
                  AI-Powered Property Intelligence
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Turn Your Property Documents Into
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block mt-2">
                    Instant Answers
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                  Hobson, your AI assistant, is trained on property documents to deliver quick, clear, and trusted answers every time. No more endless searching through paperwork.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                  <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 min-w-[200px]">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 min-w-[200px]">
                    Watch Demo
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>1,000 free HEUs included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Setup in under 5 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Benefits */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-6">Why Property Professionals Choose Hobson</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Transform how you work with property documents
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="p-8 text-center">
                    <CardContent className="space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Save Hours Daily</h3>
                      <p className="text-muted-foreground">
                        Get instant answers instead of spending hours searching through documents
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-8 text-center">
                    <CardContent className="space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">All Document Types</h3>
                      <p className="text-muted-foreground">
                        Works with tenancy agreements, leases, contracts, and all property documents
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-8 text-center">
                    <CardContent className="space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Trusted Accuracy</h3>
                      <p className="text-muted-foreground">
                        AI trained specifically on property documents for reliable, accurate answers
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-6">Trusted by Property Professionals</h2>
                  <div className="flex items-center justify-center gap-2 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                    <span className="ml-2 text-lg font-semibold">4.9/5 from 200+ users</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="p-6">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        "Hobson has revolutionized how we handle tenancy agreements. What used to take hours now takes minutes."
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Sarah Johnson</p>
                          <p className="text-sm text-muted-foreground">Property Manager, ABC Estates</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        "The accuracy is incredible. Hobson understands complex lease terms better than most humans."
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Michael Chen</p>
                          <p className="text-sm text-muted-foreground">Legal Advisor, Property Solutions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        "Game-changing for our team. We can now provide instant responses to client queries."
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Emma Thompson</p>
                          <p className="text-sm text-muted-foreground">Director, Urban Properties</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Transform Your Property Business?
                </h2>
                <p className="text-xl text-muted-foreground mb-12">
                  Join hundreds of property professionals who are already saving time with Hobson AI.
                </p>
                
                <div className="bg-background rounded-2xl p-8 mb-8 border shadow-lg">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      🎉 Limited Time Offer
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Get 1,000 Free HEUs</h3>
                  <p className="text-muted-foreground mb-6">
                    That's enough to analyze dozens of documents and experience the full power of Hobson AI
                  </p>
                  <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90">
                    Start Free Trial Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  No credit card required • Cancel anytime • Full support included
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Simple Footer */}
        <footer className="py-12 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <OptimizedImage 
                src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" 
                alt="Hobson AI Logo" 
                className="h-8 w-auto" 
              />
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};