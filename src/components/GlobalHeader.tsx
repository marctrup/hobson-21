import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAVIGATION_LINKS } from "@/config/navigation";
import hobsonLogo from "/lovable-uploads/270231d1-a007-4b5e-82c2-696ea7ccf2f5.png";

export const GlobalHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" onClick={closeMobileMenu}>
              <img 
                src={hobsonLogo} 
                alt="Hobson AI property management software logo" 
                className="h-12 md:h-16 hover:opacity-80 transition-opacity" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NAVIGATION_LINKS.map((link) => (
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
              {NAVIGATION_LINKS.map((link) => (
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