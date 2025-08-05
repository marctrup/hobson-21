import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load all pages for optimal bundle splitting
const CompleteHomepage = lazy(() => import("./components/CompleteHomepage").then(module => ({ default: module.CompleteHomepage })));
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
    <div className="text-center">
      <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
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
  return (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* Skip Navigation Links for Accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to main content
          </a>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
                  <Route path="/" element={<Navigate to="/property-management-software" replace />} />
                  <Route path="/property-management-software" element={<CompleteHomepage />} />
                  <Route path="/home/property-management-software" element={<Navigate to="/" replace />} />
                  <Route path="/real-estate-ai" element={<Navigate to="/" replace />} />
                  <Route path="/features" element={<Navigate to="/features/real_estate_ai" replace />} />
                  <Route path="/features/real_estate_ai" element={<Features />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/about/property-ai" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/blog" element={<BlogManagement />} />
                  <Route path="/admin/blog/new" element={<BlogEditor />} />
                  <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
                  {/* Temporary routes for testing landing pages in Lovable */}
                  <Route path="/landing-a" element={<LandingPageA />} />
                  <Route path="/landing-b" element={<LandingPageB />} />
                  <Route path="/landing-c" element={<LandingPageC />} />
                  <Route path="/pilot_form" element={<PilotForm />} />
                  <Route path="/email-1" element={<EmailPreview />} />
                  <Route path="/background-removal" element={<BackgroundRemovalDemo />} />
                  {/* Remove the AI-driven-property-management-software route from main domain */}
                  <Route path="*" element={<NotFound />} />
                </>
              )}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
  );
};

export default App;
