import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CoverSlide } from "@/components/rotating";
import { ProblemSlide, ProductSlide, ValueSlide, ImpactSlide, InvitationSlide } from "@/components/investor";
import { Helmet } from "react-helmet-async";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";

const RotatingInvestments = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      id: 'impact',
      title: '',
      subtitle: '',
      content: <ImpactSlide />
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

  const downloadPDF = async () => {
    if (!slideRef.current) return;
    
    setIsGeneratingPDF(true);
    setIsAutoPlaying(false);
    
    toast({
      title: "Generating PDF",
      description: "Capturing all slides... This may take a moment.",
    });

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [800, 800], // Square format matching carousel
      });

      // Capture each slide
      for (let i = 0; i < slides.length; i++) {
        setCurrentSlide(i);
        
        // Wait for slide to render
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(slideRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, 800, 800);
      }

      pdf.save('hobson-investor-carousel.pdf');
      
      toast({
        title: "PDF Downloaded",
        description: "Your investor carousel has been saved successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
      setCurrentSlide(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-2 sm:p-4">
      <Helmet>
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
        <div ref={slideRef} className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden aspect-square">
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
            LinkedIn-optimized carousel • Share with your network
          </p>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className="text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
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

export default RotatingInvestments;
