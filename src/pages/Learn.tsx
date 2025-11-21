import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Book, Lightbulb, Puzzle, Wand2, Users, Library, FileText, Clock, Bell, Activity, MessageSquare, Heart, CreditCard, HelpCircle, Play, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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
import { supabase } from "@/integrations/supabase/client";
const Learn = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    section
  } = useParams<{
    section?: string;
  }>();
  const [activeHorizontalTab, setActiveHorizontalTab] = useState('introduction');
  const [activeVerticalTab, setActiveVerticalTab] = useState('welcome');
  const [isGlobalPageActive, setIsGlobalPageActive] = useState(false);
  const [activeTocSection, setActiveTocSection] = useState('positioning-statement');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [faqItems, setFaqItems] = useState<any[]>([]);
  const [glossaryItems, setGlossaryItems] = useState<any[]>([]);

  // Fetch FAQs from database
  useEffect(() => {
    const fetchFaqs = async () => {
      const {
        data
      } = await supabase.from('faq_items').select('*').eq('is_active', true).order('sort_order');
      setFaqItems(data || []);
    };
    fetchFaqs();
  }, []);

  // Fetch Glossary items from database
  useEffect(() => {
    const fetchGlossary = async () => {
      const {
        data
      } = await supabase.from('glossary_items').select('*').eq('is_active', true).order('sort_order');
      setGlossaryItems(data || []);
    };
    fetchGlossary();
  }, []);

  // Handle both URL param and hash navigation
  useEffect(() => {
    const handleNavigation = () => {
      // Prioritize URL param over hash
      const urlSection = section?.toLowerCase().replace(/-/g, '');
      const hash = window.location.hash.substring(1).toLowerCase(); // Remove # and lowercase
      const activeSection = urlSection || hash;
      if (activeSection) {
        // Map section/hash to horizontal and vertical tabs
        const sectionMap: Record<string, {
          horizontal: string;
          vertical?: string;
        }> = {
          // Introduction section
          'introduction': {
            horizontal: 'introduction',
            vertical: 'positioning-statement'
          },
          'positioning-statement': {
            horizontal: 'introduction',
            vertical: 'positioning-statement'
          },
          'positioningstatement': {
            horizontal: 'introduction',
            vertical: 'positioning-statement'
          },
          'plans-credits': {
            horizontal: 'introduction',
            vertical: 'plans-credits'
          },
          'planscredits': {
            horizontal: 'introduction',
            vertical: 'plans-credits'
          },
          'plans-and-credit': {
            horizontal: 'introduction',
            vertical: 'plans-credits'
          },
          'plansandcredit': {
            horizontal: 'introduction',
            vertical: 'plans-credits'
          },
          'faq': {
            horizontal: 'introduction',
            vertical: 'faq'
          },
          // Features section
          'features': {
            horizontal: 'features',
            vertical: 'core-features'
          },
          'core-features': {
            horizontal: 'features',
            vertical: 'core-features'
          },
          'corefeatures': {
            horizontal: 'features',
            vertical: 'core-features'
          },
          'advanced-features': {
            horizontal: 'features',
            vertical: 'advanced-features'
          },
          'advancedfeatures': {
            horizontal: 'features',
            vertical: 'advanced-features'
          },
          'feature-comparison': {
            horizontal: 'features',
            vertical: 'feature-comparison'
          },
          'featurecomparison': {
            horizontal: 'features',
            vertical: 'feature-comparison'
          },
          'roadmap': {
            horizontal: 'features',
            vertical: 'roadmap'
          },
          // Integrations section
          'integrations': {
            horizontal: 'integrations',
            vertical: 'available-integrations'
          },
          'intergrations': {
            horizontal: 'integrations',
            vertical: 'available-integrations'
          },
          'available-integrations': {
            horizontal: 'integrations',
            vertical: 'available-integrations'
          },
          'availableintegrations': {
            horizontal: 'integrations',
            vertical: 'available-integrations'
          },
          'setup-guide': {
            horizontal: 'integrations',
            vertical: 'setup-guide'
          },
          'setupguide': {
            horizontal: 'integrations',
            vertical: 'setup-guide'
          },
          'set-up-guide': {
            horizontal: 'integrations',
            vertical: 'setup-guide'
          },
          'api-reference': {
            horizontal: 'integrations',
            vertical: 'api-reference'
          },
          'apireference': {
            horizontal: 'integrations',
            vertical: 'api-reference'
          },
          'troubleshooting': {
            horizontal: 'integrations',
            vertical: 'troubleshooting'
          },
          // Use Cases section
          'use-cases': {
            horizontal: 'use-cases'
          },
          'usecases': {
            horizontal: 'use-cases'
          },
          // Glossary section
          'glossary': {
            horizontal: 'glossary',
            vertical: 'hobson-glossary'
          },
          'hobson-glossary': {
            horizontal: 'glossary',
            vertical: 'hobson-glossary'
          },
          'hobsonglossary': {
            horizontal: 'glossary',
            vertical: 'hobson-glossary'
          }
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
      setActiveTocSection('how-hobson-works');
    } else if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits') {
      setActiveTocSection('overview');
    } else if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'positioning-statement') {
      setActiveTocSection('hobson-platform-overview');
    }
  }, [activeHorizontalTab, activeVerticalTab]);

  // Scroll spy effect - moved to top level to avoid hook order issues
  useEffect(() => {
    let tocSections: string[] = [];

    // Only run scroll spy for pages that have table of contents
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'faq' || activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits' || activeHorizontalTab === 'features' && ['core-features', 'advanced-features', 'feature-comparison', 'roadmap'].includes(activeVerticalTab) || activeHorizontalTab === 'integrations' && ['available-integrations', 'setup-guide', 'api-reference', 'troubleshooting'].includes(activeVerticalTab)) {
      if (activeHorizontalTab === 'introduction') {
        if (activeVerticalTab === 'faq') {
          tocSections = ['how-hobson-works', 'features', 'plans-credits-faq'];
        } else if (activeVerticalTab === 'plans-credits') {
          tocSections = ['overview', 'starter-pack', 'feature-comparison', 'available-plans', 'credit-display', 'credit-rollovers', 'faq-plans', 'troubleshooting'];
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
  const horizontalTabs = [{
    id: 'introduction',
    label: 'Introduction',
    icon: Book
  }, {
    id: 'features',
    label: 'Features',
    icon: Lightbulb
  }, {
    id: 'integrations',
    label: 'Integrations',
    icon: Puzzle
  }, {
    id: 'use-cases',
    label: 'Use Cases',
    icon: Library
  }, {
    id: 'glossary',
    label: 'Glossary',
    icon: FileText
  }];

  // Static top menu items (separate pages)
  const staticVerticalTabs = [{
    id: 'announcements',
    label: 'Announcements',
    icon: Bell,
    href: '/announcements'
  }, {
    id: 'status',
    label: 'Status',
    icon: Activity,
    href: '/status'
  }, {
    id: 'feature-requests',
    label: 'Feature requests',
    icon: MessageSquare
  }];

  // Dynamic submenu items based on horizontal selection
  const getContextualVerticalTabs = (horizontalTab: string) => {
    const baseItems = [{
      id: 'overview',
      label: 'Overview',
      icon: Heart
    }, {
      id: 'documentation',
      label: 'Documentation',
      icon: FileText
    }, {
      id: 'examples',
      label: 'Examples',
      icon: Play
    }, {
      id: 'faq',
      label: 'FAQ',
      icon: HelpCircle
    }];
    switch (horizontalTab) {
      case 'introduction':
        return [{
          id: 'positioning-statement',
          label: 'Positioning Statement',
          icon: Play
        }, {
          id: 'plans-credits',
          label: 'Plans and Credits',
          icon: CreditCard
        }, {
          id: 'faq',
          label: 'FAQ',
          icon: HelpCircle
        }];
      case 'features':
        return [{
          id: 'core-features',
          label: 'Core Features',
          icon: Heart
        }, {
          id: 'advanced-features',
          label: 'Advanced Features',
          icon: Wand2
        }, {
          id: 'feature-comparison',
          label: 'Feature Comparison',
          icon: FileText
        }, {
          id: 'roadmap',
          label: 'Roadmap',
          icon: Clock
        }];
      case 'integrations':
        return [{
          id: 'available-integrations',
          label: 'Available Integrations',
          icon: Puzzle
        }, {
          id: 'setup-guide',
          label: 'Setup Guide',
          icon: Play
        }, {
          id: 'api-reference',
          label: 'API Reference',
          icon: FileText
        }, {
          id: 'troubleshooting',
          label: 'Troubleshooting',
          icon: HelpCircle
        }];
      case 'tips-tricks':
        return [{
          id: 'best-practices',
          label: 'Best Practices',
          icon: Heart
        }, {
          id: 'productivity-tips',
          label: 'Productivity Tips',
          icon: Lightbulb
        }, {
          id: 'common-mistakes',
          label: 'Common Mistakes',
          icon: HelpCircle
        }, {
          id: 'advanced-techniques',
          label: 'Advanced Techniques',
          icon: Wand2
        }];
      case 'use-cases':
        return [];
      case 'glossary':
        return [{
          id: 'hobson-glossary',
          label: 'Hobson Glossary',
          icon: FileText
        }];
      case 'changelog':
        return [{
          id: 'latest-updates',
          label: 'Latest Updates',
          icon: Clock
        }, {
          id: 'release-notes',
          label: 'Release Notes',
          icon: FileText
        }, {
          id: 'version-history',
          label: 'Version History',
          icon: Activity
        }, {
          id: 'upcoming-changes',
          label: 'Upcoming Changes',
          icon: Bell
        }];
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
      return <div className="flex-1 p-8">
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
        </div>;
    }

    // Handle Core Features content
    if (activeHorizontalTab === 'features' && activeVerticalTab === 'core-features') {
      const tocSections = [{
        id: 'intelligent-document-processing',
        label: 'Intelligent Document Processing'
      }, {
        id: 'smart-search-insights',
        label: 'Smart Search & Insights'
      }, {
        id: 'real-time-analytics',
        label: 'Real-Time Analytics'
      }, {
        id: 'collaboration-ready',
        label: 'Collaboration Ready'
      }, {
        id: 'security-compliance',
        label: 'Security & Compliance'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1">
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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Advanced Features content
    if (activeHorizontalTab === 'features' && activeVerticalTab === 'advanced-features') {
      const tocSections = [{
        id: 'ai-powered-summarisation',
        label: 'AI-Powered Summarisation'
      }, {
        id: 'cross-document-insights',
        label: 'Cross-Document Insights'
      }, {
        id: 'automated-report-generation',
        label: 'Automated Report Generation'
      }, {
        id: 'clause-obligation-tracking',
        label: 'Clause & Obligation Tracking'
      }, {
        id: 'integration-ready',
        label: 'Integration Ready'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1">
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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Feature Comparison content
    if (activeHorizontalTab === 'features' && activeVerticalTab === 'feature-comparison') {
      const tocSections = [{
        id: 'comparison-table',
        label: 'Comparison Table'
      }, {
        id: 'key-differentiators',
        label: 'Key Differentiators'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1">
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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Product Roadmap content
    if (activeHorizontalTab === 'features' && activeVerticalTab === 'roadmap') {
      const tocSections = [{
        id: 'recently-launched',
        label: 'Recently Launched'
      }, {
        id: 'in-progress',
        label: 'In Progress'
      }, {
        id: 'coming-soon',
        label: 'Wish list'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1">
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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Integrations content
    if (activeHorizontalTab === 'integrations' && (!activeVerticalTab || activeVerticalTab === 'available-integrations')) {
      const tocSections = [{
        id: 'planned-integrations',
        label: 'Planned Integrations'
      }, {
        id: 'why-integrations-matter',
        label: 'Why Integrations Matter'
      }, {
        id: 'what-were-working-towards',
        label: 'What We\'re Working Towards'
      }, {
        id: 'benefit-for-you',
        label: 'The Benefit for You'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1">
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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle API Reference content
    if (activeHorizontalTab === 'integrations' && activeVerticalTab === 'api-reference') {
      const tocSections = [{
        id: 'overview',
        label: 'Overview'
      }, {
        id: 'authentication',
        label: 'Authentication'
      }, {
        id: 'endpoints',
        label: 'Endpoints'
      }, {
        id: 'document-analysis',
        label: 'Document Analysis'
      }, {
        id: 'query-interface',
        label: 'Query Interface'
      }, {
        id: 'webhooks',
        label: 'Webhooks'
      }, {
        id: 'rate-limits',
        label: 'Rate Limits'
      }, {
        id: 'error-handling',
        label: 'Error Handling'
      }, {
        id: 'examples',
        label: 'Examples'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      };
      return <div className="flex-1">
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
                  {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                      {section.label}
                    </button>)}
                </nav>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Integrations content
    if (activeHorizontalTab === 'integrations' && (!activeVerticalTab || activeVerticalTab === 'available-integrations')) {
      return <div className="flex-1 p-8">
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
        </div>;
    }

    // Handle Setup Guide content
    if (activeHorizontalTab === 'integrations' && activeVerticalTab === 'setup-guide') {
      const tocSections = [{
        id: 'coming-soon-notice',
        label: 'Notice'
      }, {
        id: 'what-to-expect',
        label: 'What to Expect'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1">
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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle API Reference content
    if (activeHorizontalTab === 'integrations' && activeVerticalTab === 'api-reference') {
      const tocSections = [{
        id: 'overview',
        label: 'Overview'
      }, {
        id: 'authentication',
        label: 'Authentication'
      }, {
        id: 'endpoints',
        label: 'Endpoints'
      }, {
        id: 'document-analysis',
        label: 'Document Analysis'
      }, {
        id: 'query-interface',
        label: 'Query Interface'
      }, {
        id: 'webhooks',
        label: 'Webhooks'
      }, {
        id: 'rate-limits',
        label: 'Rate Limits'
      }, {
        id: 'error-handling',
        label: 'Error Handling'
      }, {
        id: 'examples',
        label: 'Examples'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1">
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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Troubleshooting content
    if (activeHorizontalTab === 'integrations' && activeVerticalTab === 'troubleshooting') {
      const tocSections = [{
        id: 'coming-soon-notice',
        label: 'Coming Soon Notice'
      }, {
        id: 'what-to-expect',
        label: 'What to Expect'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1">
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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Positioning Statement content
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'positioning-statement') {
      return <div className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl blur-3xl" />
              
              {/* Main content card */}
              <div className="relative bg-card border-2 border-primary/20 rounded-2xl p-8 md:p-12 lg:p-16 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in">
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-t-2xl" />
                
                {/* Icon/Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">Our Mission</span>
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
                  Positioning Statement
                </h1>
                
                {/* Statement content */}
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary to-accent rounded-full" />
                  <blockquote className="pl-8 space-y-6">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      For real estate professionals drained by large, expensive systems and the manual effort of pulling information from original documents, Hobson is the AI-powered assistant that transforms source-of-truth files into instant, reliable answers. 
                      <span className="text-primary font-semibold"> Hobson is the AI-powered assistant</span> that transforms source-of-truth files into instant, reliable answers.
                    </p>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Unlike complex platforms, Hobson is <span className="text-foreground/80 font-semibold">lightweight, simple to use, and low cost</span> — saving time, ensuring accuracy, and building trust with fast, referenced responses.
                    </p>
                  </blockquote>
                </div>
                
                {/* Bottom accent */}
                <div className="mt-12 pt-8 border-t border-border flex items-center justify-center gap-2 text-muted-foreground">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-sm">Built for property professionals</span>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Plans and Credits content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits') {
      const tocSections = [{
        id: 'overview',
        label: 'Overview'
      }, {
        id: 'starter-pack',
        label: 'Starter pack'
      }, {
        id: 'feature-comparison',
        label: 'Feature comparison'
      }, {
        id: 'available-plans',
        label: 'Available Paid Plans'
      }, {
        id: 'credit-display',
        label: 'Credit display'
      }, {
        id: 'credit-rollovers',
        label: 'Credit Rollovers'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1">
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
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-foreground mb-4">Example: How HEU costs appear in chat</h3>
                      <p className="text-muted-foreground mb-4">
                        You can see the cost of each message in the chat by pressing the three dots beneath a message.
                      </p>
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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle FAQ content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'faq') {
      const tocSections = [{
        id: 'how-hobson-works',
        label: 'How Hobson works'
      }, {
        id: 'features',
        label: 'Getting the best out of Hobson'
      }, {
        id: 'plans-credits-faq',
        label: 'Hobson Credits'
      }, {
        id: 'hobson-technology',
        label: 'Hobson Technology'
      }];
      const scrollToSection = (id: string) => {
        setActiveTocSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      };
      return <div className="flex-1 bg-gradient-to-b from-background to-muted/20">
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
                  {/* Dynamic FAQ Sections from Database */}
                  {faqItems.length === 0 ? <div className="text-center py-12">
                      <p className="text-muted-foreground">Loading FAQs...</p>
                    </div> : Object.entries(faqItems.reduce((acc: any, faq: any) => {
                  if (!acc[faq.category]) acc[faq.category] = [];
                  acc[faq.category].push(faq);
                  return acc;
                }, {})).map(([category, faqs]: [string, any], catIndex) => {
                  const sectionId = category.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
                  return <section key={catIndex} id={sectionId} className="scroll-mt-8">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-foreground">{category}</h2>
                          </div>
                          <Accordion type="multiple" className="w-full space-y-4">
                            {faqs.map((faq: any) => <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                                <AccordionTrigger className="text-left py-6 text-base font-semibold hover:text-primary">
                                  <span className="flex items-center gap-3">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                                      {faq.sort_order}
                                    </span>
                                    <span>{faq.question}</span>
                                  </span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 pt-2">
                                  <div className="text-muted-foreground text-sm prose prose-sm max-w-none">
                                    <ReactMarkdown>{faq.answer}</ReactMarkdown>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>)}
                          </Accordion>
                        </section>;
                })}

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
                    {tocSections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTocSection === section.id ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:text-purple-700 hover:bg-accent/5'}`}>
                        {section.label}
                      </button>)}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Hobson Glossary specifically
    if (activeHorizontalTab === 'glossary' && activeVerticalTab === 'hobson-glossary') {
      return <div className="flex-1">
          <div className="container mx-auto p-8 max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Hobson Glossary</h1>
              <p className="text-lg text-muted-foreground">Key Terms for Using Your AI Assistant</p>
            </div>

            <div className="space-y-8">
              {glossaryItems.length === 0 ? <div className="text-center py-8">
                  <p className="text-muted-foreground">No glossary items found. Please import glossary terms from the admin panel.</p>
                </div> : <div className="grid gap-6">
                  {glossaryItems.map((item, index) => <div key={item.id} className="p-6 bg-muted/50 rounded-lg border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {item.sort_order}. {item.term}
                      </h3>
                      <p className="text-muted-foreground prose prose-sm max-w-none">
                        <ReactMarkdown>{item.definition}</ReactMarkdown>
                      </p>
                      <span className="text-xs text-muted-foreground/60 mt-2 inline-block">
                        Category: {item.category}
                      </span>
                    </div>)}
                </div>}

              <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="text-lg font-semibold text-foreground mb-3">👉 In short</h4>
                <p className="text-muted-foreground">
                  This glossary isn't about property law or finance — it's about helping your team understand the AI terms and features that make Hobson work for them.
                </p>
              </div>
            </div>
          </div>
        </div>;
    }

    // Handle Use Cases content
    if (activeHorizontalTab === 'use-cases') {
      return <UseCasesContent />;
    }
    return <div className="flex-1">
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
      </div>;
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
  return <>
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
                {horizontalTabs.map(tab => {
                const Icon = tab.icon;
                return <button key={tab.id} onClick={() => {
                  const contextualTabs = getContextualVerticalTabs(tab.id);
                  const newVerticalTab = contextualTabs[0]?.id || tab.id;
                  setActiveHorizontalTab(tab.id);
                  setActiveVerticalTab(newVerticalTab);
                  setIsGlobalPageActive(false);
                  navigate(`/learn/${tab.id === 'use-cases' ? 'use-cases' : newVerticalTab}`, {
                    replace: true
                  });
                }} className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-colors whitespace-nowrap ${activeHorizontalTab === tab.id && !isGlobalPageActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>;
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
                    {staticVerticalTabs.map(tab => {
                    const Icon = tab.icon;
                    return <button key={tab.id} onClick={() => {
                      setActiveVerticalTab(tab.id);
                      setIsGlobalPageActive(true);
                    }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeVerticalTab === tab.id && isGlobalPageActive ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>;
                  })}
                  </nav>
                </div>

                {/* Visual Separator */}
                {!isGlobalPageActive && <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <div className="bg-background px-3">
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                      </div>
                    </div>
                  </div>}

                {/* Contextual Section - Only show when not on global pages */}
                {!isGlobalPageActive && <div>
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
                       {getContextualVerticalTabs(activeHorizontalTab).map(tab => {
                    const Icon = tab.icon;
                    return <button key={tab.id} onClick={() => {
                      setActiveVerticalTab(tab.id);
                      setIsGlobalPageActive(false);
                      navigate(`/learn/${tab.id}`, {
                        replace: true
                      });
                    }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeVerticalTab === tab.id && !isGlobalPageActive ? 'bg-accent/10 text-accent-foreground border border-accent/20 shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'}`}>
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium">{tab.label}</span>
                          </button>;
                  })}
                    </nav>
                  </div>}
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
               <select value={activeHorizontalTab} onChange={e => {
              const contextualTabs = getContextualVerticalTabs(e.target.value);
              const newVerticalTab = contextualTabs[0]?.id || e.target.value;
              setActiveHorizontalTab(e.target.value);
              setActiveVerticalTab(newVerticalTab);
              setIsGlobalPageActive(false);
              navigate(`/learn/${e.target.value === 'use-cases' ? 'use-cases' : newVerticalTab}`, {
                replace: true
              });
            }} className="w-full p-2 border border-border rounded-lg bg-background text-foreground">
                {horizontalTabs.map(tab => <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>)}
              </select>
            </div>
            
            {/* Mobile Subtopic Navigation */}
            {!isGlobalPageActive && getContextualVerticalTabs(activeHorizontalTab).length > 0 && <div className="px-4 pb-3">
                 <select value={activeVerticalTab} onChange={e => {
              setActiveVerticalTab(e.target.value);
              setIsGlobalPageActive(false);
              navigate(`/learn/${e.target.value}`, {
                replace: true
              });
            }} className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm">
                  {getContextualVerticalTabs(activeHorizontalTab).map(tab => <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>)}
                </select>
              </div>}
          </div>
          
          <div className="flex-1 min-h-[calc(100vh-8rem)] p-4 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} onSuccess={handleAuthSuccess} />

      {/* Create Post Dialog */}
      <CreatePostDialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen} onPostCreated={() => {
      setIsCreatePostDialogOpen(false);
    }} />
    </>;
};
export default Learn;