# Hobson Chat Widget - Installation Guide

This guide will help you embed the Hobson AI chatbot on any external website.

## Quick Setup

Add this code snippet to your website's HTML, just before the closing `</body>` tag:

```html
<!-- Hobson Chat Widget -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/react-markdown@9/umd/react-markdown.production.min.js"></script>
<script src="YOUR_HOSTED_WIDGET_URL/hobson-chat-widget.js"></script>

<script>
  // Initialize the widget when page loads
  window.addEventListener('DOMContentLoaded', function() {
    window.HobsonChatWidget.init();
  });
</script>

<!-- Tailwind CSS for styling -->
<script src="https://cdn.tailwindcss.com"></script>
```

## What You Need

1. **Host the widget file**: Upload `hobson-chat-widget.js` to your web server or CDN
2. **Host the owl image**: Upload `/public/lovable-uploads/owl-chat-bubble.png` to your server
3. **Update the image path**: In the widget code, update `OWL_CHAT_BUBBLE` to point to your hosted image

## Customization Options

### Change Widget Position
The widget is positioned at bottom-right by default. To change position, modify the classes in the button:

```javascript
// Bottom-left instead
className="fixed bottom-6 left-6 z-[9998]..."

// Top-right
className="fixed top-6 right-6 z-[9998]..."
```

### Custom Container
If you want the widget in a specific container instead of as a floating button:

```html
<div id="my-chat-container"></div>
<script>
  window.HobsonChatWidget.init('my-chat-container');
</script>
```

## How It Works

The widget:
- ✅ Connects to your existing Hobson chat backend at: `https://awfyhgeflakjhxtntokd.supabase.co/functions/v1/hobson-chat`
- ✅ Uses the same knowledge base and AI responses
- ✅ Works on any website (WordPress, Shopify, custom HTML, etc.)
- ✅ No authentication required
- ✅ Fully responsive (mobile + desktop)

## Build Process

To create the production widget file:

1. Add this to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/widget/HobsonChatWidget.tsx',
      name: 'HobsonChatWidget',
      fileName: 'hobson-chat-widget',
      formats: ['umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

2. Run: `npm run build`
3. The widget file will be in `dist/hobson-chat-widget.umd.js`

## Testing Locally

Create a simple HTML file to test:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Hobson Widget</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <h1>My Website</h1>
  <p>The chat widget should appear in the bottom-right corner.</p>

  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="YOUR_WIDGET_PATH/hobson-chat-widget.js"></script>
  <script>
    window.addEventListener('DOMContentLoaded', function() {
      window.HobsonChatWidget.init();
    });
  </script>
</body>
</html>
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify the widget file is loading correctly
3. Ensure Tailwind CSS is loaded
4. Confirm the image path is correct

## Security Note

The chat function is public and doesn't require authentication. All conversations are processed through your Supabase edge function which has built-in rate limiting.
