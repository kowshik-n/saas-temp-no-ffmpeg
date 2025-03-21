import { useState } from "react";
import { usePro } from "@/context/ProContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { upgradeUserToPro } from "@/services/userService";

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

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to upgrade to Pro",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      if (user) {
        await upgradeUserToPro(user.uid);
      }
      toast({
        title: "Upgrade Successful",
        description: "You are now a Pro user!",
      });
    } catch (error) {
      console.error("Error upgrading:", error);
      toast({
        title: "Upgrade Failed",
        description: "There was an error upgrading your account",
        variant: "destructive",
      });
    }
  };

  const handleRemoveWatermark = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to remove watermarks",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    toast({
      title: "Pro Feature",
      description: "Upgrade to Pro to remove watermarks",
    });
  };

  const handleSelectMenuItem = (item: string) => {
    setSelectedMenuItem(item);
  };

  const handleGenerateMagicClips = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to generate magic clips",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const magicClipsFeature = checkProFeature("magic-clips");
    if (!magicClipsFeature.allowed) {
      toast({
        title: "Pro Feature",
        description:
          magicClipsFeature.message || "This feature requires a Pro account",
      });
      return;
    }

    toast({
      title: "Generating Clips",
      description: "Your magic clips are being generated",
    });
  };

  return {
    isPro,
    selectedMenuItem,
    searchQuery,
    videoUploads,
    videoLimit,
    clipUploads,
    clipLimit,
    handleSearch,
    handleNotificationsClick,
    handleProfileClick,
    handleUpgrade,
    handleRemoveWatermark,
    handleSelectMenuItem,
    handleGenerateMagicClips,
  };
}
