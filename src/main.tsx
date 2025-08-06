import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

console.log('🔄 ABSOLUTE MINIMAL TEST - Starting...');

// Inline component to avoid any imports
const MinimalApp = () => {
  console.log('🎯 MinimalApp rendering...');
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      backgroundColor: 'red',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>🔧 ABSOLUTE MINIMAL TEST</h1>
      <p>If you see this RED screen, React core is working!</p>
      <p>URL: {window.location.href}</p>
    </div>
  );
};

try {
  console.log('🎯 Looking for root element...');
  const rootElement = document.getElementById("root");
  console.log('🎯 Root element found:', !!rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  console.log('🚀 Creating React root...');
  const root = createRoot(rootElement);
  
  console.log('🎨 Rendering MinimalApp...');
  root.render(
    <StrictMode>
      <MinimalApp />
    </StrictMode>
  );
  
  console.log('✅ SUCCESS: React rendered!');
} catch (error) {
  console.error('❌ FAILED:', error);
}