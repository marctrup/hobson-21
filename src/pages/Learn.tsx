import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Book, Lightbulb, Puzzle, Wand2, Users, Library, FileText, Clock, Bell, Activity, MessageSquare, Heart, CreditCard, HelpCircle, Play } from 'lucide-react';

const Learn = () => {
  const [activeHorizontalTab, setActiveHorizontalTab] = useState('introduction');
  const [activeVerticalTab, setActiveVerticalTab] = useState('welcome');

  const horizontalTabs = [
    { id: 'introduction', label: 'Introduction', icon: Book },
    { id: 'features', label: 'Features', icon: Lightbulb },
    { id: 'integrations', label: 'Integrations', icon: Puzzle },
    { id: 'tips-tricks', label: 'Tips & tricks', icon: Wand2 },
    { id: 'prompt-engineering', label: 'Prompt Engineering', icon: Users },
    { id: 'use-cases', label: 'Use Cases', icon: Library },
    { id: 'glossary', label: 'Glossary', icon: FileText },
    { id: 'changelog', label: 'Changelog', icon: Clock },
  ];

  // Static top menu items (separate pages)
  const staticVerticalTabs = [
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'status', label: 'Status', icon: Activity },
    { id: 'feature-requests', label: 'Feature requests', icon: MessageSquare },
  ];

  // Dynamic submenu items based on horizontal selection
  const getContextualVerticalTabs = (horizontalTab: string) => {
    const baseItems = [
      { id: 'overview', label: 'Overview', icon: Heart },
      { id: 'documentation', label: 'Documentation', icon: FileText },
      { id: 'examples', label: 'Examples', icon: Play },
      { id: 'faq', label: 'FAQ', icon: HelpCircle },
    ];

    switch (horizontalTab) {
      case 'introduction':
        return [
          { id: 'welcome', label: 'Welcome', icon: Heart },
          { id: 'getting-started', label: 'Getting Started', icon: Play },
          { id: 'basic-concepts', label: 'Basic Concepts', icon: Book },
          { id: 'first-steps', label: 'First Steps', icon: FileText },
        ];
      case 'features':
        return [
          { id: 'core-features', label: 'Core Features', icon: Heart },
          { id: 'advanced-features', label: 'Advanced Features', icon: Wand2 },
          { id: 'feature-comparison', label: 'Feature Comparison', icon: FileText },
          { id: 'roadmap', label: 'Roadmap', icon: Clock },
        ];
      case 'integrations':
        return [
          { id: 'available-integrations', label: 'Available Integrations', icon: Puzzle },
          { id: 'setup-guide', label: 'Setup Guide', icon: Play },
          { id: 'api-reference', label: 'API Reference', icon: FileText },
          { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
        ];
      case 'tips-tricks':
        return [
          { id: 'best-practices', label: 'Best Practices', icon: Heart },
          { id: 'productivity-tips', label: 'Productivity Tips', icon: Lightbulb },
          { id: 'common-mistakes', label: 'Common Mistakes', icon: HelpCircle },
          { id: 'advanced-techniques', label: 'Advanced Techniques', icon: Wand2 },
        ];
      case 'prompt-engineering':
        return [
          { id: 'fundamentals', label: 'Fundamentals', icon: Users },
          { id: 'advanced-prompting', label: 'Advanced Prompting', icon: Wand2 },
          { id: 'prompt-templates', label: 'Prompt Templates', icon: FileText },
          { id: 'optimization', label: 'Optimization', icon: Activity },
        ];
      case 'use-cases':
        return [
          { id: 'business-scenarios', label: 'Business Scenarios', icon: Library },
          { id: 'industry-examples', label: 'Industry Examples', icon: FileText },
          { id: 'case-studies', label: 'Case Studies', icon: Book },
          { id: 'success-stories', label: 'Success Stories', icon: Heart },
        ];
      case 'glossary':
        return [
          { id: 'terms-definitions', label: 'Terms & Definitions', icon: FileText },
          { id: 'acronyms', label: 'Acronyms', icon: Book },
          { id: 'technical-terms', label: 'Technical Terms', icon: Wand2 },
          { id: 'industry-jargon', label: 'Industry Jargon', icon: Users },
        ];
      case 'changelog':
        return [
          { id: 'latest-updates', label: 'Latest Updates', icon: Clock },
          { id: 'release-notes', label: 'Release Notes', icon: FileText },
          { id: 'version-history', label: 'Version History', icon: Activity },
          { id: 'upcoming-changes', label: 'Upcoming Changes', icon: Bell },
        ];
      default:
        return baseItems;
    }
  };

  const currentVerticalTabs = [...staticVerticalTabs, ...getContextualVerticalTabs(activeHorizontalTab)];

  const renderContent = () => {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label}
          </h1>
          <div className="bg-muted/50 rounded-lg p-8 border border-border">
            <p className="text-muted-foreground text-lg">
              Content for {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label} - {currentVerticalTabs.find(tab => tab.id === activeVerticalTab)?.label}
            </p>
            <p className="text-muted-foreground mt-4">
              This is where the actual content will go for each section. The layout is now ready for you to populate with specific content for each combination of tabs.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Learn - Hobson's Choice AI</title>
        <meta name="description" content="Learn how to use Hobson's Choice AI with our comprehensive guides, tutorials, and documentation." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Book className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Learn</h1>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
                <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
                <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Vertical Sidebar */}
          <aside className="w-64 border-r border-border bg-background/50 min-h-[calc(100vh-4rem)]">
            <div className="p-4 space-y-6">
              {/* Global Navigation Section */}
              <div>
                <div className="px-3 pb-2 mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Global
                  </h3>
                </div>
                <nav className="space-y-1">
                  {staticVerticalTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveVerticalTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          activeVerticalTab === tab.id
                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Visual Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-background px-2">
                    <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Contextual Section */}
              <div>
                <div className="px-3 pb-3 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    <h3 className="text-sm font-bold text-foreground">
                      {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground pl-3">
                    Navigate through {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label.toLowerCase()} content
                  </p>
                </div>
                <nav className="space-y-1">
                  {getContextualVerticalTabs(activeHorizontalTab).map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveVerticalTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          activeVerticalTab === tab.id
                            ? 'bg-accent/10 text-accent-foreground border border-accent/20 shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col">
            {/* Horizontal Tab Navigation */}
            <div className="border-b border-border bg-background/50">
              <div className="px-6">
                <nav className="flex space-x-8 overflow-x-auto">
                  {horizontalTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveHorizontalTab(tab.id)}
                        className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-colors whitespace-nowrap ${
                          activeHorizontalTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Learn;