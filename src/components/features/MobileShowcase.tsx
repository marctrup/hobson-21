import React, { memo, useState, useEffect } from "react";
import mobileChatImg from "@/assets/hobson-mobile-chat.png";
import mobileMapImg from "@/assets/hobson-mobile-map.png";
import { MessageCircle, Map } from "lucide-react";

const screens = [
  { src: mobileChatImg, alt: "Hobson AI chat interface on mobile", label: "Chat", icon: MessageCircle },
  { src: mobileMapImg, alt: "Hobson AI interactive property map on mobile", label: "Map", icon: Map },
];

const MobileShowcase = memo(() => {
  const [activeScreen, setActiveScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
                Always with you
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5">
                Your AI assistant,<br />right in your pocket
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
                Switch seamlessly between conversational AI and your interactive property map. 
                Everything you need, wherever you are.
              </p>

              {/* Feature pills */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {screens.map((screen, i) => {
                  const Icon = screen.icon;
                  return (
                    <button
                      key={screen.label}
                      onClick={() => setActiveScreen(i)}
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 ${
                        activeScreen === i
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                          : "bg-background border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{screen.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex-shrink-0 relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-110" />
              
              {/* Phone frame */}
              <div className="relative w-[280px] sm:w-[300px] rounded-[2.5rem] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-foreground/90 rounded-b-2xl z-20" />
                
                {/* Screen content */}
                <div className="relative w-full aspect-[9/19.5] overflow-hidden rounded-[2rem]">
                  {screens.map((screen, i) => (
                    <img
                      key={screen.label}
                      src={screen.src}
                      alt={screen.alt}
                      className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ${
                        activeScreen === i
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                    />
                  ))}
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-20" />
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-6">
                {screens.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeScreen === i
                        ? "w-8 bg-primary"
                        : "w-1.5 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

MobileShowcase.displayName = "MobileShowcase";

export default MobileShowcase;
