import { useState, useEffect } from "react";
import { supabase, checkSupabaseConnection } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export function useSupabase() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const { connected, error } = await checkSupabaseConnection();
        setIsConnected(connected);
        if (error) {
          setError(error as Error);
        }
      } catch (err) {
        setError(err as Error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  // Function to sync user data with Supabase
  const syncUserWithSupabase = async () => {
    if (!user) return null;

    try {
      // Check if user exists in Supabase
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("firebase_uid", user.uid)
        .single();

      // If user doesn't exist in Supabase, create them
      if (error || !userData) {
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert([
            {
              firebase_uid: user.uid,
              email: user.email,
              display_name: user.displayName || user.email?.split("@")[0],
              avatar_url: user.photoURL,
              is_pro: false,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (createError) throw createError;
        return newUser;
      }

      return userData;
    } catch (err) {
      console.error("Error syncing user with Supabase:", err);
      throw err;
    }
  };

  return {
    isConnected,
    isLoading,
    error,
    supabase,
    syncUserWithSupabase,
  };
}
