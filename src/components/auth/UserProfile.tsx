import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePro } from "@/context/ProContext";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedButton } from "@/components/ui/themed-button";
import { ThemedCard } from "@/components/ui/themed-card";
import { brandColors } from "@/lib/theme-config";

export function UserProfile() {
  const { user, signOut } = useAuth();
  const { isPro } = usePro();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      // Error handling is now done in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <PageLayout containerSize="md" centered>
      <ThemedCard
        title={
          <>
            <div className="flex justify-center mb-4">
              <UserAvatar user={user} size="xl" />
            </div>
            {user.displayName || user.email?.split("@")[0]}
          </>
        }
        description={user.email}
        centered
        footer={
          <ThemedButton
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
            isLoading={isLoading}
            loadingText="Signing out..."
          >
            Sign out
          </ThemedButton>
        }
      >
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Account Status</h3>
          <div className="flex items-center">
            <div
              className={`h-3 w-3 rounded-full mr-2 ${
                isPro ? brandColors.success.bg : brandColors.warning.bg
              }`}
            ></div>
            <span>{isPro ? "Pro Account" : "Free Account"}</span>
          </div>
        </div>
      </ThemedCard>
    </PageLayout>
  );
}
