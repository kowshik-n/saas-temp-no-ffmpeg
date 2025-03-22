import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  centered?: boolean;
  padding?: boolean;
}

export function PageContainer({
  children,
  className,
  maxWidth = "lg",
  centered = false,
  padding = true,
}: PageContainerProps) {
  const maxWidthClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        maxWidthClasses[maxWidth],
        padding && "px-4 py-6",
        centered && "mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
} 