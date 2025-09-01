import React, { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const SimpleCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
SimpleCard.displayName = "SimpleCard";

const SimpleCardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
SimpleCardContent.displayName = "SimpleCardContent";

export { SimpleCard, SimpleCardContent };