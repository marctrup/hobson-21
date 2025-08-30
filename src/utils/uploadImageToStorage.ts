import { supabase } from "@/integrations/supabase/client";

export const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(path);

  return publicUrl;
};

export const deleteImageFromStorage = async (path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('blog-images')
    .remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};