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
import { PostSurvey } from './PostSurvey';
import { sanitizeInput, sanitizeRichText } from '@/utils/security';

const postSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .max(5000, "Description must be less than 5000 characters")
    .optional(),
  category: z.enum([
    'feedback',
    'feature-request', 
    'integrations',
    'questions',
    'bug-hunting'
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
];

export function CreatePostDialog({ open, onOpenChange, onPostCreated }: CreatePostDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newPostId, setNewPostId] = useState<string | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
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

      // Sanitize inputs before saving
      const sanitizedTitle = sanitizeInput(data.title);
      const sanitizedDescription = data.description ? sanitizeRichText(data.description) : '';

      const { data: newPost, error } = await supabase
        .from('feature_requests')
        .insert({
          title: sanitizedTitle,
          description: sanitizedDescription,
          category: data.category,
          author_id: user.id,
          author_name: authorName
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification email to team
      try {
        await supabase.functions.invoke('notify-feature-request', {
          body: {
            title: sanitizedTitle,
            description: sanitizedDescription,
            category: data.category,
            author_name: authorName,
            author_id: user.id
          }
        });
      } catch (notificationError) {
        // Don't fail the entire operation if notification fails
        console.error('Failed to send notification email:', notificationError);
      }

      toast({
        title: "Post created!",
        description: "Your feature request has been submitted successfully.",
      });

      // Show survey for the newly created post
      setNewPostId(newPost.id);
      setShowSurvey(true);
      reset();
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

  const handleCloseDialog = () => {
    setShowSurvey(false);
    setNewPostId(null);
    setSurveyCompleted(false);
    onOpenChange(false);
    onPostCreated();
  };

  const handleSurveyComplete = () => {
    setSurveyCompleted(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        {!showSurvey ? (
          <>
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
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{surveyCompleted ? "Thank You!" : "Quick Feedback"}</DialogTitle>
              <DialogDescription>
                {surveyCompleted 
                  ? "Thank you for your responses! This helps us prioritize development."
                  : "Help us prioritize your request by answering a few quick questions."
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {newPostId && <PostSurvey postId={newPostId} onComplete={handleSurveyComplete} />}
            </div>
            
            <DialogFooter>
              <Button onClick={handleCloseDialog}>
                {surveyCompleted ? "Close" : "Skip for now"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}