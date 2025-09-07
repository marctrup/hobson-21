import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProviders } from "@/AppProviders";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HuggingFaceCacheManager } from "@/components/HuggingFaceCacheManager";

// Lazy load all pages for optimal bundle splitting
const Homepage = lazy(() => import("./components/Homepage").then(module => ({ default: module.Homepage })));
const HomepageHomeowner = lazy(() => import("./components/HomepageHomeowner").then(module => ({ default: module.HomepageHomeowner })));
const SimpleHomepage = lazy(() => import("./components/SimpleHomepage").then(module => ({ default: module.SimpleHomepage })));
const LandingPageA = lazy(() => import("./pages/LandingPageA"));
const LandingPageB = lazy(() => import("./pages/LandingPageB"));
const LandingPageC = lazy(() => import("./pages/LandingPageC"));
const EmailPreview = lazy(() => import("./pages/EmailPreview"));

const PilotForm = lazy(() => import("./pages/PilotForm"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ContactUs = lazy(() => import("./pages/ContactUs"));

const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogManagement = lazy(() => import("./pages/admin/BlogManagement"));
const BlogEditor = lazy(() => import("./pages/admin/BlogEditor"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const DataProtection = lazy(() => import("./pages/DataProtection"));
const Learn = lazy(() => import("./pages/Learn"));
const Status = lazy(() => import("./pages/Status"));
const Announcements = lazy(() => import("./pages/Announcements"));
const AnnouncementPost = lazy(() => import("./pages/AnnouncementPost"));
const FeatureRequests = lazy(() => import("./pages/FeatureRequests"));
const UseHobson = lazy(() => import("./pages/UseHobson").then(module => ({ default: module.UseHobson })));
const UseHobson2 = lazy(() => import("./pages/UseHobson2").then(module => ({ default: module.UseHobson2 })));

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

// GTM Page Tracking Component
const GTMPageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views for GTM
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search,
        page_title: document.title
      });
    }
  }, [location]);

  return null;
};

const App = () => {
  return (
    <AppProviders>
      <ErrorBoundary>
        <HuggingFaceCacheManager />
        {/* Skip Navigation Links for Accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
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
                <Route path="/homeowner" element={<HomepageHomeowner />} />
                <Route path="/property-management-software" element={<Navigate to="/" replace />} />
                <Route path="/home/property-management-software" element={<Navigate to="/" replace />} />
                <Route path="/real-estate-ai" element={<Navigate to="/" replace />} />
                <Route path="/tenancy-document" element={<Navigate to="/blog/making-light-work-of-a-tenancy-document" replace />} />
                <Route path="/features" element={<Navigate to="/" replace />} />
                <Route path="/features/real_estate_ai" element={<Navigate to="/" replace />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/data-protection" element={<DataProtection />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/status" element={<Status />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/announcement/:slug" element={<AnnouncementPost />} />
                <Route path="/feature-requests" element={<FeatureRequests />} />
            <Route path="/usehobson" element={<UseHobson />} />
            <Route path="/usehobson2" element={<UseHobson2 />} />
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
      </ErrorBoundary>
    </AppProviders>
  );
};

export default App;