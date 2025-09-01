import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { AuthForm } from '@/components/auth/AuthForm';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleToggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in required</DialogTitle>
          <DialogDescription>
            Please sign in to create a feature request post.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <AuthForm 
            mode={mode} 
            onToggleMode={handleToggleMode}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}