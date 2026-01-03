import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/LanguageContext";
import hobsonLogo from "/hobson-logo.png";

// UK Flag SVG component
const UKFlag = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export const HomepageHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const content = useContent();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      role="banner"
    >
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" onClick={closeMobileMenu}>
              <img
                src={hobsonLogo}
                alt="Hobson AI - AI-powered real estate management software company logo"
                className="h-[62px]"
                loading="eager"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            {content.navigation.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
                title={link.title}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Language indicator */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground" title="English (UK)">
              <UKFlag className="w-5 h-auto rounded-sm shadow-sm" />
              <span className="hidden lg:inline">EN</span>
            </div>
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
              {content.navigation.links.map((link) => (
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
