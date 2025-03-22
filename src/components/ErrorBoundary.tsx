import React from "react";
import { ErrorMessage } from "@/components/ui/error-message";
import { ThemedButton } from "@/components/ui/themed-button";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedCard } from "@/components/ui/themed-card";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <PageLayout centered>
          <ThemedCard
            title="Something went wrong"
            description="We've encountered an unexpected error"
            className="w-full max-w-md"
            centered
          >
            <div className="space-y-4">
              <ErrorMessage
                title="Application Error"
                description={this.state.error?.message || "An unknown error occurred"}
                variant="destructive"
              />
              
              <div className="flex justify-center mt-4">
                <ThemedButton 
                  onClick={this.handleReset}
                  variant="primary"
                >
                  Try again
                </ThemedButton>
              </div>
            </div>
          </ThemedCard>
        </PageLayout>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
} 