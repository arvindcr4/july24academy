"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ProgressBarProps } from "@/types/component-types";

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, size = 'default', ...props }, ref) => {
    const sizeClasses = {
      sm: "h-2",
      default: "h-4",
      lg: "h-6"
    };

    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-secondary",
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${Math.min(Math.max(0, value), max) / max * 100}%` }}
        />
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
