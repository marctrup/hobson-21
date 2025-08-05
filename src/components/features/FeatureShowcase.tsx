import { memo } from "react";

const FeatureShowcase = memo(() => {
  return (
    <div className="mb-20 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Simple. Powerful. Intuitive.
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Chat with Hobson on the left, visualize your portfolio on the right. Everything you need in one seamless interface.
        </p>
      </div>
      
      {/* Interface Display with Image */}
      <div className="relative perspective-1000">
        <div className="relative transform rotate-y-12 scale-95 hover:scale-100 hover:rotate-y-6 transition-all duration-700 mx-auto max-w-7xl hover:transform-none">
          
          {/* Floating elements for depth */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          {/* Main Interface Container */}
          <div className="bg-background/90 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden">
            {/* Placeholder for your PNG image */}
            <div className="w-full min-h-[400px] lg:h-[600px] bg-muted/20 flex items-center justify-center">
              <p className="text-muted-foreground">PNG image will be inserted here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

FeatureShowcase.displayName = 'FeatureShowcase';

export default FeatureShowcase;