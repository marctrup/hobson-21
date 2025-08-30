import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/learn" element={<Learn />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
}