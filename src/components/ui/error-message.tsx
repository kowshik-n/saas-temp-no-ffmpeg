import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThemedButton } from "@/components/ui/themed-button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  description?: string;
  retryAction?: () => void;
  retryText?: string;
  className?: string;
  variant?: "default" | "destructive";
}

export function ErrorMessage({
  title = "Error",
  description = "Something went wrong. Please try again later.",
  retryAction,
  retryText = "Try again",
  className,
  variant = "destructive",
}: ErrorMessageProps) {
  return (
    <Alert 
      variant={variant}
      className={cn("border-red-200 bg-red-50", className)}
    >
      <AlertTriangle className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-800">{title}</AlertTitle>
      <AlertDescription className="text-red-700">
        <p className="mb-4">{description}</p>
        {retryAction && (
          <ThemedButton variant="outline" onClick={retryAction}>
            {retryText}
          </ThemedButton>
        )}
      </AlertDescription>
    </Alert>
  );
} 