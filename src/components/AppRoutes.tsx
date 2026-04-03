import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HuggingFaceCacheManager } from "@/components/HuggingFaceCacheManager";
import { Homepage } from "./Homepage";
import Pricing from "../pages/Pricing";

// Lazy load secondary routes to keep initial navigation responsive
const LandingPageA = lazy(() => import("../pages/LandingPageA"));
const LandingPageB = lazy(() => import("../pages/LandingPageB"));
const LandingPageC = lazy(() => import("../pages/LandingPageC"));
const EmailPreview = lazy(() => import("../pages/EmailPreview"));

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
const BreachProtocol = lazy(() => import("../pages/BreachProtocol"));
const RefundPolicy = lazy(() => import("../pages/RefundPolicy"));
const Learn = lazy(() => import("../pages/Learn"));
const Status = lazy(() => import("../pages/Status"));
const Announcements = lazy(() => import("../pages/Announcements"));
const AnnouncementPost = lazy(() => import("../pages/AnnouncementPost"));
const FeatureRequests = lazy(() => import("../pages/FeatureRequests"));
const UseHobson = lazy(() => import("../pages/UseHobson").then(module => ({ default: module.UseHobson })));
const InPractice = lazy(() => import("../pages/InPractice"));
const FaqManagement = lazy(() => import("../pages/admin/FaqManagement"));
const GlossaryManagement = lazy(() => import("../pages/admin/GlossaryManagement"));
const InvestmentOpportunity = lazy(() => import("../pages/InvestmentOpportunity"));
const InvestorSummary = lazy(() => import("../pages/InvestorSummary"));
const Features = lazy(() => import("../pages/Features"));

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
              <Route path="/email-1" element={<EmailPreview />} />
              <Route path="*" element={<LandingPageA />} />
            </>
          ) : (
            <>
              {/* Main website routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/property-management-software" element={<Navigate to="/" replace />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/data-protection" element={<DataProtection />} />
              <Route path="/breach-protocol" element={<BreachProtocol />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/learn" element={<Navigate to="/learn/faq" replace />} />
              <Route path="/learn/introduction" element={<Navigate to="/learn/faq" replace />} />
              <Route path="/learn/getting-started" element={<Navigate to="/learn/faq" replace />} />
              <Route path="/learn/Positioning-Statement" element={<Navigate to="/learn/faq" replace />} />
              <Route path="/learn/positioning-statement" element={<Navigate to="/learn/faq" replace />} />
              <Route path="/learn/integrations" element={<Navigate to="/learn/available-integrations" replace />} />
              <Route path="/learn/setup-guide" element={<Navigate to="/learn/faq" replace />} />
              <Route path="/learn/api-reference" element={<Navigate to="/learn/faq" replace />} />
              <Route path="/learn/troubleshooting" element={<Navigate to="/learn/faq" replace />} />
              <Route path="/learn/fundamentals" element={<Navigate to="/learn/prompt-engineering" replace />} />
              <Route path="/learn/plans-credits" element={<Navigate to="/learn/faq" replace />} />
              <Route path="/learn/:section" element={<Learn />} />
              <Route path="/status" element={<Status />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/announcement/:slug" element={<AnnouncementPost />} />
              <Route path="/feature-requests" element={<FeatureRequests />} />
              <Route path="/usehobson" element={<UseHobson />} />
              <Route path="/in-practice" element={<InPractice />} />
              <Route path="/features" element={<Features />} />
              <Route path="/learn/features" element={<Navigate to="/features" replace />} />
              <Route path="/learn/core-features" element={<Navigate to="/features" replace />} />
              <Route path="/learn/use-cases" element={<Navigate to="/in-practice" replace />} />
              <Route path="/use-cases" element={<Navigate to="/in-practice" replace />} />
              <Route path="/investment-opportunity" element={<InvestmentOpportunity />} />
              <Route path="/investor-summary" element={<InvestorSummary />} />
              
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/faq-management" element={<FaqManagement />} />
              <Route path="/admin/glossary-management" element={<GlossaryManagement />} />
              <Route path="/admin/blog" element={<BlogManagement />} />
              <Route path="/admin/blog/new" element={<BlogEditor />} />
              <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
              
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
