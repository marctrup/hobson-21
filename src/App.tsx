import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HuggingFaceCacheManager } from "@/components/HuggingFaceCacheManager";

// Lazy load all pages for optimal bundle splitting
const Homepage = lazy(() => import("./components/Homepage").then(module => ({ default: module.Homepage })));
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

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Create a simple query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

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
  // Temporary minimal app to test React initialization
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold">React Test</h1>
        <p>If you see this, React is working</p>
      </div>
    </div>
  );
};

export default App;
