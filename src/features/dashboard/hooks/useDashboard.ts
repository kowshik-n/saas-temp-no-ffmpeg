import { useState, useCallback } from "react";
import { usePro } from "@/context/ProContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useProjects } from "./useProjects";

export function useDashboard() {
  const { isPro, checkProFeature } = usePro();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = useProjects();

  const [selectedMenuItem, setSelectedMenuItem] = useState("projects");
  const [searchQuery, setSearchQuery] = useState("");

  // Usage stats based on actual projects
  const videoUploads = projects?.length || 0;
  const videoLimit = isPro ? Infinity : 3;
  const clipUploads = 0; // Future feature
  const clipLimit = isPro ? Infinity : 1;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleNotificationsClick = useCallback(() => {
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
  }, [toast]);

  const handleProfileClick = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  const handleUpgrade = useCallback(() => {
    navigate("/pricing");
  }, [navigate]);

  const handleRemoveWatermark = useCallback(() => {
    if (!isPro) {
      toast({
        title: "Pro Feature",
        description: "Upgrade to Pro to remove watermarks",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Watermark Removed",
      description: "Your videos will no longer have watermarks",
    });
  }, [isPro, toast]);

  const handleSelectMenuItem = useCallback((item: string) => {
    setSelectedMenuItem(item);
  }, []);

  const handleGenerateMagicClips = useCallback(() => {
    if (!isPro) {
      toast({
        title: "Pro Feature",
        description: "Upgrade to Pro to use Magic Clips",
        variant: "destructive",
      });
      return;
    }

    navigate("/new-project");
  }, [isPro, navigate, toast]);

  return {
    selectedMenuItem,
    setSelectedMenuItem,
    searchQuery,
    videoUploads,
    videoLimit,
    clipUploads,
    clipLimit,
    projectsLoading,
    handleSearch,
    handleNotificationsClick,
    handleProfileClick,
    handleUpgrade,
    handleRemoveWatermark,
    handleSelectMenuItem,
    handleGenerateMagicClips,
  };
}
