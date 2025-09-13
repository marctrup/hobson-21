import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, DollarSign, FileText, Zap, CheckCircle, X, CreditCard, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import splitScreenImage from "@/assets/split-screen-comparison.png";

const Rotating = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 'cover',
      title: 'Traditional Systems vs Hobson',
      subtitle: 'AI - The smart choice for property professionals',
      content: (
        <div className="text-center">
          <div className="w-full max-w-xs sm:max-w-sm mx-auto -mt-5">
            <img 
              src={splitScreenImage} 
              alt="Split screen comparison showing chaos of traditional systems versus calm simplicity of Hobson"
              className="w-full h-auto rounded-lg shadow-lg object-contain max-h-48 sm:max-h-none"
            />
          </div>
        </div>
      )
    },
    {
      id: 'problem',
      title: 'Traditional Systems',
      subtitle: 'The painful reality',
      content: (
        <div className="space-y-3 sm:space-y-6">
          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {[
              { icon: DollarSign, text: 'Expensive monthly subscriptions', color: 'text-red-500' },
              { icon: Clock, text: 'Hours spent searching documents', color: 'text-red-500' },
              { icon: FileText, text: 'Manual information extraction', color: 'text-red-500' },
              { icon: X, text: 'Complex, bloated interfaces', color: 'text-red-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color} flex-shrink-0`} />
                <span className="text-foreground font-medium text-xs sm:text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'solution',
      title: 'Hobson AI',
      subtitle: 'The intelligent solution',
      content: (
        <div className="space-y-3 sm:space-y-6">
          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {[
              { icon: Zap, text: 'Instant answers from documents', color: 'text-primary' },
              { icon: CheckCircle, text: 'AI-powered accuracy', color: 'text-primary' },
              { icon: FileText, text: 'Source-referenced responses', color: 'text-primary' },
              { icon: Users, text: 'Simple, lightweight interface', color: 'text-primary' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
                <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color} flex-shrink-0`} />
                <span className="text-foreground font-medium text-xs sm:text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'free-plan',
      title: 'Free Plan Benefits',
      subtitle: 'All features. No credit card.',
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary-light/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-primary/20">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm sm:text-base">Free Forever</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Perfect for low-usage professionals</p>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {[
                'All core AI features included',
                'Document analysis & extraction',
                'Instant Q&A capabilities',
                'Source-referenced answers'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>No credit card required</span>
          </div>
        </div>
      )
    },
    {
      id: 'cta',
      title: 'Ready to Transform?',
      subtitle: 'Join thousands of real estate professionals',
      content: (
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-brand-orange to-brand-orange/80 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <p className="text-muted-foreground max-w-sm mx-auto text-xs sm:text-sm px-2">
              Start getting instant answers from your documents today. No setup, no hassle.
            </p>
          </div>
          <Button 
            size="lg" 
            variant="cta"
            className="w-full max-w-xs mx-auto text-sm sm:text-lg py-4 sm:py-6"
            onClick={() => window.open('https://hobsonschoice.ai', '_blank')}
          >
            Try Hobson Free
          </Button>
          <p className="text-xs text-muted-foreground">
            Free plan • No credit card • Instant access
          </p>
        </div>
      )
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-2 sm:p-4">
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
          <div className="pt-14 sm:pt-18 pb-16 sm:pb-20 px-4 sm:px-8 h-full flex flex-col border-2 border-red-500">
            <div className="text-center mb-4 sm:mb-6 mt-3 sm:mt-4 flex-shrink-0 border-2 border-red-300 p-2">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground mb-1 sm:mb-2 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {slides[currentSlide].subtitle}
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center mt-5 border-2 border-red-400 p-2">
              {slides[currentSlide].content}
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full bg-white/90 hover:bg-white w-8 h-8 sm:w-10 sm:h-10"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-xs scale-95 px-2 py-1 bg-muted hover:bg-muted/80"
              >
                {isAutoPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full bg-white/90 hover:bg-white w-8 h-8 sm:w-10 sm:h-10"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            LinkedIn-optimized carousel • Share with your network
          </p>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button variant="outline" size="sm" onClick={() => window.open('https://hobsonschoice.ai', '_blank')} className="text-xs sm:text-sm">
              Visit Hobson
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="text-xs sm:text-sm">
              Restart Carousel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rotating;