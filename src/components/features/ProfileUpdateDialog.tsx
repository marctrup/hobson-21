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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const profileSchema = z.object({
  display_name: z.string().min(2, "Display name must be at least 2 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProfileUpdateDialog({ open, onOpenChange, onSuccess }: ProfileUpdateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.display_name
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your display name has been updated successfully.",
      });

      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      let errorMessage = "Failed to update profile";
      
      // Check for uniqueness constraint violation
      if (error.code === '23505' && error.message.includes('profiles_display_name_unique')) {
        errorMessage = "This display name is already taken. Please choose a different one.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Display Name</DialogTitle>
          <DialogDescription>
            Change your display name that will be shown on your posts.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              {...register("display_name")}
              placeholder="Enter your preferred display name"
              disabled={isLoading}
            />
            {errors.display_name && (
              <p className="text-sm text-destructive">{errors.display_name.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}