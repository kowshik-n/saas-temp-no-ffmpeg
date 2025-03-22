import React from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  withPadding?: boolean;
  withMargin?: boolean;
  centered?: boolean;
  fullHeight?: boolean;
}

export function PageLayout({
  children,
  className,
  containerSize = "lg",
  withPadding = true,
  withMargin = true,
  centered = false,
  fullHeight = false,
}: PageLayoutProps) {
  const containerSizes = {
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
        containerSizes[containerSize],
        "mx-auto",
        withPadding && "py-6 px-4",
        withMargin && "my-4",
        centered && "flex flex-col items-center",
        fullHeight && "min-h-[calc(100vh-4rem)]",
        className
      )}
    >
      {children}
    </div>
  );
} 