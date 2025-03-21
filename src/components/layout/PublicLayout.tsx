import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from "@/features/landing/components/AppHeader";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
