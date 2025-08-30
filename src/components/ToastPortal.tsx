import { Toaster } from "sonner";

export function ToastPortal() {
  // No next-themes hooks here to avoid React hooks dispatcher issues
  return <Toaster theme="system" richColors position="top-center" />;
}