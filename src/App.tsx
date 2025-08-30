import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Homepage } from "@/components/Homepage";

const queryClient = new QueryClient();

function TestPage() { 
  return <div>Test page placeholder</div>; 
}

export default function App() {
  return (
    <StrictMode>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/blog" element={<TestPage />} />
                <Route path="/pricing" element={<TestPage />} />
                <Route path="/contact" element={<TestPage />} />
                <Route path="/learn" element={<TestPage />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </StrictMode>
  );
}