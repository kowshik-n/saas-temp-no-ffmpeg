import React from "react";
import { Search, Bell, FileVideo, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onNotificationsClick: () => void;
  onProfileClick: () => void;
  isTrialMode: boolean;
  onRemoveWatermark: () => void;
}

export function DashboardHeader({
  onSearch = () => {},
  onNotificationsClick = () => {},
  onProfileClick = () => {},
  isTrialMode = true,
  onRemoveWatermark = () => {},
}: DashboardHeaderProps) {
  const { user } = useAuth();

  // Get user initials for avatar
  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.substring(0, 1).toUpperCase() || "U";

  return (
    <div className="w-full bg-background border-b border-border/50 py-3 px-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-1.5 rounded-md mr-2">
              <FileVideo className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">CaptionCraft</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 w-64 h-9"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNotificationsClick}
            className="hover:bg-muted/50"
          >
            Mentions
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center hover:bg-muted/50"
            onClick={onProfileClick}
          >
            <span className="mr-1">What's new?</span>
            <div className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse"></span>
            </div>
          </Button>

          <Link to="/profile">
            <Button
              variant="ghost"
              className="rounded-full overflow-hidden"
              onClick={onProfileClick}
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </Button>
          </Link>
        </div>
      </div>

      {isTrialMode && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 px-6 py-2 flex justify-between items-center shadow-sm">
          <span className="font-medium">You're on Trial with watermark.</span>
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center shadow-sm transition-all"
            onClick={onRemoveWatermark}
          >
            <Zap className="h-4 w-4 mr-1 animate-pulse" /> Remove Watermark
          </Button>
        </div>
      )}
    </div>
  );
}
