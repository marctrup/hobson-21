import { Link } from "react-router-dom";
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";

export const HomepageFooter = () => {
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
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <div className="space-y-2">
              <Link 
                to="/features"
                className="block text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Features
              </Link>
              <a 
                href="https://pilot.hobsonschoice.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Join our pilot programme
              </a>
            </div>
          </div>
          
           <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <div className="space-y-2">
              <Link to="/blog" className="block text-muted-foreground hover:text-foreground transition-colors" title="Property Management Insights - Expert perspectives on AI and real estate technology">Blog</Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors" title="Contact Real Estate Software Support - Get in touch with our AI property management specialists">Contact</Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors" title="Contact Real Estate Software Support - Get in touch with our AI property management specialists">Contact</Link>
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
            © 2024 Hobson's Choice AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};