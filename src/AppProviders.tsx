import React, { lazy, Suspense, useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastPortal } from "@/components/ToastPortal";
import { AppRoutes } from "@/components/AppRoutes";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const HobsonChatbot = lazy(() => import("@/components/HobsonChatbot").then(m => ({ default: m.HobsonChatbot })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Component to conditionally render chatbot based on route - deferred loading
const ChatbotWrapper = () => {
  const location = useLocation();
  const [shouldLoad, setShouldLoad] = useState(false);
  const hideChatbotRoutes = ['/investment-carousel', '/investor-summary'];

  useEffect(() => {
    // Defer chatbot loading until after initial paint + idle time
    const timer = setTimeout(() => setShouldLoad(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!shouldLoad || hideChatbotRoutes.includes(location.pathname)) {
    return null;
  }
  
  return (
    <Suspense fallback={null}>
      <HobsonChatbot />
    </Suspense>
  );
};

export function AppProviders() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <LanguageProvider>
              <AuthProvider>
                <ToastPortal />
                <AppRoutes />
                <ErrorBoundary>
                  <ChatbotWrapper />
                </ErrorBoundary>
              </AuthProvider>
            </LanguageProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}