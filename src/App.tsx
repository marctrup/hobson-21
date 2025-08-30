import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";

function Ok() { 
  return <div>Testing ThemeProvider</div>; 
}

export default function App() {
  return (
    <StrictMode>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Ok />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </StrictMode>
  );
}