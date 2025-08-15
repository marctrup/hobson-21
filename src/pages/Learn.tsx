import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Book, Lightbulb, Puzzle, Wand2, Users, Library, FileText, Clock, Bell, Activity, MessageSquare, Heart, CreditCard, HelpCircle, Play, Menu, X } from 'lucide-react';
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Learn = () => {
  const [activeHorizontalTab, setActiveHorizontalTab] = useState('introduction');
  const [activeVerticalTab, setActiveVerticalTab] = useState('welcome');
  const [isGlobalPageActive, setIsGlobalPageActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTocSection, setActiveTocSection] = useState('getting-started');

  // Set initial active section based on current tab
  useEffect(() => {
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'faq') {
      setActiveTocSection('getting-started');
    } else if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits') {
      setActiveTocSection('overview');
    }
  }, [activeHorizontalTab, activeVerticalTab]);

  // Scroll spy effect - moved to top level to avoid hook order issues
  useEffect(() => {
    // Only run scroll spy for pages that have table of contents
    if ((activeHorizontalTab === 'introduction' && activeVerticalTab === 'faq') || 
        (activeHorizontalTab === 'introduction' && activeVerticalTab === 'plans-credits')) {
      
      let tocSections: string[] = [];
      
      if (activeVerticalTab === 'faq') {
        tocSections = ['getting-started', 'building-with-hobson', 'features', 'managing-account', 'policies-security', 'how-hobson-works', 'about-hobson'];
      } else if (activeVerticalTab === 'plans-credits') {
        tocSections = ['overview', 'feature-comparison', 'available-plans', 'credit-display', 'credit-usage', 'credit-rollovers', 'faq-plans', 'troubleshooting'];
      }

      const handleScroll = () => {
        const scrollPosition = window.scrollY + 100; // offset for header

        for (let i = tocSections.length - 1; i >= 0; i--) {
          const element = document.getElementById(tocSections[i]);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveTocSection(tocSections[i]);
            break;
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Set initial active section

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [activeHorizontalTab, activeVerticalTab]);

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
    // Check if it's a global navigation item
    const isGlobalPage = staticVerticalTabs.some(tab => tab.id === activeVerticalTab);
    
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
                        Lovable is a subscription based service with a free plan and several paid plans. When you pay for a subscription you get access to more features, and more credits. You need credits to send messages in Lovable.
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
                          <li>• 5 daily credits up to a maximum of 30 per month</li>
                          <li>• Workspace collaboration with unlimited members</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Pro plan</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• 5 daily credits up to a maximum of 150 per month</li>
                          <li>• Monthly credits depending on your plan</li>
                          <li>• Workspace collaboration with unlimited members</li>
                          <li>• Workspace roles and permissions</li>
                          <li>• Private projects</li>
                          <li>• Ability to connect custom domains to your Lovable projects</li>
                          <li>• Ability to remove the "Edit with Lovable" badge from your Lovable projects</li>
                          <li>• Access to Code mode to edit code directly inside of Lovable</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Business plan</h3>
                        <ul className="text-muted-foreground space-y-2">
                          <li>• Everything in Pro, plus:</li>
                          <li>• SSO</li>
                          <li>• Personal projects within workspaces</li>
                          <li>• Opt out of data training</li>
                          <li>• Build reusable design templates to streamline your projects</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Available Plans */}
                  <section id="available-plans">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Available Paid Plans</h2>
                    <p className="text-muted-foreground mb-6">
                      Each paid plan includes a set number of allocated monthly credits. We offer both Pro and Business plans, each with different pricing options and unique perks to suit individual users or teams. You can choose to pay for these plans either monthly or annually. Annual billing offers additional benefits such as a discounted monthly rate and higher rollover limits for unused credits.
                    </p>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-4">Pro</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-2 text-foreground">Monthly credits</th>
                                <th className="text-left py-2 text-foreground">Monthly billing</th>
                                <th className="text-left py-2 text-foreground">Annual billing</th>
                              </tr>
                            </thead>
                            <tbody className="text-muted-foreground">
                              <tr><td className="py-2">100</td><td>$25</td><td>$250 ($21/month)</td></tr>
                              <tr><td className="py-2">200</td><td>$50</td><td>$500 ($42/month)</td></tr>
                              <tr><td className="py-2">400</td><td>$100</td><td>$1,000 ($84/month)</td></tr>
                              <tr><td className="py-2">800</td><td>$200</td><td>$2,000 ($167/month)</td></tr>
                              <tr><td className="py-2">1,200</td><td>$294</td><td>$2,940 ($245/month)</td></tr>
                              <tr><td className="py-2">2,000</td><td>$480</td><td>$4,800 ($400/month)</td></tr>
                              <tr><td className="py-2">3,000</td><td>$705</td><td>$7,050 ($588/month)</td></tr>
                              <tr><td className="py-2">4,000</td><td>$920</td><td>$9,200 ($767/month)</td></tr>
                              <tr><td className="py-2">5,000</td><td>$1,125</td><td>$11,250 ($938/month)</td></tr>
                              <tr><td className="py-2">7,500</td><td>$1,688</td><td>$16,880 ($1,407/month)</td></tr>
                              <tr><td className="py-2">10,000</td><td>$2,250</td><td>$22,500 ($1,875/month)</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-4">Business</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-2 text-foreground">Monthly credits</th>
                                <th className="text-left py-2 text-foreground">Monthly billing</th>
                                <th className="text-left py-2 text-foreground">Annual billing</th>
                              </tr>
                            </thead>
                            <tbody className="text-muted-foreground">
                              <tr><td className="py-2">100</td><td>$50</td><td>$500 ($42/month)</td></tr>
                              <tr><td className="py-2">200</td><td>$100</td><td>$1,000 ($84/month)</td></tr>
                              <tr><td className="py-2">400</td><td>$200</td><td>$2,000 ($167/month)</td></tr>
                              <tr><td className="py-2">800</td><td>$400</td><td>$4,000 ($334/month)</td></tr>
                              <tr><td className="py-2">1,200</td><td>$588</td><td>$5,880 ($490/month)</td></tr>
                              <tr><td className="py-2">2,000</td><td>$960</td><td>$9,600 ($800/month)</td></tr>
                              <tr><td className="py-2">3,000</td><td>$1,410</td><td>$14,100 ($1,175/month)</td></tr>
                              <tr><td className="py-2">4,000</td><td>$1,840</td><td>$18,400 ($1,534/month)</td></tr>
                              <tr><td className="py-2">5,000</td><td>$2,250</td><td>$22,500 ($1,875/month)</td></tr>
                              <tr><td className="py-2">7,500</td><td>$3,300</td><td>$33,000 ($2,750/month)</td></tr>
                              <tr><td className="py-2">10,000</td><td>$4,300</td><td>$43,000 ($3,584/month)</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mt-6">
                      When you upgrade your plan, for example, from a 100 credit plan to a 200 credit plan you don't get 200 new credits. Instead, your total credits for the month are updated to 200. So if you already had 100 monthly credits upgrading gives you 100 more, not 200 more.
                    </p>
                  </section>

                  {/* Credit Display */}
                  <section id="credit-display">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Credit display</h2>
                    <p className="text-muted-foreground mb-4">
                      Your credit balance is displayed prominently in the Lovable interface. This shows your total available credits across all sources - daily allowance, monthly subscription credits, and any rolled-over credits from previous months.
                    </p>
                    <p className="text-muted-foreground">
                      Credits are consumed when you send messages to the AI. Different types of interactions may consume different amounts of credits based on complexity and resource usage.
                    </p>
                  </section>

                  {/* Credit Usage */}
                  <section id="credit-usage">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Credit usage</h2>
                    <p className="text-muted-foreground mb-4">
                      Credits are primarily used when you send messages or prompts to the AI. The number of credits consumed per message depends on various factors including message complexity, file attachments, and the type of AI operation being performed.
                    </p>
                    <p className="text-muted-foreground">
                      You can track your credit usage in your account dashboard to monitor consumption patterns and plan accordingly.
                    </p>
                  </section>

                  {/* Credit Rollovers */}
                  <section id="credit-rollovers">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Credit Rollovers</h2>
                    <p className="text-muted-foreground mb-4">
                      Unused monthly credits from your subscription can roll over to the next month, subject to certain limits. The rollover limit depends on your plan type and billing frequency:
                    </p>
                    <ul className="text-muted-foreground space-y-2 mb-4">
                      <li>• Monthly billing: Lower rollover limits</li>
                      <li>• Annual billing: Higher rollover limits as a benefit</li>
                    </ul>
                    <p className="text-muted-foreground">
                      Credits that exceed the rollover limit will expire at the end of each billing period, so it's best to use them regularly.
                    </p>
                  </section>

                  {/* FAQ */}
                  <section id="faq-plans">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">FAQ</h2>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Can I change my plan at any time?</h4>
                        <p className="text-muted-foreground text-sm">Yes, you can upgrade or downgrade your plan at any time through your account settings.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">What happens to unused credits when I change plans?</h4>
                        <p className="text-muted-foreground text-sm">Your existing credits will be preserved when you change plans, and any new credits from your updated plan will be added.</p>
                      </div>
                    </div>
                  </section>

                  {/* Troubleshooting */}
                  <section id="troubleshooting">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Common Issues</h2>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">My credits aren't updating after payment</h4>
                        <p className="text-muted-foreground text-sm">Credit updates typically happen within a few minutes of successful payment. If you don't see your credits after 10 minutes, please contact support.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">I'm not receiving my daily credits</h4>
                        <p className="text-muted-foreground text-sm">Daily credits reset at midnight UTC. Make sure you haven't reached your monthly maximum for daily credits based on your plan.</p>
                      </div>
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
        { id: 'getting-started', label: 'Getting Started' },
        { id: 'building-with-hobson', label: 'Building with Hobson' },
        { id: 'features', label: 'Features' },
        { id: 'managing-account', label: 'Managing my account' },
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
                  <h1 className="text-3xl font-bold text-foreground mb-2">Frequently Asked Questions</h1>
                  <p className="text-lg text-muted-foreground">Common questions and answers about using Hobson</p>
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
                        <AccordionTrigger className="text-left">Can I connect third-party APIs to my project?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson supports integration with various third-party APIs for enhanced functionality and data exchange.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Features */}
                  <section id="features">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Features</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="ai-capabilities">
                        <AccordionTrigger className="text-left">What AI capabilities does Hobson offer?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson offers document parsing, contract analysis, automated data extraction, and intelligent insights generation.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="supported-formats">
                        <AccordionTrigger className="text-left">What document formats are supported?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson supports PDF, Word documents, images, and various other common document formats used in property management.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="collaboration">
                        <AccordionTrigger className="text-left">Can multiple team members collaborate on projects?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson includes team collaboration features with role-based access controls and shared project workspaces.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Managing Account */}
                  <section id="managing-account">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Managing my account</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="account-settings">
                        <AccordionTrigger className="text-left">How do I update my account settings?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Access your account settings through the profile menu to update personal information, preferences, and billing details.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="billing">
                        <AccordionTrigger className="text-left">How does billing work?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson offers flexible billing options including monthly and annual subscriptions with different usage tiers.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="data-export">
                        <AccordionTrigger className="text-left">Can I export my data?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, you can export your analyzed documents and extracted data in various formats for backup or migration purposes.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* Policies and Security */}
                  <section id="policies-security">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">Policies and Security</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="data-security">
                        <AccordionTrigger className="text-left">How is my data protected?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson employs enterprise-grade security measures including encryption, secure data centers, and compliance with industry standards.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="privacy-policy">
                        <AccordionTrigger className="text-left">Where can I find the privacy policy?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Our privacy policy is available in the footer of our website and outlines how we collect, use, and protect your information.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="compliance">
                        <AccordionTrigger className="text-left">Is Hobson compliant with regulations?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes, Hobson is designed to comply with relevant data protection and industry regulations including GDPR and SOC 2.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* How Hobson Works */}
                  <section id="how-hobson-works">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">How Hobson works</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="ai-technology">
                        <AccordionTrigger className="text-left">What AI technology powers Hobson?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson uses advanced natural language processing and machine learning models specifically trained for property management documents.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="processing-time">
                        <AccordionTrigger className="text-left">How long does document processing take?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Processing time varies by document size and complexity, but most documents are analyzed within minutes.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="accuracy">
                        <AccordionTrigger className="text-left">How accurate is the AI analysis?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Hobson achieves high accuracy rates through continuous model training and can be fine-tuned for specific document types and requirements.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </section>

                  {/* About Hobson */}
                  <section id="about-hobson">
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2">About Hobson</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="company-mission">
                        <AccordionTrigger className="text-left">What is Hobson's mission?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Our mission is to streamline property management through intelligent document analysis and automation, helping companies make better decisions faster.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="get-support">
                        <AccordionTrigger className="text-left">How can I get support?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Support is available through our help center, email support, and for enterprise customers, dedicated account management.</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="feature-requests">
                        <AccordionTrigger className="text-left">Can I request new features?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground text-sm">Yes! We welcome feature requests through our feedback portal and regularly incorporate user suggestions into our product roadmap.</p>
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

    // Handle Getting Started content specifically
    if (activeHorizontalTab === 'introduction' && activeVerticalTab === 'getting-started') {
      const tocSections = [
        { id: 'hobson-platform-overview', label: 'The Hobson platform overview' },
        { id: 'working-with-prompts', label: 'Working with Prompts' },
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
                    </div>
                  </section>

                  {/* Working with Prompts */}
                  <section id="working-with-prompts">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-foreground">Working with Prompts</h2>
                      <p className="text-lg text-muted-foreground mt-2">Master the art of crafting effective prompts to get the best results from Hobson AI</p>
                    </div>
                    
                    {/* Learning Objectives Framework - Template for all sections */}
                    <div className="space-y-6">
                      
                      {/* Learning Objective Template 1 */}
                      <div>
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="prompt-basics">
                            <AccordionTrigger className="text-left hover:no-underline [&[data-state=open]>div>span:first-child]:rotate-90 [&>svg]:hidden">
                              <div className="flex items-center gap-3">
                                <span className="transition-transform duration-200 text-foreground">▶</span>
                                <span className="text-lg font-semibold text-foreground">Prompt</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-6 space-y-4">
                                <p className="text-muted-foreground">Learn how to write effective prompts that get accurate results from your document analysis.</p>
                                
                                {/* Placeholder for teaching content */}
                                <div className="bg-muted/20 p-4 rounded-lg border border-border">
                                  <p className="text-muted-foreground text-sm italic">Teaching content will go here</p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
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
        <meta name="keywords" content="AI documentation, property management AI, document analysis, learn Hobson" />
        <meta property="og:title" content="Learn - Hobson's Choice AI" />
        <meta property="og:description" content="Master Hobson's Choice AI with our step-by-step guides and comprehensive documentation." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/learn" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="lg:hidden bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src={hobsonLogo} 
                alt="Hobson's Choice AI" 
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-80 bg-muted/30 border-r border-border flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src={hobsonLogo} 
                  alt="Hobson's Choice AI" 
                  className="h-8 w-auto"
                />
                <span className="font-semibold text-foreground">Learn</span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto">
              {/* Horizontal Tabs */}
              <div className="p-4">
                <div className="space-y-1">
                  {horizontalTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveHorizontalTab(tab.id);
                        setActiveVerticalTab('welcome');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        activeHorizontalTab === tab.id
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border mx-4 my-2"></div>

              {/* Vertical Tabs */}
              <div className="p-4">
                <div className="space-y-1">
                  {currentVerticalTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveVerticalTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        activeVerticalTab === tab.id
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="fixed top-0 left-0 w-80 h-full bg-background border-r border-border overflow-auto">
                <div className="p-6 border-b border-border">
                  <Link to="/" className="flex items-center gap-3">
                    <img 
                      src={hobsonLogo} 
                      alt="Hobson's Choice AI" 
                      className="h-8 w-auto"
                    />
                    <span className="font-semibold text-foreground">Learn</span>
                  </Link>
                </div>

                <div className="p-4">
                  <div className="space-y-1">
                    {horizontalTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveHorizontalTab(tab.id);
                          setActiveVerticalTab('welcome');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          activeHorizontalTab === tab.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border mx-4 my-2"></div>

                <div className="p-4">
                  <div className="space-y-1">
                    {currentVerticalTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveVerticalTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          activeVerticalTab === tab.id
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Learn;