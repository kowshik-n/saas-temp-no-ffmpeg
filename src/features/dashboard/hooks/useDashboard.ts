import { useState } from "react";
import { usePro } from "@/context/ProContext";

export function useDashboard() {
  const { isPro, checkProFeature } = usePro();
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
    console.log("Notifications clicked");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const handleUpgrade = () => {
    console.log("Upgrade plan clicked");
    // In a real app, this would navigate to a pricing page or open a payment modal
  };

  const handleRemoveWatermark = () => {
    console.log("Remove watermark clicked");
    // In a real app, this would navigate to a pricing page or open a payment modal
  };

  const handleSelectMenuItem = (item: string) => {
    setSelectedMenuItem(item);
    console.log(`Selected menu item: ${item}`);
  };

  const handleGenerateMagicClips = () => {
    const magicClipsFeature = checkProFeature("magic-clips");
    if (!magicClipsFeature.allowed) {
      console.log(magicClipsFeature.message);
      // In a real app, this would show a toast or modal with the message
      return;
    }
    console.log("Generate magic clips");
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
