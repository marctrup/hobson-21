import React from 'react';
import devicesCombined from '@/assets/hobson-devices-combined.png';

export const SimpleUIVisual = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Onboarding Required
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Upload documents and start asking questions immediately. Simple, intuitive interfaces across all devices.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-primary/5 rounded-lg">
          <span className="text-lg">⚡</span>
          <p className="text-xs font-medium text-foreground mt-1">Instant Start</p>
        </div>
        <div className="text-center p-3 bg-primary/5 rounded-lg">
          <span className="text-lg">🎯</span>
          <p className="text-xs font-medium text-foreground mt-1">Zero Training</p>
        </div>
        <div className="text-center p-3 bg-primary/5 rounded-lg">
          <span className="text-lg">💬</span>
          <p className="text-xs font-medium text-foreground mt-1">Natural Language</p>
        </div>
        <div className="text-center p-3 bg-primary/5 rounded-lg">
          <span className="text-lg">📱</span>
          <p className="text-xs font-medium text-foreground mt-1">Any Device</p>
        </div>
      </div>

      {/* Combined Device Image */}
      <div className="flex justify-center">
        <img 
          src={devicesCombined} 
          alt="Hobson interface on desktop and mobile showing property management and chat features" 
          className="w-full max-w-2xl h-auto"
          loading="lazy"
        />
      </div>
    </div>
  );
};

// Export the image path for PDF generation
export const simpleUIImagePath = devicesCombined;
