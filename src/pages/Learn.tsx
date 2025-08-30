import { Helmet } from 'react-helmet-async';

const Learn = () => {

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Learn - Hobson's Choice AI Documentation and Guides</title>
        <meta name="description" content="Comprehensive documentation, guides, and resources to master Hobson's Choice AI. Learn prompt engineering, explore features, and discover use cases." />
        <meta name="keywords" content="Hobson AI documentation, AI property management guide, prompt engineering, document analysis tutorials" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Learn Hub</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Comprehensive documentation and guides for Hobson AI
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card rounded-lg border p-6 text-left">
              <h3 className="text-xl font-semibold mb-4">📂 Document Processing</h3>
              <p className="text-muted-foreground">
                Hobson AI automatically reads and extracts key details from leases, contracts, and reports.
              </p>
            </div>
            <div className="bg-card rounded-lg border p-6 text-left">
              <h3 className="text-xl font-semibold mb-4">🔍 Smart Search</h3>
              <p className="text-muted-foreground">
                Ask questions in plain language and get instant answers from your documents.
              </p>
            </div>
            <div className="bg-card rounded-lg border p-6 text-left">
              <h3 className="text-xl font-semibold mb-4">📊 Analytics</h3>
              <p className="text-muted-foreground">
                Transform unstructured text into clear summaries and actionable insights.
              </p>
            </div>
            <div className="bg-card rounded-lg border p-6 text-left">
              <h3 className="text-xl font-semibold mb-4">🤝 Collaboration</h3>
              <p className="text-muted-foreground">
                Share insights and work together with your team seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Learn;