import { GlobalHeader } from "@/components/GlobalHeader";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Us - Hobson's Choice AI | Property Intelligence Company</title>
        <meta name="description" content="Learn about Hobson's Choice AI, the revolutionary property intelligence platform that transforms how property professionals work with documents and data using AI." />
        <meta name="keywords" content="about Hobson AI, property intelligence company, AI property management, document analysis AI, real estate technology" />
        <meta property="og:title" content="About Us - Hobson's Choice AI" />
        <meta property="og:description" content="Revolutionary property intelligence platform transforming how professionals work with property documents and data." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <GlobalHeader />
      
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="py-24 lg:py-32 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge variant="outline" className="mb-4">
                About Hobson's Choice AI
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Revolutionizing Property Intelligence
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're transforming how property professionals work with documents and data, 
                making complex property intelligence accessible through conversational AI.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <Card className="p-8">
                <CardContent className="p-0">
                  <Target className="h-12 w-12 text-primary mb-6" />
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To democratize property intelligence by making advanced AI accessible to every 
                    property professional, regardless of technical expertise. We believe that powerful 
                    document analysis shouldn't require complex software or extensive training.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-8">
                <CardContent className="p-0">
                  <Award className="h-12 w-12 text-primary mb-6" />
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    A future where property professionals spend less time searching through documents 
                    and more time making strategic decisions. Where AI serves as an intelligent assistant, 
                    not a replacement, enhancing human expertise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                What We Do
              </h2>
              <p className="text-xl text-muted-foreground">
                Hobson's Choice AI transforms complex property documents into actionable insights 
                through our conversational AI platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Document Intelligence
                  </h3>
                  <p className="text-muted-foreground">
                    Extract insights from leases, contracts, surveys, and property documents 
                    using advanced AI analysis.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Conversational Interface
                  </h3>
                  <p className="text-muted-foreground">
                    Ask questions in natural language and get instant, accurate answers 
                    about your property portfolio.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Strategic Insights
                  </h3>
                  <p className="text-muted-foreground">
                    Turn document data into strategic insights for better property 
                    management and investment decisions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Values
              </h2>
              <p className="text-xl text-muted-foreground">
                The principles that guide everything we do at Hobson's Choice AI.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Simplicity</h3>
                <p className="text-muted-foreground text-sm">
                  Complex technology should be simple to use
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Transparency</h3>
                <p className="text-muted-foreground text-sm">
                  Clear pricing, honest communication, no hidden surprises
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  Pushing boundaries while solving real problems
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Partnership</h3>
                <p className="text-muted-foreground text-sm">
                  Working alongside professionals, not replacing them
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Hobson's Choice */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                Why "Hobson's Choice"?
              </h2>
              <Card className="p-8">
                <CardContent className="p-0">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    The term "Hobson's Choice" traditionally refers to having no real choice at all—
                    take what's offered or get nothing. In the property world, professionals have 
                    long faced their own Hobson's Choice: accept time-consuming manual document 
                    review or miss critical insights entirely.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We're changing that. With Hobson's Choice AI, you get a genuine choice: 
                    continue with traditional methods or embrace intelligent automation that 
                    enhances your expertise. The choice is yours, and for the first time, 
                    it's a real one.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <HomepageFooter />
    </div>
  );
};

export default About;