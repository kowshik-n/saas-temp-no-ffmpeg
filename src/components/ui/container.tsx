import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
  centered?: boolean;
  fullWidth?: boolean;
}

/**
 * Container component provides consistent width constraints and spacing
 * This is a base layout component used throughout the application
 */
export function Container({
  children,
  className,
  size = "lg",
  padding = true,
  centered = true,
  fullWidth = false,
}: ContainerProps) {
  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "w-full",
  };

  return (
    <div
      className={cn(
        fullWidth ? "w-full" : sizeClasses[size],
        centered && "mx-auto",
        padding && "px-4 py-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
