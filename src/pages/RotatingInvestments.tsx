import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CoverSlide } from "@/components/rotating";
import { ProblemSlide, ProductSlide, ValueSlide, InvitationSlide } from "@/components/investor";
import { Helmet } from "react-helmet-async";
import hobsonLogo from "@/assets/hobson-carousel-logo.png";

const RotatingInvestments = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const slides = [
    {
      id: 'cover',
      title: 'Smart AI for Real Estate',
      subtitle: 'Delivering scalable gains and superior decision-making.',
      content: <CoverSlide />
    },
    {
      id: 'problem',
      title: '',
      subtitle: '',
      content: <ProblemSlide />
    },
    {
      id: 'product',
      title: '',
      subtitle: '',
      content: <ProductSlide />
    },
    {
      id: 'value',
      title: '',
      subtitle: '',
      content: <ValueSlide />
    },
    {
      id: 'invitation',
      title: '',
      subtitle: '',
      content: <InvitationSlide />
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col">
      {/* Header with Logo */}
      <div className="w-full p-4 sm:p-6">
        <img 
          src={hobsonLogo} 
          alt="Hobson AI" 
          className="h-8 sm:h-10 w-auto"
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
      <Helmet>
        {/* Mobile-optimized viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Initialize dataLayer before GTM */}
        <script>
          {`window.dataLayer = window.dataLayer || [];`}
        </script>
        
        {/* Google Tag Manager */}
        <script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M7JNNWVM');`}
        </script>
        
        {/* GTM noscript fallback */}
        <noscript>
          {`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M7JNNWVM" height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
        </noscript>
      </Helmet>
      <div className="w-full max-w-sm sm:max-w-lg">
        {/* LinkedIn-optimized square format */}
        <div 
          className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden aspect-square select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary-light p-3 sm:p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="text-xs sm:text-sm font-medium opacity-90">
                  {currentSlide + 1} of {slides.length}
                </div>
              </div>
              <div className="flex gap-1.5 sm:gap-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full transition-all touch-manipulation ${
                      idx === currentSlide ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="pt-14 sm:pt-18 pb-16 sm:pb-20 px-4 sm:px-8 h-full flex flex-col">
            <div className="text-center mb-4 sm:mb-6 mt-0 sm:mt-1 flex-shrink-0">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground mb-1 sm:mb-2 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {slides[currentSlide].subtitle}
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center -mt-3">
              {slides[currentSlide].content}
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 flex items-center justify-between px-2 sm:px-3 md:px-4 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="rounded-full bg-white/90 hover:bg-white w-10 h-10 sm:w-10 sm:h-10 pointer-events-auto touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
            </Button>
            
            <div className="flex items-center gap-2 pointer-events-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-xs px-3 py-2 bg-muted hover:bg-muted/80 min-w-[70px] touch-manipulation"
              >
                {isAutoPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              aria-label="Next slide"
              className="rounded-full bg-white/90 hover:bg-white w-10 h-10 sm:w-10 sm:h-10 pointer-events-auto touch-manipulation"
            >
              <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open('https://hobsonschoice.ai', '_blank')} 
              className="text-xs sm:text-sm py-2 touch-manipulation"
            >
              Visit Hobson
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()} 
              className="text-xs sm:text-sm py-2 touch-manipulation"
            >
              Restart Carousel
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RotatingInvestments;
