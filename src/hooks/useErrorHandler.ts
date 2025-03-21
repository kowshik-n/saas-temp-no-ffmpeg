import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

export function useErrorHandler() {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback(
    (err: unknown, customMessage?: string) => {
      const errorMessage = getErrorMessage(err);
      console.error(errorMessage, err);
      setError(err instanceof Error ? err : new Error(errorMessage));

      toast({
        variant: "destructive",
        title: customMessage || "An error occurred",
        description: errorMessage,
      });

      return errorMessage;
    },
    [toast],
  );

  return { error, handleError, setError };
}
