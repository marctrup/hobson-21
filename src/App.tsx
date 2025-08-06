import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load all pages for optimal bundle splitting
const Homepage = lazy(() => import("./components/Homepage").then(module => ({ default: module.Homepage })));
const SimpleHomepage = lazy(() => import("./components/SimpleHomepage").then(module => ({ default: module.SimpleHomepage })));
const LandingPageA = lazy(() => import("./pages/LandingPageA"));
const LandingPageB = lazy(() => import("./pages/LandingPageB"));
const LandingPageC = lazy(() => import("./pages/LandingPageC"));
const EmailPreview = lazy(() => import("./pages/EmailPreview"));
const BackgroundRemovalDemo = lazy(() => import("./pages/BackgroundRemovalDemo"));
const PilotForm = lazy(() => import("./pages/PilotForm"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Features = lazy(() => import("./pages/Features"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogManagement = lazy(() => import("./pages/admin/BlogManagement"));
const BlogEditor = lazy(() => import("./pages/admin/BlogEditor"));

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

const App = () => {
  console.log('🚀 App component is loading...');
  console.log('🌐 Current hostname:', window.location.hostname);
  console.log('📍 Current pathname:', window.location.pathname);
  
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div style={{ padding: '20px', fontFamily: 'Arial' }}>
              <h1>🔧 STEP 1: Basic Providers Working</h1>
              <p>Current URL: {window.location.href}</p>
              <p>Helmet, ErrorBoundary, QueryClient, and Router are working!</p>
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;