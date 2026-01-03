import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAVIGATION_LINKS } from "@/config/navigation";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useLanguage } from "@/contexts/LanguageContext";

export const GlobalHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const isGerman = language === 'de';

  // Filter out Learn link for German site
  const filteredLinks = NAVIGATION_LINKS.filter(link => {
    if (isGerman && link.to === '/learn') return false;
    return true;
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="relative">
            <Link to="/" onClick={closeMobileMenu}>
              <OptimizedImage 
                src="/hobson-logo.png" 
                alt="Hobson AI - AI-powered property management software company logo"
                className="h-[59px] w-auto" 
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {filteredLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
                title={link.title}
              >
                {link.label}
              </Link>
            ))}
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
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              {filteredLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={closeMobileMenu}
                  title={link.title}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
