import React, { memo, useState, useRef } from "react";
import { useContent } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import hobsonUnitInterface from "@/assets/hobson-unit-interface.png";

const FeatureShowcase = memo(() => {
  const content = useContent();
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  return (
    <div className="mb-20 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {content.features.title}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {content.features.subtitle}
        </p>
      </div>
      
      {/* Angled Interface Display */}
      <div className="relative" style={{ perspective: '1000px' }} ref={containerRef}>
        <div 
          className="relative mx-auto max-w-7xl md:transition-all md:duration-700"
          style={{
            transform: isMobile
              ? 'perspective(1000px) rotateY(-6deg) scale(0.97)'
              : isActive
                ? 'rotateY(0deg) scale(1)'
                : 'rotateY(12deg) scale(0.95)',
            transformStyle: 'preserve-3d',
          }}
          onMouseEnter={() => !isMobile && setIsActive(true)}
          onMouseLeave={() => !isMobile && setIsActive(false)}
        >
          
          {/* Floating elements for depth - hidden on mobile */}
          <div className="hidden md:block absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="hidden md:block absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          {/* Main Interface Screenshot */}
          <div className="rounded-2xl border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden">
            {/* Desktop/tablet: full image */}
            <img
              src={hobsonUnitInterface}
              alt="Hobson AI unit interface showing chat with document insights and interactive property map"
              className="hidden md:block w-full h-auto"
              loading="lazy"
              decoding="async"
            />
            {/* Mobile: cropped to show mostly chat, static angled display */}
            <img
              src={hobsonUnitInterface}
              alt="Hobson AI unit interface showing chat with document insights and interactive property map"
              className="md:hidden w-full"
              style={{
                objectFit: 'cover',
                objectPosition: '0% center',
                aspectRatio: '3/4',
              }}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

FeatureShowcase.displayName = 'FeatureShowcase';

export default FeatureShowcase;
