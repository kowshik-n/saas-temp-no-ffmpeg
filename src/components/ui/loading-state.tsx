import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
  spinnerSize?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function LoadingState({
  text = "Loading...",
  fullScreen = true,
  className,
  spinnerSize = "lg",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen && "fixed inset-0 bg-white bg-opacity-80 z-50",
        !fullScreen && "p-8",
        className
      )}
    >
      <LoadingSpinner size={spinnerSize} />
      {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
    </div>
  );
} 