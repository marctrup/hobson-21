import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Book, Lightbulb, Puzzle, Wand2, Users, Library, FileText, Clock, Bell, Activity, MessageSquare, Heart, CreditCard, HelpCircle, Play, Menu, X, Plus } from 'lucide-react';
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HEUBarVisualization } from '@/components/HEUBarVisualization';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/features/AuthDialog';
import { CreatePostDialog } from '@/components/features/CreatePostDialog';
import { Button } from '@/components/ui/button';

const Learn = () => {
  const { user } = useAuth();
  const [activeHorizontalTab, setActiveHorizontalTab] = useState('introduction');
  const [activeVerticalTab, setActiveVerticalTab] = useState('welcome');
  const [isGlobalPageActive, setIsGlobalPageActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTocSection, setActiveTocSection] = useState('getting-started');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);

  // Set initial active section based on current tab
  useEffect(() => {
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'faq') {
      setActiveTocSection('getting-started');
    } else if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits') {
      setActiveTocSection('overview');
    } else if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'getting-started') {
      setActiveTocSection('hobson-platform-overview');
    } else if (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'fundamentals') {
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
        (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'fundamentals') ||
        (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'advanced-prompting') ||
        (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'debugging-prompts')) {
      
      if (activeHorizontalTab === 'introduction') {
        if (activeVerticalTab === 'faq') {
          tocSections = ['getting-started', 'building-with-hobson', 'features', 'managing-account', 'policies-security', 'how-hobson-works', 'about-hobson'];
        } else if (activeVerticalTab === 'plans-credits') {
          tocSections = ['overview', 'feature-comparison', 'available-plans', 'credit-display', 'credit-usage', 'credit-rollovers', 'faq-plans', 'troubleshooting'];
        }
      } else if (activeHorizontalTab === 'prompt-engineering') {
        if (activeVerticalTab === 'fundamentals') {
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
          { id: 'plans-credits', label: 'Plans and Credits', icon: CreditCard },
          { id: 'faq', label: 'FAQ', icon: HelpCircle },
          { id: 'getting-started', label: 'Getting started', icon: Play },
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
          { id: 'debugging-prompts', label: 'Debugging Prompts', icon: FileText },
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
    // Check if it's the feature requests page - redirect to dedicated page
    if (activeVerticalTab === 'feature-requests') {
      window.location.href = '/feature-requests';
      return null;
    }
    
    // Check if it's a global navigation item
    const isGlobalPage = staticVerticalTabs.some(tab => tab.id === activeVerticalTab && tab.id !== 'feature-requests');
    
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

    // Handle Plans and Credits content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits') {
      const tocSections = [
        { id: 'overview', label: 'Overview' },
        { id: 'feature-comparison', label: 'Feature comparison' },
        { id: 'available-plans', label: 'Available Paid Plans' },
        { id: 'credit-display', label: 'Credit display' },
        { id: 'credit-usage', label: 'Credit usage' },
        { id: 'credit-rollovers', label: 'Credit Rollovers' },
        { id: 'faq-plans', label: 'FAQ' },
        { id: 'troubleshooting', label: 'Common Issues' },
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
                          <li>• 275 HEU (Hobson Energy Unit) per month</li>
                          <li>• Unlimited Members</li>
                          <li>• Unlimited documents</li>
                          <li>• Priority Support</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Essential Plus</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• 700 HEU (Hobson Energy Unit) per month</li>
                          <li>• Unlimited Members</li>
                          <li>• Unlimited documents</li>
                          <li>• Priority Support</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Enterprise</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• Everything in Essential Plus, plus:</li>
                          <li>• 2000 HEU (Hobson Energy Unit) per month</li>
                          <li>• Unlimited Members</li>
                          <li>• Unlimited documents</li>
                          <li>• Support person</li>
                          <li>• Bespoke document training</li>
                          <li>• Bespoke integrations (call us)</li>
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
                    
                    <h3 className="text-lg font-medium text-foreground mb-4">Example prompts and their cost:</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-foreground">User Prompt</th>
                            <th className="text-left py-2 text-foreground">Work done</th>
                            <th className="text-left py-2 text-foreground">Credits used</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr><td className="py-2">Uploading a lease</td><td>Read and understand</td><td>0.50</td></tr>
                          <tr><td className="py-2">When is the next review?</td><td>Retrieve that information</td><td>0.90</td></tr>
                          <tr><td className="py-2">Compare my rent to the market.</td><td>Build a comparison</td><td>1.20</td></tr>
                          <tr><td className="py-2">Build a market appraisal report</td><td>Builds a report</td><td>2.00</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-muted-foreground mt-6">
                      You can see the cost of each message in the chat history by pressing the three dots beneath a message.
                    </p>
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

                  {/* FAQ */}
                  <section id="faq-plans">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">FAQ</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="what-is-credit">
                        <AccordionTrigger className="text-left">What is a HEU?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">A HEU is the unit of energy measurement for using Hobson's AI features. Each message or action costs a certain number of HEUs based on its complexity</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="upgrade-subscription">
                        <AccordionTrigger className="text-left">How can I upgrade my subscription?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">You can upgrade your subscription through your workspace settings or by contacting our support team.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="downgrade-subscription">
                        <AccordionTrigger className="text-left">How can I downgrade my subscription?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Subscription downgrades can be managed through your account settings or by reaching out to support.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="cancel-subscription">
                        <AccordionTrigger className="text-left">How can I cancel my subscription?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">You can cancel your subscription at any time through your account settings. Your access will continue until the end of the current billing period.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="billing-info">
                        <AccordionTrigger className="text-left">How can I change my billing information?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Billing information can be updated in your account settings under the billing section.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="download-invoices">
                        <AccordionTrigger className="text-left">How do I download my invoices?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Invoices are available for download in your account settings under billing history.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="get-more-credits">
                        <AccordionTrigger className="text-left">How do I get more credits?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">You can get more credits by upgrading your subscription plan or purchasing additional credit packages.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="credit-reset">
                        <AccordionTrigger className="text-left">When does my credit limit reset?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Your credit limit resets at the beginning of each billing cycle based on your subscription plan.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="credit-topup">
                        <AccordionTrigger className="text-left">Can I buy a top-up of credits?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Additional credit packages may be available depending on your plan. Contact support for more information.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="remaining-credits">
                        <AccordionTrigger className="text-left">How do I see the remaining credits in a workspace?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Click on your workspace name on the dashboard to view your remaining credits and usage statistics.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="free-credits">
                        <AccordionTrigger className="text-left">Can I get free credits?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Free credits are included with the free plan. Additional free credits may be available through promotional offers or referral programs.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Common Issues */}
                  <section id="troubleshooting">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Common Issues and Troubleshooting</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="payment-issues">
                        <AccordionTrigger className="text-left">I can't pay for my subscription. What should I do?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">If you're experiencing payment issues, please check your payment method details and ensure your card is valid. If the problem persists, contact our support team for assistance.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="payment-access">
                        <AccordionTrigger className="text-left">I've paid but still don't have access to my plan. What should I do?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Payment processing can sometimes take a few minutes. If you still don't have access after 10 minutes, please contact our support team with your payment confirmation details.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>
                </div>
              </div>

              {/* Table of Contents */}
              <div className="w-64 flex-shrink-0 hidden lg:block">
                <div className="sticky top-24">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">On this page</h3>
                    <div className="space-y-2">
                      {tocSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`block w-full text-left text-sm transition-colors py-2 px-3 rounded-md ${
                            activeTocSection === section.id
                              ? 'bg-purple-100 text-purple-700 font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                          }`}
                        >
                          {section.label}
                        </button>
                      ))}
                    </div>
                  </div>
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
        { id: 'getting-started', label: 'Getting started' },
        { id: 'building-with-hobson', label: 'Building with Hobson' },
        { id: 'features', label: 'Features' },
        { id: 'managing-account', label: 'Managing your account' },
        { id: 'policies-security', label: 'Policies and Security' },
        { id: 'how-hobson-works', label: 'How Hobson works' },
        { id: 'about-hobson', label: 'About Hobson' },
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
                  <h1 className="text-3xl font-bold text-foreground mb-2">FAQ</h1>
                  <p className="text-lg text-muted-foreground">Frequently asked questions about Hobson</p>
                </div>

                <div className="space-y-12">
                  {/* Getting started */}
                  <section id="getting-started">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Getting started</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="what-is-hobson">
                        <AccordionTrigger className="text-left">What is Hobson?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson is an AI-powered document analysis platform that helps property management companies extract insights from contracts and documents.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="what-can-build">
                        <AccordionTrigger className="text-left">What can I build with Hobson?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson enables automated document processing, lease analysis, compliance monitoring, and property management workflows.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="coding-experience">
                        <AccordionTrigger className="text-left">Do I need coding experience to build with Hobson?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">No, Hobson is designed to be user-friendly for property managers without technical expertise.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="create-project">
                        <AccordionTrigger className="text-left">How do I create a project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Start by uploading your documents through our secure platform and configuring your analysis preferences.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="start-templates">
                        <AccordionTrigger className="text-left">Can I start from templates?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson provides pre-built templates for common property management scenarios like lease analysis and compliance checks.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Building with Hobson */}
                  <section id="building-with-hobson">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Building with Hobson</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="build-efficiently">
                        <AccordionTrigger className="text-left">How do I build efficiently with Hobson?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Use clear document naming conventions, organize files systematically, and leverage automation features for repetitive tasks.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="structure-prompts">
                        <AccordionTrigger className="text-left">How should I structure my prompts for the best results?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Be specific about what information you need extracted and provide context about document types and expected outcomes.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="hit-error">
                        <AccordionTrigger className="text-left">What should I do when I hit an error?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Check document format compatibility, verify upload requirements, and contact support if issues persist.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="refactoring">
                        <AccordionTrigger className="text-left">What is refactoring, and why is it important?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Refactoring optimizes your document processing workflows for better accuracy and efficiency over time.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="backend-connection">
                        <AccordionTrigger className="text-left">Can I connect my project to a backend to store data?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson integrates with popular property management systems and databases through secure API connections.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="add-login">
                        <AccordionTrigger className="text-left">Can I add login to my website?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson includes enterprise-grade authentication and user management features.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="third-party-apis">
                        <AccordionTrigger className="text-left">Can I add third-party APIs to my project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson supports integration with various property management tools and external APIs.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="store-api-keys">
                        <AccordionTrigger className="text-left">Can I store sensitive API keys in Hobson?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, all API keys and sensitive data are encrypted and stored securely according to industry standards.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="add-payments">
                        <AccordionTrigger className="text-left">How do I add payments to my website?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson integrates with payment processors commonly used in property management for rent collection and fees.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="improve-seo">
                        <AccordionTrigger className="text-left">How can I improve SEO for my project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Focus on structured data markup for property listings and ensure fast loading times for document access.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="project-completion-time">
                        <AccordionTrigger className="text-left">How long does it take to complete a project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Implementation typically takes 2-4 weeks depending on document volume and integration requirements.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Features */}
                  <section id="features">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Features</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="project-settings">
                        <AccordionTrigger className="text-left">How do I find the Project settings?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Navigate to your dashboard and click on the project settings icon in the top navigation bar.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="project-visibility">
                        <AccordionTrigger className="text-left">Can I change the visibility of my project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, you can set projects as private, shared with team members, or public within your organization.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="hide-badge">
                        <AccordionTrigger className="text-left">Can I hide the Hobson badge?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Enterprise plans include white-label options to customize or remove branding elements.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="rename-project">
                        <AccordionTrigger className="text-left">Can I rename a project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, project names can be updated at any time from the project settings menu.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="copy-project">
                        <AccordionTrigger className="text-left">Can I make a copy of a project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, you can duplicate projects to create templates or test different configurations.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="delete-project">
                        <AccordionTrigger className="text-left">Can I delete a project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, projects can be deleted from the settings menu. This action is permanent and cannot be undone.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="what-is-remix">
                        <AccordionTrigger className="text-left">What is a remix?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">A remix creates a new project based on an existing one, allowing you to modify workflows without affecting the original.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="chat-mode">
                        <AccordionTrigger className="text-left">What is Chat mode?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Chat mode allows you to interact with your documents using natural language queries to extract specific information.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="see-edit-code">
                        <AccordionTrigger className="text-left">Can I see the code that Hobson generates and manually edit it?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Advanced users can access the underlying processing logic and customize extraction rules through the developer interface.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="edit-text-colors">
                        <AccordionTrigger className="text-left">Can I manually edit text or colors?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, the interface supports customization of themes, colors, and text elements to match your brand.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="collaborate">
                        <AccordionTrigger className="text-left">Can I collaborate on my projects?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson supports team collaboration with role-based permissions and shared workspaces.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="publish-project">
                        <AccordionTrigger className="text-left">How do I publish my project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Deploy your configured workflows to production through the deployment dashboard with one-click publishing.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="custom-domain">
                        <AccordionTrigger className="text-left">How do I add a custom domain to my project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Custom domains can be configured in the project settings under the "Domains" section for enterprise customers.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="analytics">
                        <AccordionTrigger className="text-left">Can I see analytics for my published projects?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, comprehensive analytics show document processing volumes, accuracy metrics, and user engagement.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="add-images">
                        <AccordionTrigger className="text-left">Can I add images to a Hobson prompt?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson supports image uploads and can extract text and data from visual documents and diagrams.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="add-videos">
                        <AccordionTrigger className="text-left">Can I add videos to a Hobson prompt?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Currently, Hobson focuses on document and image processing. Video support is planned for future releases.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="import-figma">
                        <AccordionTrigger className="text-left">Can I import designs from Figma?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Interface mockups can be imported to customize the look and feel of your document processing workflows.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="export-code">
                        <AccordionTrigger className="text-left">Can I export all of my project's code?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, all configurations and custom logic can be exported for backup or migration purposes.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="import-code">
                        <AccordionTrigger className="text-left">Can I start a project by importing code from an external source such as GitHub?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, existing automation scripts and workflows can be imported through our API or GitHub integration.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="project-history">
                        <AccordionTrigger className="text-left">How do I see my project history?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Project history and version control are available in the project settings under "History" tab.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="restore-version">
                        <AccordionTrigger className="text-left">Can I restore an earlier version of my project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, you can roll back to any previous version through the project history interface.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Managing your account */}
                  <section id="managing-account">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Managing your account</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="change-email">
                        <AccordionTrigger className="text-left">Can I change the email I use to login?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, email addresses can be updated in your account settings under "Profile" section.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="delete-account">
                        <AccordionTrigger className="text-left">Can I delete my account?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Account deletion can be requested through the account settings. All data will be permanently removed.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="change-workspace-owner">
                        <AccordionTrigger className="text-left">Can I change the workspace owner?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Workspace ownership can be transferred to another team member through the admin panel.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="transfer-project-ownership">
                        <AccordionTrigger className="text-left">How can I transfer project ownership to someone else?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Project ownership transfer is available in project settings under "Transfer Ownership" for team accounts.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Policies and Security */}
                  <section id="policies-security">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Policies and Security</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="get-support">
                        <AccordionTrigger className="text-left">How can I get support?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Contact our support team through the help center, email support, or schedule a consultation call.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="privacy-policy">
                        <AccordionTrigger className="text-left">Where can I find Hobson's privacy policy?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Our privacy policy is available at the bottom of our website and in your account dashboard.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="terms-of-service">
                        <AccordionTrigger className="text-left">Where can I find Hobson's Terms of Service?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Terms of Service are accessible through the footer links and account settings.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="refund-policy">
                        <AccordionTrigger className="text-left">What is Hobson's refund policy?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">We offer a 30-day money-back guarantee for new subscriptions. Contact support for refund requests.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="security-compliance">
                        <AccordionTrigger className="text-left">Is Hobson compliant with security standards?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson is SOC 2 compliant and follows industry-standard security practices for data protection.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="gdpr-compliance">
                        <AccordionTrigger className="text-left">Is Hobson GDPR compliant?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson is fully GDPR compliant with data processing agreements and privacy controls available.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* How Hobson works */}
                  <section id="how-hobson-works">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">How Hobson works</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="tech-stacks">
                        <AccordionTrigger className="text-left">What tech stacks does Hobson know?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson integrates with major property management platforms, CRMs, and accounting systems commonly used in real estate.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="mobile-support">
                        <AccordionTrigger className="text-left">Does Hobson support mobile app development?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Mobile access is available through responsive web interfaces, with native apps planned for future releases.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="remember-context">
                        <AccordionTrigger className="text-left">How does Hobson remember context?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson uses machine learning to understand document patterns and maintain context across related documents and projects.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="project-ownership">
                        <AccordionTrigger className="text-left">Who owns the projects and the code that Hobson creates?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">You retain full ownership of your data, documents, and any custom configurations created within Hobson.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* About Hobson */}
                  <section id="about-hobson">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">About Hobson</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="where-based">
                        <AccordionTrigger className="text-left">Where is Hobson based?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson is headquartered in [Location] with team members distributed globally to provide 24/7 support.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="hiring">
                        <AccordionTrigger className="text-left">Is Hobson hiring?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">We're always looking for talented individuals. Check our careers page for current openings in engineering, sales, and customer success.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>
                </div>
              </div>

              {/* Table of Contents - Right Sidebar */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-8">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide">ON THIS PAGE</h3>
                    <nav className="space-y-2">
                      {tocSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`block w-full text-left text-sm transition-colors py-2 px-3 rounded-md ${
                            activeTocSection === section.id
                              ? 'bg-purple-100 text-purple-700 border-l-2 border-purple-500 font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
        </div>
      );
    }

    // Handle Welcome content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'welcome') {
      return (
        <div className="flex-1">
          <div className="container mx-auto p-8 max-w-6xl mt-[10px]">
            {/* Large Video Screen with aligned header */}
            <div className="mb-12">
              <div className="w-full max-w-[70.4rem] mx-auto">
                {/* Welcome header aligned with video left edge */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
                  <p className="text-lg text-muted-foreground">Learn about Hobson and how to get started</p>
                </div>
                
                {/* Video container */}
                <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-border">
                <img 
                  src="/lovable-uploads/22288036-7492-4957-944b-c3c0aad87c98.png"
                  alt="Welcome to Hobson AI - Video placeholder"
                  className="w-full h-full object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-black/70 hover:bg-black/80 text-white rounded-full p-4 transition-colors">
                    <Play className="w-12 h-12 ml-1" fill="currentColor" />
                  </button>
                </div>
                {/* Video title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">Getting Started with Hobson AI</h3>
                  <p className="text-white/90 text-sm">Learn how to transform your property management with AI-powered document analysis</p>
                </div>
                </div>
                
                {/* Description text aligned with video */}
                <div className="mt-6">
                  <p className="text-lg text-muted-foreground">Hobson is an AI-powered assistant that reads and understands property documents to deliver accurate, cited answers instantly.</p>
                </div>
              </div>
            </div>


          </div>
        </div>
      );
    }

    // Handle Getting Started content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'getting-started') {
      const tocSections = [
        { id: 'hobson-platform-overview', label: 'The Hobson platform overview' },
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
                  <h1 className="text-3xl font-bold text-foreground mb-2">Getting Started</h1>
                  <p className="text-lg text-muted-foreground">From first document to confident decision</p>
                </div>

                {/* Overview Video Section */}
                <div className="mb-12">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Overview of Hobson</h2>
                  <p className="text-muted-foreground mb-6">Welcome to this step-by-step guide on how to get accurate, up-to-date answers from your property documents using Hobson.</p>
                  
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-border mb-8">
                    <img 
                      src="/lovable-uploads/22288036-7492-4957-944b-c3c0aad87c98.png"
                      alt="Overview of Hobson - Video placeholder"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="bg-black/70 hover:bg-black/80 text-white rounded-full p-4 transition-colors">
                        <Play className="w-12 h-12 ml-1" fill="currentColor" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-white text-xl font-semibold mb-2">Overview of Hobson</h3>
                      <p className="text-white/90 text-sm">Step-by-step guide to getting started with Hobson AI</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  {/* The Hobson platform overview */}
                  <section id="hobson-platform-overview">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-foreground">The Hobson platform overview</h2>
                    </div>
                    
                    {/* Learning Objectives Framework - Template for all sections */}
                    <div className="space-y-6">
                      
                      {/* Learning Objective Template 1 */}
                      <div>
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="dashboard-navigation">
                            <AccordionTrigger className="text-left hover:no-underline [&[data-state=open]>div>span:first-child]:rotate-90 [&>svg]:hidden">
                              <div className="flex items-center gap-3">
                                <span className="transition-transform duration-200 text-foreground">▶</span>
                                <span className="text-lg font-semibold text-foreground">Navigate the Hobson dashboard</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-6 space-y-4">
                                <p className="text-muted-foreground">Learn how to efficiently navigate through the Hobson dashboard to access all your property management tools and insights.</p>
                                
                                {/* Video Teaching Element */}
                                <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-border">
                                  <img 
                                    src="/lovable-uploads/22288036-7492-4957-944b-c3c0aad87c98.png"
                                    alt="Dashboard Navigation Tutorial"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="bg-black/70 hover:bg-black/80 text-white rounded-full p-3 transition-colors">
                                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                                    </button>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h4 className="text-white font-medium">Dashboard Navigation</h4>
                                    <p className="text-white/90 text-sm">3:24 minutes</p>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      {/* Learning Objective Template 2 */}
                      <div>
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="upload-documents">
                            <AccordionTrigger className="text-left hover:no-underline [&[data-state=open]>div>span:first-child]:rotate-90 [&>svg]:hidden">
                              <div className="flex items-center gap-3">
                                <span className="transition-transform duration-200 text-foreground">▶</span>
                                <span className="text-lg font-semibold text-foreground">Upload and organize documents</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-6 space-y-4">
                                <p className="text-muted-foreground">Master the document upload process and learn organizational best practices for your property files.</p>
                                
                                {/* Text Teaching Element */}
                                <div className="bg-muted/20 p-6 rounded-lg border border-border">
                                  <h4 className="font-semibold text-foreground mb-3">Step-by-step guide:</h4>
                                  <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="flex gap-3">
                                      <span className="font-medium text-foreground">1.</span>
                                      <span>Click the "Upload Documents" button in your dashboard</span>
                                    </div>
                                    <div className="flex gap-3">
                                      <span className="font-medium text-foreground">2.</span>
                                      <span>Drag and drop files or browse to select documents</span>
                                    </div>
                                    <div className="flex gap-3">
                                      <span className="font-medium text-foreground">3.</span>
                                      <span>Add relevant tags and categories for easy organization</span>
                                    </div>
                                    <div className="flex gap-3">
                                      <span className="font-medium text-foreground">4.</span>
                                      <span>Verify document details and confirm upload</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      {/* Learning Objective Template 3 */}
                      <div>
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="ai-analysis">
                            <AccordionTrigger className="text-left hover:no-underline [&[data-state=open]>div>span:first-child]:rotate-90 [&>svg]:hidden">
                              <div className="flex items-center gap-3">
                                <span className="transition-transform duration-200 text-foreground">▶</span>
                                <span className="text-lg font-semibold text-foreground">Understand AI analysis results</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-6 space-y-4">
                                <p className="text-muted-foreground">Learn how to interpret and act on the AI-generated insights from your property documents.</p>
                                
                                {/* Mixed Teaching Elements - Video + Callout */}
                                <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-border mb-4">
                                  <img 
                                    src="/lovable-uploads/22288036-7492-4957-944b-c3c0aad87c98.png"
                                    alt="AI Analysis Results Tutorial"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="bg-black/70 hover:bg-black/80 text-white rounded-full p-3 transition-colors">
                                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                                    </button>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h4 className="text-white font-medium">Understanding AI Results</h4>
                                    <p className="text-white/90 text-sm">5:12 minutes</p>
                                  </div>
                                </div>
                                
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="bg-amber-100 rounded-full p-1">
                                      <Lightbulb className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-amber-800 mb-2">Pro Tip</h4>
                                      <p className="text-amber-700 text-sm">Always review AI suggestions with your domain expertise. The AI provides insights, but your property management knowledge is crucial for final decisions.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      {/* 
                      TEMPLATE FOR ADDITIONAL LEARNING OBJECTIVES:
                      
                      <div>
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="unique-value-here">
                            <AccordionTrigger className="text-left hover:no-underline">
                              <div className="flex items-center gap-3">
                                <span className="text-foreground">→</span>
                                <span className="text-lg font-semibold text-foreground">Your Learning Objective Title</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-6 space-y-4">
                                <p className="text-muted-foreground">Learning objective description goes here.</p>
                                
                                // Add your teaching elements here:
                                // - Video tutorials
                                // - Step-by-step guides  
                                // - Pro tip callouts
                                // - Interactive elements
                                
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      */}
                      
                    </div>
                  </section>

                </div>
              </div>

              {/* Table of Contents */}
              <div className="w-64 flex-shrink-0 hidden lg:block">
                <div className="sticky top-24">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">On this page</h3>
                    <div className="space-y-2">
                      {tocSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`flex items-center gap-2 w-full text-left text-sm transition-colors py-2 px-3 rounded-md ${
                            activeTocSection === section.id
                              ? 'bg-purple-100 text-purple-700 font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                          }`}
                        >
                          {section.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle Prompt Engineering - Fundamentals content specifically
    if (activeHorizontalTab === 'prompt-engineering' && activeVerticalTab === 'fundamentals') {
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
                  <h1 className="text-3xl font-bold text-foreground mb-2">Prompting</h1>
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
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
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
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
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
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">Prompt</h3>
                  <p className="text-muted-foreground">A question or instruction you give to Hobson. Clearer prompts = more useful answers.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Prompt Library</h3>
                  <p className="text-muted-foreground">A set of example prompts you can copy or adapt for common tasks (e.g. summarising leases, creating rent reports, preparing lender packs).</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Debugging</h3>
                  <p className="text-muted-foreground">Fixing or refining a prompt when Hobson's answer isn't right. This might mean rephrasing the question, narrowing the focus, or asking Hobson to explain its reasoning.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Meta Prompting</h3>
                  <p className="text-muted-foreground mb-3">Asking Hobson how to improve your question for a clearer answer.</p>
                  <div className="p-3 bg-background rounded border border-border text-sm">
                    <strong>Example:</strong> "How should I phrase this to get a better summary of this lease?"
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Reverse Prompting</h3>
                  <p className="text-muted-foreground">Asking Hobson to explain how it arrived at an answer, so you can check the logic.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Context</h3>
                  <p className="text-muted-foreground">The background information Hobson needs to give accurate answers. If you don't provide enough, the response may be vague.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Report</h3>
                  <p className="text-muted-foreground">A structured output created by Hobson — for example, a portfolio summary, cashflow projection, or lender briefing.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Knowledge Base</h3>
                  <p className="text-muted-foreground">A space where your business can add important background information (e.g. standard reporting formats, preferred output styles) that Hobson uses to stay consistent.</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Session</h3>
                  <p className="text-muted-foreground">A continuous conversation with Hobson. Within a session, Hobson remembers your earlier questions and answers.</p>
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

    return (
      <div className="flex-1">
        <div className="container mx-auto p-8 max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label}
          </h1>
          <div className="p-8">
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
      
      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-border">
          <div className="px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="absolute top-4 left-4">
                <Link to="/" className="flex items-center">
                  <img 
                    src={hobsonLogo} 
                    alt="Hobson AI - AI-powered property management software company logo" 
                    className="h-12 md:h-16" 
                    loading="eager"
                  />
                </Link>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 ml-auto"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
               <nav className="hidden md:flex items-center gap-6 ml-auto">
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

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed left-0 top-16 bottom-0 w-80 bg-background border-r border-border p-4 overflow-y-auto">
              {/* Mobile Global Navigation */}
              <div className="mb-6">
                <nav className="space-y-1">
                  {staticVerticalTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveVerticalTab(tab.id);
                          setIsGlobalPageActive(true);
                          setIsMobileMenuOpen(false);
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

              {/* Mobile Topics Navigation */}
              <div className="mb-6">
                <div className="px-3 pb-3 mb-2 border-b border-border/50">
                  <h3 className="text-sm font-medium text-foreground tracking-wide">TOPICS</h3>
                </div>
                <nav className="space-y-1">
                  {horizontalTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveHorizontalTab(tab.id);
                          setActiveVerticalTab(getContextualVerticalTabs(tab.id)[0]?.id || 'overview');
                          setIsGlobalPageActive(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeHorizontalTab === tab.id && !isGlobalPageActive
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

              {/* Mobile Submenu */}
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
                            setIsMobileMenuOpen(false);
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
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col">
          {/* Horizontal Topics Navigation */}
          <div className="mt-8">
            <div className="px-6">
              <nav className="flex space-x-8 overflow-x-auto">
                {horizontalTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveHorizontalTab(tab.id);
                        setActiveVerticalTab(getContextualVerticalTabs(tab.id)[0]?.id || 'overview');
                        setIsGlobalPageActive(false);
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
          <div className="flex-1 min-h-[calc(100vh-8rem)] p-8">
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