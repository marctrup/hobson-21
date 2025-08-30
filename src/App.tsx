import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Link } from "react-router-dom";

const queryClient = new QueryClient();

function BasicHomepage() { 
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">Hobson AI</div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
              <Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
              <Link to="/learn" className="text-muted-foreground hover:text-foreground">Learn</Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Simple Hero */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI-powered document insights
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your property documents with intelligent analysis
          </p>
        </div>
      </main>
    </div>
  );
}

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
                <Route path="/" element={<BasicHomepage />} />
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