import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTENT } from "@/config/content";
import { HobsonGateway, HobsonGatewayMobile, serifStack } from "@/components/HobsonGateway";
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
      <path d="M0,0 v30 h60 v-30 z" fill="#2D2D2D"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#9C4A38" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#9C4A38" strokeWidth="6"/>
    </g>
  </svg>
);

export const HomepageHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const content = CONTENT;


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <header
      className="border-b bg-background sticky top-0 z-50"
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

          {/* Desktop Navigation — each way Hobson directs you, in his own words */}
          <nav className="hidden md:flex items-center gap-7" role="navigation" aria-label="Main navigation">
            {content.navigation.links.map((link: any) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex flex-col items-start py-1 outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-brass/60"
                title={link.title}
              >
                <span className="relative text-[15px] text-ink leading-none">
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass/60 transition-all duration-500 group-hover:w-full group-hover:bg-brass"
                  />
                </span>
                <span
                  className="mt-2 text-[10px] text-ink-muted italic leading-none opacity-45 transition-all duration-500 group-hover:opacity-100 group-hover:text-brass-text"
                  style={serifStack}
                >
                  {link.voice}
                </span>
              </Link>
            ))}
            {(content.navigation as any).secondary?.map((link: any) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex flex-col items-start py-1 outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-brass/60"
                title={link.title}
              >
                <span className="relative text-[15px] text-ink leading-none">
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass/60 transition-all duration-500 group-hover:w-full group-hover:bg-brass"
                  />
                </span>
                <span
                  className="mt-2 text-[10px] text-ink-muted italic leading-none opacity-45 transition-all duration-500 group-hover:opacity-100 group-hover:text-brass-text"
                  style={serifStack}
                >
                  {link.voice}
                </span>
              </Link>
            ))}
            
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
              >
                <span className="text-lg text-ink leading-tight">Home</span>
                <span className="mt-1 text-xs text-ink-muted italic leading-tight" style={serifStack}>
                  Start with me
                </span>
              </Link>
              {content.navigation.links.map((link: any) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex flex-col border-b border-bone-wash py-3"
                  onClick={closeMobileMenu}
                  title={link.title}
                >
                  <span className="text-lg text-ink leading-tight">{link.label}</span>
                  <span className="mt-1 text-xs text-ink-muted italic leading-tight" style={serifStack}>
                    {link.voice}
                  </span>
                </Link>
                ))}
                {(content.navigation as any).secondary?.map((link: any) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex flex-col border-b border-bone-wash py-3"
                  onClick={closeMobileMenu}
                  title={link.title}
                >
                  <span className="text-lg text-ink leading-tight">{link.label}</span>
                  <span className="mt-1 text-xs text-ink-muted italic leading-tight" style={serifStack}>
                    {link.voice}
                  </span>
                </Link>
                ))}
                <div className="pt-4">
                  <HobsonGatewayMobile onClick={closeMobileMenu} />
                </div>


            </div>
          </nav>
        )}
      </div>
    </header>
    </>
  );

};