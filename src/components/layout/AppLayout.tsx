import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { SidebarMenu } from "@/features/dashboard/components/SidebarMenu";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { usePro } from "@/context/ProContext";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

export function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { isPro } = usePro();
  const {
    handleSearch,
    handleNotificationsClick,
    handleProfileClick,
    handleRemoveWatermark,
  } = useDashboard();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/30 p-4">
        <div className="w-full max-w-md text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SidebarMenu isPro={isPro} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          onSearch={handleSearch}
          onNotificationsClick={handleNotificationsClick}
          onProfileClick={handleProfileClick}
          isTrialMode={!isPro}
          onRemoveWatermark={handleRemoveWatermark}
        />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
