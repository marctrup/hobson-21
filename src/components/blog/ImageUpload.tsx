import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadImageToStorage, deleteImageFromStorage } from "@/utils/uploadImageToStorage";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (url: string | null) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to storage
      const publicUrl = await uploadImageToStorage(file, fileName);
      
      setPreviewUrl(publicUrl);
      onImageChange(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (previewUrl && previewUrl.includes('blog-images')) {
      try {
        // Extract path from URL for deletion
        const urlParts = previewUrl.split('/blog-images/');
        if (urlParts.length > 1) {
          await deleteImageFromStorage(urlParts[1]);
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl && (
        <div className="relative w-full max-w-md">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemoveImage}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {!previewUrl && (
        <div className="w-full max-w-md h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No image selected</p>
          </div>
        </div>
      )}
    </div>
  );
};