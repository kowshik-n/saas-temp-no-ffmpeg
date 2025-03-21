import { useState } from "react";
import { usePro } from "@/context/ProContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useDashboard() {
  const { isPro, checkProFeature } = usePro();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedMenuItem, setSelectedMenuItem] = useState("projects");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for usage stats
  const videoUploads = isPro ? 0 : 0;
  const videoLimit = 3;
  const clipUploads = isPro ? 0 : 0;
  const clipLimit = 1;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Searching for: ${query}`);
  };

  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleRemoveWatermark = () => {
    // Simplified functionality without pricing
    toast({
      title: "Feature Available",
      description: "This feature is available to all users.",
    });
  };

  return {
    selectedMenuItem,
    setSelectedMenuItem,
    searchQuery,
    videoUploads,
    videoLimit,
    clipUploads,
    clipLimit,
    handleSearch,
    handleNotificationsClick,
    handleProfileClick,
    handleRemoveWatermark,
  };
}
