import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (user) {
    // If user is already logged in, redirect to the dashboard or the page they were trying to access
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
