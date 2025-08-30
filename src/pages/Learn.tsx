import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Learn = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', label: 'Introduction', content: 'Welcome to Hobson AI Learn Hub' },
    { id: 'features', label: 'Features', content: 'Discover powerful AI features' },
    { id: 'getting-started', label: 'Getting Started', content: 'Quick start guide' },
    { id: 'use-cases', label: 'Use Cases', content: 'Real-world applications' },
  ];

  const renderContent = () => {
    const section = sections.find(s => s.id === activeSection);
    
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{section?.label}</h1>
          <div className="prose lg:prose-xl">
            <p className="text-lg text-muted-foreground mb-6">
              {section?.content}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">📂 Document Processing</h3>
                <p className="text-muted-foreground">
                  Hobson AI automatically reads and extracts key details from leases, contracts, and reports.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">🔍 Smart Search</h3>
                <p className="text-muted-foreground">
                  Ask questions in plain language and get instant answers from your documents.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">📊 Analytics</h3>
                <p className="text-muted-foreground">
                  Transform unstructured text into clear summaries and actionable insights.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6">
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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Learn - Hobson's Choice AI Documentation and Guides</title>
        <meta name="description" content="Comprehensive documentation, guides, and resources to master Hobson's Choice AI. Learn prompt engineering, explore features, and discover use cases." />
        <meta name="keywords" content="Hobson AI documentation, AI property management guide, prompt engineering, document analysis tutorials" />
      </Helmet>
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Learn Hub</h2>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                  activeSection === section.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Learn;