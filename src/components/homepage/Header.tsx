import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="https://www.hobsonschoice.ai" onClick={closeMobileMenu}>
              <img 
                src={hobsonLogo} 
                alt="Hobson's Choice AI - AI-powered property management software company logo" 
                className="h-12 md:h-16" 
                loading="eager"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-purple-500" strokeWidth={1.5} />
            ) : (
              <Menu className="h-6 w-6 text-purple-500" strokeWidth={1.5} />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col gap-4">
              <Link 
                to="/features" 
                className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Features
              </Link>
              <Link 
                to="/blog" 
                className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Blog
              </Link>
              <Link 
                to="/about" 
                className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};