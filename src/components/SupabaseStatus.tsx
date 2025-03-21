import React from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

export function SupabaseStatus() {
  const { isConnected, isLoading, error } = useSupabase();

  const handleRetryConnection = async () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Alert className="bg-gray-100 border-gray-200">
        <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
        <AlertTitle>Checking database connection...</AlertTitle>
        <AlertDescription>Verifying connection to Supabase</AlertDescription>
      </Alert>
    );
  }

  if (error || !isConnected) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Database connection error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>Could not connect to Supabase. {error?.message}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetryConnection}
            className="self-start mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Retry connection
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-green-50 border-green-200">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle>Database connected</AlertTitle>
      <AlertDescription>Successfully connected to Supabase</AlertDescription>
    </Alert>
  );
}
