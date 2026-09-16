import { Link } from "react-router-dom";
import { CONTENT } from "@/config/content";

export const HomepageFooter = () => {
  const text = CONTENT.sharedFooter;

  return (
    <footer className="bg-muted/30 border-t py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div>
            <div className="mb-4">
              <span className="text-3xl font-semibold text-foreground tracking-tight">Hobson</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Solutions</h4>
            <div className="space-y-2">
              <Link to="/lease-management-software" className="block text-muted-foreground hover:text-foreground transition-colors">Lease management software</Link>
              <Link to="/property-management-software" className="block text-muted-foreground hover:text-foreground transition-colors">Property management software</Link>
              <Link to="/property-portfolio-software" className="block text-muted-foreground hover:text-foreground transition-colors">Property portfolio software</Link>
              <Link to="/ai-lease-abstraction" className="block text-muted-foreground hover:text-foreground transition-colors">AI lease abstraction</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <div className="space-y-2">
              <Link to="/learn" className="block text-muted-foreground hover:text-foreground transition-colors">Learn</Link>
              <Link to="/learn/faq" className="block text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
              <Link to="/learn/glossary" className="block text-muted-foreground hover:text-foreground transition-colors">Glossary</Link>
              <Link to="/learn/case-studies" className="block text-muted-foreground hover:text-foreground transition-colors">Case studies</Link>
            </div>
          </div>
          
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">{text.company}</h4>
            <div className="space-y-2">
              <Link to="/pricing" className="block text-muted-foreground hover:text-foreground transition-colors" title="Hobson AI Pricing Plans">Pricing</Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-foreground transition-colors" title="Property Management Insights - Expert perspectives on AI and real estate technology">{text.blog}</Link>
              <Link to="/press" className="block text-muted-foreground hover:text-foreground transition-colors">Press</Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors" title="Contact Real Estate Software Support - Get in touch with our AI property management specialists">{text.contact}</Link>
              
              <Link to="/investment-opportunity" className="block text-muted-foreground hover:text-foreground transition-colors" title="Investment Opportunity">{text.investmentOpportunity}</Link>
              <Link to="/data-protection" className="block text-muted-foreground hover:text-foreground transition-colors" title="AI Privacy & Data Protection Policy">{text.dataProtection}</Link>
              <Link to="/breach-protocol" className="block text-muted-foreground hover:text-foreground transition-colors" title="Data Breach Protocol">{text.breachProtocol}</Link>
              <Link to="/refund-policy" className="block text-muted-foreground hover:text-foreground transition-colors" title="Refund Policy">{text.refundPolicy}</Link>
              <a 
                href="https://www.linkedin.com/company/103275921"
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
