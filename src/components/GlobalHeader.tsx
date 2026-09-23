import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/OptimizedImage";
import { CONTENT } from "@/config/content";
import { HobsonGateway, HobsonGatewayMobile, serifStack } from "@/components/HobsonGateway";

export const GlobalHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const content = CONTENT;

  const isActive = (to: string) => {
    if (to.startsWith('/learn')) return location.pathname.startsWith('/learn');
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  // Primary nav links
  const primaryLinks = content.navigation.links;

  // Secondary nav links
  const secondaryLinks = (content.navigation as any).secondary || [];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const desktopLink = (link: any) => (
    <Link
      key={link.to}
      to={link.to}
      className="group flex flex-col items-start py-1 outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-brass/60"
      title={link.title}
      aria-current={isActive(link.to) ? "page" : undefined}
    >
      <span className={`relative text-[15px] leading-none ${isActive(link.to) ? 'text-brass-text font-medium' : 'text-ink'}`}>
        {link.label}
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass/60 transition-all duration-500 group-hover:w-full group-hover:bg-brass"
        />
      </span>
      <span
        className="mt-2 text-[10px] font-bold text-brass-text italic leading-none"
        style={serifStack}
      >
        {link.voice}
      </span>
    </Link>
  );

  const mobileLink = (link: any) => (
    <Link
      key={link.to}
      to={link.to}
      className="group flex flex-col border-b border-bone-wash py-3"
      onClick={closeMobileMenu}
      title={link.title}
      aria-current={isActive(link.to) ? "page" : undefined}
    >
      <span className={`text-lg leading-tight ${isActive(link.to) ? 'text-brass-text font-medium' : 'text-ink'}`}>{link.label}</span>
      <span className="mt-1 text-xs font-bold text-brass-text italic leading-tight" style={serifStack}>
        {link.voice}
      </span>
    </Link>
  );

  return (
    <header className="border-b bg-background sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="relative">
            <Link to="/" onClick={closeMobileMenu}>
              <OptimizedImage
                src="/hobson-logo.png"
                alt="Hobson AI — AI assistance for property operators, occupiers and owners"
                className="h-[59px] w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation — each way Hobson directs you, in his own words */}
          <nav className="hidden md:flex items-center gap-7" role="navigation" aria-label="Main navigation">
            {primaryLinks.map(desktopLink)}
            {secondaryLinks.map(desktopLink)}

            {/* Gateway to the app */}
            <HobsonGateway className="ml-2" />
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden bg-bone-wash hover:bg-bone border border-bone rounded-md"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
            ) : (
              <Menu className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col">
              <Link
                to="/"
                className="group flex flex-col border-b border-bone-wash py-3"
                onClick={closeMobileMenu}
                aria-current={location.pathname === '/' ? "page" : undefined}
              >
                <span className="text-lg text-ink leading-tight">Home</span>
                <span className="mt-1 text-xs font-bold text-brass-text italic leading-tight" style={serifStack}>
                  Start with me
                </span>
              </Link>
              {primaryLinks.map(mobileLink)}
              {secondaryLinks.map(mobileLink)}
              <div className="pt-4">
                <HobsonGatewayMobile onClick={closeMobileMenu} />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
