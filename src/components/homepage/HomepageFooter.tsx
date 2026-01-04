import { Link } from "react-router-dom";
import { useLanguage, useContent } from "@/contexts/LanguageContext";
import hobsonLogo from "/hobson-logo.png";

export const HomepageFooter = () => {
  const { language } = useLanguage();
  const content = useContent();
  const hideExtraNavItems = language === 'de' || language === 'ae' || language === 'fr';
  const text = content.sharedFooter;

  return (
    <footer className="bg-muted/30 border-t py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="col-span-2">
            <div className="mb-4">
              <img src={hobsonLogo} alt="Hobson's AI" className="h-16" loading="lazy" decoding="async" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">{text.product}</h4>
            <div className="space-y-2">
              <Link 
                to="/features"
                className="block text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                {text.features}
              </Link>
              <a 
                href="https://pilot.hobsonschoice.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                {text.joinPilot}
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">{text.company}</h4>
            <div className="space-y-2">
              {!hideExtraNavItems && (
                <Link to="/blog" className="block text-muted-foreground hover:text-foreground transition-colors" title="Property Management Insights - Expert perspectives on AI and real estate technology">{text.blog}</Link>
              )}
              <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors" title="Contact Real Estate Software Support - Get in touch with our AI property management specialists">{text.contact}</Link>
              {!hideExtraNavItems && (
                <Link to="/learn" className="block text-muted-foreground hover:text-foreground transition-colors" title="Learning Resources">{text.learn}</Link>
              )}
              <Link to="/investment-opportunity" className="block text-muted-foreground hover:text-foreground transition-colors" title="Investment Opportunity">{text.investmentOpportunity}</Link>
              <Link to="/data-protection" className="block text-muted-foreground hover:text-foreground transition-colors" title="AI Privacy & Data Protection Policy">{text.dataProtection}</Link>
              <Link to="/breach-protocol" className="block text-muted-foreground hover:text-foreground transition-colors" title="Data Breach Protocol">{text.breachProtocol}</Link>
              <Link to="/refund-policy" className="block text-muted-foreground hover:text-foreground transition-colors" title="Refund Policy">{text.refundPolicy}</Link>
              <a 
                href="https://www.linkedin.com/company/hobsonschoice-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors"
                title="Follow Hobson's Choice AI on LinkedIn"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            {text.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
