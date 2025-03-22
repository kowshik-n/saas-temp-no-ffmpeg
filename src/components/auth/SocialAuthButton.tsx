import React from "react";
import { ThemedButton } from "@/components/ui/themed-button";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple, FaFacebook, FaTwitter } from "react-icons/fa";

type SocialProvider = "google" | "github" | "apple" | "facebook" | "twitter";

interface SocialAuthButtonProps {
  provider: SocialProvider;
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SocialAuthButton({
  provider,
  onClick,
  isLoading = false,
  className,
}: SocialAuthButtonProps) {
  const getProviderIcon = () => {
    switch (provider) {
      case "google":
        return <FcGoogle className="h-5 w-5" />;
      case "github":
        return <FaGithub className="h-5 w-5" />;
      case "apple":
        return <FaApple className="h-5 w-5" />;
      case "facebook":
        return <FaFacebook className="h-5 w-5 text-blue-600" />;
      case "twitter":
        return <FaTwitter className="h-5 w-5 text-blue-400" />;
    }
  };

  const getProviderText = () => {
    switch (provider) {
      case "google":
        return "Continue with Google";
      case "github":
        return "Continue with GitHub";
      case "apple":
        return "Continue with Apple";
      case "facebook":
        return "Continue with Facebook";
      case "twitter":
        return "Continue with Twitter";
    }
  };

  return (
    <ThemedButton
      variant="outline"
      className={cn("w-full", className)}
      onClick={onClick}
      disabled={isLoading}
      isLoading={isLoading}
      loadingText={`Signing in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`}
      icon={getProviderIcon()}
    >
      {getProviderText()}
    </ThemedButton>
  );
} 