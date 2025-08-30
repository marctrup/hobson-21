import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Ok() { 
  return <div>Basic test - no providers</div>; 
}

export default function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Ok />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}