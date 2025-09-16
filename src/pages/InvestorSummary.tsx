import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { InvestorCoverSlide, MarketProblemSlide, ValuePropositionSlide, MarketOpportunitySlide, InvestorCTASlide } from "@/components/investor";
import { Helmet } from "react-helmet-async";

const InvestorSummary = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 'cover',
      title: '',
      subtitle: '',
      content: <InvestorCoverSlide />
    },
    {
      id: 'market-problem',
      title: 'Why Old Systems Can\'t Keep Up',
      subtitle: 'Manual workflows and complexity kill adoption and profits.',
      content: <MarketProblemSlide />
    },
    {
      id: 'value-proposition',
      title: 'Our Solution',
      subtitle: 'Lightweight AI replacing expensive legacy systems',
      content: <ValuePropositionSlide />
    },
    {
      id: 'market-opportunity',
      title: 'Market Opportunity',
      subtitle: 'A massive $1.8T AI-in-Property market, primed for efficiency-driven disruption.',
      content: <MarketOpportunitySlide />
    },
    {
      id: 'investor-cta',
      title: 'Investment Opportunity',
      subtitle: 'Be part of the $1.8T AI-in-Property transformation.',
      content: <InvestorCTASlide />
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Slightly longer for investor content

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-2 sm:p-4">
      <Helmet>
        <title>Hobson AI - Investor Summary | Property Tech Investment Opportunity</title>
        <meta name="description" content="Investment opportunity in Hobson AI - disrupting the £15B+ property tech market with lightweight AI solutions. Scalable SaaS model with proven traction." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="w-full max-w-sm sm:max-w-lg">
        {/* LinkedIn-optimized square format */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden aspect-square">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary-light p-3 sm:p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="text-xs sm:text-sm font-medium opacity-90">
                  {currentSlide + 1} of {slides.length}
                </div>
                <div className="text-xs opacity-75">Investor Summary</div>
              </div>
              <div className="flex gap-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentSlide ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="pt-16 sm:pt-20 pb-16 sm:pb-20 px-4 sm:px-8 h-full flex flex-col">
            <div className={`text-center flex-shrink-0 ${slides[currentSlide].title || slides[currentSlide].subtitle ? 'mb-3 sm:mb-4 min-h-[60px] sm:min-h-[70px] flex flex-col justify-center' : 'mb-0 min-h-0'}`}>
              {slides[currentSlide].title && (
                <h1 className="text-lg sm:text-2xl font-bold text-foreground mb-1 sm:mb-2 leading-tight">
                  {slides[currentSlide].title}
                </h1>
              )}
              {slides[currentSlide].subtitle && (
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {slides[currentSlide].subtitle}
                </p>
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="w-full max-w-full">
                {slides[currentSlide].content}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex items-center justify-between px-3 sm:px-4 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full bg-white/90 hover:bg-white w-8 h-8 sm:w-10 sm:h-10 pointer-events-auto"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <div className="flex items-center gap-2 pointer-events-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-xs scale-95 px-2 py-1 bg-muted hover:bg-muted/80 min-w-[60px]"
              >
                {isAutoPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full bg-white/90 hover:bg-white w-8 h-8 sm:w-10 sm:h-10 pointer-events-auto"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Confidential investor presentation • For qualified investors only
          </p>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button variant="outline" size="sm" onClick={() => window.open('mailto:rochelle.t@hobsonschoice.ai', '_blank')} className="text-xs sm:text-sm">
              Contact Team
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="text-xs sm:text-sm">
              Restart Presentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorSummary;