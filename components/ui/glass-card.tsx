import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  highlight?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({ className, highlight = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("rounded-2xl backdrop-blur-md bg-glass p-6", "border border-white/10", "transition-all duration-300 ease-in-out", highlight && "shadow-neon", className)}
      {...props}
    />
  );
});
GlassCard.displayName = "GlassCard";
