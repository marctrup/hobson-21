import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Homepage } from "@/components/Homepage";
import Blog from "@/pages/Blog";
import Pricing from "@/pages/Pricing";
import ContactUs from "@/pages/ContactUs";
import Learn from "@/pages/Learn";

const queryClient = new QueryClient();

export default function App() {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/learn" element={<Learn />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
}