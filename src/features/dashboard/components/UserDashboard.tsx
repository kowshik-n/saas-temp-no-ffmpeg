import React, { useRef } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { SidebarMenu } from "./SidebarMenu";
import { TrialPlan } from "./TrialPlan";
import { NewProjectSection } from "./NewProjectSection";
import { ProjectsList } from "./ProjectsList";
import { usePro } from "@/context/ProContext";
import { useDashboard } from "../hooks/useDashboard";

interface UserDashboardProps {
  isPro: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  onImportSRT: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UserDashboard({
  isPro = false,
  fileInputRef,
  isUploading = false,
  onImportSRT = () => {},
}: UserDashboardProps) {
  const srtInputRef = useRef<HTMLInputElement>(null);
  const { checkProFeature } = usePro();
  const {
    selectedMenuItem,
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
  } = useDashboard();

  const handleUploadVideo = () => {
    fileInputRef.current?.click();
  };

  const handleImportSRT = () => {
    srtInputRef.current?.click();
  };

  // Render different content based on selected menu item
  const renderContent = () => {
    switch (selectedMenuItem) {
      case "projects":
        return (
          <>
            <NewProjectSection
              onUploadVideo={handleUploadVideo}
              onGenerateMagicClips={handleGenerateMagicClips}
              isPro={isPro}
            />
            <ProjectsList onUpload={handleUploadVideo} />
          </>
        );
      case "free":
        return (
          <div className="p-6 bg-white rounded-lg shadow-sm border border-border/50">
            <h2 className="text-2xl font-bold mb-6 text-foreground/90">
              Get 15 Free Videos
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm border border-orange-100 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-orange-700">
                  Invite Friends & Get Rewards
                </h3>
                <p className="mb-4">
                  Share your unique referral link with friends. When they sign
                  up, you'll both get 5 free video credits!
                </p>
                <div className="flex items-center mb-4">
                  <input
                    type="text"
                    value="https://submagic.com/ref/yourname123"
                    readOnly
                    className="flex-1 border border-border/50 rounded-l-md px-3 py-2 bg-white text-sm"
                  />
                  <button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-r-md transition-all shadow-sm">
                    Copy
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button className="flex items-center justify-center bg-[#1877F2] text-white p-2 rounded-md hover:bg-opacity-90 transition-all shadow-sm">
                    <span>Facebook</span>
                  </button>
                  <button className="flex items-center justify-center bg-[#1DA1F2] text-white p-2 rounded-md hover:bg-opacity-90 transition-all shadow-sm">
                    <span>Twitter</span>
                  </button>
                  <button className="flex items-center justify-center bg-[#25D366] text-white p-2 rounded-md hover:bg-opacity-90 transition-all shadow-sm">
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-background shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Your Referral Stats
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">
                      Invites Sent
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">
                      Friends Joined
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">
                      Credits Earned
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Invite more friends to earn additional credits. Each
                  successful referral gives you 5 free video credits.
                </p>
              </div>
            </div>
          </div>
        );
      case "affiliate":
        return (
          <div className="p-6 bg-white rounded-lg shadow-sm border border-border/50">
            <h2 className="text-2xl font-bold mb-6 text-foreground/90">
              Affiliate Program
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm border border-orange-100 mb-6">
                <h3 className="text-xl font-semibold mb-2 text-orange-700">
                  Earn 30% Commission
                </h3>
                <p className="mb-4">
                  Join our affiliate program and earn 30% commission on every
                  sale you refer. Commissions are paid monthly.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-md transition-all shadow-sm"
                >
                  Join Affiliate Program
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-border/50 rounded-lg p-5 bg-background shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Step 1</h3>
                  <p className="text-muted-foreground mb-3">
                    Sign up for our affiliate program and get your unique
                    referral link.
                  </p>
                </div>
                <div className="border border-border/50 rounded-lg p-5 bg-background shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Step 2</h3>
                  <p className="text-muted-foreground mb-3">
                    Share your link with your audience through your website,
                    social media, or email.
                  </p>
                </div>
                <div className="border border-border/50 rounded-lg p-5 bg-background shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Step 3</h3>
                  <p className="text-muted-foreground mb-3">
                    Earn 30% commission on every sale made through your link.
                  </p>
                </div>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-background shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Your Affiliate Stats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Conversions</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">$0.00</p>
                    <p className="text-sm text-muted-foreground">Earnings</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">$0.00</p>
                    <p className="text-sm text-muted-foreground">Paid Out</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Join our affiliate program to start earning commissions. You
                  need to be registered as an affiliate to see your stats.
                </p>
              </div>
            </div>
          </div>
        );
      case "request":
        return (
          <div className="p-6 bg-white rounded-lg shadow-sm border border-border/50">
            <h2 className="text-2xl font-bold mb-6 text-foreground/90">
              Feature Request
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm border border-orange-100 mb-6">
                <h3 className="text-xl font-semibold mb-2 text-orange-700">
                  We Value Your Feedback
                </h3>
                <p className="mb-4">
                  Help us improve Submagic by suggesting new features or
                  improvements. We regularly review all requests.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-background shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Submit a Feature Request
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Feature Title
                    </label>
                    <input
                      type="text"
                      className="w-full border border-border/50 rounded-md px-3 py-2"
                      placeholder="Enter a concise title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select className="w-full border border-border/50 rounded-md px-3 py-2 bg-background">
                      <option value="">Select a category</option>
                      <option value="subtitles">Subtitles</option>
                      <option value="video">Video Editing</option>
                      <option value="clips">Magic Clips</option>
                      <option value="export">Export Options</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full border border-border/50 rounded-md px-3 py-2 min-h-[120px]"
                      placeholder="Describe the feature you'd like to see and how it would help you"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input type="radio" name="priority" className="mr-2" />
                        <span>Low</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          className="mr-2"
                          checked
                        />
                        <span>Medium</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="priority" className="mr-2" />
                        <span>High</span>
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-md transition-all shadow-sm"
                  >
                    Submit Request
                  </button>
                </form>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-background shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Popular Requests</h3>
                <ul className="space-y-3">
                  <li className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                    <span>AI-powered subtitle generation</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </li>
                  <li className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                    <span>Batch processing for multiple videos</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Under Review
                    </span>
                  </li>
                  <li className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                    <span>Advanced text styling options</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      Planned
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <NewProjectSection
              onUploadVideo={handleUploadVideo}
              onGenerateMagicClips={handleGenerateMagicClips}
              isPro={isPro}
            />
            <ProjectsList onUpload={handleUploadVideo} />
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader
        onSearch={handleSearch}
        onNotificationsClick={handleNotificationsClick}
        onProfileClick={handleProfileClick}
        isTrialMode={!isPro}
        onRemoveWatermark={handleRemoveWatermark}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-border/50 p-4 hidden md:block bg-background/50">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              {!isPro && (
                <TrialPlan
                  onUpgrade={handleUpgrade}
                  videoUploads={videoUploads}
                  videoLimit={videoLimit}
                  clipUploads={clipUploads}
                  clipLimit={clipLimit}
                />
              )}

              <SidebarMenu
                onSelectItem={handleSelectMenuItem}
                selectedItem={selectedMenuItem}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6 bg-background/30">
          {renderContent()}
        </div>
      </div>

      <input
        ref={srtInputRef}
        type="file"
        accept=".srt"
        onChange={onImportSRT}
        className="hidden"
      />
    </div>
  );
}
