import { Link } from "react-router-dom";

export const HomepageFooter = () => {
  return (
    <footer className="py-12 md:py-20 border-t bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-10 md:gap-12">
          {/* Logo & tagline */}
          <div className="md:col-span-1">
            <span className="text-3xl font-semibold text-foreground tracking-tight block mb-4">Hobson</span>
            <p className="text-sm text-muted-foreground max-w-md">
              I provide AI assistance to operators, occupiers and owners of real estate.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.linkedin.com/company/103275921"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                title="Follow Hobson's Choice AI on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5">Company</h4>
            <div className="space-y-3">
              <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              <Link to="/founder" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Founders</Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
              <Link to="/press" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Press</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <Link to="/privacy-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/data-protection" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Data Protection</Link>
              <Link to="/refund-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
              <Link to="/investment-opportunity" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Investment Opportunity</Link>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5">Solutions</h4>
            <div className="space-y-3">
              <Link to="/lease-management-software" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Lease management software</Link>
              <Link to="/property-management-software" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Property management software</Link>
              <Link to="/property-portfolio-software" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Property portfolio software</Link>
              <Link to="/ai-lease-abstraction" className="block text-sm text-muted-foreground hover:text-primary transition-colors">AI lease abstraction</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5">Resources</h4>
            <div className="space-y-3">
              <Link to="/learn" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Learn</Link>
              <Link to="/learn/faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
              <Link to="/learn/glossary" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Glossary</Link>
              <Link to="/learn/case-studies" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Case studies</Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Hobson's Choice AI Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
