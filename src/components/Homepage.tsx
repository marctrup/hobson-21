import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import explainerVideo from "@/assets/avitar-hobson.mp4";
import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { usePilotApplication } from "@/hooks/usePilotApplication";
import { getHomepageStructuredData } from "@/utils/seo-data";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

// Lazy load heavy components
const PilotApplicationForm = lazy(() => import("./homepage/PilotApplicationForm").then(module => ({ default: module.PilotApplicationForm })));
const FormDialogs = lazy(() => import("./homepage/FormDialogs").then(module => ({ default: module.FormDialogs })));
const HomepageFooter = lazy(() => import("./homepage/HomepageFooter").then(module => ({ default: module.HomepageFooter })));

// Component imports for better organization
import { Header } from "./homepage/Header";
import { HeroSection } from "./homepage/HeroSection";
import { FeaturesSection } from "./homepage/FeaturesSection";
import { SolutionsSection } from "./homepage/SolutionsSection";
import { HowItWorksSection } from "./homepage/HowItWorksSection";
import { CTASection } from "./homepage/CTASection";

const Homepage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showExplainerVideo, setShowExplainerVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    showSuccessDialog,
    setShowSuccessDialog,
    showAntiBotDialog,
    setShowAntiBotDialog,
    mathProblem,
    userAnswer,
    setUserAnswer,
    handleAntiBotSubmit,
  } = usePilotApplication();

  // Effect to ensure video is ready when dialog opens
  useEffect(() => {
    if (showExplainerVideo && videoRef.current) {
      const video = videoRef.current;
      console.log('Dialog opened, video element:', video);
      console.log('Video src:', video.src);
      
      // Force load the video
      video.load();
      
      const handleCanPlay = () => {
        console.log('Video can play');
        video.play().catch(error => {
          console.error('Autoplay failed:', error);
        });
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [showExplainerVideo]);

  // Structured data for SEO
  const structuredData = getHomepageStructuredData();

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Property Management AI Software | Automate Document Analysis | Hobson AI</title>
        <meta name="title" content="Property Management AI Software | Automate Document Analysis | Hobson AI" />
        <meta name="description" content="Get instant answers from lease agreements & property documents with AI. Free pilot program. 99.9% accuracy. Try Hobson AI today." />
        <meta name="keywords" content="property management AI, real estate automation, lease analysis, document intelligence, property AI software, real estate AI" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="Hobson AI" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hobsonschoice.ai/" />
        <meta property="og:title" content="Property Management AI Software | Hobson AI" />
        <meta property="og:description" content="Get instant answers from lease agreements & property documents with AI. Free pilot program. 99.9% accuracy. Try Hobson AI today." />
        <meta property="og:image" content="https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" />
        <meta property="og:site_name" content="Hobson AI" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hobsonschoice.ai/property-management-software" />
        <meta property="twitter:title" content="AI Property Management Software | Hobson's Choice AI" />
        <meta property="twitter:description" content="Transform your property business with AI-powered document intelligence. Get instant answers from leases, contracts & property documents." />
        <meta property="twitter:image" content="https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" />
        
        {/* Additional SEO Tags */}
        <meta name="geo.region" content="GB" />
        <meta name="geo.placename" content="United Kingdom" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <main id="main-content" className="min-h-screen bg-background" role="main">
        <Header />
        <HeroSection onShowExplainerVideo={() => setShowExplainerVideo(true)} />
        <div className="content-section">
          <FeaturesSection />
        </div>
        <div className="content-section">
          <SolutionsSection />
        </div>
        <div className="content-section">
          <HowItWorksSection />
        </div>
        
        {/* Features Link */}
        <section className="py-8 text-center">
          <div className="container mx-auto px-4">
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <Link 
                to="/features"
                onClick={() => window.scrollTo(0, 0)}
                title="Property Management AI Features - Explore our intelligent automation and document analysis capabilities"
              >
                Features
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        <div className="content-section">
          <CTASection />
        </div>

        {/* Footer - Lazy Loaded */}
        <Suspense fallback={<LoadingSkeleton />}>
          <HomepageFooter />
        </Suspense>
      </main>

      {/* Pilot Application Form Modal - Lazy Loaded */}
      <Suspense fallback={<LoadingSkeleton />}>
        <PilotApplicationForm showForm={showForm} setShowForm={setShowForm} />
      </Suspense>

      {/* Form Dialogs - Lazy Loaded */}
      <Suspense fallback={<LoadingSkeleton />}>
        <FormDialogs
          showSuccessDialog={showSuccessDialog}
          setShowSuccessDialog={setShowSuccessDialog}
          showAntiBotDialog={showAntiBotDialog}
          setShowAntiBotDialog={setShowAntiBotDialog}
          mathProblem={mathProblem}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          handleAntiBotSubmit={handleAntiBotSubmit}
        />
      </Suspense>

      {/* Explainer Video Dialog */}
      <Dialog open={showExplainerVideo} onOpenChange={setShowExplainerVideo}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              Meet Georgia
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <video 
              ref={videoRef}
              className="w-full h-full rounded-lg"
              controls
              playsInline
              disablePictureInPicture
              preload="metadata"
              aria-label="how AI is changing real estate software"
              onLoadedData={(e) => {
                console.log('Video loaded successfully');
                const video = e.target as HTMLVideoElement;
                video.play().catch(error => {
                  console.error('Video play failed:', error);
                });
              }}
              onError={(e) => {
                console.error('Video error:', e);
              }}
              onLoadStart={() => {
                console.log('Video load started');
              }}
            >
              <source src={explainerVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Homepage;