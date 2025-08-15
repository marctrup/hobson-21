import { useState } from 'react';
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
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">Getting started</h2>
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
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">Building with Hobson</h2>
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
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">Features</h2>
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
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">Managing your account</h2>
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
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">Policies and Security</h2>
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
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">How Hobson works</h2>
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
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">About Hobson</h2>
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
                  <div className="bg-card rounded-lg border border-border p-4">
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

    return (
      <div className="flex-1">
        <div className="container mx-auto p-8 max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {horizontalTabs.find(tab => tab.id === activeHorizontalTab)?.label}
          </h1>
          <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
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
                <Link to="/">
                  <img 
                    src={hobsonLogo} 
                    alt="Hobson AI - AI-powered property management software company logo" 
                    className="h-12" 
                    loading="eager"
                  />
                </Link>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
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

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed left-0 top-16 bottom-0 w-80 bg-background border-r border-border p-4 overflow-y-auto">
              {/* Mobile Global Navigation */}
              <div className="mb-6">
                <div className="px-3 pb-3 mb-2 border-b border-border/50">
                  <h3 className="text-sm font-medium text-foreground tracking-wide">GLOBAL</h3>
                </div>
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
          <div className="border-b border-border bg-background/50">
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
            <aside className="w-80 border-r border-border bg-background/50 min-h-[calc(100vh-8rem)]">
              <div className="p-4 pt-[38px]">
                {/* Global Navigation Section */}
                <div className="mb-8">
                  <div className="px-3 pb-3 mb-2 border-b border-border/50">
                    <h3 className="text-sm font-medium text-foreground tracking-wide">GLOBAL</h3>
                  </div>
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
            <div className="flex-1 bg-muted/30 min-h-[calc(100vh-8rem)]">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="bg-muted/30 min-h-[calc(100vh-4rem)] p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Learn;