"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const ProgressBar = React.forwardRef(
  ({ className, value, max = 100, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative w-full h-4 overflow-hidden rounded-full bg-secondary",
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
