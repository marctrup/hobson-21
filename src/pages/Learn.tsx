import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Book, Lightbulb, Puzzle, Wand2, Users, Library, FileText, Clock, Bell, Activity, MessageSquare, Heart, CreditCard, HelpCircle, Play, Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HEUBarVisualization } from '@/components/HEUBarVisualization';
import ChatCostExample from '@/components/features/ChatCostExample';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/features/AuthDialog';
import { CreatePostDialog } from '@/components/features/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { UseCasesContent } from '@/components/UseCasesContent';
import { GlobalHeader } from '@/components/GlobalHeader';
import { IntegrationCards } from '@/components/learn/IntegrationCards';
import owlMascot from "@/assets/owl-mascot.png";

const Learn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const [activeHorizontalTab, setActiveHorizontalTab] = useState('introduction');
  const [activeVerticalTab, setActiveVerticalTab] = useState('welcome');
  const [isGlobalPageActive, setIsGlobalPageActive] = useState(false);
  const [activeTocSection, setActiveTocSection] = useState('positioning-statement');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);

  // Handle both URL param and hash navigation
  useEffect(() => {
    const handleNavigation = () => {
      // Prioritize URL param over hash
      const urlSection = section?.toLowerCase().replace(/-/g, '');
      const hash = window.location.hash.substring(1).toLowerCase(); // Remove # and lowercase
      const activeSection = urlSection || hash;
      
      if (activeSection) {
        // Map section/hash to horizontal and vertical tabs
        const sectionMap: Record<string, { horizontal: string; vertical?: string }> = {
          // Introduction section
          'introduction': { horizontal: 'introduction', vertical: 'positioning-statement' },
          'positioning-statement': { horizontal: 'introduction', vertical: 'positioning-statement' },
          'positioningstatement': { horizontal: 'introduction', vertical: 'positioning-statement' },
          'plans-credits': { horizontal: 'introduction', vertical: 'plans-credits' },
          'planscredits': { horizontal: 'introduction', vertical: 'plans-credits' },
          'plans-and-credit': { horizontal: 'introduction', vertical: 'plans-credits' },
          'plansandcredit': { horizontal: 'introduction', vertical: 'plans-credits' },
          'faq': { horizontal: 'introduction', vertical: 'faq' },
          
          // Features section
          'features': { horizontal: 'features', vertical: 'core-features' },
          'core-features': { horizontal: 'features', vertical: 'core-features' },
          'corefeatures': { horizontal: 'features', vertical: 'core-features' },
          'advanced-features': { horizontal: 'features', vertical: 'advanced-features' },
          'advancedfeatures': { horizontal: 'features', vertical: 'advanced-features' },
          'feature-comparison': { horizontal: 'features', vertical: 'feature-comparison' },
          'featurecomparison': { horizontal: 'features', vertical: 'feature-comparison' },
          'roadmap': { horizontal: 'features', vertical: 'roadmap' },
          
          // Integrations section
          'integrations': { horizontal: 'integrations', vertical: 'available-integrations' },
          'intergrations': { horizontal: 'integrations', vertical: 'available-integrations' },
          'available-integrations': { horizontal: 'integrations', vertical: 'available-integrations' },
          'availableintegrations': { horizontal: 'integrations', vertical: 'available-integrations' },
          'setup-guide': { horizontal: 'integrations', vertical: 'setup-guide' },
          'setupguide': { horizontal: 'integrations', vertical: 'setup-guide' },
          'set-up-guide': { horizontal: 'integrations', vertical: 'setup-guide' },
          'api-reference': { horizontal: 'integrations', vertical: 'api-reference' },
          'apireference': { horizontal: 'integrations', vertical: 'api-reference' },
          'troubleshooting': { horizontal: 'integrations', vertical: 'troubleshooting' },
          
          // Prompt Engineering section
          'prompt-engineering': { horizontal: 'prompt-engineering', vertical: 'prompt-engineering' },
          'promptengineering': { horizontal: 'prompt-engineering', vertical: 'prompt-engineering' },
          'fundamentals': { horizontal: 'prompt-engineering', vertical: 'prompt-engineering' },
          'fundementals': { horizontal: 'prompt-engineering', vertical: 'prompt-engineering' },
          'advanced-prompting': { horizontal: 'prompt-engineering', vertical: 'advanced-prompting' },
          'advancedprompting': { horizontal: 'prompt-engineering', vertical: 'advanced-prompting' },
          'debugging-prompts': { horizontal: 'prompt-engineering', vertical: 'debugging-prompts' },
          'debuggingprompts': { horizontal: 'prompt-engineering', vertical: 'debugging-prompts' },
          
          // Use Cases section
          'use-cases': { horizontal: 'use-cases' },
          'usecases': { horizontal: 'use-cases' },
          
          // Glossary section
          'glossary': { horizontal: 'glossary', vertical: 'hobson-glossary' },
          'hobson-glossary': { horizontal: 'glossary', vertical: 'hobson-glossary' },
          'hobsonglossary': { horizontal: 'glossary', vertical: 'hobson-glossary' },
        };
        
        const mapping = sectionMap[activeSection];
        if (mapping) {
          setActiveHorizontalTab(mapping.horizontal);
          if (mapping.vertical) {
            setActiveVerticalTab(mapping.vertical);
          }
        }
      }
    };

    // Run on mount and when section changes
    handleNavigation();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, [section]);

  // Set initial active section based on current tab
  useEffect(() => {
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'faq') {
      setActiveTocSection('positioning-statement');
    } else if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits') {
      setActiveTocSection('overview');
    } else if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'positioning-statement') {
      setActiveTocSection('hobson-platform-overview');
    } else if (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'prompt-engineering') {
      setActiveTocSection('what-is-prompting');
    } else if (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'advanced-prompting') {
      setActiveTocSection('prompt-library');
    } else if (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'debugging-prompts') {
      setActiveTocSection('quick-fixes');
    }
  }, [activeHorizontalTab, activeVerticalTab]);

  // Scroll spy effect - moved to top level to avoid hook order issues
  useEffect(() => {
    let tocSections: string[] = [];
    
    // Only run scroll spy for pages that have table of contents
    if ((activeHorizontalTab === 'introduction' && activeVerticalTab === 'faq') || 
        (activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits') ||
        (activeHorizontalTab === 'features' && ['core-features', 'advanced-features', 'feature-comparison', 'roadmap'].includes(activeVerticalTab)) ||
        (activeHorizontalTab === 'integrations' && ['available-integrations', 'setup-guide', 'api-reference', 'troubleshooting'].includes(activeVerticalTab)) ||
        (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'prompt-engineering') ||
        (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'advanced-prompting') ||
        (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'debugging-prompts')) {
      
      if (activeHorizontalTab === 'introduction') {
        if (activeVerticalTab === 'faq') {
          tocSections = ['positioning-statement', 'building-with-hobson', 'features', 'plans-credits-faq', 'managing-account', 'policies-security', 'how-hobson-works', 'about-hobson'];
        } else if (activeVerticalTab === 'plans-credits') {
          tocSections = ['overview', 'starter-pack', 'feature-comparison', 'available-plans', 'credit-display', 'credit-usage', 'credit-rollovers', 'faq-plans', 'troubleshooting'];
        }
      } else if (activeHorizontalTab === 'features') {
        if (activeVerticalTab === 'core-features') {
          tocSections = ['intelligent-document-processing', 'smart-search-insights', 'real-time-analytics', 'collaboration-ready', 'security-compliance'];
        } else if (activeVerticalTab === 'advanced-features') {
          tocSections = ['ai-powered-summarisation', 'cross-document-insights', 'automated-report-generation', 'clause-obligation-tracking', 'integration-ready'];
        } else if (activeVerticalTab === 'feature-comparison') {
          tocSections = ['comparison-table', 'key-differentiators'];
        } else if (activeVerticalTab === 'roadmap') {
          tocSections = ['recently-launched', 'in-progress', 'coming-soon'];
        }
      } else if (activeHorizontalTab === 'integrations') {
        if (activeVerticalTab === 'available-integrations' || !activeVerticalTab) {
          tocSections = ['planned-integrations', 'why-integrations-matter', 'what-were-working-towards', 'benefit-for-you'];
        } else if (activeVerticalTab === 'setup-guide') {
          tocSections = ['coming-soon-notice', 'what-to-expect'];
        } else if (activeVerticalTab === 'api-reference') {
          tocSections = ['overview', 'authentication', 'endpoints', 'document-analysis', 'query-interface', 'webhooks', 'rate-limits', 'error-handling', 'examples'];
        } else if (activeVerticalTab === 'troubleshooting') {
          tocSections = ['coming-soon-notice', 'what-to-expect'];
        }
      } else if (activeHorizontalTab === 'prompt-engineering') {
        if (activeVerticalTab === 'prompt-engineering') {
          tocSections = ['what-is-prompting', 'why-prompting-matters', 'how-hobson-thinks', 'clear-method', 'advanced-tactics'];
        } else if (activeVerticalTab === 'advanced-prompting') {
          tocSections = ['prompt-library', 'lease-summaries', 'extracting-data', 'comparing-properties', 'risk-compliance', 'report-building'];
        } else if (activeVerticalTab === 'debugging-prompts') {
          tocSections = ['quick-fixes', 'deep-reviews', 'fragile-areas', 'performance-issues', 'persistent-problems', 'debugging-flows', 'root-cause', 'pro-tips'];
        }
      }

      const handleScroll = () => {
        const scrollPosition = window.scrollY + 150; // offset for header and better accuracy

        for (let i = tocSections.length - 1; i >= 0; i--) {
          const element = document.getElementById(tocSections[i]);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveTocSection(tocSections[i]);
            break;
          }
        }
      };

      const handleClick = () => {
        // Re-run scroll detection after any click to ensure proper highlighting
        setTimeout(handleScroll, 100);
      };

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('click', handleClick);
      handleScroll(); // Set initial active section

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('click', handleClick);
      };
    }
  }, [activeHorizontalTab, activeVerticalTab]);

  const horizontalTabs = [
    { id: 'introduction', label: 'Introduction', icon: Book },
    { id: 'features', label: 'Features', icon: Lightbulb },
    { id: 'integrations', label: 'Integrations', icon: Puzzle },
    { id: 'prompt-engineering', label: 'Prompt Engineering', icon: Users },
    { id: 'use-cases', label: 'Use Cases', icon: Library },
    { id: 'glossary', label: 'Glossary', icon: FileText },
  ];

  // Static top menu items (separate pages)
  const staticVerticalTabs = [
    { id: 'announcements', label: 'Announcements', icon: Bell, href: '/announcements' },
    { id: 'status', label: 'Status', icon: Activity, href: '/status' },
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
          { id: 'positioning-statement', label: 'Positioning Statement', icon: Play },
          { id: 'plans-credits', label: 'Plans and Credits', icon: CreditCard },
          { id: 'faq', label: 'FAQ', icon: HelpCircle },
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
          { id: 'prompt-engineering', label: 'Fundamentals', icon: Users },
          { id: 'advanced-prompting', label: 'Advanced Prompting', icon: Wand2 },
          { id: 'debugging-prompts', label: 'Debugging Prompts', icon: FileText },
        ];
      case 'use-cases':
        return [];
      case 'glossary':
        return [
          { id: 'hobson-glossary', label: 'Hobson Glossary', icon: FileText },
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

  const handleCreatePost = () => {
    if (!user) {
      setIsAuthDialogOpen(true);
    } else {
      setIsCreatePostDialogOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsCreatePostDialogOpen(true);
  };

  const renderContent = () => {
    // Check if it's the announcements page - redirect to dedicated page
    if (activeVerticalTab === 'announcements') {
      window.location.href = '/announcements';
      return null;
    }
    
    // Check if it's the feature requests page - redirect to dedicated page
    if (activeVerticalTab === 'feature-requests') {
      window.location.href = '/feature-requests';
      return null;
    }
    
    // Check if it's the status page - redirect to dedicated page
    if (activeVerticalTab === 'status') {
      window.location.href = '/status';
      return null;
    }
    
    // Check if it's a global navigation item
    const isGlobalPage = staticVerticalTabs.some(tab => tab.id === activeVerticalTab && !['announcements', 'feature-requests', 'status'].includes(tab.id));
    
    if (isGlobalPage) {
      const activeTab = staticVerticalTabs.find(tab => tab.id === activeVerticalTab);
      return (
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <div className="mb-6">
                {activeTab && <activeTab.icon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />}
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {activeTab?.label}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-muted-foreground">Coming Soon</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're working hard to bring you the {activeTab?.label.toLowerCase()} section. 
                Stay tuned for updates and new content!
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Handle Core Features content
    if (activeHorizontalTab === 'features' && activeVerticalTab === 'core-features') {
      const tocSections = [
        { id: 'intelligent-document-processing', label: 'Intelligent Document Processing' },
        { id: 'smart-search-insights', label: 'Smart Search & Insights' },
        { id: 'real-time-analytics', label: 'Real-Time Analytics' },
        { id: 'collaboration-ready', label: 'Collaboration Ready' },
        { id: 'security-compliance', label: 'Security & Compliance' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            <div className="lg:flex lg:gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="mb-6 md:mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Core Features of Hobson AI</h1>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Hobson AI is an intelligent platform that turns complex documents into clear, usable insights. 
                    Designed for property and document management professionals, it helps you save time, reduce risk, 
                    and make smarter decisions by putting the right information at your fingertips.
                  </p>
                </div>

                <div className="space-y-8 md:space-y-12">
                  {/* Intelligent Document Processing */}
                  <section id="intelligent-document-processing" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📂</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">Intelligent Document Processing</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        Hobson AI automatically reads and extracts key details from leases, contracts, and reports. 
                        This removes the need for manual searching and ensures important information is never missed.
                      </p>
                    </div>
                  </section>

                  {/* Smart Search & Insights */}
                  <section id="smart-search-insights" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🔍</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">Smart Search & Insights</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        Ask questions in plain language like "When is the rent review date?" and Hobson instantly 
                        retrieves the answer from your documents. It's like having a specialist always ready to help.
                      </p>
                    </div>
                  </section>

                  {/* Real-Time Analytics */}
                  <section id="real-time-analytics" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📊</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">Real-Time Analytics</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        Hobson transforms unstructured text into clear summaries and dashboards. Spot trends, 
                        compare clauses, and access data that supports confident, evidence-based decisions.
                      </p>
                    </div>
                  </section>

                  {/* Collaboration Ready */}
                  <section id="collaboration-ready" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🤝</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">Collaboration Ready</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        Insights can be shared across your team securely, creating a single source of truth. 
                        Everyone works from the same reliable information, reducing confusion and speeding up workflows.
                      </p>
                    </div>
                  </section>

                  {/* Security & Compliance */}
                  <section id="security-compliance" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🔐</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">Security & Compliance</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        Built with enterprise-grade encryption and strict data handling, Hobson keeps your information safe. 
                        Security and compliance are at the heart of everything we do.
                      </p>
                    </div>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Advanced Features content
    if (activeHorizontalTab === 'features' && activeVerticalTab === 'advanced-features') {
      const tocSections = [
        { id: 'ai-powered-summarisation', label: 'AI-Powered Summarisation' },
        { id: 'cross-document-insights', label: 'Cross-Document Insights' },
        { id: 'automated-report-generation', label: 'Automated Report Generation' },
        { id: 'clause-obligation-tracking', label: 'Clause & Obligation Tracking' },
        { id: 'integration-ready', label: 'Integration Ready' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            <div className="lg:flex lg:gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="mb-6 md:mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Advanced Features of Hobson AI</h1>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Beyond the core features, Hobson AI includes advanced capabilities that give professionals even deeper 
                    insights and time-saving tools. These features are designed to handle complexity, automate repetitive tasks, 
                    and uncover connections across your documents that would otherwise go unnoticed.
                  </p>
                </div>

                <div className="space-y-8 md:space-y-12">
                  {/* AI-Powered Summarisation */}
                  <section id="ai-powered-summarisation" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🧠</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">AI-Powered Summarisation</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        Quickly understand long contracts or reports with plain-language summaries that highlight the most important details.
                      </p>
                    </div>
                  </section>

                  {/* Cross-Document Insights */}
                  <section id="cross-document-insights" className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🔗</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-3">Cross-Document Insights</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Compare terms, find inconsistencies, and surface connections across multiple documents at once.
                      </p>
                    </div>
                  </section>

                  {/* Automated Report Generation */}
                  <section id="automated-report-generation" className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📑</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-3">Automated Report Generation</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Turn extracted data into professional reports and dashboards automatically, saving hours of manual work.
                      </p>
                    </div>
                  </section>

                  {/* Clause & Obligation Tracking */}
                  <section id="clause-obligation-tracking" className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📌</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-3">Clause & Obligation Tracking</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Stay ahead of deadlines, renewals, and key obligations. Hobson flags upcoming dates and critical actions automatically.
                      </p>
                    </div>
                  </section>

                  {/* Integration Ready */}
                  <section id="integration-ready" className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🌍</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-3">Integration Ready</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Connect Hobson to your existing systems (such as document management platforms or CRMs) so insights flow seamlessly into your workflows.
                      </p>
                    </div>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Feature Comparison content
    if (activeHorizontalTab === 'features' && activeVerticalTab === 'feature-comparison') {
      const tocSections = [
        { id: 'comparison-table', label: 'Comparison Table' },
        { id: 'key-differentiators', label: 'Key Differentiators' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-5xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-4">Feature Comparisons</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Choosing the right approach to document intelligence means understanding the differences. 
                    This page shows how Hobson AI compares with manual work and traditional software, 
                    so you can see the advantages more clearly.
                  </p>
                </div>

                {/* Comparison Table */}
                <div id="comparison-table" className="mb-12 md:mb-16">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">Feature Comparison</h2>
                  <div className="bg-card border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">Feature</th>
                            <th className="text-left p-4 font-semibold text-foreground">Manual Work</th>
                            <th className="text-left p-4 font-semibold text-foreground">Traditional Software</th>
                            <th className="text-left p-4 font-semibold text-foreground bg-primary/5">Hobson AI</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-4 font-medium text-foreground">Document processing speed</td>
                            <td className="p-4 text-muted-foreground">Hours to days per document</td>
                            <td className="p-4 text-muted-foreground">Minutes with setup required</td>
                            <td className="p-4 bg-primary/5">
                              <span className="text-primary font-medium">✓ Instant processing</span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4 font-medium text-foreground">Accuracy of data extraction</td>
                            <td className="p-4 text-muted-foreground">Variable, prone to errors</td>
                            <td className="p-4 text-muted-foreground">Good for structured data</td>
                            <td className="p-4 bg-primary/5">
                              <span className="text-primary font-medium">✓ AI-powered accuracy</span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4 font-medium text-foreground">Ability to answer natural-language questions</td>
                            <td className="p-4 text-muted-foreground">Manual search required</td>
                            <td className="p-4 text-muted-foreground">Limited or not available</td>
                            <td className="p-4 bg-primary/5">
                              <span className="text-primary font-medium">✓ Natural conversation</span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4 font-medium text-foreground">Cross-document insights</td>
                            <td className="p-4 text-muted-foreground">Very time-consuming</td>
                            <td className="p-4 text-muted-foreground">Basic comparison features</td>
                            <td className="p-4 bg-primary/5">
                              <span className="text-primary font-medium">✓ Automatic connections</span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4 font-medium text-foreground">Report generation</td>
                            <td className="p-4 text-muted-foreground">Manual creation</td>
                            <td className="p-4 text-muted-foreground">Template-based</td>
                            <td className="p-4 bg-primary/5">
                              <span className="text-primary font-medium">✓ AI-generated insights</span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4 font-medium text-foreground">Collaboration & sharing</td>
                            <td className="p-4 text-muted-foreground">Email or file sharing</td>
                            <td className="p-4 text-muted-foreground">Basic sharing features</td>
                            <td className="p-4 bg-primary/5">
                              <span className="text-primary font-medium">✓ Real-time collaboration</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-medium text-foreground">Security & compliance</td>
                            <td className="p-4 text-muted-foreground">Depends on processes</td>
                            <td className="p-4 text-muted-foreground">Standard security</td>
                            <td className="p-4 bg-primary/5">
                              <span className="text-primary font-medium">✓ Enterprise-grade</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Differentiator Callouts */}
                <div id="key-differentiators" className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-8">Key Differentiators</h2>
                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                          <span className="text-xl">💬</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Natural-Language Search</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Ask plain-language questions and get instant answers from your documents.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🔗</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Cross-Document Insights</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Spot trends, connections, and inconsistencies across your entire document set.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🔐</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Built for Compliance</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Enterprise-level security and data handling designed to meet strict standards.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Closing Note */}
                <div className="bg-muted/30 rounded-lg p-6 border border-primary/10">
                  <p className="text-muted-foreground text-center leading-relaxed">
                    Every organisation is different. Hobson AI is designed to complement existing tools 
                    while providing powerful features you won't find elsewhere.
                  </p>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Product Roadmap content
    if (activeHorizontalTab === 'features' && activeVerticalTab === 'roadmap') {
      const tocSections = [
        { id: 'recently-launched', label: 'Recently Launched' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'coming-soon', label: 'Wish list' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-4">Our Roadmap</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Hobson AI is always evolving. Our roadmap highlights what we've recently delivered, 
                    what we're working on now, and where we're heading next. It's designed to give you 
                    transparency and confidence that Hobson is built for the long term.
                  </p>
                </div>

                <div className="space-y-12">
                  {/* Recently Launched */}
                  <section id="recently-launched">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">✅</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Recently Launched</h2>
                    </div>
                    <div className="ml-11 space-y-4">
                      <div className="bg-card border rounded-lg p-6">
                        <h3 className="font-semibold text-foreground mb-2">AI-powered document summarisation</h3>
                        <p className="text-muted-foreground text-sm">Transform lengthy documents into clear, actionable summaries.</p>
                      </div>
                      <div className="bg-card border rounded-lg p-6">
                        <h3 className="font-semibold text-foreground mb-2">Chat interface for natural-language queries</h3>
                        <p className="text-muted-foreground text-sm">Ask questions in plain language and get instant answers from your documents.</p>
                      </div>
                      <div className="bg-card border rounded-lg p-6">
                        <h3 className="font-semibold text-foreground mb-2">Clause and obligation tracking</h3>
                        <p className="text-muted-foreground text-sm">Automatically track key dates, deadlines, and obligations across your documents.</p>
                      </div>
                    </div>
                  </section>

                  {/* In Progress */}
                  <section id="in-progress">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">🚧</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">In Progress</h2>
                    </div>
                    <div className="ml-11 space-y-4">
                      <div className="bg-card border rounded-lg p-6 border-l-4 border-l-primary">
                        <h3 className="font-semibold text-foreground mb-2">Smarter follow-up questioning in chat</h3>
                        <p className="text-muted-foreground text-sm">Enhanced conversational AI that understands context and asks better follow-up questions.</p>
                      </div>
                      <div className="bg-card border rounded-lg p-6 border-l-4 border-l-primary">
                        <h3 className="font-semibold text-foreground mb-2">Cross-document insights and comparisons</h3>
                        <p className="text-muted-foreground text-sm">Compare terms and find connections across multiple documents simultaneously.</p>
                      </div>
                      <div className="bg-card border rounded-lg p-6 border-l-4 border-l-primary">
                        <h3 className="font-semibold text-foreground mb-2">Improved accuracy for complex property documents</h3>
                        <p className="text-muted-foreground text-sm">Enhanced AI models specifically trained on property and legal document structures.</p>
                      </div>
                    </div>
                  </section>

                  {/* Wish list */}
                  <section id="coming-soon">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">🌟</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Wish list</h2>
                    </div>
                    <div className="ml-11 space-y-4">
                      <div className="bg-muted/30 border rounded-lg p-6 border-dashed">
                        <h3 className="font-semibold text-foreground mb-2">Integrations with document management systems (DMS) and CRMs</h3>
                        <p className="text-muted-foreground text-sm">Seamless connection to your existing tools and workflows.</p>
                      </div>
                      <div className="bg-muted/30 border rounded-lg p-6 border-dashed">
                        <h3 className="font-semibold text-foreground mb-2">Predictive insights (e.g. flagging risks before they're missed)</h3>
                        <p className="text-muted-foreground text-sm">Proactive alerts about potential issues and opportunities in your documents.</p>
                      </div>
                      <div className="bg-muted/30 border rounded-lg p-6 border-dashed">
                        <h3 className="font-semibold text-foreground mb-2">Expanded compliance automation</h3>
                        <p className="text-muted-foreground text-sm">Automated compliance checks and reporting across regulatory requirements.</p>
                      </div>
                      <div className="bg-muted/30 border rounded-lg p-6 border-dashed">
                        <h3 className="font-semibold text-foreground mb-2">Mobile app and messaging platform integrations</h3>
                        <p className="text-muted-foreground text-sm">Whilst not available today, we will be implementing mobile versions and the ability to access Hobson through WhatsApp and Microsoft Teams.</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Closing Note */}
                <div className="mt-16 bg-primary/5 rounded-lg p-6 border border-primary/20">
                  <p className="text-muted-foreground text-center leading-relaxed">
                    We build Hobson AI in close partnership with our users. Your feedback helps shape the roadmap — 
                    ensuring the platform grows in ways that bring you the most value.
                  </p>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Integrations content
    if (activeHorizontalTab === 'integrations' && (!activeVerticalTab || activeVerticalTab === 'available-integrations')) {
      const tocSections = [
        { id: 'planned-integrations', label: 'Planned Integrations' },
        { id: 'why-integrations-matter', label: 'Why Integrations Matter' },
        { id: 'what-were-working-towards', label: 'What We\'re Working Towards' },
        { id: 'benefit-for-you', label: 'The Benefit for You' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-6">Integrations with Hobson AI</h1>
                  
                  {/* Disclaimer Banner */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-orange-700 dark:text-orange-300 font-medium">
                        Integrations are not yet available in Hobson AI — all integrations listed here are on our wish list to be done.
                      </p>
                    </div>
                  </div>

                  {/* Integrations Framework */}
                  <div id="planned-integrations" className="mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Planned Integrations</h2>
                    <IntegrationCards />
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                    Hobson AI works best when it fits seamlessly into the tools you already use. 
                    Our upcoming integrations are designed to make insights instantly available within 
                    your existing workflows — reducing friction, saving time, and keeping your team focused.
                  </p>
                </div>

                <div className="space-y-12">
                  {/* Why Integrations Matter */}
                  <section id="why-integrations-matter">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🔗</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Why Integrations Matter</h2>
                    </div>
                    <div className="ml-16">
                      <p className="text-muted-foreground leading-relaxed">
                        Many organisations already rely on document management systems (DMS), CRMs, calendars, and email platforms. 
                        Integrations will let Hobson plug directly into these tools so insights flow automatically, 
                        without switching between systems.
                      </p>
                    </div>
                  </section>

                  {/* What We're Working Towards */}
                  <section id="what-were-working-towards">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🚀</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">What We're Working Towards</h2>
                    </div>
                    <div className="ml-16 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Direct connection to DMS and storage platforms (Dropbox, Google Drive, OneDrive)</h3>
                          <p className="text-sm text-muted-foreground">Seamlessly access and analyze documents stored in your cloud storage platforms.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Email and calendar integrations for faster knowledge retrieval</h3>
                          <p className="text-sm text-muted-foreground">Surface relevant insights from your email threads and calendar events.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">CRM integrations for client and contract insights</h3>
                          <p className="text-sm text-muted-foreground">Access document insights directly within your CRM workflows.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">API access for custom workflows</h3>
                          <p className="text-sm text-muted-foreground">Build custom integrations tailored to your specific business processes.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Single sign-on (SSO) for secure, easy access</h3>
                          <p className="text-sm text-muted-foreground">Maintain security standards while simplifying user access across systems.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* The Benefit for You */}
                  <section id="benefit-for-you">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🌟</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">The Benefit for You</h2>
                    </div>
                    <div className="ml-16 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Less manual exporting and importing</h3>
                          <p className="text-sm text-muted-foreground">Eliminate time-consuming file transfers between systems.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Centralised insights across platforms</h3>
                          <p className="text-sm text-muted-foreground">Access Hobson's intelligence wherever you work, without switching applications.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Faster, more consistent decision-making</h3>
                          <p className="text-sm text-muted-foreground">Make informed decisions with real-time insights in your existing workflow.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Reduced risk of missed details</h3>
                          <p className="text-sm text-muted-foreground">Important information surfaces automatically in context, when you need it.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Closing Note */}
                <div className="mt-16 bg-primary/5 rounded-lg p-6 border border-primary/20">
                  <p className="text-muted-foreground text-center leading-relaxed">
                    Integrations are a key part of our roadmap. By bringing Hobson AI directly into your existing systems, 
                    we aim to create a seamless experience where insights are always available when and where you need them.
                  </p>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle API Reference content
    if (activeHorizontalTab === 'integrations' && activeVerticalTab === 'api-reference') {
      const tocSections = [
        { id: 'overview', label: 'Overview' },
        { id: 'authentication', label: 'Authentication' },
        { id: 'endpoints', label: 'Endpoints' },
        { id: 'document-analysis', label: 'Document Analysis' },
        { id: 'query-interface', label: 'Query Interface' },
        { id: 'webhooks', label: 'Webhooks' },
        { id: 'rate-limits', label: 'Rate Limits' },
        { id: 'error-handling', label: 'Error Handling' },
        { id: 'examples', label: 'Examples' }
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      return (
        <div className="flex-1">
          <div className="flex gap-8">
            <div className="flex-1 p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-foreground mb-6">API Reference</h1>
                
                {/* Notice Banner */}
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <p className="text-orange-700 dark:text-orange-300 font-medium">
                      This resource is not yet available.
                    </p>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  The API Reference will offer a complete guide to Hobson's API, including examples and 
                  explanations to support developers and integrations.
                </p>
              </div>
            </div>

            {/* Table of Contents - Right Sidebar */}
            <div className="hidden lg:block w-64 sticky top-8 h-fit">
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                <nav className="space-y-2">
                  {tocSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                        activeTocSection === section.id
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Integrations content
    if (activeHorizontalTab === 'integrations' && (!activeVerticalTab || activeVerticalTab === 'available-integrations')) {
      return (
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-6">Integrations with Hobson AI</h1>
              
              {/* Disclaimer Banner */}
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <p className="text-orange-700 dark:text-orange-300 font-medium">
                    Integrations are not yet available in Hobson AI — all integrations listed here are on our wish list to be done.
                  </p>
                </div>
              </div>

              {/* Integrations Framework */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Planned Integrations</h2>
                <IntegrationCards />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Hobson AI works best when it fits seamlessly into the tools you already use. 
                Our upcoming integrations are designed to make insights instantly available within 
                your existing workflows — reducing friction, saving time, and keeping your team focused.
              </p>
            </div>

            <div className="space-y-12">
              {/* Why Integrations Matter */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔗</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Why Integrations Matter</h2>
                </div>
                <div className="ml-16">
                  <p className="text-muted-foreground leading-relaxed">
                    Many organisations already rely on document management systems (DMS), CRMs, calendars, and email platforms. 
                    Integrations will let Hobson plug directly into these tools so insights flow automatically, 
                    without switching between systems.
                  </p>
                </div>
              </section>

              {/* What We're Working Towards */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🚀</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">What We're Working Towards</h2>
                </div>
                <div className="ml-16 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Direct connection to DMS and storage platforms (Dropbox, Google Drive, OneDrive)</h3>
                      <p className="text-sm text-muted-foreground">Seamlessly access and analyze documents stored in your cloud storage platforms.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email and calendar integrations for faster knowledge retrieval</h3>
                      <p className="text-sm text-muted-foreground">Surface relevant insights from your email threads and calendar events.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">CRM integrations for client and contract insights</h3>
                      <p className="text-sm text-muted-foreground">Access document insights directly within your CRM workflows.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">API access for custom workflows</h3>
                      <p className="text-sm text-muted-foreground">Build custom integrations tailored to your specific business processes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Single sign-on (SSO) for secure, easy access</h3>
                      <p className="text-sm text-muted-foreground">Maintain security standards while simplifying user access across systems.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* The Benefit for You */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🌟</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">The Benefit for You</h2>
                </div>
                <div className="ml-16 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Less manual exporting and importing</h3>
                      <p className="text-sm text-muted-foreground">Eliminate time-consuming file transfers between systems.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Centralised insights across platforms</h3>
                      <p className="text-sm text-muted-foreground">Access Hobson's intelligence wherever you work, without switching applications.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Faster, more consistent decision-making</h3>
                      <p className="text-sm text-muted-foreground">Make informed decisions with real-time insights in your existing workflow.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Reduced risk of missed details</h3>
                      <p className="text-sm text-muted-foreground">Important information surfaces automatically in context, when you need it.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Closing Note */}
            <div className="mt-16 bg-primary/5 rounded-lg p-6 border border-primary/20">
              <p className="text-muted-foreground text-center leading-relaxed">
                Integrations are a key part of our roadmap. By bringing Hobson AI directly into your existing systems, 
                we aim to create a seamless experience where insights are always available when and where you need them.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Handle Setup Guide content
    if (activeHorizontalTab === 'integrations' && activeVerticalTab === 'setup-guide') {
      const tocSections = [
        { id: 'coming-soon-notice', label: 'Notice' },
        { id: 'what-to-expect', label: 'What to Expect' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-6">Setup Guide</h1>
                  
                  {/* Notice Banner */}
                  <div id="coming-soon-notice" className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-orange-700 dark:text-orange-300 font-medium">
                        This resource is not yet available.
                      </p>
                    </div>
                  </div>

                  <section id="what-to-expect">
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                      The Setup Guide will provide step-by-step instructions to help you get started quickly 
                      and configure Hobson AI for your organisation.
                    </p>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle API Reference content
    if (activeHorizontalTab === 'integrations' && activeVerticalTab === 'api-reference') {
      const tocSections = [
        { id: 'overview', label: 'Overview' },
        { id: 'authentication', label: 'Authentication' },
        { id: 'endpoints', label: 'Endpoints' },
        { id: 'document-analysis', label: 'Document Analysis' },
        { id: 'query-interface', label: 'Query Interface' },
        { id: 'webhooks', label: 'Webhooks' },
        { id: 'rate-limits', label: 'Rate Limits' },
        { id: 'error-handling', label: 'Error Handling' },
        { id: 'examples', label: 'Examples' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-4">API Reference</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Complete guide to Hobson AI's REST API. Build powerful integrations and automate 
                    document analysis workflows with our comprehensive API endpoints.
                  </p>
                </div>

                <div className="space-y-12">
                  {/* Overview */}
                  <section id="overview">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        The Hobson AI API provides programmatic access to our document intelligence platform. 
                        Use our RESTful API to upload documents, extract insights, and integrate AI-powered 
                        analysis into your applications.
                      </p>
                      <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Base URL:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">https://api.hobsonschoice.ai/v1</code>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Content Type:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">application/json</code>
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Authentication */}
                  <section id="authentication">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Authentication</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        All API requests must be authenticated using an API key. Include your API key 
                        in the Authorization header of each request.
                      </p>
                      <div className="bg-card border rounded-lg p-3 md:p-4">
                        <h4 className="font-medium text-foreground mb-2 text-sm md:text-base">Request Header</h4>
                        <pre className="bg-muted p-2 md:p-3 rounded text-xs md:text-sm overflow-x-auto">
                          <code>Authorization: Bearer YOUR_API_KEY</code>
                        </pre>
                      </div>
                    </div>
                  </section>

                  {/* Endpoints */}
                  <section id="endpoints">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Core Endpoints</h2>
                    <div className="space-y-6">
                      <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-mono">GET</span>
                          <code className="text-sm font-mono">/documents</code>
                        </div>
                        <p className="text-muted-foreground text-sm">Retrieve a list of uploaded documents</p>
                      </div>
                      
                      <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-mono">POST</span>
                          <code className="text-sm font-mono">/documents/upload</code>
                        </div>
                        <p className="text-muted-foreground text-sm">Upload a new document for analysis</p>
                      </div>
                      
                      <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-mono">GET</span>
                          <code className="text-sm font-mono">/documents/{"{id}"}</code>
                        </div>
                        <p className="text-muted-foreground text-sm">Get details and analysis for a specific document</p>
                      </div>
                      
                      <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-mono">POST</span>
                          <code className="text-sm font-mono">/query</code>
                        </div>
                        <p className="text-muted-foreground text-sm">Ask natural language questions about your documents</p>
                      </div>
                    </div>
                  </section>

                  {/* Document Analysis */}
                  <section id="document-analysis">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Document Analysis</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        Upload documents to extract structured data, generate summaries, and identify key clauses.
                      </p>
                      <div className="bg-card border rounded-lg p-3 md:p-4">
                        <h4 className="font-medium text-foreground mb-2 text-sm md:text-base">Upload Document</h4>
                        <pre className="bg-muted p-2 md:p-3 rounded text-xs md:text-sm overflow-x-auto">
                          <code>{`POST /documents/upload
Content-Type: multipart/form-data

{
  "file": "[binary file data]",
  "type": "lease|contract|report",
  "options": {
    "extract_clauses": true,
    "generate_summary": true
  }
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </section>

                  {/* Query Interface */}
                  <section id="query-interface">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Query Interface</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        Use natural language queries to extract specific information from your documents.
                      </p>
                      <div className="bg-card border rounded-lg p-3 md:p-4">
                        <h4 className="font-medium text-foreground mb-2 text-sm md:text-base">Natural Language Query</h4>
                        <pre className="bg-muted p-2 md:p-3 rounded text-xs md:text-sm overflow-x-auto">
                          <code>{`POST /query

{
  "query": "What is the rent review date?",
  "document_id": "doc_123456789",
  "context": {
    "include_source": true,
    "confidence_threshold": 0.8
  }
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </section>

                  {/* Webhooks */}
                  <section id="webhooks">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Webhooks</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        Receive real-time notifications when document processing is complete or when 
                        specific events occur in your account.
                      </p>
                      <div className="space-y-4">
                        <div className="bg-card border rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Supported Events</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• <code className="bg-muted px-2 py-1 rounded text-xs">document.processed</code> - Document analysis complete</li>
                            <li>• <code className="bg-muted px-2 py-1 rounded text-xs">document.failed</code> - Document processing failed</li>
                            <li>• <code className="bg-muted px-2 py-1 rounded text-xs">query.completed</code> - Query response ready</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Rate Limits */}
                  <section id="rate-limits">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Rate Limits</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        API requests are subject to rate limits to ensure fair usage and system stability.
                      </p>
                      <div className="bg-card border rounded-lg p-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Standard Plan</h4>
                            <ul className="text-muted-foreground space-y-1">
                              <li>• 1,000 requests/hour</li>
                              <li>• 100 MB/document</li>
                              <li>• 50 documents/day</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Enterprise Plan</h4>
                            <ul className="text-muted-foreground space-y-1">
                              <li>• 10,000 requests/hour</li>
                              <li>• 500 MB/document</li>
                              <li>• Unlimited documents</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Error Handling */}
                  <section id="error-handling">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Error Handling</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        The API uses conventional HTTP response codes to indicate success or failure.
                      </p>
                      <div className="space-y-4">
                        <div className="bg-card border rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Common Error Codes</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs font-mono">400</span>
                              <span className="text-muted-foreground">Bad Request - Invalid request format</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs font-mono">401</span>
                              <span className="text-muted-foreground">Unauthorized - Invalid API key</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs font-mono">429</span>
                              <span className="text-muted-foreground">Too Many Requests - Rate limit exceeded</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs font-mono">500</span>
                              <span className="text-muted-foreground">Internal Server Error - System error</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Examples */}
                  <section id="examples">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Code Examples</h2>
                    <div className="space-y-6">
                      <div className="bg-card border rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-3">Upload and Analyze Document</h4>
                        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                          <code>{`curl -X POST \\
  https://api.hobsonschoice.ai/v1/documents/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@lease_agreement.pdf" \\
  -F "type=lease" \\
  -F "options[extract_clauses]=true"`}</code>
                        </pre>
                      </div>
                      
                      <div className="bg-card border rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-3">Query Document</h4>
                        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                          <code>{`curl -X POST \\
  https://api.hobsonschoice.ai/v1/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "When does the lease expire?",
    "document_id": "doc_123456789"
  }'`}</code>
                        </pre>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Troubleshooting content
    if (activeHorizontalTab === 'integrations' && activeVerticalTab === 'troubleshooting') {
      const tocSections = [
        { id: 'coming-soon-notice', label: 'Coming Soon Notice' },
        { id: 'what-to-expect', label: 'What to Expect' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-6">Troubleshooting</h1>
                  
                  {/* Notice Banner */}
                  <div id="coming-soon-notice" className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-orange-700 dark:text-orange-300 font-medium">
                        This resource is not yet available.
                      </p>
                    </div>
                  </div>

                  <section id="what-to-expect">
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                      The Troubleshooting guide will provide clear steps for diagnosing and resolving common issues, 
                      along with tips to keep Hobson running smoothly.
                    </p>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Plans and Credits content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits') {
      const tocSections = [
        { id: 'overview', label: 'Overview' },
        { id: 'starter-pack', label: 'Starter pack' },
        { id: 'feature-comparison', label: 'Feature comparison' },
        { id: 'available-plans', label: 'Available Paid Plans' },
        { id: 'credit-display', label: 'Credit display' },
        { id: 'credit-usage', label: 'Credit usage' },
        { id: 'credit-rollovers', label: 'Credit Rollovers' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };


      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Plans and Credits</h1>
                  <p className="text-lg text-muted-foreground">Understanding plans, credit usage and credit rollovers in Lovable</p>
                </div>

                <div className="space-y-12">
                  {/* Overview */}
                  <section id="overview">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Overview</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        Hobson is a subscription based service with a free plan and several paid plans. When you pay for a subscription you get access to more additional support, and more HEUs (Hobsons Energy units - the currency used to buy effort). You need HEUs to interact with Hobson.
                      </p>
                    </div>
                  </section>

                  {/* Starter pack */}
                  <section id="starter-pack">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Starter pack</h2>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">What's the Starter Pack for?</h4>
                        <p className="text-muted-foreground">
                          It's a one-time bundle to help you load your documents into the platform fast. It covers the heavy lifting: upload, extract key data, and index for search.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Why do I need this before a plan?</h4>
                        <p className="text-muted-foreground">
                          Most of the cost happens up front when we process your files. The Starter Pack gives you extra credit to finish onboarding without worrying about limits.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-foreground mb-2">What do I get?</h4>
                        <p className="text-muted-foreground">
                          1000 HEUs (Hobson Energy Units) to spend HEUs on document extraction, storage, and initial Q&A. Any unspent will roll over for two months.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Feature Comparison */}
                  <section id="feature-comparison">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Feature comparison: Free plan vs. Paid plans</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Free Plan</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• 18 HEU (Hobson Energy Unit) per month</li>
                          <li>• Unlimited Members</li>
                          <li>• Unlimited documents</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Essential plan</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• Everything in Free</li>
                          <li>• 275 HEU (Hobson Energy Unit) per month</li>
                          <li>• Priority Support</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Essential Plus</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• Everything in Essential</li>
                          <li>• 700 HEU (Hobson Energy Unit) per month</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Enterprise</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• Everything in Essential Plus</li>
                          <li>• 2000 HEU (Hobson Energy Unit) per month</li>
                          <li>• Support person</li>
                          <li>• Business Knowledgebase</li>
                          <li>• Bespoke integrations (call us)</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Top-up</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• £15 one-off purchase (no subscription)</li>
                          <li>• 150 HEUs (Hobson Energy Units) added to your balance</li>
                          <li>• Covers extraction, indexing (preps docs for search), and Q&A</li>
                          <li>• No rollover — unused HEUs expire at the end of your current billing period</li>
                          <li>• Activates instantly and works with any paid plan</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Credit Display */}
                  <section id="credit-display">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Credit display</h2>
                    <p className="text-muted-foreground mb-4">
                      The HEU bar provides a visual representation of how many HEUs a user has remaining and how many have been used.
                    </p>
                    <ul className="text-muted-foreground space-y-2 mb-6">
                      <li>• <strong>Grey part:</strong> Shows the amount of HEUs already used this billing period.</li>
                      <li>• <strong>Blue parts:</strong> Shows the remaining HEUs.</li>
                    </ul>
                    
                    {/* HEU Bar Visualization */}
                    <HEUBarVisualization />
                  </section>

                  {/* Credit Usage */}
                  <section id="credit-usage">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Credit usage</h2>
                    <p className="text-muted-foreground mb-4">
                      Hobson has a usage-based credit system called HEU (Hobson Energy Unit), where sending messages deducts HEUs. The cost of a message depends on its complexity to ensure you only pay for what you actually use.
                    </p>
                    <p className="text-muted-foreground mb-6">
                      Many messages cost less than 1 HEU, while more complex ones may cost more. This approach allows for more precise edits and greater efficiency per message, making Hobson more affordable overall.
                    </p>
                    
                    <h3 className="text-base md:text-lg font-medium text-foreground mb-4">Example tasks and their HEU cost:</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs md:text-sm min-w-[500px]">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-foreground">Example Task</th>
                            <th className="text-left py-2 text-foreground">Work Done</th>
                            <th className="text-left py-2 text-foreground">HEUs</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr><td className="py-2">Reading a simple document (e.g. certificate)</td><td>Scans and summarises</td><td>0.5</td></tr>
                          <tr><td className="py-2">Reading a medium document (e.g. deed)</td><td>Reviews, extracts key info</td><td>1.4</td></tr>
                          <tr><td className="py-2">Reading a complex document (e.g. lease)</td><td>Full detailed review and breakdown</td><td>16.9</td></tr>
                          <tr><td className="py-2">Asking a simple query (e.g. "What is the rent?")</td><td>Finds and returns one fact</td><td>0.05</td></tr>
                          <tr><td className="py-2">Asking a medium query (e.g. "List all rents")</td><td>Searches and compiles several data points</td><td>0.26</td></tr>
                          <tr><td className="py-2">Asking a complex query (e.g. "Build a tenancy report")</td><td>Gathers multiple details, formats a full report</td><td>0.54</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-muted-foreground mt-6">
                      You can see the cost of each message in the chat by pressing the three dots beneath a message.
                    </p>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-foreground mb-4">Example: How HEU costs appear in chat</h3>
                      <ChatCostExample />
                    </div>
                  </section>

                  {/* Credit Rollovers */}
                  <section id="credit-rollovers">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Credit Rollovers</h2>
                    <p className="text-muted-foreground mb-4">
                      Unused HEUs automatically roll over at the end of each billing cycle for both monthly and annual paid plans, as long as you keep an active subscription, subject to the limitations outlined below.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-2">Rollover credit limits:</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• <strong>Monthly plans:</strong> Rollover HEUs can accumulate up to the monthly credit limit.</li>
                          <li>• <strong>Annual plans:</strong> Rollover HEUs can accumulate up to 12 times the monthly credit limit (i.e. the annual limit).</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-2">Rollover credits expiration:</h3>
                        <p className="text-muted-foreground">
                          Rollover credits are valid up to one month after being added for monthly plans, and 12 months after being added for annual plans.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-2">Cancellation:</h3>
                        <p className="text-muted-foreground">
                          Upon cancellation of a paid subscription, all unused and rollover HEUs will expire at the end of the current billing period and will not carry over.
                        </p>
                      </div>

                      <p className="text-muted-foreground">
                        Daily HEUs do not roll over. Unused daily HEUs will not accumulate from day to day for the free tier or for the paid tiers.
                      </p>

                      <p className="text-muted-foreground">
                        For detailed information about subscription options, visit our pricing page.
                      </p>
                    </div>
                  </section>

                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle FAQ content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'faq') {
      const tocSections = [
        { id: 'how-hobson-works', label: 'How Hobson works' },
        { id: 'positioning-statement', label: 'Positioning Statement' },
        { id: 'building-with-hobson', label: 'Using Hobson day-to-day' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };


      return (
        <div className="flex-1 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                {/* Hero Header */}
                <div className="mb-12 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Frequently Asked Questions
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
                    Everything you need to know
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Find answers to common questions about Hobson AI and how it can transform your property management workflow
                  </p>
                </div>

                <div className="space-y-16">
                  {/* How Hobson works */}
                  <section id="how-hobson-works" className="scroll-mt-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-foreground">How Hobson works</h2>
                    </div>
                    <Accordion type="multiple" className="w-full space-y-4">
                      <AccordionItem value="organize-units-documents" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How are units, groups, portfolios, and documents arranged in Hobson?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="space-y-8">
                            {/* How Spaces and Groups Are Defined */}
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-6">How Spaces and Groups Are Defined</h4>
                              <div className="grid gap-4">
                                <div className="bg-muted/30 border border-border rounded-lg p-5">
                                  <h5 className="text-base font-semibold text-foreground mb-2">Unit</h5>
                                  <p className="text-sm text-muted-foreground">
                                    A single physical space, such as a flat, office, or piece of land.
                                  </p>
                                </div>
                                
                                <div className="bg-muted/30 border border-border rounded-lg p-5">
                                  <h5 className="text-base font-semibold text-foreground mb-2">Unit Group</h5>
                                  <p className="text-sm text-muted-foreground">
                                    A set of units linked <span className="text-primary">either</span> by a shared location 
                                    (for example, flats in one block or offices on a single floor) <span className="text-primary">or</span> by 
                                    a shared document (for example, one lease covering multiple units in one or more locations).
                                  </p>
                                </div>
                                
                                <div className="bg-muted/30 border border-border rounded-lg p-5">
                                  <h5 className="text-base font-semibold text-foreground mb-2">Portfolio</h5>
                                  <p className="text-sm text-muted-foreground">
                                    A collection of units grouped by ownership, management, or another organisational structure.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* How Document Types Work */}
                            <div>
                              <h4 className="text-lg font-semibold text-foreground mb-6">How Document Types Work</h4>
                              <div className="grid gap-4">
                                <div className="bg-muted/30 border border-border rounded-lg p-5">
                                  <h5 className="text-base font-semibold text-foreground mb-2">Right-to-Occupy (RTO) Documents</h5>
                                  <p className="text-sm text-muted-foreground">
                                    Documents that give an entity the right to use or occupy a space, such as a lease or a Land Registry Title.
                                  </p>
                                </div>
                                
                                <div className="bg-muted/30 border border-border rounded-lg p-5">
                                  <h5 className="text-base font-semibold text-foreground mb-2">Amending Documents (AMDs)</h5>
                                  <p className="text-sm text-muted-foreground">
                                    Documents that <span className="text-primary">modify</span>, <span className="text-primary">extend</span>, or{" "}
                                    <span className="text-primary">support</span> an RTO. This includes formal amendments (such as deeds of 
                                    variation or rent memorandums) and supporting documents (such as notices, identity documents, or funding documents).
                                  </p>
                                </div>
                                
                                <div className="bg-muted/30 border border-border rounded-lg p-5">
                                  <h5 className="text-base font-semibold text-foreground mb-2">Accompanying Documents (ACDs)</h5>
                                  <p className="text-sm text-muted-foreground">
                                    Documents linked to a specific unit or unit group, such as compliance certificates.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="file-types" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          Which file types are supported?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">
                            Hobson currently supports PDFs. Common text files, as well as CSV/Excel for tabular data, will be added in due course.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="get-documents" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How to get documents to Hobson
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="text-muted-foreground text-sm space-y-4">
                            <div>
                              <h5 className="font-semibold text-foreground mb-2">For Today</h5>
                              <p>Hobson allows for batch uploads via our drag-and-drop upload feature.</p>
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground mb-2">In the Future</h5>
                              <p>Once we are happy that Hobson can access drives such as Dropbox and Google Drive, we will provide that feature.</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="mobile-support" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          Does Hobson work on mobile?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">
                            No. We are planning to introduce a mobile version and the ability to integrate it with other common apps, such as WhatsApp.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="data-ownership" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          Who owns the data and outputs?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">You do. Your documents, extracted data, and answers belong to your company.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Getting the best out of Hobson */}
                  <section id="features" className="scroll-mt-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-foreground">Getting the best out of Hobson</h2>
                    </div>
                    <Accordion type="multiple" className="w-full space-y-4">
                      <AccordionItem value="upload-documents" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How long does Hobson take to read a document?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="text-muted-foreground text-sm space-y-4">
                            <p>
                              When you upload documents, Hobson reads and processes them so they're ready for future queries. This can take some time, depending on how complex the documents are. Once everything has been processed, you'll receive an email confirming that all documents have been read.
                            </p>

                            <div className="space-y-3 pt-2">
                              <p className="font-medium text-foreground text-base">Typical processing times:</p>
                              
                              <ul className="space-y-2 pl-4">
                                <li className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span><strong className="text-foreground">Complex documents</strong> (for example, leases): around 8–9 minutes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span><strong className="text-foreground">Medium-complexity documents</strong> (for example, deeds): around 2–3 minutes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span><strong className="text-foreground">Low-complexity documents</strong> (for example, notices): around 30 seconds to 1 minute</span>
                                </li>
                              </ul>
                            </div>

                            <div className="bg-primary/5 p-3 rounded-md">
                              <p className="text-foreground font-medium">
                                Once processing is complete, your documents become fully searchable and ready to use.
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="add-unit-manually" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          Can I add a unit manually without uploading a document?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="text-muted-foreground text-sm space-y-3">
                            <p>
                              <strong className="text-foreground">Yes.</strong> Just ask Hobson <span className="inline-block bg-muted px-2 py-1 rounded font-mono text-xs">"Add Unit"</span>.
                            </p>
                            <p>
                              Hobson will then prompt you to enter the full address, and the unit will be created without needing any documents.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="ask-question" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          Which level should I use when asking a question?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="text-muted-foreground text-sm space-y-4">
                            <p>
                              You can ask Hobson questions at three levels — <strong className="text-foreground">Portfolio</strong>, <strong className="text-foreground">Unit Group</strong>, and <strong className="text-foreground">Unit</strong>. The higher the level, the broader the search. The lower the level, the more focused the answer.
                            </p>
                            
                            <div className="space-y-3">
                              <p className="font-medium text-foreground">To get the best results:</p>
                              <ul className="space-y-2 pl-4">
                                <li className="flex gap-2">
                                  <span className="text-primary">•</span>
                                  <span><strong className="text-foreground">Use Portfolio</strong> for broad questions that cover everything you manage.</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-primary">•</span>
                                  <span><strong className="text-foreground">Use Unit Group</strong> when your question relates to a set of linked units.</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-primary">•</span>
                                  <span><strong className="text-foreground">Use Unit</strong> when you need details about a specific space.</span>
                                </li>
                              </ul>
                            </div>

                            <div className="space-y-3 pt-2">
                              <p className="font-medium text-foreground">Asking your question at the right level matters for three reasons:</p>
                              
                              <div className="space-y-3">
                                <div className="pl-4 border-l-2 border-primary/20">
                                  <p className="font-medium text-foreground mb-1">1. You use fewer credits</p>
                                  <p>A broad search means Hobson needs to look through a larger set of documents. Dropping down a level keeps the search small and saves credits.</p>
                                </div>
                                
                                <div className="pl-4 border-l-2 border-primary/20">
                                  <p className="font-medium text-foreground mb-1">2. You reduce the chance of errors</p>
                                  <p>Big searches require more processing. Focused questions give Hobson less to sift through, which means cleaner, more accurate answers.</p>
                                </div>
                                
                                <div className="pl-4 border-l-2 border-primary/20">
                                  <p className="font-medium text-foreground mb-1">3. You see the right context automatically</p>
                                  <p>When you move down a level, Hobson shows you the address, tenant names, and other details for that space. This helps you frame your question without needing to remember everything yourself.</p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-muted/50 p-3 rounded-md mt-4">
                              <p className="font-medium text-foreground">In short:</p>
                              <p className="mt-1">Ask high-level questions at the Portfolio level, and move down a level when you need specific answers.</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="poor-answer" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          What should I do if I get a poor answer?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="text-muted-foreground text-sm space-y-4">
                            <p>
                              If Hobson gives you an answer like <span className="italic">"No information is available"</span> but you know the information exists, try these steps:
                            </p>

                            <div className="space-y-4">
                              <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                    1
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-1">Go back to the level you were on</h4>
                                    <p>Return to the Portfolio, Unit Group, or Unit level you were using and ask the question again. A fresh query at the correct level often fixes the issue.</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                    2
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-1">Check that the documents are actually uploaded</h4>
                                    <p>Open the Documents area in Admin and make sure the files you expect are there. If a document is missing or unreadable, Hobson won't be able to use it.</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-md mt-4">
                              <p className="text-foreground font-medium">
                                Most issues come from asking at too high a level or missing documents, and both are easy to correct.
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="structure-prompts" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How should I structure my prompts for the best results?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="text-muted-foreground text-sm space-y-4">
                            <p className="text-foreground">To get the best answers from Hobson, try the following:</p>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="font-medium text-foreground mb-1">Choose the right level first</p>
                                <p>Start at the Portfolio, Unit Group, or Unit level depending on how specific your question is. The more specific the question, the lower the level you should use.</p>
                              </div>
                              
                              <div>
                                <p className="font-medium text-foreground mb-1">Be direct and clear</p>
                                <p>Ask for exactly what you need. Short, simple questions work better than long or vague ones.</p>
                              </div>
                              
                              <div>
                                <p className="font-medium text-foreground mb-1">Use names or addresses when needed</p>
                                <p>If you're at the wrong level, Hobson may not know which space you mean. Adding the unit address or tenant name helps guide the search.</p>
                              </div>
                              
                              <div>
                                <p className="font-medium text-foreground mb-1">Ask one thing at a time</p>
                                <p>If you have several questions, ask them separately. This reduces errors and gives cleaner answers.</p>
                              </div>
                            </div>
                            
                            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-md mt-4">
                              <p className="text-foreground font-medium">
                                In short: Pick the right level, keep it simple, and be specific when needed.
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="connect-systems" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          Can Hobson connect to our systems?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">Currently, we don't offer bespoke integrations, but please talk to us so we can understand what you want to achieve and whether this will be possible at some point.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="control-access" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          Can I control who has access?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">Yes. Admin users can invite new users and choose exactly which units and which document classes they can access. This lets you control who sees what within Hobson.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Plans & Credits */}
                  <section id="plans-credits-faq" className="scroll-mt-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-foreground">Plans & Credits</h2>
                    </div>
                    <Accordion type="multiple" className="w-full space-y-4">
                      <AccordionItem value="what-is-credit" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          What is a HEU?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">A HEU is the unit of energy measurement for using Hobson's AI features. Each message or action costs a certain number of HEUs based on its complexity</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="heu-task-costs" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How much do different tasks cost in HEUs?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="space-y-4">
                            <p className="text-muted-foreground text-sm">
                              Hobson uses a usage-based credit system called HEU (Hobson Energy Unit). Each message you send deducts a small number of HEUs. The cost depends on how complex the task is, so you only pay for the work Hobson actually performs.
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Most messages cost less than 1 HEU, while more detailed tasks cost more. This keeps pricing fair and efficient.
                            </p>
                            
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-foreground mb-3">Typical HEU costs:</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                  <thead>
                                    <tr className="border-b border-border">
                                      <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/50">Task</th>
                                      <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/50">What Hobson Does</th>
                                      <th className="text-right py-3 px-4 font-semibold text-foreground bg-muted/50">HEUs</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border">
                                    <tr className="hover:bg-muted/30 transition-colors">
                                      <td className="py-3 px-4 text-muted-foreground">Reading a simple document (e.g. certificate)</td>
                                      <td className="py-3 px-4 text-muted-foreground">Scans and summarises</td>
                                      <td className="py-3 px-4 text-right font-medium text-foreground">0.5</td>
                                    </tr>
                                    <tr className="hover:bg-muted/30 transition-colors">
                                      <td className="py-3 px-4 text-muted-foreground">Reading a medium document (e.g. deed)</td>
                                      <td className="py-3 px-4 text-muted-foreground">Reviews and extracts key details</td>
                                      <td className="py-3 px-4 text-right font-medium text-foreground">1.4</td>
                                    </tr>
                                    <tr className="hover:bg-muted/30 transition-colors">
                                      <td className="py-3 px-4 text-muted-foreground">Reading a complex document (e.g. lease)</td>
                                      <td className="py-3 px-4 text-muted-foreground">Full review and structured breakdown</td>
                                      <td className="py-3 px-4 text-right font-medium text-foreground">16.9</td>
                                    </tr>
                                    <tr className="hover:bg-muted/30 transition-colors">
                                      <td className="py-3 px-4 text-muted-foreground">Asking a simple question ("What is the rent?")</td>
                                      <td className="py-3 px-4 text-muted-foreground">Finds one fact</td>
                                      <td className="py-3 px-4 text-right font-medium text-foreground">0.05</td>
                                    </tr>
                                    <tr className="hover:bg-muted/30 transition-colors">
                                      <td className="py-3 px-4 text-muted-foreground">Asking a medium question ("List all rents")</td>
                                      <td className="py-3 px-4 text-muted-foreground">Searches and compiles several points</td>
                                      <td className="py-3 px-4 text-right font-medium text-foreground">0.26</td>
                                    </tr>
                                    <tr className="hover:bg-muted/30 transition-colors">
                                      <td className="py-3 px-4 text-muted-foreground">Asking a complex question ("Build a tenancy report")</td>
                                      <td className="py-3 px-4 text-muted-foreground">Pulls multiple details and formats a report</td>
                                      <td className="py-3 px-4 text-right font-medium text-foreground">0.54</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm italic mt-4">
                              You can check the HEU cost of any message by opening the menu (three dots) under the message in the chat.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="upgrade-subscription" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How can I upgrade my subscription?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">You can upgrade your subscription through your workspace settings or by contacting our support team.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="downgrade-subscription" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How can I downgrade my subscription?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">Subscription downgrades can be managed through your account settings or by reaching out to support.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="cancel-subscription" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How can I cancel my subscription?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">You can cancel your subscription at any time through your account settings. Your access will continue until the end of the current billing period.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="billing-info" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How can I change my billing information?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">Billing information can be updated in your account settings under the billing section.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="download-invoices" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How do I download my invoices?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">Invoices are available for download in your account settings under billing history.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="get-more-credits" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How do I get more credits?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">You can get more HEUs by upgrading your plan or purchasing Top-ups.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="credit-reset" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          When does my credit limit reset?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">Your credit limit resets at the beginning of each billing cycle based on your subscription plan.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="remaining-credits" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          How do I see the remaining credits in a workspace?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">Click on your workspace name on the dashboard to view your remaining credits and usage statistics.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="free-credits" className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                          Can I get free credits?
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <p className="text-muted-foreground text-sm">Free credits are included with the free plan. Additional free credits may be available through promotional offers or referral programs.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-72 sticky top-8 h-fit">
                <div className="border border-border rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-sm">
                  <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                    On This Page
                  </h3>
                  <nav className="space-y-1">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-4 py-3 text-sm rounded-lg transition-all ${
                          activeTocSection === section.id
                            ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Welcome content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'welcome') {
      return (
        <div className="flex-1">
          <div className="container mx-auto p-4 md:p-8 max-w-6xl mt-[10px]">
               {/* Welcome header above video - responsive alignment */}
               <div className="mb-8 md:mb-12 text-center md:text-left" 
                    style={{ 
                      marginLeft: 'auto', 
                      marginRight: 'auto',
                      maxWidth: '100%'
                    }}>
                 <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                   <img src={owlMascot} alt="Hobson AI Owl Mascot" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                   <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome</h1>
                 </div>
                 <p className="text-base md:text-lg text-muted-foreground">Learn about Hobson and how to get started</p>
                </div>
                
               {/* Description text below video - responsive alignment */}
               <div className="text-center md:text-left mt-6 md:mt-12 px-4 md:px-0" 
                    style={{ 
                      marginLeft: 'auto', 
                      marginRight: 'auto',
                      maxWidth: '100%'
                    }}>
                 <p className="text-base md:text-lg text-muted-foreground mb-6">
                   Hobson is an AI-powered assistant that reads and understands property documents to deliver accurate, cited answers instantly.
                 </p>
                 
                 <div className="space-y-4 text-muted-foreground">
                   <h3 className="text-lg font-semibold text-foreground">How Hobson works:</h3>
                   
                   <div className="space-y-3">
                     <p>
                       <strong className="text-foreground">1. Upload your documents</strong><br />
                       Simply drag your property documents into Hobson. This is the first step to unlocking intelligent insights.
                     </p>
                     
                     <p>
                       <strong className="text-foreground">2. Hobson reads and understands</strong><br />
                       Hobson uses AI to carefully read through each document. This process takes some time depending on the size and complexity of your files. The information is securely stored on our servers so you can access it anytime.
                     </p>
                     
                     <p>
                       <strong className="text-foreground">3. Get notified when ready</strong><br />
                       Once Hobson has finished reading and understanding your documents, you'll receive an email notification letting you know everything is ready.
                     </p>
                     
                     <p>
                       <strong className="text-foreground">4. Ask questions, get instant answers</strong><br />
                       With your documents processed, you can ask Hobson anything. AI powers the entire process—from reading and extracting key information to delivering accurate, cited answers instantly.
                     </p>
                   </div>
                   
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                      <p className="text-sm">
                        <strong className="text-foreground">Wish list:</strong> Hobson will connect directly to Dropbox, Google Drive, and other cloud storage platforms, making it even easier to access your documents.
                      </p>
                    </div>
                 </div>
               </div>

          </div>
        </div>
      );
    }

    // Handle Positioning Statement content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'positioning-statement') {
      return (
        <div className="flex-1">
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Positioning Statement</h1>
                <p className="text-base md:text-lg text-muted-foreground">From first document to confident decision</p>
              </div>
              
              <div className="border-l-4 border-primary pl-6 md:pl-8 py-4">
                <p className="text-lg md:text-xl leading-relaxed text-foreground">
                  For real estate professionals drained by bloated, expensive systems and the manual effort of pulling information from original documents, <span className="font-bold text-primary">Hobson is the AI-powered assistant</span> that transforms source-of-truth files into instant, reliable answers. Unlike complex platforms, Hobson is lightweight, simple to use, and low cost — saving time, ensuring accuracy, and building trust with fast, referenced responses.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Prompt Engineering - Fundamentals content specifically
    if (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'prompt-engineering') {
      const tocSections = [
        { id: 'what-is-prompting', label: 'What is Prompting?' },
        { id: 'why-prompting-matters', label: 'Why Prompting Matters' },
        { id: 'how-hobson-thinks', label: 'How Hobson "Thinks"' },
        { id: 'clear-method', label: 'The C.L.E.A.R. Method' },
        { id: 'advanced-tactics', label: 'Advanced Tactics' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Prompting Fundamentals</h1>
                  <p className="text-lg text-muted-foreground">Master the fundamentals of effective prompting with Hobson</p>
                </div>

                <div className="space-y-12">
                  {/* What is Prompting */}
                  <section id="what-is-prompting">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">What is Prompting?</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        Prompting means the way you ask Hobson a question or give instructions. Think of it as giving directions to a very literal assistant. Clearer prompts = better answers.
                      </p>
                    </div>
                  </section>

                  {/* Why Prompting Matters */}
                  <section id="why-prompting-matters">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Why Prompting Matters</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        A vague question might get you a vague answer. A precise question can get Hobson to:
                      </p>
                      <ul className="text-muted-foreground space-y-2 ml-6">
                        <li>• Summarise property documents clearly.</li>
                        <li>• Build tailored reports (e.g. rental yield comparisons).</li>
                        <li>• Bring in outside market insights when needed.</li>
                      </ul>
                      <p className="text-muted-foreground mt-4">
                        The way you phrase your request can be the difference between a quick note and a full market analysis.
                      </p>
                    </div>
                  </section>

                  {/* How Hobson "Thinks" */}
                  <section id="how-hobson-thinks">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">How Hobson "Thinks"</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground mb-4">
                        Hobson doesn't "know" things the way people do – it predicts answers based on patterns. That's why:
                      </p>
                      <ul className="text-muted-foreground space-y-3 ml-6">
                        <li><strong>Context is key:</strong> Always give Hobson the background it needs (e.g. "Focus on commercial properties in East London").</li>
                        <li><strong>Be explicit:</strong> State exactly what you want (e.g. "Summarise the lease terms in bullet points").</li>
                        <li><strong>Order matters:</strong> Put the most important parts of your question first.</li>
                        <li><strong>Check facts:</strong> Hobson can sound confident even when uncertain, so always review the output.</li>
                      </ul>
                    </div>
                  </section>

                  {/* Core Prompting Principles - The C.L.E.A.R. Method */}
                  <section id="clear-method">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Core Prompting Principles – The C.L.E.A.R. Method</h2>
                    <div className="space-y-6">
                      <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">C</span>
                          Concise
                        </h3>
                        <p className="text-muted-foreground">Be brief but direct. "Summarise this tenancy agreement in 200 words."</p>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">L</span>
                          Logical
                        </h3>
                        <p className="text-muted-foreground">Break down requests step by step. "First, outline key risks. Then, provide recommendations."</p>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">E</span>
                          Explicit
                        </h3>
                        <p className="text-muted-foreground">Tell Hobson exactly what you want. "List 5 comparable sales in table format."</p>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">A</span>
                          Adaptive
                        </h3>
                        <p className="text-muted-foreground">If the answer isn't right, refine your question and ask again.</p>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">R</span>
                          Reflective
                        </h3>
                        <p className="text-muted-foreground">Notice which questions worked best, and use that style again.</p>
                      </div>
                    </div>
                  </section>

                  {/* Advanced Tactics */}
                  <section id="advanced-tactics">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Advanced Tactics</h2>
                    <div className="space-y-4">
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-foreground mb-3">Meta Prompting</h3>
                        <p className="text-muted-foreground">Ask Hobson how to improve your question. ("How could I phrase this better for clearer results?")</p>
                      </div>

                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-foreground mb-3">Reverse Meta Prompting</h3>
                        <p className="text-muted-foreground">Ask Hobson to explain how it reached its answer, so you can check reasoning.</p>
                      </div>
                    </div>
                  </section>

                  {/* Summary */}
                  <section>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-foreground mb-3">👉 In short:</h3>
                      <p className="text-muted-foreground">
                        Treat Hobson like a very smart but very literal property assistant. The clearer your instructions, the more useful the results.
                      </p>
                    </div>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Prompt Engineering - Advanced Prompting content specifically
    if (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'advanced-prompting') {
      const tocSections = [
        { id: 'prompt-library', label: 'Prompt Library' },
        { id: 'lease-summaries', label: 'Summarising & Simplifying' },
        { id: 'extracting-data', label: 'Extracting & Structuring Data' },
        { id: 'comparing-properties', label: 'Comparing & Contrasting' },
        { id: 'risk-compliance', label: 'Identifying Risks & Issues' },
        { id: 'report-building', label: 'Creating Reports & Dashboards' },
        { id: 'market-context', label: 'Adding Context & Insight' },
        { id: 'lending-finance', label: 'Explaining & Stress-Testing' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Prompting</h1>
                  <p className="text-lg text-muted-foreground">Advanced techniques and strategies for getting the most out of Hobson</p>
                </div>

                <div className="space-y-12">
                  {/* Prompt Library */}
                  <section id="prompt-library">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Prompt Library</h2>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Prompting Strategies and Examples for Property Professionals</h3>
                    
                    <div className="space-y-6">
                      <div className="p-6 bg-muted rounded-lg">
                        <h4 className="text-lg font-semibold text-foreground mb-3">Welcome to Hobson's Prompt Library!</h4>
                        <p className="text-muted-foreground mb-4">
                          This guide gives you prompt patterns for everyday property tasks. Think of them as templates: you can copy, adapt, and reuse them whenever you need.
                        </p>
                        <p className="text-muted-foreground">
                          Hobson already has access to your business's documents — leases, deeds, rent schedules, plans, lending agreements, valuations, and more. Your job is simple: tell Hobson what you want to know and how you want it presented.
                        </p>
                      </div>

                      <Accordion type="single" collapsible className="space-y-4">
                        <AccordionItem value="lease-summaries" id="lease-summaries">
                          <AccordionTrigger className="text-lg font-semibold">1. Summarising & Simplifying</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-2"><strong>When to use:</strong> To turn long or technical documents into clear takeaways.</p>
                                <p className="text-muted-foreground mb-4"><strong>How to use:</strong> Ask Hobson for plain-English summaries, bullet points, or key highlights.</p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts:</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Summarise the lease for 22 Queen Street in bullet points, focusing on rent, break clauses, and repair obligations."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Highlight any unusual service charge clauses in the agreement for Unit 4."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="extracting-data" id="extracting-data">
                          <AccordionTrigger className="text-lg font-semibold">2. Extracting & Structuring Data</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-2"><strong>When to use:</strong> When you need specific details pulled into a clear format.</p>
                                <p className="text-muted-foreground mb-4"><strong>How to use:</strong> Tell Hobson what fields to find and how to present them (table, list, chart).</p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts:</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "From the rent schedule, list each unit with tenant name, rent, lease expiry, and next review date."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Extract all covenants from this deed and show who they apply to."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="comparing-properties" id="comparing-properties">
                          <AccordionTrigger className="text-lg font-semibold">3. Comparing & Contrasting</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-2"><strong>When to use:</strong> To spot differences or similarities across multiple documents.</p>
                                <p className="text-muted-foreground mb-4"><strong>How to use:</strong> Point Hobson to two or more documents and specify what to compare.</p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts:</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Compare the leases for Units 1, 2, and 3. Focus on rent reviews, repairing obligations, and break clauses."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Compare the tenancy agreements for 10 and 12 Green Lane, highlighting differences in tenant obligations."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="risk-compliance" id="risk-compliance">
                          <AccordionTrigger className="text-lg font-semibold">4. Identifying Risks & Issues</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-2"><strong>When to use:</strong> To uncover red flags, compliance gaps, or restrictions.</p>
                                <p className="text-muted-foreground mb-4"><strong>How to use:</strong> Ask Hobson to review documents with a focus on potential problems.</p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts:</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Review the title deed for 30 River Road and highlight any restrictive covenants or easements."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Check this agreement for compliance with the Landlord and Tenant Act."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="report-building" id="report-building">
                          <AccordionTrigger className="text-lg font-semibold">5. Creating Reports & Dashboards</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-2"><strong>When to use:</strong> To generate structured outputs for stakeholders.</p>
                                <p className="text-muted-foreground mb-4"><strong>How to use:</strong> Specify the scope (portfolio, set of documents) and the output format (summary, dashboard, narrative).</p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts:</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Create a report on the portfolio: summarise each lease, include rent schedules, and note all lease events in the next 12 months."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Build a dashboard showing income by tenant, lease expiry profile, and upcoming rent reviews."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="market-context" id="market-context">
                          <AccordionTrigger className="text-lg font-semibold">6. Adding Context & Insight</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-2"><strong>When to use:</strong> To combine internal documents with external trends or policies.</p>
                                <p className="text-muted-foreground mb-4"><strong>How to use:</strong> Ask Hobson to connect document insights to wider market or regulatory context.</p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts:</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Using the rent reviews due in the next year, explain how current market trends might affect outcomes."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Summarise how new energy efficiency rules could affect our property portfolio."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="lending-finance" id="lending-finance">
                          <AccordionTrigger className="text-lg font-semibold">7. Explaining & Stress-Testing</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-2"><strong>When to use:</strong> To simplify complex terms or test "what if" scenarios.</p>
                                <p className="text-muted-foreground mb-4"><strong>How to use:</strong> Ask Hobson to explain terms, calculate impacts, or run stress scenarios.</p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts:</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Summarise the key terms of this loan facility, including covenants, repayment terms, and interest cover."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "If rental income drops by 10%, what impact would this have on loan cover ratios?"
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                      </Accordion>

                      <div className="mt-8 p-6 bg-muted rounded-lg">
                        <h4 className="text-lg font-semibold text-foreground mb-3">👉 Pro Tip</h4>
                        <p className="text-muted-foreground mb-3">
                          You can also use meta-prompting with Hobson. For example:
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="p-3 bg-background rounded border border-border">
                            "Suggest a better way to phrase this question to get clearer results."
                          </div>
                          <div className="p-3 bg-background rounded border border-border">
                            "Explain how you reached this answer, step by step."
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-3">
                          This way, Hobson helps you ask better questions and trust the answers more.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Prompt Engineering - Debugging Prompts content specifically
    if (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'debugging-prompts') {
      const tocSections = [
        { id: 'quick-fixes', label: 'Quick Fixes' },
        { id: 'deep-reviews', label: 'Deep Reviews' },
        { id: 'fragile-areas', label: 'Fragile Areas (Handle with Care)' },
        { id: 'performance-issues', label: 'Performance Issues' },
        { id: 'persistent-problems', label: 'Persistent Problems' },
        { id: 'debugging-flows', label: 'Debugging Flows (Examples)' },
        { id: 'root-cause', label: 'Root Cause Mindset' },
        { id: 'pro-tips', label: 'Pro Tips' },
      ];

      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Debugging Prompts</h1>
                  <p className="text-lg text-muted-foreground">Troubleshooting workflows, strategies, and examples for property professionals</p>
                </div>

                <div className="space-y-12">
                  <section>
                    <div className="space-y-6">
                      <div className="p-6 bg-muted rounded-lg">
                        <h4 className="text-lg font-semibold text-foreground mb-3">Debugging Prompts</h4>
                        <h5 className="text-base font-medium text-foreground mb-3">Troubleshooting Workflows, Strategies, and Examples for Property Professionals</h5>
                        <p className="text-muted-foreground mb-4">
                          Working with Hobson is usually smooth — but sometimes you might get an answer that feels off, incomplete, or "not quite right." That's normal. Debugging is simply the process of refining your question (prompt), checking what Hobson has understood, and guiding it back on track.
                        </p>
                        <p className="text-muted-foreground">
                          This guide shows you how to spot problems, fix them, and even turn mistakes into better insights.
                        </p>
                      </div>

                      <Accordion type="single" collapsible className="space-y-4">
                        <AccordionItem value="quick-fixes" id="quick-fixes">
                          <AccordionTrigger className="text-lg font-semibold">1. Quick Fixes</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-2"><strong>When to use:</strong> When Hobson's response is unclear, too general, or misses part of your request.</p>
                                <p className="text-muted-foreground mb-4"><strong>How to use:</strong> Be specific about what's wrong and ask Hobson to correct it.</p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "You missed the rent review dates. Please include them in the summary."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "That summary is too detailed. Give me a shorter, 5-point version instead."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="deep-reviews" id="deep-reviews">
                          <AccordionTrigger className="text-lg font-semibold">2. Deep Reviews</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-2"><strong>When to use:</strong> If you suspect Hobson misunderstood a document or gave an unreliable answer.</p>
                                <p className="text-muted-foreground mb-4"><strong>How to use:</strong> Ask Hobson to explain how it reached its conclusion or to double-check its own work.</p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Explain step by step how you identified the covenants in this deed."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Review the lease summary again, but only highlight break clauses and repairing obligations."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="fragile-areas" id="fragile-areas">
                          <AccordionTrigger className="text-lg font-semibold">3. Fragile Areas (Handle with Care)</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-4">
                                  Some documents are especially sensitive — like loan agreements, head leases, or planning restrictions. Here you'll want Hobson to slow down and be extra cautious.
                                </p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompt</h5>
                                <div className="p-3 bg-background rounded border border-border text-sm">
                                  "The loan facility agreement for the Riverside portfolio is critical. Please review carefully, explain each covenant in plain English, and double-check that you haven't missed anything."
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="performance-issues" id="performance-issues">
                          <AccordionTrigger className="text-lg font-semibold">4. Performance Issues</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-4">
                                  Sometimes Hobson's answers may feel "sluggish" — either too long, too vague, or full of repetition. You can tighten the response by asking for focus or a different format.
                                </p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Example Prompts</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Summarise this 40-page lease into just 10 key points."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    "Put the tenant obligations into a clear table with columns for clause number, obligation, and responsibility."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="persistent-problems" id="persistent-problems">
                          <AccordionTrigger className="text-lg font-semibold">5. Persistent Problems</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-4">
                                  If Hobson keeps misunderstanding or giving the wrong kind of answer, take a step back. Try reframing or breaking down your request.
                                </p>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-foreground mb-2">Strategies</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="p-3 bg-background rounded border border-border">
                                    <strong>Ask what went wrong:</strong> "Why do you think your answer didn't include rent figures?"
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    <strong>Try a different approach:</strong> "Instead of a summary, extract just the numbers from the rent schedule."
                                  </div>
                                  <div className="p-3 bg-background rounded border border-border">
                                    <strong>Start fresh:</strong> "Ignore earlier instructions. Start again: list each tenant, rent, and expiry date."
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="debugging-flows" id="debugging-flows">
                          <AccordionTrigger className="text-lg font-semibold">6. Debugging Flows (Examples)</AccordionTrigger>
                          <AccordionContent className="space-y-6">
                            <div className="space-y-6">
                              <div>
                                <h5 className="font-semibold text-foreground mb-3">a) "Stuck in a loop"</h5>
                                <p className="text-muted-foreground mb-3">
                                  You ask Hobson to summarise a lease, but it keeps missing service charges.
                                </p>
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-foreground">Flow:</p>
                                  <ol className="text-sm text-muted-foreground space-y-2 ml-4">
                                    <li>1. Say: "You didn't include service charges. Please review again and only list service charge clauses."</li>
                                    <li>2. Hobson corrects and shows just the relevant clauses.</li>
                                    <li>3. You confirm: "Yes, that's correct. Now add rent review dates as well."</li>
                                  </ol>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-semibold text-foreground mb-3">b) "Feature not working"</h5>
                                <p className="text-muted-foreground mb-3">
                                  You ask for a cashflow report, but Hobson outputs only a lease summary.
                                </p>
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-foreground">Flow:</p>
                                  <ol className="text-sm text-muted-foreground space-y-2 ml-4">
                                    <li>1. Say: "I asked for a cashflow report, but you gave me a lease summary. Can you explain why?"</li>
                                    <li>2. Hobson may say it used the wrong source.</li>
                                    <li>3. You reply: "Use the rent schedule for the retail portfolio and build a 12-month cashflow instead."</li>
                                  </ol>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-semibold text-foreground mb-3">c) "Information disappeared"</h5>
                                <p className="text-muted-foreground mb-3">
                                  You ask for tenant obligations, but only get landlord obligations back.
                                </p>
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-foreground">Flow:</p>
                                  <ol className="text-sm text-muted-foreground space-y-2 ml-4">
                                    <li>1. Say: "You only gave landlord obligations. Please check again and list tenant obligations separately."</li>
                                    <li>2. Hobson re-checks and adds the missing section.</li>
                                  </ol>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="root-cause" id="root-cause">
                          <AccordionTrigger className="text-lg font-semibold">7. Root Cause Mindset</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <p className="text-muted-foreground mb-4">
                                  Don't just patch mistakes — look for the cause.
                                </p>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="p-3 bg-background rounded border border-border text-sm">
                                  <p className="text-muted-foreground mb-2"><strong>Instead of:</strong> "Add the missing covenant."</p>
                                  <p className="text-muted-foreground"><strong>Try:</strong> "Why did you miss this covenant in the first place?"</p>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  This way Hobson can learn with you and future answers improve.
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="pro-tips" id="pro-tips">
                          <AccordionTrigger className="text-lg font-semibold">8. Pro Tips</AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-4">
                              <ul className="text-muted-foreground space-y-3">
                                <li>• <strong>Rollback:</strong> If the conversation feels messy, reset with a clean, clear new question.</li>
                                <li>• <strong>Small steps:</strong> Break big tasks into smaller ones (e.g. "Summarise lease" → "List covenants" → "Create table").</li>
                                <li>• <strong>Document fixes:</strong> Ask Hobson: "Summarise what went wrong and how we fixed it" to keep a record.</li>
                                <li>• <strong>Ask for alternatives:</strong> If one path fails, try: "Suggest a different way to approach this problem."</li>
                              </ul>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="mt-8 p-6 bg-muted rounded-lg">
                        <h4 className="text-lg font-semibold text-foreground mb-3">👉 In short</h4>
                        <p className="text-muted-foreground">
                          Debugging with Hobson isn't about "errors in code" — it's about refining your questions, checking assumptions, and guiding Hobson like you would a junior colleague.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 sticky top-8 h-fit">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tocSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeTocSection === section.id
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Hobson Glossary specifically
    if (activeHorizontalTab === 'glossary' && activeVerticalTab === 'hobson-glossary') {
      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Hobson Glossary</h1>
              <p className="text-lg text-muted-foreground">Key Terms for Using Your AI Assistant</p>
            </div>

            <div className="space-y-8">
              <div className="grid gap-6">
                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">AI (Artificial Intelligence)</h3>
                  <p className="text-muted-foreground">The technology that powers Hobson. It enables Hobson to read your documents, answer questions, and generate reports.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Context</h3>
                  <p className="text-muted-foreground">The background information Hobson needs to give accurate answers. If you don't provide enough, the response may be vague.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Debugging</h3>
                  <p className="text-muted-foreground">Fixing or refining a prompt when Hobson's answer isn't right. This might mean rephrasing the question, narrowing the focus, or asking Hobson to explain its reasoning.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Debugging Flow</h3>
                  <p className="text-muted-foreground mb-3">A step-by-step process for refining prompts if Hobson misunderstands.</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Example:</p>
                    <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>1. Point out what's missing ("You didn't include service charges").</li>
                      <li>2. Ask for a correction.</li>
                      <li>3. Confirm or refine further.</li>
                    </ol>
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Embeddings</h3>
                  <p className="text-muted-foreground">A method of turning words or sentences into numbers that capture their meaning. These numbers let Hobson compare ideas and find connections between different pieces of text.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">JSON</h3>
                  <p className="text-muted-foreground">A way of structuring data so both people and computers can read it. Think of it like a digital "spreadsheet" written in text, with labels and values. Hobson often uses JSON behind the scenes to organise information.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Knowledge Base</h3>
                  <p className="text-muted-foreground">A space where your business can add important background information (e.g. standard reporting formats, preferred output styles) that Hobson uses to stay consistent.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Meta Prompting</h3>
                  <p className="text-muted-foreground mb-3">Asking Hobson how to improve your question for a clearer answer.</p>
                  <div className="p-3 bg-background rounded border border-border text-sm">
                    <strong>Example:</strong> "How should I phrase this to get a better summary of this lease?"
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Prompt</h3>
                  <p className="text-muted-foreground">A question or instruction you give to Hobson. Clearer prompts = more useful answers.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Prompt Library</h3>
                  <p className="text-muted-foreground">A set of example prompts you can copy or adapt for common tasks (e.g. summarising leases, creating rent reports, preparing lender packs).</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">RAG</h3>
                  <p className="text-muted-foreground">Short for Retrieval-Augmented Generation. It's a way Hobson answers questions more accurately by first finding relevant information from your documents, then using that information to generate a better response.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Report</h3>
                  <p className="text-muted-foreground">A structured output created by Hobson — for example, a portfolio summary, cashflow projection, or lender briefing.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Reverse Prompting</h3>
                  <p className="text-muted-foreground">Asking Hobson to explain how it arrived at an answer, so you can check the logic.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Vector Search</h3>
                  <p className="text-muted-foreground">A smart way of finding information. Instead of matching exact words, it looks for meanings and similarities. This means Hobson can find the right answer even if you phrase your question differently from how it's written in the document.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Knowledge Graph</h3>
                  <p className="text-muted-foreground">A Knowledge Graph is like a map of information. It shows facts (people, places, documents) as points and connects them with relationships (like "tenant of" or "owns"). This helps Hobson AI understand context and give smarter, more accurate answers.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Session</h3>
                  <p className="text-muted-foreground">A continuous conversation with Hobson. Within a session, Hobson remembers your earlier questions and answers.</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="text-lg font-semibold text-foreground mb-3">👉 In short</h4>
                <p className="text-muted-foreground">
                  This glossary isn't about property law or finance — it's about helping your team understand the AI terms and features that make Hobson work for them.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Use Cases content
    if (activeHorizontalTab === 'use-cases') {
      return <UseCasesContent />;
    }

    return (
      <div className="flex-1">
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
            {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label}
          </h1>
          <div className="p-4 md:p-8">
            <p className="text-muted-foreground text-base md:text-lg">
              Content for {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label} - {currentVerticalTabs.find(tab => tab.id === activeVerticalTab)?.label}
            </p>
            <p className="text-muted-foreground mt-4 text-sm md:text-base">
              This is where the actual content will go for each section. The layout is now ready for you to populate with specific content for each combination of tabs.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Dynamic SEO meta tags based on active section
  const getPageMeta = () => {
    if (activeHorizontalTab === 'introduction') {
      if (activeVerticalTab === 'positioning-statement') {
        return {
          title: 'Positioning Statement - Hobson AI',
          description: 'Learn about Hobson AI: the lightweight, AI-powered assistant that transforms source-of-truth files into instant, reliable answers for real estate professionals.'
        };
      }
      if (activeVerticalTab === 'plans-credits') {
        return {
          title: 'Plans & Credits - Hobson AI',
          description: 'Explore Hobson AI pricing plans and credit options. Find the perfect plan for your real estate document management needs.'
        };
      }
    }
    if (activeHorizontalTab === 'prompt-engineering') {
      if (activeVerticalTab === 'prompt-engineering') {
        return {
          title: 'Prompt Engineering Fundamentals - Hobson AI',
          description: 'Master the fundamentals of effective prompting with Hobson AI. Learn how to craft clear prompts for better AI-powered document analysis.'
        };
      }
      if (activeVerticalTab === 'advanced-prompting') {
        return {
          title: 'Advanced Prompting - Hobson AI',
          description: 'Advanced prompting techniques for Hobson AI. Learn expert strategies for lease summaries, data extraction, and property comparisons.'
        };
      }
      if (activeVerticalTab === 'debugging-prompts') {
        return {
          title: 'Debugging Prompts - Hobson AI',
          description: 'Learn how to troubleshoot and optimize your prompts with Hobson AI for better document analysis results.'
        };
      }
    }
    if (activeHorizontalTab === 'use-cases') {
      return {
        title: 'Use Cases - Hobson AI',
        description: 'Discover real-world use cases and applications of Hobson AI for property management and real estate document analysis.'
      };
    }
    if (activeHorizontalTab === 'features') {
      return {
        title: 'Features - Hobson AI',
        description: 'Explore Hobson AI features for intelligent document processing, smart search, and automated property management.'
      };
    }
    if (activeHorizontalTab === 'integrations') {
      return {
        title: 'Integrations - Hobson AI',
        description: 'Learn about Hobson AI integrations with your existing tools and workflows for seamless property management.'
      };
    }
    if (activeHorizontalTab === 'glossary') {
      return {
        title: 'Glossary - Hobson AI',
        description: 'Comprehensive glossary of terms used in Hobson AI and real estate document management.'
      };
    }
    if (activeHorizontalTab === 'faq') {
      return {
        title: 'FAQ - Hobson AI',
        description: 'Frequently asked questions about Hobson AI: AI-powered assistant for real estate professionals.'
      };
    }
    return {
      title: 'Learn - Hobson\'s Choice AI',
      description: 'Learn how to use Hobson\'s Choice AI with our comprehensive guides, tutorials, and documentation.'
    };
  };

  const pageMeta = getPageMeta();

  return (
    <>
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <link rel="canonical" href={`https://hobsonschoice.ai/learn/${activeVerticalTab || ''}`} />
      </Helmet>
      
      <GlobalHeader />
      
      <div className="min-h-screen">
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col">
          {/* Horizontal Topics Navigation */}
          <div className="mt-8">
            <div className="w-full px-4">
              <nav className="flex space-x-8 overflow-x-auto">
                {horizontalTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        const contextualTabs = getContextualVerticalTabs(tab.id);
                        const newVerticalTab = contextualTabs[0]?.id || tab.id;
                        setActiveHorizontalTab(tab.id);
                        setActiveVerticalTab(newVerticalTab);
                        setIsGlobalPageActive(false);
                        navigate(`/learn/${tab.id === 'use-cases' ? 'use-cases' : newVerticalTab}`, { replace: true });
                      }}
                      className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-colors whitespace-nowrap ${
                        activeHorizontalTab === tab.id && !isGlobalPageActive
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

          {/* Desktop Main Layout with Sidebar and Content */}
          <div className="flex">
            {/* Desktop Left Navigation Panel */}
            <aside className="w-80 min-h-[calc(100vh-8rem)]">
              <div className="p-4 pt-[38px]">
                {/* Global Navigation Section */}
                <div className="mb-8">
                  <nav className="space-y-1">
                    {staticVerticalTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveVerticalTab(tab.id);
                            setIsGlobalPageActive(true);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            activeVerticalTab === tab.id && isGlobalPageActive
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
                {!isGlobalPageActive && (
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <div className="bg-background px-3">
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contextual Section - Only show when not on global pages */}
                {!isGlobalPageActive && (
                  <div>
                    <div className="px-3 pb-4 mb-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const ActiveIcon = horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.icon;
                          return ActiveIcon ? <ActiveIcon className="w-5 h-5 text-primary" /> : null;
                        })()}
                        <h3 className="text-lg font-medium text-foreground">
                          {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground pl-7">Navigate through {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label.toLowerCase()} content</p>
                    </div>
                    <nav className="space-y-1">
                       {getContextualVerticalTabs(activeHorizontalTab).map((tab) => {
                         const Icon = tab.icon;
                         return (
                           <button
                             key={tab.id}
                             onClick={() => {
                               setActiveVerticalTab(tab.id);
                               setIsGlobalPageActive(false);
                               navigate(`/learn/${tab.id}`, { replace: true });
                             }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              activeVerticalTab === tab.id && !isGlobalPageActive
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
                )}
              </div>
            </aside>

            {/* Desktop Main Content Area */}
            <div className="flex-1 min-h-[calc(100vh-8rem)]">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Topics Navigation */}
          <div className="border-b bg-background sticky top-16 z-40">
            <div className="px-4 py-3">
               <select 
                 value={activeHorizontalTab}
                 onChange={(e) => {
                   const contextualTabs = getContextualVerticalTabs(e.target.value);
                   const newVerticalTab = contextualTabs[0]?.id || e.target.value;
                   setActiveHorizontalTab(e.target.value);
                   setActiveVerticalTab(newVerticalTab);
                   setIsGlobalPageActive(false);
                   navigate(`/learn/${e.target.value === 'use-cases' ? 'use-cases' : newVerticalTab}`, { replace: true });
                 }}
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              >
                {horizontalTabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Mobile Subtopic Navigation */}
            {!isGlobalPageActive && getContextualVerticalTabs(activeHorizontalTab).length > 0 && (
              <div className="px-4 pb-3">
                 <select 
                   value={activeVerticalTab}
                   onChange={(e) => {
                     setActiveVerticalTab(e.target.value);
                     setIsGlobalPageActive(false);
                     navigate(`/learn/${e.target.value}`, { replace: true });
                   }}
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  {getContextualVerticalTabs(activeHorizontalTab).map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-h-[calc(100vh-8rem)] p-4 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        onSuccess={handleAuthSuccess}
      />

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={isCreatePostDialogOpen}
        onOpenChange={setIsCreatePostDialogOpen}
        onPostCreated={() => {
          setIsCreatePostDialogOpen(false);
        }}
      />
    </>
  );
};

export default Learn;