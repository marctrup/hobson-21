import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

function Ok() { 
  return <div>Testing HelmetProvider</div>; 
}

export default function App() {
  return (
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Ok />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  );
}