import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { processImageFromUrl } from '@/utils/backgroundRemoval';

const BackgroundRemovalDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const handleRemoveBackground = async () => {
    setIsProcessing(true);
    try {
      const originalImageUrl = '/lovable-uploads/735fbb96-d04d-4539-b924-4c4047f8d6aa.png';
      const processedBlob = await processImageFromUrl(originalImageUrl);
      
      // Create URL for the processed image
      const url = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(url);
      
      // Download the processed image
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document-no-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Background Removal Demo</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Original Image</h2>
            <img 
              src="/lovable-uploads/735fbb96-d04d-4539-b924-4c4047f8d6aa.png" 
              alt="Original document" 
              className="w-full max-w-md border rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Processed Image</h2>
            {processedImageUrl ? (
              <img 
                src={processedImageUrl} 
                alt="Document with background removed" 
                className="w-full max-w-md border rounded-lg"
              />
            ) : (
              <div className="w-full max-w-md h-64 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Processed image will appear here</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <Button 
            onClick={handleRemoveBackground} 
            disabled={isProcessing}
            size="lg"
          >
            {isProcessing ? 'Processing...' : 'Remove Background'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemovalDemo;