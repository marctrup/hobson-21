import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  category: z.enum([
    'feedback',
    'feature-request', 
    'integrations',
    'questions',
    'bug-hunting',
    'lovable-project',
    'ama'
  ])
});

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
}

const categoryOptions = [
  { value: 'feedback', label: 'Feedback', emoji: '📣' },
  { value: 'feature-request', label: 'Feature Request', emoji: '💡' },
  { value: 'integrations', label: 'Integrations', emoji: '🧩' },
  { value: 'questions', label: 'Questions', emoji: '⁉️' },
  { value: 'bug-hunting', label: 'Bug Hunting', emoji: '🐛' },
  { value: 'lovable-project', label: 'Lovable Project', emoji: '🏆' },
  { value: 'ama', label: 'AMA', emoji: '💬' },
];

export function CreatePostDialog({ open, onOpenChange, onPostCreated }: CreatePostDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      category: 'feature-request'
    }
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get user profile for author name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      const authorName = profile?.display_name || user.email || 'Anonymous';

      const { error } = await supabase
        .from('feature_requests')
        .insert({
          title: data.title,
          description: data.description || '',
          category: data.category,
          author_id: user.id,
          author_name: authorName
        });

      if (error) throw error;

      toast({
        title: "Post created!",
        description: "Your feature request has been submitted successfully.",
      });

      reset();
      onOpenChange(false);
      onPostCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your feedback, feature request, or question with the community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={(value) => setValue('category', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <span>{option.emoji}</span>
                      <span>{option.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Describe your request in a few words..."
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Provide additional details about your request..."
              className="min-h-[100px]"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}