import { Suspense, lazy, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BasicHomepage } from "@/components/BasicHomepage";

// Lazy load all pages for optimal bundle splitting
const Homepage = lazy(() => import("./components/Homepage"));
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
  return (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {/* Skip Navigation Links for Accessibility */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip to main content
            </a>
            <BrowserRouter>
            <GTMPageTracker />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              
              {/* Authentication */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Main Pages */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/pilot" element={<PilotForm />} />
              <Route path="/pilot_form" element={<PilotForm />} />
              
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/data-protection" element={<DataProtection />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/blog" element={<BlogManagement />} />
              <Route path="/admin/blog/new" element={<BlogEditor />} />
              <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
              
              {/* Other Pages */}
              <Route path="/status" element={<Status />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/announcements/:slug" element={<AnnouncementPost />} />
              <Route path="/feature-requests" element={<FeatureRequests />} />
              
              {/* Alternative Landings */}
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/simple" element={<SimpleHomepage />} />
              <Route path="/landing-a" element={<LandingPageA />} />
              <Route path="/landing-b" element={<LandingPageB />} />
              <Route path="/landing-c" element={<LandingPageC />} />
              <Route path="/email-preview" element={<EmailPreview />} />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
  );
};

export default App;
