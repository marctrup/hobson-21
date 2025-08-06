import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// import './index.css' - TEMPORARILY REMOVED TO TEST

console.log('🔄 Starting React application...');
console.log('📦 Main.tsx loaded successfully');

try {
  const rootElement = document.getElementById("root");
  console.log('🎯 Root element found:', !!rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  console.log('🚀 About to create React root...');
  const root = createRoot(rootElement);
  
  console.log('🎨 About to render App...');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('✅ React app rendered successfully!');
} catch (error) {
  console.error('❌ Error mounting React app:', error);
  
  // Show error in the root element
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; background: red; color: white; font-family: Arial;">
        <h1>React Mount Error</h1>
        <p>Error: ${error}</p>
        <p>Check console for details</p>
      </div>
    `;
  }
}
