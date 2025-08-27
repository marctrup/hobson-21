import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminBadgeProps {
  isVerifiedAdmin: boolean;
  className?: string;
}

export function AdminBadge({ isVerifiedAdmin, className }: AdminBadgeProps) {
  if (!isVerifiedAdmin) return null;
  
  return (
    <Badge 
      variant="secondary" 
      className={`bg-primary/10 text-primary border-primary/20 ${className}`}
    >
      <Shield className="w-3 h-3 mr-1" />
      Verified Staff
    </Badge>
  );
}