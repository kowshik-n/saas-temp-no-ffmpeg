import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from "@/features/landing/components/AppHeader";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function PublicLayout() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white flex flex-col">
        <AppHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}
