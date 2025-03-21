import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePro } from "@/context/ProContext";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const { isPro, setIsPro } = usePro();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(
    null,
  );
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);

  // Fetch subscription data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchSubscription() {
      try {
        setLoading(true);

        // Try to fetch user data from Supabase
        const { data: userData, error } = await supabase
          .from("users")
          .select("is_pro")
          .eq("firebase_uid", user.uid)
          .single();

        if (error) {
          console.error("Error fetching user subscription data:", error);
          // Fall back to local state if there's an error
        } else if (userData) {
          // Update local state based on Supabase data
          setIsPro(userData.is_pro);
        }

        // Set subscription based on pro status
        if (isPro) {
          setSubscription({
            id: "pro-monthly",
            name: "Pro Plan",
            description: "Full access to all features",
            price: 9.99,
            features: [
              "Unlimited subtitles",
              "Advanced editing tools",
              "Priority support",
              "No watermarks",
            ],
            isActive: true,
          });
        } else {
          setSubscription({
            id: "free",
            name: "Free Plan",
            description: "Basic features",
            price: 0,
            features: [
              "Up to 10 subtitles per project",
              "Basic editing tools",
              "Standard support",
            ],
            isActive: true,
          });
        }

        // Set available plans
        setAvailablePlans([
          {
            id: "free",
            name: "Free Plan",
            description: "Basic features",
            price: 0,
            features: [
              "Up to 10 subtitles per project",
              "Basic editing tools",
              "Standard support",
            ],
            isActive: !isPro,
          },
          {
            id: "pro-monthly",
            name: "Pro Plan",
            description: "Full access to all features",
            price: 9.99,
            features: [
              "Unlimited subtitles",
              "Advanced editing tools",
              "Priority support",
              "No watermarks",
            ],
            isActive: isPro,
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user, isPro]);

  // Function to upgrade to pro
  const upgradeToPro = async () => {
    if (!user) return;

    try {
      // Update user record in Supabase
      const { data, error } = await supabase
        .from("users")
        .update({ is_pro: true, updated_at: new Date().toISOString() })
        .eq("firebase_uid", user.uid)
        .select()
        .single();

      if (error) {
        console.error("Error upgrading to pro in Supabase:", error);
        throw error;
      }

      // Update local state
      setIsPro(true);

      // Update subscription state
      setSubscription({
        id: "pro-monthly",
        name: "Pro Plan",
        description: "Full access to all features",
        price: 9.99,
        features: [
          "Unlimited subtitles",
          "Advanced editing tools",
          "Priority support",
          "No watermarks",
        ],
        isActive: true,
      });

      return true;
    } catch (error) {
      console.error("Error upgrading to pro:", error);
      throw error;
    }
  };

  // Function to downgrade from pro
  const downgradeFromPro = async () => {
    if (!user) return;

    try {
      // Update user record in Supabase
      const { data, error } = await supabase
        .from("users")
        .update({ is_pro: false, updated_at: new Date().toISOString() })
        .eq("firebase_uid", user.uid)
        .select()
        .single();

      if (error) {
        console.error("Error downgrading from pro in Supabase:", error);
        throw error;
      }

      // Update local state
      setIsPro(false);

      // Update subscription state
      setSubscription({
        id: "free",
        name: "Free Plan",
        description: "Basic features",
        price: 0,
        features: [
          "Up to 10 subtitles per project",
          "Basic editing tools",
          "Standard support",
        ],
        isActive: true,
      });

      return true;
    } catch (error) {
      console.error("Error downgrading from pro:", error);
      throw error;
    }
  };

  return {
    loading,
    subscription,
    availablePlans,
    upgradeToPro,
    downgradeFromPro,
  };
}
