import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastPortal } from "@/components/ToastPortal";
import { AppRoutes } from "@/components/AppRoutes";
import { HobsonChatbot } from "@/components/HobsonChatbot";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Component to conditionally render chatbot based on route
const ChatbotWrapper = () => {
  const location = useLocation();
  const hideChatbotRoutes = ['/investment-carousel', '/investor-summary'];
  
  if (hideChatbotRoutes.includes(location.pathname)) {
    return null;
  }
  
  return <HobsonChatbot />;
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
                <ChatbotWrapper />
              </AuthProvider>
            </LanguageProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}