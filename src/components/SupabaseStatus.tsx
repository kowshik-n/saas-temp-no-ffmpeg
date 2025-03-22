import React from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

export function SupabaseStatus() {
  const { isConnected, isLoading, error } = useSupabase();

  const handleRetryConnection = async () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Alert className="bg-gray-100 border-gray-200">
        <LoadingSpinner size="sm" className="mr-2" />
        <AlertTitle>Checking database connection...</AlertTitle>
        <AlertDescription>Verifying connection to Supabase</AlertDescription>
      </Alert>
    );
  }

  if (error || !isConnected) {
    return (
      <ErrorMessage
        title="Database connection error"
        description={`Could not connect to Supabase. ${error?.message || ""}`}
        retryAction={handleRetryConnection}
        retryText="Retry connection"
      />
    );
  }

  return (
    <Alert className="bg-green-500/10 border-green-500/20">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertTitle>Database connected</AlertTitle>
      <AlertDescription>Successfully connected to Supabase</AlertDescription>
    </Alert>
  );
}
