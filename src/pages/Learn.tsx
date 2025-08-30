import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import { HomepageHeader } from "@/components/homepage/HomepageHeader";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { LearnIntroVideo } from "@/components/videos/LearnIntroVideo";

const Learn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Learn - Hobson's Choice AI Documentation and Guides</title>
        <meta name="description" content="Comprehensive documentation, guides, and resources to master Hobson's Choice AI. Learn prompt engineering, explore features, and discover use cases." />
        <meta name="keywords" content="Hobson AI documentation, AI property management guide, prompt engineering, document analysis tutorials" />
        <meta property="og:title" content="Learn Hub - Hobson AI Documentation | Property Management AI Training" />
        <meta property="og:description" content="Master Hobson AI with comprehensive guides, tutorials, and resources for property professionals." />
        <meta property="og:image" content="https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" />
        <link rel="canonical" href="https://hobsonschoice.ai/learn" />
      </Helmet>
      
      <HomepageHeader />
      
      {/* Hero Section */}
      <section className="pt-16 pb-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Learn Hub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive documentation, guides, and resources to master Hobson's Choice AI for property management.
            </p>
          </div>
          
          {/* Intro Video */}
          <div className="flex justify-center mb-16">
            <LearnIntroVideo />
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Master Hobson AI Features
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to get the most from your AI property assistant
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card rounded-lg border p-6 text-left hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📂</div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Document Processing</h3>
                <p className="text-muted-foreground mb-4">
                  Hobson AI automatically reads and extracts key details from leases, contracts, and reports.
                </p>
                <Link to="/learn/documents" className="text-primary hover:text-primary/80 font-medium">
                  Learn more →
                </Link>
              </div>
              
              <div className="bg-card rounded-lg border p-6 text-left hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Smart Search</h3>
                <p className="text-muted-foreground mb-4">
                  Ask questions in plain language and get instant answers from your documents.
                </p>
                <Link to="/learn/search" className="text-primary hover:text-primary/80 font-medium">
                  Learn more →
                </Link>
              </div>
              
              <div className="bg-card rounded-lg border p-6 text-left hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Analytics & Insights</h3>
                <p className="text-muted-foreground mb-4">
                  Transform unstructured text into clear summaries and actionable insights.
                </p>
                <Link to="/learn/analytics" className="text-primary hover:text-primary/80 font-medium">
                  Learn more →
                </Link>
              </div>
              
              <div className="bg-card rounded-lg border p-6 text-left hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Collaboration</h3>
                <p className="text-muted-foreground mb-4">
                  Share insights and work together with your team seamlessly.
                </p>
                <Link to="/learn/collaboration" className="text-primary hover:text-primary/80 font-medium">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Getting Started
              </h2>
              <p className="text-xl text-muted-foreground">
                Follow these steps to start using Hobson AI effectively
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Upload Your Documents</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                    Start by uploading your property documents - leases, contracts, reports, or any property-related files. Hobson AI supports multiple formats and automatically processes them.
                  </p>
                  <Link to="/pilot_form" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors">
                    Join Pilot Program →
                  </Link>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Ask Natural Questions</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                    Use plain English to ask questions about your properties. "What's the rent review date for 123 Main Street?" or "Show me all properties with break clauses."
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Get Instant Insights</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Receive accurate answers with source citations, summaries, and actionable recommendations based on your documents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our pilot program and get hands-on experience with Hobson AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/pilot_form"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                Apply to Pilot Program
              </Link>
              <Link 
                to="/contact"
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <HomepageFooter />
    </div>
  );
};

export default Learn;