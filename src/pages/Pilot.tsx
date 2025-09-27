import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Users, Zap, Shield, Target } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { GlobalHeader } from "@/components/GlobalHeader";

const Pilot = () => {
  return (
    <>
      <Helmet>
        <title>Join Our Pilot Program - Hobson AI</title>
        <meta name="description" content="Be among the first to experience the future of property intelligence. Join our exclusive pilot program and help shape the future of AI-powered property management." />
        <meta name="keywords" content="pilot program, AI property management, beta testing, early access" />
        <meta property="og:title" content="Join Our Pilot Program - Hobson AI" />
        <meta property="og:description" content="Be among the first to experience the future of property intelligence. Join our exclusive pilot program." />
        <link rel="canonical" href="https://hobsonschoice.ai/pilot" />
      </Helmet>

      <GlobalHeader />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-foreground">Join Our Exclusive </span>
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Pilot Program</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
                Be among the first to experience the future of property intelligence. Help us shape the next generation of AI-powered property management while getting early access to groundbreaking features.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium" asChild>
                  <Link to="/pilot_form">Apply Now →</Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium" asChild>
                  <Link to="/contact">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Join Our Pilot?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get exclusive access to cutting-edge features and help shape the future of property AI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Early Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Be the first to use new features and capabilities before they're released to the public.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Shape the Future</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Your feedback directly influences product development and feature priorities.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Priority Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Get dedicated support from our team and direct access to our developers.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Exclusive Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Access to pilot-only features and capabilities not available to regular users.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  What to Expect
                </h2>
                <p className="text-xl text-muted-foreground">
                  Here's what your pilot journey will look like
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Application & Onboarding</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Complete our pilot application and we'll reach out within 48 hours to discuss your specific needs and set up your account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Training & Setup</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We'll provide personalized training sessions and help you upload your first documents to get started quickly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Active Usage & Feedback</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Use Hobson AI in your daily workflow while providing regular feedback through surveys, calls, and our dedicated pilot channel.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Early Access Benefits</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Continue to receive early access to new features and preferential pricing as we transition to general availability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Join?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Applications are reviewed on a rolling basis. Apply today to secure your spot in our exclusive pilot program.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium" asChild>
                  <Link to="/pilot_form">
                    Apply for Pilot Access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium" asChild>
                  <Link to="/contact">Have Questions?</Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Questions about the pilot program? <Link to="/contact" className="text-primary hover:underline">Contact us</Link> and we'll be happy to help.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Pilot;