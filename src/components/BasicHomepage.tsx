import { Helmet } from "react-helmet-async";

export const BasicHomepage = () => {
  return (
    <>
      <Helmet>
        <title>AI Real Estate AI | Document Intelligence | Hobson AI</title>
        <meta name="description" content="Transform a tenancy agreement with intelligent analysis, automated insights, and instant answers. Learn with comprehensive guides and documentation." />
        <meta name="keywords" content="document intelligence, real estate ai, property management software, ai document analysis, AI learning resources, tenancy agreement" />
        <meta property="og:title" content="AI-Document Intelligence for the Property Industry | Hobson AI" />
        <meta property="og:description" content="Transform a tenancy agreement with intelligent analysis, automated insights, and instant answers. Learn with comprehensive guides and documentation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hobsonschoice.ai" />
        <link rel="canonical" href="https://hobsonschoice.ai" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-primary">Hobson AI</h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/blog" className="text-foreground hover:text-primary transition-colors">Blog</a>
                <a href="/pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
                <a href="/contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI-powered document insights
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your property documents with intelligent analysis, automated insights, and instant answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Get Started
              </button>
              <button className="border border-border px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Document Analysis</h3>
              <p className="text-muted-foreground">
                Upload any property document and get instant intelligent analysis with key insights.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Smart Insights</h3>
              <p className="text-muted-foreground">
                Get automated insights and answers to your property management questions.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Learn & Grow</h3>
              <p className="text-muted-foreground">
                Access comprehensive guides and documentation to enhance your knowledge.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card/50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold">Hobson AI</h3>
                <p className="text-sm text-muted-foreground">AI-powered document intelligence</p>
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy-policy" className="text-muted-foreground hover:text-foreground">Privacy</a>
                <a href="/data-protection" className="text-muted-foreground hover:text-foreground">Data Protection</a>
                <a href="/contact" className="text-muted-foreground hover:text-foreground">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};