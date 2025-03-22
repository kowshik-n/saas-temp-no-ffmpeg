import React from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { ProjectsList } from "@/features/dashboard/components/ProjectsList";
import { NewProjectSection } from "@/features/dashboard/components/NewProjectSection";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { usePro } from "@/context/ProContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { loading, isAuthenticated } = useProtectedRoute();
  const { isPro } = usePro();
  const navigate = useNavigate();
  const {
    handleSearch,
    handleNotificationsClick,
    handleProfileClick,
    handleRemoveWatermark,
  } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/30 p-4">
        <div className="w-full max-w-md text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onSearch={handleSearch}
        onNotificationsClick={handleNotificationsClick}
        onProfileClick={handleProfileClick}
        isTrialMode={!isPro}
        onRemoveWatermark={handleRemoveWatermark}
      />

      <main className="w-full py-8">
        <Container size="2xl">
          <div className="grid grid-cols-1 gap-8">
            <NewProjectSection
              onUploadVideo={() => navigate("/new-project")}
              onGenerateMagicClips={() => navigate("/new-project")}
              isPro={isPro}
            />
            <ProjectsList onUpload={() => navigate("/new-project")} />
          </div>
        </Container>
      </main>
    </div>
  );
}
