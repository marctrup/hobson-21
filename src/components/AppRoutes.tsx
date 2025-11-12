import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HuggingFaceCacheManager } from "@/components/HuggingFaceCacheManager";

// Lazy load all pages for optimal bundle splitting
const Homepage = lazy(() => import("./Homepage").then(module => ({ default: module.Homepage })));
const HomepageABTest = lazy(() => import("./HomepageABTest").then(module => ({ default: module.HomepageABTest })));
const HomepageHomeowner = lazy(() => import("./HomepageHomeowner").then(module => ({ default: module.HomepageHomeowner })));
const SimpleHomepage = lazy(() => import("./SimpleHomepage").then(module => ({ default: module.SimpleHomepage })));
const LandingPageA = lazy(() => import("../pages/LandingPageA"));
const LandingPageB = lazy(() => import("../pages/LandingPageB"));
const LandingPageC = lazy(() => import("../pages/LandingPageC"));
const EmailPreview = lazy(() => import("../pages/EmailPreview"));

const PilotForm = lazy(() => import("../pages/PilotForm"));
const Pilot = lazy(() => import("../pages/Pilot"));
const Auth = lazy(() => import("../pages/Auth"));
const Admin = lazy(() => import("../pages/Admin"));
const NotFound = lazy(() => import("../pages/NotFound"));

const ContactUs = lazy(() => import("../pages/ContactUs"));

const Blog = lazy(() => import("../pages/Blog"));
const BlogPost = lazy(() => import("../pages/BlogPost"));
const BlogManagement = lazy(() => import("../pages/admin/BlogManagement"));
const BlogEditor = lazy(() => import("../pages/admin/BlogEditor"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const DataProtection = lazy(() => import("../pages/DataProtection"));
const RefundPolicy = lazy(() => import("../pages/RefundPolicy"));
const Learn = lazy(() => import("../pages/Learn"));
const Status = lazy(() => import("../pages/Status"));
const Announcements = lazy(() => import("../pages/Announcements"));
const AnnouncementPost = lazy(() => import("../pages/AnnouncementPost"));
const FeatureRequests = lazy(() => import("../pages/FeatureRequests"));
const UseHobson = lazy(() => import("../pages/UseHobson").then(module => ({ default: module.UseHobson })));
const UseHobson2 = lazy(() => import("../pages/UseHobson2").then(module => ({ default: module.UseHobson2 })));
const UseHobson3 = lazy(() => import("../pages/UseHobson3").then(module => ({ default: module.UseHobson3 })));
const Rotating = lazy(() => import("../pages/Rotating"));
const InvestorSummary = lazy(() => import("../pages/InvestorSummary"));
const Banners = lazy(() => import("../pages/Banners"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Declare global dataLayer for GTM
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// GTM Page Tracker Component - MUST be inside BrowserRouter context
const GTMPageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      
      // Push page view event to GTM
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search,
        page_title: document.title,
      });

      // Track homepage variant for A/B testing
      if (location.pathname === '/') {
        window.dataLayer.push({
          event: 'homepage_variant_view',
          variant: 'control',
          page_path: '/',
        });
      } else if (location.pathname === '/abtest') {
        window.dataLayer.push({
          event: 'homepage_variant_view',
          variant: 'test',
          page_path: '/abtest',
        });
      }
    }
  }, [location]);

  return null;
};

// Component that uses router hooks - must be inside BrowserRouter
const AppContent = () => {
  return (
    <>
      <GTMPageTracker />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Check if we're on pilot subdomain */}
          {window.location.hostname === 'pilot.hobsonschoice.ai' ? (
            <>
              <Route path="/" element={<LandingPageA />} />
              <Route path="/landing-a" element={<LandingPageA />} />
              <Route path="/landing-b" element={<LandingPageB />} />
              <Route path="/landing-c" element={<LandingPageC />} />
              <Route path="/pilot_form" element={<PilotForm />} />
              <Route path="/email-1" element={<EmailPreview />} />
              <Route path="*" element={<LandingPageA />} />
            </>
          ) : (
            <>
              {/* Main website routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/abtest" element={<HomepageABTest />} />
              <Route path="/homeowner" element={<HomepageHomeowner />} />
              <Route path="/property-management-software" element={<Navigate to="/" replace />} />
              <Route path="/home/property-management-software" element={<Navigate to="/" replace />} />
              <Route path="/real-estate-ai" element={<Navigate to="/" replace />} />
              <Route path="/tenancy-document" element={<Navigate to="/blog/making-light-work-of-a-tenancy-document" replace />} />
              <Route path="/features" element={<Navigate to="/learn/core-features" replace />} />
              <Route path="/features/real_estate_ai" element={<Navigate to="/" replace />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/pilot" element={<Pilot />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/data-protection" element={<DataProtection />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/learn" element={<Navigate to="/learn/welcome" replace />} />
              <Route path="/learn/introduction" element={<Navigate to="/learn/welcome" replace />} />
              <Route path="/learn/integrations" element={<Navigate to="/learn/available-integrations" replace />} />
              <Route path="/learn/prompt-engineering" element={<Navigate to="/learn/fundamentals" replace />} />
              <Route path="/learn/:section" element={<Learn />} />
              <Route path="/status" element={<Status />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/announcement/:slug" element={<AnnouncementPost />} />
              <Route path="/feature-requests" element={<FeatureRequests />} />
              <Route path="/usehobson" element={<UseHobson />} />
              <Route path="/quiz1" element={<UseHobson2 />} />
              <Route path="/quiz2" element={<UseHobson3 />} />
              <Route path="/carousel" element={<Rotating />} />
              <Route path="/investorsummary" element={<InvestorSummary />} />
              <Route path="/banners" element={<Banners />} />
              
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/blog" element={<BlogManagement />} />
              <Route path="/admin/blog/new" element={<BlogEditor />} />
              <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
              {/* Partnership route redirect */}
              <Route path="/partnership" element={<Navigate to="/" replace />} />
              {/* Temporary routes for testing landing pages in Lovable */}
              <Route path="/landing-a" element={<LandingPageA />} />
              <Route path="/landing-b" element={<LandingPageB />} />
              <Route path="/landing-c" element={<LandingPageC />} />
              <Route path="/pilot_form" element={<PilotForm />} />
              <Route path="/email-1" element={<EmailPreview />} />
              
              {/* Remove the AI-driven-property-management-software route from main domain */}
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </Suspense>
    </>
  );
};

export const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <HuggingFaceCacheManager />
      {/* Skip Navigation Links for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <AppContent />
    </ErrorBoundary>
  );
};