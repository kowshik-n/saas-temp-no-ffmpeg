import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  spinnerClassName?: string;
}

export function LoadingButton({
  children,
  isLoading = false,
  loadingText,
  spinnerClassName,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={className}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <div
          className={cn(
            "mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent",
            spinnerClassName
          )}
        />
      )}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
} 