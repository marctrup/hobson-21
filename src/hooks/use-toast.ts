import { toast as sonnerToast } from "sonner";

// Simple wrapper for Sonner toast to maintain compatibility with existing code
export function toast({ title, description, variant, ...props }: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: any;
}) {
  if (variant === "destructive") {
    return sonnerToast.error(title || description || "An error occurred", {
      description: title && description ? description : undefined,
      ...props
    });
  }
  
  return sonnerToast.success(title || description || "Success", {
    description: title && description ? description : undefined,
    ...props
  });
}

// Hook for compatibility with existing code
export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}