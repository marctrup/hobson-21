import * as React from "react";
import * as Primitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = Primitive.Root;
export const DropdownMenuTrigger = Primitive.Trigger;
export const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof Primitive.Content>, React.ComponentPropsWithoutRef<typeof Primitive.Content>>(({ className, sideOffset = 4, ...props }, ref) => <Primitive.Portal><Primitive.Content ref={ref} sideOffset={sideOffset} className={cn("z-[1000] min-w-40 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} /></Primitive.Portal>);
DropdownMenuContent.displayName = "DropdownMenuContent";
export const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof Primitive.Item>, React.ComponentPropsWithoutRef<typeof Primitive.Item>>(({ className, ...props }, ref) => <Primitive.Item ref={ref} className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props} />);
DropdownMenuItem.displayName = "DropdownMenuItem";