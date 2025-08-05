import { useEffect } from 'react';

const EmailPreview = () => {
  useEffect(() => {
    document.title = 'Email Template Preview - Hobson AI';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Template Preview</h1>
          <p className="text-gray-600 mb-4">This is how your email will look to recipients:</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe 
            src="/email-1.html" 
            className="w-full h-[800px] border-0"
            title="Email Template Preview"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;