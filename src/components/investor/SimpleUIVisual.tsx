import React from 'react';
import desktopFrame from '@/assets/desktop-frame.png';
import phoneFrame from '@/assets/phone-frame.png';
import webInterface from '@/assets/hobson-web-interface.png';
import mobileInterface from '@/assets/hobson-mobile-interface.png';

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

      {/* Device Mockups */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
        {/* Desktop Mockup */}
        <div className="relative w-full max-w-md lg:max-w-lg">
          <div className="relative">
            {/* Desktop Frame */}
            <img 
              src={desktopFrame} 
              alt="Desktop computer frame" 
              className="w-full h-auto"
              loading="lazy"
            />
            {/* Web Interface inside frame */}
            <img 
              src={webInterface} 
              alt="Hobson web interface showing satellite map view with property navigation" 
              className="absolute object-cover"
              style={{ 
                top: '4.5%',
                left: '4.5%',
                width: '91%',
                height: '72%',
              }}
              loading="lazy"
            />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Web Interface - Property Map View
          </p>
        </div>

        {/* Mobile Mockup */}
        <div className="relative w-40 sm:w-48 lg:w-56 flex-shrink-0">
          <div className="relative">
            {/* Phone Frame */}
            <img 
              src={phoneFrame} 
              alt="Mobile phone frame" 
              className="w-full h-auto"
              loading="lazy"
            />
            {/* Mobile Interface inside frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={mobileInterface} 
                alt="Hobson mobile chat interface showing rent review query" 
                className="w-[77%] h-[85%] object-cover rounded-[20px]"
                style={{ 
                  position: 'absolute',
                  top: '7%',
                  left: '11.5%',
                }}
                loading="lazy"
              />
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Mobile Chat Interface
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
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
    </div>
  );
};
