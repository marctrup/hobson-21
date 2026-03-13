import React, { memo } from "react";
import { useContent } from "@/contexts/LanguageContext";
import hobsonUnitInterface from "@/assets/hobson-unit-interface.png";

const FeatureShowcase = memo(() => {
  const content = useContent();

  return (
    <div className="mb-20 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          {content.features.title}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {content.features.subtitle}
        </p>
      </div>
      
      {/* Angled Interface Display */}
      <div className="relative" style={{ perspective: '1000px' }}>
        <div 
          className="relative mx-auto max-w-7xl transition-all duration-700"
          style={{
            transform: 'rotateY(-12deg) scale(0.95)',
            transformStyle: 'preserve-3d',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotateY(0deg) scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotateY(-12deg) scale(0.95)';
          }}
        >
          
          {/* Floating elements for depth */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          {/* Main Interface Screenshot */}
          <div className="rounded-2xl border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden">
            <img
              src={hobsonUnitInterface}
              alt="Hobson AI unit interface showing chat with document insights and interactive property map"
              className="w-full h-auto"
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
