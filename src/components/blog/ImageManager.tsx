import React, { useState } from "react";
import { Upload, Image as ImageIcon, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ImageManagerProps {
  onImageInsert: (imageUrl: string, altText: string) => void;
}

const ImageManager = ({ onImageInsert }: ImageManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [altText, setAltText] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check if alt text is provided
    if (!altText.trim()) {
      toast({
        title: "Alt text required",
        description: "Please provide alt text for SEO and accessibility",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      onImageInsert(urlData.publicUrl, altText);
      setOpen(false);
      setAltText("");
      
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded with alt text and inserted into your blog",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please enter a description for the image",
        variant: "destructive",
      });
      return;
    }

    if (!altText.trim()) {
      toast({
        title: "Alt text required",
        description: "Please provide alt text for SEO and accessibility",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch('/api/generate-blog-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const { image } = await response.json();
      
      onImageInsert(image, altText);
      setOpen(false);
      setPrompt("");
      setAltText("");
      
      toast({
        title: "Image generated",
        description: "AI-generated image with alt text has been inserted into your blog",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate image. Please try again or upload an image instead.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ImageIcon className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Image to Blog</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Alt Text Field - Shared for both upload and generation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Image Description (Alt Text)</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="alt-text">Alt Text *</Label>
                <Input
                  id="alt-text"
                  placeholder="Describe the image for SEO and accessibility..."
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Required for SEO and accessibility compliance
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading || !altText.trim()}
                    className="hidden"
                  />
                </Label>
                {uploading && (
                  <p className="text-sm text-muted-foreground text-center">
                    Uploading...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Generation Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Generate with AI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="prompt">Image Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="A professional office building with modern architecture..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={generating}
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleGenerateImage}
                  disabled={generating || !prompt.trim() || !altText.trim()}
                  className="w-full"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {generating ? 'Generating...' : 'Generate Image'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageManager;