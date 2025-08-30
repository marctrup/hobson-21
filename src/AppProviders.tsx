import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastPortal } from "@/components/ToastPortal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ToastPortal />
              {children}
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}