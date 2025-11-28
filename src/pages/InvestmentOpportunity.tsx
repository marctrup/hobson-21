import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GlobalHeader } from '@/components/GlobalHeader';
import { HomepageFooter } from '@/components/homepage/HomepageFooter';
import { Lock, FileText, Download, BarChart, TrendingUp, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OptimizedImage } from '@/components/OptimizedImage';
import hobsonLogo from '/hobson-logo.png';

const InvestmentOpportunity = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user has already authenticated in this session
  useEffect(() => {
    const authenticated = sessionStorage.getItem('investment_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call edge function to verify password
      const { data, error } = await supabase.functions.invoke('verify-investment-password', {
        body: { password },
      });

      if (error) throw error;

      if (data.valid) {
        sessionStorage.setItem('investment_authenticated', 'true');
        setIsAuthenticated(true);
        toast({
          title: 'Access Granted',
          description: 'Welcome to the Investment Opportunity page',
        });
      } else {
        toast({
          title: 'Access Denied',
          description: 'Incorrect password',
          variant: 'destructive',
        });
        setPassword('');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <GlobalHeader />
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <Card className="w-full max-w-md p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-center mb-2">
                Investment Opportunity
              </h1>
              <p className="text-muted-foreground text-center text-sm">
                This page is password protected
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="text-sm font-medium mb-2 block">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Access Page'}
              </Button>
            </form>
          </Card>
        </div>
        <HomepageFooter />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <OptimizedImage 
                src={hobsonLogo} 
                alt="Hobson AI Logo" 
                className="h-14"
              />
              <h1 className="text-xl font-semibold text-muted-foreground">
                Investor Resources
              </h1>
            </div>
          </div>
        </header>

        {/* Mission Statement Section */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                  Mission Statement
                </h2>
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <p className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
                    To go beyond simple data access by giving property professionals instant, accurate information enriched with AI judgement, context, and connected insight.
                  </p>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground italic text-center">
                Materials on this page are confidential and intended for authorised investors only
              </p>
            </div>
          </div>
        </section>

        {/* Positioning Statement Section */}
        <section className="py-12 border-b bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-6 text-center">
                Our Positioning Statement
              </h2>
              <Card className="p-8 bg-background/80 backdrop-blur border-primary/20">
                <p className="text-lg leading-relaxed text-foreground">
                  For real estate professionals drained by large, expensive systems and the manual effort of pulling information from original documents, Hobson is a <span className="font-semibold text-primary">specialised AI-powered assistant</span> that transforms source-of-truth files into instant, reliable answers. Unlike complex platforms, Hobson is <span className="font-semibold">lightweight, simple to use, and low cost</span> — saving time, ensuring accuracy, and building trust with fast, referenced responses.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Business Plan Section */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-3">Business Plan</h3>
              <p className="text-muted-foreground mb-6">
                Comprehensive overview of our strategy, market analysis, and growth roadmap.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Executive Summary</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        PDF • 2.4 MB
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Full Business Plan</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        PDF • 8.7 MB
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Financials Section */}
        <section className="py-12 border-b bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-3">Financials</h3>
              <p className="text-muted-foreground mb-6">
                Financial projections, metrics, and revenue models for the next 5 years.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <BarChart className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Financial Model</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        XLSX • 1.8 MB
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Revenue Projections</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        PDF • 1.2 MB
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Plan Section */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-3">Marketing Plan</h3>
              <p className="text-muted-foreground mb-6">
                Go-to-market strategy, customer acquisition plans, and brand positioning.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Marketing Strategy</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        PDF • 3.5 MB
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Customer Acquisition</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        PDF • 2.1 MB
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Architecture Section */}
        <section className="py-12 border-b bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-3">Tech Architecture</h3>
              <p className="text-muted-foreground mb-6">
                Technical infrastructure, AI models, scalability plan, and system diagrams.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Code className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">System Architecture</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        PDF • 4.2 MB
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Technical Roadmap</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        PDF • 1.9 MB
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Security Notice */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 bg-muted/50 border-muted">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Confidential Information:</span> This page and its documents are confidential and intended only for authorised investors. Any distribution, copying, or disclosure of these materials without written consent is strictly prohibited.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <OptimizedImage 
                src={hobsonLogo} 
                alt="Hobson AI Logo" 
                className="h-12 mx-auto mb-4"
              />
              <p className="text-sm text-muted-foreground mb-2">
                © 2024 Hobson's Choice AI. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Investor Relations: <a href="mailto:investors@hobsonschoice.ai" className="text-primary hover:underline">investors@hobsonschoice.ai</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default InvestmentOpportunity;
