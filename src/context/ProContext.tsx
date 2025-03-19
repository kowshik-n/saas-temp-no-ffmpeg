import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProContextType {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
  checkProFeature: (featureName: string) => {
    allowed: boolean;
    message?: string;
  };
}

interface ProFeature {
  limit?: number;
  message: string;
}

type ProFeatures = Record<string, ProFeature>;

const ProContext = createContext<ProContextType | undefined>(undefined);

interface ProProviderProps {
  children: ReactNode;
}

export function ProProvider({ children }: ProProviderProps) {
  const [isPro, setIsPro] = useState(false);

  const proFeatures: ProFeatures = {
    "unlimited-subtitles": {
      limit: 10,
      message: "Upgrade to Pro to add unlimited subtitles",
    },
    "split-subtitle": {
      message: "Upgrade to Pro to use the split feature",
    },
    "merge-subtitle": {
      message: "Upgrade to Pro to use the merge feature",
    },
    "split-all": {
      message: "Upgrade to Pro to split all subtitles",
    },
    "custom-styles": {
      message: "Upgrade to Pro to customize subtitle styles",
    },
  };

  const checkProFeature = (featureName: string) => {
    if (isPro) return { allowed: true };

    const feature = proFeatures[featureName as keyof typeof proFeatures];
    if (!feature) return { allowed: true }; // If feature not in list, allow it

    return {
      allowed: false,
      message: feature.message || "This is a Pro feature",
    };
  };

  return (
    <ProContext.Provider value={{ isPro, setIsPro, checkProFeature }}>
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const context = useContext(ProContext);
  if (context === undefined) {
    throw new Error("usePro must be used within a ProProvider");
  }
  return context;
}
