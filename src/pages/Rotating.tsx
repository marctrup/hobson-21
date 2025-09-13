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
      title: 'Traditional Systems vs. Hobson',
      subtitle: 'The smart choice for real estate professionals',
      content: (
        <div className="text-center space-y-4">
          <div className="w-full max-w-sm mx-auto">
            <img 
              src={splitScreenImage} 
              alt="Split screen comparison showing chaos of traditional systems versus calm simplicity of Hobson"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground max-w-sm mx-auto">
            <span>Complex & Overwhelming</span>
            <span>Simple & Organized</span>
          </div>
        </div>
      )
    },
    {
      id: 'problem',
      title: 'Traditional Systems',
      subtitle: 'The painful reality',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: DollarSign, text: 'Expensive monthly subscriptions', color: 'text-red-500' },
              { icon: Clock, text: 'Hours spent searching documents', color: 'text-red-500' },
              { icon: FileText, text: 'Manual information extraction', color: 'text-red-500' },
              { icon: X, text: 'Complex, bloated interfaces', color: 'text-red-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-foreground font-medium">{item.text}</span>
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Zap, text: 'Instant answers from documents', color: 'text-primary' },
              { icon: CheckCircle, text: 'AI-powered accuracy', color: 'text-primary' },
              { icon: FileText, text: 'Source-referenced responses', color: 'text-primary' },
              { icon: Users, text: 'Simple, lightweight interface', color: 'text-primary' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-foreground font-medium">{item.text}</span>
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
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary-light/10 p-6 rounded-2xl border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Free Forever</h3>
                <p className="text-sm text-muted-foreground">Perfect for low-usage professionals</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                'All core AI features included',
                'Document analysis & extraction',
                'Instant Q&A capabilities',
                'Source-referenced answers'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="w-4 h-4" />
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
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-orange to-brand-orange/80 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Start getting instant answers from your documents today. No setup, no hassle.
            </p>
          </div>
          <Button 
            size="lg" 
            variant="cta"
            className="w-full max-w-xs mx-auto text-lg py-6"
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* LinkedIn-optimized square format */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden aspect-square">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary-light p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="text-sm font-medium opacity-90">
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
          <div className="pt-20 pb-20 px-8 h-full flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {slides[currentSlide].title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {slides[currentSlide].subtitle}
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              {slides[currentSlide].content}
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full bg-white/90 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant={isAutoPlaying ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-xs"
              >
                {isAutoPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full bg-white/90 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            LinkedIn-optimized carousel • Share with your network
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="outline" size="sm" onClick={() => window.open('https://hobsonschoice.ai', '_blank')}>
              Visit Hobson
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Restart Carousel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rotating;